import React, { useState, useEffect, useCallback, useRef, Suspense, lazy } from 'react';
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
} from './components/ui/ModernEffects';
import { FloatingSocialButtons } from './components/FloatingSocialButtons';
import { VirtualAssistant } from './components/VirtualAssistant';
import { PrecisionCursor } from './components/ui/IndustrialEffects';
import { useSmoothScrollAndMotion } from './utils/useSmoothScrollAndMotion';
import { INTRO_TOTAL_MS, INTRO_EXIT_MS, shouldShowIntroOnBoot } from './utils/introSequence';
import { ArrowRight } from 'lucide-react';

// Code-split & prefetchable Three.js WebGL viewer for instantaneous initial page load
const loadSubstation3DViewer = () =>
  import('./components/Substation3DViewer').then((mod) => ({
    default: mod.Substation3DViewer,
  }));

const Substation3DViewer = lazy(loadSubstation3DViewer);

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('inicio');
  const [isCommandOpen, setIsCommandOpen] = useState<boolean>(false);

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('omega_theme');
      if (saved) return saved === 'dark';
    }
    return false;
  });

  const [quoteService, setQuoteService] = useState<string | undefined>(undefined);
  const [quoteKva, setQuoteKva] = useState<number | undefined>(undefined);
  const [quoteSubstationType, setQuoteSubstationType] = useState<string | undefined>(undefined);

  const [introFinished, setIntroFinished] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !shouldShowIntroOnBoot({
        search: window.location.search,
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      });
    }
    return true;
  });

  const [shouldMount3D, setShouldMount3D] = useState<boolean>(false);
  const viewerSectionRef = useRef<HTMLElement | null>(null);

  // Lenis + GSAP ScrollTrigger coordinator (activates seamlessly once intro completes)
  const { scrollToSection, scrollToTop } = useSmoothScrollAndMotion(introFinished);

  // Quietly prefetch Three.js + 3D Substation bundle in background during intro/first-paint idle
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (typeof win.requestIdleCallback === 'function') {
      const idleId = win.requestIdleCallback(() => {
        loadSubstation3DViewer();
      }, { timeout: 1200 });
      return () => win.cancelIdleCallback?.(idleId);
    }
    const t = window.setTimeout(() => {
      loadSubstation3DViewer();
    }, 250);
    return () => window.clearTimeout(t);
  }, []);

  // Mount WebGL scene once intro finishes and user approaches #maqueta3d or brief post-Hero idle settles
  useEffect(() => {
    if (!introFinished || shouldMount3D) return;

    const target = viewerSectionRef.current;
    let observer: IntersectionObserver | null = null;
    if (target && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            setShouldMount3D(true);
            observer?.disconnect();
          }
        },
        { rootMargin: '900px 0px' }
      );
      observer.observe(target);
    }

    const idleTimer = window.setTimeout(() => {
      setShouldMount3D(true);
    }, 450);

    return () => {
      observer?.disconnect();
      window.clearTimeout(idleTimer);
    };
  }, [introFinished, shouldMount3D]);

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
    if (sectionId === 'maqueta3d') {
      setShouldMount3D(true);
    }
    setActiveSection(sectionId);
    scrollToSection(sectionId);
  };

  const handleNavigateToQuoteWithService = (serviceTitle?: string) => {
    if (serviceTitle) {
      setQuoteService(serviceTitle);
    }
    handleNavigate('orcamento');
  };

  useEffect(() => {
    if (introFinished) return;
    const failsafeTimer = setTimeout(() => {
      setIntroFinished(true);
    }, INTRO_TOTAL_MS + INTRO_EXIT_MS + 1500);
    return () => clearTimeout(failsafeTimer);
  }, [introFinished]);

  const handleIntroComplete = useCallback(() => {
    setIntroFinished(true);
  }, []);

  const handleCarryCalculatorToQuote = (calculatedKva: number, substationType: string) => {
    setQuoteKva(calculatedKva);
    setQuoteSubstationType(substationType);
    setQuoteService('Cabines Primárias (15 a 34,5 kV)');
    handleNavigate('orcamento');
  };

  // Track active navigation section on scroll
  useEffect(() => {
    const sections = [
      'inicio',
      'maqueta3d',
      'empresa',
      'servicos',
      'obras',
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
      <ScrollProgressBar />

      <CinematicIntro onComplete={handleIntroComplete} />

      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onNavigate={handleNavigate}
        onNavigateToQuote={handleNavigateToQuoteWithService}
      />

      <div
        className={`min-h-screen ${
          isDark ? 'bg-[#04090D] text-slate-100' : 'bg-[#F6F8FA] text-slate-900'
        } font-sans ${
          introFinished ? '' : 'pointer-events-none'
        }`}
      >
        <Header
          activeSection={activeSection}
          onNavigate={handleNavigate}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onOpenCommand={() => setIsCommandOpen(true)}
        />

        <main>
          <Hero onNavigate={handleNavigate} isDark={isDark} />

          <InfiniteClientsMarquee onSelectSection={handleNavigate} />

          {/* Interactive 3D Substation Twin & Power Transformer (100% Preserved) */}
          <section
            ref={viewerSectionRef}
            id="maqueta3d"
            className="relative pt-16 sm:pt-20 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.14em] uppercase text-[#0A3D4A] dark:text-cyan-400 font-bold mb-2">
                  <span>Engenharia 3D Real</span>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">/</span>
                  <span>Digital Twin NBR 5356</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-slate-950 dark:text-white">
                  Inspeção 3D de Subestação e Transformador de Potência
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-2xl">
                  Interaja com o modelo tridimensional de alta tensão. Teste a vista explodida mecânica, inspecione as buchas de 500 kV, analise o núcleo magnético em modo Raio-X e simule arcos de descarga dielétrica.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  onClick={() => handleNavigate('orcamento')}
                  className="btn-metallic-sheen inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold font-mono uppercase bg-[#0A3D4A] hover:bg-[#0d4d5e] text-white dark:bg-[#C9A227] dark:hover:bg-[#deb338] dark:text-slate-950 transition-colors cursor-pointer"
                >
                  <span>Projetar Subestação</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {shouldMount3D ? (
              <Suspense
                fallback={
                  <div className="h-[660px] md:h-[760px] w-full rounded-2xl bg-[#0b1117] border border-slate-800 flex flex-col items-center justify-center text-white gap-3">
                    <div className="h-8 w-8 rounded-full border-2 border-[#C9A227] border-t-transparent animate-spin" />
                    <span className="text-xs font-mono uppercase tracking-widest text-slate-300">
                      Inicializando Subestação 3D WebGL...
                    </span>
                  </div>
                }
              >
                <Substation3DViewer />
              </Suspense>
            ) : (
              <div className="h-[660px] md:h-[760px] w-full rounded-2xl bg-[#0b1117] border border-slate-800 flex flex-col items-center justify-center text-white gap-3">
                <div className="h-8 w-8 rounded-full border-2 border-[#C9A227] border-t-transparent animate-spin" />
                <span className="text-xs font-mono uppercase tracking-widest text-slate-300">
                  Preparando Subestação 3D WebGL...
                </span>
              </div>
            )}
          </section>

          <CompanySection onNavigate={handleNavigate} />

          <ServicesSection onNavigateToQuote={handleNavigateToQuoteWithService} />

          <ExecutedProjectsSection
            onNavigateToQuote={handleNavigateToQuoteWithService}
            whatsAppNumber="5511987654321"
          />

          <ClientsSection isDark={isDark} onNavigateToQuote={() => handleNavigate('orcamento')} />

          <DemandCalculator onCarryToQuote={handleCarryCalculatorToQuote} />

          <QuoteSection
            initialService={quoteService}
            initialKva={quoteKva}
            initialSubstationType={quoteSubstationType}
          />

          <ContactSection />
        </main>

        <Footer onNavigate={handleNavigate} onScrollToTop={scrollToTop} />
      </div>

      {introFinished && (
        <>
          <PrecisionCursor />

          {/* Right-side Floating WhatsApp & Instagram */}
          <FloatingSocialButtons
            whatsAppNumber="5511987654321"
            instagramUrl="https://www.instagram.com/grupo_omega_construtora/"
          />

          {/* Left-side Technical Virtual Assistant */}
          <VirtualAssistant
            onNavigateToQuote={handleNavigateToQuoteWithService}
            whatsAppNumber="5511987654321"
            phoneNumber="(11) 3900-8800"
            instagramUrl="https://www.instagram.com/grupo_omega_construtora/"
          />
        </>
      )}
    </>
  );
}
