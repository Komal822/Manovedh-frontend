import { useState } from 'react';

const STATES = {
  Maharashtra: [
    'Amravati', 'Akola', 'Buldhana', 'Washim', 'Yavatmal',
    'Nagpur', 'Pune', 'Mumbai', 'Nashik', 'Chhatrapati Sambhajinagar',
    'Nanded', 'Wardha', 'Jalgaon', 'Kolhapur', 'Thane',
  ],
  'Madhya Pradesh': [
    'Bhopal', 'Indore', 'Jabalpur', 'Gwalior',
  ],
  Gujarat: [
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot',
  ],
  Karnataka: [
    'Bengaluru Urban', 'Mysuru', 'Belagavi', 'Hubballi',
  ],
  'Uttar Pradesh': [
    'Lucknow', 'Kanpur Nagar', 'Agra', 'Varanasi',
  ],
  Rajasthan: [
    'Jaipur', 'Jodhpur', 'Udaipur', 'Kota',
  ],
  Delhi: [
    'New Delhi', 'North Delhi', 'South Delhi',
  ],
};

function Chevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className="pointer-events-none absolute right-4 top-1/2 mt-1 h-4 w-4 -translate-y-1/2 text-ink/40"
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <span role="alert" className="mt-1.5 block text-xs font-medium text-red-600">
      {message}
    </span>
  );
}

