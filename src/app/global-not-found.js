import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { localePath } from '@/lib/site';
import '@/styles/globals.css';

// With two root layouts ([locale] and (root)) there is no single layout to build a 404
// from, so Next needs a global one. It is exported as out/404.html, which GitHub Pages
// serves for any unknown URL. We can't know the visitor's language here, so it shows both.
export const metadata = { robots: { index: false } };

export default async function GlobalNotFound() {
  const blocks = await Promise.all(
    routing.locales.map(async (locale) => ({
      locale,
      t: await getTranslations({ locale, namespace: 'notFound' }),
    })),
  );

  return (
    <html lang={routing.defaultLocale}>
      <body>
        <main className="grid min-h-dvh place-items-center p-6">
          <div className="flex flex-col gap-10 text-center">
            {blocks.map(({ locale, t }) => (
              <section key={locale} lang={locale} className="flex flex-col items-center gap-3">
                {/* One h1 per page: the first language gets it, the rest use h2. */}
                {locale === routing.locales[0] ? (
                  <h1 className="text-2xl font-bold">{t('title')}</h1>
                ) : (
                  <h2 className="text-2xl font-bold">{t('title')}</h2>
                )}
                <p>{t('text')}</p>
                <a className="link" href={localePath(locale)} hrefLang={locale}>
                  {t('back')}
                </a>
              </section>
            ))}
          </div>
        </main>
      </body>
    </html>
  );
}
