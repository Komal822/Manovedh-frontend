import React, { useEffect, useMemo, useState } from "react";
import {
  Check, CalendarDays, MessageCircle, AlertTriangle, ArrowRight, CheckCheck, Menu, Sparkles,
  UserPlus, X, FlaskConical,
} from "lucide-react";
import Sidebar from "./Sidebar";
import {
  sessionStore, useSessions, useNow, simulatePatientRequest,
  joinState, sessionEnd, formatSlot, formatDay, timeAgo,
} from "./sessionStore";
import { JoinButton, RescheduleModal, VideoCallModal } from "./SessionUi";

/* ================= DATA ================= */
const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const BOOT = Date.now();

// Session sambandhi notifications store madhun yetat. Hyaa fakt messages / reminders.
const STATIC_ITEMS = [
  { id: "m1", kind: "info", categories: ["messages"], icon: "message", title: "New message received",
    text: "John Smith sent you a new message regarding therapy notes.", time: BOOT - 25 * MIN, unread: true,
    action: "Open chat", page: "Chats" },
  { id: "r1", kind: "info", categories: ["reminders"], icon: "alert", title: "Follow-up reminder",
    text: "David Brown's routine follow-up evaluation is due today.", time: BOOT - 26 * HOUR, unread: false,
    action: "View patient", page: "Patients" },
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "requests", label: "Requests" },
  { key: "appointments", label: "Appointments" },
  { key: "messages", label: "Messages" },
  { key: "reminders", label: "Reminders" },
];

const GROUPS = ["Today", "Yesterday", "Earlier"];

const ICON_CONFIG = {
  request: { icon: UserPlus, cls: "bg-[#F4E4C6] text-[#8A5A0B]" },
  calendar: { icon: CalendarDays, cls: "bg-[#D3E7DA] text-[#176247]" },
  message: { icon: MessageCircle, cls: "bg-[#D6E6F0] text-[#245B7A]" },
  alert: { icon: AlertTriangle, cls: "bg-[#F4E4C6] text-[#8A5A0B]" },
  check: { icon: Check, cls: "bg-[#D3E7DA] text-[#176247]" },
  declined: { icon: X, cls: "bg-[#F3D9DB] text-[#9B2C2C]" },
};

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F7A5A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#DDE7E1]";

const BTN = `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition active:scale-95 ${FOCUS}`;
const BTN_PRIMARY = `${BTN} bg-[#176247] text-white hover:bg-[#124F3A]`;
const BTN_OUTLINE = `${BTN} border border-[#B9CCC1] bg-white text-[#10281E] hover:bg-[#E9F1EC]`;
const BTN_DANGER = `${BTN} border border-[#E7BFC2] bg-white text-[#9B2C2C] hover:bg-[#FBEDEE]`;

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

/* Sessions -> notification items */
function buildItems(sessions, readIds, now) {
  const items = [];

  for (const s of sessions) {
    if (s.status === "pending") {
      items.push({ id: `req-${s.id}`, kind: "request", session: s, categories: ["requests"],
        icon: "request", title: "New session request", time: s.requestedAt, unread: !s.seen });
    } else if (s.status === "scheduled") {
      const soon = s.start - now < DAY && sessionEnd(s) > now;
      const recent = now - s.updatedAt < DAY;
      if (soon || recent) {
        items.push({ id: `ses-${s.id}`, kind: "scheduled", session: s, categories: ["appointments"],
          icon: "calendar", title: soon ? "Upcoming session" : "Session scheduled", time: s.updatedAt, unread: false });
      }
    } else if (s.status === "declined" && now - s.updatedAt < DAY) {
      items.push({ id: `dec-${s.id}`, kind: "declined", session: s, categories: ["requests"],
        icon: "declined", title: "Request declined", time: s.updatedAt, unread: false });
    } else if (s.status === "completed" && now - s.updatedAt < DAY) {
      items.push({ id: `done-${s.id}`, kind: "completed", session: s, categories: ["appointments"],
        icon: "check", title: "Session completed", time: s.updatedAt, unread: false });
    }
  }

  for (const it of STATIC_ITEMS) items.push({ ...it, unread: it.unread && !readIds.has(it.id) });

  // Action pahije astil te (pending requests) varti, baki navin pahile
  return items.sort((a, b) => (b.kind === "request") - (a.kind === "request") || b.time - a.time);
}

