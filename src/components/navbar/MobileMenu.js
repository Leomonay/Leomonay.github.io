'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { CloseIcon, MenuIcon } from '@/components/icons';
import { button } from '@/components/ui/Button';

/**
 * Section links on small screens, behind a disclosure button
 * (<button> + aria-expanded + aria-controls). Closes on link click, Escape
 * (returning focus to the button) and outside click. Hidden from md up, where the
 * links are shown inline.
 */
export default function MobileMenu({ links, openLabel, closeLabel, navLabel }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        className={button({ intent: 'ghost', size: 'sm', square: true })}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      <nav
        id={panelId}
        aria-label={navLabel}
        data-open={open || undefined}
        className="menu-popover absolute inset-x-4 top-full z-50 mt-2 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
      >
        <ul className="flex flex-col">
          {links.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className="block rounded-field px-4 py-3 font-medium text-base-content hover:bg-base-200"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
