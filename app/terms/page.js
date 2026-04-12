import Link from "next/link";

export const metadata = {
  title: "Terms & Policies — CoffeeToTrip",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: `By signing up on CoffeeToTrip, you confirm that you are at least 18 years old and agree to these Terms & Policies in full. If you do not agree, please do not use this platform. We reserve the right to update these terms at any time. Continued use of the platform constitutes acceptance of revised terms.`,
  },
  {
    title: "2. Who We Are",
    body: `CoffeeToTrip is a curated social platform that facilitates connections between travel-minded individuals. We are not a travel agency, tour operator, or booking platform. We do not sell travel packages, issue tickets, or make reservations on behalf of users.`,
  },
  {
    title: "3. Eligibility",
    body: `You must be 18 years or older to register. By submitting the signup form, you confirm the accuracy of all information provided. Providing false information may result in immediate removal from the platform without notice.`,
  },
  {
    title: "4. User Conduct",
    body: `All users are expected to treat fellow members with respect during meetups and group trips. Harassment, discrimination, unsolicited contact, or any form of abusive behaviour will result in immediate and permanent removal. CoffeeToTrip reserves the right to remove any user at its sole discretion.`,
  },
  {
    title: "5. Safety & Liability",
    body: `CoffeeToTrip facilitates introductions between members but is not responsible for any incidents, losses, injuries, or damages that occur during meetups or trips arranged through the platform. All meetups and travel are undertaken at your own risk. Users are responsible for their own travel insurance, safety arrangements, and personal decisions.`,
  },
  {
    title: "6. Sponsorship & Co-Sponsorship",
    body: `The sponsored and co-sponsor participation types are voluntary arrangements between individual users. CoffeeToTrip does not mediate, guarantee, or enforce any financial agreements between users. Any financial disputes are strictly between the parties involved and CoffeeToTrip holds no liability.`,
  },
  {
    title: "7. Privacy & Data",
    body: `We collect your name, phone number, city, and profile preferences solely for the purpose of group matching. Your data is never sold to third parties. We may contact you via WhatsApp with match updates, event information, or community announcements. You may opt out at any time by messaging our team. Data is stored securely and retained only as long as your profile is active.`,
  },
  {
    title: "8. WhatsApp Communication",
    body: `By signing up, you consent to being contacted via WhatsApp on the phone number you provide. This includes match notifications, group introductions, and platform updates. You can request removal from all communications at any time.`,
  },
  {
    title: "9. Intellectual Property",
    body: `All content on the CoffeeToTrip platform — including the name, logo, design, and copy — is the intellectual property of CoffeeToTrip. You may not reproduce, distribute, or use our brand assets without written permission.`,
  },
  {
    title: "10. Termination",
    body: `CoffeeToTrip may suspend or permanently remove any user account at its discretion, particularly in cases of misconduct, fraudulent information, or violation of these terms. Users may also request deletion of their profile and data at any time by contacting our team on WhatsApp.`,
  },
  {
    title: "11. Governing Law",
    body: `These terms are governed by the laws of India. Any disputes arising out of the use of this platform shall be subject to the jurisdiction of the courts of India.`,
  },
];

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <p className="text-3xl mb-3">📄</p>
        <h1 className="text-3xl font-bold text-charcoal mb-2">
          Terms & Policies
        </h1>
        <p className="text-sm text-coffee-400">Last updated: June 2025</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Plain English summary:</strong> Be respectful, be honest, and
          be safe. We match you with people — what happens after that is between
          you and your group. We're not liable for trips, finances, or personal
          disputes between users.
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((s) => (
          <div
            key={s.title}
            className="bg-white border border-coffee-100 rounded-2xl p-5 sm:p-6 shadow-sm"
          >
            <h2 className="text-sm font-bold text-charcoal mb-2">{s.title}</h2>
            <p className="text-sm text-coffee-600 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-xs text-coffee-500 mb-4">
          Questions about our policies? We're happy to clarify.
        </p>
        <a
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-coffee-600 hover:bg-coffee-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          Contact
          Us
        ></a>
      </div>
    </div>
  );
}
