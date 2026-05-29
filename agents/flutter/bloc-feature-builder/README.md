# Flutter BLoC Feature Builder Agent

> Describe a feature. Get a complete Flutter BLoC implementation — Cubit or BLoC, Repository, Dio integration, Clean Architecture, and all the boilerplate — in one shot.

---

## What This Agent Does

Takes a plain-English feature description and generates a fully wired Flutter feature following Clean Architecture and the BLoC pattern:

- `Cubit` or `BLoC` with typed `State` and `Event` classes
- Repository interface (domain) and implementation (data)
- `Dio` HTTP client integration with error handling
- `Equatable`-based state classes for efficient rebuilds
- `BlocProvider` + `BlocBuilder` / `BlocListener` wiring
- Domain `UseCase` (or direct repository call for simpler features)
- Error handling with sealed `Failure` types
- Unit test stubs for the Cubit/BLoC and repository

---

## When to Use

- Scaffolding a new feature from scratch
- Learning how Clean Architecture + BLoC fit together
- Generating the boilerplate layer so you can focus on business logic
- Producing a consistent pattern across a team

---

## Files

| File | Purpose |
|---|---|
| [`agent.md`](agent.md) | Input format, output format, full system prompt |
| [`example-input.md`](example-input.md) | Real feature description ready to paste |
| [`example-output.md`](example-output.md) | Full generated implementation |

---

## Quick Start

```
# In your Claude Code / ChatGPT / Cursor session:
1. Apply the system prompt from agent.md
2. Describe your feature using the input format below
3. Get complete Dart code for all layers
```

---

## Input Format

```
FEATURE_NAME: <PascalCase, e.g. ProductCatalog>
PATTERN: <cubit | bloc>
DESCRIPTION: <plain-English description of what the feature does>
API_ENDPOINT: <HTTP method + URL pattern, e.g. GET /v1/products?category={category}&page={page}>
REQUEST_PARAMS: <list of query/body params>
RESPONSE_FIELDS: <list of JSON response fields with types>
ACTIONS: <list of user actions that trigger state changes>
FLUTTER_VERSION: <e.g. 3.27>
DART_VERSION: <e.g. 3.6>
```

---

## Generated Layer Map

```
lib/features/<feature_name>/
├── domain/
│   ├── entities/
│   │   └── <FeatureName>.dart
│   ├── repositories/
│   │   └── <FeatureName>Repository.dart      ← interface
│   └── usecases/
│       └── Get<FeatureName>UseCase.dart
├── data/
│   ├── models/
│   │   └── <FeatureName>Model.dart           ← JSON serializable
│   ├── datasources/
│   │   └── <FeatureName>RemoteDataSource.dart ← Dio
│   └── repositories/
│       └── <FeatureName>RepositoryImpl.dart
└── presentation/
    ├── cubit/ (or bloc/)
    │   ├── <FeatureName>Cubit.dart (or Bloc)
    │   └── <FeatureName>State.dart (+ Event.dart for BLoC)
    ├── pages/
    │   └── <FeatureName>Page.dart
    └── widgets/
        └── <feature_specific_widgets>.dart
```

---

## Related Agents

- [`agents/flutter/widget-generator`](../widget-generator/) — generate individual widgets for the UI layer
- [`agents/android/android-crash-analyzer`](../../android/android-crash-analyzer/) — debug crashes in the generated feature
