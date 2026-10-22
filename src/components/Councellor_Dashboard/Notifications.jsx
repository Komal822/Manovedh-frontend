import React, { useEffect, useMemo, useState } from "react";
import {
  Check, CalendarDays, MessageCircle, AlertTriangle, ArrowRight, CheckCheck, Menu, Sparkles,
} from "lucide-react";
import Sidebar from "./Sidebar";

/* ================= DATA ================= */
const NOTIFICATIONS = [
  { id: 1, group: "Today", categories: ["appointments"], icon: "calendar", title: "Upcoming session",
    text: "John Smith has a session scheduled with you at 4:00 PM.", time: "10 min ago", unread: true,
    action: "View session", page: "Sessions", primary: true },
  { id: 2, group: "Today", categories: ["messages"], icon: "message", title: "New message received",
    text: "John Smith sent you a new message regarding therapy notes.", time: "25 min ago", unread: true,
    action: "Open chat", page: "Chats" },
  { id: 3, group: "Today", categories: ["appointments", "reminders"], icon: "calendar", title: "Appointment reminder",
    text: "Your session with Emma Wilson is scheduled for tomorrow at 11:00 AM.", time: "1 hour ago", unread: false,
    action: "View schedule", page: "Sessions" },
  { id: 4, group: "Yesterday", categories: ["reminders"], icon: "alert", title: "Follow-up reminder",
    text: "David Brown's routine follow-up evaluation is due today.", time: "Yesterday", unread: false,
    action: "View patient", page: "Patients" },
  { id: 5, group: "Yesterday", categories: ["appointments"], icon: "check", title: "Session completed",
    text: "Session with Sarah completed and recorded successfully.", time: "Yesterday", unread: false,
    action: "View record", page: "Patients" },
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "appointments", label: "Appointments" },
  { key: "messages", label: "Messages" },
  { key: "reminders", label: "Reminders" },
];

const GROUPS = ["Today", "Yesterday"];

