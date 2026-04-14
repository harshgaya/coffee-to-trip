import Link from "next/link";

export const metadata = {
  title: "Terms & Policies — CoffeeToTrips",
};

const sections = [
  {
    title: "1. Booking & Payment",
    body: `All bookings must be made in advance through the platform. The experience fee is ₹3,999 for men and ₹2,999 for women. ₹1,000 is redeemable at the café for food & beverages. The remaining amount covers platform curation, hosting, and experience management.`,
  },
  {
    title: "2. No Refund Policy",
    body: `All bookings are strictly non-refundable under any circumstances. Once a slot is booked, it cannot be cancelled for a refund.`,
  },
  {
    title: "3. Platform Cancellation Rights",
    body: `CoffeeToTrips reserves the right to cancel or decline any booking at its discretion, including after payment. In such cases, a 100% refund will be issued to the original payment method. This may occur due to safety concerns, group balance, operational reasons, or internal curation decisions. No additional explanation is required for such decisions.`,
  },
  {
    title: "4. Rescheduling",
    body: `Rescheduling may be considered only at the platform's discretion. There is no guarantee of rescheduling or slot availability.`,
  },
  {
    title: "5. Experience Scope",
    body: `This booking is only for the coffee meetup experience. No trip is included in this booking. Any travel plans are optional and may happen later based on group compatibility.`,
  },
  {
    title: "6. Conduct & Behaviour",
    body: `Participants must behave respectfully toward others at all times. Dominating, inappropriate, or uncomfortable behaviour is strictly prohibited. Participants must arrive sober. Anyone under the influence of alcohol or substances will not be allowed to participate. CoffeeToTrips reserves the right to remove participants for misconduct without refund.`,
  },
  {
    title: "7. Group Curation",
    body: `All groups are manually curated by the CoffeeToTrips team. Group composition is based on preferences, compatibility, and availability. Exact matches or expectations are not guaranteed.`,
  },
  {
    title: "8. Sponsorship",
    body: `Sponsorship is managed by the platform. Selection is based on internal curation and availability. Sponsorship does not create any obligation or expectation between participants.`,
  },
  {
    title: "9. Coffee Experience Scheduling",
    body: `CoffeeToTrips does not operate on fixed public dates. The date and time of your coffee experience will be finalised based on group curation, availability, and balanced participation. You will be informed of your confirmed slot 2–3 days in advance via WhatsApp or phone. Scheduling depends on the number of signups, group compatibility, gender balance, and overall experience quality. By booking, you agree to flexible scheduling and understand that exact dates are not pre-fixed. Your booking remains valid and will be assigned to the next suitable curated group.`,
  },
  {
    title: "10. Important Clarification on Scheduling",
    body: `CoffeeToTrips prioritises quality over fixed scheduling. Delays may occur to ensure a well-balanced and comfortable group experience. No cancellations or refunds apply due to scheduling timelines.`,
  },
  {
    title: "11. Liability",
    body: `CoffeeToTrips facilitates social experiences only. Any interactions or travel decisions after the meetup are at the participants' own discretion and responsibility. CoffeeToTrips is not liable for any incidents, losses, injuries, or damages that occur during or after the meetup.`,
  },
  {
    title: "12. Agreement",
    body: `By booking, you agree to all the above terms and understand the nature of the experience. Continued use of the platform constitutes acceptance of these terms, which may be updated at any time.`,
  },
];

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <p className="text-3xl mb-3">📄</p>
        <h1 className="text-3xl font-bold text-stone-800 mb-2">
          Terms & Policies
        </h1>
        <p className="text-sm text-stone-500">Last updated: June 2025</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Plain English summary:</strong> Be respectful, arrive sober,
          and understand this is a coffee meetup — not a trip. Bookings are
          non-refundable, but if we cancel for any reason, you get a full
          refund. Exact dates are not pre-fixed — we'll confirm your slot 2–3
          days before via WhatsApp.
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((s) => (
          <div
            key={s.title}
            className="bg-white border border-coffee-100 rounded-2xl p-5 sm:p-6 shadow-sm"
          >
            <h2 className="text-sm font-bold text-stone-800 mb-2">{s.title}</h2>
            <p className="text-sm text-stone-600 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-xs text-stone-500 mb-4">
          Questions about our policies? We're happy to clarify.
        </p>
        <a
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-coffee-600 hover:bg-coffee-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
}
