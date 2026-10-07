
import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

// ============================================================
// LANGUAGE SYSTEM
// ============================================================

import { LanguageProvider } from "./LanguageContext";

// ============================================================
// MAIN HOME PAGE
// ============================================================

import Home from "./components/Landing_Page/Home";

// ============================================================
// OTHER PAGES
// ============================================================

import Support from "./components/Support";
import ContactSection from "./components/ContactSection";
import LearnMoreSection from "./components/LearnMoreSection";

// ============================================================
// NAVBAR & FOOTER
// ============================================================

import Navbar from "./components/Landing_Page/Navbar";
import Footer from "./components/Landing_Page/Footer";

// ============================================================
// USER AUTHENTICATION
// ============================================================

import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword";
import ProfilePage from "./components/ProfilePage";

// ============================================================
// LEGAL PAGES
// ============================================================

import TermsAndConditions from "./components/Landing_Page/TermsAndConditions";
import PrivacyPolicy from "./components/Landing_Page/PrivacyPolicy";

// ============================================================
// WELLNESS PARTNER AUTHENTICATION
// ============================================================

import WellnessPartnerLogin from "./components/GetStarted_Pages/WellnessPartner_Login";
import WellnessPartnerSignup from "./components/GetStarted_Pages/WellnessPartner_Signup";

// ============================================================
// COUNSELLOR ONBOARDING & DASHBOARD
// Actual filenames from your project folder
// ============================================================

import CounsellorProfileStep1 from "./components/Councellor_Dashboard/Councelor_ProfileStep_1.jsx";

import CounsellorProfileStep2 from "./components/Councellor_Dashboard/Councelor_ProfilesSep_2.jsx";

import CounsellorDashboard from "./components/Councellor_Dashboard/Councellor_Dashbord.jsx";

// ============================================================
// LOCAL STORAGE KEYS
// ============================================================

const LOCAL_STORAGE_SESSION_KEY = "manovedh_current_user";

const LOCAL_STORAGE_PARTNER_SESSION_KEY =
  "manovedh_current_partner";

const LOCAL_STORAGE_PARTNERS_KEY =
  "manovedh_wellness_partners";

const LOCAL_STORAGE_PROFILE_DRAFT_KEY =
  "manovedh_counsellor_profile_draft";

// ============================================================
// PARTNER HELPERS
// ============================================================

function getStoredPartner() {
  try {
    return JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_PARTNER_SESSION_KEY) || "null"
    );
  } catch (error) {
    console.error("Unable to read partner session:", error);
    return null;
  }
}

function getPartnerAccount(partner) {
  if (!partner?.email) return null;

  try {
    const partners = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_PARTNERS_KEY) || "[]"
    );

    return partners.find(
      (item) =>
        item.email?.toLowerCase() === partner.email.toLowerCase()
    );
  } catch (error) {
    console.error("Unable to read partner accounts:", error);
    return null;
  }
}

function isPartnerProfileComplete(partner) {
  if (!partner) return false;

  const account = getPartnerAccount(partner);

  return (
    partner.profileCompleted === true ||
    account?.profileCompleted === true
  );
}

function getProfileDraft() {
  try {
    return JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_PROFILE_DRAFT_KEY) || "{}"
    );
  } catch (error) {
    console.error("Unable to read profile draft:", error);
    return {};
  }
}

// ============================================================
// SAVE COMPLETED PARTNER PROFILE
// ============================================================

function savePartnerProfile(profileData) {
  const currentPartner = getStoredPartner();

  if (!currentPartner) return null;

  const updatedPartner = {
    ...currentPartner,
    ...profileData,
    profileCompleted: true,
  };

  // Update active session
  localStorage.setItem(
    LOCAL_STORAGE_PARTNER_SESSION_KEY,
    JSON.stringify(updatedPartner)
  );

  // Update registered partner account
  try {
    const partners = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_PARTNERS_KEY) || "[]"
    );

    const updatedPartners = partners.map((partner) => {
      if (
        partner.email?.toLowerCase() ===
        currentPartner.email?.toLowerCase()
      ) {
        return {
          ...partner,
          ...profileData,
          profileCompleted: true,
        };
      }

      return partner;
    });

    localStorage.setItem(
      LOCAL_STORAGE_PARTNERS_KEY,
      JSON.stringify(updatedPartners)
    );
  } catch (error) {
    console.error("Unable to update partner profile:", error);
  }

  localStorage.removeItem(LOCAL_STORAGE_PROFILE_DRAFT_KEY);

  return updatedPartner;
}

