import { useState, useRef, useEffect } from 'react';
import { initialPartners } from '../../data/dashboardData';

/*
  Chat with wellness partners.
  - Messages + unread counts are saved in localStorage (they survive refresh / page switch).
  - DEMO MODE: partner replies are generated locally (typing indicator + delayed reply).
    To connect a real backend later, replace `buildReply` / `scheduleReply` with your API / socket calls.
*/

const STORE_KEY = 'manovedh_chats';
const mins = (m) => Date.now() - m * 60000;
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const seed = () => ({
  messages: {
    1: [
      { id: 's1', sender: 'them', text: "Hello! I saw your latest wellness check results. Let's discuss how you are doing.", ts: mins(95) },
      { id: 's2', sender: 'me', text: 'Hi Sir, I completed my phonation and observation activities today.', ts: mins(83), status: 'read' },
    ],
    2: [{ id: 's3', sender: 'them', text: 'Hello! Welcome to General & Counseling support.', ts: mins(300) }],
  },
  unread: { 2: 1 },
});

const load = () => {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (p && p.messages && p.unread) return p;
    }
  } catch { /* ignore */ }
  return seed();
};
const save = (s) => { try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch { /* ignore */ } };

/* ---------- reply generator (demo) ---------- */
const pick = (arr, n) => arr[n % arr.length];

