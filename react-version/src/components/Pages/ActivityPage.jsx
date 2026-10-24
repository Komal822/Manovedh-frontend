import { initialPartners } from '../../data/dashboardData';

// Put your image at src/images/sanctuary.jpg (or .png / .webp / .jpeg) — it is picked up automatically.
const own = Object.values(import.meta.glob('../../images/sanctuary.{jpg,jpeg,png,webp}', { eager: true, import: 'default' }));
const HERO_IMAGE = own[0] || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1600';

const heroCss = `
@keyframes mnsZoom { 0%,100% { transform: scale(1); } 50% { transform: scale(1.14); } }
@keyframes mnsRise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes mnsFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
.mns-zoom { animation: mnsZoom 22s ease-in-out infinite; will-change: transform; }
.mns-rise { animation: mnsRise .9s cubic-bezier(.2,.7,.2,1) both; }
.mns-float { animation: mnsFloat 6s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .mns-zoom, .mns-rise, .mns-float { animation: none; } }
`;

export default function DashboardPage({ displayName, go, unreadCount, openProf }) {
  const metric = 'bg-white border border-[#102a21]/10 rounded-[24px] p-6 shadow-xs hover:border-[#1e6f50] transition-all cursor-pointer group flex flex-col justify-between gap-4';
  const metricIcon = 'w-12 h-12 rounded-2xl bg-[#e8faf2] text-[#1e6f50] flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform';

  return (
    <div className="p-6 lg:p-10 max-w-[1500px] w-full mx-auto flex flex-col gap-8">
      <div className="group bg-gradient-to-r from-[#0c231a] via-[#164e38] to-[#081812] text-white rounded-[32px] p-8 lg:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10 min-h-[300px]">
        <style>{heroCss}</style>
        {/* Background image: slow zoom in/out + extra zoom on hover */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none transition-transform duration-[1200ms] ease-out group-hover:scale-105">
          <img src={HERO_IMAGE} alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} className="mns-zoom w-full h-full object-cover" />
        </div>
        {/* Readability overlay: solid on the text side, image shows through on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c231a] via-[#0c231a]/80 to-[#0c231a]/20 pointer-events-none"></div>
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="mns-rise flex flex-col gap-3 z-10">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-emerald-300 bg-white/10 px-3.5 py-1.5 rounded-full w-fit backdrop-blur-md border border-white/10">✦ Welcome Back, {displayName}</span>
          <h1 className="font-serif text-3xl lg:text-4xl font-bold tracking-tight">Your Mindful Sanctuary</h1>
          <p className="text-white/80 text-sm lg:text-base max-w-xl leading-relaxed">You have completed 3/4 mindful wellness checkpoints this week. Keep up the amazing consistency for a peaceful mind.</p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button onClick={() => go('wellness')} className="bg-white text-[#0c231a] hover:bg-emerald-50 px-6 py-3 rounded-[16px] font-bold text-xs shadow-lg transition-all cursor-pointer">Start Wellness Check →</button>
            <button onClick={() => go('sessions')} className="bg-white/10 hover:bg-white/20 border border-white/15 px-6 py-3 rounded-[16px] font-bold text-xs transition-all cursor-pointer backdrop-blur-md">View Schedule</button>
          </div>
        </div>
        <div className="mns-float w-28 h-28 lg:w-36 lg:h-36 bg-white/10 border border-white/20 rounded-[30px] backdrop-blur-md flex flex-col items-center justify-center text-center p-4 shadow-inner shrink-0 z-10">
          <span className="text-3xl lg:text-4xl">🌱</span>
          <span className="text-[11px] font-bold tracking-wider mt-1 text-emerald-300 uppercase">Streak: 5 Days</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div onClick={() => go('sessions')} className={metric}>
          <div className="flex items-center justify-between"><span className={metricIcon}>📅</span><span className="text-[10px] font-bold text-emerald-700 bg-[#e8faf2] px-2.5 py-1 rounded-full">Next: 4 PM</span></div>
          <div><h3 className="font-serif text-2xl font-bold text-[#102a21]">1 Session</h3><p className="text-xs text-[#536861] mt-0.5">Upcoming with Swapnil Ingle</p></div>
        </div>
        <div onClick={() => go('chats')} className={metric}>
          <div className="flex items-center justify-between"><span className={metricIcon}>💬</span><span className="text-[10px] font-bold text-emerald-700 bg-[#e8faf2] px-2.5 py-1 rounded-full">2 Unread</span></div>
          <div><h3 className="font-serif text-2xl font-bold text-[#102a21]">Secure Chats</h3><p className="text-xs text-[#536861] mt-0.5">Connect with your partner</p></div>
        </div>
        <div onClick={() => go('partner')} className={metric}>
          <div className="flex items-center justify-between"><span className={metricIcon}>⭐</span><span className="text-[10px] font-bold text-emerald-700 bg-[#e8faf2] px-2.5 py-1 rounded-full">Verified</span></div>
          <div><h3 className="font-serif text-2xl font-bold text-[#102a21]">{initialPartners.length} Experts</h3><p className="text-xs text-[#536861] mt-0.5">Ready to assist you 24/7</p></div>
        </div>
        <div onClick={() => go('notifications')} className={metric}>
          <div className="flex items-center justify-between"><span className={metricIcon}>🔔</span><span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">{unreadCount} Alerts</span></div>
          <div><h3 className="font-serif text-2xl font-bold text-[#102a21]">Notifications</h3><p className="text-xs text-[#536861] mt-0.5">Check updates & alerts</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-[#102a21]/10 rounded-[28px] p-8 shadow-xs flex flex-col gap-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#1e6f50] bg-[#e8faf2] px-3 py-1 rounded-full">Interactive Tools</span>
                <h2 className="font-serif text-2xl font-bold text-[#102a21] mt-2">Mindful Assessment & Exercises</h2>
              </div>
              <button onClick={() => go('wellness')} className="text-xs font-bold text-[#1e6f50] hover:underline cursor-pointer shrink-0">View Roadmap →</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div onClick={() => go('wellness')} className="bg-[#f7f9f8] border border-[#102a21]/10 rounded-[20px] p-5 flex items-center gap-4 hover:border-[#1e6f50] hover:bg-[#f2faf6] transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-[#e6f4ed] text-[#1e6f50] flex items-center justify-center text-xl shadow-inner shrink-0 group-hover:scale-110 transition-transform">😊</div>
                <div><b className="font-serif text-base text-[#102a21] block">Wellness Check</b><span className="text-xs text-[#536861] mt-0.5 block">Record your daily mood & expression</span></div>
              </div>
              <div onClick={() => go('wellness')} className="bg-[#f7f9f8] border border-[#102a21]/10 rounded-[20px] p-5 flex items-center gap-4 hover:border-[#1e6f50] hover:bg-[#f2faf6] transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-[#e6f4ed] text-[#1e6f50] flex items-center justify-center text-xl shadow-inner shrink-0 group-hover:scale-110 transition-transform">🎤</div>
                <div><b className="font-serif text-base text-[#102a21] block">Voice Phonation</b><span className="text-xs text-[#536861] mt-0.5 block">Complete vocal therapy exercises</span></div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#102a21]/10 rounded-[28px] p-8 shadow-xs flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-[#102a21]">Top Wellness Partners</h2>
              <button onClick={() => go('partner')} className="text-xs font-bold text-[#1e6f50] hover:underline cursor-pointer">Explore All ({initialPartners.length}) →</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {initialPartners.slice(0, 3).map((prof) => (
                <div key={prof.id} className="bg-[#f7f9f8] border border-[#102a21]/10 rounded-[20px] p-5 flex flex-col justify-between gap-4 hover:border-[#1e6f50] transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#e6f4ed] text-[#1e6f50] flex items-center justify-center font-bold text-sm shrink-0">👤</div>
                    <div className="overflow-hidden"><b className="text-xs font-bold text-[#102a21] truncate block">{prof.name}</b><span className="text-[10px] text-[#536861] truncate block">{prof.role}</span></div>
                  </div>
                  <button onClick={() => openProf(prof, 'request')} className="w-full bg-[#0c231a] text-white hover:bg-[#1e6f50] py-2 rounded-[10px] text-xs font-semibold cursor-pointer transition-all shadow-xs">Book Request</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white border border-[#102a21]/10 rounded-[28px] p-6 shadow-xs flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#102a21]/10">
              <h2 className="font-serif text-lg font-bold text-[#102a21]">Today's Schedule</h2>
              <span className="text-[10px] font-bold text-emerald-700 bg-[#e8faf2] px-2.5 py-1 rounded-full">1 Confirmed</span>
            </div>
            <div className="bg-[#f4f9f6] border border-[#1e6f50]/20 rounded-[20px] p-4 flex flex-col gap-3 shadow-xs">
              <div className="flex items-center justify-between"><b className="text-xs font-bold text-[#102a21]">Swapnil Ingle</b><span className="text-[10px] text-[#1e6f50] font-bold">04:00 PM</span></div>
              <p className="text-xs text-[#536861]">School and Educational Consultation Session via Video Call.</p>
              <button onClick={() => alert('Joining video session...')} className="w-full bg-[#1e6f50] text-white hover:bg-[#154e38] py-2.5 rounded-[12px] text-xs font-bold cursor-pointer transition-all shadow-xs">Join Video Call Now</button>
            </div>
          </div>

          <div className="bg-[#fff0f1] border border-[#e63946]/30 rounded-[28px] p-6 shadow-xs flex flex-col gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e63946] bg-white px-3 py-1 rounded-full shadow-xs w-fit border border-[#e63946]/10">🔴 Immediate Support</span>
            <p className="text-xs text-[#536861] font-medium leading-relaxed">Feeling overwhelmed or need someone to talk to right now? Tele-MANAS is available 24/7.</p>
            <a href="tel:14416" className="w-full bg-[#e63946] text-white py-3 rounded-[14px] font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:bg-red-700 transition-colors cursor-pointer mt-1"><span>📞</span> Call Helpline (14416)</a>
          </div>
        </div>
      </div>
    </div>
  );
}