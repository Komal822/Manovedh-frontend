import { useState } from 'react';

const targets = { Appointments: 'sessions', Messages: 'chats', Reminders: 'sessions' };

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

export default function NotificationsPage({ go, notifications = [], setNotifications }) {
  const [tab, setTab] = useState('All');

  const filtered = notifications.filter((n) => tab === 'All' || n.category === tab);
  const count = (c) =>
    notifications.filter((n) => (c === 'All' || n.category === c) && n.unread).length;

  const markAll = () =>
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));

  const act = (item) => {
    setNotifications(
      notifications.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
    );
    go(targets[item.category] || 'dashboard');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1450px] w-full mx-auto flex flex-col gap-6 font-sans">
      <style>{customAnimationCss}</style>

      {/* ================= LIGHT & PREMIUM TOP BANNER ================= */}
      <div className="animate-fade-rise relative bg-gradient-to-br from-[#e8f6f0] via-[#f2faf6] to-[#e1f2eb] border border-[#1e6f50]/20 rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 lg:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-[0_10px_35px_rgba(30,111,80,0.06)] overflow-hidden">
        
        <div className="absolute -top-12 -left-12 w-56 h-56 bg-[#1e6f50]/10 rounded-full blur-3xl pointer-events-none animate-soft-pulse" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-[#34d399]/20 rounded-full blur-3xl pointer-events-none animate-soft-pulse" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white text-[#1e6f50] rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-sm border border-[#1e6f50]/15 shrink-0">
            🔔
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0c231a] tracking-tight">
              Notifications
            </h1>
            <p className="text-xs sm:text-sm text-[#325245] font-medium mt-0.5">
              Stay updated with your sessions, messages, and reminders.
            </p>
          </div>
        </div>

        <button
          onClick={markAll}
          className="relative z-10 border border-[#1e6f50]/20 text-[#1e6f50] bg-white/80 hover:bg-white hover:border-[#1e6f50]/40 px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all duration-300 shadow-xs w-fit backdrop-blur-md"
        >
          <span>✓</span> Mark all as read
        </button>
      </div>

      {/* ================= CATEGORY TABS ================= */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
        {['All', 'Appointments', 'Messages', 'Reminders'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 cursor-pointer shadow-xs ${
              tab === t
                ? 'bg-[#1e6f50] text-white shadow-md shadow-[#1e6f50]/20'
                : 'bg-white border border-[#1e5842]/15 text-[#335648] hover:border-[#1e6f50]/40 hover:bg-[#f7fdfa]'
            }`}
          >
            <span>{t}</span>
            {count(t) > 0 && (
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  tab === t ? 'bg-white text-[#1e6f50]' : 'bg-[#e8faf2] text-[#1e6f50]'
                }`}
              >
                {count(t)}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ================= EMPTY STATE ================= */}
      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-[24px] border border-[#1e5842]/15 text-xs text-[#849590] shadow-xs">
          No notifications found in this category.
        </div>
      )}

      {/* ================= NOTIFICATIONS LIST BY SECTION ================= */}
      {['Today', 'Yesterday', 'Earlier'].map((sec) => {
        const items = filtered.filter((n) => n.section === sec);
        if (!items.length) return null;
        return (
          <div key={sec} className="flex flex-col gap-3">
            <h3 className="font-serif font-extrabold text-xs text-[#1e6f50] tracking-wider uppercase px-1">
              {sec}
            </h3>
            {items.map((item) => (
              <div
                key={item.id}
                className={`border rounded-[24px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 shadow-xs hover:shadow-md ${
                  item.unread
                    ? 'border-[#1e6f50]/40 bg-gradient-to-r from-white via-[#f7fdfa] to-[#eef7f3]'
                    : 'border-[#1e5842]/15 bg-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#e8faf2] text-[#1e6f50] rounded-2xl flex items-center justify-center text-xl shrink-0 border border-[#1e6f50]/10 shadow-xs">
                    {item.category === 'Appointments'
                      ? '📅'
                      : item.category === 'Messages'
                      ? '💬'
                      : '⏰'}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif text-base font-bold text-[#0c231a]">
                        {item.title}
                      </h4>
                      {item.unread && (
                        <span className="w-2 h-2 rounded-full bg-[#1e6f50] animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-[#536861] font-medium">{item.desc}</p>
                    <span className="text-[11px] text-[#849590] font-medium mt-1">
                      {item.time}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => act(item)}
                  className="bg-[#0c231a] hover:bg-[#1e6f50] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all duration-300 shadow-xs shrink-0 self-start sm:self-auto"
                >
                  <span>{item.action}</span> <span>›</span>
                </button>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}