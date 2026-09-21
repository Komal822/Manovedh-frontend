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
    role: "Clinical Psychologist",
    category: "Therapists",
    feedback: "Manovedh helps users track emotional patterns between sessions effectively. It has become an essential supportive tool for my clients.",
    rating: 5,
    verified: true,
    avatar: img1, // image-1 (boy)
  },
  {
    id: 2,
    name: "Rahul M.",
    role: "Product Designer",
    category: "Daily Users",
    feedback: "The daily check-ins helped me understand my emotional triggers and calm myself during high-stress workdays. Absolutely transformational.",
    rating: 5,
    verified: true,
    avatar: img2, // image-2 (girl)
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    role: "Mindfulness Practitioner",
    category: "Mindfulness",
    feedback: "The interface feels calm, simple, and supportive without pressure. It truly embodies what a modern mindful AI platform should be.",
    rating: 5,
    verified: true,
    avatar: img3, // image-3 (boy)
  },
];

const CATEGORIES = ["All", "Daily Users", "Therapists", "Mindfulness"];

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState(INITIAL_FEEDBACKS);
  const [activeTab, setActiveTab] = useState("All");

  // New Feedback State
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [category, setCategory] = useState('Daily Users');
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(5);

  const filteredFeedbacks = activeTab === "All" 
    ? feedbacks 
    : feedbacks.filter(item => item.category === activeTab);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !feedbackText) return;

    const newFeedback = {
      id: Date.now(),
      name,
      role: role || "User",
      category,
      feedback: feedbackText,
      rating: Number(rating),
      verified: true,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`, // Auto generated avatar
    };

    setFeedbacks([newFeedback, ...feedbacks]);
    setName('');
    setRole('');
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

        {/* CATEGORY TABS */}
        <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2 text-xs font-bold rounded-full transition-all duration-300 cursor-pointer border ${
                activeTab === cat
                  ? "bg-[#1b3328] text-white border-[#1b3328] shadow-md"
                  : "bg-white/70 text-[#33413a] border-[#1b3328]/10 hover:bg-white"
              }`}
            >
              {cat}
            </button>
          ))}
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

          {/* 4TH CARD: USER FEEDBACK FORM */}
          <div className="relative flex flex-col justify-between bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-[#1b3328]/10 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="space-y-3 relative z-10 w-full">
              <div className="flex items-center justify-between border-b border-[#1b3328]/10 pb-2">
                <span className="text-xs font-bold text-[#1b3328] uppercase tracking-wider flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4 text-[#2e5b45]" />
                  Add Your Story
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      onClick={() => setRating(star)}
                      className={`w-3.5 h-3.5 cursor-pointer ${
                        star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-2.5 pt-1">
                <input
                  type="text"
                  placeholder="Your Name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full text-[12px] px-3 py-1.5 bg-[#f4f1ea]/50 border border-[#1b3328]/15 rounded-xl outline-none focus:border-[#1b3328] text-[#1b3328]"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Role (e.g. Student)"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full text-[12px] px-3 py-1.5 bg-[#f4f1ea]/50 border border-[#1b3328]/15 rounded-xl outline-none focus:border-[#1b3328] text-[#1b3328]"
                  />

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-[12px] px-2 py-1.5 bg-[#f4f1ea]/50 border border-[#1b3328]/15 rounded-xl outline-none focus:border-[#1b3328] text-[#1b3328]"
                  >
                    <option value="Daily Users">Daily Users</option>
                    <option value="Therapists">Therapists</option>
                    <option value="Mindfulness">Mindfulness</option>
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
                  className="w-full py-2.5 bg-[#1b3328] hover:bg-[#2e5b45] text-white text-[12px] font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
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