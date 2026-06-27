# Release Process

Mobile Agency npm releases are published by GitHub Actions from git tags.

Do not run `npm publish` manually. Manual publishing can race with the tag workflow and cause npm to reject the workflow with:

```text
403 Forbidden - You cannot publish over the previously published versions
```

---

## Release Steps

1. Update `package.json`:

```json
{
  "version": "1.0.16"
}
```

2. Run local checks:

```bash
git diff --check
node --check cli/index.js
bash -n install.sh
node cli/index.js list
npm pack --dry-run
```

3. Commit the version bump:

```bash
git add package.json
git commit -m "Release v1.0.16"
```

If the release also changes docs, CLI, agents, skills, or workflows, include those files in the same release commit.

4. Create the tag locally:

```bash
git tag v1.0.16
```

5. Push the branch and tag:

```bash
git push origin main
git push origin v1.0.16
```

6. Let GitHub Actions publish npm.

The workflow is `.github/workflows/publish.yml`. It runs on tags matching `v*`, verifies the tag version matches `package.json`, checks whether the version already exists on npm, and publishes only when the version is new.

---

## Verification

After the workflow finishes:

```bash
npm view mobile-agency version dist-tags.latest
npm view mobile-agency@1.0.16 version dist.tarball dist.shasum
git ls-remote origin refs/heads/main refs/tags/v1.0.16
```

Expected:

- npm latest equals the released version.
- GitHub `main` points to the release commit.
- GitHub tag `v1.0.16` points to the same release commit.
- GitHub Actions publish workflow is green.

---

## Important Rules

- Never run `npm publish` manually for normal releases.
- Never push a tag before `package.json` is updated and committed.
- The tag must match the package version exactly: `package.json` `1.0.16` uses tag `v1.0.16`.
- If a workflow is rerun for an already-published version, it should skip publishing instead of failing.
