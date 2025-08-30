/* =============================================================================
📘 React Navigation – Stack / Tab / Drawer Navigator + Advanced Notes
============================================================================= */

/* (Already included sections: Stack/Tab/Drawer, Passing Params, Deep Linking, Navigation lifecycle, Native vs JS navigation, Code splitting, Handling large trees, etc.) */

/* =============================================================================
📘 Native Navigation Performance Benefits in React Native
============================================================================= */

/*
🟢 Introduction
-----------------------------------------------------------------------------
- React Native apps usually use **JavaScript-based navigation libraries**
  (like React Navigation).
- However, there are also **native navigation libraries**
  (like React Native Navigation by Wix).
- Native navigation delegates screen transitions & stack management
  to the **OS-level native navigation controllers**.
- This approach has major **performance benefits** especially in
  large, complex apps.
*/

/* =============================================================================
🔹 1. How Native Navigation Works
-----------------------------------------------------------------------------
- JS-based navigation: transitions & stack logic run on the JS thread,
  then communicate with the native bridge → introduces overhead.
- Native navigation: transitions (animations, back stack, tabs, drawers)
  are **fully handled in native code (iOS UINavigationController,
  Android FragmentManager)**.
- JS is only responsible for telling which screen to show → native layer
  handles transitions instantly.
*/

/* =============================================================================
🔹 2. Performance Benefits
-----------------------------------------------------------------------------
✅ a) Faster Screen Transitions
✅ b) Reduced JS Thread Load
✅ c) Lower Memory Usage
✅ d) Smooth Animations
✅ e) Better Large-Scale Performance
✅ f) Native Backstack Integration
✅ g) Improved Startup Time
*/

/* =============================================================================
🔹 3. Drawbacks / Trade-offs
-----------------------------------------------------------------------------
⚠️ a) Complexity
⚠️ b) Less Flexibility
⚠️ c) Ecosystem
⚠️ d) Code Consistency
*/

/* =============================================================================
🔹 4. When to Use Native Navigation
-----------------------------------------------------------------------------
- Best choice if:
  1. Large app with many screens & deep navigation trees.
  2. Heavy background tasks (networking, animations, data processing).
  3. Need high-performance native-like transitions.
  4. Expect instant responsiveness (finance, e-commerce, media apps).
*/

/* =============================================================================
🔹 5. Comparison – Native Navigation vs JS Navigation
-----------------------------------------------------------------------------
| Feature                   | JS Navigation (React Navigation) | Native Navigation (Wix RNN) |
|----------------------------|----------------------------------|-----------------------------|
| Animations                 | JS thread (risk of frame drops)  | Native GPU-accelerated      |
| Startup Speed              | Slightly slower                 | Faster (native preload)     |
| Memory Management          | JS-managed screens               | OS-level screen management  |
| Back/Swipe gestures        | Implemented in JS                | Native default              |
| Ecosystem & Plugins        | Very large, flexible             | Smaller, less flexible      |
| Setup Complexity           | Easy (pure JS)                   | Harder (native linking)     |
| Best Use Case              | Small/medium apps, custom UIs    | Large apps, performance apps|
*/

/* =============================================================================
🔹 6. Q&A (Interview Style)
-----------------------------------------------------------------------------
Q1: Why does native navigation feel smoother than JS navigation?
   → Because transitions run on the native UI thread, not the JS thread,
     so they don’t lag even when JS is busy.

Q2: Does native navigation completely remove JS thread usage?
   → No, JS still decides *which* screen to load, but animations &
     transitions run in native code.

Q3: Should every app use native navigation?
   → Not always. For small/medium apps, React Navigation’s flexibility &
     ecosystem is more beneficial. Native navigation is best for apps with
     performance bottlenecks.

Q4: How does native navigation improve memory usage?
   → OS manages screen lifecycle (destroying/recreating screens as needed),
     reducing memory leaks and unused screen stacks.
*/

/* =============================================================================
🔹 7. Code Examples
============================================================================= */

/* Example 1: React Navigation (JS-based Navigation)
   - Entirely JS-driven navigation
   - Animations run on JS thread → may lag if JS is busy
*/
import React from "react";
import { Button, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home Screen (React Navigation)</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate("Details")}
      />
    </View>
  );
}

function DetailsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Details Screen</Text>
    </View>
  );
}

export default function AppJSNav() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/* Example 2: React Native Navigation (Wix - Native Navigation)
   - Screens registered natively
   - Transitions handled by OS-level navigation controller
   - Much smoother for large apps
*/

// index.js (entry point)
import { Navigation } from "react-native-navigation";
import App from "./App";

// Register screens with native navigation
Navigation.registerComponent("HomeScreen", () => HomeScreen);
Navigation.registerComponent("DetailsScreen", () => DetailsScreen);

// Start app with HomeScreen
Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: "HomeScreen",
            },
          },
        ],
      },
    },
  });
});

// HomeScreen.js
import React from "react";
import { View, Text, Button } from "react-native";
import { Navigation } from "react-native-navigation";

const HomeScreen = (props) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home Screen (Native Navigation)</Text>
      <Button
        title="Go to Details"
        onPress={() =>
          Navigation.push(props.componentId, {
            component: {
              name: "DetailsScreen",
            },
          })
        }
      />
    </View>
  );
};

// export default HomeScreen;

// DetailsScreen.js
import React from "react";
import { View, Text } from "react-native";

const DetailsScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Details Screen</Text>
    </View>
  );
};

// export default DetailsScreen;

/* =============================================================================
✅ Final Takeaway
-----------------------------------------------------------------------------
- **Native Navigation = Faster, smoother, more memory-efficient**.
- Best for large-scale apps with many screens.
- React Navigation is easier & more flexible but may cause JS-thread
  related performance bottlenecks.
- Choice depends on app complexity + performance requirements.
============================================================================= */
