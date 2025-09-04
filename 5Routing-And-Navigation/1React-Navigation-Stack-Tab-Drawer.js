/**
 * ==============================================================
 * 📘 React Native Notes – React Navigation (Stack / Tab / Drawer Navigator)
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 What is React Navigation?
 * - A popular library for navigation in React Native apps.
 * - Provides navigation primitives like stack, tabs, and drawers.
 * - Works with React Context internally.
 *
 * 🔹 Why use it?
 * - Handles screen transitions, history, and deep linking.
 * - Easy to integrate with global state and navigation guards.
 * - Provides hooks like `useNavigation`, `useRoute`, `useFocusEffect`.
 *
 * --------------------------------------------------------------
 * 🔹 Navigators
 * 1️⃣ Stack Navigator
 * - Screens stacked on top of each other (like a call stack).
 * - Best for flows like login → home → details.
 *
 * 2️⃣ Bottom Tab Navigator
 * - Provides bottom navigation bar with tabs.
 * - Good for apps with main sections (Home, Search, Profile).
 *
 * 3️⃣ Drawer Navigator
 * - Provides a sidebar (left/right) for navigation.
 * - Good for apps with many screens or hidden menus.
 *
 * --------------------------------------------------------------
 * 🔹 Installation
 * npm install @react-navigation/native
 * npm install react-native-screens react-native-safe-area-context
 * npm install @react-navigation/stack @react-navigation/bottom-tabs @react-navigation/drawer
 *
 * Wrap root with:
 * import { NavigationContainer } from "@react-navigation/native";
 *
 * ==============================================================
 * 🔹 Stack Navigator Example
 * --------------------------------------------------------------
 */
import React from "react";
import { Button, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View>
      <Text>Home Screen</Text>
      <Button title="Go to Details" onPress={() => navigation.navigate("Details")} />
    </View>
  );
}

function DetailsScreen() {
  return <Text>Details Screen</Text>;
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/**
 * ==============================================================
 * 🔹 Bottom Tab Navigator Example
 * --------------------------------------------------------------
 */
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

function ProfileScreen() {
  return <Text>Profile Screen</Text>;
}

function SettingsScreen() {
  return <Text>Settings Screen</Text>;
}

export default function TabApp() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

/**
 * ==============================================================
 * 🔹 Drawer Navigator Example
 * --------------------------------------------------------------
 */
import { createDrawerNavigator } from "@react-navigation/drawer";

const Drawer = createDrawerNavigator();

export default function DrawerApp() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

/**
 * ==============================================================
 * 🔹 Nested Navigation Example (Stack inside Tab)
 * --------------------------------------------------------------
 * ✅ Very common in real-world apps:
 * - Tab navigation for main sections
 * - Each tab has its own stack
 *
 * Example:
 */
function FeedScreen({ navigation }) {
  return (
    <View>
      <Text>Feed Screen</Text>
      <Button title="Go to Post" onPress={() => navigation.navigate("Post")} />
    </View>
  );
}

function PostScreen() {
  return <Text>Post Details</Text>;
}

const FeedStack = createStackNavigator();

function FeedStackNavigator() {
  return (
    <FeedStack.Navigator>
      <FeedStack.Screen name="Feed" component={FeedScreen} />
      <FeedStack.Screen name="Post" component={PostScreen} />
    </FeedStack.Navigator>
  );
}

function MessagesScreen() {
  return <Text>Messages Screen</Text>;
}

export default function NestedNavApp() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Feed" component={FeedStackNavigator} />
        <Tab.Screen name="Messages" component={MessagesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

/**
 * ==============================================================
 * 🔹 Useful Hooks
 * --------------------------------------------------------------
 * useNavigation() → Access navigation object inside components.
 * useRoute() → Get current route details.
 * useFocusEffect() → Run effect when screen is focused.
 * useIsFocused() → Boolean if screen is active.
 *
 * Example:
 * import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";
 *
 * const navigation = useNavigation();
 * const route = useRoute();
 * const isFocused = useIsFocused();
 *
 * ==============================================================
 * ❓ Q&A for Interviews
 * --------------------------------------------------------------
 * Q1: Difference between Stack, Tab, and Drawer?
 *    → Stack = push/pop flow.
 *      Tab = bottom menu with multiple screens.
 *      Drawer = side menu with hidden navigation.
 *
 * Q2: Can you use Stack inside Tab or Drawer?
 *    → Yes, navigators can be nested (see example above).
 *
 * Q3: How do you pass params between screens?
 *    → navigation.navigate("Details", { id: 5 })
 *       → inside Details: route.params.id
 *
 * Q4: How do you reset navigation history?
 *    → navigation.reset({ index: 0, routes: [{ name: "Home" }] })
 *
 * Q5: What happens if you don’t wrap in NavigationContainer?
 *    → Navigation won’t work (must be root provider).
 *
 * Q6: Can you use deep linking with React Navigation?
 *    → Yes, with `Linking` config in NavigationContainer.
 *
 * ==============================================================
 */
