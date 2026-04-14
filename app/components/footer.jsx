import Link from "next/link";
import { MdOutlineCoffee } from "react-icons/md";
import { FiInstagram, FiTwitter } from "react-icons/fi";
import { BsWhatsapp } from "react-icons/bs";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-coffee-100 mt-16">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MdOutlineCoffee className="text-coffee-600 text-xl" />
              <span className="font-bold text-coffee-800">CoffeeToTrips</span>
            </div>
            <p className="text-xs text-coffee-500 leading-relaxed">
              A curated community where travel-loving strangers become lifelong
              friends. Coffee first. Trips next.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="#"
                className="text-coffee-400 hover:text-coffee-700 transition-colors"
              >
                <FiInstagram size={16} />
              </a>
              <a
                href="#"
                className="text-coffee-400 hover:text-coffee-700 transition-colors"
              >
                <FiTwitter size={16} />
              </a>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coffee-400 hover:text-green-600 transition-colors"
              >
                <BsWhatsapp size={16} />
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-coffee-700 uppercase tracking-wider mb-3">
              Company
            </p>
            <ul className="space-y-2">
              {[
                { label: "About Us", href: "/about" },
                { label: "FAQs", href: "/faqs" },
                { label: "Terms & Policies", href: "/terms" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-xs text-coffee-500 hover:text-coffee-800 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold text-coffee-700 uppercase tracking-wider mb-3">
              Ready to join?
            </p>
            <p className="text-xs text-coffee-500 mb-3 leading-relaxed">
              Sign up in 2 minutes. We'll match you with the right crew.
            </p>
            <Link
              href="/"
              className="inline-block bg-coffee-600 hover:bg-coffee-700 text-white text-xs px-4 py-2.5 rounded-lg transition-colors font-semibold"
            >
              ☕ Book My Slot
            </Link>
          </div>
        </div>

        <div className="border-t border-coffee-100 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-coffee-400">
            © {new Date().getFullYear()} CoffeeToTrips. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/terms"
              className="text-xs text-coffee-400 hover:text-coffee-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-coffee-400 hover:text-coffee-600 transition-colors"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
