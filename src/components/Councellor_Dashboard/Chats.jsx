import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft, Plus, Search, Paperclip, Smile, Mic, MicOff, Send, Phone, PhoneOff, Video, VideoOff, Info,
  CalendarDays, CheckCheck, Menu, X, FileText,
} from "lucide-react";
import Sidebar from "./Sidebar";

/* ================= DATA ================= */
const CONVERSATIONS = [
  {
    id: 1, name: "John Smith", type: "patient", status: "online", lastSeen: "", avatar: "", time: "10:30 AM", unread: 2,
    session: "Tomorrow, 10:00 AM – 11:00 AM",
    messages: [
      { id: 1, from: "them", text: "Hi Dr. Sarah, I've been feeling a bit anxious lately and wanted to talk about it.", time: "10:28 AM" },
      { id: 2, from: "me", text: "Hello John! I'm glad you reached out. Can you tell me what has been causing you the most stress?", time: "10:29 AM" },
      { id: 3, from: "them", text: "I think it's mostly work pressure and overthinking at night.", time: "10:30 AM" },
      { id: 4, from: "me", text: "Thank you for sharing that. Let's work on some strategies to help you manage this better.", time: "10:30 AM", reaction: 1 },
    ],
  },
  {
    id: 2, name: "Emma Wilson", type: "patient", status: "offline", lastSeen: "Today, 9:20 AM", avatar: "", time: "9:15 AM", unread: 1,
    session: "Tomorrow, 11:30 AM – 12:30 PM",
    messages: [
      { id: 1, from: "me", text: "How are you feeling after our last session, Emma?", time: "Yesterday" },
      { id: 2, from: "them", text: "Thank you for the session yesterday, it helped a lot.", time: "9:15 AM" },
    ],
  },
  {
    id: 3, name: "David Brown", type: "patient", status: "offline", lastSeen: "Yesterday, 6:45 PM", avatar: "", time: "Yesterday", unread: 0, session: "",
    messages: [{ id: 1, from: "them", text: "Can we reschedule our next session?", time: "Yesterday" }],
  },
  {
    id: 4, name: "Sophia Johnson", type: "patient", status: "offline", lastSeen: "Yesterday, 8:10 PM", avatar: "", time: "Yesterday", unread: 0, session: "",
    attachment: true, fileName: "Mindful breathing guide",
    messages: [{ id: 1, from: "me", text: "Here is a short guide on mindful breathing. Try it daily.", time: "Yesterday" }],
  },
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
];

const STATUS_COLOR = { online: "text-emerald-600", offline: "text-[#62766C]" };

const nowTime = () => new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
const lastText = (c) => c.messages[c.messages.length - 1]?.text || "";
const statusText = (c) =>
  c.status === "online" ? "Online" : `Offline${c.lastSeen ? ` · Last seen ${c.lastSeen.toLowerCase()}` : ""}`;
const fmtTimer = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

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
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F7A5A] focus-visible:ring-offset-2";
const ICON_BTN =
  "flex items-center justify-center rounded-full text-[#455A50] transition hover:bg-[#D8E6DD] hover:text-[#10281E]";

