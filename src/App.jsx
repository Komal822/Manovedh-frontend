import React, { useState, useEffect } from 'react';
import { 
  Routes, 
  Route, 
  Navigate, 
  useLocation 
} from 'react-router-dom';

import Navbar from './components/Landing_Page/Navbar';
import HeroSection from './components/HeroSection';
import LearnMoreSection from './components/LearnMoreSection';
import Feedback from './components/Feedback';
import Support from './components/Support';
import ContactSection from './components/ContactSection';
import Footer from './components/Landing_Page/Footer';

import Login from './components/Login';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import ProfilePage from './components/ProfilePage';

// CORRECTED PATHS: Wellness Partner Components are inside GetStarted_Pages folder
import WellnessPartnerLogin from './components/GetStarted_Pages/WellnessPartner_Login';
import WellnessPartnerSignup from './components/GetStarted_Pages/WellnessPartner_Signup';

// Session Key Constants
const LOCAL_STORAGE_SESSION_KEY = 'manovedh_current_user';
const LOCAL_STORAGE_PARTNER_SESSION_KEY = 'manovedh_current_partner';

// Inner Layout Component (Footer is hidden on Profile page)
function MainLayout({ currentUser }) {
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';

  return (
    <div className="min-h-screen bg-white text-[#1b3328] font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          {/* HOME */}
          <Route
            path="/"
            element={
              <>
                <HeroSection user={currentUser} />
                <Feedback />
              </>
            }
          />

          {/* ABOUT */}
          <Route
            path="/about"
            element={
              <div className="pt-24">
                <LearnMoreSection />
              </div>
            }
          />

          {/* FEEDBACK */}
          <Route
            path="/feedback"
            element={
              <div className="pt-28">
                <Feedback />
              </div>
            }
          />

          {/* SUPPORT */}
          <Route
            path="/support"
            element={
              <div className="pt-28">
                <Support />
              </div>
            }
          />

          {/* CONTACT */}
          <Route
            path="/contact"
            element={
              <div className="pt-28">
                <ContactSection />
              </div>
            }
          />

          {/* PROFILE */}
          <Route
            path="/profile"
            element={
              currentUser ? (
                <div className="pt-28 px-4 max-w-4xl mx-auto">
                  <ProfilePage user={currentUser} />
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* FALLBACK */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </main>

      {/* Hide Footer on Profile page */}
      {!isProfilePage && <Footer />}
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Session restore on reload
  useEffect(() => {
    const activeSession = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);

    if (activeSession) {
      try {
        setCurrentUser(JSON.parse(activeSession));
      } catch (err) {
        console.error('Failed to parse session', err);
        localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
      }
    }

    setLoading(false);
  }, []);

  // Login / Signup Handler
  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(userData));
  };

  // Loading state while restoring session
  if (loading) {
    return (
      <div className="min-h-screen bg-[#12241C] flex items-center justify-center text-white font-serif">
        <p className="text-lg animate-pulse">Loading Manovedh...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* AUTH PAGES (Regular Users) */}
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

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      {/* WELLNESS PARTNER AUTH ROUTES */}
      <Route
        path="/partner-login"
        element={
          <WellnessPartnerLogin 
            onLoginSuccess={(partner) => {
              localStorage.setItem(LOCAL_STORAGE_PARTNER_SESSION_KEY, JSON.stringify(partner));
              window.location.href = '/'; 
            }}
            onBackToHome={() => window.location.href = '/'}
            onSwitchToSignup={() => window.location.href = '/partner-signup'}
            onSwitchToUserLogin={() => window.location.href = '/login'}
          />
        }
      />

      <Route
        path="/partner-signup"
        element={
          <WellnessPartnerSignup 
            onSignupSuccess={() => {
              window.location.href = '/partner-login';
            }}
            onBackToHome={() => window.location.href = '/'}
            onSwitchToLogin={() => window.location.href = '/partner-login'}
            onSwitchToUserLogin={() => window.location.href = '/login'}
          />
        }
      />

      {/* MAIN WEBSITE & OTHER PAGES */}
      <Route
        path="/*"
        element={<MainLayout currentUser={currentUser} />}
      />
    </Routes>
  );
}