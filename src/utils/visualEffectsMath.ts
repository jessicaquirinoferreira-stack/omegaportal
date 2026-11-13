export interface TiltAngles {
  rotateX: number;
  rotateY: number;
  spotlightX: number;
  spotlightY: number;
}

/**
 * Computes clamped 3D perspective tilt angles and normalized pointer spotlight coordinates
 * for hardware-accelerated card surfaces without triggering layout thrashing.
 */
export function computeTiltAngles(params: {
  clientX: number;
  clientY: number;
  rectLeft: number;
  rectTop: number;
  rectWidth: number;
  rectHeight: number;
  maxTiltDeg?: number;
}): TiltAngles {
  const {
    clientX,
    clientY,
    rectLeft,
    rectTop,
    rectWidth,
    rectHeight,
    maxTiltDeg = 3.2,
  } = params;

  if (rectWidth <= 0 || rectHeight <= 0) {
    return { rotateX: 0, rotateY: 0, spotlightX: 0, spotlightY: 0 };
  }

  const localX = Math.max(0, Math.min(rectWidth, clientX - rectLeft));
  const localY = Math.max(0, Math.min(rectHeight, clientY - rectTop));

  const normX = (localX / rectWidth - 0.5) * 2; // [-1, 1]
  const normY = (localY / rectHeight - 0.5) * 2; // [-1, 1]

  const rotateY = Number((normX * maxTiltDeg).toFixed(3));
  const rotateX = Number((-normY * maxTiltDeg).toFixed(3));

  return {
    rotateX,
    rotateY,
    spotlightX: Math.round(localX),
    spotlightY: Math.round(localY),
  };
}

/**
 * Determines editorial column span for asymmetric Bento/Portfolio layouts
 * so rows balance cleanly without orphan gaps on 14-item and 12-item collections.
 */
export function getEditorialProjectCardClass(params: {
  index: number;
  totalCount: number;
  isUnfiltered: boolean;
}): { isFeatured: boolean; spanClass: string; aspectClass: string } {
  const { index, totalCount, isUnfiltered } = params;

  // On the default 14-project gallery showcase:
  // - sm/md (2-col): #01 & #06 span 2 cols => 14 + 2 = 16 cells (8 full rows of 2)
  // - lg (3-col): only #01 spans 2 cols => 14 + 1 = 15 cells (5 full rows of 3)
  // - xl (4-col): #01 & #06 span 2 cols => 14 + 2 = 16 cells (4 full rows of 4)
  if (isUnfiltered && totalCount === 14) {
    if (index === 0) {
      return {
        isFeatured: true,
        spanClass: 'sm:col-span-2 lg:col-span-2 xl:col-span-2',
        aspectClass: 'aspect-[4/3] sm:aspect-[21/9] xl:aspect-[2.68/1]',
      };
    }
    if (index === 5) {
      return {
        isFeatured: true,
        spanClass: 'sm:col-span-2 lg:col-span-1 xl:col-span-2',
        aspectClass: 'aspect-[4/3] sm:aspect-[21/9] lg:aspect-[4/3] xl:aspect-[2.68/1]',
      };
    }
  }

  return {
    isFeatured: false,
    spanClass: '',
    aspectClass: 'aspect-[4/3]',
  };
}
