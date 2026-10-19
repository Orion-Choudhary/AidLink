import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard, LogOut, HeartHandshake, Building2 } from 'lucide-react';

export default function Navbar({ userContext }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  // Check login status either from prop or localStorage
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const isLoggedIn = Boolean(userContext?.isLoggedIn || token);
  const dashboardPath = userRole === 'NGO' ? '/ngo-dashboard' : '/dashboard';

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname, location.hash]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    setMobileMenuOpen(false);
    navigate('/login');
    window.location.reload();
  };

  const scrollToContact = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const footerContact = document.getElementById('contact');
    if (footerContact) {
      footerContact.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#contact');
    }
  };

  const scrollToCampaigns = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (isHome) {
      const el = document.getElementById('campaigns');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#campaigns');
    }
  };

  return (
    <header className={`w-full z-50 transition-all duration-300 ${
      isHome 
        ? 'absolute top-0 left-0 bg-transparent' 
        : 'sticky top-0 bg-white/95 backdrop-blur-md shadow-xs border-b border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className={`flex items-center gap-2.5 text-2xl font-bold tracking-tight ${isHome ? 'text-white' : 'text-[#0e632d]'}`}>
            <img src="/logo_Aidlink.png" alt="AidLink Logo" className="h-8 w-auto drop-shadow-xs" />
            <span>AidLink</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link 
              to="/AboutUs" 
              className={`text-sm font-semibold transition-colors ${
                location.pathname === '/AboutUs'
                  ? (isHome ? 'text-white border-b-2 border-white pb-1' : 'text-[#0e632d] font-bold')
                  : (isHome ? 'text-gray-100 hover:text-white' : 'text-gray-600 hover:text-[#0e632d]')
              }`}
            >
              About Us
            </Link>

            <a 
              href="/#campaigns" 
              onClick={scrollToCampaigns}
              className={`text-sm font-semibold transition-colors ${
                isHome ? 'text-gray-100 hover:text-white' : 'text-gray-600 hover:text-[#0e632d]'
              }`}
            >
              Explore Campaigns
            </a>
            
            <Link 
              to="/directory" 
              className={`text-sm font-semibold transition-colors ${
                location.pathname === '/directory' || location.pathname === '/ngo-directory'
                  ? (isHome ? 'text-white border-b-2 border-white pb-1' : 'text-[#0e632d] font-bold')
                  : (isHome ? 'text-gray-100 hover:text-white' : 'text-gray-600 hover:text-[#0e632d]')
              }`}
            >
              NGO Directory
            </Link>

            <a 
              href="#contact" 
              onClick={scrollToContact}
              className={`text-sm font-semibold transition-colors ${
                isHome ? 'text-gray-100 hover:text-white' : 'text-gray-600 hover:text-[#0e632d]'
              }`}
            >
              Contact Us
            </a>
          </nav>

          {/* Desktop Auth / Action Area */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link 
                  to={dashboardPath} 
                  className="bg-[#eaf6ee] text-[#0e632d] hover:bg-[#d8eedf] border border-[#b8e2c5] px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className={`text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex items-center gap-1 ${
                    isHome ? 'text-white/80 hover:text-white bg-white/10 hover:bg-white/20' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                  }`}
                  title="Sign out"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`text-sm font-semibold transition-colors ${
                    isHome ? 'text-gray-100 hover:text-white' : 'text-gray-700 hover:text-[#0e632d]'
                  }`}
                >
                  Login
                </Link>
                
                {/* Custom Registration Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition shadow-xs flex items-center gap-1 cursor-pointer ${
                      isHome 
                        ? 'bg-white text-[#0e632d] hover:bg-gray-100' 
                        : 'bg-[#0e632d] text-white hover:bg-[#0a4d23]'
                    }`}
                  >
                    <span>Register</span>
                    <span className="text-xs">▾</span>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50">
                      <Link 
                        to="/register/individual" 
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-[#eaf6ee] hover:text-[#0e632d] border-b border-gray-50 transition-colors"
                      >
                        <HeartHandshake size={16} className="text-[#0e632d]" />
                        <div>
                          <div>As Individual</div>
                          <div className="text-[10px] text-gray-400 font-normal">Volunteer or donate</div>
                        </div>
                      </Link>
                      <Link 
                        to="/register/ngo" 
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-[#eaf6ee] hover:text-[#0e632d] transition-colors"
                      >
                        <Building2 size={16} className="text-[#0e632d]" />
                        <div>
                          <div>As Certified NGO</div>
                          <div className="text-[10px] text-gray-400 font-normal">Darpan verified portal</div>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isHome ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-lg border-b border-gray-200 shadow-xl px-4 pt-3 pb-6 animate-fade-in text-gray-900">
          <nav className="flex flex-col space-y-3 pb-4 border-b border-gray-100 text-sm font-semibold">
            <Link 
              to="/AboutUs" 
              className="px-3 py-2 rounded-md hover:bg-green-50 hover:text-[#0e632d] text-gray-800 transition-colors"
            >
              About Us
            </Link>
            <a 
              href="/#campaigns" 
              onClick={scrollToCampaigns}
              className="px-3 py-2 rounded-md hover:bg-green-50 hover:text-[#0e632d] text-gray-800 transition-colors"
            >
              Explore Campaigns
            </a>
            <Link 
              to="/directory" 
              className="px-3 py-2 rounded-md hover:bg-green-50 hover:text-[#0e632d] text-gray-800 transition-colors"
            >
              NGO Directory
            </Link>
            <a 
              href="#contact" 
              onClick={scrollToContact}
              className="px-3 py-2 rounded-md hover:bg-green-50 hover:text-[#0e632d] text-gray-800 transition-colors"
            >
              Contact Us
            </a>
          </nav>

          {/* Mobile Auth Actions */}
          <div className="pt-4 flex flex-col gap-2.5">
            {isLoggedIn ? (
              <>
                <Link
                  to={dashboardPath}
                  className="w-full py-2.5 px-4 bg-[#0e632d] hover:bg-[#0a4d23] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <LayoutDashboard size={16} />
                  <span>Open Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 px-4 border border-red-200 bg-red-50 text-red-600 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Logout of Session</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full py-2.5 px-4 border border-gray-200 bg-gray-50 text-gray-800 rounded-lg text-sm font-semibold flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  Login to Account
                </Link>
                <Link
                  to="/register/individual"
                  className="w-full py-2.5 px-4 bg-[#0e632d] hover:bg-[#0a4d23] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <HeartHandshake size={16} />
                  <span>Register as Individual</span>
                </Link>
                <Link
                  to="/register/ngo"
                  className="w-full py-2.5 px-4 bg-[#eaf6ee] hover:bg-[#d8eedf] text-[#0e632d] border border-[#b8e2c5] rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Building2 size={15} />
                  <span>Register Certified NGO</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}