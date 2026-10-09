'use client';

import { LOCALE_STORAGE_KEY } from '@/i18n/routing';
import { localePath } from '@/lib/site';

// The section whose top is closest above the middle of the viewport, i.e. the one being read.
function currentSectionId() {
  const middle = window.innerHeight / 2;
  let current = null;
  for (const section of document.querySelectorAll('main section[id]')) {
    if (section.getBoundingClientRect().top <= middle) current = section.id;
  }
  return current;
}

/**
 * Language switcher. Each option is a real link to /es/ or /en/, so it works without JS
 * and crawlers can follow it. With JS, clicking also:
 * - saves the choice, which the root page (/) honours over the browser language;
 * - keeps the section being read by appending its #id (ids are the same in both languages).
 *
 * `languages` comes from the server: each name is in its own language ("Español",
 * "English"), read from that locale's messages file.
 */
export default function LanguageSwitcher({ locale, label, languages }) {
  const onClick = (event, target) => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, target);
    } catch {
      // Preference not saved; the navigation itself still works.
    }
    if (target === locale) return;

    event.preventDefault();
    const section = currentSectionId();
    window.location.assign(localePath(target) + (section ? `#${section}` : ''));
  };

  return (
    <div role="group" aria-label={label} className="join">
      {languages.map(({ code, name }) => {
        const active = code === locale;
        return (
          <a
            key={code}
            href={localePath(code)}
            hrefLang={code}
            lang={code}
            aria-current={active ? 'true' : undefined}
            onClick={(event) => onClick(event, code)}
            className="btn join-item btn-ghost font-semibold btn-sm aria-[current=true]:bg-primary aria-[current=true]:text-primary-content"
          >
            {/* Visible code + full name for screen readers: "ES (Español)". The visible
                text stays part of the accessible name, so voice control ("click ES") works. */}
            {code.toUpperCase()}
            <span className="sr-only"> ({name})</span>
          </a>
        );
      })}
    </div>
  );
}
