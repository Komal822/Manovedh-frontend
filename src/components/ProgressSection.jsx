import React, { useState, useEffect } from 'react';

const metrics = [
  { label: 'Energy', value: 38 },
  { label: 'Effectiveness', value: 76 },
  { label: 'Focus', value: 68 },
  { label: 'Daily Flow', value: 82 },
];

const ProgressSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  // कॉम्पोनंट माउंट झाल्यावर प्रोग्रेस बार ॲनिमेशन सुरू करण्यासाठी
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="progress" className="relative py-20 bg-emerald-50/40 border-y border-emerald-100/60 overflow-hidden select-none">
      
      {/* Background Subtle Floating Glow Effect */}
      <div className="pointer-events-none absolute -bottom-10 right-10 w-96 h-96 rounded-full bg-emerald-200/20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-4">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full">
              Insight & Growth
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Improve Focus with <br />
              <span className="text-emerald-600 hover:text-emerald-700 transition-colors duration-300">
                Effectiveness.
              </span>
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Manovedh helps you identify daily patterns and take meaningful action through small, practical steps. No pressure. No judgment. Just clarity.
            </p>
          </div>

          {/* Right Progress Card */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-emerald-100/80 shadow-2xl shadow-emerald-900/5 space-y-6 transition-transform duration-300 hover:shadow-emerald-900/10">
              
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  Daily Mindset Index
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </h4>
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shadow-sm">
                  Real-time Tracking
                </span>
              </div>

              <div className="space-y-6">
                {metrics.map((item, index) => (
                  <div key={index} className="space-y-2 group">
                    <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
                      <span className="group-hover:text-emerald-700 transition-colors duration-300">
                        {item.label}
                      </span>
                      <span className="text-emerald-700 font-bold group-hover:scale-110 transition-transform duration-300">
                        {item.value}%
                      </span>
                    </div>

                    {/* Animated Progress Bar Container */}
                    <div className="relative w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50 shadow-inner">
                      <div 
                        className="relative h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-1000 ease-out group-hover:from-emerald-400 group-hover:to-teal-500"
                        style={{ 
                          width: isVisible ? `${item.value}%` : '0%',
                          transitionDelay: `${index * 150}ms`
                        }}
                      >
                        {/* Shimmer Light Reflection Effect inside Progress Bar */}
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProgressSection;