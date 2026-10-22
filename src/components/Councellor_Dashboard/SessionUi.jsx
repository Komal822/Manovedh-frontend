import React, { useEffect, useRef, useState } from "react";
import {
  X,
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  NotebookPen,
  Trash2,
} from "lucide-react";
import {
  sessionStore,
  useSessions,
  findConflict,
  joinState,
  joinOpensAt,
  sessionEnd,
  formatSlot,
  formatTime,
  formatCountdown,
  toLocalInput,
} from "./sessionStore";

export const FIELD =
  "w-full rounded-xl border border-[#B7CDBD] bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition focus:border-[#234E3D] focus:outline-none focus:ring-2 focus:ring-[#487053]/30";

export function formatTimer(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

/* ============================================================
   AVATAR
============================================================ */

export function Avatar({ name, src, size = "h-14 w-14", textSize = "text-sm" }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${size} flex-shrink-0 rounded-2xl object-cover shadow-sm ring-1 ring-[#E3EDE6]`}
      />
    );
  }
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
  return (
    <div
      className={`${size} ${textSize} flex flex-shrink-0 items-center justify-center rounded-2xl bg-[#E3F2EA] font-bold text-[#257B51] shadow-sm ring-1 ring-[#E3EDE6]`}
    >
      {initials}
    </div>
  );
}

/* ============================================================
   JOIN BUTTON
   - session chya 15 min aadhi paryant disabled
   - 15 min aadhi pasun session sampe paryant enabled
============================================================ */

