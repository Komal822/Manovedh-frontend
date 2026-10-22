import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, CalendarPlus, CalendarDays, CalendarCheck, Clock, Plus, Info, ChevronLeft, ChevronRight,
  MessageSquare, Trash2, CheckCircle2, Menu, Hourglass,
} from "lucide-react";
import Sidebar from "./Sidebar";
import { useSessions, useNow, sessionEnd, formatSlot } from "./sessionStore";

/* ================= DATE HELPERS ================= */
const pad = (n) => String(n).padStart(2, "0");
const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromKey = (k) => {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const mondayOf = (d) => addDays(d, -((d.getDay() + 6) % 7));
const weekdayLong = (d) => d.toLocaleDateString("en-US", { weekday: "long" });
const weekdayShort = (d) => d.toLocaleDateString("en-US", { weekday: "short" });
const shortDate = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
const rangeDate = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
const longDate = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

/* ================= TIME HELPERS ================= */
function fmtTime(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h % 12 === 0 ? 12 : h % 12}:${pad(m)} ${h >= 12 ? "PM" : "AM"}`;
}
const TIME_OPTIONS = (() => {
  const l = [];
  for (let m = 6 * 60; m <= 22 * 60; m += 30) l.push(fmtTime(m));
  return l;
})();
function toMin(t) {
  const [time, ap] = t.split(" ");
  let [h, m] = time.split(":").map(Number);
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return h * 60 + m;
}
const overlaps = (a, b) => toMin(a.start) < toMin(b.end) && toMin(b.start) < toMin(a.end);
const duration = (s) => {
  const mins = toMin(s.end) - toMin(s.start);
  const h = Math.floor(mins / 60), m = mins % 60;
  return h && m ? `${h}h ${m}m` : h ? `${h}h` : `${m}m`;
};

/* ================= SEED DATA (current week) ================= */
function seedSlots() {
  const mon = mondayOf(new Date());
  const plan = {
    0: [["10:00 AM", "12:00 PM"], ["4:00 PM", "6:00 PM"]],
    1: [["11:00 AM", "1:00 PM"]],
    2: [["10:00 AM", "12:00 PM"], ["3:00 PM", "5:00 PM"]],
    3: [["11:00 AM", "2:00 PM"]],
    4: [["10:00 AM", "12:00 PM"]],
    5: [["9:00 AM", "11:00 AM"]],
  };
  let id = 0;
  const out = [];
  Object.entries(plan).forEach(([offset, list]) => {
    list.forEach(([start, end]) => out.push({ id: ++id, date: toKey(addDays(mon, Number(offset))), start, end }));
  });
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

/* ================= STYLE TOKENS ================= */
const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F7A5A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F1F5F2]";
const CARD = "rounded-3xl bg-white border border-[#E6ECE8]";
const FIELD =
  "w-full cursor-pointer rounded-2xl border border-[#D5E3DC] bg-[#F7FAF8] px-4 py-3 text-base font-medium text-[#10281E] outline-none transition focus:border-[#1F7A5A] focus:bg-white focus:ring-4 focus:ring-[#1F7A5A]/10 sm:text-sm";
const LABEL = "mb-1.5 block text-sm font-bold text-[#3F514A]";
const BTN_GHOST =
  "inline-flex items-center gap-2 rounded-xl border border-[#D9E5DE] bg-white px-4 py-2.5 text-xs font-bold text-[#10281E] transition hover:bg-[#F1F6F3] active:scale-95";

/* ================= SMALL PIECES ================= */
function IconTile({ children }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF3EE] text-[#176247]">
      {children}
    </div>
  );
}

function HeroStat({ value, label }) {
  return (
    <div className="border-l-2 border-[#CFE2D8] pl-3">
      <p className="text-2xl font-extrabold leading-none tabular-nums text-[#10281E]">{value}</p>
      <p className="mt-1.5 text-xs font-semibold text-[#66766F]">{label}</p>
    </div>
  );
}

/* ================= MAIN ================= */
export default function Availability({ onLogout, onNavigate, sidebarCollapsed = false, onToggleSidebar }) {
  const isDesktop = useIsDesktop();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (isDesktop) setMobileNavOpen(false);
  }, [isDesktop]);

  const sidebarWidth = sidebarCollapsed ? 80 : 270;

  // Upcoming session aata store madhun yeto
  const sessions = useSessions();
  const now = useNow();
  const nextSession = useMemo(
    () =>
      sessions
        .filter((s) => s.status === "scheduled" && sessionEnd(s) > now)
        .sort((a, b) => a.start - b.start)[0] || null,
    [sessions, now]
  );

  const todayKey = toKey(new Date(now));

  const [slots, setSlots] = useState(seedSlots);
  const [weekStart, setWeekStart] = useState(() => mondayOf(new Date()));
  const [activeKey, setActiveKey] = useState(() => toKey(new Date()));

  // Add form
  const [date, setDate] = useState(() => toKey(new Date()));
  const [start, setStart] = useState("10:00 AM");
  const [end, setEnd] = useState("11:00 AM");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [fresh, setFresh] = useState([]);

  const scheduleRef = useRef(null);

  const weekDates = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
  const weekKeys = weekDates.map(toKey);
  const isCurrentWeek = weekKeys.includes(todayKey);

  const byDate = useMemo(() => {
    const map = {};
    for (const s of slots) (map[s.date] ||= []).push(s);
    Object.values(map).forEach((l) => l.sort((a, b) => toMin(a.start) - toMin(b.start)));
    return map;
  }, [slots]);

  const selectedKey = weekKeys.includes(activeKey) ? activeKey : isCurrentWeek ? todayKey : weekKeys[0];

  const weekSlots = weekKeys.flatMap((k) => byDate[k] || []);
  const totalSlots = weekSlots.length;
  const activeDays = weekKeys.filter((k) => (byDate[k] || []).length > 0).length;
  const totalHours = weekSlots.reduce((a, s) => a + (toMin(s.end) - toMin(s.start)), 0) / 60;
  const hoursLabel = `${Number.isInteger(totalHours) ? totalHours : totalHours.toFixed(1)}h`;

  const navigateFromDrawer = (page) => {
    setMobileNavOpen(false);
    if (typeof onNavigate === "function") onNavigate(page);
  };

  const onStartChange = (v) => {
    setStart(v);
    setEnd(fmtTime(Math.min(toMin(v) + 60, 22 * 60))); // end = start + 1h
    setError("");
    setNotice("");
  };

  const handleAdd = (ev) => {
    ev.preventDefault();
    setNotice("");
    if (!date) return setError("Please choose a date.");
    if (date < todayKey) return setError("Pick today or a future date.");
    if (toMin(end) <= toMin(start)) return setError("End time must be after start time.");

    const n = new Date();
    if (date === todayKey && toMin(start) <= n.getHours() * 60 + n.getMinutes())
      return setError("This start time has already passed today.");

    if ((byDate[date] || []).some((x) => overlaps(x, { start, end })))
      return setError(`This time overlaps an existing slot on ${longDate(fromKey(date))}.`);

    const slot = { id: Date.now() + Math.random(), date, start, end };
    setSlots((prev) => [...prev, slot]);
    setFresh([slot.id]);
    setError("");
    setNotice(`Slot added for ${weekdayShort(fromKey(date))}, ${shortDate(fromKey(date))}, ${start} – ${end}.`);
    setWeekStart(mondayOf(fromKey(date))); // slot jya week madhe aahe tithe jato
    setActiveKey(date);
    requestAnimationFrame(() => scheduleRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  };

  const removeSlot = (id) => setSlots((prev) => prev.filter((x) => x.id !== id));

  const previewDate = date ? fromKey(date) : null;
  const previewOk = previewDate && toMin(end) > toMin(start);

  return (
    <div className="av-root min-h-screen bg-[#F1F5F2] text-[#10281E] antialiased selection:bg-[#CFE3D9]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;700&display=swap');
        .av-root, .av-root button, .av-root select, .av-root input { font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif; }
        .av-serif { font-family: 'Fraunces', Georgia, serif !important; font-optical-sizing: auto; }
        html, body, .av-root, .av-root * { scrollbar-width: none; -ms-overflow-style: none; }
        html::-webkit-scrollbar, body::-webkit-scrollbar, .av-root::-webkit-scrollbar, .av-root *::-webkit-scrollbar { display: none; width: 0; height: 0; }
        .av-root { overflow-x: clip; }
        @keyframes av-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes av-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        @keyframes av-pop { from { opacity: 0; transform: scale(.9); } to { opacity: 1; transform: scale(1); } }
        .av-backdrop { animation: av-fade .2s ease both; }
        .av-rise { animation: av-rise .5s cubic-bezier(.16,1,.3,1) both; }
        .av-pop { animation: av-pop .3s cubic-bezier(.2,.8,.2,1) both; }
        @media (prefers-reduced-motion: reduce) { .av-backdrop, .av-rise, .av-pop { animation: none; } }
      `}</style>

      {/* SIDEBAR */}
      {isDesktop ? (
        <Sidebar collapsed={sidebarCollapsed} onToggle={onToggleSidebar} activePage="Availability"
          onNavigate={onNavigate} onLogout={onLogout} partnerName="Prem Zumble" />
      ) : (
        mobileNavOpen && (
          <>
            <div className="av-backdrop fixed inset-0 z-40 bg-[#0A1F17]/50 backdrop-blur-sm"
              onClick={() => setMobileNavOpen(false)} aria-hidden="true" />
            <div className="relative z-50">
              <Sidebar collapsed={false} onToggle={() => setMobileNavOpen(false)} activePage="Availability"
                onNavigate={navigateFromDrawer} onLogout={onLogout} partnerName="Prem Zumble" />
            </div>
          </>
        )
      )}

      {/* MOBILE TOP BAR */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#DCE6E1] bg-[#F1F5F2]/90 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setMobileNavOpen(true)} aria-label="Open menu"
            className={`flex h-10 w-10 items-center justify-center rounded-xl border border-[#DCE6E1] bg-white ${FOCUS}`}>
            <Menu size={18} />
          </button>
          <span className="text-sm font-bold">Availability</span>
        </div>
      </div>

      {/* MAIN */}
      <main className="relative min-h-screen transition-[margin] duration-300 ease-in-out lg:ml-[var(--sb)]"
        style={{ "--sb": `${sidebarWidth}px` }}>
        <div className="mx-auto w-full max-w-[1400px] space-y-6 px-4 pb-12 pt-5 sm:px-6 sm:pt-7 lg:px-8">

          {/* HERO */}
          <header className="av-rise px-1 pt-2 sm:px-2">
            <button type="button" onClick={() => onNavigate && onNavigate("Profile Settings")}
              className={`group mb-5 inline-flex items-center gap-1.5 rounded-full text-xs font-bold text-[#176247] transition hover:text-[#10281E] ${FOCUS}`}>
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
              Back to settings
            </button>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <h1 className="av-serif text-[32px] font-bold leading-[1.1] tracking-tight sm:text-[44px]">
                  Availability &amp; working hours
                </h1>
                <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-[#66766F] sm:text-base">
                  Pick a date and the hours you are free. Patients can book you in these slots.
                </p>
              </div>
              <div className="flex items-center gap-7">
                <HeroStat value={hoursLabel} label="Hours in view" />
                <HeroStat value={totalSlots} label="Slots" />
                <HeroStat value={`${activeDays}/7`} label="Active days" />
              </div>
            </div>
          </header>

          {/* ADD WORKING TIME SLOT (varti) */}
          <section aria-labelledby="av-add" className={`av-rise ${CARD} p-5 sm:p-7`} style={{ animationDelay: "60ms" }}>
            <div className="mb-6 flex items-center gap-4">
              <IconTile><CalendarPlus size={21} /></IconTile>
              <div className="min-w-0">
                <h2 id="av-add" className="text-lg font-bold tracking-tight sm:text-[22px]">Add working time slot</h2>
                <p className="mt-0.5 text-sm font-medium text-[#66766F]">Choose a date, then the hours you are free.</p>
              </div>
            </div>

            <form onSubmit={handleAdd} noValidate>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-end">
                <div className="min-w-0">
                  <label htmlFor="av-date" className={LABEL}>Date</label>
                  <input id="av-date" type="date" value={date} min={todayKey}
                    onChange={(e) => { setDate(e.target.value); setError(""); setNotice(""); }}
                    className={FIELD} />
                </div>
                <div className="min-w-0">
                  <label htmlFor="av-start" className={LABEL}>Start time</label>
                  <select id="av-start" value={start} onChange={(e) => onStartChange(e.target.value)} className={FIELD}>
                    {TIME_OPTIONS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="min-w-0">
                  <label htmlFor="av-end" className={LABEL}>End time</label>
                  <select id="av-end" value={end}
                    onChange={(e) => { setEnd(e.target.value); setError(""); setNotice(""); }} className={FIELD}>
                    {TIME_OPTIONS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <button type="submit"
                  className={`flex h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-[#176247] px-6 text-sm font-bold text-white transition hover:bg-[#124F3A] active:scale-[0.99] sm:col-span-2 lg:col-span-1 lg:w-auto ${FOCUS}`}>
                  <Plus size={18} strokeWidth={2.5} /> Add slot
                </button>
              </div>

              {/* Preview / error / success */}
              <div className="mt-4 min-h-[44px]" aria-live="polite">
                {error ? (
                  <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                    {error}
                  </p>
                ) : notice ? (
                  <p role="status" className="flex items-center gap-2 rounded-xl border border-[#BFE0CF] bg-[#EAF6EF] px-4 py-3 text-sm font-semibold text-[#176247]">
                    <CheckCircle2 size={16} className="shrink-0" /> {notice}
                  </p>
                ) : previewOk ? (
                  <p className="flex items-center gap-2 rounded-xl bg-[#F5F9F7] px-4 py-3 text-sm font-medium text-[#455A50]">
                    <CalendarDays size={16} className="shrink-0 text-[#1F7A5A]" />
                    <span>
                      <span className="font-bold text-[#10281E]">{weekdayLong(previewDate)}, {longDate(previewDate)}</span>
                      {" · "}{start} – {end} ({duration({ start, end })})
                    </span>
                  </p>
                ) : null}
              </div>
            </form>
          </section>

          {/* WEEKLY SCHEDULE (khali) */}
          <section ref={scheduleRef} aria-labelledby="av-week"
            className={`av-rise scroll-mt-20 overflow-hidden ${CARD}`} style={{ animationDelay: "120ms" }}>
            <div className="flex items-center justify-between gap-3 p-5 sm:p-7">
              <div className="flex items-center gap-4">
                <IconTile><CalendarDays size={21} /></IconTile>
                <div className="min-w-0">
                  <h2 id="av-week" className="text-lg font-bold tracking-tight sm:text-[22px]">Your slots</h2>
                  <p className="mt-0.5 hidden text-sm font-medium text-[#66766F] sm:block">
                    Every slot you add shows up here, on its date.
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => onNavigate && onNavigate("Sessions")}
                className={`${BTN_GHOST} shrink-0 whitespace-nowrap ${FOCUS}`}>
                <CalendarDays size={14} className="text-[#1F7A5A]" />
                <span className="hidden min-[400px]:inline">View calendar</span>
                <span className="min-[400px]:hidden">Calendar</span>
              </button>
            </div>

            {/* Week navigation */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-y border-[#E3EBE7] bg-[#F4F8F6] px-5 py-3 sm:px-7">
              <div className="flex items-center gap-2">
                <button type="button" aria-label="Previous week" onClick={() => setWeekStart(addDays(weekStart, -7))}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border border-[#D9E5DE] bg-white text-[#10281E] transition hover:bg-[#E9F1EC] ${FOCUS}`}>
                  <ChevronLeft size={16} />
                </button>
                <span className="min-w-[150px] text-center text-sm font-bold">
                  {rangeDate(weekDates[0])} – {rangeDate(weekDates[6])}
                </span>
                <button type="button" aria-label="Next week" onClick={() => setWeekStart(addDays(weekStart, 7))}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border border-[#D9E5DE] bg-white text-[#10281E] transition hover:bg-[#E9F1EC] ${FOCUS}`}>
                  <ChevronRight size={16} />
                </button>
                {!isCurrentWeek && (
                  <button type="button" onClick={() => setWeekStart(mondayOf(new Date()))}
                    className={`ml-1 rounded-full px-3 py-1.5 text-xs font-bold text-[#176247] transition hover:bg-[#E3F2EA] ${FOCUS}`}>
                    This week
                  </button>
                )}
              </div>
              <span className="text-xs font-bold text-[#6B8077]">{totalSlots} slots · {hoursLabel}</span>
            </div>

            <div className="p-4 sm:p-6">
              {/* Desktop grid */}
              <div className="hidden grid-cols-7 gap-3 lg:grid">
                {weekDates.map((d) => {
                  const k = toKey(d);
                  return (
                    <DayColumn key={k} day={weekdayShort(d)} fullDay={weekdayLong(d)} dateLabel={shortDate(d)}
                      isToday={k === todayKey} isPast={k < todayKey} list={byDate[k] || []}
                      fresh={fresh} onRemove={removeSlot} />
                  );
                })}
              </div>

              {/* Mobile tabs */}
              <div className="lg:hidden">
                <div role="tablist" aria-label="Days of the week" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-3">
                  {weekDates.map((d) => {
                    const k = toKey(d);
                    const selected = selectedKey === k;
                    const count = (byDate[k] || []).length;
                    return (
                      <button key={k} type="button" role="tab" aria-selected={selected} onClick={() => setActiveKey(k)}
                        className={`relative flex min-w-[68px] shrink-0 flex-col items-center rounded-2xl px-3 py-3 text-center transition-all ${FOCUS} ${
                          selected ? "bg-[#176247] text-white" : "border border-[#E0EBE5] bg-white text-[#5F6F68]"
                        }`}>
                        <span className="text-[13px] font-semibold">{weekdayShort(d)}</span>
                        <span className={`text-[11px] font-medium ${selected ? "text-white/75" : "text-[#8FA098]"}`}>{shortDate(d)}</span>
                        <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${count > 0 ? (selected ? "bg-[#9FE0BF]" : "bg-[#1F7A5A]") : "bg-transparent"}`} />
                        {k === todayKey && !selected && (
                          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#E39A2D]" aria-label="Today" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div role="tabpanel" className="mt-3 space-y-3 rounded-3xl border border-[#E0EBE5] bg-white p-4">
                  <div className="flex items-baseline justify-between border-b border-[#E9EFEC] pb-3">
                    <h3 className="text-base font-semibold">
                      {weekdayLong(fromKey(selectedKey))}, {shortDate(fromKey(selectedKey))}
                    </h3>
                    <span className="rounded-full bg-[#E3F2EA] px-2.5 py-0.5 text-xs font-semibold text-[#176247]">
                      {(byDate[selectedKey] || []).length > 0
                        ? `${byDate[selectedKey].length} slot${byDate[selectedKey].length > 1 ? "s" : ""}`
                        : "No slots"}
                    </span>
                  </div>
                  {(byDate[selectedKey] || []).length > 0 ? (
                    byDate[selectedKey].map((s) => (
                      <SlotCard key={s.id} slot={s} isFresh={fresh.includes(s.id)} onRemove={() => removeSlot(s.id)} alwaysShowRemove />
                    ))
                  ) : (
                    <p className="rounded-2xl border border-dashed border-[#D5E2DC] bg-[#F7FAF8] px-4 py-8 text-center text-sm font-medium text-[#8FA098]">
                      No slots on this day. Add one from the form above.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* SUMMARY + HELP */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
            <aside className={`overflow-hidden ${CARD}`}>
              <div className="flex items-start gap-4 p-6 sm:p-7">
                <IconTile><CalendarCheck size={21} /></IconTile>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold leading-snug tracking-tight sm:text-xl">
                    Your time helps someone feel better.
                  </h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-[#66766F]">
                    Consistent availability builds trust and ensures your patients get timely care when they need it most.
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 sm:px-7 sm:pb-7">
                <dl className="divide-y divide-[#DCE6E1] rounded-2xl border border-[#E0EBE5] bg-[#F4F8F6] px-4">
                  <SummaryRow icon={CalendarDays} label="Slots in this week" value={String(totalSlots)} />
                  <SummaryRow icon={Hourglass} label="Hours in this week" value={hoursLabel} />
                  <SummaryRow icon={CheckCircle2} label="Active working days" value={`${activeDays} days`} />
                  <SummaryRow icon={Clock} label="Upcoming session"
                    value={nextSession ? formatSlot(nextSession.start, now) : "None scheduled"} />
                </dl>
              </div>
            </aside>

            <aside className={`p-6 sm:p-7 ${CARD}`}>
              <div className="mb-1 flex items-center gap-2 text-sm font-bold">
                <Info size={16} className="text-[#1F7A5A]" /> Need help with scheduling?
              </div>
              <p className="mb-4 text-sm font-medium leading-relaxed text-[#66766F]">
                If you face any sync issues or need custom working hours, reach out to support.
              </p>
              <button type="button" className={`${BTN_GHOST} ${FOCUS}`}>
                <MessageSquare size={14} className="text-[#1F7A5A]" /> Contact support
              </button>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ================= SUB-COMPONENTS ================= */
function DayColumn({ day, fullDay, dateLabel, isToday, isPast, list, fresh, onRemove }) {
  const active = list.length > 0;
  return (
    <article aria-label={`${fullDay}, ${dateLabel}${isToday ? ", today" : ""}`}
      className={`flex min-h-[260px] min-w-0 flex-col overflow-hidden rounded-3xl border bg-white ${
        isToday ? "border-[#1F7A5A]" : "border-[#C4D6CB]"
      } ${isPast ? "opacity-70" : ""}`}>
      <div className={`px-3.5 py-3 ${isToday ? "bg-[#176247] text-white" : "border-b border-[#D3E1D8] bg-[#F4F8F6]"}`}>
        <div className="flex items-center justify-between gap-1">
          <span className="text-sm font-semibold" title={fullDay}>{day}</span>
          <span aria-label={`${list.length} slots`}
            className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold ${
              isToday ? "bg-white/20 text-white" : active ? "bg-[#1F7A5A] text-white" : "border border-[#DCE6E1] bg-white text-[#8FA098]"
            }`}>
            {list.length}
          </span>
        </div>
        <div className={`mt-0.5 flex items-center gap-1.5 text-xs font-medium ${isToday ? "text-white/80" : "text-[#8FA098]"}`}>
          {dateLabel}
          {isToday && <span className="rounded-full bg-[#F4B860] px-1.5 py-px text-[10px] font-semibold text-[#5A3A06]">Today</span>}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-2.5">
        {active ? (
          list.map((s) => <SlotCard key={s.id} slot={s} isFresh={fresh.includes(s.id)} onRemove={() => onRemove(s.id)} compact />)
        ) : (
          <p className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-[#D5E2DC] bg-[#F7FAF8] px-2 py-6 text-center text-xs font-medium text-[#8FA098]">
            No slots
          </p>
        )}
      </div>
    </article>
  );
}

function SlotCard({ slot, isFresh, onRemove, compact = false, alwaysShowRemove = false }) {
  return (
    <div className={`group relative rounded-2xl bg-[#EEF6F1] ${
      isFresh ? "av-pop ring-2 ring-[#1F7A5A]/40" : ""
    } ${compact ? "p-3.5" : "flex items-center justify-between gap-3 px-4 py-3.5"}`}>

      {compact ? (
        <div className="pl-1.5">
          <div className="text-[13px] font-semibold leading-tight text-[#10281E]">{slot.start}</div>
          <div className="mt-0.5 text-xs font-medium text-[#5E7A6D]">to {slot.end}</div>
          <span className="mt-1.5 block text-[11px] font-medium text-[#1F7A5A]">{duration(slot)}</span>
        </div>
      ) : (
        <div className="flex items-center gap-3 pl-2">
          <span className="text-sm font-semibold text-[#10281E]">{slot.start} – {slot.end}</span>
          <span className="text-xs font-medium text-[#1F7A5A]">{duration(slot)}</span>
        </div>
      )}

      <button type="button" onClick={onRemove} aria-label={`Remove ${slot.start} to ${slot.end}`}
        className={`inline-flex items-center justify-center gap-1 rounded-lg text-rose-600 transition hover:bg-rose-50 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 ${
          compact
            ? "absolute right-2 top-2 h-7 w-7 border border-[#DCE6E1] bg-white opacity-0 group-hover:opacity-100"
            : `px-2.5 py-1.5 text-xs font-bold ${alwaysShowRemove ? "" : "opacity-0 group-hover:opacity-100"}`
        }`}>
        <Trash2 size={13} />
        {!compact && <span>Remove</span>}
      </button>
    </div>
  );
}

function SummaryRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3.5">
      <dt className="flex min-w-0 items-center gap-2.5 text-sm font-semibold text-[#66766F]">
        <Icon size={16} className="shrink-0 text-[#1F7A5A]" />
        <span className="truncate">{label}</span>
      </dt>
      <dd className="shrink-0 text-sm font-semibold">{value}</dd>
    </div>
  );
}