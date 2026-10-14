import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  CalendarPlus,
  CalendarDays,
  CalendarCheck,
  Clock,
  Plus,
  Info,
  MessageSquare,
  Trash2,
  Sparkles,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";

import Sidebar from "./Sidebar";

/* ============================================================
   CONFIG DATA SETUP
============================================================ */

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const UPCOMING_SESSION = "Today, 4:00 PM";

const INITIAL_SLOTS = {
  Monday: [
    { id: 1, start: "10:00 AM", end: "12:00 PM" },
    { id: 2, start: "4:00 PM", end: "6:00 PM" },
  ],
  Tuesday: [{ id: 3, start: "11:00 AM", end: "1:00 PM" }],
  Wednesday: [
    { id: 4, start: "10:00 AM", end: "12:00 PM" },
    { id: 5, start: "3:00 PM", end: "5:00 PM" },
  ],
  Thursday: [{ id: 6, start: "11:00 AM", end: "2:00 PM" }],
  Friday: [{ id: 7, start: "10:00 AM", end: "12:00 PM" }],
  Saturday: [{ id: 8, start: "9:00 AM", end: "11:00 AM" }],
  Sunday: [],
};

const TEMPLATES = [
  { label: "Weekdays (10 AM – 1 PM)", days: DAYS.slice(0, 5), start: "10:00 AM", end: "1:00 PM" },
  { label: "Weekdays Evenings (4 PM – 6 PM)", days: DAYS.slice(0, 5), start: "4:00 PM", end: "6:00 PM" },
  { label: "Weekend Mornings (9 AM – 12 PM)", days: DAYS.slice(5), start: "9:00 AM", end: "12:00 PM" },
];

/* ============================================================
   TIME HELPERS
============================================================ */

