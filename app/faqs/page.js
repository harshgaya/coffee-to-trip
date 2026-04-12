"use client";

import { useState } from "react";
import Link from "next/link";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const FAQS = [
  {
    category: "Getting Started",
    items: [
      {
        q: "What is CoffeeToTrip?",
        a: "CoffeeToTrip is a curated matchmaking platform for travellers. We match you with compatible people based on your lifestyle, budget, vibe, and travel preferences — and start with a casual coffee meetup before any trip is planned.",
      },
      {
        q: "Is this a travel agency?",
        a: "No. We don't sell tour packages or book trips on your behalf. We connect compatible people — what you do after the match is entirely up to your group.",
      },
      {
        q: "How do I sign up?",
        a: "Click 'Join Now' on the homepage and fill out our 4-step profile form. It takes about 2 minutes. Once submitted, our team will review your profile and reach out on WhatsApp.",
      },
      {
        q: "Is there a fee to join?",
        a: "Signing up is free. Costs for the actual trips are managed between group members directly.",
      },
    ],
  },
  {
    category: "Matching",
    items: [
      {
        q: "How does matching work?",
        a: "Our team manually reviews all profiles and groups people based on city, gender preference, lifestyle (drinking, smoking, food), trip budget, and personality type. There's no automated algorithm — real human judgement goes into every match.",
      },
      {
        q: "How long does it take to get matched?",
        a: "Usually within 5–10 business days. We batch matches when we have a strong group forming in your city. You'll hear from us on WhatsApp.",
      },
      {
        q: "Can I request a specific type of group?",
        a: "Yes — the signup form lets you choose your preference: all-men, all-women, mixed, or couples groups. We do our best to honour this.",
      },
      {
        q: "What if I don't click with my matched group?",
        a: "The coffee meetup is specifically for this. If it doesn't feel right, let us know and we'll try to find a better fit in the next batch.",
      },
    ],
  },
  {
    category: "Safety",
    items: [
      {
        q: "Is it safe to meet strangers from this platform?",
        a: "Safety is our top priority. All meetups start in public places (cafés, restaurants). Profiles are reviewed manually before grouping. For women-only trips, we add extra vetting steps.",
      },
      {
        q: "Do you verify identities?",
        a: "We collect phone numbers and conduct basic manual verification. We may request additional verification for co-sponsor or sponsored participation types.",
      },
      {
        q: "What if someone behaves inappropriately?",
        a: "Report immediately via WhatsApp to our team. We take this seriously — offending members are permanently removed and blocked from the platform.",
      },
    ],
  },
  {
    category: "Trips",
    items: [
      {
        q: "Who plans the actual trip?",
        a: "The group decides together. Once matched and post-coffee meetup, it's up to the group to pick a destination, dates, and budget. We may share resources and suggestions.",
      },
      {
        q: "What types of trips happen on CoffeeToTrip?",
        a: "Everything from local day trips and weekend getaways to domestic and international travel. It depends on what your group agrees on.",
      },
      {
        q: "What does 'co-sponsor' mean?",
        a: "It means two people split the cost of a trip slot — typically one person funds the other in exchange for companionship on the trip. Both parties must agree upfront.",
      },
      {
        q: "What does 'sponsored' mean?",
        a: "You're open to having someone else fund your trip in full. We'll show your profile to potential sponsors who've opted into this. You write a note explaining why you'd be a great travel companion.",
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
