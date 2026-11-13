import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FastForward } from 'lucide-react';
import introSubstationCinemaImg from '../assets/images/intro_substation_cinema.webp';
import heroSubstationImg from '../assets/images/hero_substation_high_voltage.webp';
import {
  INTRO_TOTAL_MS,
  INTRO_EXIT_MS,
  IntroAct,
  getIntroPhaseAtTime,
  shouldShowIntroOnBoot,
} from '../utils/introSequence';

interface CinematicIntroProps {
  onComplete?: () => void;
  forcePlay?: boolean;
}

interface DustMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  tone: 0 | 1 | 2;
  phaseOffset: number;
}

// Module-level pre-decode so the dusk 500 kV substation still is GPU-ready instantaneously
let preloadedBackdropPromise: Promise<void> | null = null;
let isBackdropDecodedSync = false;

function ensureBackdropDecoded(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (!preloadedBackdropPromise) {
    preloadedBackdropPromise = new Promise<void>((resolve) => {
      const img = new Image();
      img.src = introSubstationCinemaImg;
      const done = () => {
        isBackdropDecodedSync = true;
        resolve();
      };
      if (img.complete && img.naturalWidth > 0) {
        isBackdropDecodedSync = true;
        if (typeof img.decode === 'function') {
          img.decode().then(done).catch(done);
        } else {
          done();
        }
      } else {
        img.onload = () => {
          isBackdropDecodedSync = true;
          if (typeof img.decode === 'function') {
            img.decode().then(done).catch(done);
          } else {
            done();
          }
        };
        img.onerror = done;
      }
      const heroPreload = new Image();
      heroPreload.src = heroSubstationImg;
    });
  }
  return preloadedBackdropPromise;
}

if (typeof window !== 'undefined') {
  ensureBackdropDecoded();
}

/**
 * Pre-renders lightweight soft bokeh sprites on tiny 32x32 offscreen canvases
 * to achieve photorealistic atmospheric depth at 60fps without expensive CPU shadowBlur calls.
 */
function createBokehSprite(rgb: string): HTMLCanvasElement | null {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = 32;
  c.height = 32;
  const cctx = c.getContext('2d');
  if (!cctx) return null;
  const grad = cctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, `rgba(${rgb}, 0.95)`);
  grad.addColorStop(0.35, `rgba(${rgb}, 0.42)`);
  grad.addColorStop(1, `rgba(${rgb}, 0)`);
  cctx.fillStyle = grad;
  cctx.fillRect(0, 0, 32, 32);
  return c;
}

