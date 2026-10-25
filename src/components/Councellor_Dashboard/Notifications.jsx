import React, { useEffect, useMemo, useState, useSyncExternalStore } from "react";
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

const STATIC_ITEMS = [
  { id: "r1", kind: "info", categories: ["reminders"], icon: "alert", title: "Follow-up reminder",
    text: "David Brown's routine follow-up evaluation is due today.", time: BOOT - 26 * HOUR, unread: false,
    action: "View patient", page: "Patients" },
];

/* ---- Chat notifications store (replace with your real chat data later) ---- */
const chatStore = (() => {
  let msgs = [
    { id: "c1", from: "John Smith", text: "Can we discuss my therapy notes before tomorrow?", time: BOOT - 25 * MIN, read: false },
  ];
  const subs = new Set();
  const emit = () => subs.forEach((f) => f());
  return {
    get: () => msgs,
    subscribe: (f) => { subs.add(f); return () => subs.delete(f); },
    add: (m) => { msgs = [{ id: `c${Date.now()}`, read: false, time: Date.now(), ...m }, ...msgs]; emit(); },
    markRead: (id) => { msgs = msgs.map((m) => (m.id === id ? { ...m, read: true } : m)); emit(); },
    markAllRead: () => { msgs = msgs.map((m) => ({ ...m, read: true })); emit(); },
  };
})();

const useChatMessages = () => useSyncExternalStore(chatStore.subscribe, chatStore.get);

