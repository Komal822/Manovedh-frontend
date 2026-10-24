import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft, ChevronRight, Plus, CalendarDays, CalendarCheck, MoreVertical, Clock, X, Menu,
  History as HistoryIcon,
} from "lucide-react";
import Sidebar from "./Sidebar";
import {
  sessionStore, useSessions, useNow, formatSlot, formatDay, sessionEnd, SESSION_MINUTES,
} from "./sessionStore";

/* ================= CONFIG ================= */
const DEFAULT_START_HOUR = 8;
const DEFAULT_END_HOUR = 18;
const ROW_H = 76;
const CARD_LIMIT = 6;

const SESSION_TYPES = ["Individual Therapy", "Follow-up Session", "Therapy Session", "Counselling", "Couple Therapy"];
const DURATIONS = [30, 45, 60, 90, 120];

/* Session chips — calm teal-green family (same as rest of app) */
const TONES = {
  green: { bg: "bg-[#E3F4F1]", border: "border-[#2A8C82]", text: "text-[#1F6F68]", subtext: "text-[#2A8C82]", dot: "bg-[#2A8C82]" },
  blue: { bg: "bg-[#DDEFF0]", border: "border-[#3F8C86]", text: "text-[#173D3A]", subtext: "text-[#2A8C82]", dot: "bg-[#3F8C86]" },
  amber: { bg: "bg-[#F4E4C6]", border: "border-[#D08A1E]", text: "text-[#4F3205]", subtext: "text-[#8A5A0B]", dot: "bg-[#D08A1E]" },
  purple: { bg: "bg-[#E4DCF0]", border: "border-[#7F62B0]", text: "text-[#2F2050]", subtext: "text-[#5E468A]", dot: "bg-[#7F62B0]" },
};
const TONE_KEYS = Object.keys(TONES);

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A8C82] focus-visible:ring-offset-2 focus-visible:ring-offset-[#ECF5F4]";

/* Themed thin scrollbar — same colors as ProfileSettings + Availability */
const SCROLLBAR_CSS = `
  html,
  .ss-root,
  .ss-root * {
    scrollbar-width: thin;
    scrollbar-color: #2A8C82 #E6F2F0;
  }
  .ss-root .ss-noscroll { scrollbar-width: none; }

  @supports selector(::-webkit-scrollbar) {
    html,
    .ss-root,
    .ss-root * {
      scrollbar-width: auto;
      scrollbar-color: auto;
    }
    html::-webkit-scrollbar,
    .ss-root::-webkit-scrollbar,
    .ss-root *::-webkit-scrollbar { width: 6px; height: 6px; }
    html::-webkit-scrollbar-track,
    .ss-root::-webkit-scrollbar-track,
    .ss-root *::-webkit-scrollbar-track { background: #E6F2F0; }
    html::-webkit-scrollbar-thumb,
    .ss-root::-webkit-scrollbar-thumb,
    .ss-root *::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #2A8C82 0%, #22B8AA 100%);
      border-radius: 999px;
    }
    html::-webkit-scrollbar-thumb:hover,
    .ss-root::-webkit-scrollbar-thumb:hover,
    .ss-root *::-webkit-scrollbar-thumb:hover { background: #1E9E93; }
    html::-webkit-scrollbar-corner,
    .ss-root::-webkit-scrollbar-corner,
    .ss-root *::-webkit-scrollbar-corner { background: transparent; }
    .ss-root .ss-noscroll::-webkit-scrollbar { display: none; width: 0; height: 0; }
  }
`;

/* ================= DATE HELPERS ================= */
const pad = (n) => String(n).padStart(2, "0");
const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const sameDay = (a, b) => toKey(a) === toKey(b);
const mondayOf = (d) => addDays(d, -((d.getDay() + 6) % 7));
const dayName = (d) => d.toLocaleDateString("en-US", { weekday: "short" });
const monthTitle = (d) => d.toLocaleDateString("en-US", { month: "long", year: "numeric" });

const toMin = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const fmtTime = (min) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h % 12 === 0 ? 12 : h % 12}:${pad(m)} ${h >= 12 ? "PM" : "AM"}`;
};
const fmtRange = (startMin, duration) => `${fmtTime(startMin)} – ${fmtTime(startMin + duration)}`;
const hourLabel = (h, compact = false) =>
  `${h % 12 === 0 ? 12 : h % 12}${compact ? "" : ":00"} ${h >= 12 ? "PM" : "AM"}`;

const fmtShortDate = (ts, now) => {
  const d = new Date(ts);
  const withYear = d.getFullYear() !== new Date(now).getFullYear();
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    ...(withYear ? { year: "numeric" } : {}),
  });
};

function toCalendar(s) {
  const d = new Date(s.start);
  const hash = [...s.patientName].reduce((a, c) => a + c.charCodeAt(0), 0);
  return {
    id: s.id,
    name: s.patientName,
    type: s.type || s.problem || "Therapy Session",
    date: toKey(d),
    start: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
    duration: s.duration || SESSION_MINUTES,
    tone: s.tone || TONE_KEYS[hash % TONE_KEYS.length],
    status: s.status,
  };
}

const sessionsOn = (sessions, d) =>
  sessions.filter((s) => s.date === toKey(d)).sort((a, b) => toMin(a.start) - toMin(b.start));

function layoutSessions(list) {
  const items = list.map((s) => ({ s, start: toMin(s.start), end: toMin(s.start) + s.duration }));
  const out = [];
  let group = [];
  let groupEnd = 0;
  const flush = () => {
    const cols = [];
    group.forEach((it) => {
      let c = cols.findIndex((end) => end <= it.start);
      if (c === -1) {
        c = cols.length;
        cols.push(it.end);
      } else cols[c] = it.end;
      it.col = c;
    });
    group.forEach((it) => out.push({ ...it, cols: cols.length }));
    group = [];
  };
  items.forEach((it) => {
    if (group.length && it.start >= groupEnd) flush();
    group.push(it);
    groupEnd = Math.max(groupEnd, it.end);
  });
  if (group.length) flush();
  return out;
}

function useMedia(query, fallback) {
  const get = () =>
    typeof window !== "undefined" && window.matchMedia ? window.matchMedia(query).matches : fallback;
  const [matches, setMatches] = useState(get);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

/* ================= MAIN ================= */
export default function Sessions({ onLogout, onNavigate, sidebarCollapsed, onToggleSidebar }) {
  const isDesktop = useMedia("(min-width: 1024px)", true);
  const isPhone = useMedia("(max-width: 639px)", false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (isDesktop) setMobileNavOpen(false);
  }, [isDesktop]);

  useEffect(() => {
    if (!mobileNavOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  const sidebarWidth = sidebarCollapsed ? 76 : 268;

  const storeSessions = useSessions();
  const now = useNow();
  const today = new Date(now);

  const [view, setView] = useState("week");
  const [cursor, setCursor] = useState(() => new Date());
  const [modal, setModal] = useState(null);

  const sessions = useMemo(
    () => storeSessions.filter((s) => s.status === "scheduled" || s.status === "completed").map(toCalendar),
    [storeSessions]
  );

  const shift = (dir) => {
    if (view === "day") setCursor(addDays(cursor, dir));
    else if (view === "week") setCursor(addDays(cursor, dir * 7));
    else setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + dir, 1));
  };

  const weekDays = useMemo(() => {
    const mon = mondayOf(cursor);
    return Array.from({ length: 7 }, (_, i) => addDays(mon, i));
  }, [cursor]);

  const days = useMemo(() => {
    if (view === "day") return [cursor];
    if (view === "week" && isPhone) return [cursor];
    return weekDays;
  }, [view, isPhone, cursor, weekDays]);

  const range = useMemo(() => {
    let start = DEFAULT_START_HOUR;
    let end = DEFAULT_END_HOUR;
    for (const d of days) {
      for (const s of sessionsOn(sessions, d)) {
        start = Math.min(start, Math.floor(toMin(s.start) / 60));
        end = Math.max(end, Math.ceil((toMin(s.start) + s.duration) / 60) - 1);
      }
    }
    return { start, end: Math.min(end, 23) };
  }, [days, sessions]);

  const upcoming = useMemo(
    () =>
      storeSessions
        .filter((s) => s.status === "scheduled" && sessionEnd(s) > now)
        .sort((a, b) => a.start - b.start)
        .map((s) => ({ ...toCalendar(s), ts: s.start })),
    [storeSessions, now]
  );

  const history = useMemo(
    () =>
      storeSessions
        .filter((s) => s.status === "completed" || (s.status === "scheduled" && sessionEnd(s) <= now))
        .sort((a, b) => b.start - a.start)
        .map((s) => ({ ...toCalendar(s), ts: s.start })),
    [storeSessions, now]
  );

  const openNew = () => {
    const d = new Date();
    const h = sameDay(cursor, d) ? Math.min(d.getHours() + 1, 23) : 10;
    setModal({ date: toKey(cursor), start: `${pad(h)}:00` });
  };
  const openSlot = (date, hour) => setModal({ date: toKey(date), start: `${pad(hour)}:00` });

  const addSession = (data) => {
    const r = sessionStore.schedule({
      name: data.name,
      problem: data.type,
      type: data.type,
      tone: data.tone,
      duration: data.duration,
      start: data.start,
    });
    if (r.ok) {
      setCursor(new Date(data.start));
      setModal(null);
    }
    return r;
  };

  const navigateFromDrawer = (page) => {
    setMobileNavOpen(false);
    if (typeof onNavigate === "function") onNavigate(page);
  };

  return (
    <div className="ss-root min-h-[100dvh] bg-[#ECF5F4] text-[#122A2E] antialiased selection:bg-[#2A8C82] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .ss-root, .ss-root button, .ss-root input, .ss-root select { font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif; }
        .ss-serif { font-family: 'Fraunces', Georgia, serif !important; font-optical-sizing: auto; letter-spacing: -0.01em; }
        .ss-root { overflow-x: clip; }
        .ss-root button, .ss-root select, .ss-root input { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }

        ${SCROLLBAR_CSS}

        @keyframes ss-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ss-rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        .ss-backdrop { animation: ss-fade .2s ease both; }
        .ss-rise { animation: ss-rise .45s cubic-bezier(.16,1,.3,1) both; }
        @media (prefers-reduced-motion: reduce) { .ss-backdrop, .ss-rise { animation: none; } }
      `}</style>

      {/* SIDEBAR */}
      {isDesktop ? (
        <Sidebar collapsed={sidebarCollapsed} onToggle={onToggleSidebar} activePage="Sessions"
          onNavigate={onNavigate} onLogout={onLogout} partnerName="Prem Zumble" />
      ) : (
        mobileNavOpen && (
          <>
            <div className="ss-backdrop fixed inset-0 z-40 bg-[#0A1F17]/50 backdrop-blur-sm"
              onClick={() => setMobileNavOpen(false)} aria-hidden="true" />
            <div className="relative z-50">
              <Sidebar collapsed={false} onToggle={() => setMobileNavOpen(false)} activePage="Sessions"
                onNavigate={navigateFromDrawer} onLogout={onLogout} partnerName="Prem Zumble" />
            </div>
          </>
        )
      )}

      {/* MOBILE TOP BAR */}
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-[#DEEEEE] bg-[#ECF5F4]/90 px-4 py-3 backdrop-blur-md lg:hidden">
        <button type="button" onClick={() => setMobileNavOpen(true)} aria-label="Open menu"
          className={`flex h-10 w-10 items-center justify-center rounded-xl border border-[#DEEEEE] bg-white ${FOCUS}`}>
          <Menu size={20} />
        </button>
        <span className="text-[15px] font-bold">Sessions</span>
      </div>

      {/* MAIN */}
      <main className="min-h-[100dvh] transition-[margin] duration-300 ease-in-out lg:ml-[var(--sb)]"
        style={{ "--sb": `${sidebarWidth}px` }}>
        <div className="mx-auto w-full max-w-[1600px] px-3 py-4 sm:px-8 sm:py-9">
          <Toolbar view={view} onView={setView} title={monthTitle(cursor)}
            onPrev={() => shift(-1)} onNext={() => shift(1)} onToday={() => setCursor(new Date())} onNew={openNew} />

          <div className="grid grid-cols-1 items-start gap-5 sm:gap-6 lg:grid-cols-12">
            <div className="ss-rise min-w-0 space-y-3 lg:col-span-8 xl:col-span-9" style={{ animationDelay: "60ms" }}>
              {view === "week" && isPhone && (
                <WeekStrip days={weekDays} cursor={cursor} today={today} sessions={sessions} onPick={setCursor} />
              )}

              {view === "month" ? (
                <MonthView sessions={sessions} cursor={cursor} today={today}
                  onPick={(d) => { setCursor(d); setView("day"); }} />
              ) : (
                <TimeGrid sessions={sessions} days={days} cursor={cursor} today={today} range={range}
                  compact={isPhone} onPick={setCursor} onSlot={openSlot} />
              )}
            </div>

            <aside className="ss-rise min-w-0 space-y-4 sm:space-y-5 lg:col-span-4 xl:col-span-3" style={{ animationDelay: "120ms" }}>
              <SessionsCard upcoming={upcoming} history={history} now={now} />
              <TipCard />
            </aside>
          </div>
        </div>
      </main>

      {modal && <NewSessionModal initial={modal} onClose={() => setModal(null)} onSave={addSession} />}
    </div>
  );
}

