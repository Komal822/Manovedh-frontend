import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, Eye, Brain, BatteryLow, Moon, 
  Utensils, ClipboardList, Clock, Frown, Heart, 
  ChevronRight, X
} from 'lucide-react';
import chakraImg from '../../assets/chakra.png';

export default function GetHelp() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const [activeLeftIndex, setActiveLeftIndex] = useState(0);
  const [activeRightIndex, setActiveRightIndex] = useState(0);
  
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const leftItems = [
    { id: 0, label: 'Feeling less motivated lately', icon: Zap, desc: 'A dip in motivation is a gentle cue from your mind to pause, reflect, and realign with what truly matters.' },
    { id: 1, label: 'Finding it hard to stay focused', icon: Eye, desc: 'Mental fog can happen when cognitive load is high. Breaking tasks down into tiny steps can help clear the path.' },
    { id: 2, label: 'Constant overthinking', icon: Brain, desc: 'When thoughts race, grounding techniques like deep breathing or journaling can help quiet the mind storm.' },
    { id: 3, label: 'Low energy throughout the day', icon: BatteryLow, desc: 'Physical and mental exhaustion often intertwine. Gentle movement, hydration, and rest are your greatest allies.' },
    { id: 4, label: 'Changes in your sleep routine', icon: Moon, desc: 'Rest is the foundation of emotional resilience. Creating a calm bedtime ritual can invite deeper peace.' }
  ];

  const rightItems = [
    { id: 5, label: 'Changes in your eating habits', icon: Utensils, desc: 'Appetite shifts often mirror emotional shifts. Nourishing your body with kindness is more important than perfection.' },
    { id: 6, label: 'Everyday tasks feel harder than usual', icon: ClipboardList, desc: 'When the ordinary feels heavy, give yourself permission to drop non-essentials and focus purely on self-care.' },
    { id: 7, label: 'Changes in your daily routine', icon: Clock, desc: 'Rhythms naturally shift. Finding stability in small anchor habits can restore a comforting sense of balance.' },
    { id: 8, label: 'Feeling more irritable than usual', icon: Frown, desc: 'Irritability is often bottled-up fatigue or unspoken needs. Acknowledging your boundaries is the first step.' },
    { id: 9, label: 'Feeling stretched too thin', icon: Heart, desc: 'You cannot pour from an empty cup. Saying no to others is often saying yes to your own well-being.' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLeftIndex((prev) => (prev + 1) % leftItems.length);
      setActiveRightIndex((prev) => (prev + 1) % rightItems.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [leftItems.length, rightItems.length]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Simple and smooth floating animation (no rotation)
  const floatAnimation = `
    @keyframes simpleFloat {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
  `;

  return (
    <section 
      ref={sectionRef}
      className="relative w-full min-h-screen bg-gradient-to-b from-[#F2F8F2] via-[#E8F3E8] to-[#DEF0DE] flex flex-col justify-between py-16 px-4 sm:px-12 font-sans overflow-hidden"
    >
      <style>{floatAnimation}</style>

      <div className="absolute top-1/4 left-5 w-[420px] h-[420px] bg-emerald-200/50 rounded-full filter blur-[140px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 right-5 w-[420px] h-[420px] bg-teal-200/40 rounded-full filter blur-[140px] pointer-events-none"></div>

      <div className={`relative z-10 text-center max-w-2xl mx-auto space-y-4 mb-8 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}`}>
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/90 mx-auto backdrop-blur-md">
          <span className="text-xs font-bold text-emerald-800 tracking-wider">
            GET HELP & SUPPORT
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2]">
          Notice the small changes <br />
          that can say <span className="text-emerald-700 underline decoration-emerald-300 decoration-wavy decoration-1">so much</span>
        </h2>

        <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto font-medium">
          Your mind often speaks in small ways. These changes matter, and it's completely okay to notice and honor them.
        </p>
      </div>

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10 my-auto">
        
        {/* Left Carousel */}
        <div className={`lg:col-span-4 flex flex-col relative h-[420px] overflow-hidden justify-center items-center transition-opacity duration-1000 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-full max-w-sm flex flex-col items-center relative h-full justify-center">
            {leftItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = index === activeLeftIndex;
              const isPrev = index === (activeLeftIndex - 1 + leftItems.length) % leftItems.length;
              const isNext = index === (activeLeftIndex + 1) % leftItems.length;

              if (!isActive && !isPrev && !isNext) return null;

              return (
                <div 
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  style={{
                    transform: isActive 
                      ? 'scale(1.03) translateY(0px)' 
                      : isPrev 
                      ? 'scale(0.9) translateY(-85px)' 
                      : 'scale(0.9) translateY(85px)',
                    zIndex: isActive ? 30 : 10,
                  }}
                  className={`absolute w-full group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all duration-700 backdrop-blur-md ${
                    isActive 
                      ? 'bg-white text-black shadow-xl shadow-emerald-900/10 border-2 border-emerald-400 opacity-100' 
                      : 'bg-white/80 text-black border border-emerald-200/80 shadow-md opacity-40 hover:opacity-75 blur-[0.2px]'
                  }`}
                >
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-xs">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-black tracking-wide">
                      {item.label}
                    </span>
                  </div>
                  
                  <div className="w-7 h-7 rounded-full bg-emerald-50/50 flex items-center justify-center text-emerald-700">
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Character/Chakra Image with Simple Floating Animation (Straight Image) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center relative py-6">
          <div className="relative group w-full flex justify-center items-center">
            <div className="absolute w-72 h-72 bg-emerald-300/40 rounded-full filter blur-3xl -z-10 animate-pulse"></div>
            
            <img 
              src={chakraImg} 
              alt="Chakra Character" 
              style={{ animation: 'simpleFloat 3s ease-in-out infinite' }}
              className={`w-full max-w-[260px] sm:max-w-[320px] object-contain drop-shadow-2xl relative z-10 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
            />
          </div>
        </div>

        {/* Right Carousel */}
        <div className={`lg:col-span-4 flex flex-col relative h-[420px] overflow-hidden justify-center items-center transition-opacity duration-1000 delay-400 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-full max-w-sm flex flex-col items-center relative h-full justify-center">
            {rightItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = index === activeRightIndex;
              const isPrev = index === (activeRightIndex - 1 + rightItems.length) % rightItems.length;
              const isNext = index === (activeRightIndex + 1) % rightItems.length;

              if (!isActive && !isPrev && !isNext) return null;

              return (
                <div 
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  style={{
                    transform: isActive 
                      ? 'scale(1.03) translateY(0px)' 
                      : isPrev 
                      ? 'scale(0.9) translateY(-85px)' 
                      : 'scale(0.9) translateY(85px)',
                    zIndex: isActive ? 30 : 10,
                  }}
                  className={`absolute w-full group flex items-center justify-between p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all duration-700 backdrop-blur-md ${
                    isActive 
                      ? 'bg-white text-black shadow-xl shadow-emerald-900/10 border-2 border-emerald-400 opacity-100' 
                      : 'bg-white/80 text-black border border-emerald-200/80 shadow-md opacity-40 hover:opacity-75 blur-[0.2px]'
                  }`}
                >
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-xs">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-black tracking-wide">
                      {item.label}
                    </span>
                  </div>
                  
                  <div className="w-7 h-7 rounded-full bg-emerald-50/50 flex items-center justify-center text-emerald-700">
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
          <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-scaleUp">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-emerald-700 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                {React.createElement(selectedItem.icon, { className: "w-6 h-6" })}
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Mindful Reflection</span>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">{selectedItem.label}</h3>
              </div>
            </div>

            <p className="text-slate-700 text-sm sm:text-base leading-relaxed bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100/60 mb-6 font-medium">
              {selectedItem.desc}
            </p>

            <div className="flex items-center justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow-md hover:bg-emerald-700 transition-colors w-full tracking-wide"
              >
                I understand, thank you 💚
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 flex items-center justify-center max-w-7xl mx-auto w-full pt-10 border-t border-emerald-900/10">
        <span className="lowercase tracking-wide font-medium italic text-emerald-800/70 text-sm">you're never alone on this journey</span>
      </div>

    </section>
  );
}