import React, { useEffect, useMemo, useState } from "react";
import {
  Check,
  CalendarDays,
  MessageCircle,
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCheck,
  Menu,
} from "lucide-react";

import Sidebar from "./Sidebar";

/* ============================================================
   DATA SETUP
============================================================ */

const NOTIFICATIONS = [
  {
    id: 1,
    group: "Today",
    categories: ["appointments"],
    icon: "calendar",
    title: "Upcoming Session",
    text: "John Smith has a session with you at 4:00 PM.",
    time: "10 minutes ago",
    unread: true,
    action: "View Session",
    page: "Sessions",
    primary: true,
  },
  {
    id: 2,
    group: "Today",
    categories: ["messages"],
    icon: "message",
    title: "New Message Received",
    text: "John Smith sent you a new message regarding therapy notes.",
    time: "25 minutes ago",
    unread: true,
    action: "Open Chat",
    page: "Chats",
  },
  {
    id: 3,
    group: "Today",
    categories: ["appointments", "reminders"],
    icon: "calendar",
    title: "Appointment Reminder",
    text: "Your session with Emma Wilson is scheduled for tomorrow at 11:00 AM.",
    time: "1 hour ago",
    unread: false,
    action: "View Schedule",
    page: "Sessions",
  },
  {
    id: 4,
    group: "Yesterday",
    categories: ["reminders"],
    icon: "alert",
    title: "Follow-up Reminder",
    text: "David Brown's routine follow-up evaluation is due today.",
    time: "Yesterday",
    unread: false,
    action: "View Patient",
    page: "Patients",
  },
  {
    id: 5,
    group: "Yesterday",
    categories: ["appointments"],
    icon: "check",
    title: "Session Completed",
    text: "Session with Sarah completed and recorded successfully.",
    time: "Yesterday",
    unread: false,
    action: "View Record",
    page: "Patients",
  },
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "appointments", label: "Appointments" },
  { key: "messages", label: "Messages" },
  { key: "reminders", label: "Reminders" },
];

const GROUPS = ["Today", "Yesterday"];

const ICON_CONFIG = {
  calendar: {
    icon: CalendarDays,
    bg: "bg-[#e8f5f3]",
    text: "text-[#136060]",
    border: "border-[#bce3de]",
  },
  message: {
    icon: MessageCircle,
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
  },
  alert: {
    icon: AlertTriangle,
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  check: {
    icon: Check,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
};

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

export default function Notifications({
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

  const [items, setItems] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState("all");

  const hasUnread = items.some((n) => n.unread);

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));

  const openItem = (n) => {
    setItems((prev) =>
      prev.map((x) => (x.id === n.id ? { ...x, unread: false } : x))
    );
    if (typeof onNavigate === "function") onNavigate(n.page);
  };

  const navigateFromDrawer = (page) => {
    setMobileNavOpen(false);
    if (typeof onNavigate === "function") onNavigate(page);
  };

  const visible = useMemo(
    () =>
      items.filter((n) => filter === "all" || n.categories.includes(filter)),
    [items, filter]
  );

  return (
    <div className="nt-root min-h-screen bg-[#f8fafc] font-sans text-slate-800 antialiased">
      <style>{`
        /* hide scrollbars everywhere, scrolling still works */
        html, body, .nt-root, .nt-root * { scrollbar-width: none; -ms-overflow-style: none; }
        html::-webkit-scrollbar, body::-webkit-scrollbar,
        .nt-root::-webkit-scrollbar, .nt-root *::-webkit-scrollbar { display: none; width: 0; height: 0; }
        .nt-root { overflow-x: clip; }

        @keyframes nt-fade { from { opacity: 0; } to { opacity: 1; } }
        .nt-backdrop { animation: nt-fade .2s ease both; }
        @media (prefers-reduced-motion: reduce) { .nt-backdrop { animation: none; } }
      `}</style>

      {/* ================= SIDEBAR ================= */}
      {isDesktop ? (
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={onToggleSidebar}
          activePage="Notifications"
          onNavigate={onNavigate}
          onLogout={onLogout}
          partnerName="Prem Zumble"
        />
      ) : (
        mobileNavOpen && (
          <>
            <div
              className="nt-backdrop fixed inset-0 z-40 bg-black/45"
              onClick={() => setMobileNavOpen(false)}
              aria-hidden="true"
            />
            <div className="relative z-50">
              <Sidebar
                collapsed={false}
                onToggle={() => setMobileNavOpen(false)}
                activePage="Notifications"
                onNavigate={navigateFromDrawer}
                onLogout={onLogout}
                partnerName="Prem Zumble"
              />
            </div>
          </>
        )
      )}

      {/* ================= MOBILE TOP BAR ================= */}
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-[#f8fafc]/90 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#136060] shadow-sm ring-1 ring-slate-200"
        >
          <Menu size={20} />
        </button>
        <span className="text-[15px] font-semibold text-slate-800">Notifications</span>
      </div>

      {/* ================= MAIN ================= */}
      <main
        className="relative min-h-screen transition-[margin] duration-300 ease-in-out lg:ml-[var(--sb)]"
        style={{ "--sb": `${sidebarWidth}px` }}
      >
        <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          {/* Header Card */}
          <header className="mb-5 overflow-hidden rounded-2xl border border-[#0d4a46] bg-[#032927] p-4 text-white shadow-md sm:mb-6 sm:p-7">
            <div className="flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">

              {/* Title Section */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white backdrop-blur-md sm:h-12 sm:w-12">
                  <Bell size={22} strokeWidth={2.2} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-[19px] font-extrabold tracking-tight text-white sm:text-2xl">
                      Notifications
                    </h1>
                    {hasUnread && (
                      <span className="inline-flex items-center rounded-full bg-emerald-400 px-2.5 py-0.5 text-[10px] font-extrabold text-slate-900 shadow-sm">
                        New
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[12px] font-medium leading-relaxed text-teal-100 sm:text-sm">
                    Stay updated with your patients, sessions, and daily reminders.
                  </p>
                </div>
              </div>

              {/* Action Toolbar: stacked on phones, one row from sm up */}
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
                {/* Mark All as Read */}
                <button
                  type="button"
                  onClick={markAllRead}
                  disabled={!hasUnread}
                  className={`group inline-flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 text-[13px] font-bold transition-all active:scale-95 sm:h-10 sm:w-auto sm:text-sm ${
                    hasUnread
                      ? "cursor-pointer bg-white text-[#136060] shadow-sm hover:bg-teal-50"
                      : "cursor-default border border-white/20 bg-white/10 text-teal-200/50"
                  }`}
                >
                  <CheckCheck
                    size={16}
                    strokeWidth={2.2}
                    className={hasUnread ? "text-[#136060]" : "text-teal-200/50"}
                  />
                  <span>{hasUnread ? "Mark all as read" : "All read"}</span>
                </button>
              </div>
            </div>

            {/* Filter Pills (scroll sideways on narrow screens) */}
            <nav
              aria-label="Notification categories"
              className="-mx-4 mt-4 flex items-center gap-2 overflow-x-auto border-t border-white/15 px-4 pt-4 text-xs sm:-mx-7 sm:mt-6 sm:px-7 lg:mx-0 lg:px-0"
            >
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={`shrink-0 cursor-pointer whitespace-nowrap rounded-xl px-4 py-2 font-semibold transition-all active:scale-95 ${
                    filter === f.key
                      ? "bg-white font-bold text-[#136060] shadow-sm"
                      : "bg-white/10 text-teal-100 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </nav>
          </header>

          {/* Empty State */}
          {visible.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center text-slate-500 shadow-xs sm:py-16">
              <Bell
                size={42}
                strokeWidth={1.5}
                className="mx-auto mb-3 text-slate-300"
              />
              <p className="text-sm font-bold text-slate-700">
                No notifications found
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Try a different category.
              </p>
            </div>
          )}

          {/* Notifications List Grouped By Date */}
          <div className="space-y-5 sm:space-y-6">
            {GROUPS.map((g) => {
              const list = visible.filter((n) => n.group === g);
              if (list.length === 0) return null;

              return (
                <section key={g}>
                  <h2 className="mb-3 px-1 text-xs font-bold uppercase tracking-wider text-slate-500">
                    {g}
                  </h2>

                  <div className="space-y-3">
                    {list.map((n) => (
                      <NotificationCard
                        key={n.id}
                        n={n}
                        onOpen={() => openItem(n)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   NOTIFICATION CARD
   mobile: text can wrap to 2 lines, time + button on a row below
   sm+: single row, text truncated
============================================================ */

function NotificationCard({ n, onOpen }) {
  const iconConfig = ICON_CONFIG[n.icon] || ICON_CONFIG.calendar;
  const Icon = iconConfig.icon;

  return (
    <article
      className={`group relative flex flex-col justify-between gap-3 rounded-2xl border p-3.5 shadow-2xs transition-all duration-200 hover:shadow-md sm:flex-row sm:items-center sm:gap-4 sm:px-6 sm:py-4 ${
        n.unread
          ? "border-[#bce3de] bg-[#f2f9f8] hover:bg-[#ebf6f4]"
          : "border-slate-200/90 bg-white hover:bg-slate-50/80"
      }`}
    >
      <div className="flex min-w-0 items-start gap-3 sm:flex-1 sm:items-center sm:gap-4">
        {/* Unread Indicator */}
        <div className="mt-4 flex h-3 w-3 shrink-0 items-center justify-center sm:mt-0">
          {n.unread ? (
            <span
              className="h-2.5 w-2.5 rounded-full bg-[#136060] ring-4 ring-[#e6f4f1]"
              title="Unread notification"
            />
          ) : (
            <span className="h-2 w-2 rounded-full bg-slate-200" />
          )}
        </div>

        {/* Category Icon Badge */}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${iconConfig.bg} ${iconConfig.text} ${iconConfig.border} transition-transform duration-200 group-hover:scale-105 sm:h-11 sm:w-11`}
        >
          <Icon size={20} strokeWidth={2} />
        </div>

        {/* Text Content */}
        <div className="min-w-0 flex-1">
          <h3
            className={`text-[13px] font-bold sm:truncate sm:text-sm ${
              n.unread ? "text-[#0f4c4c]" : "text-slate-800"
            }`}
          >
            {n.title}
          </h3>
          <p className="line-clamp-2 text-xs font-medium leading-relaxed text-slate-500 sm:line-clamp-1">
            {n.text}
          </p>
        </div>
      </div>

      {/* Time & Action Button */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200/60 pt-3 sm:justify-end sm:gap-4 sm:border-t-0 sm:pt-0">
        <time className="whitespace-nowrap text-[11px] font-semibold text-slate-400">
          {n.time}
        </time>

        <button
          type="button"
          onClick={onOpen}
          className={`group/btn inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition-all active:scale-95 sm:py-2 ${
            n.primary
              ? "bg-[#136060] text-white shadow-xs hover:bg-[#0e4b4b]"
              : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
          }`}
        >
          <span>{n.action}</span>
          <ArrowRight
            size={14}
            strokeWidth={2.2}
            className="transition-transform duration-200 group-hover/btn:translate-x-1"
          />
        </button>
      </div>
    </article>
  );
}