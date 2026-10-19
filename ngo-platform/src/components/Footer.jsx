import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, MapPin, X, FileText } from 'lucide-react';

export default function Footer() {
  const [activeModal, setActiveModal] = useState(null); // 'terms' | 'privacy' | null
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer 
        id="contact" 
        style={{ backgroundColor: '#0e632d', color: '#ffffff' }} 
        className="relative text-white pt-12 pb-8 border-t border-black/10 overflow-hidden"
      >
        {/* Dark Filter Overlay */}
        <div className="absolute inset-0 bg-black/25 pointer-events-none z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-white/15">
            {/* Col 1: About */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo_Aidlink.png" alt="AidLink Logo" className="h-7 w-auto brightness-0 invert" />
                <h3 className="text-xl font-bold tracking-tight text-white">AidLink</h3>
              </div>
              <p className="text-sm text-white/90 leading-relaxed mb-4">
                Connecting resources to verified on-ground impact. We ensure all non-profits on our platform undergo a strict statutory verification process, ensuring relief reaches displaced families transparently.
              </p>
              <div className="flex items-center gap-2 text-xs text-[#b8e2c5]">
                <ShieldCheck size={16} />
                <span>NITI Aayog & FCRA Verified NGO Network</span>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h3 className="text-white text-base font-bold mb-4 tracking-wide uppercase text-xs opacity-90">Quick Links</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/directory" className="text-white/90 hover:text-white hover:underline underline-offset-4 transition-colors">
                    Verified NGO Directory
                  </Link>
                </li>
                <li>
                  <Link to="/AboutUs" className="text-white/90 hover:text-white hover:underline underline-offset-4 transition-colors">
                    About Us &amp; Verification Model
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-white/90 hover:text-white hover:underline underline-offset-4 transition-colors">
                    NGO &amp; Supporter Login
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveModal('terms')}
                    className="text-white/90 hover:text-white hover:underline underline-offset-4 transition-colors text-left cursor-pointer p-0 bg-transparent border-0 font-normal text-sm"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveModal('privacy')}
                    className="text-white/90 hover:text-white hover:underline underline-offset-4 transition-colors text-left cursor-pointer p-0 bg-transparent border-0 font-normal text-sm"
                  >
                    Privacy Policy
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Contact */}
            <div>
              <h3 className="text-white text-base font-bold mb-4 tracking-wide uppercase text-xs opacity-90">Contact &amp; Secretariat</h3>
              <div className="space-y-3 text-sm text-white/90">
                <div className="flex items-start gap-2.5">
                  <Mail size={16} className="shrink-0 mt-0.5 text-[#b8e2c5]" />
                  <a href="mailto:support@aidlink.com" className="hover:underline hover:text-white transition-colors">
                    support@aidlink.com
                  </a>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="shrink-0 mt-0.5 text-[#b8e2c5]" />
                  <p className="leading-relaxed">
                    AidLink National Disaster Coordination Secretariat, New Delhi, India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Copyright Sub-bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/80 gap-3">
            <p>
              &copy; {currentYear} AidLink Foundation. All rights reserved.
            </p>
            <p className="text-white/70">
              Evidence-linked relief tracking &amp; verified humanitarian coordination.
            </p>
          </div>
        </div>
      </footer>

      {/* POLICY & TERMS MODAL */}
      {activeModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="bg-white max-w-lg w-full p-6 shadow-2xl relative rounded-xl border border-gray-200 text-gray-900 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-[#0e632d] font-bold">
                <FileText size={20} />
                <h3 className="text-lg font-bold">
                  {activeModal === 'terms' ? 'Terms of Service' : 'Privacy & Beneficiary Dignity Policy'}
                </h3>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-md text-lg font-bold"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="text-sm text-gray-600 space-y-3 leading-relaxed">
              {activeModal === 'terms' ? (
                <>
                  <p>
                    <strong>1. Platform Purpose:</strong> AidLink serves as an evidence-linked coordination and transparency framework connecting NGOs, volunteers, and supporters during humanitarian crises.
                  </p>
                  <p>
                    <strong>2. Verification Standards:</strong> All NGOs must provide valid documentation (NITI Aayog Darpan ID, 12A/80G certification). AidLink verifies records against regulatory disclosures but does not act as a banking or financial intermediary.
                  </p>
                  <p>
                    <strong>3. Acceptable Use:</strong> Users agree not to submit fraudulent expense receipts, counterfeit beneficiary data, or unauthorized volunteer commitments.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>1. Dignity by Design:</strong> AidLink strictly maintains aggregate beneficiary figures (e.g. households reached, kits distributed) and avoids publishing personally identifiable information of disaster survivors.
                  </p>
                  <p>
                    <strong>2. Data Encryption:</strong> Contact details, passwords, and volunteer identities are secured with industry-standard bcrypt hashing and encrypted data transport.
                  </p>
                  <p>
                    <strong>3. Zero Commercialization:</strong> Donor and volunteer records are never sold, rented, or monetized for commercial advertising.
                  </p>
                </>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 rounded-lg bg-[#0e632d] hover:bg-[#0a4d23] text-white text-xs font-semibold transition-colors"
              >
                Close Disclosure
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}