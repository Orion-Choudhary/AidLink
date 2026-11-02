import React, { useEffect } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';

/**
 * Bridge component to expose lenis globally for direct smooth scroll events
 */
function LenisBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      window.__lenis = lenis;
    }
    return () => {
      window.__lenis = null;
    };
  }, [lenis]);

  return null;
}

/**
 * SmoothScroll provides inertial, buttery smooth scrolling across the application
 * using the official Lenis smooth scrolling engine.
 */
export default function SmoothScroll({ children }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        autoResize: true,
      }}
    >
      <LenisBridge />
      {children}
    </ReactLenis>
  );
}
