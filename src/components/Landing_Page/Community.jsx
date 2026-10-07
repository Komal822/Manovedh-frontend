import React, { useState, useEffect } from 'react';
import {
  Heart,
  ListOrdered,
  Star,
  Bookmark,
  ArrowLeft,
  Send,
  Plus,
  ShieldCheck,
  Mail,
  PenTool
} from 'lucide-react';

import communityImg from '../../assets/community-img.png';

export default function Community({ onBack }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [email, setEmail] = useState('');
  const [activityName, setActivityName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [steps, setSteps] = useState('');
  const [benefit, setBenefit] = useState('');
  const [selectedTags, setSelectedTags] = useState(['Breathing', 'Grounding', 'Focus', 'Journaling', 'Movement']);
  const [customTags, setCustomTags] = useState([]);
  const [isDraftSaved, setIsDraftSaved] = useState(false);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = () => {
    const tagName = prompt('Enter custom tag name:');
    if (tagName && !customTags.includes(tagName) && !selectedTags.includes(tagName)) {
      setCustomTags((prev) => [...prev, tagName]);
      setSelectedTags((prev) => [...prev, tagName]);
    }
  };

  const handleSaveDraft = () => {
    setIsDraftSaved(true);
    setTimeout(() => setIsDraftSaved(false), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Activity submitted for review successfully!');
  };

  return (
    <div className="min-h-screen text-slate-800 relative selection:bg-emerald-200 overflow-x-hidden font-sans bg-gradient-to-b from-emerald-50/50 via-white to-emerald-50/30">
      
      {/* Custom simple floating animation style */}
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: floatSlow 4s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 relative z-10">
        
        {/* Back to Home Button & Top badge banner */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200/80 rounded-full text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-800" />
            Back to Home
          </button>

          <span className="inline-flex items-center gap-1.5 px-4 py-1 bg-emerald-900/10 border border-emerald-900/15 text-emerald-900 rounded-full text-[11px] font-bold tracking-widest uppercase">
            YOUR OWN ACTIVITY
          </span>
        </div>

        {/* Hero title area */}
        <div className="relative max-w-3xl mx-auto text-center mb-10 sm:mb-14">
          <h1 className="font-serif text-3xl sm:text-5xl text-slate-900 tracking-tight mb-3">
            Share a wellness <span className="text-emerald-800">activity idea.</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Have a screen-based calming, focus, breathing, grounding, journaling, or movement activity? Submit it to Manovedh for review.
          </p>
        </div>

        {/* Main Card Container */}
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-[0_20px_50px_rgba(15,61,46,0.12)] border border-emerald-900/10 grid grid-cols-1 lg:grid-cols-12 overflow-hidden mb-12">
          
          {/* Left Column: Forest Green Guidance Panel */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-emerald-900 text-white border-r border-emerald-800">
            <div>
              {/* Contribution Header pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-800/80 border border-emerald-700/60 rounded-full text-[10px] font-bold tracking-wider text-emerald-100 uppercase shadow-2xs mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                COMMUNITY CONTRIBUTION
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2.5 tracking-tight">
                What makes a good <span className="text-emerald-300">activity?</span>
              </h2>
              <p className="text-xs text-emerald-100/90 mb-6 leading-relaxed">
                Keep it simple, calm, beginner-friendly, and useful for daily wellness. The best submissions are easy to follow on a phone or laptop screen.
              </p>

              {/* Bullet Points with Dim Horizontal Lines & Compact Spacing */}
              <div className="space-y-4">
                <div className="flex items-start gap-3.5 pt-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-800 shadow-xs border border-emerald-700/60 flex items-center justify-center flex-shrink-0 text-emerald-200">
                    <Heart className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide">Clear purpose</h4>
                    <p className="text-xs text-emerald-200/80 mt-0.5 leading-relaxed">Explain what this activity helps with.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-4 border-t border-emerald-800/80">
                  <div className="w-8 h-8 rounded-full bg-emerald-800 shadow-xs border border-emerald-700/60 flex items-center justify-center flex-shrink-0 text-emerald-200">
                    <ListOrdered className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide">Simple steps</h4>
                    <p className="text-xs text-emerald-200/80 mt-0.5 leading-relaxed">Write steps that a beginner can follow.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-4 border-t border-emerald-800/80">
                  <div className="w-8 h-8 rounded-full bg-emerald-800 shadow-xs border border-emerald-700/60 flex items-center justify-center flex-shrink-0 text-emerald-200">
                    <Star className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide">Expected benefit</h4>
                    <p className="text-xs text-emerald-200/80 mt-0.5 leading-relaxed">Share how this activity may feel after doing it.</p>
                  </div>
                </div>
              </div>

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-2 mt-6">
                {selectedTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className="px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-800/90 text-emerald-100 border border-emerald-700/60 hover:bg-emerald-800 transition cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Illustration Section moved slightly higher with a smooth floating animation */}
            <div className="mt-2 pt-2 relative flex flex-col items-center justify-center">
              <div className="absolute w-44 h-44 bg-emerald-800/50 rounded-full blur-xl pointer-events-none"></div>
              
              <img
                src={communityImg}
                alt="Community Illustration"
                className="w-full max-w-[240px] object-contain drop-shadow-sm relative z-10 animate-float"
              />
              <div className="absolute right-4 bottom-2 rotate-[-6deg] text-emerald-200/80 font-serif italic text-sm pointer-events-none select-none z-20">
                A Calmer You ♡
              </div>
            </div>
          </div>

          {/* Right Column: Submission Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 bg-white">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Submit your activity</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">All submissions go through a review process before being published.</p>
              </div>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-900 hover:bg-emerald-50 border border-slate-200 rounded-full transition cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 text-emerald-700" />
                {isDraftSaved ? 'Draft Saved!' : 'Save Draft'}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Address */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Email address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/60 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              {/* Section Header */}
              <div className="pt-2">
                <h3 className="text-sm font-bold text-slate-900">Describe your activity</h3>
                <p className="text-[11px] text-slate-500">Fill in the details below to help us understand your activity clearly.</p>
              </div>

              {/* Activity Name */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[10px] font-bold flex items-center justify-center">1</span>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Activity Name <span className="text-rose-500">*</span>
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <PenTool className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    required
                    value={activityName}
                    onChange={(e) => setActivityName(e.target.value)}
                    placeholder="e.g. 4-7-8 Breathing"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/60 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              {/* Purpose */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[10px] font-bold flex items-center justify-center">2</span>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Purpose <span className="text-rose-500">*</span>
                  </label>
                </div>
                <textarea
                  rows="2"
                  required
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="What does this activity help with? e.g. Calms the nervous system and reduces relaxation."
                  className="w-full px-4 py-3 bg-slate-50/60 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-emerald-600 transition resize-none"
                />
              </div>

              {/* Steps */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[10px] font-bold flex items-center justify-center">3</span>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Steps <span className="text-rose-500">*</span>
                  </label>
                </div>
                <textarea
                  rows="3"
                  required
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  placeholder="Write step-by-step instructions a beginner can follow. e.g. 1. Sit comfortably..."
                  className="w-full px-4 py-3 bg-slate-50/60 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-emerald-600 transition resize-none"
                />
              </div>

              {/* Expected Benefit */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[10px] font-bold flex items-center justify-center">4</span>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Expected Benefit <span className="text-rose-500">*</span>
                  </label>
                </div>
                <textarea
                  rows="2"
                  required
                  value={benefit}
                  onChange={(e) => setBenefit(e.target.value)}
                  placeholder="What will the user feel after? e.g. Helps the user feel calmer and more mindful."
                  className="w-full px-4 py-3 bg-slate-50/60 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-emerald-600 transition resize-none"
                />
              </div>

              {/* Add tags button */}
              <div>
                <button
                  type="button"
                  onClick={handleAddCustomTag}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add tags
                </button>
              </div>

              {/* Submit Button & Trust Notice */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-full text-xs font-bold tracking-wide shadow-md transition cursor-pointer"
                >
                  Submit Activity &rarr; <Send className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 text-center sm:text-right max-w-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Our team will review and notify you once it's live on Manovedh. Thank you for contributing!</span>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Footer branding */}
        <div className="text-right pb-4 pr-2">
          <p className="text-[10px] uppercase tracking-widest text-emerald-900/60 font-bold">
            HEALTHIER MINDS <br />KINDER TOMORROWS
          </p>
        </div>
      </div>
    </div>
  );
}