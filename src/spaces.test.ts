/// <reference types="node" />
import { readFileSync } from "node:fs";
import { parse } from "postcss";
import { describe, expect, it } from "vitest";

import { spaceThemes, type Space } from "./tokens";

const stylesheet = parse(readFileSync("src/styles/global.css", "utf8"));
const spaces = Object.keys(spaceThemes) as Space[];

// Resolve root token declarations, not browser layout. These rules occur in cascade order.
function rootTokens(space?: string, theme?: "light" | "dark", tag = "html") {
  const element = document.createElement(tag);
  if (space) element.dataset.space = space;
  if (theme) element.dataset.theme = theme;
  const values: Record<string, string> = {};
  stylesheet.walkRules((rule) => {
    if (rule.parent?.type !== "root") return;
    const selector = rule.selector.replace(/:root/g, "html");
    if (!element.matches(selector)) return;
    rule.walkDecls(/^--mws-/, (declaration) => {
      values[declaration.prop] = declaration.value;
    });
  });
  function resolve(name: string): string {
    if (!(name in values)) throw new Error(`Missing token: ${name}`);
    return values[name].replace(/var\(\s*(--[\w-]+)\s*\)/g, (_, dependency: string) => resolve(dependency));
  }
  return Object.fromEntries(Object.keys(values).map((name) => [name, resolve(name).toLowerCase()]));
}

function luminance(hex: string) {
  const channels = hex.replace("#", "").match(/../g)!.map((channel) => {
    const value = parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(a: string, b: string) {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}

function color(values: Record<string, string>, name: string) {
  return values[`--mws-color-${name}`];
}

describe("Space themes", () => {
  it("exports the exact identities and deliberate accents", () => {
    expect(spaces).toEqual(["learn", "shield", "safe", "care"]);
    expect(spaces.map((space) => {
      const { name, domain, identity, accent } = spaceThemes[space];
      return [name, domain, identity.name, identity.color, accent.name, accent.color];
    })).toEqual([
      ["Learnspace", "academic", "Burgundy", "#7E1518", "Gold", "#D6A13A"],
      ["SHIELDSpace", "operations/facilities", "Sky", "#B8DDF8", "Navy", "#1F2A44"],
      ["SAFESpace", "finance", "Sage", "#6F8B6A", "Gold", "#D6A13A"],
      ["CARESpace", "HR", "Navy", "#1F2A44", "Rose", "#B94A4E"],
    ]);
  });

  it("keeps no-space burgundy defaults and ignores unknown or nested Spaces", () => {
    expect(rootTokens()).toEqual(rootTokens(undefined, "light"));
    expect(color(rootTokens(), "brand-primary")).toBe("#7e1518");
    expect(color(rootTokens(undefined, "dark"), "brand-primary")).toBe("#ffb2b6");
    for (const theme of ["light", "dark"] as const) {
      expect(rootTokens("unknown", theme)).toEqual(rootTokens(undefined, theme));
      for (const space of spaces) {
        expect(rootTokens(space, theme, "div")).toEqual(rootTokens(undefined, theme, "div"));
      }
    }
  });

  for (const space of spaces) {
    it(`${space} defaults to explicit light`, () => {
      expect(rootTokens(space)).toEqual(rootTokens(space, "light"));
    });

    for (const mode of ["light", "dark"] as const) {
      const metadata = spaceThemes[space];
      const palette = metadata[mode];
      const values = rootTokens(space, mode);
      const get = (name: string) => color(values, name);

      it(`${space}/${mode} matches metadata and rebinds every primary alias`, () => {
        const aliases: Record<string, string> = {
          "space-identity": metadata.identity.color,
          "space-accent": metadata.accent.color,
          "brand-primary": palette.primary,
          "brand-primary-hover": palette.hover,
          "brand-primary-soft": palette.soft,
          "brand-primary-softer": palette.softer,
          "text-brand": palette.primary,
          "text-link": palette.primary,
          "text-link-hover": palette.hover,
          "surface-brand-soft": palette.soft,
          "border-focus": palette.primary,
          "action-primary-background": palette.primary,
          "action-primary-background-hover": palette.hover,
          "action-primary-text": palette.text,
          "action-secondary-background": mode === "dark" ? "transparent" : "#FFFFFF",
          "action-secondary-background-hover": palette.soft,
          "action-secondary-text": palette.primary,
          "action-soft-background": palette.soft,
          "action-soft-background-hover": palette.softer,
          "action-soft-text": mode === "dark" ? palette.hover : palette.primary,
          "action-ghost-background-hover": palette.soft,
          "action-ghost-text": palette.primary,
        };
        for (const [alias, expected] of Object.entries(aliases)) {
          expect(get(alias), alias).toBe(expected.toLowerCase());
        }
        const border = `color-mix(in srgb, ${palette.primary.toLowerCase()} ${mode === "dark" ? 35 : 25}%, transparent)`;
        expect(get("border-brand")).toBe(border);
        expect(get("action-secondary-border")).toBe(border);
        expect(values["--mws-shadow-brand"]).toBe(
          `0 10px 24px color-mix(in srgb, ${palette.primary.toLowerCase()} ${mode === "dark" ? 14 : 20}%, transparent)`,
        );
      });

      it(`${space}/${mode} preserves named brands, statuses, primitives and neutral surfaces`, () => {
        const baseline = rootTokens(undefined, mode);
        for (const [name, value] of Object.entries(baseline)) {
          if (/^--mws-color-(palette-|status-|brand-(gold|rose|sage|navy|sky))/.test(name)
            || /^--mws-(burgundy|gold|rose|sage|navy|sky)/.test(name)
            || /^--mws-color-surface-(base|card|elevated|sunken|info|success|warning|danger|code)/.test(name)) {
            expect(values[name], name).toBe(value);
          }
        }
      });

      it(`${space}/${mode} meets 4.5:1 for actions, links and soft/ghost text`, () => {
        const pairs = [
          ["action-primary-text", "action-primary-background"],
          ["action-primary-text", "action-primary-background-hover"],
          ["action-soft-text", "action-soft-background"],
          ["action-soft-text", "action-soft-background-hover"],
          ["action-secondary-text", "action-secondary-background-hover"],
          ["action-ghost-text", "action-ghost-background-hover"],
        ];
        for (const surface of ["surface-base", "surface-card", "surface-elevated"]) {
          for (const text of ["text-brand", "text-link", "text-link-hover", "action-secondary-text", "action-ghost-text"]) {
            pairs.push([text, surface]);
          }
          expect(contrast(get("border-focus"), get(surface))).toBeGreaterThanOrEqual(3);
        }
        for (const [text, background] of pairs) {
          expect(contrast(get(text), get(background)), `${text} on ${background}`).toBeGreaterThanOrEqual(4.5);
        }
      });
    }
  }
});
