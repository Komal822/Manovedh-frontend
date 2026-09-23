import React, { useState } from 'react';
import { Star, ShieldCheck, Quote, PlusCircle } from 'lucide-react';

// Assets madhun images import kelea ahet
import img1 from '../assets/image-1.png';
import img2 from '../assets/image-2.png';
import img3 from '../assets/image-3.png';

const INITIAL_FEEDBACKS = [
  {
    id: 1,
    name: "Dr. Ananya Gupta",
    role: "Daily User",
    category: "Daily Users",
    feedback: "Manovedh helps users track emotional patterns between sessions effectively. It has become an essential supportive tool for my clients.",
    rating: 5,
    verified: true,
    avatar: img1,
  },
  {
    id: 2,
    name: "Rahul M.",
    role: "Daily User",
    category: "Daily Users",
    feedback: "The daily check-ins helped me understand my emotional triggers and calm myself during high-stress workdays. Absolutely transformational.",
    rating: 5,
    verified: true,
    avatar: img2,
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    role: "Daily User",
    category: "Daily Users",
    feedback: "The interface feels calm, simple, and supportive without pressure. It truly embodies what a modern mindful AI platform should be.",
    rating: 5,
    verified: true,
    avatar: img3,
  },
];

const CATEGORIES = ["All", "Daily Users"];

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState(INITIAL_FEEDBACKS);
  const [activeTab, setActiveTab] = useState("All");

  // New Feedback State
  const [name, setName] = useState('');
  const [avatarType, setAvatarType] = useState('man'); // Man ki Woman select karnyasathi
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(5);

  const filteredFeedbacks = activeTab === "All" 
    ? feedbacks 
    : feedbacks.filter(item => item.category === activeTab);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !feedbackText) return;

    // Man kinva Woman nusaar DiceBear cha avatar generate hoil
    const avatarSeed = `${name}-${Date.now()}`;
    const avatarUrl = avatarType === 'woman' 
      ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}&eyebrows=default,raisedExcited&mouth=smile&hair=long,straight,bob` 
      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}&eyebrows=default&mouth=smile&hair=short,curly`;

    const newFeedback = {
      id: Date.now(),
      name,
      role: "Daily User",
      category: "Daily Users",
      feedback: feedbackText,
      rating: Number(rating),
      verified: true,
      avatar: avatarUrl,
    };

    setFeedbacks([newFeedback, ...feedbacks]);
    setName('');
    setAvatarType('man');
    setFeedbackText('');
    setRating(5);
  };

  return (
    <section id="feedback" className="relative w-full py-12 sm:py-16 bg-[#eae5db]/40 text-[#1b3328] font-sans">
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-16 z-10">
        
        {/* HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <h2 
            className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1b3328] leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Real stories of healing and clarity
          </h2>

          <p className="text-[14px] sm:text-[16px] text-[#4a5850] max-w-xl mx-auto leading-relaxed">
            Discover how Manovedh guides thousands toward emotional balance and daily mindfulness.
          </p>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {filteredFeedbacks.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-[#1b3328]/10 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <Quote className="absolute top-6 right-6 w-7 h-7 text-[#1b3328]/10" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>

                  {item.verified && (
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-[#1b3328]/5 rounded-full text-[10px] font-semibold text-[#1b3328] border border-[#1b3328]/10">
                      <ShieldCheck className="w-3 h-3 text-[#2e5b45]" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>

                <p className="text-[13.5px] text-[#33413a] leading-relaxed italic">
                  "{item.feedback}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-5 mt-5 border-t border-black/5 relative z-10">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#2e5b45]/20 shadow-sm bg-[#f4f1ea]"
                />
                <div>
                  <h3 className="text-[14px] font-bold text-[#1b3328]">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-[#6b7b73] font-medium">
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* USER FEEDBACK FORM CARD */}
          <div className="relative flex flex-col justify-between bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-[#1b3328]/10 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="space-y-3 relative z-10 w-full">
              
              <div className="flex items-center justify-between border-b border-[#1b3328]/10 pb-2">
                <span className="text-xs font-bold text-[#1b3328] uppercase tracking-wider flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4 text-[#2e5b45]" />
                  Add Your Story
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#1b3328]/5 text-[#1b3328] rounded-full">
                  Daily User
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-2.5 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full text-[12px] px-3 py-2 bg-[#f4f1ea]/50 border border-[#1b3328]/15 rounded-xl outline-none focus:border-[#1b3328] text-[#1b3328]"
                  />

                  {/* Man / Woman Avatar Selection */}
                  <select
                    value={avatarType}
                    onChange={(e) => setAvatarType(e.target.value)}
                    className="w-full text-[12px] px-2 py-2 bg-[#f4f1ea]/50 border border-[#1b3328]/15 rounded-xl outline-none focus:border-[#1b3328] text-[#1b3328]"
                  >
                    <option value="man">Man Avatar</option>
                    <option value="woman">Woman Avatar</option>
                  </select>
                </div>

                {/* Rating Selection */}
                <div>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full text-[12px] px-3 py-2 bg-[#f4f1ea]/50 border border-[#1b3328]/15 rounded-xl outline-none focus:border-[#1b3328] text-[#1b3328]"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5) Excellent</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5) Very Good</option>
                    <option value={3}>⭐⭐⭐ (3/5) Good</option>
                    <option value={2}>⭐⭐ (2/5) Fair</option>
                    <option value={1}>⭐ (1/5) Poor</option>
                  </select>
                </div>

                <textarea
                  placeholder="Share your experience..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  required
                  rows={2}
                  className="w-full text-[12px] p-3 bg-[#f4f1ea]/50 border border-[#1b3328]/15 rounded-xl outline-none focus:border-[#1b3328] text-[#1b3328] resize-none"
                />

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#1b3328] hover:bg-[#2e5b45] text-white text-[12px] font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
                >
                  Submit Feedback
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}