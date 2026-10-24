import { useState } from 'react';

import avatar1 from '../images/avatar-1.png';
import avatar2 from '../images/avatar-2.png';
import avatar3 from '../images/avatar-3.png';
import avatar4 from '../images/avatar-4.png';
import avatar6 from '../images/avatar-6.png';
import avatar7 from '../images/avatar-7.png';
import avatar8 from '../images/avatra-4.png'; // file name has a typo in your folder (avatra-4.png)

// `id` is the filename saved in the UserProfile table; `image` is the imported file.
export const AVATARS = [
  { id: 'avatar-1.png', name: 'Avery', image: avatar1 },
  { id: 'avatar-2.png', name: 'Jordan', image: avatar2 },
  { id: 'avatar-3.png', name: 'Riley', image: avatar3 },
  { id: 'avatar-4.png', name: 'Taylor', image: avatar4 },
  { id: 'avatar-6.png', name: 'Casey', image: avatar6 },
  { id: 'avatar-7.png', name: 'Morgan', image: avatar7 },
  { id: 'avatra-4.png', name: 'Jamie', image: avatar8 },
];

export default function StepProfile({
  profile,
  setProfile,
  onNext,
}) {
  const [errors, setErrors] = useState({});

  // Email is locked only if it was already provided (e.g. from the login account)
  // when this step opened. If it's empty, the user can type it.
  const [emailLocked] = useState(() => !!profile?.email?.trim());

  const update = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const handleNext = () => {
    const nextErrors = {};

    if (!profile.avatar) nextErrors.avatar = 'Please select an avatar.';
    if (!profile.firstName?.trim()) nextErrors.firstName = 'First name is required.';
    if (!profile.lastName?.trim()) nextErrors.lastName = 'Last name is required.';

    if (!emailLocked) {
      if (!profile.email?.trim()) {
        nextErrors.email = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(profile.email.trim())) {
        nextErrors.email = 'Enter a valid email address.';
      }
    }

    if (!profile.mobile?.trim()) {
      nextErrors.mobile = 'Mobile number is required.';
    } else if (!/^[6-9]\d{9}$/.test(profile.mobile)) {
      nextErrors.mobile = 'Enter a valid 10-digit mobile number.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      onNext();
    }
  };

  const selectedAvatar = AVATARS.find((a) => a.id === profile.avatar);
  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim();

  const fieldClass = (hasError) =>
    `mt-2 w-full rounded-2xl border bg-white px-4 py-3.5 text-sm text-ink outline-none transition-all duration-200 placeholder:text-ink/30 shadow-[inset_0_1px_2px_rgba(20,50,40,0.04)] focus:bg-white focus:ring-4 ${
      hasError
        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
        : 'border-line hover:border-leaf/40 focus:border-leaf focus:ring-leaf/10'
    }`;

  const labelClass = 'block text-xs font-semibold tracking-wide text-ink/80';

  return (
    <div className="mx-auto w-full max-w-6xl px-2 pb-10">

      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Complete Your Profile
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/60">
            Select your avatar and add the basic details needed for your Manovedh account.
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
          <span className="grid h-9 w-9 place-items-center rounded-full bg-leaf text-sm font-bold text-white shadow-md shadow-leaf/25">
            1
          </span>
          <span className="h-1 w-20 overflow-hidden rounded-full bg-leaf/15">
            <span className="block h-full w-1/2 rounded-full bg-leaf" />
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-sm font-semibold text-ink/40">
            2
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">

          {/* Live preview panel */}
          <aside className="relative overflow-hidden bg-leaf p-6 text-white sm:p-8 lg:col-span-4">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-12 h-64 w-64 rounded-full bg-black/10 blur-3xl" />

            <div className="relative flex h-full flex-col items-center justify-center py-4 text-center lg:py-10">
              <div className="relative">
                <div className="absolute inset-0 -m-3 rounded-full border border-white/25" />
                <div className="absolute inset-0 -m-6 rounded-full border border-white/10" />
                <div className="relative grid h-28 w-28 place-items-center overflow-hidden rounded-full bg-white/15 ring-4 ring-white/30 backdrop-blur-sm sm:h-32 sm:w-32">
                  {selectedAvatar ? (
                    <img
                      key={selectedAvatar.id}
                      src={selectedAvatar.image}
                      alt={selectedAvatar.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-12 w-12 text-white/70">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
              </div>

              <h3 className="mt-9 font-serif text-2xl font-bold leading-tight">
                {fullName || 'Your name'}
              </h3>
              <p className="mt-1.5 max-w-[16rem] truncate text-sm text-white/70">
                {profile.email || 'Your Manovedh account'}
              </p>

              <p className="mt-8 max-w-[15rem] text-xs leading-relaxed text-white/60">
                This is how your profile will appear across Manovedh.
              </p>
            </div>
          </aside>

          {/* Form side */}
          <div className="p-5 sm:p-8 lg:col-span-8 lg:p-10">

            <h2 className="font-serif text-xl font-bold text-ink">
              Avatar & Basic Information
            </h2>

            <p className="mt-1 text-xs text-ink/50">
              Your avatar is stored as a filename in your UserProfile table.
            </p>

            {/* Avatar selection - Compact & Premium Grid */}
            <div className="mt-6">
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-sm font-bold text-ink">Choose Your Avatar</h3>
                <span className="text-xs text-ink/50">Pick one simple profile avatar.</span>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:grid-cols-7 sm:gap-2.5">
                {AVATARS.map((avatar) => {
                  const selected = profile.avatar === avatar.id;

                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => update('avatar', avatar.id)}
                      aria-pressed={selected}
                      className={`group relative flex flex-col items-center rounded-xl p-2 transition-all duration-200 focus:outline-none ${
                        selected
                          ? 'border-leaf bg-tint/80 ring-2 ring-leaf shadow-md scale-105'
                          : 'border-line bg-white hover:border-leaf/40 hover:bg-tint/30 hover:scale-[1.02]'
                      } border`}
                    >
                      <div className="relative h-11 w-11 overflow-hidden rounded-full bg-tint ring-1 ring-white/80 sm:h-12 sm:w-12">
                        <img
                          src={avatar.image}
                          alt={avatar.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <p
                        className={`mt-1.5 truncate text-center text-[10px] font-semibold leading-tight ${
                          selected ? 'text-leaf font-bold' : 'text-ink/80'
                        }`}
                      >
                        {avatar.name}
                      </p>

                      {selected && (
                        <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-leaf text-[9px] font-bold text-white shadow-sm">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {errors.avatar && (
                <p role="alert" className="mt-3 text-xs font-medium text-red-600">
                  {errors.avatar}
                </p>
              )}
            </div>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-line to-transparent" />

            {/* Basic information */}
            <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">

              <label className={labelClass}>
                First Name
                <input
                  type="text"
                  autoComplete="given-name"
                  value={profile.firstName || ''}
                  onChange={(e) => update('firstName', e.target.value)}
                  placeholder="Enter first name"
                  aria-invalid={!!errors.firstName}
                  className={fieldClass(errors.firstName)}
                />
                {errors.firstName && (
                  <span role="alert" className="mt-1.5 block text-xs font-medium text-red-600">
                    {errors.firstName}
                  </span>
                )}
              </label>

              <label className={labelClass}>
                Last Name
                <input
                  type="text"
                  autoComplete="family-name"
                  value={profile.lastName || ''}
                  onChange={(e) => update('lastName', e.target.value)}
                  placeholder="Enter last name"
                  aria-invalid={!!errors.lastName}
                  className={fieldClass(errors.lastName)}
                />
                {errors.lastName && (
                  <span role="alert" className="mt-1.5 block text-xs font-medium text-red-600">
                    {errors.lastName}
                  </span>
                )}
              </label>

              <label className={labelClass}>
                Email Address
                <div className="relative">
                  <input
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={profile.email || ''}
                    readOnly={emailLocked}
                    onChange={
                      emailLocked
                        ? undefined
                        : (e) => update('email', e.target.value.replace(/\s/g, ''))
                    }
                    placeholder="email@example.com"
                    aria-invalid={!!errors.email}
                    className={
                      emailLocked
                        ? 'mt-2 w-full cursor-not-allowed rounded-2xl border border-line bg-tint/40 px-4 py-3.5 pr-11 text-sm text-ink/60 outline-none'
                        : fieldClass(errors.email)
                    }
                  />
                  {emailLocked && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="absolute right-4 top-1/2 mt-1 h-4 w-4 -translate-y-1/2 text-ink/35"
                      aria-hidden="true"
                    >
                      <rect x="5" y="11" width="14" height="9" rx="2" />
                      <path d="M8 11V8a4 4 0 0 1 8 0v3" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                {errors.email && (
                  <span role="alert" className="mt-1.5 block text-xs font-medium text-red-600">
                    {errors.email}
                  </span>
                )}
                {emailLocked && (
                  <span className="mt-2 block text-[11px] font-normal text-ink/50">
                    Email is managed from your login account.
                  </span>
                )}
              </label>

              <label className={labelClass}>
                Mobile Number
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 mt-1 -translate-y-1/2 border-r border-line pr-3 text-sm font-medium text-ink/50">
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    autoComplete="tel-national"
                    value={profile.mobile || ''}
                    onChange={(e) => update('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Example: 9876543210"
                    aria-invalid={!!errors.mobile}
                    className={`${fieldClass(errors.mobile)} pl-[4.25rem]`}
                  />
                </div>
                {errors.mobile && (
                  <span role="alert" className="mt-1.5 block text-xs font-medium text-red-600">
                    {errors.mobile}
                  </span>
                )}
              </label>

            </div>

            <div className="mt-10 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="group inline-flex items-center gap-2 rounded-full bg-leaf px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-leaf/25 transition-all duration-200 hover:shadow-xl hover:shadow-leaf/30 hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-leaf/30 active:scale-[0.98]"
              >
                Next Step
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </button>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}