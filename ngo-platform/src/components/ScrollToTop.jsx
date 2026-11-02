import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLenis } from "lenis/react";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        if (lenis) {
          lenis.scrollTo(element, { offset: -60, duration: 1.2 });
        } else {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }
      // If element is not immediately in DOM, retry after small delay (for lazy components)
      const timer = setTimeout(() => {
        const delayedEl = document.getElementById(targetId);
        if (delayedEl) {
          if (lenis) {
            lenis.scrollTo(delayedEl, { offset: -60, duration: 1.2 });
          } else {
            delayedEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 150);
      return () => clearTimeout(timer);
    }

    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, lenis]);

  return null;
}
