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
  FiMapPin,
  FiMenu,
} from "react-icons/fi";
import { MdOutlineCoffee } from "react-icons/md";
import { BsWhatsapp } from "react-icons/bs";

const NAV_ITEMS = [
  { id: "signups", label: "Signups", icon: <FiUsers size={15} /> },
  { id: "cities", label: "Cities", icon: <FiMapPin size={15} /> },
];

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

function fullName(u) {
  return `${u?.firstName || ""} ${u?.lastName || ""}`.trim() || "—";
}

function SortIcon({ k, sortKey, sortDir }) {
  if (sortKey !== k)
    return <FiChevronDown className="inline ml-1 text-gray-300" />;
  if (sortDir === "asc")
    return <FiChevronUp className="inline ml-1 text-coffee-600" />;
  return <FiChevronDown className="inline ml-1 text-coffee-600" />;
}

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
          <strong>{fullName(user)}</strong> ({user?.city}) will be permanently
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
    { label: "First Name", value: user.firstName },
    { label: "Last Name", value: user.lastName },
    { label: "Phone", value: user.phone },
    { label: "Age", value: user.age },
    { label: "Gender", value: user.gender },
    { label: "City", value: user.city },
    { label: "Profession", value: user.profession },
    { label: "Age Confirmed", value: user.ageConfirmed ? "Yes" : null },
    {
      label: "Preferred Date",
      value: user.preferredDate
        ? new Date(user.preferredDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : null,
    },
    {
      label: "Languages",
      value: Array.isArray(user.languages)
        ? user.languages.join(", ")
        : user.languages,
    },
    { label: "Participation", value: user.participationType },
    { label: "Sponsor Preference", value: user.sponsorPreference },
    { label: "Sponsor Reason", value: user.sponsorReason },
    { label: "Sponsor Consent", value: user.sponsorConsent ? "Agreed" : null },
    { label: "Drinking", value: user.drinking },
    {
      label: "Prefers Non-Drinking",
      value: user.preferNonDrinking ? "Yes" : null,
    },
    { label: "Smoking", value: user.smoking },
    {
      label: "Prefers Non-Smoking",
      value: user.preferNonSmoking ? "Yes" : null,
    },
    { label: "Food", value: user.food },
    { label: "Prefers Veg Group", value: user.preferVegGroup ? "Yes" : null },
    { label: "Personality", value: user.personality },
    { label: "Conversation", value: user.conversation },
    { label: "Group Preference", value: user.groupPreference },
    { label: "Partner Name", value: user.partnerName },
    { label: "Both Will Attend", value: user.bothWillAttend ? "Yes" : null },
    { label: "Paying for Both", value: user.payingForBoth ? "Yes" : null },
    { label: "Partner Gender", value: user.couplePartnerGender },
    { label: "Trip Intent", value: user.tripIntent },
    { label: "Trip Type", value: user.tripType },
    { label: "Budget", value: user.budget },
    { label: "Travel Timing", value: user.travelTiming },
    {
      label: "₹1k Redeemable",
      value: user.consentRedeemable ? "Understood" : null,
    },
    {
      label: "Consent — Experience",
      value: user.consentExperience ? "Agreed" : null,
    },
    { label: "Consent — No Trip", value: user.consentNoTrip ? "Agreed" : null },
    {
      label: "Consent — No Refund",
      value: user.consentNoRefund ? "Agreed" : null,
    },
    { label: "Intent", value: user.intent },
  ].filter((f) => f.value);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white h-full overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-coffee-100 p-4 flex items-center justify-between">
          <div>
            <p className="font-bold text-charcoal">{fullName(user)}</p>
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
                <span className="text-xs text-coffee-500 w-36 shrink-0 pt-0.5">
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

