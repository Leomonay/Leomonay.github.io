import { getTranslations } from 'next-intl/server';
import { revealDelay } from '@/animations/reveal';
import { QuoteIcon } from '@/components/icons';
import { card } from '@/components/ui/Card';
import Section from '@/components/ui/Section';
import { SECTIONS } from '@/lib/sections';

/**
 * Recommendations: quote cards (text, name, role; no photos). One column on phones,
 * two from md. Uses the Card styles through its `tv` definition because the markup is
 * a <figure> (quote + caption) rather than Card's header/body structure.
 */
export default async function Recommendations() {
  const t = await getTranslations('recommendations');
  const items = t.raw('items');
  const s = card();

  return (
    <Section id={SECTIONS.recommendations} title={t('title')}>
      <ul className="grid gap-4 md:grid-cols-2 md:gap-6">
        {items.map((_, i) => (
          <li key={i} data-reveal="fade-up" style={revealDelay(i)}>
            <figure className={s.root({ className: 'flex h-full flex-col gap-4' })}>
              <QuoteIcon className="size-8 text-primary/40" />
              <blockquote className="text-base-content">
                {/* <q> keeps the quote semantics; its marks are hidden (quotes: none)
                    because the quote icon already plays that role visually. */}
                <p className="leading-relaxed">
                  <q className="[quotes:none]">{t(`items.${i}.quote`)}</q>
                </p>
              </blockquote>
              <figcaption className="mt-auto border-t border-base-300 pt-4">
                <span className="block font-semibold text-base-content">
                  {t(`items.${i}.name`)}
                </span>
                <span className="block text-sm text-base-content/75">{t(`items.${i}.role`)}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  );
}
