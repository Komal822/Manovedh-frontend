import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Plus,
  CalendarDays,
  MoreVertical,
  X,
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  NotebookPen,
  Trash2,
  Check,
} from "lucide-react";

import Sidebar from "./Sidebar";

// Hero image
import heroImage from "../../assets/councellor-images/patients.png";


const HERO_IMAGE = heroImage;
const PAGE_SIZE = 5;

const INITIAL_PATIENTS = [
  { id: 1, name: "John Smith", age: 24, gender: "Male", problem: "Anxiety", status: "stable", last: "Yesterday", next: "Tomorrow, 10:00 AM", avatar: "" },
  { id: 2, name: "Emma Wilson", age: 19, gender: "Female", problem: "Stress", status: "moderate", last: "5 Days Ago", next: "Fri, 16 May, 11:30 AM", avatar: "" },
  { id: 3, name: "David Brown", age: 28, gender: "Male", problem: "Depression", status: "high", last: "2 Weeks Ago", next: "", avatar: "" },
  { id: 4, name: "Sophia Johnson", age: 22, gender: "Female", problem: "Self Esteem", status: "stable", last: "3 Days Ago", next: "Mon, 19 May, 2:30 PM", avatar: "" },
  { id: 5, name: "Michael Davis", age: 31, gender: "Male", problem: "Relationship Issues", status: "moderate", last: "1 Week Ago", next: "Thu, 15 May, 4:00 PM", avatar: "" },
  { id: 6, name: "Olivia Martinez", age: 26, gender: "Female", problem: "Anxiety", status: "stable", last: "2 Days Ago", next: "Tue, 20 May, 10:30 AM", avatar: "" },
  { id: 7, name: "Liam Anderson", age: 33, gender: "Male", problem: "Work Stress", status: "stable", last: "4 Days Ago", next: "Wed, 21 May, 1:00 PM", avatar: "" },
  { id: 8, name: "Charlotte Clark", age: 29, gender: "Female", problem: "Sleep Issues", status: "moderate", last: "6 Days Ago", next: "Thu, 22 May, 3:00 PM", avatar: "" },
  { id: 9, name: "Noah Taylor", age: 21, gender: "Male", problem: "Social Anxiety", status: "stable", last: "Yesterday", next: "Fri, 23 May, 9:30 AM", avatar: "" },
  { id: 10, name: "Ava Thomas", age: 35, gender: "Female", problem: "Grief", status: "moderate", last: "1 Week Ago", next: "Mon, 26 May, 11:00 AM", avatar: "" },
  { id: 11, name: "Henry Allen", age: 40, gender: "Male", problem: "Panic Attacks", status: "high", last: "10 Days Ago", next: "Tomorrow, 4:30 PM", avatar: "" },
  { id: 12, name: "Isabella Moore", age: 23, gender: "Female", problem: "Self Esteem", status: "stable", last: "3 Days Ago", next: "Tue, 27 May, 2:00 PM", avatar: "" },
  { id: 13, name: "James Lewis", age: 37, gender: "Male", problem: "Anger Management", status: "moderate", last: "5 Days Ago", next: "Wed, 28 May, 5:00 PM", avatar: "" },
  { id: 14, name: "Ethan Jackson", age: 27, gender: "Male", problem: "Stress", status: "stable", last: "2 Days Ago", next: "Thu, 29 May, 10:00 AM", avatar: "" },
  { id: 15, name: "Amelia Walker", age: 30, gender: "Female", problem: "Burnout", status: "moderate", last: "1 Week Ago", next: "Fri, 30 May, 12:00 PM", avatar: "" },
  { id: 16, name: "Mia White", age: 20, gender: "Female", problem: "Exam Anxiety", status: "stable", last: "Yesterday", next: "Mon, 2 Jun, 3:30 PM", avatar: "" },
  { id: 17, name: "Benjamin Hall", age: 45, gender: "Male", problem: "Life Transition", status: "moderate", last: "8 Days Ago", next: "Tue, 3 Jun, 1:30 PM", avatar: "" },
  { id: 18, name: "Lucas Harris", age: 25, gender: "Male", problem: "Loneliness", status: "stable", last: "4 Days Ago", next: "Wed, 4 Jun, 11:30 AM", avatar: "" },
];

