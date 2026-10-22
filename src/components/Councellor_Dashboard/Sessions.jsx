import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft, ChevronRight, Plus, CalendarDays, CalendarCheck, MoreVertical, Clock, X, Menu,
} from "lucide-react";
import Sidebar from "./Sidebar";
import {
  sessionStore, useSessions, useNow, formatSlot, formatDay, sessionEnd, SESSION_MINUTES,
} from "./sessionStore";

/* ================= CONFIG ================= */
// Grid kamit kami 8 AM - 7 PM dakhavto. Tya baher chi session asel tar grid apoap vadhto.
const DEFAULT_START_HOUR = 8;
const DEFAULT_END_HOUR = 18;
const ROW_H = 76;

const SESSION_TYPES = ["Individual Therapy", "Follow-up Session", "Therapy Session", "Counselling", "Couple Therapy"];
const DURATIONS = [30, 45, 60, 90, 120];

const TONES = {
  green: { bg: "bg-[#D3E7DA]", border: "border-[#1F7A5A]", text: "text-[#0F3D2C]", subtext: "text-[#2F6B52]", dot: "bg-[#1F7A5A]" },
  blue: { bg: "bg-[#D6E6F0]", border: "border-[#3A82AE]", text: "text-[#14384F]", subtext: "text-[#2F6585]", dot: "bg-[#3A82AE]" },
  amber: { bg: "bg-[#F4E4C6]", border: "border-[#D08A1E]", text: "text-[#4F3205]", subtext: "text-[#8A5A0B]", dot: "bg-[#D08A1E]" },
  purple: { bg: "bg-[#E4DCF0]", border: "border-[#7F62B0]", text: "text-[#2F2050]", subtext: "text-[#5E468A]", dot: "bg-[#7F62B0]" },
};
const TONE_KEYS = Object.keys(TONES);

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F7A5A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#DDE7E1]";

/* ================= DATE HELPERS ================= */
const pad = (n) => String(n).padStart(2, "0");
const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromKey = (k) => {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
};
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
const hourLabel = (h) => `${h % 12 === 0 ? 12 : h % 12}:00 ${h >= 12 ? "PM" : "AM"}`;

// Store session -> calendar shape
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

// Sessions at the same time are shown side by side
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

function useIsDesktop() {
  const query = "(min-width: 1024px)";
  const get = () => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia(query).matches : true);
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

