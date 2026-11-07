import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Zap, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';
import { COMPANY_METRICS } from '../data/companyData';
import { soundFx } from '../utils/soundEffects';
import { GridBeams, Magnetic, SpotlightCard } from './ui/ModernEffects';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
  isDark?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, isDark = false }) => {
  return (
    <section
      id="inicio"
      className="relative min-h-[92vh] flex flex-col justify-between pt-28 pb-12 overflow-hidden bg-slate-50 dark:bg-slate-950"
    >
      {/* Background Photography with Sophisticated Cinematic Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_substation_high_voltage_1794005102004.jpg"
          alt="Subestação de energia elétrica de alta tensão 500 kV ao amanhecer - Omega Engenharia"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Multilayered Industrial Scrim: Daylight White in Light Theme / Obsidian Deep Teal in Dark Theme */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F8FAFC] via-[#F8FAFC]/95 to-[#F8FAFC]/78 dark:from-slate-950 dark:via-slate-950/90 dark:to-slate-950/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-transparent to-[#F8FAFC]/40 dark:from-slate-950 dark:via-transparent dark:to-slate-950/40" />
        <GridBeams isDark={isDark} />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left 8 Cols: Editorial Engineering Typography & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8"
          >
            {/* Engineering Editorial Kicker */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#996515] dark:text-[#C9A227] mb-4">
              <span className="flex items-center gap-1.5 font-bold">
                <Zap className="w-3.5 h-3.5 text-[#996515] dark:text-[#C9A227]" />
                Omega Engenharia
              </span>
              <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">
                ·
              </span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold">
                Geração, Transmissão & Distribuição
              </span>
              <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">
                ·
              </span>
              <span className="rounded bg-[#0A3D4A]/10 dark:bg-[#0A3D4A]/50 px-2 py-0.5 text-[#0A3D4A] dark:text-cyan-300 font-bold">
                15 kV a 500 kV
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[3.65rem] font-extrabold font-display tracking-tight text-slate-950 dark:text-white leading-[1.09] mb-6">
              Engenharia de alta tensão e precisão para a{' '}
              <span className="text-[#0A3D4A] dark:text-[#C9A227] underline decoration-[#C9A227]/70 decoration-2 underline-offset-8">
                continuidade energética
              </span>{' '}
              da sua indústria.
            </h1>

            {/* Value Proposition */}
            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl mb-8 font-medium">
              Especialistas em Subestações até 500 kV, Cabines Primárias (15 a 34,5 kV),
              Barramentos Blindados (Bus Way) e montagens industriais pesadas. Mais de{' '}
              <strong className="text-slate-950 dark:text-white font-bold">
                200.000 kVA instalados
              </strong>{' '}
              desde a concepção do projeto e aprovação na concessionária até a ligação final.
            </p>

            {/* Action CTAs with Magnetic Micro-interactions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10">
              <Magnetic strength={0.18}>
                <button
                  onClick={() => {
                    soundFx.playSwitchClick();
                    onNavigate('orcamento');
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold tracking-wider uppercase text-white bg-[#996515] hover:bg-[#855712] shadow-xl shadow-[#996515]/25 dark:bg-gradient-to-r dark:from-[#C9A227] dark:to-[#deb338] dark:text-slate-950 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
                >
                  <span>Solicitar Orçamento Técnico</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Magnetic>

              <Magnetic strength={0.15}>
                <button
                  onClick={() => {
                    soundFx.playSwitchClick();
                    onNavigate('maqueta3d');
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold tracking-wide text-[#0A3D4A] hover:text-[#041d24] bg-teal-50/95 hover:bg-teal-100 border border-teal-300 shadow-sm dark:text-cyan-300 dark:bg-cyan-950/60 dark:hover:bg-cyan-900/60 dark:border-cyan-500/40 transition-all duration-200 cursor-pointer whitespace-nowrap"
                >
                  <Zap className="w-4 h-4 text-[#0A3D4A] dark:text-cyan-400 animate-pulse" />
                  <span>Explorar Subestação 3D</span>
                </button>
              </Magnetic>

              <button
                onClick={() => {
                  soundFx.playSwitchClick();
                  onNavigate('clientes');
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold tracking-wide text-slate-800 hover:text-black bg-white/95 hover:bg-slate-100 border border-slate-300 shadow-sm dark:text-slate-200 dark:hover:text-white dark:bg-slate-900/80 dark:hover:bg-slate-800 dark:border-slate-700/80 transition-all duration-200 cursor-pointer whitespace-nowrap"
              >
                <span>Ver 16 Grandes Cases</span>
              </button>
            </div>

            {/* Trust Certifications Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-2 gap-x-4 pt-4 border-t border-slate-200/90 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300 font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#996515] dark:text-[#C9A227] shrink-0" />
                <span>Conformidade NBR 14039 & NR-10</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#996515] dark:text-[#C9A227] shrink-0" />
                <span>Homologação Concessionárias</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#996515] dark:text-[#C9A227] shrink-0" />
                <span>Equipe Própria com ART e CREA</span>
              </div>
            </div>
          </motion.div>

          {/* Right 4 Cols: Interactive High-Voltage Engineering Spec Card (Spotlight Card) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 hidden lg:block"
          >
            <SpotlightCard
              spotlightColor="rgba(201, 162, 39, 0.22)"
              className="rounded-2xl bg-[#071E26] border border-[#195363] p-6 text-white shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#C9A227]" />
                    <span className="text-xs font-mono uppercase tracking-widest text-[#E2F1F5] font-bold">
                      Capacidade Operacional
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-0.5 text-[10px] font-mono text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    ENGENHARIA ATIVA
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3.5">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">
                      Subestações de Potência
                    </div>
                    <div className="text-lg font-bold font-mono text-[#C9A227] mt-0.5">
                      Até 500 kV (AT / EAT)
                    </div>
                    <div className="text-xs text-slate-300 mt-1">
                      Montagem eletromecânica, barramento, proteção e comissionamento.
                    </div>
                  </div>

                  <div className="rounded-xl bg-white/5 border border-white/10 p-3.5">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">
                      Cabines Primárias & Média Tensão
                    </div>
                    <div className="text-lg font-bold font-mono text-white mt-0.5">
                      15 kV a 34,5 kV
                    </div>
                    <div className="text-xs text-slate-300 mt-1">
                      Aprovação em concessionárias (Enel, CPFL, EDP, Cemig, CTEEP).
                    </div>
                  </div>

                  <div className="rounded-xl bg-white/5 border border-white/10 p-3.5">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">
                      Potência Total Entregue
                    </div>
                    <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                      +200.000 kVA Instalados
                    </div>
                    <div className="text-xs text-slate-300 mt-1">
                      Mais de 25 anos atendendo indústrias de missão crítica no Brasil.
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('calculadora')}
                className="mt-5 w-full flex items-center justify-between rounded-xl bg-[#0D4F5F] hover:bg-[#136579] border border-[#C9A227]/40 px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider text-white transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#C9A227]" />
                  Simular Demanda kVA
                </span>
                <ArrowRight className="w-4 h-4 text-[#C9A227]" />
              </button>
            </SpotlightCard>
          </motion.div>
        </div>
      </div>

      {/* Full-width Metrics Strip */}
      <div className="relative z-10 w-full border-t border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800/70">
            {COMPANY_METRICS.map((metric, index) => (
              <div
                key={metric.label}
                className={`flex flex-col ${index > 0 ? 'sm:pl-6' : ''} ${
                  index > 1 ? 'pt-4 sm:pt-0' : ''
                }`}
              >
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-950 dark:text-white tracking-tight">
                    {metric.value}
                  </span>
                  {metric.unit && (
                    <span className="text-xs font-bold font-mono text-[#996515] dark:text-[#C9A227]">
                      {metric.unit}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {metric.label}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {metric.detail}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
