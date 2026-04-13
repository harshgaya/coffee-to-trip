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
} from "react-icons/fi";
import {
  MdOutlineDirectionsBus,
  MdOutlineSmokingRooms,
  MdOutlineLocalBar,
  MdOutlineFastfood,
} from "react-icons/md";

const LANGUAGES = [
  "Hindi",
  "English",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Marathi",
  "Bengali",
  "Punjabi",
  "Gujarati",
];
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
      <div className="flex items-center gap-2 text-xs text-coffee-500">
        <FiLoader size={11} className="animate-spin shrink-0" />
        <span>Saving...</span>
      </div>
    );
  } else if (status === "saved") {
    content = (
      <div className="flex items-center gap-2 text-xs text-green-600">
        <FiCheck size={11} className="shrink-0" />
        <span>All changes saved</span>
      </div>
    );
  } else if (status === "restored") {
    content = (
      <div className="flex items-center gap-2 text-xs text-coffee-600">
        <FiClock size={11} className="shrink-0" />
        <span>Draft restored</span>
      </div>
    );
  } else if (status === "error") {
    content = (
      <div className="flex items-center gap-2 text-xs text-red-600">
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
        <div className="bg-white/90 backdrop-blur-sm border border-coffee-100 rounded-xl px-3 py-2 shadow-sm flex items-center justify-between">
          <div>{content}</div>
          {hasData && (
            <button
              onClick={onClear}
              className="text-xs text-coffee-300 hover:text-red-400 transition-colors ml-3 shrink-0"
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
          <p className="font-semibold text-charcoal">
            Submitting your profile...
          </p>
          {retryCount > 0 && (
            <p className="text-xs text-coffee-500 mt-1">
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
          <h2 className="text-2xl font-bold text-charcoal mb-2">
            You're on the list!
          </h2>
          <p className="text-sm text-coffee-600 leading-relaxed mb-6">
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
                "Coffee meetup → Group trip planning",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-coffee-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-xs text-charcoal">{step}</p>
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
            <FiAlertCircle className="text-red-500 text-2xl" />
          </div>
          <h2 className="text-lg font-bold text-charcoal mb-2">
            Submission failed
          </h2>
          <p className="text-sm text-coffee-600 mb-6 leading-relaxed">
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

function Label({ children }) {
  return <label className="field-label">{children}</label>;
}

function SelectInput({
  label,
  icon,
  name,
  options,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-400 pointer-events-none">
            {icon}
          </span>
        )}
        <select
          value={value || ""}
          onChange={(e) => onChange(name, e.target.value)}
          className={`field-select ${icon ? "pl-9" : ""} pr-9`}
        >
          <option value="">{placeholder || `Select ${label}`}</option>
          {options.map((o) => (
            <option key={o.value || o} value={o.value || o}>
              {o.label || o}
            </option>
          ))}
        </select>
        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-coffee-400 pointer-events-none text-sm" />
      </div>
    </div>
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
}) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-400 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value || ""}
          placeholder={placeholder || label}
          onChange={(e) => onChange(name, e.target.value)}
          className={`field-input ${icon ? "pl-9" : ""} ${
            error ? "border-red-400 focus:ring-red-400" : ""
          }`}
        />
      </div>
      {error && (
        <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
          <FiAlertCircle size={10} /> {error}
        </p>
      )}
    </div>
  );
}

function TextArea({ label, name, value, onChange, placeholder, rows = 3 }) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <textarea
        rows={rows}
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(name, e.target.value)}
        className="field-input resize-none"
      />
    </div>
  );
}

