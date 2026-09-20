import React from 'react';
import { UserCheck, Smartphone, CalendarClock, MessagesSquare, Target, Layers, Sparkles } from 'lucide-react';

const features = [
  {
    icon: UserCheck,
    title: 'World-class Teachers',
    description: 'Learn from certified instructors who bring years of dedicated practice to every session.',
  },
  {
    icon: Smartphone,
    title: 'Practice On-the-go',
    description: 'Follow along anywhere with guided sessions built for your phone, tablet, or laptop.',
  },
  {
    icon: CalendarClock,
    title: 'Schedule Control',
    description: 'Book, reschedule, or pause your sessions freely around your own routine.',
  },
  {
    icon: MessagesSquare,
    title: 'Deep Training',
    description: 'Go beyond the basics with structured programs that build lasting strength and focus.',
  },
  {
    icon: Target,
    title: 'Restorative',
    description: 'Gentle, slow-paced sessions designed to help your body recover and reset.',
  },
  {
    icon: Layers,
    title: 'Multi-Styles',
    description: 'Explore a range of practices, from grounded hatha to dynamic vinyasa flow.',
  },
];

const FeaturesSection = () => {
  return (
    <section id="practices" className="relative py-24 sm:py-28 bg-[#e9f1ea] overflow-hidden select-none">
      
      {/* Background Soft Glow Orbs */}
      <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-white/40 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8 z-10">

        {/* Section header with entrance animation */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 space-y-3 animate-fade-in">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/70 border border-[#a08a4a]/30 shadow-sm backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#a08a4a] animate-spin-slow" />
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#a08a4a]">
              Our Features
            </span>
          </div>

          <h2
            className="text-3xl sm:text-[42px] font-bold text-[#1b3328] tracking-tight leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            What Makes Us Special
          </h2>

          <p className="text-[#5c6b60] text-[15px] sm:text-[16px] leading-relaxed">
            Thoughtful practices and steady guidance, built around a simple idea:
            wellbeing should feel like coming home, not another task on your list.
          </p>
        </div>

        {/* Features Grid with Hover Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 text-center">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col items-center p-8 rounded-3xl bg-white/40 backdrop-blur-sm border border-white/60 shadow-sm hover:shadow-xl hover:bg-white/90 hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer"
              >
                {/* Icon Container with Pulsing Border & Scale Effect */}
                <div className="relative mb-6">
                  {/* Subtle Glow behind Icon on Hover */}
                  <div className="absolute inset-0 rounded-full bg-[#4E8A6B]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative w-16 h-16 rounded-full border-2 border-[#a08a4a] bg-white flex items-center justify-center text-[#a08a4a] group-hover:border-[#2e5b45] group-hover:bg-[#2e5b45] group-hover:text-white transition-all duration-300 shadow-md group-hover:scale-110">
                    <Icon className="w-7 h-7 transition-transform duration-500 group-hover:rotate-12" strokeWidth={1.8} />
                  </div>
                </div>

                {/* Title with hover color change */}
                <h3 className="text-xl font-bold text-[#1b3328] mb-3 group-hover:text-[#2e5b45] transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-[#5c6b60] text-[14.5px] leading-relaxed max-w-[260px]">
                  {feature.description}
                </p>

                {/* Subtle bottom line highlight on hover */}
                <div className="absolute bottom-4 w-12 h-1 bg-[#a08a4a] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
            );
          })}
        </div>

      </div>

      {/* Embedded CSS Animations */}
      <style>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-spin-slow {
          animation: spinSlow 10s linear infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection;