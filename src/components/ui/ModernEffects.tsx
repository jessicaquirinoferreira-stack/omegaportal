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
  ShieldCheck,
  X,
  Compass,
  Camera,
} from 'lucide-react';
import { SERVICES_DATA, CLIENTS_DATA } from '../../data/companyData';

/**
 * 1. GPU-Accelerated Top Hairline Scroll Progress Bar
 * Zero React re-renders: updates scaleX via rAF.
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
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent pointer-events-none">
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-gradient-to-r from-[#0A3D4A] via-[#996515] to-[#C9A227]"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
};

/**
 * 2. Zero-Re-Render Pointer Spotlight Surface
 * Pure CSS custom properties (--mouse-x, --mouse-y) with restrained architectural glow.
 */
interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spotlightColor?: string;
  className?: string;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  spotlightColor = 'rgba(201, 162, 39, 0.10)',
  className = '',
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
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
          background: `radial-gradient(420px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${spotlightColor}, transparent 50%)`,
        }}
      />
      <div className="relative z-10 h-full flex flex-col justify-between">{children}</div>
    </div>
  );
};

/**
 * 3. Subtle Magnetic Tactile Wrapper (Pointer-fine desktop only, respects reduced motion)
 */
interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export const Magnetic: React.FC<MagneticProps> = ({
  children,
  strength = 0.14,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    if (window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return;
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
 * 4. Editorial Architectural Ticker (Zero-JS marquee with hairline dividers)
 */
const MARQUEE_PARTNERS = [
  { name: 'Hypermarcas · Hypera Pharma', tag: 'Subestação 15 MVA' },
  { name: 'Mendes Junior · Metrô SP', tag: 'Cabines Primárias' },
  { name: 'Continental Pneus', tag: 'Bus Way & Transformadores' },
  { name: 'ArcelorMittal Aços', tag: 'Barramentos Bus Way' },
  { name: 'Unilever', tag: 'Redes Primárias & Secundárias' },
  { name: 'Ericsson Telecom', tag: 'Cabines de Média Tensão' },
  { name: 'Acument Global', tag: 'Subestação 5 MVA' },
  { name: 'CTEEP · AlarmTek', tag: 'Subestações até 500 kV' },
  { name: 'Pom Pom Fraldas', tag: 'Cabine Primária 5 MVA' },
  { name: 'Tyco / ADT', tag: 'Iluminação Industrial' },
  { name: 'Fixopar Parafusos', tag: 'Cabines 4 MVA' },
  { name: 'Peguform Auto Partes', tag: 'Instalações Fabris' },
];

export const InfiniteClientsMarquee: React.FC<{ onSelectSection?: (id: string) => void }> = ({
  onSelectSection,
}) => {
  return (
    <div className="relative w-full overflow-hidden border-y border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#051217] py-3.5 select-none">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-28 bg-gradient-to-r from-white dark:from-[#051217] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-28 bg-gradient-to-l from-white dark:from-[#051217] to-transparent" />

      <div className="flex items-center animate-[marquee_44s_linear_infinite] hover:[animation-play-state:paused] w-max">
        {[...MARQUEE_PARTNERS, ...MARQUEE_PARTNERS].map((partner, idx) => (
          <button
            key={`${partner.name}-${idx}`}
            type="button"
            onClick={() => onSelectSection?.('clientes')}
            className="group flex items-center gap-3 px-6 border-r border-slate-200 dark:border-slate-800/90 text-left transition-colors cursor-pointer shrink-0"
          >
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-[#996515] dark:group-hover:text-[#C9A227] transition-colors">
              {partner.name}
            </span>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              {partner.tag}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * 5. Instant Command Palette (Cmd+K / Ctrl+K)
 */
interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
  onNavigateToQuote: (serviceTitle?: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onNavigateToQuote,
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
    { id: 'servicos', label: 'Portfólio Completo (12 Serviços Elétricos)', category: 'Especialidades', icon: Zap },
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-xl bg-white dark:bg-[#071E26] border border-slate-200 dark:border-[#195363] shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 px-4 py-3.5">
              <Search className="h-4 w-4 text-[#0A3D4A] dark:text-[#C9A227] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar serviços (500 kV, Cabine Primária, Bus Way), obras ou clientes..."
                className="w-full bg-transparent text-sm text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer"
                aria-label="Fechar busca"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto p-3 space-y-5">
              <div>
                <div className="px-2.5 pb-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
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
                          className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-teal-50/80 dark:hover:bg-[#0D4F5F]/50 hover:text-[#0A3D4A] dark:hover:text-white transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 text-[#0A3D4A] dark:text-[#C9A227] group-hover:bg-[#0A3D4A] group-hover:text-white transition-colors">
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

                </div>
              </div>

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
                        className="w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Zap className="h-4 w-4 text-[#996515] dark:text-[#C9A227] shrink-0" />
                          <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {service.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
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
                        className="w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
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

            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#05141A] px-4 py-2.5 text-[11px] font-mono text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-[#0A3D4A] dark:text-[#C9A227]" />
                <span>Omega Engenharia · 200.000+ kVA Instalados</span>
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