function SignupsSection() {
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
    try {
      const res = await fetch(`/api/users?${params}`);
      const data = await res.json();
      if (data.success) setUsers(data.data || []);
    } catch {}
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
    if (!key) return;
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
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    return 0;
  });

  const exportCSV = () => {
    const keys = [
      "firstName",
      "lastName",
      "phone",
      "age",
      "gender",
      "city",
      "profession",
      "preferredDate",
      "participationType",
      "drinking",
      "smoking",
      "food",
      "personality",
      "conversation",
      "groupPreference",
      "partnerName",
      "tripIntent",
      "travelTiming",
      "budget",
      "intent",
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
    URL.revokeObjectURL(url);
  };

  const stats = {
    total: users.length,
    tripping: users.filter((u) => u.tripIntent === "yes").length,
    male: users.filter((u) => u.gender === "Male").length,
    female: users.filter((u) => u.gender === "Female").length,
  };

  const COLS = [
    { label: "Name", key: "firstName" },
    { label: "Age", key: "age" },
    { label: "Gender", key: "gender" },
    { label: "City", key: "city" },
    { label: "Phone", key: null },
    { label: "Date", key: "preferredDate" },
    { label: "Participation", key: "participationType" },
    { label: "Drink", key: "drinking" },
    { label: "Smoke", key: "smoking" },
    { label: "Food", key: "food" },
    { label: "Group", key: "groupPreference" },
    { label: "Partner", key: null },
    { label: "Trip", key: "tripIntent" },
    { label: "Timing", key: "travelTiming" },
    { label: "Budget", key: "budget" },
    { label: "Signed", key: "createdAt" },
    { label: "", key: null },
  ];

  const hasFilter = !!(gender || tripIntent || groupPref || search);

  return (
    <div className="space-y-4">
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
        <StatCard icon="👩" label="Female" value={stats.female} color="pink" />
      </div>

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
              opts: ["Male", "Female"],
              ph: "Gender",
            },
            {
              val: tripIntent,
              set: setTrip,
              opts: ["yes", "maybe", "no"],
              ph: "Trip Intent",
            },
            {
              val: groupPref,
              set: setGroup,
              opts: [
                "all-men",
                "all-women",
                "mixed",
                "couples",
                "no-preference",
              ],
              ph: "Group Pref",
            },
          ].map((f, i) => (
            <div key={i} className="relative">
              <select
                value={f.val}
                onChange={(e) => f.set(e.target.value)}
                className="text-xs border border-coffee-200 rounded-lg px-2.5 py-2 pr-6 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-coffee-400 text-coffee-800"
              >
                <option value="">{f.ph}</option>
                {f.opts.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 text-coffee-400 text-xs pointer-events-none" />
            </div>
          ))}

          {hasFilter && (
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

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={fetchUsers}
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
          Showing <strong>{sorted.length}</strong> of{" "}
          <strong>{users.length}</strong> signups
        </p>
        {loading && (
          <p className="text-xs text-coffee-400 animate-pulse">Loading...</p>
        )}
      </div>

      <div className="bg-white border border-coffee-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-coffee-50 border-b border-coffee-100">
                {COLS.map(({ label, key }, i) => (
                  <th
                    key={i}
                    onClick={() => toggleSort(key)}
                    className={`px-3 py-3 text-left text-xs font-semibold text-coffee-700 uppercase tracking-wide whitespace-nowrap ${key ? "cursor-pointer hover:text-coffee-900 select-none" : ""}`}
                  >
                    {label}
                    {key && (
                      <SortIcon k={key} sortKey={sortKey} sortDir={sortDir} />
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {sorted.length === 0 && !loading ? (
                <tr>
                  <td
                    colSpan={COLS.length}
                    className="text-center py-16 text-coffee-400 text-sm"
                  >
                    No signups found.
                  </td>
                </tr>
              ) : (
                sorted.map((u) => (
                  <tr
                    key={u._id}
                    onClick={() => setActiveUser(u)}
                    className="border-t border-coffee-50 hover:bg-coffee-50/50 cursor-pointer transition-colors"
                  >
                    <td className="px-3 py-3 font-semibold text-charcoal whitespace-nowrap">
                      {fullName(u)}
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
                    <td className="px-3 py-3 whitespace-nowrap">
                      {u.phone ? (
                        <a
                          href={`https://wa.me/91${u.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-green-600 hover:text-green-800 flex items-center gap-1 font-medium text-xs"
                        >
                          <BsWhatsapp size={12} /> {u.phone}
                        </a>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs text-coffee-600 whitespace-nowrap">
                      {u.preferredDate
                        ? new Date(u.preferredDate).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "—"}
                    </td>
                    <td className="px-3 py-3 text-xs text-coffee-600 capitalize">
                      {u.participationType || "—"}
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
                    <td className="px-3 py-3 text-xs text-coffee-600 whitespace-nowrap">
                      {u.partnerName || "—"}
                    </td>
                    <td className="px-3 py-3">
                      <Pill value={u.tripIntent} colorMap={TRIP_COLORS} />
                    </td>
                    <td className="px-3 py-3 text-xs text-coffee-600 whitespace-nowrap">
                      {u.travelTiming || "—"}
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
                ))
              )}
            </tbody>
          </table>
        </div>
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

function CitiesSection() {
  const [cities, setCities] = useState([]);
  const [newCity, setNewCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCities = async () => {
    try {
      const res = await fetch("/api/cities");
      const data = await res.json();
      if (data.success) setCities(data.data || []);
    } catch {}
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const addCity = async () => {
    if (!newCity.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCity.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setNewCity("");
        fetchCities();
      } else {
        setError(data.error || "Failed to add city");
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  const deleteCity = async (id) => {
    if (!confirm("Remove this city from the signup form?")) return;
    await fetch(`/api/cities?id=${id}`, { method: "DELETE" });
    fetchCities();
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-base font-bold text-charcoal">City Management</h2>
        <p className="text-xs text-coffee-500 mt-0.5">
          Only cities added here will appear in the signup form dropdown.
        </p>
      </div>

      <div className="bg-white border border-coffee-100 rounded-2xl p-5 shadow-sm space-y-3">
        <p className="text-sm font-semibold text-charcoal">Add a City</p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Chennai"
            value={newCity}
            onChange={(e) => {
              setNewCity(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && addCity()}
            className="flex-1 text-sm border border-coffee-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-coffee-400"
          />
          <button
            onClick={addCity}
            disabled={loading || !newCity.trim()}
            className="bg-coffee-600 hover:bg-coffee-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Adding..." : "+ Add"}
          </button>
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>

      <div className="bg-white border border-coffee-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-charcoal">
            Active Cities
            <span className="ml-2 text-xs font-normal text-coffee-400">
              ({cities.length})
            </span>
          </p>
          <button
            onClick={fetchCities}
            className="text-xs text-coffee-400 hover:text-coffee-600 flex items-center gap-1 transition-colors"
          >
            <FiRefreshCw size={11} /> Refresh
          </button>
        </div>

        {cities.length === 0 ? (
          <p className="text-xs text-coffee-400 text-center py-6">
            No cities added yet. Add your first city above.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {cities.map((c) => (
              <div
                key={c._id}
                className="flex items-center gap-1.5 bg-coffee-50 border border-coffee-200 rounded-full px-3 py-1.5"
              >
                <FiMapPin size={10} className="text-coffee-400" />
                <span className="text-xs font-medium text-coffee-700">
                  {c.name}
                </span>
                <button
                  onClick={() => deleteCity(c._id)}
                  className="text-coffee-300 hover:text-red-500 transition-colors ml-0.5"
                >
                  <FiX size={11} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Note:</strong> Removing a city here does not affect existing
          signups. It only removes the option from the signup form going
          forward.
        </p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("signups");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderSection = () => {
    if (activeSection === "signups") return <SignupsSection />;
    if (activeSection === "cities") return <CitiesSection />;
    return null;
  };

  const activeLabel =
    NAV_ITEMS.find((n) => n.id === activeSection)?.label || "";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-coffee-100 sticky top-0 z-20">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden w-8 h-8 flex items-center justify-center text-coffee-600 hover:bg-coffee-50 rounded-lg"
          >
            <FiMenu size={18} />
          </button>
          <div className="flex items-center gap-2">
            <MdOutlineCoffee className="text-coffee-600 text-xl" />
            <span className="font-bold text-coffee-800">CoffeeToTrip</span>
            <span className="text-xs bg-coffee-100 text-coffee-600 px-2 py-0.5 rounded-full font-medium ml-1">
              Admin
            </span>
          </div>
          <span className="text-coffee-300 hidden sm:block">·</span>
          <span className="text-sm font-medium text-coffee-700 hidden sm:block">
            {activeLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-52 bg-white border-r border-coffee-100 flex-shrink-0 flex flex-col pt-4 pb-6 transition-transform duration-200 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="lg:hidden flex justify-end px-3 mb-2">
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-coffee-400 hover:text-coffee-700 p-1"
            >
              <FiX size={18} />
            </button>
          </div>

          <nav className="flex flex-col gap-1 px-3">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                  activeSection === item.id
                    ? "bg-coffee-600 text-white"
                    : "text-coffee-700 hover:bg-coffee-50"
                }`}
              >
                <span
                  className={
                    activeSection === item.id ? "text-white" : "text-coffee-400"
                  }
                >
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto px-4">
            <p className="text-xs text-coffee-300">
              CoffeeToTrip Admin · {new Date().getFullYear()}
            </p>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-screen-xl mx-auto px-4 py-5">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}
