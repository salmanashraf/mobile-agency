# Shared / Cross-Platform Skills

Reusable skill prompt modules that apply across Android, iOS, Flutter, and React Native. These are platform-agnostic and can be composed with any agent or used standalone.

## Index

| Skill | File | Platforms | When to Use |
|---|---|---|---|
| Crash Log Analysis | [crash-analysis.md](crash-analysis.md) | Android, iOS | Quick crash triage — identify crash type, first app frame, root cause pattern |
| Accessibility Audit | [accessibility-audit.md](accessibility-audit.md) | All | WCAG 2.2 mobile checklist — labels, touch targets, roles, focus order, announcements |
| Security Scan | [security-scan.md](security-scan.md) | All | OWASP Mobile Top 10 — secrets, insecure storage, WebView, permissions, cryptography |

## Usage

```
# Quick security gate before code review
[paste skill prompt from security-scan.md]

Scan this file for security issues: [paste code]
```

## Composable Pattern — Full Pre-Release Audit

```
# Run all three shared skills in one session for a comprehensive pre-release check
[paste security-scan.md skill]
[paste accessibility-audit.md skill]

Review this screen for both security and accessibility issues: [paste code]
```

## Composable With

- [`agents/cross-platform/security-scanner`](../../agents/cross-platform/security-scanner/) — full OWASP report with exploitability analysis
- [`agents/cross-platform/accessibility-auditor`](../../agents/cross-platform/accessibility-auditor/) — full WCAG report with platform-specific fixes
- [`agents/android/android-crash-analyzer`](../../agents/android/android-crash-analyzer/) — 9-section crash analysis
- [`agents/ios/crash-analyzer`](../../agents/ios/crash-analyzer/) — iOS crash analysis

## Contributing

Ideas for new shared skills:
- `api-contract-review.md` — REST API design patterns, versioning, error response shapes
- `localization-audit.md` — flag hardcoded strings, RTL layout issues, date/number formatting
- `code-documentation.md` — generate KDoc, DocC, or DartDoc comments

Copy `templates/skill-template.md` and open a PR.
