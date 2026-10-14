/**
 * Tiles Specification, Geometry & POS Packaging Helper
 * Specially tailored for Runa Traders (Tiles, Sanitary & Fittings)
 */

export interface TileSizeOption {
  label: string;
  value: string;
  defaultSqftPerBox?: number;
  defaultPcsPerBox?: number;
}

export const POPULAR_TILE_SIZES: TileSizeOption[] = [
  { label: '8" × 12"', value: '8"x12"', defaultSqftPerBox: 16.66, defaultPcsPerBox: 25 },
  { label: '12" × 18"', value: '12"x18"', defaultSqftPerBox: 16.5, defaultPcsPerBox: 11 },
  { label: '12" × 20"', value: '12"x20"', defaultSqftPerBox: 16.66, defaultPcsPerBox: 10 },
  { label: '12" × 24"', value: '12"x24"', defaultSqftPerBox: 16.0, defaultPcsPerBox: 8 },
  { label: '10" × 16"', value: '10"x16"', defaultSqftPerBox: 16.66, defaultPcsPerBox: 15 },
  { label: '10.5" × 24"', value: '10.5"x24"', defaultSqftPerBox: 14.0, defaultPcsPerBox: 8 },
  { label: '16" × 16"', value: '16"x16"', defaultSqftPerBox: 16.0, defaultPcsPerBox: 9 },
  { label: '12" × 12"', value: '12"x12"', defaultSqftPerBox: 16.0, defaultPcsPerBox: 16 },
  { label: '32" × 32"', value: '32"x32"', defaultSqftPerBox: 14.222, defaultPcsPerBox: 2 },
  { label: '24" × 24"', value: '24"x24"', defaultSqftPerBox: 16.0, defaultPcsPerBox: 4 },
];

export const TILE_GRADES = [
  { label: 'Premium (Grade A)', value: 'Grade A', badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300' },
  { label: 'Commercial (Grade B)', value: 'Grade B', badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300' },
  { label: 'Standard (Grade C)', value: 'Grade C', badgeColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300' },
];

export const SURFACE_FINISHES = [
  'Glossy',
  'Matt',
  'Rustic',
  'Sugar',
  'PGVT (Polished Glazed)',
  'Satin',
  'Carving',
  'Full Body',
];

/**
 * Parse tile dimensions from strings like "8/12", "8x12", "8*12", "10.5/24", "10.5x24"
 */
export function parseTileDimension(tileSizeStr: string): { width: number; height: number } | null {
  if (!tileSizeStr) return null;
  const clean = tileSizeStr.replace(/"/g, '').trim();
  const match = clean.match(/^(\d+(?:\.\d+)?)\s*[\/xX*×]\s*(\d+(?:\.\d+)?)/);
  if (match) {
    const width = parseFloat(match[1]);
    const height = parseFloat(match[2]);
    if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
      return { width, height };
    }
  }
  return null;
}

/**
 * Automatically calculate Sq.Ft per Box from dimensions and pieces per box
 */
export function autoCalculateSqftPerBox(tileSizeStr: string, pcsPerBox: number): number | null {
  const dims = parseTileDimension(tileSizeStr);
  if (!dims || !pcsPerBox || pcsPerBox <= 0) return null;
  const singleTileSqft = (dims.width * dims.height) / 144;
  const total = singleTileSqft * pcsPerBox;
  // Match clean rounding (e.g. 16.666 -> 16.66, 14.222 -> 14.222)
  if (Math.abs(total - 16.6666) < 0.05) return 16.66;
  if (Math.abs(total - 14.2222) < 0.05) return 14.222;
  return parseFloat(total.toFixed(2));
}

/**
 * Calculate required boxes from square feet needed
 */
export function calculateTileCoverage(sqftNeeded: number, sqftPerBox: number) {
  if (!sqftNeeded || !sqftPerBox || sqftPerBox <= 0) {
    return {
      boxesExact: 0,
      recommendedBoxes: 0,
      totalSqftSupplied: 0,
      extraSqft: 0,
    };
  }

  const boxesExact = sqftNeeded / sqftPerBox;
  const recommendedBoxes = Math.ceil(boxesExact);
  const totalSqftSupplied = parseFloat((recommendedBoxes * sqftPerBox).toFixed(2));
  const extraSqft = parseFloat((totalSqftSupplied - sqftNeeded).toFixed(2));

  return {
    boxesExact: parseFloat(boxesExact.toFixed(2)),
    recommendedBoxes,
    totalSqftSupplied,
    extraSqft,
  };
}

/**
 * Calculate Sq.Ft from boxes count
 */
export function calculateSqftFromBoxes(boxes: number, sqftPerBox: number): number {
  if (!boxes || !sqftPerBox) return 0;
  return parseFloat((boxes * sqftPerBox).toFixed(2));
}

/**
 * Calculate rate per Sq.Ft from box price
 */
export function calculateRatePerSqft(boxPrice: number, sqftPerBox: number): number {
  if (!boxPrice || !sqftPerBox || sqftPerBox <= 0) return 0;
  return parseFloat((boxPrice / sqftPerBox).toFixed(2));
}

/**
 * Calculate box price from Sq.Ft rate
 */
export function calculateBoxPrice(ratePerSqft: number, sqftPerBox: number): number {
  if (!ratePerSqft || !sqftPerBox) return 0;
  return parseFloat((ratePerSqft * sqftPerBox).toFixed(2));
}
