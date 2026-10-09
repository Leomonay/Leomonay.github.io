import { getTranslations } from 'next-intl/server';
import Section from '@/components/ui/Section';
import { SECTIONS } from '@/lib/sections';

// TODO(about): layout (e.g. text + photo or key figures: 15 years in industry, 160 users…).
// TODO(about): consider a reveal stagger per paragraph via style={{ '--reveal-delay': … }}.
export default async function About() {
  const t = await getTranslations('about');
  const paragraphs = t.raw('paragraphs');

  return (
    <Section id={SECTIONS.about} title={t('title')}>
      <div className="flex max-w-prose flex-col gap-4 text-lg" data-reveal="fade-up">
        {paragraphs.map((_, i) => (
          <p key={i}>{t(`paragraphs.${i}`)}</p>
        ))}
      </div>
    </Section>
  );
}
