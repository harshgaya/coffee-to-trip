"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  FiUser,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiHeart,
  FiSend,
  FiChevronDown,
  FiUsers,
  FiGlobe,
  FiLoader,
  FiCheck,
  FiClock,
  FiWifiOff,
  FiAlertCircle,
  FiRefreshCw,
  FiCalendar,
} from "react-icons/fi";
import {
  MdOutlineDirectionsBus,
  MdOutlineSmokingRooms,
  MdOutlineLocalBar,
  MdOutlineFastfood,
} from "react-icons/md";

const DRAFT_KEY = "ctt_signup_draft";
const DRAFT_ID_KEY = "ctt_draft_id";
const MAX_RETRIES = 3;

function getDraftId() {
  if (typeof window === "undefined") return null;
  let id = localStorage.getItem(DRAFT_ID_KEY);
  if (!id) {
    id = "draft_" + Math.random().toString(36).slice(2) + Date.now();
    localStorage.setItem(DRAFT_ID_KEY, id);
  }
  return id;
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(url, options, retries = MAX_RETRIES) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      if (i < retries - 1) await sleep(800 * Math.pow(2, i));
      else throw e;
    }
  }
}

function useNetworkStatus() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return online;
}

// ── Sticky Save Bar ───────────────────────────────────────────────────────────

function StickySaveBar({ status, online, onRetry, onClear, hasData }) {
  const visible = !online || !!status;
  let content = null;
  if (!online) {
    content = (
      <div className="flex items-center gap-2 text-xs text-amber-700">
        <FiWifiOff size={11} className="shrink-0" />
        <span>Offline — changes saved locally.</span>
      </div>
    );
  } else if (status === "saving") {
    content = (
      <div className="flex items-center gap-2 text-xs text-coffee-600">
        <FiLoader size={11} className="animate-spin shrink-0" />
        <span>Saving...</span>
      </div>
    );
  } else if (status === "saved") {
    content = (
      <div className="flex items-center gap-2 text-xs text-green-700">
        <FiCheck size={11} className="shrink-0" />
        <span>All changes saved</span>
      </div>
    );
  } else if (status === "restored") {
    content = (
      <div className="flex items-center gap-2 text-xs text-coffee-700">
        <FiClock size={11} className="shrink-0" />
        <span>Draft restored</span>
      </div>
    );
  } else if (status === "error") {
    content = (
      <div className="flex items-center gap-2 text-xs text-red-700">
        <FiAlertCircle size={11} className="shrink-0" />
        <span>Sync failed.</span>
        <button
          onClick={onRetry}
          className="flex items-center gap-1 font-semibold underline underline-offset-2"
        >
          <FiRefreshCw size={10} /> Retry
        </button>
      </div>
    );
  }
  return (
    <div
      className={`fixed top-[53px] left-0 right-0 z-40 transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-1 pointer-events-none"
      }`}
    >
      <div className="max-w-xl mx-auto px-4 mt-2">
        <div className="bg-white/90 backdrop-blur-sm border border-coffee-200 rounded-xl px-3 py-2 shadow-sm flex items-center justify-between">
          <div>{content}</div>
          {hasData && (
            <button
              onClick={onClear}
              className="text-xs text-coffee-500 hover:text-red-500 transition-colors ml-3 shrink-0"
            >
              Clear draft
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Submit Overlay ────────────────────────────────────────────────────────────

function SubmitOverlay({ state, retryCount, onRetry, onReset }) {
  if (state === "submitting") {
    return (
      <div className="fixed inset-0 bg-cream/90 backdrop-blur-sm z-50 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-coffee-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiLoader className="text-coffee-600 text-2xl animate-spin" />
          </div>
          <p className="font-semibold text-stone-800">
            Submitting your profile...
          </p>
          {retryCount > 0 && (
            <p className="text-xs text-stone-600 mt-1">
              Retry attempt {retryCount} of {MAX_RETRIES}...
            </p>
          )}
        </div>
      </div>
    );
  }
  if (state === "success") {
    return (
      <div className="fixed inset-0 bg-cream z-50 flex items-center justify-center px-6">
        <div className="text-center max-w-sm w-full">
          <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FiCheck className="text-green-600 text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-stone-800 mb-2">
            You're on the list!
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed mb-6">
            We'll review your profile and reach out on WhatsApp once we find
            your travel crew. ☕
          </p>
          <div className="bg-white border border-coffee-100 rounded-2xl p-5 text-left mb-6 shadow-sm">
            <p className="text-xs font-bold text-coffee-700 uppercase tracking-wider mb-3">
              What happens next
            </p>
            <div className="space-y-3">
              {[
                "We review your profile & preferences",
                "We match you with compatible travellers",
                "You get a WhatsApp message from us",
                "Coffee meetup → Group trips planning",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-coffee-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-xs text-stone-700">{step}</p>
                </div>
              ))}
            </div>
          </div>
          <button onClick={onReset} className="btn-primary">
            ☕ Add Another Person
          </button>
        </div>
      </div>
    );
  }
  if (state === "failed") {
    return (
      <div className="fixed inset-0 bg-cream/95 backdrop-blur-sm z-50 flex items-center justify-center px-6">
        <div className="text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle className="text-red-600 text-2xl" />
          </div>
          <h2 className="text-lg font-bold text-stone-800 mb-2">
            Submission failed
          </h2>
          <p className="text-sm text-stone-600 mb-6 leading-relaxed">
            We tried {MAX_RETRIES} times but couldn't reach the server. Your
            data is safe locally — try again when reconnected.
          </p>
          <button onClick={onRetry} className="btn-primary">
            <FiRefreshCw size={14} /> Try Again
          </button>
        </div>
      </div>
    );
  }
  return null;
}

// ── Field Components ──────────────────────────────────────────────────────────

function Label({ children, optional }) {
  return (
    <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wide">
      {children}
      {optional && (
        <span className="text-stone-400 normal-case font-normal ml-1">
          (optional)
        </span>
      )}
    </label>
  );
}

function TextInput({
  label,
  icon,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  optional,
}) {
  return (
    <div>
      {label && <Label optional={optional}>{label}</Label>}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value || ""}
          placeholder={placeholder || label}
          onChange={(e) => onChange(name, e.target.value)}
          className={`field-input text-stone-800 placeholder-stone-400 ${icon ? "pl-9" : ""} ${
            error ? "border-red-400 focus:ring-red-400" : ""
          }`}
        />
      </div>
      {error && (
        <p className="flex items-center gap-1 text-red-600 text-xs mt-1 font-medium">
          <FiAlertCircle size={10} /> {error}
        </p>
      )}
    </div>
  );
}

function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  optional,
}) {
  return (
    <div>
      {label && <Label optional={optional}>{label}</Label>}
      <textarea
        rows={rows}
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(name, e.target.value)}
        className="field-input resize-none text-stone-800 placeholder-stone-400"
      />
    </div>
  );
}

