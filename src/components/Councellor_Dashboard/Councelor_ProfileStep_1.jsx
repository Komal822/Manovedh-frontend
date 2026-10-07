import React, { useEffect, useState } from "react";
import avery from "../../assets/councelor_avatar/Avery.png";
import jordan from "../../assets/councelor_avatar/jordan.png";
import riley from "../../assets/councelor_avatar/riley.png";
import taylor from "../../assets/councelor_avatar/taylor.png";
import casey from "../../assets/councelor_avatar/casey.png";
import morgan from "../../assets/councelor_avatar/morgan.png";
import jamie from "../../assets/councelor_avatar/jamie.png";
import drew from "../../assets/councelor_avatar/drew.png";

const LOCAL_STORAGE_PARTNER_SESSION_KEY = "manovedh_current_partner";

const avatars = [
  { name: "Avery", src: avery },
  { name: "Jordan", src: jordan },
  { name: "Riley", src: riley },
  { name: "Taylor", src: taylor },
  { name: "Casey", src: casey },
  { name: "Morgan", src: morgan },
  { name: "Jamie", src: jamie },
  { name: "Drew", src: drew },
];

function getCurrentPartner() {
  try {
    const storedPartner = localStorage.getItem(
      LOCAL_STORAGE_PARTNER_SESSION_KEY
    );
    return storedPartner ? JSON.parse(storedPartner) : {};
  } catch (error) {
    console.error("Unable to read partner session:", error);
    return {};
  }
}

