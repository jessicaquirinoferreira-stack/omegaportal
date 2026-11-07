// Utility to process the Grupo Omega 3D logo for Dark Mode:
// Converts black/dark metal and text pixels to pristine white while keeping the green chevron intact.

export function getDarkLogoDataUrl(sourceUrl: string, callback: (darkUrl: string) => void) {
  if (typeof window === 'undefined') return;

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = sourceUrl;

  img.onload = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 1280;
      canvas.height = img.naturalHeight || 640;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a > 20) {
          // Check if pixel is the green chevron part (Green is dominant over Red and Blue)
          const isGreen = g > 90 && g > r * 1.25 && g > b * 1.25;

          if (!isGreen) {
            // Convert dark/black metal or text pixels to white, preserving shading luminance or making them solid white
            // To preserve 3D bevel shading, we can invert or map dark tones to bright white highlights
            const brightness = (r + g + b) / 3;
            if (brightness < 160) {
              // Map dark pixels to white with smooth gradient luminance preservation
              const factor = 1 - (brightness / 160);
              const val = Math.min(255, Math.floor(220 + (factor * 35)));
              data[i] = val;
              data[i + 1] = val;
              data[i + 2] = val;
            }
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      callback(canvas.toDataURL('image/png'));
    } catch (e) {
      console.error('Error processing dark mode logo:', e);
      callback(sourceUrl);
    }
  };

  img.onerror = () => {
    callback(sourceUrl);
  };
}
