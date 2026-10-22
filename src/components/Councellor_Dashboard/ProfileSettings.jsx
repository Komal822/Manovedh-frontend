import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  User,
  Briefcase,
  MapPin,
  Landmark as BankIcon,
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
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  AlertTriangle,
} from "lucide-react";

import Sidebar from "./Sidebar";

// Avatars chosen in onboarding (Step 1)
import avery from "../../assets/councelor_avatar/Avery.png";
import jordan from "../../assets/councelor_avatar/jordan.png";
import riley from "../../assets/councelor_avatar/riley.png";
import taylor from "../../assets/councelor_avatar/taylor.png";
import casey from "../../assets/councelor_avatar/casey.png";
import morgan from "../../assets/councelor_avatar/morgan.png";
import jamie from "../../assets/councelor_avatar/jamie.png";
import drew from "../../assets/councelor_avatar/drew.png";

/* ============================================================
    CONSTANTS
============================================================ */

const LOCAL_STORAGE_PARTNER_SESSION_KEY = "manovedh_current_partner";
const LOCAL_STORAGE_PARTNERS_KEY = "manovedh_wellness_partners";

const INK = "#14251D";
const MUTED = "#5E7067";
const PRIMARY = "#2D6A4F";
const DEEP = "#1B4332";

const BIO_LIMIT = 500;

const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const UPI_REGEX = /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/;
const PINCODE_REGEX = /^[1-9][0-9]{5}$/;

const AVATARS = [
  { name: "Avery", src: avery },
  { name: "Jordan", src: jordan },
  { name: "Riley", src: riley },
  { name: "Taylor", src: taylor },
  { name: "Casey", src: casey },
  { name: "Morgan", src: morgan },
  { name: "Jamie", src: jamie },
  { name: "Drew", src: drew },
];

const avatarSrcFor = (name) => AVATARS.find((a) => a.name === name)?.src || "";

/* same list as onboarding Step 2 */
const statesAndDistricts = {
  Maharashtra: [
    "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara",
    "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli",
    "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai", "Nagpur", "Nanded",
    "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune",
    "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur",
    "Thane", "Wardha", "Washim", "Yavatmal",
  ],
  Gujarat: [
    "Ahmedabad", "Amreli", "Anand", "Banaskantha", "Bharuch", "Bhavnagar",
    "Gandhinagar", "Jamnagar", "Junagadh", "Kutch", "Mehsana", "Rajkot",
    "Surat", "Vadodara",
  ],
  "Madhya Pradesh": [
    "Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Rewa", "Sagar",
    "Satna",
  ],
  Rajasthan: [
    "Jaipur", "Jodhpur", "Udaipur", "Ajmer", "Kota", "Bikaner", "Alwar",
    "Bharatpur",
  ],
  Karnataka: [
    "Bengaluru", "Mysuru", "Belagavi", "Mangaluru", "Hubballi", "Dharwad",
    "Shivamogga",
  ],
  Delhi: [
    "New Delhi", "Central Delhi", "North Delhi", "South Delhi", "East Delhi",
    "West Delhi",
  ],
};

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
  { id: "location", label: "Location", icon: MapPin },
  { id: "bank", label: "Bank", icon: BankIcon },
  { id: "professional", label: "Professional", icon: Briefcase },
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
  { key: "name", label: "Add your first and last name", tab: "personal" },
  { key: "photo", label: "Choose an avatar or photo", tab: "personal" },
  { key: "phone", label: "Add your phone number", tab: "personal" },
  { key: "gender", label: "Select your gender", tab: "personal" },
  { key: "dob", label: "Add your date of birth", tab: "personal" },
  { key: "region", label: "Select your state and district", tab: "location" },
  { key: "address", label: "Complete your address", tab: "location" },
  { key: "bank", label: "Complete your bank details", tab: "bank" },
  { key: "specialization", label: "Choose a specialization", tab: "professional" },
  { key: "qualification", label: "Add your qualification", tab: "professional" },
  { key: "experience", label: "Add your years of experience", tab: "professional" },
  { key: "licenseNumber", label: "Add your license number", tab: "professional" },
  { key: "languages", label: "Add the languages you speak", tab: "professional" },
  { key: "sessionFee", label: "Set your session fee", tab: "professional" },
  { key: "bio", label: "Write a short bio", tab: "professional" },
];

