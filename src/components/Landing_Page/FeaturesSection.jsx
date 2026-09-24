import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Leaf, Sparkles, TrendingUp } from 'lucide-react';

import featureImg1 from '../../assets/feature-img1.png';
import featureImg2 from '../../assets/feature-img2.png';
import featureImg3 from '../../assets/feature-img3.png';

const features = [
  {
    number: '01',
    title: 'Know Yourself Better',
    description: 'Understand your daily patterns and discover what truly keeps you balanced.',
    image: featureImg1,
    fallbackBg: 'from-emerald-50 to-teal-50',
  },
  {
    number: '02',
    title: 'Personalized Recommendations',
    description: 'Get tailored activities and gentle suggestions that adapt to your routine.',
    image: featureImg2,
    fallbackBg: 'from-green-50 to-emerald-50',
  },
  {
    number: '03',
    title: 'See Your Progress',
    description: 'Track your habits, consistency, and meaningful improvements over time.',
    image: featureImg3,
    fallbackBg: 'from-teal-50 to-green-50',
  },
];

export default function BalancedLifeFeatures() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-[#ffffff] pt-16 pb-40 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
      
      {/* Custom CSS for Smooth Scroll Entrance & Floating Animations */}
      <style>{`
        @keyframes floatGentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-float-1 { animation: floatGentle 5s ease-in-out infinite; }
        .animate-float-2 { animation: floatGentle 6s ease-in-out infinite 1s; }
        .animate-float-3 { animation: floatGentle 5.5s ease-in-out infinite 2s; }

        .scroll-animate-card {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .scroll-animate-card.active {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      {/* Immersive Winding Road Landscape matching reference layout */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <svg className="absolute w-full h-full min-h-[750px] opacity-95" viewBox="0 0 1440 700" preserveAspectRatio="none" fill="none">
          {/* Subtle Soft Hill Backdrop */}
          <path d="M0 420 C 450 340, 1000 500, 1440 390 L 1440 700 L 0 700 Z" fill="#f8fafc" />
          
          {/* Main Winding Road Asphalt Path */}
          <path 
            d="M-50 560 C 250 620, 380 340, 720 440 C 1060 540, 1180 300, 1500 280" 
            stroke="#cbd5e1" 
            strokeWidth="44" 
            strokeLinecap="round"
          />
          {/* Road White Dashed Center Line */}
          <path 
            d="M-50 560 C 250 620, 380 340, 720 440 C 1060 540, 1180 300, 1500 280" 
            stroke="#ffffff" 
            strokeWidth="3" 
            strokeDasharray="12 12" 
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className={`text-center max-w-2xl mx-auto mb-20 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}`}>
          <div className="inline-flex items-center gap-2 text-[#2d6a4f] text-xs font-bold tracking-widest uppercase mb-3">
            <span>Features</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#112a1c] tracking-tight mb-3 leading-tight">
            Simple tools for a more{' '}
            <span className="relative inline-block text-[#2d6a4f]">
              balanced life
              <span className="absolute left-0 bottom-1.5 w-full h-3 bg-[#a3e4c1]/60 rounded-full -z-10 transform -rotate-1"></span>
            </span>
          </h2>
          
          <p className="text-gray-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Small steps, meaningful change. Follow your journey to a healthier, happier you.
          </p>
        </div>

        {/* 3 Step Cards Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center pt-4 lg:pt-8">
          
          {/* Card 1 */}
          <div className={`flex justify-center lg:-translate-y-12 animate-float-1 scroll-animate-card ${isVisible ? 'active' : ''}`} style={{ transitionDelay: '150ms' }}>
            <div className="relative w-full max-w-[310px] bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-[0_20px_50px_rgba(45,106,79,0.12)] border border-emerald-50 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_25px_60px_rgba(45,106,79,0.2)] hover:-translate-y-1.5 group">
              {/* Step badge */}
              <div className="absolute -top-3.5 left-5 w-7 h-7 rounded-full bg-[#2d6a4f] text-white font-bold text-xs flex items-center justify-center shadow-md border-2 border-white z-20 group-hover:scale-110 transition-transform">
                {features[0].number}
              </div>

              <div>
                <div className={`w-full h-32 rounded-xl bg-gradient-to-br ${features[0].fallbackBg} mb-3.5 overflow-hidden relative flex items-center justify-center border border-emerald-100/40`}>
                  <img 
                    src={features[0].image} 
                    alt={features[0].title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 hidden items-center justify-center flex-col text-emerald-800 p-2 text-center">
                    <Leaf className="w-7 h-7 mb-1 text-[#2d6a4f]" />
                    <span className="text-xs font-medium opacity-80">{features[0].title}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-[#112a1c] mb-1.5 leading-snug">
                  {features[0].title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-4">
                  {features[0].description}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end">
                <button className="w-6 h-6 rounded-full bg-[#1b4d31] text-white flex items-center justify-center shadow-2xs transition-transform duration-300 group-hover:bg-[#2d6a4f] group-hover:scale-110 cursor-pointer">
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className={`flex justify-center lg:translate-y-8 animate-float-2 scroll-animate-card ${isVisible ? 'active' : ''}`} style={{ transitionDelay: '300ms' }}>
            <div className="relative w-full max-w-[310px] bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-[0_20px_50px_rgba(45,106,79,0.12)] border border-emerald-50 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_25px_60px_rgba(45,106,79,0.2)] hover:-translate-y-1.5 group">
              {/* Step badge */}
              <div className="absolute -top-3.5 left-5 w-7 h-7 rounded-full bg-[#2d6a4f] text-white font-bold text-xs flex items-center justify-center shadow-md border-2 border-white z-20 group-hover:scale-110 transition-transform">
                {features[1].number}
              </div>

              <div>
                <div className={`w-full h-32 rounded-xl bg-gradient-to-br ${features[1].fallbackBg} mb-3.5 overflow-hidden relative flex items-center justify-center border border-emerald-100/40`}>
                  <img 
                    src={features[1].image} 
                    alt={features[1].title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 hidden items-center justify-center flex-col text-emerald-800 p-2 text-center">
                    <Sparkles className="w-7 h-7 mb-1 text-[#2d6a4f]" />
                    <span className="text-xs font-medium opacity-80">{features[1].title}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-[#112a1c] mb-1.5 leading-snug">
                  {features[1].title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-4">
                  {features[1].description}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end">
                <button className="w-6 h-6 rounded-full bg-[#1b4d31] text-white flex items-center justify-center shadow-2xs transition-transform duration-300 group-hover:bg-[#2d6a4f] group-hover:scale-110 cursor-pointer">
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className={`flex justify-center lg:-translate-y-10 animate-float-3 scroll-animate-card ${isVisible ? 'active' : ''}`} style={{ transitionDelay: '450ms' }}>
            <div className="relative w-full max-w-[310px] bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-[0_20px_50px_rgba(45,106,79,0.12)] border border-emerald-50 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_25px_60px_rgba(45,106,79,0.2)] hover:-translate-y-1.5 group">
              {/* Step badge */}
              <div className="absolute -top-3.5 left-5 w-7 h-7 rounded-full bg-[#2d6a4f] text-white font-bold text-xs flex items-center justify-center shadow-md border-2 border-white z-20 group-hover:scale-110 transition-transform">
                {features[2].number}
              </div>

              <div>
                <div className={`w-full h-32 rounded-xl bg-gradient-to-br ${features[2].fallbackBg} mb-3.5 overflow-hidden relative flex items-center justify-center border border-emerald-100/40`}>
                  <img 
                    src={features[2].image} 
                    alt={features[2].title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 hidden items-center justify-center flex-col text-emerald-800 p-2 text-center">
                    <TrendingUp className="w-7 h-7 mb-1 text-[#2d6a4f]" />
                    <span className="text-xs font-medium opacity-80">{features[2].title}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-[#112a1c] mb-1.5 leading-snug">
                  {features[2].title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-4">
                  {features[2].description}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end">
                <button className="w-6 h-6 rounded-full bg-[#1b4d31] text-white flex items-center justify-center shadow-2xs transition-transform duration-300 group-hover:bg-[#2d6a4f] group-hover:scale-110 cursor-pointer">
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}