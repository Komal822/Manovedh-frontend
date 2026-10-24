import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft, Plus, Search, Paperclip, Smile, Mic, MicOff, Send, Phone, PhoneOff, Video, VideoOff, Info,
  CalendarDays, CheckCheck, Menu, X, FileText, Trash2, Play, Pause,
} from "lucide-react";
import Sidebar from "./Sidebar";
import { useSessions, useNow, formatDay, sessionEnd } from "./sessionStore";

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

const STATUS_COLOR = { online: "text-emerald-700", offline: "text-[#46666A]" };

/* Soft per-person avatar colours so each patient is easy to spot in the list */
const AVATAR_TONES = [
  "bg-[#BFE8E0] text-[#145A51]",
  "bg-[#CDEBCF] text-[#1E5A2B]",
  "bg-[#CFE2F7] text-[#1F4E7C]",
  "bg-[#F1DCC0] text-[#7A4A12]",
  "bg-[#E1D0F0] text-[#5A2E7A]",
];
const toneFor = (name = "") => {
  let h = 0;
  for (let i = 0; i < name.length; i += 1) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_TONES[h % AVATAR_TONES.length];
};

const nowTime = () => new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
const lastText = (c) => {
  const m = c.messages[c.messages.length - 1];
  if (!m) return "No messages yet";
  if (m.voice) return "Voice message";
  if (m.files?.length && !m.text) return "Attachment";
  return m.text || "";
};
const statusText = (c) =>
  c.status === "online" ? "Online" : `Offline${c.lastSeen ? ` · Last seen ${c.lastSeen.toLowerCase()}` : ""}`;
const fmtTimer = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const fmtSize = (b = 0) =>
  b < 1024 ? `${b} B` : b < 1024 * 1024 ? `${Math.round(b / 1024)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`;

const EMOJIS = [
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "😉", "😍", "🥰", "😘", "😋",
  "😎", "🤗", "🤔", "😐", "😌", "😴", "😢", "😭", "😔", "😟", "😮", "😱", "😤", "😡", "🙏", "👍",
  "👎", "👏", "🙌", "💪", "🤝", "👋", "✌️", "🤞", "❤️", "💚", "💙", "💛", "🧡", "💜", "🖤", "💯",
  "✨", "🌿", "🌸", "🌞", "🌈", "☀️", "🌙", "⭐", "🔥", "🎉", "🎁", "☕", "🍎", "🧘", "📅", "✅",
];

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

function useBodyLock(active) {
  useEffect(() => {
    if (!active) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);
}

/* ================= STYLE TOKENS ================= */
const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A8C82] focus-visible:ring-offset-2";
const ICON_BTN =
  "flex items-center justify-center rounded-full text-[#2A6F68] transition hover:bg-[#D5EEEA] hover:text-[#0F3F38] active:scale-95";
/* Header action buttons get a visible teal tint so they clearly read as buttons */
const HEADER_BTN =
  "flex h-10 w-10 items-center justify-center rounded-full bg-[#E3F4F1] text-[#1E7A70] transition hover:bg-[#CDEBE6] hover:text-[#0F3F38] active:scale-95";

const SCROLLBAR_CSS = `
  html,
  .ch-root,
  .ch-root * {
    scrollbar-width: thin;
    scrollbar-color: #2A8C82 #E6F2F0;
  }
  .ch-root .ch-noscroll { scrollbar-width: none; }

  @supports selector(::-webkit-scrollbar) {
    html,
    .ch-root,
    .ch-root * {
      scrollbar-width: auto;
      scrollbar-color: auto;
    }
    html::-webkit-scrollbar,
    .ch-root::-webkit-scrollbar,
    .ch-root *::-webkit-scrollbar { width: 6px; height: 6px; }
    html::-webkit-scrollbar-track,
    .ch-root::-webkit-scrollbar-track,
    .ch-root *::-webkit-scrollbar-track { background: #E6F2F0; }
    html::-webkit-scrollbar-thumb,
    .ch-root::-webkit-scrollbar-thumb,
    .ch-root *::-webkit-scrollbar-thumb {
      background: #2A8C82;
      border-radius: 999px;
    }
    html::-webkit-scrollbar-thumb:hover,
    .ch-root::-webkit-scrollbar-thumb:hover,
    .ch-root *::-webkit-scrollbar-thumb:hover { background: #1E9E93; }
    html::-webkit-scrollbar-corner,
    .ch-root::-webkit-scrollbar-corner,
    .ch-root *::-webkit-scrollbar-corner { background: transparent; }
    .ch-root .ch-noscroll::-webkit-scrollbar { display: none; width: 0; height: 0; }
  }
`;

