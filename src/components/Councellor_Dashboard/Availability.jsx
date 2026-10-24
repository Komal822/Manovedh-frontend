import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, CalendarPlus, CalendarDays, CalendarCheck, Clock, Plus, Info,
  ChevronLeft, ChevronRight, MessageSquare, Trash2, CheckCircle2, Menu, Hourglass,
  Leaf,
} from "lucide-react";
import Sidebar from "./Sidebar";
import { useSessions, useNow, sessionEnd, formatSlot } from "./sessionStore";

/* ============================================================
   CONSTANTS
============================================================ */

const STORAGE_KEY = "manovedh_availability_slots";
const LOCALE = "en-GB";

const DAY_START_MIN = 6 * 60;
const DAY_END_MIN = 22 * 60;
const STEP_MIN = 30;
const DEFAULT_LENGTH_MIN = 60;

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A8C82] focus-visible:ring-offset-2 focus-visible:ring-offset-[#ECF5F4]";
/* text-base on mobile stops iOS from zooming into inputs */
const FIELD =
  "block w-full min-w-0 cursor-pointer appearance-none rounded-xl border border-[#CFE6E3] bg-[#F6FBFA] px-3 py-2 text-base font-medium text-[#122A2E] outline-none transition hover:border-[#9FD0CB] focus:border-[#2A8C82] focus:ring-4 focus:ring-[#2A8C82]/15 sm:py-2.5 sm:text-sm";
const LABEL = "mb-1 block text-[10px] font-bold uppercase tracking-wide text-[#5B7A7E] sm:mb-1.5 sm:text-[11px]";
const BTN_PRIMARY = `inline-flex items-center justify-center gap-2 rounded-xl bg-[#184D43] px-4 py-2.5 text-[13px] font-bold text-white shadow-md shadow-[#184D43]/25 transition hover:-translate-y-0.5 hover:bg-[#123A32] hover:shadow-lg active:translate-y-0 active:scale-[0.99] sm:px-5 sm:text-sm ${FOCUS}`;
const BTN_GHOST = `inline-flex items-center gap-2 rounded-xl border border-[#CFE6E3] bg-white px-3 py-2 text-[11px] font-bold text-[#122A2E] transition hover:bg-[#F0F9F7] active:scale-95 sm:px-4 sm:py-2.5 sm:text-xs ${FOCUS}`;
const ICON_BTN = `flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#CFE6E3] bg-white text-[#122A2E] sm:h-9 sm:w-9 transition hover:border-[#2A8C82] hover:bg-[#F0F9F7] hover:text-[#2A8C82] ${FOCUS}`;
const MUTED = "text-[#5B7A7E]";

/* One calm green tone used for every day */
const DAY_TONE = {
  tile: "bg-white border-[#BFDCD7] text-[#14665D]",
  solid: "bg-[#1E7A70]",
  bar: "border-l-[#2A8C82]",
  row: "bg-white",
  chip: "bg-[#E3F4F1] text-[#1E7A70]",
  hover: "hover:border-[#2A8C82]",
};
const toneOf = () => DAY_TONE;

const SCROLLBAR_CSS = `
  html, .av-root, .av-root * { scrollbar-width: thin; scrollbar-color: #2A8C82 #E6F2F0; }
  .av-root .av-noscroll { scrollbar-width: none; }
  @supports selector(::-webkit-scrollbar) {
    html, .av-root, .av-root * { scrollbar-width: auto; scrollbar-color: auto; }
    html::-webkit-scrollbar, .av-root::-webkit-scrollbar, .av-root *::-webkit-scrollbar { width: 6px; height: 6px; }
    html::-webkit-scrollbar-track, .av-root::-webkit-scrollbar-track, .av-root *::-webkit-scrollbar-track { background: #E6F2F0; }
    html::-webkit-scrollbar-thumb, .av-root::-webkit-scrollbar-thumb, .av-root *::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #2A8C82 0%, #22B8AA 100%);
      border-radius: 999px;
    }
    html::-webkit-scrollbar-thumb:hover, .av-root::-webkit-scrollbar-thumb:hover, .av-root *::-webkit-scrollbar-thumb:hover { background: #1E9E93; }
    .av-root .av-noscroll::-webkit-scrollbar { display: none; width: 0; height: 0; }
  }
`;

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
const mondayOf = (d) => addDays(d, -((d.getDay() + 6) % 7));

const weekdayLong = (d) => d.toLocaleDateString(LOCALE, { weekday: "long" });
const weekdayShort = (d) => d.toLocaleDateString(LOCALE, { weekday: "short" });
const shortDate = (d) => d.toLocaleDateString(LOCALE, { day: "numeric", month: "short" });
const longDate = (d) => d.toLocaleDateString(LOCALE, { day: "numeric", month: "long", year: "numeric" });
const weekRangeLabel = (a, b) => {
  const sameMonth = a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  const end = b.toLocaleDateString(LOCALE, { day: "numeric", month: "short", year: "numeric" });
  const start = sameMonth
    ? String(a.getDate())
    : a.toLocaleDateString(LOCALE, { day: "numeric", month: "short" });
  return `${start} – ${end}`;
};

/* ============================================================
   TIME HELPERS
============================================================ */

function fmtTime(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h % 12 === 0 ? 12 : h % 12}:${pad(m)} ${h >= 12 ? "PM" : "AM"}`;
}

function toMin(t) {
  const [time, ap] = t.split(" ");
  let [h, m] = time.split(":").map(Number);
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

const TIME_OPTIONS = (() => {
  const list = [];
  for (let m = DAY_START_MIN; m <= DAY_END_MIN; m += STEP_MIN) list.push(fmtTime(m));
  return list;
})();
const START_OPTIONS = TIME_OPTIONS.slice(0, -1);
const END_OPTIONS = TIME_OPTIONS.slice(1);

const overlaps = (a, b) => toMin(a.start) < toMin(b.end) && toMin(b.start) < toMin(a.end);

function duration(slot) {
  const mins = toMin(slot.end) - toMin(slot.start);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h}h ${m}m`;
  return h ? `${h}h` : `${m}m`;
}

