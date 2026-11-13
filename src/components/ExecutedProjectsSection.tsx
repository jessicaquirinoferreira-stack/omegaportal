import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  MapPin,
  Zap,
  ShieldCheck,
  Building2,
  ExternalLink,
  Search,
  CheckCircle2,
  X,
  PhoneCall,
  ArrowRight,
  Maximize2,
} from 'lucide-react';
import { EXECUTED_PROJECTS, ExecutedProject } from '../data/executedProjectsData';
import { soundFx } from '../utils/soundEffects';
import { getEditorialProjectCardClass } from '../utils/visualEffectsMath';
import { ArchitecturalBrackets, EditorialReveal } from './ui/IndustrialEffects';

interface ExecutedProjectsSectionProps {
  onNavigateToQuote: (serviceTitle?: string) => void;
  whatsAppNumber?: string;
}

const CATEGORIES = [
  { id: 'Todas as Obras', label: 'Todas as Obras' },
  { id: 'Subestações', label: 'Subestações' },
  { id: 'Cabines Primárias', label: 'Cabines Primárias' },
  { id: 'Painéis Elétricos', label: 'Painéis Elétricos' },
  { id: 'Instalações Industriais', label: 'Instalações Industriais' },
  { id: 'Manutenção & Transformadores', label: 'Manutenção & Trafo' },
] as const;

