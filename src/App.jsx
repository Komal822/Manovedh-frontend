import React, { useState } from 'react';
import Home from './components/Landing_Page/Home';
import Community from './components/Landing_Page/Community';
import WellnessPartnerLogin from './components/GetStarted_Pages/WellnessPartner_Login';
import CounsellorSignup from './components/GetStarted_Pages/WellnessPartner_Signup';

function App() {
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem('manovedh_view') || 'home';
  });

  const handleViewChange = (view) => {
    setCurrentView(view);
    localStorage.setItem('manovedh_view', view);
  };

  return (
    <div className="min-h-screen bg-white text-[#1b3328] font-sans antialiased selection:bg-emerald-200 selection:text-emerald-900 flex flex-col justify-between">
      {currentView === 'home' && (
        <Home 
          onOpenCommunity={() => handleViewChange('community')} 
          onOpenWellnessLogin={() => handleViewChange('wellness-login')}
          onOpenWellnessSignup={() => handleViewChange('wellness-signup')}
        />
      )}

      {currentView === 'community' && (
        <Community onBack={() => handleViewChange('home')} />
      )}

      {currentView === 'wellness-login' && (
        <WellnessPartnerLogin 
          onSwitchToSignup={() => handleViewChange('wellness-signup')}
          onSwitchToUserLogin={() => handleViewChange('home')}
          onBackToHome={() => handleViewChange('home')}
        />
      )}

      {currentView === 'wellness-signup' && (
        <CounsellorSignup 
          onSwitchToLogin={() => handleViewChange('wellness-login')}
          onBackToHome={() => handleViewChange('home')}
        />
      )}
    </div>
  );
}

export default App;