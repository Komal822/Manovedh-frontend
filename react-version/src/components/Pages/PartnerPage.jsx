import React, { useState } from 'react';
import { initialPartners } from '../../data/dashboardData';

const customAnimationCss = `
  @keyframes modalFadeIn {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  .animate-modal { animation: modalFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
`;

export default function PartnerPage() {
  const [query, setQuery] = useState('');
  
  // Single Modal State (Ekach Modal Manage karnyasathi)
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [message, setMessage] = useState('');
  const [modality, setModality] = useState('video');
  const [shareReport, setShareReport] = useState(true);

  const q = query.toLowerCase();
  const partners = Array.isArray(initialPartners) ? initialPartners : [];
  const list = partners.filter(
    (p) => p.name?.toLowerCase().includes(q) || p.role?.toLowerCase().includes(q)
  );

  const handleOpenModal = (prof) => {
    setSelectedPartner(prof);
    setMessage('');
    setModality('video');
    setShareReport(true);
    // openProf call kadhun takla aahe taaki parent component cha 2nd modal open honar nahi
  };

  const handleCloseModal = () => {
    setSelectedPartner(null);
  };

  const handleSendRequest = () => {
    alert(`Request sent successfully to ${selectedPartner?.name}!`);
    handleCloseModal();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1450px] w-full mx-auto flex flex-col gap-6 font-sans relative">
      <style>{customAnimationCss}</style>

      {/* HERO BANNER */}
      <div className="bg-gradient-to-br from-[#e8f6f0] via-[#f2faf6] to-[#e1f2eb] border border-[#1e6f50]/20 rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_10px_35px_rgba(30,111,80,0.06)] relative overflow-hidden">
        <div className="flex flex-col gap-2.5 relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-bold tracking-wider uppercase text-[#16563e] bg-white/80 px-3.5 py-1.5 rounded-full w-fit shadow-xs border border-[#1e6f50]/15 backdrop-blur-md">
            🤝 EXPERT SUPPORT
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0c231a] tracking-tight">
            Wellness Partners
          </h1>
          <p className="text-[#325245] text-xs sm:text-sm lg:text-base leading-relaxed font-medium">
            {list.length} counselors available. Connect with trusted counselors who can support you on your mental wellness journey. You're not alone.
          </p>
        </div>

        <div className="text-4xl sm:text-5xl shrink-0 bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-[#1e6f50]/15 shadow-xs z-10">
          🧘‍♀️
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative bg-white border border-[#1e5842]/15 rounded-2xl p-2 flex items-center shadow-xs focus-within:border-[#1e6f50] focus-within:ring-2 focus-within:ring-[#1e6f50]/15 transition-all">
        <span className="pl-3 pr-2 text-base text-[#536861]">🔍</span>
        <input
          type="text"
          placeholder="Search by name or specialization..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full py-1.5 bg-transparent border-none text-xs sm:text-sm text-[#0c231a] focus:outline-none font-medium placeholder-[#849590]"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="pr-3 text-xs font-bold text-[#849590] hover:text-[#0c231a] cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {list.map((prof) => (
          <div
            key={prof.id || prof.name}
            className={`bg-white border rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 transition-all duration-300 shadow-xs hover:shadow-md ${
              prof.bestMatch
                ? 'border-[#1e6f50] ring-1 ring-[#1e6f50]/20'
                : 'border-[#1e5842]/10 hover:border-[#1e6f50]/40'
            }`}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#e8faf2] text-[#1e6f50] rounded-xl flex items-center justify-center text-base font-bold shadow-xs shrink-0 border border-[#1e6f50]/10">
                    👤
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-serif text-sm font-bold text-[#0c231a] truncate">
                      {prof.name}
                    </h3>
                    <p className="text-[11px] text-[#536861] truncate font-medium mt-0.5">
                      {prof.role}
                    </p>
                    <p className="text-[10px] text-[#849590] truncate mt-0.5">
                      {prof.exp || '20 yrs experience'}
                    </p>
                  </div>
                </div>

                {prof.bestMatch && (
                  <span className="bg-[#1e6f50] text-white text-[9px] font-black tracking-wide uppercase px-2.5 py-1 rounded-full shadow-xs shrink-0">
                    ★ Best Match
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs pt-2.5 border-t border-[#1e5842]/10">
                <span className="text-[#c59b27] font-bold text-[11px]">
                  ★ {prof.rating || '4.9'}
                </span>
                <span className="text-[#1e6f50] font-semibold text-[11px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1e6f50] animate-pulse" />
                  {prof.status || 'Available'}
                </span>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => handleOpenModal(prof)}
                className="border border-[#1e5842]/20 text-[#335648] hover:bg-[#e8faf2]/50 hover:text-[#0c231a] py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <span>💬</span> Message
              </button>
              <button
                onClick={() => handleOpenModal(prof)}
                className="bg-[#0c231a] text-white hover:bg-[#1e6f50] py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs"
              >
                <span>📅</span> Request
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SINGLE CLEAN POP-UP MODAL */}
      {selectedPartner && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity">
          <div className="animate-modal bg-[#f7fbf9] border border-[#1e6f50]/20 rounded-[28px] p-6 sm:p-8 w-full max-w-[520px] shadow-2xl relative overflow-hidden flex flex-col gap-5 text-[#0c231a]">
            
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 text-gray-400 hover:text-[#0c231a] w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200/50 transition-colors cursor-pointer text-sm font-bold"
            >
              ✕
            </button>

            <div className="flex flex-col items-center text-center gap-1.5 pt-1">
              <div className="w-16 h-16 bg-[#e8faf2] text-[#1e6f50] rounded-full flex items-center justify-center text-2xl font-bold border-2 border-white shadow-xs">
                👤
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#1e6f50] block">
                  REQUEST A SESSION
                </span>
                <h2 className="font-serif text-xl font-bold text-[#0c231a] mt-0.5">
                  {selectedPartner.name}
                </h2>
                <span className="text-xs text-[#536861] font-medium block">
                  {selectedPartner.role}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#536861]">
                  Message <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows="3"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Brief reason for reaching out..."
                  className="w-full p-3.5 bg-white border border-[#1e5842]/20 rounded-2xl text-xs text-[#0c231a] focus:outline-none focus:ring-2 focus:ring-[#1e6f50]/30 shadow-inner font-medium placeholder-[#849590]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#0c231a] uppercase tracking-wider">
                  Preferred Modality
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setModality('video')}
                    className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all border ${
                      modality === 'video'
                        ? 'border-[#1e6f50] bg-[#e8faf2] text-[#1e6f50] shadow-xs ring-1 ring-[#1e6f50]/30'
                        : 'border-white bg-white text-[#536861] hover:bg-slate-50'
                    }`}
                  >
                    <span>📹</span> Video Call
                  </button>
                  <button
                    type="button"
                    onClick={() => setModality('audio')}
                    className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all border ${
                      modality === 'audio'
                        ? 'border-[#1e6f50] bg-[#e8faf2] text-[#1e6f50] shadow-xs ring-1 ring-[#1e6f50]/30'
                        : 'border-white bg-white text-[#536861] hover:bg-slate-50'
                    }`}
                  >
                    <span>📞</span> Audio Call
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-[#536861]">
                  Share Assessment Report with Wellness Partner?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setShareReport(true)}
                    className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all border ${
                      shareReport
                        ? 'border-[#1e6f50] bg-[#e8faf2] text-[#1e6f50] shadow-xs ring-1 ring-[#1e6f50]/30'
                        : 'border-white bg-white text-[#536861] hover:bg-slate-50'
                    }`}
                  >
                    <span>📄</span> Yes, share report
                  </button>
                  <button
                    type="button"
                    onClick={() => setShareReport(false)}
                    className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all border ${
                      !shareReport
                        ? 'border-[#1e6f50] bg-[#e8faf2] text-[#1e6f50] shadow-xs ring-1 ring-[#1e6f50]/30'
                        : 'border-white bg-white text-[#536861] hover:bg-slate-50'
                    }`}
                  >
                    <span>🔒</span> No, keep private
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleCloseModal}
                className="bg-white border border-[#1e5842]/20 text-[#335648] hover:bg-slate-50 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendRequest}
                className="bg-[#0c231a] hover:bg-[#1e6f50] text-white py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <span>🚀</span> Send Request
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}