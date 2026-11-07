import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Zap,
  Building2,
  Calculator,
  FileText,
  Box,
  Phone,
  ArrowRight,
  Command,
  Play,
  Sparkles,
  ShieldCheck,
  X,
  Compass,
  Camera,
} from 'lucide-react';
import { SERVICES_DATA, CLIENTS_DATA } from '../../data/companyData';

/**
 * 1. GPU-Accelerated Top Laser Scroll Progress Bar
 * Zero React state re-renders: updates transform scaleX directly via requestAnimationFrame.
 */
export const ScrollProgressBar: React.FC = () => {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let rafId: number;
    const updateScroll = () => {
      if (!barRef.current) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      barRef.current.style.transform = `scaleX(${progress})`;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2.5px] bg-transparent pointer-events-none">
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-gradient-to-r from-[#0A3D4A] via-[#C9A227] to-[#00D4FF] shadow-[0_0_12px_rgba(201,162,39,0.8)]"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
};

/**
 * 2. Zero-Re-Render Mouse-Tracking Spotlight Card (Aceternity / Magic UI pattern)
 * Uses native CSS custom properties (--mouse-x, --mouse-y) for 60fps performance.
 */
interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spotlightColor?: string;
  className?: string;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  spotlightColor = 'rgba(201, 162, 39, 0.14)',
  className = '',
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`group/spotlight relative overflow-hidden ${className}`}
      {...props}
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100 z-0"
        style={{
          background: `radial-gradient(480px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${spotlightColor}, transparent 45%)`,
        }}
      />
      <div className="relative z-10 h-full flex flex-col justify-between">{children}</div>
    </div>
  );
};

/**
 * 3. Magnetic Tactile Wrapper (Studio Freight / GSAP inspired, pure transform)
 */
interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export const Magnetic: React.FC<MagneticProps> = ({
  children,
  strength = 0.22,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
    ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'translate3d(0px, 0px, 0)';
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block transition-transform duration-200 ease-out will-change-transform ${className}`}
    >
      {children}
    </div>
  );
};

/**
 * 4. Animated SVG Grid Energy Beams (Magic UI / Linear Background Beams)
 * Lightweight SVG CSS animations with zero JS loop overhead.
 */
export const GridBeams: React.FC<{ isDark?: boolean }> = ({ isDark = false }) => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      <svg
        className="h-full w-full opacity-55 dark:opacity-45"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="omega-modern-grid"
            width="64"
            height="64"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 64 0 L 0 0 0 64"
              fill="none"
              stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(10,61,74,0.065)'}
              strokeWidth="1"
            />
          </pattern>
          <linearGradient id="beam-grad-gold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#C9A227" />
            <stop offset="100%" stopColor="#00D4FF" />
          </linearGradient>
          <linearGradient id="beam-grad-vert" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#0A3D4A" />
            <stop offset="100%" stopColor="#C9A227" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#omega-modern-grid)" />

        {/* Horizontal & Vertical Traveling Energy Pulses */}
        <motion.line
          x1="-20%"
          y1="192"
          x2="0%"
          y2="192"
          stroke="url(#beam-grad-gold)"
          strokeWidth="2"
          animate={{ x1: ['-20%', '120%'], x2: ['0%', '140%'] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
        />
        <motion.line
          x1="120%"
          y1="384"
          x2="140%"
          y2="384"
          stroke="url(#beam-grad-gold)"
          strokeWidth="2"
          animate={{ x1: ['120%', '-20%'], x2: ['140%', '0%'] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'linear', delay: 2 }}
        />
        <motion.line
          x1="320"
          y1="-20%"
          x2="320"
          y2="0%"
          stroke="url(#beam-grad-vert)"
          strokeWidth="2"
          animate={{ y1: ['-20%', '120%'], y2: ['0%', '140%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear', delay: 1 }}
        />
      </svg>
    </div>
  );
};

/**
 * 5. Infinite Hardware-Accelerated Client & Standards Marquee Ticker
 */
const MARQUEE_PARTNERS = [
  { name: 'Hypermarcas (Hypera Pharma)', tag: 'Subestação 15 MVA' },
  { name: 'Mendes Junior – Metrô SP', tag: 'Cabines Primárias' },
  { name: 'Continental Pneus', tag: 'Bus Way & Transformadores' },
  { name: 'ArcelorMittal Aços', tag: 'Barramentos Bus Way' },
  { name: 'Unilever', tag: 'Redes Primárias & Secundárias' },
  { name: 'Ericsson Telecom', tag: 'Cabines de Média Tensão' },
  { name: 'Acument Global', tag: 'Subestação 5 MVA' },
  { name: 'AlarmTek / CTEEP', tag: 'Subestações até 500 kV' },
  { name: 'Pom Pom Fraldas', tag: 'Cabine Primária 5 MVA' },
  { name: 'Tyco / ADT', tag: 'Iluminação Industrial' },
  { name: 'Fixopar Parafusos', tag: 'Cabines 4 MVA' },
  { name: 'Peguform Auto Partes', tag: 'Instalações Fabris' },
];

export const InfiniteClientsMarquee: React.FC<{ onSelectSection?: (id: string) => void }> = ({
  onSelectSection,
}) => {
  return (
    <div className="relative w-full overflow-hidden border-b border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#06161D] py-4 select-none">
      {/* Left/Right Fade Masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-28 bg-gradient-to-r from-white dark:from-[#06161D] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-28 bg-gradient-to-l from-white dark:from-[#06161D] to-transparent" />

      <div className="flex items-center gap-6 animate-[marquee_38s_linear_infinite] hover:[animation-play-state:paused] w-max">
        {[...MARQUEE_PARTNERS, ...MARQUEE_PARTNERS].map((partner, idx) => (
          <button
            key={`${partner.name}-${idx}`}
            type="button"
            onClick={() => onSelectSection?.('clientes')}
            className="group flex items-center gap-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/70 px-4 py-2 transition-all hover:border-[#996515] dark:hover:border-[#C9A227] hover:bg-white dark:hover:bg-slate-900 cursor-pointer shrink-0 shadow-2xs"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#996515] dark:bg-[#C9A227]" />
            <span className="text-xs font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-[#0A3D4A] dark:group-hover:text-[#C9A227] transition-colors">
              {partner.name}
            </span>
            <span className="rounded bg-[#0A3D4A]/10 dark:bg-[#0A3D4A]/50 px-2 py-0.5 text-[10px] font-mono font-semibold text-[#0A3D4A] dark:text-[#C9A227]">
              {partner.tag}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * 6. Instant Command Palette (Cmd+K / Ctrl+K - inspired by pacocoursey/cmdk & Linear)
 */
interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
  onNavigateToQuote: (serviceTitle?: string) => void;
  onReplayIntro: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onNavigateToQuote,
  onReplayIntro,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const quickActions = [
    { id: 'orcamento', label: 'Solicitar Orçamento Técnico', category: 'Ação Rápida', icon: FileText },
    { id: 'obras', label: 'Ver 14 Obras Executadas (Serviços Já Prestados)', category: 'Acervo Real', icon: Camera },
    { id: 'calculadora', label: 'Calculadora de Demanda kVA (NBR)', category: 'Ferramenta Interativa', icon: Calculator },
    { id: 'maqueta3d', label: 'Inspeção 3D de Subestação 500 kV (WebGL)', category: 'Digital Twin 3D', icon: Box },
    { id: 'clientes', label: 'Ver 16 Cases Reais (Hypermarcas, Metrô SP, Unilever...)', category: 'Portfólio', icon: Building2 },
    { id: 'empresa', label: 'Sobre a Omega Engenharia (25+ Anos)', category: 'Institucional', icon: Compass },
    { id: 'contato', label: 'Falar com Plantão de Engenharia', category: 'Contato Direto', icon: Phone },
  ];

  const matchedServices = useMemo(() => {
    if (!query.trim()) return SERVICES_DATA.slice(0, 5);
    return SERVICES_DATA.filter(
      (s) =>
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.category.toLowerCase().includes(query.toLowerCase()) ||
        s.voltageRange.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 6);
  }, [query]);

  const matchedClients = useMemo(() => {
    if (!query.trim()) return CLIENTS_DATA.slice(0, 4);
    return CLIENTS_DATA.filter(
      (c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.scope.toLowerCase().includes(query.toLowerCase()) ||
        c.city.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white dark:bg-[#071E26] border border-slate-200 dark:border-[#195363] shadow-2xl"
          >
            {/* Search Input Header */}
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 px-4 py-3.5">
              <Search className="h-5 w-5 text-[#0A3D4A] dark:text-[#C9A227] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar serviços (ex: 500 kV, Cabine Primária, Bus Way), clientes ou ferramentas..."
                className="w-full bg-transparent text-sm sm:text-base text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results Container */}
            <div className="max-h-[65vh] overflow-y-auto p-3 space-y-5">
              {/* Quick Navigation & Replay Intro */}
              <div>
                <div className="px-2.5 pb-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                  Acesso Rápido & Ferramentas
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {quickActions
                    .filter(
                      (a) =>
                        !query.trim() ||
                        a.label.toLowerCase().includes(query.toLowerCase()) ||
                        a.category.toLowerCase().includes(query.toLowerCase())
                    )
                    .map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.id}
                          type="button"
                          onClick={() => {
                            onNavigate(action.id);
                            onClose();
                          }}
                          className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-teal-50/90 dark:hover:bg-[#0D4F5F]/50 hover:text-[#0A3D4A] dark:hover:text-white transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-[#0A3D4A] dark:text-[#C9A227] group-hover:bg-[#0A3D4A] group-hover:text-white transition-colors">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="truncate">
                              <div className="font-semibold truncate">{action.label}</div>
                              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                                {action.category}
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-0 group-hover:opacity-100 text-[#996515] dark:text-[#C9A227] transition-opacity" />
                        </button>
                      );
                    })}

                  {/* Replay 6s Cinematic Intro Button */}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onReplayIntro();
                    }}
                    className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-[#C9A227]/20 transition-colors cursor-pointer group border border-dashed border-[#C9A227]/50"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#C9A227]/20 text-[#996515] dark:text-[#C9A227]">
                        <Play className="h-4 w-4 fill-current" />
                      </div>
                      <div>
                        <div className="font-bold text-[#996515] dark:text-[#C9A227]">
                          Reproduzir Intro Cinematográfica (6s)
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          Animação de Alta Tensão Omega
                        </div>
                      </div>
                    </div>
                    <Sparkles className="h-3.5 w-3.5 text-[#996515] dark:text-[#C9A227]" />
                  </button>
                </div>
              </div>

              {/* Services List */}
              {matchedServices.length > 0 && (
                <div>
                  <div className="px-2.5 pb-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Engenharia & Serviços ({matchedServices.length})
                  </div>
                  <div className="space-y-1">
                    {matchedServices.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => {
                          onNavigateToQuote(service.title);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Zap className="h-4 w-4 text-[#996515] dark:text-[#C9A227] shrink-0" />
                          <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {service.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-600 dark:text-slate-300">
                            {service.voltageRange}
                          </span>
                          <span className="text-[11px] font-bold text-[#0A3D4A] dark:text-[#C9A227] group-hover:underline">
                            Orçar →
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Clients List */}
              {matchedClients.length > 0 && (
                <div>
                  <div className="px-2.5 pb-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Cases & Clientes Executados
                  </div>
                  <div className="space-y-1">
                    {matchedClients.map((client) => (
                      <button
                        key={client.id}
                        type="button"
                        onClick={() => {
                          onNavigate('clientes');
                          onClose();
                        }}
                        className="w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                            {client.name}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {client.scope}
                          </div>
                        </div>
                        <span className="shrink-0 text-[10px] font-mono font-semibold text-[#996515] dark:text-[#C9A227]">
                          {client.city}/{client.state}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#05141A] px-4 py-2.5 text-[11px] font-mono text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-[#0A3D4A] dark:text-[#C9A227]" />
                <span>Omega Engenharia • 200.000+ kVA Instalados</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-1.5 py-0.5 text-[10px]">
                  ESC
                </kbd>
                <span>para fechar</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/**
 * 7. Floating Quick-Navigation Dock (Aceternity Floating Dock / macOS pattern)
 */
interface FloatingQuickDockProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenCommand: () => void;
}

export const FloatingQuickDock: React.FC<FloatingQuickDockProps> = ({
  activeSection,
  onNavigate,
  onOpenCommand,
}) => {
  const items = [
    { id: 'inicio', label: 'Início', icon: Zap },
    { id: 'maqueta3d', label: '3D Twin', icon: Box },
    { id: 'servicos', label: 'Serviços', icon: ShieldCheck },
    { id: 'obras', label: 'Obras', icon: Camera },
    { id: 'clientes', label: 'Cases', icon: Building2 },
    { id: 'calculadora', label: 'Cálculo kVA', icon: Calculator },
    { id: 'orcamento', label: 'Orçar', icon: FileText },
  ];

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center gap-1 rounded-2xl bg-white/90 dark:bg-[#071E26]/90 backdrop-blur-xl border border-slate-200/90 dark:border-[#1E5666] px-2.5 py-1.5 shadow-[0_12px_36px_-8px_rgba(10,61,74,0.22)]">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={`group relative flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-[#0A3D4A] text-white shadow-sm'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            <Icon
              className={`h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110 ${
                isActive ? 'text-[#C9A227]' : 'text-[#0A3D4A] dark:text-[#C9A227]'
              }`}
            />
            <span>{item.label}</span>
          </button>
        );
      })}

      <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1" />

      <button
        type="button"
        onClick={onOpenCommand}
        className="flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-[#996515] hover:text-white dark:hover:bg-[#C9A227] dark:hover:text-slate-950 px-3 py-2 text-xs font-mono font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
        title="Busca Rápida (Ctrl+K ou ⌘K)"
      >
        <Command className="h-3.5 w-3.5" />
        <span>Buscar</span>
      </button>
    </div>
  );
};
