import { getTranslations } from 'next-intl/server';
import {
  ArrowRightIcon,
  CodeIcon,
  FactoryIcon,
  GitHubIcon,
  GlobeIcon,
  LinkedInIcon,
  MailIcon,
  MapPinIcon,
} from '@/components/icons';
import TagList from '@/components/TagList';
import Button from '@/components/ui/Button';
import { SECTIONS } from '@/lib/sections';
import { PROFILE } from '@/lib/site';

// Icons for hero.facts, matched by the fact's `id` (icons are code, not content).
const FACT_ICONS = { coding: CodeIcon, industry: FactoryIcon, languages: GlobeIcon };

/**
 * Hero: role, name (the page's only h1), headline, calls to action, quick facts,
 * stack and profile links.
 *
 * It's the LCP area, so nothing here uses data-reveal (it must paint immediately)
 * and there are no images.
 */
export default async function Hero() {
  const t = await getTranslations('hero');
  const tCommon = await getTranslations('common');

  const links = [
    { key: 'github', href: PROFILE.github, Icon: GitHubIcon, external: true },
    { key: 'linkedin', href: PROFILE.linkedin, Icon: LinkedInIcon, external: true },
    { key: 'email', href: `mailto:${PROFILE.email}`, Icon: MailIcon, external: false },
  ];

  return (
    <section id={SECTIONS.hero} aria-labelledby="hero-title" className="relative isolate">
      {/* Decorative layer for the next phase's background effects (gradients). */}
      <div aria-hidden="true" className="hero-backdrop absolute inset-0 -z-10" />

      <div className="container-page flex flex-col items-start gap-6 pt-12 pb-16 sm:pt-20 sm:pb-24">
        <p className="eyebrow">{t('role')}</p>

        <div className="flex flex-col gap-4">
          <h1 id="hero-title" className="text-5xl font-bold sm:text-7xl">
            {t('name')}
          </h1>
          <p className="max-w-2xl text-xl text-base-content/75 sm:text-2xl">{t('headline')}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button href={`#${SECTIONS.featured}`} size="lg">
            {t('cta.featured')}
            <ArrowRightIcon />
          </Button>
          <Button href={`#${SECTIONS.contact}`} intent="outline" size="lg">
            {t('cta.contact')}
          </Button>
        </div>

        <ul
          aria-label={t('factsLabel')}
          className="flex flex-col gap-x-6 gap-y-2 text-base-content/75 sm:flex-row sm:flex-wrap"
        >
          {t.raw('facts').map(({ id }, i) => {
            const Icon = FACT_ICONS[id];
            return (
              <li key={id} className="flex items-center gap-2">
                <Icon className="size-5 text-primary" />
                {t(`facts.${i}.text`)}
              </li>
            );
          })}
          <li className="flex items-center gap-2">
            <MapPinIcon className="size-5 text-primary" />
            {t('location')}
          </li>
        </ul>

        <div className="flex w-full flex-col gap-3 border-t border-base-300 pt-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <p
              id="hero-stack"
              className="text-sm font-semibold text-base-content sm:w-32 sm:shrink-0"
            >
              {t('stackLabel')}
            </p>
            <TagList labelId="hero-stack" items={t.raw('stack')} />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <p
              id="hero-also"
              className="text-sm font-semibold text-base-content/75 sm:w-32 sm:shrink-0"
            >
              {t('alsoLabel')}
            </p>
            <TagList labelId="hero-also" items={t.raw('also')} subtle />
          </div>
        </div>

        <ul aria-label={t('linksLabel')} className="flex flex-wrap gap-2">
          {links.map(({ key, href, Icon, external }) => (
            <li key={key}>
              <Button
                href={href}
                intent="ghost"
                size="sm"
                {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
              >
                <Icon />
                {t(`links.${key}`)}
                {external && <span className="sr-only"> {tCommon('opensInNewTab')}</span>}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
