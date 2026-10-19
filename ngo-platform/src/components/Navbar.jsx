import React, { useState } from 'react';

import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ userContext }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  

  return (
    <header className={`w-full z-50 transition-all duration-300 ${
      isHome 
        ? 'absolute top-0 left-0 bg-transparent' 
        : 'sticky top-0 bg-white shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className={`flex items-center gap-2 text-2xl font-bold ${isHome ? 'text-white' : 'text-green-600'}`}>
            <img src="/logo_Aidlink.png" alt="AidLink Logo" className="h-8 w-auto" />
            <span>AidLink</span>
          </Link>


          

          <nav className="hidden md:flex space-x-8">



            {/* About Us Link */}
            <Link 
              to="/AboutUs" 
              className={`font-medium cursor-pointer transition-colors ${
                isHome ? 'text-gray-200 hover:text-white' : 'text-gray-600 hover:text-green-600'
              }`}
            >
              About Us
            </Link>
            <a 
              href="/#campaigns" 
              className={`font-medium cursor-pointer transition-colors ${
                isHome ? 'text-gray-200 hover:text-white' : 'text-gray-600 hover:text-green-600'
              }`}
            >
              Explore Campaigns
            </a>
            
            {/* NGO Directory Link */}
            <Link 
              to="/directory" 
              className={`font-medium cursor-pointer transition-colors ${
                location.pathname === '/directory' || location.pathname === '/ngo-directory'
                  ? 'text-green-600 font-semibold'
                  : isHome ? 'text-gray-200 hover:text-white' : 'text-gray-600 hover:text-green-600'
              }`}
            >
              NGO Directory
            </Link>

            

            {/* Contact Us Link */}
            <a 
              href="#contact" 
              className={`font-medium cursor-pointer transition-colors ${
                isHome ? 'text-gray-200 hover:text-white' : 'text-gray-600 hover:text-green-600'
              }`}
            >
              Contact Us
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            {userContext.isLoggedIn ? (
              <Link to="/dashboard" className="bg-green-100 text-green-700 px-4 py-2 rounded-md font-medium">
                My Dashboard
              </Link>
            ) : (
              <>
                {/* Login Link */}
                <Link 
                  to="/login" 
                  className={`font-medium text-sm transition-colors ${
                    isHome ? 'text-gray-200 hover:text-white' : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  Login
                </Link>
                
                {/* Custom Registration Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                      isHome 
                        ? 'bg-white text-green-700 hover:bg-gray-100' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    Register ▾
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1">
                      <Link to="/register/individual" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b">
                        As Individual (Volunteer/Donate)
                      </Link>
                      <Link to="/register/ngo" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        As NGO (Certified)
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}