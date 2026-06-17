# Changesets Release Workflow

MWS UI Kit uses Changesets to describe user-facing changes, choose semantic version bumps, update package versions, maintain changelog entries, and publish to npm.

## When to add a changeset

Add a changeset for every user-facing change, including:

- Public component API changes.
- New components, props, variants, hooks, utilities, or tokens.
- Bug fixes that affect component behavior, styling, accessibility, or package output.
- Documentation changes that should appear in release notes.
- Package entrypoint or dependency changes.

Internal-only maintenance can skip a changeset only when it does not affect consumers.

## Create a changeset

Run:

```bash
npm run changeset
```

Then:

1. Select `mws-ui-kit`.
2. Choose the bump type:
   - `patch` for backwards-compatible fixes or documentation corrections.
   - `minor` for backwards-compatible additions.
   - `major` for breaking changes.
3. Write a concise summary in consumer language.
4. Commit the generated file in `.changeset/` with your change.

Example changeset:

```md
---
"mws-ui-kit": minor
---

Add a packaged stylesheet export so consumers can import `mws-ui-kit/style.css`.
```

## Before merging a change

Run local validation when possible:

```bash
npm run build
npm run test
```

Review the generated changeset for:

- Correct bump type.
- Clear consumer-facing summary.
- Migration notes when behavior changes.
- No private implementation details or secrets.

## Prepare a release

After changes are merged to the release branch, create the release version update:

```bash
npm run version-packages
```

This consumes pending `.changeset/*.md` files and updates package versions/changelogs.

Then validate the release output:

```bash
npm run build
npm run test
```

Review:

- `package.json` version.
- `CHANGELOG.md` entries.
- Generated `dist/` output.
- Public package exports, including `mws-ui-kit/style.css`.

## Publish

After the version changes are merged and npm credentials are configured:

```bash
npm run release
```

The package is configured for public access in `.changeset/config.json`:

```json
{
  "access": "public",
  "baseBranch": "main"
}
```

## Semver policy

Use [`semver-policy.md`](semver-policy.md) as the authoritative source for patch, minor, and major release decisions.

## Release checklist

- [ ] Every user-facing PR includes a changeset.
- [ ] Bump type matches the semver policy.
- [ ] `npm run build` passes.
- [ ] `npm run test` passes.
- [ ] Changelog text is understandable to a new consumer.
- [ ] Migration notes are present for breaking changes.
- [ ] Published package includes JavaScript, types, and stylesheet output.
