import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { COMPANY_TIMELINE } from '../data/companyData';
import { ArchitecturalBrackets, EditorialReveal, TiltSpotlightCard } from './ui/IndustrialEffects';

gsap.registerPlugin(ScrollTrigger);

interface CompanySectionProps {
  onNavigate: (sectionId: string) => void;
}

const CYCLE_STAGES = [
  {
    step: '01',
    title: 'Estudo de Viabilidade & Projeto Executivo',
    summary: 'Dimensionamento de demanda, estudos de curto-circuito e seletividade.',
    detail:
      'Levantamento completo das cargas da planta industrial, definição da topologia de média ou alta tensão, coordenação e seletividade de relés digitais e elaboração dos diagramas unifilares e trifilares executivos.',
  },
  {
    step: '02',
    title: 'Aprovação nas Concessionárias',
    summary: 'Tramitação técnica junto à Enel, CPFL, CTEEP, EDP, Cemig com ART.',
    detail:
      'Protocolo e acompanhamento integral de acesso e aprovação de projetos junto às distribuidoras e transmissoras, garantindo conformidade com as normas regionais e prazos de energização.',
  },
  {
    step: '03',
    title: 'Montagem Eletromecânica & Civil',
    summary: 'Execução de bases, cubículos, barramentos de cobre e cabeamento.',
    detail:
      'Obra civil especializada (bases de transformadores, bacias de contenção, canaletas, malha de aterramento profunda) e montagem eletromecânica de pórticos, chaves seccionadoras, cubículos blindados e linhas Bus Way.',
  },
  {
    step: '04',
    title: 'Comissionamento & Energização Final',
    summary: 'Testes de relés, ensaios dielétricos e ligação oficial em carga.',
    detail:
      'Ensaios de relação de transformação (TTR), resistência de isolamento (Megger), injeção de corrente primária e secundária, termografia inicial e acompanhamento presencial da ligação definitiva.',
  },
];

const MANIFESTO_PILLARS = [
  {
    index: '01',
    title: 'Nossa Missão',
    text: 'Fornecer engenharia elétrica e infraestrutura de alta potência que garanta máxima continuidade operacional e segurança patrimonial aos nossos clientes, por meio de soluções eletromecânicas precisas.',
  },
  {
    index: '02',
    title: 'Nossa Visão',
    text: 'Consolidar-se como referência independente do setor elétrico nacional em montagens de subestações até 500 kV e cabines primárias, reconhecida pela agilidade de homologação e rigor executivo.',
  },
  {
    index: '03',
    title: 'Nossos Valores',
    text: 'Conformidade normativa absoluta (ABNT e NRs), preservação inegociável da integridade física das equipes e parceiros, transparência técnica e pontualidade na energização das plantas.',
  },
];