const STATUS = {
  stable: {
    label: "Stable",
    pill: "bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]/70",
    dot: "bg-[#10B981]",
    tab: "bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]/60 hover:bg-[#D1FAE5]",
  },
  moderate: {
    label: "Moderate",
    pill: "bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]/70",
    dot: "bg-[#F59E0B]",
    tab: "bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]/60 hover:bg-[#FEF3C7]",
  },
  high: {
    label: "High Risk",
    pill: "bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]/80",
    dot: "bg-[#F43F5E]",
    tab: "bg-[#FFF1F2] text-[#9F1239] border border-[#FECDD3]/60 hover:bg-[#FFE4E6]",
  },
};

/* ============================================================
   SHARED
============================================================ */

const CARD =
  "rounded-[22px] border border-[#E3EDE6] bg-white shadow-[0_10px_30px_-12px_rgba(35,78,61,0.12)]";

/* ============================================================
   MAIN
============================================================ */

export default function Patients({
  onLogout,
  onNavigate,
  sidebarCollapsed,
  onToggleSidebar,
}) {
  const sidebarWidth = sidebarCollapsed ? 76 : 268;

  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [showAdd, setShowAdd] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [activeCall, setActiveCall] = useState(null); // patient currently in a call

  const counts = useMemo(
    () => ({
      all: patients.length,
      stable: patients.filter((p) => p.status === "stable").length,
      moderate: patients.filter((p) => p.status === "moderate").length,
      high: patients.filter((p) => p.status === "high").length,
    }),
    [patients]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return patients.filter(
      (p) =>
        (filter === "all" || p.status === filter) &&
        (!q || p.name.toLowerCase().includes(q))
    );
  }, [patients, query, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(startIdx, startIdx + PAGE_SIZE);

  const handleQuery = (v) => {
    setQuery(v);
    setPage(1);
  };
  const handleFilter = (f) => {
    setFilter(f);
    setPage(1);
  };

  const handleAddPatient = (data) => {
    setPatients((prev) => [{ ...data, id: Date.now() }, ...prev]);
    setQuery("");
    setFilter("all");
    setPage(1);
    setShowAdd(false);
  };

  /* ---------- Session flow: pending -> accepted -> (call) -> completed ---------- */
  const updateSession = (id, session) =>
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, session } : p)));

  const handleAccept = (p) => updateSession(p.id, "accepted");
  const handleDecline = (p) => updateSession(p.id, "declined");
  const handleJoin = (p) => setActiveCall(p);

  const handleEndCall = (notes) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === activeCall.id
          ? { ...p, session: "completed", notes: [...(p.notes || []), ...notes] }
          : p
      )
    );
    setActiveCall(null);
  };

  return (
    <div
      className="min-h-screen bg-[#F2F6F3] text-gray-800 antialiased"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      {/* Font + animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        /* Fraunces is used ONLY on the main banner heading (same as dashboard hero) */
        .cd-display { font-family: 'Fraunces', Georgia, serif; letter-spacing: -0.01em; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .anim-fade-1{animation:fadeUp .8s ease-out both}
        .anim-fade-2{animation:fadeUp .8s ease-out .2s both}
        @media (prefers-reduced-motion: reduce){
          .anim-fade-1,.anim-fade-2{animation:none}
        }
      `}</style>

      <div className="font-sans">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={onToggleSidebar}
          activePage="Patients"
          onNavigate={onNavigate}
          onLogout={onLogout}
          partnerName="Prem Zumble"
        />
      </div>

      <main
        className="min-h-screen transition-[margin] duration-300 ease-in-out"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <div className="mx-auto w-full max-w-[1400px] space-y-6 p-4 md:p-6 lg:p-8">
          <Banner />

          <TitleBar onAdd={() => setShowAdd(true)} />

          <FiltersBar
            query={query}
            onQuery={handleQuery}
            filter={filter}
            onFilter={handleFilter}
            counts={counts}
          />

          {/* PATIENT LIST */}
          <section className="space-y-3.5" aria-label="Patient list">
            {visible.length === 0 ? (
              <div className={`${CARD} p-10 text-center`}>
                <p className="text-sm font-semibold text-gray-700">No patients found</p>
                <p className="mt-1 text-xs text-gray-500">
                  Try a different name or clear the filter.
                </p>
              </div>
            ) : (
              visible.map((p) => (
                <PatientCard
                  key={p.id}
                  patient={p}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  onJoin={handleJoin}
                />
              ))
            )}
          </section>

          <Pagination
            from={filtered.length === 0 ? 0 : startIdx + 1}
            to={startIdx + visible.length}
            total={filtered.length}
            page={currentPage}
            totalPages={totalPages}
            onPage={setPage}
          />
        </div>
      </main>

      {showAdd && (
        <AddPatientModal
          onClose={() => setShowAdd(false)}
          onAdd={handleAddPatient}
        />
      )}

      {activeCall && (
        <VideoCallModal patient={activeCall} onEnd={handleEndCall} />
      )}
    </div>
  );
}

function Avatar({ name, src, size = "h-14 w-14", textSize = "text-sm" }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${size} flex-shrink-0 rounded-2xl object-cover shadow-sm ring-1 ring-[#E3EDE6]`}
      />
    );
  }
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
  return (
    <div
      className={`${size} ${textSize} flex flex-shrink-0 items-center justify-center rounded-2xl bg-[#E3F2EA] font-bold text-[#257B51] shadow-sm ring-1 ring-[#E3EDE6]`}
    >
      {initials}
    </div>
  );
}

