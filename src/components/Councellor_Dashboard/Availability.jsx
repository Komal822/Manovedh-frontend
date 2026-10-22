import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, CalendarPlus, CalendarDays, CalendarCheck, Clock, Plus, Info,
  MessageSquare, Trash2, Sparkles, CheckCircle2, Menu, X, Hourglass,
} from "lucide-react";
import Sidebar from "./Sidebar";

/* ================= DATA ================= */
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const UPCOMING_SESSION = "Today, 4:00 PM";

const INITIAL_SLOTS = {
  Monday: [{ id: 1, start: "10:00 AM", end: "12:00 PM" }, { id: 2, start: "4:00 PM", end: "6:00 PM" }],
  Tuesday: [{ id: 3, start: "11:00 AM", end: "1:00 PM" }],
  Wednesday: [{ id: 4, start: "10:00 AM", end: "12:00 PM" }, { id: 5, start: "3:00 PM", end: "5:00 PM" }],
  Thursday: [{ id: 6, start: "11:00 AM", end: "2:00 PM" }],
  Friday: [{ id: 7, start: "10:00 AM", end: "12:00 PM" }],
  Saturday: [{ id: 8, start: "9:00 AM", end: "11:00 AM" }],
  Sunday: [],
};

const TEMPLATES = [
  { label: "Weekdays (10 AM – 1 PM)", days: DAYS.slice(0, 5), start: "10:00 AM", end: "1:00 PM" },
  { label: "Weekday evenings (4 – 6 PM)", days: DAYS.slice(0, 5), start: "4:00 PM", end: "6:00 PM" },
  { label: "Weekend mornings (9 AM – 12 PM)", days: DAYS.slice(5), start: "9:00 AM", end: "12:00 PM" },
];

/* ================= TIME HELPERS ================= */
function fmtTime(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
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
function weekDates() {
  const now = new Date();
  const mon = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7));
  return DAYS.map((_, i) =>
    new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + i).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  );
}
const todayIndex = () => (new Date().getDay() + 6) % 7;

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
const CARD =
  "rounded-3xl bg-white border border-[#E6ECE8]";
const SELECT =
  "w-full cursor-pointer rounded-2xl border border-[#D5E3DC] bg-[#F7FAF8] px-4 py-3 text-base font-semibold text-[#10281E] outline-none transition focus:border-[#1F7A5A] focus:bg-white focus:ring-4 focus:ring-[#1F7A5A]/10 sm:py-2.5 sm:text-sm";
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

