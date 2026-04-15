function clamp255(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

/** Parses hex (#RGB / #RRGGBB / #RRGGBBAA), rgb(), or rgba() into sRGB 0–255. */
export function parseCssColorToRgb(input: string): {
  r: number;
  g: number;
  b: number;
} | null {
  const s = input.trim();
  if (!s) return null;

  if (s.startsWith("#")) {
    let h = s.slice(1);
    if (h.length === 3) {
      h = h
        .split("")
        .map((c) => c + c)
        .join("");
    }
    if (h.length === 6 || h.length === 8) {
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      if ([r, g, b].every((x) => !Number.isNaN(x))) return { r, g, b };
    }
    return null;
  }

  const m = s.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*[\d.]+\s*)?\)$/i,
  );
  if (m) {
    return {
      r: clamp255(Number(m[1])),
      g: clamp255(Number(m[2])),
      b: clamp255(Number(m[3])),
    };
  }

  const space = s.match(
    /^rgba?\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*[\d.]+\s*)?\)$/i,
  );
  if (space) {
    return {
      r: clamp255(Number(space[1])),
      g: clamp255(Number(space[2])),
      b: clamp255(Number(space[3])),
    };
  }

  return null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map((x) => clamp255(x).toString(16).padStart(2, "0"))
    .join("")}`;
}

/** Value for &lt;input type="color"&gt; when the stored string may be rgba() etc. */
export function cssColorToHexForPicker(css: string): string {
  const rgb = parseCssColorToRgb(css);
  if (rgb) return rgbToHex(rgb.r, rgb.g, rgb.b);
  return "#000000";
}

export function hexToLightTint(hex: string, mix = 0.88): string {
  const normalized = hex.replace("#", "").trim();
  if (normalized.length !== 6) return "#E8F5F4";
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return "#E8F5F4";
  const lr = Math.round(r + (255 - r) * mix);
  const lg = Math.round(g + (255 - g) * mix);
  const lb = Math.round(b + (255 - b) * mix);
  return `rgb(${lr},${lg},${lb})`;
}

/** Light background tint derived from any CSS color string we can parse (hex, rgb, rgba). */
export function colorToLightTint(cssColor: string, mix = 0.88): string {
  const rgb = parseCssColorToRgb(cssColor);
  if (!rgb) {
    return hexToLightTint(cssColor, mix);
  }
  const lr = Math.round(rgb.r + (255 - rgb.r) * mix);
  const lg = Math.round(rgb.g + (255 - rgb.g) * mix);
  const lb = Math.round(rgb.b + (255 - rgb.b) * mix);
  return `rgb(${lr},${lg},${lb})`;
}

export function applyBrandCssVars(
  root: HTMLElement,
  brandColor: string,
  secondaryColor: string,
) {
  root.style.setProperty("--brand-color", brandColor);
  root.style.setProperty("--secondary-color", secondaryColor);
  root.style.setProperty("--secondary-light", colorToLightTint(secondaryColor));
}