/* ============================================================
   BANNER
============================================================ */

function Banner() {
  return (
    <section className="relative flex min-h-[170px] items-center overflow-hidden rounded-[30px] border border-[#9DD4B8] bg-gradient-to-r from-[#B8E2CB] via-[#C9EBD8] to-[#DCF2E4] shadow-sm md:min-h-[220px] lg:min-h-[260px]">
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Counselling illustration"
          className="h-full w-full object-cover object-right"
        />

        {/* Mobile overlay */}
        <div className="absolute inset-0 bg-black/55 md:hidden" />

        {/* Desktop overlay */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.62) 30%, rgba(0,0,0,0.25) 48%, rgba(0,0,0,0) 62%)",
          }}
        />
      </div>

      <div className="relative z-10 flex w-full flex-col items-start justify-between gap-5 px-6 py-6 md:flex-row md:items-center md:px-10 md:py-8">
        <div>
          <h2 className="cd-display anim-fade-1 text-3xl font-semibold leading-[1.1] text-white drop-shadow-md md:text-[40px]">
            Better Support,
            <br />
            Brighter Tomorrows
          </h2>
          <p className="anim-fade-2 mt-3 max-w-xl text-sm font-medium text-white/90 drop-shadow md:text-base">
            5 patient sessions scheduled for today. Review diagnostic updates and
            prepare session notes.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   TITLE BAR
============================================================ */

function TitleBar({ onAdd }) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Patients
        </h1>
        <p className="mt-1 text-sm text-slate-500 md:text-base">
          Manage and monitor all your patients.
        </p>
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-2 self-start rounded-2xl bg-[#234E3D] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#173629] hover:shadow-lg active:scale-95 sm:self-auto"
      >
        <Plus size={16} strokeWidth={2.5} />
        Add Patient
      </button>
    </div>
  );
}

/* ============================================================
   ADD PATIENT MODAL
============================================================ */

const EMPTY_FORM = {
  name: "",
  age: "",
  gender: "Male",
  problem: "",
  status: "stable",
  next: "",
};

const FIELD =
  "w-full rounded-xl border border-[#B7CDBD] bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition focus:border-[#234E3D] focus:outline-none focus:ring-2 focus:ring-[#487053]/30";

function formatNext(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const day = d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const time = d
    .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
    .toUpperCase();
  return `${day}, ${time}`;
}

