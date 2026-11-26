# Release and deployment runbook

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

Use Node.js 24 to match CI. Run these checks before merging:

```bash
npm ci
npm run typecheck
npm run test
npm run build
npm run storybook:build
npm run build:homepage
```

Review the generated changeset for:

- Correct bump type.
- Clear consumer-facing summary.
- Migration notes when behavior changes.
- No private implementation details or secrets.

## Prepare a release

Merge feature PRs into `main` with their changesets intact. On that push, the [Release workflow](../.github/workflows/release.yml) uses Changesets to open or update a version PR. Use `npm run changeset:status` locally to inspect the proposed version without consuming changesets. `npm run version-packages` is the command the version PR uses; keep its generated changes in that PR.

On the version PR, review the generated `package.json` and `package-lock.json` versions, the `CHANGELOG.md` entries and the package contents (`npm pack --dry-run`). Check that the tarball includes both JavaScript entry points, TypeScript declarations and the stylesheet exported as `mws-ui-kit/style.css`. Merge once CI and package checks pass.

## Publish

When the version PR merges, the Release workflow publishes through npm Trusted Publishing (OIDC). The `mws-ui-kit` package must authorize this publisher on npmjs.com:

- Provider: GitHub Actions
- Organization: `MWS-MAD-Labs`
- Repository: `MWS-UI-Kit`
- Workflow filename: `release.yml`
- Allowed action: direct `npm publish`

The workflow uses a GitHub-hosted runner, Node 24, and `id-token: write`. For a manual authenticated publish outside CI:

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

## Homepage deployment

The [deploy workflow](../.github/workflows/deploy.yml) runs independently of npm publishing on every push to `main` or on manual dispatch. It builds the homepage into an Nginx image, pushes `ghcr.io/mws-mad-labs/mws-ui-kit:latest` and a tag matching the full Git commit SHA, then calls the Komodo redeploy webhook. The feature merge can go live before the package appears on npm. The version PR merge also triggers a deployment.

1. Before merging the feature, record the SHA or image digest currently serving production. Check that the Komodo stack can pull from GHCR and that `KOMODO_WEBHOOK_URL` and `KOMODO_WEBHOOK_SECRET` are configured in GitHub Actions. Verify the deployment host still has the `./brand-assets` mount specified in [`compose.yaml`](../compose.yaml).
2. After merging, check that **Build and publish Docker image** and **Trigger Komodo redeploy** succeeded. In Komodo, confirm the stack is healthy and running the expected image digest. The stack exposes port `18080`; verify through the public homepage as well as the container health check.
3. Open `/#spaces` in a fresh browser profile with the OS set to dark. Check that the gallery loads in light mode and shows all eight Spaces, that switching to dark changes the gallery and survives reload, and that brand artwork and built assets load.

### Rollback

- **Homepage:** Pin the Komodo service image to the last known-good full commit-SHA tag or digest, redeploy, and repeat the homepage and asset smoke checks. Keep the pin in place until a corrected image is verified; then restore normal `:latest` tracking. Rerunning the deploy workflow on the bad commit would rebuild the same code.
- **npm:** Have affected consumers pin `mws-ui-kit@0.3.0` while a fix is validated. If `0.4.0` is already published, use a follow-up Changeset to ship a new version; do not reuse `0.4.0`.

## v0.4.0 rollout checklist

- [ ] Confirm `npm run changeset:status` proposes `0.3.0 → 0.4.0` (minor). The release adds `compass`, `rise`, `bridge` and `mad-labs` and documents the homepage's light-mode default. Existing apps retain their theme unless they opt in.
- [ ] Run pre-merge checks and preview the gallery locally. If Docker is available, build with `npm run docker:build` and smoke-test the resulting `mws-ui-kit:latest` image locally. `docker compose up` uses the GHCR image instead of the local candidate.
- [ ] Merge the feature PR. Verify the homepage deployment and smoke tests above; then review and merge the generated version PR.
- [ ] Verify `npm view mws-ui-kit@0.4.0 version` returns `0.4.0` and `npm view mws-ui-kit dist-tags.latest` returns `0.4.0`. Install `mws-ui-kit@0.4.0` in a test app, import `spaceThemes` and `mws-ui-kit/style.css`, and verify the four new Space IDs work in light and dark modes.
- [ ] Confirm Komodo is healthy after the version PR deploy and share the updated [Space setup guide](SPACE_THEMES.md) with consuming teams.

## Release checklist

- [ ] Every user-facing PR includes a changeset.
- [ ] Bump type matches the semver policy.
- [ ] `npm run build` passes.
- [ ] `npm run test` passes.
- [ ] Changelog text is understandable to a new consumer.
- [ ] Migration notes are present for breaking changes.
- [ ] Published package includes JavaScript, types, and stylesheet output.
- [ ] npm Trusted Publisher matches `MWS-MAD-Labs/MWS-UI-Kit` and `release.yml` exactly.
