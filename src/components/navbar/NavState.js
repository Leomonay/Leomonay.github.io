'use client';

import { useEffect } from 'react';

/**
 * Keeps the navbar in sync with the scroll position, without scroll listeners:
 * - data-scrolled on the header once the page leaves the very top (a 1px sentinel
 *   at the top of the document stops intersecting);
 * - aria-current="true" on the [data-nav-link] pointing to the section that crosses
 *   the middle of the viewport (removed when that section has no nav link).
 * Styles live in src/animations/effects/navbar.css.
 */
export default function NavState({ sentinelId }) {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const header = document.querySelector('.site-header');
    const sentinel = document.getElementById(sentinelId);
    const links = [...document.querySelectorAll('[data-nav-link]')];

    const scrolled = new IntersectionObserver(([entry]) => {
      header?.toggleAttribute('data-scrolled', !entry.isIntersecting);
    });
    if (sentinel) scrolled.observe(sentinel);

    const setActive = (id) => {
      for (const link of links) {
        if (link.hash === `#${id}`) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      }
    };

    // A thin band in the middle of the viewport: the section crossing it is "current".
    const sections = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    document.querySelectorAll('main > section[id]').forEach((s) => sections.observe(s));

    return () => {
      scrolled.disconnect();
      sections.disconnect();
    };
  }, [sentinelId]);

  return null;
}