/* ================= TOOLBAR ================= */
function Toolbar({ view, onView, title, onPrev, onNext, onToday, onNew }) {
  const views = [
    { key: "day", label: "Day" },
    { key: "week", label: "Week" },
    { key: "month", label: "Month" },
  ];

  return (
    <header className="ss-rise mb-4 flex flex-col gap-3 px-1 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
      <div className="flex items-center justify-between gap-3 sm:justify-start sm:gap-4">
        <h1 className="ss-serif min-w-0 truncate text-[24px] font-semibold leading-none tracking-tight sm:text-[34px] lg:text-[40px]">
          {title}
        </h1>
        <div className="flex shrink-0 items-center gap-0.5 rounded-full border border-[#CFE6E3] bg-white p-1">
          <button type="button" aria-label="Previous" onClick={onPrev}
            className={`rounded-full p-2 text-[#122A2E] transition hover:bg-[#F0F9F7] sm:p-1.5 ${FOCUS}`}>
            <ChevronLeft size={18} />
          </button>
          <button type="button" onClick={onToday}
            className={`rounded-full px-3 py-1.5 text-xs font-bold text-[#122A2E] transition hover:bg-[#F0F9F7] sm:py-1 ${FOCUS}`}>
            Today
          </button>
          <button type="button" aria-label="Next" onClick={onNext}
            className={`rounded-full p-2 text-[#122A2E] transition hover:bg-[#F0F9F7] sm:p-1.5 ${FOCUS}`}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="flex flex-1 gap-1 rounded-full border border-[#CFE6E3] bg-white p-1 text-xs font-bold sm:flex-none">
          {views.map((v) => (
            <button key={v.key} type="button" onClick={() => onView(v.key)} aria-pressed={view === v.key}
              className={`flex-1 rounded-full px-3 py-2 transition sm:flex-none sm:px-4 sm:py-1.5 ${FOCUS} ${
                view === v.key ? "bg-[#184D43] text-white" : "text-[#5B7A7E] hover:bg-[#F0F9F7]"
              }`}>
              {v.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={onNew} aria-label="New session"
          className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-[#184D43] px-4 text-sm font-bold text-white transition hover:bg-[#123A32] active:scale-95 sm:px-5 ${FOCUS}`}>
          <Plus size={18} strokeWidth={2.5} />
          <span className="hidden min-[400px]:inline">New session</span>
          <span className="min-[400px]:hidden">New</span>
        </button>
      </div>
    </header>
  );
}

/* ================= WEEK STRIP (phone) ================= */
function WeekStrip({ days, cursor, today, sessions, onPick }) {
  return (
    <div className="grid grid-cols-7 gap-1 rounded-2xl border border-[#DEEEEE] bg-white p-1.5">
      {days.map((d) => {
        const active = sameDay(d, cursor);
        const isToday = sameDay(d, today);
        const count = sessionsOn(sessions, d).length;
        return (
          <button key={toKey(d)} type="button" onClick={() => onPick(d)} aria-pressed={active}
            aria-label={`${d.toDateString()}${count ? `, ${count} sessions` : ""}`}
            className={`flex flex-col items-center rounded-xl py-1.5 transition ${FOCUS} ${
              active ? "bg-[#184D43] text-white" : "hover:bg-[#F0F9F7]"
            }`}>
            <span className={`text-[10px] font-bold ${active ? "text-white/80" : "text-[#5B7A7E]"}`}>{dayName(d)}</span>
            <span className={`mt-0.5 text-sm font-extrabold ${
              !active && isToday ? "text-[#2A8C82]" : ""
            }`}>
              {d.getDate()}
            </span>
            <span className={`mt-1 h-1.5 w-1.5 rounded-full ${
              count > 0 ? (active ? "bg-white" : "bg-[#2A8C82]") : "bg-transparent"
            }`} />
          </button>
        );
      })}
    </div>
  );
}

/* ================= TIME GRID ================= */
function TimeGrid({ sessions, days, cursor, today, range, compact, onPick, onSlot }) {
  const timeCol = compact ? 52 : 72;
  const cols = `${timeCol}px repeat(${days.length}, minmax(0, 1fr))`;
  const minWidth = days.length === 1 ? 0 : 720;
  const hours = Array.from({ length: range.end - range.start + 1 }, (_, i) => range.start + i);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#DEEEEE] bg-white sm:rounded-3xl">
      <div className="overflow-x-auto overscroll-x-contain">
        <div style={{ minWidth }}>
          <div className="grid border-b border-[#E3EFEC] bg-white text-center" style={{ gridTemplateColumns: cols }}>
            <div className="flex items-center justify-center border-r border-[#E8F2EF] p-2 text-[#5B7A7E] sm:p-3">
              <Clock size={compact ? 16 : 18} />
            </div>
            {days.map((d, i) => {
              const active = sameDay(d, cursor);
              const isToday = sameDay(d, today);
              const count = sessionsOn(sessions, d).length;
              return (
                <button key={toKey(d)} type="button" onClick={() => onPick(d)}
                  className={`relative px-2 py-3 transition-colors sm:py-3.5 ${FOCUS} ${
                    i < days.length - 1 ? "border-r border-[#E8F2EF]" : ""
                  } ${active ? "bg-[#F0F9F7]" : "hover:bg-[#F6FBFA]"}`}>
                  <div className={`text-xs font-bold ${active ? "text-[#2A8C82]" : "text-[#5B7A7E]"}`}>{dayName(d)}</div>
                  <div className="mt-1 flex items-center justify-center">
                    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-extrabold ${
                      isToday ? "bg-[#184D43] text-white" : active ? "text-[#2A8C82]" : "text-[#122A2E]"
                    }`}>
                      {d.getDate()}
                    </span>
                  </div>
                  <div className="mt-1 h-4 text-[11px] font-bold text-[#2A8C82]">
                    {count > 0 ? `${count} session${count > 1 ? "s" : ""}` : ""}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="grid" style={{ gridTemplateColumns: cols }}>
            <div className="select-none border-r border-[#E8F2EF]">
              {hours.map((h, i) => (
                <div key={h} style={{ height: ROW_H }}
                  className={`flex items-start justify-end pr-2 pt-2.5 text-[11px] font-bold text-[#5B7A7E] sm:pr-3 sm:text-xs ${
                    i < hours.length - 1 ? "border-b border-[#EEF5F3]" : ""
                  }`}>
                  {hourLabel(h, compact)}
                </div>
              ))}
            </div>
            {days.map((d, i) => (
              <DayColumn key={toKey(d)} sessions={sessions} date={d} hours={hours} range={range}
                active={sameDay(d, cursor)} last={i === days.length - 1} onSlot={onSlot} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DayColumn({ sessions, date, hours, range, active, last, onSlot }) {
  const list = layoutSessions(sessionsOn(sessions, date));
  const gridEnd = (range.end + 1) * 60;

  return (
    <div className={`relative ${last ? "" : "border-r border-[#E8F2EF]"} ${active ? "bg-[#F6FBFA]" : ""}`}>
      {hours.map((h, i) => (
        <div key={h} style={{ height: ROW_H }} onClick={() => onSlot(date, h)} title={`Add session at ${hourLabel(h)}`}
          className={`group/slot cursor-pointer transition-colors [@media(hover:hover)]:hover:bg-[#F0F9F7] active:bg-[#F0F9F7] ${
            i < hours.length - 1 ? "border-b border-[#EEF5F3]" : ""
          }`}>
          <div className="flex h-full items-center justify-center opacity-0 transition-opacity [@media(hover:hover)]:group-hover/slot:opacity-100">
            <Plus size={16} className="text-[#2A8C82]" />
          </div>
        </div>
      ))}

      {list.map(({ s, start, end, col, cols }) => {
        const top = ((start - range.start * 60) / 60) * ROW_H + 2;
        const height = ((Math.min(end, gridEnd) - start) / 60) * ROW_H - 4;
        const style = TONES[s.tone] || TONES.green;
        const done = s.status === "completed";
        return (
          <div key={s.id} title={`${s.name} • ${s.type} • ${fmtRange(start, s.duration)}${done ? " • Completed" : ""}`}
            onClick={(e) => e.stopPropagation()}
            style={{ top, height, left: `calc(${(col / cols) * 100}% + 4px)`, width: `calc(${100 / cols}% - 8px)` }}
            className={`absolute z-10 flex cursor-pointer flex-col justify-center gap-0.5 overflow-hidden rounded-xl border-l-4 px-2 py-1.5 transition hover:z-20 hover:brightness-95 sm:px-2.5 ${style.bg} ${style.border} ${done ? "opacity-60" : ""}`}>
            <div className={`truncate text-[13px] font-extrabold leading-tight ${style.text}`}>{s.name}</div>
            <div className={`flex items-center gap-1 text-[11px] font-bold ${style.subtext}`}>
              <Clock size={11} className="shrink-0" />
              <span className="truncate">{fmtRange(start, s.duration)}</span>
            </div>
            <div className={`truncate text-[11px] font-semibold ${style.subtext}`}>{done ? "Completed" : s.type}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ================= MONTH VIEW ================= */
function MonthView({ sessions, cursor, today, onPick }) {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const gridStart = mondayOf(first);
  const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  const heads = cells.slice(0, 7).map(dayName);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#DEEEEE] bg-white sm:rounded-3xl">
      <div className="grid grid-cols-7 border-b border-[#E3EFEC] text-center text-[10px] font-bold text-[#5B7A7E] sm:text-xs">
        {heads.map((h) => <div key={h} className="py-3 sm:py-3.5">{h}</div>)}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((d, i) => {
          const list = sessionsOn(sessions, d);
          const inMonth = d.getMonth() === cursor.getMonth();
          const isToday = sameDay(d, today);
          return (
            <button key={toKey(d)} type="button" onClick={() => onPick(d)}
              aria-label={`${d.toDateString()}${list.length ? `, ${list.length} sessions` : ""}`}
              className={`min-h-[56px] min-w-0 p-1 text-left align-top transition-colors hover:bg-[#F6FBFA] sm:min-h-[110px] sm:p-2 ${FOCUS} ${
                i % 7 !== 6 ? "border-r border-[#E8F2EF]" : ""
              } ${i < 35 ? "border-b border-[#E8F2EF]" : ""} ${inMonth ? "bg-white" : "bg-[#F6FBFA]"}`}>
              <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-extrabold sm:h-7 sm:w-7 sm:text-xs ${
                isToday ? "bg-[#184D43] text-white" : inMonth ? "text-[#122A2E]" : "text-[#93B0AE]"
              }`}>
                {d.getDate()}
              </span>

              {list.length > 0 && (
                <div className="mt-1 flex flex-wrap items-center gap-0.5 px-0.5 sm:hidden">
                  {list.slice(0, 3).map((s) => (
                    <span key={s.id} className={`h-1.5 w-1.5 rounded-full ${(TONES[s.tone] || TONES.green).dot}`} />
                  ))}
                  {list.length > 3 && <span className="text-[9px] font-bold text-[#5B7A7E]">+{list.length - 3}</span>}
                </div>
              )}

              <div className="mt-1.5 hidden space-y-1 sm:block">
                {list.slice(0, 2).map((s) => {
                  const style = TONES[s.tone] || TONES.green;
                  return (
                    <div key={s.id} title={`${s.name} • ${s.type}`}
                      className={`flex items-center gap-1 truncate rounded-md border-l-4 px-1.5 py-1 text-[11px] font-bold ${style.bg} ${style.border} ${style.text} ${
                        s.status === "completed" ? "opacity-60" : ""
                      }`}>
                      <span className={`shrink-0 ${style.subtext}`}>{fmtTime(toMin(s.start)).replace(":00", "")}</span>
                      <span className="truncate">{s.name}</span>
                    </div>
                  );
                })}
                {list.length > 2 && <div className="px-1 text-[11px] font-bold text-[#5B7A7E]">+{list.length - 2} more</div>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ================= NEW SESSION MODAL ================= */
const inputCls =
  "w-full min-w-0 rounded-xl border border-[#CFE6E3] bg-[#F6FBFA] px-3.5 py-2.5 text-base text-[#122A2E] outline-none transition focus:border-[#2A8C82] focus:bg-white focus:ring-4 focus:ring-[#2A8C82]/10 sm:text-sm";
const labelCls = "mb-1.5 block text-sm font-bold text-[#5B7A7E]";

function NewSessionModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "", type: SESSION_TYPES[0], date: initial.date, start: initial.start, duration: 60, tone: "green",
  });
  const [error, setError] = useState("");
  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError("");
  };

  const autoFocusName = typeof window !== "undefined" && window.innerWidth >= 640;

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const submit = () => {
    const name = form.name.trim();
    if (!name) return setError("Enter the patient's name.");
    if (!form.date) return setError("Choose a date.");
    if (!form.start) return setError("Choose a start time.");

    const duration = Number(form.duration);
    if (toMin(form.start) + duration > 24 * 60) return setError("The session must end by midnight.");

    const start = new Date(`${form.date}T${form.start}`).getTime();
    if (Number.isNaN(start) || start <= Date.now()) return setError("Pick a time in the future.");

    const r = onSave({ name, type: form.type, start, duration, tone: form.tone, date: form.date });
    if (!r.ok) {
      setError(
        r.reason === "conflict"
          ? `This clashes with ${r.conflict.patientName} at ${formatSlot(r.conflict.start)}.`
          : "Could not save this session. Please try another time."
      );
    }
  };

  const endPreview =
    form.start && toMin(form.start) >= 0 ? fmtRange(toMin(form.start), Number(form.duration)) : "";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#0A1F17]/50 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label="New session"
        className="flex max-h-[92dvh] w-full max-w-md flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:rounded-3xl">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-slate-200 sm:hidden" aria-hidden="true" />
          <div className="flex items-center justify-between px-5 pb-2 pt-3 sm:px-6 sm:pt-5">
            <h2 className="text-lg font-extrabold tracking-tight">New session</h2>
            <button type="button" aria-label="Close" onClick={onClose}
              className={`rounded-full p-2.5 text-[#5B7A7E] hover:bg-[#F0F9F7] sm:p-2 ${FOCUS}`}>
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4 px-5 py-3 sm:px-6 sm:py-4">
            <div>
              <label className={labelCls} htmlFor="ns-name">Patient name</label>
              <input id="ns-name" autoFocus={autoFocusName} className={inputCls} value={form.name} placeholder="e.g. Emma Wilson"
                onChange={(e) => set("name", e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
            </div>

            <div>
              <label className={labelCls} htmlFor="ns-type">Session type</label>
              <select id="ns-type" className={inputCls} value={form.type} onChange={(e) => set("type", e.target.value)}>
                {SESSION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
              <div className="min-w-0">
                <label className={labelCls} htmlFor="ns-date">Date</label>
                <input id="ns-date" type="date" className={inputCls} value={form.date} onChange={(e) => set("date", e.target.value)} />
              </div>
              <div className="min-w-0">
                <label className={labelCls} htmlFor="ns-start">Start time</label>
                <input id="ns-start" type="time" step={900} className={inputCls} value={form.start} onChange={(e) => set("start", e.target.value)} />
              </div>
            </div>

            <div>
              <label className={labelCls} htmlFor="ns-duration">Duration</label>
              <select id="ns-duration" className={inputCls} value={form.duration} onChange={(e) => set("duration", Number(e.target.value))}>
                {DURATIONS.map((m) => <option key={m} value={m}>{m} minutes</option>)}
              </select>
              {endPreview && <p className="mt-1.5 text-xs font-semibold text-[#5B7A7E]">{endPreview}</p>}
            </div>

            <div>
              <span className={labelCls}>Colour</span>
              <div className="flex gap-3">
                {Object.keys(TONES).map((t) => (
                  <button key={t} type="button" aria-label={t} aria-pressed={form.tone === t} onClick={() => set("tone", t)}
                    className={`h-9 w-9 rounded-full sm:h-8 sm:w-8 ${TONES[t].dot} transition ${
                      form.tone === t ? "ring-2 ring-[#122A2E] ring-offset-2" : "opacity-70 hover:opacity-100"
                    }`} />
                ))}
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {error}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-2.5 bg-white px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_16px_-12px_rgba(18,42,46,0.18)] sm:flex-row sm:justify-end sm:px-6 sm:pb-5">
          <button type="button" onClick={onClose}
            className={`w-full rounded-full border border-[#CFE6E3] px-5 py-3 text-sm font-bold text-[#122A2E] hover:bg-[#F0F9F7] sm:w-auto sm:py-2.5 ${FOCUS}`}>
            Cancel
          </button>
          <button type="button" onClick={submit}
            className={`w-full rounded-full bg-[#184D43] px-5 py-3 text-sm font-bold text-white hover:bg-[#123A32] active:scale-95 sm:w-auto sm:py-2.5 ${FOCUS}`}>
            Save session
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= SIDE PANEL ================= */
function Avatar({ name }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E3F4F1] text-[11px] font-bold text-[#2A8C82]">
      {initials}
    </div>
  );
}

function SessionsCard({ upcoming, history, now }) {
  const [tab, setTab] = useState("upcoming");
  const [expanded, setExpanded] = useState(false);

  const isUpcoming = tab === "upcoming";
  const list = isUpcoming ? upcoming : history;
  const shown = expanded ? list : list.slice(0, CARD_LIMIT);
  const canToggle = list.length > CARD_LIMIT;

  const switchTab = (key) => {
    setTab(key);
    setExpanded(false);
  };

  const tabs = [
    { key: "upcoming", label: "Upcoming", count: upcoming.length, icon: CalendarDays },
    { key: "history", label: "History", count: history.length, icon: HistoryIcon },
  ];

  return (
    <div className="rounded-2xl border border-[#DEEEEE] bg-white p-4 sm:rounded-3xl sm:p-5">
      {/* Tabs — full width, labels never truncated */}
      <div className={canToggle ? "pb-2" : "pb-3"}>
        <div className="flex gap-1 rounded-full bg-[#F0F9F7] p-1" role="tablist" aria-label="Sessions list">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button key={t.key} type="button" role="tab" aria-selected={active} onClick={() => switchTab(t.key)}
                className={`flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold transition ${FOCUS} ${
                  active
                    ? "bg-[#2A8C82] text-white shadow-sm"
                    : "text-[#5B7A7E] hover:bg-white/60 hover:text-[#122A2E]"
                }`}>
                <Icon size={14} className="shrink-0" />
                <span className="shrink-0 whitespace-nowrap">{t.label}</span>
                <span className={`shrink-0 rounded-full px-1.5 text-[10px] font-bold leading-4 ${
                  active ? "bg-white/20 text-white" : "bg-white text-[#5B7A7E]"
                }`}>
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* View all / Show less — separate row, only when needed */}
      {canToggle && (
        <div className="flex justify-end pb-2">
          <button type="button" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}
            className={`rounded px-1 py-0.5 text-xs font-semibold text-[#2A8C82] hover:underline ${FOCUS}`}>
            {expanded ? "Show less" : "View all"}
          </button>
        </div>
      )}

      <div className="divide-y divide-[#E8F2EF]">
        {list.length === 0 && (
          <p className="py-6 text-center text-sm font-medium text-[#5B7A7E]">
            {isUpcoming ? "No upcoming sessions. Add one with “New session”." : "No past sessions yet."}
          </p>
        )}

        {isUpcoming &&
          shown.map((s) => {
            const day = formatDay(s.ts, now);
            const hot = day === "Today" || day === "Tomorrow";
            return (
              <div key={s.id} className="flex items-center justify-between gap-2 py-2.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <Avatar name={s.name} />
                  <div className="min-w-0">
                    <h3 className="truncate text-[13px] font-semibold">{s.name}</h3>
                    <p className="truncate text-xs font-medium text-[#5B7A7E]">{s.type}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <div className="text-right">
                    <div className="text-xs font-semibold">{fmtTime(toMin(s.start))}</div>
                    <div className={`text-[11px] font-semibold ${hot ? "text-[#2A8C82]" : "text-[#5B7A7E]"}`}>{day}</div>
                  </div>
                  <button type="button" aria-label={`Options for ${s.name}`}
                    className={`rounded-full p-2 text-[#5B7A7E] hover:bg-[#F0F9F7] sm:p-1.5 ${FOCUS}`}>
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            );
          })}

        {!isUpcoming &&
          shown.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-2 py-2.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <Avatar name={s.name} />
                <div className="min-w-0">
                  <h3 className="truncate text-[13px] font-semibold">{s.name}</h3>
                  <p className="truncate text-xs font-medium text-[#5B7A7E]">{s.type}</p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-0.5">
                <div className="text-xs font-semibold">{fmtShortDate(s.ts, now)}</div>
                <div className="text-[11px] font-medium text-[#5B7A7E]">{fmtTime(toMin(s.start))}</div>
                <span className="rounded-full bg-[#F0F9F7] px-2 py-0.5 text-[10px] font-semibold text-[#2A8C82]">
                  Completed
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function TipCard() {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-[#D6EEEA] p-4 sm:rounded-3xl sm:p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#2A8C82]">
        <CalendarCheck size={19} />
      </div>
      <div>
        <h4 className="text-sm font-extrabold text-[#1F6F68]">Stay organized</h4>
        <p className="mt-1 text-[13px] font-medium leading-relaxed text-[#2A8C82]">
          Schedule regular sessions to give your patients steady support.
        </p>
      </div>
    </div>
  );
}