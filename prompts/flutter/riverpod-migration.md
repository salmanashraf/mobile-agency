# Prompt — Migrate Provider to Riverpod

**Platform:** Flutter (Dart)  
**Category:** Code Quality  
**Type:** one-shot

---

## Purpose

Migrates flutter_provider (Provider package) code to Riverpod 2.x. Produces idiomatic Riverpod with code generation (`@riverpod`).

---

## Prompt

```
You are a senior Flutter engineer. Migrate the flutter_provider code below to Riverpod 2.x
with code generation (@riverpod annotation style).

Migration rules:
1. ChangeNotifier → @riverpod class extending Notifier<State> or AsyncNotifier<State>.
2. Provider<T> → @riverpod T myProvider(MyProviderRef ref)
3. FutureProvider<T> → @riverpod Future<T> myProvider(MyProviderRef ref)
4. StreamProvider<T> → @riverpod Stream<T> myProvider(MyProviderRef ref)
5. Consumer / context.watch<T>() → ConsumerWidget + ref.watch(myProvider)
6. context.read<T>().method() → ref.read(myProvider.notifier).method()
7. ProxyProvider → ref.watch(otherProvider) inside the provider body
8. MultiProvider → no equivalent needed; Riverpod providers are globally accessible
9. Wrap the app in ProviderScope at main() if not already done.
10. Add required dependencies to pubspec.yaml: riverpod, flutter_riverpod, riverpod_annotation,
    build_runner, riverpod_generator.

For each migration: show the original Provider code, then the equivalent Riverpod code.
Explain any non-obvious decisions.

Provider code to migrate:
```
[PASTE YOUR PROVIDER CODE HERE]
```
```

---

## Example Usage

**What you paste:**
```
Provider code to migrate:
```
// provider setup
MultiProvider(
  providers: [
    ChangeNotifierProvider(create: (_) => AuthNotifier()),
    ProxyProvider<AuthNotifier, UserRepository>(
      update: (_, auth, __) => UserRepository(token: auth.token),
    ),
    FutureProvider<List<Post>>(
      create: (ctx) => ctx.read<UserRepository>().getPosts(),
    ),
  ],
  child: MyApp(),
)

// AuthNotifier
class AuthNotifier extends ChangeNotifier {
  String? token;
  void login(String t) { token = t; notifyListeners(); }
}

// Widget
class HomeScreen extends ConsumerWidget {
  Widget build(BuildContext context) {
    final posts = context.watch<AsyncValue<List<Post>>>();
    return posts.when(data: (p) => ListView(...), loading: ..., error: ...);
  }
}
```
```

**Expected output:**
```dart
// pubspec.yaml additions:
// dependencies:
//   flutter_riverpod: ^2.5.0
//   riverpod_annotation: ^2.3.0
// dev_dependencies:
//   riverpod_generator: ^2.4.0
//   build_runner: ^2.4.0

// Run: dart run build_runner build

// auth_provider.dart
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'auth_provider.g.dart';

@riverpod
class Auth extends _$Auth {
  @override
  String? build() => null;  // initial state: no token

  void login(String token) => state = token;
  void logout() => state = null;
}

// user_repository_provider.dart
@riverpod
UserRepository userRepository(UserRepositoryRef ref) {
  final token = ref.watch(authProvider);  // replaces ProxyProvider
  return UserRepository(token: token);
}

// posts_provider.dart
@riverpod
Future<List<Post>> posts(PostsRef ref) async {
  final repo = ref.watch(userRepositoryProvider);
  return repo.getPosts();
}

// main.dart
void main() {
  runApp(const ProviderScope(child: MyApp()));
}

// home_screen.dart
class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final postsAsync = ref.watch(postsProvider);
    return postsAsync.when(
      data: (posts) => ListView.builder(
        itemCount: posts.length,
        itemBuilder: (_, i) => PostTile(post: posts[i]),
      ),
      loading: () => const CircularProgressIndicator(),
      error: (e, _) => Text('Error: $e'),
    );
  }
}
```

---

## Variations

- **Without code generation:** Add "Do not use @riverpod annotations or build_runner. Use the manual StateNotifierProvider and ref.watch() API instead."
- **StateNotifier migration:** Add "The existing code uses StateNotifier — migrate to Notifier<State> with @riverpod."
