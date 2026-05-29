# Mobile Security Scanner Agent

> Paste mobile source code. Get an OWASP Mobile Top 10 vulnerability report with severity, exploitation scenario, and a concrete code fix for each finding.

---

## What This Agent Does

Reviews mobile source code for the most exploitable security vulnerabilities and returns a ranked findings report:

- **M2 Insecure Data Storage** — tokens in `SharedPreferences`/`UserDefaults`, unencrypted databases
- **M3 Insecure Communication** — `http://` URLs, disabled TLS validation, missing certificate pinning
- **M5 Insufficient Cryptography** — MD5/SHA-1 for security, ECB mode AES, hardcoded IVs
- **M9 Reverse Engineering** — hardcoded API keys, secrets, tokens in source code
- **M1 Improper Platform Usage** — WebView with JS + native bridge loading untrusted URLs, excessive permissions
- **M10 Extraneous Functionality** — debug endpoints, commented-out auth bypasses

Every finding includes: OWASP category, severity (CRITICAL/HIGH/MEDIUM/LOW), a concrete exploitation scenario, and corrected code.

---

## Files

| File | Purpose |
|---|---|
| [`agent.md`](agent.md) | Input format, output format, full system prompt |
| [`example-input.md`](example-input.md) | Android API client with hardcoded key and HTTP URL |
| [`example-output.md`](example-output.md) | Full OWASP findings report |

---

## Quick Start

```
PLATFORM: <Android | iOS | Flutter | React Native>
FILE_PATH: <relative path>
SECURITY_FOCUS: <all | secrets | storage | network | deeplinks | webview | permissions | crypto>
CODE:
[paste source file]
MANIFEST: [optional — paste AndroidManifest.xml or Info.plist]
```

---

## When to Use

| Situation | Use This Agent |
|---|---|
| Pre-release security review | Yes — run on auth, network, and storage files |
| Before adding a new API integration | Yes — check the client for hardcoded secrets |
| After a dependency update | Yes — check for newly introduced insecure patterns |
| Pentest or bug bounty prep | Yes — identify low-hanging fruit first |

> **Note:** This agent scans source code only. For runtime vulnerabilities and binary analysis, use dedicated tools (MobSF, Frida, Burp Suite).

---

## Related Agents

- [`agents/cross-platform/accessibility-auditor`](../accessibility-auditor/) — pair for a complete pre-release audit
- `skills/shared/security-scan.md` — quick inline security checklist
