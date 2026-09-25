import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LearnMoreSection from './components/LearnMoreSection';
import Feedback from './components/Feedback';
import Support from './components/Support';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

import Login from './components/Login';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import ProfilePage from './components/ProfilePage';

// Session Key Constant
const LOCAL_STORAGE_SESSION_KEY = 'manovedh_current_user';

// Inner Layout Component to conditionally hide footer on profile page
function MainLayout({ currentUser }) {
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';

  return (
    <div className="min-h-screen bg-white text-[#1b3328] font-sans flex flex-col justify-between">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<><HeroSection user={currentUser} /><Feedback /></>} />
          <Route path="/about" element={<div className="pt-24"><LearnMoreSection /></div>} />
          <Route path="/feedback" element={<div className="pt-28"><Feedback /></div>} />
          <Route path="/support" element={<div className="pt-28"><Support /></div>} />
          <Route path="/contact" element={<div className="pt-28"><ContactSection /></div>} />
          <Route 
            path="/profile" 
            element={
              currentUser ? (
                <div className="pt-28 px-4 max-w-4xl mx-auto"><ProfilePage user={currentUser} /></div>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
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
        console.error("Failed to parse session", err);
      }
    }
    setLoading(false);
  }, []);

  // Login/SignUp Handler
  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(userData));
  };

  // Logout Handler
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
  };

  // Loading state jar session check hot asel
  if (loading) {
    return (
      <div className="min-h-screen bg-[#12241C] flex items-center justify-center text-white font-serif">
        <p className="text-lg animate-pulse">Loading Manovedh...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* AUTH PAGES (Standalone without global layout overlapping) */}
        <Route 
          path="/login" 
          element={currentUser ? <Navigate to="/" replace /> : <Login onLoginSuccess={handleAuthSuccess} />} 
        />
        <Route 
          path="/signup" 
          element={currentUser ? <Navigate to="/" replace /> : <SignUp onSignUpSuccess={handleAuthSuccess} />} 
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* MAIN WEBSITE PAGES (With Global Navbar & Footer layout, omitting footer on profile) */}
        <Route 
          path="/*" 
          element={<MainLayout currentUser={currentUser} />} 
        />
      </Routes>
    </Router>
  );
}