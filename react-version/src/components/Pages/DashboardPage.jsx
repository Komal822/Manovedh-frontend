import React from 'react';

import { initialPartners } from '../../data/dashboardData';



// MindSpace hero background image
import HERO_IMAGE from '../../images/Meditation at a Misty Mountain Lake.png';



// Smooth Keyframe Animations

const customAnimationCss = `

  @keyframes softPulse {

    0%, 100% { opacity: 0.3; transform: scale(1); }

    50% { opacity: 0.6; transform: scale(1.05); }

  }

  @keyframes fadeInRise {

    from { opacity: 0; transform: translateY(14px); }

    to { opacity: 1; transform: translateY(0); }

  }

  .animate-soft-pulse { animation: softPulse 6s ease-in-out infinite; }

  .animate-fade-rise { animation: fadeInRise 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }



  @media (prefers-reduced-motion: reduce) {

    .animate-soft-pulse, .animate-fade-rise {

      animation: none !important;

    }

  }

`;



export default function DashboardPage({

  displayName = 'Komal Ramdas',

  go = () => {},

  unreadCount = 3,

  openProf = () => {},

}) {

  const partners = Array.isArray(initialPartners) ? initialPartners : [];



  // Consistent compact card style

  const cardHoverStyle =

    'bg-white border border-[#1e5842]/10 rounded-2xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(20,50,38,0.02)] hover:shadow-[0_8px_24px_rgba(30,111,80,0.08)] hover:border-[#1e6f50]/30 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between gap-3.5';



  return (

    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto flex flex-col gap-6 font-sans text-[#102a21]">

      <style>{customAnimationCss}</style>



      {/* ================= LIGHT & PREMIUM HERO SECTION ================= */}

      <div className="animate-fade-rise relative bg-gradient-to-br from-[#e8f6f0] via-[#f2faf6] to-[#e1f2eb] border border-[#1e6f50]/20 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(30,111,80,0.05)] overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 min-h-[240px]">



        {/* Soft Background Image & Lighting */}

        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">

          <img

            src={HERO_IMAGE}

            alt="Mindful Sanctuary"

            onError={(e) => {

              e.currentTarget.style.display = 'none';

            }}

            className="w-full h-full object-cover object-center mix-blend-multiply"

          />

        </div>



        {/* Ambient Glowing Orbs */}

        <div className="absolute -top-16 -left-16 w-56 h-56 bg-[#1e6f50]/10 rounded-full blur-3xl pointer-events-none animate-soft-pulse" />

        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-[#34d399]/15 rounded-full blur-3xl pointer-events-none animate-soft-pulse" />



        {/* Left Hero Content */}

        <div className="relative z-10 flex flex-col gap-3 max-w-xl w-full">

          <div className="inline-flex items-center gap-2 text-[10px] font-extrabold tracking-wider uppercase text-[#16563e] bg-white/80 px-3 py-1 rounded-full w-fit backdrop-blur-md border border-[#1e6f50]/15 shadow-xs">

            <span className="w-2 h-2 rounded-full bg-[#1e6f50] animate-ping" />

            ✦ WELCOME BACK, {displayName}

          </div>



          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0c231a] leading-tight">

            Your Mindful Sanctuary

          </h1>



          <p className="text-[#325245] text-xs sm:text-sm leading-relaxed font-medium max-w-lg">

            You have completed <strong className="text-[#0c231a] font-bold">3 of 4</strong> wellness checkpoints this week. Consistency is key to sustainable mental equilibrium.

          </p>



          {/* Action Buttons */}

          <div className="flex flex-wrap items-center gap-2.5 pt-1">

            <button

              onClick={() => go('wellness')}

              className="bg-[#1e6f50] hover:bg-[#154e38] text-white px-5 py-3 rounded-xl font-bold text-xs shadow-[0_6px_16px_rgba(30,111,80,0.22)] hover:shadow-[0_10px_20px_rgba(30,111,80,0.3)] transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"

            >

              Start Wellness Check →

            </button>

            <button

              onClick={() => go('sessions')}

              className="bg-white/80 hover:bg-white text-[#1e6f50] border border-[#1e6f50]/20 hover:border-[#1e6f50]/40 px-5 py-3 rounded-xl font-bold text-xs transition-all duration-300 cursor-pointer backdrop-blur-md shadow-xs"

            >

              View Schedule

            </button>

          </div>

        </div>

      </div>



      {/* ================= METRIC CARDS ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">



        {/* Metric 1 */}

        <div onClick={() => go('sessions')} className={cardHoverStyle}>

          <div className="flex items-center justify-between">

            <div className="w-10 h-10 rounded-xl bg-[#e8faf2] text-[#1e6f50] flex items-center justify-center text-lg shadow-inner">

              📅

            </div>

            <span className="text-[10px] font-extrabold text-[#16563e] bg-[#e8faf2] px-2.5 py-0.5 rounded-full border border-[#1e6f50]/15">

              NEXT: 4 PM

            </span>

          </div>

          <div>

            <h3 className="font-serif text-xl font-bold text-[#0c231a]">1 Session</h3>

            <p className="text-xs text-[#536861] font-medium mt-0.5">Upcoming with Swapnil Ingle</p>

          </div>

        </div>



        {/* Metric 2 */}

        <div onClick={() => go('chats')} className={cardHoverStyle}>

          <div className="flex items-center justify-between">

            <div className="w-10 h-10 rounded-xl bg-[#e8faf2] text-[#1e6f50] flex items-center justify-center text-lg shadow-inner">

              💬

            </div>

            <span className="text-[10px] font-extrabold text-[#16563e] bg-[#e8faf2] px-2.5 py-0.5 rounded-full border border-[#1e6f50]/15">

              2 UNREAD

            </span>

          </div>

          <div>

            <h3 className="font-serif text-xl font-bold text-[#0c231a]">Secure Chats</h3>

            <p className="text-xs text-[#536861] font-medium mt-0.5">Connect with your partner</p>

          </div>

        </div>



        {/* Metric 3 */}

        <div onClick={() => go('partner')} className={cardHoverStyle}>

          <div className="flex items-center justify-between">

            <div className="w-10 h-10 rounded-xl bg-[#e8faf2] text-[#1e6f50] flex items-center justify-center text-lg shadow-inner">

              ⭐

            </div>

            <span className="text-[10px] font-extrabold text-[#16563e] bg-[#e8faf2] px-2.5 py-0.5 rounded-full border border-[#1e6f50]/15">

              VERIFIED

            </span>

          </div>

          <div>

            <h3 className="font-serif text-xl font-bold text-[#0c231a]">

              {partners.length || 9} Experts

            </h3>

            <p className="text-xs text-[#536861] font-medium mt-0.5">Ready to assist 24/7</p>

          </div>

        </div>



        {/* Metric 4 */}

        <div onClick={() => go('notifications')} className={cardHoverStyle}>

          <div className="flex items-center justify-between">

            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-lg shadow-inner">

              🔔

            </div>

            <span className="text-[10px] font-extrabold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">

              {unreadCount} ALERTS

            </span>

          </div>

          <div>

            <h3 className="font-serif text-xl font-bold text-[#0c231a]">Notifications</h3>

            <p className="text-xs text-[#536861] font-medium mt-0.5">Check updates & alerts</p>

          </div>

        </div>

      </div>



      {/* ================= MAIN CONTENT SECTION ================= */}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">



        {/* LEFT COLUMN */}

        <div className="flex flex-col gap-6">



          {/* Interactive Tools */}

          <div className="bg-white border border-[#1e5842]/10 rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.015)] flex flex-col gap-4">

            <div className="flex flex-wrap items-center justify-between gap-3">

              <div>

                <span className="text-[10px] font-extrabold tracking-wider uppercase text-[#1e6f50] bg-[#e8faf2] px-2.5 py-0.5 rounded-full border border-[#1e6f50]/15">

                  Interactive Tools

                </span>

                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#0c231a] mt-1.5">

                  Mindful Assessment & Exercises

                </h2>

              </div>

              <button

                onClick={() => go('wellness')}

                className="text-xs font-bold text-[#1e6f50] hover:underline cursor-pointer shrink-0 transition-all"

              >

                View Roadmap →

              </button>

            </div>



            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">

              <div

                onClick={() => go('wellness')}

                className="bg-[#f7fdfa] border border-[#1e5842]/10 rounded-xl p-4 flex items-center gap-3.5 hover:border-[#1e6f50]/40 hover:bg-[#eff9f4] transition-all duration-300 cursor-pointer group"

              >

                <div className="w-10 h-10 rounded-xl bg-white text-[#1e6f50] flex items-center justify-center text-lg shadow-xs shrink-0 group-hover:scale-105 transition-transform">

                  😊

                </div>

                <div>

                  <b className="font-serif text-xs sm:text-sm text-[#0c231a] block">Wellness Check</b>

                  <span className="text-[11px] text-[#536861] block mt-0.5">

                    Record daily mood & expression

                  </span>

                </div>

              </div>



              <div

                onClick={() => go('wellness')}

                className="bg-[#f7fdfa] border border-[#1e5842]/10 rounded-xl p-4 flex items-center gap-3.5 hover:border-[#1e6f50]/40 hover:bg-[#eff9f4] transition-all duration-300 cursor-pointer group"

              >

                <div className="w-10 h-10 rounded-xl bg-white text-[#1e6f50] flex items-center justify-center text-lg shadow-xs shrink-0 group-hover:scale-105 transition-transform">

                  🎤

                </div>

                <div>

                  <b className="font-serif text-xs sm:text-sm text-[#0c231a] block">Voice Phonation</b>

                  <span className="text-[11px] text-[#536861] block mt-0.5">

                    Complete vocal therapy exercises

                  </span>

                </div>

              </div>

            </div>

          </div>



          {/* Top Wellness Partners */}

          <div className="bg-white border border-[#1e5842]/10 rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.015)] flex flex-col gap-4">

            <div className="flex items-center justify-between">

              <h2 className="font-serif text-lg font-bold text-[#0c231a]">Top Wellness Partners</h2>

              <button

                onClick={() => go('partner')}

                className="text-xs font-bold text-[#1e6f50] hover:underline cursor-pointer transition-all"

              >

                Explore All ({partners.length}) →

              </button>

            </div>



            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">

              {partners.slice(0, 3).map((prof) => (

                <div

                  key={prof.id || prof.name}

                  className="bg-[#f7fdfa] border border-[#1e5842]/10 rounded-xl p-4 flex flex-col justify-between gap-3.5 hover:border-[#1e6f50]/30 transition-all hover:shadow-xs"

                >

                  <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-lg bg-[#e8faf2] text-[#1e6f50] flex items-center justify-center font-bold text-xs shrink-0">

                      👤

                    </div>

                    <div className="overflow-hidden">

                      <b className="text-xs font-bold text-[#0c231a] truncate block">

                        {prof.name}

                      </b>

                      <span className="text-[10px] text-[#536861] truncate block mt-0.5">

                        {prof.role}

                      </span>

                    </div>

                  </div>

                  <button

                    onClick={() => openProf(prof, 'request')}

                    className="w-full bg-[#0c231a] hover:bg-[#1e6f50] text-white py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all shadow-xs"

                  >

                    Book Request

                  </button>

                </div>

              ))}

            </div>

          </div>

        </div>



        {/* RIGHT COLUMN */}

        <div className="flex flex-col gap-6">



          {/* Today's Schedule Card */}

          <div className="bg-white border border-[#1e5842]/10 rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.015)] flex flex-col gap-4">

            <div className="flex items-center justify-between pb-2.5 border-b border-[#1e5842]/10">

              <h2 className="font-serif text-base font-bold text-[#0c231a]">Today's Schedule</h2>

              <span className="text-[10px] font-extrabold text-[#16563e] bg-[#e8faf2] px-2.5 py-0.5 rounded-full border border-[#1e6f50]/15">

                1 CONFIRMED

              </span>

            </div>



            <div className="bg-[#f2faf6] border border-[#1e6f50]/20 rounded-xl p-4 flex flex-col gap-2.5 shadow-xs">

              <div className="flex items-center justify-between">

                <b className="text-xs font-bold text-[#0c231a]">Swapnil Ingle</b>

                <span className="text-[10px] bg-[#1e6f50] text-white font-extrabold px-2 py-0.5 rounded-full">

                  04:00 PM

                </span>

              </div>

              <p className="text-[11px] text-[#536861] leading-relaxed">

                School and Educational Consultation Session via Video Call.

              </p>

              <button

                onClick={() => alert('Joining video session...')}

                className="w-full bg-[#1e6f50] hover:bg-[#154e38] text-white py-2.5 rounded-lg text-xs font-bold cursor-pointer transition-all shadow-xs hover:shadow-sm mt-0.5"

              >

                Join Video Call Now

              </button>

            </div>

          </div>



          {/* Urgent Support Card */}

          <div className="bg-gradient-to-br from-rose-50 to-rose-100/40 border border-rose-200 rounded-2xl p-5 shadow-xs flex flex-col gap-3">

            <span className="inline-flex items-center gap-2 text-[10px] font-extrabold text-rose-700 bg-white px-3 py-1 rounded-full shadow-xs w-fit border border-rose-200">

              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />

              IMMEDIATE SUPPORT

            </span>

            <p className="text-[11px] text-rose-950/80 font-medium leading-relaxed">

              Feeling overwhelmed or need someone to talk to right now? Tele-MANAS is available 24/7.

            </p>

            <a

              href="tel:14416"

              className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer mt-0.5"

            >

              <span>📞</span> Call Helpline (14416)

            </a>

          </div>



        </div>

      </div>

    </div>

  );

}