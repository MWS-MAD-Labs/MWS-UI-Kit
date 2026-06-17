# Semver Policy

MWS UI Kit follows [Semantic Versioning](https://semver.org/) for package releases.

Version numbers use `MAJOR.MINOR.PATCH`:

- `PATCH` for backwards-compatible fixes.
- `MINOR` for backwards-compatible additions.
- `MAJOR` for breaking changes.

## Patch releases

Patch releases are backwards-compatible fixes, including:

- Bug fixes in component behavior, accessibility, styling, or token output.
- Documentation corrections and examples that do not describe a new public API.
- Internal refactors that do not change public exports, prop contracts, generated markup expectations, package output, package entrypoints, or token names.
- Dependency updates that do not change consumer installation requirements or runtime compatibility.

## Minor releases

Minor releases are backwards-compatible additions, including:

- New components, hooks, utilities, or design tokens.
- New optional props or component variants.
- New package subpath exports, such as a stylesheet entrypoint.
- Accessibility improvements that preserve existing supported interactions.
- Additive public API exports from `src/index.ts`.
- Expanded peer dependency support, for example adding support for a newer React version while keeping existing supported versions.

## Major releases

Major releases contain breaking changes, including:

- Removing or renaming public exports, props, variants, token names, CSS variables, or package entrypoints.
- Changing default component behavior in a way consumers must adapt to.
- Tightening peer dependency ranges in a way that drops a previously supported React/runtime version.
- Changing generated markup, roles, focus behavior, or accessibility contracts in a way that may break consumer tests, styling overrides, or integrations.
- Removing shipped CSS utilities or changing token meanings in a way that alters consumer UI unexpectedly.

## Public API surface

Treat these as public once released:

- Package entrypoints declared in `package.json` `exports`.
- Exports from `src/index.ts` and generated type declarations.
- Component prop types and supported prop values.
- CSS custom properties prefixed with `--mws-`.
- Documented keyboard and accessibility behavior.
- Documented class-dependent behavior required by shipped components.

## Changeset requirements

Every user-facing change must include a changeset with the intended bump type and concise migration notes when behavior changes. Internal-only changes may skip a changeset only when they do not affect package consumers.

When in doubt, add a patch changeset with a clear note. It is better to over-communicate consumer-visible changes than to ship silent behavior changes.
