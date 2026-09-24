export const tokens = {
  color: {
    brand: {
      primary: "var(--mws-color-brand-primary)",
      gold: "var(--mws-color-brand-gold)",
      rose: "var(--mws-color-brand-rose)",
      sage: "var(--mws-color-brand-sage)",
      navy: "var(--mws-color-brand-navy)",
      sky: "var(--mws-color-brand-sky)",
    },
    surface: {
      base: "var(--mws-color-surface-base)",
      card: "var(--mws-color-surface-card)",
      elevated: "var(--mws-color-surface-elevated)",
      sunken: "var(--mws-color-surface-sunken)",
    },
    text: {
      primary: "var(--mws-color-text-primary)",
      secondary: "var(--mws-color-text-secondary)",
      tertiary: "var(--mws-color-text-tertiary)",
      inverse: "var(--mws-color-text-inverse)",
      link: "var(--mws-color-text-link)",
    },
    status: {
      info: "var(--mws-color-status-info-text)",
      success: "var(--mws-color-status-success-text)",
      warning: "var(--mws-color-status-warning-text)",
      error: "var(--mws-color-status-error-text)",
    },
  },
} as const;

export type Tokens = typeof tokens;

/** Opt in on html with data-space; data-theme on the same element defaults to light. */
export const spaceThemes = {
  learn: {
    name: "Learnspace",
    domain: "academic",
    identity: { name: "Burgundy", color: "#7E1518" },
    accent: { name: "Gold", color: "#D6A13A" },
    light: { primary: "#7E1518", hover: "#681114", soft: "#F5E7E8", softer: "#EED6D8", text: "#FFFFFF" },
    dark: { primary: "#FFB2B6", hover: "#FFD1D3", soft: "#351719", softer: "#442023", text: "#241718" },
  },
  shield: {
    name: "SHIELDSpace",
    domain: "operations/facilities",
    identity: { name: "Sky", color: "#B8DDF8" },
    accent: { name: "Navy", color: "#1F2A44" },
    light: { primary: "#25638E", hover: "#1E4F72", soft: "#EFF8FE", softer: "#DDEEF9", text: "#FFFFFF" },
    dark: { primary: "#9FD1F4", hover: "#D4ECFF", soft: "#142536", softer: "#1C3349", text: "#241718" },
  },
  safe: {
    name: "SAFESpace",
    domain: "finance",
    identity: { name: "Sage", color: "#6F8B6A" },
    accent: { name: "Gold", color: "#D6A13A" },
    light: { primary: "#486142", hover: "#3A4E35", soft: "#EDF3EB", softer: "#DDE8D9", text: "#FFFFFF" },
    dark: { primary: "#A8C4A0", hover: "#D6EBD0", soft: "#1F2B20", softer: "#2B3B2C", text: "#241718" },
  },
  care: {
    name: "CARESpace",
    domain: "HR",
    identity: { name: "Navy", color: "#1F2A44" },
    accent: { name: "Rose", color: "#B94A4E" },
    light: { primary: "#1F2A44", hover: "#192236", soft: "#E9EDF6", softer: "#D8E0F0", text: "#FFFFFF" },
    dark: { primary: "#B9C7EE", hover: "#CED8F3", soft: "#182136", softer: "#24314D", text: "#241718" },
  },
} as const satisfies Record<string, {
  name: string;
  domain: string;
  identity: { name: string; color: string };
  accent: { name: string; color: string };
  light: { primary: string; hover: string; soft: string; softer: string; text: string };
  dark: { primary: string; hover: string; soft: string; softer: string; text: string };
}>;

export type Space = keyof typeof spaceThemes;