/* ============================================================
   SLOT STORAGE
============================================================ */

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

function seedSlots() {
  const monday = mondayOf(new Date());
  const plan = {
    0: [["10:00 AM", "12:00 PM"], ["4:00 PM", "6:00 PM"]],
    1: [["11:00 AM", "1:00 PM"]],
    2: [["10:00 AM", "12:00 PM"], ["3:00 PM", "5:00 PM"]],
    3: [["11:00 AM", "2:00 PM"]],
    4: [["10:00 AM", "12:00 PM"]],
    5: [["9:00 AM", "11:00 AM"]],
  };
  return Object.entries(plan).flatMap(([offset, list]) =>
    list.map(([start, end]) => ({
      id: newId(),
      date: toKey(addDays(monday, Number(offset))),
      start,
      end,
    }))
  );
}

function loadSlots() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (Array.isArray(parsed)) return parsed;
  } catch (error) {
    console.error("Unable to read availability:", error);
  }
  return seedSlots();
}

function saveSlots(slots) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slots));
  } catch (error) {
    console.error("Unable to save availability:", error);
  }
}

/* ============================================================
   HOOKS
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

/* ============================================================
   SMALL PIECES
============================================================ */

function StatPill({ value, label, tone = "forest" }) {
  const tones = {
    forest: "bg-[#E3F4F1] text-[#122A2E] ring-[#C2E0DC]",
    sage: "bg-[#E6F4F1] text-[#2A8C82] ring-[#C7E6E1]",
    moss: "bg-[#F0F9F7] text-[#2A8C82] ring-[#CFE6E3]",
  };
  return (
    <div className={`flex items-baseline gap-1 rounded-lg px-2 py-1 ring-1 sm:gap-1.5 sm:px-2.5 sm:py-1.5 ring-inset ${tones[tone]}`}>
      <span className="text-[13px] font-extrabold tabular-nums sm:text-sm">{value}</span>
      <span className="text-[10px] font-semibold opacity-80 sm:text-[11px]">{label}</span>
    </div>
  );
}

