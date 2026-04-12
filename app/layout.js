import "./globals.css";

export const metadata = {
  title: "CoffeeToTrips — Find Your Travel Crew",
  description:
    "Sign up to get matched with compatible travel companions. Start with coffee, end up on a trip.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-cream text-charcoal antialiased">{children}</body>
    </html>
  );
}
