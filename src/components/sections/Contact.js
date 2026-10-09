import { getTranslations } from 'next-intl/server';
import { LinkedInIcon, MailIcon, MapPinIcon } from '@/components/icons';
import Button from '@/components/ui/Button';
import Section from '@/components/ui/Section';
import { SECTIONS } from '@/lib/sections';
import { PROFILE } from '@/lib/site';

/**
 * Closing call to action. Only email and LinkedIn are offered as contact channels
 * (GitHub messages aren't monitored; the profile is linked from the hero).
 * A static export has no backend, so there's no form.
 */
export default async function Contact() {
  const t = await getTranslations('contact');
  const tHero = await getTranslations('hero');
  const tCommon = await getTranslations('common');

  return (
    <Section id={SECTIONS.contact} title={t('title')}>
      <div
        data-reveal="fade-up"
        className="flex flex-col items-center gap-6 rounded-box border border-base-300 bg-base-200 px-6 py-12 text-center sm:px-12 sm:py-16"
      >
        <p className="font-display text-3xl font-bold text-base-content sm:text-5xl">
          {t('closing')}
        </p>
        <p className="section-lead">{t('text')}</p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={`mailto:${PROFILE.email}`} size="lg">
            <MailIcon />
            {t('emailLabel')}
          </Button>
          <Button
            href={PROFILE.linkedin}
            intent="outline"
            size="lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon />
            {tHero('links.linkedin')}
            <span className="sr-only"> {tCommon('opensInNewTab')}</span>
          </Button>
        </div>

        <p className="flex items-center gap-2 text-sm text-base-content/75">
          <MapPinIcon className="size-4 text-primary" />
          <span className="sr-only">{t('locationLabel')}: </span>
          {tHero('location')}
        </p>
      </div>
    </Section>
  );
}
