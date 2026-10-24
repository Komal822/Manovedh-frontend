import { useState, useRef, useEffect } from 'react';
import D from '../data';
import { Card, Check, bold } from './ui';

export default function StepOverview({ age, checks, setChecks, guardianData, setGuardianData }) {
  const [activeTab, setActiveTab] = useState(0);
  const containerRef = useRef(null);

  // Local copy of guardian form data: keeps inputs working even if the parent
  // does not pass (or does not wire up) guardianData / setGuardianData correctly.
  const [localGuardian, setLocalGuardian] = useState(guardianData || {});

  // If the parent changes guardianData (e.g. restoring saved data), sync it in.
  useEffect(() => {
    if (guardianData && JSON.stringify(guardianData) !== JSON.stringify(localGuardian)) {
      setLocalGuardian(guardianData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guardianData]);

  const tabs = [
    {
      title: 'Overview & Signals',
      short: 'Overview',
      number: '01',
      description: 'Understand the screening process'
    },
    {
      title: 'Rights & Security',
      short: 'Your Rights',
      number: '02',
      description: 'Privacy and data protection'
    },
    {
      title: 'Final Confirmations',
      short: 'Confirm',
      number: '03',
      description: 'Review and acknowledge'
    }
  ];

  const safeChecks = checks || {};

  const completedCount = D.confirms.filter(
    (_, index) => safeChecks[index] === true
  ).length;

  const allConfirmed = completedCount === D.confirms.length;

  const goToTab = (index) => {
    if (index >= 0 && index < tabs.length) {
      setActiveTab(index);
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleGuardianChange = (field, value) => {
    const next = { ...localGuardian, [field]: value };
    setLocalGuardian(next);
    if (typeof setGuardianData === 'function') {
      setGuardianData(next);
    }
  };

  const handleCheckChange = (index, value) => {
    if (typeof setChecks === 'function') {
      setChecks({ ...safeChecks, [index]: value });
    }
  };

  const inputClass =
    'w-full rounded-xl border border-line bg-white px-4 py-3 text-xs text-ink placeholder:text-ink/30 focus:border-leaf focus:outline-none';

  return (
    <div ref={containerRef} className="mx-auto mb-6 w-full space-y-5 font-sans scroll-mt-6">

      {/* Minor / Guardian Authorization Section */}
      {age === 'minor' && (
        <div className="overflow-hidden rounded-2xl border border-purple-200 bg-white shadow-sm">
          <div className="border-b border-purple-100 bg-purple-50/70 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-purple-100 text-purple-700">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                  <path d="M12 3L22 20H2L12 3Z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 9v5m0 3h.01" strokeLinecap="round" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-purple-900 font-serif">
                  Parent / Guardian Consent Required
                </p>
                <p className="mt-1 text-xs leading-relaxed text-purple-800">
                  This participant is under 18. A parent or legal guardian must complete this consent form. The minor will also be asked to provide their separate assent below.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 p-4 sm:p-6">
            <div>
              <label htmlFor="guardian-fullName" className="mb-1.5 block text-xs font-bold text-ink font-serif">
                Guardian Full Name
              </label>
              <input
                id="guardian-fullName"
                name="guardianFullName"
                type="text"
                autoComplete="name"
                placeholder="Full name as per ID"
                value={localGuardian.fullName || ''}
                onChange={(e) => handleGuardianChange('fullName', e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="guardian-relationship" className="mb-1.5 block text-xs font-bold text-ink font-serif">
                Relationship to Participant
              </label>
              <select
                id="guardian-relationship"
                name="guardianRelationship"
                value={localGuardian.relationship || ''}
                onChange={(e) => handleGuardianChange('relationship', e.target.value)}
                className={inputClass}
              >
                <option value="" disabled>Select relationship</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Legal Guardian">Legal Guardian</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="guardian-contact" className="mb-1.5 block text-xs font-bold text-ink font-serif">
                Guardian Contact Number
              </label>
              <input
                id="guardian-contact"
                name="guardianContactNumber"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={10}
                placeholder="10-digit mobile number"
                value={localGuardian.contactNumber || ''}
                onChange={(e) =>
                  handleGuardianChange('contactNumber', e.target.value.replace(/\D/g, '').slice(0, 10))
                }
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="guardian-email" className="mb-1.5 block text-xs font-bold text-ink font-serif">
                Guardian Email
              </label>
              <input
                id="guardian-email"
                name="guardianEmail"
                type="email"
                autoComplete="email"
                placeholder="email@example.com"
                value={localGuardian.email || ''}
                onChange={(e) => handleGuardianChange('email', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Heading */}
      <div className="rounded-2xl border border-line bg-white px-5 py-5 shadow-sm sm:px-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1.5 w-6 rounded-full bg-leaf" />
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-leaf">
                Consent Information
              </span>
            </div>

            <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl font-serif">
              Understand Before You Continue
            </h2>

            <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-ink/60 sm:text-sm">
              Please review each section carefully and complete the required confirmations.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 self-start rounded-xl bg-tint/70 px-3 py-2 sm:self-center">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-leaf">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                <path d="M12 3l8 4v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V7l8-4Z" strokeLinejoin="round" />
                <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <p className="text-[10px] font-bold text-leaf font-serif">Informed Consent</p>
              <p className="text-[9px] text-ink/50">Review all sections</p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-ink/60">Section Progress</span>
            <span className="text-[10px] font-bold text-leaf">{activeTab + 1} of 3</span>
          </div>

          <div className="flex gap-1.5">
            {tabs.map((tab, index) => (
              <div
                key={tab.number}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  index <= activeTab ? 'bg-leaf' : 'bg-line'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="rounded-2xl border border-line bg-white p-2 shadow-sm">
        <div className="grid grid-cols-3 gap-2">
          {tabs.map((tab, index) => {
            const active = activeTab === index;
            const completed = index === 0 || index === 1 || (index === 2 && allConfirmed);

            return (
              <button
                key={tab.number}
                type="button"
                onClick={() => goToTab(index)}
                aria-current={active ? 'step' : undefined}
                className={`relative flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-xl px-1 py-3 transition-all duration-200 sm:flex-row sm:gap-2 sm:py-3.5 ${
                  active
                    ? 'bg-leaf text-white shadow-sm'
                    : 'bg-transparent text-ink/60 hover:bg-tint/60 hover:text-leaf'
                }`}
              >
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[10px] font-bold ${
                    active
                      ? 'bg-white/15 text-white'
                      : completed
                      ? 'bg-tint text-leaf'
                      : 'bg-zinc-100 text-ink/50'
                  }`}
                >
                  {tab.number}
                </span>

                <span className="min-w-0 text-center sm:text-left">
                  <span className="block text-[10px] font-bold leading-tight sm:text-xs font-serif">
                    <span className="hidden sm:inline">{tab.title}</span>
                    <span className="sm:hidden">{tab.short}</span>
                  </span>

                  <span
                    className={`mt-1 hidden text-[9px] leading-tight sm:block ${
                      active ? 'text-white/70' : 'text-ink/40'
                    }`}
                  >
                    {tab.description}
                  </span>
                </span>

                {active && (
                  <span className="absolute bottom-0 h-0.5 w-8 rounded-full bg-white sm:hidden" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Overview & Signals */}
      {activeTab === 0 && (
        <div className="space-y-4">
          <Card title="What Manovedh Does">
            <div className="space-y-4 pt-1">
              <p className="text-xs leading-relaxed text-ink/70 sm:text-sm">
                Manovedh analyses{' '}
                <span className="font-bold text-leaf font-serif">three types of signals</span>{' '}
                simultaneously to understand different aspects of your responses.
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {D.signals.map(([title, description], index) => (
                  <div
                    key={title}
                    className="group flex min-h-[145px] flex-col rounded-xl border border-line bg-white p-4 transition-all duration-200 hover:border-leaf/50 hover:shadow-sm"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-tint text-xs font-bold text-leaf">
                        0{index + 1}
                      </span>
                      <span className="text-sm font-medium text-leaf/50">→</span>
                    </div>

                    <h4 className="text-sm font-bold text-ink font-serif">{title}</h4>
                    <p className="mt-2 text-xs leading-relaxed text-ink/60">{description}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-leaf/15 bg-tint/50 p-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-leaf">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 11v5m0-8h.01" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs font-bold text-leaf font-serif">Important Information</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink/70">{D.screens}</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex items-center gap-2 px-1">
            <span className="h-1.5 w-1.5 rounded-full bg-leaf" />
            <p className="text-[10px] text-ink/50">
              Please continue to review your rights and data security.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Rights & Security */}
      {activeTab === 1 && (
        <div className="space-y-4">
          <Card title="Your Rights Under DPDP Act 2023">
            <p className="mb-4 text-xs leading-relaxed text-ink/60">
              Understand the rights and choices available to you regarding your personal data.
            </p>

            <div className="divide-y divide-line/70">
              {D.rights.map(([title, description], index) => (
                <div key={title} className="flex items-start gap-3 py-4 first:pt-1 last:pb-1">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-tint text-[10px] font-bold text-leaf">
                    0{index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-ink font-serif">{title}</h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink/65">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Data Security & Storage">
            <p className="mb-4 text-xs leading-relaxed text-ink/60">
              Review the data protection and security measures described for the screening system.
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {D.security.map((item, index) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-line/80 bg-white p-4 transition-colors hover:border-leaf/40"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-tint text-leaf">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-4 w-4">
                      <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div>
                    <span className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-leaf font-serif">
                      Security Measure {index + 1}
                    </span>
                    <p className="text-xs leading-relaxed text-ink/75">{bold(item)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: Final Confirmations */}
      {activeTab === 2 && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-ink font-serif">Final Acknowledgements</p>
                <p className="mt-1 text-xs leading-relaxed text-ink/60">
                  Please read and acknowledge each statement below.
                </p>
              </div>
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-tint text-leaf">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                  <path d="M8 5H5v16h14V5h-3M9 3h6v4H9z" strokeLinejoin="round" />
                  <path d="m8 13 2.5 2.5L16 10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <div className="mt-5 border-t border-line pt-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-ink/55">Acknowledgement Progress</span>
                <span className="text-xs font-bold text-leaf">
                  {completedCount}/{D.confirms.length}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-leaf transition-all duration-300"
                  style={{
                    width: `${D.confirms.length ? (completedCount / D.confirms.length) * 100 : 0}%`
                  }}
                />
              </div>
            </div>
          </div>

          <Card title="General Participation">
            <p className="mb-4 text-xs text-ink/60">I confirm that:</p>

            <div className="space-y-3">
              {D.confirms.map(([label, subtitle], index) => (
                <div
                  key={index}
                  className={`rounded-xl border p-4 transition-all duration-200 ${
                    safeChecks[index]
                      ? 'border-leaf/40 bg-tint/40'
                      : 'border-line bg-white hover:border-leaf/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[10px] font-bold ${
                        safeChecks[index] ? 'bg-leaf text-white' : 'bg-zinc-100 text-ink/50'
                      }`}
                    >
                      {safeChecks[index] ? '✓' : String(index + 1).padStart(2, '0')}
                    </span>

                    <div className="min-w-0 flex-1">
                      <Check
                        label={label}
                        sub={subtitle}
                        checked={!!safeChecks[index]}
                        onChange={(value) => handleCheckChange(index, value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div
            className={`rounded-xl border p-4 transition-colors ${
              allConfirmed ? 'border-leaf/30 bg-tint/50' : 'border-line bg-zinc-50/70'
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                  allConfirmed ? 'bg-leaf text-white' : 'bg-white text-ink/40'
                }`}
              >
                {allConfirmed ? '✓' : 'i'}
              </span>

              <div>
                <p className="text-xs font-bold text-ink font-serif">
                  {allConfirmed ? 'All Confirmations Completed' : 'Confirmation Required'}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink/60">
                  {allConfirmed
                    ? 'You have acknowledged all the required statements. You can proceed to the next consent step.'
                    : `Please acknowledge all ${D.confirms.length} statements before continuing. ${completedCount} completed so far.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => goToTab(activeTab - 1)}
            disabled={activeTab === 0}
            className="flex min-h-10 items-center gap-2 rounded-xl border border-line px-4 text-xs font-semibold text-ink transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <span>←</span>
            <span>Back</span>
          </button>

          <div className="text-center">
            <p className="text-[10px] font-bold text-leaf font-serif">SECTION {activeTab + 1} / 3</p>
            <p className="mt-0.5 text-[9px] text-ink/45">{tabs[activeTab].title}</p>
          </div>

          {activeTab < 2 && (
            <button
              type="button"
              onClick={() => goToTab(activeTab + 1)}
              className="flex min-h-10 items-center gap-2 rounded-xl bg-leaf px-5 text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
            >
              Continue
              <span>→</span>
            </button>
          )}

          {activeTab === 2 && (
            <span
              className={`rounded-xl px-4 py-2.5 text-[10px] font-bold ${
                allConfirmed ? 'bg-tint text-leaf' : 'bg-zinc-100 text-ink/45'
              }`}
            >
              {allConfirmed ? 'Completed ✓' : 'Pending'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}