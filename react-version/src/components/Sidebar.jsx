import React, { useState } from 'react';

import gridIcon from '../images/grid.png';
import groupIcon from '../images/group (2).png';
import squareIcon from '../images/square.png';
import stopIcon from '../images/stop.png';
import bellIcon from '../images/bell.png';
import infoIcon from '../images/information.png';

const nav = [
  ['dashboard', gridIcon, 'Dashboard'],
  ['wellness', groupIcon, 'Wellness Check'],
  ['partner', groupIcon, 'Wellness Partner'],
  ['sessions', squareIcon, 'Sessions'],
  ['chats', squareIcon, 'Chats'],
  ['activity', stopIcon, 'Activity'],
  ['notifications', bellIcon, 'Notifications'],
  ['help', infoIcon, 'Help'],
];

const wellnessPages = ['wellness', 'journey', 'activityFlow', 'voicePhonation'];

// Custom CSS to hide all scrollbars cleanly
const hideScrollbarCss = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

export default function Sidebar({
  page,
  go,
  open,
  setOpen,
  language,
  setLanguage,
  displayName = 'Komal',
  lastName = 'Ramdas',
  unreadCount = 0,
  onExit,
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Sidebar expands on hover when collapsed
  const isExpanded = open || isHovered;

  return (
    <aside
      onMouseEnter={() => !open && setIsHovered(true)}
      onMouseLeave={() => !open && setIsHovered(false)}
      className={`fixed lg:sticky top-0 left-0 h-screen z-50 flex flex-col justify-between p-4 transition-all duration-300 ease-in-out select-none
        bg-gradient-to-b from-[#0a2118] via-[#12372a] to-[#081812] text-white
        border-r border-emerald-500/15 shadow-[6px_0_25px_rgba(0,0,0,0.3)] shrink-0 overflow-x-hidden no-scrollbar
        ${isExpanded ? 'w-[280px]' : 'w-[84px]'}
      `}
    >
      <style>{hideScrollbarCss}</style>

      <div className="flex flex-col h-full w-full overflow-x-hidden no-scrollbar">
        
        {/* ================= HEADER / BRAND ================= */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20 mb-3 shrink-0">
          {isExpanded ? (
            <div className="flex items-center gap-3 px-1 overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2d936c] to-[#1e6f50] flex items-center justify-center text-white text-lg font-bold shadow-md shrink-0">
                ✿
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="font-serif text-xl font-bold tracking-tight text-white truncate">
                  Manovedh
                </span>
                <span className="text-[9px] font-extrabold tracking-widest text-emerald-400 uppercase truncate">
                  Mindful Sanctuary
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div
                className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2d936c] to-[#1e6f50] flex items-center justify-center text-white text-lg font-bold shadow-md cursor-pointer"
                onClick={() => setOpen(true)}
              >
                ✿
              </div>
            </div>
          )}

          {isExpanded && (
            <button
              onClick={() => {
                setOpen(!open);
                setIsHovered(false);
              }}
              className="text-emerald-300 hover:text-white p-2 bg-emerald-950/60 hover:bg-emerald-900/80 rounded-xl border border-emerald-500/20 transition-all cursor-pointer shrink-0"
              title={open ? 'Collapse Sidebar' : 'Pin Sidebar'}
            >
              <span className="text-xs font-bold">{open ? '◄' : '►'}</span>
            </button>
          )}
        </div>

        {/* ================= NAVIGATION LINKS ================= */}
        <nav className="flex flex-col gap-1.5 mt-1 overflow-y-auto overflow-x-hidden flex-grow no-scrollbar">
          {nav.map(([id, iconSrc, label]) => {
            const isActive = id === 'wellness' ? wellnessPages.includes(page) : page === id;
            const badge = id === 'notifications' ? unreadCount : 0;

            return (
              <button
                key={id}
                title={!isExpanded ? label : ''}
                onClick={() => go(id)}
                className={`group relative flex items-center justify-between w-full px-3.5 py-3 rounded-2xl text-[0.92rem] font-medium transition-all duration-200 text-left cursor-pointer overflow-hidden
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-[#2d936c] to-[#1e6f50] text-white font-semibold shadow-lg shadow-black/30 border-l-4 border-emerald-300'
                      : 'text-emerald-100/70 hover:bg-emerald-900/40 hover:text-white hover:translate-x-1'
                  }
                `}
              >
                <div className="flex items-center gap-3.5 overflow-hidden">
                  <div className={`p-1.5 rounded-xl transition-all shrink-0 ${isActive ? 'bg-white/10' : ''}`}>
                    <img
                      src={iconSrc}
                      alt={label}
                      className={`w-5 h-5 object-contain shrink-0 transition-transform duration-200 ${
                        isActive ? 'scale-110 filter brightness-150' : 'opacity-70 group-hover:opacity-100 group-hover:scale-110'
                      }`}
                    />
                  </div>
                  {isExpanded && <span className="truncate tracking-wide">{label}</span>}
                </div>

                {badge > 0 && (
                  <span
                    className={`bg-emerald-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm shrink-0 ${
                      !isExpanded ? 'absolute top-2 right-2 px-1.5' : ''
                    }`}
                  >
                    {badge}
                  </span>
                )}

                {isActive && isExpanded && badge === 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_8px_#34d399] shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* ================= FOOTER (Language & User Profile) ================= */}
        <div className="flex flex-col gap-2.5 pt-3 border-t border-emerald-500/20 mt-auto shrink-0 overflow-hidden">
          
          {/* Language Selector */}
          {isExpanded && (
            <div className="flex items-center bg-emerald-950/60 border border-emerald-500/20 rounded-xl px-3 py-2 text-xs text-white shadow-inner overflow-hidden">
              <span className="text-emerald-400 font-bold mr-2 shrink-0">🌐</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent border-none text-white font-medium focus:outline-none w-full cursor-pointer truncate"
              >
                <option value="English" className="bg-[#0a2118] text-white">English</option>
                <option value="Marathi" className="bg-[#0a2118] text-white">मराठी</option>
                <option value="Hindi" className="bg-[#0a2118] text-white">हिंदी</option>
              </select>
            </div>
          )}

          {/* User Profile Card */}
          <div
            className={`flex items-center gap-3 p-2 bg-emerald-950/40 rounded-2xl border border-emerald-500/15 overflow-hidden ${
              !isExpanded ? 'justify-center' : ''
            }`}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#2d936c] to-[#164e38] text-white rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
              {displayName[0]?.toUpperCase()}
            </div>

            {isExpanded && (
              <div className="flex flex-col flex-grow overflow-hidden">
                <b className="text-xs font-semibold text-white truncate">
                  {`${displayName} ${lastName}`.trim()}
                </b>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider truncate">
                  User
                </span>
              </div>
            )}

            {isExpanded && onExit && (
              <button
                onClick={onExit}
                title="Sign out"
                className="text-xs text-emerald-300 hover:text-rose-400 p-2 hover:bg-emerald-900/50 rounded-xl transition-all cursor-pointer font-bold shrink-0"
              >
                ➔
              </button>
            )}
          </div>

        </div>
      </div>
    </aside>
  );
}