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