function Field({ label, hint, invalid, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-semibold tracking-wide text-[#0d3630]">
        {label}
      </span>
      {children}
      {invalid ? (
        <span className="mt-1.5 block text-xs font-medium text-red-600">
          {invalid}
        </span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs text-[#547e74]">{hint}</span>
      ) : null}
    </label>
  );
}

export default function CounsellorProfileStep1({
  onNext,
  partner: partnerProp,
}) {
  const [partner, setPartner] = useState(
    () => partnerProp || getCurrentPartner()
  );

  const [avatar, setAvatar] = useState("Avery");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  const [avatarErrors, setAvatarErrors] = useState({});
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const currentPartner = partnerProp || getCurrentPartner();
    setPartner(currentPartner);

    const fullName =
      currentPartner?.fullName ||
      currentPartner?.name ||
      currentPartner?.firstName ||
      "";

    const nameParts = fullName.trim().split(/\s+/);

    setFirstName(currentPartner?.firstName || nameParts[0] || "");
    setLastName(
      currentPartner?.lastName ||
        (nameParts.length > 1 ? nameParts.slice(1).join(" ") : "")
    );
    setEmail(currentPartner?.email || "");
    setMobile(
      currentPartner?.phoneNumber ||
        currentPartner?.mobile ||
        currentPartner?.phone ||
        ""
    );

    if (currentPartner?.avatar) {
      setAvatar(currentPartner.avatar);
    }
  }, [partnerProp]);

  const markTouched = (field) =>
    setTouched((previous) => ({ ...previous, [field]: true }));

  const cleanMobile = mobile.replace(/\D/g, "");
  const fieldErrors = {
    firstName: firstName.trim() ? "" : "Enter your first name",
    lastName: lastName.trim() ? "" : "Enter your last name",
    mobile:
      cleanMobile.length >= 10 && cleanMobile.length <= 15
        ? ""
        : "Enter a valid mobile number (10–15 digits)",
  };
  const showError = (field) => (touched[field] ? fieldErrors[field] : "");

  const handleNext = () => {
    setError("");

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();

    if (!cleanFirstName || !cleanLastName) {
      setTouched((previous) => ({
        ...previous,
        firstName: true,
        lastName: true,
      }));
      setError("Please enter your first name and last name.");
      return;
    }

    if (!cleanMobile || cleanMobile.length < 10 || cleanMobile.length > 15) {
      markTouched("mobile");
      setError("Please enter a valid mobile number.");
      return;
    }

    const profileData = {
      ...partner,
      avatar,
      firstName: cleanFirstName,
      lastName: cleanLastName,
      fullName: `${cleanFirstName} ${cleanLastName}`,
      email,
      mobile: cleanMobile,
      phoneNumber: cleanMobile,
    };

    try {
      localStorage.setItem(
        LOCAL_STORAGE_PARTNER_SESSION_KEY,
        JSON.stringify(profileData)
      );
    } catch (storageError) {
      console.error("Unable to save profile details:", storageError);
      setError("Unable to save your details. Please try again.");
      return;
    }

    if (typeof onNext === "function") {
      onNext(profileData);
    } else {
      console.warn("onNext callback is missing.");
    }
  };

  const handleMobileChange = (value) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 15);
    setMobile(digitsOnly);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNext();
    }
  };

  const selected = avatars.find((a) => a.name === avatar) || avatars[0];
  const greetingName = firstName.trim();

  const renderAvatarImage = (item) =>
    avatarErrors[item.name] ? (
      <span className="text-sm font-bold text-[#114b42]">
        {item.name.charAt(0)}
      </span>
    ) : (
      <img
        src={item.src}
        alt={`${item.name} avatar`}
        className="h-full w-full object-cover"
        onError={() =>
          setAvatarErrors((previous) => ({
            ...previous,
            [item.name]: true,
          }))
        }
      />
    );

  return (
    <div className="mv-root relative flex min-h-screen w-full flex-col overflow-x-hidden text-[#123832] selection:bg-[#114b42] selection:text-white">
      {/* Soft light glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(700px 420px at 12% -5%, rgba(255,255,255,0.65), transparent 60%), radial-gradient(600px 420px at 100% 105%, rgba(255,255,255,0.45), transparent 60%)",
        }}
      />

      {/* Top Header */}
      <header className="relative z-40 shrink-0 border-b border-[#a6dbc0] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0c3831] text-lg text-white shadow-[0_6px_16px_rgba(12,56,49,0.25)]">
              🌿
            </div>
            <div>
              <div className="text-base font-bold leading-none tracking-tight text-[#0c3831]">
                Manovedh
              </div>
              <div className="mt-1 text-[10px] font-bold tracking-[2.5px] text-[#1b5e53]">
                PARTNER PORTAL
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#a6dbc0] bg-[#e6f7ee] px-3.5 py-1.5 text-xs font-bold text-[#114b42]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#114b42]"></span>
            Step 1 of 2
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0b332d] sm:text-4xl">
              {greetingName ? `Welcome, ${greetingName}` : "Complete your profile"}
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#245248]">
              Pick an avatar and confirm your details. It takes less than a
              minute.
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-3xl border border-[#a6dbc0] bg-white p-6 shadow-[0_24px_60px_rgba(11,51,45,0.14)] sm:p-9">
            {/* Progress */}
            <div className="mb-7">
              <div className="mb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#114b42] text-xs font-bold text-white">
                    1
                  </span>
                  <span className="text-sm font-bold text-[#114b42]">
                    Basic information & avatar
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#547e74]">
                  50% done
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e1f2e8]">
                <div className="h-full w-1/2 rounded-full bg-[#114b42]"></div>
              </div>
            </div>

            {/* Avatar Selection */}
            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex shrink-0 flex-col items-center sm:w-36">
                <div className="mv-ring flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#d5efe2]">
                  {renderAvatarImage(selected)}
                </div>
                <span className="mt-3 text-sm font-bold text-[#0b332d]">
                  {selected.name}
                </span>
                <span className="text-xs text-[#547e74]">Your avatar</span>
              </div>

              <div className="flex-1">
                <h3 className="mb-3 text-[13px] font-semibold tracking-wide text-[#0d3630]">
                  Choose your avatar
                </h3>
                <div className="grid grid-cols-4 gap-2.5">
                  {avatars.map((item) => {
                    const isSelected = avatar === item.name;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setAvatar(item.name)}
                        aria-pressed={isSelected}
                        aria-label={`Select ${item.name}`}
                        className={`relative flex flex-col items-center rounded-xl border p-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#114b42] ${
                          isSelected
                            ? "border-[#114b42] bg-[#e2f7ec] shadow-[0_6px_16px_rgba(17,75,66,0.15)] ring-1 ring-[#114b42]"
                            : "border-[#d0ebd9] bg-[#fbfdfc] hover:-translate-y-0.5 hover:border-[#8ecbb0] hover:bg-[#f2faf5]"
                        }`}
                      >
                        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[#d5efe2] shadow-inner">
                          {renderAvatarImage(item)}
                        </div>
                        <span className="mt-1.5 text-[11px] font-bold text-[#1a423b]">
                          {item.name}
                        </span>
                        {isSelected && (
                          <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#114b42] text-[10px] text-white shadow">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Input Fields */}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="First name" invalid={showError("firstName")}>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={() => markTouched("firstName")}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter first name"
                  autoComplete="given-name"
                  className={`mv-input ${showError("firstName") ? "mv-invalid" : ""}`}
                />
              </Field>

              <Field label="Last name" invalid={showError("lastName")}>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={() => markTouched("lastName")}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter last name"
                  autoComplete="family-name"
                  className={`mv-input ${showError("lastName") ? "mv-invalid" : ""}`}
                />
              </Field>

              <Field
                label="Email address"
                hint="Linked to your account, can't be changed"
              >
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    readOnly
                    autoComplete="email"
                    className="mv-input mv-readonly pr-10"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm opacity-60"
                  >
                    🔒
                  </span>
                </div>
              </Field>

              <Field
                label="Mobile number"
                hint="Digits only, 10 to 15 numbers"
                invalid={showError("mobile")}
              >
                <input
                  type="tel"
                  inputMode="numeric"
                  value={mobile}
                  onChange={(e) => handleMobileChange(e.target.value)}
                  onBlur={() => markTouched("mobile")}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter mobile number"
                  autoComplete="tel"
                  className={`mv-input ${showError("mobile") ? "mv-invalid" : ""}`}
                />
              </Field>
            </div>

            {/* Error Alert */}
            {error && (
              <div
                role="alert"
                className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700"
              >
                ⚠️ {error}
              </div>
            )}

            {/* Action */}
            <div className="mt-7 flex items-center justify-between gap-4 border-t border-[#e1f2e8] pt-5">
              <span className="hidden text-xs text-[#547e74] sm:block">
                Next: professional details
              </span>
              <button
                type="button"
                onClick={handleNext}
                className="mv-btn group flex w-full items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold sm:w-auto">
                <span>Next step</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-[#3d6b60]">
            Your details are kept private and used only for your partner profile.
          </p>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .mv-root {
          font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
          background: linear-gradient(135deg, #bfe8d1 0%, #a8dcc0 50%, #92cfb0 100%);
        }

        .mv-btn {
          background-color: #0c3831;
          background-image: linear-gradient(135deg, #114b42, #0a2f29);
          color: #ffffff;
          border: none;
          cursor: pointer;
          box-shadow: 0 10px 24px rgba(12, 56, 49, 0.35);
          transition: box-shadow 0.2s ease, transform 0.1s ease, filter 0.2s ease;
        }
        .mv-btn:hover { box-shadow: 0 14px 30px rgba(12, 56, 49, 0.45); filter: brightness(1.12); }
        .mv-btn:active { transform: scale(0.98); }
        .mv-btn:focus-visible { outline: 3px solid #0c3831; outline-offset: 3px; }

        .mv-ring {
          box-shadow: 0 0 0 3px #ffffff, 0 0 0 5px #114b42, 0 12px 26px rgba(17,75,66,0.25);
        }

        .mv-input {
          width: 100%;
          border: 1px solid #b8e2cc;
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 14px;
          color: #0b332d;
          outline: none;
          background: #ffffff;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .mv-input::placeholder { color: #8fb3a7; }
        .mv-input:hover { border-color: #8ecbb0; }
        .mv-input:focus {
          border-color: #114b42;
          box-shadow: 0 0 0 4px rgba(17, 75, 66, 0.12);
        }
        .mv-input.mv-invalid { border-color: #ef4444; }
        .mv-input.mv-invalid:focus { box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.12); }
        .mv-input.mv-readonly {
          cursor: not-allowed;
          background: #f0f9f4;
          color: #547e74;
        }
        .mv-input.mv-readonly:hover,
        .mv-input.mv-readonly:focus {
          border-color: #b8e2cc;
          box-shadow: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .mv-root * { transition: none !important; }
        }
      `}</style>
    </div>
  );
}