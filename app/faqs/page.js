"use client";

import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const FAQS = [
  {
    category: "About CoffeeToTrips",
    items: [
      {
        q: "What is CoffeeToTrips?",
        a: "CoffeeToTrips is a curated experience where you meet new people over coffee in small groups. If the group connects well, you can plan a trip together.",
      },
      {
        q: "Is this a dating platform?",
        a: "No. This is a curated social experience focused on meeting new people and exploring travel opportunities.",
      },
      {
        q: "How does CoffeeToTrips work?",
        a: "You book a slot → we match you with a group of people → you meet at a café → if it clicks, you may plan a trip together.",
      },
      {
        q: "Who is this experience for?",
        a: "Anyone who wants to meet new people, expand their social circle, and explore travel opportunities in a safe, curated way.",
      },
    ],
  },
  {
    category: "The Experience",
    items: [
      {
        q: "Is the trip included in the booking?",
        a: "No. This booking is only for the coffee meetup. Any trip happens later based on group compatibility.",
      },
      {
        q: "How many people are in a group?",
        a: "Each group is limited to a maximum of 20 people to ensure comfort and meaningful interactions.",
      },
      {
        q: "Can I choose who I meet?",
        a: "No direct selection. We curate groups to ensure balanced and meaningful interactions.",
      },
      {
        q: "What happens after booking?",
        a: "You'll receive confirmation and details. Final café location is shared before the meetup.",
      },
      {
        q: "When will I get group details?",
        a: "Details are shared closer to the meetup time (usually within 6–12 hours).",
      },
      {
        q: "Can I bring a friend?",
        a: 'Only if you select the "couple" option and register together.',
      },
      {
        q: "Do I have to go on a trip after the meetup?",
        a: "No. Travel is completely optional and depends on group comfort.",
      },
      {
        q: "What if I don't connect with the group?",
        a: "That's okay. The experience ends with the coffee meetup.",
      },
    ],
  },
  {
    category: "Safety & Matching",
    items: [
      {
        q: "Is it safe to meet strangers?",
        a: "Yes. All meetups happen in public cafés, and groups are manually curated for compatibility.",
      },
      {
        q: "How are groups selected?",
        a: "We match people based on preferences like lifestyle, personality, and travel intent.",
      },
    ],
  },
  {
    category: "Pricing & Booking",
    items: [
      {
        q: "What is included in the price?",
        a: "₹1,000 is redeemable at the café for food & beverages. The rest covers curation, hosting, and experience design.",
      },
      {
        q: "Why are prices different for men and women?",
        a: "Pricing is structured to maintain balanced group dynamics and participation.",
      },
      {
        q: "Is the booking refundable?",
        a: "No. All bookings are non-refundable.",
      },
      {
        q: "Can I reschedule my booking?",
        a: "Rescheduling may be considered based on availability, but is not guaranteed.",
      },
    ],
  },
  {
    category: "Sponsorship",
    items: [
      {
        q: "What is sponsorship?",
        a: "You can choose to sponsor someone or opt to be sponsored. This is optional and managed by the platform.",
      },
      {
        q: "Are there any expectations in sponsorship?",
        a: "No. Sponsorship has no expectations or obligations.",
      },
    ],
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-coffee-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-4 text-left group"
      >
        <span className="text-sm font-semibold text-charcoal group-hover:text-coffee-700 transition-colors">
          {q}
        </span>
        {open ? (
          <FiChevronUp className="text-coffee-500 shrink-0 mt-0.5" />
        ) : (
          <FiChevronDown className="text-coffee-400 shrink-0 mt-0.5" />
        )}
      </button>
      {open && (
        <p className="text-sm text-coffee-600 leading-relaxed pb-4 pr-6">{a}</p>
      )}
    </div>
  );
}

export default function FAQsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <p className="text-3xl mb-3">🙋</p>
        <h1 className="text-3xl font-bold text-charcoal mb-2">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-coffee-500">
          Everything you need to know before signing up.
        </p>
      </div>

      <div className="space-y-6">
        {FAQS.map((section) => (
          <div
            key={section.category}
            className="bg-white border border-coffee-100 rounded-2xl px-5 shadow-sm"
          >
            <p className="text-xs font-bold text-coffee-600 uppercase tracking-wider pt-5 pb-2">
              {section.category}
            </p>
            {section.items.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-10 text-center bg-coffee-50 border border-coffee-200 rounded-2xl p-6">
        <p className="text-sm font-semibold text-charcoal mb-1">
          Still have questions?
        </p>
        <p className="text-xs text-coffee-500 mb-4">
          Reach out to us directly on WhatsApp. We usually reply within a few
          hours.
        </p>
        <a
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          💬 Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}
