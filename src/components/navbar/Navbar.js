import { getLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { NAV_SECTIONS, SECTIONS } from '@/lib/sections';
import LanguageSwitcher from './LanguageSwitcher';
import MobileMenu from './MobileMenu';
import ThemeSwitcher from './ThemeSwitcher';

// Server Component: renders the static markup and passes translated strings down, so only
// the three interactive pieces (switchers and mobile menu) ship JavaScript.
export default async function Navbar() {
  const locale = await getLocale();
  const t = await getTranslations('nav');

  const links = NAV_SECTIONS.map((id) => ({ id, label: t(`sections.${id}`) }));

  // Each language's name, written in that language (from its own messages file).
  const languages = await Promise.all(
    routing.locales.map(async (code) => ({
      code,
      name: (await getTranslations({ locale: code, namespace: 'language' }))('name'),
    })),
  );

  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/85 backdrop-blur supports-[backdrop-filter]:bg-base-100/70">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-field focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-content"
      >
        {t('skipToContent')}
      </a>

      <div className="container-page relative flex h-16 items-center justify-between gap-4">
        <a
          href={`#${SECTIONS.hero}`}
          className="font-display text-lg font-bold tracking-tight text-base-content hover:text-primary"
        >
          {t('brand')}
        </a>

        <nav aria-label={t('label')} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {links.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="rounded-field px-3 py-2 text-sm font-medium text-base-content/75 transition-colors hover:bg-base-200 hover:text-base-content"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageSwitcher locale={locale} label={t('language')} languages={languages} />
          <ThemeSwitcher />
          <MobileMenu
            links={links}
            navLabel={t('label')}
            openLabel={t('menu.open')}
            closeLabel={t('menu.close')}
          />
        </div>
      </div>
    </header>
  );
}
