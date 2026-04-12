# ☕ CoffeeToTrip

> Sign up → Get matched → Coffee meetup → Trip

Built with **Next.js 15 (App Router)** · **Tailwind CSS** · **React Icons** · **MongoDB (native driver)**

---

## 🚀 Getting Started

```bash
npm install
cp .env.example .env.local
# → fill in your MONGODB_URI
npm run dev
```

---

## 📁 Project Structure

```
/app
  page.js                  ← Public signup form (/)
  /success/page.js         ← Thank-you page (/success)
  /admin/page.js           ← Admin dashboard (/admin)
  /api/signup/route.js     ← POST: save signup
  /api/users/route.js      ← GET: list users | DELETE: remove user
  /components/
    SignupForm.jsx          ← 4-step public form
    AdminDashboard.jsx      ← Full admin table + filters
/lib
  mongodb.js               ← Centralised MongoDB connection (singleton)
```

---

## 🗂️ Pages

| URL        | What it is                            |
|------------|---------------------------------------|
| `/`        | Public signup form (4 steps)          |
| `/success` | Post-signup thank-you page            |
| `/admin`   | Admin table — all signups + filters   |

---

## ⚙️ Environment Variables

```env
MONGODB_URI=mongodb+srv://...
MONGODB_DB=coffeetotrip
```

---

## 🛠️ Admin Features

- 📊 Stats bar (total, trip-ready, male, female)
- 🔍 Live search (name, city, phone)
- 🎛️ Filters: gender, trip intent, group preference
- ↕️ Column sorting (click any header)
- 👁️ Side drawer: full profile view per user
- 🟢 WhatsApp link per user (direct from table + drawer)
- 🗑️ Delete with confirmation modal
- 📥 Export to CSV

---

## 🔐 Adding Admin Password (Optional)

Use Next.js Middleware to protect `/admin`:

```js
// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const pass = req.cookies.get("admin_pass")?.value;
  if (req.nextUrl.pathname.startsWith("/admin") && pass !== process.env.ADMIN_PASS) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
}
```

---

## 📦 Deploy to Vercel

```bash
vercel --prod
# Set MONGODB_URI and MONGODB_DB in Vercel env vars
```
