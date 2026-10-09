'use client';

import { useEffect } from 'react';

const DURATION_MS = 1200;

// "+22.000" → { prefix: '+', target: 22000, group: '.', suffix: '' }
// "22,000+" → { prefix: '', target: 22000, group: ',', suffix: '+' }
function parse(text) {
  const match = text.match(/^(\D*)(\d{1,3}(?:([.,\s])\d{3})*|\d+)(\D*)$/);
  if (!match) return null;
  const [, prefix, digits, group = '', suffix] = match;
  return { prefix, target: Number(digits.replace(/\D/g, '')), group, suffix };
}

const format = ({ prefix, group, suffix }, n) =>
  prefix + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, group) + suffix;

const easeOutCubic = (t) => 1 - (1 - t) ** 3;

/**
 * Counts [data-count] numbers up from 0 the first time they scroll into view.
 *
 * - The server HTML already has the final value, and screen readers read a separate
 *   sr-only copy (the animated digits are aria-hidden), so assistive tech, no-JS and
 *   crawlers always get the real number.
 * - Only counters that are off-screen when the page loads are reset to 0 and animated;
 *   one already visible keeps its value instead of jumping back to 0.
 * - Skipped entirely with prefers-reduced-motion.
 */
export default function CounterController() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    const counters = [...document.querySelectorAll('[data-count]')]
      .map((el) => ({ el, spec: parse(el.dataset.count) }))
      .filter(({ el, spec }) => {
        if (!spec) return false;
        const { top, bottom } = el.getBoundingClientRect();
        return bottom < 0 || top > window.innerHeight; // off-screen at load
      });
    if (!counters.length) return;

    const frames = new Set();
    const run = ({ el, spec }) => {
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / DURATION_MS, 1);
        el.textContent = format(spec, Math.round(spec.target * easeOutCubic(t)));
        if (t < 1) frames.add(requestAnimationFrame(tick));
      };
      frames.add(requestAnimationFrame(tick));
    };

    const byElement = new Map(counters.map((c) => [c.el, c]));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          run(byElement.get(entry.target));
        }
      },
      { threshold: 0.6 },
    );

    for (const counter of counters) {
      counter.el.textContent = format(counter.spec, 0);
      observer.observe(counter.el);
    }

    return () => {
      observer.disconnect();
      frames.forEach(cancelAnimationFrame);
    };
  }, []);

  return null;
}
