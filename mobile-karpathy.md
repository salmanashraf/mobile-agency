# Mobile Engineer's CLAUDE.md

4 rules that stop AI agents shipping broken mobile apps.

Copy this into your project's CLAUDE.md to apply them automatically.

---

## Rule 1 — Ask the API level before assuming

Never assume minimum SDK, OS version, or API availability.

Before writing any platform API call:
- Android: "What's your minSdkVersion?" (APIs differ wildly between API 21 and 35)
- iOS: "What's your deployment target?" (async/await requires iOS 15+, SwiftUI differs by version)
- Flutter: "What's your Dart SDK constraint?" (null safety, records, sealed classes are version-gated)
- React Native: "Old Architecture or New Architecture?" (bridge vs JSI changes every native call)

**The wrong API on the wrong SDK version crashes silently in production on one device model.**

---

## Rule 2 — Check for existing platform components first

Before generating a custom component, check whether a native or framework equivalent already exists.

- Android: Material3 components (M3Button, TopAppBar, NavigationBar, DatePicker)
- iOS: SF Symbols for icons, SwiftUI built-in sheets, alerts, and pickers
- Flutter: Material3 / Cupertino widgets, provider package for state
- React Native: react-navigation for routing, react-native-paper for Material UI

Building custom when standard exists is always wrong:
1. It takes 10× longer
2. It won't handle accessibility by default
3. It won't handle dark mode / dynamic type automatically
4. You will maintain it forever

**Ask "does this already exist?" before generating any UI component.**

---

## Rule 3 — Never touch what wasn't asked

Mobile codebases are deeply interconnected.

- A ViewModel change can break a Fragment
- A widget rebuild can cascade through the entire tree
- A dependency update can introduce a transitive conflict
- A Gradle change can break the build for every module

**Before touching any file:**
1. State the blast radius: which files/classes could this change affect?
2. Change ONLY the specific function, class, or file that was asked about
3. Do not refactor surrounding code, fix unrelated warnings, or "clean up while you're in there"
4. If the fix requires touching multiple files, list them all and confirm before proceeding

**Unauthorized side effects are the #1 source of "it was working before you changed it" incidents.**

---

## Rule 4 — Performance is a feature, not an afterthought

Before generating any UI code, ask:

*"Will this run at 60fps on a mid-range Android device from 3 years ago?"*

If the answer is unclear, say so. Then apply these rules:

- Never generate synchronous network or disk operations on the main thread
- Never generate unbounded lists (ScrollView + .map()) — always use LazyColumn / FlatList / ListView.builder
- Never generate `GlobalScope.launch` — use `viewModelScope` or lifecycle-scoped coroutines
- Never generate `GetComponent<T>()` in Unity's `Update()` — cache in `Awake()`
- Never generate `GetAllActorsOfClass` in Unreal's `Tick()` — cache in `BeginPlay()`

**A feature that ships at 40fps is a bug. Mention performance constraints before generating, not after.**

---

*Part of the [mobile-dev-skills](https://github.com/salmanashraf/mobile-dev-skills) toolkit.*
