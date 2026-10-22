
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, User, BookOpen } from 'lucide-react';

import { useLanguage } from "../../LanguageContext";
import { marathi } from "../../translations/marathi";
import { hindi } from "../../translations/hindi";

import heroBgImage from '../../assets/image.png';
import rightIcon from '../../assets/right.png';

const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { language } = useLanguage();

  const isEnglish = language === 'en';
  const isDevanagari = language === 'mr' || language === 'hi';

  const heroContent =
    language === 'mr'
      ? marathi.home.hero
      : language === 'hi'
      ? hindi.home.hero
      : {
          title: 'Your Well-Being Matters.',
          description:
            'Manovedh helps you understand your emotions, build healthier habits, and track your progress with calm AI-powered support.'
        };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const headingFont = isEnglish
    ? "'Playfair Display', serif"
    : "'Noto Sans Devanagari', sans-serif";

  const headingSize = isEnglish
    ? 'text-4xl sm:text-6xl lg:text-[76px] leading-[1.12] sm:leading-[1.08] tracking-tight'
    : 'text-[30px] sm:text-[44px] lg:text-[54px] leading-[1.35] sm:leading-[1.3] tracking-normal';

  const descriptionSize = isEnglish
    ? 'text-[15px] sm:text-[18px] leading-relaxed'
    : 'text-[14px] sm:text-[16px] leading-[1.9] sm:leading-[1.8]';

  const buttonFont = isDevanagari
    ? "'Noto Sans Devanagari', sans-serif"
    : 'inherit';

  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20 pb-20 sm:pb-24 select-none bg-[#1b3328]"
    >
      {/* Background Image */}
      <div
        className={`absolute inset-0 w-full h-full overflow-hidden z-0 transition-all duration-500 ${
          isModalOpen ? 'filter blur-md scale-105' : ''
        }`}
      >
        <img
          src={heroBgImage}
          alt="Peaceful meditation during sunset"
          className="w-full h-full object-cover object-[82%_center] sm:object-center brightness-[0.90] sm:brightness-[0.95] contrast-[1.05] animate-smooth-zoom"
        />
      </div>

      {/* Gradient Overlays */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent sm:from-black/75 sm:via-black/35 z-10 transition-all duration-700 ease-in-out ${
          isModalOpen ? 'backdrop-blur-sm' : ''
        }`}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#1b3328]/90 via-transparent to-transparent z-15 pointer-events-none" />

      {/* Main Hero Content */}
      <div
        className={`relative w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 z-30 transition-all duration-500 ${
          isModalOpen
            ? 'filter blur-sm select-none pointer-events-none'
            : ''
        }`}
      >
        <div
          className={`max-w-2xl text-left ${
            isEnglish
              ? 'space-y-6 sm:space-y-8'
              : 'space-y-5 sm:space-y-7'
          }`}
        >
          {/* Hero Heading */}
          <h1
            className={`${headingSize} font-bold drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] text-white`}
            style={{ fontFamily: headingFont }}
          >
            {isEnglish ? (
              <>
                <span className="block font-medium italic text-[#ffe59e] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] animate-ultra-smooth-text-1">
                  Your Well-Being
                </span>

                <span className="block text-white animate-ultra-smooth-text-2 mt-1 sm:mt-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                  Matters
                </span>
              </>
            ) : language === 'mr' ? (
              <span className="block animate-ultra-smooth-text-1">
                <span className="block text-[#ffe59e]">
                  तुम्हाला चांगलं वाटणं
                </span>

                <span className="block mt-1 sm:mt-2 text-white">
                  महत्त्वाचं आहे
                </span>
              </span>
            ) : language === 'hi' ? (
              <span className="block animate-ultra-smooth-text-1">
                <span className="block text-[#ffe59e]">
                  आपका बेहतर महसूस करना
                </span>

                <span className="block mt-1 sm:mt-2 text-white">
                  मायने रखता है
                </span>
              </span>
            ) : null}
          </h1>

          {/* Hero Description */}
          <p
            className={`${descriptionSize} text-white/95 ${
              isEnglish
                ? 'max-w-md sm:max-w-xl'
                : 'max-w-[34rem] sm:max-w-xl'
            } font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] animate-ultra-smooth-text-3`}
            style={{ fontFamily: buttonFont }}
          >
            {heroContent.description}
          </p>

          {/* Hero Buttons */}
          <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3 sm:gap-4 animate-ultra-smooth-text-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className={`relative group inline-flex items-center gap-2.5 sm:gap-3 overflow-hidden rounded-full px-6 py-3 sm:px-8 sm:py-4 ${
                isDevanagari
                  ? 'text-[13px] sm:text-[14px] tracking-normal'
                  : 'text-[13px] sm:text-[15.5px] tracking-wider'
              } font-bold uppercase text-white shadow-xl shadow-[#1b3328]/35 transition-all duration-500 ease-out hover:shadow-2xl hover:scale-105 active:scale-95 cursor-pointer`}
              style={{
                background: 'linear-gradient(145deg, #4E8A6B, #234A38)',
                fontFamily: buttonFont
              }}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

              <span className="relative z-10 flex items-center gap-2 transition-transform duration-300">
                Get Started

                <img
                  src={rightIcon}
                  alt=""
                  className="w-4 h-4 sm:w-5 sm:h-5 object-contain transition-transform duration-300 ease-out group-hover:translate-x-2"
                />
              </span>
            </button>

            <Link
              to="/about"
              className={`inline-flex items-center justify-center rounded-full px-6 py-3 sm:px-8 sm:py-4 ${
                isDevanagari
                  ? 'text-[13px] sm:text-[14px] tracking-normal'
                  : 'text-[13px] sm:text-[15.5px] tracking-wide'
              } font-bold text-white/90 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md shadow-lg transition-all duration-300 ease-out hover:scale-105 active:scale-95`}
              style={{ fontFamily: buttonFont }}
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Role Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#EAF3EC] rounded-[28px] p-6 sm:p-8 shadow-2xl border border-[#d6e8da] text-gray-800">
            {/* Close Button */}
            <button
              onClick={closeModal}
              aria-label="Close"
              className="absolute top-5 right-5 sm:top-6 sm:right-6 w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-black/5 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Role Selection */}
            <div>
              <div className="mb-6 pr-8">
                <div className="w-12 h-12 rounded-2xl bg-[#1b3328] flex items-center justify-center text-[#ffea9f] mb-4 shadow-md font-serif font-bold text-lg">
                  M
                </div>

                <h3 className="text-2xl font-serif font-bold text-[#1b3328]">
                  Join Manovedh
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                  Choose how you'd like to get started
                </p>
              </div>

              <div className="space-y-4">
                {/* User Option */}
                <button
                  onClick={() => {
                    closeModal();
                    navigate('/signup');
                  }}
                  className="w-full text-left group flex items-center justify-between gap-3 p-4 bg-white/80 hover:bg-white rounded-2xl border border-[#d6e8da] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-[#dcf0e2] flex items-center justify-center text-[#1b3328]">
                      <User className="w-6 h-6" />
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-bold text-base text-[#1b3328]">
                        User
                      </h4>

                      <p className="text-xs text-gray-500 mt-0.5">
                        Access wellness activities, tracking & support
                      </p>
                    </div>
                  </div>

                  <img
                    src={rightIcon}
                    alt=""
                    className="w-5 h-5 shrink-0 object-contain text-gray-400 group-hover:translate-x-1 transition-all"
                  />
                </button>

                {/* Wellness Partner Option */}
                <button
                  onClick={() => {
                    closeModal();
                    navigate('/partner-login');
                  }}
                  className="w-full text-left group flex items-center justify-between gap-3 p-4 bg-white/80 hover:bg-white rounded-2xl border border-[#d6e8da] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-[#dcf0e2] flex items-center justify-center text-[#1b3328]">
                      <BookOpen className="w-6 h-6" />
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-bold text-base text-[#1b3328]">
                        Wellness Partner
                      </h4>

                      <p className="text-xs text-gray-500 mt-0.5">
                        Provide professional guidance & manage clients
                      </p>
                    </div>
                  </div>

                  <img
                    src={rightIcon}
                    alt=""
                    className="w-5 h-5 shrink-0 object-contain text-gray-400 group-hover:translate-x-1 transition-all"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Wavy Section Divider */}
      <div className="absolute bottom-0 left-0 right-0 leading-none pointer-events-none z-25">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-12 sm:h-20 text-[#ffffff] fill-current"
          preserveAspectRatio="none"
        >
          <path d="M0,64 C240,120 480,0 720,32 C960,64 1200,112 1440,48 L1440,120 L0,120 Z" />
        </svg>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes smoothZoom {
          0% { transform: scale(1.02); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1.02); }
        }

        @keyframes ultraSmoothReveal {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
            filter: blur(4px);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }

        .animate-smooth-zoom {
          animation: smoothZoom 28s ease-in-out infinite;
        }

        .animate-ultra-smooth-text-1 {
          opacity: 0;
          animation: ultraSmoothReveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.1s forwards;
        }

        .animate-ultra-smooth-text-2 {
          opacity: 0;
          animation: ultraSmoothReveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.25s forwards;
        }

        .animate-ultra-smooth-text-3 {
          opacity: 0;
          animation: ultraSmoothReveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.4s forwards;
        }

        .animate-ultra-smooth-text-4 {
          opacity: 0;
          animation: ultraSmoothReveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.55s forwards;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
