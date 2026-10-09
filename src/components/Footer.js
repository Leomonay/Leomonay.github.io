import { getTranslations } from 'next-intl/server';
import { GitHubIcon } from '@/components/icons';
import { SOURCE_URL } from '@/lib/site';

export default async function Footer() {
  const t = await getTranslations('footer');
  const tCommon = await getTranslations('common');

  return (
    <footer className="border-t border-base-300">
      <div className="container-page flex flex-col gap-3 py-8 text-sm text-base-content/75 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {/* The year is fixed at build time, which is fine for a site rebuilt on every deploy. */}
          <p className="font-medium text-base-content">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
          <p>{t('builtWith')}</p>
        </div>
        <a
          href={SOURCE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="link-grow inline-flex items-center gap-2 self-start font-medium text-primary sm:self-auto"
        >
          <GitHubIcon className="size-4" />
          {t('source')}
          <span className="sr-only"> {tCommon('opensInNewTab')}</span>
        </a>
      </div>
    </footer>
  );
}
