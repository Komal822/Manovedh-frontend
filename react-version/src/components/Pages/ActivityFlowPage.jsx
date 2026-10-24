const stats = [
  { icon: '🔥', label: 'Day streak', value: '5' },
  { icon: '✅', label: 'Check-ins this week', value: '3' },
  { icon: '📅', label: 'Sessions attended', value: '2' },
];

const feed = [
  { id: 1, icon: '😊', title: 'Wellness check-in completed', desc: 'Mood recorded: Calm', time: 'Today, 09:15 AM', section: 'Today' },
  { id: 2, icon: '💬', title: 'Message sent to Swapnil Ingle', desc: 'Shared update about your daily activities', time: 'Today, 10:42 AM', section: 'Today' },
  { id: 3, icon: '📅', title: 'Session booked', desc: 'Dr. Ananya Deshmukh · Tomorrow, 11:00 AM', time: 'Yesterday, 06:20 PM', section: 'Yesterday' },
  { id: 4, icon: '🎤', title: 'Voice phonation completed', desc: '7 of 7 sounds verified', time: 'Yesterday, 09:05 AM', section: 'Yesterday' },
  { id: 5, icon: '✅', title: 'Session completed', desc: 'Sneha Joshi · Family & Relationships', time: '10 Oct', section: 'Earlier' },
];

export default function ActivityPage({ go }) {
  return (
    <div className="p-6 lg:p-10 max-w-[1100px] w-full mx-auto flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#102a21]/10 rounded-[22px] p-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#e8faf2] text-[#1e6f50] rounded-2xl flex items-center justify-center text-xl shadow-inner">📈</div>
          <div>
            <h1 className="font-serif text-2xl lg:text-3xl font-bold text-[#102a21]">Your Activity</h1>
            <p className="text-xs lg:text-sm text-[#536861] mt-0.5">A timeline of your recent check-ins, sessions and messages.</p>
          </div>
        </div>
        <button onClick={() => go('wellness')} className="bg-[#0c231a] text-white hover:bg-[#1e6f50] px-5 py-3 rounded-[14px] text-xs font-bold transition-all cursor-pointer shadow-sm w-fit">Go to Wellness Check</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-[#102a21]/10 rounded-[20px] p-5 flex items-center gap-4 shadow-xs">
            <span className="w-12 h-12 rounded-2xl bg-[#e8faf2] flex items-center justify-center text-xl shadow-inner">{s.icon}</span>
            <div><b className="font-serif text-2xl text-[#102a21] block">{s.value}</b><span className="text-xs text-[#536861]">{s.label}</span></div>
          </div>
        ))}
      </div>

      {['Today', 'Yesterday', 'Earlier'].map((sec) => (
        <div key={sec} className="flex flex-col gap-3">
          <h3 className="font-serif font-bold text-sm text-[#536861] tracking-wide uppercase px-1">{sec}</h3>
          {feed.filter((f) => f.section === sec).map((f) => (
            <div key={f.id} className="bg-white border border-[#102a21]/10 rounded-[20px] p-5 flex items-center gap-4 shadow-xs">
              <div className="w-12 h-12 bg-[#e8faf2] rounded-2xl flex items-center justify-center text-lg shrink-0 shadow-inner">{f.icon}</div>
              <div className="flex-grow">
                <h4 className="font-serif text-base font-bold text-[#102a21]">{f.title}</h4>
                <p className="text-xs text-[#536861] mt-0.5">{f.desc}</p>
              </div>
              <span className="text-[11px] text-[#849590] shrink-0 hidden sm:block">{f.time}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}