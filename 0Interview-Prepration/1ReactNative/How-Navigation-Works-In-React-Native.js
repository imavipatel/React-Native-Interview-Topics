/**
 * react-native-navigation-implementation-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES:
 * "How Navigation Works & Is Implemented in React Native"
 *
 * Covers:
 * - How navigation libraries work under the hood
 * - Stack / Tabs / Drawer mechanisms
 * - React Navigation architecture (JS-driven)
 * - Native Stack navigation (native-driven)
 * - Navigation state machine
 * - Stack actions (push/pop), transition handling, screen lifecycle
 * - How React Native surfaces (screens) are mounted/unmounted
 *
 * Includes diagrams + interview Q&A + runnable demo code.
 */

/* ===========================================================================
📌 0. BIG PICTURE — simple explanation
===============================================================================
React Native doesn't include navigation built-in.  
Navigation = switching between screens + managing history + transitions.

How navigation works:
1) You define screens as React components.
2) A navigation library manages:
   - Navigation state (stack, tabs, routes)
   - Creation & destruction of screens
   - Transitions (animations)
   - Gesture handling (swipe back)
   - Passing params between screens
   - Back button behavior (Android)
3) Result: you "navigate" but technically navigation = updating state +
   mounting/unmounting/caching screen components.

Two major navigation approaches in RN:
-------------------------------------------------
• React Navigation — JS-driven, popular, flexible  
• React Native Navigation / Native Stack — native-driven, faster transitions

You choose based on performance and requirements.
*/

/* ===========================================================================
📌 1. HOW REACT NAVIGATION WORKS INTERNALLY (JS-driven)
===============================================================================
React Navigation = 100% JavaScript navigation state machine.

Internals:
- Maintains a Navigation State Tree:
    {
      index: 1,
      key: 'stack-abc',
      routes: [
        { key: 'Home', name: 'Home', params: {} },
        { key: 'Details', name: 'Details', params: { id: 5 } }
      ]
    }

- When you call navigation.navigate("Details"):
    → Navigation state changes
    → React renders new screen tree based on the new state
    → A transition animation plays (via Reanimated + Gesture Handler)

Rendering Flow:
JSX Navigation Container  
→ holds navigation context  
→ uses reducers & actions internally  
→ calculates next state  
→ renders navigator (Stack/Tabs)  
→ navigator renders correct screens  

It’s essentially a controlled state machine.
*/

/* ===========================================================================
📌 2. REACT NAVIGATION ARCHITECTURE — components
===============================================================================
1️⃣ NavigationContainer  
   - Parent of all navigators  
   - Holds navigation state  
   - Listens to deep linking, back button, state persistence  

2️⃣ Navigators (Stack, Tab, Drawer)
   - Each navigator is a "state machine" that manages its children screens.
   - Uses React context to pass navigation object down.

3️⃣ Screens
   - React components mounted/unmounted on navigation events.

4️⃣ Gesture Handler + Reanimated
   - Provides native-feeling transitions
   - Example: swipe-to-go-back

5️⃣ Linking  
   - Handles deep links, universal links, push notifications

Everything happens on JS thread, transitions often run on UI thread via Reanimated.
*/

/* ===========================================================================
📌 3. STACK NAVIGATION — how it works (under the hood)
===============================================================================
Stack Navigator mimics native iOS UINavigationController & Android stack.

Push (navigate):
- Adds a new route to stack:
    [Home] → push → [Home, Details]

Pop:
- Removes the last route:
    [Home, Details] → pop → [Home]

Transition animation:
- Uses Reanimated to animate screen positions
- Swipe gesture listeners → velocity → animation to complete or cancel

Rendering:
- All stack screens may be mounted (depending on mode)
- Typically top screen is active; others might stay in DOM for animations

Memory:
- Screens can stay mounted for gesture responsiveness
- Options: unmountOnBlur, detachInactiveScreens for optimization
*/

/* ===========================================================================
📌 4. TAB NAVIGATION — how it works
===============================================================================
Tab Navigator:
- Holds multiple routes side-by-side.
- Only one tab is focused at a time.
- Default behavior: inactive tabs remain mounted (cached)
- Can change with options like lazy or unmountOnBlur.

Animations:
- Tab press animations, re-renders controlled by navigation state.

State structure:
{
  index: 0,
  routes: [{name: 'Home'}, {name: 'Search'}, {name: 'Profile'}]
}
*/

/* ===========================================================================
📌 5. DRAWER NAVIGATION — how it works
===============================================================================
Drawer Navigator:
- Renders a sliding side panel.
- Uses Reanimated for slide animations.
- Gesture Handler listens for swipe-left/right.
- Drawer state:
    open — drawer visible
    closed — drawer hidden

Drawer content = separate component mounted inside navigator.
*/