export default function CinematicIntro({ onComplete, forcePlay = false }: CinematicIntroProps) {
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return shouldShowIntroOnBoot({
      forcePlay,
      search: window.location.search,
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    });
  });

  const [act, setAct] = useState<IntroAct>(1);
  const [isBackdropReady, setIsBackdropReady] = useState<boolean>(() => isBackdropDecodedSync);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [progressPct, setProgressPct] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const completedRef = useRef<boolean>(false);
  const actRef = useRef<IntroAct>(1);
  const onCompleteRef = useRef<(() => void) | undefined>(onComplete);
  onCompleteRef.current = onComplete;

  const finishIntro = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setProgressPct(100);
    setIsExiting(true);
    window.setTimeout(() => {
      setShowIntro(false);
      onCompleteRef.current?.();
    }, INTRO_EXIT_MS);
  }, []);

  // Ensure backdrop image is decoded immediately on mount
  useEffect(() => {
    if (!showIntro) {
      onCompleteRef.current?.();
      return;
    }
    let active = true;
    ensureBackdropDecoded().then(() => {
      if (active) setIsBackdropReady(true);
    });
    return () => {
      active = false;
    };
  }, [showIntro]);

  // Allow Escape key to skip intro immediately
  useEffect(() => {
    if (!showIntro) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        finishIntro();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showIntro, finishIntro]);

  // Master precision wall-clock timeline (works accurately even across throttled tabs)
  useEffect(() => {
    if (!showIntro) return;

    const startTime = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = Math.max(0, now - startTime);
      const nextAct = getIntroPhaseAtTime(elapsed);

      if (nextAct !== actRef.current) {
        actRef.current = nextAct;
        setAct(nextAct);
      }

      const pct = Math.min(100, (elapsed / INTRO_TOTAL_MS) * 100);
      setProgressPct(pct);

      if (elapsed >= INTRO_TOTAL_MS - INTRO_EXIT_MS && !completedRef.current) {
        finishIntro();
        return;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    const failsafe = window.setTimeout(() => {
      finishIntro();
    }, INTRO_TOTAL_MS + 350);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(failsafe);
    };
  }, [showIntro, finishIntro]);

  // Ultra-lightweight 60fps atmospheric dust & optical corona flare renderer (sprite-blitted, zero shadowBlur)
  useEffect(() => {
    if (!showIntro) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const spriteGold = createBokehSprite('232, 186, 78');
    const spriteAmber = createBokehSprite('212, 175, 55');
    const spriteIce = createBokehSprite('210, 236, 252');
    const sprites = [spriteGold, spriteAmber, spriteIce];

    let width = 0;
    let height = 0;
    const updateSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    const moteCount = width < 640 ? 22 : 36;
    const motes: DustMote[] = Array.from({ length: moteCount }, (_, idx) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.35) * 0.35,
      vy: -0.15 - Math.random() * 0.35,
      size: 6 + (idx % 4) * 4.5,
      alpha: 0.16 + Math.random() * 0.38,
      tone: (idx % 3) as 0 | 1 | 2,
      phaseOffset: Math.random() * Math.PI * 2,
    }));

    let rafId = 0;
    const start = performance.now();

    const draw = (now: number) => {
      const t = (now - start) * 0.001;
      ctx.clearRect(0, 0, width, height);

      // Soft atmospheric bokeh dust drifting upward like heated air over energized busbars
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        m.x += m.vx + Math.sin(t * 0.8 + m.phaseOffset) * 0.12;
        m.y += m.vy;

        if (m.y < -24) {
          m.y = height + 24;
          m.x = Math.random() * width;
        }
        if (m.x < -24) m.x = width + 24;
        if (m.x > width + 24) m.x = -24;

        const sprite = sprites[m.tone];
        if (!sprite) continue;

        const pulse = 0.7 + 0.3 * Math.sin(t * 1.9 + m.phaseOffset);
        const boost = actRef.current === 2 ? 1.25 : actRef.current >= 3 ? 0.85 : 0.65;
        ctx.globalAlpha = Math.min(0.65, m.alpha * pulse * boost);
        ctx.drawImage(sprite, m.x - m.size / 2, m.y - m.size / 2, m.size, m.size);
      }

      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateSize);
    };
  }, [showIntro]);

  if (!showIntro) return null;

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Abertura institucional Omega Engenharia"
          data-testid="cinematic-intro"
          data-act={act}
          data-backdrop-ready={isBackdropReady ? 'true' : 'false'}
          className="fixed inset-0 z-[9999] h-screen w-screen overflow-hidden bg-[#04070B] text-white flex items-center justify-center select-none"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.035,
            transition: { duration: INTRO_EXIT_MS / 1000, ease: [0.22, 1, 0.36, 1] },
          }}
        >
          {/* Layer 0: Architectural Studio Vignette & Fine Grid */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(ellipse 75% 65% at 50% 48%, rgba(16, 46, 62, 0.28) 0%, rgba(4, 7, 11, 0.96) 72%, #030508 100%)',
            }}
          />

          {/* Layer 1: Pre-decoded Real 500 kV Dusk Substation Plate (Slow Anamorphic Dolly) */}
          <motion.div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            initial={{ opacity: isBackdropReady ? 0.34 : 0.22, scale: 1.09 }}
            animate={{
              opacity: act === 1 ? 0.38 : act === 2 ? 0.68 : 0.42,
              scale: act >= 2 ? 1.01 : 1.07,
            }}
            transition={{
              opacity: { duration: 1.05, ease: 'easeOut' },
              scale: { duration: 6.8, ease: [0.16, 1, 0.3, 1] },
            }}
          >
            <img
              src={introSubstationCinemaImg}
              alt="Subestação elétrica de alta tensão 500 kV ao entardecer"
              fetchPriority="high"
              loading="eager"
              decoding="sync"
              referrerPolicy="no-referrer"
              onLoad={() => {
                isBackdropDecodedSync = true;
                setIsBackdropReady(true);
              }}
              className="h-full w-full object-cover object-center contrast-[1.08] brightness-[0.9] saturate-[0.94]"
            />
            {/* Calibrated Anamorphic Contrast Scrim + Center Readability Spotlight */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#04070B] via-[#04070B]/42 to-[#04070B]/84" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#04070B]/82 via-transparent to-[#04070B]/82" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 56% 48% at 50% 50%, rgba(4, 7, 11, 0.68) 0%, transparent 100%)',
              }}
            />
          </motion.div>

          {/* Subtle Cinema Letterbox Framing (2.39:1 Anamorphic Aspect Bars on Desktop) */}
          <div className="pointer-events-none fixed inset-x-0 top-0 h-8 sm:h-11 bg-[#030508]/95 z-20 border-b border-white/[0.04]" />
          <div className="pointer-events-none fixed inset-x-0 bottom-0 h-10 sm:h-12 bg-[#030508]/95 z-20 border-t border-white/[0.04]" />

          {/* Layer 2: Lightweight Sprite-Blitted Atmospheric Dust & Optical Warmth */}
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 h-full w-full z-10"
          />

          {/* Layer 3: Act 1–2 Precision Three-Phase 500 kV Busbar Synchronization */}
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden">
            {/* Three Physical Phase Filaments (L1 / L2 / L3 - 0° / 120° / 240°) */}
            {[
              { id: 'L1', offsetY: -64, delay: 0.08, color: 'rgba(212,175,55,0.65)' },
              { id: 'L2', offsetY: 0, delay: 0.35, color: 'rgba(255,248,230,0.75)' },
              { id: 'L3', offsetY: 64, delay: 0.62, color: 'rgba(56,189,248,0.5)' },
            ].map((bus) => (
              <motion.div
                key={bus.id}
                className="absolute left-0 right-0 h-px"
                style={{
                  top: `calc(50% + ${bus.offsetY}px)`,
                  background: `linear-gradient(90deg, transparent 0%, ${bus.color} 28%, rgba(255,255,255,0.95) 50%, ${bus.color} 72%, transparent 100%)`,
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{
                  scaleX: act >= 2 ? 1 : act === 1 && bus.id === 'L2' ? 0.55 : 0,
                  opacity: act === 1 ? (bus.id === 'L2' ? 0.45 : 0) : act === 2 ? 0.85 : 0.14,
                }}
                transition={{
                  duration: act === 2 ? 0.85 : 0.9,
                  delay: act === 2 ? bus.delay : 0,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            ))}

            {/* Warm Specular Anamorphic Horizon Flare on Breaker Closure (Act 2) */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[2px] w-[78vw] max-w-4xl"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(255,242,204,0.92) 0%, rgba(212,175,55,0.45) 35%, transparent 72%)',
              }}
              initial={{ scaleX: 0.1, opacity: 0 }}
              animate={{
                scaleX: act === 2 ? [0.15, 1.15, 0.9] : act >= 3 ? 0.7 : 0.25,
                opacity: act === 1 ? 0.35 : act === 2 ? [0.4, 0.95, 0.55] : 0.12,
              }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Architectural Phase-Angle Synchronization Ring (Act 1 -> Act 3) */}
            <motion.svg
              viewBox="0 0 360 360"
              className="w-[260px] h-[260px] sm:w-[340px] sm:h-[340px]"
              initial={{ opacity: 0, scale: 0.86, rotate: -30 }}
              animate={{
                opacity: act === 1 ? 0.55 : act === 2 ? 0.45 : 0.16,
                scale: act >= 3 ? 1.18 : 1,
                rotate: act === 1 ? 0 : act === 2 ? 40 : 60,
              }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <circle
                cx="180"
                cy="180"
                r="146"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
              />
              <circle
                cx="180"
                cy="180"
                r="146"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="1.4"
                strokeDasharray="90 216"
                strokeLinecap="round"
                opacity="0.7"
              />
              <circle
                cx="180"
                cy="180"
                r="118"
                fill="none"
                stroke="rgba(226,241,245,0.22)"
                strokeWidth="0.8"
                strokeDasharray="3 9"
              />
            </motion.svg>
          </div>

          {/* Layer 4: Act 3–4 — Innovative Architectural Brand Lockup (No Raster Logo Required) */}
          <div className="relative z-30 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
            {/* Precision-Machined Architectural Omega Emblem (Vector) */}
            <motion.div
              className="mb-5 sm:mb-6"
              initial={{ opacity: 0, scale: 0.85, y: 12 }}
              animate={
                act >= 2
                  ? {
                      opacity: act >= 3 ? 1 : 0.55,
                      scale: 1,
                      y: 0,
                    }
                  : { opacity: 0, scale: 0.85, y: 12 }
              }
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              <svg
                viewBox="0 0 120 96"
                className="w-16 h-13 sm:w-20 sm:h-16"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="omegaGoldBevel" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F5E6B3" />
                    <stop offset="50%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#996515" />
                  </linearGradient>
                  <linearGradient id="omegaSteelBevel" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#94A3B8" />
                    <stop offset="50%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#CBD5E1" />
                  </linearGradient>
                </defs>

                {/* Outer Architectural Omega Arc */}
                <motion.path
                  d="M 16 78 L 41 78 L 41 68 C 28 60 23 43 29 29 C 35 16 47 10 60 10 C 73 10 85 16 91 29 C 97 43 92 60 79 68 L 79 78 L 104 78"
                  fill="none"
                  stroke="url(#omegaGoldBevel)"
                  strokeWidth="5.2"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: act >= 2 ? 1 : 0 }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Precision Inner Conductor Gap & Synchronizer Line */}
                <motion.path
                  d="M 46 84 L 74 84"
                  fill="none"
                  stroke="url(#omegaSteelBevel)"
                  strokeWidth="2.2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: act >= 3 ? 1 : 0, opacity: act >= 3 ? 0.95 : 0 }}
                  transition={{ duration: 0.65, delay: 0.15, ease: 'easeOut' }}
                />
              </svg>
            </motion.div>

            {/* Quiet Technical Spec Lead-in */}
            <motion.div
              className="text-[10px] sm:text-xs font-mono tracking-[0.28em] uppercase text-[#E5C158] mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={act >= 2 ? { opacity: 0.95, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              Alta Tensão · 15 a 500 kV
            </motion.div>

            {/* Monumental Brand Wordmark (Clip-Path Mask Reveal + Tracking Compression) */}
            <motion.div
              className="overflow-hidden"
              initial={{ clipPath: 'inset(0 50% 0 50%)', opacity: 0 }}
              animate={
                act >= 3
                  ? { clipPath: 'inset(0 0% 0 0%)', opacity: 1 }
                  : { clipPath: 'inset(0 50% 0 50%)', opacity: 0 }
              }
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.h1
                className="font-display font-extrabold text-5xl sm:text-7xl md:text-8xl uppercase text-white leading-none tracking-[0.22em]"
                initial={{ scale: 1.07 }}
                animate={
                  act >= 3
                    ? { scale: 1 }
                    : { scale: 1.07 }
                }
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              >
                OMEGA
              </motion.h1>
            </motion.div>

            {/* Architectural Subtitle */}
            <motion.p
              className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base font-sans font-medium tracking-[0.26em] uppercase text-slate-200/95"
              initial={{ opacity: 0, y: 12 }}
              animate={act >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              Engenharia e Construções Elétricas
            </motion.p>

            {/* Expanding Hairline Metallic Divider */}
            <motion.div
              className="mt-6 h-px w-48 sm:w-80 bg-gradient-to-r from-transparent via-[#D4AF37]/80 to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={act >= 3 ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.75, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Unboxed Real Engineering Credentials */}
            <motion.div
              className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] sm:text-xs font-mono tracking-[0.16em] uppercase text-slate-300/85"
              initial={{ opacity: 0 }}
              animate={act >= 3 ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.65, delay: 0.35 }}
            >
              <span>25+ Anos</span>
              <span aria-hidden="true" className="text-[#D4AF37]">·</span>
              <span>200.000 kVA Instalados</span>
              <span aria-hidden="true" className="text-[#D4AF37]">·</span>
              <span>Projeto à Energização</span>
            </motion.div>
          </div>

          {/* Discreet Timeline Progress Hairline & Immediate Skip Button */}
          <div className="fixed bottom-12 sm:bottom-14 left-6 right-6 z-50 flex items-center justify-between gap-4">
            <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono tracking-[0.18em] uppercase text-slate-400">
              <span>Energização</span>
              <div className="w-28 h-[2px] bg-white/15 overflow-hidden">
                <div
                  className="h-full bg-[#D4AF37] transition-[width] duration-75 ease-linear"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="tabular-nums text-slate-300 w-8">{Math.round(progressPct)}%</span>
            </div>

            <button
              type="button"
              onClick={finishIntro}
              className="ml-auto group inline-flex items-center gap-2 rounded-lg border border-white/20 bg-slate-950/75 hover:bg-white/10 hover:border-[#D4AF37]/70 px-4 py-2 text-[11px] font-mono uppercase tracking-[0.16em] text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              <span>Pular intro</span>
              <FastForward className="h-3.5 w-3.5 text-[#D4AF37] transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