// ============================================================
// COMMON PAGE LAYOUT
// ============================================================

function PageLayout({ children }) {
  return (
    <div className="min-h-screen bg-white text-[#1b3328] font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20">
        {children}
      </main>

      <Footer />
    </div>
  );
}

// ============================================================
// PARTNER PROFILE STEP 1
// ============================================================

function PartnerProfileStep1() {
  const navigate = useNavigate();

  const handleNext = (step1Data) => {
    const existingDraft = getProfileDraft();

    const updatedDraft = {
      ...existingDraft,
      ...step1Data,
    };

    localStorage.setItem(
      LOCAL_STORAGE_PROFILE_DRAFT_KEY,
      JSON.stringify(updatedDraft)
    );

    navigate("/partner-profile/details");
  };

  return (
    <CounsellorProfileStep1
      onNext={handleNext}
    />
  );
}

// ============================================================
// PARTNER PROFILE STEP 2
// ============================================================

function PartnerProfileStep2() {
  const navigate = useNavigate();

  const draft = getProfileDraft();

  const handleBack = () => {
    navigate("/partner-profile");
  };

  const handleSave = (step2Data) => {
    const finalProfile = {
      ...draft,
      ...step2Data,
    };

    const updatedPartner = savePartnerProfile(finalProfile);

    if (updatedPartner) {
      navigate("/partner-dashboard", {
        replace: true,
      });
    } else {
      navigate("/partner-login", {
        replace: true,
      });
    }
  };

  return (
    <CounsellorProfileStep2
      initialData={draft}
      onBack={handleBack}
      onSave={handleSave}
    />
  );
}

// ============================================================
// PROTECTED PARTNER DASHBOARD
// ============================================================

function PartnerDashboardRoute() {
  const navigate = useNavigate();

  const partner = getStoredPartner();

  if (!partner) {
    return (
      <Navigate
        to="/partner-login"
        replace
      />
    );
  }

  if (!isPartnerProfileComplete(partner)) {
    return (
      <Navigate
        to="/partner-profile"
        replace
      />
    );
  }

  const handleLogout = () => {
    localStorage.removeItem(
      LOCAL_STORAGE_PARTNER_SESSION_KEY
    );

    localStorage.removeItem(
      LOCAL_STORAGE_PROFILE_DRAFT_KEY
    );

    navigate("/partner-login", {
      replace: true,
    });
  };

  return (
    <CounsellorDashboard
      onLogout={handleLogout}
    />
  );
}

