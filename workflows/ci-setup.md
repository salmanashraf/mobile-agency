# Workflow — CI Setup

**Type:** DevOps / Automation
**Agents Used:** PIPELINE
**Skills Used:** /release-prep

---

## When to Use

Setting up CI/CD for a new project, or fixing a broken pipeline from scratch.

---

## Steps

```
1. AUDIT (if existing CI)
   ↓ Paste current CI config to PIPELINE for audit.
   ↓ Identify: what's missing, what's slow, what's broken.

2. GENERATE — PIPELINE
   ↓ Provide project context:
     PLATFORM: Android | iOS | Flutter | React Native
     CI_TOOL: GitHub Actions | Bitrise | Fastlane
     DEPLOY_TARGET: Firebase App Distribution | TestFlight | Play Store | App Store
     BRANCH_STRATEGY: trunk | gitflow
   ↓ PIPELINE generates complete, copy-paste-ready config files.

3. CONFIGURE SECRETS
   ↓ Follow the "Secrets to Configure" section from PIPELINE output.
   ↓ Add keystore/certificates, Firebase token, store credentials to CI secrets.

4. TEST THE PIPELINE
   ↓ Open a test PR → verify pr-check workflow runs and passes.
   ↓ Merge to main → verify deploy workflow runs and uploads artifact.

5. ADD REPORTING
   ↓ Test results uploaded as CI artifacts.
   ↓ Lint results uploaded as CI artifacts.
   ↓ Slack/Teams notification on failure (optional).

6. DOCUMENT
   ↓ Add CI setup notes to README or docs/ci-setup.md.
   ↓ Document how to add a new deployment target.
```

---

## Pipeline Architecture Target

```
On PR:
  └── Lint + unit tests → fast feedback (< 5 min target)

On merge to main:
  └── Full build + integration tests + deploy to internal track

On tag (vX.Y.Z):
  └── Release build → sign → upload to store
```

---

## Inputs

- Platform and CI tool preference
- Deployment targets (Firebase / TestFlight / stores)
- Signing credentials (or intent to set up)

---

## Outputs

- Complete `.github/workflows/` or `Bitrise.yml` or `Fastfile`
- Secrets configuration checklist
- Running pipeline on first PR
