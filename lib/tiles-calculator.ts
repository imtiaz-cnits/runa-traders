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
  { label: '8" × 12" (20×30 cm)', value: '8"x12"', defaultSqftPerBox: 16.66, defaultPcsPerBox: 25 },
  { label: '12" × 18" (30×45 cm)', value: '12"x18"', defaultSqftPerBox: 16.5, defaultPcsPerBox: 11 },
  { label: '12" × 20" (30×50 cm)', value: '12"x20"', defaultSqftPerBox: 16.66, defaultPcsPerBox: 10 },
  { label: '12" × 24" (30×60 cm)', value: '12"x24"', defaultSqftPerBox: 16.0, defaultPcsPerBox: 8 },
  { label: '10" × 16" (25×40 cm)', value: '10"x16"', defaultSqftPerBox: 16.66, defaultPcsPerBox: 15 },
  { label: '10.5" × 24" (27×60 cm)', value: '10.5"x24"', defaultSqftPerBox: 14.0, defaultPcsPerBox: 8 },
  { label: '16" × 16" (40×40 cm)', value: '16"x16"', defaultSqftPerBox: 16.0, defaultPcsPerBox: 9 },
  { label: '12" × 12" (30×30 cm)', value: '12"x12"', defaultSqftPerBox: 16.0, defaultPcsPerBox: 16 },
  { label: '32" × 32" (80×80 cm)', value: '32"x32"', defaultSqftPerBox: 14.222, defaultPcsPerBox: 2 },
  { label: '24" × 24" (60×60 cm)', value: '24"x24"', defaultSqftPerBox: 16.0, defaultPcsPerBox: 4 },
  { label: '48" × 24" (120×60 cm)', value: '48"x24"', defaultSqftPerBox: 16.0, defaultPcsPerBox: 2 },
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

/**
 * Format boxes and remaining pieces cleanly
 * e.g. 75.25 boxes with 4 pcs/box => "75 Boxes 1 Pc"
 * e.g. 12.16 boxes with 25 pcs/box => "12 Boxes 4 Pcs"
 * e.g. 10 boxes => "10 Boxes"
 */
export function formatBoxAndPcs(
  boxes: number | string | null | undefined,
  pcsPerBox?: number | string | null
): string {
  if (boxes === null || boxes === undefined || boxes === "") return "0 Box";
  const numBoxes = typeof boxes === "number" ? boxes : parseFloat(String(boxes));
  if (isNaN(numBoxes) || numBoxes <= 0) return "0 Box";

  const pcsNum = pcsPerBox
    ? typeof pcsPerBox === "number"
      ? pcsPerBox
      : parseInt(String(pcsPerBox), 10)
    : 0;

  const fullBoxes = Math.floor(numBoxes);
  const frac = numBoxes - fullBoxes;
  const pcs = pcsNum > 0 ? Math.round(frac * pcsNum) : 0;

  if (fullBoxes > 0 && pcs > 0) {
    return `${fullBoxes} Box${fullBoxes > 1 ? "es" : ""} ${pcs} Pc${pcs > 1 ? "s" : ""}`;
  } else if (fullBoxes > 0) {
    return `${fullBoxes} Box${fullBoxes > 1 ? "es" : ""}`;
  } else if (pcs > 0) {
    return `${pcs} Pc${pcs > 1 ? "s" : ""}`;
  }
  return `${numBoxes} Box`;
}

/**
 * Calculate boxes and remaining pieces from piece count
 */
export function calculateFromPcs(
  pcsCount: number,
  pcsPerBox: number,
  sqftPerBox: number
) {
  if (!pcsCount || !pcsPerBox || pcsPerBox <= 0) {
    return {
      totalBoxes: 0,
      fullBoxes: 0,
      remainingPcs: 0,
      totalSqft: 0,
      formattedText: "0 Box",
    };
  }

  const fullBoxes = Math.floor(pcsCount / pcsPerBox);
  const remainingPcs = pcsCount % pcsPerBox;
  const totalBoxes = parseFloat((pcsCount / pcsPerBox).toFixed(4));
  const totalSqft = parseFloat(((pcsCount / pcsPerBox) * sqftPerBox).toFixed(2));

  return {
    totalBoxes,
    fullBoxes,
    remainingPcs,
    totalSqft,
    formattedText: formatBoxAndPcs(totalBoxes, pcsPerBox),
  };
}

