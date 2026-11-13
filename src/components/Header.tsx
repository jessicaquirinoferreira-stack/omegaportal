import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, PhoneCall, ArrowRight, Volume2, VolumeX, Search, Instagram, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../utils/soundEffects';
import { OMEGA_LOGO_SRC, OMEGA_OFFICIAL_LOGO } from '../data/companyData';
import { getDarkLogoDataUrl } from '../utils/logoProcessor';

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenCommand?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onNavigate,
  isDark,
  onToggleTheme,
  onOpenCommand,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundFx.isMuted());
  const [darkLogoSrc, setDarkLogoSrc] = useState<string>(OMEGA_LOGO_SRC);

  useEffect(() => {
    getDarkLogoDataUrl(OMEGA_LOGO_SRC, (res) => {
      setDarkLogoSrc(res);
    }, OMEGA_OFFICIAL_LOGO);
  }, []);

  const handleToggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'maqueta3d', label: 'Subestação 3D' },
    { id: 'empresa', label: 'Empresa' },
    { id: 'servicos', label: 'Serviços' },
    { id: 'obras', label: 'Obras' },
    { id: 'clientes', label: 'Clientes' },
    { id: 'calculadora', label: 'Cálculo kVA' },
    { id: 'contato', label: 'Contato' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? isDark
            ? 'bg-[#04090D]/92 backdrop-blur-md border-b border-slate-800/90 shadow-[0_8px_32px_rgba(0,0,0,0.45)] py-3'
            : 'bg-white/94 backdrop-blur-md border-b border-slate-200/90 shadow-[0_6px_24px_rgba(15,23,42,0.06)] py-3'
          : isDark
            ? 'bg-[#04090D]/72 backdrop-blur-xs border-b border-slate-800/40 py-3.5'
            : 'bg-white/82 backdrop-blur-xs border-b border-slate-200/70 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Zone 1: Official Transparent 3D Logo */}
          <button
            onClick={() => handleLinkClick('inicio')}
            className="flex items-center group text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] rounded-md shrink-0 py-0.5 bg-transparent"
            aria-label="Grupo Omega - Engenharia e Construções Elétricas - Página Inicial"
          >
            <img
              src={isDark ? darkLogoSrc : OMEGA_LOGO_SRC}
              alt="Grupo Omega - Engenharia e Construções Elétricas"
              width={256}
              height={128}
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== OMEGA_OFFICIAL_LOGO) {
                  target.src = OMEGA_OFFICIAL_LOGO;
                }
              }}
              className="h-9 min-[380px]:h-10 sm:h-11 md:h-12 w-auto max-w-[144px] min-[380px]:max-w-[180px] sm:max-w-[230px] object-contain bg-transparent transition-transform duration-300 group-hover:scale-[1.02] filter drop-shadow-[0_2px_6px_rgba(15,23,42,0.10)] dark:brightness-110 dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.95)]"
              loading="eager"
              decoding="async"
            />
          </button>

          {/* Zone 2: Clean Hairline Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6 shrink-0" aria-label="Navegação Principal">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    soundFx.playSwitchClick();
                    handleLinkClick(link.id);
                  }}
                  className={`relative text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer py-1.5 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-[#0A3D4A] dark:text-[#C9A227]'
                      : 'text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="omega-nav-underline"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-[#996515] dark:bg-[#C9A227]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Compact Utilities & Single Architectural CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {onOpenCommand && (
              <button
                type="button"
                onClick={() => {
                  soundFx.playSwitchClick();
                  onOpenCommand();
                }}
                className="hidden md:inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono text-slate-600 hover:text-slate-950 bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 dark:bg-[#08131A] dark:text-slate-300 dark:hover:text-white dark:border-slate-800 transition-colors cursor-pointer"
                title="Busca Rápida (Ctrl+K / ⌘K)"
                aria-label="Abrir busca rápida"
              >
                <Search className="w-3.5 h-3.5 text-[#0A3D4A] dark:text-[#C9A227]" />
                <kbd className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  ⌘K
                </kbd>
              </button>
            )}

            <button
              onClick={handleToggleSound}
              className={`p-2 rounded-lg transition-colors cursor-pointer border ${
                !isMuted
                  ? 'bg-teal-50 text-[#0A3D4A] border-teal-300 dark:bg-cyan-950/60 dark:text-cyan-400 dark:border-cyan-700/60'
                  : 'bg-slate-100/80 text-slate-600 hover:text-slate-950 border-slate-200 hover:bg-slate-200/70 dark:bg-[#08131A] dark:text-slate-400 dark:hover:text-white dark:border-slate-800'
              }`}
              aria-label={isMuted ? 'Ativar efeitos sonoros' : 'Desativar som'}
              title={isMuted ? 'Ativar áudio mecânico' : 'Áudio mecânico ativo'}
            >
              {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                soundFx.playSwitchClick();
                onToggleTheme();
              }}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-950 bg-slate-100/80 hover:bg-slate-200/70 border border-slate-200 dark:bg-[#08131A] dark:hover:bg-slate-800 dark:text-slate-300 dark:hover:text-white dark:border-slate-800 transition-colors cursor-pointer"
              aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
              title={isDark ? 'Modo Claro' : 'Modo Escuro'}
            >
              {isDark ? <Sun className="w-4 h-4 text-[#C9A227]" /> : <Moon className="w-4 h-4 text-[#0A3D4A]" />}
            </button>

            <button
              onClick={() => {
                soundFx.playSwitchClick();
                handleLinkClick('orcamento');
              }}
              className="btn-metallic-sheen hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold tracking-[0.1em] uppercase text-white bg-[#0A3D4A] hover:bg-[#0d4d5e] dark:bg-gradient-to-r dark:from-[#C9A227] dark:to-[#DFBA48] dark:hover:from-[#d9b33a] dark:hover:to-[#eccb62] dark:text-slate-950 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Orçamento</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200 dark:text-slate-300 dark:hover:text-white dark:bg-slate-900 dark:border-slate-800 transition-colors cursor-pointer"
              aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="xl:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 pt-4 pb-6 space-y-3 shadow-xl"
          >
            <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800/80">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-left px-2 py-3 text-sm font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                    activeSection === link.id
                      ? 'text-[#996515] dark:text-[#C9A227]'
                      : 'text-slate-800 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2.5">
              <button
                onClick={() => handleLinkClick('orcamento')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-xs font-bold tracking-wider uppercase text-white bg-[#0A3D4A] hover:bg-[#0d4d5e] dark:bg-[#C9A227] dark:text-slate-950 cursor-pointer"
              >
                <span>Solicitar Orçamento Técnico</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://wa.me/5511987654321?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento%20t%C3%A9cnico%20da%20Omega%20Engenharia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20ba5a] transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href="https://www.instagram.com/grupo_omega_construtora/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-[#FD1D1D] via-[#E1306C] to-[#833AB4]"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </a>
              </div>

              <a
                href="tel:+551139008800"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 dark:text-slate-300 dark:bg-slate-900 dark:border-slate-800"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#996515] dark:text-[#C9A227]" />
                <span>Plantão Central: (11) 3900-8800</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
