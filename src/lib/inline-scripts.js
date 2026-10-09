// Scripts injected inline (and therefore blocking) in <head>. They run before the first
// paint, which is the only way to avoid a flash of the wrong language or theme on a static
// site: there is no server to read cookies or Accept-Language headers.
//
// They are plain ES5-ish strings on purpose: they run before any bundle loads, so they
// must not depend on imports, and they stay tiny to keep the critical path short.

import { LOCALE_STORAGE_KEY, routing } from '@/i18n/routing';
import {
  DARK_QUERY,
  DEFAULT_THEME_PREFERENCE,
  THEME_PREFERENCES,
  THEME_STORAGE_KEY,
  THEMES,
} from '@/lib/theme';

/**
 * Applies the theme before the first paint (no flash of the wrong theme).
 * Reads the saved preference, resolves 'system' with matchMedia and sets
 * `data-theme` on <html>. The ThemeSwitcher takes over once React hydrates.
 */
export function themeScript() {
  return `(function(){
var pref=${JSON.stringify(DEFAULT_THEME_PREFERENCE)};
try{var saved=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
if(${JSON.stringify(THEME_PREFERENCES)}.indexOf(saved)>-1)pref=saved}catch(e){}
var dark=pref==='dark'||(pref==='system'&&window.matchMedia(${JSON.stringify(DARK_QUERY)}).matches);
document.documentElement.setAttribute('data-theme',dark?${JSON.stringify(THEMES.dark)}:${JSON.stringify(THEMES.light)});
})();`;
}

/**
 * Root page (`/`) redirect.
 * Order: saved preference → first es/en match in navigator.languages → English.
 * Keeps the #hash so shared links like `/#contact` survive the redirect.
 */
export function localeRedirectScript() {
  return `(function(){
var locales=${JSON.stringify(routing.locales)},pick=null;
try{pick=localStorage.getItem(${JSON.stringify(LOCALE_STORAGE_KEY)})}catch(e){}
if(locales.indexOf(pick)<0){
  pick='en';
  var langs=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||''];
  for(var i=0;i<langs.length;i++){
    var base=String(langs[i]).toLowerCase().split('-')[0];
    if(base==='es'){pick='es';break}
    if(base==='en'){break}
  }
}
location.replace('/'+pick+'/'+location.hash);
})();`;
}
