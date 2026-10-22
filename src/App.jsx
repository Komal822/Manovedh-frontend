import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
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
// ============================================================

import CounsellorProfileStep1 from "./components/Councellor_Dashboard/Councelor_ProfileStep_1.jsx";
import CounsellorProfileStep2 from "./components/Councellor_Dashboard/Councelor_ProfilesSep_2.jsx";
import CounsellorDashboard from "./components/Councellor_Dashboard/Councellor_Dashbord.jsx";

// Patients + Sessions pages ani Sidebar
import Patients from "./components/Councellor_Dashboard/Patients.jsx";
import Sessions from "./components/Councellor_Dashboard/Sessions.jsx";
import Chats from "./components/Councellor_Dashboard/Chats.jsx";
import Notifications from "./components/Councellor_Dashboard/Notifications.jsx";
 
import Availability from "./components/Councellor_Dashboard/Availability.jsx";
import ProfileSettings from "./components/Councellor_Dashboard/ProfileSettings.jsx"; // NAVIN
import Sidebar, {
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_COLLAPSED,
} from "./components/Councellor_Dashboard/Sidebar.jsx";

// ============================================================
// LOCAL STORAGE KEYS
// ============================================================

const LOCAL_STORAGE_SESSION_KEY = "manovedh_current_user";
const LOCAL_STORAGE_PARTNER_SESSION_KEY = "manovedh_current_partner";
const LOCAL_STORAGE_PARTNERS_KEY = "manovedh_wellness_partners";
const LOCAL_STORAGE_PROFILE_DRAFT_KEY = "manovedh_counsellor_profile_draft";

// ============================================================
// PARTNER DASHBOARD ROUTES (Sidebar page name <-> URL)
// ============================================================

const DASHBOARD_BASE = "/partner-dashboard";

const PAGE_TO_PATH = {
  Overview: "overview",
  Patients: "patients",
  Sessions: "sessions",
  Chats: "chats",
  Notifications: "notifications",
  "Profile Settings": "profile-settings",
  Availability: "availability",

};

const PATH_TO_PAGE = Object.fromEntries(
  Object.entries(PAGE_TO_PATH).map(([page, path]) => [path, page])
);

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
      (item) => item.email?.toLowerCase() === partner.email.toLowerCase()
    );
  } catch (error) {
    console.error("Unable to read partner accounts:", error);
    return null;
  }
}

