import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Home, ArrowLeft, ShieldAlert } from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle';

export default function NotFoundPage() {
  usePageTitle('Page Not Found (404)');
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-green-50/50 via-white to-gray-50 px-4 py-16">
      <div className="max-w-xl w-full text-center">
        
        {/* Visual Badge */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#eaf6ee] text-[#0e632d] border border-[#b8e2c5] shadow-sm mb-6 animate-pulse">
          <ShieldAlert size={40} />
        </div>

        {/* Status Code */}
        <span className="block text-sm font-bold uppercase tracking-widest text-[#0e632d] mb-2">
          Error 404 — Route Not Found
        </span>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          The requested page does not exist
        </h1>

        {/* Explanation */}
        <p className="text-base text-gray-600 leading-relaxed mb-8 max-w-md mx-auto">
          The page or relief campaign link you followed may have been updated, relocated, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-5 py-3 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>

          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#0e632d] hover:bg-[#0a4d23] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Home size={16} />
            <span>Return to Home</span>
          </Link>

          <Link
            to="/directory"
            className="w-full sm:w-auto px-5 py-3 rounded-lg bg-[#eaf6ee] hover:bg-[#d8eedf] text-[#0e632d] border border-[#b8e2c5] text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Compass size={16} />
            <span>NGO Directory</span>
          </Link>
        </div>

        {/* Emergency Assistance Note */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-xs text-gray-500">
          Need urgent coordination or technical support? Contact us at{' '}
          <a href="mailto:support@aidlink.com" className="text-[#0e632d] font-semibold hover:underline">
            support@aidlink.com
          </a>
        </div>
      </div>
    </div>
  );
}
