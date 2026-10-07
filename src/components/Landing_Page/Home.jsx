import React from 'react';

import Navbar from './Navbar';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import Feature1 from './Feature1';
import GetHelp from './GetHelp';
import Activity from './Activity';

import Feedback from '../Feedback';

import Footer from './Footer';


function Home({
  onOpenCommunity,
  onOpenWellnessLogin,
  onOpenWellnessSignup
}) {
  return (
    <div className="min-h-screen bg-white text-[#1b3328] font-sans flex flex-col">

      {/* ==================================================
          NAVBAR
          ================================================== */}

      <Navbar />


      {/* ==================================================
          HOME CONTENT
          ================================================== */}

      <main className="flex-grow">

        {/* HERO */}
        <section id="home">
          <HeroSection
            onOpenWellnessLogin={onOpenWellnessLogin}
            onOpenWellnessSignup={onOpenWellnessSignup}
          />
        </section>


        {/* FEATURES */}
        <section id="features">
          <FeaturesSection />
        </section>


        {/* FEATURE 1 */}
        <section id="feature-1">
          <Feature1 />
        </section>


        {/* GET HELP */}
        <section id="get-help">
          <GetHelp />
        </section>


        {/* ACTIVITY */}
        <section id="activity">
          <Activity
            onOpenCommunity={onOpenCommunity}
          />
        </section>


        {/* FEEDBACK */}
        <section id="feedback">
          <Feedback />
        </section>

      </main>


      {/* ==================================================
          FOOTER
          ================================================== */}

      <Footer />

    </div>
  );
}

export default Home;