function Band({ left, right }) {
  return (
    <div className="flex items-center justify-between border-y border-[#E3EBE7] bg-[#F4F8F6] px-5 py-3 text-xs font-bold text-[#6B8077] sm:px-7">
      <span>{left}</span>
      {right && <span>{right}</span>}
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
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    if (isDesktop) {
      setMobileNavOpen(false);
      setSheetOpen(false);
    }
  }, [isDesktop]);

  const sidebarWidth = sidebarCollapsed ? 80 : 270;
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
  const totalHours = DAYS.reduce(
    (n, d) => n + slots[d].reduce((a, s) => a + (toMin(s.end) - toMin(s.start)), 0), 0
  ) / 60;
  const hoursLabel = `${Number.isInteger(totalHours) ? totalHours : totalHours.toFixed(1)}h`;

  const navigateFromDrawer = (page) => {
    setMobileNavOpen(false);
    if (typeof onNavigate === "function") onNavigate(page);
  };

  const tryAdd = (prev, d, s, e) => {
    if (toMin(e) <= toMin(s)) return { next: prev, err: "End time must be after start time." };
    if (prev[d].some((x) => overlaps(x, { start: s, end: e })))
      return { next: prev, err: `This time overlaps an existing slot on ${d}.` };
    const slot = { id: Date.now() + Math.random(), start: s, end: e };
    const list = [...prev[d], slot].sort((a, b) => toMin(a.start) - toMin(b.start));
    return { next: { ...prev, [d]: list }, err: "", slot };
  };

  const handleAdd = (ev) => {
    ev.preventDefault();
    if (!day) return setError("Please select a day.");
    const { next, err, slot } = tryAdd(slots, day, start, end);
    setError(err);
    if (!err) {
      setSlots(next);
      setFresh([slot.id]);
      setActiveTab(day);
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

  const removeSlot = (d, id) => setSlots((prev) => ({ ...prev, [d]: prev[d].filter((x) => x.id !== id) }));

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
        @keyframes av-sheet { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .av-backdrop { animation: av-fade .2s ease both; }
        .av-rise { animation: av-rise .5s cubic-bezier(.16,1,.3,1) both; }
        .av-pop { animation: av-pop .3s cubic-bezier(.2,.8,.2,1) both; }
        .av-sheet { animation: av-sheet .3s cubic-bezier(.16,1,.3,1) both; }
        @media (min-width: 1024px) { .av-sheet { animation: none; } }
        @media (prefers-reduced-motion: reduce) { .av-backdrop, .av-rise, .av-pop, .av-sheet { animation: none; } }
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
        <div className="mx-auto w-full max-w-[1400px] space-y-6 px-4 pb-28 pt-5 sm:px-6 sm:pt-7 lg:px-8 lg:pb-12">

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
                  Set the hours patients can book you. Changes apply to every week.
                </p>
              </div>
              <div className="flex items-center gap-7">
                <HeroStat value={hoursLabel} label="Hours / week" />
                <HeroStat value={totalSlots} label="Slots" />
                <HeroStat value={`${activeDays}/7`} label="Active days" />
              </div>
            </div>
          </header>

          {/* WEEKLY SCHEDULE */}
          <section aria-labelledby="av-week" className={`av-rise overflow-hidden ${CARD}`} style={{ animationDelay: "80ms" }}>
            <div className="flex items-center justify-between gap-3 p-5 sm:p-7">
              <div className="flex items-center gap-4">
                <IconTile><CalendarDays size={21} /></IconTile>
                <div className="min-w-0">
                  <h2 id="av-week" className="text-lg font-bold tracking-tight sm:text-[22px]">Weekly schedule</h2>
                  <p className="mt-0.5 hidden text-sm font-medium text-[#66766F] sm:block">
                    Your recurring working hours for each day.
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

            <Band left="This week" right={`${totalSlots} slots · ${hoursLabel}`} />

            <div className="p-4 sm:p-6">
              {/* Desktop grid */}
              <div className="hidden grid-cols-7 gap-3 lg:grid">
                {DAYS.map((d, i) => (
                  <DayColumn key={d} day={d} date={dates[i]} isToday={i === today} list={slots[d]}
                    fresh={fresh} onRemove={(id) => removeSlot(d, id)} />
                ))}
              </div>

              {/* Mobile tabs */}
              <div className="lg:hidden">
                <div role="tablist" aria-label="Days of the week" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-3">
                  {DAYS.map((d, i) => {
                    const selected = activeTab === d;
                    const count = slots[d].length;
                    return (
                      <button key={d} type="button" role="tab" aria-selected={selected} onClick={() => setActiveTab(d)}
                        className={`relative flex min-w-[68px] shrink-0 flex-col items-center rounded-2xl px-3 py-3 text-center transition-all ${FOCUS} ${
                          selected
                            ? "bg-[#176247] text-white"
                            : "border border-[#E0EBE5] bg-white text-[#5F6F68]"
                        }`}>
                        <span className="text-[13px] font-bold">{d.slice(0, 3)}</span>
                        <span className={`text-[11px] font-medium ${selected ? "text-white/75" : "text-[#8FA098]"}`}>{dates[i]}</span>
                        <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${count > 0 ? (selected ? "bg-[#9FE0BF]" : "bg-[#1F7A5A]") : "bg-transparent"}`} />
                        {i === today && !selected && (
                          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#E39A2D]" aria-label="Today" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div role="tabpanel" className="mt-3 space-y-3 rounded-3xl border border-[#E0EBE5] bg-white p-4">
                  <div className="flex items-baseline justify-between border-b border-[#E9EFEC] pb-3">
                    <h3 className="text-base font-bold">{activeTab}</h3>
                    <span className="rounded-full bg-[#E3F2EA] px-2.5 py-0.5 text-xs font-bold text-[#176247]">
                      {slots[activeTab].length > 0
                        ? `${slots[activeTab].length} slot${slots[activeTab].length > 1 ? "s" : ""}`
                        : "Inactive"}
                    </span>
                  </div>
                  {slots[activeTab].length > 0 ? (
                    slots[activeTab].map((s) => (
                      <SlotCard key={s.id} slot={s} isFresh={fresh.includes(s.id)}
                        onRemove={() => removeSlot(activeTab, s.id)} alwaysShowRemove />
                    ))
                  ) : (
                    <p className="rounded-2xl border border-dashed border-[#D5E2DC] bg-[#F7FAF8] px-4 py-8 text-center text-sm font-medium text-[#8FA098]">
                      No slots on {activeTab}. Tap “Add working time slot” to create one.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ADD PANEL + SUMMARY */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
            {sheetOpen && (
              <div className="av-backdrop fixed inset-0 z-40 bg-[#0A1F17]/50 backdrop-blur-sm lg:hidden"
                onClick={() => setSheetOpen(false)} aria-hidden="true" />
            )}

            <section aria-labelledby="av-add"
              className={`${sheetOpen ? "av-sheet block" : "hidden"} fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-[32px] border-t border-[#E0EBE5] bg-white p-6 shadow-2xl sm:p-7 lg:static lg:z-auto lg:col-span-7 lg:block lg:max-h-none lg:overflow-visible lg:rounded-[28px] lg:border lg:p-8 lg:border-[#E6ECE8]`}>
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#D5E2DC] lg:hidden" aria-hidden="true" />
              <div className="mb-6 flex items-start justify-between gap-3">
                <div className="flex items-center gap-4">
                  <IconTile><CalendarPlus size={21} /></IconTile>
                  <div className="min-w-0">
                    <h2 id="av-add" className="text-lg font-bold tracking-tight sm:text-xl">Add working time slot</h2>
                    <p className="mt-0.5 text-sm font-medium text-[#66766F]">Choose a day and the hours you are free.</p>
                  </div>
                </div>
                <button type="button" onClick={() => setSheetOpen(false)} aria-label="Close"
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F1F6F3] text-[#5F6F68] lg:hidden ${FOCUS}`}>
                  <X size={18} />
                </button>
              </div>

              <div className="mb-6 rounded-2xl bg-[#F5F9F7] p-4">
                <div className="mb-3 flex items-center gap-1.5 text-sm font-bold text-[#176247]">
                  <Sparkles size={15} /> Quick templates
                </div>
                <div className="flex flex-wrap gap-2">
                  {TEMPLATES.map((t) => (
                    <button key={t.label} type="button" onClick={() => applyTemplate(t)}
                      className={`rounded-full border border-[#CFE2D8] bg-white px-3.5 py-2 text-xs font-bold text-[#176247] transition hover:border-[#1F7A5A] hover:bg-[#E3F2EA] active:scale-95 ${FOCUS}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleAdd} className="space-y-5">
                <fieldset>
                  <legend className="mb-2 text-sm font-bold text-[#3F514A]">Day</legend>
                  <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                    {DAYS.map((d) => {
                      const on = day === d;
                      return (
                        <button key={d} type="button" aria-pressed={on} aria-label={d} onClick={() => setDay(d)}
                          className={`rounded-xl py-3 text-xs font-bold transition-all active:scale-95 ${FOCUS} ${
                            on
                              ? "bg-[#176247] text-white"
                              : "border border-transparent bg-[#F1F6F3] text-[#5F6F68] hover:border-[#CFE2D8] hover:bg-[#E6EFEA]"
                          }`}>
                          {d.slice(0, 3)}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="min-w-0">
                    <label htmlFor="av-start" className="mb-1.5 block text-sm font-bold text-[#3F514A]">Start time</label>
                    <select id="av-start" value={start} onChange={(e) => setStart(e.target.value)} className={SELECT}>
                      {TIME_OPTIONS.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="min-w-0">
                    <label htmlFor="av-end" className="mb-1.5 block text-sm font-bold text-[#3F514A]">End time</label>
                    <select id="av-end" value={end} onChange={(e) => setEnd(e.target.value)} className={SELECT}>
                      {TIME_OPTIONS.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                {error && (
                  <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                    {error}
                  </p>
                )}

                <button type="submit"
                  className={`flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#176247] text-sm font-bold text-white transition hover:bg-[#124F3A] active:scale-[0.99] ${FOCUS}`}>
                  <Plus size={18} strokeWidth={2.5} /> Add slot
                </button>
              </form>
            </section>

            {/* SUMMARY */}
            <aside className={`overflow-hidden lg:col-span-5 ${CARD}`}>
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
                  <SummaryRow icon={CalendarDays} label="Total weekly slots" value={String(totalSlots)} />
                  <SummaryRow icon={Hourglass} label="Hours per week" value={hoursLabel} />
                  <SummaryRow icon={CheckCircle2} label="Active working days" value={`${activeDays} days`} />
                  <SummaryRow icon={Clock} label="Upcoming session" value={UPCOMING_SESSION} />
                </dl>
              </div>

              <Band left="Need help?" />

              <div className="p-6 sm:p-7">
                <div className="mb-1 flex items-center gap-2 text-sm font-bold">
                  <Info size={16} className="text-[#1F7A5A]" /> Need help with scheduling?
                </div>
                <p className="mb-4 text-sm font-medium leading-relaxed text-[#66766F]">
                  If you face any sync issues or need custom working hours, reach out to support.
                </p>
                <button type="button" className={`${BTN_GHOST} ${FOCUS}`}>
                  <MessageSquare size={14} className="text-[#1F7A5A]" /> Contact support
                </button>
              </div>
            </aside>
          </div>
        </div>

        {/* MOBILE FAB */}
        {!sheetOpen && (
          <button type="button" onClick={() => setSheetOpen(true)}
            className={`fixed bottom-5 right-4 z-30 inline-flex h-14 items-center gap-2 rounded-full bg-[#176247] px-5 text-sm font-bold text-white shadow-lg transition active:scale-95 lg:hidden ${FOCUS}`}>
            <Plus size={18} strokeWidth={2.5} /> Add working time slot
          </button>
        )}
      </main>
    </div>
  );
}

/* ================= SUB-COMPONENTS ================= */
function DayColumn({ day, date, isToday, list, fresh, onRemove }) {
  const active = list.length > 0;
  return (
    <article aria-label={`${day}, ${date}${isToday ? ", today" : ""}`}
      className={`flex min-h-[260px] min-w-0 flex-col overflow-hidden rounded-3xl border bg-white ${
        isToday ? "border-[#1F7A5A]" : "border-[#E0EBE5]"
      }`}>
      <div className={`px-3.5 py-3 ${isToday ? "bg-[#176247] text-white" : "border-b border-[#E9EFEC] bg-[#F4F8F6]"}`}>
        <div className="flex items-center justify-between gap-1">
          <span className="text-sm font-extrabold" title={day}>{day.slice(0, 3)}</span>
          <span aria-label={`${list.length} slots`}
            className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
              isToday ? "bg-white/20 text-white" : active ? "bg-[#1F7A5A] text-white" : "border border-[#DCE6E1] bg-white text-[#8FA098]"
            }`}>
            {list.length}
          </span>
        </div>
        <div className={`mt-0.5 flex items-center gap-1.5 text-xs font-medium ${isToday ? "text-white/80" : "text-[#8FA098]"}`}>
          {date}
          {isToday && <span className="rounded-full bg-[#F4B860] px-1.5 py-px text-[10px] font-extrabold text-[#5A3A06]">Today</span>}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-2.5">
        {active ? (
          list.map((s) => <SlotCard key={s.id} slot={s} isFresh={fresh.includes(s.id)} onRemove={() => onRemove(s.id)} compact />)
        ) : (
          <p className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-[#D5E2DC] bg-[#F7FAF8] px-2 py-6 text-center text-xs font-medium text-[#8FA098]">
            Day off
          </p>
        )}
      </div>
    </article>
  );
}

function SlotCard({ slot, isFresh, onRemove, compact = false, alwaysShowRemove = false }) {
  return (
    <div className={`group relative rounded-2xl bg-[#EEF6F1] ${
      isFresh ? "av-pop" : ""
    } ${compact ? "p-3.5" : "flex items-center justify-between gap-3 px-4 py-3.5"}`}>
      

      {compact ? (
        <div className="pl-1.5">
          <div className="text-[13px] font-extrabold leading-tight text-[#10281E]">{slot.start}</div>
          <div className="mt-0.5 text-xs font-semibold text-[#5E7A6D]">to {slot.end}</div>
          <span className="mt-1.5 block text-[11px] font-bold text-[#1F7A5A]">
            {duration(slot)}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-3 pl-2">
          <span className="text-sm font-extrabold text-[#10281E]">{slot.start} – {slot.end}</span>
          <span className="text-xs font-bold text-[#1F7A5A]">
            {duration(slot)}
          </span>
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
      <dd className="shrink-0 text-sm font-extrabold">{value}</dd>
    </div>
  );
}