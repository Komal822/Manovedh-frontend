import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar, CalendarClock, Users, FileText, Heart, BarChart3, ChevronRight, Clock, MessageSquare, Menu,
} from "lucide-react";

import Sidebar from "./Sidebar";
import heroImage from "../../assets/councellor-images/overview.png";

/* ============================================================
    DATA & CONSTANTS
============================================================ */

const STATS = [
  { count: 12, label: "Total patients", note: "2 new this month", icon: Users, page: "Patients", tile: "bg-[#E3F4F1] text-[#2A8C82]", chev: "text-[#93B0AE]", card: "border-[#CFE6E3] bg-[#F6FBFA]" },
  { count: 5, label: "Today's sessions", note: "1 starting soon", icon: Calendar, page: "Sessions", tile: "bg-[#DDEFF0] text-[#1F6F68]", chev: "text-[#93B0AE]", card: "border-[#CFE6E3] bg-[#F6FBFA]" },
  { count: 2, label: "Upcoming sessions", note: "Next 7 days", icon: Clock, page: "Sessions", tile: "bg-[#F4E4C6] text-[#8A5A0B]", chev: "text-[#D08A1E]", card: "border-[#F4E4C6] bg-[#FFFBEB]" },
  { count: 8, label: "Unread messages", note: "From 4 patients", icon: MessageSquare, page: "Messages", tile: "bg-[#E3F4F1] text-[#2A8C82]", chev: "text-[#93B0AE]", card: "border-[#CFE6E3] bg-[#F6FBFA]" },
];

const AVAILABILITY_TODAY = [
  { start: "10:00 AM", end: "12:00 PM" },
  { start: "04:00 PM", end: "06:00 PM" },
];

