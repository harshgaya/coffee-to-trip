import { cookies } from "next/headers";

// ← Change these
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "coffee2025";

export async function POST(req) {
  const { username, password } = await req.json();

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("admin_auth", "coffeetotrip_secure_2025", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return Response.json({ success: true });
  }

  return Response.json({ success: false }, { status: 401 });
}
