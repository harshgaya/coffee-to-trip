import { getDb } from "@/lib/mongodb";
import { verifySignature } from "@/lib/razorpay";

export async function POST(req) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return Response.json(
        { success: false, error: "Missing fields" },
        { status: 400 },
      );
    }

    if (
      !verifySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      )
    ) {
      return Response.json(
        { success: false, error: "Invalid signature" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const payments = db.collection("payments");
    const payment = await payments.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!payment) {
      return Response.json(
        { success: false, error: "Order not found" },
        { status: 404 },
      );
    }

    // Webhook already finalized — don't downgrade
    if (payment.status === "PAID") {
      return Response.json({ success: true, status: "PAID" });
    }

    await payments.updateOne(
      { _id: payment._id },
      {
        $set: {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: "PENDING",
          updatedAt: new Date(),
        },
      },
    );

    return Response.json({ success: true, status: "PENDING" });
  } catch (error) {
    console.error("verify error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
