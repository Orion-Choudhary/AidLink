import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import NgoForm from './pages/NgoForm';
import NgoPendingVerification from './pages/NgoPendingVerification';
import SupporterForm from './pages/SupporterForm';
import ScrollToTop from './components/ScrollToTop';
import AidLinkAboutUs from './pages/AidLinkAboutUs';
import AdminDashboard from "./pages/AdminDashboard";
import NGODashboard from './pages/Dashboard/NGODashboard';
import SupporterDashboard from './pages/Dashboard/SupporterDashboard';
import NgoDirectoryPage from './pages/NgoDirectoryPage';

// 1. Layout wrapper that controls visibility of public Navbar and Footer
function LayoutWrapper({ userContext, children }) {
  const location = useLocation();
  
  // 2. Hide public Navbar and Footer on dashboards
  const isDashboard =
    location.pathname.startsWith('/ngo-dashboard') ||
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/volunteer-dashboard') ||
    location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!isDashboard && <Navbar userContext={userContext} />}
      
      <main className="flex-grow">
        {children}
      </main>
      
      {!isDashboard && <Footer />}
    </div>
  );
}

export default function App() {
  const [userContext, setUserContext] = useState({
    isLoggedIn: false,
    role: null, 
  });

  return (
    <Router>
      <ScrollToTop />
      <LayoutWrapper userContext={userContext}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/directory" element={<NgoDirectoryPage />} />
          <Route path="/ngo-directory" element={<NgoDirectoryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register/ngo" element={<NgoForm />} />
          <Route path="/register/individual" element={<SupporterForm />} />
          <Route path="/ngo-pending-verification" element={<NgoPendingVerification />} />
          <Route path="/AboutUs" element={<AidLinkAboutUs />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/ngo-dashboard" element={<NGODashboard />} />
          <Route path="/dashboard" element={<SupporterDashboard />} />
          <Route path="/volunteer-dashboard" element={<SupporterDashboard />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}