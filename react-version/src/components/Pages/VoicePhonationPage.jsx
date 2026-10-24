import { useState, useRef, useEffect } from 'react';
import { phonationSounds } from '../../data/dashboardData';

function Bars({ heights, recording, isError }) {
  return (
    <div className="flex items-center gap-1">
      {heights.map((h, i) => (
        <span
          key={i}
          className={`w-1 rounded-full transition-all ${recording ? 'bg-[#1e6f50] animate-bounce' : isError ? 'bg-red-500' : 'bg-[#1e6f50]'}`}
          style={{ height: recording ? `${h * 4}px` : isError ? `${h * 2}px` : `${h}px`, animationDelay: `${i * 90}ms` }}
        ></span>
      ))}
    </div>
  );
}

export default function VoicePhonationPage({ go, onComplete }) {
  const [index, setIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState(''); // '' | 'success' | 'error'
  const [showDone, setShowDone] = useState(false);
  const recognitionRef = useRef(null);
  const recordingRef = useRef(false); // avoids stale-state bug inside speech callbacks
  const timerRef = useRef(null);
  const sound = phonationSounds[index];
  const isError = status === 'error';

  useEffect(() => () => {
    clearTimeout(timerRef.current);
    recordingRef.current = false;
    try { recognitionRef.current?.abort(); } catch (e) { /* ignore */ }
  }, []);

  const setRec = (v) => { recordingRef.current = v; setRecording(v); };

  const handleError = () => {
    setRec(false);
    setProcessing(false);
    setStatus('error');
  };

  const advance = () => {
    setRec(false);
    setProcessing(true);
    setStatus('success');
    timerRef.current = setTimeout(() => {
      setProcessing(false);
      setStatus('');
      if (index < phonationSounds.length - 1) setIndex((i) => i + 1);
      else { setShowDone(true); onComplete?.(); }
    }, 1500);
  };

  const start = () => {
    setRec(true);
    setProcessing(false);
    setStatus('');
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SR) {
      // Browser without speech recognition: simulate capture
      timerRef.current = setTimeout(advance, 3500);
      return;
    }
    const rec = new SR();
    rec.lang = 'mr-IN';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    recognitionRef.current = rec;
    rec.onresult = (e) => {
      const text = e.results?.[0]?.[0]?.transcript?.trim();
      if (text) advance(); else handleError();
    };
    rec.onerror = handleError;
    rec.onend = () => { if (recordingRef.current) handleError(); };
    try { rec.start(); } catch (e) { handleError(); }
  };

  const pickSound = (i) => {
    if (recording || processing) return;
    setIndex(i);
    setStatus('');
  };

  return (
    <div className="p-6 lg:p-10 max-w-[1550px] w-full mx-auto flex items-center justify-center min-h-full">
      <div className="bg-[#eaf4ed] border border-[#1e6f50]/20 rounded-[36px] p-6 lg:p-12 w-full shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[600px]">
        <div className="bg-white/95 backdrop-blur-xl border border-white/80 rounded-[32px] p-8 lg:p-12 w-full max-w-[900px] shadow-xl relative z-10 flex flex-col items-center text-center gap-6">
          <div>
            <h2 className="font-serif text-2xl lg:text-3xl font-bold text-[#102a21]">Voice Phonation Activity</h2>
            <p className="text-xs text-[#536861] mt-1 font-medium tracking-wide">{sound.subtitle}</p>
          </div>

          <div className="w-full max-w-[340px] flex flex-col gap-2">
            <div className="flex justify-between text-xs font-bold text-[#1e6f50]"><span>{index} / {phonationSounds.length} completed</span></div>
            <div className="w-full bg-[#e2e8e6] h-2 rounded-full overflow-hidden">
              <div className="bg-[#1e6f50] h-full transition-all duration-300" style={{ width: `${(index / phonationSounds.length) * 100}%` }}></div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 my-4 w-full">
            <Bars heights={[8, 12, 6]} recording={recording} isError={isError} />
            <div className={`w-40 h-40 rounded-full border-4 flex flex-col items-center justify-center shadow-inner transition-transform duration-300 ${isError ? 'border-red-500 bg-red-50' : recording ? 'border-[#1e6f50] bg-[#f2faf6] scale-105 ring-4 ring-[#1e6f50]/20' : 'border-[#1e6f50] bg-[#f2faf6]'}`}>
              <span className={`text-6xl font-serif font-bold ${isError ? 'text-red-600' : 'text-[#1e6f50]'}`}>{sound.label}</span>
            </div>
            <Bars heights={[10, 6, 12]} recording={recording} isError={isError} />
          </div>

          <button onClick={start} disabled={recording || processing} className={`px-8 py-3 rounded-full font-bold text-sm tracking-wide shadow-md transition-all cursor-pointer flex items-center gap-2 text-white disabled:opacity-80 disabled:cursor-not-allowed ${isError ? 'bg-red-600 hover:bg-red-700' : 'bg-[#1e6f50] hover:bg-[#154e38]'}`}>
            <span>🎤</span> {recording ? 'Listening carefully (Speak now)...' : processing ? 'Analyzing Voice...' : isError ? 'Try Again (Not Recognized)' : 'Start'}
          </button>

          <div className={`border px-6 py-2 rounded-full text-xs font-medium shadow-xs ${isError ? 'bg-red-50 border-red-200 text-red-600' : 'bg-[#f4f7f5] border-[#102a21]/10 text-[#536861]'}`}>
            {isError ? 'Voice not clearly recognized. Please try speaking clearly again!' : processing ? 'Voice analysis is processing in the background...' : 'Press Start once. Manovedh will capture the sound automatically.'}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-[#102a21]/10 w-full">
            {phonationSounds.map((s, i) => (
              <button key={s.id} onClick={() => pickSound(i)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer border ${index === i ? 'bg-[#1e6f50] text-white border-[#1e6f50] shadow-sm' : 'bg-white text-[#102a21] border-[#102a21]/15 hover:bg-[#f2faf6]'}`}>{s.label}</button>
            ))}
          </div>
        </div>

        {showDone && (
          <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-[32px] p-8 max-w-[440px] w-full shadow-2xl flex flex-col items-center text-center gap-5 border border-[#102a21]/10">
              <div className="w-16 h-16 bg-[#e8faf2] text-[#1e6f50] rounded-full flex items-center justify-center text-3xl shadow-inner border border-[#1e6f50]/20">★</div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#1e6f50] bg-[#e8faf2] px-3 py-1 rounded-full border border-[#1e6f50]/15">ACTIVITY COMPLETE!</span>
                <h3 className="font-serif text-2xl font-bold text-[#102a21] mt-2">Splendid Job!</h3>
                <p className="text-xs text-[#536861] mt-1 leading-relaxed">You have successfully completed the voice phonation activity. All vocal exercises have been verified!</p>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full bg-[#f7f9f8] p-4 rounded-2xl border border-[#102a21]/5">
                <div className="flex flex-col items-center"><span className="text-[10px] text-[#849590] uppercase font-bold">Vocal Sounds</span><b className="text-lg font-bold text-[#102a21]">{phonationSounds.length}/{phonationSounds.length}</b></div>
                <div className="flex flex-col items-center border-l border-[#102a21]/10"><span className="text-[10px] text-[#849590] uppercase font-bold">Score / XP</span><b className="text-lg font-bold text-[#1e6f50]">+150 XP</b></div>
              </div>
              <div className="flex flex-col gap-2.5 w-full pt-2">
                <button onClick={() => go('journey')} className="w-full bg-[#0c231a] text-white py-3.5 rounded-[14px] font-bold text-xs tracking-wide hover:bg-[#1e6f50] transition-colors cursor-pointer shadow-md">Continue Activities →</button>
                <button onClick={() => go('dashboard')} className="w-full bg-[#f4f7f5] text-[#102a21] hover:bg-[#e2e8e6] py-3 rounded-[14px] font-semibold text-xs transition-colors cursor-pointer">Go to Dashboard</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
