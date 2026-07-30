import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Skills } from '@/components/sections/Skills';
import { Experience } from '@/components/sections/Experience';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { Laboratory } from '@/components/sections/Laboratory';
import { Contact } from '@/components/sections/Contact';
import { Resume } from '@/components/sections/Resume';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <FeaturedProjects />
      <Laboratory />
      <Contact />
      <Resume />
    </>
  );
}