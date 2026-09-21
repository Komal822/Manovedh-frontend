import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LearnMoreSection from './components/LearnMoreSection'; // <-- LearnMoreSection import kar diya hai
import Feedback from './components/Feedback';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-[#1b3328] font-sans antialiased selection:bg-emerald-200 selection:text-emerald-900 flex flex-col justify-between">
        
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Routing Container */}
        <main className="flex-grow">
          <Routes>
            {/* Home Page: Hero Section + Feedback Section */}
            <Route 
              path="/" 
              element={
                <>
                  <HeroSection />
                  <Feedback />
                </>
              } 
            />

            {/* Separate Learn More / About Page */}
            <Route 
              path="/about" 
              element={
                <div className="pt-20 sm:pt-24">
                  <LearnMoreSection />
                </div>
              } 
            />

            {/* Separate Feedback Page */}
            <Route 
              path="/feedback" 
              element={
                <div className="pt-28 sm:pt-36">
                  <Feedback />
                </div>
              } 
            />

            {/* Separate Contact Page */}
            <Route 
              path="/contact" 
              element={
                <div className="pt-28 sm:pt-36">
                  <ContactSection />
                </div>
              } 
            />
          </Routes>
        </main>

        {/* Footer Component */}
        <Footer />

      </div>
    </Router>
  );
}

export default App;