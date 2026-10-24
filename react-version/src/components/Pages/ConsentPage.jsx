import { useState } from 'react';

const steps = [
  { s: 1, label: 'Age' }, { s: 2, label: 'Overview' }, { s: 3, label: 'Modules' }, { s: 4, label: 'Sign' }, { s: 5, label: 'Done' },
];
const input = 'p-3.5 bg-white border border-[#102a21]/15 rounded-xl text-xs focus:ring-2 focus:ring-[#1e6f50] focus:outline-none';
const row = 'p-3 bg-white rounded-xl border border-[#102a21]/10';

export default function ConsentPage({ go, onComplete }) {
  const [step, setStep] = useState(1);
  const [ageGroup, setAgeGroup] = useState('');
  const [touched, setTouched] = useState(false);
  const [gName, setGName] = useState('');
  const [gRel, setGRel] = useState('');
  const [gPhone, setGPhone] = useState('');
  const [gEmail, setGEmail] = useState('');
  const [checks, setChecks] = useState({});

  const phoneValid = /^\d{10}$/.test(gPhone.trim());
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gEmail.trim());
  const minorValid = gName.trim().length >= 2 && gRel !== '' && phoneValid && emailValid;

  const items = [
    { key: 'screening', label: 'I understand this is a screening tool, not a clinical diagnosis. Results require review by a qualified mental health professional.' },
    { key: 'aiResearch', label: 'I understand my data will be used for AI research and validation. Anonymised only. Never for advertising or commercial use.' },
    { key: 'identifiersRemoved', label: 'I understand all personal identifiers will be removed from my data.' },
    { key: 'withdraw', label: 'I understand I can withdraw at any time without penalty.' },
    { key: 'dpo', label: 'I know how to contact the DPO to exercise my rights.' },
    ...(ageGroup === 'minor' ? [
      { key: 'guardianConsent', label: 'I am the parent / legal guardian of the participant and I give my consent for them to take part.' },
      { key: 'minorAssent', label: "Minor's Assent (to be ticked by the young person themselves): I understand what this programme does and I am happy to take part. I know I can stop whenever I want." },
    ] : []),
  ];
  const allChecked = items.every((c) => checks[c.key]);
  const canNext = step === 1 ? ageGroup === 'adult' || (ageGroup === 'minor' && minorValid) : step === 4 ? allChecked : true;

  const next = () => {
    if (step === 1) setTouched(true);
    if (!canNext) return;
    if (step === 4) onComplete?.(ageGroup);
    setStep(step + 1);
  };

  return (
    <div className="p-6 lg:p-10 max-w-[1400px] w-full mx-auto flex flex-col gap-6">
      <div className="bg-white border border-[#102a21]/10 rounded-[32px] p-8 lg:p-12 shadow-sm flex flex-col gap-8">
        <div className="flex flex-col gap-1 border-b border-[#102a21]/10 pb-6">
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-[#102a21]">Manovedh — Informed Consent</h1>
          <p className="text-xs text-[#536861] font-medium">DPDP Act 2023 · Mental Healthcare Act 2017 · IEC/2024/MH-45</p>
        </div>

        <div className="grid grid-cols-5 gap-2 items-center">
          {steps.map((item) => (
            <div key={item.s} className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => item.s < step && step < 5 && setStep(item.s)}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-xs transition-all ${step === item.s ? 'bg-[#1e6f50] text-white ring-4 ring-[#1e6f50]/20' : step > item.s ? 'bg-[#102a21] text-white' : 'bg-[#e2e8e6] text-[#536861]'}`}>{step > item.s ? '✓' : item.s}</div>
              <span className={`text-xs font-semibold ${step === item.s ? 'text-[#1e6f50]' : 'text-[#536861]'}`}>{item.label}</span>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[{ v: 'adult', t: '18 years or older', d: 'I will fill this consent myself.' }, { v: 'minor', t: 'Under 18 years', d: 'A parent / guardian must consent.' }].map((o) => (
                <button key={o.v} type="button" onClick={() => setAgeGroup(o.v)} className={`text-left p-5 rounded-2xl border transition-all cursor-pointer ${ageGroup === o.v ? 'border-[#1e6f50] bg-[#f2faf6] ring-2 ring-[#1e6f50]/20' : 'border-[#102a21]/15 bg-white hover:border-[#1e6f50]/40'}`}>
                  <b className="font-serif text-base text-[#102a21] block">{o.t}</b>
                  <span className="text-xs text-[#536861]">{o.d}</span>
                </button>
              ))}
            </div>

            {ageGroup === 'minor' && (
              <div className="border border-purple-300 bg-purple-50/50 rounded-[24px] p-6 lg:p-8 flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-purple-900 uppercase tracking-wide">Parent / Guardian Consent Required</span>
                  <p className="text-xs text-purple-700 leading-relaxed">This participant is under 18. A parent or legal guardian must complete this consent form. The minor will also be asked to provide their separate assent below.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#102a21]">Guardian Full Name *</label>
                    <input type="text" placeholder="Full name as per ID" value={gName} onChange={(e) => setGName(e.target.value)} className={input} />
                    {touched && gName.trim().length < 2 && <span className="text-[11px] text-red-600">Enter guardian's full name.</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#102a21]">Relationship to Participant *</label>
                    <select value={gRel} onChange={(e) => setGRel(e.target.value)} className={input}>
                      <option value="">Select relationship</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Legal Guardian">Legal Guardian</option>
                    </select>
                    {touched && !gRel && <span className="text-[11px] text-red-600">Select a relationship.</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#102a21]">Guardian Contact Number *</label>
                    <input type="tel" inputMode="numeric" maxLength={10} placeholder="10-digit mobile number" value={gPhone} onChange={(e) => setGPhone(e.target.value.replace(/\D/g, ''))} className={input} />
                    {touched && !phoneValid && <span className="text-[11px] text-red-600">Enter a valid 10-digit number.</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#102a21]">Guardian Email *</label>
                    <input type="email" placeholder="email@example.com" value={gEmail} onChange={(e) => setGEmail(e.target.value)} className={input} />
                    {touched && !emailValid && <span className="text-[11px] text-red-600">Enter a valid email address.</span>}
                  </div>
                </div>
              </div>
            )}
            {touched && !ageGroup && <p className="text-[11px] text-red-600">Please select your age group to continue.</p>}
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6 p-6 lg:p-8 bg-[#f7f9f8] rounded-[24px] border border-[#102a21]/10">
            <h3 className="font-serif text-lg font-bold text-[#102a21]">What Manovedh does</h3>
            <div className="flex flex-col gap-4 text-xs text-[#536861] leading-relaxed">
              <p>Manovedh analyses <strong className="text-[#102a21]">three types of signals</strong> simultaneously:</p>
              <ul className="list-disc pl-5 space-y-2 font-medium">
                <li><strong className="text-[#102a21]">Voice</strong> — pitch, pace, rhythm, jitter, shimmer, energy (acoustic features).</li>
                <li><strong className="text-[#102a21]">Text</strong> — what you type or say, sentiment, linguistic patterns.</li>
                <li><strong className="text-[#102a21]">Facial expressions</strong> — action units, affect, eye gaze (on-device only).</li>
              </ul>
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-[#102a21] mt-2">The system screens for: Anxiety · Depression · Stress · Bipolar patterns · Suicidal risk indicators. Results are shared only with you and, if you agree, with a mental health professional.</div>
            </div>
            <div className="border-t border-[#102a21]/10 pt-6 mt-2">
              <h4 className="font-serif text-base font-bold text-[#102a21] mb-3">Your rights under DPDP Act 2023</h4>
              <div className="flex flex-col gap-2.5 text-xs text-[#536861]">
                <div className={row}><strong>Right to withdraw</strong> — Stop at any time, no reason needed, no penalty.</div>
                <div className={row}><strong>Right to access</strong> — Request your data in a readable format at any time.</div>
                <div className={row}><strong>Right to correction</strong> — Request correction of any inaccurate data.</div>
                <div className={row}><strong>Right to deletion</strong> — Request deletion (processed within 30 days).</div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6 p-6 lg:p-8 bg-[#f7f9f8] rounded-[24px] border border-[#102a21]/10">
            <h3 className="font-serif text-lg font-bold text-[#102a21]">Data security & storage</h3>
            <div className="flex flex-col gap-2.5 text-xs text-[#536861] font-medium">
              {[
                'All personal identifiers are removed and replaced with a unique research code.',
                'Data encrypted with AES-256 at rest and in transit.',
                'Raw audio deleted within 24 hours of feature extraction.',
                'Facial pixel data discarded immediately after metric extraction — no images stored.',
                'Anonymised research data retained for 5 years for longitudinal studies.',
                'Primary processing in India. International academic sharing only under signed agreements.',
              ].map((t) => <div key={t} className="p-3.5 bg-white rounded-xl border border-[#102a21]/10">{t}</div>)}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-4 p-6 lg:p-8 bg-[#f7f9f8] rounded-[24px] border border-[#102a21]/10">
            <h3 className="font-serif text-lg font-bold text-[#102a21]">{ageGroup === 'minor' ? 'Guardian & minor confirmations — please tick all:' : 'General participation — I confirm that:'}</h3>
            <div className="flex flex-col gap-3">
              {items.map((chk) => (
                <label key={chk.key} className="flex items-start gap-3.5 bg-white p-4 rounded-xl border border-[#102a21]/10 cursor-pointer shadow-xs">
                  <input type="checkbox" checked={!!checks[chk.key]} onChange={(e) => setChecks({ ...checks, [chk.key]: e.target.checked })} className="mt-0.5 accent-[#1e6f50] w-4 h-4 cursor-pointer" />
                  <span className="text-xs font-medium text-[#102a21] leading-relaxed">{chk.label}</span>
                </label>
              ))}
            </div>
            {!allChecked && <p className="text-[11px] text-amber-700">Please tick all boxes to continue.</p>}
          </div>
        )}

        {step === 5 && (
          <div className="flex flex-col items-center justify-center p-10 bg-[#f7f9f8] rounded-[24px] border border-[#102a21]/10 text-center gap-5">
            <div className="w-16 h-16 bg-[#e8faf2] text-[#1e6f50] rounded-full flex items-center justify-center text-3xl shadow-inner">✓</div>
            <h3 className="font-serif text-2xl font-bold text-[#102a21]">{ageGroup === 'minor' ? 'Under-18 Informed Consent Recorded!' : 'Informed Consent Recorded!'}</h3>
            <p className="text-xs text-[#536861] max-w-md leading-relaxed">
              {ageGroup === 'minor' ? 'Guardian details and minor assent have been successfully saved under the DPDP Act 2023. You can now proceed to the dashboard.' : 'Your consent has been successfully saved under the DPDP Act 2023. You can now proceed to the dashboard.'}
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              <button onClick={() => go('dashboard')} className="bg-[#0c231a] text-white px-6 py-3 rounded-xl text-xs font-bold hover:bg-[#1e6f50] transition-colors cursor-pointer shadow-sm">Go to Dashboard</button>
              <button onClick={() => go('wellness')} className="bg-white border border-[#102a21]/15 text-[#102a21] px-6 py-3 rounded-xl text-xs font-bold hover:bg-[#f2faf6] transition-colors cursor-pointer">Start Wellness Check</button>
            </div>
          </div>
        )}

        {step < 5 && (
          <div className="flex items-center justify-between pt-4 border-t border-[#102a21]/10">
            <button onClick={() => step > 1 && setStep(step - 1)} disabled={step === 1} className="px-5 py-2.5 rounded-xl border border-[#102a21]/15 text-xs font-semibold text-[#536861] disabled:opacity-40 cursor-pointer">← Previous</button>
            <button onClick={next} className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-colors shadow-sm ${canNext ? 'bg-[#0c231a] hover:bg-[#1e6f50] cursor-pointer' : 'bg-[#0c231a]/40 cursor-not-allowed'}`}>
              {step === 4 ? 'Submit Consent →' : 'Next Step →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
