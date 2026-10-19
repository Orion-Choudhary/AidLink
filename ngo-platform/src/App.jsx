import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import LandingPageLoader from './components/LandingPageLoader';

// Lazy load route pages for performance & minimal initial bundle size
const LandingPage = lazy(() => import('./pages/LandingPage'));
const NgoDirectoryPage = lazy(() => import('./pages/NgoDirectoryPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const NgoForm = lazy(() => import('./pages/NgoForm'));
const NgoPendingVerification = lazy(() => import('./pages/NgoPendingVerification'));
const SupporterForm = lazy(() => import('./pages/SupporterForm'));
const AidLinkAboutUs = lazy(() => import('./pages/AidLinkAboutUs'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const NGODashboard = lazy(() => import('./pages/Dashboard/NGODashboard'));
const SupporterDashboard = lazy(() => import('./pages/Dashboard/SupporterDashboard'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Layout wrapper that controls visibility of public Navbar and Footer
function LayoutWrapper({ userContext, children }) {
  const location = useLocation();
  
  // Hide public Navbar and Footer on full dashboards
  const isDashboard =
    location.pathname.startsWith('/ngo-dashboard') ||
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/volunteer-dashboard') ||
    location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full overflow-x-hidden">
      {!isDashboard && <Navbar userContext={userContext} />}
      
      <main className="flex-grow w-full">
        <Suspense fallback={<LandingPageLoader />}>
          {children}
        </Suspense>
      </main>
      
      {!isDashboard && <Footer />}
    </div>
  );
}

export default function App() {
  const [userContext, setUserContext] = useState(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    return {
      isLoggedIn: Boolean(token),
      role: role || null,
    };
  });

  // Listen for storage events (e.g. login/logout in other tabs or actions)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('userRole');
      setUserContext({
        isLoggedIn: Boolean(token),
        role: role || null,
      });
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
          {/* Custom 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}