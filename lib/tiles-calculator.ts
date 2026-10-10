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
  { label: '24" × 24" (60×60 cm)', value: '24"x24"', defaultSqftPerBox: 16.0, defaultPcsPerBox: 4 },
  { label: '12" × 24" (30×60 cm)', value: '12"x24"', defaultSqftPerBox: 16.0, defaultPcsPerBox: 8 },
  { label: '32" × 32" (80×80 cm)', value: '32"x32"', defaultSqftPerBox: 21.33, defaultPcsPerBox: 3 },
  { label: '16" × 16" (40×40 cm)', value: '16"x16"', defaultSqftPerBox: 10.67, defaultPcsPerBox: 6 },
  { label: '12" × 12" (30×30 cm)', value: '12"x12"', defaultSqftPerBox: 10.0, defaultPcsPerBox: 10 },
  { label: '10" × 16" (25×40 cm)', value: '10"x16"', defaultSqftPerBox: 11.11, defaultPcsPerBox: 10 },
  { label: '8" × 12" (20×30 cm)', value: '8"x12"', defaultSqftPerBox: 10.0, defaultPcsPerBox: 15 },
  { label: '48" × 24" (120×60 cm)', value: '48"x24"', defaultSqftPerBox: 15.5, defaultPcsPerBox: 2 },
  { label: '8" × 8" (20×20 cm)', value: '8"x8"', defaultSqftPerBox: 8.88, defaultPcsPerBox: 20 },
];

export const TILE_GRADES = [
  { label: 'Premium (Grade A)', value: 'Grade A', badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300' },
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
