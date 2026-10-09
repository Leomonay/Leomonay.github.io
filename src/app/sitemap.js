import { routing } from '@/i18n/routing';
import { localePath, SITE_URL } from '@/lib/site';

// Emitted as out/sitemap.xml. Each localized URL lists its language alternates.
export const dynamic = 'force-static';

export default function sitemap() {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, SITE_URL + localePath(locale)]),
  );

  return routing.locales.map((locale) => ({
    url: SITE_URL + localePath(locale),
    changeFrequency: 'monthly',
    priority: 1,
    alternates: { languages },
  }));
}
