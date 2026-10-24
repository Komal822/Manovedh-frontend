export const bold = (t) => t.split('**').map((p, i) => (i % 2 ? <b key={i}>{p}</b> : p));

export const Card = ({ title, children }) => (
  <div className="mb-4 rounded-xl border border-line">
    <h3 className="border-b border-line px-5 py-4 text-sm font-semibold">{title}</h3>
    <div className="px-5 py-4 text-sm">{children}</div>
  </div>
);

export const Check = ({ label, sub, checked, onChange }) => (
  <label className="flex cursor-pointer gap-3 border-b border-line/60 py-3 last:border-0">
    <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 h-4 w-4 accent-leaf" />
    <span>
      {label}
      {sub && <small className="block text-xs text-ink/60">{sub}</small>}
    </span>
  </label>
);

export const Btn = ({ primary = true, ...props }) => (
  <button
    {...props}
    className={`rounded-lg px-6 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${
      primary ? 'bg-leaf text-white' : 'border border-line bg-white'
    }`}
  />
);
