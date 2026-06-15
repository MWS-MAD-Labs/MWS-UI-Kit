# Semver Policy

MWS UI Kit follows Semantic Versioning once package releases begin.

## Patch releases

Patch releases are backwards-compatible fixes, including:

- Bug fixes in component behavior, accessibility, styling, or token output.
- Documentation corrections.
- Internal refactors that do not change public exports, prop contracts, generated markup expectations, or token names.

## Minor releases

Minor releases are backwards-compatible additions, including:

- New components, hooks, utilities, or design tokens.
- New optional props or component variants.
- Accessibility improvements that preserve existing supported interactions.
- Additive public API exports from `src/index.ts`.

## Major releases

Major releases contain breaking changes, including:

- Removing or renaming public exports, props, variants, token names, CSS variables, or package entrypoints.
- Changing default component behavior in a way consumers must adapt to.
- Tightening peer dependency ranges in a way that drops a previously supported React/runtime version.
- Markup or accessibility contract changes that may break consumer tests, styling overrides, or integrations.

## Changeset requirements

Every user-facing change must include a changeset with the intended bump type and concise migration notes when behavior changes. Internal-only changes may use an empty changeset only when they do not affect package consumers.
