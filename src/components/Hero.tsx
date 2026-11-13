import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowUpRight, CheckCircle2, Activity, Box } from 'lucide-react';
import { COMPANY_METRICS } from '../data/companyData';
import { soundFx } from '../utils/soundEffects';
import { Magnetic } from './ui/ModernEffects';
import { ArchitecturalBrackets, CircuitFlowBackdrop } from './ui/IndustrialEffects';
import heroSubstationImg from '../assets/images/hero_substation_high_voltage.webp';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onNavigate: (sectionId: string) => void;
  isDark?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const heroRef = useRef<HTMLElement | null>(null);
  const photoParallaxRef = useRef<HTMLImageElement | null>(null);
  const circuitLayerRef = useRef<HTMLDivElement | null>(null);
  const frameParallaxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !heroRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // Staggered kinetic entrance on mount
      gsap.from('[data-hero-reveal]', {
        y: 26,
        opacity: 0,
        duration: 0.78,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });

      // Layer 1 (Background Circuit Grid): gentle depth drift
      if (circuitLayerRef.current) {
        gsap.to(circuitLayerRef.current, {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.7,
          },
        });
      }

      // Layer 2 (Frame Outer Bezel): slight counter-parallax float
      if (frameParallaxRef.current) {
        gsap.to(frameParallaxRef.current, {
          y: -18,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.55,
          },
        });
      }

      // Layer 3 (Substation Photo Plate): deeper optical zoom + vertical parallax
      if (photoParallaxRef.current) {
        gsap.to(photoParallaxRef.current, {
          yPercent: 16,
          scale: 1.11,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
          },
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="inicio"
      className="relative flex flex-col justify-between pt-[72px] sm:pt-22 pb-0 overflow-hidden bg-[#F6F8FA] dark:bg-[#04090D]"
    >
      {/* Layer 0 & 1: Dual-scale Architectural Blueprint Grid + Animated Three-Phase Circuit Flow */}
      <div className="pointer-events-none absolute inset-0 bg-blueprint-mesh opacity-60 dark:opacity-55" />
      <div ref={circuitLayerRef} className="pointer-events-none absolute inset-0 will-change-transform">
        <CircuitFlowBackdrop variant="hero" />
      </div>
      {/* Subtle Ambient Industrial Depth Gradient (no neon) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 right-0 w-[620px] h-[520px] rounded-full bg-[radial-gradient(circle,rgba(10,61,74,0.08)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(201,162,39,0.08)_0%,rgba(10,61,74,0.12)_42%,transparent_72%)]"
      />

      {/* Main Split Editorial Composition */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-2.5 sm:py-4 lg:py-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
          {/* Left 7 Cols: Editorial Engineering Typography */}
          <div className="lg:col-span-7">
            <div
              data-hero-reveal
              className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] font-mono tracking-[0.14em] uppercase text-[#996515] dark:text-[#C9A227] mb-2.5 sm:mb-3.5 font-semibold"
            >
              <span>Omega Engenharia</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">/</span>
              <span className="text-slate-600 dark:text-slate-300">
                Geração, Transmissão & Distribuição
              </span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">/</span>
              <span className="text-[#0A3D4A] dark:text-cyan-300 font-bold">15 a 500 kV</span>
            </div>

            <h1
              data-hero-reveal
              className="text-[1.68rem] sm:text-5xl lg:text-[2.95rem] font-extrabold font-display tracking-[-0.025em] text-slate-950 dark:text-white leading-[1.06] mb-2.5 sm:mb-3.5"
            >
              Engenharia de alta tensão e precisão para a{' '}
              <span className="text-[#0A3D4A] dark:text-[#C9A227]">
                continuidade energética
              </span>{' '}
              da sua indústria.
            </h1>

            <p
              data-hero-reveal
              className="text-[14.5px] sm:text-[1.03rem] text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-4 sm:mb-5 font-normal"
            >
              Especialistas em Subestações até 500 kV, Cabines Primárias (15 a 34,5 kV),
              Barramentos Blindados (Bus Way) e montagens eletromecânicas pesadas. Mais de{' '}
              <strong className="text-slate-950 dark:text-white font-semibold">
                200.000 kVA instalados
              </strong>{' '}
              desde o projeto e aprovação na concessionária até a energização final.
            </p>

            {/* Primary & Secondary CTAs (clean hierarchy, single row on desktop) */}
            <div
              data-hero-reveal
              className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-4 sm:mb-5"
            >
              <Magnetic>
                <button
                  onClick={() => {
                    soundFx.playSwitchClick();
                    onNavigate('orcamento');
                  }}
                  className="btn-metallic-sheen w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg text-[11px] sm:text-xs font-bold tracking-[0.08em] uppercase text-white bg-[#0A3D4A] hover:bg-[#0d4d5e] dark:bg-gradient-to-r dark:from-[#C9A227] dark:to-[#DFBA48] dark:hover:from-[#d9b33a] dark:hover:to-[#eccb62] dark:text-slate-950 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
                >
                  <span>Solicitar Orçamento Técnico</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Magnetic>

              <button
                onClick={() => {
                  soundFx.playSwitchClick();
                  onNavigate('maqueta3d');
                }}
                className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-lg text-[11px] sm:text-xs font-bold tracking-[0.06em] uppercase text-slate-800 hover:text-[#0A3D4A] bg-white hover:bg-slate-50 border border-slate-300 dark:text-slate-200 dark:hover:text-[#C9A227] dark:bg-[#08131A] dark:hover:bg-[#0D1E28] dark:border-slate-700/90 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Box className="w-3.5 h-3.5 text-[#996515] dark:text-[#C9A227]" />
                <span>Explorar Subestação 3D</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playSwitchClick();
                  onNavigate('obras');
                }}
                className="inline-flex items-center justify-center gap-1 px-2 py-2 text-xs font-semibold text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Acervo de 14 Obras</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Technical Credentials Hairline Row */}
            <div
              data-hero-reveal
              className="grid grid-cols-1 sm:grid-cols-3 gap-y-1.5 sm:gap-y-2 gap-x-4 pt-3 sm:pt-4 border-t border-slate-200 dark:border-slate-800/90 text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 font-medium"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0A3D4A] dark:text-[#C9A227] shrink-0" />
                <span>Conformidade NBR 14039 & NR-10</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0A3D4A] dark:text-[#C9A227] shrink-0" />
                <span>Homologação em Concessionárias</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0A3D4A] dark:text-[#C9A227] shrink-0" />
                <span>Equipe Própria com ART / CREA</span>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Parallax Architectural Substation Viewport */}
          <div data-hero-reveal ref={frameParallaxRef} className="lg:col-span-5 will-change-transform">
            <div className="relative rounded-xl overflow-hidden border border-slate-300/90 dark:border-[#C9A227]/35 bg-slate-950 shadow-[0_24px_60px_-18px_rgba(4,9,13,0.45)]">
              <ArchitecturalBrackets colorClass="border-[#C9A227]/75" sizeClass="w-3.5 h-3.5" />
              <div className="relative aspect-[4/3] lg:aspect-[4/3.45] overflow-hidden">
                <img
                  ref={photoParallaxRef}
                  src={heroSubstationImg}
                  alt="Subestação de energia elétrica de alta tensão 500 kV executada com precisão técnica - Omega Engenharia"
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                  width={1200}
                  height={670}
                  className="w-full h-full object-cover object-center will-change-transform scale-[1.03]"
                  referrerPolicy="no-referrer"
                />
                {/* Scrim calibrated for crisp contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#04090D]/95 via-[#04090D]/32 to-[#04090D]/20" />

                {/* Top Architectural Coordinate Tag */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.14em] text-slate-200">
                  <span className="bg-[#04090D]/80 px-2.5 py-1 rounded border border-white/15">
                    AT / EAT · 500 KV
                  </span>
                  <span className="bg-[#04090D]/80 px-2.5 py-1 rounded border border-[#C9A227]/40 text-[#C9A227]">
                    NBR 5356 · ABNT
                  </span>
                </div>

                {/* Bottom Architectural Spec Readout & Calculator Trigger */}
                <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6">
                  <div className="grid grid-cols-3 gap-3 pb-4 mb-4 border-b border-white/15 text-white">
                    <div>
                      <span className="block text-[10px] font-mono uppercase text-slate-400">
                        Subestações
                      </span>
                      <span className="text-sm sm:text-base font-mono font-bold text-[#C9A227] tabular-nums">
                        Até 500 kV
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono uppercase text-slate-400">
                        Cabines
                      </span>
                      <span className="text-sm sm:text-base font-mono font-bold tabular-nums">
                        15–34,5 kV
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono uppercase text-slate-400">
                        Instalado
                      </span>
                      <span className="text-sm sm:text-base font-mono font-bold text-emerald-400 tabular-nums">
                        +200 MVA
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playSwitchClick();
                      onNavigate('calculadora');
                    }}
                    className="btn-metallic-sheen w-full flex items-center justify-between rounded-lg bg-white/10 hover:bg-[#C9A227] text-white hover:text-slate-950 border border-white/20 hover:border-[#C9A227] px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5" />
                      Simular Demanda kVA
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Hairline Engineering Metrics Strip */}
      <div className="relative z-10 w-full border-t border-slate-200 dark:border-slate-800/90 bg-white dark:bg-[#050C11] pb-6 sm:pb-10 lg:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5 sm:gap-4 md:divide-x divide-slate-200 dark:divide-slate-800">
            {COMPANY_METRICS.map((metric, index) => (
              <div
                key={metric.label}
                className={`flex flex-col ${index > 0 ? 'md:pl-6' : ''} ${
                  index === COMPANY_METRICS.length - 1 ? 'col-span-2 md:col-span-1 border-t border-slate-100 dark:border-slate-800/70 pt-3 md:border-t-0 md:pt-0' : ''
                }`}
              >
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-[1.75rem] font-extrabold font-mono text-slate-950 dark:text-white tracking-tight tabular-nums">
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
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
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
