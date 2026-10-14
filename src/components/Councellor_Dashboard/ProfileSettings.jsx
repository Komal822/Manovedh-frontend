import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  User,
  Briefcase,
  FileText,
  Bell,
  Menu,
  Check,
  Mail,
  Phone,
  Save,
  RotateCcw,
  Camera,
  Plus,
  Minus,
  X,
  Clock,
  MessageCircle,
  ChevronRight,
  Trash2,
} from "lucide-react";

import Sidebar from "./Sidebar";

/* ============================================================
    CONSTANTS
============================================================ */

const LOCAL_STORAGE_PARTNER_SESSION_KEY = "manovedh_current_partner";
const LOCAL_STORAGE_PARTNERS_KEY = "manovedh_wellness_partners";

const INK = "#16231C";
const MUTED = "#5F6F66";
const BANNER = "#032927";
const PRIMARY = "#1F6944";
const MINT = "#7FE0B5";

const BIO_LIMIT = 500;

const SPECIALIZATIONS = [
  "Clinical Psychology",
  "Counselling Psychology",
  "Child & Adolescent Therapy",
  "Couples & Family Therapy",
  "Career Counselling",
  "Psychiatry",
  "Other",
];

const LANGUAGE_SUGGESTIONS = [
  "Marathi",
  "Hindi",
  "English",
  "Gujarati",
  "Kannada",
  "Telugu",
  "Tamil",
  "Urdu",
];

const FEE_SUGGESTIONS = [500, 800, 1000, 1500];

const TABS = [
  { id: "personal", label: "Personal", icon: User },
  { id: "professional", label: "Professional", icon: Briefcase },
  { id: "about", label: "About", icon: FileText },
  { id: "notifications", label: "Alerts", icon: Bell },
];

const PREFERENCE_ITEMS = [
  {
    key: "emailNotifications",
    title: "Email notifications",
    desc: "Get an email when a patient books or cancels a session.",
    icon: Mail,
  },
  {
    key: "messageAlerts",
    title: "Message alerts",
    desc: "Show an alert when a patient sends you a new message.",
    icon: MessageCircle,
  },
  {
    key: "sessionReminders",
    title: "Session reminders",
    desc: "Remind me 30 minutes before every session.",
    icon: Clock,
  },
];

const COMPLETION_FIELDS = [
  { key: "fullName", label: "Add your full name", tab: "personal" },
  { key: "photo", label: "Add a profile photo", tab: "personal" },
  { key: "phone", label: "Add your phone number", tab: "personal" },
  { key: "languages", label: "Add the languages you speak", tab: "personal" },
  { key: "specialization", label: "Choose a specialization", tab: "professional" },
  { key: "qualification", label: "Add your qualification", tab: "professional" },
  { key: "experience", label: "Add your years of experience", tab: "professional" },
  { key: "licenseNumber", label: "Add your license number", tab: "professional" },
  { key: "sessionFee", label: "Set your session fee", tab: "professional" },
  { key: "bio", label: "Write a short bio", tab: "about" },
];

const EMPTY_FORM = {
  fullName: "",
  email: "",
  phone: "",
  photo: "",
  specialization: "",
  qualification: "",
  experience: "",
  licenseNumber: "",
  languages: "",
  sessionFee: "",
  bio: "",
  emailNotifications: true,
  messageAlerts: true,
  sessionReminders: true,
};

/* ============================================================
    HELPERS
============================================================ */

function getStoredPartner() {
  try {
    return JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_PARTNER_SESSION_KEY) || "null"
    );
  } catch (error) {
    console.error("Unable to read partner session:", error);
    return null;
  }
}

function buildFormFromPartner(partner) {
  if (!partner) return { ...EMPTY_FORM };

  return {
    ...EMPTY_FORM,
    fullName: partner.fullName || partner.name || "",
    email: partner.email || "",
    phone: partner.phone || "",
    photo: partner.photo || "",
    specialization: partner.specialization || "",
    qualification: partner.qualification || "",
    experience: partner.experience ?? "",
    licenseNumber: partner.licenseNumber || "",
    languages: Array.isArray(partner.languages)
      ? partner.languages.join(", ")
      : partner.languages || "",
    sessionFee: partner.sessionFee ?? "",
    bio: partner.bio || "",
    emailNotifications: partner.emailNotifications ?? true,
    messageAlerts: partner.messageAlerts ?? true,
    sessionReminders: partner.sessionReminders ?? true,
  };
}

