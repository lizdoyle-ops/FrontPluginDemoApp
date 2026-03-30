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

export function applyBrandCssVars(
  root: HTMLElement,
  brandColor: string,
  secondaryColor: string,
) {
  root.style.setProperty("--brand-color", brandColor);
  root.style.setProperty("--secondary-color", secondaryColor);
  root.style.setProperty("--secondary-light", hexToLightTint(secondaryColor));
}