function SectionHeading({ icon: Icon, id, title, desc, action, tone = "forest" }) {
  const tones = {
    forest: "bg-[#D6EEEA] text-[#1F6F68]",
    sage: "bg-[#E3F4F1] text-[#2A8C82]",
    moss: "bg-[#E6F4F1] text-[#2A8C82]",
    eucalyptus: "bg-[#DDF0EC] text-[#2A8C82]",
    olive: "bg-[#EAF4EC] text-[#3A7A6E]",
  };
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9 sm:rounded-xl ${tones[tone]}`}>
          <Icon size={17} />
        </div>
        <div className="min-w-0">
          <h2 id={id} className="text-[14px] font-bold tracking-tight text-[#122A2E] sm:text-[15px]">{title}</h2>
          {desc && <p className={`mt-0.5 text-[11px] font-medium sm:text-xs ${MUTED}`}>{desc}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

function SummaryRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 sm:py-3">
      <dt className={`flex shrink-0 items-center gap-2 text-[12px] font-semibold sm:gap-2.5 sm:text-[13px] ${MUTED}`}>
        <Icon size={15} className="shrink-0 text-[#2A8C82]" />
        <span>{label}</span>
      </dt>
      <dd className="min-w-0 text-right text-[12px] font-bold tabular-nums text-[#122A2E] sm:text-[13px]">{value}</dd>
    </div>
  );
}

/* ============================================================
   MINI CALENDAR
============================================================ */

function MiniCalendar({ selectedKey, todayKey, byDate, onPick }) {
  const [month, setMonth] = useState(() => {
    const d = fromKey(selectedKey);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  useEffect(() => {
    const d = fromKey(selectedKey);
    setMonth(new Date(d.getFullYear(), d.getMonth(), 1));
  }, [selectedKey]);

  const cells = useMemo(() => {
    const start = mondayOf(month);
    return Array.from({ length: 42 }, (_, i) => addDays(start, i));
  }, [month]);

  const title = month.toLocaleDateString(LOCALE, { month: "long", year: "numeric" });
  const shiftMonth = (n) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));
  const isCurrentMonth =
    month.getFullYear() === new Date().getFullYear() &&
    month.getMonth() === new Date().getMonth();

  return (
    <div className="p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-[13px] font-bold tracking-tight text-[#1F6F68] sm:text-sm">{title}</h3>
          {!isCurrentMonth && (
            <button
              type="button"
              onClick={() => setMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1))}
              className="mt-0.5 text-[10px] font-bold text-[#2A8C82] hover:underline sm:text-[11px]"
            >
              Jump to today
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button type="button" aria-label="Previous month" onClick={() => shiftMonth(-1)} className={ICON_BTN}>
            <ChevronLeft size={15} />
          </button>
          <button type="button" aria-label="Next month" onClick={() => shiftMonth(1)} className={ICON_BTN}>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center">
        {cells.slice(0, 7).map((d) => (
          <span key={d.getDay()} className="pb-1 text-[9px] font-bold uppercase text-[#8AAEAC] sm:text-[10px]">
            {d.toLocaleDateString(LOCALE, { weekday: "narrow" })}
          </span>
        ))}
        {cells.map((d) => {
          const key = toKey(d);
          const inMonth = d.getMonth() === month.getMonth();
          const isPast = key < todayKey;
          const isSelected = key === selectedKey;
          const isToday = key === todayKey;
          const count = (byDate[key] || []).length;

          return (
            <button
              key={key}
              type="button"
              disabled={isPast}
              aria-pressed={isSelected}
              aria-current={isToday ? "date" : undefined}
              aria-label={`${longDate(d)}${isToday ? ", today" : ""}${count ? `, ${count} slots` : ""}`}
              onClick={() => onPick(key)}
              className={`relative flex h-9 flex-col items-center justify-center rounded-lg text-[11px] font-semibold transition sm:text-xs ${FOCUS} ${
                isToday
                  ? "bg-[#BFE8E0] font-extrabold text-black ring-2 ring-[#184D43] ring-offset-1 ring-offset-white shadow-sm"
                  : isSelected
                  ? "bg-[#A9DDD3] font-extrabold text-black ring-2 ring-[#2A8C82] shadow-md shadow-[#1F6F68]/20"
                  : "text-[#2F4A44] hover:bg-white/70"
              } ${!inMonth && !isSelected && !isToday ? "text-[#B7CDCA]" : ""} ${
                isPast ? "cursor-not-allowed opacity-40 hover:bg-transparent" : ""
              }`}
            >
              {d.getDate()}
              {count > 0 && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#184D43]" />}
            </button>
          );
        })}
      </div>

      <p className="mt-2.5 flex items-center gap-1.5 text-[10px] font-medium text-[#8AAEAC] sm:mt-3 sm:text-[11px]">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2A8C82]" />
        Dot = you already have slots that day
      </p>
    </div>
  );
}

/* ============================================================
   ADD SLOT FORM
============================================================ */

function AddSlotForm({ todayKey, now, byDate, onAdd, date, onDateChange }) {
  const [start, setStart] = useState("10:00 AM");
  const [end, setEnd] = useState("11:00 AM");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const clearFeedback = () => {
    setError("");
    setNotice("");
  };

  const handleStartChange = (value) => {
    setStart(value);
    setEnd(fmtTime(Math.min(toMin(value) + DEFAULT_LENGTH_MIN, DAY_END_MIN)));
    clearFeedback();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setNotice("");

    if (!date) return setError("Please choose a date.");
    if (date < todayKey) return setError("Pick today or a future date.");
    if (toMin(end) <= toMin(start)) return setError("End time must be after start time.");

    const current = new Date(now);
    const minutesNow = current.getHours() * 60 + current.getMinutes();
    if (date === todayKey && toMin(start) <= minutesNow) {
      return setError("This start time has already passed today.");
    }

    if ((byDate[date] || []).some((slot) => overlaps(slot, { start, end }))) {
      return setError(`This time overlaps an existing slot on ${longDate(fromKey(date))}.`);
    }

    onAdd({ id: newId(), date, start, end });
    setError("");
    setNotice(`Added for ${weekdayShort(fromKey(date))}, ${shortDate(fromKey(date))} · ${start} – ${end}`);
  };

  const previewDate = date ? fromKey(date) : null;
  const validRange = previewDate && toMin(end) > toMin(start);

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-2.5 sm:space-y-3">
      <div>
        <label htmlFor="av-date" className={LABEL}>Date</label>
        <input
          id="av-date"
          type="date"
          value={date}
          min={todayKey}
          onChange={(e) => { onDateChange(e.target.value); clearFeedback(); }}
          className={FIELD}
        />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="min-w-0">
          <label htmlFor="av-start" className={LABEL}>Start</label>
          <select id="av-start" value={start} onChange={(e) => handleStartChange(e.target.value)} className={FIELD}>
            {START_OPTIONS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="min-w-0">
          <label htmlFor="av-end" className={LABEL}>End</label>
          <select
            id="av-end"
            value={end}
            onChange={(e) => { setEnd(e.target.value); clearFeedback(); }}
            className={FIELD}
          >
            {END_OPTIONS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {validRange && (
        <div className="rounded-lg bg-gradient-to-br from-[#E6F4F1] to-[#F0F9F7] px-3 py-1.5 ring-1 ring-inset ring-[#C7E6E1] sm:py-2">
          <div className="flex items-center justify-between gap-2 text-[10px] font-bold text-[#2A8C82] sm:text-[11px]">
            <span className="tabular-nums">{start}</span>
            <span className="rounded-full bg-[#2A8C82] px-2 py-0.5 text-[9px] text-white sm:text-[10px]">
              {duration({ start, end })}
            </span>
            <span className="tabular-nums">{end}</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/80">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#2A8C82] to-[#22B8AA]"
              style={{ width: `${Math.min(100, ((toMin(end) - toMin(start)) / (DAY_END_MIN - DAY_START_MIN)) * 100)}%` }}
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        className={`${BTN_PRIMARY} w-full`}
        style={{ backgroundColor: "#184D43", color: "#FFFFFF" }}
      >
        <Plus size={15} strokeWidth={2.5} /> Add slot
      </button>

      <div className="min-h-[32px] sm:min-h-[36px]" aria-live="polite">
        {error ? (
          <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-[11px] font-semibold text-rose-700 sm:py-2 sm:text-xs">
            {error}
          </p>
        ) : notice ? (
          <p role="status" className="flex items-start gap-2 rounded-lg bg-[#E6F4F1] px-3 py-1.5 text-[11px] font-semibold text-[#122A2E] ring-1 sm:py-2 sm:text-xs ring-inset ring-[#C7E6E1]">
            <CheckCircle2 size={14} className="mt-px shrink-0" /> <span className="min-w-0">{notice}</span>
          </p>
        ) : previewDate ? (
          <p className="flex items-start gap-2 rounded-lg bg-[#F0F9F7] px-3 py-1.5 text-[10px] font-medium text-[#2A8C82] sm:py-2 sm:text-[11px]">
            <CalendarDays size={14} className="mt-px shrink-0 text-[#2A8C82]" />
            <span className="min-w-0">
              <span className="font-bold text-[#122A2E]">{weekdayLong(previewDate)}</span>
              {" · "}{longDate(previewDate)}
            </span>
          </p>
        ) : null}
      </div>
    </form>
  );
}

/* ============================================================
   SLOT ROW
============================================================ */

function SlotRow({ slot, isFresh, onRemove, tone }) {
  return (
    <div
      className={`group flex items-center justify-between gap-2 rounded-lg border border-[#CFE6E3] bg-white py-1.5 pl-2.5 pr-1 shadow-sm sm:rounded-xl transition hover:shadow-md sm:gap-3 sm:py-2.5 sm:pl-3 sm:pr-3 ${
        tone ? tone.hover : "hover:border-[#2A8C82]"
      } ${isFresh ? "ring-2 ring-[#2A8C82]/40 av-pop" : ""}`}
    >
      <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
        <span className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E3F4F1] text-[#1E7A70] min-[400px]:flex sm:h-8 sm:w-8">
          <Clock size={14} />
        </span>
        <p className="min-w-0 whitespace-nowrap text-[12px] font-bold tabular-nums text-[#122A2E] sm:text-sm">
          {slot.start}
          <span className="mx-1 font-semibold text-[#8AAEAC] sm:mx-1.5">–</span>
          {slot.end}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <span
          className={`rounded-full border border-[#BFE3DC] px-1.5 py-0.5 text-[9px] font-bold tabular-nums sm:px-2.5 sm:py-1 sm:text-[11px] ${
            tone ? tone.chip : "bg-[#E3F4F1] text-[#1E7A70]"
          }`}
        >
          {duration(slot)}
        </span>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${slot.start}–${slot.end}`}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8AAEAC] transition hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 sm:h-8 sm:w-8"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   DAY ROW (desktop week view)
