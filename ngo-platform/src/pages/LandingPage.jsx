import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingPageLoader from '../components/LandingPageLoader';
import usePageTitle from '../hooks/usePageTitle';

// --- ANIMATED COUNTER COMPONENT ---
const AnimatedCounter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [target, duration]);

  return <>{count.toLocaleString()}+</>;
};

export default function LandingPage() {
  usePageTitle('Transparent Disaster Relief & NGO Accountability');
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState('');
  const [initiatives, setInitiatives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [isExitingSplash, setIsExitingSplash] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fullText = "Where Helping Hands Meet Those In Need";

  useEffect(() => {
    let currentText = '';

    const type = () => {
      if (currentText.length < fullText.length) {
        currentText = fullText.substring(0, currentText.length + 1);
        setTypedText(currentText);
        setTimeout(type, 80); 
      }
    };

    const timer = setTimeout(type, 500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch strictly REAL live campaigns and workshops from backend (NO MOCK DATA)
  useEffect(() => {
    const splashStartTime = Date.now();

    const fetchRealData = async (isInitial = false) => {
      if (isInitial) setIsLoading(true);
      try {
        const [cRes, wRes] = await Promise.all([
          fetch('http://localhost:5000/api/campaigns').then(r => r.ok ? r.json() : []).catch(() => []),
          fetch('http://localhost:5000/api/workshops').then(r => r.ok ? r.json() : []).catch(() => [])
        ]);

        const formattedCamps = (cRes || []).filter(c => c.status === 'active' || !c.status).map(c => ({
          id: `camp-${c.id}`,
          type: 'campaign',
          title: c.name,
          disaster: c.disaster || 'Disaster Relief',
          region: c.region || 'On-ground',
          objective: c.objective || 'Active disaster response operations and community relief.',
          org_name: c.org_name || 'Verified NGO',
          target: `${(c.target_households || c.targetHouseholds || 1000).toLocaleString('en-IN')} Households`,
          progress: c.progress || 50,
          isUrgent: Boolean(c.is_urgent || c.isUrgent),
          actionLabel: 'Volunteer / Donate'
        }));

        const formattedWs = (wRes || []).map(w => {
          const rawCap = parseInt(w.target_capacity, 10);
          const capacity = Number.isFinite(rawCap) && rawCap > 0 ? rawCap : 50;
          const registered = Math.max(0, parseInt(w.registered_count, 10) || 0);
          const progressPct = capacity > 0 ? Math.min(100, Math.max(0, Math.round((registered / capacity) * 100))) : 0;
          const seatsRemaining = Math.max(0, capacity - registered);

          return {
            id: `ws-${w.id}`,
            rawId: w.id,
            type: 'workshop',
            title: w.title,
            disaster: 'Open Workshop',
            region: w.location ? `${w.location}, ${w.city || ''}`.replace(/,\s*$/, '') : (w.city || 'Patiala'),
            date: w.date,
            time: w.time,
            objective: w.description || 'Community skill development and disaster response training.',
            org_name: w.org_name || 'Verified NGO',
            capacity,
            registeredCount: registered,
            seatsRemaining,
            target: `${registered} / ${capacity} seats (${progressPct}% filled)`,
            progress: progressPct,
            isUrgent: false,
            actionLabel: seatsRemaining === 0 ? 'Fully Booked' : 'Register for Workshop'
          };
        });

        const combined = [...formattedCamps, ...formattedWs];
        setInitiatives(combined);
      } catch (err) {
        console.error("Could not fetch real initiatives:", err);
      } finally {
        if (isInitial) {
          setIsLoading(false);
          // Graceful display duration (min 2200ms) for the custom pulsating loader
          const elapsed = Date.now() - splashStartTime;
          const remaining = Math.max(0, 2200 - elapsed);
          setTimeout(() => {
            setIsExitingSplash(true);
            setTimeout(() => {
              setShowSplash(false);
            }, 800);
          }, remaining);
        }
      }
    };

    fetchRealData(true);
    const interval = setInterval(() => fetchRealData(false), 15000);
    return () => clearInterval(interval);
  }, []);

  const handleActionClick = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (token) {
      navigate(role === 'NGO' ? '/ngo-dashboard' : '/dashboard');
    } else {
      navigate('/register/individual'); 
    }
  };

  return (
    <div className="relative">
      {/* Custom Brand Pulsating Splash Loader */}
      {showSplash && <LandingPageLoader isExiting={isExitingSplash} />}

      {/* IMMERSIVE HERO SECTION */}
      <section 
        className="relative w-full h-screen min-h-[750px] flex flex-col bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url('/hero1.jpeg')` }}
      >
        {/* Green Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/95 via-green-900/70 to-transparent z-0"></div>

        {/* URGENT EMERGENCY TICKER */}
        <div className="relative z-20 pt-24"> 
          <div className="bg-transparent text-white overflow-hidden py-2 flex items-center">
            <div className="whitespace-nowrap animate-marquee font-medium text-sm tracking-wide text-white">
              <span 
                onClick={() => navigate('/register/individual')}
                style={{ color: '#ffffff' }}
                className="mx-8 cursor-pointer text-white hover:text-green-300 hover:underline transition-colors drop-shadow-md"
              >
                URGENT: Flash Floods Relief - Food and Clean Water Donations Required Immediately →
              </span>
              <span 
                onClick={() => navigate('/register/individual')}
                style={{ color: '#ffffff' }}
                className="mx-8 cursor-pointer text-white hover:text-green-300 hover:underline transition-colors drop-shadow-md"
              >
                EMERGENCY: Landslide in Northern Region - On-ground Medical Volunteers Needed →
              </span>
            </div>
          </div>
        </div>

        {/* Content Container (Tagline & Inline Stats) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow flex flex-col justify-center pb-32">
          
          {/* Animated, Interactive Tagline */}
          <div className="min-h-[120px] md:min-h-[140px] flex items-end mb-6">
            <h1 
              style={{ color: '#ffffff' }} 
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white cursor-default max-w-3xl drop-shadow-md"
            >
              {typedText}
            </h1>
          </div>
          
          {/* Inline Impact Metrics */}
          <div className="flex flex-wrap items-center gap-6 md:gap-10">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-white drop-shadow">
                <AnimatedCounter target={50} />
              </p>
              <p className="text-green-200 text-xs md:text-sm mt-1 uppercase tracking-wider font-semibold">Certified NGOs</p>
            </div>
            
            <div className="hidden md:block w-px h-12 bg-white/30"></div> 
            
            <div>
              <p className="text-3xl md:text-4xl font-bold text-white drop-shadow">
                <AnimatedCounter target={10000} duration={2500} />
              </p>
              <p className="text-green-200 text-xs md:text-sm mt-1 uppercase tracking-wider font-semibold">Items Donated</p>
            </div>
            
            <div className="hidden md:block w-px h-12 bg-white/30"></div> 
            
            <div>
              <p className="text-3xl md:text-4xl font-bold text-white drop-shadow">
                <AnimatedCounter target={5000} duration={2200} />
              </p>
              <p className="text-green-200 text-xs md:text-sm mt-1 uppercase tracking-wider font-semibold">Volunteer Hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Traffic Controller Gateways */}
      <section className="pt-8 pb-12 bg-white sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 mt-4 text-center sm:mt-6 sm:grid-cols-2 sm:gap-x-12 gap-y-12 md:gap-0">
            
            {/* Volunteer & Donate Column */}
            <div className="md:p-8 lg:p-14 flex flex-col items-center">
              <img 
                src="/png1.png" 
                alt="Volunteer" 
                loading="lazy"
                className="h-20 w-20 mb-2 object-contain" 
              />
              <h3 className="mt-8 text-2xl font-bold text-gray-900">Volunteer & Donate</h3>
              <p className="mt-5 text-base text-gray-600 max-w-sm">
                Make a direct impact. Join our community to donate physical goods, volunteer your time on-ground, or participate in workshops.
              </p>
              <button 
                onClick={() => navigate('/register/individual')} 
                className="mt-8 text-green-600 font-bold hover:text-green-700 hover:underline transition-colors flex items-center gap-1 cursor-pointer"
              >
                Register as Individual <span aria-hidden="true">→</span>
              </button>
            </div>

            {/* Register NGO Column */}
            <div className="md:p-8 lg:p-14 md:border-l md:border-gray-200 flex flex-col items-center">
              <img 
                src="/png2.png" 
                alt="NGO" 
                loading="lazy"
                className="h-20 w-20 mb-2 object-contain" 
              />
              <h3 className="mt-8 text-2xl font-bold text-gray-900">Register NGO</h3>
              <p className="mt-5 text-base text-gray-600 max-w-sm">
                Are you a certified NGO? Register your organization to post resource campaigns, organize workshops, and connect with volunteers.
              </p>
              <button 
                onClick={() => navigate('/register/ngo')} 
                className="mt-8 text-green-600 font-bold hover:text-green-700 hover:underline transition-colors flex items-center gap-1 cursor-pointer"
              >
                Register Organization <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Make A Difference (Real Campaigns & Workshops) Section */}
      <section id="campaigns" className="relative py-12 lg:py-16 bg-cover bg-center" style={{ backgroundImage: `url('/make.jpg')` }}>
        {/* Dark Overlay with subtle green undertone */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-emerald-950/80 to-black/90 z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <h2 style={{ color: '#ffffff' }} className="text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                Make A Difference...
              </h2>
              <p style={{ color: '#ffffff' }} className="text-white text-xs md:text-sm mt-1.5 opacity-90">
                Real disaster relief initiatives and community workshops organized by registered NGOs on AidLink.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div style={{ color: '#ffffff' }} className="py-12 text-center text-white font-medium">
              Loading active initiatives...
            </div>
          ) : initiatives.length === 0 ? (
            <div className="p-10 text-center border border-[#b8e2c5]/30 rounded-[10px] bg-black/40 text-white">
              <p style={{ color: '#ffffff' }} className="text-base font-semibold text-white">No campaigns or workshops active right now</p>
              <p style={{ color: '#eaf6ee' }} className="text-xs text-[#eaf6ee]/80 mt-1">Freshly published initiatives by verified NGOs will appear here.</p>
            </div>
          ) : (
            /* 3-Column Responsive Grid with Clean Operational Card Layout */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {initiatives.map((item) => {
                const isWorkshop = item.type === 'workshop';
                return (
                  <div 
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="bg-white p-5 sm:p-6 shadow-sm hover:shadow-md flex flex-col justify-between rounded-[10px] transition-all cursor-pointer border border-[#0e632d]/15 hover:border-[#0e632d]/40 group min-h-[250px] text-gray-900"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded uppercase tracking-wider bg-[#eaf6ee] text-[#0e632d] border border-[#b8e2c5]/70">
                          {item.disaster}
                        </span>
                        {item.isUrgent && (
                          <span className="text-[11px] font-semibold px-2.5 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded">
                            Urgent Priority
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-base md:text-lg text-gray-900 mb-1.5 leading-snug group-hover:text-[#0e632d] transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-gray-500 mb-3">
                        <span className="inline-flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{item.region}</span>
                        </span>
                        <span className="text-gray-300" aria-hidden="true">•</span>
                        <span className="font-medium text-[#0e632d]">By {item.org_name}</span>
                      </div>

                      <p className="text-xs md:text-[13px] text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                        {item.objective}
                      </p>
                    </div>
                    
                    <div className="mt-auto pt-3.5 border-t border-gray-100">
                      <div className="flex justify-between items-center text-xs text-gray-600 mb-1.5 font-medium">
                        <span className="text-gray-500">{isWorkshop ? 'Capacity' : 'Target'}</span>
                        <span className="font-semibold text-gray-800">{item.target}</span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 mb-3.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-[#0e632d] transition-all duration-300" 
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(item);
                        }}
                        disabled={isWorkshop && item.seatsRemaining === 0}
                        className={`w-full h-10 py-2.5 px-4 text-xs font-semibold rounded-md transition-colors flex items-center justify-center cursor-pointer shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0e632d] ${
                          isWorkshop && item.seatsRemaining === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                            : 'text-white bg-[#0e632d] hover:bg-[#0a4d23]'
                        }`}
                      >
                        {item.actionLabel}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* "More..." Button */}
          <div className="mt-6 flex justify-end">
            <button 
              onClick={() => {
                const token = localStorage.getItem('token');
                const role = localStorage.getItem('userRole');
                if (token) {
                  navigate(role === 'NGO' ? '/ngo-dashboard' : '/dashboard');
                } else {
                  navigate('/register/individual');
                }
              }} 
              style={{ color: '#ffffff' }}
              className="text-white hover:text-emerald-400 font-bold text-sm md:text-base transition-colors flex items-center gap-1 drop-shadow-md cursor-pointer"
            >
              Explore all &amp; Participate <span aria-hidden="true">→</span>
            </button>
          </div>

        </div>
      </section>

      {/* DETAIL INFO MODAL (Clicking Action Leads to Register Page) */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-white max-w-lg w-full p-6 shadow-xl relative border border-gray-200 rounded-[10px] text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold px-2.5 py-1 uppercase tracking-wider rounded bg-[#eaf6ee] text-[#0e632d] border border-[#b8e2c5]/70">
                {selectedItem.disaster}
              </span>
              <button 
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-gray-700 p-1 text-lg font-bold"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight">
              {selectedItem.title}
            </h3>
            <p className="text-xs text-[#0e632d] font-semibold mb-3">
              Organized by {selectedItem.org_name || 'Verified NGO Partner'}
            </p>

            <div className="bg-gray-50 p-3.5 rounded-md border border-gray-200 mb-4 text-xs space-y-1.5 text-gray-700">
              <p><span className="font-semibold text-gray-900">Location / Region:</span> {selectedItem.region}</p>
              {selectedItem.date && <p><span className="font-semibold text-gray-900">Date &amp; Time:</span> {selectedItem.date} {selectedItem.time ? `(${selectedItem.time})` : ''}</p>}
              <p><span className="font-semibold text-gray-900">Capacity / Target:</span> {selectedItem.target}</p>
            </div>

            <div className="mb-5">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Overview &amp; Objectives</h4>
              <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                {selectedItem.objective}
              </p>
            </div>

            <div className="p-3 bg-[#eaf6ee] border border-[#b8e2c5]/60 rounded-md text-xs text-[#0e632d] mb-5">
              Note: You must register with AidLink to participate on ground, volunteer, or access NGO workflows.
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="w-full sm:w-auto px-4 py-2.5 text-xs md:text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Close
              </button>

              {selectedItem.type === 'workshop' ? (
                <button
                  type="button"
                  onClick={handleActionClick}
                  className="w-full sm:flex-1 py-2.5 text-xs md:text-sm font-semibold text-white bg-[#0e632d] hover:bg-[#0a4d23] rounded-md transition-colors"
                >
                  Register for Workshop →
                </button>
              ) : (
                <div className="w-full sm:flex-1 flex gap-2">
                  <button
                    type="button"
                    onClick={handleActionClick}
                    className="flex-1 py-2.5 text-xs md:text-sm font-semibold text-[#0e632d] bg-[#eaf6ee] hover:bg-[#d8eedf] border border-[#b8e2c5] rounded-md transition-colors"
                  >
                    Volunteer Now →
                  </button>
                  <button
                    type="button"
                    onClick={handleActionClick}
                    className="flex-1 py-2.5 text-xs md:text-sm font-semibold text-white bg-[#0e632d] hover:bg-[#0a4d23] rounded-md transition-colors"
                  >
                    Donate Funds →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}