export const INTRO_TOTAL_MS = 8000;
export const INTRO_EXIT_MS = 700;

export type IntroAct = 1 | 2 | 3 | 4;

/**
 * Resolves the active cinematic act for a given elapsed timestamp in milliseconds across an 8s sequence.
 * Act 1 (0..1400ms): Dusk 500 kV substation emergence & optical phase calibration
 * Act 2 (1400..3400ms): Three-phase busbar energization (L1/L2/L3) & sodium specular flare
 * Act 3 (3400..7300ms): Architectural vector Omega emblem & monumental wordmark hold
 * Act 4 (7300..8000ms): Optical dissolve transition directly into the website
 */
export function getIntroPhaseAtTime(elapsedMs: number): IntroAct {
  if (elapsedMs < 1400) return 1;
  if (elapsedMs < 3400) return 2;
  if (elapsedMs < 7300) return 3;
  return 4;
}

/**
 * Returns normalized timeline progress [0, 100] clamped cleanly.
 */
export function getIntroProgressPct(elapsedMs: number, totalMs: number = INTRO_TOTAL_MS): number {
  if (totalMs <= 0) return 100;
  const ratio = Math.min(1, Math.max(0, elapsedMs / totalMs));
  return Math.round(ratio * 100);
}

export interface IntroBootOptions {
  forcePlay?: boolean;
  search?: string;
  storedCompleted?: string | null;
  prefersReducedMotion?: boolean;
}

/**
 * Determines whether the cinematic intro should play on initial boot or page refresh.
 * Always plays on every open/reload; honors `?autostart=1` and `prefers-reduced-motion` unless `forcePlay` is requested.
 */
export function shouldShowIntroOnBoot(options: IntroBootOptions): boolean {
  const {
    forcePlay = false,
    search = '',
    prefersReducedMotion = false,
  } = options;

  if (forcePlay) return true;
  if (prefersReducedMotion) return false;

  if (search) {
    const params = new URLSearchParams(search);
    if (params.get('autostart') === '1') {
      return false;
    }
  }

  return true;
}
