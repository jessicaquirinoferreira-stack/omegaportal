import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { computeTiltAngles } from '../../utils/visualEffectsMath';

/**
 * 1. Architectural Corner Drafting Brackets
 * Precision L-shaped hairlines inspired by CAD / NBR unifilar blueprints. Purely decorative.
 */
interface ArchitecturalBracketsProps {
  className?: string;
  colorClass?: string;
  sizeClass?: string;
}

export const ArchitecturalBrackets: React.FC<ArchitecturalBracketsProps> = ({
  className = '',
  colorClass = 'border-[#996515]/55 dark:border-[#C9A227]/60',
  sizeClass = 'w-3 h-3',
}) => {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 z-20 ${className}`}>
      <span className={`absolute top-2.5 left-2.5 ${sizeClass} border-t border-l ${colorClass}`} />
      <span className={`absolute top-2.5 right-2.5 ${sizeClass} border-t border-r ${colorClass}`} />
      <span className={`absolute bottom-2.5 left-2.5 ${sizeClass} border-b border-l ${colorClass}`} />
      <span className={`absolute bottom-2.5 right-2.5 ${sizeClass} border-b border-r ${colorClass}`} />
    </div>
  );
};

/**
 * 2. Purely Decorative Three-Phase SVG Circuit Flow & Energy Pulse Backdrop
 * Low-opacity geometric busbar traces with traveling energy pulses (GPU-friendly stroke-dashoffset).
 */
interface CircuitFlowBackdropProps {
  variant?: 'hero' | 'section' | 'footer';
  className?: string;
}

export const CircuitFlowBackdrop: React.FC<CircuitFlowBackdropProps> = ({
  variant = 'hero',
  className = '',
}) => {
  if (variant === 'footer') {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none relative w-full h-10 overflow-hidden bg-[#04090D] ${className}`}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 40"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0 20 H420 L446 8 H994 L1020 20 H1440"
            stroke="rgba(201,162,39,0.22)"
            strokeWidth="1"
          />
          <path
            d="M0 20 H420 L446 8 H994 L1020 20 H1440"
            stroke="#C9A227"
            strokeWidth="1.5"
            className="circuit-energy-pulse"
          />
          <path
            d="M0 28 H520 L542 18 H898 L920 28 H1440"
            stroke="rgba(34,211,238,0.14)"
            strokeWidth="1"
          />
          <circle cx="446" cy="8" r="2.5" fill="#C9A227" opacity="0.6" />
          <circle cx="994" cy="8" r="2.5" fill="#C9A227" opacity="0.6" />
        </svg>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <svg
        className="w-full h-full opacity-55 dark:opacity-75"
        viewBox="0 0 1440 720"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id={`omega-trace-gold-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0A3D4A" stopOpacity="0" />
            <stop offset="35%" stopColor="#C9A227" stopOpacity="0.65" />
            <stop offset="70%" stopColor="#22D3EE" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Static Technical Busbar Traces */}
        <path
          d="M-60 155 H260 L315 100 H810 L860 150 H1500"
          className="stroke-[#0A3D4A]/12 dark:stroke-[#22D3EE]/12"
          strokeWidth="1"
        />
        <path
          d="M-40 580 H460 L512 528 H1080 L1132 476 H1500"
          className="stroke-[#996515]/12 dark:stroke-[#C9A227]/14"
          strokeWidth="1"
        />
        <path
          d="M960 -20 V180 L1020 240 V540 L1075 595 V760"
          className="stroke-[#0A3D4A]/10 dark:stroke-slate-700/35"
          strokeWidth="1"
        />

        {/* Animated Dielectric Energy Pulses */}
        <path
          d="M-60 155 H260 L315 100 H810 L860 150 H1500"
          stroke={`url(#omega-trace-gold-${variant})`}
          strokeWidth="1.6"
          className="circuit-energy-pulse"
        />
        <path
          d="M-40 580 H460 L512 528 H1080 L1132 476 H1500"
          stroke={`url(#omega-trace-gold-${variant})`}
          strokeWidth="1.4"
          className="circuit-energy-pulse-slow"
        />

        {/* Substation Bus Node Junctions */}
        <rect
          x="312"
          y="97"
          width="6"
          height="6"
          className="fill-[#996515]/30 dark:fill-[#C9A227]/45"
        />
        <rect
          x="857"
          y="147"
          width="6"
          height="6"
          className="fill-[#0A3D4A]/25 dark:fill-[#22D3EE]/40"
        />
        <circle
          cx="512"
          cy="528"
          r="3"
          className="fill-[#996515]/30 dark:fill-[#C9A227]/50"
        />
      </svg>
    </div>
  );
};

