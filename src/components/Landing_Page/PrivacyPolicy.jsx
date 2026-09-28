import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, UserCheck, Database, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#12241C] flex flex-col items-center py-8 px-4 sm:px-6 font-sans">
      
      {/* Top Header / Navigation */}
      <div className="w-full max-w-4xl mb-6 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-semibold backdrop-blur-md transition-all shadow-lg cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className="text-xs font-semibold px-3 py-1 bg-white/10 text-[#ffd700] rounded-full border border-white/10 backdrop-blur-md">
          Legal & Compliance
        </span>
      </div>

      {/* Main Content Box */}
      <div className="w-full max-w-4xl bg-[#ECE7DE] rounded-[32px] shadow-2xl p-6 sm:p-10 border border-[#2e5b45]/25 text-[#1b3328]">
        
        {/* Title Section */}
        <div className="border-b border-black/10 pb-6 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#1e3d30] flex items-center justify-center text-[#ffd700] mb-3 shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#1b3328]">Privacy Policy</h1>
          <p className="text-xs text-[#55635b] mt-1">Last updated: June 30, 2026</p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6 text-xs sm:text-sm text-gray-800 leading-relaxed">
          
          <section>
            <h2 className="font-serif font-bold text-base text-[#12241C] mb-2">1. Overview</h2>
            <p className="mb-2">
              Manovedh ("we", "our", "us") is an AI-assisted wellness screening and support platform. This Privacy Policy explains how we collect, use, store, and protect your personal data in compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act 2023) and the Information Technology (Reasonable Security Practices and Procedures) Rules, 2011.
            </p>
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-900 font-medium">
              Important: Manovedh is a digital well-being support platform. It is not a replacement for emergency care or professional medical treatment.
            </div>
          </section>

          <section>
            <h2 className="font-serif font-bold text-base text-[#12241C] mb-2">2. Data We Collect</h2>
            
            <div className="space-y-3 mt-2">
              <div className="p-3 bg-white/70 backdrop-blur-md rounded-2xl border border-black/5 shadow-sm">
                <h3 className="font-bold text-xs text-[#12241C] mb-1">2.1 Personal Information</h3>
                <ul className="list-disc pl-5 space-y-0.5 text-[#4a5850]">
                  <li>Name, email address, phone number</li>
                  <li>Date of birth, gender, state/district, address</li>
                  <li>Profile avatar preference</li>
                </ul>
              </div>

              <div className="p-3 bg-white/70 backdrop-blur-md rounded-2xl border border-black/5 shadow-sm">
                <h3 className="font-bold text-xs text-[#12241C] mb-1">2.2 Sensitive Personal Data</h3>
                <ul className="list-disc pl-5 space-y-0.5 text-[#4a5850]">
                  <li>Mental health screening scores and prediction labels</li>
                  <li>Voice recordings (deleted within 24 hours of processing)</li>
                  <li>Facial expression video (deleted immediately after feature extraction)</li>
                  <li>Text responses to wellness scenarios</li>
                  <li>Chat messages with counselors and AI chatbot</li>
                  <li>Breathing and movement activity session data</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif font-bold text-base text-[#12241C] mb-2">3. Legal Basis for Processing</h2>
            <p>
              We process your personal data based on your explicit consent, which you provide through our granular consent form covering text, voice, and facial expression processing separately. You may withdraw consent at any time.
            </p>
          </section>

          <section>
            <h2 className="font-serif font-bold text-base text-[#12241C] mb-2">4. Your Rights Under DPDP Act 2023</h2>
            <ul className="list-disc pl-5 space-y-1 text-[#4a5850]">
              <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to Correction:</strong> Update inaccurate or incomplete data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your data (within 30 days)</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a machine-readable format</li>
              <li><strong>Right to Grievance Redressal:</strong> File a complaint with our Data Protection Officer</li>
              <li><strong>Right to Breach Notification:</strong> Be informed of any data breach affecting your data</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif font-bold text-base text-[#12241C] mb-2">5. Data Retention</h2>
            <ul className="list-disc pl-5 space-y-1 text-[#4a5850]">
              <li>Raw audio recordings: Deleted within 24 hours of processing</li>
              <li>Raw video footage: Discarded immediately after numerical feature extraction</li>
              <li>Text responses: 6 months, then anonymized</li>
              <li>Anonymized feature vectors: Up to 5 years for research purposes</li>
              <li>Account data: Retained until account deletion request</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif font-bold text-base text-[#12241C] mb-2">6. Data Security</h2>
            <p className="mb-2">We implement the following security measures:</p>
            <ul className="list-disc pl-5 space-y-1 text-[#4a5850]">
              <li>Encrypted data transmission via HTTPS/TLS</li>
              <li>PBKDF2 password hashing</li>
              <li>Rate limiting on authentication endpoints</li>
              <li>Input sanitization and XSS protection</li>
              <li>Role-based access control</li>
              <li>Audit logging of all data access events</li>
              <li>Content Security Policy (CSP) headers</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif font-bold text-base text-[#12241C] mb-2">7. Data Sharing & Cross-Border Transfer</h2>
            <p>
              Your data may be processed by our third-party AI analysis providers for the purpose of generating wellness predictions. These providers are contractually bound to comply with DPDP Act 2023 data protection requirements. All data transfers outside India are governed by Section 16 of the DPDP Act 2023 with appropriate safeguards.
            </p>
          </section>

          <section>
            <h2 className="font-serif font-bold text-base text-[#12241C] mb-2">8. Children's Data</h2>
            <p>
              Manovedh is intended for users aged 18 and above. We do not knowingly collect data from children under 18 without verifiable parental consent. If you believe a child has provided us with personal data, please contact our Data Protection Officer immediately.
            </p>
          </section>

          <section className="border-t border-black/10 pt-4">
            <h2 className="font-serif font-bold text-base text-[#12241C] mb-2">9. Contact & Grievance Redressal</h2>
            <p className="font-semibold text-[#12241C] mb-1">Data Protection Officer (DPO):</p>
            <p>Email: <a href="mailto:dpo@mindspace.local" className="text-[#2c5341] font-bold underline">dpo@mindspace.local</a></p>
            <p>Phone: +91-XXX-XXXXXXX</p>
            <p className="mt-1">Response time: Within 30 days</p>
            <p className="mt-2 text-xs text-[#55635b]">
              <strong>Escalation:</strong> If your grievance is not resolved to your satisfaction, you may escalate to the Data Protection Board of India.
            </p>
          </section>

          <section className="border-t border-black/10 pt-4">
            <h2 className="font-serif font-bold text-base text-[#12241C] mb-2">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes via email or through the platform.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}