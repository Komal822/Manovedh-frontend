import { initialPartners } from '../../data/dashboardData';

const customAnimationCss = `
  @keyframes softPulse {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.05); }
  }
  @keyframes fadeInRise {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-soft-pulse { animation: softPulse 6s ease-in-out infinite; }
  .animate-fade-rise { animation: fadeInRise 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  
  @media (prefers-reduced-motion: reduce) {
    .animate-soft-pulse, .animate-fade-rise {
      animation: none !important;
    }
  }
`;

export default function HelpPage({ openProf }) {
  const call = (num) => { window.location.href = `tel:${num}`; };
  const site = () => window.open('https://telemanas.mohfw.gov.in', '_blank', 'noopener,noreferrer');

  const professionals = Array.isArray(initialPartners) ? initialPartners : [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1450px] w-full mx-auto flex flex-col gap-6 font-sans">
      <style>{customAnimationCss}</style>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6">
          
          {/* ================= LIGHT & PREMIUM TOP HERO BANNER ================= */}
          <div className="animate-fade-rise relative bg-gradient-to-br from-[#e8f6f0] via-[#f2faf6] to-[#e1f2eb] border border-[#1e6f50]/20 rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 lg:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_10px_35px_rgba(30,111,80,0.06)] overflow-hidden">
            <div className="absolute -top-12 -left-12 w-56 h-56 bg-[#1e6f50]/10 rounded-full blur-3xl pointer-events-none animate-soft-pulse" />
            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-[#34d399]/20 rounded-full blur-3xl pointer-events-none animate-soft-pulse" />

            <div className="flex flex-col gap-2.5 relative z-10 max-w-xl">
              <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-bold tracking-wider uppercase text-[#16563e] bg-white/80 px-3.5 py-1.5 rounded-full w-fit shadow-xs border border-[#1e6f50]/15 backdrop-blur-md">
                👤 HUMAN SUPPORT
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0c231a] tracking-tight">
                Wellness Partner Support
              </h1>
              <p className="text-[#325245] text-xs sm:text-sm leading-relaxed font-medium">
                Connect with a qualified counselor or support service.
              </p>
              <p className="text-[#1e6f50] font-serif italic text-base font-semibold mt-0.5">
                You are not alone ♡
              </p>
            </div>

            <div className="text-4xl sm:text-5xl shrink-0 bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-[#1e6f50]/15 shadow-[0_8px_20px_rgba(0,0,0,0.04)] z-10">
              🧘‍♀️
            </div>
          </div>

          {/* QUICK HELPLINE CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Call Tele-MANAS */}
            <div
              onClick={() => call('14416')}
              className="bg-white border border-[#1e5842]/15 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-xs hover:border-[#1e6f50] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 bg-[#1e6f50] text-white rounded-xl flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  📞
                </div>
                <div>
                  <span className="text-[11px] text-[#849590] block font-medium">Call Tele-MANAS</span>
                  <b className="text-base font-bold text-[#0c231a] tracking-wide">14416</b>
                  <small className="text-[10px] text-[#536861] block font-medium mt-0.5">
                    Toll-Free · 24/7 · 20+ Languages
                  </small>
                </div>
              </div>
              <span className="text-[#849590] group-hover:translate-x-1 transition-transform font-bold">›</span>
            </div>

            {/* Visit Tele-MANAS */}
            <div
              onClick={site}
              className="bg-white border border-[#1e5842]/15 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-xs hover:border-[#1e6f50] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 bg-[#1e6f50] text-white rounded-xl flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  🌐
                </div>
                <div>
                  <span className="text-[11px] text-[#849590] block font-medium">Visit Tele-MANAS</span>
                  <b className="text-xs sm:text-sm font-bold text-[#0c231a] truncate max-w-[150px] block mt-0.5">
                    telemanas.mohfw.gov.in
                  </b>
                  <small className="text-[10px] text-[#536861] block font-medium mt-0.5">
                    Official Government Portal
                  </small>
                </div>
              </div>
              <span className="text-[#849590] group-hover:translate-x-1 transition-transform font-bold">›</span>
            </div>
          </div>

          {/* AVAILABLE PROFESSIONALS LIST */}
          <div className="flex flex-col gap-3 mt-1">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base">👤</span>
                <h2 className="font-serif text-lg font-bold text-[#0c231a]">
                  Available Support Professionals
                </h2>
              </div>
              <p className="text-xs text-[#536861] mt-0.5">
                Connect with verified counselors and wellness experts.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {professionals.map((prof) => (
                <div
                  key={prof.id || prof.name}
                  className="bg-white border border-[#1e5842]/15 rounded-2xl p-4 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-[#1e6f50]/40 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 bg-[#e8faf2] text-[#1e6f50] rounded-xl flex items-center justify-center text-base font-bold shrink-0 border border-[#1e6f50]/10 shadow-xs">
                      👤
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h3 className="font-serif text-sm font-bold text-[#0c231a]">
                        {prof.name}
                      </h3>
                      <p className="text-[11px] text-[#536861] font-medium">{prof.role}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[#c59b27] text-[10px] font-bold">
                          ★ {prof.rating || '4.9'}
                        </span>
                        <span className="text-[10px] text-[#849590]">
                          {prof.exp || '5+ yrs exp'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openProf(prof, 'profile')}
                      className="border border-[#1e5842]/20 px-3.5 py-2 rounded-xl text-xs font-bold text-[#335648] hover:bg-[#e8faf2]/50 hover:text-[#0c231a] flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                    >
                      <span>👤</span> View Profile
                    </button>
                    <button
                      onClick={() => openProf(prof, 'book')}
                      className="bg-[#0c231a] hover:bg-[#1e6f50] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all duration-300 shadow-xs"
                    >
                      <span>📅</span> Book Session
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-5">
          
          {/* URGENT EMERGENCY CARD */}
          <div className="bg-gradient-to-br from-rose-50 to-rose-100/40 border border-rose-200 rounded-[28px] p-5 flex flex-col gap-3 shadow-xs">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-rose-700 bg-white px-3 py-1 rounded-full shadow-xs w-fit border border-rose-200 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              🔴 Urgent?
            </span>
            <p className="text-xs text-rose-950/80 font-medium">Contact emergency services first.</p>
            
            <div
              onClick={() => call('112')}
              className="bg-white border border-rose-200 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-rose-50 transition-colors shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-600 text-white rounded-xl flex items-center justify-center text-base shadow-sm font-bold">
                  📞
                </div>
                <div>
                  <span className="text-[10px] text-[#849590] block font-medium">Emergency Helpline</span>
                  <b className="text-base font-bold text-[#0c231a] tracking-wide">112</b>
                </div>
              </div>
              <span className="text-[#849590] font-bold">›</span>
            </div>
            <small className="text-[10px] text-[#536861] leading-relaxed font-medium">
              For immediate help, call 112 (Police / Ambulance / Fire).
            </small>
          </div>

          {/* TELE-MANAS MINISTRY CARD */}
          <div className="bg-[#f0f9f4] border border-[#1e6f50]/20 rounded-[28px] p-5 flex flex-col gap-3.5 shadow-xs">
            <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase text-[#1e6f50] bg-white px-3 py-1 rounded-full w-fit shadow-xs border border-[#1e6f50]/15 tracking-wider">
              🏛️ MINISTRY OF HEALTH & FAMILY WELFARE
            </span>
            <div>
              <h3 className="font-serif text-base font-bold text-[#0c231a]">Tele-MANAS</h3>
              <p className="text-xs text-[#536861] font-medium">National Mental Health Helpline</p>
            </div>
            
            <div className="bg-white border border-[#1e6f50]/15 rounded-2xl p-3.5 flex flex-col gap-0.5 shadow-xs">
              <span className="text-[10px] text-[#849590] font-bold uppercase tracking-wider">Toll-Free Helpline</span>
              <b className="text-xl font-bold text-[#0c231a] tracking-wide">14416</b>
              <small className="text-[10px] text-[#536861] font-medium">Alternate: 1800-89-14416</small>
            </div>
            
            <p className="text-[10px] text-[#536861] font-medium">
              24/7 | Confidential | Free | 20+ Languages
            </p>
            
            <div className="grid grid-cols-2 gap-2 mt-0.5">
              <button
                onClick={() => call('14416')}
                className="bg-[#1e6f50] text-white py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs hover:bg-[#154e38] transition-all cursor-pointer"
              >
                📞 Call Now
              </button>
              <button
                onClick={site}
                className="bg-white border border-[#1e5842]/20 text-[#0c231a] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-[#e8faf2]/50 transition-all cursor-pointer shadow-xs"
              >
                🌐 Visit Website
              </button>
            </div>
          </div>

          {/* EMERGENCY GUARDIAN NOTE */}
          <div className="bg-white border border-[#1e5842]/15 rounded-2xl p-3.5 flex items-center gap-3 shadow-xs">
            <span className="text-xl p-2 bg-[#e8faf2] rounded-xl border border-[#1e6f50]/10 shrink-0">
              📍
            </span>
            <div>
              <b className="text-xs font-bold text-[#0c231a] block">Emergency Notice</b>
              <p className="text-[10px] text-[#536861] leading-tight mt-0.5">
                Contact local services, guardian, or nearest hospital.
              </p>
            </div>
          </div>

          {/* AFFIRMATION FOOTER */}
          <div className="bg-gradient-to-br from-[#0c231a] via-[#144232] to-[#0a2118] text-white p-5 rounded-2xl flex flex-col gap-1 shadow-md border border-white/10">
            <b className="font-serif italic text-base">Take care of your mind</b>
            <p className="text-xs text-emerald-100/70 leading-relaxed">
              You are stronger than you think. Help is always available.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}