function AddPatientModal({ onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = "Please enter the patient's name";
    const ageNum = Number(form.age);
    if (!form.age) er.age = "Please enter age";
    else if (!Number.isInteger(ageNum) || ageNum < 1 || ageNum > 120)
      er.age = "Enter an age between 1 and 120";
    if (!form.problem.trim()) er.problem = "Please enter the problem";
    return er;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length > 0) return;

    onAdd({
      name: form.name.trim(),
      age: Number(form.age),
      gender: form.gender,
      problem: form.problem.trim(),
      status: form.status,
      last: "New patient",
      next: formatNext(form.next),
      avatar: "",
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-patient-title"
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[30px] border border-[#C8DACD] bg-white p-6 shadow-2xl md:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="add-patient-title" className="text-xl font-bold text-slate-900">
              Add New Patient
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Fill in the patient's basic details.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-xl p-1.5 text-slate-400 transition hover:bg-[#F4F7F4] hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Name */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Full Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={set("name")}
              placeholder="e.g. Rahul Patil"
              className={FIELD}
              autoFocus
            />
            {errors.name && <p className="mt-1 text-[11px] text-rose-600">{errors.name}</p>}
          </div>

          {/* Age */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Age</label>
            <input
              type="number"
              min="1"
              max="120"
              value={form.age}
              onChange={set("age")}
              placeholder="e.g. 24"
              className={FIELD}
            />
            {errors.age && <p className="mt-1 text-[11px] text-rose-600">{errors.age}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Gender</label>
            <select value={form.gender} onChange={set("gender")} className={FIELD}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          {/* Problem */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Problem</label>
            <input
              type="text"
              value={form.problem}
              onChange={set("problem")}
              placeholder="e.g. Anxiety, Stress, Sleep Issues"
              className={FIELD}
            />
            {errors.problem && (
              <p className="mt-1 text-[11px] text-rose-600">{errors.problem}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Status</label>
            <select value={form.status} onChange={set("status")} className={FIELD}>
              <option value="stable">Stable</option>
              <option value="moderate">Moderate</option>
              <option value="high">High Risk</option>
            </select>
          </div>

          {/* Next session */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Next Session <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              type="datetime-local"
              value={form.next}
              onChange={set("next")}
              className={FIELD}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#ADC6B3] hover:bg-[#F4F7F4]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-[#234E3D] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#173629] hover:shadow active:scale-95"
          >
            Add Patient
          </button>
        </div>
      </form>
    </div>
  );
}

/* ============================================================
   SEARCH + FILTERS
============================================================ */

function FiltersBar({ query, onQuery, filter, onFilter, counts }) {
  const tabs = [
    { key: "stable", ...STATUS.stable },
    { key: "moderate", ...STATUS.moderate },
    { key: "high", ...STATUS.high },
  ];

  return (
    <div
      className={`${CARD} flex flex-col items-stretch justify-between gap-3 p-3 md:flex-row md:items-center md:p-4`}
    >
      {/* Search Bar Wrapper */}
      <div className="flex max-w-md flex-1 items-center gap-2.5">
        <div className="relative flex h-11 w-full items-center rounded-2xl border-2 border-[#9FBFA9] bg-white px-3.5 shadow-sm transition focus-within:border-[#234E3D] focus-within:ring-4 focus-within:ring-[#487053]/20">
          <Search size={18} className="flex-shrink-0 text-[#234E3D]" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search patient by name..."
            className="h-full w-full bg-transparent pl-3 text-sm font-medium text-slate-900 placeholder-slate-500 focus:outline-none"
          />
        </div>
        <button
          type="button"
          title="Filter patients"
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border-2 border-[#9FBFA9] bg-white text-[#234E3D] shadow-sm transition hover:bg-[#E7EFE8]"
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-medium md:pb-0">
        <button
          type="button"
          onClick={() => onFilter("all")}
          className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 font-semibold transition ${
            filter === "all"
              ? "bg-[#234E3D] text-white shadow-sm"
              : "border border-[#D1E0D4] bg-white text-slate-600 hover:bg-[#F4F7F4]"
          }`}
        >
          All ({counts.all})
        </button>

        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => onFilter(t.key)}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-1.5 transition ${t.tab} ${
              filter === t.key ? "ring-2 ring-offset-1 ring-[#234E3D]/40" : ""
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${t.dot}`} />
            {t.label} ({counts[t.key]})
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   PATIENT CARD
============================================================ */

function PatientCard({ patient: p, onAccept, onDecline, onJoin }) {
  const s = STATUS[p.status];
  const isHigh = p.status === "high";
  const notScheduled = !p.next;
  const session = p.session || "pending"; // pending | accepted | declined | completed

  return (
    <article
      className={`flex flex-col justify-between gap-4 rounded-[22px] border bg-white p-4 shadow-[0_10px_30px_-12px_rgba(35,78,61,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-12px_rgba(35,78,61,0.18)] sm:p-5 lg:flex-row lg:items-center ${
        isHigh ? "border-rose-100 ring-1 ring-rose-500/10" : "border-[#E3EDE6]"
      }`}
    >
      {/* Demographics */}
      <div className="flex min-w-0 items-center gap-4 lg:min-w-[260px]">
        <Avatar name={p.name} src={p.avatar} />
        <div className="min-w-0">
          <h3 className="cursor-pointer truncate text-base font-semibold text-slate-900 transition hover:text-[#234E3D]">
            {p.name}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            {p.age} Years • {p.gender}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-700">
            Problem: <span className="font-semibold text-[#34553E]">{p.problem}</span>
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="flex flex-col sm:items-start lg:min-w-[130px]">
        <span
          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${s.pill}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
          {s.label}
        </span>
        <span
          className={`mt-1.5 text-[11px] ${
            isHigh ? "font-medium text-rose-500" : "text-slate-400"
          }`}
        >
          Last: {p.last}
        </span>
      </div>

      {/* Next session */}
      <div className="flex items-center gap-3 lg:min-w-[210px]">
        <div
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border ${
            notScheduled
              ? "border-rose-100 bg-rose-50 text-rose-600"
              : "border-[#E3EDE6] bg-[#F4F8F5] text-[#34553E]"
          }`}
        >
          <CalendarDays size={20} />
        </div>
        <div>
          <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Next Session
          </span>
          <span
            className={`text-xs font-semibold ${
              notScheduled ? "text-rose-600" : "text-slate-800"
            }`}
          >
            {notScheduled ? "Not Scheduled" : p.next}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-2 sm:border-t-0 sm:pt-0">
        <button
          type="button"
          className="whitespace-nowrap rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition duration-150 hover:border-[#ADC6B3] hover:bg-[#F4F7F4]"
        >
          View Profile
        </button>

        {session === "pending" && (
          <>
            <button
              type="button"
              onClick={() => onDecline(p)}
              className="whitespace-nowrap rounded-xl border border-rose-200 bg-white px-4 py-2 text-xs font-semibold text-rose-600 transition duration-150 hover:bg-rose-50"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={() => onAccept(p)}
              className="whitespace-nowrap rounded-xl bg-[#234E3D] px-4 py-2 text-xs font-semibold text-white shadow-sm transition duration-150 hover:bg-[#173629] hover:shadow"
            >
              Accept
            </button>
          </>
        )}

        {session === "accepted" && (
          <button
            type="button"
            onClick={() => onJoin(p)}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-[#234E3D] px-4 py-2 text-xs font-semibold text-white shadow-sm transition duration-150 hover:bg-[#173629] hover:shadow"
          >
            <Video size={14} />
            Join
          </button>
        )}

        {session === "declined" && (
          <span className="whitespace-nowrap rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-600">
            Declined
          </span>
        )}

        {session === "completed" && (
          <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-xl border border-[#A7F3D0]/70 bg-[#ECFDF5] px-4 py-2 text-xs font-semibold text-[#047857]">
            <Check size={14} />
            Completed
          </span>
        )}

        <button
          type="button"
          aria-label={`More options for ${p.name}`}
          className="rounded-xl p-2 text-slate-400 transition hover:bg-[#F4F7F4] hover:text-slate-600"
        >
          <MoreVertical size={16} />
        </button>
      </div>
    </article>
  );
}

/* ============================================================
   PAGINATION
============================================================ */

function Pagination({ from, to, total, page, totalPages, onPage }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const prevDisabled = page === 1;
  const nextDisabled = page === totalPages;

  return (
    <footer className="flex flex-col items-center justify-between gap-4 pb-4 text-xs font-medium text-slate-500 sm:flex-row">
      <p>
        Showing <span className="font-semibold text-slate-800">{from}</span> to{" "}
        <span className="font-semibold text-slate-800">{to}</span> of{" "}
        <span className="font-semibold text-slate-800">{total}</span> patients
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={prevDisabled}
          onClick={() => onPage(page - 1)}
          className={`rounded-xl border border-[#D1E0D4] bg-white px-3 py-1.5 transition ${
            prevDisabled
              ? "cursor-not-allowed text-slate-400"
              : "text-slate-700 hover:bg-[#F4F7F4]"
          }`}
        >
          Previous
        </button>

        {pages.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onPage(n)}
            aria-current={n === page ? "page" : undefined}
            className={`flex h-8 w-8 items-center justify-center rounded-xl transition ${
              n === page
                ? "bg-[#234E3D] font-semibold text-white"
                : "border border-[#D1E0D4] bg-white text-slate-700 hover:bg-[#F4F7F4]"
            }`}
          >
            {n}
          </button>
        ))}

        <button
          type="button"
          disabled={nextDisabled}
          onClick={() => onPage(page + 1)}
          className={`rounded-xl border border-[#D1E0D4] bg-white px-3 py-1.5 transition ${
            nextDisabled
              ? "cursor-not-allowed text-slate-400"
              : "text-slate-700 hover:bg-[#F4F7F4]"
          }`}
        >
          Next
        </button>
      </div>
    </footer>
  );
}

/* ============================================================
   VIDEO CALL MODAL
   - Patient: motha screen
   - Counsellor: lahan screen (khali ujvi kade)
   - Session notes panel (right side)
============================================================ */

function formatTimer(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function VideoCallModal({ patient, onEnd }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null); // attach WebRTC remote stream here
  const streamRef = useRef(null);

  const [seconds, setSeconds] = useState(0);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [camError, setCamError] = useState(false);
  const [showNotes, setShowNotes] = useState(true);
  const [draft, setDraft] = useState("");
  const [notes, setNotes] = useState([]);

  // Call timer
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Counsellor's local camera + mic
  useEffect(() => {
    let cancelled = false;
    navigator.mediaDevices
      ?.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      })
      .catch(() => setCamError(true));

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // Body scroll lock
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const toggleMic = () => {
    streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = !micOn));
    setMicOn((v) => !v);
  };
  const toggleCam = () => {
    streamRef.current?.getVideoTracks().forEach((t) => (t.enabled = !camOn));
    setCamOn((v) => !v);
  };

  const addNote = () => {
    const text = draft.trim();
    if (!text) return;
    setNotes((prev) => [
      ...prev,
      { id: Date.now(), text, at: formatTimer(seconds) },
    ]);
    setDraft("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addNote();
    }
  };

  const endCall = () => {
    // Save any unsaved text in the draft as well
    const pending = draft.trim()
      ? [{ id: Date.now(), text: draft.trim(), at: formatTimer(seconds) }]
      : [];
    onEnd([...notes, ...pending]);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#0B1511]" role="dialog" aria-modal="true">
      {/* VIDEO AREA */}
      <div className="relative h-full w-full overflow-hidden">
        {/* Patient - motha screen */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#12241C] to-[#0B1511]">
          {/* Placeholder until remote stream arrives */}
          <div className="relative z-0 flex flex-col items-center gap-4">
            <Avatar
              name={patient.name}
              src={patient.avatar}
              size="h-32 w-32"
              textSize="text-3xl"
            />
            <p className="text-sm font-medium text-white/70">Waiting for patient video…</p>
          </div>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="absolute inset-0 z-[1] h-full w-full object-cover"
          />
        </div>

        {/* Top bar */}
        <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-white">{patient.name}</h3>
            <p className="text-xs text-white/70">
              {patient.age} Years • {patient.problem}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white">
              <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
              {formatTimer(seconds)}
            </span>
            <button
              type="button"
              onClick={() => setShowNotes((v) => !v)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                showNotes
                  ? "bg-white text-[#234E3D]"
                  : "bg-white/15 text-white hover:bg-white/25"
              }`}
            >
              <NotebookPen size={14} />
              Notes
            </button>
          </div>
        </div>

        {/* Counsellor - lahan screen (khali ujvi kade) */}
        <div className="absolute bottom-24 right-4 z-10 h-32 w-24 overflow-hidden rounded-2xl border-2 border-white/30 bg-[#1B3329] shadow-xl sm:h-40 sm:w-56">
          {/* Video stays mounted so the stream is not lost when camera is toggled */}
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="h-full w-full -scale-x-100 object-cover"
          />
          {(camError || !camOn) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-[#1B3329] text-white/70">
              <VideoOff size={20} />
              <span className="text-[11px]">
                {camError ? "Camera unavailable" : "Camera off"}
              </span>
            </div>
          )}
          <span className="absolute bottom-1.5 left-2 rounded-md bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white">
            You
          </span>
        </div>

        {/* Controls */}
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
          <button
            type="button"
            onClick={toggleMic}
            aria-label="Toggle microphone"
            className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
              micOn ? "bg-white/15 text-white hover:bg-white/25" : "bg-white text-slate-800"
            }`}
          >
            {micOn ? <Mic size={20} /> : <MicOff size={20} />}
          </button>
          <button
            type="button"
            onClick={toggleCam}
            aria-label="Toggle camera"
            className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
              camOn ? "bg-white/15 text-white hover:bg-white/25" : "bg-white text-slate-800"
            }`}
          >
            {camOn ? <Video size={20} /> : <VideoOff size={20} />}
          </button>
          <button
            type="button"
            onClick={endCall}
            aria-label="End call"
            className="flex h-12 items-center gap-2 rounded-full bg-rose-600 px-5 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            <PhoneOff size={18} />
            End
          </button>
        </div>
      </div>

      {/* NOTES PANEL */}
      {showNotes && (
        <aside className="absolute right-4 top-20 z-20 flex max-h-[calc(100vh-20rem)] w-[calc(100%-2rem)] flex-col overflow-hidden rounded-2xl border border-[#C8DACD] bg-white shadow-2xl sm:max-h-[calc(100vh-24rem)] sm:w-[440px]">
          <div className="flex items-center justify-between border-b border-[#E3EDE6] px-4 py-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Session Notes</h4>
              <p className="text-[11px] text-slate-500">
                Write down what the patient says
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowNotes(false)}
              aria-label="Close notes"
              className="rounded-xl p-1.5 text-slate-400 transition hover:bg-[#F4F7F4] hover:text-slate-600"
            >
              <X size={18} />
            </button>
          </div>

          {/* Saved notes */}
          <div className="min-h-[140px] flex-1 space-y-2.5 overflow-y-auto px-4 py-3 sm:min-h-[220px]">
            {notes.length === 0 ? (
              <p className="py-3 text-center text-xs text-slate-400">
                No notes yet. Type below and press Enter to save.
              </p>
            ) : (
              notes.map((n) => (
                <div
                  key={n.id}
                  className="group rounded-xl border border-[#E3EDE6] bg-[#F4F8F5] p-3"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#257B51]">{n.at}</span>
                    <button
                      type="button"
                      onClick={() => setNotes((prev) => prev.filter((x) => x.id !== n.id))}
                      aria-label="Delete note"
                      className="text-slate-400 opacity-0 transition hover:text-rose-500 focus:opacity-100 group-hover:opacity-100"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                    {n.text}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="border-t border-[#E3EDE6] p-3">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKey}
              rows={3}
              placeholder="Type what the patient says… (Enter to save)"
              className={`${FIELD} resize-none`}
            />
            <button
              type="button"
              onClick={addNote}
              className="mt-2 w-full rounded-xl bg-[#234E3D] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#173629] active:scale-95"
            >
              Add Note
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}