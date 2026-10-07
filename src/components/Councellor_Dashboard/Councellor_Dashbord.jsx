import React, { useState } from "react";
import {
  Users,
  UsersRound,
  CalendarPlus,
  Clock3,
  MessageSquare,
  MessageSquareText,
  CalendarDays,
  ArrowRight,
  MoreVertical,
  TrendingUp,
  UserPlus,
  BarChart3,
  Zap,
  Sun,
  Leaf,
} from "lucide-react";

import Sidebar from "./Sidebar";

// Hero image: ithe tujhya image cha path de
import heroImage from "../../assets/councellor-images/overview.png";

/* ============================================================
   DATA  (ithe tujhya API / state cha data tak)
============================================================ */

const HERO_IMAGE = heroImage;

const STATS = [
  { icon: Users, value: 12, label: "Total Patients", link: "View all patients" },
  { icon: CalendarPlus, value: 5, label: "Today's Sessions", link: "View schedule" },
  { icon: Clock3, value: 2, label: "Upcoming Sessions", link: "View upcoming" },
  { icon: MessageSquare, value: 8, label: "Unread Messages", link: "Open chats" },
];

const SCHEDULE = [
  { start: "10:00 AM", end: "11:00 AM", name: "John Smith", type: "Individual Therapy", status: "In 30 min", tone: "soon", avatar: "" },
  { start: "11:30 AM", end: "12:30 PM", name: "Emma Wilson", type: "Follow-up Session", status: "Confirmed", tone: "confirmed", avatar: "" },
  { start: "01:00 PM", end: "02:00 PM", name: "David Brown", type: "Therapy Session", status: "Confirmed", tone: "confirmed", avatar: "" },
  { start: "02:30 PM", end: "03:30 PM", name: "Sophia Johnson", type: "Counselling", status: "Upcoming", tone: "upcoming", avatar: "" },
  { start: "04:00 PM", end: "05:00 PM", name: "Olivia Martinez", type: "Individual Therapy", status: "Upcoming", tone: "upcoming", avatar: "" },
];

const PATIENT_OVERVIEW = [
  { label: "Stable", count: 5, color: "#1F6944" },
  { label: "Moderate", count: 4, color: "#71B994" },
  { label: "High Risk", count: 2, color: "#E3C458" },
  { label: "Inactive", count: 1, color: "#BDD6C8" },
];

const WEEK = [
  { day: "Mon", v: 7 },
  { day: "Tue", v: 12 },
  { day: "Wed", v: 9 },
  { day: "Thu", v: 10 },
  { day: "Fri", v: 8 },
  { day: "Sat", v: 5 },
  { day: "Sun", v: 3 },
];

const MESSAGES = [
  { name: "John Smith", time: "10:25 AM", text: "I've been feeling a bit better...", unread: 2, avatar: "" },
  { name: "Emma Wilson", time: "09:15 AM", text: "Thank you for the session...", unread: 1, avatar: "" },
  { name: "David Brown", time: "Yesterday", text: "Can we reschedule our next...", unread: 0, avatar: "" },
  { name: "Sophia Johnson", time: "Yesterday", text: "Shared a resource", unread: 0, avatar: "" },
];

const STATUS_STYLE = {
  soon: "bg-[#E5F5EC] text-[#257B51] border border-[#CDEBDC]",
  confirmed: "bg-[#EAF5EF] text-[#2F855A] border border-[#D5EFE1]",
  upcoming: "bg-gray-100 text-gray-600",
};

/* ============================================================
   MAIN
============================================================ */

