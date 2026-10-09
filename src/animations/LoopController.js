'use client';

import { useEffect } from 'react';

/**
 * Pauses looping animations nobody can see. Any element with `data-loop` gets
 * `data-paused` while it's off-screen or the tab is hidden; its CSS sets
 * `animation-play-state: paused` on that attribute (see effects/aurora.css).
 *
 * One observer for the page, like RevealObserver, so effects stay CSS-only.
 */
export default function LoopController() {
  useEffect(() => {
    const loops = [...document.querySelectorAll('[data-loop]')];
    if (!loops.length) return;

    const visible = new Set();
    const apply = () => {
      for (const el of loops) {
        const run = visible.has(el) && document.visibilityState === 'visible';
        el.toggleAttribute('data-paused', !run);
      }
    };

    const observer =
      'IntersectionObserver' in window
        ? new IntersectionObserver((entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) visible.add(entry.target);
              else visible.delete(entry.target);
            }
            apply();
          })
        : null;

    if (observer) loops.forEach((el) => observer.observe(el));
    else loops.forEach((el) => visible.add(el));

    document.addEventListener('visibilitychange', apply);
    apply();

    return () => {
      observer?.disconnect();
      document.removeEventListener('visibilitychange', apply);
    };
  }, []);

  return null;
}
