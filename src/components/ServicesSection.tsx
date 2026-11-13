import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Zap, Info } from 'lucide-react';
import { SERVICES_DATA, ServiceDetail } from '../data/companyData';
import { ServiceDetailModal } from './ServiceDetailModal';
import {
  ArchitecturalBrackets,
  CircuitFlowBackdrop,
  EditorialReveal,
  TiltSpotlightCard,
} from './ui/IndustrialEffects';

gsap.registerPlugin(ScrollTrigger);

interface ServicesSectionProps {
  onNavigateToQuote: (serviceTitle?: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onNavigateToQuote }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalService, setActiveModalService] = useState<ServiceDetail | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  const categories = [
    { id: 'all', label: 'Todos (12)' },
    { id: 'Alta Tensão', label: 'Alta Tensão' },
    { id: 'Média Tensão', label: 'Média Tensão' },
    { id: 'Infraestrutura Fabril', label: 'Instalações & Bus Way' },
    { id: 'Gestão de Ativos', label: 'Manutenção & Trafo' },
    { id: 'Distribuição Urbana', label: 'Redes & Loteamentos' },
  ];

  const filteredServices =
    selectedCategory === 'all'
      ? SERVICES_DATA
      : SERVICES_DATA.filter(
          (s) => s.category.includes(selectedCategory) || s.category === selectedCategory
        );

  useEffect(() => {
    if (typeof window === 'undefined' || !gridRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-service-card]', {
        y: 24,
        opacity: 0,
        duration: 0.5,
        stagger: 0.04,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 84%',
          once: true,
        },
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="servicos"
      className="py-20 lg:py-28 bg-[#050C11] text-white border-b border-slate-800/90 relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-blueprint-mesh opacity-35" />
      <CircuitFlowBackdrop variant="section" className="opacity-35" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <EditorialReveal className="max-w-2xl">
            <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.14em] uppercase text-[#C9A227] font-bold mb-3">
              <span>02 · Portfólio de Soluções</span>
              <span aria-hidden="true" className="text-slate-600">/</span>
              <span>Engenharia Integral</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight leading-[1.08]">
              Engenharia elétrica da média à extra alta tensão.
            </h2>
          </EditorialReveal>

          <p className="text-sm text-slate-300 max-w-md leading-relaxed">
            Cumprimento rigoroso das normas ABNT NBR, homologação em concessionárias e execução com foco em disponibilidade contínua.
          </p>
        </div>

        {/* Hairline Category Filter Tabs with Sliding Motion Underline */}
        <div
          className="flex items-center gap-6 overflow-x-auto border-b border-slate-800 pb-0 mb-10 no-scrollbar"
          role="tablist"
          aria-label="Filtrar serviços por especialidade"
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedCategory(cat.id)}
                className={`relative pb-3.5 text-xs font-semibold uppercase tracking-[0.08em] whitespace-nowrap transition-colors cursor-pointer ${
                  isActive ? 'text-[#C9A227]' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="service-tab-underline"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    className="absolute inset-x-0 bottom-0 h-[2px] bg-[#C9A227]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Asymmetric Editorial Bento Grid (All 12 services — zero orphan holes) */}
        <div
          ref={gridRef}
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
            selectedCategory === 'all' ? 'lg:grid-cols-6' : 'lg:grid-cols-3'
          }`}
        >
          {filteredServices.map((service, idx) => {
            const isSpotlight = selectedCategory === 'all' && idx < 2;
            const colSpanClass =
              selectedCategory === 'all'
                ? idx < 2 || idx >= 8
                  ? 'lg:col-span-3'
                  : 'lg:col-span-2'
                : '';
            const indexLabel = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;

            return (
              <TiltSpotlightCard
                key={service.id}
                data-service-card
                maxTiltDeg={2.4}
                spotlightColor="rgba(201, 162, 39, 0.14)"
                className={`rounded-xl bg-[#09151D] border border-slate-800/90 hover:border-[#C9A227]/75 ${colSpanClass}`}
              >
                {isSpotlight && (
                  <ArchitecturalBrackets colorClass="border-[#C9A227]/45" sizeClass="w-2.5 h-2.5" />
                )}
                <div>
                  {service.imageSrc && (
                    <div
                      className={`relative w-full overflow-hidden bg-slate-950 border-b border-slate-800/80 ${
                        isSpotlight ? 'aspect-[16/9]' : 'aspect-[16/10]'
                      }`}
                    >
                      <img
                        src={service.imageSrc}
                        alt={service.title}
                        width={840}
                        height={525}
                        loading={idx < 6 ? 'eager' : 'lazy'}
                        decoding="async"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (service.imageFallback && target.src !== service.imageFallback) {
                            target.src = service.imageFallback;
                          }
                        }}
                        className="w-full h-full object-cover group-hover/tilt:scale-105 transition-transform duration-500 ease-out"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#09151D] via-[#09151D]/30 to-transparent" />

                      {/* Crisp Architectural Corner Readout (Zero floating pill clutter) */}
                      <div className="absolute bottom-3 left-5 right-5 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[#C9A227] font-bold uppercase tracking-wider">
                          {indexLabel} · {service.category}
                        </span>
                        <span className="text-slate-200 font-semibold">
                          {service.voltageRange}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6 pb-3">
                    <h3 className="text-lg sm:text-xl font-bold font-display text-white group-hover/tilt:text-[#F5E6B3] transition-colors mb-2">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                      {service.shortDesc}
                    </p>
                    <div className="text-[11px] font-mono text-slate-400 pb-4 border-b border-slate-800/80">
                      <span className="text-slate-200 font-semibold">Normas:</span>{' '}
                      {service.standard}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-5 pt-2 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setActiveModalService(service)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer py-1.5"
                  >
                    <Info className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>Especificações Técnicas</span>
                  </button>

                  <button
                    onClick={() => onNavigateToQuote(service.title)}
                    className="btn-metallic-sheen inline-flex items-center gap-1.5 py-2 px-4 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-[#C9A227] to-[#DFBA48] hover:from-[#d9b33a] hover:to-[#eccb62] transition-colors cursor-pointer whitespace-nowrap"
                    title={`Solicitar orçamento para ${service.title}`}
                  >
                    <span>Orçar</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </TiltSpotlightCard>
            );
          })}
        </div>

        {/* Bottom Engineering Callout */}
        <div className="relative mt-14 p-6 sm:p-8 rounded-xl bg-[#09151D] border border-slate-800/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <ArchitecturalBrackets colorClass="border-[#C9A227]/45" sizeClass="w-3 h-3" />
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-[#0A3D4A] border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold font-display text-white">
                Precisa de uma solução customizada para sua planta?
              </h4>
              <p className="text-xs sm:text-sm text-slate-300">
                Realizamos visitas técnicas in loco e estudos de viabilidade preliminares com engenheiro responsável.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToQuote()}
            className="btn-metallic-sheen w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-xs font-bold uppercase tracking-[0.1em] text-slate-950 bg-gradient-to-r from-[#C9A227] to-[#DFBA48] hover:from-[#d9b33a] hover:to-[#eccb62] transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>Falar com Engenheiro</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <ServiceDetailModal
        service={activeModalService}
        onClose={() => setActiveModalService(null)}
        onRequestQuote={(serviceTitle) => onNavigateToQuote(serviceTitle)}
      />
    </section>
  );
};