function buildReply(text, n) {
  const t = text.trim();
  if (/(suicid|kill myself|end my life|end it all|self[\s-]?harm|hurt myself|want to die|don'?t want to live|आत्महत्या)/i.test(t)) {
    return "I'm really glad you told me, and I'm taking this seriously. You don't have to face it alone. Please call Tele-MANAS at 14416 (free, 24/7) or 112 right now, or go to someone near you. If you are in immediate danger, call 112. I'm here with you — are you safe at this moment?";
  }
  if (/^(hi|hii+|hello|hey|namaste|namaskar|good (morning|afternoon|evening)|नमस्कार|नमस्ते)\b/i.test(t) && t.length < 40) {
    return pick(['Hello! I\'m glad you reached out. How are you feeling today?', 'Hi there! Good to hear from you. What would you like to talk about?'], n);
  }
  if (/(thank|thanks|thx|dhanyavad|आभार|धन्यवाद)/i.test(t)) {
    return pick(["You're most welcome. I'm here whenever you need to talk.", 'Happy to help. Take it one step at a time — you are doing well.'], n);
  }
  if (/(bye|good night|see you|take care|ok bye)/i.test(t)) {
    return 'Take care of yourself. Remember, you can message me any time. Be kind to yourself today.';
  }
  if (/(anxious|anxiety|nervous|panic|worried|worry|scared|afraid|restless|ghabar|भीती|चिंता)/i.test(t)) {
    return pick([
      'That sounds uncomfortable. Let\'s slow down together: breathe in for 4 counts, hold for 4, breathe out for 6. Repeat a few times. What is making you feel this way right now?',
      'Feeling anxious is very common, and it passes. Try noticing 5 things you can see around you. When did you first notice this feeling today?',
    ], n);
  }
  if (/(sad|depress|low|cry|crying|lonely|alone|hopeless|empty|down|दुःख|रडू)/i.test(t)) {
    return pick([
      "I'm sorry you are feeling this way, and thank you for sharing it with me. You don't have to go through this alone. Would you like to tell me what has been weighing on you?",
      'It takes courage to say that out loud. Your feelings are valid. How long have you been feeling low?',
    ], n);
  }
  if (/(stress|stressed|pressure|exam|deadline|overwhelm|burnout|tension|ताण)/i.test(t)) {
    return pick([
      'That sounds like a lot to carry. Let\'s break it down — what is the one thing that feels heaviest right now?',
      'Pressure can build up quietly. A short walk or a few deep breaths can help a little. What is your biggest source of stress at the moment?',
    ], n);
  }
  if (/(tired|sleep|insomnia|exhaust|fatigue|energy|झोप|थकवा)/i.test(t)) {
    return 'Rest matters a lot for your mind. How have your sleep hours been over the last few days? A fixed bedtime and no screens for 30 minutes before sleep can help.';
  }
  if (/(happy|good|great|better|fine|calm|relaxed|well|आनंद|छान)/i.test(t)) {
    return pick(['That is lovely to hear! What do you think helped you feel this way today?', "Wonderful. Let's hold on to what is working for you. What made today feel better?"], n);
  }
  if (/(session|appointment|book|schedule|reschedule|video call|meeting)/i.test(t)) {
    return 'Sure. You can book or change a slot from the Sessions page, or tap Request on my profile in Wellness Partner. Which day works best for you?';
  }
  if (/(activity|wellness check|voice|phonation|record)/i.test(t)) {
    return 'Great that you are doing the activities regularly. I will review your wellness check results before our next session. Did you find any step difficult?';
  }
  return pick([
    'I hear you. Could you tell me a little more about that?',
    'Thank you for sharing. How has this been affecting your day-to-day life?',
    'That makes sense. What would you like to feel instead, if things went well?',
    "I'm listening. Take your time — what else comes to mind?",
  ], n);
}

/* pure store helpers */
const withReply = (s, pid, text, viewing) => {
  const list = s.messages[pid] || [];
  const reply = { id: uid(), sender: 'them', text: buildReply(text, list.length), ts: Date.now() };
  return {
    messages: { ...s.messages, [pid]: [...list.map((m) => (m.sender === 'me' ? { ...m, status: 'read' } : m)), reply] },
    unread: viewing ? s.unread : { ...s.unread, [pid]: (s.unread[pid] || 0) + 1 },
  };
};
const markRead = (s, pid) => ({
  ...s,
  messages: { ...s.messages, [pid]: (s.messages[pid] || []).map((m) => (m.sender === 'me' ? { ...m, status: 'read' } : m)) },
});

/* ---------- formatting ---------- */
const fmtTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const dayKey = (ts) => new Date(ts).toDateString();
const dayLabel = (ts) => {
  const d = new Date(ts);
  const today = new Date();
  const y = new Date(); y.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === y.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function ChatsPage({ displayName = 'U' }) {
  const [store, setStore] = useState(load);
  const [activeId, setActiveId] = useState(1);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [typing, setTyping] = useState({}); // { [partnerId]: true }

  const storeRef = useRef(store);
  storeRef.current = store;
  const activeRef = useRef(activeId);
  activeRef.current = activeId;
  const pending = useRef({}); // { [partnerId]: { t1, t2, text } }
  const listRef = useRef(null);

  const update = (fn) => setStore((s) => { const n = fn(s); save(n); return n; });

  const active = initialPartners.find((p) => p.id === activeId) || initialPartners[0];
  const thread = store.messages[activeId] || [];
  const isTyping = !!typing[activeId];

  // On leaving the page: finish pending replies so they are not lost
  useEffect(() => () => {
    let s = storeRef.current;
    Object.entries(pending.current).forEach(([pid, p]) => {
      clearTimeout(p.t1);
      clearTimeout(p.t2);
      s = withReply(s, Number(pid), p.text, false);
    });
    pending.current = {};
    save(s);
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [thread.length, isTyping, activeId]);

  const openChat = (id) => {
    setActiveId(id);
    if (store.unread[id]) update((s) => ({ ...s, unread: { ...s.unread, [id]: 0 } }));
  };

  const scheduleReply = (pid, text) => {
    const old = pending.current[pid];
    if (old) { clearTimeout(old.t1); clearTimeout(old.t2); }

    const t1 = setTimeout(() => {
      update((s) => markRead(s, pid));
      setTyping((t) => ({ ...t, [pid]: true }));
    }, 800);

    const t2 = setTimeout(() => {
      delete pending.current[pid];
      setTyping((t) => ({ ...t, [pid]: false }));
      update((s) => withReply(s, pid, text, activeRef.current === pid));
    }, 800 + 1400 + Math.min(text.length * 25, 2200));

    pending.current[pid] = { t1, t2, text };
  };

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const pid = activeId;
    const msg = { id: uid(), sender: 'me', text, ts: Date.now(), status: 'sent' };
    update((s) => ({ ...s, messages: { ...s.messages, [pid]: [...(s.messages[pid] || []), msg] } }));
    setInput('');
    scheduleReply(pid, text);
  };

  // Conversation list: filtered + latest chat on top
  const q = search.toLowerCase();
  const partners = initialPartners
    .filter((p) => p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q))
    .map((p) => {
      const msgs = store.messages[p.id] || [];
      return { p, last: msgs[msgs.length - 1], unread: store.unread[p.id] || 0 };
    })
    .sort((a, b) => (b.last?.ts || 0) - (a.last?.ts || 0));

  return (
    <div className="p-6 lg:p-10 max-w-[1450px] w-full mx-auto flex flex-col h-full min-h-[640px] gap-4">
      <div className="flex items-center gap-4 bg-white border border-[#102a21]/10 rounded-[22px] p-6 shadow-xs shrink-0">
        <div className="w-12 h-12 bg-[#e8faf2] text-[#1e6f50] rounded-2xl flex items-center justify-center text-xl shadow-inner">💬</div>
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-[#102a21]">Messages & Chats</h1>
          <p className="text-xs lg:text-sm text-[#536861] mt-0.5">Connect and chat securely with your wellness partners.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] flex-grow min-h-0 overflow-hidden bg-white border border-[#102a21]/10 rounded-[24px] shadow-sm">
        {/* Conversation list */}
        <div className="border-r border-[#102a21]/10 flex flex-col min-h-0 max-h-[280px] lg:max-h-none">
          <div className="p-4 border-b border-[#102a21]/10 shrink-0">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search chats..." className="w-full px-4 py-2 bg-[#f4f7f5] border border-[#102a21]/10 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1e6f50]" />
          </div>
          <div className="overflow-y-auto flex-grow">
            {partners.map(({ p, last, unread }) => (
              <div key={p.id} onClick={() => openChat(p.id)} className={`p-4 flex items-center gap-3.5 border-b border-[#102a21]/5 cursor-pointer transition-colors ${activeId === p.id ? 'bg-[#e8faf2]/50 border-l-4 border-l-[#1e6f50]' : 'hover:bg-[#f9fbf9]'}`}>
                <div className="relative w-12 h-12 bg-[#e6f4ed] text-[#1e6f50] rounded-2xl flex items-center justify-center font-bold text-base shrink-0 shadow-inner">
                  👤
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>
                <div className="flex flex-col flex-grow overflow-hidden">
                  <div className="flex items-center justify-between gap-2">
                    <b className="text-xs font-bold text-[#102a21] truncate">{p.name}</b>
                    <span className="text-[10px] text-[#849590] shrink-0">{last ? fmtTime(last.ts) : ''}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p className={`text-[11px] truncate ${unread ? 'text-[#102a21] font-semibold' : 'text-[#536861]'}`}>
                      {typing[p.id] ? 'typing…' : last ? `${last.sender === 'me' ? 'You: ' : ''}${last.text}` : 'Start a conversation...'}
                    </p>
                    {unread > 0 && <span className="bg-[#1e6f50] text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shrink-0">{unread}</span>}
                  </div>
                </div>
              </div>
            ))}
            {partners.length === 0 && <p className="p-6 text-xs text-[#849590] text-center">No chats found.</p>}
          </div>
        </div>

        {/* Conversation */}
        <div className="flex flex-col min-h-0 bg-[#fafbfb]">
          <div className="p-4 bg-white border-b border-[#102a21]/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#e6f4ed] text-[#1e6f50] rounded-xl flex items-center justify-center font-bold text-sm shadow-inner">👤</div>
              <div>
                <b className="text-xs font-bold text-[#102a21] block">{active.name}</b>
                <span className="text-[10px] text-[#1e6f50] font-medium">{isTyping ? 'typing…' : `${active.role} • Online`}</span>
              </div>
            </div>
            <a href="tel:14416" className="p-2 bg-[#f4f7f5] hover:bg-[#e2e8e6] rounded-xl text-xs text-[#536861] transition-colors cursor-pointer" title="Call Tele-MANAS 14416">📞</a>
          </div>

          <div ref={listRef} className="flex-grow p-6 overflow-y-auto flex flex-col gap-3">
            {thread.length === 0 && <p className="text-xs text-[#849590] text-center my-auto">No messages yet. Say hello to {active.name}.</p>}

            {thread.map((msg, i) => {
              const mine = msg.sender === 'me';
              const newDay = i === 0 || dayKey(thread[i - 1].ts) !== dayKey(msg.ts);
              return (
                <div key={msg.id} className="flex flex-col gap-3">
                  {newDay && (
                    <div className="flex justify-center">
                      <span className="text-[10px] font-semibold text-[#536861] bg-[#e8eeeb] px-3 py-1 rounded-full">{dayLabel(msg.ts)}</span>
                    </div>
                  )}
                  <div className={`flex items-end gap-3 max-w-[80%] ${mine ? 'ml-auto flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${mine ? 'bg-[#0c231a] text-white' : 'bg-[#e6f4ed] text-[#1e6f50]'}`}>{mine ? displayName[0]?.toUpperCase() : '👤'}</div>
                    <div className={`px-3.5 py-3 rounded-2xl shadow-xs ${mine ? 'bg-[#0c231a] text-white rounded-br-none' : 'bg-white border border-[#102a21]/10 text-[#102a21] rounded-bl-none'}`}>
                      <p className="text-xs leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                      <span className={`text-[9px] mt-1 flex items-center gap-1 ${mine ? 'text-white/60 justify-end' : 'text-[#849590]'}`}>
                        {fmtTime(msg.ts)}
                        {mine && <span className={msg.status === 'read' ? 'text-emerald-300' : ''}>{msg.status === 'read' ? '✓✓' : '✓'}</span>}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-end gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs bg-[#e6f4ed] text-[#1e6f50] shrink-0">👤</div>
                <div className="px-4 py-3.5 rounded-2xl rounded-bl-none bg-white border border-[#102a21]/10 shadow-xs flex items-center gap-1">
                  {[0, 1, 2].map((d) => <span key={d} className="w-1.5 h-1.5 rounded-full bg-[#849590] animate-bounce" style={{ animationDelay: `${d * 150}ms` }}></span>)}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-[#102a21]/10 shrink-0">
            <div className="flex items-center gap-3">
              <input type="text" value={input} maxLength={500} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Type your message here..." className="flex-grow px-4 py-3 bg-[#f4f7f5] border border-[#102a21]/10 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1e6f50]" />
              <button onClick={send} disabled={!input.trim()} className="bg-[#0c231a] text-white px-5 py-3 rounded-xl text-xs font-bold hover:bg-[#1e6f50] transition-colors cursor-pointer shadow-sm disabled:opacity-40 disabled:cursor-not-allowed">Send</button>
            </div>
            <p className="text-[10px] text-[#849590] mt-2">Demo mode: replies are automated. In an emergency call Tele-MANAS 14416 or 112.</p>
          </div>
        </div>
      </div>
    </div>
  );
}