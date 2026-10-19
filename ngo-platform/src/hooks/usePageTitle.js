import { useEffect } from 'react';

/**
 * Custom hook to dynamically update document title and reset on unmount
 * @param {string} title - Page specific title
 */
export default function usePageTitle(title) {
  useEffect(() => {
    const previousTitle = document.title;
    if (title) {
      document.title = title.includes('AidLink') ? title : `${title} - AidLink`;
    }
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}
