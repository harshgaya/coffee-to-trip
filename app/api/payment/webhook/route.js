import { getDb } from "@/lib/mongodb";
import { verifyWebhookSignature } from "@/lib/razorpay";

export async function POST(req) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature || !verifyWebhookSignature(rawBody, signature)) {
      return Response.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const db = await getDb();
    const payments = db.collection("payments");
    const signups = db.collection("signups");

    const paymentEntity = event.payload?.payment?.entity;
    const orderEntity = event.payload?.order?.entity;
    const orderId = paymentEntity?.order_id || orderEntity?.id;

    if (!orderId) return Response.json({ received: true });

    const payment = await payments.findOne({ razorpayOrderId: orderId });
    if (!payment) return Response.json({ received: true });

    // PAID event
    if (event.event === "payment.captured" || event.event === "order.paid") {
      // Idempotent: if already paid and signup exists, noop
      if (payment.status === "PAID" && payment.signupId) {
        return Response.json({ received: true });
      }

      // Atomic transition — only one webhook wins
      const result = await payments.findOneAndUpdate(
        {
          _id: payment._id,
          status: { $in: ["CREATED", "ATTEMPTED", "PENDING"] },
        },
        {
          $set: {
            status: "PAID",
            razorpayPaymentId: paymentEntity?.id || payment.razorpayPaymentId,
            webhookReceivedAt: new Date(),
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" },
      );

      // Even if transition didn't happen (already PAID), ensure signup exists
      const existingSignup = await signups.findOne({
        draftId: payment.draftId,
      });

      let signupId;
      if (existingSignup) {
        signupId = existingSignup._id;
      } else {
        const snap = payment.formSnapshot || {};
        const ins = await signups.insertOne({
          ...snap,
          age: snap.age ? parseInt(snap.age) : null,
          draftId: payment.draftId,
          paymentId: paymentEntity?.id || payment.razorpayPaymentId,
          orderId: payment.razorpayOrderId,
          amountPaid: payment.amount,
          paidAt: new Date(),
          createdAt: new Date(),
        });
        signupId = ins.insertedId;
      }

      await payments.updateOne({ _id: payment._id }, { $set: { signupId } });

      // Clean up draft
      try {
        await db.collection("drafts").deleteOne({ draftId: payment.draftId });
      } catch {}

      return Response.json({ received: true, status: "paid" });
    }

    // FAILED event
    if (event.event === "payment.failed") {
      await payments.updateOne(
        {
          _id: payment._id,
          status: { $nin: ["PAID"] },
        },
        {
          $set: {
            status: "FAILED",
            razorpayPaymentId: paymentEntity?.id || null,
            failureReason: paymentEntity?.error_description || "Payment failed",
            failureCode: paymentEntity?.error_code || null,
            webhookReceivedAt: new Date(),
            updatedAt: new Date(),
          },
        },
      );
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("webhook error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