export default function CouncellorDashboard({ onLogout }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarWidth = sidebarCollapsed ? 78 : 260;

  return (
    <div
      className="min-h-screen bg-[#F6F9F7] text-gray-800 antialiased"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      {/* Font + animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        @keyframes heroZoom { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sway { 0%,100%{transform:rotate(0)} 50%{transform:rotate(12deg)} }
        .anim-hero-zoom{animation:heroZoom 10s ease-in-out infinite;transform-origin:center;will-change:transform}
        .anim-fade-1{animation:fadeUp .8s ease-out both}
        .anim-fade-2{animation:fadeUp .8s ease-out .2s both}
        .anim-fade-3{animation:fadeUp .8s ease-out .4s both}
        .anim-sway{display:inline-block;animation:sway 3s ease-in-out infinite;transform-origin:bottom center}
        @media (prefers-reduced-motion: reduce){
          .anim-hero-zoom,.anim-fade-1,.anim-fade-2,.anim-fade-3,.anim-sway{animation:none}
        }
      `}</style>

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
        activePage="Overview"
        onLogout={onLogout}
        partnerName="Prem Zumble"
      />

      <main
        className="min-h-screen transition-[margin] duration-300 ease-in-out"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <div className="mx-auto w-full max-w-[1400px] space-y-6 p-4 md:p-6 lg:p-8">
          <Hero total={STATS[0].value} />

          {/* STAT CARDS */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
            {STATS.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </section>

          {/* MAIN 3 COLUMNS */}
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* LEFT */}
            <div className="flex flex-col gap-5 lg:col-span-5">
              <ScheduleCard />
              <BreathCard />
            </div>

            {/* MIDDLE */}
            <div className="flex flex-col gap-5 lg:col-span-4">
              <PatientOverviewCard />
              <SessionSummaryCard />
            </div>

            {/* RIGHT */}
            <div className="flex flex-col gap-5 lg:col-span-3">
              <MessagesCard />
              <QuickActionsCard />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   HERO
============================================================ */

function Hero({ total }) {
  return (
    <header className="relative overflow-hidden rounded-3xl border border-[#9DD4B8] bg-gradient-to-r from-[#B8E2CB] via-[#C9EBD8] to-[#DCF2E4] p-6 shadow-sm md:p-8">
      <div className="pointer-events-none absolute inset-0 z-0 flex justify-end overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Therapist and patient consultation"
          className="anim-hero-zoom h-full w-full object-cover object-center md:object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent" />
      </div>

      <div className="relative z-10">
        <h1 className="anim-fade-1 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
          Good morning, Dr. Sarah!
        </h1>
        <p className="anim-fade-2 mt-1 text-sm font-semibold text-gray-700 md:text-base">
          Here's what's happening with your patients today.
        </p>

        <div className="anim-fade-3 mt-5 inline-flex items-center gap-4 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#E3F2EA] text-[#257B51]">
            <Leaf size={22} />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="anim-sway text-2xl">{total}</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Total Patients
              </span>
            </div>
            <a
              href="#patient-overview"
              className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#277D53] transition-colors hover:text-[#1c5f3e]"
            >
              View all patients <ArrowRight size={14} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ============================================================
   SHARED
============================================================ */

const CARD =
  "rounded-2xl border border-gray-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)]";

function CardHeader({ icon: Icon, title, sub, action }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
      <div className="flex items-center gap-2 text-gray-800">
        <Icon size={20} className="text-[#257B51]" />
        <h2 className="text-base font-bold">
          {title}{" "}
          {sub && <span className="text-sm font-normal text-gray-400">{sub}</span>}
        </h2>
      </div>
      {action && (
        <a
          href="#"
          className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-[#277D53] hover:text-[#1c5d3d]"
        >
          {action} <ArrowRight size={12} />
        </a>
      )}
    </div>
  );
}

function Avatar({ name, src, size = "w-10 h-10" }) {
  if (src) {
    return (
      <img
        src={src}
        alt={`${name} avatar`}
        className={`${size} flex-shrink-0 rounded-full border border-gray-100 object-cover`}
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
      className={`${size} flex flex-shrink-0 items-center justify-center rounded-full border border-gray-100 bg-[#E3F2EA] text-xs font-bold text-[#257B51]`}
    >
      {initials}
    </div>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({ icon: Icon, value, label, link }) {
  return (
    <article
      className={`${CARD} flex items-center gap-4 p-5 transition-shadow hover:shadow-md`}
    >
      <div className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-2xl bg-[#EDF7F2] text-[#257B51]">
        <Icon size={24} />
      </div>
      <div>
        <div className="text-2xl font-bold leading-tight text-gray-900">{value}</div>
        <div className="text-xs font-medium text-gray-500">{label}</div>
        <a
          href="#"
          className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#277D53] transition-colors hover:text-[#1b5839]"
        >
          {link} <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}

/* ============================================================
   TODAY'S SCHEDULE
============================================================ */

function ScheduleCard() {
  return (
    <div className={`${CARD} flex-1 p-5`}>
      <CardHeader icon={CalendarDays} title="Today's Schedule" action="View full schedule" />

      <div className="divide-y divide-gray-50 pt-2">
        {SCHEDULE.map((a) => (
          <div key={a.name} className="flex items-center justify-between gap-3 py-3.5">
            <div className="w-16 flex-shrink-0 text-[11px] font-semibold leading-tight text-gray-500">
              <div>{a.start}</div>
              <div className="font-normal text-gray-300">-</div>
              <div>{a.end}</div>
            </div>

            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Avatar name={a.name} src={a.avatar} />
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-gray-800">{a.name}</div>
                <div className="truncate text-xs text-gray-500">{a.type}</div>
              </div>
            </div>

            <div className="flex flex-shrink-0 items-center gap-2">
              <span
                className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium ${STATUS_STYLE[a.tone]}`}
              >
                {a.status}
              </span>
              <button
                type="button"
                aria-label={`More options for ${a.name}`}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BreathCard() {
  return (
    <aside className="flex items-center justify-between rounded-2xl border border-[#D9ECE1] bg-gradient-to-r from-[#E9F6EF] to-[#F3F9F5] p-4">
      <div className="flex items-center gap-3.5">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#1F6B45] text-white shadow-sm">
          <Sun size={20} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-gray-900 md:text-sm">Take a deep breath</h4>
          <p className="text-[11px] text-gray-500 md:text-xs">
            Small daily progress leads to big changes.
          </p>
        </div>
      </div>
      <Leaf size={32} className="pr-1 text-[#358B60] opacity-40" aria-hidden="true" />
    </aside>
  );
}

/* ============================================================
   PATIENT OVERVIEW (DONUT)
============================================================ */

function PatientOverviewCard() {
  const total = PATIENT_OVERVIEW.reduce((s, p) => s + p.count, 0);
  const r = 38;
  const C = 2 * Math.PI * r;
  let offset = 0;

  return (
    <article id="patient-overview" className={`${CARD} p-5`}>
      <CardHeader icon={UsersRound} title="Patient Overview" action="View all patients" />

      <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="relative flex h-36 w-36 flex-shrink-0 items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={r} fill="transparent" stroke="#F1F5F2" strokeWidth="14" />
            {PATIENT_OVERVIEW.map((p) => {
              const len = (p.count / total) * C;
              const el = (
                <circle
                  key={p.label}
                  cx="50"
                  cy="50"
                  r={r}
                  fill="transparent"
                  stroke={p.color}
                  strokeWidth="14"
                  strokeDasharray={`${len} ${C}`}
                  strokeDashoffset={-offset}
                />
              );
              offset += len;
              return el;
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-bold leading-none text-gray-900">{total}</span>
            <span className="mt-0.5 text-[10px] font-medium text-gray-500">Total Patients</span>
          </div>
        </div>

        <div className="w-full flex-1 space-y-2 text-xs sm:w-auto">
          {PATIENT_OVERVIEW.map((p) => (
            <div key={p.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
                <span className="font-medium text-gray-700">{p.label}</span>
              </div>
              <span className="font-semibold text-gray-600">
                {p.count}{" "}
                <span className="text-[11px] font-normal text-gray-400">
                  ({Math.round((p.count / total) * 100)}%)
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   SESSION SUMMARY (LINE CHART)
============================================================ */

function SessionSummaryCard() {
  // chart area: x 40..328, y 115 (0) .. 15 (15)
  const maxY = 15;
  const top = 15;
  const base = 115;
  const x0 = 40;
  const step = 48;

  const pts = WEEK.map((d, i) => ({
    ...d,
    x: x0 + i * step,
    y: base - (d.v / maxY) * (base - top),
  }));
  const line = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `${line} ${pts[pts.length - 1].x},${base} ${pts[0].x},${base}`;
  const grid = [
    { y: 15, label: "15" },
    { y: 48, label: "10" },
    { y: 82, label: "5" },
    { y: 115, label: "0" },
  ];

  return (
    <article className={`${CARD} flex flex-1 flex-col justify-between p-5`}>
      <div className="flex items-center gap-2 pb-2 text-gray-800">
        <TrendingUp size={20} className="text-[#257B51]" />
        <h2 className="text-sm font-bold md:text-base">
          Session Summary{" "}
          <span className="text-xs font-normal text-gray-400 md:text-sm">(This Week)</span>
        </h2>
      </div>

      <div className="mt-2 w-full">
        <div className="relative h-44 w-full">
          <svg
            className="h-full w-full overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 340 140"
          >
            <defs>
              <linearGradient id="sessionFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#349A67" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#349A67" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {grid.map((g) => (
              <g key={g.label}>
                <line x1="25" x2="335" y1={g.y} y2={g.y} stroke="#F1F5F2" strokeWidth="1" />
                <text x={g.label.length > 1 ? 5 : 8} y={g.y + 4} fontSize="9" fill="#9CA3AF">
                  {g.label}
                </text>
              </g>
            ))}

            <polygon points={area} fill="url(#sessionFill)" />
            <polyline
              points={line}
              fill="none"
              stroke="#2B7F56"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {pts.map((p) => (
              <g key={p.day}>
                <circle cx={p.x} cy={p.y} r="3.5" fill="#1C5E3E" stroke="#fff" strokeWidth="2" />
                <text
                  x={p.x}
                  y={p.y - 8}
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill="#1C5E3E"
                >
                  {p.v}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="mt-1 flex justify-between pl-8 pr-1 text-[11px] font-medium text-gray-400">
          {WEEK.map((d) => (
            <span key={d.day}>{d.day}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   RECENT MESSAGES
============================================================ */

function MessagesCard() {
  return (
    <article className={`${CARD} p-5`}>
      <CardHeader icon={MessageSquareText} title="Recent Messages" action="View all chats" />

      <div className="divide-y divide-gray-50 pt-1">
        {MESSAGES.map((m) => (
          <div
            key={m.name}
            className="flex cursor-pointer items-start gap-3 rounded-xl p-1.5 py-3 transition-colors hover:bg-gray-50/70"
          >
            <Avatar name={m.name} src={m.avatar} size="w-9 h-9" />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between">
                <h3 className="truncate text-xs font-bold text-gray-800">{m.name}</h3>
                <span className="text-[10px] text-gray-400">{m.time}</span>
              </div>
              <div className="mt-0.5 flex items-center justify-between">
                <p className="truncate pr-1 text-xs text-gray-500">{m.text}</p>
                {m.unread > 0 && (
                  <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#257B51] text-[10px] font-bold text-white">
                    {m.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

/* ============================================================
   QUICK ACTIONS
============================================================ */

function QuickActionsCard() {
  const actions = [
    { icon: UserPlus, label: "Add New Patient" },
    { icon: CalendarPlus, label: "New Session" },
    { icon: CalendarDays, label: "View Schedule" },
    { icon: BarChart3, label: "Reports" },
  ];

  return (
    <article className={`${CARD} p-5`}>
      <div className="flex items-center gap-2 pb-3 text-gray-800">
        <Zap size={16} className="text-[#257B51]" strokeWidth={2.5} />
        <h2 className="text-sm font-bold md:text-base">Quick Actions</h2>
      </div>

      <div className="mt-1 grid grid-cols-2 gap-3">
        {actions.map(({ icon: Icon, label }) => (
          <button
            key={label}
            type="button"
            className="group flex flex-col items-center justify-center rounded-xl border border-gray-200/80 p-3 transition-all hover:border-[#257B51] hover:bg-[#F3FAF6]"
          >
            <Icon
              size={24}
              strokeWidth={1.8}
              className="mb-1.5 text-[#257B51] transition-transform group-hover:scale-110"
            />
            <span className="text-center text-xs font-semibold leading-tight text-gray-700">
              {label}
            </span>
          </button>
        ))}
      </div>
    </article>
  );
}