/**
 * 3. TiltSpotlightCard (Magic UI / Aceternity / React Bits Hybrid)
 * Zero-re-render mouse-tracked border spotlight + micro 3D perspective tilt.
 * Automatically degrades to flat crisp transitions on touch screens and reduced motion.
 */
interface TiltSpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spotlightColor?: string;
  maxTiltDeg?: number;
  enableTilt?: boolean;
  className?: string;
}

export const TiltSpotlightCard: React.FC<TiltSpotlightCardProps> = ({
  children,
  spotlightColor = 'rgba(201, 162, 39, 0.14)',
  maxTiltDeg = 2.6,
  enableTilt = true,
  className = '',
  onMouseMove,
  onMouseLeave,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const canTiltRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    canTiltRef.current = enableTilt && !coarse && !reduced;
  }, [enableTilt]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    onMouseMove?.(e);
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const angles = computeTiltAngles({
      clientX: e.clientX,
      clientY: e.clientY,
      rectLeft: rect.left,
      rectTop: rect.top,
      rectWidth: rect.width,
      rectHeight: rect.height,
      maxTiltDeg,
    });

    el.style.setProperty('--spot-x', `${angles.spotlightX}px`);
    el.style.setProperty('--spot-y', `${angles.spotlightY}px`);

    if (canTiltRef.current) {
      el.style.transform = `perspective(950px) rotateX(${angles.rotateX}deg) rotateY(${angles.rotateY}deg) translateZ(0)`;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    onMouseLeave?.(e);
    const el = cardRef.current;
    if (!el) return;
    if (canTiltRef.current) {
      el.style.transform = 'perspective(950px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d' }}
      className={`group/tilt relative overflow-hidden transition-[transform,border-color,box-shadow] duration-200 ease-out hover:will-change-transform ${className}`}
      {...props}
    >
      {/* Pointer-Tracked Radial Surface Illumination */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100 z-0"
        style={{
          background: `radial-gradient(460px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${spotlightColor}, transparent 55%)`,
        }}
      />
      {/* Top Metallic Hairline Rim Accent on Hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A227]/75 to-transparent opacity-0 group-hover/tilt:opacity-100 transition-opacity duration-300 z-20"
      />
      <div className="relative z-10 h-full flex flex-col justify-between">{children}</div>
    </div>
  );
};

/**
 * 4. Editorial Mask Reveal Wrapper (Motion clip-path reveal for headlines & focal blocks)
 */
interface EditorialRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const EditorialReveal: React.FC<EditorialRevealProps> = ({
  children,
  delay = 0,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, clipPath: 'inset(0 0 14% 0)' }}
      whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * 5. Precision Desktop Reticle Cursor (Non-Blocking & Accessible)
 * Never hides or replaces the native OS cursor; subtly highlights interactive controls on desktop.
 */
export const PrecisionCursor: React.FC = () => {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isDesktopFine =
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      window.innerWidth >= 1024;

    if (!isDesktopFine) return;
    setEnabled(true);

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let isHovered = false;
    let visible = false;
    let rafId = 0;

    const handleMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      visible = true;
      const target = e.target as HTMLElement | null;
      isHovered = Boolean(
        target?.closest('button, a, [role="button"], input[type="range"], [data-cursor="active"]')
      );
    };

    const handleLeaveWindow = () => {
      visible = false;
    };

    const loop = () => {
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;

      if (ringRef.current) {
        const scale = isHovered ? 1.55 : 1;
        ringRef.current.style.opacity = visible ? (isHovered ? '0.85' : '0.45') : '0';
        ringRef.current.style.transform = `translate3d(${currentX - 14}px, ${currentY - 14}px, 0) scale(${scale})`;
      }
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('mouseleave', handleLeaveWindow);
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeaveWindow);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[95] h-7 w-7 rounded-full border border-[#996515]/70 dark:border-[#C9A227]/75 transition-[opacity,border-color] duration-200 will-change-transform"
      style={{ opacity: 0, transform: 'translate3d(-100px, -100px, 0)' }}
    />
  );
};
