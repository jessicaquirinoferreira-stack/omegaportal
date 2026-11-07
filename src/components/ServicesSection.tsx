import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Zap, Info } from 'lucide-react';
import { SERVICES_DATA, ServiceDetail } from '../data/companyData';
import { ServiceDetailModal } from './ServiceDetailModal';
import { SpotlightCard, Magnetic } from './ui/ModernEffects';

interface ServicesSectionProps {
  onNavigateToQuote: (serviceTitle?: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onNavigateToQuote }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalService, setActiveModalService] = useState<ServiceDetail | null>(null);

  const categories = [
    { id: 'all', label: 'Todos os Serviços (12)' },
    { id: 'Alta Tensão', label: 'Alta Tensão (Subestações)' },
    { id: 'Média Tensão', label: 'Média Tensão (Cabines)' },
    { id: 'Infraestrutura Fabril', label: 'Instalações & Bus Way' },
    { id: 'Gestão de Ativos', label: 'Manutenção & Transformadores' },
    { id: 'Distribuição Urbana', label: 'Loteamentos & Redes' },
  ];

  const filteredServices =
    selectedCategory === 'all'
      ? SERVICES_DATA
      : SERVICES_DATA.filter(
          (s) => s.category.includes(selectedCategory) || s.category === selectedCategory
        );

  return (
    <section
      id="servicos"
      className="py-20 lg:py-28 bg-[#0A0F1A] text-white border-b border-slate-800/80 relative overflow-hidden"
    >
      {/* Subtle background tech grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#C9A227] font-bold mb-3">
              <span>02. Portfólio de Soluções</span>
              <span aria-hidden="true" className="text-slate-600">
                /
              </span>
              <span>Serviços Especializados</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight">
              Engenharia elétrica integral: da média à extra alta tensão.
            </h2>
          </div>

          <p className="text-sm text-slate-300 max-w-md font-medium leading-relaxed">
            Soluções completas com cumprimento irrestrito das normas ABNT NBR, homologação em
            concessionárias e execução orientada à máxima disponibilidade operacional.
          </p>
        </div>

        {/* Filter Bar */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar"
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
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#0A3D4A] text-white font-bold shadow-md shadow-[#0A3D4A]/40 border border-[#C9A227]/60'
                    : 'bg-[#0F172A] text-slate-300 hover:text-white hover:bg-[#1E293B] border border-slate-800 shadow-2xs'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Services Grid (All 12 services in responsive 3-column grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: Math.min(idx * 0.03, 0.25) }}
            >
              <SpotlightCard
                spotlightColor="rgba(201, 162, 39, 0.16)"
                className="group h-full rounded-2xl bg-[#0F172A] border border-slate-800/90 hover:border-[#C9A227]/70 transition-all duration-300 shadow-xl hover:shadow-[0_20px_45px_-15px_rgba(10,61,74,0.45)] hover:-translate-y-1 overflow-hidden flex flex-col justify-between"
              >
                {/* Top Energy Line on Hover */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#C9A227] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-20" />

                <div>
                  {/* Real Image Header with 16:10 aspect ratio and dark gradient overlay */}
                  {service.imageSrc && (
                    <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-2xl bg-slate-900 border-b border-slate-800/80">
                      <img
                        src={service.imageSrc}
                        alt={service.title}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (service.imageFallback && target.src !== service.imageFallback) {
                            target.src = service.imageFallback;
                          }
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        referrerPolicy="no-referrer"
                      />
                      {/* Dark gradient overlay on bottom of image for enhanced readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/30 to-transparent" />

                      {/* Category & Voltage tags over image */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono">
                        <span className="px-2.5 py-0.5 rounded-md bg-[#0A3D4A]/90 text-[#E2F1F5] font-bold border border-[#1E6A7D] backdrop-blur-md shadow-sm">
                          {service.category}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-black/75 text-slate-200 border border-white/15 font-semibold backdrop-blur-md">
                          {service.voltageRange}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Card Body */}
                  <div className="p-6 pb-2">
                    {!service.imageSrc && (
                      <div className="flex items-center justify-between text-xs font-mono text-[#C9A227] font-bold mb-3">
                        <span className="px-2.5 py-0.5 rounded-md bg-[#0A3D4A]/60 text-[#E2F1F5] border border-[#1E6A7D]">
                          {service.category}
                        </span>
                        <span className="text-slate-400">
                          {service.voltageRange}
                        </span>
                      </div>
                    )}

                    {/* Card Title in bold white */}
                    <h3 className="text-xl font-bold font-display text-white group-hover:text-[#F5E6B3] transition-colors mb-2.5">
                      {service.title}
                    </h3>

                    {/* Short description in light gray */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 font-normal">
                      {service.shortDesc}
                    </p>

                    <div className="text-[11px] font-mono text-slate-400 pb-4 border-b border-slate-800/80">
                      <span className="text-slate-200 font-bold">Normas:</span>{' '}
                      {service.standard}
                    </div>
                  </div>
                </div>

                {/* Card Actions in Footer */}
                <div className="px-6 pb-6 pt-3 flex items-center gap-2">
                  <button
                    onClick={() => setActiveModalService(service)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-slate-200 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700/80 transition-colors cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>Especificações</span>
                  </button>

                  <button
                    onClick={() => onNavigateToQuote(service.title)}
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-950 bg-[#C9A227] hover:bg-[#d8b132] transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                    title={`Solicitar orçamento para ${service.title}`}
                  >
                    <span>Orçar →</span>
                  </button>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0A3D4A] border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white">
                Precisa de uma solução customizada para a sua indústria?
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                Nossos engenheiros realizam visitas técnicas in loco e estudos de viabilidade
                preliminares.
              </p>
            </div>
          </div>

          <Magnetic strength={0.15}>
            <button
              onClick={() => onNavigateToQuote()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 bg-[#C9A227] hover:bg-[#d8b132] transition-colors cursor-pointer whitespace-nowrap shadow-md"
            >
              Falar com Engenheiro Responsável
            </button>
          </Magnetic>
        </div>
      </div>

      {/* Interactive Detail Modal */}
      <ServiceDetailModal
        service={activeModalService}
        onClose={() => setActiveModalService(null)}
        onRequestQuote={(serviceTitle) => onNavigateToQuote(serviceTitle)}
      />
    </section>
  );
};