/* ================= MAIN ================= */
export default function Chats({ onLogout, onNavigate, sidebarCollapsed = false, onToggleSidebar }) {
  const isDesktop = useIsDesktop();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (isDesktop) setMobileNavOpen(false);
  }, [isDesktop]);

  useEffect(() => {
    if (!mobileNavOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && setMobileNavOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileNavOpen]);

  const sidebarWidth = sidebarCollapsed ? 76 : 268;

  const [chats, setChats] = useState(CONVERSATIONS);
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id);
  const [threadOpen, setThreadOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [draft, setDraft] = useState("");
  const [call, setCall] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [newChatOpen, setNewChatOpen] = useState(false);

  useBodyLock(mobileNavOpen || infoOpen || !!call || newChatOpen);

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

  const sendMessage = ({ text = "", files = [], voice = null } = {}) => {
    const clean = text.trim();
    if (!active || (!clean && !files.length && !voice)) return;
    const time = nowTime();
    const message = { id: Date.now(), from: "me", text: clean, time, isNew: true, files, voice };
    setChats((prev) =>
      prev.map((c) => (c.id === active.id ? { ...c, time, messages: [...c.messages, message] } : c))
    );
    if (clean || files.length) setDraft("");
  };

  const addChat = ({ name, text = "", session = "" }) => {
    const clean = name.trim();
    if (!clean) return;
    const time = nowTime();
    const existing = chats.find((c) => c.name.toLowerCase() === clean.toLowerCase());

    setQuery("");
    setFilter("all");
    setNewChatOpen(false);

    if (existing) {
      setActiveId(existing.id);
      setThreadOpen(true);
      setChats((prev) =>
        prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                unread: 0,
                ...(text
                  ? { time, messages: [...c.messages, { id: Date.now(), from: "me", text, time, isNew: true }] }
                  : {}),
              }
            : c
        )
      );
      return;
    }

    const id = Date.now();
    const chat = {
      id, name: clean, type: "patient", status: "offline", lastSeen: "", avatar: "", time, unread: 0, session,
      messages: text ? [{ id: 1, from: "me", text, time, isNew: true }] : [],
    };
    setChats((prev) => [chat, ...prev]);
    setActiveId(id);
    setThreadOpen(true);
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
    <div className="ch-root flex h-[100dvh] flex-col overflow-hidden bg-[#E4F0EE] text-[#0F2B2F] antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .ch-root, .ch-root button, .ch-root input, .ch-root textarea { font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif; }
        .ch-serif { font-family: 'Fraunces', Georgia, serif !important; font-optical-sizing: auto; letter-spacing: -0.01em; }
        .ch-root button, .ch-root input, .ch-root textarea { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }

        /* Chat canvas: solid soft teal */
        .ch-canvas {
          background-color: #DCEBE8;
        }

        ${SCROLLBAR_CSS}

        @keyframes ch-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ch-slide { from { transform: translateX(24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes ch-ring { 0% { transform: scale(1); opacity: .5; } 100% { transform: scale(1.55); opacity: 0; } }
        @keyframes ch-pop { from { transform: translateY(8px) scale(.96); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes ch-pulse { 0% { box-shadow: 0 0 0 0 rgba(16,185,129,.55); } 70% { box-shadow: 0 0 0 7px rgba(16,185,129,0); } 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); } }
        .ch-backdrop { animation: ch-fade .2s ease both; }
        .ch-drawer { animation: ch-slide .25s ease both; }
        .ch-ring { animation: ch-ring 1.6s ease-out infinite; }
        .ch-pop { animation: ch-pop .22s ease-out both; }
        .ch-online { animation: ch-pulse 2s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) { .ch-backdrop, .ch-drawer, .ch-ring, .ch-pop, .ch-online { animation: none; } }
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
      <div className={`${threadOpen ? "hidden md:flex" : "flex"} shrink-0 items-center gap-3 border-b border-[#CFE3E0] bg-white/70 px-4 py-3 backdrop-blur lg:hidden`}>
        <button type="button" onClick={() => setMobileNavOpen(true)} aria-label="Open menu"
          className={`flex h-10 w-10 items-center justify-center rounded-xl border border-[#CFE3E0] bg-white shadow-sm ${FOCUS}`}>
          <Menu size={20} />
        </button>
        <span className="text-[15px] font-extrabold">Chats</span>
      </div>

      {/* MAIN */}
      <main className="box-border min-h-0 flex-1 overflow-hidden p-0 transition-[margin] duration-300 ease-in-out sm:p-3 md:p-4 lg:ml-[var(--sb)] lg:p-6"
        style={{ "--sb": `${sidebarWidth}px` }}>
        <div className="flex h-full min-h-0 overflow-hidden border-[#CFE3E0] bg-white shadow-[0_10px_40px_-12px_rgba(18,77,67,0.25)] sm:rounded-3xl sm:border">
          <ConversationList hiddenOnMobile={threadOpen} list={list} activeId={activeId} onOpen={openChat}
            query={query} onQuery={setQuery} filter={filter} onFilter={setFilter}
            onNew={() => setNewChatOpen(true)} />

          {active ? (
            <Thread hiddenOnMobile={!threadOpen} chat={active} draft={draft} onDraft={setDraft}
              onSend={sendMessage} onBack={() => setThreadOpen(false)}
              onCall={startCall} onInfo={() => setInfoOpen(true)} />
          ) : (
            <section className="ch-canvas hidden flex-1 items-center justify-center text-sm font-bold text-[#46666A] md:flex">
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

      {/* NEW CHAT */}
      {newChatOpen && (
        <NewChatModal chats={chats} onClose={() => setNewChatOpen(false)} onPick={(p) => addChat(p)} />
      )}
    </div>
  );
}

/* ================= AVATAR ================= */
function Avatar({ name, size = "h-10 w-10", status, text = "text-xs", ring = false, dot = "bottom-0 right-0 h-3.5 w-3.5" }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2);
  return (
    <div className="relative shrink-0">
      <div className={`${size} ${text} ${toneFor(name)} flex items-center justify-center rounded-full font-extrabold ${ring ? "ring-4 ring-white shadow-lg" : "shadow-sm"}`}>
        {initials}
      </div>
      {status === "online" && (
        <span className={`ch-online absolute ${dot} rounded-full border-2 border-white bg-emerald-500`} />
      )}
      {status === "offline" && (
        <span className={`absolute ${dot} rounded-full border-2 border-white bg-[#9DB8B6]`} />
      )}
    </div>
  );
}

/* ================= LIST ================= */
function ConversationList({ hiddenOnMobile, list, activeId, onOpen, query, onQuery, filter, onFilter, onNew }) {
  return (
    <aside className={`${hiddenOnMobile ? "hidden md:flex" : "flex"} min-h-0 w-full shrink-0 flex-col border-r border-[#CFE3E0] bg-white md:w-80 lg:w-[22rem]`}>
      <div className="shrink-0 p-4 pb-3 sm:p-5 sm:pb-3">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="ch-serif text-[24px] font-semibold leading-none tracking-tight sm:text-[26px]">Patient inbox</h1>
          <button type="button" aria-label="New chat" onClick={onNew}
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-[#184D43] text-white shadow-md shadow-[#184D43]/30 transition hover:bg-[#123A32] active:scale-95 ${FOCUS}`}>
            <Plus size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div className="relative mb-3 flex items-center">
          <Search size={16} className="pointer-events-none absolute left-3.5 text-[#46666A]" />
          <input type="text" value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Search patients"
            aria-label="Search patients"
            className="h-11 w-full rounded-full border border-[#D5E8E5] bg-[#EEF7F5] pl-10 pr-4 text-base font-medium placeholder-[#5B7A7E] transition focus:border-[#2A8C82] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2A8C82]/15 sm:h-10 sm:text-sm" />
        </div>

        <div className="ch-noscroll flex items-center gap-1.5 overflow-x-auto">
          {FILTERS.map((f) => (
            <button key={f.key} type="button" onClick={() => onFilter(f.key)} aria-pressed={filter === f.key}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition sm:py-1.5 ${
                filter === f.key
                  ? "bg-[#184D43] text-white shadow-sm"
                  : "bg-[#EEF7F5] text-[#2F5E5B] hover:bg-[#DDEEEA]"
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-2.5">
        {list.length === 0 && (
          <p className="p-6 text-center text-sm font-semibold text-[#46666A]">No conversations match your search.</p>
        )}
        {list.map((c) => {
          const selected = c.id === activeId;
          return (
            <button key={c.id} type="button" onClick={() => onOpen(c.id)}
              className={`relative mb-1 flex w-full items-center overflow-hidden rounded-2xl p-3 text-left transition ${
                selected
                  ? "bg-[#E3F4F1] shadow-sm"
                  : "hover:bg-[#F0F9F7] active:bg-[#E8F6F3]"
              }`}>
              {selected && <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-[#1E9E93]" aria-hidden="true" />}
              <div className="mr-3 pl-1">
                <Avatar name={c.name} status={c.status} size="h-12 w-12" text="text-sm" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center justify-between gap-1">
                  <span className={`truncate text-sm ${c.unread > 0 || selected ? "font-extrabold" : "font-bold"}`}>{c.name}</span>
                  <span className={`shrink-0 text-xs ${c.unread > 0 ? "font-bold text-[#1E7A70]" : "font-semibold text-[#46666A]"}`}>{c.time}</span>
                </div>
                <p className={`truncate text-[13px] ${c.unread > 0 ? "font-bold text-[#0F2B2F]" : "font-medium text-[#46666A]"}`}>
                  {c.attachment && c.messages.length === 1 ? "Shared document" : lastText(c)}
                </p>
              </div>
              {c.unread > 0 && (
                <span className="ml-2 inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-[#1E7A70] px-1.5 text-xs font-extrabold text-white">
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

/* ================= VOICE RECORDER ================= */
function useRecorder() {
  const [state, setState] = useState("idle"); // idle | starting | recording
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState("");
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const secondsRef = useRef(0);
  const cancelledRef = useRef(false);
  const resolveRef = useRef(null);
  const tokenRef = useRef(0);

  const cleanup = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    recorderRef.current = null;
    chunksRef.current = [];
  };

  const start = async () => {
    if (state !== "idle") return;
    setError("");
    if (typeof window !== "undefined" && window.isSecureContext === false) {
      setError("Microphone needs a secure connection (HTTPS or localhost).");
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("Voice recording isn't supported in this browser.");
      return;
    }
    const token = ++tokenRef.current;
    setState("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (token !== tokenRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      const mr = new MediaRecorder(stream);
      streamRef.current = stream;
      recorderRef.current = mr;
      chunksRef.current = [];
      cancelledRef.current = false;

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const cancelled = cancelledRef.current;
        const resolve = resolveRef.current;
        resolveRef.current = null;
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || "audio/webm" });
        const duration = secondsRef.current;
        cleanup();
        setState("idle");
        setSeconds(0);
        if (cancelled || !resolve) return;
        resolve(blob.size ? { url: URL.createObjectURL(blob), duration: Math.max(duration, 1) } : null);
      };

      mr.start();
      secondsRef.current = 0;
      setSeconds(0);
      timerRef.current = setInterval(() => {
        secondsRef.current += 1;
        setSeconds(secondsRef.current);
      }, 1000);
      setState("recording");
    } catch (err) {
      if (token !== tokenRef.current) return;
      cleanup();
      setState("idle");
      const name = err?.name;
      if (name === "NotAllowedError" || name === "SecurityError") {
        setError("Microphone access was blocked. Allow it in your browser's site settings and try again.");
      } else if (name === "NotFoundError" || name === "OverconstrainedError") {
        setError("No microphone was found on this device.");
      } else if (name === "NotReadableError") {
        setError("The microphone is being used by another app.");
      } else {
        setError("Couldn't start recording. Please try again.");
      }
    }
  };

  const stop = () =>
    new Promise((resolve) => {
      const mr = recorderRef.current;
      if (!mr || mr.state === "inactive") {
        resolve(null);
        return;
      }
      cancelledRef.current = false;
      resolveRef.current = resolve;
      mr.stop();
    });

  const cancel = () => {
    tokenRef.current += 1;
    const mr = recorderRef.current;
    cancelledRef.current = true;
    resolveRef.current = null;
    if (mr && mr.state !== "inactive") mr.stop();
    else cleanup();
    setState("idle");
    setSeconds(0);
  };

  useEffect(
    () => () => {
      tokenRef.current += 1;
      cancelledRef.current = true;
      resolveRef.current = null;
      const mr = recorderRef.current;
      if (mr && mr.state !== "inactive") mr.stop();
      else cleanup();
    },
    []
  );

  return { state, seconds, error, setError, start, stop, cancel };
}

/* ================= MESSAGE CONTENT ================= */
function VoicePlayer({ url, duration }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) a.pause();
    else a.play().catch(() => setPlaying(false));
  };

  const shown = playing || pos > 0 ? pos : duration;

  return (
    <div className="flex min-w-[210px] items-center gap-2.5">
      <audio ref={audioRef} src={url} preload="metadata"
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setPos(0); }}
        onTimeUpdate={(e) => setPos(e.currentTarget.currentTime)} />
      <button type="button" onClick={toggle} aria-label={playing ? "Pause voice message" : "Play voice message"}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#184D43] text-white transition hover:bg-[#123A32] active:scale-95 ${FOCUS}`}>
        {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
      </button>
      <div className="min-w-0 flex-1">
        <input type="range" min={0} max={duration} step={0.1} value={Math.min(pos, duration)}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (audioRef.current) audioRef.current.currentTime = v;
            setPos(v);
          }}
          aria-label="Seek voice message" className="block h-1 w-full cursor-pointer accent-[#184D43]" />
        <div className="mt-1 text-[11px] font-semibold tabular-nums text-[#2F4F4C]">{fmtTimer(Math.floor(shown))}</div>
      </div>
    </div>
  );
}

function FileBubble({ file }) {
  if (file.isImage && file.url) {
    return (
      <a href={file.url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl">
        <img src={file.url} alt={file.name} className="max-h-60 w-56 max-w-full object-cover sm:w-64" />
      </a>
    );
  }
  return (
    <a href={file.url} download={file.name}
      className="flex min-w-[200px] items-center gap-3 rounded-xl bg-white/70 p-2.5 transition hover:bg-white">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E3F4F1] text-[#1E7A70]">
        <FileText size={18} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-[#0F2B2F]">{file.name}</p>
        <p className="text-[11px] font-semibold text-[#46666A]">{fmtSize(file.size)}</p>
      </div>
    </a>
  );
}

function MessageBody({ m }) {
  const hasMedia = !!m.voice || (m.files && m.files.length > 0);
  return (
    <div className={hasMedia ? "space-y-2" : ""}>
      {m.voice && <VoicePlayer url={m.voice.url} duration={m.voice.duration} />}
      {m.files?.map((f) => <FileBubble key={f.id} file={f} />)}
      {m.text && <p className="whitespace-pre-wrap break-words">{m.text}</p>}
    </div>
  );
}

/* ================= THREAD ================= */
function Thread({ hiddenOnMobile, chat, draft, onDraft, onSend, onBack, onCall, onInfo }) {
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const emojiBtnRef = useRef(null);
  const emojiPopRef = useRef(null);

  const [attachments, setAttachments] = useState([]);
  const [fileError, setFileError] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);

  const rec = useRecorder();
  const recording = rec.state === "recording";
  const error = fileError || rec.error;

  useEffect(() => {
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    endRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }, [chat.id, chat.messages.length]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [draft, chat.id, recording]);

  /* Reset transient state when the chat changes */
  useEffect(() => {
    rec.cancel();
    setEmojiOpen(false);
    setFileError("");
    setAttachments((prev) => {
      prev.forEach((a) => URL.revokeObjectURL(a.url));
      return [];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat.id]);

  /* Auto-hide errors */
  useEffect(() => {
    if (!error) return undefined;
    const t = setTimeout(() => {
      setFileError("");
      rec.setError("");
    }, 6000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  /* Close emoji picker on outside click / Esc */
  useEffect(() => {
    if (!emojiOpen) return undefined;
    const onDown = (e) => {
      if (emojiPopRef.current?.contains(e.target) || emojiBtnRef.current?.contains(e.target)) return;
      setEmojiOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setEmojiOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [emojiOpen]);

  const canSend = draft.trim().length > 0 || attachments.length > 0;

  const submit = (e) => {
    e?.preventDefault?.();
    if (!canSend) return;
    onSend({ text: draft, files: attachments });
    setAttachments([]);
    setFileError("");
    setEmojiOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  const onPickFiles = (e) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = "";
    if (!picked.length) return;
    const ok = [];
    let tooBig = 0;
    picked.forEach((f) => {
      if (f.size > MAX_FILE_BYTES) {
        tooBig += 1;
        return;
      }
      ok.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: f.name,
        size: f.size,
        type: f.type,
        isImage: f.type.startsWith("image/"),
        url: URL.createObjectURL(f),
      });
    });
    setFileError(
      tooBig ? `${tooBig} file${tooBig > 1 ? "s are" : " is"} larger than 10 MB and ${tooBig > 1 ? "were" : "was"} skipped.` : ""
    );
    if (ok.length) setAttachments((prev) => [...prev, ...ok]);
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => {
      const gone = prev.find((a) => a.id === id);
      if (gone) URL.revokeObjectURL(gone.url);
      return prev.filter((a) => a.id !== id);
    });
  };

  const insertEmoji = (emoji) => {
    const el = inputRef.current;
    const start = el?.selectionStart ?? draft.length;
    const end = el?.selectionEnd ?? draft.length;
    onDraft(draft.slice(0, start) + emoji + draft.slice(end));
    requestAnimationFrame(() => {
      if (!el) return;
      const pos = start + emoji.length;
      if (window.matchMedia?.("(hover: hover)").matches) el.focus();
      el.setSelectionRange(pos, pos);
    });
  };

  const sendVoice = async () => {
    const v = await rec.stop();
    if (v) onSend({ voice: v });
    else rec.setError("Nothing was recorded. Please try again.");
  };

  const headerActions = [
    { icon: Phone, label: "Audio call", onClick: () => onCall("audio") },
    { icon: Video, label: "Video call", onClick: () => onCall("video") },
    { icon: Info, label: "Contact details", onClick: onInfo },
  ];

  return (
    <section className={`${hiddenOnMobile ? "hidden md:flex" : "flex"} ch-canvas min-h-0 min-w-0 flex-1 flex-col overflow-hidden`}>
      {/* Header */}
      <div className="flex h-[68px] shrink-0 items-center justify-between gap-1 border-b border-[#CFE3E0] bg-white/95 px-2 pt-[env(safe-area-inset-top)] shadow-sm backdrop-blur sm:h-[72px] sm:gap-2 sm:px-6">
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
          <button type="button" onClick={onBack} aria-label="Back to conversations"
            className={`${ICON_BTN} h-10 w-10 shrink-0 md:hidden ${FOCUS}`}>
            <ChevronLeft size={22} />
          </button>
          <Avatar name={chat.name} status={chat.status} size="h-10 w-10 sm:h-11 sm:w-11" text="text-sm" />
          <div className="min-w-0">
            <h2 className="truncate text-[15px] font-extrabold">{chat.name}</h2>
            <span className={`block truncate text-xs font-bold ${STATUS_COLOR[chat.status] || STATUS_COLOR.offline}`}>
              {statusText(chat)}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {headerActions.map(({ icon: Icon, label, onClick }) => (
            <button key={label} type="button" aria-label={label} title={label} onClick={onClick}
              className={`${HEADER_BTN} ${FOCUS}`}>
              <Icon size={18} />
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-8 sm:py-6">
        {chat.session && (
          <div className="mx-auto mb-4 flex max-w-md flex-col items-center gap-1 rounded-xl border border-[#F0DFA0] bg-[#FFF4CC] px-3.5 py-2.5 text-center shadow-sm">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#5C4A12]">
              <CalendarDays size={15} className="shrink-0" />
              <span>Next appointment</span>
            </div>
            <div className="text-[13px] font-bold text-[#5C4A12]">{chat.session}</div>
            <button type="button" onClick={onInfo}
              className={`rounded px-1 text-xs font-bold text-[#1E7A70] underline-offset-2 transition hover:underline ${FOCUS}`}>
              View details
            </button>
          </div>
        )}

        {chat.messages.length > 0 ? (
          <div className="my-4 flex justify-center">
            <span className="rounded-full border border-[#CFE3E0] bg-white px-3.5 py-1 text-xs font-bold text-[#46666A] shadow-sm">Today</span>
          </div>
        ) : (
          <div className="mx-auto my-10 max-w-xs rounded-2xl border border-[#CFE3E0] bg-white px-5 py-4 text-center shadow-sm">
            <p className="text-sm font-extrabold text-[#0F2B2F]">No messages yet</p>
            <p className="mt-1 text-xs font-semibold text-[#46666A]">Say hello to {chat.name.split(" ")[0]} 👋</p>
          </div>
        )}

        {chat.messages.map((m, i) => {
          const prev = chat.messages[i - 1];
          const next = chat.messages[i + 1];
          const firstInGroup = !prev || prev.from !== m.from;
          const lastInGroup = !next || next.from !== m.from;
          const gap = firstInGroup ? "mt-4" : "mt-1";
          const pop = m.isNew ? "ch-pop" : "";

          if (m.from === "them") {
            return (
              <div key={m.id} className={`${gap} ${pop} flex max-w-[92%] items-end gap-2 sm:max-w-lg`}>
                <div className="w-8 shrink-0">{lastInGroup && <Avatar name={chat.name} size="h-8 w-8" />}</div>
                <div className={`min-w-0 rounded-2xl border border-[#A9CBC5] bg-white px-4 py-2.5 text-[15px] font-medium leading-relaxed text-[#0F2B2F] shadow-[0_3px_10px_-2px_rgba(18,77,67,0.3)] sm:text-sm ${lastInGroup ? "rounded-bl-md" : ""}`}>
                  <MessageBody m={m} />
                  <div className="mt-1 text-right text-[11px] font-semibold text-[#46666A]">{m.time}</div>
                </div>
              </div>
            );
          }

          return (
            <div key={m.id} className={`${gap} ${pop} flex justify-end`}>
              <div className={`relative max-w-[88%] sm:max-w-lg ${m.reaction > 0 ? "mb-3" : ""}`}>
                <div className={`rounded-2xl border border-[#7CC9BC] bg-[#B5E6DD] px-4 py-2.5 text-[15px] font-medium leading-relaxed text-black shadow-[0_4px_12px_-3px_rgba(24,77,67,0.35)] sm:text-sm ${lastInGroup ? "rounded-br-md" : ""}`}>
                  <MessageBody m={m} />
                  <div className="mt-1 flex items-center justify-end gap-1 text-[11px] font-semibold text-[#2F4F4C]">
                    <span>{m.time}</span>
                    <CheckCheck size={14} className="text-[#1E7A70]" />
                  </div>
                </div>
                {m.reaction > 0 && (
                  <div className="absolute -bottom-3 left-3 flex items-center gap-1 rounded-full border border-[#D2E6E3] bg-white px-2 py-0.5 text-xs shadow-sm">
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
      <footer className="relative shrink-0 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 sm:px-6 sm:pb-5">
        {/* Emoji picker */}
        {emojiOpen && !recording && (
          <div ref={emojiPopRef} role="dialog" aria-label="Emoji picker"
            className="ch-pop absolute bottom-full left-2 right-2 z-20 mb-2 rounded-2xl border border-[#CFE3E0] bg-white p-2 shadow-[0_12px_32px_-8px_rgba(18,77,67,0.35)] sm:left-auto sm:right-6 sm:w-80">
            <div className="grid max-h-48 grid-cols-8 gap-0.5 overflow-y-auto overscroll-contain">
              {EMOJIS.map((em) => (
                <button key={em} type="button" onClick={() => insertEmoji(em)} aria-label={`Insert ${em}`}
                  className="flex h-9 w-full items-center justify-center rounded-lg text-xl transition hover:bg-[#E3F4F1] active:scale-90">
                  {em}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p role="alert" className="mb-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700">
            {error}
          </p>
        )}

        {/* Pending attachments */}
        {attachments.length > 0 && (
          <div className="ch-noscroll mb-2 flex gap-2 overflow-x-auto rounded-2xl border border-[#CFE3E0] bg-white p-2">
            {attachments.map((a) => (
              <div key={a.id} className="relative flex shrink-0 items-center gap-2 rounded-xl bg-[#EEF7F5] p-2 pr-8">
                {a.isImage ? (
                  <img src={a.url} alt="" className="h-10 w-10 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E3F4F1] text-[#1E7A70]">
                    <FileText size={18} />
                  </div>
                )}
                <div className="min-w-0 max-w-[140px]">
                  <p className="truncate text-xs font-bold text-[#0F2B2F]">{a.name}</p>
                  <p className="text-[11px] font-semibold text-[#46666A]">{fmtSize(a.size)}</p>
                </div>
                <button type="button" onClick={() => removeAttachment(a.id)} aria-label={`Remove ${a.name}`}
                  className={`absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#46666A] shadow-sm transition hover:text-[#0F2B2F] ${FOCUS}`}>
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {recording ? (
          <div className="flex items-center gap-2 rounded-[28px] border border-[#CFE3E0] bg-white p-2 shadow-[0_8px_24px_-8px_rgba(18,77,67,0.3)]">
            <button type="button" onClick={rec.cancel} aria-label="Cancel recording"
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-red-600 transition hover:bg-red-50 active:scale-95 ${FOCUS}`}>
              <Trash2 size={19} />
            </button>
            <div className="flex min-w-0 flex-1 items-center gap-2 px-1" aria-live="polite">
              <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-red-500" aria-hidden="true" />
              <span className="text-sm font-bold tabular-nums">{fmtTimer(rec.seconds)}</span>
              <span className="truncate text-xs font-semibold text-[#46666A]">Recording…</span>
            </div>
            <button type="button" onClick={sendVoice} aria-label="Send voice message"
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#184D43] text-white shadow-md shadow-[#184D43]/40 transition hover:bg-[#123A32] active:scale-95 ${FOCUS}`}>
              <Send size={17} color="#FFFFFF" />
            </button>
          </div>
        ) : (
          <form onSubmit={submit}
            className="flex items-end gap-1 rounded-[28px] border border-[#CFE3E0] bg-white p-2 shadow-[0_8px_24px_-8px_rgba(18,77,67,0.3)] transition focus-within:border-[#2A8C82] focus-within:shadow-[0_8px_28px_-6px_rgba(30,158,147,0.45)] focus-within:ring-4 focus-within:ring-[#2A8C82]/15">
            <input ref={fileRef} type="file" multiple className="hidden" onChange={onPickFiles} />
            <button type="button" aria-label="Attach file" onClick={() => fileRef.current?.click()}
              className={`${ICON_BTN} mb-0.5 h-10 w-10 shrink-0 ${FOCUS}`}>
              <Paperclip size={19} />
            </button>
            <textarea ref={inputRef} rows={1} value={draft} onChange={(e) => onDraft(e.target.value)}
              onKeyDown={handleKeyDown} placeholder="Write a message" aria-label="Message"
              className="max-h-[120px] min-w-0 flex-1 resize-none self-center border-0 bg-transparent px-2 py-2 text-base font-medium leading-6 placeholder-[#5B7A7E] focus:outline-none sm:text-sm" />
            <button ref={emojiBtnRef} type="button" aria-label="Emojis" aria-expanded={emojiOpen}
              onClick={() => setEmojiOpen((v) => !v)}
              className={`${ICON_BTN} mb-0.5 h-10 w-10 shrink-0 ${emojiOpen ? "bg-[#D5EEEA]" : ""} ${FOCUS}`}>
              <Smile size={19} />
            </button>
            <button type="button" aria-label="Record voice message" disabled={rec.state === "starting"}
              onClick={() => { setFileError(""); setEmojiOpen(false); rec.start(); }}
              className={`${ICON_BTN} mb-0.5 h-10 w-10 shrink-0 ${rec.state === "starting" ? "opacity-50" : ""} ${FOCUS}`}>
              <Mic size={19} />
            </button>
            <button type="submit" aria-label="Send message" disabled={!canSend}
              className={`mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition active:scale-95 ${FOCUS} ${
                canSend
                  ? "bg-[#184D43] text-white shadow-md shadow-[#184D43]/40 hover:scale-105 hover:bg-[#123A32]"
                  : "cursor-not-allowed bg-[#E3EFED] text-[#93B0AE]"
              }`}>
              <Send size={17} color={canSend ? "#FFFFFF" : "#93B0AE"} />
            </button>
          </form>
        )}
        {!recording && (
          <p className="mt-1.5 hidden text-center text-xs font-semibold text-[#46666A] sm:block">
            Enter to send. Shift + Enter for a new line.
          </p>
        )}
      </footer>
    </section>
  );
}

/* ================= NEW CHAT MODAL (real patients) ================= */
const fmtClock = (ts) => new Date(ts).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
const fmtPatientDate = (ts) => {
  const d = new Date(ts);
  const withYear = d.getFullYear() !== new Date().getFullYear();
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", ...(withYear ? { year: "numeric" } : {}) });
};

function NewChatModal({ chats, onClose, onPick }) {
  const storeSessions = useSessions();
  const now = useNow();
  const [query, setQuery] = useState("");
  const autoFocusSearch = typeof window !== "undefined" && window.innerWidth >= 640;

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  /* Unique patients from the real sessions, with their next / last session */
  const patients = useMemo(() => {
    const map = new Map();
    storeSessions.forEach((s) => {
      if (s.status !== "scheduled" && s.status !== "completed") return;
      const name = (s.patientName || "").trim();
      if (!name) return;
      const key = name.toLowerCase();
      const entry = map.get(key) || { name, next: null, last: null };
      const ended = s.status === "completed" || sessionEnd(s) <= now;
      if (ended) {
        if (entry.last === null || s.start > entry.last) entry.last = s.start;
      } else if (entry.next === null || s.start < entry.next) {
        entry.next = s.start;
      }
      map.set(key, entry);
    });
    return [...map.values()].sort((x, y) => x.name.localeCompare(y.name));
  }, [storeSessions, now]);

  const q = query.trim().toLowerCase();
  const shown = q ? patients.filter((p) => p.name.toLowerCase().includes(q)) : patients;
  const hasChat = (name) => chats.some((c) => c.name.toLowerCase() === name.toLowerCase());

  const pick = (p) =>
    onPick({ name: p.name, session: p.next ? `${formatDay(p.next, now)}, ${fmtClock(p.next)}` : "" });

  return (
    <div className="ch-backdrop fixed inset-0 z-[57] flex items-end justify-center bg-[#0A1F17]/50 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label="New chat"
        className="flex max-h-[88dvh] w-full max-w-md flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:rounded-3xl">
        <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-slate-200 sm:hidden" aria-hidden="true" />
        <div className="flex shrink-0 items-center justify-between px-5 pb-2 pt-3 sm:px-6 sm:pt-5">
          <h2 className="text-lg font-extrabold tracking-tight text-[#122A2E]">New chat</h2>
          <button type="button" aria-label="Close" onClick={onClose}
            className={`rounded-full p-2.5 text-[#5B7A7E] hover:bg-[#F0F9F7] sm:p-2 ${FOCUS}`}>
            <X size={18} />
          </button>
        </div>

        <div className="shrink-0 px-5 pb-3 sm:px-6">
          <div className="relative flex items-center">
            <Search size={16} className="pointer-events-none absolute left-3.5 text-[#46666A]" />
            <input type="text" autoFocus={autoFocusSearch} value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search patients" aria-label="Search patients"
              className="h-11 w-full rounded-full border border-[#D5E8E5] bg-[#EEF7F5] pl-10 pr-4 text-base font-medium placeholder-[#5B7A7E] transition focus:border-[#2A8C82] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2A8C82]/15 sm:h-10 sm:text-sm" />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-4 sm:pb-4">
          {patients.length === 0 && (
            <p className="px-4 py-8 text-center text-sm font-semibold text-[#46666A]">
              No patients yet. Patients appear here once a session is scheduled.
            </p>
          )}
          {patients.length > 0 && shown.length === 0 && (
            <p className="px-4 py-8 text-center text-sm font-semibold text-[#46666A]">No patients match your search.</p>
          )}
          {shown.map((p) => {
            const existing = hasChat(p.name);
            const info = p.next
              ? `Next session: ${formatDay(p.next, now)}, ${fmtClock(p.next)}`
              : p.last
                ? `Last session: ${fmtPatientDate(p.last)}`
                : "No sessions yet";
            return (
              <button key={p.name} type="button" onClick={() => pick(p)}
                className={`mb-1 flex w-full items-center gap-3 rounded-2xl p-3 text-left transition hover:bg-[#F0F9F7] active:bg-[#E8F6F3] ${FOCUS}`}>
                <Avatar name={p.name} size="h-11 w-11" text="text-sm" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-extrabold text-[#0F2B2F]">{p.name}</div>
                  <div className="truncate text-xs font-semibold text-[#46666A]">{info}</div>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${
                  existing ? "bg-[#E3F4F1] text-[#1E7A70]" : "bg-[#184D43] text-white"
                }`}>
                  {existing ? "Open chat" : "Start chat"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ================= INFO PANEL ================= */
function InfoSection({ title, children }) {
  return (
    <div className="border-t border-[#E1EEEB] px-5 py-5">
      <h4 className="mb-3 text-xs font-bold text-[#46666A]">{title}</h4>
      {children}
    </div>
  );
}

function InfoPanel({ chat, onClose, onCall }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const sharedFiles = [
    ...(chat.attachment ? [{ id: "seed", name: chat.fileName || "Shared document" }] : []),
    ...chat.messages.flatMap((m) => m.files || []),
  ];

  return (
    <>
      <div className="ch-backdrop fixed inset-0 z-[55] bg-[#0A1F17]/40 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <aside role="dialog" aria-modal="true" aria-label="Contact details"
        className="ch-drawer fixed inset-y-0 right-0 z-[56] flex w-full flex-col overflow-hidden bg-white shadow-2xl sm:w-96">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)]">
          {/* Solid banner (no gradient) */}
          <div className="h-36 bg-[#2A8C82] pt-[env(safe-area-inset-top)]">
            <div className="flex h-[64px] items-center justify-between px-5">
              <h3 className="text-[15px] font-extrabold text-white">Contact details</h3>
              <button type="button" onClick={onClose} aria-label="Close details"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <X size={19} />
              </button>
            </div>
          </div>

          {/* Profile — avatar sits half on the banner */}
          <div className="flex flex-col items-center px-5 pb-6 text-center">
            <div className="-mt-14">
              <Avatar name={chat.name} status={chat.status} size="h-28 w-28" text="text-3xl" ring
                dot="bottom-2 right-2 h-4 w-4" />
            </div>
            <h2 className="ch-serif mt-3 text-xl font-semibold text-[#0F2B2F]">{chat.name}</h2>
            <p className="mt-0.5 text-xs font-bold capitalize text-[#46666A]">{chat.type}</p>
            <p className={`mt-1 text-xs font-bold ${STATUS_COLOR[chat.status] || STATUS_COLOR.offline}`}>
              {statusText(chat)}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2.5">
              <button type="button" onClick={() => onCall("audio")}
                className={`flex items-center gap-2 rounded-full border border-[#BFE3DC] bg-[#E3F4F1] px-5 py-2.5 text-xs font-bold text-[#1E7A70] transition hover:bg-[#D2EEE9] active:scale-95 ${FOCUS}`}>
                <Phone size={15} /> Audio call
              </button>
              <button type="button" onClick={() => onCall("video")}
                className={`flex items-center gap-2 rounded-full bg-[#184D43] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#123A32] active:scale-95 ${FOCUS}`}>
                <Video size={15} /> Video call
              </button>
            </div>
          </div>

          <InfoSection title="Next appointment">
            {chat.session ? (
              <div className="flex items-center gap-3 rounded-2xl border border-[#D2E6E3] border-l-4 border-l-[#2A8C82] bg-[#E3F4F1] p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#1E7A70]">
                  <CalendarDays size={18} />
                </div>
                <span className="text-sm font-bold text-[#0F2B2F]">{chat.session}</span>
              </div>
            ) : (
              <p className="text-sm font-semibold text-[#46666A]">No upcoming session.</p>
            )}
          </InfoSection>

          <InfoSection title="Shared files">
            {sharedFiles.length > 0 ? (
              <div className="space-y-2">
                {sharedFiles.map((f) => {
                  const Row = f.url ? "a" : "div";
                  const linkProps = f.url ? { href: f.url, download: f.name } : {};
                  return (
                    <Row key={f.id} {...linkProps}
                      className="flex items-center gap-3 rounded-2xl border border-[#D2E6E3] bg-white p-3 transition hover:bg-[#F0F9F7]">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E3F4F1] text-[#1E7A70]">
                        <FileText size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#0F2B2F]">{f.name}</p>
                        {f.size > 0 && <p className="text-[11px] font-semibold text-[#46666A]">{fmtSize(f.size)}</p>}
                      </div>
                    </Row>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm font-semibold text-[#46666A]">No files shared yet.</p>
            )}
          </InfoSection>
        </div>
      </aside>
    </>
  );
}

/* ================= CALL SCREEN ================= */
function CallOverlay({ chat, type, onEnd }) {
  const isVideo = type === "video";
  const [phase, setPhase] = useState("calling");
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [attempt, setAttempt] = useState(0);

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

  const ctrl = "flex h-16 w-16 items-center justify-center rounded-full transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F2B2F]";

  return (
    <div role="dialog" aria-modal="true" aria-label={`${isVideo ? "Video" : "Audio"} call with ${chat.name}`}
      className="ch-backdrop fixed inset-0 z-[60] flex flex-col bg-[#123F3A] text-white">
      <div className="px-6 pt-[max(1.5rem,env(safe-area-inset-top))] text-center">
        <h2 className="ch-serif text-2xl font-semibold">{chat.name}</h2>
        <p className="mt-1 text-sm font-bold text-white/85" aria-live="polite">{subtitle}</p>
        {phase === "unavailable" && chat.lastSeen && (
          <p className="mt-1 text-xs font-semibold text-white/65">Last seen {chat.lastSeen.toLowerCase()}</p>
        )}
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        <div className="relative">
          {/* Glow rings around the avatar */}
          <span className="absolute -inset-5 rounded-full bg-[#22B8AA]/15" aria-hidden="true" />
          <span className="absolute -inset-10 rounded-full bg-[#22B8AA]/10" aria-hidden="true" />
          {phase === "calling" && <span className="ch-ring absolute inset-0 rounded-full bg-white/30" aria-hidden="true" />}
          <Avatar name={chat.name} size="h-32 w-32 sm:h-40 sm:w-40" text="text-4xl" ring />
        </div>

        {isVideo && (
          <div className="absolute bottom-4 right-4 flex h-36 w-24 items-center justify-center overflow-hidden rounded-2xl border border-white/25 bg-[#1F3A38] shadow-xl sm:h-44 sm:w-32">
            {camOff ? <VideoOff size={22} className="text-white/70" /> : <span className="text-xs font-bold text-white/80">You</span>}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-5 px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4">
        {phase === "unavailable" ? (
          <>
            <button type="button" onClick={onEnd}
              className="rounded-full border border-white/40 px-7 py-3.5 text-sm font-bold transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              Close
            </button>
            <button type="button" onClick={() => setAttempt((a) => a + 1)}
              className="rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#0F2B2F] shadow-lg transition hover:bg-[#E3F4F1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              Try again
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={() => setMuted((m) => !m)} aria-pressed={muted}
              aria-label={muted ? "Unmute microphone" : "Mute microphone"}
              className={`${ctrl} ${muted ? "bg-white text-[#0F2B2F]" : "bg-white/15 hover:bg-white/25"}`}>
              {muted ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            {isVideo && (
              <button type="button" onClick={() => setCamOff((c) => !c)} aria-pressed={camOff}
                aria-label={camOff ? "Turn camera on" : "Turn camera off"}
                className={`${ctrl} ${camOff ? "bg-white text-[#0F2B2F]" : "bg-white/15 hover:bg-white/25"}`}>
                {camOff ? <VideoOff size={24} /> : <Video size={24} />}
              </button>
            )}
            <button type="button" onClick={onEnd} aria-label="End call"
              className={`${ctrl} bg-red-500 shadow-lg shadow-red-500/40 hover:bg-red-600`}>
              <PhoneOff size={24} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}