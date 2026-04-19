"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiDownload,
  FiChevronDown,
  FiX,
} from "react-icons/fi";
import { BsWhatsapp } from "react-icons/bs";

// ── Shared StatCard (copied from your admin file) ─────────────────────────────

function StatCard({ icon, label, value, color = "coffee" }) {
  return (
    <div className="bg-white border border-coffee-100 rounded-xl p-4 flex items-center gap-3 shadow-sm">
      <div
        className={`w-10 h-10 rounded-xl bg-${color}-100 flex items-center justify-center text-${color}-600 text-xl`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xl font-bold text-charcoal">{value}</p>
        <p className="text-xs text-coffee-500">{label}</p>
      </div>
    </div>
  );
}

// ── Payment Drawer ────────────────────────────────────────────────────────────

function PaymentDrawer({ payment, onClose }) {
  if (!payment) return null;
  const snap = payment.formSnapshot || {};

  const fields = [
    { label: "Status", value: payment.status },
    {
      label: "Amount",
      value: `₹${((payment.amount || 0) / 100).toLocaleString("en-IN")}`,
    },
    { label: "Currency", value: payment.currency },
    { label: "Draft ID", value: payment.draftId },
    { label: "Razorpay Order ID", value: payment.razorpayOrderId },
    { label: "Razorpay Payment ID", value: payment.razorpayPaymentId },
    { label: "Receipt", value: payment.receipt },
    { label: "Attempts", value: payment.attemptCount },
    { label: "Failure Reason", value: payment.failureReason },
    { label: "Failure Code", value: payment.failureCode },
    {
      label: "Webhook Received",
      value: payment.webhookReceivedAt
        ? new Date(payment.webhookReceivedAt).toLocaleString("en-IN")
        : null,
    },
    {
      label: "Created",
      value: payment.createdAt
        ? new Date(payment.createdAt).toLocaleString("en-IN")
        : null,
    },
    {
      label: "Updated",
      value: payment.updatedAt
        ? new Date(payment.updatedAt).toLocaleString("en-IN")
        : null,
    },
    { label: "Signup Linked", value: payment.signupId ? "Yes" : null },
    {
      label: "Manually Reconciled",
      value: payment.reconciledManually ? "Yes" : null,
    },
    { label: "— User Info —", value: " " },
    {
      label: "Name",
      value: `${snap.firstName || ""} ${snap.lastName || ""}`.trim(),
    },
    { label: "Phone", value: snap.phone },
    { label: "City", value: snap.city },
    { label: "Gender", value: snap.gender },
    { label: "Age", value: snap.age },
  ].filter((f) => f.value);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-coffee-100 p-4 flex items-center justify-between">
          <div>
            <p className="font-bold text-charcoal">Payment Details</p>
            <p className="text-xs text-coffee-500">
              {`${snap.firstName || ""} ${snap.lastName || ""}`.trim() || "—"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"
          >
            <FiX />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {snap.phone && (
            <a
              href={`https://wa.me/91${snap.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-xl py-3 text-sm font-semibold transition-colors"
            >
              <BsWhatsapp />
              Open WhatsApp
            </a>
          )}

          {payment.razorpayPaymentId && (
            <a
              href={`https://dashboard.razorpay.com/app/payments/${payment.razorpayPaymentId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 text-sm font-semibold transition-colors"
            >
              View on Razorpay Dashboard →
            </a>
          )}

          <div className="space-y-2 pt-2">
            {fields.map((f, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-xs text-coffee-500 w-36 shrink-0 pt-0.5">
                  {f.label}
                </span>
                <span className="text-xs text-charcoal font-medium flex-1 break-all font-mono">
                  {f.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Payments Section ──────────────────────────────────────────────────────────

export default function PaymentsSection() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activePayment, setActivePayment] = useState(null);
  const [reconcilingId, setReconcilingId] = useState(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    try {
      const res = await fetch(`/api/payments?${params}`);
      const data = await res.json();
      if (data.success) setPayments(data.data || []);
    } catch {}
    setLoading(false);
  }, [search, statusFilter]);

  useEffect(() => {
    const t = setTimeout(fetchPayments, 300);
    return () => clearTimeout(t);
  }, [fetchPayments]);

  const reconcile = async (id) => {
    setReconcilingId(id);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: id }),
      });
      const data = await res.json();
      if (data.reconciled) {
        alert("✅ Payment reconciled successfully!");
      } else if (data.status === "PAID") {
        alert("Already paid.");
      } else {
        alert(`Status on Razorpay: ${data.rzpStatus || data.status}`);
      }
      fetchPayments();
    } catch {
      alert("Reconciliation failed");
    }
    setReconcilingId(null);
  };

  const exportCSV = () => {
    const keys = [
      "status",
      "firstName",
      "lastName",
      "phone",
      "city",
      "amount",
      "razorpayOrderId",
      "razorpayPaymentId",
      "failureReason",
      "createdAt",
    ];
    const rows = [keys.join(",")];
    payments.forEach((p) => {
      const snap = p.formSnapshot || {};
      const row = {
        status: p.status,
        firstName: snap.firstName || "",
        lastName: snap.lastName || "",
        phone: snap.phone || "",
        city: snap.city || "",
        amount: (p.amount / 100).toFixed(2),
        razorpayOrderId: p.razorpayOrderId || "",
        razorpayPaymentId: p.razorpayPaymentId || "",
        failureReason: p.failureReason || "",
        createdAt: p.createdAt,
      };
      rows.push(
        keys
          .map((k) => `"${(row[k] ?? "").toString().replace(/"/g, "'")}"`)
          .join(","),
      );
    });
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "coffeetotrip-payments.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const paidPayments = payments.filter((p) => p.status === "PAID");
  const revenue =
    paidPayments.reduce((sum, p) => sum + (p.amount || 0), 0) / 100;

  const stats = {
    total: payments.length,
    paid: paidPayments.length,
    pending: payments.filter((p) =>
      ["CREATED", "ATTEMPTED", "PENDING"].includes(p.status),
    ).length,
    failed: payments.filter((p) => p.status === "FAILED").length,
    revenue,
  };

  const STATUS_COLORS = {
    PAID: "bg-green-100 text-green-700",
    FAILED: "bg-red-100 text-red-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    ATTEMPTED: "bg-yellow-100 text-yellow-700",
    CREATED: "bg-gray-100 text-gray-600",
    EXPIRED: "bg-gray-100 text-gray-500",
  };

  const hasFilter = !!(search || statusFilter);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon="💰"
          label="Total Revenue"
          value={`₹${stats.revenue.toLocaleString("en-IN")}`}
          color="green"
        />
        <StatCard icon="✅" label="Paid" value={stats.paid} color="green" />
        <StatCard
          icon="⏳"
          label="Pending"
          value={stats.pending}
          color="coffee"
        />
        <StatCard icon="❌" label="Failed" value={stats.failed} color="red" />
      </div>

      {/* Filters */}
      <div className="bg-white border border-coffee-100 rounded-xl p-3 flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-400 text-sm" />
          <input
            type="text"
            placeholder="Name, phone, order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-coffee-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-400"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <FiFilter className="text-coffee-400 text-sm" />
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-coffee-200 rounded-lg px-2.5 py-2 pr-6 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-coffee-400 text-coffee-800"
            >
              <option value="">All Status</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="ATTEMPTED">Attempted</option>
              <option value="CREATED">Created</option>
              <option value="FAILED">Failed</option>
            </select>
            <FiChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 text-coffee-400 text-xs pointer-events-none" />
          </div>

          {hasFilter && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("");
              }}
              className="text-xs text-red-500 hover:text-red-700 flex items-center gap-0.5"
            >
              <FiX size={12} /> Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={fetchPayments}
            className="flex items-center gap-1.5 text-xs text-coffee-600 hover:text-coffee-800 border border-coffee-200 rounded-lg px-3 py-2 bg-white hover:bg-coffee-50 transition-colors"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} size={12} />
            Refresh
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 text-xs text-white bg-coffee-600 hover:bg-coffee-700 rounded-lg px-3 py-2 transition-colors"
          >
            <FiDownload size={12} /> Export CSV
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-coffee-500">
          Showing <strong>{payments.length}</strong> payments
        </p>
        {loading && (
          <p className="text-xs text-coffee-400 animate-pulse">Loading...</p>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-coffee-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-coffee-50 border-b border-coffee-100">
                {[
                  "Status",
                  "Name",
                  "Phone",
                  "City",
                  "Amount",
                  "Order ID",
                  "Payment ID",
                  "Failure",
                  "Created",
                  "",
                ].map((label, i) => (
                  <th
                    key={i}
                    className="px-3 py-3 text-left text-xs font-semibold text-coffee-700 uppercase tracking-wide whitespace-nowrap"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 && !loading ? (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center py-16 text-coffee-400 text-sm"
                  >
                    No payments found.
                  </td>
                </tr>
              ) : (
                payments.map((p) => {
                  const snap = p.formSnapshot || {};
                  const isStuck = ["PENDING", "ATTEMPTED"].includes(p.status);
                  return (
                    <>
                      <tr
                        key={p._id}
                        onClick={() => setActivePayment(p)}
                        className="border-t border-coffee-50 hover:bg-coffee-50/50 cursor-pointer transition-colors"
                      >
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span
                            className={`tag-pill ${STATUS_COLORS[p.status] || "bg-gray-100 text-gray-600"}`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 font-semibold text-charcoal whitespace-nowrap">
                          {`${snap.firstName || ""} ${snap.lastName || ""}`.trim() ||
                            "—"}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          {snap.phone ? (
                            <a
                              href={`https://wa.me/91${snap.phone.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-green-600 hover:text-green-800 flex items-center gap-1 font-medium text-xs"
                            >
                              <BsWhatsapp size={12} /> {snap.phone}
                            </a>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-3 py-3 text-coffee-700 whitespace-nowrap">
                          {snap.city || "—"}
                        </td>
                        <td className="px-3 py-3 text-charcoal font-semibold whitespace-nowrap">
                          ₹{((p.amount || 0) / 100).toLocaleString("en-IN")}
                        </td>
                        <td className="px-3 py-3 text-xs text-coffee-500 font-mono">
                          {p.razorpayOrderId
                            ? `${p.razorpayOrderId.slice(0, 16)}...`
                            : "—"}
                        </td>
                        <td className="px-3 py-3 text-xs text-coffee-500 font-mono">
                          {p.razorpayPaymentId
                            ? `${p.razorpayPaymentId.slice(0, 16)}...`
                            : "—"}
                        </td>
                        <td className="px-3 py-3 text-xs text-red-600 max-w-[200px] truncate">
                          {p.failureReason || "—"}
                        </td>
                        <td className="px-3 py-3 text-xs text-coffee-400 whitespace-nowrap">
                          {new Date(p.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "2-digit",
                          })}
                        </td>
                        <td className="px-3 py-3">
                          {isStuck && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                reconcile(p._id);
                              }}
                              disabled={reconcilingId === p._id}
                              className="text-xs bg-coffee-100 hover:bg-coffee-200 text-coffee-700 rounded-md px-2 py-1 font-medium transition-colors disabled:opacity-50"
                              title="Check with Razorpay & sync"
                            >
                              {reconcilingId === p._id ? "..." : "Sync"}
                            </button>
                          )}
                        </td>
                      </tr>
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activePayment && (
        <PaymentDrawer
          payment={activePayment}
          onClose={() => setActivePayment(null)}
        />
      )}
    </div>
  );
}
