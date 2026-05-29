# Agent Guide

How agents in this repository are structured, why they are structured that way, and how to get the most out of them.

---

## What Is an Agent?

In this repo, an **agent** is a self-contained Markdown file that specifies:

1. A **system prompt** — the LLM instructions
2. An **input format** — the exact schema the developer fills in
3. An **output format** — the exact schema the LLM must produce
4. A **worked example** — real input → real output, tested

Agents are LLM-agnostic. They work with Claude, GPT-4, Gemini, and any instruction-following model. The quality of output scales with the quality of the model.

---

## Why Structured Input/Output?

Unstructured prompts produce inconsistent output. A structured input format means:
- The developer knows exactly what to provide
- The LLM has all the context it needs
- The output is predictable and parseable

Structured output means:
- You can pipe output into scripts
- You can track issues in a spreadsheet
- You can compare reviews across multiple files consistently

---

## Agent Anatomy

```
## Purpose         — one sentence, answers "what does this do?"
## Input Format    — the schema with field descriptions
## Output Format   — the exact output template
## System Prompt   — the LLM instructions (paste this into your session)
## Example         — a real, tested input/output pair
## Notes           — limitations and compatibility
```

Every section is required. Agents with empty or placeholder sections are rejected in review.

---

## Input Format Conventions

- Field names are UPPER_SNAKE_CASE
- Multi-line content fields (CODE, CRASH_LOG, GIT_LOG) always go last
- Boolean fields use `true | false`
- Enum fields show all valid values separated by `|`
- Optional fields are marked in the Fields table

---

## Output Format Conventions

- Section headings use `===` (level 1) or `---` (level 2)
- Verdict/summary lines are capitalized: `OVERALL VERDICT: PASS`
- Findings use `[CRITICAL]`, `[WARNING]`, `[INFO]` prefixes
- Line references: `Line N` (not `line N` or `L.N`)
- Code snippets in output use triple backtick blocks

---

## Severity Levels

| Level | When to Use |
|---|---|
| CRITICAL | Bug, crash, data loss, security issue, or performance problem that will affect users |
| WARNING | Bad practice, technical debt, anti-pattern, or scalability issue |
| INFO | Style, minor improvement, or optional suggestion |

---

## Choosing Between Agent, Skill, and Prompt

| Use | When... |
|---|---|
| **Agent** | You want a full structured analysis with typed fields, a complete output format, and a verdict |
| **Skill** | You want to add a focused capability to a session without the full agent structure |
| **Prompt** | You want a quick, one-shot result for a narrow task with minimal setup |

---

## Running Multiple Agents on the Same File

To review a file from multiple angles:

1. Run Agent 01 (Android Code Reviewer) for quality issues
2. Run Agent 05 (RN Performance Optimizer) equivalent for perf — or combine:
3. Prepend multiple skill prompts before a single session

Or use Claude Code's multi-turn sessions: apply one agent, fix the issues, then apply the next.

---

## Automation

Agents can be run programmatically using the Anthropic API:

```python
import anthropic

client = anthropic.Anthropic()

system_prompt = open("agents/android/code-reviewer/agent.md").read()
# Extract just the ## System Prompt section

user_input = f"""
PLATFORM: Android
KOTLIN_VERSION: 2.0
COMPOSE_VERSION: none
FILE_PATH: {file_path}
CODE:
{code_content}
"""

message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=4096,
    system=system_prompt,
    messages=[{"role": "user", "content": user_input}]
)

print(message.content[0].text)
```

---

## Contributing a New Agent

See [CONTRIBUTING.md](../CONTRIBUTING.md) and use [templates/agent-template.md](../templates/agent-template.md).

The most common rejection reason: the example output is placeholder text, not a real tested result. Always test your agent on your example input before submitting.
