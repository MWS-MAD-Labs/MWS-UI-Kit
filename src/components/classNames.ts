export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const headerBackdropClassName =
  "bg-[color-mix(in_srgb,var(--mws-color-surface-base)_90%,transparent)] backdrop-blur-xl";

export const overlayBackdropClassName = "bg-[rgb(36_23_24/0.45)]";
