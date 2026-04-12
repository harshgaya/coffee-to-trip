"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdOutlineCoffee } from "react-icons/md";
import { FiEye, FiEyeOff, FiLoader } from "react-icons/fi";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Invalid username or password.");
    }

    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-coffee-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <MdOutlineCoffee className="text-coffee-600 text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-charcoal">Admin Login</h1>
          <p className="text-sm text-coffee-500 mt-1">
            CoffeeToTrip · Restricted Access
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-coffee-100 rounded-2xl shadow-sm p-6 space-y-4">
          {/* Username */}
          <div>
            <label className="field-label">Username</label>
            <input
              type="text"
              placeholder="admin"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              onKeyDown={handleKey}
              className="field-input"
              autoComplete="username"
            />
          </div>

          {/* Password */}
          <div>
            <label className="field-label">Password</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={handleKey}
                className="field-input pr-10"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-coffee-400 hover:text-coffee-600"
              >
                {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" /> Verifying...
              </>
            ) : (
              "Login →"
            )}
          </button>
        </div>

        <p className="text-center text-xs text-coffee-400 mt-5">
          Not an admin?{" "}
          <a href="/" className="text-coffee-600 hover:underline">
            Go to signup
          </a>
        </p>
      </div>
    </div>
  );
}
