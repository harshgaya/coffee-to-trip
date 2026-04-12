"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
} from "react-icons/fi";
import {
  MdOutlineCoffee,
  MdOutlineDirectionsBus,
  MdOutlineSmokingRooms,
  MdOutlineLocalBar,
  MdOutlineFastfood,
  MdOutlineGroup,
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
      {label && <label className="field-label">{label}</label>}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-400 text-base pointer-events-none">
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
}) {
  return (
    <div>
      {label && <label className="field-label">{label}</label>}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-400 text-base pointer-events-none">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value || ""}
          placeholder={placeholder || label}
          onChange={(e) => onChange(name, e.target.value)}
          className={`field-input ${icon ? "pl-9" : ""}`}
        />
      </div>
    </div>
  );
}

function TextArea({ label, name, value, onChange, placeholder, rows = 3 }) {
  return (
    <div>
      {label && <label className="field-label">{label}</label>}
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

function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="w-9 h-9 rounded-xl bg-coffee-100 flex items-center justify-center text-coffee-600 text-lg shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <h2 className="text-base font-bold text-charcoal">{title}</h2>
        {subtitle && (
          <p className="text-xs text-coffee-500 mt-0.5">{subtitle}</p>
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
      <label className="field-label">Languages you speak</label>
      <div className="flex flex-wrap gap-2 mt-1">
        {LANGUAGES.map((lang) => {
          const isSelected = (selected || []).includes(lang);
          return (
            <button
              key={lang}
              type="button"
              onClick={() => toggle(lang)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
                isSelected
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

function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center gap-1.5 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i < current
              ? "bg-coffee-500 w-5"
              : i === current
                ? "bg-coffee-400 w-8"
                : "bg-coffee-200 w-5"
          }`}
        />
      ))}
    </div>
  );
}

export default function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({});
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validateStep = () => {
    const errs = {};
    if (step === 0) {
      if (!form.name?.trim()) errs.name = "Required";
      if (!form.phone?.trim()) errs.phone = "Required";
      if (!form.city?.trim()) errs.city = "Required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const TOTAL_STEPS = 4;

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/success");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (e) {
      alert("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-coffee-100">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MdOutlineCoffee className="text-coffee-600 text-xl" />
            <span className="font-bold text-coffee-800 text-base">
              CoffeeToTrips
            </span>
          </div>
          <StepIndicator current={step} total={TOTAL_STEPS} />
          <span className="text-xs text-coffee-500 font-medium">
            {step + 1} / {TOTAL_STEPS}
          </span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* ─── STEP 0: About You ─── */}
        {step === 0 && (
          <>
            <div className="text-center py-4">
              <p className="text-3xl mb-2">☕</p>
              <h1 className="text-2xl font-bold text-charcoal">
                Let's get you started
              </h1>
              <p className="text-sm text-coffee-500 mt-1">
                Basic details first. Quick & easy.
              </p>
            </div>

            <div className="section-card space-y-4">
              <SectionHeader icon={<FiUser />} title="About You" />

              <TextInput
                label="Full Name"
                icon={<FiUser className="text-sm" />}
                name="name"
                value={form.name}
                onChange={update}
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs -mt-2">{errors.name}</p>
              )}

              <TextInput
                label="Phone Number"
                icon={<FiPhone className="text-sm" />}
                name="phone"
                value={form.phone}
                onChange={update}
                placeholder="+91 98765 43210"
                type="tel"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs -mt-2">{errors.phone}</p>
              )}

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
                  options={[
                    "Male",
                    "Female",
                    "Non-binary",
                    "Prefer not to say",
                  ]}
                />
              </div>

              <TextInput
                label="City"
                icon={<FiMapPin className="text-sm" />}
                name="city"
                value={form.city}
                onChange={update}
                placeholder="Where are you based?"
              />
              {errors.city && (
                <p className="text-red-500 text-xs -mt-2">{errors.city}</p>
              )}

              <TextInput
                label="Profession"
                icon={<FiBriefcase className="text-sm" />}
                name="profession"
                value={form.profession}
                onChange={update}
                placeholder="What do you do?"
              />

              <LanguageSelector selected={form.languages} onChange={update} />
            </div>
          </>
        )}

        {/* ─── STEP 1: Participation & Lifestyle ─── */}
        {step === 1 && (
          <>
            <div className="text-center py-4">
              <p className="text-3xl mb-2">🎟️</p>
              <h1 className="text-2xl font-bold text-charcoal">
                Participation & Lifestyle
              </h1>
              <p className="text-sm text-coffee-500 mt-1">
                Help us understand your travel style.
              </p>
            </div>

            <div className="section-card space-y-4">
              <SectionHeader
                icon={<FiHeart />}
                title="Participation Type"
                subtitle="How are you joining this trip?"
              />

              <SelectInput
                label="How are you joining?"
                name="participationType"
                value={form.participationType}
                onChange={update}
                options={[
                  { value: "self", label: "Self-funded (paying myself)" },
                  {
                    value: "co-sponsor",
                    label: "Co-sponsor (split with someone)",
                  },
                  {
                    value: "sponsored",
                    label: "Sponsored (looking for sponsor)",
                  },
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

            <div className="section-card space-y-4">
              <SectionHeader
                icon={<MdOutlineLocalBar />}
                title="Lifestyle"
                subtitle="Be honest — it helps with better matching."
              />

              <SelectInput
                label="Drinking"
                icon={<MdOutlineLocalBar />}
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
                icon={<MdOutlineSmokingRooms />}
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
                icon={<MdOutlineFastfood />}
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
          </>
        )}

        {/* ─── STEP 2: Personality & Group ─── */}
        {step === 2 && (
          <>
            <div className="text-center py-4">
              <p className="text-3xl mb-2">🧩</p>
              <h1 className="text-2xl font-bold text-charcoal">
                Vibe & Group Fit
              </h1>
              <p className="text-sm text-coffee-500 mt-1">
                What kind of traveller are you?
              </p>
            </div>

            <div className="section-card space-y-4">
              <SectionHeader
                icon={<FiUsers />}
                title="Personality"
                subtitle="Pick what describes you best."
              />

              <SelectInput
                label="Your personality type"
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
            </div>

            <div className="section-card space-y-4">
              <SectionHeader
                icon={<MdOutlineGroup />}
                title="Group Preference"
              />

              <SelectInput
                label="What group type are you comfortable with?"
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
                  icon={<FiHeart className="text-sm" />}
                  name="partnerName"
                  value={form.partnerName}
                  onChange={update}
                  placeholder="Your partner's full name"
                />
              )}
            </div>
          </>
        )}

        {/* ─── STEP 3: Trip Details ─── */}
        {step === 3 && (
          <>
            <div className="text-center py-4">
              <p className="text-3xl mb-2">✈️</p>
              <h1 className="text-2xl font-bold text-charcoal">Trip Details</h1>
              <p className="text-sm text-coffee-500 mt-1">
                Tell us your travel intent and budget.
              </p>
            </div>

            <div className="section-card space-y-4">
              <SectionHeader
                icon={<MdOutlineDirectionsBus />}
                title="Trip Intent"
              />

              <SelectInput
                label="Are you open to going on a trip?"
                name="tripIntent"
                value={form.tripIntent}
                onChange={update}
                options={[
                  { value: "yes", label: "Yes — let's go!" },
                  { value: "maybe", label: "Maybe — depends on the group" },
                  {
                    value: "no",
                    label: "Not right now — just here for coffee meetups",
                  },
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
                      {
                        value: "immediate",
                        label: "Immediately — let's plan now",
                      },
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

            <div className="section-card space-y-4">
              <SectionHeader
                icon={<FiGlobe />}
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
                placeholder="Places you've been, best travel memories, bucket list destinations..."
                rows={4}
              />
            </div>

            {/* Summary card */}
            <div className="bg-coffee-50 border border-coffee-200 rounded-2xl p-4">
              <p className="text-xs font-semibold text-coffee-700 mb-2 uppercase tracking-wide">
                Your Summary
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-coffee-800">
                {form.name && <span>👤 {form.name}</span>}
                {form.city && <span>📍 {form.city}</span>}
                {form.age && <span>🎂 {form.age} yrs</span>}
                {form.gender && <span>⚧ {form.gender}</span>}
                {form.tripIntent && <span>✈️ Trip: {form.tripIntent}</span>}
                {form.budget && <span>💰 {form.budget}</span>}
              </div>
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div
          className={`flex gap-3 pt-2 ${step === 0 ? "justify-end" : "justify-between"}`}
        >
          {step > 0 && (
            <button
              onClick={handleBack}
              className="flex-1 bg-white border border-coffee-200 text-coffee-700 font-semibold py-4 px-6 rounded-xl hover:bg-coffee-50 transition-all duration-200 text-sm"
            >
              ← Back
            </button>
          )}

          {step < TOTAL_STEPS - 1 ? (
            <button onClick={handleNext} className="btn-primary flex-1">
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <FiSend />
                  Book My Slot
                </>
              )}
            </button>
          )}
        </div>

        <p className="text-center text-xs text-coffee-400 pb-6">
          By submitting, you agree to be contacted on WhatsApp for group
          updates.
        </p>
      </div>
    </div>
  );
}
