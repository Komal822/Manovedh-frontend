import React, { useState, useEffect } from 'react';
import { Leaf, Zap, BarChart3, Target, Waves, Sun, TrendingUp } from 'lucide-react';

export default function Feature1() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: 'Energy', value: 38, icon: Zap, color: 'bg-gradient-to-r from-emerald-400 to-emerald-600', bgIcon: 'bg-emerald-50 text-emerald-600' },
    { label: 'Effectiveness', value: 76, icon: BarChart3, color: 'bg-gradient-to-r from-teal-500 to-emerald-700', bgIcon: 'bg-teal-50 text-teal-600' },
    { label: 'Focus', value: 68, icon: Target, color: 'bg-gradient-to-r from-amber-400 to-yellow-600', bgIcon: 'bg-amber-50 text-amber-600' },
    { label: 'Daily Flow', value: 82, icon: Waves, color: 'bg-gradient-to-r from-indigo-400 to-purple-600', bgIcon: 'bg-purple-50 text-purple-600' }
  ];

  const features = [
    { label: 'Understand Your Patterns', icon: Leaf },
    { label: 'Build Better Habits', icon: TrendingUp },
    { label: 'Feel More In Control', icon: Sun }
  ];

  return (
    <div className="w-full min-h-screen bg-[#e3f5e5] flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-6xl bg-[#f2faf3] rounded-[2.5rem] p-6 sm:p-12 shadow-xl border border-[#d4ebd6] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Section */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d5ecd8] border border-[#bfe2c3] w-fit">
            <Leaf className="w-3.5 h-3.5 text-[#2d6a4f]" />
            <span className="text-[11px] font-semibold text-[#2d6a4f] uppercase tracking-wider">
              SMALL STEPS • REAL PROGRESS
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-[#1b3a2b] leading-[1.15]">
            Improve Focus <br /> with <span className="text-[#2d6a4f]">Effectiveness.</span>
          </h1>

          <p className="text-[#4a6b5d] text-sm sm:text-base leading-relaxed">
            Manovedh helps you identify daily patterns and take meaningful action through small, practical steps. No pressure. No judgment. Just clarity.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#d5ecd8] flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#2d6a4f]" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-[#2d6a4f]">{item.label}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex items-center gap-3">
            <div className="h-px bg-[#c8e6cb] flex-1 max-w-[80px]" />
            <span className="text-xs italic font-serif text-[#5a826e]">A Calmer You</span>
            <div className="h-px bg-[#c8e6cb] flex-1 max-w-[80px]" />
          </div>
        </div>

        {/* Right Section: Progress Card */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-md border border-[#e2efe3] space-y-6">
            {stats.map((stat, idx) => {
              const IconComponent = stat.icon;
              return (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl hover:bg-[#f8fcf8] transition-all">
                  <div className="flex items-center gap-4 min-w-[160px]">
                    <div className={`w-11 h-11 rounded-2xl ${stat.bgIcon} flex items-center justify-center`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-semibold text-[#1b3a2b]">{stat.label}</span>
                  </div>

                  <div className="flex-1 flex items-center gap-4 max-w-sm">
                    <div className="flex-1 h-3.5 bg-[#edf4ee] rounded-full overflow-hidden p-0.5">
                      <div 
                        className={`h-full rounded-full ${stat.color} transition-all duration-1000 ease-out`}
                        style={{ width: animated ? `${stat.value}%` : '0%' }}
                      />
                    </div>
                    <span className="text-sm font-bold text-[#2d6a4f] w-10 text-right">{stat.value}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}