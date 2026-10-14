import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Users,
  FileText,
  Heart,
  BarChart3,
  ChevronRight,
  UserPlus,
  CalendarPlus,
  FilePlus,
  Edit3,
  Clock,
  MessageSquare,
} from "lucide-react";

import Sidebar from "./Sidebar";
import heroImage from "../../assets/councellor-images/overview.png";

/* ============================================================
    DATA & CONSTANTS
============================================================ */

const STATS = [
  { count: 12, label: "Total patients", note: "2 new this month", icon: Users, page: "Patients", tile: "bg-emerald-200 text-emerald-800", chev: "text-slate-400", card: "border-emerald-200 bg-emerald-50" },
  { count: 5, label: "Today's sessions", note: "1 starting soon", icon: Calendar, page: "Sessions", tile: "bg-violet-200 text-violet-700", chev: "text-slate-400", card: "border-violet-200 bg-violet-50" },
  { count: 2, label: "Upcoming sessions", note: "Next 7 days", icon: Clock, page: "Sessions", tile: "bg-orange-200 text-orange-700", chev: "text-orange-500", card: "border-orange-200 bg-orange-50" },
  { count: 8, label: "Unread messages", note: "From 4 patients", icon: MessageSquare, page: "Messages", tile: "bg-teal-200 text-teal-800", chev: "text-slate-400", card: "border-teal-200 bg-teal-50" },
];

