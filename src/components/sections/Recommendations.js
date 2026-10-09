import { getTranslations } from 'next-intl/server';
import Section from '@/components/ui/Section';
import { SECTIONS } from '@/lib/sections';

// Name, role and quote only — no photos (per spec).
// TODO(recommendations): visual design (quote cards, side by side from md up).
export default async function Recommendations() {
  const t = await getTranslations('recommendations');
  const items = t.raw('items');

  return (
    <Section id={SECTIONS.recommendations} title={t('title')}>
      <ul className="grid gap-6 md:grid-cols-2" data-reveal="fade-up">
        {items.map((_, i) => (
          <li key={i}>
            <figure className="flex flex-col gap-3">
              <blockquote className="text-base-content">
                {/* <q> lets the browser pick the quotation marks for the page language. */}
                <p>
                  <q>{t(`items.${i}.quote`)}</q>
                </p>
              </blockquote>
              <figcaption className="text-sm">
                <span className="font-semibold">{t(`items.${i}.name`)}</span>
                <span className="block text-base-content/75">{t(`items.${i}.role`)}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  );
}
