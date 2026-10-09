import Footer from '@/components/Footer';
import Navbar from '@/components/navbar/Navbar';
import About from '@/components/sections/About';
import Career from '@/components/sections/Career';
import Contact from '@/components/sections/Contact';
import Education from '@/components/sections/Education';
import ExperienceSection from '@/components/sections/experience/ExperienceSection';
import FeaturedProject from '@/components/sections/FeaturedProject';
import Hero from '@/components/sections/Hero';
import Recommendations from '@/components/sections/Recommendations';

// Page composition, in the order defined by the spec. Every section is a Server
// Component that reads its own namespace from messages/<locale>.json.
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <FeaturedProject />
        <ExperienceSection />
        <Career />
        <Education />
        <Recommendations />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