const groupOf = (ts, now) => {
  const d = formatDay(ts, now);
  return d === "Today" || d === "Yesterday" ? d : "Earlier";
};

/* ================= MAIN ================= */
export default function Notifications({ onLogout, onNavigate, sidebarCollapsed = false, onToggleSidebar }) {
  const isDesktop = useIsDesktop();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (isDesktop) setMobileNavOpen(false);
  }, [isDesktop]);

  const sidebarWidth = sidebarCollapsed ? 80 : 272;

  const sessions = useSessions();
  const now = useNow();

  const [readIds, setReadIds] = useState(() => new Set());
  const [filter, setFilter] = useState("all");
  const [rescheduling, setRescheduling] = useState(null); // { session, notice }
  const [activeCall, setActiveCall] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const items = useMemo(() => buildItems(sessions, readIds, now), [sessions, readIds, now]);

  const unreadCount = items.filter((n) => n.unread).length;
  const hasUnread = unreadCount > 0;

  const markAllRead = () => {
    sessionStore.markAllSeen();
    setReadIds(new Set(STATIC_ITEMS.map((i) => i.id)));
  };

  const navigateTo = (page) => {
    if (typeof onNavigate === "function") onNavigate(page);
  };

  const navigateFromDrawer = (page) => {
    setMobileNavOpen(false);
    navigateTo(page);
  };

  /* ---------- Request actions ---------- */
  const handleAccept = (s) => {
    const r = sessionStore.accept(s.id);
    if (r.ok) {
      setToast(`Session scheduled for ${formatSlot(s.start)}`);
      return;
    }
    // Vel gelela kiva dusra session clash hotoy -> counsellor la navin vel nivadayla lava
    setRescheduling({
      session: s,
      notice:
        r.reason === "conflict"
          ? `That slot clashes with ${r.conflict.patientName} at ${formatSlot(r.conflict.start)}. Pick another time.`
          : "The requested time has already passed. Pick a new time.",
    });
  };

  const handleDecline = (s) => {
    sessionStore.decline(s.id);
    setToast(`Request from ${s.patientName} declined`);
  };

  const handleJoin = (s) => {
    if (joinState(s, Date.now()) === "open") setActiveCall(s);
  };

  const handleEndCall = (notes) => {
    sessionStore.complete(activeCall.id, notes);
    setActiveCall(null);
  };

  const visible = useMemo(
    () => items.filter((n) => filter === "all" || n.categories.includes(filter)),
    [items, filter]
  );

  const pendingRequests = items.filter((n) => n.kind === "request").length;

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
              {pendingRequests > 0
                ? `${pendingRequests} session ${pendingRequests > 1 ? "requests need" : "request needs"} your reply.`
                : hasUnread
                ? `You have ${unreadCount} unread ${unreadCount > 1 ? "updates" : "update"} from your patients and sessions.`
                : "You're all caught up. New updates will show up here."}
            </p>
          </header>

          {/* FILTERS + ACTIONS */}
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

            <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
              {/* DEV ONLY: patient app nasel tar request test karayla. Production madhe kadhun tak. */}
              <button type="button" onClick={simulatePatientRequest}
                title="Demo only: simulate a patient request"
                className={`inline-flex h-10 items-center gap-2 rounded-full border border-dashed border-[#B9CCC1] px-4 text-xs font-bold text-[#455A50] transition hover:bg-[#E9F1EC] active:scale-95 ${FOCUS}`}>
                <FlaskConical size={15} strokeWidth={2.2} />
                Simulate request
              </button>

              <button type="button" onClick={markAllRead} disabled={!hasUnread}
                className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full px-4 text-xs font-bold transition active:scale-95 ${FOCUS} ${
                  hasUnread
                    ? "border border-[#B9CCC1] bg-white text-[#176247] hover:bg-[#E9F1EC]"
                    : "cursor-default text-[#62766C]"
                }`}>
                <CheckCheck size={15} strokeWidth={2.4} />
                {hasUnread ? "Mark all as read" : "All read"}
              </button>
            </div>
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
              const list = visible.filter((n) => groupOf(n.time, now) === g);
              if (list.length === 0) return null;
              return (
                <div key={g}>
                  <div className="flex items-center justify-between border-b border-[#E3ECE6] bg-white px-6 pb-2 pt-5 text-sm font-extrabold text-[#10281E] sm:px-8 lg:px-10">
                    <span>{g}</span>
                    <span className="text-xs font-semibold text-[#62766C]">{list.length} {list.length > 1 ? "items" : "item"}</span>
                  </div>
                  <div className="divide-y divide-[#E3ECE6]">
                    {list.map((n) => (
                      <NotificationRow key={n.id} item={n} now={now}
                        onNavigate={navigateTo}
                        onAccept={handleAccept}
                        onDecline={handleDecline}
                        onReschedule={(s) => setRescheduling({ session: s, notice: "" })}
                        onJoin={handleJoin} />
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </main>

      {/* MODALS */}
      {rescheduling && (
        <RescheduleModal
          session={rescheduling.session}
          notice={rescheduling.notice}
          onClose={() => setRescheduling(null)}
          onDone={(ts) => setToast(`Session scheduled for ${formatSlot(ts)}`)} />
      )}

      {activeCall && <VideoCallModal session={activeCall} onEnd={handleEndCall} />}

      {toast && (
        <div role="status"
          className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-[#10281E] px-5 py-3 text-sm font-semibold text-white shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}

/* ================= ROW ================= */
function describe(item, now) {
  const s = item.session;
  switch (item.kind) {
    case "request":
      return `${s.patientName} (${s.age} yrs · ${s.problem}) wants a session on ${formatSlot(s.start, now)}.`;
    case "scheduled":
      return `${s.patientName} · ${formatSlot(s.start, now)}${s.rescheduled ? " · Rescheduled" : ""}`;
    case "declined":
      return `You declined the session request from ${s.patientName}.`;
    case "completed":
      return `Session with ${s.patientName} completed${s.notes?.length ? ` with ${s.notes.length} ${s.notes.length > 1 ? "notes" : "note"}` : ""}.`;
    default:
      return item.text;
  }
}

function NotificationRow({ item, now, onNavigate, onAccept, onDecline, onReschedule, onJoin }) {
  const cfg = ICON_CONFIG[item.icon] || ICON_CONFIG.calendar;
  const Icon = cfg.icon;
  const s = item.session;

  return (
    <article className="relative flex flex-col justify-between gap-4 bg-white px-6 py-6 transition-colors hover:bg-[#F6FAF7] sm:px-8 lg:flex-row lg:items-center lg:gap-8 lg:px-10">
      {item.unread && <span className="absolute inset-y-0 left-0 w-1 bg-[#176247]" aria-hidden="true" />}

      <div className="flex min-w-0 items-start gap-4 lg:flex-1">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${cfg.cls}`}>
          <Icon size={19} strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-extrabold">{item.title}</h3>
            {item.unread && <span className="h-2 w-2 rounded-full bg-[#1F7A5A]" aria-label="Unread" />}
          </div>
          <p className="mt-1 line-clamp-2 text-sm font-medium leading-relaxed text-[#455A50]">{describe(item, now)}</p>
          {item.kind === "request" && s.note && (
            <p className="mt-1 line-clamp-1 text-xs font-medium italic text-[#62766C]">“{s.note}”</p>
          )}
          <time className="mt-1.5 block text-xs font-semibold text-[#62766C]">{timeAgo(item.time, now)}</time>
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-2 pl-16 lg:shrink-0 lg:justify-end lg:pl-0">
        {item.kind === "request" && (
          <>
            <button type="button" onClick={() => onDecline(s)} className={BTN_DANGER}>Decline</button>
            <button type="button" onClick={() => onReschedule(s)} className={BTN_OUTLINE}>Reschedule</button>
            <button type="button" onClick={() => onAccept(s)} className={BTN_PRIMARY}>Accept</button>
          </>
        )}

        {item.kind === "scheduled" && (
          <>
            <button type="button" onClick={() => onReschedule(s)} className={BTN_OUTLINE}>Reschedule</button>
            <JoinButton session={s} now={now} onJoin={onJoin} />
          </>
        )}

        {(item.kind === "declined" || item.kind === "completed") && (
          <button type="button" onClick={() => onNavigate("Patients")} className={BTN_OUTLINE}>
            View patient
            <ArrowRight size={14} strokeWidth={2.2} />
          </button>
        )}

        {item.kind === "info" && (
          <button type="button" onClick={() => onNavigate(item.page)} className={BTN_OUTLINE}>
            {item.action}
            <ArrowRight size={14} strokeWidth={2.2} />
          </button>
        )}
      </div>
    </article>
  );
}