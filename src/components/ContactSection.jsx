import React, { useState } from "react";
import { MessageSquareCheck } from "lucide-react";

// Local Assets Imports
import callIcon from "../assets/call.png";
import emailIcon from "../assets/communication.png";
import locationIcon from "../assets/location.png";
import shieldIcon from "../assets/shield.png";
import shareIcon from "../assets/share.png";

export default function ContactSection() {
  // FORM STATES
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] text-[#1B3328] font-sans antialiased pt-36 pb-20 px-4 sm:px-6 lg:px-12 relative overflow-hidden flex flex-col justify-center items-center">
      
      {/* BACKGROUND GLOW DECORATIONS */}
      <div className="absolute top-28 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#2E5B45]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[450px] h-[450px] bg-gradient-to-tr from-[#A08A4A]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl w-full mx-auto relative z-10">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-10 space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1B3328] font-serif tracking-tight leading-tight">
            Let's Start a Conversation.
          </h1>
          <p className="text-sm sm:text-base text-[#4A5850] max-w-xl mx-auto font-medium leading-relaxed">
            Have questions or need support? Send us a message below.
          </p>
        </div>

        {/* MAIN CONTACT CARD */}
        <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-black/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* LEFT SIDE: INFO PANEL */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#18362A] via-[#1E4334] to-[#0F261D] text-white p-8 sm:p-10 lg:p-12 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full border-[30px] border-white/5 pointer-events-none" />
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-[#A08A4A]/20 blur-2xl pointer-events-none" />
            
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-bold font-serif mb-3 tracking-tight">
                Contact Information
              </h3>
              <p className="text-emerald-100/70 text-xs sm:text-sm leading-relaxed mb-8 sm:mb-10 font-normal">
                Reach out to us directly. We are always ready to assist you.
              </p>

              {/* INFO ITEMS */}
              <div className="space-y-5 sm:space-y-6">
                
                {/* CALL ITEM */}
                <a 
                  href="tel:+919223456789" 
                  className="flex items-center gap-4 group p-2.5 sm:p-3 rounded-2xl transition-all duration-300 hover:bg-white/10"
                >
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/10 flex items-center justify-center p-2 transition-all duration-300 shadow-sm shrink-0">
                    <img 
                      src={callIcon} 
                      alt="Call Icon" 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" 
                    />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-emerald-200/60 uppercase font-semibold">Call Us</p>
                    <p className="text-xs sm:text-sm font-medium tracking-wide text-white group-hover:text-[#FFE59E] transition-colors">
                      +91 92234 56789
                    </p>
                  </div>
                </a>

                {/* EMAIL ITEM */}
                <a 
                  href="mailto:mindspace.aisense@gmail.com" 
                  className="flex items-center gap-4 group p-2.5 sm:p-3 rounded-2xl transition-all duration-300 hover:bg-white/10"
                >
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/10 flex items-center justify-center p-2 transition-all duration-300 shadow-sm shrink-0">
                    <img 
                      src={emailIcon} 
                      alt="Email Icon" 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" 
                    />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-emerald-200/60 uppercase font-semibold">Email Us</p>
                    <p className="text-xs sm:text-sm font-medium tracking-wide text-white group-hover:text-[#FFE59E] transition-colors break-all">
                      mindspace.aisense@gmail.com
                    </p>
                  </div>
                </a>

                {/* LOCATION ITEM */}
                <div className="flex items-start gap-4 p-2.5 sm:p-3 rounded-2xl">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/10 flex items-center justify-center p-2 shadow-sm shrink-0 mt-1">
                    <img 
                      src={locationIcon} 
                      alt="Location Icon" 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-emerald-200/60 uppercase font-semibold">Visit Us</p>
                    <p className="text-xs sm:text-sm font-medium leading-relaxed text-white/90">
                      Survey No: 374/1, Gaulkhed Road,<br />
                      Shegaon, Maharashtra 444203
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT SIDE: FORM */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 bg-white flex flex-col justify-center">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-[#2E5B45] rounded-full flex items-center justify-center mb-5 shadow-lg">
                  <MessageSquareCheck className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <h4 className="text-2xl sm:text-3xl font-bold text-[#1B3328] font-serif">Message Sent!</h4>
                <p className="text-xs sm:text-sm text-[#4A5850] mt-2.5 max-w-md">
                  Thank you for contacting us. We have received your query and will get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-5 sm:space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1B3328] mb-1">
                    Send us a Message
                  </h3>
                  <p className="text-xs text-[#6E7D75]">
                    Fill out the form below and we'll respond as soon as possible.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-[#1B3328] mb-1.5 uppercase tracking-wider">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      placeholder="Komal"
                      value={formData.firstName}
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-3 rounded-xl bg-[#F4F6F4] border border-transparent focus:border-[#2E5B45] focus:bg-white text-xs sm:text-sm text-[#1B3328] placeholder-[#8A9E93] outline-none transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-[#1B3328] mb-1.5 uppercase tracking-wider">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      placeholder="Gadge"
                      value={formData.lastName}
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-3 rounded-xl bg-[#F4F6F4] border border-transparent focus:border-[#2E5B45] focus:bg-white text-xs sm:text-sm text-[#1B3328] placeholder-[#8A9E93] outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-[#1B3328] mb-1.5 uppercase tracking-wider">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-3 rounded-xl bg-[#F4F6F4] border border-transparent focus:border-[#2E5B45] focus:bg-white text-xs sm:text-sm text-[#1B3328] placeholder-[#8A9E93] outline-none transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-[#1B3328] mb-1.5 uppercase tracking-wider">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className="w-full px-3.5 py-3 rounded-xl bg-[#F4F6F4] border border-transparent focus:border-[#2E5B45] focus:bg-white text-xs sm:text-sm text-[#1B3328] placeholder-[#8A9E93] outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-[#1B3328] mb-1.5 uppercase tracking-wider">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-3 rounded-xl bg-[#F4F6F4] border border-transparent focus:border-[#2E5B45] focus:bg-white text-xs sm:text-sm text-[#1B3328] outline-none transition-all duration-200"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Partnership / Collaboration">Partnership / Collaboration</option>
                    <option value="Feedback">Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-[#1B3328] mb-1.5 uppercase tracking-wider">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows="3"
                    required
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-3 rounded-xl bg-[#F4F6F4] border border-transparent focus:border-[#2E5B45] focus:bg-white text-xs sm:text-sm text-[#1B3328] placeholder-[#8A9E93] outline-none transition-all duration-200 resize-none"
                  />
                </div>

                {/* FULL WIDTH BUTTON WITH SHARE ICON */}
                <div className="pt-2 flex flex-col items-center justify-center text-center gap-3">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#2E5B45] hover:bg-[#1E4334] text-white text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99] group cursor-pointer"
                  >
                    <span>Send Message</span>
                    <img 
                      src={shareIcon} 
                      alt="Send Icon" 
                      className="w-4 h-4 object-contain transition-transform duration-200 group-hover:translate-x-1" 
                    />
                  </button>

                  <p className="text-xs text-[#6E7D75] font-medium flex items-center justify-center gap-1.5">
                    <img src={shieldIcon} alt="Shield Icon" className="w-4 h-4 object-contain" />
                    <span>Your information is 100% secure.</span>
                  </p>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}