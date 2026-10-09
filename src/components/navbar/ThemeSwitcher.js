'use client';

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from '@/components/icons';
import { button } from '@/components/ui/Button';
import { DARK_QUERY, THEME_PREFERENCES } from '@/lib/theme';
import {
  applyTheme,
  getServerSnapshot,
  getSnapshot,
  setThemePreference,
  subscribe,
} from '@/lib/theme-store';

const ICONS = { light: SunIcon, dark: MoonIcon, system: MonitorIcon };

/**
 * Theme selector: light / dark / system.
 *
 * Accessibility (WAI-ARIA menu button pattern):
 * - Trigger is a <button> with aria-haspopup, aria-expanded and aria-controls, and an
 *   accessible name that includes the current choice ("Tema: Sistema").
 * - Options are menuitemradio with aria-checked, so screen readers announce which one
 *   is active. A polite live region also announces the change.
 * - Keyboard: Enter/Space/↓ open on the first checked item, ↑/↓/Home/End move,
 *   Escape closes and returns focus, Tab closes.
 *
 * Texts arrive already translated from the server (Navbar), one per option, so this
 * client component doesn't need next-intl's runtime in the browser bundle.
 * `labels` = { menu, options: {light, dark, system}, trigger: {…}, changed: {…} }.
 */
export default function ThemeSwitcher({ labels }) {
  const preference = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [open, setOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const menuId = useId();
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const itemRefs = useRef([]);

  // "System" must follow the OS live: re-apply when prefers-color-scheme changes.
  useEffect(() => {
    if (preference !== 'system') return;
    const media = window.matchMedia(DARK_QUERY);
    const onChange = () => applyTheme('system');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [preference]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  const focusItem = (index) => {
    const count = THEME_PREFERENCES.length;
    itemRefs.current[(index + count) % count]?.focus();
  };

  const openMenu = (focusIndex = THEME_PREFERENCES.indexOf(preference)) => {
    setOpen(true);
    // Wait for visibility to switch before moving focus into the menu.
    requestAnimationFrame(() => focusItem(focusIndex));
  };

  const closeMenu = ({ restoreFocus = true } = {}) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  };

  const select = (value) => {
    setThemePreference(value);
    setAnnouncement(labels.changed[value]);
    closeMenu();
  };

  const onTriggerKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      openMenu();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      openMenu(THEME_PREFERENCES.length - 1);
    }
  };

  const onMenuKeyDown = (event) => {
    const current = itemRefs.current.indexOf(document.activeElement);
    const keys = {
      ArrowDown: () => focusItem(current + 1),
      ArrowUp: () => focusItem(current - 1),
      Home: () => focusItem(0),
      End: () => focusItem(THEME_PREFERENCES.length - 1),
      Escape: () => closeMenu(),
    };
    if (keys[event.key]) {
      event.preventDefault();
      keys[event.key]();
    } else if (event.key === 'Tab') {
      closeMenu({ restoreFocus: false });
    }
  };

  const CurrentIcon = ICONS[preference];

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        className={button({ intent: 'ghost', size: 'sm', square: true })}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={labels.trigger[preference]}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={onTriggerKeyDown}
      >
        <CurrentIcon />
      </button>

      <ul
        id={menuId}
        role="menu"
        aria-label={labels.menu}
        data-open={open || undefined}
        onKeyDown={onMenuKeyDown}
        className="menu-popover absolute right-0 z-50 mt-2 w-44 rounded-box border border-base-300 bg-base-100 p-1 shadow-lg"
      >
        {THEME_PREFERENCES.map((value, index) => {
          const Icon = ICONS[value];
          const checked = value === preference;
          return (
            <li key={value} role="none">
              <button
                ref={(el) => (itemRefs.current[index] = el)}
                type="button"
                role="menuitemradio"
                aria-checked={checked}
                tabIndex={-1}
                onClick={() => select(value)}
                className="flex w-full items-center gap-3 rounded-field px-3 py-2 text-left text-sm text-base-content hover:bg-base-200 focus-visible:bg-base-200 aria-checked:font-semibold aria-checked:text-primary"
              >
                <Icon className="size-4" />
                <span className="flex-1">{labels.options[value]}</span>
                {checked && <CheckIcon className="size-4" />}
              </button>
            </li>
          );
        })}
      </ul>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
