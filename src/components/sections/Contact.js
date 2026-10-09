import { getTranslations } from 'next-intl/server';
import { LinkedInIcon, MailIcon } from '@/components/icons';
import Button from '@/components/ui/Button';
import Section from '@/components/ui/Section';
import { SECTIONS } from '@/lib/sections';
import { PROFILE } from '@/lib/site';

// TODO(contact): visual design (closing call to action).
// A static export has no backend, so contact is mailto + LinkedIn rather than a form.
export default async function Contact() {
  const t = await getTranslations('contact');
  const tHero = await getTranslations('hero');
  const tCommon = await getTranslations('common');

  return (
    <Section id={SECTIONS.contact} title={t('title')}>
      <div className="flex flex-col gap-6" data-reveal="fade-up">
        <p className="section-lead">{t('text')}</p>

        <div className="flex flex-wrap gap-3">
          <Button href={`mailto:${PROFILE.email}`}>
            <MailIcon />
            {t('emailLabel')}
          </Button>
          <Button
            href={PROFILE.linkedin}
            intent="outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon />
            {tHero('links.linkedin')}
            <span className="sr-only"> {tCommon('opensInNewTab')}</span>
          </Button>
        </div>

        <p className="text-sm text-base-content/75">
          <span className="font-semibold">{t('locationLabel')}:</span> {tHero('location')}
        </p>
      </div>
    </Section>
  );
}
