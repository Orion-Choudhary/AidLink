import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer 
      id="contact" 
      style={{ backgroundColor: '#16a34a', color: '#ffffff' }} 
      className="relative text-white py-12 border-t border-black/10 overflow-hidden"
    >
      {/* Dark Translucent Filter Overlay */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 style={{ color: '#ffffff' }} className="text-white text-lg font-bold mb-4">AidLink</h3>
          <p style={{ color: '#ffffff' }} className="text-sm text-white/90 leading-relaxed">
            Connecting resources to real impact. We ensure all NGOs on our platform undergo a strict documentation verification process to ensure your donations go to the right place.
          </p>
        </div>
        <div>
          <h3 style={{ color: '#ffffff' }} className="text-white text-lg font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/directory" style={{ color: '#ffffff' }} className="text-white/90 hover:text-white hover:underline underline-offset-4 transition-colors">Verified NGO Directory</Link></li>
            <li><Link to="/AboutUs" style={{ color: '#ffffff' }} className="text-white/90 hover:text-white hover:underline underline-offset-4 transition-colors">About Us & Verification Process</Link></li>
            <li><Link to="#" style={{ color: '#ffffff' }} className="text-white/90 hover:text-white hover:underline underline-offset-4 transition-colors">Terms of Service</Link></li>
            <li><Link to="#" style={{ color: '#ffffff' }} className="text-white/90 hover:text-white hover:underline underline-offset-4 transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h3 style={{ color: '#ffffff' }} className="text-white text-lg font-bold mb-4">Contact</h3>
          <p style={{ color: '#ffffff' }} className="text-sm text-white/90 mb-2">support@aidlink.com</p>
          <p style={{ color: '#ffffff' }} className="text-sm text-white/90">Admin Office, Tech Park, Level 4</p>
        </div>
      </div>
    </footer>
  );
}