import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search, SlidersHorizontal, Plus, CalendarDays, MoreVertical, X, Clock, Menu,
} from "lucide-react";

import Sidebar from "./Sidebar";
import {
  sessionStore, useSessions, useNow, findConflict, joinState, sessionEnd, formatSlot, formatDay, toLocalInput,
} from "./sessionStore";
import { Avatar, FIELD, JoinButton, RescheduleModal, VideoCallModal } from "./SessionUi";

import heroImage from "../../assets/councellor-images/patients.png";

const HERO_IMAGE = heroImage;
const PAGE_SIZE = 5;

const INITIAL_PATIENTS = [
  { id: 1, name: "John Smith", age: 24, gender: "Male", problem: "Anxiety", status: "stable", last: "Yesterday", avatar: "" },
  { id: 2, name: "Emma Wilson", age: 19, gender: "Female", problem: "Stress", status: "moderate", last: "5 Days Ago", avatar: "" },
  { id: 3, name: "David Brown", age: 28, gender: "Male", problem: "Depression", status: "high", last: "2 Weeks Ago", avatar: "" },
  { id: 4, name: "Sophia Johnson", age: 22, gender: "Female", problem: "Self Esteem", status: "stable", last: "3 Days Ago", avatar: "" },
  { id: 5, name: "Michael Davis", age: 31, gender: "Male", problem: "Relationship Issues", status: "moderate", last: "1 Week Ago", avatar: "" },
  { id: 6, name: "Olivia Martinez", age: 26, gender: "Female", problem: "Anxiety", status: "stable", last: "2 Days Ago", avatar: "" },
  { id: 7, name: "Liam Anderson", age: 33, gender: "Male", problem: "Work Stress", status: "stable", last: "4 Days Ago", avatar: "" },
  { id: 8, name: "Charlotte Clark", age: 29, gender: "Female", problem: "Sleep Issues", status: "moderate", last: "6 Days Ago", avatar: "" },
  { id: 9, name: "Noah Taylor", age: 21, gender: "Male", problem: "Social Anxiety", status: "stable", last: "Yesterday", avatar: "" },
  { id: 10, name: "Ava Thomas", age: 35, gender: "Female", problem: "Grief", status: "moderate", last: "1 Week Ago", avatar: "" },
  { id: 11, name: "Henry Allen", age: 40, gender: "Male", problem: "Panic Attacks", status: "high", last: "10 Days Ago", avatar: "" },
  { id: 12, name: "Isabella Moore", age: 23, gender: "Female", problem: "Self Esteem", status: "stable", last: "3 Days Ago", avatar: "" },
  { id: 13, name: "James Lewis", age: 37, gender: "Male", problem: "Anger Management", status: "moderate", last: "5 Days Ago", avatar: "" },
  { id: 14, name: "Ethan Jackson", age: 27, gender: "Male", problem: "Stress", status: "stable", last: "2 Days Ago", avatar: "" },
  { id: 15, name: "Amelia Walker", age: 30, gender: "Female", problem: "Burnout", status: "moderate", last: "1 Week Ago", avatar: "" },
  { id: 16, name: "Mia White", age: 20, gender: "Female", problem: "Exam Anxiety", status: "stable", last: "Yesterday", avatar: "" },
  { id: 17, name: "Benjamin Hall", age: 45, gender: "Male", problem: "Life Transition", status: "moderate", last: "8 Days Ago", avatar: "" },
  { id: 18, name: "Lucas Harris", age: 25, gender: "Male", problem: "Loneliness", status: "stable", last: "4 Days Ago", avatar: "" },
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

const CARD =
  "rounded-[22px] border border-[#DEEEEE] bg-white shadow-[0_10px_30px_-12px_rgba(42,140,130,0.14)]";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A8C82] focus-visible:ring-offset-2 focus-visible:ring-offset-[#ECF5F4]";

const BTN_OUTLINE =
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-[#CFE6E3] bg-white px-2.5 py-2 text-[11px] font-semibold text-[#122A2E] transition duration-150 hover:border-[#9FD0CB] hover:bg-[#F0F9F7] sm:px-4 sm:text-xs";

const SCROLLBAR_CSS = `
  html,
  .pt-scroll,
  .pt-scroll * {
    scrollbar-width: thin;
    scrollbar-color: #2A8C82 #E6F2F0;
  }
  .pt-scroll .pt-noscroll { scrollbar-width: none; }

  @supports selector(::-webkit-scrollbar) {
    html,
    .pt-scroll,
    .pt-scroll * {
      scrollbar-width: auto;
      scrollbar-color: auto;
    }
    html::-webkit-scrollbar,
    .pt-scroll::-webkit-scrollbar,
    .pt-scroll *::-webkit-scrollbar { width: 6px; height: 6px; }
    html::-webkit-scrollbar-track,
    .pt-scroll::-webkit-scrollbar-track,
    .pt-scroll *::-webkit-scrollbar-track { background: #E6F2F0; }
    html::-webkit-scrollbar-thumb,
    .pt-scroll::-webkit-scrollbar-thumb,
    .pt-scroll *::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #2A8C82 0%, #22B8AA 100%);
      border-radius: 999px;
    }
    html::-webkit-scrollbar-thumb:hover,
    .pt-scroll::-webkit-scrollbar-thumb:hover,
    .pt-scroll *::-webkit-scrollbar-thumb:hover { background: #1E9E93; }
    html::-webkit-scrollbar-corner,
    .pt-scroll::-webkit-scrollbar-corner,
    .pt-scroll *::-webkit-scrollbar-corner { background: transparent; }
    .pt-scroll .pt-noscroll::-webkit-scrollbar { display: none; width: 0; height: 0; }
  }
`;

/* ============================================================
   HELPERS
============================================================ */

function useIsDesktop() {
  const query = "(min-width: 1024px)";
  const get = () =>
    typeof window !== "undefined" && window.matchMedia ? window.matchMedia(query).matches : true;
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

function pageWindow(page, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const nums = [...new Set([1, total, page - 1, page, page + 1])]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);
  const out = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) out.push(`…${n}`);
    out.push(n);
  });
  return out;
}

