import { useEffect, useState, useSyncExternalStore } from "react";

/* ============================================================
   SESSION STORE
   Patients + Notifications donhi pages hach store vaparatat.
   Backend aalyavar fakt ya file madhlya functions madhe API calls lava.
   Session status: pending -> scheduled -> completed   (kiva declined)
============================================================ */

export const SESSION_MINUTES = 60; // session chi lambi
export const JOIN_BEFORE_MINUTES = 15; // session chya kiti min aadhi Join enable honar

const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const SESSION_MS = SESSION_MINUTES * MIN;
const JOIN_BEFORE_MS = JOIN_BEFORE_MINUTES * MIN;

/* ---------------- time helpers ---------------- */

export const startOfDay = (ts) => {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const slot = (days, h, m = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(h, m, 0, 0);
  return d.getTime();
};

const minutesFromNow = (m) => {
  const d = new Date(Date.now() + m * MIN);
  d.setSeconds(0, 0);
  return d.getTime();
};

export function formatTime(ts) {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDay(ts, now = Date.now()) {
  const diff = Math.round((startOfDay(ts) - startOfDay(now)) / DAY);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  return new Date(ts).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export const formatSlot = (ts, now) => `${formatDay(ts, now)}, ${formatTime(ts)}`;

export function timeAgo(ts, now = Date.now()) {
  const m = Math.floor((now - ts) / MIN);
  if (m < 1) return "Just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24 && formatDay(ts, now) === "Today") return `${h} hr ago`;
  return formatDay(ts, now);
}

export function formatCountdown(ms) {
  const mins = Math.max(1, Math.ceil(ms / MIN));
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) {
    const rest = mins % 60;
    return rest ? `${hours}h ${rest}m` : `${hours}h`;
  }
  return `${Math.floor(hours / 24)}d ${hours % 24}h`;
}

// value for <input type="datetime-local">
export function toLocalInput(ts) {
  const d = new Date(ts);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

/* ---------------- session helpers ---------------- */

export const sessionEnd = (s) => s.start + SESSION_MS;
export const joinOpensAt = (s) => s.start - JOIN_BEFORE_MS;

// "none" | "early" (disabled) | "open" (enabled) | "ended" (disabled)
export function joinState(s, now = Date.now()) {
  if (s.status !== "scheduled") return "none";
  if (now < joinOpensAt(s)) return "early";
  if (now < sessionEnd(s)) return "open";
  return "ended";
}

// Same vel la dusra scheduled session asel tar to return hoto
export function findConflict(sessions, start, ignoreId) {
  return (
    sessions.find(
      (o) =>
        o.id !== ignoreId &&
        o.status === "scheduled" &&
        Math.abs(o.start - start) < SESSION_MS
    ) || null
  );
}

/* ---------------- store ---------------- */

let uid = 0;
const nextId = () => `s${++uid}`;

function seed() {
  const now = Date.now();
  const mk = (patientId, patientName, age, gender, problem, status, start, extra = {}) => ({
    id: nextId(),
    patientId,
    patientName,
    age,
    gender,
    problem,
    status,
    start,
    requestedAt: now - 2 * DAY,
    updatedAt: now - 2 * DAY,
    seen: status !== "pending",
    rescheduled: false,
    note: "",
    notes: [],
    ...extra,
  });

  return [
    // Join ata enable asel (session 10 min var aahe)
    mk(1, "John Smith", 24, "Male", "Anxiety", "scheduled", minutesFromNow(10), { updatedAt: now - 3 * HOUR }),
    mk(2, "Emma Wilson", 19, "Female", "Stress", "scheduled", slot(1, 11, 30)),
    // Patient requests (Notifications madhe disatil)
    mk(4, "Sophia Johnson", 22, "Female", "Self Esteem", "pending", slot(2, 14, 30), {
      requestedAt: now - 25 * MIN,
      note: "I'd like to continue our work on self-esteem.",
    }),
    mk(5, "Michael Davis", 31, "Male", "Relationship Issues", "pending", slot(3, 16, 0), {
      requestedAt: now - 2 * HOUR,
      note: "Can we talk about the situation at home this week?",
    }),
    mk(6, "Olivia Martinez", 26, "Female", "Anxiety", "scheduled", slot(2, 10, 30)),
    mk(7, "Liam Anderson", 33, "Male", "Work Stress", "scheduled", slot(3, 13, 0)),
    mk(8, "Charlotte Clark", 29, "Female", "Sleep Issues", "scheduled", slot(4, 15, 0)),
    mk(9, "Noah Taylor", 21, "Male", "Social Anxiety", "scheduled", slot(5, 9, 30)),
    mk(10, "Ava Thomas", 35, "Female", "Grief", "scheduled", slot(6, 11, 0)),
    mk(11, "Henry Allen", 40, "Male", "Panic Attacks", "scheduled", slot(1, 16, 30)),
    mk(12, "Isabella Moore", 23, "Female", "Self Esteem", "scheduled", slot(7, 14, 0)),
  ];
}

let state = { sessions: seed() };
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

const setSessions = (fn) => {
  state = { sessions: fn(state.sessions) };
  emit();
};
const patch = (id, changes) =>
  setSessions((list) => list.map((s) => (s.id === id ? { ...s, ...changes } : s)));

const find = (id) => state.sessions.find((s) => s.id === id);

function validateSlot(start, ignoreId) {
  if (!Number.isFinite(start)) return { ok: false, reason: "invalid" };
  if (start <= Date.now()) return { ok: false, reason: "past" };
  const conflict = findConflict(state.sessions, start, ignoreId);
  if (conflict) return { ok: false, reason: "conflict", conflict };
  return { ok: true };
}

export const sessionStore = {
  getState: () => state,
  subscribe: (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  // Patient session request pathvato (patient app / backend he call karel)
  requestSession({ patientId, name, age, gender, problem, start, note = "" }) {
    const now = Date.now();
    const s = {
      id: nextId(),
      patientId,
      patientName: name,
      age,
      gender,
      problem,
      status: "pending",
      start,
      requestedAt: now,
      updatedAt: now,
      seen: false,
      rescheduled: false,
      note,
      notes: [],
    };
    setSessions((list) => [s, ...list]);
    return s;
  },

  // Accept = patient ne maagitlelya vela var session automatic schedule
  accept(id) {
    const s = find(id);
    if (!s) return { ok: false, reason: "missing" };
    const v = validateSlot(s.start, id);
    if (!v.ok) return v;
    patch(id, { status: "scheduled", updatedAt: Date.now(), seen: true });
    return { ok: true };
  },

  decline(id) {
    patch(id, { status: "declined", updatedAt: Date.now(), seen: true });
  },

  // Counsellor navin vel nivadto (pending kiva already scheduled session)
  reschedule(id, start) {
    const s = find(id);
    if (!s) return { ok: false, reason: "missing" };
    const v = validateSlot(start, id);
    if (!v.ok) return v;
    patch(id, {
      status: "scheduled",
      start,
      rescheduled: start !== s.start || s.rescheduled,
      updatedAt: Date.now(),
      seen: true,
    });
    return { ok: true };
  },

  // Counsellor swatah session schedule karto (Add Patient madhun)
  schedule({ patientId, name, age, gender, problem, start }) {
    const v = validateSlot(start);
    if (!v.ok) return v;
    const now = Date.now();
    const s = {
      id: nextId(),
      patientId,
      patientName: name,
      age,
      gender,
      problem,
      status: "scheduled",
      start,
      requestedAt: now,
      updatedAt: now,
      seen: true,
      rescheduled: false,
      note: "",
      notes: [],
    };
    setSessions((list) => [s, ...list]);
    return { ok: true };
  },

  complete(id, notes = []) {
    const s = find(id);
    if (!s) return;
    patch(id, {
      status: "completed",
      updatedAt: Date.now(),
      notes: [...(s.notes || []), ...notes],
    });
  },

  markAllSeen() {
    setSessions((list) => list.map((s) => (s.seen ? s : { ...s, seen: true })));
  },
};

export const useSessions = () =>
  useSyncExternalStore(sessionStore.subscribe, sessionStore.getState).sessions;

// Current time, prati 15 sec la update hoto (Join enable/disable sathi)
export function useNow(interval = 15000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), interval);
    return () => clearInterval(t);
  }, [interval]);
  return now;
}

