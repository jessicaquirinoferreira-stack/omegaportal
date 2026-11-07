import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, PhoneCall, ArrowRight, Volume2, VolumeX, Box, Search, Instagram, MessageCircle } from 'lucide-react';
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
    getDarkLogoDataUrl(OMEGA_OFFICIAL_LOGO, (res) => {
      setDarkLogoSrc(res);
    });
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
    { id: 'inicio', label: 'Início' },
    { id: 'maqueta3d', label: 'Subestação 3D', isHighlight: true },
    { id: 'empresa', label: 'Empresa' },
    { id: 'servicos', label: 'Serviços' },
    { id: 'obras', label: 'Obras' },
    { id: 'clientes', label: 'Clientes' },
    { id: 'calculadora', label: 'Calculadora' },
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
            ? 'bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20 py-3.5'
            : 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm shadow-slate-900/5 py-3.5'
          : isDark
            ? 'bg-slate-950/80 backdrop-blur-sm py-4 border-b border-slate-800/40'
            : 'bg-white/90 backdrop-blur-sm py-4 border-b border-slate-200/80 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
          {/* Zone 1: Official Grupo Omega 3D Corporate Logo (100% Transparent Background) */}
          <button
            onClick={() => handleLinkClick('inicio')}
            className="flex items-center group text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] rounded-lg shrink-0 py-0.5 bg-transparent"
            aria-label="Grupo Omega - Engenharia e Construções Elétricas - Página Inicial"
          >
            <img
              src={isDark ? darkLogoSrc : OMEGA_LOGO_SRC}
              alt="Grupo Omega - Engenharia e Construções Elétricas"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== OMEGA_OFFICIAL_LOGO) {
                  target.src = OMEGA_OFFICIAL_LOGO;
                }
              }}
              className="h-11 sm:h-13 md:h-14 w-auto max-w-[200px] sm:max-w-[240px] md:max-w-[270px] object-contain bg-transparent transition-transform duration-300 group-hover:scale-[1.03] filter drop-shadow-[0_2px_6px_rgba(15,23,42,0.12)] dark:brightness-110 dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.95)]"
              loading="eager"
              decoding="async"
            />
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden xl:flex items-center gap-3.5 2xl:gap-5 shrink-0" aria-label="Navegação Principal">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    soundFx.playSwitchClick();
                    handleLinkClick(link.id);
                  }}
                  className={`text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer py-1 whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    link.isHighlight
                      ? isActive
                        ? 'text-[#0A3D4A] dark:text-cyan-400 font-bold border-b-2 border-[#0A3D4A] dark:border-cyan-400'
                        : 'text-[#0A3D4A] dark:text-cyan-400/90 hover:text-black dark:hover:text-cyan-300 bg-teal-50 dark:bg-cyan-950/40 px-2.5 py-1 rounded-md border border-teal-200/80 dark:border-cyan-800/40'
                      : isActive
                      ? 'text-[#996515] dark:text-[#C9A227] border-b-2 border-[#996515] dark:border-[#C9A227] font-bold'
                      : 'text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  {link.isHighlight && <Box className="w-3.5 h-3.5 text-[#0A3D4A] dark:text-cyan-400 animate-pulse" />}
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Quick Search (Cmd+K), Audio Toggle, Theme & Primary Action */}
          <div className="flex items-center gap-2 shrink-0">
            {onOpenCommand && (
              <button
                type="button"
                onClick={() => {
                  soundFx.playSwitchClick();
                  onOpenCommand();
                }}
                className="hidden md:inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono text-slate-600 hover:text-slate-950 bg-slate-100 hover:bg-slate-200/80 border border-slate-300 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:text-white dark:border-slate-700/70 transition-colors cursor-pointer"
                title="Busca Rápida de Engenharia (Ctrl+K / ⌘K)"
              >
                <Search className="w-3.5 h-3.5 text-[#0A3D4A] dark:text-[#C9A227]" />
                <span className="text-[11px] font-semibold">Buscar</span>
                <kbd className="rounded bg-white dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  ⌘K
                </kbd>
              </button>
            )}

            {/* Audio sound FX toggle */}
            <button
              onClick={handleToggleSound}
              className={`p-2 rounded-lg transition-colors cursor-pointer border ${
                !isMuted 
                  ? 'bg-teal-50 text-[#0A3D4A] border-teal-300 dark:bg-cyan-950/60 dark:text-cyan-400 dark:border-cyan-700/60 shadow-sm' 
                  : 'bg-slate-100 text-slate-700 hover:text-slate-950 border-slate-300 hover:bg-slate-200 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:text-white dark:border-slate-800'
              }`}
              aria-label={isMuted ? 'Ativar efeitos sonoros mecânicos' : 'Desativar som'}
              title={isMuted ? 'Efeitos sonoros desativados (clique para ligar)' : 'Efeitos sonoros ativos (relé 60Hz)'}
            >
              {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Theme switcher */}
            <button
              onClick={() => {
                soundFx.playSwitchClick();
                onToggleTheme();
              }}
              className="p-2 rounded-lg text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-300 dark:bg-slate-900/60 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white dark:border-slate-700/60 transition-colors cursor-pointer"
              aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
              title={isDark ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
            >
              {isDark ? <Sun className="w-4 h-4 text-[#C9A227]" /> : <Moon className="w-4 h-4 text-[#0A3D4A]" />}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => {
                soundFx.playSwitchClick();
                handleLinkClick('orcamento');
              }}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase text-white bg-[#996515] hover:bg-[#855712] shadow-md shadow-[#996515]/20 dark:bg-gradient-to-r dark:from-[#C9A227] dark:to-[#deb338] dark:hover:from-[#d8ae31] dark:hover:to-[#ebc142] dark:text-slate-950 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Solicitar Orçamento</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-300 dark:text-slate-300 dark:hover:text-white dark:bg-slate-900/80 dark:border-slate-800 transition-colors cursor-pointer"
              aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-slate-950/98 border-b border-slate-200 dark:border-slate-800 px-4 pt-4 pb-6 space-y-3 shadow-xl backdrop-blur-xl">
          <div className="pb-3 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <img
              src={isDark ? darkLogoSrc : OMEGA_LOGO_SRC}
              alt="Grupo Omega - Engenharia e Construções Elétricas"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== OMEGA_OFFICIAL_LOGO) {
                  target.src = OMEGA_OFFICIAL_LOGO;
                }
              }}
              className="h-10 w-auto max-w-[190px] object-contain bg-transparent filter drop-shadow-[0_2px_5px_rgba(15,23,42,0.12)] dark:brightness-110 dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.95)]"
            />
            <span className="text-[10px] font-mono text-[#996515] dark:text-[#C9A227] font-bold uppercase tracking-wider">
              Navegação
            </span>
          </div>
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeSection === link.id
                    ? 'bg-teal-50 text-[#996515] font-bold dark:bg-[#0A3D4A]/50 dark:text-[#C9A227]'
                    : 'text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-col gap-2.5">
            <button
              onClick={() => handleLinkClick('orcamento')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-xs font-bold tracking-wider uppercase text-white bg-[#996515] hover:bg-[#855712] shadow-md dark:bg-gradient-to-r dark:from-[#C9A227] dark:to-[#deb338] dark:text-slate-950 cursor-pointer"
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
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-[#FD1D1D] via-[#E1306C] to-[#833AB4] transition-opacity hover:opacity-95"
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
        </div>
      )}
    </header>
  );
};
