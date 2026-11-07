import React, { useState, useMemo } from 'react';
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
  Sparkles,
} from 'lucide-react';
import { EXECUTED_PROJECTS, ExecutedProject } from '../data/executedProjectsData';
import { soundFx } from '../utils/soundEffects';

interface ExecutedProjectsSectionProps {
  onNavigateToQuote: (serviceTitle?: string) => void;
  whatsAppNumber?: string;
}

const CATEGORIES = [
  'Todas as Obras',
  'Subestações',
  'Cabines Primárias',
  'Painéis Elétricos',
  'Instalações Industriais',
  'Manutenção & Transformadores',
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

  const getWhatsAppLinkForProject = (proj: ExecutedProject) => {
    const text = `Olá! Vi no acervo de obras da Omega o serviço prestado: "${proj.title}" (Obra #${proj.number} - ${proj.location}) e gostaria de uma proposta técnica para minha empresa.`;
    return `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section
      id="obras"
      className="py-20 lg:py-28 bg-[#071318] text-white border-b border-slate-800/90 relative overflow-hidden"
    >
      {/* Background Tech Grid & Energy Beam Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(201,162,39,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,212,255,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#0A3D4A]/30 to-transparent blur-3xl rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#C9A227] font-bold mb-3">
              <Camera className="w-4 h-4 text-[#C9A227]" />
              <span>03. Acervo Real de Campo</span>
              <span aria-hidden="true" className="text-slate-600">
                /
              </span>
              <span>Serviços Já Prestados</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight">
              Obras Executadas e Serviços Prestados.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-medium">
              Fotografias reais das obras civis-eletromecânicas, pátios de subestações de alta tensão, montagem de cubículos blindados Schneider e painéis elétricos com equipe própria da Omega Engenharia.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="rounded-2xl border border-[#195363] bg-[#0A262F]/80 px-4 py-3 shadow-lg backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[#C9A227]">
                14 Obras
              </div>
              <div className="text-[11px] font-mono text-slate-300 font-semibold uppercase tracking-wider mt-0.5">
                Registros Oficiais
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 px-4 py-3 shadow-lg backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-400">
                100%
              </div>
              <div className="text-[11px] font-mono text-emerald-200 font-semibold uppercase tracking-wider mt-0.5">
                Projetos Entregues
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    soundFx.playSwitchClick();
                    setSelectedCategory(cat);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#0A3D4A] text-white font-bold shadow-md shadow-[#0A3D4A]/50 border border-[#C9A227]'
                      : 'bg-[#0F2229] text-slate-300 hover:text-white hover:bg-[#143640] border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C9A227]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por obra, local ou escopo..."
              className="w-full rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#0A222B] border border-slate-700/80 text-white placeholder-slate-400 focus:outline-none focus:border-[#C9A227] transition-all"
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

        {/* 14 Projects Cards Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj, idx) => (
              <motion.div
                key={proj.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: idx * 0.03 }}
                onClick={() => handleOpenModal(proj)}
                className="group relative rounded-2xl bg-[#091D24] border border-[#194553] hover:border-[#C9A227] overflow-hidden flex flex-col shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                {/* Image Container with high-level crisp rendering */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                  <picture>
                    <source srcSet={proj.enhancedWebp} type="image/webp" />
                    <img
                      src={proj.enhancedJpg}
                      alt={proj.title}
                      loading="lazy"
                      onError={(e) => {
                        // Fallback to original public URL
                        const target = e.currentTarget;
                        if (target.src !== proj.originalUrl) {
                          target.src = proj.originalUrl;
                        }
                      }}
                      className="h-full w-full object-cover object-center filter brightness-[1.03] contrast-[1.05] saturate-[1.05] transition-transform duration-500 group-hover:scale-108"
                    />
                  </picture>

                  {/* Gradient Depth Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#091D24] via-transparent to-black/30 opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-black/75 text-[#C9A227] border border-[#C9A227]/50 backdrop-blur-md">
                      <Sparkles className="w-3 h-3 text-[#C9A227]" />
                      <span>Obra #{proj.number < 10 ? `0${proj.number}` : proj.number}</span>
                    </span>

                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#0A3D4A]/90 text-cyan-200 border border-cyan-400/30 backdrop-blur-md">
                      {proj.voltageClass}
                    </span>
                  </div>

                  {/* Hover Inspect Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950/90 text-white border border-[#C9A227] text-xs font-semibold shadow-2xl backdrop-blur-md transform group-hover:scale-105 transition-transform">
                      <Maximize2 className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>Inspecionar Obra</span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#C9A227] font-semibold mb-1.5">
                      <Zap className="w-3 h-3 text-[#C9A227]" />
                      <span>{proj.category}</span>
                    </div>

                    <h3 className="text-sm font-bold font-display text-white group-hover:text-[#F5E6B3] transition-colors line-clamp-2 leading-snug">
                      {proj.title}
                    </h3>

                    <p className="mt-2 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {proj.scope}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 truncate max-w-[170px]">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{proj.location}</span>
                    </span>

                    <span className="text-[10px] font-mono font-semibold text-emerald-400">
                      Ver Detalhes →
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 rounded-2xl bg-[#091D24] border border-[#194553] text-slate-300">
            <Camera className="h-10 w-10 mx-auto mb-3 text-[#C9A227]" />
            <p className="text-lg font-semibold">Nenhuma obra encontrada para o filtro selecionado.</p>
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
        <div className="mt-14 rounded-2xl bg-gradient-to-r from-[#0A262F] via-[#0D3844] to-[#0A262F] border border-[#1E5666] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#C9A227] mb-1">
              <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
              <span>Garantia de Execução & ART CREA</span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold font-display text-white">
              Quer ver um projeto ou visitar uma de nossas obras em operação?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Nossa equipe de engenharia coordena visitas técnicas e apresenta projetos executivos detalhados para novas instalações industriais e subestações.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`https://wa.me/${whatsAppNumber}?text=${encodeURIComponent('Olá! Gostaria de falar com o coordenador técnico sobre as obras e serviços prestados da Omega Engenharia.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Falar no WhatsApp</span>
            </a>

            <button
              onClick={() => onNavigateToQuote('Obras Executadas')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C9A227] hover:bg-[#deb338] text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
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
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#091D24] border border-[#215E70] shadow-[0_25px_70px_rgba(0,0,0,0.85)] text-white flex flex-col no-scrollbar"
            >
              {/* Modal Top Header */}
              <div className="sticky top-0 z-20 px-6 py-4 bg-[#07191F]/95 backdrop-blur-md border-b border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-[#C9A227]/20 border border-[#C9A227]/50 text-[#C9A227] text-xs font-mono font-bold">
                    Obra #{activeModalProject.number}
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold font-display text-white">
                      {activeModalProject.title}
                    </h3>
                    <p className="text-xs text-slate-300 font-mono">
                      {activeModalProject.category} • {activeModalProject.voltageClass}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
                  aria-label="Fechar visualização"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Modal Body */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* Photo in Enhanced Full Glory */}
                <div className="relative w-full rounded-2xl overflow-hidden bg-black border border-slate-700/80 shadow-2xl">
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
                      className="w-full max-h-[500px] object-contain mx-auto filter brightness-[1.03] contrast-[1.05]"
                    />
                  </picture>

                  {/* Watermark / Badge */}
                  <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#C9A227]/40 text-[11px] font-mono text-[#C9A227] font-semibold flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>Registro Fotográfico Oficial • Omega Engenharia</span>
                  </div>
                </div>

                {/* Technical Overview Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 rounded-xl bg-[#06161D] border border-slate-800">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      Localização
                    </div>
                    <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>{activeModalProject.location}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#06161D] border border-slate-800">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      Tipo de Instalação
                    </div>
                    <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{activeModalProject.clientType}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#06161D] border border-slate-800">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      Normas & Segurança
                    </div>
                    <div className="text-xs font-mono font-bold text-[#C9A227] mt-1 truncate" title={activeModalProject.standards}>
                      {activeModalProject.standards}
                    </div>
                  </div>
                </div>

                {/* Detailed Scope */}
                <div className="p-5 rounded-2xl bg-[#06161D] border border-slate-800 space-y-3">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C9A227] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Memorial Descritivo do Serviço Executado</span>
                  </h4>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {activeModalProject.scope}
                  </p>
                </div>

                {/* Technical Highlights */}
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Destaques Técnicos da Obra
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeModalProject.technicalHighlights.map((hl, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-[#06161D]/70 border border-slate-800/80 text-xs text-slate-200"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modal Actions */}
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
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Orçar Serviço no WhatsApp</span>
                    </a>

                    <button
                      onClick={() => {
                        onNavigateToQuote(activeModalProject.title);
                        handleCloseModal();
                      }}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#C9A227] hover:bg-[#deb338] text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
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
