import { stepsData } from '../../data/dashboardData';

const stepCards = [
  { n: 1, title: 'Step 1', sub: 'Observe & Describe', img: stepsData[1].image, pos: 'lg:-translate-y-6' },
  { n: 2, title: 'Step 2', sub: 'Read & Express', img: stepsData[2].image, pos: 'lg:translate-y-12' },
  { n: 3, title: 'Step 3', sub: 'Think & Reflect', img: stepsData[3].image, pos: 'lg:-translate-y-6' },
  { n: 4, title: 'Voice Phonation', sub: 'Final Phase', img: stepsData[4].image, pos: 'lg:translate-y-12', voice: true },
];

export default function JourneyPage({ go, selectedMood, completed }) {
  const nextStep = [1, 2, 3, 4].find((s) => !completed.includes(s)) || 1;
  const open = (c) => (c.voice ? go('voicePhonation') : go('activityFlow', { step: c.n }));
  const startJourney = () => (nextStep === 4 ? go('voicePhonation') : go('activityFlow', { step: nextStep }));

  return (
    <div className="p-6 lg:p-10 max-w-[1550px] w-full mx-auto flex items-center justify-center min-h-full">
      <div className="bg-[#eaf4ed] border border-[#1e6f50]/20 rounded-[36px] p-6 lg:p-10 w-full shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[580px]">
        <div className="bg-white/95 backdrop-blur-xl border border-white/80 rounded-[32px] p-6 lg:p-10 w-full shadow-lg relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[#102a21]/10 gap-4">
            <div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#1e6f50] bg-[#e8faf2] px-3 py-1 rounded-full border border-[#1e6f50]/15">✨ YOUR CUSTOM ROADMAP</span>
              <h2 className="font-serif text-2xl lg:text-3xl font-bold text-[#102a21] mt-2">Your Mindful Wellness Journey</h2>
            </div>
            <div className="text-xs font-medium text-[#536861] bg-[#f4f7f5] px-4 py-2 rounded-2xl border border-[#102a21]/5 shadow-xs">
              Mood: <span className="text-[#1e6f50] font-bold capitalize">{selectedMood}</span>
            </div>
          </div>

          <div className="relative w-full py-8 my-4">
            <svg className="absolute top-[45%] left-0 w-full h-[140px] pointer-events-none hidden lg:block -translate-y-1/2 z-0 overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 150">
              <path d="M 125 35 Q 250 140, 375 75 T 625 75 T 875 35" fill="none" stroke="#1e6f50" strokeWidth="3.5" strokeDasharray="8 8" strokeOpacity="0.45" />
            </svg>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 items-center">
              {stepCards.map((c) => {
                const done = completed.includes(c.n);
                const ready = c.n === nextStep && !done;
                return (
                  <div key={c.n} onClick={() => open(c)} className={`flex flex-col items-center text-center gap-3 group cursor-pointer ${c.pos}`}>
                    <div className="relative transition-transform duration-300 group-hover:scale-105">
                      <div className={`w-28 h-28 rounded-full overflow-hidden bg-white ${done || ready ? 'border-4 border-[#1e6f50] ring-4 ring-[#1e6f50]/10 shadow-[0_10px_25px_rgba(30,111,80,0.25)]' : 'border-4 border-white ring-2 ring-[#102a21]/10 shadow-[0_8px_20px_rgba(0,0,0,0.08)]'}`}>
                        <img src={c.img.replace('w=800', 'w=300')} alt={c.title} className="w-full h-full object-cover" />
                      </div>
                      <span className={`absolute -top-1 -right-1 w-7 h-7 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md ring-2 ring-white ${done || ready ? 'bg-[#0c231a]' : 'bg-[#849590]'}`}>{done ? '✓' : c.n}</span>
                    </div>
                    <div>
                      <h4 className="font-serif text-base font-bold text-[#102a21]">{c.title}</h4>
                      <p className="text-xs text-[#536861] font-medium mt-0.5">{c.sub}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm ${done ? 'bg-[#102a21] text-white' : ready ? 'bg-[#1e6f50] text-white' : 'bg-[#e9eee9] text-[#536861]'}`}>{done ? 'Done' : ready ? 'Ready' : c.voice ? 'Start Voice' : `Step ${c.n}`}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between mt-16 pt-6 border-t border-[#102a21]/10 gap-4">
            <div className="flex items-center gap-3 bg-[#f4f7f5] px-4 py-2.5 rounded-2xl border border-[#102a21]/5 shadow-xs">
              <div className="w-9 h-9 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center text-sm font-bold shadow-xs">★</div>
              <div><b className="font-serif text-xs text-[#102a21] block">Finish Line</b><span className="text-[11px] text-[#536861]">{completed.length}/4 completed</span></div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button onClick={() => go('wellness')} className="border border-[#102a21]/15 text-[#102a21] hover:bg-[#f7f9f8] px-6 py-3 rounded-[14px] text-xs font-semibold transition-all cursor-pointer shadow-xs">← Back</button>
              <button onClick={startJourney} className="bg-gradient-to-r from-[#0c231a] to-[#164e38] text-white hover:opacity-95 px-8 py-3 rounded-[14px] font-bold text-sm tracking-wide transition-all cursor-pointer shadow-lg hover:shadow-xl flex items-center gap-2">
                <span>{completed.length === 0 ? 'Start Journey' : completed.length >= 4 ? 'Restart Journey' : 'Continue Journey'}</span> <span>▶</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