/* ============================================================
   MAIN
============================================================ */

export default function Patients({
  onLogout, onNavigate, sidebarCollapsed = false, onToggleSidebar,
}) {
  const isDesktop = useIsDesktop();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const sidebarWidth = sidebarCollapsed ? 76 : 268;

  const sessions = useSessions();
  const now = useNow();

  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [showAdd, setShowAdd] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [reschedule, setReschedule] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (isDesktop) setMobileNavOpen(false);
  }, [isDesktop]);

  useEffect(() => {
    if (!mobileNavOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileNavOpen]);

  const go = (target) => {
    if (typeof onNavigate === "function") onNavigate(target);
  };

  const navigateFromDrawer = (target) => {
    setMobileNavOpen(false);
    go(target);
  };

  const counts = useMemo(
    () => ({
      all: patients.length,
      stable: patients.filter((p) => p.status === "stable").length,
      moderate: patients.filter((p) => p.status === "moderate").length,
      high: patients.filter((p) => p.status === "high").length,
    }),
    [patients]
  );

  const sessionInfo = useMemo(() => {
    const map = new Map();
    for (const p of patients) {
      const mine = sessions.filter((s) => s.patientId === p.id);
      map.set(p.id, {
        upcoming:
          mine
            .filter((s) => s.status === "scheduled" && sessionEnd(s) > now)
            .sort((a, b) => a.start - b.start)[0] || null,
        pending: mine.find((s) => s.status === "pending") || null,
        lastDone:
          mine.filter((s) => s.status === "completed").sort((a, b) => b.start - a.start)[0] || null,
      });
    }
    return map;
  }, [patients, sessions, now]);

  const todayCount = sessions.filter(
    (s) => s.status === "scheduled" && sessionEnd(s) > now && formatDay(s.start, now) === "Today"
  ).length;
  const pendingCount = sessions.filter((s) => s.status === "pending").length;

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
  const changePage = (n) => {
    setPage(n);
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    listRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const handleAddPatient = ({ nextTs, ...data }) => {
    const id = Date.now();
    setPatients((prev) => [{ ...data, id }, ...prev]);
    if (nextTs) {
      sessionStore.schedule({
        patientId: id,
        name: data.name,
        age: data.age,
        gender: data.gender,
        problem: data.problem,
        start: nextTs,
      });
    }
    setQuery("");
    setFilter("all");
    setPage(1);
    setShowAdd(false);
  };

  const handleJoin = (s) => {
    if (joinState(s, Date.now()) === "open") setActiveCall(s);
  };

  const handleEndCall = (notes) => {
    sessionStore.complete(activeCall.id, notes);
    setActiveCall(null);
  };

  return (
    <div
      className="pt-scroll min-h-[100dvh] overflow-x-clip bg-[#ECF5F4] text-[#122A2E] antialiased"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        ${SCROLLBAR_CSS}

        .pt-scroll button, .pt-scroll select, .pt-scroll input {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        .cd-display { font-family: 'Fraunces', Georgia, serif; letter-spacing: -0.01em; }

        .pt-noscroll { scrollbar-width: none; -ms-overflow-style: none; }
        .pt-noscroll::-webkit-scrollbar { display: none; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pt-fade { from{opacity:0} to{opacity:1} }
        .anim-fade-1{animation:fadeUp .8s ease-out both}
        .anim-fade-2{animation:fadeUp .8s ease-out .2s both}
        .pt-backdrop{animation:pt-fade .2s ease both}
        @keyframes pt-sheet { from{transform:translateY(40px);opacity:0} to{transform:none;opacity:1} }
        .pt-sheet{animation:pt-sheet .28s cubic-bezier(.2,.8,.2,1) both}
        @media (prefers-reduced-motion: reduce){
          .anim-fade-1,.anim-fade-2,.pt-backdrop,.pt-sheet{animation:none}
        }
      `}</style>

      {/* SIDEBAR */}
      {isDesktop ? (
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
      ) : (
        mobileNavOpen && (
          <>
            <div
              className="pt-backdrop fixed inset-0 z-40 bg-[#0A1F17]/50 backdrop-blur-sm"
              onClick={() => setMobileNavOpen(false)}
              aria-hidden="true"
            />
            <div className="relative z-50 font-sans">
              <Sidebar
                collapsed={false}
                onToggle={() => setMobileNavOpen(false)}
                activePage="Patients"
                onNavigate={navigateFromDrawer}
                onLogout={onLogout}
                partnerName="Prem Zumble"
              />
            </div>
          </>
        )
      )}

      {/* MOBILE TOP BAR */}
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-[#DEEEEE] bg-[#ECF5F4]/90 px-4 py-3 backdrop-blur-md lg:hidden">
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open menu"
          className={`flex h-10 w-10 items-center justify-center rounded-xl border border-[#DEEEEE] bg-white ${FOCUS}`}
        >
          <Menu size={18} />
        </button>
        <span className="text-sm font-bold">Patients</span>
      </div>

      <main
        className="min-h-[100dvh] transition-[margin] duration-300 ease-in-out lg:ml-[var(--sb)]"
        style={{ "--sb": `${sidebarWidth}px` }}
      >
        <div className="mx-auto w-full max-w-[1400px] space-y-5 p-4 sm:space-y-6 md:p-6 lg:p-8">
          <Banner
            todayCount={todayCount}
            pendingCount={pendingCount}
            onReview={() => go("Notifications")}
          />

          <TitleBar onAdd={() => setShowAdd(true)} />

          <FiltersBar
            query={query}
            onQuery={handleQuery}
            filter={filter}
            onFilter={handleFilter}
            counts={counts}
          />

          <section ref={listRef} className="scroll-mt-20 space-y-3.5 lg:scroll-mt-6" aria-label="Patient list">
            {visible.length === 0 ? (
              <div className={`${CARD} p-8 text-center sm:p-10`}>
                <p className="text-sm font-semibold text-[#122A2E]">No patients found</p>
                <p className="mt-1 text-xs text-[#5B7A7E]">
                  Try a different name or clear the filter.
                </p>
              </div>
            ) : (
              visible.map((p) => {
                const info = sessionInfo.get(p.id) || {};
                return (
                  <PatientCard
                    key={p.id}
                    patient={p}
                    upcoming={info.upcoming}
                    pending={info.pending}
                    lastDone={info.lastDone}
                    now={now}
                    onJoin={handleJoin}
                    onReschedule={setReschedule}
                    onReview={() => go("Notifications")}
                  />
                );
              })
            )}
          </section>

          <Pagination
            from={filtered.length === 0 ? 0 : startIdx + 1}
            to={startIdx + visible.length}
            total={filtered.length}
            page={currentPage}
            totalPages={totalPages}
            onPage={changePage}
          />
        </div>
      </main>

      {showAdd && (
        <AddPatientModal
          sessions={sessions}
          onClose={() => setShowAdd(false)}
          onAdd={handleAddPatient}
        />
      )}

      {reschedule && (
        <RescheduleModal session={reschedule} onClose={() => setReschedule(null)} />
      )}

      {activeCall && <VideoCallModal session={activeCall} onEnd={handleEndCall} />}
    </div>
  );
}

/* ============================================================
   BANNER
============================================================ */

function Banner({ todayCount, pendingCount, onReview }) {
  const todayText =
    todayCount === 0
      ? "No patient sessions scheduled for today."
      : `${todayCount} patient ${todayCount > 1 ? "sessions" : "session"} scheduled for today.`;

  return (
    <section className="relative flex min-h-[190px] items-end overflow-hidden rounded-3xl border border-[#A9D6CE] bg-gradient-to-r from-[#C7E6E1] via-[#D6EEEA] to-[#E3F4F1] shadow-sm sm:min-h-[260px] sm:rounded-[30px] md:min-h-[220px] md:items-center lg:min-h-[260px]">
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Counselling illustration"
          className="h-full w-full object-cover object-[78%_top] sm:object-right"
        />

        {/* Mobile: dark only at the bottom for the text, top stays clear so the girl is visible */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.72) 38%, rgba(0,0,0,0.25) 62%, rgba(0,0,0,0) 80%)",
          }}
        />

        {/* Desktop: dark on the left, image clear on the right */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.62) 30%, rgba(0,0,0,0.25) 48%, rgba(0,0,0,0) 62%)",
          }}
        />
      </div>

      <div className="relative z-10 flex w-full flex-col items-start justify-between gap-3 px-4 pb-3.5 pt-10 sm:px-6 sm:pb-5 sm:pt-28 md:flex-row md:items-center md:px-10 md:py-8">
        <div className="min-w-0">
          <h2 className="cd-display anim-fade-1 text-[21px] font-semibold leading-[1.1] text-white drop-shadow-md sm:text-3xl md:text-[40px]">
            Better Support,
            <br />
            Brighter Tomorrows
          </h2>
          <p className="anim-fade-2 mt-1.5 max-w-md text-[11px] font-medium leading-snug text-white/90 drop-shadow sm:text-sm md:mt-3 md:text-base lg:max-w-xl">
            {todayText}{" "}
            <span className="hidden sm:inline">Review diagnostic updates and prepare session notes.</span>
          </p>
          {pendingCount > 0 && (
            <button
              type="button"
              onClick={onReview}
              className="mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-[#1F6F68] shadow-sm transition hover:bg-[#F0F9F7] sm:mt-4 sm:w-auto sm:justify-start sm:py-2"
            >
              <Clock size={14} className="shrink-0" />
              {pendingCount} new session {pendingCount > 1 ? "requests" : "request"} waiting
            </button>
          )}
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
      <div className="min-w-0">
        <h1 className="cd-display text-[28px] font-semibold tracking-tight text-[#122A2E] sm:text-3xl md:text-4xl">
          Patients
        </h1>
        <p className="mt-1 text-sm text-[#5B7A7E] md:text-base">
          Manage and monitor all your patients.
        </p>
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#184D43] px-5 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#123A32] hover:shadow-lg active:scale-95 sm:w-auto sm:py-2.5"
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

