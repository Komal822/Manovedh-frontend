import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, FileText, Lock, PhoneCall, Scale } from 'lucide-react';

export default function TermsAndConditions() {
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
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#1b3328]">Terms and Conditions</h1>
          <p className="text-xs text-[#55635b] mt-1">Last updated: June 30, 2026</p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6 text-xs sm:text-sm text-gray-800 leading-relaxed">
          
          <section>
            <h2 className="font-serif font-bold text-base text-[#12241C] mb-2">1. Acceptance of Terms</h2>
            <p>By accessing or using the Manovedh platform, you agree to be bound by these Terms and Conditions.</p>
          </section>

          <section>
            <h2 className="font-serif font-bold text-base text-[#12241C] mb-2">2. About Manovedh</h2>
            <p className="mb-2">Manovedh is an AI-based mental health screening tool that analyses voice, text, and facial expression patterns to identify indicators associated with mental health conditions.</p>
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-900 font-medium">
              Manovedh is not a medical service. It does not diagnose, treat, or prescribe for any condition. All results must be reviewed by a qualified mental health professional.
            </div>
          </section>

          <section>
            <h2 className="font-serif font-bold text-base text-[#12241C] mb-2">3. Eligibility</h2>
            <p>You must be 18 years or older to use Manovedh independently. Users under 18 may only use the platform with consent from a parent or legal guardian. By registering, you confirm that all information you provide is accurate and truthful.</p>
          </section>

          <section>
            <h2 className="font-serif font-bold text-base text-[#12241C] mb-2">4. Data We Collect</h2>
            <p className="mb-2">Manovedh collects the following data only with your explicit consent:</p>
            <ul className="list-disc pl-5 space-y-1 text-[#4a5850]">
              <li><strong>Voice data:</strong> acoustic features extracted from your speech. Raw audio is deleted within 24 hours.</li>
              <li><strong>Text data:</strong> your typed or spoken responses during a session. Deleted after 6 months.</li>
              <li><strong>Facial expression data:</strong> expression metrics only. No images or video are stored at any point. All processing happens on your device.</li>
            </ul>
            <p className="mt-2 text-xs font-semibold text-[#12241C]">All collected data is anonymised before storage. Your personal identity is never linked to your results.</p>
          </section>

          <section>
            <h2 className="font-serif font-bold text-base text-[#12241C] mb-2">5. How We Use Your Data</h2>
            <p className="mb-2">We use your data to:</p>
            <ul className="list-disc pl-5 space-y-1 text-[#4a5850]">
              <li>Analyse patterns associated with mental health conditions</li>
              <li>Improve AI models used in mental health research</li>
              <li>Generate your screening result</li>
            </ul>
            <p className="mt-2 text-xs font-semibold text-[#12241C]">We do not use your data for advertising, marketing, or any commercial purpose. We do not sell your data to any third party.</p>
          </section>

          <section>
            <h2 className="font-serif font-bold text-base text-[#12241C] mb-2">6. Data Security</h2>
            <p>All data is encrypted using AES-256 encryption. Data is stored and processed within India under the DPDP Act 2023. Access is restricted to authorised researchers only. In the event of a data breach, you will be notified within 72 hours.</p>
          </section>

          <section>
            <h2 className="font-serif font-bold text-base text-[#12241C] mb-2">7. Your Rights</h2>
            <p className="mb-2">Under the Digital Personal Data Protection (DPDP) Act 2023, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 text-[#4a5850]">
              <li>Access your data at any time</li>
              <li>Request correction of inaccurate data</li>
              <li>Withdraw your consent at any time without penalty</li>
              <li>File a complaint with our Data Protection Officer</li>
            </ul>
            <p className="mt-2 text-xs">To exercise any of these rights, contact: <a href="mailto:dpo@mindspace.in" className="text-[#2c5341] font-bold underline">dpo@mindspace.in</a></p>
          </section>

          <section>
            <h2 className="font-serif font-bold text-base text-[#12241C] mb-2">8. Medical Disclaimer</h2>
            <p>Manovedh is a screening tool, not a diagnostic service. Results shown are pattern indicators only, not medical opinions. Do not make any health decisions based solely on Manovedh results. Always consult a qualified mental health professional for diagnosis and treatment.</p>
          </section>

          <section>
            <h2 className="font-serif font-bold text-base text-[#12241C] mb-2">9. Limitations of the Platform</h2>
            <ul className="list-disc pl-5 space-y-1 text-[#4a5850]">
              <li>The AI model may produce inaccurate results.</li>
              <li>A result showing "Normal" does not guarantee you are well.</li>
              <li>A result indicating a condition does not confirm that condition.</li>
              <li>The model has not been validated across all demographics and languages.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif font-bold text-base text-[#12241C] mb-2">10. User Responsibilities</h2>
            <p className="mb-2">By using Manovedh, you agree to:</p>
            <ul className="list-disc pl-5 space-y-1 text-[#4a5850]">
              <li>Provide truthful information</li>
              <li>Not use the platform on behalf of another person without their consent</li>
              <li>Not attempt to misuse, hack, or reverse-engineer the platform</li>
              <li>Seek professional help if your results indicate a concern</li>
            </ul>
          </section>

          <section className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl">
            <div className="flex items-center gap-2 mb-2 text-rose-800 font-bold">
              <ShieldAlert className="w-5 h-5" />
              <span>11. Crisis and Emergency</span>
            </div>
            <p className="text-xs mb-2">If you are in immediate distress, do not rely on Manovedh. Contact:</p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-rose-900 font-medium">
              <li>Tele-MANAS: 14416 (24/7, free)</li>
              <li>iCall: 9152987821</li>
              <li>Emergency: 112</li>
            </ul>
            <p className="text-[11px] text-rose-800 mt-2">In situations of immediate risk to life, Manovedh may contact emergency services as a last resort, in accordance with the Mental Healthcare Act 2017.</p>
          </section>

          <section>
            <h2 className="font-serif font-bold text-base text-[#12241C] mb-2">12. Research Use</h2>
            <p>Your anonymised data may be used for academic mental health research. It will never be used for insurance, employment screening, or any commercial purpose. Research data sharing with external institutions requires your separate, optional consent.</p>
          </section>

          <section>
            <h2 className="font-serif font-bold text-base text-[#12241C] mb-2">13. Changes to These Terms</h2>
            <p>We may update these Terms at any time. You will be notified by email at least 14 days before changes take effect. Continued use of the platform after the effective date constitutes acceptance of the updated Terms.</p>
          </section>

          <section>
            <h2 className="font-serif font-bold text-base text-[#12241C] mb-2">14. Governing Law</h2>
            <p>These Terms are governed by the laws of India, including the DPDP Act 2023, the Mental Healthcare Act 2017, and the Information Technology Act 2000.</p>
          </section>

          <section className="border-t border-black/10 pt-4">
            <h2 className="font-serif font-bold text-base text-[#12241C] mb-2">15. Contact</h2>
            <p>Support: <a href="mailto:support@mindspace.in" className="text-[#2c5341] font-bold underline">support@mindspace.in</a></p>
            <p>Data Protection Officer: <a href="mailto:dpo@mindspace.in" className="text-[#2c5341] font-bold underline">dpo@mindspace.in</a></p>
            <p>Grievances: <a href="mailto:grievance@mindspace.in" className="text-[#2c5341] font-bold underline">grievance@mindspace.in</a> — resolved within 30 days</p>
          </section>

          <div className="pt-4 text-center font-bold text-xs text-[#12241C]">
            By using Manovedh, you confirm that you have read, understood, and agreed to these Terms and Conditions.
          </div>

        </div>

      </div>
    </div>
  );
}