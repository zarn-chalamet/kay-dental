import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If URL has a hash (like #contact-form), don't scroll to top
    // Let the browser handle scrolling to that section
    if (hash) return;

    // Otherwise, scroll to top when path changes
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}