function RadioGroup({ label, name, options, value, onChange, locked }) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <div className="flex flex-wrap gap-2 mt-1.5">
        {options.map((o) => {
          const val = o.value || o;
          const lbl = o.label || o;
          const selected = value === val;
          const isLocked = locked && !selected;
          return (
            <button
              key={val}
              type="button"
              onClick={() => !isLocked && onChange(name, val)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 active:scale-95 ${
                selected
                  ? "bg-coffee-600 text-white border-coffee-600"
                  : isLocked
                    ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed"
                    : "bg-white text-stone-700 border-stone-300 hover:border-coffee-500 hover:text-coffee-700"
              }`}
            >
              {lbl}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CheckboxField({ name, label, checked, onChange, sublabel, hint }) {
  return (
    <div>
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="mt-0.5 shrink-0">
          <input
            type="checkbox"
            checked={!!checked}
            onChange={(e) => onChange(name, e.target.checked)}
            className="sr-only"
          />
          <div
            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
              checked
                ? "bg-coffee-600 border-coffee-600"
                : "border-stone-400 group-hover:border-coffee-500"
            }`}
          >
            {checked && <FiCheck size={10} className="text-white" />}
          </div>
        </div>
        <div>
          <p className="text-sm text-stone-800 leading-snug font-medium">
            {label}
          </p>
          {sublabel && (
            <p className="text-xs text-stone-500 mt-0.5">{sublabel}</p>
          )}
        </div>
      </label>
      {hint && checked && (
        <p className="text-xs text-green-700 mt-1.5 ml-7 flex items-center gap-1 font-medium">
          <FiCheck size={10} className="text-green-600" />
          {hint}
        </p>
      )}
    </div>
  );
}

function MultiCheckbox({ label, name, options, selected, onChange }) {
  const toggle = (val) => {
    const current = selected || [];
    const updated = current.includes(val)
      ? current.filter((v) => v !== val)
      : [...current, val];
    onChange(name, updated);
  };
  return (
    <div>
      {label && <Label>{label}</Label>}
      <div className="flex flex-wrap gap-2 mt-1.5">
        {options.map((o) => {
          const val = o.value || o;
          const lbl = o.label || o;
          const sel = (selected || []).includes(val);
          return (
            <button
              key={val}
              type="button"
              onClick={() => toggle(val)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 active:scale-95 ${
                sel
                  ? "bg-coffee-600 text-white border-coffee-600"
                  : "bg-white text-stone-700 border-stone-300 hover:border-coffee-500 hover:text-coffee-700"
              }`}
            >
              {lbl}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SectionTitle({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-coffee-100">
      <div className="w-8 h-8 rounded-lg bg-coffee-100 flex items-center justify-center text-coffee-700 shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-stone-800">{title}</p>
        {subtitle && (
          <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function CitySelect({ value, onChange, error }) {
  const [cities, setCities] = useState([]);
  useEffect(() => {
    fetch("/api/cities")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCities(d.data);
      })
      .catch(() => {});
  }, []);
  return (
    <div>
      <Label>City *</Label>
      <div className="relative">
        <select
          value={value || ""}
          onChange={(e) => onChange("city", e.target.value)}
          className={`field-select text-stone-800 pr-9 ${error ? "border-red-400 focus:ring-red-400" : ""}`}
        >
          <option value="">Select your city</option>
          {cities.map((c) => (
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none text-sm" />
      </div>
      {error && (
        <p className="flex items-center gap-1 text-red-600 text-xs mt-1 font-medium">
          <FiAlertCircle size={10} /> {error}
        </p>
      )}
    </div>
  );
}

// ── Main Form ─────────────────────────────────────────────────────────────────

export default function SignupForm() {
  const [form, setForm] = useState({});
  const [saveStatus, setSave] = useState(null);
  const [submitState, setSubmit] = useState(null);
  const [retryCount, setRetry] = useState(0);
  const [errors, setErrors] = useState({});
  const [ready, setReady] = useState(false);

  const online = useNetworkStatus();
  const debounceRef = useRef(null);
  const pendingRef = useRef(false);
  const isFirst = useRef(true);

  useEffect(() => {
    const local = localStorage.getItem(DRAFT_KEY);
    if (local) {
      try {
        setForm(JSON.parse(local));
        setSave("restored");
        setTimeout(() => setSave("saved"), 3000);
      } catch {}
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (online && pendingRef.current) {
      pendingRef.current = false;
      const local = localStorage.getItem(DRAFT_KEY);
      if (local) {
        try {
          syncDraft(JSON.parse(local));
        } catch {}
      }
    }
  }, [online]);

  const syncDraft = useCallback(
    async (data) => {
      if (!online) {
        pendingRef.current = true;
        setSave("saved");
        return;
      }
      setSave("saving");
      try {
        const draftId = getDraftId();
        await fetchWithRetry(
          "/api/draft",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, draftId }),
          },
          2,
        );
        setSave("saved");
      } catch {
        setSave("error");
      }
    },
    [online],
  );

  useEffect(() => {
    if (!ready) return;
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    setSave("saving");
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => syncDraft(form), 1500);
    return () => clearTimeout(debounceRef.current);
  }, [form, ready, syncDraft]);

  const update = (key, value) => {
    setForm((p) => {
      const next = { ...p, [key]: value };
      if (key === "preferNonDrinking" && value === true) next.drinking = "no";
      if (key === "preferNonSmoking" && value === true)
        next.smoking = "non-smoker";
      if (key === "preferVegGroup" && value === true) next.food = "veg";
      if (key === "drinking" && value !== "no") next.preferNonDrinking = false;
      if (key === "smoking" && value !== "non-smoker")
        next.preferNonSmoking = false;
      if (key === "food" && value !== "veg") next.preferVegGroup = false;
      return next;
    });
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName?.trim()) errs.firstName = "First name is required";
    if (!form.lastName?.trim()) errs.lastName = "Last name is required";
    if (!form.phone?.trim()) errs.phone = "Phone number is required";
    if (!form.city?.trim()) errs.city = "City is required";
    if (!form.gender) errs.gender = "Please select gender";
    if (!form.age || Number(form.age) < 21) errs.age = "Must be 21 or older";
    if (!form.ageConfirmed) errs.ageConfirmed = "Please confirm your age";
    if (!form.consentRedeemable) errs.consentRedeemable = "Please confirm";
    if (!form.consentExperience) errs.consentExperience = "Please confirm";
    if (!form.consentNoTrip) errs.consentNoTrip = "Please confirm";
    if (!form.consentNoRefund) errs.consentNoRefund = "Please confirm";
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setTimeout(() => {
        document
          .querySelector("[data-error]")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    }
    return Object.keys(errs).length === 0;
  };

  const doSubmit = async () => {
    if (!validate()) return;
    if (!online) {
      setSave("error");
      return;
    }
    setSubmit("submitting");
    setRetry(0);
    const draftId = getDraftId();
    let attempt = 0;
    while (attempt < MAX_RETRIES) {
      try {
        setRetry(attempt);
        const data = await fetchWithRetry(
          "/api/signup",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, draftId }),
          },
          1,
        );
        if (data.success) {
          localStorage.removeItem(DRAFT_KEY);
          localStorage.removeItem(DRAFT_ID_KEY);
          setSubmit("success");
          return;
        }
        throw new Error("failed");
      } catch {
        attempt++;
        if (attempt < MAX_RETRIES) await sleep(800 * Math.pow(2, attempt));
        else setSubmit("failed");
      }
    }
  };

  const clearDraft = async () => {
    if (!confirm("Clear all saved progress and start fresh?")) return;
    const draftId = getDraftId();
    localStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem(DRAFT_ID_KEY);
    try {
      await fetch(`/api/draft?draftId=${draftId}`, { method: "DELETE" });
    } catch {}
    setForm({});
    setSave(null);
  };

  if (!ready) return null;

  const isCouples = form.groupPreference === "couples";
  const isSponsored = form.participationType === "sponsored";
  const isCoSponsor = form.participationType === "co-sponsor";

  const baseFee = form.gender === "Female" ? 2999 : 3999;
  const partnerFee =
    form.couplePartnerGender === "Female"
      ? 2999
      : form.couplePartnerGender === "Male"
        ? 3999
        : null;
  const totalFee =
    isCouples && form.payingForBoth && partnerFee
      ? baseFee + partnerFee
      : baseFee;

  return (
    <>
      <SubmitOverlay
        state={submitState}
        retryCount={retryCount}
        onRetry={() => {
          setSubmit(null);
          doSubmit();
        }}
        onReset={() => {
          localStorage.removeItem(DRAFT_KEY);
          localStorage.removeItem(DRAFT_ID_KEY);
          setForm({});
          setSave(null);
          setSubmit(null);
        }}
      />

      <StickySaveBar
        status={saveStatus}
        online={online}
        onRetry={() => syncDraft(form)}
        onClear={clearDraft}
        hasData={Object.keys(form).length > 0}
      />

      <div className="max-w-xl mx-auto px-4 pt-8 pb-16 space-y-5">
        {/* Hero */}
        <div className="text-center pb-2">
          {/* <p className="text-4xl mb-3">☕</p> */}
          <h1 className="text-2xl font-semibold text-stone-800 mt-5">
            Meet New People Over Coffee ☕
          </h1>
          <h1 className="text-2xl font-medium text-stone-800 mt-1">
            Travel if it clicks ✈️
          </h1>
          <p className="text-md text-stone-500 mt-1 max-w-xs mx-auto leading-relaxed">
            curated groups · Real. No pressure.
          </p>
        </div>

        {/* Offline banner */}
        {!online && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 flex items-start gap-3">
            <FiWifiOff className="text-amber-600 shrink-0 mt-0.5" size={16} />
            <div>
              <p className="text-sm font-semibold text-amber-800">
                You're offline
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Everything is saved on this device. Submission will work once
                you're back online.
              </p>
            </div>
          </div>
        )}

        {/* ── 1. Basic Details ── */}
        <div className="section-card space-y-4">
          <SectionTitle
            icon={<FiUser size={15} />}
            title="Basic Details"
            subtitle="Tell us who you are."
          />

          <div className="grid grid-cols-2 gap-3">
            <div data-error={errors.firstName ? true : undefined}>
              <TextInput
                label="First Name *"
                name="firstName"
                value={form.firstName}
                onChange={update}
                placeholder="First name"
                error={errors.firstName}
              />
            </div>
            <div data-error={errors.lastName ? true : undefined}>
              <TextInput
                label="Last Name *"
                name="lastName"
                value={form.lastName}
                onChange={update}
                placeholder="Last name"
                error={errors.lastName}
              />
            </div>
          </div>

          <div data-error={errors.phone ? true : undefined}>
            <TextInput
              label="Phone Number *"
              icon={<FiPhone size={14} />}
              name="phone"
              value={form.phone}
              onChange={update}
              placeholder="+91 98765 43210"
              type="tel"
              error={errors.phone}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div data-error={errors.age ? true : undefined}>
              <TextInput
                label="Age * (21+)"
                name="age"
                value={form.age}
                onChange={update}
                placeholder="25"
                type="number"
                error={errors.age}
              />
            </div>
            <div data-error={errors.gender ? true : undefined}>
              <RadioGroup
                label="Gender *"
                name="gender"
                value={form.gender}
                onChange={update}
                options={["Male", "Female"]}
              />
              {errors.gender && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1 font-medium">
                  <FiAlertCircle size={10} /> {errors.gender}
                </p>
              )}
            </div>
          </div>

          <div data-error={errors.city ? true : undefined}>
            <CitySelect
              value={form.city}
              onChange={update}
              error={errors.city}
            />
          </div>

          <TextInput
            label="Profession"
            icon={<FiBriefcase size={14} />}
            name="profession"
            value={form.profession}
            onChange={update}
            placeholder="What do you do?"
            optional
          />
        </div>

        {/* ── 2. Age Confirmation ── */}
        <div className="section-card space-y-3">
          <SectionTitle icon={<FiCheck size={15} />} title="Age Confirmation" />
          <div data-error={errors.ageConfirmed ? true : undefined}>
            <CheckboxField
              name="ageConfirmed"
              label="I confirm I am 21 years or older"
              checked={form.ageConfirmed}
              onChange={update}
            />
            {errors.ageConfirmed && (
              <p className="text-red-600 text-xs mt-1 flex items-center gap-1 font-medium">
                <FiAlertCircle size={10} /> {errors.ageConfirmed}
              </p>
            )}
          </div>
        </div>

        {/* ── 3. Coffee Experience Slot ── */}
        <div className="section-card space-y-4">
          <SectionTitle
            icon={<FiCalendar size={15} />}
            title="Coffee Experience Slot"
            subtitle="Pick your preferred date."
          />
          <TextInput
            label="Preferred Date"
            icon={<FiCalendar size={14} />}
            name="preferredDate"
            value={form.preferredDate}
            onChange={update}
            type="date"
          />
          {form.preferredDate && (
            <p className="text-xs text-stone-600 -mt-2 font-medium">
              {new Date(form.preferredDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </div>

        {/* ── 4. Participation Type ── */}
        <div className="section-card space-y-4">
          <SectionTitle
            icon={<FiHeart size={15} />}
            title="Participation Type"
            subtitle="How are you joining?"
          />

          <div className="space-y-3">
            <CheckboxField
              name="participationType"
              label="I will pay for myself"
              checked={form.participationType === "self"}
              onChange={() =>
                update(
                  "participationType",
                  form.participationType === "self" ? "" : "self",
                )
              }
            />
            <CheckboxField
              name="participationType"
              label="I can co-sponsor someone"
              checked={form.participationType === "co-sponsor"}
              onChange={() =>
                update(
                  "participationType",
                  form.participationType === "co-sponsor" ? "" : "co-sponsor",
                )
              }
            />
            <CheckboxField
              name="participationType"
              label="I am open to being sponsored"
              checked={form.participationType === "sponsored"}
              onChange={() =>
                update(
                  "participationType",
                  form.participationType === "sponsored" ? "" : "sponsored",
                )
              }
            />
          </div>

          {isSponsored && (
            <TextArea
              label="Why should we consider you?"
              name="sponsorReason"
              value={form.sponsorReason}
              onChange={update}
              placeholder="Tell us about yourself and why you'd be a great travel companion..."
              rows={3}
              optional
            />
          )}

          {isCoSponsor && (
            <div className="space-y-3">
              <p className="text-xs text-stone-600 font-medium leading-relaxed">
                If sponsoring, who would you like to sponsor for this trip? (1
                person, same trip budget as yours)
              </p>
              <RadioGroup
                label="Sponsor preference"
                name="sponsorPreference"
                value={form.sponsorPreference}
                onChange={update}
                options={["Male", "Female", "No preference"]}
              />
            </div>
          )}

          {(isSponsored || isCoSponsor) && (
            <CheckboxField
              name="sponsorConsent"
              label="I understand sponsorship has no expectations attached"
              checked={form.sponsorConsent}
              onChange={update}
            />
          )}
        </div>

        {/* ── 5. Lifestyle ── */}
        <div className="section-card space-y-5">
          <SectionTitle
            icon={<MdOutlineLocalBar size={15} />}
            title="Lifestyle"
            subtitle="Be honest — it helps with better matching."
          />

          <div className="space-y-2">
            <RadioGroup
              label="Drinking"
              name="drinking"
              value={form.drinking}
              onChange={update}
              options={[
                { value: "no", label: "No" },
                { value: "social", label: "Social" },
                { value: "occasional", label: "Occasional" },
              ]}
              locked={form.preferNonDrinking}
            />
            <CheckboxField
              name="preferNonDrinking"
              label="I only want a non-drinking group"
              checked={form.preferNonDrinking}
              onChange={update}
              hint="Drinking preference auto-set to No"
            />
          </div>

          <div className="space-y-2">
            <RadioGroup
              label="Smoking"
              name="smoking"
              value={form.smoking}
              onChange={update}
              options={[
                { value: "non-smoker", label: "Non-smoker" },
                { value: "smoker", label: "Smoker" },
              ]}
              locked={form.preferNonSmoking}
            />
            <CheckboxField
              name="preferNonSmoking"
              label="I only want a non-smoking group"
              checked={form.preferNonSmoking}
              onChange={update}
              hint="Smoking preference auto-set to Non-smoker"
            />
          </div>

          <div className="space-y-2">
            <RadioGroup
              label="Food Preference"
              name="food"
              value={form.food}
              onChange={update}
              options={[
                { value: "veg", label: "Veg" },
                { value: "non-veg", label: "Non-veg" },
                { value: "no-pref", label: "No preference" },
              ]}
              locked={form.preferVegGroup}
            />
            <CheckboxField
              name="preferVegGroup"
              label="I only want a veg group"
              checked={form.preferVegGroup}
              onChange={update}
              hint="Food preference auto-set to Veg"
            />
          </div>
        </div>

        {/* ── 6. Personality & Vibe ── */}
        <div className="section-card space-y-4">
          <SectionTitle
            icon={<FiUsers size={15} />}
            title="Personality & Vibe"
            subtitle="What kind of person are you?"
          />
          <RadioGroup
            label="Personality"
            name="personality"
            value={form.personality}
            onChange={update}
            options={[
              { value: "introvert", label: "Introvert" },
              { value: "balanced", label: "Balanced" },
              { value: "extrovert", label: "Extrovert" },
            ]}
          />
          <RadioGroup
            label="Conversation Style"
            name="conversation"
            value={form.conversation}
            onChange={update}
            options={[
              { value: "deep", label: "Deep" },
              { value: "fun", label: "Fun" },
              { value: "networking", label: "Networking" },
            ]}
          />
        </div>

        {/* ── 7. Group Preference ── */}
        <div className="section-card space-y-4">
          <SectionTitle
            icon={<FiUsers size={15} />}
            title="Group Preference (Travel)"
          />
          <RadioGroup
            name="groupPreference"
            value={form.groupPreference}
            onChange={update}
            options={[
              { value: "all-men", label: "Only men" },
              { value: "all-women", label: "Only women" },
              { value: "mixed", label: "Both Men and Women" },
              { value: "couples", label: "Couples only" },
            ]}
          />

          {isCouples && (
            <div className="space-y-3 pt-1 border-t border-coffee-100">
              <TextInput
                label="Partner's Name"
                icon={<FiHeart size={14} />}
                name="partnerName"
                value={form.partnerName}
                onChange={update}
                placeholder="Your partner's full name"
              />
              <CheckboxField
                name="bothWillAttend"
                label="We will both attend the coffee experience to explore compatibility for the trip & both are 21+ age"
                checked={form.bothWillAttend}
                onChange={update}
              />
              <CheckboxField
                name="payingForBoth"
                label="I will cover payment for both"
                checked={form.payingForBoth}
                onChange={update}
              />
              {form.payingForBoth && (
                <div>
                  <p className="text-xs text-stone-600 font-medium mb-2">
                    Partner's gender (for pricing)
                  </p>
                  <RadioGroup
                    name="couplePartnerGender"
                    value={form.couplePartnerGender}
                    onChange={update}
                    options={[
                      { value: "Male", label: "Male (₹3,999)" },
                      { value: "Female", label: "Female (₹2,999)" },
                    ]}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── 8. Language Comfort ── */}
        <div className="section-card space-y-3">
          <SectionTitle icon={<FiGlobe size={15} />} title="Language Comfort" />
          <MultiCheckbox
            name="languages"
            selected={form.languages}
            onChange={update}
            options={[
              { value: "english", label: "English" },
              { value: "hindi", label: "Hindi" },
              { value: "telugu", label: "Telugu" },
              { value: "all", label: "Comfortable with all" },
            ]}
          />
        </div>

        {/* ── 9. Trip Intent ── */}
        <div className="section-card space-y-4">
          <SectionTitle
            icon={<MdOutlineDirectionsBus size={15} />}
            title="Trip Intent"
            subtitle="Open to travel after the coffee meetup?"
          />

          <RadioGroup
            name="tripIntent"
            value={form.tripIntent}
            onChange={update}
            options={[
              { value: "no", label: "Not interested" },
              { value: "maybe", label: "Maybe" },
              { value: "yes", label: "Yes" },
            ]}
          />

          <div className="space-y-4 pt-2 border-t border-coffee-100">
            <RadioGroup
              label="Trip Type"
              name="tripType"
              value={form.tripType}
              onChange={update}
              options={[
                { value: "local", label: "Local (1–2 days)" },
                { value: "domestic", label: "Domestic (3–8 days)" },
                { value: "international", label: "International" },
              ]}
            />

            <div>
              <RadioGroup
                label="My Trip Budget (per head)"
                name="budget"
                value={form.budget}
                onChange={update}
                options={[
                  { value: "5k-10k", label: "₹5k–₹10k" },
                  { value: "10k-30k", label: "₹10k–₹30k" },
                  { value: "30k-1L", label: "₹30k–₹1L" },
                  { value: "1L-2L", label: "₹1L–₹2L" },
                  { value: "2L+", label: "₹2L+" },
                ]}
              />
              {(isCoSponsor || (isCouples && form.payingForBoth)) && (
                <p className="text-xs text-stone-600 mt-1.5 font-medium">
                  If sponsoring, the sponsored person's trip budget will match
                  as yours — or even for couple per head.
                </p>
              )}
            </div>

            <RadioGroup
              label="Travel Timing for the Trip"
              name="travelTiming"
              value={form.travelTiming}
              onChange={update}
              options={[
                { value: "immediate", label: "Immediate" },
                { value: "this-weekend", label: "This weekend" },
                { value: "next-weekend", label: "Next weekend" },
                { value: "1-month", label: "Within 1 month" },
                { value: "exploring", label: "Just exploring" },
              ]}
            />
          </div>
        </div>

        {/* ── 10. Pricing ── */}
        <div className="bg-coffee-50 border border-coffee-200 rounded-2xl p-5">
          <p className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
            Pricing
          </p>
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-1">
              <p className="text-sm text-stone-800">
                <span className="font-bold">Men:</span> ₹3,999
              </p>
              <p className="text-sm text-stone-800">
                <span className="font-bold">Women:</span> ₹2,999
              </p>
            </div>
            {form.gender && (
              <div className="text-right">
                <p className="text-xs text-stone-600 font-medium">
                  {isCouples && form.payingForBoth && partnerFee
                    ? "Total (both)"
                    : "Your fee"}
                </p>
                <p className="text-2xl font-bold text-coffee-700">
                  ₹{totalFee.toLocaleString("en-IN")}
                </p>
                {isCouples && form.payingForBoth && partnerFee && (
                  <p className="text-xs text-stone-500 font-medium">
                    ₹{baseFee.toLocaleString("en-IN")} + ₹
                    {partnerFee.toLocaleString("en-IN")}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div data-error={errors.consentRedeemable ? true : undefined}>
              <CheckboxField
                name="consentRedeemable"
                label="I understand ₹1,000 is redeemable at the café (food & beverages)"
                checked={form.consentRedeemable}
                onChange={update}
              />
              {errors.consentRedeemable && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1 font-medium">
                  <FiAlertCircle size={10} /> {errors.consentRedeemable}
                </p>
              )}
            </div>
            <div data-error={errors.consentExperience ? true : undefined}>
              <CheckboxField
                name="consentExperience"
                label="I understand this payment is for a curated coffee experience to meet new people before planning a trip"
                checked={form.consentExperience}
                onChange={update}
              />
              {errors.consentExperience && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1 font-medium">
                  <FiAlertCircle size={10} /> {errors.consentExperience}
                </p>
              )}
            </div>
            <div data-error={errors.consentNoTrip ? true : undefined}>
              <CheckboxField
                name="consentNoTrip"
                label="I understand no trip is included in this booking. Any trip may happen later based on group compatibility"
                checked={form.consentNoTrip}
                onChange={update}
              />
              {errors.consentNoTrip && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1 font-medium">
                  <FiAlertCircle size={10} /> {errors.consentNoTrip}
                </p>
              )}
            </div>
            <div data-error={errors.consentNoRefund ? true : undefined}>
              <CheckboxField
                name="consentNoRefund"
                label="I understand this booking is non-refundable"
                checked={form.consentNoRefund}
                onChange={update}
              />
              {errors.consentNoRefund && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1 font-medium">
                  <FiAlertCircle size={10} /> {errors.consentNoRefund}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── 11. Intent ── */}
        <div className="section-card space-y-4">
          <SectionTitle icon={<FiGlobe size={15} />} title="Your Intent" />
          <RadioGroup
            name="intent"
            value={form.intent}
            onChange={update}
            options={[
              { value: "meet-people", label: "Meet new people" },
              { value: "travel", label: "Travel experiences" },
              { value: "both", label: "Open to both" },
            ]}
          />
        </div>

        {/* ── Total Amount Summary ── */}
        {form.gender && (
          <div className="bg-coffee-600 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-coffee-200 mb-1">
                  {isCouples && form.payingForBoth && partnerFee
                    ? "Total Amount (both)"
                    : "Your Booking Amount"}
                </p>
                <p className="text-3xl font-bold">
                  ₹{totalFee.toLocaleString("en-IN")}
                </p>
                {isCouples && form.payingForBoth && partnerFee ? (
                  <p className="text-xs text-coffee-200 mt-1 font-medium">
                    You ({form.gender}) ₹{baseFee.toLocaleString("en-IN")} +
                    Partner ({form.couplePartnerGender}) ₹
                    {partnerFee.toLocaleString("en-IN")}
                  </p>
                ) : (
                  <p className="text-xs text-coffee-200 mt-1">
                    Includes ₹1,000 redeemable at the café
                  </p>
                )}
              </div>
              <div className="text-4xl">☕</div>
            </div>
          </div>
        )}

        {/* ── Submit ── */}
        <div className="pt-2 space-y-3 pb-6">
          {!online && (
            <div className="flex items-center gap-2 justify-center text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 font-medium">
              <FiWifiOff size={13} />
              You're offline — reconnect to submit.
            </div>
          )}

          <button
            onClick={doSubmit}
            disabled={!online}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
          >
            <FiSend size={15} /> Book My Slot
          </button>

          <p className="text-center text-xs text-stone-500 pt-1">
            By submitting, you agree to be contacted on WhatsApp for group
            updates.
          </p>
        </div>
      </div>
    </>
  );
}