/* ================= MAIN ================= */
export default function Chats({ onLogout, onNavigate, sidebarCollapsed = false, onToggleSidebar }) {
  const isDesktop = useIsDesktop();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (isDesktop) setMobileNavOpen(false);
  }, [isDesktop]);

  const sidebarWidth = sidebarCollapsed ? 76 : 268;

  const [chats, setChats] = useState(CONVERSATIONS);
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id);
  const [threadOpen, setThreadOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [draft, setDraft] = useState("");
  const [call, setCall] = useState(null); // "audio" | "video" | null
  const [infoOpen, setInfoOpen] = useState(false);

  const active = chats.find((c) => c.id === activeId);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return chats.filter((c) => {
      const okFilter = filter === "all" || c.unread > 0;
      return okFilter && (!q || c.name.toLowerCase().includes(q));
    });
  }, [chats, query, filter]);

  const openChat = (id) => {
    setActiveId(id);
    setThreadOpen(true);
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  };

  const sendMessage = (e) => {
    e?.preventDefault?.();
    const text = draft.trim();
    if (!text || !active) return;
    const time = nowTime();
    setChats((prev) =>
      prev.map((c) =>
        c.id === active.id ? { ...c, time, messages: [...c.messages, { id: Date.now(), from: "me", text, time }] } : c
      )
    );
    setDraft("");
  };

  const navigateFromDrawer = (page) => {
    setMobileNavOpen(false);
    if (typeof onNavigate === "function") onNavigate(page);
  };

  const startCall = (type) => {
    setInfoOpen(false);
    setCall(type);
  };

  return (
    <div className="ch-root flex h-[100dvh] flex-col overflow-hidden bg-[#DDE7E1] text-[#10281E] antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;700&display=swap');
        .ch-root, .ch-root button, .ch-root input, .ch-root textarea { font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif; }
        .ch-serif { font-family: 'Fraunces', Georgia, serif !important; font-optical-sizing: auto; }
        html, body, .ch-root, .ch-root * { scrollbar-width: none; -ms-overflow-style: none; }
        html::-webkit-scrollbar, body::-webkit-scrollbar, .ch-root::-webkit-scrollbar, .ch-root *::-webkit-scrollbar { display: none; width: 0; height: 0; }
        @keyframes ch-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ch-slide { from { transform: translateX(24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes ch-ring { 0% { transform: scale(1); opacity: .5; } 100% { transform: scale(1.5); opacity: 0; } }
        .ch-backdrop { animation: ch-fade .2s ease both; }
        .ch-drawer { animation: ch-slide .25s ease both; }
        .ch-ring { animation: ch-ring 1.6s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) { .ch-backdrop, .ch-drawer, .ch-ring { animation: none; } }
      `}</style>

      {/* SIDEBAR */}
      {isDesktop ? (
        <Sidebar collapsed={sidebarCollapsed} onToggle={onToggleSidebar} activePage="Chats"
          onNavigate={onNavigate} onLogout={onLogout} partnerName="Prem Zumble" />
      ) : (
        mobileNavOpen && (
          <>
            <div className="ch-backdrop fixed inset-0 z-40 bg-[#0A1F17]/50 backdrop-blur-sm"
              onClick={() => setMobileNavOpen(false)} aria-hidden="true" />
            <div className="relative z-50">
              <Sidebar collapsed={false} onToggle={() => setMobileNavOpen(false)} activePage="Chats"
                onNavigate={navigateFromDrawer} onLogout={onLogout} partnerName="Prem Zumble" />
            </div>
          </>
        )
      )}

      {/* MOBILE TOP BAR */}
      <div className={`${threadOpen ? "hidden md:flex" : "flex"} shrink-0 items-center gap-3 border-b border-[#C2D3C9] px-4 py-3 lg:hidden`}>
        <button type="button" onClick={() => setMobileNavOpen(true)} aria-label="Open menu"
          className={`flex h-10 w-10 items-center justify-center rounded-xl border border-[#C2D3C9] bg-white ${FOCUS}`}>
          <Menu size={20} />
        </button>
        <span className="text-[15px] font-bold">Chats</span>
      </div>

      {/* MAIN */}
      <main className="box-border min-h-[480px] flex-1 overflow-hidden p-2 transition-[margin] duration-300 ease-in-out sm:p-3 md:p-4 lg:ml-[var(--sb)] lg:p-6"
        style={{ "--sb": `${sidebarWidth}px` }}>
        <div className="flex h-full min-h-[480px] overflow-hidden rounded-3xl border border-[#C6D6CD] bg-white">
          <ConversationList hiddenOnMobile={threadOpen} list={list} activeId={activeId} onOpen={openChat}
            query={query} onQuery={setQuery} filter={filter} onFilter={setFilter} />

          {active ? (
            <Thread hiddenOnMobile={!threadOpen} chat={active} draft={draft} onDraft={setDraft}
              onSend={sendMessage} onBack={() => setThreadOpen(false)}
              onCall={startCall} onInfo={() => setInfoOpen(true)} />
          ) : (
            <section className="hidden flex-1 items-center justify-center bg-[#E9F1EC] text-sm font-semibold text-[#62766C] md:flex">
              Select a conversation to start messaging
            </section>
          )}
        </div>
      </main>

      {/* INFO PANEL */}
      {infoOpen && active && (
        <InfoPanel chat={active} onClose={() => setInfoOpen(false)} onCall={startCall} />
      )}

      {/* CALL SCREEN */}
      {call && active && <CallOverlay chat={active} type={call} onEnd={() => setCall(null)} />}
    </div>
  );
}

/* ================= AVATAR ================= */
function Avatar({ name, size = "h-10 w-10", status, text = "text-xs" }) {
  const dot = status === "online" ? "bg-emerald-500" : status === "offline" ? "bg-[#9AAEA3]" : "";
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2);
  return (
    <div className="relative shrink-0">
      <div className={`${size} ${text} flex items-center justify-center rounded-full bg-[#C8E1D2] font-extrabold text-[#176247]`}>
        {initials}
      </div>
      {dot && <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${dot}`} />}
    </div>
  );
}

/* ================= LIST ================= */
function ConversationList({ hiddenOnMobile, list, activeId, onOpen, query, onQuery, filter, onFilter }) {
  return (
    <aside className={`${hiddenOnMobile ? "hidden md:flex" : "flex"} min-h-0 w-full shrink-0 flex-col border-r border-[#C6D6CD] bg-white md:w-80 lg:w-[22rem]`}>
      <div className="shrink-0 p-5 pb-3">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="ch-serif text-[26px] font-bold leading-none tracking-tight">Patient inbox</h1>
          <button type="button" aria-label="New chat"
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-[#176247] text-white transition hover:bg-[#124F3A] active:scale-95 ${FOCUS}`}>
            <Plus size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div className="relative mb-3 flex items-center">
          <Search size={16} className="pointer-events-none absolute left-3.5 text-[#62766C]" />
          <input type="text" value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Search patients"
            className="h-11 w-full rounded-full border border-transparent bg-[#DDE7E1] pl-10 pr-4 text-base font-medium placeholder-[#62766C] transition focus:border-[#1F7A5A] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1F7A5A]/10 sm:h-10 sm:text-sm" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {FILTERS.map((f) => (
            <button key={f.key} type="button" onClick={() => onFilter(f.key)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition sm:py-1.5 ${
                filter === f.key ? "bg-[#176247] text-white" : "text-[#455A50] hover:bg-[#DDE7E1]"
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2.5 pb-2">
        {list.length === 0 && (
          <p className="p-6 text-center text-sm font-medium text-[#62766C]">No conversations match your search.</p>
        )}
        {list.map((c) => {
          const selected = c.id === activeId;
          return (
            <button key={c.id} type="button" onClick={() => onOpen(c.id)}
              className={`mb-0.5 flex w-full items-center rounded-2xl p-3 text-left transition ${
                selected ? "bg-[#D6E9DD]" : "hover:bg-[#E9F1EC]"
              }`}>
              <div className="mr-3">
                <Avatar name={c.name} status={c.status} size="h-12 w-12" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center justify-between gap-1">
                  <span className={`truncate text-sm ${c.unread > 0 || selected ? "font-extrabold" : "font-bold"}`}>{c.name}</span>
                  <span className="shrink-0 text-[11px] font-medium text-[#62766C]">{c.time}</span>
                </div>
                <p className={`truncate text-[13px] ${c.unread > 0 ? "font-semibold text-[#10281E]" : "font-medium text-[#455A50]"}`}>
                  {c.attachment ? "Shared document" : lastText(c)}
                </p>
              </div>
              {c.unread > 0 && (
                <span className="ml-2 inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#1F7A5A] px-1.5 text-[11px] font-extrabold text-white">
                  {c.unread}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}

/* ================= THREAD ================= */
function Thread({ hiddenOnMobile, chat, draft, onDraft, onSend, onBack, onCall, onInfo }) {
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.id, chat.messages.length]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [draft, chat.id]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      onSend();
    }
  };

  const canSend = draft.trim().length > 0;

  const headerActions = [
    { icon: Phone, label: "Audio call", onClick: () => onCall("audio") },
    { icon: Video, label: "Video call", onClick: () => onCall("video") },
    { icon: Info, label: "Contact details", onClick: onInfo },
  ];

  return (
    <section className={`${hiddenOnMobile ? "hidden md:flex" : "flex"} min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#E9F1EC]`}>
      {/* Header */}
      <div className="flex h-[72px] shrink-0 items-center justify-between gap-2 border-b border-[#C6D6CD] bg-white px-2 sm:px-6">
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
          <button type="button" onClick={onBack} aria-label="Back to conversations"
            className={`${ICON_BTN} h-10 w-10 shrink-0 md:hidden ${FOCUS}`}>
            <ChevronLeft size={22} />
          </button>
          <Avatar name={chat.name} status={chat.status} size="h-11 w-11" />
          <div className="min-w-0">
            <h2 className="truncate text-[15px] font-extrabold">{chat.name}</h2>
            <span className={`block truncate text-xs font-semibold ${STATUS_COLOR[chat.status] || STATUS_COLOR.offline}`}>
              {statusText(chat)}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          {headerActions.map(({ icon: Icon, label, onClick }) => (
            <button key={label} type="button" aria-label={label} title={label} onClick={onClick}
              className={`${ICON_BTN} h-10 w-10 ${FOCUS}`}>
              <Icon size={18} />
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-8 sm:py-6">
        {chat.session && (
          <div className="mb-5 flex flex-col gap-3 rounded-2xl bg-[#D6E9DD] p-3.5 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#176247]">
                <CalendarDays size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-extrabold">Next appointment</div>
                <div className="text-xs font-semibold text-[#3B5A4B]">{chat.session}</div>
              </div>
            </div>
            <button type="button" onClick={onInfo}
              className={`rounded-full bg-white px-4 py-2 text-xs font-bold text-[#176247] transition hover:bg-[#E9F1EC] ${FOCUS}`}>
              View details
            </button>
          </div>
        )}

        <div className="my-4 text-center text-xs font-bold text-[#62766C]">Today</div>

        {chat.messages.map((m, i) => {
          const prev = chat.messages[i - 1];
          const next = chat.messages[i + 1];
          const firstInGroup = !prev || prev.from !== m.from;
          const lastInGroup = !next || next.from !== m.from;
          const gap = firstInGroup ? "mt-4" : "mt-1";

          if (m.from === "them") {
            return (
              <div key={m.id} className={`${gap} flex max-w-[88%] items-end gap-2 sm:max-w-lg`}>
                <div className="w-8 shrink-0">{lastInGroup && <Avatar name={chat.name} size="h-8 w-8" />}</div>
                <div className={`min-w-0 rounded-2xl border border-[#C6D6CD] bg-white px-4 py-2.5 text-[15px] leading-relaxed sm:text-sm ${lastInGroup ? "rounded-bl-md" : ""}`}>
                  <p className="whitespace-pre-wrap break-words">{m.text}</p>
                  <div className="mt-1 text-right text-[10px] font-semibold text-[#62766C]">{m.time}</div>
                </div>
              </div>
            );
          }

          return (
            <div key={m.id} className={`${gap} flex justify-end`}>
              <div className={`relative max-w-[88%] sm:max-w-lg ${m.reaction > 0 ? "mb-3" : ""}`}>
                <div className={`rounded-2xl bg-[#176247] px-4 py-2.5 text-[15px] leading-relaxed text-white sm:text-sm ${lastInGroup ? "rounded-br-md" : ""}`}>
                  <p className="whitespace-pre-wrap break-words">{m.text}</p>
                  <div className="mt-1 flex items-center justify-end gap-1 text-[10px] font-semibold text-white/70">
                    <span>{m.time}</span>
                    <CheckCheck size={14} className="text-[#9FE0BF]" />
                  </div>
                </div>
                {m.reaction > 0 && (
                  <div className="absolute -bottom-3 left-3 flex items-center gap-1 rounded-full border border-[#C6D6CD] bg-white px-2 py-0.5 text-[11px]">
                    <span>❤️</span>
                    <span className="font-bold">{m.reaction}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <footer className="shrink-0 px-2 pb-2 sm:px-6 sm:pb-5">
        <form onSubmit={onSend}
          className="flex items-end gap-1 rounded-[28px] border border-[#C6D6CD] bg-white p-2 transition focus-within:border-[#1F7A5A] focus-within:ring-4 focus-within:ring-[#1F7A5A]/10">
          <button type="button" aria-label="Attach file" className={`${ICON_BTN} mb-0.5 h-10 w-10 shrink-0 ${FOCUS}`}>
            <Paperclip size={19} />
          </button>
          <textarea ref={inputRef} rows={1} value={draft} onChange={(e) => onDraft(e.target.value)}
            onKeyDown={handleKeyDown} placeholder="Write a message" aria-label="Message"
            className="max-h-[120px] min-w-0 flex-1 resize-none self-center border-0 bg-transparent px-2 py-2 text-base font-medium leading-6 placeholder-[#62766C] focus:outline-none sm:text-sm" />
          <button type="button" aria-label="Emojis" className={`${ICON_BTN} mb-0.5 hidden h-10 w-10 shrink-0 min-[400px]:flex ${FOCUS}`}>
            <Smile size={19} />
          </button>
          <button type="button" aria-label="Voice" className={`${ICON_BTN} mb-0.5 hidden h-10 w-10 shrink-0 min-[340px]:flex ${FOCUS}`}>
            <Mic size={19} />
          </button>
          <button type="submit" aria-label="Send message" disabled={!canSend}
            className={`mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition active:scale-95 ${FOCUS} ${
              canSend ? "bg-[#176247] text-white hover:bg-[#124F3A]" : "cursor-not-allowed bg-[#DDE7E1] text-[#7F9288]"
            }`}>
            <Send size={17} />
          </button>
        </form>
        <p className="mt-1.5 hidden text-center text-xs font-medium text-[#62766C] sm:block">
          Enter to send. Shift + Enter for a new line.
        </p>
      </footer>
    </section>
  );
}

/* ================= INFO PANEL ================= */
function InfoPanel({ chat, onClose, onCall }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const Section = ({ title, children }) => (
    <div className="border-t border-[#E1EBE5] px-5 py-4">
      <h4 className="mb-2.5 text-xs font-bold text-[#62766C]">{title}</h4>
      {children}
    </div>
  );

  return (
    <>
      <div className="ch-backdrop fixed inset-0 z-[55] bg-[#0A1F17]/40" onClick={onClose} aria-hidden="true" />
      <aside role="dialog" aria-label="Contact details"
        className="ch-drawer fixed inset-y-0 right-0 z-[56] flex w-full flex-col overflow-hidden bg-white shadow-2xl sm:w-96">
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-[#C6D6CD] px-5">
          <h3 className="text-[15px] font-extrabold">Contact details</h3>
          <button type="button" onClick={onClose} aria-label="Close details" className={`${ICON_BTN} h-10 w-10 ${FOCUS}`}>
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-col items-center px-5 py-6 text-center">
            <Avatar name={chat.name} status={chat.status} size="h-24 w-24" text="text-2xl" />
            <h2 className="ch-serif mt-3 text-xl font-bold">{chat.name}</h2>
            <p className="mt-0.5 text-xs font-semibold capitalize text-[#62766C]">{chat.type}</p>
            <p className={`mt-1 text-xs font-semibold ${STATUS_COLOR[chat.status] || STATUS_COLOR.offline}`}>
              {statusText(chat)}
            </p>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => onCall("audio")}
                className={`flex items-center gap-2 rounded-full border border-[#C6D6CD] px-4 py-2 text-xs font-bold text-[#176247] transition hover:bg-[#E9F1EC] ${FOCUS}`}>
                <Phone size={15} /> Audio call
              </button>
              <button type="button" onClick={() => onCall("video")}
                className={`flex items-center gap-2 rounded-full bg-[#176247] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#124F3A] ${FOCUS}`}>
                <Video size={15} /> Video call
              </button>
            </div>
          </div>

          <Section title="Next appointment">
            {chat.session ? (
              <div className="flex items-center gap-3 rounded-2xl bg-[#D6E9DD] p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#176247]">
                  <CalendarDays size={18} />
                </div>
                <span className="text-sm font-bold">{chat.session}</span>
              </div>
            ) : (
              <p className="text-sm font-medium text-[#455A50]">No upcoming session.</p>
            )}
          </Section>

          <Section title="Shared files">
            {chat.attachment ? (
              <div className="flex items-center gap-3 rounded-2xl border border-[#C6D6CD] p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E9F1EC] text-[#176247]">
                  <FileText size={18} />
                </div>
                <span className="min-w-0 truncate text-sm font-bold">{chat.fileName || "Shared document"}</span>
              </div>
            ) : (
              <p className="text-sm font-medium text-[#455A50]">No files shared yet.</p>
            )}
          </Section>
        </div>
      </aside>
    </>
  );
}

/* ================= CALL SCREEN ================= */
function CallOverlay({ chat, type, onEnd }) {
  const isVideo = type === "video";
  const [phase, setPhase] = useState("calling"); // calling | connected | unavailable
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [attempt, setAttempt] = useState(0);

  // Simulated connection: online -> connects, offline -> not available
  useEffect(() => {
    setPhase("calling");
    setSeconds(0);
    const online = chat.status === "online";
    const t = setTimeout(() => setPhase(online ? "connected" : "unavailable"), online ? 2500 : 4000);
    return () => clearTimeout(t);
  }, [chat.id, chat.status, attempt]);

  useEffect(() => {
    if (phase !== "connected") return;
    const i = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(i);
  }, [phase]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onEnd();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onEnd]);

  const subtitle =
    phase === "calling" ? `${isVideo ? "Video" : "Audio"} calling…`
    : phase === "connected" ? fmtTimer(seconds)
    : "Not available right now";

  const ctrl = "flex h-14 w-14 items-center justify-center rounded-full transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F2A20]";

  return (
    <div role="dialog" aria-modal="true" aria-label={`${isVideo ? "Video" : "Audio"} call with ${chat.name}`}
      className="ch-backdrop fixed inset-0 z-[60] flex flex-col bg-[#0F2A20] text-white">
      <div className="px-6 pt-[max(1.5rem,env(safe-area-inset-top))] text-center">
        <h2 className="ch-serif text-2xl font-bold">{chat.name}</h2>
        <p className="mt-1 text-sm font-semibold text-white/70" aria-live="polite">{subtitle}</p>
        {phase === "unavailable" && chat.lastSeen && (
          <p className="mt-1 text-xs font-medium text-white/50">Last seen {chat.lastSeen.toLowerCase()}</p>
        )}
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        <div className="relative">
          {phase === "calling" && <span className="ch-ring absolute inset-0 rounded-full bg-white/30" aria-hidden="true" />}
          <Avatar name={chat.name} size="h-32 w-32 sm:h-40 sm:w-40" text="text-4xl" />
        </div>

        {isVideo && (
          <div className="absolute bottom-4 right-4 flex h-36 w-24 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-[#1B3B2E] sm:h-44 sm:w-32">
            {camOff ? <VideoOff size={22} className="text-white/60" /> : <span className="text-xs font-bold text-white/70">You</span>}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4">
        {phase === "unavailable" ? (
          <>
            <button type="button" onClick={onEnd}
              className="rounded-full border border-white/30 px-6 py-3 text-sm font-bold transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              Close
            </button>
            <button type="button" onClick={() => setAttempt((a) => a + 1)}
              className="rounded-full bg-white px-6 py-3 text-sm font-bold text-[#176247] transition hover:bg-[#E9F1EC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              Try again
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={() => setMuted((m) => !m)} aria-pressed={muted}
              aria-label={muted ? "Unmute microphone" : "Mute microphone"}
              className={`${ctrl} ${muted ? "bg-white text-[#0F2A20]" : "bg-white/15 hover:bg-white/25"}`}>
              {muted ? <MicOff size={22} /> : <Mic size={22} />}
            </button>
            {isVideo && (
              <button type="button" onClick={() => setCamOff((c) => !c)} aria-pressed={camOff}
                aria-label={camOff ? "Turn camera on" : "Turn camera off"}
                className={`${ctrl} ${camOff ? "bg-white text-[#0F2A20]" : "bg-white/15 hover:bg-white/25"}`}>
                {camOff ? <VideoOff size={22} /> : <Video size={22} />}
              </button>
            )}
            <button type="button" onClick={onEnd} aria-label="End call"
              className={`${ctrl} bg-red-500 hover:bg-red-600`}>
              <PhoneOff size={22} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}