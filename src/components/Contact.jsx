import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageSquare } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you ${formData.firstName}! Your message has been sent successfully.`);
    setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
  };

  return (
    <section id="contact" className="w-full bg-[#f8f6f0] py-20 px-5 sm:px-10 lg:px-16 font-sans text-[#1b3328] relative overflow-hidden">
      
      {/* HEADER SECTION */}
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e8e3d5]/80 text-[#2e5b45] text-[12px] font-bold uppercase tracking-widest border border-black/5">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>CONTACT MANOVEDH</span>
        </div>

        <h2 
          className="text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-[#1b3328] leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Let's talk about your <br className="hidden sm:inline" /> project.
        </h2>

        <p className="text-[#5a6a61] text-[15px] sm:text-[17px] max-w-xl mx-auto leading-relaxed">
          Have a question, feedback, or support request? Send a message and we'll get back to you soon.
        </p>
      </div>

      {/* MAIN CONTACT CARD */}
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl shadow-black/5 border border-black/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* LEFT PANEL: CONTACT INFORMATION */}
        <div 
          className="lg:col-span-5 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden"
          style={{ background: "linear-gradient(160deg, #1b3328, #0e2018)" }}
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#2e5b45]/30 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Contact Information
            </h3>
            <p className="text-emerald-100/70 text-[14px] leading-relaxed">
              Reach out anytime. We're here to help you build a calmer digital space.
            </p>
          </div>

          <div className="space-y-6 my-10 relative z-10 text-[14px] font-medium text-emerald-50">
            {/* Phone Link */}
            <a 
              href="tel:+919223456789" 
              className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2e5b45]/60 text-emerald-200 group-hover:scale-110 transition-transform">
                <Phone className="w-4 h-4" />
              </span>
              <span>+91 9223456789</span>
            </a>

            {/* Email Link */}
            <a 
              href="mailto:mindspace.aisense@gmail.com" 
              className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2e5b45]/60 text-emerald-200 group-hover:scale-110 transition-transform">
                <Mail className="w-4 h-4" />
              </span>
              <span className="truncate">mindspace.aisense@gmail.com</span>
            </a>

            {/* Address */}
            <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2e5b45]/60 text-emerald-200">
                <MapPin className="w-4 h-4" />
              </span>
              <div className="text-[13px] leading-snug text-emerald-100/90">
                Survey No: 374/1, Gaulkhed Road, <br />
                Shegaon, Maharashtra 444203
              </div>
            </div>
          </div>

          <div className="text-[12px] text-emerald-200/50 relative z-10">
            © 2026 Manovedh AI.
          </div>
        </div>

        {/* RIGHT PANEL: INPUT FORM */}
        <div className="lg:col-span-7 p-8 sm:p-12 bg-white flex flex-col justify-between">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#1b3328]">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#f4f6f3] text-[#1b3328] placeholder-[#94a39b] px-4 py-3 rounded-xl border border-transparent focus:border-[#2e5b45] focus:bg-white focus:outline-none transition-all text-[14px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#1b3328]">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#f4f6f3] text-[#1b3328] placeholder-[#94a39b] px-4 py-3 rounded-xl border border-transparent focus:border-[#2e5b45] focus:bg-white focus:outline-none transition-all text-[14px]"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#1b3328]">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#f4f6f3] text-[#1b3328] placeholder-[#94a39b] px-4 py-3 rounded-xl border border-transparent focus:border-[#2e5b45] focus:bg-white focus:outline-none transition-all text-[14px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-[#1b3328]">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+919223456789"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-[#f4f6f3] text-[#1b3328] placeholder-[#94a39b] px-4 py-3 rounded-xl border border-transparent focus:border-[#2e5b45] focus:bg-white focus:outline-none transition-all text-[14px]"
                />
              </div>
            </div>

            {/* Message Box */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#1b3328]">Message</label>
              <textarea
                name="message"
                rows="4"
                placeholder="Write your message..."
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full bg-[#f4f6f3] text-[#1b3328] placeholder-[#94a39b] px-4 py-3 rounded-xl border border-transparent focus:border-[#2e5b45] focus:bg-white focus:outline-none transition-all text-[14px] resize-none"
              />
            </div>

            {/* Submit Button & Note */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#3b6e56] to-[#1b3328] hover:from-[#2e5b45] hover:to-[#0e2018] text-white px-8 py-3.5 rounded-full font-bold text-[14px] shadow-lg shadow-[#1b3328]/20 hover:scale-[1.02] active:scale-95 transition-all duration-300"
              >
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </button>

              <span className="text-[12px] text-[#829188] font-medium">
                We usually reply within 24–48 hours.
              </span>
            </div>

          </form>
        </div>

      </div>
    </section>
  );
}