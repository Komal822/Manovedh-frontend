export default function StepAge({ age, setAge }) {
  const opts = [
    {
      key: 'adult',
      title: '18 Years or Older',
      subtitle: 'Standard participant consent and account setup.',
      description:
        'Complete your consent and continue with the screening process.',
      symbol: '18+',
      tag: 'ADULT PARTICIPANT',
    },
    {
      key: 'minor',
      title: 'Under 18 Years',
      subtitle: 'Parent or guardian authorization required.',
      description:
        'A parent or legal guardian must participate in the consent process.',
      symbol: 'U18',
      tag: 'MINOR PARTICIPANT',
    },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl px-2 py-1 font-sans">

      <section className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">

        {/* Top accent */}
        <div className="h-1 bg-leaf" />

        <div className="px-4 py-4 sm:px-6 sm:py-5">

          {/* Header */}
          <div className="text-center">

            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-leaf/15 bg-tint px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-leaf" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-leaf">
                DPDP Act 2023 · Consent Setup
              </span>
            </div>

            {/* Main Heading using Playfair Display (font-serif) */}
            <h2 className="font-serif text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Welcome to Manovedh
            </h2>

            <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-ink/60 font-sans">
              Select your age category to continue with the
              appropriate consent process.
            </p>

          </div>

          {/* Selection heading */}
          <div className="mx-auto mt-4 max-w-3xl">

            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-bold text-ink font-sans">
                Select your age category
              </p>

              <span className="text-[10px] text-ink/45 font-sans">
                Choose one option
              </span>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2">

              {opts.map((item) => {
                const selected = age === item.key;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setAge(item.key)}
                    aria-pressed={selected}
                    className={`
                      relative flex flex-col justify-between
                      rounded-xl border p-4 text-left
                      transition-all duration-200 overflow-hidden
                      focus-visible:outline-none focus-visible:ring-2
                      focus-visible:ring-leaf focus-visible:ring-offset-2
                      sm:p-4.5
                      ${
                        selected
                          ? 'border-leaf bg-tint/60 shadow-md ring-2 ring-leaf/20 scale-[1.01]'
                          : 'border-line bg-white hover:border-leaf/50 hover:bg-zinc-50/60'
                      }
                    `}
                  >

                    {/* Unique Left Active Indicator Line */}
                    {selected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-leaf" />
                    )}

                    {/* Selected marker */}
                    <div className="absolute right-3.5 top-3.5">
                      <span
                        className={`
                          flex h-5 w-5 items-center justify-center
                          rounded-full border transition-all
                          ${
                            selected
                              ? 'border-leaf bg-leaf text-white shadow-sm'
                              : 'border-line bg-white text-transparent'
                          }
                        `}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="h-3 w-3"
                        >
                          <path
                            d="M5 12l4 4L19 7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </div>

                    <div>
                      {/* Icon */}
                      <div
                        className={`
                          flex h-10 w-10 items-center justify-center
                          rounded-lg text-xs font-bold transition-transform
                          ${
                            selected
                              ? 'bg-leaf text-white shadow-sm'
                              : 'bg-tint text-leaf'
                          }
                        `}
                      >
                        {item.symbol}
                      </div>

                      {/* Content */}
                      <div className="mt-3">

                        <p
                          className={`
                            text-[9px] font-bold tracking-[0.12em] font-sans
                            ${
                              selected
                                ? 'text-leaf font-extrabold'
                                : 'text-ink/45'
                            }
                          `}
                        >
                          {item.tag}
                        </p>

                        {/* Card Title using Playfair Display (font-serif) */}
                        <h3 className="font-serif mt-1 text-base font-bold tracking-tight text-ink sm:text-lg">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-[11px] font-medium text-ink/70 font-sans">
                          {item.subtitle}
                        </p>

                        <p className="mt-1 text-[11px] leading-relaxed text-ink/50 font-sans">
                          {item.description}
                        </p>

                      </div>
                    </div>

                    {/* Footer */}
                    <div
                      className={`
                        mt-3 flex items-center justify-between
                        border-t pt-2.5 font-sans
                        ${
                          selected
                            ? 'border-leaf/25'
                            : 'border-line/70'
                        }
                      `}
                    >
                      <span
                        className={`text-[11px] font-semibold ${
                          selected ? 'text-leaf' : 'text-ink/45'
                        }`}
                      >
                        {selected ? 'Active Selection' : 'Select this option'}
                      </span>

                      <span className={`text-xs transition-transform ${selected ? 'text-leaf translate-x-0.5 font-bold' : 'text-ink/40'}`}>
                        →
                      </span>
                    </div>

                  </button>
                );
              })}

            </div>

          </div>

          {/* Privacy information */}
          <div className="mx-auto mt-4 flex max-w-3xl items-center justify-center gap-1.5 border-t border-line/70 pt-3 font-sans">

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-3.5 w-3.5 shrink-0 text-leaf"
            >
              <rect x="4" y="10" width="16" height="11" rx="2" />
              <path d="M8 10V7a4 4 0 118 0v3" />
            </svg>

            <p className="text-center text-[10px] leading-relaxed text-ink/50">
              Your information is handled according to applicable
              data protection requirements.
            </p>

          </div>

        </div>
      </section>

    </div>
  );
}