function SectionTitle({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-coffee-100">
      <div className="w-8 h-8 rounded-lg bg-coffee-100 flex items-center justify-center text-coffee-600 shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-charcoal">{title}</p>
        {subtitle && (
          <p className="text-xs text-coffee-400 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function LanguageSelector({ selected, onChange }) {
  const toggle = (lang) => {
    const current = selected || [];
    const updated = current.includes(lang)
      ? current.filter((l) => l !== lang)
      : [...current, lang];
    onChange("languages", updated);
  };
  return (
    <div>
      <Label>Languages you speak</Label>
      <div className="flex flex-wrap gap-2 mt-1.5">
        {LANGUAGES.map((lang) => {
          const sel = (selected || []).includes(lang);
          return (
            <button
              key={lang}
              type="button"
              onClick={() => toggle(lang)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 active:scale-95 ${
                sel
                  ? "bg-coffee-600 text-white border-coffee-600"
                  : "bg-white text-coffee-600 border-coffee-200 hover:border-coffee-400"
              }`}
            >
              {lang}
            </button>
          );
        })}
      </div>
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

  // ── Restore on mount ───────────────────────────────────────────────────────
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

  // ── Flush pending sync when back online ───────────────────────────────────
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

  // ── Sync to DB ─────────────────────────────────────────────────────────────
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

  // ── Watch form ─────────────────────────────────────────────────────────────
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

  // ── Update field ───────────────────────────────────────────────────────────
  const update = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  // ── Validate ───────────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.name?.trim()) errs.name = "Name is required";
    if (!form.phone?.trim()) errs.phone = "Phone number is required";
    if (!form.city?.trim()) errs.city = "City is required";
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setTimeout(() => {
        document.querySelector("[data-error]")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 50);
    }
    return Object.keys(errs).length === 0;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const doSubmit = async () => {
    if (!validate()) return;
    if (!online) {
      setSave("error");
      return;
    }

    setSubmit("submitting");
    setRetry(0);

    let attempt = 0;
    while (attempt < MAX_RETRIES) {
      try {
        setRetry(attempt);
        const data = await fetchWithRetry(
          "/api/signup",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          },
          1,
        );
        if (data.success) {
          const draftId = getDraftId();
          localStorage.removeItem(DRAFT_KEY);
          localStorage.removeItem(DRAFT_ID_KEY);
          try {
            await fetch(`/api/draft?draftId=${draftId}`, { method: "DELETE" });
          } catch {}
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

  // ── Clear draft ────────────────────────────────────────────────────────────
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

      {/* ── Sticky Save Bar — always visible on scroll ── */}
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
          <p className="text-4xl mb-3">☕</p>
          <h1 className="text-2xl font-bold text-charcoal">
            Join CoffeeToTrip
          </h1>
          <p className="text-sm text-coffee-500 mt-1 max-w-xs mx-auto leading-relaxed">
            Fill in your profile. We'll manually match you with your ideal
            travel crew.
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

        {/* ── 1. Basic Info ── */}
        <div className="section-card space-y-4">
          <SectionTitle
            icon={<FiUser size={15} />}
            title="Basic Info"
            subtitle="Tell us who you are."
          />

          <div data-error={errors.name ? true : undefined}>
            <TextInput
              label="Full Name *"
              icon={<FiUser size={14} />}
              name="name"
              value={form.name}
              onChange={update}
              placeholder="Your full name"
              error={errors.name}
            />
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
            <TextInput
              label="Age"
              name="age"
              value={form.age}
              onChange={update}
              placeholder="25"
              type="number"
            />
            <SelectInput
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={update}
              placeholder="Select"
              options={["Male", "Female", "Non-binary", "Prefer not to say"]}
            />
          </div>

          <div data-error={errors.city ? true : undefined}>
            <TextInput
              label="City *"
              icon={<FiMapPin size={14} />}
              name="city"
              value={form.city}
              onChange={update}
              placeholder="Where are you based?"
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
          />

          <LanguageSelector selected={form.languages} onChange={update} />
        </div>

        {/* ── 2. Participation ── */}
        <div className="section-card space-y-4">
          <SectionTitle
            icon={<FiHeart size={15} />}
            title="Participation Type"
            subtitle="How are you joining?"
          />

          <SelectInput
            label="How are you joining?"
            name="participationType"
            value={form.participationType}
            onChange={update}
            options={[
              { value: "self", label: "Self-funded (paying myself)" },
              { value: "co-sponsor", label: "Co-sponsor (split with someone)" },
              { value: "sponsored", label: "Sponsored (looking for sponsor)" },
            ]}
          />

          {form.participationType === "sponsored" && (
            <TextArea
              label="Why should we consider you for sponsorship?"
              name="sponsorReason"
              value={form.sponsorReason}
              onChange={update}
              placeholder="Tell us about yourself and why you'd be a great travel companion..."
              rows={4}
            />
          )}

          {form.participationType === "co-sponsor" && (
            <SelectInput
              label="Co-sponsor gender preference"
              name="sponsorPreference"
              value={form.sponsorPreference}
              onChange={update}
              options={["Male", "Female", "No preference"]}
            />
          )}
        </div>

        {/* ── 3. Lifestyle ── */}
        <div className="section-card space-y-4">
          <SectionTitle
            icon={<MdOutlineLocalBar size={15} />}
            title="Lifestyle"
            subtitle="Be honest — it helps with better matching."
          />

          <SelectInput
            label="Drinking"
            icon={<MdOutlineLocalBar size={14} />}
            name="drinking"
            value={form.drinking}
            onChange={update}
            options={[
              { value: "no", label: "Don't drink" },
              { value: "social", label: "Social drinker" },
              { value: "occasional", label: "Occasional" },
              { value: "regular", label: "Regular" },
            ]}
          />

          <SelectInput
            label="Smoking"
            icon={<MdOutlineSmokingRooms size={14} />}
            name="smoking"
            value={form.smoking}
            onChange={update}
            options={[
              { value: "non-smoker", label: "Non-smoker" },
              { value: "smoker", label: "Smoker" },
              { value: "prefer-non", label: "Prefer non-smoking company" },
            ]}
          />

          <SelectInput
            label="Food preference"
            icon={<MdOutlineFastfood size={14} />}
            name="food"
            value={form.food}
            onChange={update}
            options={[
              "Vegetarian",
              "Vegan",
              "Non-vegetarian",
              "Jain",
              "No preference",
            ]}
          />
        </div>

        {/* ── 4. Vibe & Group ── */}
        <div className="section-card space-y-4">
          <SectionTitle
            icon={<FiUsers size={15} />}
            title="Vibe & Group Fit"
            subtitle="What kind of traveller are you?"
          />

          <SelectInput
            label="Personality type"
            name="personality"
            value={form.personality}
            onChange={update}
            options={[
              "Introvert — need quiet time to recharge",
              "Extrovert — energised by people",
              "Ambivert — depends on the mood",
              "The planner — always has an itinerary",
              "The free spirit — goes with the flow",
            ]}
          />

          <SelectInput
            label="Conversation style"
            name="conversation"
            value={form.conversation}
            onChange={update}
            options={[
              "Deep talks — philosophy, life",
              "Light & fun — memes, travel stories",
              "Mostly listen, occasionally share",
              "Whatever the vibe calls for",
            ]}
          />

          <SelectInput
            label="Group type preference"
            name="groupPreference"
            value={form.groupPreference}
            onChange={update}
            options={[
              { value: "all-men", label: "All men" },
              { value: "all-women", label: "All women" },
              { value: "mixed", label: "Mixed group" },
              { value: "couples", label: "Couples only" },
              { value: "no-preference", label: "No preference" },
            ]}
          />

          {form.groupPreference === "couples" && (
            <TextInput
              label="Partner's Name"
              icon={<FiHeart size={14} />}
              name="partnerName"
              value={form.partnerName}
              onChange={update}
              placeholder="Your partner's full name"
            />
          )}
        </div>

        {/* ── 5. Trip Details ── */}
        <div className="section-card space-y-4">
          <SectionTitle
            icon={<MdOutlineDirectionsBus size={15} />}
            title="Trip Details"
            subtitle="Your travel intent and budget."
          />

          <SelectInput
            label="Are you open to going on a trip?"
            name="tripIntent"
            value={form.tripIntent}
            onChange={update}
            options={[
              { value: "yes", label: "Yes — let's go!" },
              { value: "maybe", label: "Maybe — depends on the group" },
              { value: "no", label: "Not right now — just coffee meetups" },
            ]}
          />

          {(form.tripIntent === "yes" || form.tripIntent === "maybe") && (
            <>
              <SelectInput
                label="Trip type preference"
                name="tripType"
                value={form.tripType}
                onChange={update}
                options={[
                  { value: "local", label: "Local (day trip / weekend)" },
                  { value: "domestic", label: "Domestic (within India)" },
                  { value: "international", label: "International" },
                  { value: "any", label: "Open to anything" },
                ]}
              />
              <SelectInput
                label="Budget per trip (approx.)"
                name="budget"
                value={form.budget}
                onChange={update}
                options={[
                  { value: "5k-10k", label: "₹5,000 – ₹10,000" },
                  { value: "10k-30k", label: "₹10,000 – ₹30,000" },
                  { value: "30k-1L", label: "₹30,000 – ₹1,00,000" },
                  { value: "1L+", label: "₹1,00,000+" },
                ]}
              />
              <SelectInput
                label="When are you ready?"
                name="readiness"
                value={form.readiness}
                onChange={update}
                options={[
                  { value: "immediate", label: "Immediately — let's plan now" },
                  { value: "1month", label: "Within a month" },
                  { value: "3months", label: "Next 3 months" },
                  {
                    value: "flexible",
                    label: "Flexible — whenever it happens",
                  },
                ]}
              />
            </>
          )}
        </div>

        {/* ── 6. Final Words ── */}
        <div className="section-card space-y-4">
          <SectionTitle
            icon={<FiGlobe size={15} />}
            title="Final Words"
            subtitle="Optional but helpful."
          />

          <SelectInput
            label="Your primary intent for joining"
            name="intent"
            value={form.intent}
            onChange={update}
            options={[
              "Just looking to make travel friends",
              "Find a consistent travel buddy",
              "Social meetups first, trips later",
              "Serious about planning a trip ASAP",
            ]}
          />

          <TextArea
            label="Any travel history you'd like to share?"
            name="history"
            value={form.history}
            onChange={update}
            placeholder="Places you've been, best memories, bucket list destinations..."
            rows={4}
          />
        </div>

        {/* ── Submit ── */}
        <div className="pt-2 space-y-3 pb-6">
          {!online && (
            <div className="flex items-center gap-2 justify-center text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
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

          <p className="text-center text-xs text-coffee-400 pt-1">
            By submitting, you agree to be contacted on WhatsApp for group
            updates.
          </p>
        </div>
      </div>
    </>
  );
}