function savePartnerSettings(form) {
  const currentPartner = getStoredPartner();
  if (!currentPartner) return false;

  const changes = {
    fullName: form.fullName.trim(),
    phone: form.phone.trim(),
    photo: form.photo,
    specialization: form.specialization,
    qualification: form.qualification.trim(),
    experience: form.experience,
    licenseNumber: form.licenseNumber.trim(),
    languages: form.languages.trim(),
    sessionFee: form.sessionFee,
    bio: form.bio.trim(),
    emailNotifications: form.emailNotifications,
    messageAlerts: form.messageAlerts,
    sessionReminders: form.sessionReminders,
  };

  // keep the older `name` field in sync if the account already uses it
  if ("name" in currentPartner) changes.name = changes.fullName;

  const updatedPartner = { ...currentPartner, ...changes };

  try {
    localStorage.setItem(
      LOCAL_STORAGE_PARTNER_SESSION_KEY,
      JSON.stringify(updatedPartner)
    );

    const partners = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_PARTNERS_KEY) || "[]"
    );

    const updatedPartners = partners.map((partner) =>
      partner.email?.toLowerCase() === currentPartner.email?.toLowerCase()
        ? { ...partner, ...changes }
        : partner
    );

    localStorage.setItem(
      LOCAL_STORAGE_PARTNERS_KEY,
      JSON.stringify(updatedPartners)
    );

    return true;
  } catch (error) {
    console.error("Unable to save profile settings:", error);
    return false;
  }
}

const initials = (name) =>
  (name || "")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "DR";

