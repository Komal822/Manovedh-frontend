import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Home from './components/Landing_Page/Home';
import Community from './components/Landing_Page/Community';

import WellnessPartnerLogin from './components/GetStarted_Pages/WellnessPartner_Login';
import CounsellorSignup from './components/GetStarted_Pages/WellnessPartner_Signup';

import Login from './components/Login';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import ProfilePage from './components/ProfilePage';

import Feedback from './components/Feedback';
import Support from './components/Support';
import ContactSection from './components/ContactSection';
import LearnMoreSection from './components/LearnMoreSection';

const LOCAL_STORAGE_SESSION_KEY = 'manovedh_current_user';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem('manovedh_view') || 'home';
  });

  // Restore logged-in user session
  useEffect(() => {
    const activeSession = localStorage.getItem(
      LOCAL_STORAGE_SESSION_KEY
    );

    if (activeSession) {
      try {
        setCurrentUser(JSON.parse(activeSession));
      } catch (err) {
        console.error('Failed to parse session', err);
      }
    }

    setLoading(false);
  }, []);

  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem(
      LOCAL_STORAGE_SESSION_KEY,
      JSON.stringify(userData)
    );
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    localStorage.setItem('manovedh_view', view);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#12241C] flex items-center justify-center text-white font-serif">
        <p className="text-lg animate-pulse">
          Loading Manovedh...
        </p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>

        {/* Login */}
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

        {/* Signup */}
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

        {/* Forgot Password */}
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            currentUser ? (
              <ProfilePage
                user={currentUser}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Feedback */}
        <Route
          path="/feedback"
          element={<Feedback />}
        />

        {/* Support */}
        <Route
          path="/support"
          element={<Support />}
        />

        {/* About */}
        <Route
          path="/about"
          element={
            <div className="pt-24">
              <LearnMoreSection />
            </div>
          }
        />

        {/* Main Home Page */}
        <Route
          path="/"
          element={
            <>
              {currentView === 'home' && (
                <Home
                  onOpenCommunity={() =>
                    handleViewChange('community')
                  }
                  onOpenWellnessLogin={() =>
                    handleViewChange('wellness-login')
                  }
                  onOpenWellnessSignup={() =>
                    handleViewChange('wellness-signup')
                  }
                />
              )}

              {currentView === 'community' && (
                <Community
                  onBack={() =>
                    handleViewChange('home')
                  }
                />
              )}

              {currentView === 'wellness-login' && (
                <WellnessPartnerLogin
                  onSwitchToSignup={() =>
                    handleViewChange('wellness-signup')
                  }
                  onSwitchToUserLogin={() =>
                    handleViewChange('home')
                  }
                  onBackToHome={() =>
                    handleViewChange('home')
                  }
                />
              )}

              {currentView === 'wellness-signup' && (
                <CounsellorSignup
                  onSwitchToLogin={() =>
                    handleViewChange('wellness-login')
                  }
                  onBackToHome={() =>
                    handleViewChange('home')
                  }
                />
              )}
            </>
          }
        />

        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </Router>
  );
}

export default App;