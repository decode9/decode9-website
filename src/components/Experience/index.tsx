import GuideConsole from '@/components/Guide/GuideConsole';
import Footer from '@/components/Layout/Footer';
import Header from '@/components/Layout/Header';
import Hud from '@/components/Layout/Hud';
import Preloader from '@/components/Layout/Preloader';
import { About, Contact, Hero, Lab, Process, Services, TechStack, Work } from '@/components/Sections';
import Stage from '@/components/Stage';
import { getDictionary } from '@/i18n';
import AppProviders from './components/AppProviders';
import ChapterConductor from './components/ChapterConductor';
import type { ExperienceProps } from './interface';

/** The whole guided session, rendered on the server with the page's own dictionary. */
const Experience = ({ locale }: ExperienceProps) => (
  <AppProviders locale={locale} dictionary={getDictionary(locale)}>
    <Stage />
    <div className="d9-grain" aria-hidden="true" />
    <Header />
    <Hud />
    <Preloader />
    <main id="main" data-ui="main" data-track-viewport className="h:h-[100svh] h:overflow-clip">
      <div data-track className="relative h:flex h:h-full h:w-max h:items-stretch">
        <Hero />
        <About />
        <Services />
        <Lab />
        <Work />
        <TechStack />
        <Process />
        <Contact />
      </div>
    </main>
    <Footer />
    <GuideConsole />
    <ChapterConductor />
  </AppProviders>
);

export default Experience;
