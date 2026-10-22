/**
 * Source: https://github.com/DwennK/canapey-launcher
 * Snapshot: src/lib/navigation.ts and src/lib/ambiance.ts, 2026-10-22.
 * Pure functions preserved; types narrowed to this read-only demonstration.
 *
 * MIT License
 *
 * Copyright (c) 2026 Canapey Launcher contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * Third-party trademarks are not licensed by this license. Manrope font: see
 * public/fonts/OFL.txt. Dependency licenses remain their respective owners'.
 */
export type Action = 'left' | 'right' | 'up' | 'down' | 'back';
export type Theme = 'home' | 'windows' | 'netflix' | 'youtube' | 'spotify' | 'internet' | 'steam';
type Settings = { dynamicBackground: boolean; generalAmbiance: 'home' | 'spotify' | 'night' | 'dusk' };

export function navigate(
  index: number,
  count: number,
  columns: number,
  view: "carousel" | "grid",
  action: Action,
): { index: number; view: "carousel" | "grid" } {
  const last = Math.max(0, count - 1);
  index = Math.min(last, Math.max(0, index));
  columns = Math.max(1, columns);
  if (action === "back") return { index, view: "carousel" };
  if (view === "carousel") {
    if (action === "down") return { index, view: "grid" };
    if (action === "left") index = Math.max(0, index - 1);
    if (action === "right") index = Math.min(last, index + 1);
  } else {
    if (action === "up" && index < columns) return { index, view: "carousel" };
    if (action === "up") index = Math.max(0, index - columns);
    if (action === "down") index = Math.min(last, index + columns);
    if (action === "left" && index % columns > 0) index--;
    if (action === "right" && index % columns < columns - 1)
      index = Math.min(last, index + 1);
  }
  return { index, view };
}



export const generalAmbiances = [
  { id: 'home', name: 'Salon', description: 'Chaleur ambrée' },
  { id: 'spotify', name: 'Émeraude', description: 'Lumière verte, esprit Spotify' },
  { id: 'night', name: 'Nuit', description: 'Bleu profond, pluie en ville' },
  { id: 'dusk', name: 'Crépuscule', description: 'Cuivre et lumière douce' },
] as const;

export function backgroundFor(theme: Theme, customImage: string, settings: Pick<Settings, 'dynamicBackground' | 'generalAmbiance'>) {
  const general = generalAmbiances.some(a => a.id === settings.generalAmbiance)
    ? settings.generalAmbiance : 'home';
  if (!settings.dynamicBackground) return `/art/${general}.webp`;
  if (customImage) return customImage;
  return `/art/${theme === 'home' || theme === 'windows' ? general : theme}.webp`;
}
