import { getTranslations } from 'next-intl/server';
import { GitHubIcon, LinkedInIcon, MailIcon } from '@/components/icons';
import TagList from '@/components/TagList';
import Button from '@/components/ui/Button';
import { SECTIONS } from '@/lib/sections';
import { PROFILE } from '@/lib/site';

// TODO(hero): final layout and visual design (it's the LCP area: keep it without
//   data-reveal so it paints immediately, and avoid heavy images).
// TODO(hero): decide whether to show `hero.role` as an eyebrow above the name.
export default async function Hero() {
  const t = await getTranslations('hero');
  const tCommon = await getTranslations('common');

  const links = [
    { key: 'github', href: PROFILE.github, Icon: GitHubIcon, external: true },
    { key: 'linkedin', href: PROFILE.linkedin, Icon: LinkedInIcon, external: true },
    { key: 'email', href: `mailto:${PROFILE.email}`, Icon: MailIcon, external: false },
  ];

  return (
    <section id={SECTIONS.hero} aria-labelledby="hero-title" className="section container-page">
      {/* The page's only <h1>. */}
      <h1 id="hero-title" className="text-4xl font-bold sm:text-6xl">
        {t('name')}
      </h1>
      <p className="section-lead mt-4">{t('headline')}</p>
      <p className="mt-2 text-sm text-base-content/75">{t('location')}</p>

      <div className="mt-8 flex flex-col gap-4">
        <TagList label={t('stackLabel')} items={t.raw('stack')} />
        {/* TODO(hero): style the secondary stack differently from the main one. */}
        <TagList label={t('alsoLabel')} items={t.raw('also')} />
      </div>

      <ul aria-label={t('linksLabel')} className="mt-8 flex flex-wrap gap-3">
        {links.map(({ key, href, Icon, external }) => (
          <li key={key}>
            <Button
              href={href}
              intent={key === 'email' ? 'primary' : 'outline'}
              {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
            >
              <Icon />
              {t(`links.${key}`)}
              {external && <span className="sr-only"> {tCommon('opensInNewTab')}</span>}
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
