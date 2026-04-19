import { getDb } from "@/lib/mongodb";
import { getRazorpay } from "@/lib/razorpay";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    const db = await getDb();
    const payments = db.collection("payments");

    const query = {};
    if (status) query.status = status;
    if (search) {
      const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query.$or = [
        { "formSnapshot.firstName": rx },
        { "formSnapshot.lastName": rx },
        { "formSnapshot.phone": rx },
        { "formSnapshot.city": rx },
        { razorpayOrderId: rx },
        { razorpayPaymentId: rx },
      ];
    }

    const data = await payments
      .find(query)
      .sort({ createdAt: -1 })
      .limit(500)
      .toArray();

    return Response.json({ success: true, data });
  } catch (error) {
    console.error("payments list error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// Reconcile a specific payment with Razorpay (for stuck PENDING records)
export async function POST(req) {
  try {
    const { paymentId } = await req.json();
    if (!paymentId) {
      return Response.json(
        { success: false, error: "paymentId required" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const payments = db.collection("payments");
    const payment = await payments.findOne({ _id: new ObjectId(paymentId) });

    if (!payment) {
      return Response.json(
        { success: false, error: "Not found" },
        { status: 404 },
      );
    }

    if (payment.status === "PAID") {
      return Response.json({
        success: true,
        status: "PAID",
        message: "Already paid",
      });
    }

    const rzp = getRazorpay();
    const rzpOrder = await rzp.orders.fetch(payment.razorpayOrderId);

    if (rzpOrder.status === "paid") {
      const rzpPayments = await rzp.orders.fetchPayments(
        payment.razorpayOrderId,
      );
      const captured = rzpPayments.items.find((p) => p.status === "captured");

      if (captured) {
        await payments.findOneAndUpdate(
          {
            _id: payment._id,
            status: { $in: ["CREATED", "ATTEMPTED", "PENDING"] },
          },
          {
            $set: {
              status: "PAID",
              razorpayPaymentId: captured.id,
              webhookReceivedAt: new Date(),
              updatedAt: new Date(),
              reconciledManually: true,
            },
          },
        );

        // Insert signup if missing
        const signups = db.collection("signups");
        const existing = await signups.findOne({ draftId: payment.draftId });
        if (!existing) {
          const snap = payment.formSnapshot || {};
          const ins = await signups.insertOne({
            ...snap,
            age: snap.age ? parseInt(snap.age) : null,
            draftId: payment.draftId,
            paymentId: captured.id,
            orderId: payment.razorpayOrderId,
            amountPaid: payment.amount,
            paidAt: new Date(),
            createdAt: new Date(),
          });
          await payments.updateOne(
            { _id: payment._id },
            { $set: { signupId: ins.insertedId } },
          );
        }

        try {
          await db.collection("drafts").deleteOne({ draftId: payment.draftId });
        } catch {}

        return Response.json({
          success: true,
          status: "PAID",
          reconciled: true,
        });
      }
    }

    return Response.json({
      success: true,
      status: payment.status,
      rzpStatus: rzpOrder.status,
    });
  } catch (error) {
    console.error("reconcile error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
