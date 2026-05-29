# React Native Skills

Reusable skill prompt modules for React Native (TypeScript) performance reviews and bridge audits.

## Index

| Skill | File | When to Use |
|---|---|---|
| RN Performance | [performance.md](performance.md) | Re-render prevention, `useCallback`/`useMemo`, FlatList config, animation thread |
| Bridge Audit | [bridge-audit.md](bridge-audit.md) | Old Architecture bridge call overhead, synchronous native calls, JSI migration candidates |

## Usage

```
# Quick performance triage
[paste skill prompt from performance.md]

Review this component for performance issues: [paste component]
```

## Composable Pattern

```
# Full performance + bridge audit
[paste performance.md skill]
[paste bridge-audit.md skill]

Audit this screen: [paste code]
```

## Composable With

- [`agents/react-native/performance-optimizer`](../../agents/react-native/performance-optimizer/) — full structured performance audit

## Contributing

Ideas for new skills:
- `typescript-patterns.md` — TypeScript anti-patterns in RN codebases
- `navigation-patterns.md` — React Navigation v7 type-safety and deep linking
- `testing-patterns.md` — Jest, React Native Testing Library, Detox patterns

Copy `templates/skill-template.md`.