const MODAL_FIELD = `${FIELD} !text-[14px] sm:!text-sm`;

const MODAL_LABEL = "mb-1 block text-[11px] font-semibold text-[#122A2E] sm:mb-1.5 sm:text-xs";

function AddPatientModal({ sessions, onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const autoFocusName = typeof window !== "undefined" && window.innerWidth >= 640;

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

    if (form.next) {
      const ts = new Date(form.next).getTime();
      if (Number.isNaN(ts) || ts <= Date.now()) er.next = "Pick a time in the future";
      else {
        const c = findConflict(sessions, ts);
        if (c) er.next = `Clashes with ${c.patientName} at ${formatSlot(c.start)}`;
      }
    }
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
      avatar: "",
      nextTs: form.next ? new Date(form.next).getTime() : null,
    });
  };

  const statusOptions = [
    { key: "stable", ...STATUS.stable },
    { key: "moderate", ...STATUS.moderate },
    { key: "high", ...STATUS.high },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4"
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
        className="pt-sheet flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-[26px] border border-[#CFE6E3] bg-white shadow-2xl sm:rounded-[30px]"
      >
        {/* Header (always visible) */}
        <div className="shrink-0 px-4 pt-2.5 sm:px-6 sm:pt-6 md:px-7">
          <div className="mx-auto mb-2.5 h-1 w-10 rounded-full bg-[#CFE6E3] sm:hidden" aria-hidden="true" />
          <div className="flex items-start justify-between gap-3 border-b border-[#E8F2EF] pb-3 sm:border-0 sm:pb-0">
            <div className="min-w-0">
              <h2 id="add-patient-title" className="text-lg font-bold text-[#122A2E] sm:text-xl">
                Add New Patient
              </h2>
              <p className="mt-0.5 text-[11px] text-[#5B7A7E] sm:text-xs">
                Fill in the patient's basic details.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F0F9F7] text-[#5B7A7E] transition hover:text-[#122A2E] sm:bg-transparent sm:hover:bg-[#F0F9F7]"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable form body */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4 pt-4 sm:px-6 sm:pt-5 md:px-7">
          <div className="grid grid-cols-2 gap-x-3 gap-y-3.5 sm:gap-x-4 sm:gap-y-4">
            <div className="col-span-2">
              <label className={MODAL_LABEL}>Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={set("name")}
                placeholder="e.g. Rahul Patil"
                className={MODAL_FIELD}
                autoFocus={autoFocusName}
              />
              {errors.name && <p className="mt-1 text-[11px] text-rose-600 sm:text-xs">{errors.name}</p>}
            </div>

            <div className="min-w-0">
              <label className={MODAL_LABEL}>Age</label>
              <input
                type="number"
                inputMode="numeric"
                min="1"
                max="120"
                value={form.age}
                onChange={set("age")}
                placeholder="e.g. 24"
                className={MODAL_FIELD}
              />
              {errors.age && <p className="mt-1 text-[11px] text-rose-600 sm:text-xs">{errors.age}</p>}
            </div>

            <div className="min-w-0">
              <label className={MODAL_LABEL}>Gender</label>
              <select value={form.gender} onChange={set("gender")} className={MODAL_FIELD}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className={MODAL_LABEL}>Problem</label>
              <input
                type="text"
                value={form.problem}
                onChange={set("problem")}
                placeholder="e.g. Anxiety, Stress, Sleep Issues"
                className={MODAL_FIELD}
              />
              {errors.problem && (
                <p className="mt-1 text-[11px] text-rose-600 sm:text-xs">{errors.problem}</p>
              )}
            </div>

            <div className="col-span-2">
              <span className={MODAL_LABEL}>Status</span>
              <div role="radiogroup" aria-label="Status" className="grid grid-cols-3 gap-2">
                {statusOptions.map((o) => {
                  const selected = form.status === o.key;
                  return (
                    <button
                      key={o.key}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setForm((f) => ({ ...f, status: o.key }))}
                      className={`flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-2 py-2.5 text-[11px] font-semibold transition sm:text-xs ${
                        selected
                          ? `${o.tab} ring-2 ring-[#2A8C82]/50`
                          : "border border-[#CFE6E3] bg-white text-[#5B7A7E] hover:bg-[#F0F9F7]"
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${o.dot}`} />
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="col-span-2 min-w-0">
              <label className={MODAL_LABEL}>
                Next Session <span className="font-normal text-[#93B0AE]">(optional)</span>
              </label>
              <input
                type="datetime-local"
                value={form.next}
                min={toLocalInput(Date.now())}
                onChange={set("next")}
                className={`${MODAL_FIELD} block min-w-0 max-w-full appearance-none`}
              />
              {errors.next && <p className="mt-1 text-[11px] text-rose-600 sm:text-xs">{errors.next}</p>}
            </div>
          </div>
        </div>

        {/* Footer (always visible) */}
        <div className="grid shrink-0 grid-cols-2 gap-2.5 border-t border-[#E8F2EF] bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:flex sm:items-center sm:justify-end sm:px-6 sm:pb-6 sm:pt-4 md:px-7 md:pb-7">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#CFE6E3] bg-white px-4 py-2.5 text-sm font-semibold text-[#122A2E] transition hover:border-[#9FD0CB] hover:bg-[#F0F9F7]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-[#184D43] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#123A32] hover:shadow active:scale-95"
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
      className={`${CARD} flex flex-col gap-3 p-3 md:p-4 xl:flex-row xl:items-center xl:justify-between`}
    >
      <div className="flex w-full items-center gap-2.5 xl:max-w-md xl:flex-1">
        <div className="relative flex h-11 min-w-0 flex-1 items-center rounded-2xl border-2 border-[#9FD0CB] bg-white px-3.5 shadow-sm transition focus-within:border-[#2A8C82] focus-within:ring-4 focus-within:ring-[#2A8C82]/20">
          <Search size={18} className="flex-shrink-0 text-[#2A8C82]" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search patient by name..."
            aria-label="Search patient by name"
            className="h-full w-full min-w-0 bg-transparent pl-3 text-[13px] font-medium text-[#122A2E] placeholder-[#5B7A7E] focus:outline-none"
          />
        </div>
        <button
          type="button"
          title="Filter patients"
          aria-label="Filter patients"
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border-2 border-[#9FD0CB] bg-white text-[#2A8C82] shadow-sm transition hover:bg-[#F0F9F7]"
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>

      <div className="pt-noscroll -mx-3 flex items-center gap-1.5 overflow-x-auto px-3 py-1 text-xs font-medium sm:flex-wrap sm:overflow-visible md:mx-0 md:px-0">
        <button
          type="button"
          onClick={() => onFilter("all")}
          className={`shrink-0 whitespace-nowrap rounded-xl px-3.5 py-2 font-semibold transition sm:py-1.5 ${
            filter === "all"
              ? "bg-[#184D43] text-white shadow-sm"
              : "border border-[#CFE6E3] bg-white text-[#5B7A7E] hover:bg-[#F0F9F7]"
          }`}
        >
          All ({counts.all})
        </button>

        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => onFilter(t.key)}
            className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 transition sm:py-1.5 ${t.tab} ${
              filter === t.key ? "ring-2 ring-offset-1 ring-[#2A8C82]/40" : ""
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

function MoreButton({ name, className = "" }) {
  return (
    <button
      type="button"
      aria-label={`More options for ${name}`}
      className={`h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#93B0AE] transition hover:bg-[#F0F9F7] hover:text-[#122A2E] sm:h-9 sm:w-9 sm:rounded-xl ${className}`}
    >
      <MoreVertical size={16} />
    </button>
  );
}

function PatientCard({ patient: p, upcoming, pending, lastDone, now, onJoin, onReschedule, onReview }) {
  const s = STATUS[p.status];
  const isHigh = p.status === "high";

  const nextLabel = upcoming ? "Next Session" : pending ? "Requested Session" : "Next Session";
  const nextValue = upcoming
    ? `${formatSlot(upcoming.start, now)}${upcoming.rescheduled ? " (rescheduled)" : ""}`
    : pending
    ? formatSlot(pending.start, now)
    : "Not Scheduled";

  const iconStyle = upcoming
    ? "border-[#DEEEEE] bg-[#F0F9F7] text-[#2A8C82]"
    : pending
    ? "border-amber-100 bg-amber-50 text-amber-600"
    : "border-rose-100 bg-rose-50 text-rose-600";

  const valueStyle = upcoming
    ? "text-[#122A2E]"
    : pending
    ? "text-amber-700"
    : "text-rose-600";

  const lastLabel = lastDone ? formatDay(lastDone.start, now) : p.last;

  return (
    <article
      className={`flex flex-col gap-3 rounded-[18px] border bg-white p-3.5 shadow-[0_10px_30px_-12px_rgba(42,140,130,0.14)] transition-all duration-300 [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:shadow-[0_16px_36px_-12px_rgba(42,140,130,0.20)] sm:gap-4 sm:rounded-[22px] sm:p-5 2xl:flex-row 2xl:items-center 2xl:gap-6 ${
        isHigh ? "border-rose-100 ring-1 ring-rose-500/10" : "border-[#DEEEEE]"
      }`}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-2 gap-y-2.5 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-x-3 sm:gap-y-3 2xl:contents">
        <div className="col-start-1 row-start-1 flex min-w-0 items-center gap-3 sm:gap-4 2xl:min-w-[240px] 2xl:flex-1">
          <div className="shrink-0">
            <Avatar name={p.name} src={p.avatar} />
          </div>
          <div className="min-w-0">
            <h3 className="cursor-pointer truncate text-[15px] font-semibold leading-tight text-[#122A2E] transition hover:text-[#2A8C82] sm:text-base">
              {p.name}
            </h3>
            <p className="mt-0.5 text-[11px] text-[#5B7A7E] sm:text-xs">
              {p.age} Years • {p.gender}
            </p>
            <p className="mt-0.5 truncate text-[11px] font-medium text-[#5B7A7E] sm:mt-1 sm:text-xs">
              Problem: <span className="font-semibold text-[#1F6F68]">{p.problem}</span>
            </p>
          </div>
        </div>

        <div className="col-span-2 row-start-2 flex items-center justify-between gap-x-3 gap-y-1 sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:flex-col sm:items-end sm:justify-start sm:gap-0 2xl:w-[130px] 2xl:shrink-0 2xl:items-start">
          <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold sm:px-2.5 sm:py-1 sm:text-xs ${s.pill}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </span>
          <span
            className={`text-[11px] sm:mt-1.5 sm:text-xs ${
              isHigh ? "font-medium text-rose-500" : "text-[#93B0AE]"
            }`}
          >
            Last: {lastLabel}
          </span>
        </div>

        <MoreButton
          name={p.name}
          className="col-start-2 row-start-1 flex sm:col-start-3 2xl:hidden"
        />
      </div>

      <div className="flex flex-col gap-3 border-t border-[#E8F2EF] pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pt-4 2xl:contents">
        <div className="flex min-w-0 items-center gap-2.5 rounded-xl bg-[#F6FBFA] p-2.5 sm:gap-3 sm:bg-transparent sm:p-0 2xl:w-[220px] 2xl:shrink-0">
          <div
            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border sm:h-10 sm:w-10 sm:rounded-xl ${iconStyle}`}
          >
            <CalendarDays size={18} />
          </div>
          <div className="min-w-0">
            <span className="block text-[10px] font-medium uppercase tracking-wider text-[#93B0AE] sm:text-xs">
              {nextLabel}
            </span>
            <span className={`text-[11px] font-semibold sm:text-xs ${valueStyle}`}>{nextValue}</span>
            {pending && !upcoming && (
              <span className="mt-0.5 block text-[11px] text-amber-600 sm:text-xs">Awaiting your reply</span>
            )}
          </div>
        </div>

        <div className="flex flex-nowrap items-center gap-2 sm:flex-wrap sm:justify-end 2xl:shrink-0 2xl:flex-nowrap">
          <button type="button" className={`${BTN_OUTLINE} min-w-0 flex-1 sm:min-w-[104px] sm:flex-none`}>
            View Profile
          </button>

          {pending && !upcoming && (
            <button
              type="button"
              onClick={onReview}
              className="inline-flex min-w-0 flex-1 items-center justify-center whitespace-nowrap rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-2 text-[11px] font-semibold text-amber-700 transition duration-150 hover:bg-amber-100 sm:min-w-[104px] sm:flex-none sm:px-4 sm:text-xs"
            >
              Review request
            </button>
          )}

          {upcoming && (
            <>
              <button
                type="button"
                onClick={() => onReschedule(upcoming)}
                className={`${BTN_OUTLINE} min-w-0 flex-1 sm:min-w-[104px] sm:flex-none`}
              >
                Reschedule
              </button>
              <div className="flex min-w-0 flex-1 [&>*]:flex-1 [&>*]:!px-2.5 [&>*]:!py-2 [&>*]:!text-[11px] sm:min-w-[104px] sm:flex-none sm:[&>*]:flex-none sm:[&>*]:!px-4 sm:[&>*]:!text-xs">
                <JoinButton session={upcoming} now={now} onJoin={onJoin} />
              </div>
            </>
          )}

          <MoreButton name={p.name} className="hidden 2xl:flex" />
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   PAGINATION
============================================================ */

function Pagination({ from, to, total, page, totalPages, onPage }) {
  const items = pageWindow(page, totalPages);
  const prevDisabled = page === 1;
  const nextDisabled = page === totalPages;

  return (
    <footer className="flex flex-col items-center justify-between gap-4 pb-4 text-xs font-medium text-[#5B7A7E] sm:flex-row">
      <p className="text-center sm:text-left">
        Showing <span className="font-semibold text-[#122A2E]">{from}</span> to{" "}
        <span className="font-semibold text-[#122A2E]">{to}</span> of{" "}
        <span className="font-semibold text-[#122A2E]">{total}</span> patients
      </p>

      <div className="flex w-full items-center justify-between gap-1.5 sm:w-auto sm:justify-start">
        <button
          type="button"
          disabled={prevDisabled}
          onClick={() => onPage(page - 1)}
          className={`rounded-xl border border-[#CFE6E3] bg-white px-4 py-2.5 transition sm:px-3 sm:py-1.5 ${
            prevDisabled
              ? "cursor-not-allowed text-[#93B0AE]"
              : "text-[#122A2E] hover:bg-[#F0F9F7]"
          }`}
        >
          Previous
        </button>

        <span className="font-semibold text-[#122A2E] sm:hidden">
          Page {page} of {totalPages}
        </span>

        <div className="hidden items-center gap-1.5 sm:flex">
          {items.map((n) =>
            typeof n === "string" ? (
              <span key={n} className="px-1 text-[#93B0AE]" aria-hidden="true">
                …
              </span>
            ) : (
              <button
                key={n}
                type="button"
                onClick={() => onPage(n)}
                aria-current={n === page ? "page" : undefined}
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition ${
                  n === page
                    ? "bg-[#184D43] font-semibold text-white"
                    : "border border-[#CFE6E3] bg-white text-[#122A2E] hover:bg-[#F0F9F7]"
                }`}
              >
                {n}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          disabled={nextDisabled}
          onClick={() => onPage(page + 1)}
          className={`rounded-xl border border-[#CFE6E3] bg-white px-4 py-2.5 transition sm:px-3 sm:py-1.5 ${
            nextDisabled
              ? "cursor-not-allowed text-[#93B0AE]"
              : "text-[#122A2E] hover:bg-[#F0F9F7]"
          }`}
        >
          Next
        </button>
      </div>
    </footer>
  );
}