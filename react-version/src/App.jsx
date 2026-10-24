import { useEffect, useState } from 'react';

import D from './data';

import Stepper from './components/Stepper';
import StepAge from './components/StepAge';
import StepOverview from './components/StepOverview';
import StepModules from './components/StepModules';
import StepSign from './components/StepSign';

import StepProfile from './components/StepProfile';
import StepProfileDetails from './components/StepProfileDetails';

import { Btn } from './components/ui';
import Dashboard from './components/Dashboard'; // src/components/Dashboard.jsx (page files live in components/Pages)

const readSavedProfile = () => {
  try { return JSON.parse(localStorage.getItem('manovedh_profile') || '{}'); } catch { return {}; }
};

export default function App({ user = null, onProfileComplete }) {
  // CONSENT FLOW
  const [step, setStep] = useState(1);
  const [flow, setFlow] = useState(() => (localStorage.getItem('manovedh_profile') ? 'dashboard' : 'consent'));

  const [age, setAge] = useState(null);
  const [checks, setChecks] = useState({});
  const [mod, setMod] = useState({});
  const [share, setShare] = useState({ academic: false, repo: false });

  const [agree, setAgree] = useState(false);
  const [name, setName] = useState('');
  const [refId, setRefId] = useState('');

  // PROFILE FLOW
  const [profileStep, setProfileStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    avatar: '', firstName: '', lastName: '', email: user?.email || '', mobile: '',
    gender: '', dob: '', state: '', district: '', address: '',
  });

  // Keep email synchronized with authenticated user
  useEffect(() => {
    if (user?.email) setProfile((prev) => ({ ...prev, email: user.email }));
  }, [user?.email]);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // CONSENT VALIDATION
  const canNext = {
    1: !!age,
    2: D.confirms.every((_, i) => checks[i] === true),
    3: D.modules.every((m) => mod[m.key] === 'yes'), // every mandatory module must be accepted
    4: agree && name.trim().length > 1,
  }[step];

  const go = (n) => { setStep(n); scrollTop(); };

  // SAVE CONSENT AND OPEN PROFILE
  const next = () => {
    if (!canNext) return;

    if (step === 4) {
      const ref = 'MNV-' + Date.now().toString(36).toUpperCase();
      const consentPayload = {
        ref, age, modules: mod, sharing: share, name: name.trim(),
        declarationAccepted: agree, at: new Date().toISOString(),
      };
      try {
        localStorage.setItem('manovedh_consent', JSON.stringify(consentPayload));
        setRefId(ref);
        setFlow('profile');
        setProfileStep(1);
        scrollTop();
      } catch (error) {
        console.error('Consent save failed:', error);
        alert('Unable to save consent. Please try again.');
      }
      return;
    }
    go(step + 1);
  };

  const handleProfileNext = () => { setProfileStep(2); scrollTop(); };
  const handleProfileBack = () => { setProfileStep(1); scrollTop(); };

  // SAVE PROFILE
  const handleSaveProfile = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const profilePayload = {
        ...profile, consentRef: refId, profileCompleted: true, completedAt: new Date().toISOString(),
      };
      // Temporary local persistence. Replace with your backend API when connected.
      localStorage.setItem('manovedh_profile', JSON.stringify(profilePayload));
      if (typeof onProfileComplete === 'function') await onProfileComplete(profilePayload);
      setFlow('dashboard');
      scrollTop();
    } catch (error) {
      console.error('Profile save failed:', error);
      alert('Unable to save your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // SIGN OUT -> back to a clean consent flow
  const handleExit = () => {
    localStorage.removeItem('manovedh_profile');
    localStorage.removeItem('manovedh_consent');
    localStorage.removeItem('manovedh_welcome_seen');
    setAge(null); setChecks({}); setMod({}); setShare({ academic: false, repo: false });
    setAgree(false); setName(''); setRefId('');
    setProfileStep(1);
    setStep(1);
    setFlow('consent');
  };

  // DASHBOARD FLOW
  if (flow === 'dashboard') {
    return <Dashboard profile={readSavedProfile()} onExit={handleExit} />;
  }

  // PROFILE FLOW
  if (flow === 'profile') {
    return (
      <main className="min-h-screen bg-tint/50 px-3 py-6 sm:px-6 sm:py-8">
        {profileStep === 1 && <StepProfile profile={profile} setProfile={setProfile} onNext={handleProfileNext} />}
        {profileStep === 2 && (
          <StepProfileDetails profile={profile} setProfile={setProfile} onBack={handleProfileBack} onSave={handleSaveProfile} saving={saving} />
        )}
      </main>
    );
  }

  // CONSENT FLOW
  return (
    <main className="mx-auto w-full max-w-5xl p-3 sm:p-6">
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <header className="bg-ink px-6 py-6 text-white">
          <h1 className="text-2xl font-bold">{D.title}</h1>
          <p className="mt-1 text-xs text-white/70">{D.sub}</p>
        </header>

        <Stepper steps={D.steps.slice(0, 4)} current={step} />

        <section className="p-4 sm:p-6">
          {step === 1 && <StepAge age={age} setAge={setAge} />}
          {step === 2 && <StepOverview age={age} checks={checks} setChecks={setChecks} />}
          {step === 3 && <StepModules mod={mod} setMod={setMod} share={share} setShare={setShare} onProceed={next} />}
          {step === 4 && (
            <StepSign age={age} mod={mod} share={share} agree={agree} setAgree={setAgree} name={name} setName={setName} />
          )}

          <div className="mt-5 flex items-center justify-between gap-3">
            {step > 1 ? <Btn primary={false} onClick={() => go(step - 1)}>← Back</Btn> : <span />}
            {/* StepModules already has its own Proceed button */}
            {step !== 3 && (
              <Btn disabled={!canNext} onClick={next}>{step === 4 ? 'Sign & Submit' : 'Continue →'}</Btn>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}