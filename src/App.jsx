import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Feature1 from './components/Feature1'; // Fixed: Removed hyphen
import FeaturesSection from './components/FeaturesSection';

function App() {
  return (
    <div className="min-h-screen bg-white text-[#1b3328] font-sans antialiased selection:bg-emerald-200 selection:text-emerald-900 flex flex-col justify-between">
      {/* Navigation */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <Feature1 /> {/* Fixed: Updated tag name */}
      </main>
    </div>
  );
}

export default App;