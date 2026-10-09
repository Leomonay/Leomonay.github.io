import { useTranslations } from 'next-intl';
import Navbar from '@/components/navbar/Navbar';
import ExperienceSection from '@/components/sections/experience/ExperienceSection';
import { SECTIONS } from '@/lib/sections';

export default function HomePage() {
  const t = useTranslations('meta');
  return (
    <>
      <Navbar />
      <main id="main">
        <section id={SECTIONS.hero} className="section container-page">
          <h1 className="text-4xl font-bold">{t('title')}</h1>
        </section>
        <ExperienceSection />
      </main>
    </>
  );
}
