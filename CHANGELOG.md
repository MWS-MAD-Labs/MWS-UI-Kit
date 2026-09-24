# Changelog

## 0.2.1

### Patch Changes

- 4c7d5c9: - Fix MwsLogo to derive height from a single dimension so logo aspect ratios no longer distort
  - Add stronger gold foreground tokens and utilities (for example `text-brand-gold-strong`) so gold text and icons on soft gold backgrounds meet WCAG AA contrast
  - Correct focus-ring color to a stronger gold for visible indicator contrast
  - Replace hardcoded sample metrics on the homepage with clearly labeled sample data
  - Remove the homepage implementation plan section

## 0.2.0

### Minor Changes

- b1cad31: Add a public API barrel, release governance, ref-forwarding Button/Input primitives, Modal focus trapping, shared backdrop class tokens, a packaged stylesheet export, and consumer-focused documentation.

All notable changes to MWS UI Kit will be documented in this file.

This project follows [Semantic Versioning](https://semver.org/) and is governed by Changesets. See `docs/semver-policy.md` for what counts as a major, minor, or patch change in this UI kit.

## 0.1.0

### Added

- Initial MWS UI Kit foundation with design tokens, accessible React primitives, app shell patterns, school workflows, AI workflow guidance, and demo documentation.
- Public API barrel at `src/index.ts` for library consumers.
- Release governance through Changesets and a documented semver policy.
