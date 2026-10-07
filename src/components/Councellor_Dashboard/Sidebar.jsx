import React, { useMemo, useState } from "react";
import {
  Plus,
  Search,
  SlidersHorizontal,
  CalendarDays,
  MoreVertical,
} from "lucide-react";

import Sidebar from "./Sidebar";

// Banner image: tujhya image cha path de (src/assets/councellor-images/patients.png)
import bannerImage from "../assets/councellor-images/patients.png";

/* ============================================================
   DATA  (ithe tujhya API cha data tak)
   status: "Stable" | "Moderate" | "High Risk"
   next: null => "Not Scheduled"
   avatar: "" => naava chi aadyakshare dakhvli jatil
============================================================ */

const PATIENTS = [
  { id: 1, name: "John Smith", age: 24, gender: "Male", problem: "Anxiety", status: "Stable", last: "Yesterday", next: "Tomorrow, 10:00 AM", avatar: "" },
  { id: 2, name: "Emma Wilson", age: 19, gender: "Female", problem: "Stress", status: "Moderate", last: "5 Days Ago", next: "Fri, 16 May, 11:30 AM", avatar: "" },
  { id: 3, name: "David Brown", age: 28, gender: "Male", problem: "Depression", status: "High Risk", last: "2 Weeks Ago", next: null, avatar: "" },
  { id: 4, name: "Sophia Johnson", age: 22, gender: "Female", problem: "Self Esteem", status: "Stable", last: "3 Days Ago", next: "Mon, 19 May, 2:30 PM", avatar: "" },
  { id: 5, name: "Michael Davis", age: 31, gender: "Male", problem: "Relationship Issues", status: "Moderate", last: "1 Week Ago", next: "Thu, 15 May, 4:00 PM", avatar: "" },
];

const PAGE_SIZE = 5;

const STATUS = {
  Stable: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
    dot: "bg-emerald-500",
    chip: "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-200/60",
  },
  Moderate: {
    badge: "bg-amber-50 text-amber-700 border-amber-200/70",
    dot: "bg-amber-500",
    chip: "bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-200/60",
  },
  "High Risk": {
    badge: "bg-rose-50 text-rose-700 border-rose-200/80",
    dot: "bg-rose-500",
    chip: "bg-rose-50 text-rose-800 hover:bg-rose-100 border-rose-200/60",
  },
};

/* ============================================================
   PAGE
============================================================ */

