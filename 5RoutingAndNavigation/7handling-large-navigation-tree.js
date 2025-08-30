/**
 * ==============================================================
 * 📘 Handling Large Navigation Trees Efficiently in React Native
 * ==============================================================
 *
 * 🟢 THEORY (Why this matters?)
 * --------------------------------------------------------------
 * - In large apps, navigation trees can become very **deep and complex**
 *   (e.g., multiple Stack, Tab, Drawer navigators nested together).
 * - If not optimized:
 *    - App startup slows down (loading all screens at once).
 *    - Memory usage increases (many screens/components in memory).
 *    - Navigation transitions lag.
 *
 * ✅ Goal: Keep navigation tree lightweight, load only what’s needed,
 *   and avoid unnecessary re-renders of screens.
 *
 * ==============================================================
 * 🔹 Problems with Large Navigation Trees
 * --------------------------------------------------------------
 * 1. **Eager loading of all screens** → slows startup.
 * 2. **Unnecessary re-renders** when navigation state changes.
 * 3. **Deep nesting** → difficult to maintain & debug.
 * 4. **Performance issues** when many inactive screens stay mounted.
 *
 * ==============================================================
 * 🔹 Best Practices & Solutions
 * --------------------------------------------------------------
 *
 * 1️⃣ **Lazy Loading Screens**
 * - Use `lazy` or `React.lazy` with `Suspense` so screens load only when needed.
 * Example:
 */
<Stack.Navigator screenOptions={{ lazy: true }}>
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="Profile" component={ProfileScreen} />
</Stack.Navigator>;

/**
 * 2️⃣ **Split Navigation into Modules**
 * - Don’t keep all screens in one huge navigator.
 * - Group related screens into their own navigators (Auth, Dashboard, Settings).
 */
const AuthStack = createNativeStackNavigator();
function AuthNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

/**
 * 3️⃣ **Unmount Inactive Screens**
 * - Prevent inactive tabs/screens from staying mounted.
 * - Use `unmountOnBlur` or `detachInactiveScreens`.
 */
<Tab.Navigator screenOptions={{ unmountOnBlur: true }}>
  <Tab.Screen name="Feed" component={FeedScreen} />
  <Tab.Screen name="Messages" component={MessageScreen} />
</Tab.Navigator>;

/**
 * 4️⃣ **Use `detachInactiveScreens` (React Navigation Optimization)**
 * - Ensures inactive screens are removed from memory.
 */
import { enableScreens } from "react-native-screens";
enableScreens(true); // Optimizes memory by detaching inactive screens

/**
 * 5️⃣ **Code-Splitting Navigation Trees**
 * - Import heavy navigators only when required.
 */
const SettingsNavigator = React.lazy(() =>
  import("./navigators/SettingsNavigator")
);

/**
 * 6️⃣ **Avoid Deep Nesting**
 * - Too many nested navigators = complex tree + performance hit.
 * - Flatten structure where possible.
 *
 * 7️⃣ **Memoization for Screen Components**
 * - Use `React.memo` to avoid unnecessary re-renders when props don’t change.
 *
 * ==============================================================
 * 🔹 Example – Efficient Navigation Structure
 * --------------------------------------------------------------
 */
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function DashboardTabs() {
  return (
    <Tab.Navigator screenOptions={{ lazy: true }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen
        name="Settings"
        component={React.lazy(() => import("./SettingsScreen"))}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  return (
    <Drawer.Navigator screenOptions={{ detachInactiveScreens: true }}>
      <Drawer.Screen name="Dashboard" component={DashboardTabs} />
      <Drawer.Screen name="Auth" component={AuthNavigator} />
    </Drawer.Navigator>
  );
}

/**
 * ==============================================================
 * 🔹 Performance Best Practices Summary
 * --------------------------------------------------------------
 * ✅ Use `lazy` loading for screens.
 * ✅ Split navigation into smaller navigators (modular design).
 * ✅ Use `unmountOnBlur` & `detachInactiveScreens` to save memory.
 * ✅ Avoid deeply nested navigation trees → flatten where possible.
 * ✅ Use `React.memo` for screen components.
 * ✅ Enable `react-native-screens` for better native performance.
 *
 * ==============================================================
 * ❓ Q&A (Interview Style)
 * --------------------------------------------------------------
 * Q1: Why can large navigation trees slow down React Native apps?
 *   → Because all screens are mounted at startup or kept in memory,
 *     causing high memory usage and slow navigation transitions.
 *
 * Q2: How does `detachInactiveScreens` help?
 *   → It removes inactive screens from memory, reducing memory usage.
 *
 * Q3: Should we lazy load every screen?
 *   → No. Keep critical screens (like Home, Login) eagerly loaded,
 *     lazy load only non-critical or heavy screens.
 *
 * Q4: What’s better – one big navigator or multiple smaller navigators?
 *   → Multiple smaller navigators (modular design) → easier to maintain,
 *     better performance.
 *
 * ==============================================================
 */