const EMPTY_FORM = {
  // Step 1
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  avatar: "",
  photo: "",
  // Step 2: personal & location
  gender: "",
  dob: "",
  state: "",
  district: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  pincode: "",
  // Step 2: bank
  accountHolderName: "",
  bankName: "",
  accountNumber: "",
  ifsc: "",
  accountType: "",
  upiId: "",
  // Professional (edited here)
  specialization: "",
  qualification: "",
  experience: "",
  licenseNumber: "",
  languages: "",
  sessionFee: "",
  bio: "",
  // Alerts
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

/* Reads exactly what Step 1 and Step 2 saved. If only an old single-line
   address exists, it is placed in "Address line 1" so nothing is lost. */
function buildFormFromPartner(partner) {
  if (!partner) return { ...EMPTY_FORM };

  const fullName = (partner.fullName || partner.name || "").trim();
  const parts = fullName.split(/\s+/).filter(Boolean);

  const details = partner.addressDetails || {};
  const bank = partner.bankDetails || {};
  const languages = partner.languages ?? "";

  return {
    ...EMPTY_FORM,
    firstName: partner.firstName || parts[0] || "",
    lastName: partner.lastName || parts.slice(1).join(" ") || "",
    email: partner.email || "",
    phone: partner.phoneNumber || partner.mobile || partner.phone || "",
    avatar: partner.avatar || "",
    photo: partner.photo || "",

    gender: partner.gender || "",
    dob: partner.dob || "",
    state: partner.state || "",
    district: partner.district || "",
    addressLine1:
      details.addressLine1 || (partner.addressDetails ? "" : partner.address || ""),
    addressLine2: details.addressLine2 || "",
    landmark: details.landmark || "",
    city: details.city || "",
    pincode: details.pincode || "",

    accountHolderName: bank.accountHolderName || "",
    bankName: bank.bankName || "",
    accountNumber: bank.accountNumber || "",
    ifsc: bank.ifsc || "",
    accountType: bank.accountType || "",
    upiId: bank.upiId || "",

    specialization: partner.specialization || "",
    qualification: partner.qualification || "",
    experience: partner.experience ?? "",
    licenseNumber: partner.licenseNumber || "",
    languages: Array.isArray(languages) ? languages.join(", ") : languages,
    sessionFee: partner.sessionFee ?? "",
    bio: partner.bio || "",

    emailNotifications: partner.emailNotifications ?? true,
    messageAlerts: partner.messageAlerts ?? true,
    sessionReminders: partner.sessionReminders ?? true,
  };
}

/* Writes back using the same keys and shapes Step 1 and Step 2 use, so the
   onboarding pages and this page always stay in sync. */
function savePartnerSettings(form) {
  const currentPartner = getStoredPartner();
  if (!currentPartner) return false;

  const firstName = form.firstName.trim();
  const lastName = form.lastName.trim();
  const fullName = `${firstName} ${lastName}`.trim();

  const addressDetails = {
    addressLine1: form.addressLine1.trim(),
    addressLine2: form.addressLine2.trim(),
    landmark: form.landmark.trim(),
    city: form.city.trim(),
    pincode: form.pincode,
  };

  const fullAddress = [
    addressDetails.addressLine1,
    addressDetails.addressLine2,
    addressDetails.landmark ? `Near ${addressDetails.landmark}` : "",
    addressDetails.city,
    form.district,
    form.state,
    addressDetails.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const changes = {
    // Step 1 keys
    firstName,
    lastName,
    fullName,
    avatar: form.avatar,
    photo: form.photo,
    mobile: form.phone,
    phoneNumber: form.phone,

    // Step 2 keys
    gender: form.gender,
    dob: form.dob,
    state: form.state,
    district: form.district,
    address: fullAddress,
    addressDetails,
    bankDetails: {
      accountHolderName: form.accountHolderName.trim(),
      bankName: form.bankName.trim(),
      accountNumber: form.accountNumber,
      ifsc: form.ifsc,
      accountType: form.accountType,
      upiId: form.upiId.trim(),
    },

    // Professional + alerts
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
  if ("name" in currentPartner) changes.name = fullName;

  const updatedPartner = { ...currentPartner, ...changes };

  try {
    localStorage.setItem(
      LOCAL_STORAGE_PARTNER_SESSION_KEY,
      JSON.stringify(updatedPartner)
    );

    const partners = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_PARTNERS_KEY) || "[]"
    );

    const updatedPartners = partners.map((item) => {
      const isSame =
        (currentPartner.id && item.id === currentPartner.id) ||
        (currentPartner.email &&
          item.email?.toLowerCase() === currentPartner.email.toLowerCase());
      return isSame ? { ...item, ...changes } : item;
    });

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

/* Removes the partner from the saved list and ends the session.
   If you use a backend, call your delete API here as well. */
function deletePartnerAccount() {
  const currentPartner = getStoredPartner();
  if (!currentPartner) return false;

  try {
    const partners = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_PARTNERS_KEY) || "[]"
    );

    const remaining = partners.filter((item) => {
      const isSame =
        (currentPartner.id && item.id === currentPartner.id) ||
        (currentPartner.email &&
          item.email?.toLowerCase() === currentPartner.email.toLowerCase());
      return !isSame;
    });

    localStorage.setItem(LOCAL_STORAGE_PARTNERS_KEY, JSON.stringify(remaining));
    localStorage.removeItem(LOCAL_STORAGE_PARTNER_SESSION_KEY);
    return true;
  } catch (error) {
    console.error("Unable to delete account:", error);
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

function Avatar({ photo, avatarSrc, name, size = 96, className = "" }) {
  const src = photo || avatarSrc;
  return src ? (
    <img
      src={src}
      alt=""
      className={`rounded-full bg-[#E8F3EC] object-cover ${className}`}
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
        background: `linear-gradient(135deg, ${PRIMARY} 0%, ${DEEP} 100%)`,
      }}
    >
      {initials(name)}
    </span>
  );
}

function SectionHead({ icon: Icon, title, desc }) {
  return (
    <div className="mb-7 flex items-start gap-3.5">
      {Icon && (
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[#E8F3EC] text-[#2D6A4F]">
          <Icon size={20} />
        </span>
      )}
      <div>
        <h2 className="text-[18px] font-bold sm:text-[20px]" style={{ color: INK }}>
          {title}
        </h2>
        <p className="mt-0.5 text-[13px] sm:text-sm" style={{ color: MUTED }}>
          {desc}
        </p>
      </div>
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
        width: 46,
        height: 26,
        minWidth: 46,
        padding: 0,
        margin: 0,
        border: "none",
        borderRadius: 999,
        flexShrink: 0,
        cursor: "pointer",
        backgroundColor: checked ? PRIMARY : "#CBD9D0",
        transition: "background-color 200ms ease",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 3,
          left: 3,
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
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-semibold transition-all ${
        selected
          ? "border-[#2D6A4F] bg-[#2D6A4F] text-white shadow-sm"
          : "border-[#D5E6DB] bg-white text-[#14251D] hover:border-[#2D6A4F] hover:bg-[#F3F9F5]"
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
      <div className="ps-input flex min-h-[48px] flex-wrap items-center gap-2 !py-2">
        {langs.map((l) => (
          <span
            key={l}
            className="inline-flex items-center gap-1 rounded-full bg-[#E8F3EC] py-1 pl-3 pr-1.5 text-[13px] font-semibold text-[#2D6A4F]"
          >
            {l}
            <button
              type="button"
              onClick={() => remove(l)}
              aria-label={`Remove ${l}`}
              className="flex h-5 w-5 items-center justify-center rounded-full text-[#2D6A4F] transition-colors hover:bg-[#2D6A4F] hover:text-white"
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
              className="inline-flex items-center gap-1 rounded-full border border-dashed border-[#A9CDB8] px-3 py-1 text-xs font-semibold text-[#2D6A4F] transition-colors hover:bg-[#E8F3EC]"
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
  const [status, setStatus] = useState("idle"); // idle | saved | error | invalid
  const [attempted, setAttempted] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [showAccount, setShowAccount] = useState(false);

  // delete account popup
  const [showDelete, setShowDelete] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const closeDelete = () => {
    setShowDelete(false);
    setDeleteText("");
    setDeleteError("");
  };

  useEffect(() => {
    if (isDesktop) setMobileNavOpen(false);
  }, [isDesktop]);

  useEffect(() => {
    if (status === "idle") return undefined;
    const t = setTimeout(() => setStatus("idle"), 4000);
    return () => clearTimeout(t);
  }, [status]);

  // close the popup with the Escape key
  useEffect(() => {
    if (!showDelete) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") closeDelete();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showDelete]);

  const sidebarWidth = sidebarCollapsed ? 76 : 268;

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(saved),
    [form, saved]
  );

  const fullName = `${form.firstName} ${form.lastName}`.trim();
  const avatarSrc = avatarSrcFor(form.avatar);
  const todayString = new Date().toISOString().split("T")[0];
  const availableDistricts = statesAndDistricts[form.state] || [];

  /* ---------- validation (same rules as onboarding) ---------- */
  const errors = {
    firstName: form.firstName.trim() ? "" : "Enter your first name",
    lastName: form.lastName.trim() ? "" : "Enter your last name",
    phone:
      form.phone.length >= 10 && form.phone.length <= 15
        ? ""
        : "Enter a valid mobile number (10–15 digits)",
    dob:
      form.dob && new Date(`${form.dob}T00:00:00`) > new Date()
        ? "Select a valid date of birth"
        : "",
    pincode:
      form.pincode && !PINCODE_REGEX.test(form.pincode)
        ? "Enter a valid 6-digit pincode"
        : "",
    accountNumber:
      form.accountNumber &&
      (form.accountNumber.length < 9 || form.accountNumber.length > 18)
        ? "Account number must be 9 to 18 digits"
        : "",
    ifsc:
      form.ifsc && !IFSC_REGEX.test(form.ifsc)
        ? "Enter a valid IFSC code (e.g. SBIN0001234)"
        : "",
    upiId:
      form.upiId.trim() && !UPI_REGEX.test(form.upiId.trim())
        ? "Enter a valid UPI ID (e.g. name@bank)"
        : "",
  };
  const ERROR_TAB = {
    firstName: "personal",
    lastName: "personal",
    phone: "personal",
    dob: "personal",
    pincode: "location",
    accountNumber: "bank",
    ifsc: "bank",
    upiId: "bank",
  };
  const err = (key) => (attempted ? errors[key] : "");
  const tabHasError = (id) =>
    attempted && Object.keys(errors).some((k) => errors[k] && ERROR_TAB[k] === id);

  /* ---------- profile completion ---------- */
  const isDone = (f) => {
    switch (f.key) {
      case "name":
        return isFilled(form.firstName) && isFilled(form.lastName);
      case "photo":
        return isFilled(form.photo) || isFilled(form.avatar);
      case "region":
        return isFilled(form.state) && isFilled(form.district);
      case "address":
        return isFilled(form.addressLine1) && isFilled(form.city) && isFilled(form.pincode);
      case "bank":
        return (
          isFilled(form.accountHolderName) &&
          isFilled(form.bankName) &&
          isFilled(form.accountNumber) &&
          isFilled(form.ifsc) &&
          isFilled(form.accountType)
        );
      default:
        return isFilled(form[f.key]);
    }
  };
  const missing = COMPLETION_FIELDS.filter((f) => !isDone(f));
  const percent = Math.round(
    ((COMPLETION_FIELDS.length - missing.length) / COMPLETION_FIELDS.length) * 100
  );

  const langs = parseList(form.languages);
  const locationLine = [form.district, form.state].filter(Boolean).join(", ");

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

  const updateState = (value) => {
    setForm((prev) => ({ ...prev, state: value, district: "" }));
    if (status !== "idle") setStatus("idle");
  };

  const pickAvatar = (name) => {
    setForm((prev) => ({ ...prev, avatar: name, photo: "" }));
    setPhotoError("");
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
    } catch (error) {
      setPhotoError(error.message);
    }
  };

  const handleReset = () => {
    setForm(saved);
    setPhotoError("");
    setAttempted(false);
    setStatus("idle");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const firstInvalid = Object.keys(errors).find((k) => errors[k]);
    if (firstInvalid) {
      setAttempted(true);
      setTab(ERROR_TAB[firstInvalid]);
      setStatus("invalid");
      return;
    }

    const ok = savePartnerSettings(form);
    if (ok) {
      setSaved(form);
      setAttempted(false);
      setStatus("saved");
    } else {
      setStatus("error");
    }
  };

  const confirmDelete = () => {
    if (deleteText.trim().toUpperCase() !== "DELETE") return;
    if (deletePartnerAccount()) {
      setShowDelete(false);
      if (typeof onLogout === "function") onLogout();
    } else {
      setDeleteError("Couldn't delete your account. Please try again.");
    }
  };

  const firstErrorMessage = Object.values(errors).find(Boolean);

  const stepExperience = (delta) =>
    update("experience", String(Math.min(60, Math.max(0, (Number(form.experience) || 0) + delta))));

  return (
    <div
      className="ps-root min-h-screen antialiased"
      style={{ backgroundColor: "#EDF3EF", color: INK, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .ps-display { font-family: 'Fraunces', Georgia, serif; letter-spacing: -0.01em; }

        /* hide scrollbars, scrolling still works */
        html, body, .ps-root, .ps-root * { scrollbar-width: none; -ms-overflow-style: none; }
        html::-webkit-scrollbar, body::-webkit-scrollbar,
        .ps-root::-webkit-scrollbar, .ps-root *::-webkit-scrollbar { display: none; width: 0; height: 0; }
        .ps-root { overflow-x: clip; }

        .ps-card {
          background: #FFFFFF;
          border: 1px solid #E3EDE6;
          border-radius: 22px;
          box-shadow: 0 10px 30px -12px rgba(45, 106, 79, 0.14);
        }
        @media (min-width: 640px) { .ps-card { border-radius: 26px; } }

        .ps-input {
          width: 100%;
          border: 1px solid #D5E6DB;
          background: #F8FBF9;
          border-radius: 14px;
          padding: 12px 14px;
          font-size: 14px;
          color: #14251D;
          transition: border-color .15s ease, background-color .15s ease, box-shadow .15s ease;
        }
        .ps-input::placeholder { color: #9AAEA3; }
        .ps-input:hover { border-color: #A9CDB8; }
        .ps-input:focus, .ps-input:focus-within {
          outline: none;
          background: #fff;
          border-color: #2D6A4F;
          box-shadow: 0 0 0 4px rgba(45, 106, 79, 0.14);
        }
        .ps-input:disabled { background: #EEF4F0; color: #5E7067; cursor: not-allowed; }
        .ps-input[aria-invalid="true"] { border-color: #BE185D; }

        .ps-num::-webkit-outer-spin-button, .ps-num::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .ps-num { -moz-appearance: textfield; }

        button:focus-visible, [tabindex]:focus-visible, select:focus-visible {
          outline: 2px solid #2D6A4F; outline-offset: 2px; border-radius: 12px;
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
        <div className="font-sans">
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={onToggleSidebar}
            activePage="Profile Settings"
            onNavigate={onNavigate}
            onLogout={onLogout}
            partnerName={fullName || "Partner"}
          />
        </div>
      ) : (
        mobileNavOpen && (
          <>
            <div
              className="ps-backdrop fixed inset-0 z-40 bg-black/45"
              onClick={() => setMobileNavOpen(false)}
              aria-hidden="true"
            />
            <div className="relative z-50 font-sans">
              <Sidebar
                collapsed={false}
                onToggle={() => setMobileNavOpen(false)}
                activePage="Profile Settings"
                onNavigate={navigateFromDrawer}
                onLogout={onLogout}
                partnerName={fullName || "Partner"}
              />
            </div>
          </>
        )
      )}

      {/* ================= MOBILE TOP BAR ================= */}
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-[#D5E6DB] bg-[#EDF3EF]/90 px-4 py-3 backdrop-blur lg:hidden">
        <button
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#2D6A4F] shadow-sm ring-1 ring-[#E3EDE6]"
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
          {/* ================= HEADING ================= */}
          <header className="flex flex-wrap items-end justify-between gap-4 px-1 pt-1 sm:px-2">
            <div className="min-w-0">
              <h1
                className="ps-display text-[26px] font-semibold leading-tight sm:text-[34px]"
                style={{ color: INK }}
              >
                Profile settings
              </h1>
              <p
                className="mt-1 max-w-lg text-[13px] leading-relaxed sm:text-[15px]"
                style={{ color: MUTED }}
              >
                Manage your personal details, bank account, professional information and notifications.
              </p>
            </div>

            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#D5E6DB] bg-white px-4 py-2 shadow-sm">
              <span className="text-xs font-semibold" style={{ color: MUTED }}>Profile strength</span>
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#EEF4F0]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${percent}%`, backgroundColor: PRIMARY }}
                />
              </div>
              <span className="text-[13px] font-bold tabular-nums" style={{ color: PRIMARY }}>
                {percent}%
              </span>
            </div>
          </header>

          {/* ================= BODY ================= */}
          <div className="grid grid-cols-1 items-start gap-4 sm:gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">

            {/* ---------- LEFT: live preview ---------- */}
            <aside className="space-y-4 sm:space-y-5 lg:sticky lg:top-6">
              <section className="ps-card p-5 pt-7">
                <div className="flex justify-center">
                  <div className="relative">
                    <Avatar
                      photo={form.photo}
                      avatarSrc={avatarSrc}
                      name={fullName}
                      size={96}
                      className="shadow-lg ring-4 ring-white"
                    />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      aria-label="Upload profile photo"
                      className="absolute -bottom-0.5 -right-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#2D6A4F] text-white shadow-md ring-2 ring-white transition-transform hover:scale-105"
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
                  <h2 className="text-[19px] font-bold leading-tight" style={{ color: INK }}>
                    {fullName || "Your name"}
                  </h2>
                  <p className="mt-1 text-[13px]" style={{ color: MUTED }}>
                    {form.specialization || "Specialization not set"}
                  </p>
                  {locationLine && (
                    <p className="mt-1 inline-flex items-center gap-1 text-xs" style={{ color: MUTED }}>
                      <MapPin size={12} />
                      {locationLine}
                    </p>
                  )}
                  {form.email && (
                    <p className="mt-0.5 truncate text-xs text-[#9AAEA3]">{form.email}</p>
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

                <dl className="mt-5 grid grid-cols-3 divide-x divide-[#E3EDE6] rounded-2xl bg-[#F3F9F5] py-3 text-center">
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
                      <span key={l} className="rounded-full bg-[#E8F3EC] px-2.5 py-1 text-xs font-semibold text-[#2D6A4F]">
                        {l}
                      </span>
                    ))}
                    {langs.length > 4 && (
                      <span className="rounded-full bg-[#EEF4F0] px-2.5 py-1 text-xs font-semibold" style={{ color: MUTED }}>
                        +{langs.length - 4}
                      </span>
                    )}
                  </div>
                )}

                <p
                  className="mt-4 text-center text-[13px] leading-relaxed"
                  style={{
                    color: form.bio ? MUTED : "#9AAEA3",
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {form.bio || "Your bio will appear here once you write it."}
                </p>

                <p className="mt-5 text-center text-[11px] font-medium text-[#9AAEA3]">
                  This is how patients see your profile
                </p>
              </section>

              {/* ---------- finish profile ---------- */}
              <section className="ps-card p-5">
                {missing.length === 0 ? (
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#E8F3EC] text-[#2D6A4F]">
                      <ShieldCheck size={19} />
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold" style={{ color: INK }}>Your profile is complete</p>
                      <p className="text-xs" style={{ color: MUTED }}>Patients can see all your details.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-[14px] font-bold" style={{ color: INK }}>Finish your profile</h3>
                    <ul className="mt-3 space-y-1">
                      {missing.slice(0, 4).map((m) => (
                        <li key={m.key}>
                          <button
                            type="button"
                            onClick={() => setTab(m.tab)}
                            className="group flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-colors hover:bg-[#F3F9F5]"
                            style={{ color: INK }}
                          >
                            <span className="flex items-center gap-2.5">
                              <span className="h-2 w-2 flex-shrink-0 rounded-full border-2 border-[#A9CDB8]" />
                              {m.label}
                            </span>
                            <ChevronRight size={15} className="text-[#B5C9BC] transition-transform group-hover:translate-x-0.5 group-hover:text-[#2D6A4F]" />
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
                  const hasError = tabHasError(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setTab(id)}
                      className={`relative flex min-w-fit flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-[16px] px-4 py-2.5 text-[13px] font-semibold transition-all sm:text-sm ${
                        active
                          ? "bg-[#2D6A4F] text-white shadow-md"
                          : "text-[#5E7067] hover:bg-[#F3F9F5] hover:text-[#14251D]"
                      }`}
                    >
                      <Icon size={16} />
                      {label}
                      {hasError && (
                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#BE185D]" />
                      )}
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
                      icon={User}
                      title="Personal information"
                      desc="Your avatar, name and contact details."
                    />

                    {/* avatar picker */}
                    <div className="mb-7 rounded-2xl border border-[#E3EDE6] bg-[#F8FBF9] p-4 sm:p-5">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-[13px] font-semibold" style={{ color: INK }}>Your avatar</p>
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D6A4F] hover:underline"
                        >
                          <Camera size={13} />
                          Upload your own photo
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-8">
                        {AVATARS.map((a) => {
                          const selected = !form.photo && form.avatar === a.name;
                          return (
                            <button
                              key={a.name}
                              type="button"
                              onClick={() => pickAvatar(a.name)}
                              aria-pressed={selected}
                              aria-label={`Select ${a.name}`}
                              className={`relative flex flex-col items-center rounded-2xl border p-1.5 transition-all ${
                                selected
                                  ? "border-[#2D6A4F] bg-[#E8F3EC] ring-1 ring-[#2D6A4F]"
                                  : "border-[#E3EDE6] bg-white hover:-translate-y-0.5 hover:border-[#A9CDB8]"
                              }`}
                            >
                              <img
                                src={a.src}
                                alt=""
                                className="h-11 w-11 rounded-full bg-[#E8F3EC] object-cover"
                              />
                              <span className="mt-1 text-[10px] font-semibold" style={{ color: MUTED }}>
                                {a.name}
                              </span>
                              {selected && (
                                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#2D6A4F] text-white">
                                  <Check size={10} strokeWidth={3.5} />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <Field label="First name" htmlFor="firstName" error={err("firstName")}>
                        <input
                          id="firstName"
                          type="text"
                          value={form.firstName}
                          onChange={(e) => update("firstName", e.target.value)}
                          placeholder="Enter first name"
                          aria-invalid={!!err("firstName")}
                          className="ps-input"
                          autoComplete="given-name"
                        />
                      </Field>

                      <Field label="Last name" htmlFor="lastName" error={err("lastName")}>
                        <input
                          id="lastName"
                          type="text"
                          value={form.lastName}
                          onChange={(e) => update("lastName", e.target.value)}
                          placeholder="Enter last name"
                          aria-invalid={!!err("lastName")}
                          className="ps-input"
                          autoComplete="family-name"
                        />
                      </Field>

                      <Field label="Email address" htmlFor="email" helper="Linked to your account, can't be changed.">
                        <div className="relative">
                          <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AAEA3]" />
                          <input
                            id="email"
                            type="email"
                            value={form.email}
                            disabled
                            className="ps-input"
                            style={{ paddingLeft: 40, paddingRight: 40 }}
                          />
                          <Lock size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9AAEA3]" />
                        </div>
                      </Field>

                      <Field label="Mobile number" htmlFor="phone" helper="Digits only, 10 to 15 numbers." error={err("phone")}>
                        <div className="relative">
                          <Phone size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AAEA3]" />
                          <input
                            id="phone"
                            type="tel"
                            inputMode="numeric"
                            value={form.phone}
                            onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 15))}
                            placeholder="Enter mobile number"
                            aria-invalid={!!err("phone")}
                            className="ps-input"
                            style={{ paddingLeft: 40 }}
                            autoComplete="tel"
                          />
                        </div>
                      </Field>

                      <Field label="Gender" htmlFor="gender">
                        <select
                          id="gender"
                          value={form.gender}
                          onChange={(e) => update("gender", e.target.value)}
                          className="ps-input"
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </Field>

                      <Field label="Date of birth" htmlFor="dob" error={err("dob")}>
                        <input
                          id="dob"
                          type="date"
                          value={form.dob}
                          max={todayString}
                          onChange={(e) => update("dob", e.target.value)}
                          aria-invalid={!!err("dob")}
                          className="ps-input"
                        />
                      </Field>
                    </div>
                  </>
                )}

                {/* ----- LOCATION ----- */}
                {tab === "location" && (
                  <>
                    <SectionHead
                      icon={MapPin}
                      title="Location & address"
                      desc="Where you are based. Keep it simple, avoid unnecessary sensitive details."
                    />

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <Field label="State / Union Territory" htmlFor="state">
                        <select
                          id="state"
                          value={form.state}
                          onChange={(e) => updateState(e.target.value)}
                          className="ps-input"
                        >
                          <option value="">Select state / union territory</option>
                          {Object.keys(statesAndDistricts).map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </select>
                      </Field>

                      <Field
                        label="District"
                        htmlFor="district"
                        helper={!form.state ? "Select a state first" : ""}
                      >
                        <select
                          id="district"
                          value={form.district}
                          onChange={(e) => update("district", e.target.value)}
                          disabled={!form.state}
                          className="ps-input"
                        >
                          <option value="">Select district</option>
                          {availableDistricts.map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                          {form.state && availableDistricts.length === 0 && (
                            <option value="Other">Other</option>
                          )}
                        </select>
                      </Field>

                      <div className="md:col-span-2">
                        <Field
                          label="Address line 1"
                          htmlFor="addressLine1"
                          helper="House / flat number and building name."
                        >
                          <input
                            id="addressLine1"
                            type="text"
                            value={form.addressLine1}
                            onChange={(e) => update("addressLine1", e.target.value)}
                            placeholder="e.g. Flat 302, Shree Apartments"
                            maxLength={120}
                            autoComplete="address-line1"
                            className="ps-input"
                          />
                        </Field>
                      </div>

                      <div className="md:col-span-2">
                        <Field label="Address line 2" htmlFor="addressLine2" helper="Street, area or locality.">
                          <input
                            id="addressLine2"
                            type="text"
                            value={form.addressLine2}
                            onChange={(e) => update("addressLine2", e.target.value)}
                            placeholder="e.g. Rajapeth Road, Camp Area"
                            maxLength={120}
                            autoComplete="address-line2"
                            className="ps-input"
                          />
                        </Field>
                      </div>

                      <Field label="City / Town / Village" htmlFor="city">
                        <input
                          id="city"
                          type="text"
                          value={form.city}
                          onChange={(e) => update("city", e.target.value)}
                          placeholder="e.g. Amravati"
                          maxLength={60}
                          autoComplete="address-level2"
                          className="ps-input"
                        />
                      </Field>

                      <Field label="Pincode" htmlFor="pincode" helper="6-digit postal code" error={err("pincode")}>
                        <input
                          id="pincode"
                          type="text"
                          inputMode="numeric"
                          value={form.pincode}
                          onChange={(e) => update("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                          placeholder="e.g. 444601"
                          maxLength={6}
                          aria-invalid={!!err("pincode")}
                          autoComplete="postal-code"
                          className="ps-input"
                        />
                      </Field>

                      <div className="md:col-span-2">
                        <Field label="Landmark (optional)" htmlFor="landmark" helper="A nearby place that helps people find you.">
                          <input
                            id="landmark"
                            type="text"
                            value={form.landmark}
                            onChange={(e) => update("landmark", e.target.value)}
                            placeholder="e.g. Near Railway Station"
                            maxLength={100}
                            autoComplete="off"
                            className="ps-input"
                          />
                        </Field>
                      </div>
                    </div>
                  </>
                )}

                {/* ----- BANK ----- */}
                {tab === "bank" && (
                  <>
                    <SectionHead
                      icon={BankIcon}
                      title="Bank details"
                      desc="Your session earnings will be paid to this account."
                    />

                    <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#CFE5D8] bg-[#F3F9F5] p-4">
                      <ShieldCheck size={18} className="mt-0.5 flex-shrink-0 text-[#2D6A4F]" />
                      <p className="text-xs leading-relaxed" style={{ color: MUTED }}>
                        Your bank details are private. They are only used for payouts and are never shown to patients.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <Field label="Account holder name" htmlFor="accountHolderName" helper="Exactly as it appears on your bank account.">
                        <input
                          id="accountHolderName"
                          type="text"
                          value={form.accountHolderName}
                          onChange={(e) => update("accountHolderName", e.target.value)}
                          placeholder="Full name"
                          maxLength={100}
                          autoComplete="off"
                          className="ps-input"
                        />
                      </Field>

                      <Field label="Bank name" htmlFor="bankName">
                        <input
                          id="bankName"
                          type="text"
                          value={form.bankName}
                          onChange={(e) => update("bankName", e.target.value)}
                          placeholder="e.g. State Bank of India"
                          maxLength={100}
                          autoComplete="off"
                          className="ps-input"
                        />
                      </Field>

                      <Field label="Account number" htmlFor="accountNumber" error={err("accountNumber")}>
                        <div className="relative">
                          <input
                            id="accountNumber"
                            type={showAccount ? "text" : "password"}
                            inputMode="numeric"
                            value={form.accountNumber}
                            onChange={(e) => update("accountNumber", e.target.value.replace(/\D/g, "").slice(0, 18))}
                            placeholder="Enter account number"
                            aria-invalid={!!err("accountNumber")}
                            autoComplete="off"
                            className="ps-input"
                            style={{ paddingRight: 44 }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowAccount((v) => !v)}
                            aria-label={showAccount ? "Hide account number" : "Show account number"}
                            className="absolute inset-y-0 right-3 flex items-center text-[#5E7067] hover:text-[#2D6A4F]"
                          >
                            {showAccount ? <EyeOff size={17} /> : <Eye size={17} />}
                          </button>
                        </div>
                      </Field>

                      <Field label="IFSC code" htmlFor="ifsc" helper="11 characters, e.g. SBIN0001234" error={err("ifsc")}>
                        <input
                          id="ifsc"
                          type="text"
                          value={form.ifsc}
                          onChange={(e) =>
                            update("ifsc", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11))
                          }
                          placeholder="IFSC code"
                          maxLength={11}
                          aria-invalid={!!err("ifsc")}
                          autoComplete="off"
                          className="ps-input"
                        />
                      </Field>

                      <Field label="Account type" htmlFor="accountType">
                        <select
                          id="accountType"
                          value={form.accountType}
                          onChange={(e) => update("accountType", e.target.value)}
                          className="ps-input"
                        >
                          <option value="">Select account type</option>
                          <option value="Savings">Savings</option>
                          <option value="Current">Current</option>
                        </select>
                      </Field>

                      <Field label="UPI ID (optional)" htmlFor="upiId" helper="Add a UPI ID to also receive payments that way." error={err("upiId")}>
                        <input
                          id="upiId"
                          type="text"
                          value={form.upiId}
                          onChange={(e) => update("upiId", e.target.value)}
                          placeholder="name@bank"
                          maxLength={100}
                          aria-invalid={!!err("upiId")}
                          autoComplete="off"
                          className="ps-input"
                        />
                      </Field>
                    </div>
                  </>
                )}

                {/* ----- PROFESSIONAL ----- */}
                {tab === "professional" && (
                  <>
                    <SectionHead
                      icon={Briefcase}
                      title="Professional details"
                      desc="Your area of practice, credentials, fee and a short bio patients can read."
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
                          <div className="inline-flex items-center overflow-hidden rounded-[14px] border border-[#D5E6DB] bg-[#F8FBF9]">
                            <button
                              type="button"
                              onClick={() => stepExperience(-1)}
                              aria-label="Decrease experience"
                              className="flex h-12 w-12 items-center justify-center text-[#2D6A4F] transition-colors hover:bg-[#E8F3EC]"
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
                              className="ps-num h-12 w-16 border-x border-[#D5E6DB] bg-white text-center text-[15px] font-bold outline-none"
                              style={{ color: INK }}
                            />
                            <button
                              type="button"
                              onClick={() => stepExperience(1)}
                              aria-label="Increase experience"
                              className="flex h-12 w-12 items-center justify-center text-[#2D6A4F] transition-colors hover:bg-[#E8F3EC]"
                            >
                              <Plus size={16} strokeWidth={2.6} />
                            </button>
                          </div>
                        </Field>

                        <Field label="Session fee" htmlFor="sessionFee" helper="Fee for one 60-minute session.">
                          <div className="relative">
                            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] font-bold text-[#2D6A4F]">₹</span>
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
                                    ? "border-[#2D6A4F] bg-[#E8F3EC] text-[#2D6A4F]"
                                    : "border-[#D5E6DB] text-[#5E7067] hover:border-[#2D6A4F] hover:text-[#2D6A4F]"
                                }`}
                              >
                                ₹{fee}
                              </button>
                            ))}
                          </div>
                        </Field>
                      </div>

                      <Field label="Languages you speak" htmlFor="languages" helper="Press Enter after each language, or tap a suggestion.">
                        <LanguageInput
                          value={form.languages}
                          onChange={(val) => update("languages", val)}
                        />
                      </Field>

                      <Field label="Bio" htmlFor="bio">
                        <textarea
                          id="bio"
                          rows={6}
                          maxLength={BIO_LIMIT}
                          value={form.bio}
                          onChange={(e) => update("bio", e.target.value)}
                          placeholder="Describe your approach, the concerns you help with, and what a first session looks like."
                          className="ps-input resize-y"
                          style={{ lineHeight: 1.7 }}
                        />
                        <div className="mt-2 flex items-center justify-between gap-3">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#EEF4F0]">
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
                    </div>
                  </>
                )}

                {/* ----- NOTIFICATIONS ----- */}
                {tab === "notifications" && (
                  <>
                    <SectionHead
                      icon={Bell}
                      title="Notifications"
                      desc="Choose how Manovedh keeps you updated."
                    />

                    <ul className="space-y-3">
                      {PREFERENCE_ITEMS.map(({ key, title, desc, icon: Icon }) => (
                        <li
                          key={key}
                          className={`flex items-center gap-4 rounded-2xl border p-4 transition-colors ${
                            form[key] ? "border-[#CFE5D8] bg-[#F3F9F5]" : "border-[#E3EDE6] bg-white"
                          }`}
                        >
                          <span
                            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-colors ${
                              form[key] ? "bg-[#2D6A4F] text-white" : "bg-[#EEF4F0] text-[#5E7067]"
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

              {/* ---------- danger zone ---------- */}
              <section className="ps-card flex flex-col gap-4 border-[#F3D3E0] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="flex items-start gap-3.5">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[#FDF0F5] text-[#BE185D]">
                    <Trash2 size={20} />
                  </span>
                  <div>
                    <h3 className="text-[16px] font-bold" style={{ color: INK }}>Delete account</h3>
                    <p className="mt-0.5 text-[13px] leading-relaxed" style={{ color: MUTED }}>
                      Permanently remove your profile and details. This can't be undone.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDelete(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#BE185D] bg-white px-5 py-2.5 text-sm font-semibold text-[#BE185D] transition-colors hover:bg-[#BE185D] hover:text-white"
                >
                  <Trash2 size={15} />
                  Delete account
                </button>
              </section>
            </div>
          </div>

          {/* ================= ACTION BAR ================= */}
          <div className="sticky bottom-3 z-20 flex flex-col-reverse items-stretch gap-3 rounded-[22px] border border-[#E3EDE6] bg-white/95 p-3 shadow-[0_14px_36px_-12px_rgba(45,106,79,0.28)] backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-4">
            <div className="min-h-[20px] px-1 text-[13px]" aria-live="polite">
              {status === "saved" && (
                <span className="ps-toast inline-flex items-center gap-1.5 font-semibold text-[#2D6A4F]">
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
                  {firstErrorMessage}.
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
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#D5E6DB] bg-white px-5 py-2.5 text-sm font-semibold text-[#14251D] transition-colors hover:bg-[#F3F9F5] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                <RotateCcw size={15} />
                Discard
              </button>
              <button
                type="submit"
                disabled={!isDirty}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#2D6A4F] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#245A41] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                <Save size={15} />
                Save changes
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* ================= DELETE ACCOUNT POPUP ================= */}
      {showDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="ps-backdrop absolute inset-0 bg-black/50"
            onClick={closeDelete}
            aria-hidden="true"
          />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="ps-card ps-panel relative w-full max-w-md p-6 sm:p-7"
          >
            <button
              type="button"
              onClick={closeDelete}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[#5E7067] hover:bg-[#F3F9F5]"
            >
              <X size={18} />
            </button>

            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FDF0F5] text-[#BE185D]">
              <AlertTriangle size={22} />
            </span>

            <h2 id="delete-title" className="mt-4 text-[19px] font-bold" style={{ color: INK }}>
              Delete your account?
            </h2>
            <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: MUTED }}>
              Your profile, bank details and preferences will be permanently removed.
              You will be logged out and this action can't be undone.
            </p>

            <label htmlFor="deleteConfirm" className="mt-5 block text-[13px] font-semibold" style={{ color: INK }}>
              Type <span className="font-bold text-[#BE185D]">DELETE</span> to confirm
            </label>
            <input
              id="deleteConfirm"
              type="text"
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
              placeholder="DELETE"
              autoComplete="off"
              autoFocus
              className="ps-input mt-1.5"
            />
            {deleteError && (
              <p className="mt-2 text-xs font-medium text-[#BE185D]">{deleteError}</p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={closeDelete}
                className="flex-1 rounded-full border border-[#D5E6DB] bg-white px-5 py-2.5 text-sm font-semibold text-[#14251D] hover:bg-[#F3F9F5]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteText.trim().toUpperCase() !== "DELETE"}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#BE185D] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#9D174D] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}