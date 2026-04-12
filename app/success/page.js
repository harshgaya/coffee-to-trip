import Link from "next/link";
import { MdOutlineCoffee } from "react-icons/md";

export const metadata = {
  title: "You're in! — CoffeeToTrip",
};

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md w-full">
        {/* Icon */}
        <div className="w-20 h-20 bg-coffee-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl">
          ☕
        </div>

        <h1 className="text-3xl font-bold text-charcoal mb-3">
          You're on the list!
        </h1>

        <p className="text-coffee-600 text-base mb-2">
          Thanks for signing up with <strong>CoffeeToTrip</strong>.
        </p>

        <p className="text-coffee-500 text-sm mb-8 leading-relaxed">
          We'll review your profile and reach out on WhatsApp once we have a
          compatible group for you. Coffee first. Trip next. 🚀
        </p>

        {/* What happens next */}
        <div className="bg-white border border-coffee-100 rounded-2xl p-5 text-left mb-6 shadow-sm">
          <p className="text-xs font-bold text-coffee-700 uppercase tracking-wider mb-3">
            What happens next
          </p>
          <div className="space-y-3">
            {[
              { step: "1", text: "We review your profile & preferences" },
              { step: "2", text: "We match you with compatible travellers" },
              { step: "3", text: "You get a WhatsApp intro from us" },
              { step: "4", text: "Coffee meetup → Group trip planning" },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-coffee-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {item.step}
                </div>
                <p className="text-sm text-charcoal">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-coffee-600 hover:text-coffee-800 font-medium transition-colors"
        >
          <MdOutlineCoffee />
          Refer a friend →
        </Link>
      </div>
    </div>
  );
}
