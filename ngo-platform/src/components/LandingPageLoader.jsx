import React from 'react';

/**
 * LandingPageLoader
 * A custom splash loader featuring a translucent, pulsating AidLink logo and brand name,
 * followed by a smooth cinematic transition into the landing page.
 */
export default function LandingPageLoader({ isExiting }) {
  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isExiting ? 'splash-fade-exit' : 'opacity-100'
      }`}
      style={{
        backgroundColor: '#041d11',
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(14, 99, 45, 0.28) 0%, rgba(4, 29, 17, 0.98) 75%)'
      }}
      aria-label="Loading AidLink"
      role="status"
    >
      {/* Ambient background soft glow rings */}
      <div 
        className="absolute w-96 h-96 rounded-full opacity-30 pointer-events-none blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(46, 204, 113, 0.35) 0%, transparent 70%)' }}
      />

      {/* Pulsating Brand Core */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 aidlink-pulsate select-none">
        
        {/* Translucent Logo Container with soft aura */}
        <div className="relative mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-xl scale-125" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/5 backdrop-blur-md border border-white/15 p-3.5 shadow-2xl flex items-center justify-center">
            <img
              src="/logo_Aidlink.png"
              alt="AidLink"
              className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
            />
          </div>
        </div>

        {/* Brand Name Typography */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display drop-shadow-sm flex items-center gap-1.5">
          <span className="text-white">Aid</span>
          <span className="text-emerald-400">Link</span>
        </h1>

        {/* Subtle breathing tagline */}
        <p className="mt-2 text-xs sm:text-sm font-medium tracking-wide text-emerald-200/70 max-w-xs">
          Where Helping Hands Meet Those In Need
        </p>

        {/* Minimalist ambient loading bar */}
        <div className="mt-6 w-32 h-1 bg-white/10 rounded-full overflow-hidden relative">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 via-emerald-300 to-emerald-500 rounded-full w-1/2 animate-[marquee_1.6s_ease-in-out_infinite]"
            style={{ width: '40%' }}
          />
        </div>

      </div>
    </div>
  );
}
