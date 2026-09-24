import React from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import Feature1 from './Feature1';
import GetHelp from './GetHelp';
import Activity from './Activity';
import Contact from './Contact';
import Footer from './Footer';

function Home({ onOpenCommunity, onOpenWellnessLogin, onOpenWellnessSignup }) {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <HeroSection 
          onOpenWellnessLogin={onOpenWellnessLogin}
          onOpenWellnessSignup={onOpenWellnessSignup}
        />
        <FeaturesSection />
        <Feature1 />
        <GetHelp />
        
        {/* Activity component la prop pass kela */}
        <Activity onOpenCommunity={onOpenCommunity} />
        
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default Home;