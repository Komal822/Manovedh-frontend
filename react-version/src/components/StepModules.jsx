import { useMemo, useRef, useEffect } from 'react';
import D from '../data';
import { Card, Check } from './ui';

export default function StepModules({
  mod,
  setMod,
  share,
  setShare,
  onProceed
}) {
  const containerRef = useRef(null);

  // Auto scroll to top of component when loaded/rendered
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Consent validation
  const allAccepted = useMemo(
    () => D.modules.every((m) => mod[m.key] === 'yes'),
    [mod]
  );

  const hasDeclined = useMemo(
    () => D.modules.some((m) => mod[m.key] === 'no'),
    [mod]
  );

  const unansweredModules = useMemo(
    () => D.modules.filter((m) => !mod[m.key]),
    [mod]
  );

  const allAnswered = unansweredModules.length === 0;

  // Proceed only when every mandatory module is accepted
  const canProceed = allAccepted;

  const handleConsent = (key, value) => {
    setMod({
      ...mod,
      [key]: value
    });
  };

  const handleNext = () => {
    if (!canProceed) return;

    if (typeof onProceed === 'function') {
      onProceed();
    }
  };

  return (
    <div ref={containerRef} className="space-y-5 mb-6 scroll-mt-6">

      {/* Mandatory Policy Banner */}
      <div className="rounded-2xl border border-line bg-zinc-50/70 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-leaf/10 text-leaf">
            <span className="text-sm font-bold">i</span>
          </div>

          <div>
            <p className="text-sm leading-6 text-ink/80">
              <span className="font-bold text-leaf">
                Mandatory Consent Policy:
              </span>{' '}
              You must accept all analysis modules to proceed with
              Manovedh. Declining any module will block further access.
            </p>
          </div>
        </div>
      </div>

      {/* Consent Status Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line/80 bg-white px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-ink">
            Module Consent Progress
          </p>
          <p className="mt-0.5 text-xs text-ink/60">
            Accept all required modules to continue.
          </p>
        </div>

        <div className="rounded-full bg-tint px-3 py-1.5 text-xs font-bold text-leaf">
          {D.modules.filter((m) => mod[m.key] === 'yes').length}
          {' / '}
          {D.modules.length} Accepted
        </div>
      </div>

      {/* Restriction Message */}
      {hasDeclined && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/70 p-4"
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-red-100 text-red-600 font-bold">
            !
          </span>

          <div>
            <p className="text-sm font-bold text-red-800">
              Access Restricted
            </p>

            <p className="mt-1 text-xs leading-relaxed text-red-700">
              You have declined one or more mandatory analysis modules.
              All mandatory modules must be accepted to continue.
              You can change your selection below.
            </p>
          </div>
        </div>
      )}

      {!allAnswered && !hasDeclined && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3">
          <span className="text-sm font-bold text-amber-700">!</span>
          <p className="text-xs text-amber-800">
            Please review and select Accept or Decline for every module.
          </p>
        </div>
      )}

      {/* Modules */}
      <div className="space-y-4">
        {D.modules.map((m, index) => {
          const value = mod[m.key];
          const isAccepted = value === 'yes';
          const isDeclined = value === 'no';

          const cardStyle = isAccepted
            ? 'border-leaf bg-white shadow-sm ring-1 ring-leaf/15'
            : isDeclined
            ? 'border-red-400 bg-red-50/30 shadow-sm ring-1 ring-red-100'
            : 'border-line bg-white hover:border-leaf/50 hover:shadow-sm';

          const iconStyle = isAccepted
            ? 'bg-leaf text-white'
            : isDeclined
            ? 'bg-red-100 text-red-700'
            : 'bg-tint text-leaf';

          return (
            <section
              key={m.key}
              className={`
                group overflow-hidden rounded-2xl border
                transition-all duration-300 ease-out
                ${cardStyle}
              `}
            >
              {/* Card Content */}
              <div className="p-5 sm:p-6">

                {/* Heading */}
                <div className="mb-4 flex items-center gap-3">

                  <div
                    className={`
                      grid h-10 w-10 shrink-0 place-items-center
                      rounded-xl text-sm font-bold
                      transition-colors duration-200
                      ${iconStyle}
                    `}
                  >
                    {m.letter}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-bold tracking-tight text-ink">
                      {m.title}
                    </h3>
                    <p className="mt-0.5 text-[11px] text-ink/50">
                      Required consent module {index + 1}
                    </p>
                  </div>

                  {isAccepted && (
                    <span className="shrink-0 rounded-full bg-leaf px-3 py-1.5 text-[11px] font-bold text-white">
                      Consented ✓
                    </span>
                  )}

                  {isDeclined && (
                    <span className="shrink-0 rounded-full bg-red-600 px-3 py-1.5 text-[11px] font-bold text-white">
                      Declined ✕
                    </span>
                  )}

                  {!value && (
                    <span className="shrink-0 rounded-full border border-line bg-zinc-50 px-3 py-1.5 text-[11px] font-medium text-ink/50">
                      Pending
                    </span>
                  )}
                </div>

                {/* Analysis Information */}
                <div className="space-y-3">

                  <p className="text-xs sm:text-sm leading-6 text-ink/75">
                    <span className="font-bold text-ink">
                      What is analysed:
                    </span>{' '}
                    {m.what}
                  </p>

                  <ul className="space-y-2 pl-5 text-xs sm:text-sm leading-relaxed text-ink/70">
                    {m.points.map((point) => (
                      <li key={point} className="list-disc marker:text-leaf">
                        {point}
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-line/70 pt-3">
                    <p className="text-xs sm:text-sm leading-relaxed text-ink/70">
                      <span className="font-bold text-ink">
                        Retention:
                      </span>{' '}
                      {m.retention}
                    </p>
                  </div>

                </div>
              </div>

              {/* Accept / Decline Actions */}
              <div className="grid grid-cols-2 border-t border-line">

                <button
                  type="button"
                  aria-pressed={isAccepted}
                  onClick={() => handleConsent(m.key, 'yes')}
                  className={`
                    flex min-h-[52px] items-center justify-center gap-2
                    text-xs sm:text-sm font-semibold
                    transition-all duration-200
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-inset focus-visible:ring-leaf
                    ${
                      isAccepted
                        ? 'bg-leaf text-white'
                        : 'bg-white text-ink hover:bg-tint/60'
                    }
                  `}
                >
                  Accept
                  {isAccepted && (
                    <span className="text-base">✓</span>
                  )}
                </button>

                <button
                  type="button"
                  aria-pressed={isDeclined}
                  onClick={() => handleConsent(m.key, 'no')}
                  className={`
                    flex min-h-[52px] items-center justify-center gap-2
                    border-l border-line
                    text-xs sm:text-sm font-semibold
                    transition-all duration-200
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-inset focus-visible:ring-red-500
                    ${
                      isDeclined
                        ? 'bg-red-600 text-white'
                        : 'bg-white text-ink hover:bg-red-50 hover:text-red-700'
                    }
                  `}
                >
                  Decline
                  {isDeclined && (
                    <span className="text-base">✕</span>
                  )}
                </button>

              </div>
            </section>
          );
        })}
      </div>

      {/* Optional Academic Research Sharing */}
      <Card title="Optional — Academic research data sharing">

        <p className="mb-4 text-xs leading-relaxed text-ink/70">
          Entirely optional. Declining does not affect access to the
          screening system.
        </p>

        <div className="space-y-2.5">
          {D.sharing.map(([key, label]) => (
            <div
              key={key}
              className="rounded-xl border border-line/80 bg-white p-3 transition-colors hover:border-leaf/40"
            >
              <Check
                label={label}
                checked={!!share[key]}
                onChange={(value) =>
                  setShare({
                    ...share,
                    [key]: value
                  })
                }
              />
            </div>
          ))}
        </div>

        <p className="mt-4 rounded-xl border border-tint bg-tint/60 px-4 py-3 text-xs leading-relaxed text-ink/75">
          {D.conditions}
        </p>

      </Card>

      {/* Continue Section */}
      <div className="space-y-3 border-t border-line/70 pt-5">

        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed}
          className={`
            flex w-full items-center justify-center gap-2
            rounded-xl px-5 py-4
            text-sm font-bold
            transition-all duration-300
            ${
              canProceed
                ? 'bg-leaf text-white shadow-sm hover:shadow-md hover:opacity-95 active:scale-[0.99]'
                : 'cursor-not-allowed bg-zinc-200 text-zinc-500'
            }
          `}
        >
          {canProceed ? (
            <>
              Continue to Next Step
              <span>→</span>
            </>
          ) : hasDeclined ? (
            'Access Restricted — Accept All Modules'
          ) : (
            'Complete All Module Consents to Continue'
          )}
        </button>

        <p className="text-center text-[11px] leading-relaxed text-ink/50">
          {canProceed
            ? 'All mandatory consents have been recorded.'
            : 'You can continue only after accepting every mandatory module.'}
        </p>

      </div>

    </div>
  );
}