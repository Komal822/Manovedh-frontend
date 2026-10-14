import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CalendarDays,
  CalendarCheck,
  MoreVertical,
  Clock,
  X,
} from "lucide-react";

import Sidebar from "./Sidebar";

/* ============================================================
   CONFIG
============================================================ */

const TODAY = new Date(2026, 4, 19); // 19 May 2026
const START_HOUR = 8; // 8:00 AM
const END_HOUR = 18; // 6:00 PM (last row)
const ROW_H = 76; // Height per hour slot

const HOURS = Array.from(
  { length: END_HOUR - START_HOUR + 1 },
  (_, i) => START_HOUR + i
);

const SESSION_TYPES = [
  "Individual Therapy",
  "Follow-up Session",
  "Therapy Session",
  "Counselling",
  "Couple Therapy",
];

const DURATIONS = [30, 45, 60, 90, 120];

/* ============================================================
   DATA & COLOR STYLES
============================================================ */

const INITIAL_SESSIONS = [
  { id: 1, name: "Emma Wilson", type: "Follow-up Session", date: "2026-05-19", start: "11:30", duration: 60, tone: "blue", avatar: "" },
  { id: 2, name: "John Smith", type: "Individual Therapy", date: "2026-05-20", start: "10:00", duration: 60, tone: "blue", avatar: "" },
  { id: 3, name: "Olivia Martinez", type: "Individual Therapy", date: "2026-05-20", start: "16:00", duration: 60, tone: "green", avatar: "" },
  { id: 4, name: "David Brown", type: "Therapy Session", date: "2026-05-22", start: "09:00", duration: 60, tone: "amber", avatar: "" },
  { id: 5, name: "Sophia Johnson", type: "Counselling", date: "2026-05-22", start: "13:00", duration: 60, tone: "purple", avatar: "" },
  { id: 6, name: "Michael Davis", type: "Therapy Session", date: "2026-05-23", start: "14:30", duration: 60, tone: "blue", avatar: "" },
];

const TONES = {
  blue: {
    bg: "bg-sky-100/90 hover:bg-sky-100",
    border: "border-sky-500",
    text: "text-sky-950",
    subtext: "text-sky-700",
    dot: "bg-sky-500",
  },
  amber: {
    bg: "bg-amber-100/90 hover:bg-amber-100",
    border: "border-amber-500",
    text: "text-amber-950",
    subtext: "text-amber-700",
    dot: "bg-amber-500",
  },
  purple: {
    bg: "bg-purple-100/90 hover:bg-purple-100",
    border: "border-purple-500",
    text: "text-purple-950",
    subtext: "text-purple-700",
    dot: "bg-purple-500",
  },
  green: {
    bg: "bg-emerald-100/90 hover:bg-emerald-100",
    border: "border-emerald-500",
    text: "text-emerald-950",
    subtext: "text-emerald-700",
    dot: "bg-emerald-500",
  },
};

/* ============================================================
   DATE HELPERS
============================================================ */

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
const dayMonth = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
const monthTitle = (d) => d.toLocaleDateString("en-US", { month: "long", year: "numeric" });

const toMin = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const fmtTime = (min) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const ap = h >= 12 ? "PM" : "AM";
  return `${h % 12 === 0 ? 12 : h % 12}:${pad(m)} ${ap}`;
};
const fmtRange = (startMin, duration) =>
  `${fmtTime(startMin)} – ${fmtTime(startMin + duration)}`;
const hourLabel = (h) => `${h % 12 === 0 ? 12 : h % 12}:00 ${h >= 12 ? "PM" : "AM"}`;

const sessionsOn = (sessions, d) =>
  sessions
    .filter((s) => s.date === toKey(d))
    .sort((a, b) => toMin(a.start) - toMin(b.start));

