import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import gsap from 'gsap';
import { FastForward } from 'lucide-react';

interface CinematicIntroProps {
  onComplete?: () => void;
  forcePlay?: boolean;
}

const STORAGE_KEY = 'omega-cinematic-intro-v3';
export const OFFICIAL_OMEGA_LOGO = 'https://i.postimg.cc/Gh9tKHJD/Logo-Omega-Engenharia-em-Metal-e-Ouro.png';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
}

interface ArcBolt {
  points: { x: number; y: number }[];
  alpha: number;
  color: string;
  width: number;
}

export default function CinematicIntro({ onComplete, forcePlay = false }: CinematicIntroProps) {
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    if (forcePlay) return true;
    if (typeof window !== 'undefined') {
      return !localStorage.getItem(STORAGE_KEY);
    }
    return true;
  });

  const [phase, setPhase] = useState<number>(0);
  const [showSkip, setShowSkip] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const logoWrapperRef = useRef<HTMLDivElement | null>(null);
  const dissolveFlashRef = useRef<HTMLDivElement | null>(null);
  const phaseRef = useRef<number>(0);
  const completedRef = useRef<boolean>(false);

  // Preload official logo image immediately
  useEffect(() => {
    const img = new Image();
    img.src = OFFICIAL_OMEGA_LOGO;
  }, []);

  // Sync phase ref for 60fps canvas loop
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const finishIntro = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
    setIsExiting(true);
    onComplete?.();
    setTimeout(() => {
      setShowIntro(false);
    }, 700);
  }, [onComplete]);

  // Master 6.0s GSAP Timeline
  useEffect(() => {
    if (!showIntro) {
      onComplete?.();
      return;
    }

    // Skip button appears at 500ms so visitors can jump instantly if desired
    const skipTimer = setTimeout(() => setShowSkip(true), 500);

    // Wall-clock failsafe timeout: ensures transition fires even if tab was in background
    const failsafe = setTimeout(() => {
      finishIntro();
    }, 6200);

    const tl = gsap.timeline();

    // 0.0s – 1.2s: Phase 1 — Point of electric blue light in absolute darkness
    tl.call(() => setPhase(1), [], 0.02);

    // 1.2s – 2.8s: Phase 2 — Explosion into electric mesh & high-voltage circuits
    tl.call(() => setPhase(2), [], 1.2);

    // 2.8s – 4.2s: Phase 3 — Convergence forming the official Omega logo in the center
    tl.call(() => setPhase(3), [], 2.8);

    // 4.2s – 5.5s: Phase 4 — Large static logo with subtle energy pulse & background parallax silhouettes
    tl.call(() => setPhase(4), [], 4.2);

    // 5.5s – 6.0s: Phase 5 — Dissolution into particles & cinematic scale-up wipe
    tl.call(() => setPhase(5), [], 5.5);

    if (logoWrapperRef.current) {
      tl.to(
        logoWrapperRef.current,
        {
          scale: 1.18,
          filter: 'blur(16px)',
          opacity: 0,
          duration: 0.5,
          ease: 'power3.in',
        },
        5.5
      );
    }

    if (dissolveFlashRef.current) {
      tl.fromTo(
        dissolveFlashRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1.4,
          duration: 0.5,
          ease: 'power2.inOut',
        },
        5.5
      );
    }

    // Exactly at 6.0s: Finish and transition smoothly to the site
    tl.call(() => finishIntro(), [], 6.0);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(failsafe);
      tl.kill();
    };
  }, [showIntro, finishIntro, onComplete]);

  // 60fps HTML5 Canvas: High-Voltage Arcs, Corona Discharges & Energy Particles
  useEffect(() => {
    if (!showIntro) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const bolts: ArcBolt[] = [];
    const palette = ['#00D4FF', '#FFFFFF', '#C9A227', '#E2F1F5'];

    const spawnParticle = (fromCenter = false, burst = false) => {
      const cx = width / 2;
      const cy = height / 2;
      const angle = Math.random() * Math.PI * 2;
      const speed = burst ? 3 + Math.random() * 8 : 0.4 + Math.random() * 2;
      const dist = fromCenter ? Math.random() * 24 : Math.random() * Math.max(width, height) * 0.5;

      particles.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: burst ? 1.5 + Math.random() * 2.8 : 0.8 + Math.random() * 1.8,
        alpha: 0.3 + Math.random() * 0.7,
        color: palette[Math.floor(Math.random() * palette.length)],
        life: 0,
        maxLife: burst ? 35 + Math.random() * 30 : 60 + Math.random() * 70,
      });
    };

    const createLightningBolt = (radiusMax: number, color: string) => {
      const cx = width / 2;
      const cy = height / 2;
      const angle = Math.random() * Math.PI * 2;
      const segments = 8 + Math.floor(Math.random() * 6);
      const points: { x: number; y: number }[] = [{ x: cx, y: cy }];

      for (let i = 1; i <= segments; i++) {
        const r = (i / segments) * radiusMax;
        const jitter = (Math.random() - 0.5) * 26;
        const px = cx + Math.cos(angle) * r - Math.sin(angle) * jitter;
        const py = cy + Math.sin(angle) * r + Math.cos(angle) * jitter;
        points.push({ x: px, y: py });
      }

      bolts.push({
        points,
        alpha: 0.9,
        color,
        width: 1.2 + Math.random() * 1.6,
      });
    };

    // Initial ambient particles
    for (let i = 0; i < 35; i++) {
      spawnParticle(true, false);
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const currentPhase = phaseRef.current;

      // Phase-specific particle & lightning behavior
      if (currentPhase === 1) {
        if (Math.random() < 0.5) spawnParticle(true, false);
        if (Math.random() < 0.35) createLightningBolt(50 + Math.random() * 60, '#00D4FF');
      } else if (currentPhase === 2) {
        if (particles.length < 140) {
          for (let i = 0; i < 4; i++) spawnParticle(true, true);
        }
        if (Math.random() < 0.5) {
          createLightningBolt(
            Math.min(width, height) * (0.24 + Math.random() * 0.28),
            Math.random() > 0.35 ? '#00D4FF' : '#C9A227'
          );
        }
      } else if (currentPhase === 3 || currentPhase === 4) {
        if (particles.length < 80 && Math.random() < 0.3) {
          spawnParticle(false, false);
        }
        if (Math.random() < 0.2) {
          createLightningBolt(120, Math.random() > 0.5 ? '#C9A227' : '#00D4FF');
        }
      } else if (currentPhase === 5) {
        // Dissolution burst
        for (let i = 0; i < 10; i++) {
          spawnParticle(true, true);
        }
      }

      // Render lightning bolts
      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i];
        ctx.save();
        ctx.beginPath();
        b.points.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.strokeStyle = b.color;
        ctx.lineWidth = b.width;
        ctx.globalAlpha = b.alpha;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 16;
        ctx.stroke();
        ctx.restore();

        b.alpha -= 0.085;
        if (b.alpha <= 0) bolts.splice(i, 1);
      }

      // Render energy particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const lifeRatio = p.life / p.maxLife;
        const currentAlpha = p.alpha * Math.sin(lifeRatio * Math.PI);

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, currentAlpha);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [showIntro]);

  if (!showIntro) return null;

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-[9999] h-screen w-screen overflow-hidden bg-[#000000] flex items-center justify-center select-none"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.1,
            filter: 'blur(20px)',
            transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
          }}
        >
          {/* Layer 1: 60fps Electric Canvas (Lightning, Arcs & Energy Particles) */}
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 h-full w-full z-10"
          />

          {/* Layer 2 (4.2s – 5.5s): Subtle Substation Silhouettes & Transmission Towers (Parallax Depth of Field) */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-0 flex items-end justify-center overflow-hidden"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={
              phase >= 4
                ? {
                    opacity: phase === 5 ? 0 : 0.18,
                    scale: 1,
                    x: [-10, 10],
                  }
                : { opacity: 0, scale: 1.06 }
            }
            transition={{
              opacity: { duration: 0.8, ease: 'easeOut' },
              scale: { duration: 1.6, ease: 'easeOut' },
              x: { duration: 2.2, ease: 'linear' },
            }}
          >
            <svg
              viewBox="0 0 1600 600"
              className="w-[115%] max-w-none h-[65vh] object-cover stroke-[#00D4FF]/40 fill-none"
              preserveAspectRatio="xMidYBottom slice"
            >
              <defs>
                <linearGradient id="introHorizonGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.4" />
                  <stop offset="60%" stopColor="#C9A227" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.95" />
                </linearGradient>
              </defs>

              {/* Ground Grid */}
              <g stroke="url(#introHorizonGrad)" strokeWidth="1" opacity="0.35">
                <line x1="0" y1="520" x2="1600" y2="520" />
                <line x1="0" y1="555" x2="1600" y2="555" />
                <line x1="0" y1="585" x2="1600" y2="585" />
                {[...Array(17)].map((_, idx) => (
                  <line
                    key={idx}
                    x1={800 + (idx - 8) * 65}
                    y1="480"
                    x2={800 + (idx - 8) * 160}
                    y2="600"
                  />
                ))}
              </g>

              {/* Left 500kV Tower */}
              <g stroke="#00D4FF" strokeWidth="1.5" opacity="0.5">
                <path d="M220 520 L260 220 L280 220 L320 520" />
                <line x1="235" y1="420" x2="305" y2="420" />
                <line x1="248" y1="320" x2="292" y2="320" />
                <path d="M190 260 L350 260 L270 235 Z" />
                <path d="M170 315 L370 315 L270 285 Z" />
              </g>

              {/* Center Transformers */}
              <g stroke="#C9A227" strokeWidth="1.4" opacity="0.45">
                <rect x="560" y="390" width="110" height="130" fill="#04151F" fillOpacity="0.6" />
                <rect x="930" y="390" width="110" height="130" fill="#04151F" fillOpacity="0.6" />
                <line x1="585" y1="390" x2="585" y2="345" />
                <line x1="615" y1="390" x2="615" y2="345" />
                <line x1="645" y1="390" x2="645" y2="345" />
                <circle cx="585" cy="340" r="4" fill="#00D4FF" />
                <circle cx="615" cy="340" r="4" fill="#00D4FF" />
                <circle cx="645" cy="340" r="4" fill="#00D4FF" />
              </g>

              {/* Right 500kV Tower */}
              <g stroke="#00D4FF" strokeWidth="1.5" opacity="0.5">
                <path d="M1280 520 L1320 220 L1340 220 L1380 520" />
                <line x1="1295" y1="420" x2="1365" y2="420" />
                <line x1="1308" y1="320" x2="1352" y2="320" />
                <path d="M1250 260 L1410 260 L1330 235 Z" />
                <path d="M1230 315 L1430 315 L1330 285 Z" />
                <path
                  d="M350 260 Q 580 350 800 310 T 1250 260"
                  stroke="#00D4FF"
                  strokeDasharray="6 4"
                  opacity="0.5"
                />
              </g>
            </svg>
          </motion.div>

          {/* Layer 3 (0.0s – 1.2s): Central Electric Arc Point */}
          <motion.div
            className="pointer-events-none absolute z-20 flex items-center justify-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={
              phase === 1
                ? { scale: [0, 1.4, 1.15, 1.7], opacity: 1 }
                : phase === 2
                ? { scale: 2.8, opacity: 0.25 }
                : { scale: 0.3, opacity: 0 }
            }
            transition={{ duration: 1.1, ease: 'easeOut' }}
          >
            <div className="h-28 w-28 rounded-full bg-[#00D4FF]/25 blur-2xl" />
            <div className="absolute h-4 w-4 rounded-full bg-white shadow-[0_0_35px_14px_#00D4FF,0_0_80px_30px_rgba(0,212,255,0.8)]" />
            <div className="absolute h-10 w-10 rounded-full border border-[#00D4FF]/80 animate-ping" />
          </motion.div>

          {/* Layer 4 (1.2s – 2.8s): High-Voltage Grid & Circuit Mesh Explosion */}
          {phase >= 2 && (
            <svg
              viewBox="0 0 1200 800"
              className="pointer-events-none absolute inset-0 z-10 h-full w-full"
              preserveAspectRatio="xMidYMid slice"
            >
              {[
                'M 600 400 L 420 400 L 340 320 L 140 320',
                'M 600 400 L 780 400 L 860 320 L 1060 320',
                'M 600 400 L 420 400 L 340 480 L 140 480',
                'M 600 400 L 780 400 L 860 480 L 1060 480',
                'M 600 400 L 600 220 L 490 140 L 260 140',
                'M 600 400 L 600 220 L 710 140 L 940 140',
                'M 600 400 L 600 580 L 490 660 L 260 660',
                'M 600 400 L 600 580 L 710 660 L 940 660',
                'M 600 400 L 480 280 L 310 280 L 220 190',
                'M 600 400 L 720 280 L 890 280 L 980 190',
                'M 600 400 L 480 520 L 310 520 L 220 610',
                'M 600 400 L 720 520 L 890 520 L 980 610',
              ].map((d, i) => {
                const isGold = i % 3 === 0;
                const isWhite = i % 4 === 1;
                const strokeColor = isGold ? '#C9A227' : isWhite ? '#FFFFFF' : '#00D4FF';

                return (
                  <g key={i}>
                    <motion.path
                      d={d}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={isGold ? '2.2' : '1.5'}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={
                        phase === 2
                          ? { pathLength: 1, opacity: [0, 1, 0.7] }
                          : phase >= 3
                          ? { pathLength: [1, 0.15], opacity: [0.7, 0.1] }
                          : {}
                      }
                      transition={{
                        duration: phase === 2 ? 1.15 : 0.8,
                        delay: phase === 2 ? i * 0.04 : 0,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      style={{
                        filter: `drop-shadow(0 0 10px ${strokeColor})`,
                      }}
                    />
                  </g>
                );
              })}

              {/* Concentric Telemetry Rings */}
              <motion.circle
                cx="600"
                cy="400"
                r="190"
                fill="none"
                stroke="#00D4FF"
                strokeWidth="1.2"
                strokeDasharray="8 12"
                initial={{ scale: 0, opacity: 0 }}
                animate={
                  phase === 2
                    ? { scale: 1, opacity: 0.5, rotate: 90 }
                    : { scale: 0.5, opacity: 0.12, rotate: 180 }
                }
                transition={{ duration: 1.3, ease: 'easeOut' }}
              />
              <motion.circle
                cx="600"
                cy="400"
                r="280"
                fill="none"
                stroke="#C9A227"
                strokeWidth="1.2"
                strokeDasharray="4 16"
                initial={{ scale: 0, opacity: 0 }}
                animate={
                  phase === 2
                    ? { scale: 1, opacity: 0.4, rotate: -60 }
                    : { scale: 0.38, opacity: 0.08, rotate: -120 }
                }
                transition={{ duration: 1.4, ease: 'easeOut' }}
              />
            </svg>
          )}

          {/* Layer 5 (2.8s – 5.5s): OFFICIAL OMEGA METALLIC LOGO (LARGE, DOMINANT, NO TEXT) */}
          <motion.div
            ref={logoWrapperRef}
            className="relative z-30 flex flex-col items-center justify-center p-4 select-none"
            initial={{ opacity: 0, scale: 0.75 }}
            animate={
              phase >= 3
                ? {
                    opacity: 1,
                    scale: phase === 4 ? [1, 1.025, 1] : 1,
                  }
                : { opacity: 0, scale: 0.75 }
            }
            transition={{
              opacity: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
              scale:
                phase === 4
                  ? { duration: 1.3, ease: 'easeInOut' }
                  : { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
            }}
          >
            {/* Pulsing Energy Glow behind official metallic logo */}
            <motion.div
              className="pointer-events-none absolute h-[320px] w-[320px] sm:h-[440px] sm:w-[440px] md:h-[520px] md:w-[520px] rounded-full"
              animate={
                phase >= 3
                  ? {
                      boxShadow: [
                        '0 0 50px 15px rgba(201, 162, 39, 0.35), 0 0 90px 30px rgba(0, 212, 255, 0.28)',
                        '0 0 85px 25px rgba(0, 212, 255, 0.6), 0 0 130px 45px rgba(201, 162, 39, 0.48)',
                        '0 0 50px 15px rgba(201, 162, 39, 0.35), 0 0 90px 30px rgba(0, 212, 255, 0.28)',
                      ],
                    }
                  : {}
              }
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Traveling Electric Energy Orbit around Logo Contour */}
            <motion.div
              className="pointer-events-none absolute h-[290px] w-[290px] sm:h-[390px] sm:w-[390px] md:h-[480px] md:w-[480px] rounded-full border border-[#00D4FF]/40"
              initial={{ rotate: 0, opacity: 0 }}
              animate={phase >= 3 ? { rotate: 360, opacity: [0.2, 0.8, 0.4] } : {}}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              style={{
                boxShadow: '0 0 25px rgba(0, 212, 255, 0.45)',
              }}
            >
              <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-white shadow-[0_0_16px_6px_#00D4FF]" />
              <div className="absolute -bottom-1.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#C9A227] shadow-[0_0_14px_5px_#C9A227]" />
            </motion.div>

            {/* The Official Pure Logo Image (100% Transparent, Big, Dominant, Absolutely NO Text) */}
            <motion.img
              src={OFFICIAL_OMEGA_LOGO}
              alt="Omega Engenharia"
              fetchPriority="high"
              decoding="async"
              className="relative z-20 w-[270px] sm:w-[360px] md:w-[460px] lg:w-[520px] max-w-[85vw] max-h-[62vh] object-contain drop-shadow-[0_0_35px_rgba(201,162,39,0.55)] transition-all"
              initial={{ opacity: 0, scale: 0.82, filter: 'brightness(1.8) contrast(1.2)' }}
              animate={
                phase >= 3
                  ? {
                      opacity: 1,
                      scale: 1,
                      filter: [
                        'brightness(1.5) drop-shadow(0 0 35px rgba(201,162,39,0.6)) drop-shadow(0 0 60px rgba(0,212,255,0.4))',
                        'brightness(1.15) drop-shadow(0 0 50px rgba(0,212,255,0.7)) drop-shadow(0 0 85px rgba(201,162,39,0.5))',
                        'brightness(1.5) drop-shadow(0 0 35px rgba(201,162,39,0.6)) drop-shadow(0 0 60px rgba(0,212,255,0.4))',
                      ],
                    }
                  : {}
              }
              transition={{
                opacity: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                scale: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
                filter: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
              }}
            />
          </motion.div>

          {/* Layer 6 (5.5s – 6.0s): Radial Energy Portal Flash */}
          <div
            ref={dissolveFlashRef}
            className="pointer-events-none absolute inset-0 z-40 opacity-0"
            style={{
              background:
                'radial-gradient(circle at center, rgba(255,255,255,0.95) 0%, rgba(226,241,245,0.85) 35%, rgba(0,212,255,0.35) 65%, transparent 100%)',
            }}
          />

          {/* Bottom Skip Button (Discreet, appears at 1.5s - ONLY text allowed) */}
          <AnimatePresence>
            {showSkip && (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                onClick={finishIntro}
                className="group absolute bottom-7 right-7 sm:bottom-9 sm:right-9 z-50 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-[#C9A227]/60 px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] text-white/55 hover:text-white transition-all cursor-pointer backdrop-blur-sm"
              >
                <span>Pular intro</span>
                <FastForward className="h-3.5 w-3.5 text-[#C9A227] transition-transform group-hover:translate-x-0.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
