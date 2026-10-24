import { useMemo, useState, useRef, useEffect } from 'react';
import D from '../data';
import { Card, Check } from './ui';

export default function StepSign({
  age,
  mod,
  share,
  agree,
  setAgree,
  name,
  setName,
  onProceed
}) {
  const containerRef = useRef(null);
  const [attempted, setAttempted] = useState(false);

  // Auto scroll to top of component when loaded/rendered
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Validate all mandatory modules
  const modulesAccepted = useMemo(() => {
    return ['text', 'voice', 'face'].every(
      (key) => mod?.[key] === 'yes'
    );
  }, [mod]);

  // Validate participant name
  const cleanName = (name || '').trim();

  const validName =
    cleanName.length >= 2 &&
    cleanName.length <= 100 &&
    /^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u.test(cleanName);

  const isMinor = age === 'minor';

  const canSubmit =
    modulesAccepted &&
    agree === true &&
    validName;

  // Consent summary data
  const moduleRows = [
    {
      label: 'Text Data Analysis',
      value: mod?.text
    },
    {
      label: 'Voice Data Analysis',
      value: mod?.voice
    },
    {
      label: 'Facial Data Analysis',
      value: mod?.face
    }
  ];

  const optionalRows = [
    {
      label: 'Academic Research Sharing',
      value: share?.academic
    },
    {
      label: 'AI Repository Contribution',
      value: share?.repo
    }
  ];

  const handleSubmit = () => {
    setAttempted(true);

    if (!canSubmit) return;

    if (typeof onProceed === 'function') {
      onProceed();
    }
  };

  // Status badge
  const Status = ({ value, optional = false }) => {
    if (value === 'yes' || value === true) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf/10 px-3 py-1.5 text-[10px] font-bold text-leaf">
          <span>✓</span>
          {optional ? 'YES' : 'CONSENTED'}
        </span>
      );
    }

    if (value === 'no' || value === false) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1.5 text-[10px] font-bold text-ink/60">
          <span>—</span>
          NO
        </span>
      );
    }

    return (
      <span className="rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-bold text-amber-700">
        PENDING
      </span>
    );
  };

  return (
    <div ref={containerRef} className="mb-6 space-y-5 scroll-mt-6">

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-7 rounded-full bg-leaf" />
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-leaf">
            Final Step · Consent & Declaration
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
          Review & Confirm Your Consent
        </h2>

        <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-ink/60">
          Please review your consent selections and participant
          information carefully before completing your declaration.
        </p>
      </div>

      {/* Summary Card */}
      <section className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">

        <div className="flex items-center justify-between gap-3 border-b border-line bg-tint/40 px-5 py-4">
          <div>
            <h3 className="text-sm font-bold text-ink">
              Consent Summary
            </h3>
            <p className="mt-1 text-[11px] text-ink/60">
              Overview of your selected permissions.
            </p>
          </div>

          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-leaf">
            <span className="text-lg">✓</span>
          </div>
        </div>

        <div className="p-5 space-y-5">

          {/* Participant Information */}
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-ink/45">
              Participant Information
            </p>

            <div className="flex items-center justify-between gap-3 rounded-xl border border-line/70 bg-zinc-50/50 px-4 py-3">
              <span className="text-xs font-medium text-ink/70">
                Participant Type
              </span>

              <span className="rounded-full bg-tint px-3 py-1.5 text-[10px] font-bold text-leaf">
                {isMinor ? 'Minor (Under 18)' : 'Adult (18+)'}
              </span>
            </div>
          </div>

          {/* Mandatory Modules */}
          <div>
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink/45">
                Mandatory Analysis Modules
              </p>

              <span className="text-[10px] font-semibold text-ink/50">
                Required
              </span>
            </div>

            <div className="overflow-hidden rounded-xl border border-line/70 divide-y divide-line/70">
              {moduleRows.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-zinc-50/70"
                >
                  <span className="text-xs font-medium text-ink/75">
                    {item.label}
                  </span>

                  <Status value={item.value} />
                </div>
              ))}
            </div>
          </div>

          {/* Optional Permissions */}
          <div>
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink/45">
                Optional Permissions
              </p>

              <span className="text-[10px] font-medium text-ink/50">
                Not Required
              </span>
            </div>

            <div className="overflow-hidden rounded-xl border border-line/70 divide-y divide-line/70">
              {optionalRows.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <span className="text-xs font-medium text-ink/75">
                    {item.label}
                  </span>

                  <Status
                    value={item.value}
                    optional
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Data Security */}
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-ink/45">
              Data Protection Information
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <div className="flex items-start gap-3 rounded-xl border border-line/70 p-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-tint text-leaf">
                  <span className="text-sm">⌑</span>
                </div>

                <div>
                  <p className="text-xs font-bold text-ink">
                    AES-256 Encryption
                  </p>
                  <p className="mt-1 text-[10px] leading-relaxed text-ink/55">
                    Data encryption in transit and storage.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-line/70 p-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-tint text-leaf">
                  <span className="text-sm">◷</span>
                </div>

                <div>
                  <p className="text-xs font-bold text-ink">
                    Audio Retention
                  </p>
                  <p className="mt-1 text-[10px] leading-relaxed text-ink/55">
                    Raw audio deleted within 24 hours.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Participant Declaration */}
      <section className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">

        <div className="border-b border-line bg-tint/40 px-5 py-4">
          <h3 className="text-sm font-bold text-ink">
            Participant Declaration
          </h3>

          <p className="mt-1 text-[11px] text-ink/60">
            Read the declaration carefully before signing.
          </p>
        </div>

        <div className="p-5">

          <p className="mb-4 text-xs font-semibold text-ink">
            I hereby confirm that:
          </p>

          <div className="space-y-3">
            {D.declaration.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3"
              >
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-tint text-[10px] font-bold text-leaf">
                  {index + 1}
                </span>

                <p className="text-xs leading-relaxed text-ink/70">
                  {item}
                </p>
              </div>
            ))}
          </div>

          {/* Agreement */}
          <div className={`mt-5 rounded-xl border p-4 transition-colors ${
            agree
              ? 'border-leaf/40 bg-tint/40'
              : 'border-line bg-zinc-50/60'
          }`}>
            <Check
              label="I have read, understood and agree to the participant declaration above."
              checked={agree}
              onChange={setAgree}
            />
          </div>

          {attempted && !agree && (
            <p className="mt-2 text-xs font-medium text-red-600">
              Please accept the participant declaration to continue.
            </p>
          )}

        </div>
      </section>

      {/* Signature */}
      <section className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">

        <div className="border-b border-line bg-tint/40 px-5 py-4">
          <h3 className="text-sm font-bold text-ink">
            {isMinor
              ? 'Parent / Guardian Authorization'
              : 'Participant Signature'}
          </h3>

          <p className="mt-1 text-[11px] leading-relaxed text-ink/60">
            {isMinor
              ? 'A parent or legal guardian must provide their full name.'
              : 'Enter your full legal name as your electronic signature.'}
          </p>
        </div>

        <div className="p-5">

          <label className="mb-2 block text-xs font-bold text-ink">
            {isMinor
              ? 'Parent / Guardian Full Name'
              : 'Full Name'}
            <span className="ml-1 text-red-500">*</span>
          </label>

          <input
            type="text"
            value={name || ''}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            maxLength={100}
            placeholder={
              isMinor
                ? 'Enter parent / guardian full name'
                : 'Enter your full legal name'
            }
            aria-invalid={attempted && !validName}
            className={`
              w-full rounded-xl border bg-white px-4 py-3.5
              text-sm text-ink outline-none
              placeholder:text-ink/35
              transition-all duration-200
              focus:border-leaf focus:ring-2 focus:ring-leaf/10
              ${
                attempted && !validName
                  ? 'border-red-400'
                  : 'border-line'
              }
            `}
          />

          {attempted && !validName && (
            <p className="mt-2 text-xs text-red-600">
              Please enter a valid full name (2–100 characters).
            </p>
          )}

          <div className="mt-4 flex items-start gap-2 rounded-xl bg-zinc-50 p-3">
            <span className="text-leaf text-sm">i</span>
            <p className="text-[10px] leading-relaxed text-ink/55">
              Your entered name will be recorded as your electronic
              declaration signature along with the consent record.
            </p>
          </div>

        </div>
      </section>

      {/* Validation Alert */}
      {attempted && !modulesAccepted && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4"
        >
          <p className="text-sm font-bold text-red-800">
            Mandatory Consent Incomplete
          </p>

          <p className="mt-1 text-xs leading-relaxed text-red-700">
            All mandatory modules must be accepted before completing
            your declaration. Please return to the Modules step.
          </p>
        </div>
      )}

      {/* Final Action */}
      <div className="space-y-3 border-t border-line pt-5">

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`
            flex w-full items-center justify-center gap-2
            rounded-xl px-5 py-4
            text-sm font-bold
            transition-all duration-300
            ${
              canSubmit
                ? 'bg-leaf text-white shadow-sm hover:shadow-md hover:opacity-95 active:scale-[0.99]'
                : 'cursor-not-allowed bg-zinc-200 text-zinc-500'
            }
          `}
        >
          Complete Consent & Continue
          <span>→</span>
        </button>

        <p className="text-center text-[10px] leading-relaxed text-ink/50">
          By continuing, you confirm that the information and
          declaration provided above are accurate.
        </p>

      </div>

    </div>
  );
}