export default function Patients({ onLogout }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarWidth = sidebarCollapsed ? 78 : 260;

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const counts = useMemo(() => {
    const c = { All: PATIENTS.length, Stable: 0, Moderate: 0, "High Risk": 0 };
    PATIENTS.forEach((p) => (c[p.status] += 1));
    return c;
  }, []);

  const filtered = useMemo(
    () =>
      PATIENTS.filter(
        (p) =>
          (filter === "All" || p.status === filter) &&
          p.name.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [query, filter]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(startIdx, startIdx + PAGE_SIZE);

  const changeFilter = (f) => {
    setFilter(f);
    setPage(1);
  };

  return (
    <div
      className="min-h-screen bg-[#F2F6F3] text-slate-800 antialiased selection:bg-[#D1E0D4] selection:text-[#173629]"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');
        .heading-serif { font-family: 'Playfair Display', Georgia, serif; }
        .patient-card { transition: all .25s cubic-bezier(.16,1,.3,1); }
        .patient-card:hover { transform: translateY(-2px); }
        @media (prefers-reduced-motion: reduce) { .patient-card { transition: none; } .patient-card:hover { transform: none; } }
      `}</style>

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
        activePage="Patients"
        onLogout={onLogout}
        partnerName="Prem Zumble"
      />

      <main
        className="min-h-screen transition-[margin] duration-300 ease-in-out"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10 lg:px-8">
          {/* BANNER */}
          <section className="relative mb-8 overflow-hidden rounded-3xl bg-slate-900 text-white shadow-[0_4px_20px_-2px_rgba(35,78,61,0.05),0_2px_6px_-1px_rgba(0,0,0,0.02)]">
            <div className="absolute inset-0">
              <img
                src={bannerImage}
                alt="Counseling illustration"
                className="h-full w-full object-cover object-right"
              />
            </div>

            <div className="relative z-10 flex flex-col items-start justify-between gap-4 px-6 py-6 md:flex-row md:items-center md:px-10 md:py-8">
              <div>
                <h2 className="heading-serif text-xl font-bold tracking-wide text-black md:text-2xl">
                  Better Support, Brighter Tomorrows
                </h2>
                <p className="mt-1 max-w-xl text-sm text-slate-800">
                  5 patient sessions scheduled for today. Review diagnostic
                  updates and prepare session notes.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <BannerStat value="18" label="Active Patients" valueClass="text-[#234E3D]" />
                <BannerStat value="4" label="Pending Notes" valueClass="text-emerald-700" />
              </div>
            </div>
          </section>

          {/* TITLE */}
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="heading-serif text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Patients
              </h1>
              <p className="mt-1 text-sm font-normal text-slate-500 md:text-base">
                Manage and monitor all your patients.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-[#234E3D] px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-200 hover:bg-[#173629] hover:shadow-lg active:scale-95"
            >
              <Plus size={16} strokeWidth={2.5} />
              Add Patient
            </button>
          </div>

          {/* SEARCH + FILTERS */}
          <div className="mb-6 flex flex-col items-stretch justify-between gap-3 rounded-2xl border border-[#E7EFE8] bg-white p-3 shadow-[0_4px_20px_-2px_rgba(35,78,61,0.05)] md:flex-row md:items-center md:p-4">
            <div className="flex max-w-md flex-1 items-center gap-2.5">
              <div className="relative w-full">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search patient by name..."
                  className="w-full rounded-xl border border-[#D1E0D4]/90 bg-[#F4F7F4]/70 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition focus:border-[#5F8C6B] focus:outline-none focus:ring-2 focus:ring-[#487053]/30"
                />
              </div>

              <button
                type="button"
                title="Filter patients"
                className="shrink-0 rounded-xl border border-[#D1E0D4] bg-[#E7EFE8]/70 p-2.5 text-[#234E3D] transition hover:bg-[#D1E0D4]/80"
              >
                <SlidersHorizontal size={20} />
              </button>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-medium text-slate-600 md:pb-0">
              <button
                type="button"
                onClick={() => changeFilter("All")}
                className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 font-semibold transition ${
                  filter === "All"
                    ? "bg-[#234E3D] text-white shadow-sm"
                    : "bg-[#F4F7F4] text-slate-700 hover:bg-[#E7EFE8]"
                }`}
              >
                All ({counts.All})
              </button>

              {["Stable", "Moderate", "High Risk"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => changeFilter(s)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-3 py-1.5 transition ${STATUS[s].chip} ${
                    filter === s ? "ring-2 ring-[#234E3D]/30" : ""
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${STATUS[s].dot}`} />
                  {s} ({counts[s]})
                </button>
              ))}
            </div>
          </div>

          {/* LIST */}
          <div className="space-y-3.5">
            {visible.length === 0 && (
              <div className="rounded-2xl border border-[#E7EFE8] bg-white p-10 text-center text-sm text-slate-500">
                No patients found.
              </div>
            )}

            {visible.map((p) => (
              <PatientCard key={p.id} patient={p} />
            ))}
          </div>

          {/* PAGINATION */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 text-xs font-medium text-slate-500 sm:flex-row">
            <p>
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {filtered.length === 0 ? 0 : startIdx + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-800">
                {startIdx + visible.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">{filtered.length}</span>{" "}
              patients
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
                className="rounded-lg border border-[#D1E0D4] bg-white px-3 py-1.5 text-slate-700 transition hover:bg-[#F4F7F4] disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-white"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                    n === currentPage
                      ? "bg-[#234E3D] font-semibold text-white"
                      : "border border-[#D1E0D4] bg-white text-slate-700 hover:bg-[#F4F7F4]"
                  }`}
                >
                  {n}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setPage(currentPage + 1)}
                className="rounded-lg border border-[#D1E0D4] bg-white px-3 py-1.5 text-slate-700 transition hover:bg-[#F4F7F4] disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-white"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   BANNER STAT
============================================================ */

function BannerStat({ value, label, valueClass }) {
  return (
    <div className="rounded-2xl border border-white/40 bg-white/60 px-4 py-2 text-center backdrop-blur-md">
      <span className={`heading-serif block text-2xl font-bold ${valueClass}`}>
        {value}
      </span>
      <span className="text-[11px] uppercase tracking-wider text-slate-700">
        {label}
      </span>
    </div>
  );
}

/* ============================================================
   PATIENT CARD
============================================================ */

function PatientCard({ patient: p }) {
  const risk = p.status === "High Risk";
  const s = STATUS[p.status];
  const initials = p.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <article
      className={`patient-card flex flex-col justify-between gap-4 rounded-2xl border bg-white p-4 shadow-[0_4px_20px_-2px_rgba(35,78,61,0.05),0_2px_6px_-1px_rgba(0,0,0,0.02)] sm:p-5 lg:flex-row lg:items-center ${
        risk ? "border-rose-100/80 ring-1 ring-rose-500/10" : "border-[#E7EFE8]"
      }`}
    >
      {/* LEFT */}
      <div className="flex min-w-[260px] items-center gap-4">
        {p.avatar ? (
          <img
            src={p.avatar}
            alt={p.name}
            className="h-14 w-14 rounded-2xl object-cover shadow-sm ring-1 ring-[#D1E0D4]"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E7EFE8] text-sm font-bold text-[#34553E] shadow-sm ring-1 ring-[#D1E0D4]">
            {initials}
          </div>
        )}

        <div>
          <h3 className="cursor-pointer text-base font-semibold text-slate-900 transition hover:text-[#234E3D]">
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

      {/* STATUS */}
      <div className="flex min-w-[130px] flex-col sm:items-start">
        <span
          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${s.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
          {p.status}
        </span>
        <span
          className={`mt-1.5 text-[11px] ${
            risk ? "font-medium text-rose-500" : "text-slate-400"
          }`}
        >
          Last: {p.last}
        </span>
      </div>

      {/* NEXT SESSION */}
      <div className="flex min-w-[210px] items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
            p.next
              ? "border-[#D1E0D4]/80 bg-[#F4F7F4] text-[#34553E]"
              : "border-rose-200 bg-rose-50 text-rose-600"
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
              p.next ? "text-slate-800" : "text-rose-600"
            }`}
          >
            {p.next || "Not Scheduled"}
          </span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-2 sm:border-t-0 sm:pt-0">
        <button
          type="button"
          className="whitespace-nowrap rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition duration-150 hover:border-[#ADC6B3] hover:bg-[#F4F7F4]"
        >
          View Profile
        </button>
        <button
          type="button"
          className="whitespace-nowrap rounded-xl bg-[#234E3D] px-4 py-2 text-xs font-semibold text-white shadow-sm transition duration-150 hover:bg-[#173629] hover:shadow"
        >
          Start Session
        </button>
        <button
          type="button"
          title="More Options"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-[#F4F7F4] hover:text-slate-600"
        >
          <MoreVertical size={16} />
        </button>
      </div>
    </article>
  );
}