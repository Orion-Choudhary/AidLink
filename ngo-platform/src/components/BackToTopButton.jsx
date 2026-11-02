import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useLenis } from 'lenis/react';

/**
 * Floating Back-To-Top button that pops up when reaching the bottom of the page,
 * smoothly gliding the viewport back to the top upon click.
 */
export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Directly subscribe to Lenis scroll frame updates for instant reaction
  useLenis((lenis) => {
    const scrollY = lenis.scroll;
    const limit = lenis.limit; // total scrollable distance: scrollHeight - clientHeight
    const distanceFromBottom = limit - scrollY;

    // Show when user has scrolled down and reaches near the bottom of the page (within 850px of bottom or >60% of page)
    const nearBottom = scrollY > 400 && (distanceFromBottom < 850 || (limit > 0 && scrollY / limit > 0.6));
    setIsVisible(nearBottom);
  });

  // Fallback for native window scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const distanceFromBottom = scrollHeight - (scrollY + clientHeight);

      const nearBottom = scrollY > 400 && distanceFromBottom < 850;
      setIsVisible(nearBottom);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-fade-in">
      <button
        type="button"
        onClick={scrollToTop}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full shadow-xl bg-[#0e632d] hover:bg-[#0a4d23] text-white transition-all duration-300 cursor-pointer font-semibold text-xs tracking-wide focus:outline-none focus:ring-2 focus:ring-[#0e632d] focus:ring-offset-2 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 border border-white/20"
        aria-label="Scroll back to top"
      >
        <ArrowUp size={16} className="animate-bounce shrink-0" />
        <span>Back to Top</span>
      </button>
    </div>
  );
}
