# Contributing to Mobile Dev Skill Agents

Thank you for wanting to make this toolkit better. This guide covers everything you need to submit a high-quality contribution.

---

## Table of Contents

- [Types of Contributions](#types-of-contributions)
- [Before You Start](#before-you-start)
- [Adding a New Agent](#adding-a-new-agent)
- [Adding a New Skill](#adding-a-new-skill)
- [Adding Prompts](#adding-prompts)
- [Adding Examples](#adding-examples)
- [Pull Request Process](#pull-request-process)
- [Quality Bar](#quality-bar)
- [Code of Conduct](#code-of-conduct)

---

## Types of Contributions

| Type | Welcome? | Notes |
|---|---|---|
| New agent | Yes | Must follow the agent template |
| New skill | Yes | Must follow the skill template |
| New prompts | Yes | Group by platform |
| Bug fix in existing agent | Yes | Describe the problem clearly |
| Example code | Yes | Must be minimal and self-contained |
| Documentation | Yes | Fix typos, add clarity |
| Refactor/restructure | Discuss first | Open an issue before touching structure |

---

## Before You Start

1. **Search existing issues and PRs** — your idea may already be in progress.
2. **Open an issue first** for any new agent or significant change. Use the [New Agent template](.github/ISSUE_TEMPLATE/new_agent.md).
3. **Keep scope small** — one agent or one skill per PR. Bundled PRs are hard to review.

---

## Adding a New Agent

### Step 1 — Pick a Platform Directory

```
agents/android/
agents/ios/
agents/flutter/
agents/react-native/
agents/unity/
agents/unreal/
agents/cross-platform/
```

### Step 2 — Create a Folder

Use kebab-case. Be specific:

```
agents/android/memory-leak-detector/   # Good
agents/android/helper/                 # Too vague
```

### Step 3 — Create `agent.md`

Copy [templates/agent-template.md](templates/agent-template.md) and fill in every section. Empty sections are grounds for rejection.

Required sections:

- `## Purpose` — one sentence
- `## Input Format` — exact schema with field descriptions
- `## Output Format` — exact schema with field descriptions
- `## System Prompt` — the full prompt to paste into an LLM
- `## Example` — a real, runnable input/output pair
- `## Notes` — edge cases, limitations, version requirements

### Step 4 — Add an Example File

Add a matching code file in `examples/<platform>/` that the agent can operate on.

---

## Adding a New Skill

A **skill** is a reusable prompt module — shorter than a full agent and composable with others.

1. Pick the right platform directory under `skills/`
2. Copy [templates/skill-template.md](templates/skill-template.md)
3. Fill in: purpose, when to use, the skill prompt, and one example

---

## Adding Prompts

Prompts live in `prompts/<platform>/`. Each file should:

- Be a standalone `.md` file with a descriptive filename
- Start with a one-line description comment
- Include the raw prompt text and one example of expected output

---

## Adding Examples

Example files live in `examples/<platform>/`. Rules:

- Must compile or be syntactically valid
- Must be self-contained (no external dependencies not explained)
- Must have intentional issues or characteristics the paired agent can find
- Include a header comment pointing to the paired agent

---

## Pull Request Process

1. Fork the repo and create a branch: `feat/android-memory-leak-agent`
2. Make your changes following the templates
3. Update the README agent table if you added a new agent
4. Submit the PR using the [PR template](.github/PULL_REQUEST_TEMPLATE.md)
5. A maintainer will review within 5 business days

**PR checklist:**
- [ ] Followed the correct template
- [ ] All sections in `agent.md` are filled in
- [ ] Example input/output is real (not placeholder text)
- [ ] No sensitive data (API keys, real crash logs from production, PII)
- [ ] README table updated (for new agents)

---

## Quality Bar

Agents are rejected if they:

- Have placeholder examples (`<YOUR CODE HERE>` with no explanation)
- Duplicate an existing agent without meaningfully improving it
- Lack an output format definition
- Produce output that requires significant human cleanup to be useful

Agents are accepted if they:

- Solve a problem that actually slows developers down
- Have a concrete, testable example
- Produce structured, parseable output
- Work across common versions of the target platform

---

## Code of Conduct

By contributing, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md). Be kind, be specific, be constructive.
