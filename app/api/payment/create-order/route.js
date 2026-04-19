import { getDb } from "@/lib/mongodb";
import { getRazorpay, computeAmount } from "@/lib/razorpay";

export async function POST(req) {
  try {
    const body = await req.json();
    const { draftId, formData } = body;

    if (
      !draftId ||
      !formData?.firstName ||
      !formData?.phone ||
      !formData?.gender
    ) {
      return Response.json(
        { success: false, error: "Required fields missing" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const payments = db.collection("payments");
    const amount = computeAmount(formData);
    const rzp = getRazorpay();

    // Check existing payment for this draft
    const existing = await payments.findOne({ draftId });

    if (existing) {
      // Already paid
      if (existing.status === "PAID") {
        return Response.json({
          success: true,
          alreadyPaid: true,
          paymentId: existing.razorpayPaymentId,
        });
      }

      // Pending confirmation
      if (existing.status === "PENDING") {
        return Response.json({
          success: true,
          pending: true,
          orderId: existing.razorpayOrderId,
        });
      }

      // Reuse order if amount unchanged and still valid
      if (
        ["CREATED", "ATTEMPTED"].includes(existing.status) &&
        existing.amount === amount
      ) {
        try {
          const rzpOrder = await rzp.orders.fetch(existing.razorpayOrderId);
          if (rzpOrder.status !== "paid") {
            await payments.updateOne(
              { _id: existing._id },
              {
                $set: { formSnapshot: formData, updatedAt: new Date() },
                $inc: { attemptCount: 1 },
              },
            );
            return Response.json({
              success: true,
              orderId: existing.razorpayOrderId,
              amount: existing.amount,
              currency: existing.currency,
              keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            });
          }
        } catch {
          // expired → create new
        }
      }
    }

    // Create new Razorpay order
    const receipt = `ctt_${draftId.slice(-12)}_${Date.now()}`.slice(0, 40);
    const rzpOrder = await rzp.orders.create({
      amount,
      currency: "INR",
      receipt,
      payment_capture: 1,
      notes: {
        draftId,
        firstName: formData.firstName,
        phone: formData.phone,
      },
    });

    const now = new Date();
    await payments.updateOne(
      { draftId },
      {
        $set: {
          draftId,
          razorpayOrderId: rzpOrder.id,
          amount,
          currency: "INR",
          receipt,
          status: "CREATED",
          formSnapshot: formData,
          failureReason: null,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now, attemptCount: 0 },
      },
      { upsert: true },
    );

    return Response.json({
      success: true,
      orderId: rzpOrder.id,
      amount,
      currency: "INR",
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("create-order error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