export const ExecutedProjectsSection: React.FC<ExecutedProjectsSectionProps> = ({
  onNavigateToQuote,
  whatsAppNumber = '5511987654321',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas as Obras');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalProject, setActiveModalProject] = useState<ExecutedProject | null>(null);

  const filteredProjects = useMemo(() => {
    return EXECUTED_PROJECTS.filter((proj) => {
      const matchCategory =
        selectedCategory === 'Todas as Obras' || proj.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.scope.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.clientType.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleOpenModal = (proj: ExecutedProject) => {
    soundFx.playSwitchClick();
    setActiveModalProject(proj);
  };

  const handleCloseModal = () => {
    soundFx.playSwitchClick();
    setActiveModalProject(null);
  };

  useEffect(() => {
    if (!activeModalProject) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalProject(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeModalProject]);

  const getWhatsAppLinkForProject = (proj: ExecutedProject) => {
    const text = `Olá! Vi no acervo de obras da Omega o serviço prestado: "${proj.title}" (Obra #${proj.number} - ${proj.location}) e gostaria de uma proposta técnica para minha empresa.`;
    return `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section
      id="obras"
      className="py-20 lg:py-28 bg-[#04090D] text-white border-b border-slate-800/90 relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-blueprint-mesh opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <EditorialReveal className="max-w-3xl">
            <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.14em] uppercase text-[#C9A227] font-bold mb-3">
              <span>03 · Acervo Real de Campo</span>
              <span aria-hidden="true" className="text-slate-600">/</span>
              <span>Serviços Já Prestados</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight leading-[1.08]">
              Obras executadas e comissionadas em campo.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Registros fotográficos oficiais de subestações de alta tensão, cubículos blindados Schneider, montagens eletromecânicas e quadros industriais entregues pela equipe própria da Omega Engenharia.
            </p>
          </EditorialReveal>

          <div className="flex items-center gap-6 shrink-0 border-t pt-4 md:border-t-0 md:pt-0 md:border-l border-slate-800 md:pl-6">
            <div>
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[#C9A227] tabular-nums">
                14
              </div>
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">
                Registros Oficiais
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-400 tabular-nums">
                100%
              </div>
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">
                Entregas com ART
              </div>
            </div>
          </div>
        </div>

        {/* Hairline Filter Tabs & Search */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-10">
          <div className="flex items-center gap-5 overflow-x-auto pb-1 lg:pb-0 no-scrollbar flex-1 min-w-0">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    soundFx.playSwitchClick();
                    setSelectedCategory(cat.id);
                  }}
                  className={`relative pb-1.5 text-xs font-semibold uppercase tracking-[0.06em] whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                    isActive ? 'text-[#C9A227]' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                  {isActive && (
                    <motion.span
                      layoutId="obras-tab-underline"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      className="absolute inset-x-0 -bottom-1 h-[2px] bg-[#C9A227]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-64 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar obra, local ou escopo..."
              aria-label="Buscar obra, local ou escopo"
              className="w-full rounded-lg pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#0A1820] border border-slate-700/80 text-white placeholder-slate-400 focus:outline-none focus:border-[#C9A227] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* 14 Projects Asymmetric Editorial Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj, index) => {
              const numLabel = proj.number < 10 ? `0${proj.number}` : `${proj.number}`;
              const editorialLayout = getEditorialProjectCardClass({
                index,
                totalCount: filteredProjects.length,
                isUnfiltered: selectedCategory === 'Todas as Obras' && searchQuery.trim() === '',
              });

              return (
                <motion.article
                  key={proj.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.22 }}
                  onClick={() => handleOpenModal(proj)}
                  className={`group relative rounded-xl bg-[#08131A] border border-slate-800/90 hover:border-[#C9A227]/85 overflow-hidden flex flex-col transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-18px_rgba(201,162,39,0.22)] ${editorialLayout.spanClass}`}
                >
                  {editorialLayout.isFeatured && (
                    <ArchitecturalBrackets colorClass="border-[#C9A227]/55" sizeClass="w-2.5 h-2.5" />
                  )}

                  {/* Clean Photographic Frame */}
                  <div
                    className={`relative w-full overflow-hidden bg-slate-950 ${editorialLayout.aspectClass}`}
                  >
                    <picture>
                      <source srcSet={proj.enhancedWebp} type="image/webp" />
                      <img
                        src={proj.enhancedJpg}
                        alt={proj.title}
                        width={840}
                        height={560}
                        loading={index < 6 ? 'eager' : 'lazy'}
                        decoding="async"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src !== proj.originalUrl) {
                            target.src = proj.originalUrl;
                          }
                        }}
                        className="h-full w-full object-cover object-center brightness-[1.03] contrast-[1.04] transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    </picture>

                    {/* Calibrated Scrim for Editorial Readout */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08131A] via-transparent to-black/35 opacity-85 group-hover:opacity-65 transition-opacity" />

                    {/* Single Editorial Coordinate Stamp */}
                    <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-[10px] font-mono">
                      <span className="font-bold tracking-wider uppercase text-[#C9A227]">
                        OBRA {numLabel}
                      </span>
                      <span className="text-slate-200 font-semibold">{proj.voltageClass}</span>
                    </div>

                    {/* Inspect Icon on Hover */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <div className="p-2 rounded-lg bg-slate-950/90 text-[#C9A227] border border-[#C9A227]/60">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#C9A227] font-semibold mb-1">
                        {proj.category}
                      </div>
                      <h3 className={`font-bold font-display text-white group-hover:text-[#F5E6B3] transition-colors line-clamp-2 leading-snug ${editorialLayout.isFeatured ? 'text-base sm:text-lg' : 'text-sm'}`}>
                        {proj.title}
                      </h3>
                      <p className="mt-1.5 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {proj.scope}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 min-w-0">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{proj.location}</span>
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(proj);
                        }}
                        className="font-mono font-semibold text-emerald-400 hover:text-emerald-300 whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Inspecionar →
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 rounded-xl bg-[#09171E] border border-slate-800 text-slate-300">
            <Camera className="h-9 w-9 mx-auto mb-3 text-[#C9A227]" />
            <p className="text-base font-semibold">Nenhuma obra encontrada para o filtro selecionado.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('Todas as Obras');
                setSearchQuery('');
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0A3D4A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0D4F5F] cursor-pointer"
            >
              Ver todas as 14 obras
            </button>
          </div>
        )}

        {/* Bottom Contact Strip */}
        <div className="mt-12 rounded-xl bg-[#09171E] border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-[#C9A227] mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Garantia de Execução & ART CREA</span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold font-display text-white">
              Quer conhecer projetos semelhantes em operação?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Nossa equipe coordena visitas técnicas e apresenta memoriais executivos para novas subestações e cabines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={`https://wa.me/${whatsAppNumber}?text=${encodeURIComponent('Olá! Gostaria de falar com o coordenador técnico sobre as obras e serviços prestados da Omega Engenharia.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Falar no WhatsApp</span>
            </a>

            <button
              onClick={() => onNavigateToQuote('Obras Executadas')}
              className="btn-metallic-sheen inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-[#C9A227] to-[#DFBA48] hover:from-[#d9b33a] hover:to-[#eccb62] text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span>Solicitar Orçamento</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* High-Definition Inspection Lightbox Modal */}
      <AnimatePresence>
        {activeModalProject && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#091D24] border border-[#215E70] shadow-2xl text-white flex flex-col no-scrollbar"
            >
              <div className="sticky top-0 z-20 px-6 py-4 bg-[#07191F]/95 backdrop-blur-md border-b border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded bg-[#C9A227]/15 border border-[#C9A227]/50 text-[#C9A227] text-xs font-mono font-bold">
                    Obra #{activeModalProject.number}
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold font-display text-white">
                      {activeModalProject.title}
                    </h3>
                    <p className="text-xs text-slate-300 font-mono">
                      {activeModalProject.category} · {activeModalProject.voltageClass}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                  aria-label="Fechar visualização"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="relative w-full rounded-xl overflow-hidden bg-black border border-slate-700/80">
                  <picture>
                    <source srcSet={activeModalProject.enhancedWebp} type="image/webp" />
                    <img
                      src={activeModalProject.enhancedJpg}
                      alt={activeModalProject.title}
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== activeModalProject.originalUrl) {
                          target.src = activeModalProject.originalUrl;
                        }
                      }}
                      className="w-full max-h-[500px] object-contain mx-auto brightness-[1.03] contrast-[1.04]"
                    />
                  </picture>

                  <div className="absolute bottom-3 left-3 bg-black/80 px-3 py-1.5 rounded border border-[#C9A227]/40 text-[11px] font-mono text-[#C9A227] font-semibold flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Registro Fotográfico Oficial · Omega Engenharia</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 rounded-lg bg-[#06161D] border border-slate-800">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      Localização
                    </div>
                    <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>{activeModalProject.location}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#06161D] border border-slate-800">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      Tipo de Instalação
                    </div>
                    <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{activeModalProject.clientType}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#06161D] border border-slate-800">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      Normas & Segurança
                    </div>
                    <div
                      className="text-xs font-mono font-bold text-[#C9A227] mt-1 truncate"
                      title={activeModalProject.standards}
                    >
                      {activeModalProject.standards}
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#06161D] border border-slate-800 space-y-2.5">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C9A227] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Memorial Descritivo do Serviço Executado</span>
                  </h4>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {activeModalProject.scope}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Destaques Técnicos da Obra
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeModalProject.technicalHighlights.map((hl, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 p-3 rounded-lg bg-[#06161D]/70 border border-slate-800 text-xs text-slate-200"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <a
                    href={activeModalProject.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Ver URL original pública da foto</span>
                  </a>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <a
                      href={getWhatsAppLinkForProject(activeModalProject)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Orçar no WhatsApp</span>
                    </a>

                    <button
                      onClick={() => {
                        onNavigateToQuote(activeModalProject.title);
                        handleCloseModal();
                      }}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#C9A227] hover:bg-[#deb338] text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <span>Proposta Formal</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
