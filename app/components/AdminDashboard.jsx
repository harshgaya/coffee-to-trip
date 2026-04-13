"use client";

import { useEffect, useState, useCallback } from "react";
import {
  FiSearch,
  FiUsers,
  FiFilter,
  FiTrash2,
  FiRefreshCw,
  FiDownload,
  FiChevronUp,
  FiChevronDown,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";
import { MdOutlineCoffee } from "react-icons/md";
import { BsWhatsapp } from "react-icons/bs";

const LIFESTYLE_COLORS = {
  no: "bg-green-100 text-green-700",
  social: "bg-yellow-100 text-yellow-700",
  occasional: "bg-yellow-100 text-yellow-700",
  regular: "bg-red-100 text-red-700",
  "non-smoker": "bg-green-100 text-green-700",
  smoker: "bg-red-100 text-red-700",
  "prefer-non": "bg-blue-100 text-blue-700",
};

const TRIP_COLORS = {
  yes: "bg-green-100 text-green-700",
  maybe: "bg-yellow-100 text-yellow-700",
  no: "bg-gray-100 text-gray-500",
};

function Pill({ value, colorMap, fallback = "bg-gray-100 text-gray-600" }) {
  if (!value) return <span className="text-gray-300 text-xs">—</span>;
  const cls = colorMap?.[value] || fallback;
  return <span className={`tag-pill ${cls}`}>{value}</span>;
}

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

function ConfirmModal({ user, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <FiAlertCircle className="text-red-500 text-2xl shrink-0" />
          <p className="font-semibold text-charcoal">Delete this signup?</p>
        </div>
        <p className="text-sm text-gray-600 mb-5">
          <strong>{user?.name}</strong> ({user?.city}) will be permanently
          removed. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl py-2.5 text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function UserDrawer({ user, onClose }) {
  if (!user) return null;

  const fields = [
    { label: "Phone", value: user.phone },
    { label: "Age", value: user.age },
    { label: "Gender", value: user.gender },
    { label: "City", value: user.city },
    { label: "Profession", value: user.profession },
    {
      label: "Languages",
      value: Array.isArray(user.languages)
        ? user.languages.join(", ")
        : user.languages,
    },
    { label: "Participation", value: user.participationType },
    { label: "Sponsor Preference", value: user.sponsorPreference },
    { label: "Sponsor Reason", value: user.sponsorReason },
    { label: "Drinking", value: user.drinking },
    { label: "Smoking", value: user.smoking },
    { label: "Food", value: user.food },
    { label: "Personality", value: user.personality },
    { label: "Conversation", value: user.conversation },
    { label: "Group Preference", value: user.groupPreference },
    { label: "Partner Name", value: user.partnerName },
    { label: "Trip Intent", value: user.tripIntent },
    { label: "Trip Type", value: user.tripType },
    { label: "Budget", value: user.budget },
    { label: "Readiness", value: user.readiness },
    { label: "Intent", value: user.intent },
    { label: "Travel History", value: user.history },
  ].filter((f) => f.value);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white h-full overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-coffee-100 p-4 flex items-center justify-between">
          <div>
            <p className="font-bold text-charcoal">{user.name}</p>
            <p className="text-xs text-coffee-500">
              {user.city} · Signed up{" "}
              {new Date(user.createdAt).toLocaleDateString("en-IN")}
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
          {user.phone && (
            <a
              href={`https://wa.me/91${user.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-xl py-3 text-sm font-semibold transition-colors"
            >
              <BsWhatsapp />
              Open WhatsApp
            </a>
          )}

          <div className="space-y-2 pt-1">
            {fields.map((f) => (
              <div key={f.label} className="flex items-start gap-2">
                <span className="text-xs text-coffee-500 w-32 shrink-0 pt-0.5">
                  {f.label}
                </span>
                <span className="text-xs text-charcoal font-medium flex-1">
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

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("");
  const [tripIntent, setTrip] = useState("");
  const [groupPref, setGroup] = useState("");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [activeUser, setActiveUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (gender) params.set("gender", gender);
    if (tripIntent) params.set("tripIntent", tripIntent);
    if (groupPref) params.set("groupPref", groupPref);

    const res = await fetch(`/api/users?${params}`);
    const data = await res.json();
    if (data.success) setUsers(data.data || []);
    setLoading(false);
  }, [search, gender, tripIntent, groupPref]);

  useEffect(() => {
    const t = setTimeout(fetchUsers, 300);
    return () => clearTimeout(t);
  }, [fetchUsers]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/users?id=${deleteTarget._id}`, { method: "DELETE" });
    setDeleteTarget(null);
    fetchUsers();
  };

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = [...users].sort((a, b) => {
    let av = a[sortKey],
      bv = b[sortKey];
    if (sortKey === "createdAt") {
      av = new Date(av);
      bv = new Date(bv);
    }
    if (sortKey === "age") {
      av = Number(av);
      bv = Number(bv);
    }
    return sortDir === "asc" ? (av > bv ? 1 : -1) : av < bv ? 1 : -1;
  });

  const SortIcon = ({ k }) =>
    sortKey === k ? (
      sortDir === "asc" ? (
        <FiChevronUp className="inline ml-1 text-coffee-600" />
      ) : (
        <FiChevronDown className="inline ml-1 text-coffee-600" />
      )
    ) : (
      <FiChevronDown className="inline ml-1 text-gray-300" />
    );

  const exportCSV = () => {
    const keys = [
      "name",
      "phone",
      "age",
      "gender",
      "city",
      "profession",
      "participationType",
      "drinking",
      "smoking",
      "food",
      "personality",
      "groupPreference",
      "tripIntent",
      "budget",
      "createdAt",
    ];
    const rows = [keys.join(",")];
    users.forEach((u) => {
      rows.push(
        keys
          .map((k) => `"${(u[k] ?? "").toString().replace(/"/g, "'")}"`)
          .join(","),
      );
    });
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "coffeetotrip-signups.csv";
    a.click();
  };

  const stats = {
    total: users.length,
    tripping: users.filter((u) => u.tripIntent === "yes").length,
    male: users.filter((u) => u.gender === "Male").length,
    female: users.filter((u) => u.gender === "Female").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-coffee-100 sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <MdOutlineCoffee className="text-coffee-600 text-xl" />
            <span className="font-bold text-coffee-800">CoffeeToTrip</span>
            <span className="text-xs bg-coffee-100 text-coffee-600 px-2 py-0.5 rounded-full font-medium ml-1">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchUsers}
              className="flex items-center gap-1.5 text-xs text-coffee-600 hover:text-coffee-800 border border-coffee-200 rounded-lg px-3 py-2 bg-white hover:bg-coffee-50 transition-colors"
            >
              <FiRefreshCw
                className={loading ? "animate-spin" : ""}
                size={12}
              />{" "}
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
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-5 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            icon={<FiUsers />}
            label="Total Signups"
            value={stats.total}
          />
          <StatCard
            icon="✈️"
            label="Want to Trip"
            value={stats.tripping}
            color="green"
          />
          <StatCard icon="👨" label="Male" value={stats.male} color="blue" />
          <StatCard
            icon="👩"
            label="Female"
            value={stats.female}
            color="pink"
          />
        </div>

        {/* Filters */}
        <div className="bg-white border border-coffee-100 rounded-xl p-3 flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-400 text-sm" />
            <input
              type="text"
              placeholder="Search name, city, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-coffee-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-400"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <FiFilter className="text-coffee-400 text-sm" />

            {[
              {
                val: gender,
                set: setGender,
                options: ["Male", "Female", "Non-binary"],
                placeholder: "Gender",
              },
              {
                val: tripIntent,
                set: setTrip,
                options: ["yes", "maybe", "no"],
                placeholder: "Trip Intent",
              },
              {
                val: groupPref,
                set: setGroup,
                options: [
                  "all-men",
                  "all-women",
                  "mixed",
                  "couples",
                  "no-preference",
                ],
                placeholder: "Group Pref",
              },
            ].map((f, i) => (
              <div key={i} className="relative">
                <select
                  value={f.val}
                  onChange={(e) => f.set(e.target.value)}
                  className="text-xs border border-coffee-200 rounded-lg px-2.5 py-2 pr-6 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-coffee-400 text-coffee-800"
                >
                  <option value="">{f.placeholder}</option>
                  {f.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 text-coffee-400 text-xs pointer-events-none" />
              </div>
            ))}

            {(gender || tripIntent || groupPref || search) && (
              <button
                onClick={() => {
                  setGender("");
                  setTrip("");
                  setGroup("");
                  setSearch("");
                }}
                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-0.5"
              >
                <FiX size={12} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-coffee-500">
            Showing <strong>{sorted.length}</strong> of{" "}
            <strong>{users.length}</strong> signups
          </p>
          {loading && (
            <p className="text-xs text-coffee-400 animate-pulse">
              Refreshing...
            </p>
          )}
        </div>

        {/* Table */}
        <div className="bg-white border border-coffee-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-coffee-50 border-b border-coffee-100">
                  {[
                    { label: "Name", key: "name" },
                    { label: "Age", key: "age" },
                    { label: "Gender", key: "gender" },
                    { label: "City", key: "city" },
                    { label: "Phone", key: null },
                    { label: "Participation", key: "participationType" },
                    { label: "Drink", key: "drinking" },
                    { label: "Smoke", key: "smoking" },
                    { label: "Food", key: "food" },
                    { label: "Group", key: "groupPreference" },
                    { label: "Trip", key: "tripIntent" },
                    { label: "Budget", key: "budget" },
                    { label: "Signed", key: "createdAt" },
                    { label: "", key: null },
                  ].map(({ label, key }, i) => (
                    <th
                      key={i}
                      onClick={() => key && toggleSort(key)}
                      className={`px-3 py-3 text-left text-xs font-semibold text-coffee-700 uppercase tracking-wide whitespace-nowrap ${key ? "cursor-pointer hover:text-coffee-900 select-none" : ""}`}
                    >
                      {label}
                      {key && <SortIcon k={key} />}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {sorted.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={14}
                      className="text-center py-16 text-coffee-400 text-sm"
                    >
                      No signups found.
                    </td>
                  </tr>
                )}

                {sorted.map((u) => (
                  <tr
                    key={u._id}
                    className="border-t border-coffee-50 hover:bg-coffee-50/50 cursor-pointer transition-colors"
                    onClick={() => setActiveUser(u)}
                  >
                    <td className="px-3 py-3 font-semibold text-charcoal whitespace-nowrap">
                      {u.name}
                    </td>
                    <td className="px-3 py-3 text-coffee-700">
                      {u.age || "—"}
                    </td>
                    <td className="px-3 py-3 text-coffee-700">
                      {u.gender || "—"}
                    </td>
                    <td className="px-3 py-3 text-coffee-700 whitespace-nowrap">
                      {u.city || "—"}
                    </td>
                    <td className="px-3 py-3 text-coffee-500 whitespace-nowrap">
                      {u.phone ? (
                        <a
                          href={`https://wa.me/91${u.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-green-600 hover:text-green-800 flex items-center gap-1 font-medium"
                        >
                          <BsWhatsapp size={12} /> {u.phone}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs text-coffee-600 capitalize">
                        {u.participationType || "—"}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <Pill value={u.drinking} colorMap={LIFESTYLE_COLORS} />
                    </td>
                    <td className="px-3 py-3">
                      <Pill value={u.smoking} colorMap={LIFESTYLE_COLORS} />
                    </td>
                    <td className="px-3 py-3 text-xs text-coffee-600 capitalize">
                      {u.food || "—"}
                    </td>
                    <td className="px-3 py-3 text-xs text-coffee-600">
                      {u.groupPreference || "—"}
                    </td>
                    <td className="px-3 py-3">
                      <Pill value={u.tripIntent} colorMap={TRIP_COLORS} />
                    </td>
                    <td className="px-3 py-3 text-xs text-coffee-600">
                      {u.budget || "—"}
                    </td>
                    <td className="px-3 py-3 text-xs text-coffee-400 whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "2-digit",
                      })}
                    </td>
                    <td className="px-3 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(u);
                        }}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded"
                        title="Delete"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-center text-xs text-coffee-400 pb-4">
          CoffeeToTrip Admin · {new Date().getFullYear()}
        </p>
      </div>

      {deleteTarget && (
        <ConfirmModal
          user={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {activeUser && (
        <UserDrawer user={activeUser} onClose={() => setActiveUser(null)} />
      )}
    </div>
  );
}
