import { getDb } from "@/lib/mongodb";
import { getRazorpay } from "@/lib/razorpay";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const draftId = searchParams.get("draftId");

    if (!draftId) {
      return Response.json(
        { success: false, error: "draftId required" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const payments = db.collection("payments");
    const payment = await payments.findOne({ draftId });

    if (!payment) return Response.json({ success: true, status: "NONE" });

    if (payment.status === "PAID") {
      return Response.json({
        success: true,
        status: "PAID",
        paymentId: payment.razorpayPaymentId,
      });
    }
    if (payment.status === "FAILED") {
      return Response.json({
        success: true,
        status: "FAILED",
        reason: payment.failureReason,
      });
    }

    // Reconcile: if PENDING too long, ask Razorpay directly
    const ageMs = Date.now() - new Date(payment.updatedAt).getTime();
    if (payment.status === "PENDING" && ageMs > 15_000) {
      try {
        const rzp = getRazorpay();
        const rzpOrder = await rzp.orders.fetch(payment.razorpayOrderId);

        if (rzpOrder.status === "paid") {
          const rzpPayments = await rzp.orders.fetchPayments(
            payment.razorpayOrderId,
          );
          const captured = rzpPayments.items.find(
            (p) => p.status === "captured",
          );

          if (captured) {
            const result = await payments.findOneAndUpdate(
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
                },
              },
              { returnDocument: "after" },
            );

            // Insert signup (idempotent)
            const signups = db.collection("signups");
            const existing = await signups.findOne({ draftId });
            let signupId;
            if (existing) {
              signupId = existing._id;
            } else {
              const snap = payment.formSnapshot || {};
              const ins = await signups.insertOne({
                ...snap,
                age: snap.age ? parseInt(snap.age) : null,
                draftId,
                paymentId: captured.id,
                orderId: payment.razorpayOrderId,
                amountPaid: payment.amount,
                paidAt: new Date(),
                createdAt: new Date(),
              });
              signupId = ins.insertedId;
            }

            await payments.updateOne(
              { _id: payment._id },
              { $set: { signupId } },
            );

            try {
              await db.collection("drafts").deleteOne({ draftId });
            } catch {}

            return Response.json({
              success: true,
              status: "PAID",
              paymentId: captured.id,
              reconciled: true,
            });
          }
        }
      } catch (e) {
        console.error("reconcile error:", e);
      }
    }

    return Response.json({ success: true, status: payment.status });
  } catch (error) {
    console.error("status error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