export const CompanySection: React.FC<CompanySectionProps> = ({ onNavigate }) => {
  const [activeStage, setActiveStage] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const timelineLineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      if (timelineLineRef.current) {
        gsap.fromTo(
          timelineLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-timeline-track]',
              start: 'top 75%',
              end: 'bottom 65%',
              scrub: 0.5,
            },
          }
        );
      }

      gsap.from('[data-timeline-item]', {
        y: 22,
        opacity: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '[data-timeline-track]',
          start: 'top 80%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const currentStage = CYCLE_STAGES[activeStage];

  return (
    <section
      ref={sectionRef}
      id="empresa"
      className="py-20 lg:py-28 bg-white dark:bg-[#060E14] border-b border-slate-200 dark:border-slate-800/90 relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-35 dark:opacity-25" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 pb-12 border-b border-slate-200 dark:border-slate-800/90">
          <EditorialReveal className="lg:col-span-7">
            <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.14em] uppercase text-[#996515] dark:text-[#C9A227] font-bold mb-3">
              <span>01 · Institucional</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">/</span>
              <span>A Empresa</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-slate-950 dark:text-white tracking-tight leading-[1.08]">
              Mais de duas décadas construindo a infraestrutura elétrica de grandes indústrias.
            </h2>
          </EditorialReveal>

          <div className="lg:col-span-5 flex items-end">
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              A <strong className="text-slate-950 dark:text-white font-semibold">Omega Engenharia</strong> é uma empresa 100% nacional formada por engenheiros e técnicos com mais de 25 anos no setor elétrico (GTD). Com aproximadamente{' '}
              <strong className="text-slate-950 dark:text-white font-semibold">200.000 kVA instalados</strong>, assumimos o ciclo integral desde o projeto e aprovação na concessionária até a ligação final.
            </p>
          </div>
        </div>

        {/* Editorial 3-Column Manifesto with Pointer Spotlight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pb-16 mb-16 border-b border-slate-200 dark:border-slate-800/90">
          {MANIFESTO_PILLARS.map((pillar) => (
            <TiltSpotlightCard
              key={pillar.index}
              enableTilt={false}
              spotlightColor="rgba(201, 162, 39, 0.09)"
              className="rounded-xl bg-[#F8FAFC] dark:bg-[#09161E] border border-slate-200/90 dark:border-slate-800/90 p-6 flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-bold font-display text-slate-950 dark:text-white">
                  {pillar.title}
                </h3>
                <span className="text-xs font-mono font-bold text-[#996515] dark:text-[#C9A227]">
                  {pillar.index}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {pillar.text}
              </p>
            </TiltSpotlightCard>
          ))}
        </div>

        {/* Interactive End-to-End Methodology + Scroll-Driven Trajectory */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start mb-16">
          {/* Left 5 Cols: Interactive Engineering Cycle Selector */}
          <div className="lg:col-span-5 relative rounded-xl bg-[#F8FAFC] dark:bg-[#08131A] border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
            <ArchitecturalBrackets sizeClass="w-3 h-3" />
            <span className="text-[11px] font-mono uppercase text-[#996515] dark:text-[#C9A227] tracking-[0.14em] font-bold">
              Ciclo Completo de Atuação
            </span>
            <h3 className="text-2xl font-bold font-display text-slate-950 dark:text-white mt-2 mb-6">
              Da concepção à energização definitiva
            </h3>

            {/* Interactive Stage Selector Tabs */}
            <div className="space-y-2 mb-6" role="tablist" aria-label="Etapas de atuação da Omega Engenharia">
              {CYCLE_STAGES.map((stage, idx) => {
                const isSelected = activeStage === idx;
                return (
                  <button
                    key={stage.step}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveStage(idx)}
                    className={`w-full text-left p-3.5 rounded-lg border transition-colors cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-white dark:bg-[#0D1E28] border-[#0A3D4A] dark:border-[#C9A227] shadow-2xs'
                        : 'bg-transparent border-slate-200/80 dark:border-slate-800/80 hover:bg-white/70 dark:hover:bg-[#0B1922]'
                    }`}
                  >
                    <span
                      className={`text-xs font-mono font-bold mt-0.5 tabular-nums ${
                        isSelected
                          ? 'text-[#0A3D4A] dark:text-[#C9A227]'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {stage.step}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-950 dark:text-white leading-snug">
                        {stage.title}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        {stage.summary}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Stage Expanded Technical Note */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStage.step}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="p-4 rounded-lg bg-white dark:bg-[#04090D] border border-slate-200 dark:border-slate-800 mb-6"
              >
                <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#996515] dark:text-[#C9A227] font-bold mb-1.5">
                  Escopo da Etapa {currentStage.step}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentStage.detail}
                </p>
              </motion.div>
            </AnimatePresence>

            <button
              onClick={() => onNavigate('orcamento')}
              className="btn-metallic-sheen w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg text-xs font-bold uppercase tracking-[0.1em] text-white bg-[#0A3D4A] hover:bg-[#0d4d5e] dark:bg-gradient-to-r dark:from-[#C9A227] dark:to-[#DFBA48] dark:hover:from-[#d9b33a] dark:hover:to-[#eccb62] dark:text-slate-950 transition-colors cursor-pointer"
            >
              <span>Consulte Nossa Equipe de Engenharia</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right 7 Cols: GSAP Scroll-Driven Trajectory Timeline */}
          <div className="lg:col-span-7 pt-2">
            <span className="text-[11px] font-mono uppercase text-[#996515] dark:text-[#C9A227] tracking-[0.14em] font-bold">
              Marcos & Trajetória
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-slate-950 dark:text-white mt-2 mb-8">
              Construção de um legado técnico no setor elétrico
            </h3>

            <div data-timeline-track className="relative pl-7 space-y-8">
              {/* Static Background Rail */}
              <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-slate-200 dark:bg-slate-800" />
              {/* GSAP Scroll-Scrubbed Active Rail */}
              <div
                ref={timelineLineRef}
                className="absolute left-[7px] top-2 bottom-2 w-[2px] origin-top bg-gradient-to-b from-[#0A3D4A] via-[#996515] to-[#C9A227]"
                style={{ transform: 'scaleY(0)' }}
              />

              {COMPANY_TIMELINE.map((item) => (
                <div key={item.title} data-timeline-item className="relative">
                  <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-white dark:bg-slate-900 border-2 border-[#0A3D4A] dark:border-[#C9A227]" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#996515] dark:text-[#C9A227]">
                    {item.year}
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white mt-0.5">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Clean 4-Column Hairline Certification Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div>
            <span className="block text-base sm:text-lg font-extrabold font-mono text-slate-950 dark:text-white">
              NR-10 & SEP
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              100% Equipe Certificada
            </span>
          </div>
          <div>
            <span className="block text-base sm:text-lg font-extrabold font-mono text-slate-950 dark:text-white">
              CREA / SP
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Registro Ativo & ART
            </span>
          </div>
          <div>
            <span className="block text-base sm:text-lg font-extrabold font-mono text-slate-950 dark:text-white tabular-nums">
              200.000 kVA
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Potência Total Instalada
            </span>
          </div>
          <div>
            <span className="block text-base sm:text-lg font-extrabold font-mono text-[#0A3D4A] dark:text-[#C9A227] tabular-nums">
              500 kV
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Classe Máxima de Tensão
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
