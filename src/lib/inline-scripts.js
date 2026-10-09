// Scripts injected inline (and therefore blocking) in <head>. They run before the first
// paint, which is the only way to avoid a flash of the wrong language or theme on a static
// site: there is no server to read cookies or Accept-Language headers.
//
// They are plain ES5-ish strings on purpose: they run before any bundle loads, so they
// must not depend on imports, and they stay tiny to keep the critical path short.

import { LOCALE_STORAGE_KEY, routing } from '@/i18n/routing';

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
