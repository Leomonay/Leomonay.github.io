'use client';

import { useEffect } from 'react';

/**
 * One IntersectionObserver for the whole page. Any element with `data-reveal`
 * gets `data-revealed` the first time it scrolls into view; the CSS in
 * ./effects/reveal.css does the actual animation.
 *
 * A single observer (instead of a hook per element) keeps sections as Server
 * Components: they only need a data attribute, not client-side JS of their own.
 */
export default function RevealObserver() {
  useEffect(() => {
    const elements = document.querySelectorAll('[data-reveal]:not([data-revealed])');

    // Older browsers without IntersectionObserver: just show everything.
    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => el.setAttribute('data-revealed', ''));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-revealed', '');
          observer.unobserve(entry.target); // reveal once, don't re-hide on scroll up
        }
      },
      // Trigger slightly before the element is fully in view.
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
