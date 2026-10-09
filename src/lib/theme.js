// Theme configuration shared by the blocking <head> script and the ThemeSwitcher.
// Keeping it in one module guarantees both resolve a preference to the same theme.

export const THEME_STORAGE_KEY = 'theme-preference';

// What the visitor picks. 'system' follows prefers-color-scheme.
export const THEME_PREFERENCES = ['light', 'dark', 'system'];
export const DEFAULT_THEME_PREFERENCE = 'system';

// daisyUI theme names (declared in globals.css) for each resolved scheme.
export const THEMES = { light: 'leaf', dark: 'forest' };

export const DARK_QUERY = '(prefers-color-scheme: dark)';