function fmtTime(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const ap = h >= 12 ? "PM" : "AM";
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${ap}`;
}

const TIME_OPTIONS = (() => {
  const list = [];
  for (let m = 6 * 60; m <= 22 * 60; m += 30) list.push(fmtTime(m));
  return list;
})();

function toMin(t) {
  const [time, ap] = t.split(" ");
  let [h, m] = time.split(":").map(Number);
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

const overlaps = (a, b) => toMin(a.start) < toMin(b.end) && toMin(b.start) < toMin(a.end);

function weekDates() {
  const now = new Date();
  const mon = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7));
  return DAYS.map((_, i) => {
    const d = new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + i);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });
}

const todayIndex = () => (new Date().getDay() + 6) % 7;

/* true when viewport >= 1024px (Tailwind `lg`) */
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
   STYLE TOKENS
============================================================ */

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a9d8f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f5]";

/* text-base on mobile stops iOS from zooming the page when a select is focused */
const SELECT =
  "w-full cursor-pointer rounded-xl border border-[#e2e8e6] bg-white px-3 py-3 text-base text-slate-800 transition focus:border-[#2a9d8f] focus:outline-none focus:ring-2 focus:ring-[#2a9d8f]/25 sm:py-2.5 sm:text-sm";

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function Availability({
  onLogout,
  onNavigate,
  sidebarCollapsed = false,
  onToggleSidebar,
}) {
  const isDesktop = useIsDesktop();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    if (isDesktop) {
      setMobileNavOpen(false);
      setSheetOpen(false);
    }
  }, [isDesktop]);

  const sidebarWidth = sidebarCollapsed ? 76 : 268;
  const dates = useMemo(weekDates, []);
  const today = useMemo(todayIndex, []);

  const [slots, setSlots] = useState(INITIAL_SLOTS);
  const [day, setDay] = useState("");
  const [start, setStart] = useState("10:00 AM");
  const [end, setEnd] = useState("11:00 AM");
  const [error, setError] = useState("");
  const [fresh, setFresh] = useState([]);
  const [activeTab, setActiveTab] = useState(DAYS[today]);

  const totalSlots = DAYS.reduce((n, d) => n + slots[d].length, 0);
  const activeDays = DAYS.filter((d) => slots[d].length > 0).length;

  const navigateFromDrawer = (page) => {
    setMobileNavOpen(false);
    if (typeof onNavigate === "function") onNavigate(page);
  };

  const tryAdd = (prev, d, s, e) => {
    if (toMin(e) <= toMin(s)) return { next: prev, err: "End time must be after start time." };
    const clash = prev[d].some((x) => overlaps(x, { start: s, end: e }));
    if (clash) return { next: prev, err: `This time overlaps an existing slot on ${d}.` };

    const slot = { id: Date.now() + Math.random(), start: s, end: e };
    const list = [...prev[d], slot].sort((a, b) => toMin(a.start) - toMin(b.start));
    return { next: { ...prev, [d]: list }, err: "", slot };
  };

  const handleAdd = (ev) => {
    ev.preventDefault();
    if (!day) {
      setError("Please select a day.");
      return;
    }
    const { next, err, slot } = tryAdd(slots, day, start, end);
    setError(err);
    if (!err) {
      setSlots(next);
      setFresh([slot.id]);
      setActiveTab(day);
      setError("");
      setSheetOpen(false);
    }
  };

  const applyTemplate = (t) => {
    let next = slots;
    const added = [];
    t.days.forEach((d) => {
      const r = tryAdd(next, d, t.start, t.end);
      next = r.next;
      if (r.slot) added.push(r.slot.id);
    });
    setSlots(next);
    setFresh(added);
    setError("");
  };

  const removeSlot = (d, id) =>
    setSlots((prev) => ({ ...prev, [d]: prev[d].filter((x) => x.id !== id) }));

  return (
    <div className="av-root min-h-screen bg-[#faf8f5] text-slate-800 antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .av-root, .av-root button, .av-root select, .av-root input {
          font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
        }

        /* hide scrollbars everywhere, scrolling still works */
        html, body, .av-root, .av-root * { scrollbar-width: none; -ms-overflow-style: none; }
        html::-webkit-scrollbar, body::-webkit-scrollbar,
        .av-root::-webkit-scrollbar, .av-root *::-webkit-scrollbar { display: none; width: 0; height: 0; }
        .av-root { overflow-x: clip; }

        @keyframes av-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes av-pop { from { opacity: 0; transform: scale(.92); } to { opacity: 1; transform: scale(1); } }
        @keyframes av-sheet { from { transform: translateY(100%); } to { transform: translateY(0); } }

        .av-backdrop { animation: av-fade .2s ease both; }
        .av-pop { animation: av-pop .28s cubic-bezier(.2,.8,.2,1) both; }
        .av-sheet { animation: av-sheet .28s cubic-bezier(.2,.8,.2,1) both; }
        @media (min-width: 1024px) { .av-sheet { animation: none; } }

        @media (prefers-reduced-motion: reduce) {
          .av-backdrop, .av-pop, .av-sheet { animation: none; }
        }
      `}</style>

      {/* ================= SIDEBAR ================= */}
      {isDesktop ? (
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={onToggleSidebar}
          activePage="Availability"
          onNavigate={onNavigate}
          onLogout={onLogout}
          partnerName="Prem Zumble"
        />
      ) : (
        mobileNavOpen && (
          <>
            <div
              className="av-backdrop fixed inset-0 z-40 bg-black/45"
              onClick={() => setMobileNavOpen(false)}
              aria-hidden="true"
            />
            <div className="relative z-50">
              <Sidebar
                collapsed={false}
                onToggle={() => setMobileNavOpen(false)}
                activePage="Availability"
                onNavigate={navigateFromDrawer}
                onLogout={onLogout}
                partnerName="Prem Zumble"
              />
            </div>
          </>
        )
      )}

      {/* ================= MOBILE TOP BAR ================= */}
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-[#e6ebe9] bg-[#faf8f5]/90 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open menu"
          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#032927] shadow-sm ring-1 ring-[#e2e8e6] ${FOCUS}`}
        >
          <Menu size={20} />
        </button>
        <span className="text-[15px] font-bold text-slate-800">Availability</span>
      </div>

      {/* ================= MAIN ================= */}
      <main
        className="relative min-h-screen transition-[margin] duration-300 ease-in-out lg:ml-[var(--sb)]"
        style={{ "--sb": `${sidebarWidth}px` }}
      >
        <div className="mx-auto w-full max-w-7xl px-4 pb-28 pt-5 sm:px-6 sm:pt-7 lg:px-8 lg:pb-10 lg:pt-9">

          {/* ============ COMPACT HEADER ============ */}
          <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate("Profile Settings")}
                className={`mb-2 inline-flex items-center gap-1 rounded-md text-xs font-semibold text-[#032927] transition hover:text-[#2a9d8f] ${FOCUS}`}
              >
                <ChevronLeft size={16} strokeWidth={2.2} />
                Back to Settings
              </button>
              <h1 className="text-[22px] font-extrabold leading-tight tracking-tight text-[#032927] sm:text-[28px]">
                Availability &amp; Working Hours
              </h1>
              <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-slate-500 sm:text-sm">
                Manage your weekly consulting hours, recurring slots, and calendar preferences seamlessly.
              </p>
            </div>

            <div className="flex flex-shrink-0 items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e6f2f0] px-3.5 py-1.5 text-xs font-bold text-[#032927] ring-1 ring-[#cfe5e1]">
                <Clock size={13} />
                {totalSlots} slots
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e6f2f0] px-3.5 py-1.5 text-xs font-bold text-[#0a4440] ring-1 ring-[#cfe5e1]">
                <CalendarDays size={13} />
                {activeDays}/7 days
              </span>
            </div>
          </header>

          {/* ============ WEEKLY SCHEDULE ============ */}
          <section aria-labelledby="av-week" className="rounded-3xl border border-[#e6ebe9] bg-white p-4 shadow-[0_1px_2px_rgba(3,41,39,0.06)] sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 id="av-week" className="text-base font-extrabold text-[#032927] sm:text-lg">
                Weekly Schedule Overview
              </h2>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate("Sessions")}
                className={`inline-flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2 py-1 text-xs font-bold text-[#032927] transition hover:bg-[#e6f2f0] ${FOCUS}`}
              >
                <CalendarDays size={14} />
                <span className="hidden min-[400px]:inline">View Calendar</span>
                <span className="min-[400px]:hidden">Calendar</span>
              </button>
            </div>

            {/* ---- Desktop: 7-column week grid ---- */}
            <div className="hidden grid-cols-7 gap-2.5 lg:grid">
              {DAYS.map((d, i) => (
                <DayColumn
                  key={d}
                  day={d}
                  date={dates[i]}
                  isToday={i === today}
                  list={slots[d]}
                  fresh={fresh}
                  onRemove={(id) => removeSlot(d, id)}
                />
              ))}
            </div>

            {/* ---- Mobile / tablet: day tabs + selected day ---- */}
            <div className="lg:hidden">
              <div role="tablist" aria-label="Days of the week" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
                {DAYS.map((d, i) => {
                  const selected = activeTab === d;
                  const count = slots[d].length;
                  return (
                    <button
                      key={d}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setActiveTab(d)}
                      className={`flex min-w-[64px] flex-shrink-0 flex-col items-center rounded-2xl px-3 py-2 text-center transition ${FOCUS} ${
                        selected
                          ? "bg-[#032927] text-white shadow-md shadow-teal-900/20"
                          : "bg-[#eef2f1] text-slate-600 hover:bg-[#e3eae8]"
                      }`}
                    >
                      <span className="text-[13px] font-bold">{d.slice(0, 3)}</span>
                      <span className={`text-[10.5px] font-medium ${selected ? "text-[#cfe5e1]" : "text-slate-400"}`}>
                        {dates[i]}
                      </span>
                      <span
                        className={`mt-1 h-1.5 w-1.5 rounded-full ${
                          count > 0 ? (selected ? "bg-white" : "bg-[#2a9d8f]") : "bg-transparent"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div role="tabpanel" className="mt-3 space-y-2.5">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm font-bold text-slate-800">{activeTab}</h3>
                  <span className="text-xs font-medium text-slate-400">
                    {slots[activeTab].length > 0
                      ? `${slots[activeTab].length} slot${slots[activeTab].length > 1 ? "s" : ""}`
                      : "Inactive"}
                  </span>
                </div>

                {slots[activeTab].length > 0 ? (
                  slots[activeTab].map((s) => (
                    <SlotCard
                      key={s.id}
                      slot={s}
                      isFresh={fresh.includes(s.id)}
                      onRemove={() => removeSlot(activeTab, s.id)}
                      alwaysShowRemove
                    />
                  ))
                ) : (
                  <p className="rounded-2xl border border-dashed border-[#d8e3e1] px-4 py-8 text-center text-xs italic text-slate-400">
                    No slots scheduled for this day
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* ============ ADD PANEL + SUMMARY ============ */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">

            {/* ---- ADD SLOT PANEL (bottom sheet on mobile, sticky card on desktop) ---- */}
            {sheetOpen && (
              <div
                className="av-backdrop fixed inset-0 z-40 bg-black/45 lg:hidden"
                onClick={() => setSheetOpen(false)}
                aria-hidden="true"
              />
            )}

            <section
              aria-labelledby="av-add"
              className={`${
                sheetOpen ? "av-sheet block" : "hidden"
              } fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-3xl border border-[#e6ebe9] bg-white p-5 shadow-2xl sm:p-6 lg:static lg:z-auto lg:col-span-7 lg:block lg:max-h-none lg:overflow-visible lg:rounded-3xl lg:shadow-[0_1px_2px_rgba(3,41,39,0.06)]`}
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e6f2f0] text-[#032927]">
                    <CalendarPlus size={20} strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <h2 id="av-add" className="text-base font-extrabold text-[#032927]">
                      Add New Working Time Slot
                    </h2>
                    <p className="text-xs text-slate-500">
                      Choose a day and time range when you are available.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  aria-label="Close"
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#eef2f1] text-slate-500 lg:hidden ${FOCUS}`}
                >
                  <X size={18} />
                </button>
              </div>

              {/* QUICK TEMPLATES CHIPS */}
              <div className="mb-5">
                <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-600">
                  <Sparkles size={14} className="text-[#2a9d8f]" />
                  Quick Templates
                </div>
                <div className="flex flex-wrap gap-2">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => applyTemplate(t)}
                      className={`rounded-full border border-[#d8e3e1] bg-[#f4faf9] px-3.5 py-2 text-xs font-semibold text-[#032927] transition hover:border-[#2a9d8f] hover:bg-[#e6f2f0] active:scale-95 ${FOCUS}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleAdd} className="space-y-4">
                {/* DAY PILLS */}
                <fieldset>
                  <legend className="mb-2 text-xs font-bold text-slate-600">Day</legend>
                  <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                    {DAYS.map((d) => {
                      const on = day === d;
                      return (
                        <button
                          key={d}
                          type="button"
                          aria-pressed={on}
                          aria-label={d}
                          onClick={() => setDay(d)}
                          className={`rounded-xl py-2.5 text-xs font-bold transition active:scale-95 ${FOCUS} ${
                            on
                              ? "bg-[#032927] text-white shadow-sm shadow-teal-900/20"
                              : "bg-[#eef2f1] text-slate-600 hover:bg-[#e3eae8]"
                          }`}
                        >
                          {d.slice(0, 3)}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="min-w-0">
                    <label htmlFor="av-start" className="mb-1.5 block text-xs font-bold text-slate-600">
                      Start Time
                    </label>
                    <select id="av-start" value={start} onChange={(e) => setStart(e.target.value)} className={SELECT}>
                      {TIME_OPTIONS.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="min-w-0">
                    <label htmlFor="av-end" className="mb-1.5 block text-xs font-bold text-slate-600">
                      End Time
                    </label>
                    <select id="av-end" value={end} onChange={(e) => setEnd(e.target.value)} className={SELECT}>
                      {TIME_OPTIONS.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#032927] text-sm font-bold text-white shadow-md shadow-teal-900/20 transition hover:bg-[#0a4440] active:scale-[0.98] ${FOCUS}`}
                >
                  <Plus size={17} strokeWidth={2.5} />
                  Add
                </button>
              </form>
            </section>

            {/* ---- SINGLE SUMMARY PANEL ---- */}
            <aside className="rounded-3xl bg-[#032927] p-5 text-white shadow-lg shadow-teal-900/20 sm:p-6 lg:col-span-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#2a9d8f]">
                  <CalendarCheck size={20} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-[15px] font-extrabold leading-snug sm:text-base">
                    Your time helps someone feel better.
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#a7cfc9]">
                    Consistent availability builds trust and ensures your patients get timely care when they need it most. ♡
                  </p>
                </div>
              </div>

              <dl className="mt-5 divide-y divide-white/10 rounded-2xl bg-white/[0.06] px-4">
                <SummaryRow icon={CalendarDays} label="Total Weekly Slots" value={String(totalSlots)} />
                <SummaryRow icon={CheckCircle2} label="Active Working Days" value={`${activeDays} Days`} />
                <SummaryRow icon={Clock} label="Upcoming Session" value={UPCOMING_SESSION} />
              </dl>

              <div className="mt-5 border-t border-white/10 pt-4">
                <div className="mb-1 flex items-center gap-2 text-sm font-bold">
                  <Info size={15} className="text-[#2a9d8f]" />
                  Need Help with Scheduling?
                </div>
                <p className="mb-3 text-xs leading-relaxed text-[#a7cfc9]">
                  If you encounter any synchronization issues or need custom working hours, reach out to support.
                </p>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg px-1 py-1 text-xs font-bold text-white underline decoration-[#2a9d8f] decoration-2 underline-offset-4 transition hover:text-[#7fc7bd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a9d8f]"
                >
                  <MessageSquare size={14} />
                  Contact Support
                </button>
              </div>
            </aside>
          </div>
        </div>

        {/* ============ MOBILE FLOATING ADD BUTTON ============ */}
        {!sheetOpen && (
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className={`fixed bottom-5 right-4 z-30 inline-flex h-14 items-center gap-2 rounded-full bg-[#032927] px-5 text-sm font-bold text-white shadow-xl shadow-teal-900/30 transition active:scale-95 lg:hidden ${FOCUS}`}
          >
            <Plus size={18} strokeWidth={2.5} />
            Add New Working Time Slot
          </button>
        )}
      </main>
    </div>
  );
}

/* ============================================================
   SUB-COMPONENTS
============================================================ */

function DayColumn({ day, date, isToday, list, fresh, onRemove }) {
  const active = list.length > 0;

  return (
    <article
      aria-label={`${day}, ${date}${isToday ? ", today" : ""}`}
      className={`flex min-h-[240px] min-w-0 flex-col overflow-hidden rounded-2xl border bg-white shadow-[0_2px_8px_rgba(3,41,39,0.08)] transition-shadow hover:shadow-[0_8px_20px_rgba(3,41,39,0.14)] ${
        isToday ? "border-[#032927]" : "border-[#d8e3e1]"
      }`}
    >
      {/* card header */}
      <div className={`px-3 py-2.5 ${isToday ? "bg-[#032927] text-white" : "bg-[#e6f2f0] text-[#032927]"}`}>
        <div className="flex items-center justify-between gap-1">
          <span className="text-sm font-extrabold" title={day}>
            {day.slice(0, 3)}
          </span>
          <span
            className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
              isToday
                ? "bg-white/15 text-white"
                : active
                ? "bg-[#032927] text-white"
                : "bg-white text-slate-400"
            }`}
            aria-label={`${list.length} slots`}
          >
            {list.length}
          </span>
        </div>
        <div className={`text-[11px] font-medium ${isToday ? "text-[#a7cfc9]" : "text-[#4a7571]"}`}>
          {date}
        </div>
      </div>

      {/* card body */}
      <div className="flex flex-1 flex-col gap-2 p-2.5">
        {active ? (
          list.map((s) => (
            <SlotCard
              key={s.id}
              slot={s}
              isFresh={fresh.includes(s.id)}
              onRemove={() => onRemove(s.id)}
              compact
            />
          ))
        ) : (
          <p className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-[#d8e3e1] px-2 py-6 text-center text-[11px] italic leading-snug text-slate-400">
            No slots scheduled for this day
          </p>
        )}
      </div>
    </article>
  );
}

function SlotCard({ slot, isFresh, onRemove, compact = false, alwaysShowRemove = false }) {
  return (
    <div
      className={`group relative rounded-xl border border-[#cfe5e1] bg-white shadow-[0_1px_2px_rgba(3,41,39,0.08)] ${
        isFresh ? "av-pop" : ""
      } ${compact ? "p-2.5" : "flex items-center justify-between gap-3 px-4 py-3"}`}
    >
      <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-[#2a9d8f]" aria-hidden="true" />

      {compact ? (
        <div className="pl-1.5 text-[12px] font-bold leading-tight text-[#032927]">
          <div>{slot.start}</div>
          <div className="mt-0.5 text-[11px] font-medium text-slate-400">to {slot.end}</div>
        </div>
      ) : (
        <span className="pl-2 text-sm font-bold text-[#032927]">
          {slot.start} – {slot.end}
        </span>
      )}

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${slot.start} to ${slot.end}`}
        className={`inline-flex items-center justify-center gap-1 rounded-lg text-rose-600 transition hover:bg-rose-50 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 ${
          compact
            ? "absolute right-1.5 top-1.5 h-7 w-7 bg-white/90 opacity-0 group-hover:opacity-100"
            : `px-2.5 py-1.5 text-xs font-semibold ${alwaysShowRemove ? "" : "opacity-0 group-hover:opacity-100"}`
        }`}
      >
        <Trash2 size={compact ? 14 : 13} />
        {!compact && <span>Remove</span>}
      </button>
    </div>
  );
}

function SummaryRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <dt className="flex min-w-0 items-center gap-2.5 text-xs font-medium text-[#a7cfc9]">
        <Icon size={15} className="flex-shrink-0 text-[#2a9d8f]" />
        <span className="truncate">{label}</span>
      </dt>
      <dd className="flex-shrink-0 text-sm font-extrabold text-white">{value}</dd>
    </div>
  );
}