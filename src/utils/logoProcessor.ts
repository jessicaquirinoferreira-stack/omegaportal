// Utility to process the Grupo Omega 3D logo for Dark Mode:
// Converts black/dark metal and text pixels to pristine white while keeping the green chevron intact.
// Includes module-level cache & in-flight deduplication so Header & Footer convert only once.

const darkLogoCache = new Map<string, string>();
const inFlightListeners = new Map<string, Array<(url: string) => void>>();

export function getDarkLogoDataUrl(
  sourceUrl: string,
  callback: (darkUrl: string) => void,
  fallbackUrl?: string
) {
  if (typeof window === 'undefined') return;

  const cached = darkLogoCache.get(sourceUrl);
  if (cached) {
    callback(cached);
    return;
  }

  const pending = inFlightListeners.get(sourceUrl);
  if (pending) {
    pending.push(callback);
    return;
  }

  inFlightListeners.set(sourceUrl, [callback]);

  const notifyAll = (resultUrl: string) => {
    const listeners = inFlightListeners.get(sourceUrl) || [];
    inFlightListeners.delete(sourceUrl);
    listeners.forEach((cb) => cb(resultUrl));
  };

  const processImage = (url: string, allowFallbackRetry: boolean) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 512;
        canvas.height = img.naturalHeight || 256;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          notifyAll(url);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          if (a > 20) {
            const isGreen = g > 90 && g > r * 1.25 && g > b * 1.25;
            if (!isGreen) {
              const brightness = (r + g + b) / 3;
              if (brightness < 160) {
                const factor = 1 - brightness / 160;
                const val = Math.min(255, Math.floor(220 + factor * 35));
                data[i] = val;
                data[i + 1] = val;
                data[i + 2] = val;
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const resultDataUrl = canvas.toDataURL('image/png');
        darkLogoCache.set(sourceUrl, resultDataUrl);
        notifyAll(resultDataUrl);
      } catch {
        notifyAll(url);
      }
    };

    img.onerror = () => {
      if (allowFallbackRetry && fallbackUrl && fallbackUrl !== url) {
        processImage(fallbackUrl, false);
      } else {
        notifyAll(url);
      }
    };
  };

  processImage(sourceUrl, true);
}
