import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  Plus,
  Search,
  Paperclip,
  Smile,
  Mic,
  Send,
  Phone,
  Video,
  Info,
  CalendarDays,
  CheckCheck,
  MessageSquareText,
  Menu,
} from "lucide-react";

import Sidebar from "./Sidebar";

/* ============================================================
   DATA SETUP
============================================================ */

const CONVERSATIONS = [
  {
    id: 1,
    name: "John Smith",
    type: "patient",
    status: "online",
    avatar: "",
    time: "10:30 AM",
    unread: 2,
    session: "Tomorrow, 10:00 AM – 11:00 AM",
    messages: [
      { id: 1, from: "them", text: "Hi Dr. Sarah, I've been feeling a bit anxious lately and wanted to talk about it.", time: "10:28 AM" },
      { id: 2, from: "me", text: "Hello John! I'm glad you reached out. Can you tell me what has been causing you the most stress?", time: "10:29 AM" },
      { id: 3, from: "them", text: "I think it's mostly work pressure and overthinking at night.", time: "10:30 AM" },
      { id: 4, from: "me", text: "Thank you for sharing that. Let's work on some strategies to help you manage this better.", time: "10:30 AM", reaction: 1 },
    ],
  },
  {
    id: 2,
    name: "Emma Wilson",
    type: "patient",
    status: "away",
    avatar: "",
    time: "9:15 AM",
    unread: 1,
    session: "Tomorrow, 11:30 AM – 12:30 PM",
    messages: [
      { id: 1, from: "me", text: "How are you feeling after our last session, Emma?", time: "Yesterday" },
      { id: 2, from: "them", text: "Thank you for the session yesterday, it helped a lot.", time: "9:15 AM" },
    ],
  },
  {
    id: 3,
    name: "David Brown",
    type: "patient",
    status: "",
    avatar: "",
    time: "Yesterday",
    unread: 0,
    session: "",
    messages: [
      { id: 1, from: "them", text: "Can we reschedule our next session?", time: "Yesterday" },
    ],
  },
  {
    id: 4,
    name: "Sophia Johnson",
    type: "patient",
    status: "",
    avatar: "",
    time: "Yesterday",
    unread: 0,
    session: "",
    attachment: true,
    messages: [
      { id: 1, from: "me", text: "Here is a short guide on mindful breathing. Try it daily.", time: "Yesterday" },
    ],
  },
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "patient", label: "Patients" },
  { key: "group", label: "Groups" },
];

const STATUS_LABEL = { online: "Online", away: "Away", "": "Offline" };
const STATUS_COLOR = { online: "text-emerald-600", away: "text-amber-600", "": "text-slate-400" };

const nowTime = () =>
  new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

const lastText = (c) => c.messages[c.messages.length - 1]?.text || "";

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
   MAIN CONTAINER
============================================================ */

