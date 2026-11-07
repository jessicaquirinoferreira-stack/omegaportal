import React, { useState, useEffect, Suspense, lazy } from 'react';
import CinematicIntro from './components/CinematicIntro';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CompanySection } from './components/CompanySection';
import { ServicesSection } from './components/ServicesSection';
import { ExecutedProjectsSection } from './components/ExecutedProjectsSection';
import { ClientsSection } from './components/ClientsSection';
import { DemandCalculator } from './components/DemandCalculator';
import { QuoteSection } from './components/QuoteSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import {
  ScrollProgressBar,
  InfiniteClientsMarquee,
  CommandPalette,
  FloatingQuickDock,
} from './components/ui/ModernEffects';
import { FloatingSocialButtons } from './components/FloatingSocialButtons';
import { VirtualAssistant } from './components/VirtualAssistant';
import { Cpu, ArrowRight, Play } from 'lucide-react';

// Code-split Three.js WebGL viewer for instantaneous initial page load
const Substation3DViewer = lazy(() =>
  import('./components/Substation3DViewer').then((mod) => ({
    default: mod.Substation3DViewer,
  }))
);

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('inicio');
  const [isCommandOpen, setIsCommandOpen] = useState<boolean>(false);
  const [replayIntroKey, setReplayIntroKey] = useState<number>(0);
  const [forcePlayIntro, setForcePlayIntro] = useState<boolean>(false);

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('omega_theme');
      if (saved) return saved === 'dark';
    }
    return false; // Default to Light theme as requested
  });

  // States passed from Services or Calculator to the Quote configurator
  const [quoteService, setQuoteService] = useState<string | undefined>(undefined);
  const [quoteKva, setQuoteKva] = useState<number | undefined>(undefined);
  const [quoteSubstationType, setQuoteSubstationType] = useState<string | undefined>(undefined);

  // Initialize and synchronize theme
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      localStorage.setItem('omega_theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      localStorage.setItem('omega_theme', 'light');
    }
  }, [isDark]);

  // Global Cmd+K / Ctrl+K listener to toggle Command Palette
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateToQuoteWithService = (serviceTitle?: string) => {
    if (serviceTitle) {
      setQuoteService(serviceTitle);
    }
    handleNavigate('orcamento');
  };

  const [introFinished, setIntroFinished] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('omega-cinematic-intro-v3') === 'true';
    }
    return false;
  });

  // Failsafe timer: ensures main content and widgets are revealed within 6.2s under all browser conditions
  useEffect(() => {
    const failsafeTimer = setTimeout(() => {
      setIntroFinished(true);
    }, 6200);
    return () => clearTimeout(failsafeTimer);
  }, []);

  const handleCarryCalculatorToQuote = (calculatedKva: number, substationType: string) => {
    setQuoteKva(calculatedKva);
    setQuoteSubstationType(substationType);
    setQuoteService('Cabines Primárias (15 a 34,5 kV)');
    handleNavigate('orcamento');
  };

  const handleReplayIntro = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('omega-cinematic-intro-v3');
    }
    setIntroFinished(false);
    setForcePlayIntro(true);
    setReplayIntroKey((prev) => prev + 1);
  };

  // Section observer for updating active navigation link during scroll
  useEffect(() => {
    const sections = [
      'inicio',
      'maqueta3d',
      'empresa',
      'servicos',
      'clientes',
      'calculadora',
      'orcamento',
      'contato',
    ];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 220;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top GPU Laser Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* 6-Second Studio Cinematic Intro (First visit or on-demand replay) */}
      <CinematicIntro
        key={replayIntroKey}
        forcePlay={forcePlayIntro}
        onComplete={() => {
          setIntroFinished(true);
          setForcePlayIntro(false);
        }}
      />

      {/* Instantaneous Cmd+K Engineering Command Palette */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onNavigate={handleNavigate}
        onNavigateToQuote={handleNavigateToQuoteWithService}
        onReplayIntro={handleReplayIntro}
      />

      <div
        className={`min-h-screen ${
          isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
        } font-sans transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          introFinished
            ? 'opacity-100 scale-100 blur-0 translate-y-0'
            : 'opacity-0 scale-[0.985] blur-md translate-y-3 pointer-events-none'
        }`}
      >
        {/* Top Navigation */}
        <Header
          activeSection={activeSection}
          onNavigate={handleNavigate}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onOpenCommand={() => setIsCommandOpen(true)}
        />

        <main>
          {/* 1. Hero Section with GridBeams, Magnetic CTAs & Operational Spec Card */}
          <Hero onNavigate={handleNavigate} isDark={isDark} />

          {/* 1.5 Infinite Hardware-Accelerated Partner & Standards Marquee Ticker */}
          <InfiniteClientsMarquee onSelectSection={handleNavigate} />

          {/* 2. Interactive 3D Substation Twin & Electromagnetic Lab (Lazy-loaded for instant startup) */}
          <section
            id="maqueta3d"
            className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#0A3D4A] dark:text-cyan-400 font-bold mb-2">
                  <Cpu className="w-3.5 h-3.5 text-[#0A3D4A] dark:text-cyan-400 animate-pulse" />
                  <span>ENGENHARIA 3D REAL • DIGITAL TWIN NBR 5356</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-slate-950 dark:text-white">
                  Inspeção 3D de Subestação e Transformador de Potência
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-2xl font-medium">
                  Interaja com o modelo tridimensional de alta tensão. Teste a vista explodida
                  mecânica, inspecione as buchas de 500 kV, analise o núcleo magnético em modo
                  Raio-X e simule arcos de descarga dielétrica.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReplayIntro}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase text-[#0A3D4A] dark:text-[#C9A227] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-[#C9A227] transition-all cursor-pointer shadow-2xs"
                  title="Assistir novamente à abertura cinematográfica de 6 segundos"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Intro 6s</span>
                </button>

                <button
                  onClick={() => handleNavigate('orcamento')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold font-mono uppercase bg-[#996515] hover:bg-[#855712] text-white dark:bg-[#C9A227] dark:hover:bg-[#deb338] dark:text-slate-950 transition-colors shadow-md cursor-pointer"
                >
                  <span>Projetar Subestação</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Lazy-Loaded Three.js 3D Viewer */}
            <Suspense
              fallback={
                <div className="h-[520px] w-full rounded-2xl bg-[#071E26] border border-[#195363] flex flex-col items-center justify-center text-white gap-3">
                  <div className="h-8 w-8 rounded-full border-2 border-[#C9A227] border-t-transparent animate-spin" />
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-300">
                    Inicializando Subestação 3D WebGL...
                  </span>
                </div>
              }
            >
              <Substation3DViewer />
            </Suspense>
          </section>

          {/* 3. Company Trajectory & Values */}
          <CompanySection onNavigate={handleNavigate} />

          {/* 4. All 12 Engineering Services */}
          <ServicesSection onNavigateToQuote={handleNavigateToQuoteWithService} />

          {/* 4.1. Real Executed Projects & Portfolio (14 Photos with Enhanced Quality) */}
          <ExecutedProjectsSection
            onNavigateToQuote={handleNavigateToQuoteWithService}
            whatsAppNumber="5511987654321"
          />

          {/* 5. Real Enterprise Clients & Cases */}
          <ClientsSection isDark={isDark} onNavigateToQuote={() => handleNavigate('orcamento')} />

          {/* 6. Interactive Transformer Demand Calculator */}
          <DemandCalculator onCarryToQuote={handleCarryCalculatorToQuote} />

          {/* 7. Multi-step Quotation Configurator */}
          <QuoteSection
            initialService={quoteService}
            initialKva={quoteKva}
            initialSubstationType={quoteSubstationType}
          />

          {/* 8. Official Contact & Headquarters */}
          <ContactSection />
        </main>

        {/* Footer */}
        <Footer onNavigate={handleNavigate} />

        {/* Floating Quick-Access Dock (Aceternity / Linear style) */}
        <FloatingQuickDock
          activeSection={activeSection}
          onNavigate={handleNavigate}
          onOpenCommand={() => setIsCommandOpen(true)}
        />

      </div>

      {/* Floating Social Buttons on the RIGHT side (WhatsApp & Instagram with official icons and links) */}
      <FloatingSocialButtons
        whatsAppNumber="5511987654321"
        instagramUrl="https://www.instagram.com/grupo_omega_construtora/"
      />

      {/* Technical Virtual Assistant on the LEFT side (Answers questions & directs to contacts) */}
      <VirtualAssistant
        onNavigateToQuote={handleNavigateToQuoteWithService}
        whatsAppNumber="5511987654321"
        phoneNumber="(11) 3900-8800"
        instagramUrl="https://www.instagram.com/grupo_omega_construtora/"
      />
    </>
  );
}
