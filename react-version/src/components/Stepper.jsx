export default function Stepper({ steps, current }) {
  return (
    <ol className="flex items-start border-b border-line px-4 py-4 sm:px-8" aria-label="Progress">
      {steps.map((name, i) => {
        const k = i + 1;
        const done = k < current;
        return (
          <li key={name} className="flex flex-1 items-start last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <span className={`grid h-7 w-7 place-items-center rounded-full border text-xs font-semibold ${k <= current ? 'border-leaf bg-leaf text-white' : 'border-line text-ink/60'}`}>
                {done ? '✓' : k}
              </span>
              <span className={`text-xs ${k === current ? 'font-semibold' : 'text-ink/60'}`}>{name}</span>
            </div>
            {k < steps.length && <span className={`mx-2 mt-3.5 h-0.5 flex-1 ${done ? 'bg-leaf' : 'bg-line'}`} />}
          </li>
        );
      })}
    </ol>
  );
}