const SCHEDULE = [
  { start: "10:00 AM", end: "11:00 AM", name: "John Smith", type: "Individual therapy", status: "In 30 min", tone: "soon", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" },
  { start: "11:30 AM", end: "12:30 PM", name: "Emma Wilson", type: "Follow-up session", status: "Confirmed", tone: "confirmed", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80" },
  { start: "01:00 PM", end: "02:00 PM", name: "David Brown", type: "Therapy session", status: "Confirmed", tone: "confirmed", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
  { start: "02:30 PM", end: "03:30 PM", name: "Sophia Johnson", type: "Counselling", status: "Upcoming", tone: "upcoming", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" },
  { start: "04:00 PM", end: "05:00 PM", name: "Olivia Martinez", type: "Individual therapy", status: "Upcoming", tone: "upcoming", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80" },
];

const PATIENT_OVERVIEW = [
  { label: "Stable", count: 5, color: "#2A8C82" },
  { label: "Moderate", count: 4, color: "#6BB5AA" },
  { label: "High risk", count: 2, color: "#E0A458" },
  { label: "Inactive", count: 1, color: "#A9B0BC" },
];

const WEEK = [
  { day: "Mon", v: 7 }, { day: "Tue", v: 12 }, { day: "Wed", v: 9 },
  { day: "Thu", v: 10 }, { day: "Fri", v: 8 }, { day: "Sat", v: 5 }, { day: "Sun", v: 3 },
];

const MESSAGES = [
  { name: "John Smith", time: "10:25 AM", text: "I've been feeling a bit better this week…", unread: 2 },
  { name: "Emma Wilson", time: "9:48 AM", text: "Can we move Thursday's session?", unread: 1 },
  { name: "David Brown", time: "Yesterday", text: "Thank you, the breathing exercises help.", unread: 0 },
];

const STATUS_STYLE = {
  soon: "bg-[#184D43] text-white",
  confirmed: "bg-[#E3F4F1] text-[#1F6F68]",
  upcoming: "bg-[#DDEFF0] text-[#2A8C82]",
};

const SCROLLBAR_CSS = `
  html,
  .dash-scroll,
  .dash-scroll * {
    scrollbar-width: thin;
    scrollbar-color: #2A8C82 #E6F2F0;
  }
  html::-webkit-scrollbar,
  .dash-scroll::-webkit-scrollbar,
  .dash-scroll *::-webkit-scrollbar { width: 6px; height: 6px; }
  html::-webkit-scrollbar-track,
  .dash-scroll::-webkit-scrollbar-track,
  .dash-scroll *::-webkit-scrollbar-track { background: #E6F2F0; }
  html::-webkit-scrollbar-thumb,
  .dash-scroll::-webkit-scrollbar-thumb,
  .dash-scroll *::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #2A8C82 0%, #22B8AA 100%);
    border-radius: 999px;
  }
  html::-webkit-scrollbar-thumb:hover,
  .dash-scroll::-webkit-scrollbar-thumb:hover,
  .dash-scroll *::-webkit-scrollbar-thumb:hover { background: #1E9E93; }
  html::-webkit-scrollbar-corner,
  .dash-scroll::-webkit-scrollbar-corner,
  .dash-scroll *::-webkit-scrollbar-corner { background: transparent; }
`;

/* ============================================================
    HELPERS
============================================================ */

const greetingFor = (date) => {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const initials = (name) => name.split(" ").map((n) => n[0]).join("").slice(0, 2);

const toMin = (t) => {
  const [time, ap] = t.split(" ");
  let [h, m] = time.split(":").map(Number);
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return h * 60 + m;
};

const shortTime = (t) => t.replace(":00", "");

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

/* ============================================================
    COMPONENTS
============================================================ */

function CardHeader({ icon: Icon, title, hint, actionLabel, onAction }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <Icon size={18} strokeWidth={2.2} className="flex-shrink-0 text-[#2A8C82]" />
        <h2 className="truncate text-base font-bold text-[#122A2E]">
          {title}
          {hint && <span className="ml-2 text-xs font-normal text-[#93B0AE]">{hint}</span>}
        </h2>
      </div>
      {actionLabel && (
        <button
          onClick={onAction}
          className="inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-[#184D43] px-2.5 py-1 text-xs font-medium text-white transition hover:bg-[#123A32]"
        >
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
        className="flex flex-shrink-0 items-center justify-center rounded-full bg-[#E3F4F1] font-bold text-[#2A8C82]"
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
      className="flex-shrink-0 rounded-full object-cover shadow-xs ring-1 ring-[#DEEEEE]"
      style={{ width: size, height: size }}
    />
  );
}

/* Availability card: same size as the other stat cards, soft mint accent to match the theme */
function AvailabilityCard({ onOpen, value, note, isLive }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Availability today: ${value}. Open availability page`}
      className="group col-span-2 flex flex-col rounded-lg border border-[#9FD0CB] px-3 py-3 text-left shadow-[0_2px_10px_rgba(42,140,130,0.16)] transition-all hover:-translate-y-0.5 hover:shadow-md sm:px-5 sm:py-4 lg:col-span-1"
      style={{ background: "linear-gradient(145deg, #E3F4F1 0%, #F0F9F7 100%)" }}
    >
      <div className="flex w-full items-center gap-2 sm:gap-3">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#2A8C82] text-white sm:h-10 sm:w-10">
          <CalendarClock size={18} strokeWidth={2} />
        </span>
        <h3 className="flex-1 text-[10px] font-bold uppercase leading-tight tracking-wide text-[#122A2E] sm:text-[11px]">
          Availability
        </h3>
        <ChevronRight size={14} className="hidden flex-shrink-0 text-[#2A8C82] transition-transform group-hover:translate-x-0.5 sm:block" />
      </div>
      <span className="mt-3 text-xl font-bold leading-tight text-[#122A2E] sm:text-2xl lg:text-xl xl:text-2xl">
        {value}
      </span>
      <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#1F6F68]">
        {isLive && (
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2A8C82] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2A8C82]" />
          </span>
        )}
        {note}
      </p>
    </button>
  );
}

export default function CouncellorDashboard({
  onLogout, onNavigate, sidebarCollapsed = false, onToggleSidebar,
}) {
  const isDesktop = useIsDesktop();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (isDesktop) setMobileNavOpen(false);
  }, [isDesktop]);

  const sidebarWidth = sidebarCollapsed ? 76 : 268;
  const now = new Date();
  const dateLabel = now.toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const go = (page) => {
    if (typeof onNavigate === "function") onNavigate(page);
  };

  const navigateFromDrawer = (page) => {
    setMobileNavOpen(false);
    go(page);
  };

  const avatarFor = (name) => SCHEDULE.find((s) => s.name === name)?.avatar;

  const nowMin = now.getHours() * 60 + now.getMinutes();
  const liveSlot = AVAILABILITY_TODAY.find((s) => nowMin >= toMin(s.start) && nowMin < toMin(s.end));
  const nextSlot = AVAILABILITY_TODAY.find((s) => toMin(s.start) > nowMin);
  const shownSlot = liveSlot || nextSlot || AVAILABILITY_TODAY[AVAILABILITY_TODAY.length - 1];
  const availValue = shownSlot
    ? `${shortTime(shownSlot.start)} – ${shortTime(shownSlot.end)}`
    : "Not set";
  const availNote = !AVAILABILITY_TODAY.length
    ? "Add your hours"
    : liveSlot
    ? "Available now"
    : `Today · ${AVAILABILITY_TODAY.length} slot${AVAILABILITY_TODAY.length > 1 ? "s" : ""}`;

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
    <div className="dash-scroll flex min-h-screen w-full bg-[#ECF5F4] text-[#122A2E] antialiased"
      style={{ fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .dash-display { font-family: 'Fraunces', Georgia, serif; letter-spacing: -0.01em; }
        ${SCROLLBAR_CSS}
      `}</style>

      {/* ================= SIDEBAR ================= */}
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
        className="min-h-screen min-w-0 flex-1 p-4 transition-[margin] duration-300 ease-in-out sm:p-6 md:p-8 lg:ml-[var(--sb)]"
        style={{ "--sb": `${sidebarWidth}px` }}
      >
        <div className="mx-auto w-full max-w-7xl space-y-5">
          {/* Mobile top bar */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white text-[#2A8C82] shadow-sm ring-1 ring-[#CFE6E3]"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="min-w-0">
              <h2 className="dash-display text-lg font-semibold leading-tight text-[#122A2E]">Dashboard</h2>
              <p className="truncate text-[11px] font-medium text-[#2A8C82]">
                Clinical status & patient care
              </p>
            </div>
          </div>

          {/* Title (desktop) */}
          <div className="hidden lg:block">
            <h2 className="dash-display text-xl font-semibold text-[#122A2E]">Dashboard Overview</h2>
            <p className="text-xs font-medium text-[#2A8C82]">
              Monitor and manage your clinical status and patient care
            </p>
          </div>

          {/* HERO BANNER */}
          <div className="relative overflow-hidden rounded-xl bg-[#122A2E] text-white shadow-md sm:min-h-[200px]">
            <div className="relative h-40 w-full sm:absolute sm:inset-0 sm:h-full">
              <img
                src={heroImage}
                alt=""
                className="h-full w-full object-cover object-right sm:object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#122A2E] via-[#122A2E]/30 to-transparent sm:hidden" />
            </div>

            <div
              className="absolute inset-0 z-10 hidden sm:block"
              style={{
                background:
                  "linear-gradient(90deg, rgba(18,42,46,0.95) 0%, rgba(18,42,46,0.85) 35%, rgba(18,42,46,0.3) 65%, rgba(18,42,46,0) 100%)",
              }}
            />

            <div className="relative z-20 max-w-xl px-5 pb-5 pt-1 sm:px-8 sm:py-10 md:py-12">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A8E0D6] sm:text-[11px]">
                {dateLabel}
              </span>
              <h1 className="dash-display mt-1.5 text-2xl font-semibold leading-tight text-white sm:mt-2 md:text-3xl lg:text-4xl">
                {greetingFor(now)}, Dr. Sarah
              </h1>
              <p className="mt-2 text-xs leading-relaxed text-[#C7E6E1] sm:text-sm">
                You have {STATS[1].count} sessions scheduled for today and {STATS[3].count} unread messages.
              </p>

              {/* Always side by side; slightly bigger on mobile */}
              <div className="mt-4 flex flex-nowrap items-center gap-2.5 sm:mt-5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => go("Sessions")}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-white px-4 py-2.5 text-xs font-bold leading-none text-[#184D43] shadow-sm transition-all hover:bg-[#E3F4F1] active:scale-95 sm:flex-none sm:px-5"
                >
                  <Calendar size={14} strokeWidth={2.4} className="sm:hidden" />
                  View Schedule
                </button>
                <button
                  type="button"
                  onClick={() => go("Patients")}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-bold leading-none text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95 sm:flex-none sm:px-5"
                >
                  <Users size={14} strokeWidth={2.4} className="sm:hidden" />
                  All Patients
                </button>
              </div>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
            {STATS.map(({ count, label, note, icon: Icon, page, tile, chev, card }) => (
              <button
                key={label}
                onClick={() => go(page)}
                className={`group flex flex-col rounded-lg border px-3 py-3 text-left shadow-[0_2px_10px_rgba(18,42,46,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-md sm:px-5 sm:py-4 ${card}`}
              >
                <div className="flex w-full items-center gap-2 sm:gap-3">
                  <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 ${tile}`}>
                    <Icon size={18} strokeWidth={2} />
                  </span>
                  <h3 className="flex-1 text-[10px] font-bold uppercase leading-tight tracking-wide text-[#122A2E] sm:text-[11px]">
                    {label}
                  </h3>
                  <ChevronRight size={14} className={`hidden flex-shrink-0 sm:block ${chev}`} />
                </div>
                <span className="mt-3 text-2xl font-bold leading-none text-[#122A2E] sm:text-3xl">{count}</span>
                <p className="mt-2 text-[11px] text-[#93B0AE]">{note}</p>
              </button>
            ))}

            {/* Availability card */}
            <AvailabilityCard
              onOpen={() => go("Availability")}
              value={availValue}
              note={availNote}
              isLive={!!liveSlot}
            />
          </div>

          {/* LOWER CONTENT GRID */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* SCHEDULE & MOTIVATION */}
            <div className="space-y-4 lg:col-span-5">
              <div className="rounded-lg border border-[#DEEEEE] bg-white p-4 shadow-[0_2px_12px_rgba(42,140,130,0.10)]">
                <CardHeader icon={Calendar} title="Today's Schedule" actionLabel="Full Schedule" onAction={() => go("Sessions")} />
                <div className="space-y-2">
                  {SCHEDULE.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between gap-2 rounded-lg border border-[#DEEEEE] bg-[#F6FBFA] p-2.5 text-xs"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <Avatar src={item.avatar} name={item.name} size={36} />
                        <div className="min-w-0">
                          <p className="truncate font-bold text-[#122A2E]">{item.name}</p>
                          <p className="truncate text-[10px] text-[#5B7A7E]">
                            {item.start} - {item.end} · {item.type}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`flex-shrink-0 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-bold ${STATUS_STYLE[item.tone]}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-[#2A8C82] p-4 text-white shadow-[0_2px_12px_rgba(42,140,130,0.30)]">
                <Heart size={20} className="flex-shrink-0 text-white" />
                <div>
                  <h4 className="text-sm font-bold">Take a deep breath</h4>
                  <p className="text-xs opacity-90">Small daily progress leads to big positive changes.</p>
                </div>
              </div>
            </div>

            {/* PATIENT OVERVIEW & PERFORMANCE */}
            <div className="space-y-4 lg:col-span-4">
              {/* Donut */}
              <div className="rounded-lg border border-[#DEEEEE] bg-white p-4 shadow-[0_2px_12px_rgba(42,140,130,0.10)]">
                <CardHeader icon={Users} title="Patient Overview" />
                <div className="flex items-center justify-between gap-4 px-1 pb-1">
                  <div className="relative flex h-32 w-32 flex-shrink-0 items-center justify-center sm:h-36 sm:w-36">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r={R} fill="none" stroke="#E6F2F0" strokeWidth="16" />
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
                      <span className="text-3xl font-bold leading-none text-[#122A2E]">{totalPatients}</span>
                      <span className="mt-1 text-xs text-[#5B7A7E]">Patients</span>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 space-y-3 text-sm">
                    {PATIENT_OVERVIEW.map((p) => (
                      <div key={p.label} className="flex items-center gap-2.5">
                        <span className="h-3 w-3 flex-shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className="flex-1 truncate font-medium text-[#5B7A7E]">{p.label}</span>
                        <span className="font-bold text-[#122A2E]">{p.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Line Chart */}
              <div className="rounded-lg border border-[#DEEEEE] bg-white p-4 shadow-[0_2px_12px_rgba(42,140,130,0.10)]">
                <CardHeader icon={BarChart3} title="Session Summary" hint="This week" />
                <div className="mb-2 flex items-baseline justify-between text-xs">
                  <div>
                    <span className="text-xl font-black text-[#122A2E]">{chart.sum}</span>
                    <span className="ml-1 text-[10px] text-[#93B0AE]">Total sessions</span>
                  </div>
                  <span className="rounded bg-[#E3F4F1] px-2 py-0.5 font-bold text-[#2A8C82]">
                    Peak: {chart.peak.day}
                  </span>
                </div>
                <svg viewBox="0 0 340 120" className="w-full">
                  <defs>
                    <linearGradient id="gFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#2A8C82" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#2A8C82" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {chart.area && <path d={chart.area} fill="url(#gFill)" />}
                  {chart.line && <path d={chart.line} fill="none" stroke="#2A8C82" strokeWidth="2.5" />}
                  {chart.pts.map((p) => (
                    <circle key={p.day} cx={p.x} cy={p.y} r={3.5} fill="#2A8C82" />
                  ))}
                </svg>
              </div>
            </div>

            {/* MESSAGES */}
            <div className="space-y-4 lg:col-span-3">
              <div className="rounded-lg border border-[#DEEEEE] bg-white p-4 shadow-[0_2px_12px_rgba(42,140,130,0.10)] lg:min-h-[380px]">
                <CardHeader icon={FileText} title="Recent Messages" actionLabel="Chats" onAction={() => go("Messages")} />
                <div className="space-y-3.5">
                  {MESSAGES.map((m) => (
                    <div key={m.name} className="flex items-start gap-2.5 rounded-lg border border-[#DEEEEE] bg-[#F6FBFA] p-3.5 text-xs">
                      <Avatar src={avatarFor(m.name)} name={m.name} size={38} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-[13px] font-bold text-[#122A2E]">{m.name}</span>
                          <span className="flex-shrink-0 text-[10px] text-[#93B0AE]">{m.time}</span>
                        </div>
                        <div className="mt-0.5 flex items-start justify-between gap-2">
                          <p className="line-clamp-2 text-[11px] leading-snug text-[#5B7A7E]">{m.text}</p>
                          {m.unread > 0 && (
                            <span className="flex h-4 min-w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#184D43] px-1 text-[9px] font-bold text-white">
                              {m.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
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