// ============================================================
// MAIN APP
// ============================================================

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================================
  // RESTORE USER SESSION
  // ==========================================================

  useEffect(() => {
    const activeSession = localStorage.getItem(
      LOCAL_STORAGE_SESSION_KEY
    );

    if (activeSession) {
      try {
        setCurrentUser(JSON.parse(activeSession));
      } catch (error) {
        console.error("Failed to restore user session:", error);

        localStorage.removeItem(
          LOCAL_STORAGE_SESSION_KEY
        );
      }
    }

    setLoading(false);
  }, []);

  // ==========================================================
  // USER LOGIN / SIGNUP SUCCESS
  // ==========================================================

  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData);

    localStorage.setItem(
      LOCAL_STORAGE_SESSION_KEY,
      JSON.stringify(userData)
    );
  };

  // ==========================================================
  // PARTNER LOGIN SUCCESS
  // ==========================================================

  const handlePartnerLoginSuccess = (partner) => {
    localStorage.setItem(
      LOCAL_STORAGE_PARTNER_SESSION_KEY,
      JSON.stringify(partner)
    );

    if (isPartnerProfileComplete(partner)) {
      window.location.href = "/partner-dashboard";
    } else {
      window.location.href = "/partner-profile";
    }
  };

  // ==========================================================
  // LOADING SCREEN
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#12241C] flex items-center justify-center text-white font-serif">
        <p className="text-lg animate-pulse">
          Loading Manovedh...
        </p>
      </div>
    );
  }

  // ==========================================================
  // APPLICATION ROUTES
  // ==========================================================

  return (
    <LanguageProvider>
      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={
            <Home
              onOpenCommunity={() => {}}
              onOpenWellnessLogin={() => {
                window.location.href = "/partner-login";
              }}
              onOpenWellnessSignup={() => {
                window.location.href = "/partner-signup";
              }}
            />
          }
        />

        {/* ABOUT */}

        <Route
          path="/about"
          element={
            <PageLayout>
              <LearnMoreSection />
            </PageLayout>
          }
        />

        {/* SUPPORT */}

        <Route
          path="/support"
          element={
            <PageLayout>
              <Support />
            </PageLayout>
          }
        />

        {/* CONTACT */}

        <Route
          path="/contact"
          element={
            <PageLayout>
              <ContactSection />
            </PageLayout>
          }
        />

        {/* USER LOGIN */}

        <Route
          path="/login"
          element={
            currentUser ? (
              <Navigate to="/" replace />
            ) : (
              <Login
                onLoginSuccess={handleAuthSuccess}
              />
            )
          }
        />

        {/* USER SIGNUP */}

        <Route
          path="/signup"
          element={
            currentUser ? (
              <Navigate to="/" replace />
            ) : (
              <SignUp
                onSignUpSuccess={handleAuthSuccess}
              />
            )
          }
        />

        {/* FORGOT PASSWORD */}

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* USER PROFILE */}

        <Route
          path="/profile"
          element={
            currentUser ? (
              <PageLayout>
                <div className="mx-auto max-w-4xl px-4">
                  <ProfilePage user={currentUser} />
                </div>
              </PageLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* TERMS AND CONDITIONS */}

        <Route
          path="/terms-and-conditions"
          element={<TermsAndConditions />}
        />

        {/* PRIVACY POLICY */}

        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy />}
        />

        {/* WELLNESS PARTNER LOGIN */}

        <Route
          path="/partner-login"
          element={
            <WellnessPartnerLogin
              onLoginSuccess={handlePartnerLoginSuccess}
              onBackToHome={() => {
                window.location.href = "/";
              }}
              onSwitchToSignup={() => {
                window.location.href = "/partner-signup";
              }}
              onSwitchToUserLogin={() => {
                window.location.href = "/login";
              }}
            />
          }
        />

        {/* WELLNESS PARTNER SIGNUP */}

        <Route
          path="/partner-signup"
          element={
            <WellnessPartnerSignup
              onSignupSuccess={() => {
                window.location.href = "/partner-login";
              }}
              onBackToHome={() => {
                window.location.href = "/";
              }}
              onSwitchToLogin={() => {
                window.location.href = "/partner-login";
              }}
              onSwitchToUserLogin={() => {
                window.location.href = "/login";
              }}
            />
          }
        />

        {/* COUNSELLOR PROFILE STEP 1 */}

        <Route
          path="/partner-profile"
          element={
            getStoredPartner() ? (
              isPartnerProfileComplete(getStoredPartner()) ? (
                <Navigate
                  to="/partner-dashboard"
                  replace
                />
              ) : (
                <PartnerProfileStep1 />
              )
            ) : (
              <Navigate
                to="/partner-login"
                replace
              />
            )
          }
        />

        {/* COUNSELLOR PROFILE STEP 2 */}

        <Route
          path="/partner-profile/details"
          element={
            getStoredPartner() ? (
              isPartnerProfileComplete(getStoredPartner()) ? (
                <Navigate
                  to="/partner-dashboard"
                  replace
                />
              ) : (
                <PartnerProfileStep2 />
              )
            ) : (
              <Navigate
                to="/partner-login"
                replace
              />
            )
          }
        />

        {/* COUNSELLOR DASHBOARD */}

        <Route
          path="/partner-dashboard"
          element={
            <PartnerDashboardRoute />
          }
        />

        {/* FALLBACK */}

        <Route
          path="*"
          element={
            <Navigate to="/" replace />
          }
        />

      </Routes>
    </LanguageProvider>
  );
}