function isPartnerProfileComplete(partner) {
  if (!partner) return false;

  const account = getPartnerAccount(partner);

  return partner.profileCompleted === true || account?.profileCompleted === true;
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
      if (partner.email?.toLowerCase() === currentPartner.email?.toLowerCase()) {
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

      <main className="flex-grow pt-20">{children}</main>

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

  return <CounsellorProfileStep1 onNext={handleNext} />;
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
      navigate(DASHBOARD_BASE, { replace: true });
    } else {
      navigate("/partner-login", { replace: true });
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
// PARTNER DASHBOARD SHELL
// Sidebar navigation + collapse state ithe aahe, mhanje page
// badalla tari sidebar chi state tashich rahte.
// ============================================================

function ComingSoonPage({ title, shared, activePage }) {
  const sidebarWidth = shared.sidebarCollapsed
    ? SIDEBAR_WIDTH_COLLAPSED
    : SIDEBAR_WIDTH;

  return (
    <div className="min-h-screen bg-[#F2F6F3] text-gray-800">
      <Sidebar
        collapsed={shared.sidebarCollapsed}
        onToggle={shared.onToggleSidebar}
        activePage={activePage}
        onNavigate={shared.onNavigate}
        onLogout={shared.onLogout}
      />

      <main
        className="min-h-screen p-8 transition-[margin] duration-300 ease-in-out"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-500">This page is coming soon.</p>
      </main>
    </div>
  );
}

function PartnerDashboardShell({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // URL varun active page kadhto: /partner-dashboard/patients -> "Patients"
  const segment = location.pathname
    .replace(DASHBOARD_BASE, "")
    .split("/")
    .filter(Boolean)[0];
  const activePage = PATH_TO_PAGE[segment] || "Overview";

  const shared = {
    onLogout,
    sidebarCollapsed,
    onToggleSidebar: () => setSidebarCollapsed((prev) => !prev),
    onNavigate: (page) => {
      const path = PAGE_TO_PATH[page];
      if (path) navigate(`${DASHBOARD_BASE}/${path}`);
    },
  };

  return (
    <Routes>
      <Route index element={<Navigate to="overview" replace />} />

      <Route path="overview" element={<CounsellorDashboard {...shared} />} />

      <Route path="patients" element={<Patients {...shared} />} />

      {/* NAVIN: Sessions page */}
      <Route path="sessions" element={<Sessions {...shared} />} />

      {/* NAVIN: Chats page */}
      <Route path="chats" element={<Chats {...shared} />} />

      {/* NAVIN: Notifications page */}
      <Route path="notifications" element={<Notifications {...shared} />} />


      {/* NAVIN: Availability page */}
      <Route path="availability" element={<Availability {...shared} />} />

      {/* NAVIN: Profile Settings page */}
      <Route path="profile-settings" element={<ProfileSettings {...shared} />} />

      {/* Baki pages banvlyavar ithe tyanche route add kar */}
      <Route
        path="*"
        element={
          <ComingSoonPage
            title={activePage}
            shared={shared}
            activePage={activePage}
          />
        }
      />
    </Routes>
  );
}

// ============================================================
// PROTECTED PARTNER DASHBOARD
// ============================================================

function PartnerDashboardRoute() {
  const navigate = useNavigate();

  const partner = getStoredPartner();

  if (!partner) {
    return <Navigate to="/partner-login" replace />;
  }

  if (!isPartnerProfileComplete(partner)) {
    return <Navigate to="/partner-profile" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_PARTNER_SESSION_KEY);
    localStorage.removeItem(LOCAL_STORAGE_PROFILE_DRAFT_KEY);

    navigate("/partner-login", { replace: true });
  };

  return <PartnerDashboardShell onLogout={handleLogout} />;
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
    const activeSession = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);

    if (activeSession) {
      try {
        setCurrentUser(JSON.parse(activeSession));
      } catch (error) {
        console.error("Failed to restore user session:", error);

        localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
      }
    }

    setLoading(false);
  }, []);

  // ==========================================================
  // USER LOGIN / SIGNUP SUCCESS
  // ==========================================================

  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData);

    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(userData));
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
      window.location.href = DASHBOARD_BASE;
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
        <p className="text-lg animate-pulse">Loading Manovedh...</p>
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
              <Login onLoginSuccess={handleAuthSuccess} />
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
              <SignUp onSignUpSuccess={handleAuthSuccess} />
            )
          }
        />

        {/* FORGOT PASSWORD */}

        <Route path="/forgot-password" element={<ForgotPassword />} />

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

        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

        {/* PRIVACY POLICY */}

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

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
                <Navigate to={DASHBOARD_BASE} replace />
              ) : (
                <PartnerProfileStep1 />
              )
            ) : (
              <Navigate to="/partner-login" replace />
            )
          }
        />

        {/* COUNSELLOR PROFILE STEP 2 */}

        <Route
          path="/partner-profile/details"
          element={
            getStoredPartner() ? (
              isPartnerProfileComplete(getStoredPartner()) ? (
                <Navigate to={DASHBOARD_BASE} replace />
              ) : (
                <PartnerProfileStep2 />
              )
            ) : (
              <Navigate to="/partner-login" replace />
            )
          }
        />

        {/* COUNSELLOR DASHBOARD (nested: overview, patients, sessions, ...) */}
        {/* "/*" garjechi aahe, tyashivay /partner-dashboard/patients milnar nahi */}

        <Route
          path={`${DASHBOARD_BASE}/*`}
          element={<PartnerDashboardRoute />}
        />

        {/* FALLBACK */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </LanguageProvider>
  );
}