/* ================= MAIN ================= */
export default function Sessions({ onLogout, onNavigate, sidebarCollapsed, onToggleSidebar }) {
  const isDesktop = useIsDesktop();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  useEffect(() => {
    if (isDesktop) setMobileNavOpen(false);
  }, [isDesktop]);

  const sidebarWidth = sidebarCollapsed ? 76 : 268;

  const storeSessions = useSessions();
  const now = useNow();
  const today = new Date(now);

  const [view, setView] = useState("week");
  const [cursor, setCursor] = useState(() => new Date());
  const [modal, setModal] = useState(null);

  // Calendar madhe: scheduled + completed (completed halke disatat)
  const sessions = useMemo(
    () => storeSessions.filter((s) => s.status === "scheduled" || s.status === "completed").map(toCalendar),
    [storeSessions]
  );

  const shift = (dir) => {
    if (view === "day") setCursor(addDays(cursor, dir));
    else if (view === "week") setCursor(addDays(cursor, dir * 7));
    else setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + dir, 1));
  };

  const days = useMemo(() => {
    if (view === "day") return [cursor];
    const mon = mondayOf(cursor);
    return Array.from({ length: 7 }, (_, i) => addDays(mon, i));
  }, [view, cursor]);

  // Disat astil tya divsanche tasanchi range (kamit kami 8 AM - 7 PM)
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
        .slice(0, 6)
        .map((s) => ({ ...toCalendar(s), ts: s.start })),
    [storeSessions, now]
  );

  const openNew = () => {
    const d = new Date();
    const h = sameDay(cursor, d) ? Math.min(d.getHours() + 1, 23) : 10;
    setModal({ date: toKey(cursor), start: `${pad(h)}:00` });
  };
  const openSlot = (date, hour) => setModal({ date: toKey(date), start: `${pad(hour)}:00` });

  // Store madhe save hote -> Patients, Notifications madhe pan disate
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
    <div className="ss-root min-h-screen bg-[#DDE7E1] text-[#10281E] antialiased selection:bg-[#176247] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;700&display=swap');
        .ss-root, .ss-root button, .ss-root input, .ss-root select { font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif; }
        .ss-serif { font-family: 'Fraunces', Georgia, serif !important; font-optical-sizing: auto; }
        html, body, .ss-root, .ss-root * { scrollbar-width: none; -ms-overflow-style: none; }
        html::-webkit-scrollbar, body::-webkit-scrollbar, .ss-root::-webkit-scrollbar, .ss-root *::-webkit-scrollbar { display: none; width: 0; height: 0; }
        .ss-root { overflow-x: clip; }
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
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-[#C2D3C9] bg-[#DDE7E1]/90 px-4 py-3 backdrop-blur-md lg:hidden">
        <button type="button" onClick={() => setMobileNavOpen(true)} aria-label="Open menu"
          className={`flex h-10 w-10 items-center justify-center rounded-xl border border-[#C2D3C9] bg-white ${FOCUS}`}>
          <Menu size={20} />
        </button>
        <span className="text-[15px] font-bold">Sessions</span>
      </div>

      {/* MAIN */}
      <main className="min-h-screen transition-[margin] duration-300 ease-in-out lg:ml-[var(--sb)]"
        style={{ "--sb": `${sidebarWidth}px` }}>
        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-8 sm:py-9">
          <Toolbar view={view} onView={setView} title={monthTitle(cursor)}
            onPrev={() => shift(-1)} onNext={() => shift(1)} onToday={() => setCursor(new Date())} onNew={openNew} />

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="ss-rise lg:col-span-8 xl:col-span-9" style={{ animationDelay: "60ms" }}>
              {view === "month" ? (
                <MonthView sessions={sessions} cursor={cursor} today={today}
                  onPick={(d) => { setCursor(d); setView("day"); }} />
              ) : (
                <TimeGrid sessions={sessions} days={days} cursor={cursor} today={today} range={range}
                  onPick={setCursor} onSlot={openSlot} />
              )}
            </div>

            <aside className="ss-rise space-y-5 lg:col-span-4 xl:col-span-3" style={{ animationDelay: "120ms" }}>
              <UpcomingCard list={upcoming} now={now} />
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
    <header className="ss-rise mb-6 flex flex-wrap items-end justify-between gap-4 px-1">
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="ss-serif text-[30px] font-bold leading-none tracking-tight sm:text-[40px]">{title}</h1>
        <div className="flex items-center gap-1 rounded-full border border-[#B9CCC1] bg-white p-1">
          <button type="button" aria-label="Previous" onClick={onPrev}
            className={`rounded-full p-1.5 text-[#10281E] transition hover:bg-[#E9F1EC] ${FOCUS}`}>
            <ChevronLeft size={18} />
          </button>
          <button type="button" onClick={onToday}
            className={`rounded-full px-3 py-1 text-xs font-bold text-[#10281E] transition hover:bg-[#E9F1EC] ${FOCUS}`}>
            Today
          </button>
          <button type="button" aria-label="Next" onClick={onNext}
            className={`rounded-full p-1.5 text-[#10281E] transition hover:bg-[#E9F1EC] ${FOCUS}`}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-full border border-[#B9CCC1] bg-white p-1 text-xs font-bold">
          {views.map((v) => (
            <button key={v.key} type="button" onClick={() => onView(v.key)} aria-pressed={view === v.key}
              className={`rounded-full px-4 py-1.5 transition ${FOCUS} ${
                view === v.key ? "bg-[#176247] text-white" : "text-[#3F5148] hover:bg-[#E9F1EC]"
              }`}>
              {v.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={onNew}
          className={`inline-flex h-10 items-center gap-2 rounded-full bg-[#176247] px-5 text-sm font-bold text-white transition hover:bg-[#124F3A] active:scale-95 ${FOCUS}`}>
          <Plus size={18} strokeWidth={2.5} />
          New session
        </button>
      </div>
    </header>
  );
}

/* ================= TIME GRID ================= */
function TimeGrid({ sessions, days, cursor, today, range, onPick, onSlot }) {
  const cols = `72px repeat(${days.length}, minmax(0, 1fr))`;
  const minWidth = days.length === 1 ? 0 : 860;
  const hours = Array.from({ length: range.end - range.start + 1 }, (_, i) => range.start + i);

  return (
    <div className="overflow-hidden rounded-3xl border border-[#C6D6CD] bg-white">
      <div className="overflow-x-auto">
        <div style={{ minWidth }}>
          <div className="grid border-b border-[#D2E0D8] bg-white text-center" style={{ gridTemplateColumns: cols }}>
            <div className="flex items-center justify-center border-r border-[#E3ECE6] p-3 text-[#62766C]">
              <Clock size={18} />
            </div>
            {days.map((d, i) => {
              const active = sameDay(d, cursor);
              const isToday = sameDay(d, today);
              const count = sessionsOn(sessions, d).length;
              return (
                <button key={toKey(d)} type="button" onClick={() => onPick(d)}
                  className={`relative px-2 py-3.5 transition-colors ${FOCUS} ${
                    i < days.length - 1 ? "border-r border-[#E3ECE6]" : ""
                  } ${active ? "bg-[#EEF5F0]" : "hover:bg-[#F6FAF7]"}`}>
                  <div className={`text-xs font-bold ${active ? "text-[#176247]" : "text-[#455A50]"}`}>{dayName(d)}</div>
                  <div className="mt-1 flex items-center justify-center">
                    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-extrabold ${
                      isToday ? "bg-[#176247] text-white" : active ? "text-[#176247]" : "text-[#10281E]"
                    }`}>
                      {d.getDate()}
                    </span>
                  </div>
                  <div className="mt-1 h-4 text-[11px] font-bold text-[#176247]">
                    {count > 0 ? `${count} session${count > 1 ? "s" : ""}` : ""}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="grid" style={{ gridTemplateColumns: cols }}>
            <div className="select-none border-r border-[#E3ECE6]">
              {hours.map((h, i) => (
                <div key={h} style={{ height: ROW_H }}
                  className={`flex items-start justify-end pr-3 pt-2.5 text-xs font-bold text-[#62766C] ${
                    i < hours.length - 1 ? "border-b border-[#EEF3F0]" : ""
                  }`}>
                  {hourLabel(h)}
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
    <div className={`relative ${last ? "" : "border-r border-[#E3ECE6]"} ${active ? "bg-[#F6FAF7]" : ""}`}>
      {hours.map((h, i) => (
        <div key={h} style={{ height: ROW_H }} onClick={() => onSlot(date, h)} title={`Add session at ${hourLabel(h)}`}
          className={`group/slot cursor-pointer transition-colors hover:bg-[#EEF5F0] ${
            i < hours.length - 1 ? "border-b border-[#EEF3F0]" : ""
          }`}>
          <div className="flex h-full items-center justify-center opacity-0 transition-opacity group-hover/slot:opacity-100">
            <Plus size={16} className="text-[#1F7A5A]" />
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
            className={`absolute z-10 flex cursor-pointer flex-col justify-center gap-0.5 overflow-hidden rounded-xl border-l-4 px-2.5 py-1.5 transition hover:z-20 hover:brightness-95 ${style.bg} ${style.border} ${done ? "opacity-60" : ""}`}>
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
    <div className="overflow-hidden rounded-3xl border border-[#C6D6CD] bg-white">
      <div className="grid grid-cols-7 border-b border-[#D2E0D8] text-center text-xs font-bold text-[#455A50]">
        {heads.map((h) => <div key={h} className="py-3.5">{h}</div>)}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((d, i) => {
          const list = sessionsOn(sessions, d);
          const inMonth = d.getMonth() === cursor.getMonth();
          const isToday = sameDay(d, today);
          return (
            <button key={toKey(d)} type="button" onClick={() => onPick(d)}
              className={`min-h-[110px] p-2 text-left align-top transition-colors hover:bg-[#F6FAF7] ${FOCUS} ${
                i % 7 !== 6 ? "border-r border-[#E3ECE6]" : ""
              } ${i < 35 ? "border-b border-[#E3ECE6]" : ""} ${inMonth ? "bg-white" : "bg-[#F6FAF7]"}`}>
              <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold ${
                isToday ? "bg-[#176247] text-white" : inMonth ? "text-[#10281E]" : "text-[#8FA098]"
              }`}>
                {d.getDate()}
              </span>
              <div className="mt-1.5 space-y-1">
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
                {list.length > 2 && <div className="px-1 text-[11px] font-bold text-[#455A50]">+{list.length - 2} more</div>}
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
  "w-full rounded-xl border border-[#B9CCC1] bg-white px-3.5 py-2.5 text-base text-[#10281E] outline-none transition focus:border-[#1F7A5A] focus:ring-4 focus:ring-[#1F7A5A]/10 sm:text-sm";
const labelCls = "mb-1.5 block text-sm font-bold text-[#3F5148]";

function NewSessionModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "", type: SESSION_TYPES[0], date: initial.date, start: initial.start, duration: 60, tone: "green",
  });
  const [error, setError] = useState("");
  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError("");
  };

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1F17]/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label="New session"
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between px-6 pb-2 pt-5">
          <h2 className="text-lg font-extrabold tracking-tight">New session</h2>
          <button type="button" aria-label="Close" onClick={onClose}
            className={`rounded-full p-2 text-[#455A50] hover:bg-[#E9F1EC] ${FOCUS}`}>
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 px-6 py-4">
          <div>
            <label className={labelCls} htmlFor="ns-name">Patient name</label>
            <input id="ns-name" autoFocus className={inputCls} value={form.name} placeholder="e.g. Emma Wilson"
              onChange={(e) => set("name", e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
          </div>

          <div>
            <label className={labelCls} htmlFor="ns-type">Session type</label>
            <select id="ns-type" className={inputCls} value={form.type} onChange={(e) => set("type", e.target.value)}>
              {SESSION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls} htmlFor="ns-date">Date</label>
              <input id="ns-date" type="date" className={inputCls} value={form.date} onChange={(e) => set("date", e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="ns-start">Start time</label>
              <input id="ns-start" type="time" step={900} className={inputCls} value={form.start} onChange={(e) => set("start", e.target.value)} />
            </div>
          </div>

          <div>
            <label className={labelCls} htmlFor="ns-duration">Duration</label>
            <select id="ns-duration" className={inputCls} value={form.duration} onChange={(e) => set("duration", Number(e.target.value))}>
              {DURATIONS.map((m) => <option key={m} value={m}>{m} minutes</option>)}
            </select>
            {endPreview && <p className="mt-1.5 text-xs font-semibold text-[#455A50]">{endPreview}</p>}
          </div>

          <div>
            <span className={labelCls}>Colour</span>
            <div className="flex gap-2.5">
              {Object.keys(TONES).map((t) => (
                <button key={t} type="button" aria-label={t} aria-pressed={form.tone === t} onClick={() => set("tone", t)}
                  className={`h-8 w-8 rounded-full ${TONES[t].dot} transition ${
                    form.tone === t ? "ring-2 ring-[#10281E] ring-offset-2" : "opacity-70 hover:opacity-100"
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

        <div className="flex justify-end gap-2 px-6 pb-5 pt-2">
          <button type="button" onClick={onClose}
            className={`rounded-full border border-[#B9CCC1] px-5 py-2.5 text-sm font-bold text-[#10281E] hover:bg-[#E9F1EC] ${FOCUS}`}>
            Cancel
          </button>
          <button type="button" onClick={submit}
            className={`rounded-full bg-[#176247] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#124F3A] active:scale-95 ${FOCUS}`}>
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
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C8E1D2] text-xs font-extrabold text-[#176247]">
      {initials}
    </div>
  );
}

function UpcomingCard({ list, now }) {
  return (
    <div className="rounded-3xl border border-[#C6D6CD] bg-white p-5">
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <CalendarDays size={18} className="text-[#1F7A5A]" />
          <h2 className="text-base font-extrabold tracking-tight">Upcoming sessions</h2>
        </div>
        <button type="button" className={`rounded text-xs font-bold text-[#176247] hover:underline ${FOCUS}`}>View all</button>
      </div>

      <div className="divide-y divide-[#E3ECE6]">
        {list.length === 0 && (
          <p className="py-6 text-center text-sm font-medium text-[#455A50]">No upcoming sessions. Add one with “New session”.</p>
        )}
        {list.map((s) => {
          const day = formatDay(s.ts, now);
          const hot = day === "Today" || day === "Tomorrow";
          return (
            <div key={s.id} className="flex items-center justify-between gap-2 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar name={s.name} />
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-extrabold">{s.name}</h3>
                  <p className="truncate text-xs font-medium text-[#455A50]">{s.type}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <div className="text-right">
                  <div className="text-xs font-extrabold">{fmtTime(toMin(s.start))}</div>
                  <div className={`text-[11px] font-bold ${hot ? "text-[#176247]" : "text-[#62766C]"}`}>{day}</div>
                </div>
                <button type="button" aria-label={`Options for ${s.name}`}
                  className={`rounded-full p-1.5 text-[#455A50] hover:bg-[#E9F1EC] ${FOCUS}`}>
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TipCard() {
  return (
    <div className="flex items-start gap-3 rounded-3xl bg-[#CBE3D4] p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#176247]">
        <CalendarCheck size={19} />
      </div>
      <div>
        <h4 className="text-sm font-extrabold text-[#0F3D2C]">Stay organized</h4>
        <p className="mt-1 text-[13px] font-medium leading-relaxed text-[#2F5645]">
          Schedule regular sessions to give your patients steady support.
        </p>
      </div>
    </div>
  );
}