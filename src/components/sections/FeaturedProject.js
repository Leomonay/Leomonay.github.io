import { getTranslations } from 'next-intl/server';
import TagList from '@/components/TagList';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Section from '@/components/ui/Section';
import { SECTIONS } from '@/lib/sections';

// TODO(featured): visual design. It's the strongest case study, so it can break the
//   card pattern (e.g. key figures — 160 users, 11 plants, 22,000 orders — as stats).
// TODO(featured): decide whether `details` stay always visible (as now) or go behind a
//   <Disclosure> like Experience.
// TODO(featured): add screenshots when there are anonymized captures (next/image works
//   with `images.unoptimized`; export them already sized and in AVIF/WebP).
export default async function FeaturedProject() {
  const t = await getTranslations('featured');
  const tCommon = await getTranslations('common');
  const highlights = t.raw('highlights');
  const details = t.raw('details');
  // Empty until there's a public demo; set featured.demo.url in both messages files.
  const demoUrl = t.raw('demo.url');

  return (
    <Section id={SECTIONS.featured} title={t('title')}>
      <Card
        as="article"
        tone="raised"
        title={t('company')}
        meta={`${t('role')} · ${t('period')}`}
        data-reveal="fade-up"
      >
        <p className="text-base-content/75">{t('context')}</p>
        <TagList label={t('techLabel')} items={t.raw('tech')} />

        <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-primary">
          {highlights.map((_, i) => (
            <li key={i}>{t(`highlights.${i}`)}</li>
          ))}
        </ul>

        <div className="flex flex-col gap-4">
          {details.map((_, i) => (
            <div key={i}>
              <h4 className="font-semibold">{t(`details.${i}.title`)}</h4>
              <p className="text-base-content/75">{t(`details.${i}.text`)}</p>
            </div>
          ))}
        </div>

        {demoUrl && (
          <Button href={demoUrl} target="_blank" rel="noopener noreferrer" className="self-start">
            {t('demo.label')}
            <span className="sr-only"> {tCommon('opensInNewTab')}</span>
          </Button>
        )}
      </Card>
    </Section>
  );
}
