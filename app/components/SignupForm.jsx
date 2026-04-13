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
          className={`field-input ${icon ? "pl-9" : ""}`}
        />
      </div>
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

export default function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name?.trim()) errs.name = "Name is required";
    if (!form.phone?.trim()) errs.phone = "Phone is required";
    if (!form.city?.trim()) errs.city = "City is required";
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      // scroll to first error
      const first = document.querySelector(".error-msg");
      if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
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
    } catch {
      alert("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-5">
      {/* Hero */}
      <div className="text-center pb-2">
        <p className="text-4xl mb-3">☕</p>
        <h1 className="text-2xl font-bold text-charcoal">Join CoffeeToTrip</h1>
        <p className="text-sm text-coffee-500 mt-1 max-w-sm mx-auto">
          Fill in your profile below. We'll manually match you with your ideal
          travel crew.
        </p>
      </div>

      {/* ── 1. Basic Info ── */}
      <div className="section-card space-y-4">
        <SectionTitle
          icon={<FiUser size={15} />}
          title="Basic Info"
          subtitle="Tell us who you are."
        />

        <TextInput
          label="Full Name *"
          icon={<FiUser size={14} />}
          name="name"
          value={form.name}
          onChange={update}
          placeholder="Your full name"
        />
        {errors.name && (
          <p className="error-msg text-red-500 text-xs -mt-2">{errors.name}</p>
        )}

        <TextInput
          label="Phone Number *"
          icon={<FiPhone size={14} />}
          name="phone"
          value={form.phone}
          onChange={update}
          placeholder="+91 98765 43210"
          type="tel"
        />
        {errors.phone && (
          <p className="error-msg text-red-500 text-xs -mt-2">{errors.phone}</p>
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
            options={["Male", "Female", "Non-binary", "Prefer not to say"]}
          />
        </div>

        <TextInput
          label="City *"
          icon={<FiMapPin size={14} />}
          name="city"
          value={form.city}
          onChange={update}
          placeholder="Where are you based?"
        />
        {errors.city && (
          <p className="error-msg text-red-500 text-xs -mt-2">{errors.city}</p>
        )}

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

      {/* ── 4. Personality & Group ── */}
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
          subtitle="Tell us your travel intent and budget."
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
                { value: "flexible", label: "Flexible — whenever it happens" },
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
          placeholder="Places you've been, best travel memories, bucket list destinations..."
          rows={4}
        />
      </div>

      {/* ── Submit ── */}
      <div className="pt-2 pb-8">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin" /> Submitting...
            </>
          ) : (
            <>
              <FiSend /> Book My Slot
            </>
          )}
        </button>
        <p className="text-center text-xs text-coffee-400 mt-3">
          By submitting, you agree to be contacted on WhatsApp for group
          updates.
        </p>
      </div>
    </div>
  );
}