============================================================ */

function DayRow({ date, isToday, isPast, list, freshId, onRemove }) {
  const active = list.length > 0;
  const tone = toneOf(date);
  const month = date.toLocaleDateString(LOCALE, { month: "short" });

  return (
    <div
      className={`flex items-stretch gap-3 rounded-2xl border border-[#D3E8E4] bg-white px-3 py-3.5 shadow-[0_10px_28px_-8px_rgba(24,77,67,0.28),0_2px_6px_rgba(24,77,67,0.08)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-8px_rgba(24,77,67,0.35),0_3px_8px_rgba(24,77,67,0.1)] sm:gap-4 sm:px-4 ${isPast ? "opacity-60" : ""}`}
    >
      <div
        className={`flex w-[96px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl border px-2 py-2.5 text-center shadow-sm ${
          isToday ? "border-[#184D43] bg-[#184D43] text-white" : tone.tile
        }`}
      >
        <span className="text-[11px] font-extrabold uppercase tracking-wide">{weekdayShort(date)}</span>
        <span className="whitespace-nowrap text-[15px] font-extrabold leading-tight tabular-nums">
          {date.getDate()} {month}
        </span>
        {isToday && (
          <span className="mt-1 rounded-full bg-white px-2 py-px text-[9px] font-bold text-[#184D43] shadow-sm">
            TODAY
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
        {active ? (
          list.map((slot) => (
            <SlotRow
              key={slot.id}
              slot={slot}
              tone={tone}
              isFresh={freshId === slot.id}
              onRemove={() => onRemove(slot)}
            />
          ))
        ) : (
          <div className="flex min-h-[42px] items-center rounded-lg border border-dashed border-[#CFE6E3] bg-white/60 px-3 text-[11px] font-medium text-[#6F8F8D]">
            No slots — free day
          </div>
        )}
      </div>

      <div className="flex w-8 shrink-0 items-start justify-end pt-0.5">
        <span
          aria-label={`${list.length} slots`}
          className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded px-1 text-[10px] font-bold ${
            active
              ? `${tone.solid} text-white shadow-sm`
              : "border border-[#CFE6E3] bg-white text-[#8AAEAC]"
          }`}
        >
          {list.length}
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   MOBILE DAY VIEW
============================================================ */

function MobileDayPicker({ weekDates, byDate, selectedKey, todayKey, onSelect, freshId, onRemove }) {
  const selectedDate = fromKey(selectedKey);
  const selectedTone = toneOf(selectedDate);
  const list = byDate[selectedKey] || [];

  return (
    <div className="lg:hidden">
      <div role="group" aria-label="Choose a day" className="av-noscroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-2.5 pt-1">
        {weekDates.map((d) => {
          const key = toKey(d);
          const selected = selectedKey === key;
          const isToday = key === todayKey;
          const count = (byDate[key] || []).length;
          const tone = toneOf(d);
          const month = d.toLocaleDateString(LOCALE, { month: "short" });
          return (
            <button
              key={key}
              type="button"
              aria-pressed={selected}
              aria-current={isToday ? "date" : undefined}
              onClick={() => onSelect(key)}
              className={`relative flex min-w-[62px] shrink-0 flex-col items-center gap-0.5 rounded-lg px-2 py-2 text-center transition-all ${FOCUS} ${
                selected
                  ? `${tone.solid} text-white shadow-md`
                  : `border ${tone.tile}`
              } ${isToday && !selected ? "ring-2 ring-[#184D43] ring-offset-1 ring-offset-white" : ""}`}
            >
              <span className="text-[10px] font-extrabold uppercase">{weekdayShort(d)}</span>
              <span className="whitespace-nowrap text-[11px] font-extrabold leading-tight tabular-nums">
                {d.getDate()} {month}
              </span>
              {isToday && (
                <span className="text-[7px] font-bold uppercase tracking-wide">Today</span>
              )}
              {count > 0 && (
                <span className={`mt-0.5 h-1 w-1 rounded-full ${selected ? "bg-white/80" : tone.solid}`} />
              )}
            </button>
          );
        })}
      </div>

      <section
        aria-label={`Slots on ${longDate(selectedDate)}`}
        className="mt-1 space-y-1.5 rounded-xl border border-[#DDF0EC] bg-white p-2.5 sm:space-y-2 sm:p-3"
      >
        <div className="flex items-center justify-between gap-2 border-b border-[#E8F2EF] pb-2.5 sm:pb-3">
          <h3 className="min-w-0 text-[13px] font-bold text-[#122A2E] sm:text-sm">
            {weekdayLong(selectedDate)}, {shortDate(selectedDate)}
          </h3>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold sm:px-2.5 sm:text-[11px] ${selectedTone.chip}`}>
            {list.length > 0 ? `${list.length} slot${list.length > 1 ? "s" : ""}` : "Free"}
          </span>
        </div>

        {list.length > 0 ? (
          list.map((slot) => (
            <SlotRow
              key={slot.id}
              slot={slot}
              tone={selectedTone}
              isFresh={freshId === slot.id}
              onRemove={() => onRemove(slot)}
            />
          ))
        ) : (
          <p className={`rounded-lg border border-dashed border-[#CFE6E3] px-4 py-5 text-center text-[11px] font-medium sm:py-6 sm:text-xs ${MUTED}`}>
            No slots on this day. Add one from the form.
          </p>
        )}
      </section>
    </div>
  );
}

/* ============================================================
   MAIN
============================================================ */

export default function Availability({
  onLogout,
  onNavigate,
  sidebarCollapsed = false,
  onToggleSidebar,
  partnerName = "Prem Zumble",
}) {
  const isDesktop = useIsDesktop();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const sessions = useSessions();
  const now = useNow();
  const todayKey = toKey(new Date(now));

  const [slots, setSlots] = useState(loadSlots);
  const [weekStart, setWeekStart] = useState(() => mondayOf(new Date()));
  const [activeKey, setActiveKey] = useState(() => toKey(new Date()));
  const [formDate, setFormDate] = useState(() => toKey(new Date()));
  const [freshId, setFreshId] = useState(null);
  const [toast, setToast] = useState(null);

  const weekRef = useRef(null);

  /* Same sidebar width as Profile Settings */
  const sidebarWidth = sidebarCollapsed ? 76 : 268;

  const go = (page) => onNavigate?.(page);
  const navigateFromDrawer = (page) => {
    setMobileNavOpen(false);
    go(page);
  };

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

  useEffect(() => saveSlots(slots), [slots]);

  useEffect(() => {
    if (!freshId) return undefined;
    const t = setTimeout(() => setFreshId(null), 2500);
    return () => clearTimeout(t);
  }, [freshId]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  const nextSession = useMemo(
    () =>
      sessions
        .filter((s) => s.status === "scheduled" && sessionEnd(s) > now)
        .sort((a, b) => a.start - b.start)[0] || null,
    [sessions, now]
  );

  const weekDates = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
  const weekKeys = useMemo(() => weekDates.map(toKey), [weekDates]);
  const isCurrentWeek = weekKeys.includes(todayKey);

  const byDate = useMemo(() => {
    const map = {};
    for (const slot of slots) (map[slot.date] ||= []).push(slot);
    Object.values(map).forEach((list) => list.sort((a, b) => toMin(a.start) - toMin(b.start)));
    return map;
  }, [slots]);

  const selectedKey = weekKeys.includes(activeKey) ? activeKey : isCurrentWeek ? todayKey : weekKeys[0];

  const weekSlots = weekKeys.flatMap((k) => byDate[k] || []);
  const totalSlots = weekSlots.length;
  const activeDays = weekKeys.filter((k) => (byDate[k] || []).length > 0).length;
  const totalHours = weekSlots.reduce((sum, s) => sum + (toMin(s.end) - toMin(s.start)), 0) / 60;
  const hoursLabel = `${Number.isInteger(totalHours) ? totalHours : totalHours.toFixed(1)}h`;

  const addSlot = (slot) => {
    setSlots((prev) => [...prev, slot]);
    setFreshId(slot.id);
    setWeekStart(mondayOf(fromKey(slot.date)));
    setActiveKey(slot.date);
    requestAnimationFrame(() => weekRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  };

  const pickDate = (key) => {
    setFormDate(key);
    setWeekStart(mondayOf(fromKey(key)));
    setActiveKey(key);
  };

  const removeSlot = (slot) => {
    setSlots((prev) => prev.filter((s) => s.id !== slot.id));
    setToast({ slot });
  };

  const undoRemove = () => {
    if (!toast) return;
    setSlots((prev) => [...prev, toast.slot]);
    setToast(null);
  };

  return (
    <div
      className="av-root min-h-[100dvh] text-[#122A2E] antialiased selection:bg-[#D6EEEA]"
      style={{
        fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
        background: "linear-gradient(135deg, #ECF5F4 0%, #E6F3F2 50%, #E4F1F0 100%)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .av-root button, .av-root select, .av-root input { font-family: inherit; }
        .av-root { overflow-x: clip; }
        .av-root button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
        .av-display { font-family: 'Fraunces', Georgia, serif; letter-spacing: -0.01em; }
        ${SCROLLBAR_CSS}
        .av-noscroll { -ms-overflow-style: none; }
        @keyframes av-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes av-rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        @keyframes av-pop { from { opacity: 0; transform: scale(.95); } to { opacity: 1; transform: scale(1); } }
        .av-backdrop { animation: av-fade .2s ease both; }
        .av-rise { animation: av-rise .4s cubic-bezier(.16,1,.3,1) both; }
        .av-pop { animation: av-pop .3s cubic-bezier(.2,.8,.2,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .av-backdrop, .av-rise, .av-pop { animation: none; }
        }
      `}</style>

      {/* SIDEBAR */}
      {isDesktop ? (
        <div className="font-sans">
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={onToggleSidebar}
            activePage="Availability"
            onNavigate={onNavigate}
            onLogout={onLogout}
            partnerName={partnerName}
          />
        </div>
      ) : (
        mobileNavOpen && (
          <>
            <div
              className="av-backdrop fixed inset-0 z-40 bg-black/45"
              onClick={() => setMobileNavOpen(false)}
              aria-hidden="true"
            />
            <div className="relative z-50 font-sans">
              <Sidebar
                collapsed={false}
                onToggle={() => setMobileNavOpen(false)}
                activePage="Availability"
                onNavigate={navigateFromDrawer}
                onLogout={onLogout}
                partnerName={partnerName}
              />
            </div>
          </>
        )
      )}

      {/* MOBILE TOP BAR */}
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-[#CFE6E3] bg-[#ECF5F4]/90 px-3 py-2.5 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#2A8C82] shadow-sm ring-1 ring-[#DEEEEE]"
        >
          <Menu size={18} />
        </button>
        <span className="text-[13px] font-semibold text-[#122A2E]">Availability</span>
      </div>

      {/* MAIN */}
      <main
        className="relative min-h-[100dvh] transition-[margin] duration-300 ease-in-out lg:ml-[var(--sb)]"
        style={{ "--sb": `${sidebarWidth}px` }}
      >
        <div className="mx-auto w-full max-w-[1440px] px-3 pb-12 pt-4 sm:px-6 sm:pt-7 lg:px-8">

          {/* HEADER */}
          <header
            className="av-rise relative mb-4 flex flex-col justify-between gap-4 overflow-hidden rounded-2xl p-4 sm:mb-6 sm:min-h-[170px] sm:p-7"
            style={{
              background: "linear-gradient(135deg, #D6EEEA 0%, #C7E6E1 50%, #DDF0EC 100%)",
            }}
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/30 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-16 right-20 h-32 w-32 rounded-full bg-[#2A8C82]/15 blur-2xl" />

            <button
              type="button"
              onClick={() => go("Profile Settings")}
              className={`group relative inline-flex items-center gap-1.5 self-start rounded text-[11px] font-bold text-[#122A2E] sm:text-xs transition hover:text-[#0F2B2A] ${FOCUS}`}
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
              Back to settings
            </button>

            <div className="relative flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
              <div className="min-w-0">
                <h1 className="av-display text-[20px] font-semibold leading-tight text-[#122A2E] sm:text-[34px]">
                  Availability &amp; working hours
                </h1>
                <p className="mt-1 max-w-xl text-[11px] font-medium leading-relaxed text-[#2A8C82] sm:mt-1.5 sm:text-sm">
                  Pick a date and the hours you are free. Patients can book you in these slots.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <StatPill value={hoursLabel} label="hours" tone="forest" />
                <StatPill value={totalSlots} label="slots" tone="sage" />
                <StatPill value={`${activeDays}/7`} label="active days" tone="moss" />
              </div>
            </div>
          </header>

          {/* WORKSPACE
              Mobile order: form → week view → calendar → summary
              Desktop: left rail (form + calendar) | right (week view + summary) */}
          <div
            className="av-rise grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start"
            style={{ animationDelay: "60ms" }}
          >
            {/* LEFT RAIL (contents on mobile so children can be re-ordered) */}
            <div className="contents lg:block lg:space-y-4 lg:sticky lg:top-5">
              <section
                aria-labelledby="av-add"
                className="order-1 min-w-0 overflow-hidden rounded-2xl border border-[#C7E6E1] bg-white shadow-sm lg:order-none"
              >
                <div className="border-b border-[#E3F4F1] bg-white px-3.5 py-3 sm:px-4">
                  <SectionHeading
                    icon={CalendarPlus}
                    id="av-add"
                    title="Add a slot"
                    desc="Pick a date and your free hours."
                    tone="forest"
                  />
                </div>
                <div className="p-3.5 sm:p-4">
                  <AddSlotForm
                    todayKey={todayKey}
                    now={now}
                    byDate={byDate}
                    onAdd={addSlot}
                    date={formDate}
                    onDateChange={setFormDate}
                  />
                </div>
              </section>

              <section
                aria-label="Calendar"
                className="order-3 min-w-0 overflow-hidden rounded-2xl border border-[#C7E6E1] bg-white shadow-sm lg:order-none"
              >
                <MiniCalendar
                  selectedKey={formDate}
                  todayKey={todayKey}
                  byDate={byDate}
                  onPick={pickDate}
                />
              </section>
            </div>

            {/* RIGHT — week view */}
            <div className="order-2 min-w-0 space-y-4 lg:order-none">
              <section
                ref={weekRef}
                aria-labelledby="av-week"
                className="av-rise scroll-mt-16 overflow-hidden rounded-2xl border border-[#C2E0DC] bg-white shadow-sm"
                style={{ animationDelay: "120ms" }}
              >
                <h2 id="av-week" className="sr-only">Weekly availability</h2>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E3EFEC] bg-white px-3 py-3 sm:gap-3 sm:px-5">
                  <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
                    <button type="button" aria-label="Previous week" onClick={() => setWeekStart(addDays(weekStart, -7))} className={ICON_BTN}>
                      <ChevronLeft size={15} />
                    </button>
                    <div className="min-w-0 flex-1 text-center sm:min-w-[180px] sm:flex-none">
                      <p className="text-[12px] font-extrabold tracking-tight tabular-nums text-[#122A2E] sm:text-[13px]">
                        {weekRangeLabel(weekDates[0], weekDates[6])}
                      </p>
                      <p className={`text-[9px] font-bold uppercase tracking-wide sm:text-[10px] ${isCurrentWeek ? "text-[#2A8C82]" : MUTED}`}>
                        {isCurrentWeek ? "This week" : "Selected week"}
                      </p>
                    </div>
                    <button type="button" aria-label="Next week" onClick={() => setWeekStart(addDays(weekStart, 7))} className={ICON_BTN}>
                      <ChevronRight size={15} />
                    </button>
                    {!isCurrentWeek && (
                      <button
                        type="button"
                        onClick={() => setWeekStart(mondayOf(new Date()))}
                        className={`hidden rounded-lg border border-[#C2E0DC] bg-white px-2.5 py-2 text-[11px] font-bold text-[#2A8C82] transition hover:bg-[#E4F4F1] sm:ml-1 sm:inline-flex ${FOCUS}`}
                      >
                        This week
                      </button>
                    )}
                  </div>

                  {/* Mobile: "This week" gets its own full-width row when needed */}
                  {!isCurrentWeek && (
                    <button
                      type="button"
                      onClick={() => setWeekStart(mondayOf(new Date()))}
                      className={`w-full rounded-lg border border-[#C2E0DC] bg-white px-3 py-1.5 text-[11px] font-bold text-[#2A8C82] transition hover:bg-[#E4F4F1] sm:hidden ${FOCUS}`}
                    >
                      Back to this week
                    </button>
                  )}

                  <div className="hidden items-center gap-1.5 text-[11px] font-bold sm:flex">
                    <span className="rounded-lg border border-[#C2E0DC] bg-white px-2 py-1 text-[#2A8C82]">{totalSlots} slots</span>
                    <span className="rounded-lg border border-[#C2E0DC] bg-white px-2 py-1 text-[#2A8C82]">{hoursLabel}</span>
                  </div>
                </div>

                <div className="bg-white">
                  <div className="hidden space-y-3 bg-white p-4 lg:block">
                    {weekDates.map((d) => {
                      const key = toKey(d);
                      return (
                        <DayRow
                          key={key}
                          date={d}
                          isToday={key === todayKey}
                          isPast={key < todayKey}
                          list={byDate[key] || []}
                          freshId={freshId}
                          onRemove={removeSlot}
                        />
                      );
                    })}
                  </div>

                  <div className="p-2.5 sm:p-4 lg:hidden">
                    <MobileDayPicker
                      weekDates={weekDates}
                      byDate={byDate}
                      selectedKey={selectedKey}
                      todayKey={todayKey}
                      onSelect={setActiveKey}
                      freshId={freshId}
                      onRemove={removeSlot}
                    />
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <aside className="min-w-0 rounded-2xl border border-[#C7E6E1] bg-white p-3.5 shadow-sm sm:p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E6F4F1] text-[#2A8C82] sm:h-8 sm:w-8">
                      <CalendarCheck size={15} />
                    </div>
                    <h3 className="text-[12px] font-bold text-[#1F6F68] sm:text-[13px]">This week at a glance</h3>
                  </div>
                  <dl className="divide-y divide-[#E0EDEA]">
                    <SummaryRow icon={CalendarDays} label="Slots" value={String(totalSlots)} />
                    <SummaryRow icon={Hourglass} label="Hours" value={hoursLabel} />
                    <SummaryRow icon={CheckCircle2} label="Active days" value={`${activeDays} / 7`} />
                    <SummaryRow
                      icon={Clock}
                      label="Next session"
                      value={nextSession ? formatSlot(nextSession.start, now) : "None"}
                    />
                  </dl>
                </aside>

                <aside className="flex min-w-0 flex-col rounded-2xl border border-[#C7E6E1] bg-white p-4 shadow-sm sm:p-5">
                  <div className="mb-1 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E6F4F1] text-[#2A8C82] sm:h-8 sm:w-8">
                      <Leaf size={15} />
                    </div>
                    <h3 className="text-[12px] font-bold text-[#1F6F68] sm:text-[13px]">Consistency builds trust</h3>
                  </div>
                  <p className={`mt-1 text-[11px] font-medium leading-relaxed sm:text-xs ${MUTED}`}>
                    Steady availability helps patients plan care and keeps your calendar healthy.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" className={BTN_GHOST}>
                      <MessageSquare size={13} className="text-[#2A8C82]" /> Contact support
                    </button>
                    <button type="button" onClick={() => go("Sessions")} className={BTN_GHOST}>
                      <Info size={13} className="text-[#2A8C82]" /> View sessions
                    </button>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* UNDO TOAST */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-[70] flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-2.5 rounded-full bg-gradient-to-r from-[#184D43] to-[#2A8C82] py-1.5 pl-3.5 pr-1.5 text-[11px] font-semibold sm:gap-3 sm:py-2 sm:pl-4 sm:pr-2 sm:text-xs text-white shadow-xl sm:left-auto sm:right-6 sm:translate-x-0"
        >
          <span className="min-w-0 truncate tabular-nums">
            Removed {toast.slot.start} – {toast.slot.end}
          </span>
          <button
            type="button"
            onClick={undoRemove}
            className="shrink-0 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-bold sm:text-[11px] transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
}