const DEMO_SENDERS = ["Priya Patil", "Rahul Deshmukh", "Anita Joshi", "Sameer Kulkarni"];
const DEMO_TEXTS = [
  "Hi doctor, I need to reschedule my next session.",
  "Thank you, the exercises are really helping.",
  "Can you share the notes from today's session?",
  "I have a quick question about my medication.",
];
const simulateChatMessage = () =>
  chatStore.add({
    from: DEMO_SENDERS[Math.floor(Math.random() * DEMO_SENDERS.length)],
    text: DEMO_TEXTS[Math.floor(Math.random() * DEMO_TEXTS.length)],
  });

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
  calendar: { icon: CalendarDays, cls: "bg-[#E3F4F1] text-[#2A8C82]" },
  message: { icon: MessageCircle, cls: "bg-[#DDEFF0] text-[#1F6F68]" },
  alert: { icon: AlertTriangle, cls: "bg-[#F4E4C6] text-[#8A5A0B]" },
  check: { icon: Check, cls: "bg-[#E3F4F1] text-[#2A8C82]" },
  declined: { icon: X, cls: "bg-[#F3D9DB] text-[#9B2C2C]" },
};

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A8C82] focus-visible:ring-offset-2 focus-visible:ring-offset-[#ECF5F4]";

/* Buttons: compact on mobile, normal from sm: up */
const BTN = `inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-[11px] font-bold transition active:scale-95 sm:px-4 sm:text-xs ${FOCUS}`;
const BTN_PRIMARY = `${BTN} bg-[#184D43] text-white hover:bg-[#123A32]`;
const BTN_OUTLINE = `${BTN} border border-[#CFE6E3] bg-white text-[#122A2E] hover:bg-[#F0F9F7]`;
const BTN_DANGER = `${BTN} border border-[#E7BFC2] bg-white text-[#9B2C2C] hover:bg-[#FBEDEE]`;
const BTN_DEMO = `inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-dashed border-[#CFE6E3] px-3 text-[11px] font-bold text-[#5B7A7E] transition hover:bg-[#F0F9F7] active:scale-95 sm:h-10 sm:gap-2 sm:px-4 sm:text-xs ${FOCUS}`;

/* Themed thin scrollbar — same colors as other pages */
const SCROLLBAR_CSS = `
  html,
  .nt-root,
  .nt-root * {
    scrollbar-width: thin;
    scrollbar-color: #2A8C82 #E6F2F0;
  }
  .nt-root .nt-noscroll { scrollbar-width: none; }

  @supports selector(::-webkit-scrollbar) {
    html,
    .nt-root,
    .nt-root * {
      scrollbar-width: auto;
      scrollbar-color: auto;
    }
    html::-webkit-scrollbar,
    .nt-root::-webkit-scrollbar,
    .nt-root *::-webkit-scrollbar { width: 6px; height: 6px; }
    html::-webkit-scrollbar-track,
    .nt-root::-webkit-scrollbar-track,
    .nt-root *::-webkit-scrollbar-track { background: #E6F2F0; }
    html::-webkit-scrollbar-thumb,
    .nt-root::-webkit-scrollbar-thumb,
    .nt-root *::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #2A8C82 0%, #22B8AA 100%);
      border-radius: 999px;
    }
    html::-webkit-scrollbar-thumb:hover,
    .nt-root::-webkit-scrollbar-thumb:hover,
    .nt-root *::-webkit-scrollbar-thumb:hover { background: #1E9E93; }
    html::-webkit-scrollbar-corner,
    .nt-root::-webkit-scrollbar-corner,
    .nt-root *::-webkit-scrollbar-corner { background: transparent; }
    .nt-root .nt-noscroll::-webkit-scrollbar { display: none; width: 0; height: 0; }
  }
`;

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

function buildItems(sessions, chats, readIds, now) {
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
          icon: "calendar", title: soon ? "Upcoming session" : s.rescheduled ? "Session rescheduled" : "Session scheduled", time: s.updatedAt, unread: false });
      }
    } else if (s.status === "declined" && now - s.updatedAt < DAY) {
      items.push({ id: `dec-${s.id}`, kind: "declined", session: s, categories: ["requests"],
        icon: "declined", title: "Request declined", time: s.updatedAt, unread: false });
    } else if (s.status === "completed" && now - s.updatedAt < DAY) {
      items.push({ id: `done-${s.id}`, kind: "completed", session: s, categories: ["appointments"],
        icon: "check", title: "Session completed", time: s.updatedAt, unread: false });
    }
  }

  for (const m of chats) {
    items.push({ id: `chat-${m.id}`, kind: "chat", chat: m, categories: ["messages"],
      icon: "message", title: "New message received", time: m.time, unread: !m.read });
  }

  for (const it of STATIC_ITEMS) items.push({ ...it, unread: it.unread && !readIds.has(it.id) });

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

  const sidebarWidth = sidebarCollapsed ? 80 : 272;

  const sessions = useSessions();
  const chats = useChatMessages();
  const now = useNow();

  const [readIds, setReadIds] = useState(() => new Set());
  const [filter, setFilter] = useState("all");
  const [rescheduling, setRescheduling] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const items = useMemo(() => buildItems(sessions, chats, readIds, now), [sessions, chats, readIds, now]);

  const unreadCount = items.filter((n) => n.unread).length;
  const hasUnread = unreadCount > 0;

  const markAllRead = () => {
    sessionStore.markAllSeen();
    chatStore.markAllRead();
    setReadIds(new Set(STATIC_ITEMS.map((i) => i.id)));
  };

  const navigateTo = (page) => {
    if (typeof onNavigate === "function") onNavigate(page);
  };

  const navigateFromDrawer = (page) => {
    setMobileNavOpen(false);
    navigateTo(page);
  };

  const handleAccept = (s) => {
    const r = sessionStore.accept(s.id);
    if (r.ok) {
      setToast(`Session scheduled for ${formatSlot(s.start)}`);
      return;
    }
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

  const handleOpenChat = (m) => {
    chatStore.markRead(m.id);
    navigateTo("Chats");
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
    <div className="nt-root min-h-[100dvh] bg-[#ECF5F4] text-[#122A2E] antialiased selection:bg-[#2A8C82] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .nt-root, .nt-root button { font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif; }
        .nt-serif { font-family: 'Fraunces', Georgia, serif !important; font-optical-sizing: auto; letter-spacing: -0.01em; }
        .nt-root { overflow-x: clip; }
        .nt-root button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }

        ${SCROLLBAR_CSS}

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
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#DEEEEE] bg-[#ECF5F4]/90 px-3 py-2.5 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-2.5">
          <button type="button" onClick={() => setMobileNavOpen(true)} aria-label="Open menu"
            className={`flex h-9 w-9 items-center justify-center rounded-xl border border-[#DEEEEE] bg-white ${FOCUS}`}>
            <Menu size={18} />
          </button>
          <span className="text-sm font-bold">Notifications</span>
        </div>
        {hasUnread && (
          <span className="rounded-full bg-[#184D43] px-2.5 py-1 text-[11px] font-bold text-white">{unreadCount} new</span>
        )}
      </div>

      {/* MAIN */}
      <main className="relative min-h-[100dvh] transition-[margin] duration-300 ease-in-out lg:ml-[var(--sb)]"
        style={{ "--sb": `${sidebarWidth}px` }}>
        <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-8 sm:py-10 lg:px-10">

          {/* HEADING */}
          <header className="nt-rise mb-4 px-1 sm:mb-7">
            <h1 className="nt-serif text-[22px] font-semibold leading-[1.1] tracking-tight sm:text-[44px]">Notifications</h1>
            <p className="mt-1.5 max-w-xl text-[12px] font-medium leading-relaxed text-[#5B7A7E] sm:mt-3 sm:text-base">
              {pendingRequests > 0
                ? `${pendingRequests} session ${pendingRequests > 1 ? "requests need" : "request needs"} your reply.`
                : hasUnread
                ? `You have ${unreadCount} unread ${unreadCount > 1 ? "updates" : "update"} from your patients and sessions.`
                : "You're all caught up. New updates will show up here."}
            </p>
          </header>

          {/* FILTERS + ACTIONS */}
          <div className="nt-rise mb-3 flex flex-col gap-2.5 sm:mb-5 sm:flex-row sm:items-center sm:justify-between sm:gap-3" style={{ animationDelay: "60ms" }}>
            <nav aria-label="Notification categories" className="nt-noscroll -mx-3 flex items-center gap-1.5 overflow-x-auto px-3 pb-1 sm:mx-0 sm:px-1">
              {FILTERS.map((f) => {
                const count = f.key === "all" ? items.length : items.filter((n) => n.categories.includes(f.key)).length;
                const isActive = filter === f.key;
                return (
                  <button key={f.key} type="button" onClick={() => setFilter(f.key)} aria-pressed={isActive}
                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-bold transition active:scale-95 sm:px-4 sm:py-2.5 sm:text-xs ${FOCUS} ${
                      isActive ? "bg-[#184D43] text-white" : "text-[#5B7A7E] hover:bg-[#E3F4F1]"
                    }`}>
                    {f.label}
                    <span className={`text-[11px] font-bold sm:text-xs ${isActive ? "text-white/75" : "text-[#5B7A7E]"}`}>{count}</span>
                  </button>
                );
              })}
            </nav>

            <div className="flex shrink-0 flex-wrap items-center gap-2 [&>button]:flex-1 sm:[&>button]:flex-none">
              <button type="button" onClick={simulatePatientRequest}
                title="Demo only: simulate a patient request"
                className={BTN_DEMO}>
                <FlaskConical size={14} strokeWidth={2.2} />
                Simulate request
              </button>

              <button type="button" onClick={simulateChatMessage}
                title="Demo only: simulate a chat message"
                className={BTN_DEMO}>
                <MessageCircle size={14} strokeWidth={2.2} />
                Simulate message
              </button>

              <button type="button" onClick={markAllRead} disabled={!hasUnread}
                className={`inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full px-3 text-[11px] font-bold transition active:scale-95 sm:h-10 sm:gap-2 sm:px-4 sm:text-xs ${FOCUS} ${
                  hasUnread
                    ? "border border-[#CFE6E3] bg-white text-[#2A8C82] hover:bg-[#F0F9F7]"
                    : "cursor-default text-[#5B7A7E]"
                }`}>
                <CheckCheck size={14} strokeWidth={2.4} />
                {hasUnread ? "Mark all as read" : "All read"}
              </button>
            </div>
          </div>

          {/* LIST */}
          <section className="nt-rise overflow-hidden rounded-2xl border border-[#DEEEEE] bg-white pb-1 sm:rounded-3xl sm:pb-2" style={{ animationDelay: "120ms" }}>
            {visible.length === 0 && (
              <div className="px-6 py-12 text-center sm:py-24">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E3F4F1] text-[#2A8C82] sm:mb-4 sm:h-14 sm:w-14">
                  <Sparkles size={24} strokeWidth={1.8} />
                </div>
                <h3 className="text-sm font-extrabold sm:text-base">Nothing here</h3>
                <p className="mt-1 text-xs font-medium text-[#5B7A7E] sm:text-sm">No notifications match this filter. Try “All”.</p>
              </div>
            )}

            {GROUPS.map((g) => {
              const list = visible.filter((n) => groupOf(n.time, now) === g);
              if (list.length === 0) return null;
              return (
                <div key={g}>
                  <div className="flex items-center justify-between border-b border-[#E8F2EF] bg-white px-4 pb-2 pt-3 text-[13px] font-extrabold text-[#122A2E] sm:px-8 sm:pt-5 sm:text-sm lg:px-10">
                    <span>{g}</span>
                    <span className="text-[11px] font-semibold text-[#5B7A7E] sm:text-xs">{list.length} {list.length > 1 ? "items" : "item"}</span>
                  </div>
                  <div className="divide-y divide-[#E8F2EF]">
                    {list.map((n) => (
                      <NotificationRow key={n.id} item={n} now={now}
                        onNavigate={navigateTo}
                        onOpenChat={handleOpenChat}
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
          className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-[70] w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-full bg-[#122A2E] px-5 py-3 text-center text-sm font-semibold text-white shadow-xl">
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
    case "chat":
      return `${item.chat.from}: ${item.chat.text}`;
    default:
      return item.text;
  }
}

function NotificationRow({ item, now, onNavigate, onOpenChat, onAccept, onDecline, onReschedule, onJoin }) {
  const cfg = ICON_CONFIG[item.icon] || ICON_CONFIG.calendar;
  const Icon = cfg.icon;
  const s = item.session;

  // Mobile: buttons share equal-width columns
  const actionGrid =
    item.kind === "request" ? "grid-cols-3" :
    item.kind === "scheduled" ? "grid-cols-2" : "grid-cols-1";

  return (
    <article className="relative flex flex-col justify-between gap-3 bg-white px-3.5 py-4 transition-colors [@media(hover:hover)]:hover:bg-[#F6FBFA] sm:gap-4 sm:px-8 sm:py-6 lg:flex-row lg:items-center lg:gap-8 lg:px-10">
      {item.unread && <span className="absolute inset-y-0 left-0 w-1 bg-[#184D43]" aria-hidden="true" />}

      <div className="flex min-w-0 items-start gap-2.5 sm:gap-4 lg:flex-1">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12 ${cfg.cls}`}>
          <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[13px] font-extrabold sm:text-[15px]">{item.title}</h3>
            {item.unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#2A8C82] sm:h-2 sm:w-2" aria-label="Unread" />}
          </div>
          <p className="mt-0.5 line-clamp-3 text-[12px] font-medium leading-relaxed text-[#5B7A7E] sm:mt-1 sm:line-clamp-2 sm:text-sm">
            {describe(item, now)}
          </p>
          {item.kind === "request" && s.note && (
            <p className="mt-1 line-clamp-1 text-[11px] font-medium italic text-[#5B7A7E] sm:text-xs">“{s.note}”</p>
          )}
          {item.kind === "scheduled" && s.rescheduleMessage && (
            <p className="mt-1 line-clamp-2 text-[11px] font-medium italic text-[#5B7A7E] sm:text-xs">“{s.rescheduleMessage}”</p>
          )}
          <time className="mt-1 block text-[11px] font-semibold text-[#5B7A7E] sm:mt-1.5 sm:text-xs">{timeAgo(item.time, now)}</time>
        </div>
      </div>

      <div className={`grid ${actionGrid} gap-2 sm:flex sm:flex-wrap sm:items-start sm:pl-16 lg:shrink-0 lg:justify-end lg:pl-0 [&>*]:w-full sm:[&>*]:w-auto`}>
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
            <div className="[&>*]:w-full sm:[&>*]:w-auto">
              <JoinButton session={s} now={now} onJoin={onJoin} />
            </div>
          </>
        )}

        {item.kind === "chat" && (
          <button type="button" onClick={() => onOpenChat(item.chat)} className={BTN_OUTLINE}>
            Open chat <ArrowRight size={13} strokeWidth={2.2} />
          </button>
        )}

        {(item.kind === "declined" || item.kind === "completed") && (
          <button type="button" onClick={() => onNavigate("Patients")} className={BTN_OUTLINE}>
            View patient <ArrowRight size={13} strokeWidth={2.2} />
          </button>
        )}

        {item.kind === "info" && (
          <button type="button" onClick={() => onNavigate(item.page)} className={BTN_OUTLINE}>
            {item.action} <ArrowRight size={13} strokeWidth={2.2} />
          </button>
        )}
      </div>
    </article>
  );
}