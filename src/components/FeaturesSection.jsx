import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, TrendingUp } from 'lucide-react';
// Import all three images from your assets folder
import featureImg1 from '../assets/feature-img1.png'; 
import featureImg2 from '../assets/feature-img2.png'; 
import featureImg3 from '../assets/feature-img3.png'; 

export default function FeaturesSection() {
  const [scrollY, setScrollY] = useState(0);

  // Track window scroll for a very smooth, gradual transition
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ultra-smooth, slow unfolding effect
  const unfoldProgress = Math.min(Math.max(scrollY / 750, 0), 1);

  return (
    <>
      {/* Google Fonts Import for Playfair Display (Main Title Only) */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');
          .font-playfair {
            font-family: 'Playfair Display', serif;
          }
        `}
      </style>

      {/* Larger section height so you have plenty of smooth scroll range */}
      <section className="bg-[#f4f9f4] font-sans antialiased text-gray-800 p-6 md:p-12 min-h-[200vh] relative">
        <div className="max-w-7xl mx-auto sticky top-16">
          
          {/* Header Section with Smooth Scroll & Scale Animation */}
          <div 
            className="flex flex-col items-center text-center mb-10 transition-all duration-700 ease-out"
            style={{
              transform: `translateY(${(1 - unfoldProgress) * 25}px) scale(${0.95 + unfoldProgress * 0.05})`,
              opacity: 0.4 + (unfoldProgress * 0.6)
            }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e2ebd9] text-[#2c4a3e] text-xs font-semibold tracking-wider uppercase mb-4 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#416d59] animate-pulse"></span> FEATURES
            </span>
            
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight max-w-3xl font-playfair">
              Simple tools for a more balanced <br />
              <span className="text-[#2C5843]">everyday life</span>
            </h2>
            
            <p className="text-gray-600 mt-4 max-w-lg text-sm md:text-base">
              Small steps, meaningful change. Scroll down smoothly to watch the cards unfold.
            </p>
          </div>

          {/* Cards Wrapper: Stacked in the center initially, unfolds gradually on scroll */}
          <div className="relative w-full max-w-6xl mx-auto h-[480px] md:h-[420px] flex items-center justify-center">
            
            {/* CARD 1: Know Yourself Better (Unfolds Left) */}
            <div 
              className="absolute w-full md:w-[35%] bg-gradient-to-b from-white to-[#f9fcf9] rounded-2xl p-6 md:p-7 shadow-lg border border-[#e4ede5] flex flex-col justify-between transition-all duration-500 ease-out group overflow-hidden"
              style={{
                transform: `translateX(${unfoldProgress * -110}%) scale(${0.90 + unfoldProgress * 0.10})`,
                zIndex: unfoldProgress < 0.5 ? 10 : 1,
                opacity: 0.15 + (unfoldProgress * 0.85),
              }}
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-[#eaf2eb] rounded-full blur-xl -z-10"></div>
              <div>
                {/* Image Area with featureImg1 */}
                <div className="w-full h-40 rounded-xl overflow-hidden bg-[#e2ebd9]/60 border border-[#b8ccb0] mb-4 relative group-hover:shadow-md transition-all">
                  <img 
                    src={featureImg1} 
                    alt="Know Yourself Better" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 hidden flex-col items-center justify-center text-[#3c6453] bg-[#e2ebd9]/60 border-2 border-dashed border-[#b8ccb0]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-semibold">feature-img1 missing</span>
                  </div>
                </div>

                {/* Card Heading with simple font-sans */}
                <h3 className="text-lg font-bold font-sans text-gray-900 mb-2">Know Yourself Better</h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  Learn more about your daily habits and discover what helps you stay balanced.
                </p>
              </div>
              
              <div className="mt-5 pt-3 border-t border-[#edf4ed] flex items-center justify-between text-xs text-[#3c6453] font-medium">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#416d59]" /> Self-Discovery
                </span>
                <span className="text-[11px] bg-[#e2ebd9] px-2.5 py-0.5 rounded-md font-bold">✨ View</span>
              </div>
            </div>

            {/* CARD 2: Personalized Recommendations (Center Base Card) */}
            <div 
              className="absolute w-full md:w-[35%] bg-gradient-to-b from-white to-[#fbf8f2] rounded-2xl p-6 md:p-7 shadow-xl border border-[#f2eae0] flex flex-col justify-between transition-all duration-500 ease-out group overflow-hidden z-20"
              style={{
                transform: `scale(${0.95 + unfoldProgress * 0.05})`,
              }}
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-[#faebd7] rounded-full blur-xl -z-10"></div>
              <div>
                {/* Image Area with featureImg2 - updated bg and border to match card 1 & 3 */}
                <div className="w-full h-40 rounded-xl overflow-hidden bg-[#e2ebd9]/60 border border-[#b8ccb0] mb-4 relative group-hover:shadow-md transition-all">
                  <img 
                    src={featureImg2} 
                    alt="Personalized Recommendations" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 hidden flex-col items-center justify-center text-[#3c6453] bg-[#e2ebd9]/60 border-2 border-dashed border-[#b8ccb0]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-semibold">feature-img2 missing</span>
                  </div>
                </div>

                {/* Card Heading with simple font-sans */}
                <h3 className="text-lg font-bold font-sans text-gray-900 mb-2">Personalized Recommendations</h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  Get activities and suggestions tailored to your preferences and daily routine.
                </p>
              </div>
              
              <div className="mt-5 pt-3 border-t border-[#f9f3ec]">
                <div className="bg-[#fcf8f2] rounded-xl p-3 border border-[#f0e4d0] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#b87c2b] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#b87c2b]" /> Smart Match
                  </span>
                  <span className="text-xs text-gray-500 font-medium">100% Custom</span>
                </div>
              </div>
            </div>

            {/* CARD 3: See Your Progress (Unfolds Right) */}
            <div 
              className="absolute w-full md:w-[35%] bg-gradient-to-b from-white to-[#f4f9f7] rounded-2xl p-6 md:p-7 shadow-lg border border-[#dcebe3] flex flex-col justify-between transition-all duration-500 ease-out group overflow-hidden"
              style={{
                transform: `translateX(${unfoldProgress * 110}%) scale(${0.90 + unfoldProgress * 0.10})`,
                zIndex: unfoldProgress < 0.5 ? 10 : 1,
                opacity: 0.15 + (unfoldProgress * 0.85),
              }}
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-[#e2f0ea] rounded-full blur-xl -z-10"></div>
              <div>
                {/* Image Area with featureImg3 */}
                <div className="w-full h-40 rounded-xl overflow-hidden bg-[#d5eade]/50 border border-[#abcbb9] mb-4 relative group-hover:shadow-md transition-all">
                  <img 
                    src={featureImg3} 
                    alt="See Your Progress" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 hidden flex-col items-center justify-center text-[#2e5c44] bg-[#d5eade]/60 border-2 border-dashed border-[#abcbb9]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-semibold">feature-img-3.png missing</span>
                  </div>
                </div>

                {/* Card Heading with simple font-sans */}
                <h3 className="text-lg font-bold font-sans text-gray-900 mb-2">See Your Progress</h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  Keep track of your habits, consistency, and improvements over time.
                </p>
              </div>
              
              <div className="mt-5 pt-3 border-t border-[#edf4ed] flex items-center justify-between text-xs text-[#2e5c44] font-medium">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#2e5c44]" /> Growth Tracking
                </span>
                <span className="text-[11px] bg-[#d5eade] px-2.5 py-0.5 rounded-md font-bold text-[#2e5c44]">📈 Insights</span>
              </div>
            </div>

          </div>

        </div>
      </section>
    </>
  );
}