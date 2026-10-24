import { useState } from 'react';

export default function ProfModal({ prof, type, onClose }) {
  const [msg, setMsg] = useState('');
  const [slot, setSlot] = useState('Today - 04:00 PM');
  if (!prof) return null;
  const isRequest = type === 'request' || type === 'book';
  const title = type === 'message' ? `Chat with ${prof.name}` : isRequest ? 'Request Consultation' : 'Professional Profile';

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-[500px] rounded-[24px] shadow-2xl flex flex-col overflow-hidden border border-[#102a21]/10" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 bg-gradient-to-r from-[#0c231a] to-[#164e38] text-white flex items-center justify-between">
          <b className="font-serif text-base tracking-wide">{title}</b>
          <button onClick={onClose} className="text-white/70 hover:text-white text-lg p-1.5 rounded-lg hover:bg-white/15 transition-colors cursor-pointer">✕</button>
        </div>
        <div className="p-6 flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#e6f4ed] text-[#1e6f50] rounded-2xl flex items-center justify-center text-2xl font-bold shadow-inner">👤</div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#102a21]">{prof.name}</h3>
              <p className="text-xs text-[#536861] mt-0.5">Role: <span className="font-medium text-[#102a21]">{prof.role}</span></p>
              <p className="text-xs text-[#849590] mt-0.5">{prof.exp}</p>
            </div>
          </div>

          {type === 'message' ? (
            <div className="bg-[#f7f9f8] p-4 rounded-[16px] border border-[#102a21]/10 flex flex-col gap-3">
              <p className="text-xs text-[#536861]">Send a secure message to {prof.name}:</p>
              <textarea rows="3" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Type your message here..." className="w-full p-3 bg-white border border-[#102a21]/15 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-[#1e6f50]"></textarea>
              <button disabled={!msg.trim()} onClick={() => { alert(`Message sent to ${prof.name}!`); onClose(); }} className="w-full bg-[#0c231a] text-white py-3 rounded-[10px] font-semibold text-sm hover:bg-[#1e6f50] transition-colors cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed">Send Message</button>
            </div>
          ) : isRequest ? (
            <div className="bg-[#f7f9f8] p-4 rounded-[16px] border border-[#102a21]/10 flex flex-col gap-3">
              <p className="text-sm text-[#102a21] font-semibold">Select preferred appointment slot:</p>
              <select value={slot} onChange={(e) => setSlot(e.target.value)} className="w-full p-3 bg-white border border-[#102a21]/15 rounded-[10px] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1e6f50]">
                <option>Today - 04:00 PM</option>
                <option>Tomorrow - 10:00 AM</option>
                <option>Tomorrow - 03:30 PM</option>
              </select>
              <button onClick={() => { alert(`Consultation request sent to ${prof.name} for ${slot}!`); onClose(); }} className="w-full mt-2 bg-[#1e6f50] text-white py-3 rounded-[10px] font-semibold text-sm shadow-md hover:bg-[#154e38] transition-colors cursor-pointer">Confirm Request</button>
            </div>
          ) : (
            <p className="text-sm text-[#536861] leading-relaxed bg-[#f7f9f8] p-4 rounded-[16px] border border-[#102a21]/5">Dedicated mental wellness expert ready to assist you through confidential online consultation and guided support tailored to your needs.</p>
          )}
        </div>
      </div>
    </div>
  );
}
