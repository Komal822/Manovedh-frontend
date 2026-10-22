import React, { useEffect, useState } from "react";

const LOCAL_STORAGE_PARTNERS_KEY = "manovedh_wellness_partners";
const LOCAL_STORAGE_PARTNER_SESSION_KEY = "manovedh_current_partner";

const statesAndDistricts = {
  Maharashtra: [
    "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara",
    "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli",
    "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai", "Nagpur", "Nanded",
    "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune",
    "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur",
    "Thane", "Wardha", "Washim", "Yavatmal",
  ],
  Gujarat: [
    "Ahmedabad", "Amreli", "Anand", "Banaskantha", "Bharuch", "Bhavnagar",
    "Gandhinagar", "Jamnagar", "Junagadh", "Kutch", "Mehsana", "Rajkot",
    "Surat", "Vadodara",
  ],
  "Madhya Pradesh": [
    "Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Rewa", "Sagar",
    "Satna",
  ],
  Rajasthan: [
    "Jaipur", "Jodhpur", "Udaipur", "Ajmer", "Kota", "Bikaner", "Alwar",
    "Bharatpur",
  ],
  Karnataka: [
    "Bengaluru", "Mysuru", "Belagavi", "Mangaluru", "Hubballi", "Dharwad",
    "Shivamogga",
  ],
  Delhi: [
    "New Delhi", "Central Delhi", "North Delhi", "South Delhi", "East Delhi",
    "West Delhi",
  ],
};

const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const UPI_REGEX = /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/;
const PINCODE_REGEX = /^[1-9][0-9]{5}$/;

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

