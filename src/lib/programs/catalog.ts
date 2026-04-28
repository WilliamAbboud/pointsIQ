/**
 * Catalog of supported loyalty programs with hardcoded valuation in cents per point.
 * These are MVP estimates and should be reviewed quarterly.
 */

export type ProgramCategory = "credit_card" | "airline" | "hotel";

export interface ProgramDefinition {
  /** Stable slug used as the foreign key in the database. */
  code: string;
  /** Display name. */
  name: string;
  category: ProgramCategory;
  /** Cents per point (cpp). 2.0 means each point is worth 2 cents. */
  cpp: number;
  /** Initials shown on the colored tile. */
  initials: string;
  /** Background color for the tile. */
  tileColor: string;
  /** Transfer partners shown when card is expanded. */
  partners?: string[];
}

export const PROGRAMS: ProgramDefinition[] = [
  // Credit cards
  {
    code: "amex_mr",
    name: "Amex Membership Rewards",
    category: "credit_card",
    cpp: 2.0,
    initials: "AX",
    tileColor: "#006fcf",
    partners: [
      "Delta",
      "British Airways",
      "Air France",
      "Hilton",
      "Marriott",
    ],
  },
  {
    code: "chase_ur",
    name: "Chase Ultimate Rewards",
    category: "credit_card",
    cpp: 1.9,
    initials: "CH",
    tileColor: "#117ACA",
    partners: [
      "United",
      "Southwest",
      "Hyatt",
      "IHG",
      "Air Canada",
    ],
  },

  // Airlines
  {
    code: "delta_skymiles",
    name: "Delta SkyMiles",
    category: "airline",
    cpp: 1.2,
    initials: "DL",
    tileColor: "#003366",
  },
  {
    code: "united_mileageplus",
    name: "United MileagePlus",
    category: "airline",
    cpp: 1.4,
    initials: "UA",
    tileColor: "#002244",
  },

  // Hotels
  {
    code: "marriott_bonvoy",
    name: "Marriott Bonvoy",
    category: "hotel",
    cpp: 0.8,
    initials: "MB",
    tileColor: "#9c2429",
  },
  {
    code: "hilton_honors",
    name: "Hilton Honors",
    category: "hotel",
    cpp: 0.6,
    initials: "HH",
    tileColor: "#0d4071",
  },
];

export function getProgramByCode(code: string): ProgramDefinition | undefined {
  return PROGRAMS.find((p) => p.code === code);
}

export const CATEGORY_LABEL: Record<ProgramCategory, string> = {
  credit_card: "Credit cards",
  airline: "Airlines",
  hotel: "Hotels",
};

export const CATEGORY_COLOR: Record<ProgramCategory, string> = {
  credit_card: "var(--cat-cards)",
  airline: "var(--cat-airlines)",
  hotel: "var(--cat-hotels)",
};
