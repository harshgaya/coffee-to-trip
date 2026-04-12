import Link from "next/link";
import { MdOutlineCoffee } from "react-icons/md";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-coffee-100 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <MdOutlineCoffee className="text-coffee-600 text-2xl" />
          <span className="font-bold text-coffee-800 text-base">
            CoffeeToTrip
          </span>
        </Link>
        <div className="flex items-center gap-5 text-sm font-medium text-coffee-700">
          <Link
            href="/about"
            className="hover:text-coffee-900 transition-colors"
          >
            About
          </Link>
          <Link
            href="/faqs"
            className="hover:text-coffee-900 transition-colors"
          >
            FAQs
          </Link>
          <Link
            href="/terms"
            className="hover:text-coffee-900 transition-colors hidden sm:block"
          >
            Terms
          </Link>
          <Link
            href="/"
            className="bg-coffee-600 hover:bg-coffee-700 text-white text-xs px-4 py-2 rounded-lg transition-colors font-semibold"
          >
            Join Now
          </Link>
        </div>
      </div>
    </nav>
  );
}
