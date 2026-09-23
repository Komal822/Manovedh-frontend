import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";

// Import custom PNG assets with exact filenames from src/assets
import questionIcon from "../assets/question-mark (1).png";
import lockIcon from "../assets/lock.png";
import bookIcon from "../assets/book.png";

export default function Support() {
  const [openFaq, setOpenFaq] = useState(null);

  // Help Cards Data using imported PNG icons
  const helpCategories = [
    {
      id: "general",
      icon: questionIcon,
      title: "General Help",
      description:
        "Need help using Manovedh features, account settings, or dashboard tools?",
      linkText: "Contact support",
      linkTo: "/contact",
    },
    {
      id: "account",
      icon: lockIcon,
      title: "Account & Login",
      description:
        "Forgot password, email verification, login issues, or account access problems.",
      linkText: "Recover account",
      linkTo: "/login?forgot=true", // Login aslo kinva logout aslo, he nehamich forgot password page var jail
    },
    {
      id: "usage",
      icon: bookIcon,
      title: "Using Manovedh",
      description:
        "Learn how to use check-ins, progress tracking, and AI reflections effectively.",
      linkText: "Learn more",
      linkTo: "/about",
    },
  ];

  // FAQ Data
  const faqs = [
    {
      id: 1,
      question: "Is Manovedh a medical service?",
      answer:
        "Manovedh is a digital well-being support platform. It is not a replacement for emergency care or professional medical treatment.",
    },
    {
      id: 2,
      question: "Can I reset my password?",
      answer:
        "Yes. Use the forgot password page and enter your registered email address to start the recovery process.",
    },
    {
      id: 3,
      question: "Is my data private?",
      answer:
        "Your privacy matters. Manovedh is designed to protect user data and avoid unnecessary sharing of personal information.",
    },
    {
      id: 4,
      question: "How do I contact support?",
      answer:
        "You can use the contact page to send a message. The team can reply based on the contact details you provide.",
    },
  ];

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#1b3328] pt-12 pb-20 px-4 sm:px-8 lg:px-16 font-sans">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* PREMIUM HERO / HEADER SECTION */}
        <div className="relative text-center space-y-5 max-w-3xl mx-auto pt-2 pb-2">
          
          {/* Subtle Background Glow behind Header */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#d2e4c4]/50 rounded-full blur-3xl -z-10 pointer-events-none" />

          {/* Main Title with Premium Gradient */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#1b3328] leading-[1.15]">
            How can we <span className="bg-gradient-to-r from-[#1b3328] via-[#2e5b45] to-[#407a5d] bg-clip-text text-transparent">support you</span> today?
          </h1>
          
          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#4a5850] leading-relaxed max-w-2xl mx-auto font-normal">
            Explore our curated guides, find instant answers to common queries, 
            or reach out directly for personalized assistance.
          </p>

          {/* Decorative Minimal Line */}
          <div className="w-16 h-1 bg-[#2e5b45]/30 rounded-full mx-auto pt-1" />
        </div>

        {/* 3 PREMIUM HELP CARDS WITH PNG ICONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {helpCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white/80 hover:bg-white border border-[#dce5d5] hover:border-[#1b3328]/30 rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden"
            >
              <div className="space-y-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-[#e2edd8] flex items-center justify-center p-2.5 transition-colors group-hover:bg-[#1b3328]">
                  <img
                    src={cat.icon}
                    alt={cat.title}
                    className="w-full h-full object-contain transition-transform group-hover:scale-110 group-hover:brightness-200"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#1b3328] tracking-tight">
                  {cat.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#4a5850] leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-8 relative z-10">
                <Link
                  to={cat.linkTo}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1b3328] group-hover:text-[#2e5b45] transition-colors"
                >
                  <span>{cat.linkText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* FREQUENTLY ASKED QUESTIONS SECTION */}
        <div className="bg-white/70 border border-[#dce5d5] backdrop-blur-md rounded-3xl p-6 sm:p-10 space-y-8 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1b3328] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-[#5a6b60]">
              Quick responses to common queries about Manovedh.
            </p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white border border-[#e3ebd9] rounded-2xl overflow-hidden transition-all duration-200 hover:border-[#cbdcb9] shadow-2xs"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#1b3328] cursor-pointer transition-colors hover:bg-[#fbfaf7]"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#4a5850] shrink-0 transition-transform duration-300 ${
                      openFaq === faq.id ? "rotate-180 text-[#1b3328]" : ""
                    }`}
                  />
                </button>

                {openFaq === faq.id && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[#3d4f45] leading-relaxed border-t border-[#f0f4ec] bg-[#fdfcf9]">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* EMERGENCY WARNING BANNER */}
        <div className="bg-[#fdf2f2] **border** border-[#f8d7d7] rounded-2xl p-5 flex items-start gap-4 text-[#9b1c1c] shadow-2xs">
          <AlertTriangle className="w-5 h-5 text-[#d93838] shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed font-medium">
            <span className="font-bold">Important Notice: </span>
            If you or someone you know is in immediate danger or experiencing a crisis, please contact your local emergency services immediately. Manovedh is not designed for emergency crisis intervention.
          </div>
        </div>

      </div>
    </div>
  );
}