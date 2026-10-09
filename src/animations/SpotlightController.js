'use client';

import { useEffect } from 'react';

/**
 * Feeds the cursor position to [data-spotlight] cards (effects/spotlight.css).
 * One passive, delegated pointermove listener for the page, throttled to one
 * style write per frame. It only runs with a fine pointer (mouse/trackpad) and
 * without prefers-reduced-motion, so phones never attach it.
 */
export default function SpotlightController() {
  useEffect(() => {
    const enabled = window.matchMedia(
      '(pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    if (!enabled.matches) return;

    let frame = 0;
    let last = null;

    const update = () => {
      frame = 0;
      const { card, x, y } = last;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--spot-x', `${x - rect.left}px`);
      card.style.setProperty('--spot-y', `${y - rect.top}px`);
    };

    const onPointerMove = (event) => {
      const card = event.target.closest?.('[data-spotlight]');
      if (!card) return;
      last = { card, x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(update);
    };

    document.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      document.removeEventListener('pointermove', onPointerMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