/* ===========================================================================
📌 6. NATIVE STACK NAVIGATION (react-native-screens + native transitions)
===============================================================================
Native Stack (createNativeStackNavigator):
- Uses iOS UINavigationController & Android Fragment Manager under the hood.
- Transitions handled fully on native side → faster & more fluid.
- JS just updates route list; native layer handles visual changes.

Benefits:
✔ Best performance  
✔ Real native transitions  
✔ Less JS work  

Flow:
JS updates route list →
Native screens mounted →
Native handles push/pop animations →
Native sends events back to JS for lifecycle  
*/

/* ===========================================================================
📌 7. NAVIGATION STATE MACHINE — the core idea
===============================================================================
Navigation works like a Redux reducer.

Example:
action = { type: 'NAVIGATE', payload: { name: 'Details' } }

Stack reducer:
(state, action) =>
  if action.type === 'NAVIGATE':
      return {
        ...state,
        routes: [...state.routes, newRoute],
        index: state.index + 1
      }

React Navigation then:
- Notifies subscribers (navigators/screens)
- Renders new UI
- Plays transition
*/

/* ===========================================================================
📌 8. HOW REACT NATIVE MOUNTS/UNMOUNTS SCREENS
===============================================================================
Stack:
- New screen → mounted
- Pop → unmounted
- Some navigators keep previous screens mounted (cache) for speed

Tab:
- Usually keeps all tabs mounted for faster switching

Drawer:
- Drawer content usually mounted once

Screen lifecycle:
- focus
- blur
- beforeRemove
- unmount

React Navigation triggers focus/blur via listeners.
*/

/* ===========================================================================
📌 9. PASSING PARAMS — how it works internally
===============================================================================
Params stored inside route objects:

route = {
  key: 'Details-abcd',
  name: 'Details',
  params: { id: 42 }
}

JS only. No serialization/bridge needed.

Access:
route.params.id

Updates:
navigation.setParams({ id: 50 })
→ updates navigation state → rerenders screen
*/

/* ===========================================================================
📌 10. DEEP LINKING — how RN navigation handles links
===============================================================================
Flow:
1) App receives URL (app://profile/23)  
2) NavigationContainer linking config parses it  
3) Finds matching route  
4) Navigation state updated to reflect nested navigators

Example URL:
myapp://home/tabs/profile?id=23

React Navigation resolves nested screens and sets navigation state accordingly.
*/

/* ===========================================================================
📌 11. RUNNABLE DEMO (simplified)
===============================================================================
Paste this into App.js to visualize navigation working.
*/

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, View, Text, StyleSheet } from "react-native";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ animation: "slide_from_right" }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen({ navigation }) {
  return (
    <View style={ui.container}>
      <Text style={ui.title}>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate("Details", { id: 10 })}
      />
    </View>
  );
}

function DetailScreen({ route, navigation }) {
  return (
    <View style={ui.container}>
      <Text style={ui.title}>Details Screen</Text>
      <Text>ID: {route.params?.id}</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const ui = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
});

/* ===========================================================================
📌 12. INTERVIEW Q&A — very important set
===============================================================================
Q1: How does React Navigation work internally?
A: It maintains a navigation state tree in JS and renders screens according to that state.

Q2: Difference between React Navigation and Native Stack?
A:
- React Navigation = JS-driven transitions (Reanimated)
- Native Stack = platform-native transitions (UIKit/Fragments)

Q3: How does stack navigation mimic push/pop?
A:
Push → add new route  
Pop → remove last route  

Q4: Why is native stack faster?
A:
Transitions run on native UI thread, not JS. No JS→native round-trip needed.

Q5: What happens when you call navigation.navigate?
A:
State updates → screens re-render → transition animation runs → focus event triggers.

Q6: How do params work?
A:
Params are just JS objects stored inside route state.

*/

/* ===========================================================================
📌 13. CHEAT-SHEET (REMEMBER FAST)
===============================================================================
⭐ React Navigation = JS state machine  
⭐ Native Stack = true native transitions  
⭐ Stack = push/pop  
⭐ Tabs = maintain multiple routes, only one active  
⭐ Drawer = side panel, gesture-driven  
⭐ Params = stored inside route objects  
⭐ Focus/Blur events used for lifecycle  
⭐ Reanimated + Gesture Handler enable smooth transitions  
⭐ NavigationContainer holds entire navigation state  
*/

/* ===========================================================================
📌 14. WANT NEXT?
===============================================================================
I can generate:
  ✅ "How Shared Element Transitions work in React Native"
  ✅ "How deep linking works internally (URL → state tree mapping)"
  ✅ "How React Navigation handles back button + hardware keys"
  ✅ "How navigation works in the new architecture (Fabric aware)"

Just tell me — I will return in the same JS Notes format.
*/