// Same velela 2+ sessions asatil tar side-by-side dakhvto (overlap hot nahi)
function layoutSessions(list) {
  const items = list.map((s) => ({
    s,
    start: toMin(s.start),
    end: toMin(s.start) + s.duration,
  }));
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

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function Sessions({
  onLogout,
  onNavigate,
  sidebarCollapsed,
  onToggleSidebar,
}) {
  const sidebarWidth = sidebarCollapsed ? 76 : 268;

  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [view, setView] = useState("week"); // day | week | month
  const [cursor, setCursor] = useState(addDays(TODAY, 1));
  const [modal, setModal] = useState(null); // null | { date: "YYYY-MM-DD", start: "HH:MM" }

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

  const upcoming = useMemo(
    () =>
      sessions
        .filter((s) => s.date >= toKey(TODAY))
        .sort((a, b) => a.date.localeCompare(b.date) || toMin(a.start) - toMin(b.start)),
    [sessions]
  );

  // "New Session" button: current selected date + 10:00 AM default
  const openNew = () => setModal({ date: toKey(cursor), start: "10:00" });

  // Empty slot var click kela tar tya date + hour prefill hoto
  const openSlot = (date, hour) =>
    setModal({ date: toKey(date), start: `${pad(hour)}:00` });

  const addSession = (data) => {
    setSessions((prev) => [...prev, { id: Date.now(), avatar: "", ...data }]);
    setCursor(fromKey(data.date)); // navya session chya date var jaato
    setModal(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans antialiased">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={onToggleSidebar}
        activePage="Sessions"
        onNavigate={onNavigate}
        onLogout={onLogout}
        partnerName="Prem Zumble"
      />

      <main
        className="min-h-screen transition-all duration-300 ease-in-out"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-8">
          {/* Header & Controls */}
          <Toolbar
            view={view}
            onView={setView}
            title={monthTitle(cursor)}
            onPrev={() => shift(-1)}
            onNext={() => shift(1)}
            onToday={() => setCursor(TODAY)}
            onNew={openNew}
          />

          {/* Main Grid Section */}
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8 xl:col-span-9">
              {view === "month" ? (
                <MonthView
                  sessions={sessions}
                  cursor={cursor}
                  onPick={(d) => {
                    setCursor(d);
                    setView("day");
                  }}
                />
              ) : (
                <TimeGrid
                  sessions={sessions}
                  days={days}
                  cursor={cursor}
                  onPick={setCursor}
                  onSlot={openSlot}
                />
              )}
            </div>

            {/* Right Sidebar Info Cards */}
            <aside className="space-y-5 lg:col-span-4 xl:col-span-3">
              <UpcomingCard list={upcoming} />
              <TipCard />
            </aside>
          </div>
        </div>
      </main>

      {modal && (
        <NewSessionModal
          initial={modal}
          onClose={() => setModal(null)}
          onSave={addSession}
        />
      )}
    </div>
  );
}

/* ============================================================
   TOOLBAR
============================================================ */

function Toolbar({ view, onView, title, onPrev, onNext, onToday, onNew }) {
  const views = [
    { key: "day", label: "Day" },
    { key: "week", label: "Week" },
    { key: "month", label: "Month" },
  ];

  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-lg font-bold text-slate-900 sm:text-xl">{title}</h1>

        <div className="flex items-center gap-1 rounded-lg border border-slate-300 bg-slate-50 p-1">
          <button
            type="button"
            aria-label="Previous"
            onClick={onPrev}
            className="rounded-md p-1.5 text-slate-700 transition hover:bg-white hover:text-slate-900 hover:shadow-sm"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={onToday}
            className="rounded-md px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-white hover:shadow-sm"
          >
            Today
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={onNext}
            className="rounded-md p-1.5 text-slate-700 transition hover:bg-white hover:text-slate-900 hover:shadow-sm"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-slate-300 bg-slate-50 p-1 text-xs font-medium">
          {views.map((v) => (
            <button
              key={v.key}
              type="button"
              onClick={() => onView(v.key)}
              className={`rounded-md px-3.5 py-1.5 transition-all ${
                view === v.key
                  ? "bg-[#136060] font-semibold text-white shadow-sm"
                  : "text-slate-700 hover:text-slate-900"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onNew}
          className="inline-flex items-center gap-2 rounded-lg bg-[#136060] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0e4848] active:scale-[0.98] sm:text-sm"
        >
          <Plus size={18} />
          New Session
        </button>
      </div>
    </header>
  );
}

/* ============================================================
   TIME GRID (Day + Week View)
============================================================ */

function TimeGrid({ sessions, days, cursor, onPick, onSlot }) {
  const cols = `75px repeat(${days.length}, minmax(0, 1fr))`;
  const minWidth = days.length === 1 ? 0 : 860;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <div style={{ minWidth }}>
          {/* Header Days */}
          <div
            className="grid border-b border-slate-200 bg-slate-50 text-center text-xs"
            style={{ gridTemplateColumns: cols }}
          >
            <div className="flex items-center justify-center border-r border-slate-200 p-3 text-slate-500">
              <Clock size={18} />
            </div>
            {days.map((d, i) => {
              const active = sameDay(d, cursor);
              const isToday = sameDay(d, TODAY);
              const count = sessionsOn(sessions, d).length;
              return (
                <button
                  key={toKey(d)}
                  type="button"
                  onClick={() => onPick(d)}
                  className={`relative px-2 py-3 transition-colors ${
                    i < days.length - 1 ? "border-r border-slate-200" : ""
                  } ${active ? "bg-teal-50" : "hover:bg-slate-100"}`}
                >
                  <div
                    className={`text-xs uppercase tracking-wider ${
                      active ? "font-bold text-[#136060]" : "font-semibold text-slate-600"
                    }`}
                  >
                    {dayName(d)}
                  </div>
                  <div className="mt-1 flex items-center justify-center">
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                        isToday
                          ? "bg-[#136060] text-white shadow-sm"
                          : active
                          ? "text-[#136060]"
                          : "text-slate-800"
                      }`}
                    >
                      {d.getDate()}
                    </span>
                  </div>
                  <div className="mt-1 h-3 text-[10px] font-semibold text-[#136060]">
                    {count > 0 ? `${count} session${count > 1 ? "s" : ""}` : ""}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Time Slots Grid */}
          <div className="grid" style={{ gridTemplateColumns: cols }}>
            {/* Time Column */}
            <div className="select-none border-r border-slate-200 bg-slate-50">
              {HOURS.map((h, i) => (
                <div
                  key={h}
                  style={{ height: ROW_H }}
                  className={`flex items-start justify-end pr-3 pt-2.5 text-xs font-bold text-slate-600 ${
                    i < HOURS.length - 1 ? "border-b border-slate-100" : ""
                  }`}
                >
                  {hourLabel(h)}
                </div>
              ))}
            </div>

            {/* Day Columns */}
            {days.map((d, i) => (
              <DayColumn
                key={toKey(d)}
                sessions={sessions}
                date={d}
                active={sameDay(d, cursor)}
                last={i === days.length - 1}
                onSlot={onSlot}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DayColumn({ sessions, date, active, last, onSlot }) {
  const list = layoutSessions(sessionsOn(sessions, date));

  return (
    <div
      className={`relative ${last ? "" : "border-r border-slate-200"} ${
        active ? "bg-teal-50/20" : ""
      }`}
    >
      {HOURS.map((h, i) => (
        <div
          key={h}
          style={{ height: ROW_H }}
          onClick={() => onSlot(date, h)}
          title={`Add session at ${hourLabel(h)}`}
          className={`group/slot cursor-pointer transition-colors hover:bg-teal-50 ${
            i < HOURS.length - 1 ? "border-b border-slate-100" : ""
          }`}
        >
          <div className="flex h-full items-center justify-center opacity-0 transition-opacity group-hover/slot:opacity-100">
            <Plus size={16} className="text-[#136060]/60" />
          </div>
        </div>
      ))}

      {list.map(({ s, start, col, cols }) => {
        const top = ((start - START_HOUR * 60) / 60) * ROW_H + 2;
        const height = (s.duration / 60) * ROW_H - 4;
        const style = TONES[s.tone] || TONES.blue;

        return (
          <div
            key={s.id}
            title={`${s.name} • ${s.type} • ${fmtRange(start, s.duration)}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              top,
              height,
              left: `calc(${(col / cols) * 100}% + 4px)`,
              width: `calc(${100 / cols}% - 8px)`,
            }}
            className={`absolute z-10 flex cursor-pointer flex-col justify-center gap-0.5 overflow-hidden rounded-lg border-l-4 px-2.5 py-1.5 shadow-md transition-all duration-200 hover:z-20 hover:shadow-lg ${style.bg} ${style.border}`}
          >
            <div className={`truncate text-[13px] font-bold leading-tight ${style.text}`}>
              {s.name}
            </div>
            <div className={`flex items-center gap-1 text-[11px] font-semibold ${style.subtext}`}>
              <Clock size={11} className="flex-shrink-0" />
              <span className="truncate">{fmtRange(start, s.duration)}</span>
            </div>
            <div className={`truncate text-[11px] font-medium ${style.subtext}`}>
              {s.type}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   MONTH VIEW
============================================================ */

function MonthView({ sessions, cursor, onPick }) {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const gridStart = mondayOf(first);
  const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  const heads = cells.slice(0, 7).map(dayName);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-xs font-bold uppercase tracking-wider text-slate-600">
        {heads.map((h) => (
          <div key={h} className="py-3">
            {h}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((d, i) => {
          const list = sessionsOn(sessions, d);
          const inMonth = d.getMonth() === cursor.getMonth();
          const isToday = sameDay(d, TODAY);

          return (
            <button
              key={toKey(d)}
              type="button"
              onClick={() => onPick(d)}
              className={`min-h-[120px] p-2 text-left align-top transition-colors hover:bg-slate-100 ${
                i % 7 !== 6 ? "border-r border-slate-100" : ""
              } ${i < 35 ? "border-b border-slate-100" : ""} ${
                inMonth ? "bg-white" : "bg-slate-50/70"
              }`}
            >
              <span
                className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  isToday
                    ? "bg-[#136060] text-white shadow-sm"
                    : inMonth
                    ? "text-slate-800"
                    : "text-slate-400"
                }`}
              >
                {d.getDate()}
              </span>

              <div className="mt-1.5 space-y-1">
                {list.slice(0, 2).map((s) => {
                  const style = TONES[s.tone] || TONES.blue;
                  return (
                    <div
                      key={s.id}
                      title={`${s.name} • ${s.type}`}
                      className={`flex items-center gap-1 truncate rounded border-l-4 px-1.5 py-1 text-[11px] font-semibold shadow-sm ${style.bg} ${style.border} ${style.text}`}
                    >
                      <span className={`flex-shrink-0 font-bold ${style.subtext}`}>
                        {fmtTime(toMin(s.start)).replace(":00", "")}
                      </span>
                      <span className="truncate">{s.name}</span>
                    </div>
                  );
                })}
                {list.length > 2 && (
                  <div className="px-1 text-[11px] font-bold text-slate-500">
                    +{list.length - 2} more
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   NEW SESSION MODAL
============================================================ */

const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#136060] focus:ring-2 focus:ring-[#136060]/20";
const labelCls = "mb-1 block text-xs font-semibold text-slate-700";

function NewSessionModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    type: SESSION_TYPES[0],
    date: initial.date,
    start: initial.start,
    duration: 60,
    tone: "blue",
  });
  const [error, setError] = useState("");

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  // Esc dabla tar modal band
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = () => {
    const name = form.name.trim();
    if (!name) return setError("Patient cha naav taka.");
    if (!form.date) return setError("Date nivda.");
    if (!form.start) return setError("Start time nivda.");

    const startMin = toMin(form.start);
    const endMin = startMin + Number(form.duration);
    if (startMin < START_HOUR * 60 || endMin > (END_HOUR + 1) * 60) {
      return setError(
        `Session ${hourLabel(START_HOUR)} te ${hourLabel(END_HOUR + 1)} chya madhe asava.`
      );
    }

    onSave({
      name,
      type: form.type,
      date: form.date,
      start: form.start,
      duration: Number(form.duration),
      tone: form.tone,
    });
  };

  const endPreview =
    form.start && toMin(form.start) >= 0
      ? fmtRange(toMin(form.start), Number(form.duration))
      : "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="New session"
        className="w-full max-w-md rounded-xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-bold text-slate-900">New session</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div>
            <label className={labelCls} htmlFor="ns-name">Patient name</label>
            <input
              id="ns-name"
              autoFocus
              className={inputCls}
              value={form.name}
              placeholder="e.g. Emma Wilson"
              onChange={(e) => set("name", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </div>

          <div>
            <label className={labelCls} htmlFor="ns-type">Session type</label>
            <select
              id="ns-type"
              className={inputCls}
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
            >
              {SESSION_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls} htmlFor="ns-date">Date</label>
              <input
                id="ns-date"
                type="date"
                className={inputCls}
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="ns-start">Start time</label>
              <input
                id="ns-start"
                type="time"
                step={900}
                className={inputCls}
                value={form.start}
                onChange={(e) => set("start", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={labelCls} htmlFor="ns-duration">Duration</label>
            <select
              id="ns-duration"
              className={inputCls}
              value={form.duration}
              onChange={(e) => set("duration", Number(e.target.value))}
            >
              {DURATIONS.map((m) => (
                <option key={m} value={m}>{m} minutes</option>
              ))}
            </select>
            {endPreview && (
              <p className="mt-1.5 text-xs text-slate-500">{endPreview}</p>
            )}
          </div>

          <div>
            <span className={labelCls}>Colour</span>
            <div className="flex gap-2">
              {Object.keys(TONES).map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-label={t}
                  aria-pressed={form.tone === t}
                  onClick={() => set("tone", t)}
                  className={`h-7 w-7 rounded-full ${TONES[t].dot} transition ${
                    form.tone === t
                      ? "ring-2 ring-slate-800 ring-offset-2"
                      : "opacity-70 hover:opacity-100"
                  }`}
                />
              ))}
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            className="rounded-lg bg-[#136060] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0e4848] active:scale-[0.98] sm:text-sm"
          >
            Save session
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SIDE PANEL
============================================================ */

function Avatar({ name }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-[#136060] ring-2 ring-teal-200">
      {initials}
    </div>
  );
}

function whenLabel(dateKey) {
  const date = fromKey(dateKey);
  if (sameDay(date, TODAY)) return { text: "Today", hot: true };
  if (sameDay(date, addDays(TODAY, 1))) return { text: "Tomorrow", hot: true };
  return { text: dayMonth(date), hot: false };
}

function UpcomingCard({ list }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <CalendarDays size={18} className="text-[#136060]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Upcoming Sessions
          </h2>
        </div>
        <button type="button" className="text-xs font-bold text-[#136060] hover:underline">
          View All
        </button>
      </div>

      <div className="mt-3 space-y-2.5">
        {list.length === 0 && (
          <p className="py-6 text-center text-xs text-slate-500">No upcoming sessions</p>
        )}

        {list.map((s) => {
          const w = whenLabel(s.date);

          return (
            <div
              key={s.id}
              className="group relative flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2.5 transition hover:border-slate-300 hover:bg-white hover:shadow-md"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Avatar name={s.name} />
                <div className="min-w-0">
                  <h3 className="truncate text-xs font-bold text-slate-900 group-hover:text-[#136060]">
                    {s.name}
                  </h3>
                  <p className="truncate text-[11px] font-medium text-slate-600">{s.type}</p>
                </div>
              </div>

              <div className="flex flex-shrink-0 items-center gap-2">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800">
                    {fmtTime(toMin(s.start))}
                  </div>
                  <div
                    className={`text-[10px] font-bold ${
                      w.hot ? "text-[#136060]" : "text-slate-500"
                    }`}
                  >
                    {w.text}
                  </div>
                </div>
                <button
                  type="button"
                  aria-label={`Options for ${s.name}`}
                  className="rounded-lg p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-800"
                >
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
    <div className="rounded-xl border-2 border-teal-200 bg-teal-50 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-white p-2 text-[#136060] shadow-sm">
          <CalendarCheck size={20} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-[#136060]">Stay organized!</h4>
          <p className="mt-0.5 text-[11px] leading-relaxed text-slate-700">
            Schedule regular sessions and provide better support to your patients.
          </p>
        </div>
      </div>
    </div>
  );
}