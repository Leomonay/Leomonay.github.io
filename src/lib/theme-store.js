'use client';

import {
  DARK_QUERY,
  DEFAULT_THEME_PREFERENCE,
  THEME_PREFERENCES,
  THEME_STORAGE_KEY,
  THEMES,
} from './theme';

// Tiny external store for the theme preference, consumed with useSyncExternalStore.
// The server snapshot is always the default ('system'): the real value only exists in
// the browser, and React re-renders with it right after hydration without a mismatch.

const listeners = new Set();

function readPreference() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (THEME_PREFERENCES.includes(saved)) return saved;
  } catch {
    // Storage blocked (private mode, disabled cookies): fall back to the default.
  }
  return DEFAULT_THEME_PREFERENCE;
}

export function resolveTheme(preference) {
  const dark =
    preference === 'dark' || (preference === 'system' && window.matchMedia(DARK_QUERY).matches);
  return dark ? 'dark' : 'light';
}

export function applyTheme(preference) {
  document.documentElement.setAttribute('data-theme', THEMES[resolveTheme(preference)]);
}

export function setThemePreference(preference) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Not persisted, but still applied for this page view.
  }
  applyTheme(preference);
  listeners.forEach((notify) => notify());
}

export function subscribe(notify) {
  listeners.add(notify);
  // Another tab changed the preference.
  const onStorage = (event) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    applyTheme(readPreference());
    notify();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(notify);
    window.removeEventListener('storage', onStorage);
  };
}

export const getSnapshot = readPreference;
export const getServerSnapshot = () => DEFAULT_THEME_PREFERENCE;
