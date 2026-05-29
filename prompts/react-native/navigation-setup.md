# Prompt — React Navigation Setup

**Platform:** React Native (TypeScript)  
**Category:** UI & Design  
**Type:** one-shot

---

## Purpose

Generates a complete, type-safe React Navigation v7 stack/tab configuration from a description of your app's screen structure.

---

## Prompt

```
You are a senior React Native engineer. Generate a complete, type-safe React Navigation v7
configuration for the app structure described below.

Rules:
1. Use TypeScript with full type safety — define RootStackParamList, BottomTabParamList, etc.
2. Nest navigators correctly: Stack inside Tab, Modal stack at root level.
3. Type-safe navigation props: use NativeStackScreenProps<RootStackParamList, 'ScreenName'>.
4. Deep link configuration: include a basic linking config object.
5. Auth flow: if the app has auth, use a conditional navigator pattern (not nested navigators for auth).
6. Headers: customize the header title and back button for key screens.
7. Tab bar: icons using react-native-vector-icons or @expo/vector-icons.
8. Output: NavigationContainer setup, all navigator definitions, param type declarations,
   and a useAppNavigation() typed hook.

App screen structure:
[DESCRIBE YOUR SCREENS — include: tab names, stack screens per tab, modal screens, params passed between screens, auth flow if applicable]
```

---

## Example Usage

**What you paste:**
```
App screen structure:
3 bottom tabs: Home, Search, Profile.
Home tab: HomeScreen (no params) → PostDetailScreen (postId: string) → CommentsScreen (postId: string).
Search tab: SearchScreen (no params) → UserProfileScreen (userId: string).
Profile tab: MyProfileScreen → EditProfileScreen.
Modal (shown from anywhere): ImageViewerModal (imageUrl: string, title: string).
Auth flow: LoginScreen, RegisterScreen — shown instead of tabs when not authenticated.
```

**Expected output:**
```typescript
// navigation/types.ts
export type HomeStackParamList = {
  Home: undefined;
  PostDetail: { postId: string };
  Comments: { postId: string };
};

export type SearchStackParamList = {
  Search: undefined;
  UserProfile: { userId: string };
};

export type ProfileStackParamList = {
  MyProfile: undefined;
  EditProfile: undefined;
};

export type BottomTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  SearchTab: NavigatorScreenParams<SearchStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<BottomTabParamList>;
  ImageViewer: { imageUrl: string; title: string };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// navigation/AppNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from '@expo/vector-icons/Ionicons';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const SearchStack = createNativeStackNavigator<SearchStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

function HomeNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="PostDetail" component={PostDetailScreen}
        options={({ route }) => ({ title: 'Post' })} />
      <HomeStack.Screen name="Comments" component={CommentsScreen}
        options={{ title: 'Comments' }} />
    </HomeStack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        const icons: Record<string, string> = {
          HomeTab: 'home', SearchTab: 'search', ProfileTab: 'person',
        };
        return <Icon name={icons[route.name] as any} size={size} color={color} />;
      },
      headerShown: false,
    })}>
      <Tab.Screen name="HomeTab" component={HomeNavigator} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="SearchTab" component={SearchNavigator} options={{ tabBarLabel: 'Search' }} />
      <Tab.Screen name="ProfileTab" component={ProfileNavigator} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

export function AppNavigator({ isAuthenticated }: { isAuthenticated: boolean }) {
  const linking = {
    prefixes: ['myapp://', 'https://myapp.com'],
    config: {
      screens: {
        Main: { screens: { HomeTab: { screens: { PostDetail: 'post/:postId' } } } },
        ImageViewer: 'image',
      },
    },
  };

  return (
    <NavigationContainer linking={linking}>
      {isAuthenticated ? (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Main" component={TabNavigator} />
          <RootStack.Screen name="ImageViewer" component={ImageViewerModal}
            options={{ presentation: 'modal', headerShown: true, title: '' }} />
        </RootStack.Navigator>
      ) : (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}

// navigation/useAppNavigation.ts — typed navigation hook
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const useAppNavigation = () =>
  useNavigation<NativeStackNavigationProp<RootStackParamList>>();
```

---

## Variations

- **Drawer navigation:** Add "Replace the bottom tab with a Drawer navigator."
- **Expo Router:** Add "Use Expo Router file-based routing instead of React Navigation."