const SCHEDULE = [
  { start: "10:00 AM", end: "11:00 AM", name: "John Smith", type: "Individual therapy", status: "In 30 min", tone: "soon", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" },
  { start: "11:30 AM", end: "12:30 PM", name: "Emma Wilson", type: "Follow-up session", status: "Confirmed", tone: "confirmed", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80" },
  { start: "01:00 PM", end: "02:00 PM", name: "David Brown", type: "Therapy session", status: "Confirmed", tone: "confirmed", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
  { start: "02:30 PM", end: "03:30 PM", name: "Sophia Johnson", type: "Counselling", status: "Upcoming", tone: "upcoming", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" },
  { start: "04:00 PM", end: "05:00 PM", name: "Olivia Martinez", type: "Individual therapy", status: "Upcoming", tone: "upcoming", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80" },
];

const PATIENT_OVERVIEW = [
  { label: "Stable", count: 5, color: "#4A7C59" },
  { label: "Moderate", count: 4, color: "#B7A6D9" },
  { label: "High risk", count: 2, color: "#E0A458" },
  { label: "Inactive", count: 1, color: "#A9B0BC" },
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
  { name: "John Smith", time: "10:25 AM", text: "I've been feeling a bit better this week…", unread: 2 },
  { name: "Emma Wilson", time: "9:48 AM", text: "Can we move Thursday's session?", unread: 1 },
  { name: "David Brown", time: "Yesterday", text: "Thank you, the breathing exercises help.", unread: 0 },
];

const QUICK_ACTIONS = [
  { icon: UserPlus, label: "New patient", page: "Patients" },
  { icon: CalendarPlus, label: "Schedule session", page: "Sessions" },
  { icon: FilePlus, label: "Assign assessment", page: "Assessments" },
  { icon: Edit3, label: "Add notes", page: "Notes" },
];

const STATUS_STYLE = {
  soon: "bg-[#2D6A4F] text-white",
  confirmed: "bg-teal-100 text-[#007070]",
  upcoming: "bg-indigo-100 text-indigo-700",
};

/* ============================================================
    HELPERS
============================================================ */

const greetingFor = (date) => {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const initials = (name) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2);

const smoothPath = (pts) => {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
};

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
    COMPONENTS
============================================================ */

function CardHeader({ icon: Icon, title, hint, actionLabel, onAction }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <Icon size={18} strokeWidth={2.2} className="text-[#008080] flex-shrink-0" />
        <h2 className="truncate text-base font-bold text-slate-800">
          {title}
          {hint && <span className="ml-2 text-xs font-normal text-slate-400">{hint}</span>}
        </h2>
      </div>
      {actionLabel && (
        <button onClick={onAction} className="inline-flex items-center gap-1 rounded-full bg-[#2D6A4F] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#245a42]">
          {actionLabel}
          <ChevronRight size={12} />
        </button>
      )}
    </div>
  );
}

function Avatar({ src, name, size = 40 }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <span
        className="flex flex-shrink-0 items-center justify-center rounded-full bg-teal-100 font-bold text-[#008080]"
        style={{ width: size, height: size, fontSize: size * 0.35 }}
      >
        {initials(name)}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt=""
      onError={() => setFailed(true)}
      className="flex-shrink-0 rounded-full object-cover shadow-xs ring-1 ring-slate-200"
      style={{ width: size, height: size }}
    />
  );
}

export default function CouncellorDashboard({
  onLogout,
  onNavigate,
  sidebarCollapsed = false,
  onToggleSidebar,
}) {
  const isDesktop = useIsDesktop();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (isDesktop) setMobileNavOpen(false);
  }, [isDesktop]);

  const sidebarWidth = sidebarCollapsed ? 76 : 268;
  const now = new Date();
  const dateLabel = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const go = (page) => {
    if (typeof onNavigate === "function") onNavigate(page);
  };

  const navigateFromDrawer = (page) => {
    setMobileNavOpen(false);
    go(page);
  };

  const avatarFor = (name) => SCHEDULE.find((s) => s.name === name)?.avatar;

  /* ---- Donut Calculations ---- */
  const totalPatients = PATIENT_OVERVIEW.reduce((s, p) => s + p.count, 0);
  const R = 35;
  const C = 2 * Math.PI * R;
  const GAP = 2;
  const donut = useMemo(() => {
    let offset = 0;
    return PATIENT_OVERVIEW.map((p) => {
      const len = (p.count / totalPatients) * C;
      const seg = { ...p, dash: Math.max(len - GAP, 0), offset: -offset };
      offset += len;
      return seg;
    });
  }, [totalPatients, C]);

  /* ---- Line Chart Calculations ---- */
  const chart = useMemo(() => {
    const L = 34, Rr = 328, T = 18, B = 124, MAX = 15;
    const step = (Rr - L - 12) / (WEEK.length - 1);
    const pts = WEEK.map((w, i) => ({
      x: L + 6 + i * step,
      y: B - (w.v / MAX) * (B - T),
      ...w,
    }));
    const line = smoothPath(pts);
    const area = `${line} L ${pts[pts.length - 1].x} ${B} L ${pts[0].x} ${B} Z`;
    const peak = pts.reduce((a, b) => (b.v > a.v ? b : a));
    const sum = WEEK.reduce((s, w) => s + w.v, 0);
    return { L, Rr, T, B, MAX, pts, line, area, peak, sum, step };
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-[#EBF2F0] font-sans text-slate-800 antialiased">
      {/* ================= ORIGINAL SIDEBAR ================= */}
      <div>
        {isDesktop ? (
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={onToggleSidebar}
            activePage="Dashboard"
            onNavigate={onNavigate}
            onLogout={onLogout}
            partnerName="Dr. Sarah"
          />
        ) : (
          mobileNavOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs"
                onClick={() => setMobileNavOpen(false)}
                aria-hidden="true"
              />
              <div className="relative z-50">
                <Sidebar
                  collapsed={false}
                  onToggle={() => setMobileNavOpen(false)}
                  activePage="Dashboard"
                  onNavigate={navigateFromDrawer}
                  onLogout={onLogout}
                  partnerName="Dr. Sarah"
                />
              </div>
            </>
          )
        )}
      </div>

      {/* ================= DASHBOARD CONTENT ================= */}
      <main
        className="min-h-screen flex-1 p-4 transition-[margin] duration-300 ease-in-out sm:p-6 md:p-8 lg:ml-[var(--sb)]"
        style={{ "--sb": `${sidebarWidth}px` }}
      >
        <div className="mx-auto w-full max-w-7xl space-y-5">
          {/* Title Section */}
          <div>
            <h2 className="text-xl font-bold text-slate-900">Dashboard Overview</h2>
            <p className="text-xs font-medium text-[#009688]">
              Monitor and manage your clinical status and patient care
            </p>
          </div>

          {/* HERO BANNER WITH EXACT IMAGE OVERLAY MATCHING REFERENCE IMAGE */}
          <div className="relative min-h-[180px] overflow-hidden rounded-xl bg-[#0e271c] px-6 py-8 text-white shadow-md sm:py-10 md:py-12">
            {/* Background Image using user's imported image */}
            <div className="absolute inset-0 z-0">
              <img
                src={heroImage}
                alt=""
                className="h-full w-full object-cover object-center"
              />
            </div>

            {/* Dark Left Overlay Gradient */}
            <div
              className="absolute inset-0 z-10"
              style={{
                background:
                  "linear-gradient(90deg, rgba(10, 25, 18, 0.95) 0%, rgba(10, 25, 18, 0.85) 35%, rgba(10, 25, 18, 0.3) 65%, rgba(10, 25, 18, 0) 100%)",
              }}
            />

            {/* Banner Content */}
            <div className="relative z-20 max-w-xl">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-300">
                {dateLabel}
              </span>
              <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl lg:text-4xl">
                {greetingFor(now)}, Dr. Sarah
              </h1>
              <p className="mt-2 text-xs leading-relaxed text-emerald-100 sm:text-sm">
                You have {STATS[1].count} sessions scheduled for today and {STATS[3].count} unread messages.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={() => go("Sessions")}
                  className="rounded-full bg-white px-5 py-2 text-xs font-bold text-[#0A291D] shadow-sm transition-all hover:bg-emerald-50 active:scale-95"
                >
                  View Schedule
                </button>
                <button
                  onClick={() => go("Patients")}
                  className="rounded-full border border-white/30 bg-white/10 px-5 py-2 text-xs font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
                >
                  All Patients
                </button>
              </div>
            </div>
          </div>

          {/* TOP STATS CARDS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map(({ count, label, note, icon: Icon, page, tile, chev, card }) => (
              <button
                key={label}
                onClick={() => go(page)}
                className={`group flex flex-col rounded-lg border px-5 py-4 text-left shadow-[0_2px_10px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-md ${card}`}
              >
                <div className="flex w-full items-center gap-3">
                  <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${tile}`}>
                    <Icon size={18} strokeWidth={2} />
                  </span>
                  <h3 className="flex-1 text-[11px] font-bold uppercase tracking-wide text-[#1E3A4C]">
                    {label}
                  </h3>
                  <ChevronRight size={14} className={`flex-shrink-0 ${chev}`} />
                </div>
                <span className="mt-3 text-3xl font-bold leading-none text-[#0F3D33]">{count}</span>
                <p className="mt-2 text-[11px] text-slate-400">{note}</p>
              </button>
            ))}
          </div>

          {/* LOWER CONTENT GRID */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* SCHEDULE & MOTIVATION */}
            <div className="space-y-4 lg:col-span-5">
              <div className="rounded-lg border border-teal-100 bg-white p-4 shadow-[0_2px_12px_rgba(0,128,128,0.10)]">
                <CardHeader icon={Calendar} title="Today's Schedule" actionLabel="Full Schedule" onAction={() => go("Sessions")} />
                <div className="space-y-2">
                  {SCHEDULE.map((item) => (
                    <div key={item.name} className="flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50/60 p-2.5 text-xs">
                      <div className="flex items-center gap-2.5">
                        <Avatar src={item.avatar} name={item.name} size={36} />
                        <div>
                          <p className="font-bold text-slate-800">{item.name}</p>
                          <p className="text-[10px] text-slate-400">{item.start} - {item.end} · {item.type}</p>
                        </div>
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${STATUS_STYLE[item.tone]}`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-[#2D6A4F] p-4 text-white shadow-[0_2px_12px_rgba(45,106,79,0.30)]">
                <Heart size={20} className="text-white flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold">Take a deep breath</h4>
                  <p className="text-xs opacity-90">Small daily progress leads to big positive changes.</p>
                </div>
              </div>
            </div>

            {/* PATIENT OVERVIEW & PERFORMANCE CHART */}
            <div className="space-y-4 lg:col-span-4">
              {/* Donut Chart */}
              <div className="rounded-lg border border-teal-100 bg-white p-4 shadow-[0_2px_12px_rgba(0,128,128,0.10)]">
                <CardHeader icon={Users} title="Patient Overview" />
                <div className="flex items-center justify-between gap-4 px-1 pb-1">
                  <div className="relative flex h-36 w-36 flex-shrink-0 items-center justify-center">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r={R} fill="none" stroke="#EDF4EE" strokeWidth="16" />
                      {donut.map((s) => (
                        <circle
                          key={s.label}
                          cx="50"
                          cy="50"
                          r={R}
                          fill="none"
                          stroke={s.color}
                          strokeWidth="16"
                          strokeDasharray={`${s.dash} ${C}`}
                          strokeDashoffset={s.offset}
                        />
                      ))}
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-bold leading-none text-slate-800">{totalPatients}</span>
                      <span className="mt-1 text-xs text-slate-500">Patients</span>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 space-y-3 text-sm">
                    {PATIENT_OVERVIEW.map((p) => (
                      <div key={p.label} className="flex items-center gap-2.5">
                        <span className="h-3 w-3 flex-shrink-0 rounded-full" style={{ backgroundColor: p.color }}></span>
                        <span className="flex-1 truncate font-medium text-slate-600">{p.label}</span>
                        <span className="font-bold text-slate-900">{p.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Line Chart */}
              <div className="rounded-lg border border-teal-100 bg-white p-4 shadow-[0_2px_12px_rgba(0,128,128,0.10)]">
                <CardHeader icon={BarChart3} title="Session Summary" hint="This week" />
                <div className="mb-2 flex items-baseline justify-between text-xs">
                  <div>
                    <span className="text-xl font-black text-slate-800">{chart.sum}</span>
                    <span className="ml-1 text-[10px] text-slate-400">Total sessions</span>
                  </div>
                  <span className="rounded bg-teal-100 px-2 py-0.5 font-bold text-[#007070]">
                    Peak: {chart.peak.day}
                  </span>
                </div>
                <svg viewBox="0 0 340 120" className="w-full">
                  <defs>
                    <linearGradient id="gFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#00A884" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#00A884" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {chart.area && <path d={chart.area} fill="url(#gFill)" />}
                  {chart.line && <path d={chart.line} fill="none" stroke="#00A884" strokeWidth="2.5" />}
                  {chart.pts.map((p) => (
                    <circle key={p.day} cx={p.x} cy={p.y} r={3.5} fill="#00A884" />
                  ))}
                </svg>
              </div>
            </div>

            {/* MESSAGES & QUICK ACTIONS */}
            <div className="space-y-4 lg:col-span-3">
              <div className="rounded-lg border border-teal-100 bg-white p-4 shadow-[0_2px_12px_rgba(0,128,128,0.10)]">
                <CardHeader icon={FileText} title="Recent Messages" actionLabel="Chats" onAction={() => go("Messages")} />
                <div className="space-y-2.5">
                  {MESSAGES.map((m) => (
                    <div key={m.name} className="flex items-start gap-2.5 rounded-lg border border-emerald-100 bg-emerald-50/60 p-2.5 text-xs">
                      <Avatar src={avatarFor(m.name)} name={m.name} size={38} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-[13px] font-bold text-slate-800">{m.name}</span>
                          <span className="flex-shrink-0 text-[10px] text-slate-400">{m.time}</span>
                        </div>
                        <div className="mt-0.5 flex items-start justify-between gap-2">
                          <p className="line-clamp-2 text-[11px] leading-snug text-slate-500">{m.text}</p>
                          {m.unread > 0 && (
                            <span className="flex h-4 min-w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#00A884] px-1 text-[9px] font-bold text-white">
                              {m.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-teal-100 bg-white p-4 shadow-[0_2px_12px_rgba(0,128,128,0.10)]">
                <h3 className="mb-2 text-xs font-bold text-slate-800">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_ACTIONS.map(({ icon: Icon, label, page }) => (
                    <button key={label} onClick={() => go(page)} className="flex items-center gap-2 rounded-md border border-teal-100 bg-teal-50 p-2 text-xs hover:bg-teal-100 hover:text-[#008080]">
                      <Icon size={16} className="text-[#00A884]" />
                      <span className="truncate text-[10px] font-bold">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}