export function JoinButton({ session, now, onJoin }) {
  const state = joinState(session, now);
  if (state === "none") return null;

  const open = state === "open";
  const caption =
    state === "early"
      ? `Opens in ${formatCountdown(joinOpensAt(session) - now)}`
      : state === "open"
      ? `Ends ${formatTime(sessionEnd(session))}`
      : "Session time is over";

  return (
    <div className="flex flex-col items-center gap-0.5">
      <button
        type="button"
        disabled={!open}
        onClick={() => open && onJoin(session)}
        title={open ? "Join video call" : caption}
        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#234E3D] focus-visible:ring-offset-2 ${
          open
            ? "bg-[#234E3D] text-white shadow-sm hover:bg-[#173629] hover:shadow"
            : "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
        }`}
      >
        <Video size={14} />
        Join
      </button>
      <span className="text-[10px] font-medium text-slate-400">{caption}</span>
    </div>
  );
}

/* ============================================================
   RESCHEDULE MODAL
   - pending request: navin vel nivadun accept + schedule
   - scheduled session: vel badalne
============================================================ */

export function RescheduleModal({ session, notice = "", onClose, onDone }) {
  const sessions = useSessions();
  const isPending = session.status === "pending";

  const [value, setValue] = useState(() => {
    const d = new Date(Math.max(session.start, Date.now() + 30 * 60000));
    d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15, 0, 0);
    return toLocalInput(d.getTime());
  });
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const ts = value ? new Date(value).getTime() : NaN;
  let error = "";
  if (Number.isNaN(ts)) error = "Choose a date and time.";
  else if (ts <= Date.now()) error = "Pick a time in the future.";
  else {
    const c = findConflict(sessions, ts, session.id);
    if (c) error = `This clashes with ${c.patientName} at ${formatSlot(c.start)}.`;
  }

  const submit = (e) => {
    e.preventDefault();
    if (error) return;
    const r = sessionStore.reschedule(session.id, ts);
    if (!r.ok) {
      setSubmitError("Could not save this time. Please pick another.");
      return;
    }
    onDone?.(ts);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reschedule-title"
    >
      <form
        onSubmit={submit}
        noValidate
        className="w-full max-w-md rounded-[30px] border border-[#C8DACD] bg-white p-6 shadow-2xl md:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="reschedule-title" className="text-xl font-bold text-slate-900">
              {isPending ? "Choose a time" : "Reschedule session"}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {session.patientName} · {isPending ? "Requested" : "Current"}:{" "}
              <span className="font-semibold text-slate-700">{formatSlot(session.start)}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-xl p-1.5 text-slate-400 transition hover:bg-[#F4F7F4] hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        {notice && (
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs font-medium text-amber-800">
            {notice}
          </p>
        )}

        <div className="mt-5">
          <label htmlFor="resched-time" className="mb-1.5 block text-xs font-semibold text-slate-700">
            New date & time
          </label>
          <input
            id="resched-time"
            type="datetime-local"
            value={value}
            min={toLocalInput(Date.now())}
            onChange={(e) => {
              setValue(e.target.value);
              setSubmitError("");
            }}
            className={FIELD}
          />
          {(error || submitError) && (
            <p className="mt-1.5 text-[11px] font-medium text-rose-600">{error || submitError}</p>
          )}
          <p className="mt-2 text-[11px] text-slate-400">
            Join button opens 15 minutes before the session starts.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#ADC6B3] hover:bg-[#F4F7F4]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!!error}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition ${
              error
                ? "cursor-not-allowed bg-slate-200 text-slate-400"
                : "bg-[#234E3D] text-white hover:bg-[#173629] hover:shadow active:scale-95"
            }`}
          >
            {isPending ? "Schedule at this time" : "Save new time"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ============================================================
   VIDEO CALL MODAL
   - Patient: motha screen
   - Counsellor: lahan screen (khali ujvi kade)
   - Session notes panel
   - End kela ki onEnd(notes) -> session "completed"
============================================================ */

export function VideoCallModal({ session, onEnd }) {
  const patient = {
    name: session.patientName,
    age: session.age,
    problem: session.problem,
    avatar: "",
  };

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null); // attach WebRTC remote stream here
  const streamRef = useRef(null);

  const [seconds, setSeconds] = useState(0);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [camError, setCamError] = useState(false);
  const [showNotes, setShowNotes] = useState(true);
  const [draft, setDraft] = useState("");
  const [notes, setNotes] = useState([]);

  // Call timer
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Counsellor's local camera + mic
  useEffect(() => {
    let cancelled = false;
    navigator.mediaDevices
      ?.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      })
      .catch(() => setCamError(true));

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // Body scroll lock
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const toggleMic = () => {
    streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = !micOn));
    setMicOn((v) => !v);
  };
  const toggleCam = () => {
    streamRef.current?.getVideoTracks().forEach((t) => (t.enabled = !camOn));
    setCamOn((v) => !v);
  };

  const addNote = () => {
    const text = draft.trim();
    if (!text) return;
    setNotes((prev) => [...prev, { id: Date.now(), text, at: formatTimer(seconds) }]);
    setDraft("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addNote();
    }
  };

  const endCall = () => {
    const pending = draft.trim()
      ? [{ id: Date.now(), text: draft.trim(), at: formatTimer(seconds) }]
      : [];
    onEnd([...notes, ...pending]);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#0B1511]" role="dialog" aria-modal="true">
      {/* VIDEO AREA */}
      <div className="relative h-full w-full overflow-hidden">
        {/* Patient - motha screen */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#12241C] to-[#0B1511]">
          <div className="relative z-0 flex flex-col items-center gap-4">
            <Avatar name={patient.name} src={patient.avatar} size="h-32 w-32" textSize="text-3xl" />
            <p className="text-sm font-medium text-white/70">Waiting for patient video…</p>
          </div>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="absolute inset-0 z-[1] h-full w-full object-cover"
          />
        </div>

        {/* Top bar */}
        <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-white">{patient.name}</h3>
            <p className="text-xs text-white/70">
              {patient.age} Years • {patient.problem}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white">
              <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
              {formatTimer(seconds)}
            </span>
            <button
              type="button"
              onClick={() => setShowNotes((v) => !v)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                showNotes ? "bg-white text-[#234E3D]" : "bg-white/15 text-white hover:bg-white/25"
              }`}
            >
              <NotebookPen size={14} />
              Notes
            </button>
          </div>
        </div>

        {/* Counsellor - lahan screen */}
        <div className="absolute bottom-24 right-4 z-10 h-32 w-24 overflow-hidden rounded-2xl border-2 border-white/30 bg-[#1B3329] shadow-xl sm:h-40 sm:w-56">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="h-full w-full -scale-x-100 object-cover"
          />
          {(camError || !camOn) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-[#1B3329] text-white/70">
              <VideoOff size={20} />
              <span className="text-[11px]">{camError ? "Camera unavailable" : "Camera off"}</span>
            </div>
          )}
          <span className="absolute bottom-1.5 left-2 rounded-md bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white">
            You
          </span>
        </div>

        {/* Controls */}
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
          <button
            type="button"
            onClick={toggleMic}
            aria-label="Toggle microphone"
            className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
              micOn ? "bg-white/15 text-white hover:bg-white/25" : "bg-white text-slate-800"
            }`}
          >
            {micOn ? <Mic size={20} /> : <MicOff size={20} />}
          </button>
          <button
            type="button"
            onClick={toggleCam}
            aria-label="Toggle camera"
            className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
              camOn ? "bg-white/15 text-white hover:bg-white/25" : "bg-white text-slate-800"
            }`}
          >
            {camOn ? <Video size={20} /> : <VideoOff size={20} />}
          </button>
          <button
            type="button"
            onClick={endCall}
            aria-label="End call"
            className="flex h-12 items-center gap-2 rounded-full bg-rose-600 px-5 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            <PhoneOff size={18} />
            End
          </button>
        </div>
      </div>

      {/* NOTES PANEL */}
      {showNotes && (
        <aside className="absolute right-4 top-20 z-20 flex max-h-[calc(100vh-20rem)] w-[calc(100%-2rem)] flex-col overflow-hidden rounded-2xl border border-[#C8DACD] bg-white shadow-2xl sm:max-h-[calc(100vh-24rem)] sm:w-[440px]">
          <div className="flex items-center justify-between border-b border-[#E3EDE6] px-4 py-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Session Notes</h4>
              <p className="text-[11px] text-slate-500">Write down what the patient says</p>
            </div>
            <button
              type="button"
              onClick={() => setShowNotes(false)}
              aria-label="Close notes"
              className="rounded-xl p-1.5 text-slate-400 transition hover:bg-[#F4F7F4] hover:text-slate-600"
            >
              <X size={18} />
            </button>
          </div>

          <div className="min-h-[140px] flex-1 space-y-2.5 overflow-y-auto px-4 py-3 sm:min-h-[220px]">
            {notes.length === 0 ? (
              <p className="py-3 text-center text-xs text-slate-400">
                No notes yet. Type below and press Enter to save.
              </p>
            ) : (
              notes.map((n) => (
                <div key={n.id} className="group rounded-xl border border-[#E3EDE6] bg-[#F4F8F5] p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#257B51]">{n.at}</span>
                    <button
                      type="button"
                      onClick={() => setNotes((prev) => prev.filter((x) => x.id !== n.id))}
                      aria-label="Delete note"
                      className="text-slate-400 opacity-0 transition hover:text-rose-500 focus:opacity-100 group-hover:opacity-100"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{n.text}</p>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-[#E3EDE6] p-3">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKey}
              rows={3}
              placeholder="Type what the patient says… (Enter to save)"
              className={`${FIELD} resize-none`}
            />
            <button
              type="button"
              onClick={addNote}
              className="mt-2 w-full rounded-xl bg-[#234E3D] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#173629] active:scale-95"
            >
              Add Note
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}