// src/hooks/useImageColors.js
import { useState, useEffect } from 'react';
import ColorThief from 'colorthief';

// Utility: Hex ↔ RGB ↔ HSL and luminance for contrast
const rgbToHex = (r, g, b) =>
  "#" + ((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1);
const hexToRgb = (hex) => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m
    ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
    : null;
};
// Calculate vibrancy, pick top 3 vibrant colors
const getColorVibrancy = (r, g, b) => {
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const saturation = max === 0 ? 0 : (max - min) / max;
  const brightness = max / 255;
  return saturation * brightness;
};
const getMostVibrant = (palette) => {
  const arr = palette.map((c) => ({
    rgb: c,
    hex: rgbToHex(c[0], c[1], c[2]),
    vibrancy: getColorVibrancy(c[0], c[1], c[2]),
  }));
  arr.sort((a, b) => b.vibrancy - a.vibrancy);
  return arr;
};

export const useImageColors = (imageUrl) => {
  const [colors, setColors] = useState({
    primary: '#3B82F6',
    secondary: '#1E40AF',
    accent: '#60A5FA',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!imageUrl) return;

    const extract = async () => {
      setIsLoading(true);
      const ct = new ColorThief();
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          const palette = ct.getPalette(img, 6);
          const vibrant = getMostVibrant(palette);
          setColors({
            primary: vibrant[0].hex,
            secondary: vibrant[1]?.hex || vibrant[0].hex,
            accent: vibrant[2]?.hex || vibrant[1]?.hex || vibrant[0].hex,
          });
        } catch {
          // fallback: dominant color only
          const dom = ct.getColor(img);
          setColors({
            primary: rgbToHex(...dom),
            secondary: rgbToHex(...dom),
            accent: rgbToHex(...dom),
          });
        }
        setIsLoading(false);
      };

      img.onerror = () => setIsLoading(false);
      img.src = imageUrl;
    };

    extract();
  }, [imageUrl]);

  return { colors, isLoading };
};

// Generate only background-related CSS with lightness control
export const getBackgroundTheme = (colors, options = {}) => {
  // options.lightness: 0–1, default 0.4 for 40% opacity stops
  const lightness = options.lightness ?? 0.4;
  const ha = lightness;       // for header gradient opacity multiplier
  const sa = lightness * 0.6; // for background pattern opacity multiplier

  // Compute shadow color with alpha according to lightness
  const shadowColor = `${colors.primary}${Math.floor(ha * 30)
    .toString(16)
    .padStart(2, '0')}`;

  return {
    headerGradient: `
      linear-gradient(135deg,
        ${colors.primary}${Math.floor(ha * 100).toString(16).padStart(2, '0')} 0%,
        ${colors.secondary}${Math.floor(ha * 80).toString(16).padStart(2, '0')} 50%,
        ${colors.accent}${Math.floor(ha * 60).toString(16).padStart(2, '0')} 100%
      )
    `,
    backgroundPattern: `
      radial-gradient(circle at 20% 50%, ${colors.primary}${Math.floor(sa * 60)
      .toString(16)
      .padStart(2, '0')} 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, ${colors.secondary}${Math.floor(sa * 50)
      .toString(16)
      .padStart(2, '0')} 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, ${colors.accent}${Math.floor(sa * 40)
      .toString(16)
      .padStart(2, '0')} 0%, transparent 50%)
    `,
    accentBorder: `${colors.primary}${Math.floor(ha * 50).toString(16).padStart(2, '0')}`,
    shadowColor,
  };
};