/* ---------------- DEMO ONLY ----------------
   Patient app nasel tar test karayla: Notifications madhla
   "Simulate request" button he vaparto. Real app madhe kadhun tak. */
const DEMO_POOL = [
  [13, "James Lewis", 37, "Male", "Anger Management"],
  [14, "Ethan Jackson", 27, "Male", "Stress"],
  [15, "Amelia Walker", 30, "Female", "Burnout"],
  [16, "Mia White", 20, "Female", "Exam Anxiety"],
  [17, "Benjamin Hall", 45, "Male", "Life Transition"],
  [18, "Lucas Harris", 25, "Male", "Loneliness"],
];

export function simulatePatientRequest() {
  const free = DEMO_POOL.filter(
    (p) => !state.sessions.some((s) => s.patientId === p[0] && s.status === "pending")
  );
  const pool = free.length ? free : DEMO_POOL;
  const [patientId, name, age, gender, problem] = pool[Math.floor(Math.random() * pool.length)];
  const start = slot(1 + Math.floor(Math.random() * 3), 10 + Math.floor(Math.random() * 8), Math.random() < 0.5 ? 0 : 30);
  return sessionStore.requestSession({
    patientId,
    name,
    age,
    gender,
    problem,
    start,
    note: "I'd like to book a session with you.",
  });
}