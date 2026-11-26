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
  compass: {
    name: "COMPASSspace",
    domain: "CRM, PR & Admissions",
    identity: { name: "True North Cobalt", color: "#23529E" },
    accent: { name: "Guidance Gold", color: "#D8A13A" },
    light: { primary: "#23529E", hover: "#1C427E", soft: "#E9EEF5", softer: "#D9E4F2", text: "#FFFFFF" },
    dark: { primary: "#9BBDF5", hover: "#C3D8FB", soft: "#172239", softer: "#233451", text: "#241718" },
  },
  rise: {
    name: "RISEspace",
    domain: "SEN & Pelangi Therapy",
    identity: { name: "Pelangi Teal", color: "#4A9E8B" },
    accent: { name: "Compassion Rose", color: "#B94A4E" },
    light: { primary: "#217471", hover: "#1A5D5A", soft: "#E9F1F1", softer: "#E2EEEE", text: "#FFFFFF" },
    dark: { primary: "#8ED8D3", hover: "#B9EAE6", soft: "#162C2D", softer: "#223D3E", text: "#241718" },
  },
  bridge: {
    name: "BRIDGEspace",
    domain: "R&D, Library & Health",
    identity: { name: "Insight Terracotta", color: "#A65332" },
    accent: { name: "Wellness Aqua", color: "#5C9894" },
    light: { primary: "#A65332", hover: "#854226", soft: "#F6EEEA", softer: "#F4ECE7", text: "#FFFFFF" },
    dark: { primary: "#F0A88B", hover: "#FFD0BC", soft: "#3B231B", softer: "#503025", text: "#241718" },
  },
  "mad-labs": {
    name: "MAD Labs",
    domain: "Innovation & Sustainability",
    identity: { name: "Foresight Indigo", color: "#4C439E" },
    accent: { name: "Happiness Gold", color: "#D6A13A" },
    light: { primary: "#4C439E", hover: "#3D367E", soft: "#EDECF5", softer: "#E1DFF0", text: "#FFFFFF" },
    dark: { primary: "#B4AFF7", hover: "#D7D4FF", soft: "#221E39", softer: "#312A4D", text: "#241718" },
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