const ICON_CONFIG = {
  calendar: { icon: CalendarDays, cls: "bg-[#D3E7DA] text-[#176247]" },
  message: { icon: MessageCircle, cls: "bg-[#D6E6F0] text-[#245B7A]" },
  alert: { icon: AlertTriangle, cls: "bg-[#F4E4C6] text-[#8A5A0B]" },
  check: { icon: Check, cls: "bg-[#D3E7DA] text-[#176247]" },
};

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F7A5A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#DDE7E1]";

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
export default function Notifications({ onLogout, onNavigate, sidebarCollapsed = false, onToggleSidebar }) {
  const isDesktop = useIsDesktop();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (isDesktop) setMobileNavOpen(false);
  }, [isDesktop]);

  const sidebarWidth = sidebarCollapsed ? 80 : 272;

  const [items, setItems] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState("all");

  const unreadCount = items.filter((n) => n.unread).length;
  const hasUnread = unreadCount > 0;

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, unread: false })));

  const openItem = (n) => {
    setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, unread: false } : x)));
    if (typeof onNavigate === "function") onNavigate(n.page);
  };

  const navigateFromDrawer = (page) => {
    setMobileNavOpen(false);
    if (typeof onNavigate === "function") onNavigate(page);
  };

  const visible = useMemo(
    () => items.filter((n) => filter === "all" || n.categories.includes(filter)),
    [items, filter]
  );

  return (
    <div className="nt-root min-h-screen bg-[#DDE7E1] text-[#10281E] antialiased selection:bg-[#176247] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;700&display=swap');
        .nt-root, .nt-root button { font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif; }
        .nt-serif { font-family: 'Fraunces', Georgia, serif !important; font-optical-sizing: auto; }
        html, body, .nt-root, .nt-root * { scrollbar-width: none; -ms-overflow-style: none; }
        html::-webkit-scrollbar, body::-webkit-scrollbar, .nt-root::-webkit-scrollbar, .nt-root *::-webkit-scrollbar { display: none; width: 0; height: 0; }
        .nt-root { overflow-x: clip; }
        @keyframes nt-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes nt-rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        .nt-backdrop { animation: nt-fade .2s ease both; }
        .nt-rise { animation: nt-rise .45s cubic-bezier(.16,1,.3,1) both; }
        @media (prefers-reduced-motion: reduce) { .nt-backdrop, .nt-rise { animation: none; } }
      `}</style>

      {/* SIDEBAR */}
      {isDesktop ? (
        <Sidebar collapsed={sidebarCollapsed} onToggle={onToggleSidebar} activePage="Notifications"
          onNavigate={onNavigate} onLogout={onLogout} partnerName="Prem Zumble" />
      ) : (
        mobileNavOpen && (
          <>
            <div className="nt-backdrop fixed inset-0 z-40 bg-[#0A1F17]/50 backdrop-blur-sm"
              onClick={() => setMobileNavOpen(false)} aria-hidden="true" />
            <div className="relative z-50">
              <Sidebar collapsed={false} onToggle={() => setMobileNavOpen(false)} activePage="Notifications"
                onNavigate={navigateFromDrawer} onLogout={onLogout} partnerName="Prem Zumble" />
            </div>
          </>
        )
      )}

      {/* MOBILE TOP BAR */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#C2D3C9] bg-[#DDE7E1]/90 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setMobileNavOpen(true)} aria-label="Open menu"
            className={`flex h-10 w-10 items-center justify-center rounded-xl border border-[#C2D3C9] bg-white ${FOCUS}`}>
            <Menu size={20} />
          </button>
          <span className="text-[15px] font-bold">Notifications</span>
        </div>
        {hasUnread && (
          <span className="rounded-full bg-[#176247] px-3 py-1 text-xs font-bold text-white">{unreadCount} new</span>
        )}
      </div>

      {/* MAIN */}
      <main className="relative min-h-screen transition-[margin] duration-300 ease-in-out lg:ml-[var(--sb)]"
        style={{ "--sb": `${sidebarWidth}px` }}>
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8 sm:py-10 lg:px-10">

          {/* HEADING */}
          <header className="nt-rise mb-7 px-1">
            <h1 className="nt-serif text-[32px] font-bold leading-[1.1] tracking-tight sm:text-[44px]">Notifications</h1>
            <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-[#455A50] sm:text-base">
              {hasUnread
                ? `You have ${unreadCount} unread ${unreadCount > 1 ? "updates" : "update"} from your patients and sessions.`
                : "You're all caught up. New updates will show up here."}
            </p>
          </header>

          {/* FILTERS + MARK ALL READ */}
          <div className="nt-rise mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" style={{ animationDelay: "60ms" }}>
            <nav aria-label="Notification categories" className="-mx-1 flex items-center gap-1.5 overflow-x-auto px-1 pb-1">
              {FILTERS.map((f) => {
                const count = f.key === "all" ? items.length : items.filter((n) => n.categories.includes(f.key)).length;
                const isActive = filter === f.key;
                return (
                  <button key={f.key} type="button" onClick={() => setFilter(f.key)} aria-pressed={isActive}
                    className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition active:scale-95 ${FOCUS} ${
                      isActive ? "bg-[#176247] text-white" : "text-[#3F5148] hover:bg-[#CFDDD5]"
                    }`}>
                    {f.label}
                    <span className={`text-xs font-bold ${isActive ? "text-white/75" : "text-[#62766C]"}`}>{count}</span>
                  </button>
                );
              })}
            </nav>

            <button type="button" onClick={markAllRead} disabled={!hasUnread}
              className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-full px-4 text-xs font-bold transition active:scale-95 sm:self-auto ${FOCUS} ${
                hasUnread
                  ? "border border-[#B9CCC1] bg-white text-[#176247] hover:bg-[#E9F1EC]"
                  : "cursor-default text-[#62766C]"
              }`}>
              <CheckCheck size={15} strokeWidth={2.4} />
              {hasUnread ? "Mark all as read" : "All read"}
            </button>
          </div>

          {/* LIST */}
          <section className="nt-rise overflow-hidden rounded-3xl border border-[#C6D6CD] bg-white pb-2" style={{ animationDelay: "120ms" }}>
            {visible.length === 0 && (
              <div className="px-6 py-20 text-center sm:py-24">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#D3E7DA] text-[#176247]">
                  <Sparkles size={26} strokeWidth={1.8} />
                </div>
                <h3 className="text-base font-extrabold">Nothing here</h3>
                <p className="mt-1 text-sm font-medium text-[#455A50]">No notifications match this filter. Try “All”.</p>
              </div>
            )}

            {GROUPS.map((g) => {
              const list = visible.filter((n) => n.group === g);
              if (list.length === 0) return null;
              return (
                <div key={g}>
                  <div className="flex items-center justify-between border-b border-[#E3ECE6] bg-white px-6 pb-2 pt-5 text-sm font-extrabold text-[#10281E] sm:px-8 lg:px-10">
                    <span>{g}</span>
                    <span className="text-xs font-semibold text-[#62766C]">{list.length} {list.length > 1 ? "items" : "item"}</span>
                  </div>
                  <div className="divide-y divide-[#E3ECE6]">
                    {list.map((n) => <NotificationRow key={n.id} n={n} onOpen={() => openItem(n)} />)}
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </main>
    </div>
  );
}

/* ================= ROW ================= */
function NotificationRow({ n, onOpen }) {
  const cfg = ICON_CONFIG[n.icon] || ICON_CONFIG.calendar;
  const Icon = cfg.icon;

  return (
    <article className={`relative flex flex-col justify-between gap-3 px-6 py-6 transition-colors sm:flex-row sm:items-center sm:gap-8 sm:px-8 lg:px-10 ${
      "bg-white hover:bg-[#F6FAF7]"
    }`}>
      {n.unread && <span className="absolute inset-y-0 left-0 w-1 bg-[#176247]" aria-hidden="true" />}

      <div className="flex min-w-0 items-start gap-4 sm:flex-1 sm:items-center">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${cfg.cls}`}>
          <Icon size={19} strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-extrabold">{n.title}</h3>
            {n.unread && <span className="h-2 w-2 rounded-full bg-[#1F7A5A]" aria-label="Unread" />}
          </div>
          <p className="mt-1 line-clamp-2 text-sm font-medium leading-relaxed text-[#455A50] sm:line-clamp-1">{n.text}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-4 pl-16 sm:justify-end sm:pl-0">
        <time className="whitespace-nowrap text-xs font-semibold text-[#62766C]">{n.time}</time>
        <button type="button" onClick={onOpen}
          className={`group inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition active:scale-95 ${FOCUS} ${
            n.primary
              ? "bg-[#176247] text-white hover:bg-[#124F3A]"
              : "border border-[#B9CCC1] bg-white text-[#10281E] hover:bg-[#E9F1EC]"
          }`}>
          {n.action}
          <ArrowRight size={14} strokeWidth={2.2} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </article>
  );
}