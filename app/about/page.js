import Link from "next/link";

export const metadata = {
  title: "About — CoffeeToTrip",
};

const steps = [
  {
    emoji: "📋",
    title: "Sign Up",
    desc: "Fill out your travel profile — lifestyle, vibe, preferences, budget. Takes 2 minutes.",
  },
  {
    emoji: "☕",
    title: "Coffee Meetup",
    desc: "We match you with compatible people nearby. First step is always a casual coffee meetup.",
  },
  {
    emoji: "🤝",
    title: "Build Your Crew",
    desc: "Vibe with your matched group. If it clicks — you plan a trip together.",
  },
  {
    emoji: "✈️",
    title: "Go on a Trip",
    desc: "Your crew. Your dates. Your budget. We help facilitate. You do the living.",
  },
];

const values = [
  {
    emoji: "🔍",
    title: "Curated, Not Random",
    desc: "Every match is reviewed manually. No algorithm dumps. Real compatibility first.",
  },
  {
    emoji: "🔒",
    title: "Safe & Vetted",
    desc: "Profiles are verified before grouping. We take safety seriously, especially for solo women travellers.",
  },
  {
    emoji: "💬",
    title: "Community First",
    desc: "This isn't a travel agency. It's a community of people who love to explore together.",
  },
  {
    emoji: "🎯",
    title: "No Fluff",
    desc: "No forced itineraries. No package tours. Just the right people and a destination.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-14">
        <p className="text-4xl mb-4">☕✈️</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-charcoal mb-4 leading-tight">
          Travel is better with
          <br />
          the right people.
        </h1>
        <p className="text-coffee-600 text-base max-w-xl mx-auto leading-relaxed">
          CoffeeToTrip is a curated platform that connects compatible travel
          enthusiasts — starting with a simple coffee meetup and ending up on a
          trip together.
        </p>
      </div>

      {/* Story */}
      <div className="bg-white border border-coffee-100 rounded-2xl p-6 sm:p-8 mb-10 shadow-sm">
        <h2 className="text-lg font-bold text-charcoal mb-3">
          Why we built this
        </h2>
        <div className="space-y-3 text-sm text-coffee-700 leading-relaxed">
          <p>
            Most travel apps are either booking platforms or social networks.
            Neither solves the real problem:{" "}
            <strong>finding the right travel companion.</strong>
          </p>
          <p>
            We've all been there — a trip you want to take, but no one in your
            circle is free, interested, or compatible. You either go alone or
            skip it.
          </p>
          <p>
            CoffeeToTrip fixes that. We manually match you with people who share
            your travel style, budget, lifestyle preferences, and vibe — then
            start small with a coffee meetup before any trip is planned.
          </p>
          <p>
            <strong>No random strangers. No apps. No algorithm.</strong> Just
            curated humans, put in the same room, to see if the chemistry works.
          </p>
        </div>
      </div>

      {/* How it Works */}
      <h2 className="text-xl font-bold text-charcoal mb-5">How it works</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {steps.map((s, i) => (
          <div
            key={i}
            className="bg-white border border-coffee-100 rounded-2xl p-5 shadow-sm flex items-start gap-4"
          >
            <div className="w-10 h-10 bg-coffee-50 rounded-xl flex items-center justify-center text-xl shrink-0">
              {s.emoji}
            </div>
            <div>
              <p className="font-semibold text-charcoal text-sm mb-1">
                {s.title}
              </p>
              <p className="text-xs text-coffee-600 leading-relaxed">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Values */}
      <h2 className="text-xl font-bold text-charcoal mb-5">
        What we stand for
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {values.map((v, i) => (
          <div
            key={i}
            className="bg-white border border-coffee-100 rounded-2xl p-5 shadow-sm flex items-start gap-4"
          >
            <span className="text-2xl shrink-0">{v.emoji}</span>
            <div>
              <p className="font-semibold text-charcoal text-sm mb-1">
                {v.title}
              </p>
              <p className="text-xs text-coffee-600 leading-relaxed">
                {v.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-coffee-600 rounded-2xl p-8 text-center text-white">
        <p className="text-xl font-bold mb-2">Ready to find your crew?</p>
        <p className="text-coffee-200 text-sm mb-5">
          Sign up takes 2 minutes. Coffee meetup could change everything.
        </p>
        <Link
          href="/"
          className="inline-block bg-white text-coffee-700 font-bold px-6 py-3 rounded-xl hover:bg-coffee-50 transition-colors text-sm"
        >
          ☕ Book My Slot
        </Link>
      </div>
    </div>
  );
}
