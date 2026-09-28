import React, { useState, useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

// ============================================================
// MAIN HOME PAGE
// ============================================================

import Home from './components/Landing_Page/Home';

// ============================================================
// OTHER PAGES
// ============================================================

import Support from './components/Support';
import ContactSection from './components/ContactSection';
import LearnMoreSection from './components/LearnMoreSection';

// ============================================================
// NAVBAR & FOOTER
// ============================================================

import Navbar from './components/Landing_Page/Navbar';
import Footer from './components/Landing_Page/Footer';

// ============================================================
// AUTHENTICATION PAGES
// ============================================================

import Login from './components/Login';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import ProfilePage from './components/ProfilePage';

// ============================================================
// LEGAL PAGES
// ============================================================

import TermsAndConditions from './components/Landing_Page/TermsAndConditions';
import PrivacyPolicy from './components/Landing_Page/PrivacyPolicy';

// ============================================================
// WELLNESS PARTNER PAGES
// ============================================================

import WellnessPartnerLogin from './components/GetStarted_Pages/WellnessPartner_Login';
import WellnessPartnerSignup from './components/GetStarted_Pages/WellnessPartner_Signup';

// ============================================================
// SESSION KEY CONSTANTS
// ============================================================

const LOCAL_STORAGE_SESSION_KEY = 'manovedh_current_user';

const LOCAL_STORAGE_PARTNER_SESSION_KEY =
  'manovedh_current_partner';

// ============================================================
// COMMON PAGE LAYOUT
// ============================================================
// Used only for separate pages:
// Navbar → Page Content → Footer
// ============================================================

function PageLayout({ children }) {
  return (
    <div className="min-h-screen bg-white text-[#1b3328] font-sans flex flex-col">

      {/* NAVBAR */}
      <Navbar />

      {/* PAGE CONTENT */}
      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}

// ============================================================
// APP
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

        setCurrentUser(
          JSON.parse(activeSession)
        );

      } catch (err) {

        console.error(
          'Failed to parse session',
          err
        );

        localStorage.removeItem(
          LOCAL_STORAGE_SESSION_KEY
        );

      }

    }

    setLoading(false);

  }, []);

  // ==========================================================
  // LOGIN / SIGNUP SUCCESS
  // ==========================================================

  const handleAuthSuccess = (userData) => {

    setCurrentUser(userData);

    localStorage.setItem(
      LOCAL_STORAGE_SESSION_KEY,
      JSON.stringify(userData)
    );

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

    <Routes>

      {/* ======================================================
          HOME

          Home.jsx contains:
          Navbar
          HeroSection
          FeaturesSection
          Feature1
          GetHelp
          Activity
          Feedback
          Footer

          Navbar links for these sections scroll on this page.
          They do NOT need separate routes.
          ====================================================== */}

      <Route
        path="/"
        element={
          <Home

            onOpenCommunity={() => {}}

            onOpenWellnessLogin={() => {
              window.location.href = '/partner-login';
            }}

            onOpenWellnessSignup={() => {
              window.location.href = '/partner-signup';
            }}

          />
        }
      />

      {/* ======================================================
          ABOUT / LEARN MORE

          Separate page:
          Navbar
          LearnMoreSection
          Footer
          ====================================================== */}

      <Route
        path="/about"
        element={
          <PageLayout>
            <LearnMoreSection />
          </PageLayout>
        }
      />

      {/* ======================================================
          SUPPORT

          Separate page:
          Navbar
          Support
          Footer
          ====================================================== */}

      <Route
        path="/support"
        element={
          <PageLayout>
            <Support />
          </PageLayout>
        }
      />

      {/* ======================================================
          CONTACT

          Separate page:
          Navbar
          ContactSection
          Footer
          ====================================================== */}

      <Route
        path="/contact"
        element={
          <PageLayout>
            <ContactSection />
          </PageLayout>
        }
      />

      {/* ======================================================
          USER LOGIN
          ====================================================== */}

      <Route
        path="/login"
        element={
          currentUser ? (
            <Navigate
              to="/"
              replace
            />
          ) : (
            <Login
              onLoginSuccess={handleAuthSuccess}
            />
          )
        }
      />

      {/* ======================================================
          USER SIGNUP
          ====================================================== */}

      <Route
        path="/signup"
        element={
          currentUser ? (
            <Navigate
              to="/"
              replace
            />
          ) : (
            <SignUp
              onSignUpSuccess={handleAuthSuccess}
            />
          )
        }
      />

      {/* ======================================================
          FORGOT PASSWORD
          ====================================================== */}

      <Route
        path="/forgot-password"
        element={
          <ForgotPassword />
        }
      />

      {/* ======================================================
          PROFILE
          ====================================================== */}

      <Route
        path="/profile"
        element={
          currentUser ? (
            <PageLayout>

              <div className="px-4 max-w-4xl mx-auto">

                <ProfilePage
                  user={currentUser}
                />

              </div>

            </PageLayout>
          ) : (
            <Navigate
              to="/login"
              replace
            />
          )
        }
      />

      {/* ======================================================
          TERMS AND CONDITIONS
          ====================================================== */}

      <Route
        path="/terms-and-conditions"
        element={
          <TermsAndConditions />
        }
      />

      {/* ======================================================
          PRIVACY POLICY
          ====================================================== */}

      <Route
        path="/privacy-policy"
        element={
          <PrivacyPolicy />
        }
      />

      {/* ======================================================
          WELLNESS PARTNER LOGIN
          ====================================================== */}

      <Route
        path="/partner-login"
        element={
          <WellnessPartnerLogin

            onLoginSuccess={(partner) => {

              localStorage.setItem(
                LOCAL_STORAGE_PARTNER_SESSION_KEY,
                JSON.stringify(partner)
              );

              window.location.href = '/';

            }}

            onBackToHome={() => {
              window.location.href = '/';
            }}

            onSwitchToSignup={() => {
              window.location.href = '/partner-signup';
            }}

            onSwitchToUserLogin={() => {
              window.location.href = '/login';
            }}

          />
        }
      />

      {/* ======================================================
          WELLNESS PARTNER SIGNUP
          ====================================================== */}

      <Route
        path="/partner-signup"
        element={
          <WellnessPartnerSignup

            onSignupSuccess={() => {
              window.location.href = '/partner-login';
            }}

            onBackToHome={() => {
              window.location.href = '/';
            }}

            onSwitchToLogin={() => {
              window.location.href = '/partner-login';
            }}

            onSwitchToUserLogin={() => {
              window.location.href = '/login';
            }}

          />
        }
      />

      {/* ======================================================
          FALLBACK
          ====================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>

  );
}