export default function StepProfileDetails({
  profile,
  setProfile,
  onBack,
  onSave,
  saving = false,
}) {
  const [errors, setErrors] = useState({});

  const update = (key, value) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
      ...(key === 'state' ? { district: '' } : {}),
    }));

    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const fieldClass = (hasError) =>
    `mt-2 w-full rounded-2xl border bg-white px-4 py-3.5 text-sm text-ink outline-none transition-all duration-200 placeholder:text-ink/30 shadow-[inset_0_1px_2px_rgba(20,50,40,0.04)] focus:ring-4 ${
      hasError
        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
        : 'border-line hover:border-leaf/40 focus:border-leaf focus:ring-leaf/10'
    }`;

  const selectClass = (hasError) => `${fieldClass(hasError)} appearance-none pr-11`;

  const labelClass = 'block text-xs font-semibold tracking-wide text-ink/80';

  const handleSave = () => {
    const nextErrors = {};

    if (!profile.gender) nextErrors.gender = 'Please select your gender.';
    if (!profile.dob) nextErrors.dob = 'Date of birth is required.';
    if (!profile.state) nextErrors.state = 'Please select your state.';
    if (!profile.district) nextErrors.district = 'Please select your district.';
    if (!profile.address?.trim()) nextErrors.address = 'Please enter your address.';

    setErrors(nextErrors);

    if (!Object.keys(nextErrors).length) {
      onSave();
    }
  };

  const addressLength = (profile.address || '').length;

  return (
    <div className="mx-auto w-full max-w-6xl px-2 pb-10">

      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Complete Your Profile
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/60">
            Add your personal and location details to finish your profile.
          </p>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-leaf/20 bg-white px-4 py-2 text-xs font-semibold text-leaf shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-leaf" />
          Step 2 of onboarding
        </span>
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-line/70 bg-white shadow-[0_2px_4px_rgba(25,80,65,0.04),0_24px_60px_-12px_rgba(25,80,65,0.14)]">

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 border-b border-line/60 bg-gradient-to-b from-tint/40 to-white px-5 py-5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-leaf/15 text-sm font-bold text-leaf">
            ✓
          </span>
          <span className="h-1 w-20 overflow-hidden rounded-full bg-leaf/15">
            <span className="block h-full w-full rounded-full bg-leaf" />
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-leaf text-sm font-bold text-white shadow-md shadow-leaf/25">
            2
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">

          {/* Live summary panel */}
          <aside className="relative overflow-hidden bg-leaf p-6 text-white sm:p-8 lg:col-span-4">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-12 h-64 w-64 rounded-full bg-black/10 blur-3xl" />

            <div className="relative flex h-full flex-col items-center justify-center py-4 text-center lg:py-10">
              <div className="relative">
                <div className="absolute inset-0 -m-3 rounded-full border border-white/25" />
                <div className="absolute inset-0 -m-6 rounded-full border border-white/10" />
                <div className="relative grid h-24 w-24 place-items-center rounded-full bg-white/15 ring-4 ring-white/30 backdrop-blur-sm sm:h-28 sm:w-28">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-11 w-11 text-white"
                    aria-hidden="true"
                  >
                    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" strokeLinejoin="round" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </div>
              </div>

              <h3 className="mt-9 font-serif text-2xl font-bold leading-tight">
                {profile.district || 'Your location'}
              </h3>
              <p className="mt-1.5 text-sm text-white/70">
                {profile.state || 'Select your state and district'}
              </p>

              <p className="mt-8 max-w-[15rem] text-xs leading-relaxed text-white/60">
                Only the details required for your Manovedh profile are collected.
              </p>
            </div>
          </aside>

          {/* Form side */}
          <div className="p-5 sm:p-8 lg:col-span-8 lg:p-10">

            <h2 className="font-serif text-xl font-bold text-ink">
              Personal & Location Details
            </h2>

            <p className="mt-1 text-xs text-ink/50">
              Only the details required for your Manovedh profile are collected.
            </p>

            <div className="mt-7 grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">

              <label className={labelClass}>
                Gender
                <div className="relative">
                  <select
                    value={profile.gender || ''}
                    onChange={(e) => update('gender', e.target.value)}
                    aria-invalid={!!errors.gender}
                    className={selectClass(errors.gender)}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  <Chevron />
                </div>
                <FieldError message={errors.gender} />
              </label>

              <label className={labelClass}>
                Date of Birth
                <input
                  type="date"
                  value={profile.dob || ''}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => update('dob', e.target.value)}
                  aria-invalid={!!errors.dob}
                  className={fieldClass(errors.dob)}
                />
                <FieldError message={errors.dob} />
              </label>

              <label className={labelClass}>
                State / Union Territory
                <div className="relative">
                  <select
                    value={profile.state || ''}
                    onChange={(e) => update('state', e.target.value)}
                    aria-invalid={!!errors.state}
                    className={selectClass(errors.state)}
                  >
                    <option value="">Select state</option>
                    {Object.keys(STATES).map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  <Chevron />
                </div>
                <FieldError message={errors.state} />
              </label>

              <label className={labelClass}>
                District
                <div className="relative">
                  <select
                    value={profile.district || ''}
                    disabled={!profile.state}
                    onChange={(e) => update('district', e.target.value)}
                    aria-invalid={!!errors.district}
                    className={`${selectClass(errors.district)} disabled:cursor-not-allowed disabled:bg-tint/40 disabled:text-ink/40`}
                  >
                    <option value="">
                      {profile.state ? 'Select district' : 'Select state first'}
                    </option>
                    {(STATES[profile.state] || []).map((district) => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                  <Chevron />
                </div>
                <FieldError message={errors.district} />
              </label>

              <label className={`${labelClass} sm:col-span-2`}>
                Address
                <textarea
                  rows={3}
                  maxLength={300}
                  value={profile.address || ''}
                  onChange={(e) => update('address', e.target.value)}
                  placeholder="House/Area, City, State"
                  aria-invalid={!!errors.address}
                  className={`${fieldClass(errors.address)} resize-y`}
                />
                <span className="mt-2 flex items-center justify-between gap-3 text-[11px] font-normal text-ink/50">
                  <span>Keep this simple. Do not enter unnecessary sensitive details.</span>
                  <span className="shrink-0 tabular-nums">{addressLength}/300</span>
                </span>
                <FieldError message={errors.address} />
              </label>

            </div>

            <div className="mt-10 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onBack}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-7 py-3.5 text-sm font-bold text-ink shadow-sm transition-all duration-200 hover:border-leaf/40 hover:bg-tint/50 focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>←</span>
                Back
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-leaf px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-leaf/25 transition-all duration-200 hover:shadow-xl hover:shadow-leaf/30 hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf/30 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 disabled:hover:brightness-100"
              >
                {saving && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
                    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                )}
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}