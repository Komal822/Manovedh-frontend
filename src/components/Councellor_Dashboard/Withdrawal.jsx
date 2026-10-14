import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Lightbulb,
  CheckCircle2,
  Keyboard,
  Send,
  ChevronRight,
  Info,
  HelpCircle,
  ShieldCheck,
  FileText,
  CalendarCheck,
  Sparkles,
  Menu,
} from "lucide-react";

import Sidebar from "./Sidebar";

/* ============================================================
   CONFIG
============================================================ */
const NOTICE_DAYS = 14;
const ACTIVE_CASES = 0;
const CONFIRM_WORD = "WITHDRAW";

// Top-right header illustration (Optional)
const HERO_IMAGE = "";

const STEPS = [
  "You will be removed from the wellness partner directory immediately.",
  "You may still log in to complete existing sessions and cases during the notice period.",
  "At the effective date your access is revoked, remaining scheduled sessions are cancelled, and the affected patients are notified.",
  "If you have no active cases, your withdrawal takes effect immediately.",
];

const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const fmtDate = (d) =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

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
   MAIN COMPONENT
============================================================ */
export default function Withdrawal({
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

  const sidebarWidth = sidebarCollapsed ? 80 : 270;

  const [text, setText] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(null);

  const confirmed = text.trim().toUpperCase() === CONFIRM_WORD;
  const submitted = effectiveDate !== null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!confirmed) return;

    // TODO: Connect API call here
    setEffectiveDate(addDays(new Date(), NOTICE_DAYS));
    setText("");
  };

  const handleCancel = () => {
    // TODO: Connect API call here to cancel withdrawal
    setEffectiveDate(null);
  };

  const navigateFromDrawer = (page) => {
    setMobileNavOpen(false);
    if (typeof onNavigate === "function") onNavigate(page);
  };

  const QUICK_INFO = [
    { icon: CalendarDays, label: "Notice Period", value: `${NOTICE_DAYS} Days` },
    { icon: FileText, label: "Active Cases", value: String(ACTIVE_CASES) },
    { icon: ShieldCheck, label: "Post-Access", value: "Revoked" },
  ];

  return (
    <div
      className="wd-root min-h-screen text-[#132A1E] antialiased selection:bg-[#C7E2D4]"
      style={{
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        background:
          "radial-gradient(1400px 600px at 0% 0%, #E2F1E8 0%, transparent 60%), radial-gradient(1000px 600px at 100% 20%, #EBF5F0 0%, transparent 50%), #F5F9F7",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        /* hide scrollbars everywhere, scrolling still works */
        html, body, .wd-root, .wd-root * { scrollbar-width: none; -ms-overflow-style: none; }
        html::-webkit-scrollbar, body::-webkit-scrollbar,
        .wd-root::-webkit-scrollbar, .wd-root *::-webkit-scrollbar { display: none; width: 0; height: 0; }
        .wd-root { overflow-x: clip; }

        @keyframes wd-fade { from { opacity: 0; } to { opacity: 1; } }
        .wd-backdrop { animation: wd-fade .2s ease both; }
        @media (prefers-reduced-motion: reduce) { .wd-backdrop { animation: none; } }
      `}</style>

      {/* ================= SIDEBAR ================= */}
      {isDesktop ? (
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={onToggleSidebar}
          activePage="Withdrawal"
          onNavigate={onNavigate}
          onLogout={onLogout}
          partnerName="Prem Zumble"
        />
      ) : (
        mobileNavOpen && (
          <>
            <div
              className="wd-backdrop fixed inset-0 z-40 bg-black/45"
              onClick={() => setMobileNavOpen(false)}
              aria-hidden="true"
            />
            <div className="relative z-50">
              <Sidebar
                collapsed={false}
                onToggle={() => setMobileNavOpen(false)}
                activePage="Withdrawal"
                onNavigate={navigateFromDrawer}
                onLogout={onLogout}
                partnerName="Prem Zumble"
              />
            </div>
          </>
        )
      )}

      {/* ================= MOBILE TOP BAR ================= */}
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-emerald-900/10 bg-[#F5F9F7]/90 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0E5135] shadow-sm ring-1 ring-emerald-900/10"
        >
          <Menu size={20} />
        </button>
        <span className="text-[15px] font-semibold text-[#0B2B1D]">Account Withdrawal</span>
      </div>

      {/* ================= MAIN ================= */}
      <main
        className="min-h-screen transition-[margin] duration-300 ease-in-out lg:ml-[var(--sb)]"
        style={{ "--sb": `${sidebarWidth}px` }}
      >
        <div className="relative mx-auto max-w-6xl px-3 py-4 sm:p-6 lg:p-10">
          {/* Header */}
          <header className="relative flex items-center justify-between pb-5 pt-1 sm:pb-8 sm:pt-2">
            <div className="z-10 max-w-xl">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate("Profile Settings")}
                className="group mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/60 px-3.5 py-2 text-xs font-semibold text-[#0B2B1D] shadow-xs backdrop-blur-md transition-all hover:bg-white hover:shadow-sm sm:py-1.5"
              >
                <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
                Back to Account Settings
              </button>

              <h1 className="text-[22px] font-extrabold leading-tight tracking-tight text-[#0B2B1D] sm:text-3xl lg:text-4xl">
                Account Withdrawal
              </h1>
              <p className="mt-1.5 text-[12.5px] font-medium leading-relaxed text-[#466B59] sm:text-sm">
                Initiate or review your {NOTICE_DAYS}-day partner withdrawal process.
              </p>
            </div>

            {HERO_IMAGE && (
              <img
                src={HERO_IMAGE}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-0 hidden h-44 w-auto object-contain lg:block"
              />
            )}
          </header>

          <div className="grid grid-cols-1 items-start gap-4 sm:gap-6 lg:grid-cols-12">
            {/* LEFT SECTION */}
            <section className="flex min-w-0 flex-col gap-4 sm:gap-6 lg:col-span-8">
              {/* Info Overview Card */}
              <article className="relative overflow-hidden rounded-2xl border border-emerald-900/5 bg-white p-4 shadow-sm sm:p-8">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100/70 text-[#0E5135] shadow-xs sm:h-12 sm:w-12">
                    <CalendarDays size={22} strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-[#0B2B1D] sm:text-xl">
                      Withdrawal Guidelines
                    </h2>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-[#466B59] sm:text-sm">
                      As an active partner, you may request account closure by issuing a mandatory{" "}
                      <strong className="font-semibold text-[#0B2B1D]">
                        {NOTICE_DAYS}-day written notice
                      </strong>
                      . All ongoing commitments must be fulfilled before final closure.
                    </p>
                  </div>
                </div>

                {/* What Happens Next Section */}
                <div className="mt-5 rounded-xl border border-emerald-100 bg-[#F2F8F4] p-4 sm:mt-6 sm:p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-800 text-white">
                      <Lightbulb size={14} />
                    </div>
                    <h3 className="text-[13px] font-bold text-[#0B2B1D] sm:text-sm">
                      What happens after submitting?
                    </h3>
                  </div>

                  <ul className="space-y-3 text-[12.5px] text-[#294B3C] sm:text-[13px]">
                    {STEPS.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2
                          size={16}
                          className="mt-0.5 shrink-0 fill-emerald-100 text-emerald-600"
                        />
                        <span className="leading-snug">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>

              {/* Action/Form Card */}
              <article className="rounded-2xl border border-emerald-900/5 bg-white p-4 shadow-sm sm:p-8">
                {submitted ? (
                  <SubmittedNotice
                    date={fmtDate(effectiveDate)}
                    activeCases={ACTIVE_CASES}
                    onCancel={handleCancel}
                  />
                ) : (
                  <>
                    <h3 className="mb-1 text-base font-bold text-[#0B2B1D]">
                      Confirm Withdrawal
                    </h3>
                    <label
                      htmlFor="withdraw-input"
                      className="mb-4 block text-[12.5px] font-medium leading-relaxed text-[#466B59] sm:text-sm"
                    >
                      Please type <span className="font-bold text-[#0B2B1D] underline">{CONFIRM_WORD}</span> below to authorize this action:
                    </label>

                    <form
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-3 sm:flex-row sm:items-center"
                    >
                      <div className="relative min-w-0 flex-grow">
                        {/* text-base on mobile stops iOS from zooming on focus */}
                        <input
                          id="withdraw-input"
                          type="text"
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          placeholder={`Type "${CONFIRM_WORD}"`}
                          autoComplete="off"
                          autoCapitalize="characters"
                          className="h-12 w-full rounded-xl border border-emerald-200 bg-white pl-4 pr-11 text-base font-medium text-[#0B2B1D] shadow-2xs outline-none transition-all placeholder:text-emerald-900/30 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 sm:text-sm"
                        />
                        <Keyboard
                          size={18}
                          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-800/40"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={!confirmed}
                        className={`inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-6 text-sm font-bold text-white shadow-sm transition-all active:scale-[0.98] sm:w-auto ${
                          confirmed
                            ? "cursor-pointer bg-[#0E5135] shadow-emerald-900/10 hover:bg-[#0A3D28]"
                            : "cursor-not-allowed bg-[#0E5135]/40"
                        }`}
                      >
                        <Send size={15} />
                        Submit Notice
                        <ChevronRight size={14} />
                      </button>
                    </form>

                    <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50/50 px-3.5 py-3 sm:items-center sm:px-4">
                      <Info size={16} className="mt-0.5 shrink-0 text-emerald-700 sm:mt-0" />
                      <p className="text-xs leading-relaxed text-[#294B3C]">
                        Submitting begins your official {NOTICE_DAYS}-day notice. You may cancel this request anytime before effective termination.
                      </p>
                    </div>
                  </>
                )}

                <div className="mt-5 border-t border-emerald-100/60 pt-4 sm:mt-6">
                  <div className="flex items-start gap-2 text-xs leading-relaxed text-[#466B59]">
                    <HelpCircle size={15} className="mt-0.5 shrink-0 text-emerald-700" />
                    <span>
                      Need clarification? Read our{" "}
                      <a
                        href="#agreement"
                        className="font-bold text-[#0E5135] underline underline-offset-2 hover:text-[#0B2B1D]"
                      >
                        Wellness Partner Terms &amp; Policy
                      </a>
                    </span>
                  </div>
                </div>
              </article>
            </section>

            {/* RIGHT SIDE INFO
                mobile: stacked | md–lg: 2 columns | lg+: side column */}
            <aside className="grid min-w-0 grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:col-span-4 lg:flex lg:flex-col">
              {/* Wellness Card */}
              <article className="relative overflow-hidden rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-[#E2F2E9] to-[#D5EADF] p-5 shadow-sm sm:p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0E5135] text-white shadow-xs">
                  <Sparkles size={20} />
                </div>

                <h3 className="text-base font-bold text-[#0B2B1D] sm:text-lg">
                  Take Time For Yourself
                </h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-[#2E5241] sm:text-sm">
                  Stepping back can be a healthy choice. Prioritizing your own well-being ensures better care for others.
                </p>

                <div className="mt-4 flex justify-end">
                  <svg
                    className="h-8 w-20 fill-none stroke-current text-[#0E5135]/40"
                    strokeWidth="2.5"
                    viewBox="0 0 70 30"
                    aria-hidden="true"
                  >
                    <path
                      d="M 5 18 C 15 25, 22 22, 28 14 C 31 8, 38 8, 38 14 C 38 20, 26 25, 34 22 C 44 18, 55 10, 60 8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </article>

              {/* Quick Info Component */}
              <article className="rounded-2xl border border-emerald-900/5 bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-4 flex items-center gap-2 border-b border-emerald-100/60 pb-3">
                  <Info size={16} className="text-emerald-700" />
                  <h3 className="text-sm font-bold text-[#0B2B1D]">Quick Overview</h3>
                </div>

                <div className="space-y-3">
                  {QUICK_INFO.map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="group flex items-center justify-between gap-2 rounded-xl border border-emerald-100/80 bg-[#F9FCFA] p-3 transition-all hover:border-emerald-200 hover:bg-emerald-50/40"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100/60 text-[#0E5135] transition-colors group-hover:bg-emerald-200/60">
                          <Icon size={18} />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-[11px] font-semibold text-[#537363]">
                            {label}
                          </div>
                          <div className="truncate text-sm font-bold text-[#0B2B1D]">
                            {value}
                          </div>
                        </div>
                      </div>
                      <ChevronRight
                        size={15}
                        className="shrink-0 text-emerald-800/30 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-800"
                      />
                    </div>
                  ))}
                </div>
              </article>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   SUBMITTED NOTICE VIEW
============================================================ */
function SubmittedNotice({ date, activeCases, onCancel }) {
  return (
    <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3 sm:gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-xs">
            <CalendarCheck size={22} />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-[#0B2B1D] sm:text-base">
              Notice Active &amp; Submitted
            </h3>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[#2E5241] sm:text-sm">
              {activeCases === 0
                ? "You have zero active cases; account withdrawal process completes immediately."
                : `Your effective withdrawal date is scheduled for ${date}. Please wrap up active cases until then.`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="h-11 w-full shrink-0 rounded-xl border border-emerald-800/20 bg-white px-4 text-xs font-bold text-[#0E5135] shadow-2xs transition-all hover:bg-emerald-100/50 hover:text-[#0B2B1D] active:scale-[0.98] sm:h-10 sm:w-auto"
        >
          Cancel Withdrawal
        </button>
      </div>
    </div>
  );
}