export default function Chats({
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

  const [chats, setChats] = useState(CONVERSATIONS);
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id);
  // On phones only one pane is visible at a time: the list, or an open thread
  const [threadOpen, setThreadOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [draft, setDraft] = useState("");

  const active = chats.find((c) => c.id === activeId);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return chats.filter((c) => {
      const okFilter =
        filter === "all" ||
        (filter === "unread" && c.unread > 0) ||
        c.type === filter;
      const okQuery = !q || c.name.toLowerCase().includes(q);
      return okFilter && okQuery;
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
        c.id === active.id
          ? {
              ...c,
              time,
              messages: [...c.messages, { id: Date.now(), from: "me", text, time }],
            }
          : c
      )
    );
    setDraft("");
  };

  const navigateFromDrawer = (page) => {
    setMobileNavOpen(false);
    if (typeof onNavigate === "function") onNavigate(page);
  };

  return (
    <div
      className="ch-root flex h-[100dvh] flex-col overflow-hidden bg-[#E6ECF3] text-slate-800 antialiased"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        /* hide scrollbars everywhere, scrolling still works */
        html, body, .ch-root, .ch-root * { scrollbar-width: none; -ms-overflow-style: none; }
        html::-webkit-scrollbar, body::-webkit-scrollbar,
        .ch-root::-webkit-scrollbar, .ch-root *::-webkit-scrollbar { display: none; width: 0; height: 0; }

        @keyframes ch-fade { from { opacity: 0; } to { opacity: 1; } }
        .ch-backdrop { animation: ch-fade .2s ease both; }
        @media (prefers-reduced-motion: reduce) { .ch-backdrop { animation: none; } }
      `}</style>

      {/* ================= SIDEBAR ================= */}
      {isDesktop ? (
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={onToggleSidebar}
          activePage="Chats"
          onNavigate={onNavigate}
          onLogout={onLogout}
          partnerName="Prem Zumble"
        />
      ) : (
        mobileNavOpen && (
          <>
            <div
              className="ch-backdrop fixed inset-0 z-40 bg-black/45"
              onClick={() => setMobileNavOpen(false)}
              aria-hidden="true"
            />
            <div className="relative z-50">
              <Sidebar
                collapsed={false}
                onToggle={() => setMobileNavOpen(false)}
                activePage="Chats"
                onNavigate={navigateFromDrawer}
                onLogout={onLogout}
                partnerName="Prem Zumble"
              />
            </div>
          </>
        )
      )}

      {/* ================= MOBILE TOP BAR ================= */}
      <div
        className={`${
          threadOpen ? "hidden md:flex" : "flex"
        } shrink-0 items-center gap-3 border-b border-slate-200 bg-[#E6ECF3] px-4 py-3 lg:hidden`}
      >
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-800 shadow-sm ring-1 ring-slate-200"
        >
          <Menu size={20} />
        </button>
        <span className="text-[15px] font-semibold text-slate-800">Chats</span>
      </div>

      {/* ================= MAIN ================= */}
      <main
        className="box-border min-h-0 flex-1 overflow-hidden p-2 transition-[margin] duration-300 ease-in-out sm:p-3 md:p-4 lg:ml-[var(--sb)] lg:p-6"
        style={{ "--sb": `${sidebarWidth}px` }}
      >
        <div className="flex h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_10px_40px_-10px_rgba(15,23,42,0.18)]">
          <ConversationList
            hiddenOnMobile={threadOpen}
            list={list}
            activeId={activeId}
            onOpen={openChat}
            query={query}
            onQuery={setQuery}
            filter={filter}
            onFilter={setFilter}
          />

          {active ? (
            <Thread
              hiddenOnMobile={!threadOpen}
              chat={active}
              draft={draft}
              onDraft={setDraft}
              onSend={sendMessage}
              onBack={() => setThreadOpen(false)}
            />
          ) : (
            <section className="hidden flex-1 items-center justify-center bg-[#F6F7F9] text-sm font-semibold text-slate-400 md:flex">
              Select a conversation to start messaging
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   AVATAR COMPONENT
============================================================ */

function Avatar({ name, size = "h-10 w-10", status }) {
  const dot =
    status === "online" ? "bg-emerald-500" : status === "away" ? "bg-amber-400" : "";

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="relative shrink-0">
      <div
        className={`${size} flex items-center justify-center rounded-2xl bg-slate-200 text-xs font-bold text-slate-700`}
      >
        {initials}
      </div>
      {dot && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${dot}`}
        />
      )}
    </div>
  );
}

/* ============================================================
   LEFT: CONVERSATION LIST
============================================================ */

function ConversationList({ hiddenOnMobile, list, activeId, onOpen, query, onQuery, filter, onFilter }) {
  return (
    <aside
      className={`${
        hiddenOnMobile ? "hidden md:flex" : "flex"
      } min-h-0 w-full shrink-0 flex-col border-r border-slate-200 bg-white md:w-80 lg:w-[22rem]`}
    >
      {/* Header */}
      <div className="shrink-0 p-4 pb-3">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-[#E6ECF3] p-2 text-slate-700">
              <MessageSquareText size={18} />
            </div>
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900">Patient Inbox</h1>
          </div>

          <button
            type="button"
            aria-label="New chat"
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2D6A4F] text-white shadow-sm transition hover:bg-[#245A41] active:scale-95 sm:h-9 sm:w-9"
          >
            <Plus size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-3 flex items-center">
          <div className="pointer-events-none absolute left-3.5 flex items-center justify-center text-slate-400">
            <Search size={16} />
          </div>
          {/* text-base on mobile stops iOS from zooming on focus */}
          <input
            type="text"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search patients..."
            className="h-11 w-full rounded-2xl border border-transparent bg-[#E6ECF3] pl-10 pr-3.5 text-base font-medium text-slate-800 placeholder-slate-400 transition focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-slate-200/70 sm:h-10 sm:text-sm"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => onFilter(f.key)}
              className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-semibold transition sm:px-3 sm:py-1.5 ${
                filter === f.key
                  ? "bg-[#2D6A4F] text-white shadow-sm"
                  : "bg-[#E6ECF3] text-slate-600 hover:bg-[#D9E1EB]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List Items */}
      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 pb-2">
        {list.length === 0 && (
          <p className="p-6 text-center text-xs font-medium text-slate-400">No conversations found</p>
        )}

        {list.map((c) => {
          const selected = c.id === activeId;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onOpen(c.id)}
              className={`flex w-full items-center rounded-2xl p-3 text-left transition ${
                selected ? "bg-[#E6ECF3]" : "hover:bg-slate-50"
              }`}
            >
              <div className="mr-3">
                <Avatar name={c.name} status={c.status} size="h-12 w-12 sm:h-11 sm:w-11" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center justify-between gap-1">
                  <span
                    className={`truncate text-sm ${
                      c.unread > 0 || selected ? "font-extrabold text-slate-900" : "font-semibold text-slate-800"
                    }`}
                  >
                    {c.name}
                  </span>
                  <span className="shrink-0 text-[11px] font-medium text-slate-400">{c.time}</span>
                </div>
                <p
                  className={`truncate text-[13px] ${
                    c.unread > 0 ? "font-semibold text-slate-700" : "font-medium text-slate-500"
                  }`}
                >
                  {c.attachment ? "Shared document" : lastText(c)}
                </p>
              </div>

              {c.unread > 0 && (
                <span className="ml-2 inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-extrabold text-white">
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

/* ============================================================
   RIGHT: CHAT THREAD
============================================================ */

function Thread({ hiddenOnMobile, chat, draft, onDraft, onSend, onBack }) {
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.id, chat.messages.length]);

  // Auto-grow the message box (up to ~5 lines)
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [draft, chat.id]);

  // Enter sends, Shift+Enter adds a new line
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      onSend();
    }
  };

  const canSend = draft.trim().length > 0;

  return (
    <section
      className={`${
        hiddenOnMobile ? "hidden md:flex" : "flex"
      } min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#F6F7F9]`}
    >
      {/* Header */}
      <div className="flex h-[68px] shrink-0 items-center justify-between gap-2 border-b border-slate-200 bg-white px-2 sm:px-5">
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to conversations"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-[#E6ECF3] md:hidden"
          >
            <ChevronLeft size={22} />
          </button>

          <Avatar name={chat.name} status={chat.status} size="h-11 w-11" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-[15px] font-bold text-slate-900">{chat.name}</h2>
              <span className="hidden rounded-full bg-[#E6ECF3] px-2 py-0.5 text-[10px] font-semibold capitalize text-slate-600 min-[420px]:inline">
                {chat.type}
              </span>
            </div>
            <span className={`text-xs font-medium ${STATUS_COLOR[chat.status] || STATUS_COLOR[""]}`}>
              {STATUS_LABEL[chat.status] ?? "Offline"}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {[
            { icon: Phone, label: "Audio", cls: "" },
            { icon: Video, label: "Video", cls: "" },
            { icon: Info, label: "Details", cls: "hidden min-[380px]:flex" },
          ].map(({ icon: Icon, label, cls }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              className={`${cls || "flex"} h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-[#E6ECF3] hover:text-slate-900`}
            >
              <Icon size={18} />
            </button>
          ))}
        </div>
      </div>

      {/* Messages Feed */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-5">
        {chat.session && (
          <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between sm:p-3.5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#E6ECF3] p-2.5 text-slate-700">
                <CalendarDays size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-900">Next Appointment</div>
                <div className="text-xs font-medium text-slate-500">{chat.session}</div>
              </div>
            </div>
            <button
              type="button"
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 transition hover:bg-slate-50 sm:py-1.5"
            >
              Details
            </button>
          </div>
        )}

        {/* Date Divider */}
        <div className="my-4 flex items-center justify-center">
          <span className="rounded-full bg-slate-200/70 px-3 py-1 text-[11px] font-semibold text-slate-500">
            Today
          </span>
        </div>

        {/* Chat Messages */}
        {chat.messages.map((m, i) => {
          const prev = chat.messages[i - 1];
          const next = chat.messages[i + 1];
          const firstInGroup = !prev || prev.from !== m.from;
          const lastInGroup = !next || next.from !== m.from;
          const gap = firstInGroup ? "mt-4" : "mt-1";

          if (m.from === "them") {
            return (
              <div key={m.id} className={`${gap} flex max-w-[88%] items-end gap-2 sm:max-w-lg`}>
                <div className="w-8 shrink-0">
                  {lastInGroup && <Avatar name={chat.name} size="h-8 w-8" />}
                </div>
                <div
                  className={`min-w-0 rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-[15px] leading-relaxed text-slate-800 shadow-sm sm:text-sm ${
                    lastInGroup ? "rounded-bl-md" : ""
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.text}</p>
                  <div className="mt-1 text-right text-[10px] font-medium text-slate-400">{m.time}</div>
                </div>
              </div>
            );
          }

          return (
            <div key={m.id} className={`${gap} flex justify-end`}>
              <div className={`relative max-w-[88%] sm:max-w-lg ${m.reaction > 0 ? "mb-3" : ""}`}>
                <div
                  className={`rounded-2xl bg-[#2D6A4F] px-3.5 py-2.5 text-[15px] leading-relaxed text-white shadow-sm sm:text-sm ${
                    lastInGroup ? "rounded-br-md" : ""
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.text}</p>
                  <div className="mt-1 flex items-center justify-end gap-1 text-[10px] font-medium text-[#D8F3DC]/80">
                    <span>{m.time}</span>
                    <CheckCheck size={14} className="text-sky-300" />
                  </div>
                </div>

                {m.reaction > 0 && (
                  <div className="absolute -bottom-3 left-3 flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] shadow-sm">
                    <span>❤️</span>
                    <span className="font-bold text-slate-700">{m.reaction}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Message Input Bar */}
      <footer className="shrink-0 px-2 pb-2 sm:px-4 sm:pb-4">
        <form
          onSubmit={onSend}
          className="flex items-end gap-1 rounded-3xl border border-slate-200 bg-white p-2 shadow-[0_6px_24px_-8px_rgba(15,23,42,0.18)] transition focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-200/70"
        >
          <button
            type="button"
            aria-label="Attach file"
            className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-[#E6ECF3] hover:text-slate-800"
          >
            <Paperclip size={19} />
          </button>

          {/* text-base on mobile stops iOS from zooming on focus */}
          <textarea
            ref={inputRef}
            rows={1}
            value={draft}
            onChange={(e) => onDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a message..."
            aria-label="Message"
            className="max-h-[120px] min-w-0 flex-1 resize-none self-center border-0 bg-transparent px-2 py-2 text-base font-medium leading-6 text-slate-800 placeholder-slate-400 focus:outline-none sm:text-sm"
          />

          <button
            type="button"
            aria-label="Emojis"
            className="mb-0.5 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-[#E6ECF3] hover:text-slate-800 min-[400px]:flex"
          >
            <Smile size={19} />
          </button>
          <button
            type="button"
            aria-label="Voice"
            className="mb-0.5 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-[#E6ECF3] hover:text-slate-800 min-[340px]:flex"
          >
            <Mic size={19} />
          </button>

          <button
            type="submit"
            aria-label="Send message"
            disabled={!canSend}
            className={`mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition active:scale-95 ${
              canSend
                ? "bg-[#2D6A4F] text-white shadow-md hover:bg-[#245A41]"
                : "cursor-not-allowed bg-[#E6ECF3] text-slate-400"
            }`}
          >
            <Send size={17} />
          </button>
        </form>
        <p className="mt-1.5 hidden text-center text-[11px] font-medium text-slate-400 sm:block">
          Enter to send • Shift + Enter for a new line
        </p>
      </footer>
    </section>
  );
}