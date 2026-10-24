import { useState } from 'react';
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

export default function SessionsPage({ go, openProf }) {
  const [tab, setTab] = useState('Upcoming');
  
  const tabBtn = (t) => `
    px-5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 cursor-pointer shadow-xs
    ${
      tab === t
        ? 'bg-[#1e6f50] text-white shadow-md shadow-[#1e6f50]/20'
        : 'bg-white border border-[#1e5842]/15 text-[#335648] hover:border-[#1e6f50]/40 hover:bg-[#f7fdfa]'
    }
  `;

  const ananya = Array.isArray(initialPartners) ? initialPartners.find((p) => p.id === 7) : null;
  const defaultPartner = Array.isArray(initialPartners) ? initialPartners[0] : {};

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1450px] w-full mx-auto flex flex-col gap-6 font-sans">
      <style>{customAnimationCss}</style>

      {/* ================= LIGHT & PREMIUM TOP BANNER ================= */}
      <div className="animate-fade-rise relative bg-gradient-to-br from-[#e8f6f0] via-[#f2faf6] to-[#e1f2eb] border border-[#1e6f50]/20 rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 lg:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-[0_10px_35px_rgba(30,111,80,0.06)] overflow-hidden">
        
        <div className="absolute -top-12 -left-12 w-56 h-56 bg-[#1e6f50]/10 rounded-full blur-3xl pointer-events-none animate-soft-pulse" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-[#34d399]/20 rounded-full blur-3xl pointer-events-none animate-soft-pulse" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white text-[#1e6f50] rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-sm border border-[#1e6f50]/15 shrink-0">
            📅
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0c231a] tracking-tight">
              Your Sessions
            </h1>
            <p className="text-xs sm:text-sm text-[#325245] font-medium mt-0.5">
              Manage your upcoming and past consultation sessions seamlessly.
            </p>
          </div>
        </div>

        <button
          onClick={() => go('partner')}
          className="relative z-10 bg-[#1e6f50] hover:bg-[#154e38] text-white px-6 py-3.5 rounded-2xl font-bold text-xs transition-all duration-300 cursor-pointer shadow-[0_6px_20px_rgba(30,111,80,0.25)] hover:shadow-[0_10px_25px_rgba(30,111,80,0.35)] shrink-0 transform hover:-translate-y-0.5"
        >
          + Book New Session
        </button>
      </div>

      {/* ================= TABS SWITCHER ================= */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
        {['Upcoming', 'Past Sessions', 'Cancelled'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={tabBtn(t)}>
            {t}
          </button>
        ))}
      </div>

      {/* ================= CONTENT SECTION ================= */}
      <div className="grid grid-cols-1 gap-4">
        
        {tab === 'Upcoming' && (
          <>
            {/* Session Card 1 (Confirmed) */}
            <div className="border border-[#1e6f50]/30 rounded-[24px] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-[0_4px_20px_rgba(30,111,80,0.04)] bg-gradient-to-r from-white via-[#f7fdfa] to-[#eef7f3] transition-all hover:border-[#1e6f50]/60">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#1e6f50] text-white rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-md">
                  👤
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-base font-bold text-[#0c231a]">Swapnil Ingle</h3>
                    <span className="bg-[#1e6f50] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                      Confirmed
                    </span>
                  </div>
                  <p className="text-xs text-[#536861] font-medium">School and Educational Consultation</p>
                  <span className="text-xs font-bold text-[#1e6f50] flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-[#1e6f50] animate-pulse" />
                    Today, 04:00 PM - 05:00 PM
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => alert('Joining video call session...')}
                  className="bg-[#1e6f50] hover:bg-[#154e38] text-white px-5 py-3 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm"
                >
                  Join Video Call
                </button>
                <button
                  onClick={() => openProf(defaultPartner, 'request')}
                  className="border border-[#1e5842]/20 text-[#335648] hover:bg-[#e8faf2]/50 hover:text-[#0c231a] px-4 py-3 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs"
                >
                  Reschedule
                </button>
              </div>
            </div>

            {/* Session Card 2 (Pending) */}
            <div className="bg-white border border-[#1e5842]/15 rounded-[24px] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-xs hover:border-[#1e6f50]/40 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#e8faf2] text-[#1e6f50] rounded-2xl flex items-center justify-center text-xl shrink-0 border border-[#1e6f50]/10">
                  👤
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-base font-bold text-[#0c231a]">Dr. Ananya Deshmukh</h3>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                      Pending
                    </span>
                  </div>
                  <p className="text-xs text-[#536861] font-medium">Mental Well-being & Stress</p>
                  <span className="text-xs font-bold text-[#536861] mt-0.5 block">
                    🕒 Tomorrow, 11:00 AM - 12:00 PM
                  </span>
                </div>
              </div>

              <button
                onClick={() => openProf(ananya || defaultPartner, 'profile')}
                className="border border-[#1e5842]/20 text-[#335648] hover:bg-[#e8faf2]/50 hover:text-[#0c231a] px-5 py-3 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs"
              >
                View Details
              </button>
            </div>
          </>
        )}

        {tab === 'Past Sessions' && (
          <div className="bg-white border border-[#1e5842]/15 rounded-[24px] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-xs">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center text-xl shrink-0">
                👤
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-serif text-base font-bold text-[#0c231a]">Sneha Joshi</h3>
                <p className="text-xs text-[#536861] font-medium">Family & Relationships</p>
                <span className="text-xs text-[#849590] mt-0.5 block">Completed on 10 Oct, 2025</span>
              </div>
            </div>

            <button
              onClick={() => alert('Session summary will be available soon.')}
              className="border border-[#1e5842]/20 text-[#0c231a] hover:bg-[#e8faf2]/50 px-5 py-3 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs"
            >
              View Summary
            </button>
          </div>
        )}

        {tab === 'Cancelled' && (
          <div className="text-center py-16 bg-white rounded-[24px] border border-[#1e5842]/15 text-xs text-[#849590] shadow-xs">
            No cancelled sessions found.
          </div>
        )}

      </div>
    </div>
  );
}