import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ComeAsYouAreSection from './components/ComeAsYouAreSection';
import FeaturesSection from './components/FeaturesSection';

function App() {
  return (
    <div className="min-h-screen bg-white text-[#1b3328] font-sans antialiased selection:bg-emerald-200 selection:text-emerald-900">
      {/* Navigation */}
      <Navbar />

      {/* Main Page Content */}
      <main>
        <HeroSection />
        <ComeAsYouAreSection />
        <FeaturesSection />
      </main>

      {/* Minimal Footer */}
      <footer className="py-8 text-center text-xs text-[#8a8a7a] bg-[#e9f1ea] border-t border-[#dbe6dc]">
        © {new Date().getFullYear()} Manovedh. All rights reserved.
      </footer>
    </div>
  );
}

export default App;