const parseList = (str) =>
  (str || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const isFilled = (v) => String(v ?? "").trim() !== "";

/* crop to a centred square and shrink, so the saved photo stays small */
function resizeImage(file, size = 256) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the image."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("That file is not a valid image."));
      img.onload = () => {
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        canvas.getContext("2d").drawImage(img, sx, sy, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

/* true when viewport >= 1024px (Tailwind `lg`) */
function useIsDesktop() {
  const query = "(min-width: 1024px)";
  const get = () =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia(query).matches
      : true;
  const [isDesktop, setIsDesktop] = useState(get);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e) => setIsDesktop(e.matches);
    setIsDesktop(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}

/* ============================================================
    SMALL PIECES
============================================================ */

function ProgressRing({ percent, size = 72, stroke = 7 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={MINT}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(c * percent) / 100} ${c}`}
          style={{ transition: "stroke-dasharray 600ms ease" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[15px] font-bold tabular-nums text-white sm:text-[17px]">
        {percent}%
      </span>
    </div>
  );
}

function Avatar({ photo, name, size = 96, className = "" }) {
  return photo ? (
    <img
      src={photo}
      alt=""
      className={`rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  ) : (
    <span
      aria-hidden="true"
      className={`flex items-center justify-center rounded-full font-bold text-white ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        background: `linear-gradient(135deg, #2B8A5C 0%, ${BANNER} 100%)`,
      }}
    >
      {initials(name)}
    </span>
  );
}

function SectionHead({ title, desc }) {
  return (
    <div className="mb-6">
      <h2 className="text-[18px] font-semibold sm:text-[20px]" style={{ color: INK }}>
        {title}
      </h2>
      <p className="mt-1 text-[13px] sm:text-sm" style={{ color: MUTED }}>
        {desc}
      </p>
    </div>
  );
}

function Field({ label, htmlFor, children, helper, error }) {
  return (
    <div className="min-w-0">
      <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-semibold" style={{ color: INK }}>
        {label}
      </label>
      {children}
      {(helper || error) && (
        <p className="mt-1.5 text-xs" style={{ color: error ? "#BE185D" : MUTED }}>
          {error || helper}
        </p>
      )}
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      style={{
        position: "relative",
        display: "inline-block",
        width: 44,
        height: 24,
        minWidth: 44,
        padding: 0,
        margin: 0,
        border: "none",
        borderRadius: 999,
        flexShrink: 0,
        cursor: "pointer",
        backgroundColor: checked ? PRIMARY : "#CBD6CE",
        transition: "background-color 200ms ease",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 2,
          left: 2,
          width: 20,
          height: 20,
          borderRadius: "50%",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
          transform: checked ? "translateX(20px)" : "translateX(0)",
          transition: "transform 200ms ease",
        }}
      />
    </button>
  );
}

function ChoiceChip({ selected, onClick, children, role = "radio" }) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={selected}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
        selected
          ? "border-[#032927] bg-[#032927] text-white"
          : "border-[#D6E0D8] bg-white text-[#16231C] hover:border-[#1F6944] hover:bg-[#F2F7F3]"
      }`}
    >
      {selected && <Check size={14} strokeWidth={3} />}
      {children}
    </button>
  );
}

function LanguageInput({ value, onChange }) {
  const [draft, setDraft] = useState("");
  const langs = parseList(value);

  const add = (raw) => {
    const name = raw.replace(/,/g, "").trim();
    if (!name) return;
    if (!langs.some((l) => l.toLowerCase() === name.toLowerCase())) {
      onChange([...langs, name].join(", "));
    }
    setDraft("");
  };

  const remove = (lang) => onChange(langs.filter((l) => l !== lang).join(", "));

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
    } else if (e.key === "Backspace" && !draft && langs.length) {
      remove(langs[langs.length - 1]);
    }
  };

  const suggestions = LANGUAGE_SUGGESTIONS.filter(
    (s) => !langs.some((l) => l.toLowerCase() === s.toLowerCase())
  );

  return (
    <div>
      <div className="ps-input flex min-h-[46px] flex-wrap items-center gap-2 !py-2">
        {langs.map((l) => (
          <span
            key={l}
            className="inline-flex items-center gap-1 rounded-full bg-[#E6F2EB] py-1 pl-3 pr-1.5 text-[13px] font-semibold text-[#1F6944]"
          >
            {l}
            <button
              type="button"
              onClick={() => remove(l)}
              aria-label={`Remove ${l}`}
              className="flex h-5 w-5 items-center justify-center rounded-full text-[#1F6944] transition-colors hover:bg-[#1F6944] hover:text-white"
            >
              <X size={12} strokeWidth={3} />
            </button>
          </span>
        ))}
        <input
          id="languages"
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => add(draft)}
          placeholder={langs.length ? "Add another" : "Type a language and press Enter"}
          className="min-w-[140px] flex-1 border-0 bg-transparent p-0 text-sm outline-none"
          style={{ color: INK }}
        />
      </div>

      {suggestions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.slice(0, 6).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="inline-flex items-center gap-1 rounded-full border border-dashed border-[#B9D5C4] px-3 py-1 text-xs font-semibold text-[#1F6944] transition-colors hover:bg-[#E6F2EB]"
            >
              <Plus size={12} strokeWidth={3} />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
    MAIN COMPONENT
============================================================ */

export default function ProfileSettings({
  onLogout,
  onNavigate,
  sidebarCollapsed = false,
  onToggleSidebar,
}) {
  const isDesktop = useIsDesktop();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const fileRef = useRef(null);

  const [saved, setSaved] = useState(() => buildFormFromPartner(getStoredPartner()));
  const [form, setForm] = useState(saved);
  const [tab, setTab] = useState("personal");
  const [status, setStatus] = useState("idle"); // idle | saved | error | invalid | photo
  const [photoError, setPhotoError] = useState("");

  useEffect(() => {
    if (isDesktop) setMobileNavOpen(false);
  }, [isDesktop]);

  useEffect(() => {
    if (status === "idle") return undefined;
    const t = setTimeout(() => setStatus("idle"), 4000);
    return () => clearTimeout(t);
  }, [status]);

  const sidebarWidth = sidebarCollapsed ? 76 : 268;

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(saved),
    [form, saved]
  );

  const nameMissing = form.fullName.trim() === "";

  const missing = COMPLETION_FIELDS.filter((f) => !isFilled(form[f.key]));
  const percent = Math.round(
    ((COMPLETION_FIELDS.length - missing.length) / COMPLETION_FIELDS.length) * 100
  );

  const langs = parseList(form.languages);

  const go = (page) => {
    if (typeof onNavigate === "function") onNavigate(page);
  };

  const navigateFromDrawer = (page) => {
    setMobileNavOpen(false);
    go(page);
  };

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (status !== "idle") setStatus("idle");
  };

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("Choose an image file (JPG or PNG).");
      return;
    }
    try {
      const dataUrl = await resizeImage(file);
      update("photo", dataUrl);
      setPhotoError("");
    } catch (err) {
      setPhotoError(err.message);
    }
  };

  const handleReset = () => {
    setForm(saved);
    setPhotoError("");
    setStatus("idle");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (nameMissing) {
      setTab("personal");
      setStatus("invalid");
      return;
    }

    const ok = savePartnerSettings(form);
    if (ok) {
      setSaved(form);
      setStatus("saved");
    } else {
      setStatus("error");
    }
  };

  const stepExperience = (delta) =>
    update("experience", String(Math.min(60, Math.max(0, (Number(form.experience) || 0) + delta))));

  return (
    <div
      className="ps-root min-h-screen antialiased"
      style={{ backgroundColor: "#EEF2EE", color: INK, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .ps-display { font-family: 'Fraunces', Georgia, serif; letter-spacing: -0.01em; }

        /* hide scrollbars, scrolling still works */
        html, body, .ps-root, .ps-root * { scrollbar-width: none; -ms-overflow-style: none; }
        html::-webkit-scrollbar, body::-webkit-scrollbar,
        .ps-root::-webkit-scrollbar, .ps-root *::-webkit-scrollbar { display: none; width: 0; height: 0; }
        .ps-root { overflow-x: clip; }

        .ps-card {
          background: #FFFFFF;
          border: 1px solid #E1E8E2;
          border-radius: 20px;
          box-shadow: 0 1px 2px rgba(18, 61, 43, 0.04), 0 10px 28px -14px rgba(18, 61, 43, 0.12);
        }
        @media (min-width: 640px) { .ps-card { border-radius: 24px; } }

        .ps-input {
          width: 100%;
          border: 1px solid #D6E0D8;
          background: #F8FAF8;
          border-radius: 14px;
          padding: 11px 14px;
          font-size: 14px;
          color: #16231C;
          transition: border-color .15s ease, background-color .15s ease, box-shadow .15s ease;
        }
        .ps-input::placeholder { color: #98A79E; }
        .ps-input:hover { border-color: #B9D5C4; }
        .ps-input:focus, .ps-input:focus-within {
          outline: none;
          background: #fff;
          border-color: #1F6944;
          box-shadow: 0 0 0 3px rgba(31, 105, 68, 0.15);
        }
        .ps-input:disabled { background: #EEF2EE; color: #5F6F66; cursor: not-allowed; }
        .ps-input[aria-invalid="true"] { border-color: #BE185D; }

        .ps-num::-webkit-outer-spin-button, .ps-num::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .ps-num { -moz-appearance: textfield; }

        button:focus-visible, [tabindex]:focus-visible, select:focus-visible {
          outline: 2px solid #1F6944; outline-offset: 2px; border-radius: 12px;
        }

        @keyframes ps-fade { from { opacity: 0; } to { opacity: 1; } }
        .ps-backdrop { animation: ps-fade .2s ease both; }

        @keyframes ps-panel { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .ps-panel { animation: ps-panel .28s cubic-bezier(.2,.7,.2,1) both; }

        @keyframes ps-toast { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .ps-toast { animation: ps-toast .25s ease both; }

        @media (prefers-reduced-motion: reduce) {
          .ps-backdrop, .ps-panel, .ps-toast { animation: none; }
        }
      `}</style>

      {/* ================= SIDEBAR ================= */}
      {isDesktop ? (
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={onToggleSidebar}
          activePage="Profile Settings"
          onNavigate={onNavigate}
          onLogout={onLogout}
          partnerName={form.fullName || "Partner"}
        />
      ) : (
        mobileNavOpen && (
          <>
            <div
              className="ps-backdrop fixed inset-0 z-40 bg-black/45"
              onClick={() => setMobileNavOpen(false)}
              aria-hidden="true"
            />
            <div className="relative z-50">
              <Sidebar
                collapsed={false}
                onToggle={() => setMobileNavOpen(false)}
                activePage="Profile Settings"
                onNavigate={navigateFromDrawer}
                onLogout={onLogout}
                partnerName={form.fullName || "Partner"}
              />
            </div>
          </>
        )
      )}

      {/* ================= MOBILE TOP BAR ================= */}
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-[#DCE5DE] bg-[#EEF2EE]/90 px-4 py-3 backdrop-blur lg:hidden">
        <button
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#1F6944] shadow-sm ring-1 ring-[#E1E8E2]"
        >
          <Menu size={20} />
        </button>
        <span className="text-[15px] font-semibold" style={{ color: INK }}>Profile Settings</span>
      </div>

      {/* ================= MAIN ================= */}
      <main
        className="min-h-screen p-3 transition-[margin] duration-300 ease-in-out sm:p-4 md:p-6 lg:ml-[var(--sb)] lg:p-8"
        style={{ "--sb": `${sidebarWidth}px` }}
      >
        <form
          onSubmit={handleSubmit}
          noValidate
          className="mx-auto w-full max-w-[1180px] space-y-4 sm:space-y-6"
        >
          {/* ================= BANNER ================= */}
          <header
            className="relative overflow-hidden rounded-[22px] sm:rounded-[28px]"
            style={{ backgroundColor: BANNER }}
          >
            {/* soft glow */}
            <div
              className="pointer-events-none absolute -right-24 -top-32 h-[420px] w-[420px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(43,138,92,0.45) 0%, rgba(3,41,39,0) 65%)" }}
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-40 left-1/4 h-[360px] w-[360px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(127,224,181,0.14) 0%, rgba(3,41,39,0) 65%)" }}
              aria-hidden="true"
            />

            <div className="relative z-10 flex items-start justify-between gap-4 px-5 pb-14 pt-6 sm:px-8 sm:pb-16 sm:pt-8 lg:px-10">
              <div className="min-w-0">
                <h1 className="ps-display text-[26px] font-semibold leading-tight text-white sm:text-[36px]">
                  Profile settings
                </h1>
                <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-white/75 sm:mt-2 sm:text-[15px]">
                  Keep your details current so patients know who they are booking.
                </p>
              </div>

              <div className="flex flex-shrink-0 items-center gap-3 sm:gap-4">
                <div className="hidden text-right sm:block">
                  <p className="text-[13px] font-semibold text-white">Profile strength</p>
                  <p className="text-xs text-white/70">
                    {percent === 100 ? "Everything is filled in" : `${missing.length} to go`}
                  </p>
                </div>
                <ProgressRing percent={percent} />
              </div>
            </div>
          </header>

          {/* ================= BODY ================= */}
          <div className="grid grid-cols-1 items-start gap-4 sm:gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">

            {/* ---------- LEFT: live preview ---------- */}
            <aside className="space-y-4 sm:space-y-5 lg:sticky lg:top-6">
              <section className="ps-card px-5 pb-5">
                {/* avatar overlaps the banner */}
                <div className="-mt-12 flex justify-center">
                  <div className="relative">
                    <Avatar
                      photo={form.photo}
                      name={form.fullName}
                      size={96}
                      className="shadow-lg ring-4 ring-white"
                    />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      aria-label="Change profile photo"
                      className="absolute -bottom-0.5 -right-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#032927] text-white shadow-md ring-2 ring-white transition-transform hover:scale-105"
                    >
                      <Camera size={16} />
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhoto}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <h2 className="text-[19px] font-semibold leading-tight" style={{ color: INK }}>
                    {form.fullName || "Your name"}
                  </h2>
                  <p className="mt-1 text-[13px]" style={{ color: MUTED }}>
                    {form.specialization || "Specialization not set"}
                  </p>
                  {form.email && (
                    <p className="mt-0.5 truncate text-xs text-[#98A79E]">{form.email}</p>
                  )}

                  {form.photo && (
                    <button
                      type="button"
                      onClick={() => update("photo", "")}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#BE185D] hover:underline"
                    >
                      <Trash2 size={12} />
                      Remove photo
                    </button>
                  )}
                  {photoError && (
                    <p className="mt-2 text-xs font-medium text-[#BE185D]">{photoError}</p>
                  )}
                </div>

                {/* quick facts */}
                <dl className="mt-5 grid grid-cols-3 divide-x divide-[#E9EFEA] rounded-2xl bg-[#F5F8F5] py-3 text-center">
                  <div className="px-2">
                    <dt className="text-[11px]" style={{ color: MUTED }}>Experience</dt>
                    <dd className="mt-0.5 text-[15px] font-bold tabular-nums" style={{ color: INK }}>
                      {isFilled(form.experience) ? `${form.experience} yrs` : "—"}
                    </dd>
                  </div>
                  <div className="px-2">
                    <dt className="text-[11px]" style={{ color: MUTED }}>Session</dt>
                    <dd className="mt-0.5 text-[15px] font-bold tabular-nums" style={{ color: INK }}>
                      {isFilled(form.sessionFee) ? `₹${form.sessionFee}` : "—"}
                    </dd>
                  </div>
                  <div className="px-2">
                    <dt className="text-[11px]" style={{ color: MUTED }}>Languages</dt>
                    <dd className="mt-0.5 text-[15px] font-bold tabular-nums" style={{ color: INK }}>
                      {langs.length || "—"}
                    </dd>
                  </div>
                </dl>

                {langs.length > 0 && (
                  <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                    {langs.slice(0, 4).map((l) => (
                      <span key={l} className="rounded-full bg-[#E6F2EB] px-2.5 py-1 text-xs font-semibold text-[#1F6944]">
                        {l}
                      </span>
                    ))}
                    {langs.length > 4 && (
                      <span className="rounded-full bg-[#EEF2EE] px-2.5 py-1 text-xs font-semibold" style={{ color: MUTED }}>
                        +{langs.length - 4}
                      </span>
                    )}
                  </div>
                )}

                <p
                  className="mt-4 text-center text-[13px] leading-relaxed"
                  style={{
                    color: form.bio ? MUTED : "#98A79E",
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {form.bio || "Your bio will appear here once you write it."}
                </p>

                <p className="mt-5 text-center text-[11px] font-medium text-[#98A79E]">
                  This is how patients see your profile
                </p>
              </section>

              {/* ---------- finish profile ---------- */}
              <section className="ps-card p-5">
                {missing.length === 0 ? (
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#E6F2EB] text-[#1F6944]">
                      <Check size={18} strokeWidth={3} />
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold" style={{ color: INK }}>Your profile is complete</p>
                      <p className="text-xs" style={{ color: MUTED }}>Patients can see all your details.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-[14px] font-semibold" style={{ color: INK }}>Finish your profile</h3>
                    <ul className="mt-3 space-y-1">
                      {missing.slice(0, 4).map((m) => (
                        <li key={m.key}>
                          <button
                            type="button"
                            onClick={() => setTab(m.tab)}
                            className="group flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-colors hover:bg-[#F2F7F3]"
                            style={{ color: INK }}
                          >
                            <span className="flex items-center gap-2.5">
                              <span className="h-2 w-2 flex-shrink-0 rounded-full border-2 border-[#B9D5C4]" />
                              {m.label}
                            </span>
                            <ChevronRight size={15} className="text-[#B5C4BA] transition-transform group-hover:translate-x-0.5 group-hover:text-[#1F6944]" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </section>
            </aside>

            {/* ---------- RIGHT: editor ---------- */}
            <div className="min-w-0 space-y-4 sm:space-y-5">
              {/* tabs */}
              <div
                role="tablist"
                aria-label="Profile sections"
                className="ps-card flex gap-1 overflow-x-auto p-1.5"
              >
                {TABS.map(({ id, label, icon: Icon }) => {
                  const active = tab === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setTab(id)}
                      className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-[14px] px-4 py-2.5 text-[13px] font-semibold transition-colors sm:text-sm ${
                        active
                          ? "bg-[#032927] text-white shadow-sm"
                          : "text-[#5F6F66] hover:bg-[#F2F7F3] hover:text-[#16231C]"
                      }`}
                    >
                      <Icon size={16} />
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* panel */}
              <article key={tab} role="tabpanel" className="ps-card ps-panel p-5 sm:p-6 md:p-8">

                {/* ----- PERSONAL ----- */}
                {tab === "personal" && (
                  <>
                    <SectionHead
                      title="Personal information"
                      desc="Your name, contact details and the languages you speak."
                    />

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <Field
                        label="Full name"
                        htmlFor="fullName"
                        error={nameMissing && status === "invalid" ? "Enter your full name to save changes." : undefined}
                      >
                        <input
                          id="fullName"
                          type="text"
                          value={form.fullName}
                          onChange={(e) => update("fullName", e.target.value)}
                          placeholder="Dr. Sarah Patil"
                          aria-invalid={nameMissing && status === "invalid"}
                          className="ps-input"
                          autoComplete="name"
                        />
                      </Field>

                      <Field label="Email" htmlFor="email" helper="Your email is your login, so it can't be changed here.">
                        <div className="relative">
                          <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A79E]" />
                          <input
                            id="email"
                            type="email"
                            value={form.email}
                            disabled
                            className="ps-input"
                            style={{ paddingLeft: 40 }}
                          />
                        </div>
                      </Field>

                      <div className="md:col-span-2">
                        <Field label="Phone number" htmlFor="phone">
                          <div className="relative">
                            <Phone size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A79E]" />
                            <input
                              id="phone"
                              type="tel"
                              value={form.phone}
                              onChange={(e) => update("phone", e.target.value)}
                              placeholder="+91 98765 43210"
                              className="ps-input"
                              style={{ paddingLeft: 40 }}
                              autoComplete="tel"
                            />
                          </div>
                        </Field>
                      </div>

                      <div className="md:col-span-2">
                        <Field label="Languages you speak" htmlFor="languages" helper="Press Enter after each language, or tap a suggestion.">
                          <LanguageInput
                            value={form.languages}
                            onChange={(val) => update("languages", val)}
                          />
                        </Field>
                      </div>
                    </div>
                  </>
                )}

                {/* ----- PROFESSIONAL ----- */}
                {tab === "professional" && (
                  <>
                    <SectionHead
                      title="Professional details"
                      desc="Your area of practice, credentials and session fee."
                    />

                    <div className="space-y-6">
                      <Field label="Specialization" htmlFor="specialization">
                        <div role="radiogroup" aria-label="Specialization" className="flex flex-wrap gap-2">
                          {SPECIALIZATIONS.map((s) => (
                            <ChoiceChip
                              key={s}
                              selected={form.specialization === s}
                              onClick={() => update("specialization", s)}
                            >
                              {s}
                            </ChoiceChip>
                          ))}
                          {form.specialization && !SPECIALIZATIONS.includes(form.specialization) && (
                            <ChoiceChip selected onClick={() => {}}>
                              {form.specialization}
                            </ChoiceChip>
                          )}
                        </div>
                      </Field>

                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <Field label="Highest qualification" htmlFor="qualification">
                          <input
                            id="qualification"
                            type="text"
                            value={form.qualification}
                            onChange={(e) => update("qualification", e.target.value)}
                            placeholder="M.A. Clinical Psychology"
                            className="ps-input"
                          />
                        </Field>

                        <Field label="License / registration number" htmlFor="licenseNumber">
                          <input
                            id="licenseNumber"
                            type="text"
                            value={form.licenseNumber}
                            onChange={(e) => update("licenseNumber", e.target.value)}
                            placeholder="RCI-XXXXX"
                            className="ps-input"
                          />
                        </Field>

                        <Field label="Years of experience" htmlFor="experience">
                          <div className="inline-flex items-center overflow-hidden rounded-[14px] border border-[#D6E0D8] bg-[#F8FAF8]">
                            <button
                              type="button"
                              onClick={() => stepExperience(-1)}
                              aria-label="Decrease experience"
                              className="flex h-11 w-11 items-center justify-center text-[#1F6944] transition-colors hover:bg-[#E6F2EB]"
                            >
                              <Minus size={16} strokeWidth={2.6} />
                            </button>
                            <input
                              id="experience"
                              type="number"
                              min="0"
                              max="60"
                              value={form.experience}
                              onChange={(e) => update("experience", e.target.value)}
                              placeholder="0"
                              className="ps-num h-11 w-16 border-x border-[#D6E0D8] bg-white text-center text-[15px] font-bold outline-none"
                              style={{ color: INK }}
                            />
                            <button
                              type="button"
                              onClick={() => stepExperience(1)}
                              aria-label="Increase experience"
                              className="flex h-11 w-11 items-center justify-center text-[#1F6944] transition-colors hover:bg-[#E6F2EB]"
                            >
                              <Plus size={16} strokeWidth={2.6} />
                            </button>
                          </div>
                        </Field>

                        <Field label="Session fee" htmlFor="sessionFee" helper="Fee for one 60-minute session.">
                          <div className="relative">
                            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] font-bold text-[#1F6944]">₹</span>
                            <input
                              id="sessionFee"
                              type="number"
                              min="0"
                              value={form.sessionFee}
                              onChange={(e) => update("sessionFee", e.target.value)}
                              placeholder="800"
                              className="ps-input ps-num"
                              style={{ paddingLeft: 34 }}
                            />
                          </div>
                          <div className="mt-2.5 flex flex-wrap gap-2">
                            {FEE_SUGGESTIONS.map((fee) => (
                              <button
                                key={fee}
                                type="button"
                                onClick={() => update("sessionFee", String(fee))}
                                className={`rounded-full border px-3 py-1 text-xs font-semibold tabular-nums transition-colors ${
                                  String(form.sessionFee) === String(fee)
                                    ? "border-[#1F6944] bg-[#E6F2EB] text-[#1F6944]"
                                    : "border-[#D6E0D8] text-[#5F6F66] hover:border-[#1F6944] hover:text-[#1F6944]"
                                }`}
                              >
                                ₹{fee}
                              </button>
                            ))}
                          </div>
                        </Field>
                      </div>
                    </div>
                  </>
                )}

                {/* ----- ABOUT ----- */}
                {tab === "about" && (
                  <>
                    <SectionHead
                      title="About you"
                      desc="A short introduction patients read before they book a session."
                    />

                    <Field label="Bio" htmlFor="bio">
                      <textarea
                        id="bio"
                        rows={8}
                        maxLength={BIO_LIMIT}
                        value={form.bio}
                        onChange={(e) => update("bio", e.target.value)}
                        placeholder="Describe your approach, the concerns you help with, and what a first session looks like."
                        className="ps-input resize-y"
                        style={{ lineHeight: 1.7 }}
                      />
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#EEF2EE]">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${(form.bio.length / BIO_LIMIT) * 100}%`,
                              backgroundColor: form.bio.length > BIO_LIMIT * 0.9 ? "#BE185D" : PRIMARY,
                            }}
                          />
                        </div>
                        <span className="text-xs tabular-nums" style={{ color: MUTED }}>
                          {form.bio.length}/{BIO_LIMIT}
                        </span>
                      </div>
                    </Field>
                  </>
                )}

                {/* ----- NOTIFICATIONS ----- */}
                {tab === "notifications" && (
                  <>
                    <SectionHead
                      title="Notifications"
                      desc="Choose how Manovedh keeps you updated."
                    />

                    <ul className="space-y-3">
                      {PREFERENCE_ITEMS.map(({ key, title, desc, icon: Icon }) => (
                        <li
                          key={key}
                          className={`flex items-center gap-4 rounded-2xl border p-4 transition-colors ${
                            form[key] ? "border-[#CFE5D8] bg-[#F2F8F4]" : "border-[#E1E8E2] bg-white"
                          }`}
                        >
                          <span
                            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-colors ${
                              form[key] ? "bg-[#1F6944] text-white" : "bg-[#EEF2EE] text-[#5F6F66]"
                            }`}
                          >
                            <Icon size={19} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-[14px] font-semibold" style={{ color: INK }}>{title}</p>
                            <p className="text-xs leading-relaxed" style={{ color: MUTED }}>{desc}</p>
                          </div>
                          <Toggle
                            checked={form[key]}
                            onChange={(val) => update(key, val)}
                            label={title}
                          />
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </article>
            </div>
          </div>

          {/* ================= ACTION BAR ================= */}
          <div className="sticky bottom-3 z-20 flex flex-col-reverse items-stretch gap-3 rounded-[20px] border border-[#E1E8E2] bg-white/95 p-3 shadow-[0_14px_36px_-12px_rgba(18,61,43,0.28)] backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-4">
            <div className="min-h-[20px] px-1 text-[13px]" aria-live="polite">
              {status === "saved" && (
                <span className="ps-toast inline-flex items-center gap-1.5 font-semibold text-[#1F6944]">
                  <Check size={16} strokeWidth={2.6} />
                  Changes saved
                </span>
              )}
              {status === "error" && (
                <span className="ps-toast font-semibold text-[#BE185D]">
                  Couldn't save your changes. Please try again.
                </span>
              )}
              {status === "invalid" && (
                <span className="ps-toast font-semibold text-[#BE185D]">
                  Enter your full name to save changes.
                </span>
              )}
              {status === "idle" && isDirty && (
                <span style={{ color: MUTED }}>You have unsaved changes.</span>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReset}
                disabled={!isDirty}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#D6E0D8] bg-white px-5 py-2.5 text-sm font-semibold text-[#16231C] transition-colors hover:bg-[#F5F8F5] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                <RotateCcw size={15} />
                Discard
              </button>
              <button
                type="submit"
                disabled={!isDirty}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#032927] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0A4A40] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                <Save size={15} />
                Save changes
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}