// Reads the structured address. If only an old single-line address exists,
// it is placed in "Address line 1" so nothing is lost.
function readAddress(data = {}) {
  const details = data.addressDetails || {};
  return {
    addressLine1: details.addressLine1 || (data.addressDetails ? "" : data.address || ""),
    addressLine2: details.addressLine2 || "",
    landmark: details.landmark || "",
    city: details.city || "",
    pincode: details.pincode || "",
  };
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

export default function CounsellorProfileStep2({
  initialData = {},
  onBack,
  onSave,
}) {
  const [partner, setPartner] = useState(() => ({
    ...getCurrentPartner(),
    ...initialData,
  }));

  // Personal & location
  const initialAddress = readAddress(initialData);
  const [gender, setGender] = useState(initialData.gender || "");
  const [dob, setDob] = useState(initialData.dob || "");
  const [state, setState] = useState(initialData.state || "");
  const [district, setDistrict] = useState(initialData.district || "");
  const [addressLine1, setAddressLine1] = useState(initialAddress.addressLine1);
  const [addressLine2, setAddressLine2] = useState(initialAddress.addressLine2);
  const [landmark, setLandmark] = useState(initialAddress.landmark);
  const [city, setCity] = useState(initialAddress.city);
  const [pincode, setPincode] = useState(initialAddress.pincode);

  // Bank details
  const initialBank = initialData.bankDetails || {};
  const [accountHolderName, setAccountHolderName] = useState(
    initialBank.accountHolderName || ""
  );
  const [bankName, setBankName] = useState(initialBank.bankName || "");
  const [accountNumber, setAccountNumber] = useState(
    initialBank.accountNumber || ""
  );
  const [confirmAccountNumber, setConfirmAccountNumber] = useState(
    initialBank.accountNumber || ""
  );
  const [ifsc, setIfsc] = useState(initialBank.ifsc || "");
  const [accountType, setAccountType] = useState(initialBank.accountType || "");
  const [upiId, setUpiId] = useState(initialBank.upiId || "");

  const [error, setError] = useState("");
  const [touched, setTouched] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Restore saved information and Step 1 data.
  useEffect(() => {
    const currentPartner = {
      ...getCurrentPartner(),
      ...initialData,
    };
    const bank = currentPartner.bankDetails || {};
    const savedAddress = readAddress(currentPartner);

    setPartner(currentPartner);
    setGender(currentPartner.gender || "");
    setDob(currentPartner.dob || "");
    setState(currentPartner.state || "");
    setDistrict(currentPartner.district || "");
    setAddressLine1(savedAddress.addressLine1);
    setAddressLine2(savedAddress.addressLine2);
    setLandmark(savedAddress.landmark);
    setCity(savedAddress.city);
    setPincode(savedAddress.pincode);

    setAccountHolderName(bank.accountHolderName || "");
    setBankName(bank.bankName || "");
    setAccountNumber(bank.accountNumber || "");
    setConfirmAccountNumber(bank.accountNumber || "");
    setIfsc(bank.ifsc || "");
    setAccountType(bank.accountType || "");
    setUpiId(bank.upiId || "");
  }, [initialData]);

  const markTouched = (field) =>
    setTouched((previous) => ({ ...previous, [field]: true }));

  const todayString = new Date().toISOString().split("T")[0];

  const getDobError = () => {
    if (!dob) return "Select your date of birth";
    const selectedDate = new Date(`${dob}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(selectedDate.getTime()) || selectedDate > today) {
      return "Select a valid date of birth";
    }
    return "";
  };

  // Order matters: the first invalid field is the one reported on save.
  const fieldErrors = {
    gender: gender ? "" : "Select your gender",
    dob: getDobError(),
    state: state ? "" : "Select your state",
    district: district ? "" : "Select your district",
    addressLine1: addressLine1.trim()
      ? ""
      : "Enter your house / flat number and building name",
    addressLine2: addressLine2.trim() ? "" : "Enter your street or area",
    city: city.trim() ? "" : "Enter your city, town or village",
    pincode: !pincode
      ? "Enter your pincode"
      : !PINCODE_REGEX.test(pincode)
      ? "Enter a valid 6-digit pincode"
      : "",
    accountHolderName: accountHolderName.trim()
      ? ""
      : "Enter the account holder name",
    bankName: bankName.trim() ? "" : "Enter your bank name",
    accountNumber: !accountNumber
      ? "Enter your account number"
      : accountNumber.length < 9 || accountNumber.length > 18
      ? "Account number must be 9 to 18 digits"
      : "",
    confirmAccountNumber: !confirmAccountNumber
      ? "Re-enter your account number"
      : confirmAccountNumber !== accountNumber
      ? "Account numbers do not match"
      : "",
    ifsc: !ifsc
      ? "Enter your IFSC code"
      : !IFSC_REGEX.test(ifsc)
      ? "Enter a valid IFSC code (e.g. SBIN0001234)"
      : "",
    accountType: accountType ? "" : "Select the account type",
    upiId:
      upiId.trim() && !UPI_REGEX.test(upiId.trim())
        ? "Enter a valid UPI ID (e.g. name@bank)"
        : "",
  };
  const showError = (field) => (touched[field] ? fieldErrors[field] : "");

  const handleSave = () => {
    setError("");

    if (isSaving) return;

    const firstInvalid = Object.keys(fieldErrors).find(
      (key) => fieldErrors[key]
    );

    if (firstInvalid) {
      setTouched(
        Object.keys(fieldErrors).reduce(
          (all, key) => ({ ...all, [key]: true }),
          {}
        )
      );
      setError(`${fieldErrors[firstInvalid]}.`);
      return;
    }

    const addressDetails = {
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim(),
      landmark: landmark.trim(),
      city: city.trim(),
      pincode,
    };

    // Single-line version of the address, kept for the rest of the app.
    const fullAddress = [
      addressDetails.addressLine1,
      addressDetails.addressLine2,
      addressDetails.landmark ? `Near ${addressDetails.landmark}` : "",
      addressDetails.city,
      district,
      state,
      addressDetails.pincode,
    ]
      .filter(Boolean)
      .join(", ");

    const profileData = {
      ...partner,
      ...initialData,
      gender,
      dob,
      state,
      district,
      address: fullAddress,
      addressDetails,
      bankDetails: {
        accountHolderName: accountHolderName.trim(),
        bankName: bankName.trim(),
        accountNumber,
        ifsc,
        accountType,
        upiId: upiId.trim(),
      },
      profileCompleted: true,
    };

    try {
      setIsSaving(true);

      // Save the updated partner session.
      localStorage.setItem(
        LOCAL_STORAGE_PARTNER_SESSION_KEY,
        JSON.stringify(profileData)
      );

      // Update the registered partners list.
      const storedPartners = localStorage.getItem(LOCAL_STORAGE_PARTNERS_KEY);

      const partners = storedPartners ? JSON.parse(storedPartners) : [];

      const updatedPartners = partners.map((item) => {
        const isSamePartner =
          (profileData.id && item.id === profileData.id) ||
          (profileData.email &&
            item.email?.toLowerCase() === profileData.email.toLowerCase());

        return isSamePartner ? { ...item, ...profileData } : item;
      });

      localStorage.setItem(
        LOCAL_STORAGE_PARTNERS_KEY,
        JSON.stringify(updatedPartners)
      );

      // Keep the completion flag consistent with the login flow.
      localStorage.setItem("manovedh_partner_profile_completed", "true");

      setPartner(profileData);

      if (typeof onSave === "function") {
        onSave(profileData);
      }
    } catch (storageError) {
      console.error("Unable to save counsellor profile:", storageError);
      setError("Unable to save your profile. Please try again.");
      setIsSaving(false);
    }
  };

  const availableDistricts = statesAndDistricts[state] || [];

  return (
    <div className="mv-root relative min-h-screen w-full overflow-x-hidden text-[#123832] selection:bg-[#114b42] selection:text-white">
      {/* Soft light glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(700px 420px at 12% -5%, rgba(255,255,255,0.65), transparent 60%), radial-gradient(600px 420px at 100% 105%, rgba(255,255,255,0.45), transparent 60%)",
        }}
      />

      {/* Mobile Header */}
      <header className="relative z-30 border-b border-[#a6dbc0] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0c3831] text-white shadow-[0_6px_16px_rgba(12,56,49,0.25)]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15" />
                <path d="M5 19c3-5 6-8 10-10" />
              </svg>
            </div>
            <div>
              <div className="text-base font-bold leading-none text-[#0c3831]">
                Manovedh
              </div>
              <div className="mt-1 text-[10px] font-bold tracking-[2.5px] text-[#1b5e53]">
                PARTNER PORTAL
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#a6dbc0] bg-[#e6f7ee] px-3 py-1.5 text-xs font-bold text-[#114b42]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#114b42]"></span>
            Step 2 of 2
          </div>
        </div>
      </header>

      <main className="relative z-10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Page Header */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0b332d] sm:text-4xl">
              Almost done
              {partner?.firstName ? `, ${partner.firstName}` : ""}
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#245248]">
              Add your personal, location and bank details to complete your
              Manovedh account.
            </p>
          </div>

          <section className="rounded-3xl border border-[#a6dbc0] bg-white p-6 shadow-[0_24px_60px_rgba(11,51,45,0.14)] sm:p-9">
            {/* Progress */}
            <div className="mb-7">
              <div className="mb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#114b42] text-xs font-bold text-white">
                    2
                  </span>
                  <span className="text-sm font-bold text-[#114b42]">
                    Personal, location &amp; bank details
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#547e74]">
                  Last step
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e1f2e8]">
                <div className="h-full w-full rounded-full bg-[#114b42]"></div>
              </div>
            </div>

            {/* Personal & location */}
            <h2 className="mb-4 text-sm font-bold text-[#0c3831]">
              Personal &amp; location
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Gender" invalid={showError("gender")}>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  onBlur={() => markTouched("gender")}
                  className={`mv-input ${showError("gender") ? "mv-invalid" : ""}`}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </Field>

              <Field label="Date of birth" invalid={showError("dob")}>
                <input
                  type="date"
                  value={dob}
                  max={todayString}
                  onChange={(e) => setDob(e.target.value)}
                  onBlur={() => markTouched("dob")}
                  className={`mv-input ${showError("dob") ? "mv-invalid" : ""}`}
                />
              </Field>

              <Field
                label="State / Union Territory"
                invalid={showError("state")}
              >
                <select
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    setDistrict("");
                  }}
                  onBlur={() => markTouched("state")}
                  className={`mv-input ${showError("state") ? "mv-invalid" : ""}`}
                >
                  <option value="">Select state / union territory</option>
                  {Object.keys(statesAndDistricts).map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="District"
                hint={!state ? "Select a state first" : ""}
                invalid={showError("district")}
              >
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  onBlur={() => markTouched("district")}
                  className={`mv-input ${showError("district") ? "mv-invalid" : ""}`}
                  disabled={!state}
                >
                  <option value="">Select district</option>

                  {availableDistricts.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}

                  {state && availableDistricts.length === 0 && (
                    <option value="Other">Other</option>
                  )}
                </select>
              </Field>

              {/* Address (structured) */}
              <div className="md:col-span-2">
                <Field
                  label="Address line 1"
                  hint="House / flat number and building name. Keep it simple, avoid unnecessary sensitive details."
                  invalid={showError("addressLine1")}
                >
                  <input
                    type="text"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    onBlur={() => markTouched("addressLine1")}
                    placeholder="e.g. Flat 302, Shree Apartments"
                    maxLength={120}
                    autoComplete="address-line1"
                    className={`mv-input ${
                      showError("addressLine1") ? "mv-invalid" : ""
                    }`}
                  />
                </Field>
              </div>

              <div className="md:col-span-2">
                <Field
                  label="Address line 2"
                  hint="Street, area or locality"
                  invalid={showError("addressLine2")}
                >
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    onBlur={() => markTouched("addressLine2")}
                    placeholder="e.g. Rajapeth Road, Camp Area"
                    maxLength={120}
                    autoComplete="address-line2"
                    className={`mv-input ${
                      showError("addressLine2") ? "mv-invalid" : ""
                    }`}
                  />
                </Field>
              </div>

              <Field
                label="City / Town / Village"
                invalid={showError("city")}
              >
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onBlur={() => markTouched("city")}
                  placeholder="e.g. Amravati"
                  maxLength={60}
                  autoComplete="address-level2"
                  className={`mv-input ${showError("city") ? "mv-invalid" : ""}`}
                />
              </Field>

              <Field
                label="Pincode"
                hint="6-digit postal code"
                invalid={showError("pincode")}
              >
                <input
                  type="text"
                  inputMode="numeric"
                  value={pincode}
                  onChange={(e) =>
                    setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  onBlur={() => markTouched("pincode")}
                  placeholder="e.g. 444601"
                  maxLength={6}
                  autoComplete="postal-code"
                  className={`mv-input ${
                    showError("pincode") ? "mv-invalid" : ""
                  }`}
                />
              </Field>

              <div className="md:col-span-2">
                <Field
                  label="Landmark (optional)"
                  hint="A nearby place that helps people find you"
                >
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near Railway Station"
                    maxLength={100}
                    autoComplete="off"
                    className="mv-input"
                  />
                </Field>
              </div>
            </div>

            {/* Bank details */}
            <div className="mt-8 border-t border-[#e1f2e8] pt-6">
              <h2 className="text-sm font-bold text-[#0c3831]">Bank details</h2>
              <p className="mb-4 mt-1 text-xs text-[#547e74]">
                Your session earnings will be paid to this account.
              </p>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Account holder name"
                  hint="Exactly as it appears on your bank account"
                  invalid={showError("accountHolderName")}
                >
                  <input
                    type="text"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    onBlur={() => markTouched("accountHolderName")}
                    placeholder="Full name"
                    maxLength={100}
                    autoComplete="off"
                    className={`mv-input ${
                      showError("accountHolderName") ? "mv-invalid" : ""
                    }`}
                  />
                </Field>

                <Field label="Bank name" invalid={showError("bankName")}>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    onBlur={() => markTouched("bankName")}
                    placeholder="e.g. State Bank of India"
                    maxLength={100}
                    autoComplete="off"
                    className={`mv-input ${
                      showError("bankName") ? "mv-invalid" : ""
                    }`}
                  />
                </Field>

                <Field
                  label="Account number"
                  invalid={showError("accountNumber")}
                >
                  <input
                    type="password"
                    inputMode="numeric"
                    value={accountNumber}
                    onChange={(e) =>
                      setAccountNumber(
                        e.target.value.replace(/\D/g, "").slice(0, 18)
                      )
                    }
                    onBlur={() => markTouched("accountNumber")}
                    placeholder="Enter account number"
                    autoComplete="off"
                    className={`mv-input ${
                      showError("accountNumber") ? "mv-invalid" : ""
                    }`}
                  />
                </Field>

                <Field
                  label="Confirm account number"
                  invalid={showError("confirmAccountNumber")}
                >
                  <input
                    type="text"
                    inputMode="numeric"
                    value={confirmAccountNumber}
                    onChange={(e) =>
                      setConfirmAccountNumber(
                        e.target.value.replace(/\D/g, "").slice(0, 18)
                      )
                    }
                    onPaste={(e) => e.preventDefault()}
                    onBlur={() => markTouched("confirmAccountNumber")}
                    placeholder="Re-enter account number"
                    autoComplete="off"
                    className={`mv-input ${
                      showError("confirmAccountNumber") ? "mv-invalid" : ""
                    }`}
                  />
                </Field>

                <Field
                  label="IFSC code"
                  hint="11 characters, e.g. SBIN0001234"
                  invalid={showError("ifsc")}
                >
                  <input
                    type="text"
                    value={ifsc}
                    onChange={(e) =>
                      setIfsc(
                        e.target.value
                          .toUpperCase()
                          .replace(/[^A-Z0-9]/g, "")
                          .slice(0, 11)
                      )
                    }
                    onBlur={() => markTouched("ifsc")}
                    placeholder="IFSC code"
                    maxLength={11}
                    autoComplete="off"
                    className={`mv-input ${
                      showError("ifsc") ? "mv-invalid" : ""
                    }`}
                  />
                </Field>

                <Field label="Account type" invalid={showError("accountType")}>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    onBlur={() => markTouched("accountType")}
                    className={`mv-input ${
                      showError("accountType") ? "mv-invalid" : ""
                    }`}
                  >
                    <option value="">Select account type</option>
                    <option value="Savings">Savings</option>
                    <option value="Current">Current</option>
                  </select>
                </Field>

                <div className="md:col-span-2">
                  <Field
                    label="UPI ID (optional)"
                    hint="Add a UPI ID if you'd also like to receive payments that way"
                    invalid={showError("upiId")}
                  >
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      onBlur={() => markTouched("upiId")}
                      placeholder="name@bank"
                      maxLength={100}
                      autoComplete="off"
                      className={`mv-input ${
                        showError("upiId") ? "mv-invalid" : ""
                      }`}
                    />
                  </Field>
                </div>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div
                role="alert"
                className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700"
              >
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#e1f2e8] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={onBack}
                disabled={isSaving}
                className="mv-back flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold"
              >
                <span>←</span>
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="mv-btn group flex w-full items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold sm:w-auto"
              >
                <span>{isSaving ? "Saving..." : "Save profile"}</span>
                {!isSaving && (
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    ✓
                  </span>
                )}
              </button>
            </div>
          </section>

          <p className="mt-5 text-center text-xs text-[#3d6b60]">
            Your details are kept private and used only for your partner
            profile and payouts.
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
        .mv-btn:disabled { cursor: not-allowed; opacity: 0.7; filter: none; }

        .mv-back {
          background: #e6f7ee;
          color: #114b42;
          border: 1px solid #a6dbc0;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.1s ease;
        }
        .mv-back:hover { background: #d4f0e1; }
        .mv-back:active { transform: scale(0.98); }
        .mv-back:focus-visible { outline: 3px solid #114b42; outline-offset: 3px; }
        .mv-back:disabled { cursor: not-allowed; opacity: 0.6; }

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
        .mv-input:disabled {
          cursor: not-allowed;
          background: #f0f9f4;
          color: #8fb3a7;
        }

        @media (prefers-reduced-motion: reduce) {
          .mv-root * { transition: none !important; }
        }
      `}</style>
    </div>
  );
}