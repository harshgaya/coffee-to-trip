import Razorpay from "razorpay";
import crypto from "crypto";

let instance = null;

export function getRazorpay() {
  if (!instance) {
    instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return instance;
}

export function verifySignature(orderId, paymentId, signature) {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return expected === signature;
}

export function verifyWebhookSignature(body, signature) {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");
  return expected === signature;
}

// Server-side fee calculation — never trust client amount
export function computeAmount(formData) {
  const baseFee = formData.gender === "Female" ? 2999 : 3999;
  let partnerFee = 0;
  if (
    formData.groupPreference === "couples" &&
    formData.payingForBoth &&
    formData.couplePartnerGender
  ) {
    partnerFee = formData.couplePartnerGender === "Female" ? 2999 : 3999;
  }
  return (baseFee + partnerFee) * 100; // paise
}
