import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ComeAsYouAreSection from './components/ComeAsYouAreSection';
import FeaturesSection from './components/FeaturesSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white text-[#1b3328] font-sans antialiased selection:bg-emerald-200 selection:text-emerald-900 flex flex-col justify-between">
      {/* Navigation */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-grow">
        <HeroSection />
        <ComeAsYouAreSection />
        <FeaturesSection />
      </main>

      {/* Separate Footer Component */}
      <Footer />
    </div>
  );
}

export default App;