/**
 * react-native-navigation-fabric-architecture-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES:
 * "How Navigation Works in the NEW React Native Architecture (Fabric-aware)"
 *
 * Covers:
 * - JS ↔ JSI ↔ Fabric Rendering Pipeline
 * - Navigation state updates + Fabric mounting flow
 * - Native Stack (react-native-screens) integration with Fabric
 * - Gesture/animation pipeline in the new architecture
 * - How React Navigation benefits from Fabric + JSI
 *
 * Includes diagrams + interview Q&A + practical notes.
 */

/* ===========================================================================
📌 0. BIG PICTURE — what changed with the new architecture?
===============================================================================
In Old RN:
  Navigation = JS updates state → Bridge → Native UIManager → native views
  Transition animations = controlled heavily by JS or Reanimated

In NEW RN (Fabric):
  • JS interacts with native via JSI (no bridge serialization)
  • Fabric manages UI mounting (view creation, updates) in a faster, C++ pipeline
  • TurboModules provide faster native calls (gestures, animations)
  • Transitions + gestures can run on the UI thread with almost no JS cost

Navigation libraries (React Navigation + Native Stack) now:
  ✔ run JS state updates faster  
  ✔ perform smoother transitions  
  ✔ synchronize mounting with React concurrent rendering  
  ✔ reduce JS↔native roundtrip overhead  
*/

/* ===========================================================================
📌 1. FULL RENDERING + NAVIGATION FLOW WITH FABRIC (step-by-step)
===============================================================================
JS calls navigation.navigate()  
   ↓
React state machine updates navigation state  
   ↓
React reconciler creates new UI tree  
   ↓
Fabric receives updated Shadow Tree (C++ hosted)
   ↓
Yoga calculates layout (C++ integration)  
   ↓
Fabric Mounting Layer applies diffs to native views  
   ↓
Native Stack transition animation (native side)  
   ↓
Screen is mounted/unmounted seamlessly  

No Bridge. No JSON messages.  
Everything flows through JSI + Fabric + C++ objects.
*/

/* ===========================================================================
📌 2. WHY NAVIGATION BECAME FASTER IN FABRIC
===============================================================================
✔ Shadow tree now in C++ (less JS overhead)  
✔ Mounting operations run via Fabric (more direct)  
✔ Native Stack uses real UINavigationController / Android Fragment transitions  
✔ Reanimated (v3) runs animations on UI thread through JSI  
✔ Gesture Handler delegates gestures to native without bridge  

Effectively:
- Navigation state is JS.
- Navigation transitions are native.
- Sync between them is more efficient due to JSI & Fabric’s rendering pipeline.
*/

/* ===========================================================================
📌 3. NAVIGATION FLOW (FABRIC-AWARE) — ASCII DIAGRAM
===============================================================================

      ┌────────────────────────────────────────┐
      │                JS Thread               │
      │   React Navigation State Machine       │
      │   (navigate, push, pop, setParams)     │
      └────────────────────────────────────────┘
                         │
                         ▼
      ┌────────────────────────────────────────┐
      │        React Reconciler (JS)           │
      │   Produces new element tree            │
      └────────────────────────────────────────┘
                         │
                         ▼  (via JSI, no bridge)
      ┌────────────────────────────────────────┐
      │      Fabric Shadow Tree (C++ host)     │
      │   layout nodes synced with React       │
      └────────────────────────────────────────┘
                         │
                         ▼
      ┌────────────────────────────────────────┐
      │   Yoga Layout (C++), compute sizes     │
      └────────────────────────────────────────┘
                         │
                         ▼
      ┌────────────────────────────────────────┐
      │    Fabric Mounting Layer (C++)         │
      │   Apply minimal view diffs to native   │
      └────────────────────────────────────────┘
                         │
                         ▼
      ┌────────────────────────────────────────┐
      │  Native Stack (UIKit / FragmentManager)│
      │   handles transitions + gestures       │
      └────────────────────────────────────────┘
*/

/* ===========================================================================
📌 4. HOW REACT NAVIGATION BENEFITS FROM FABRIC
===============================================================================
React Navigation (JS layer):
- No architecture change required
- State machine stays same

BUT:

1) Rendering is faster because Fabric mounts screens more efficiently  
2) JS thread is less blocked because mounting is offloaded to native/C++  
3) Concurrent rendering allows navigation transitions to feel smoother  
4) Less data serialization → fewer frame drops  

Example:
Old: navigate → JS prepares update → Bridge sends commands → UIManager updates  
New: navigate → JS updates tree → Fabric renders instantly with direct mounting  
*/

/* ===========================================================================
📌 5. HOW NATIVE STACK WORKS IN NEW ARCHITECTURE
===============================================================================
Native Stack (from react-native-screens):
- Uses real platform navigation controllers
- Under new architecture, screens are Fabric-enabled (when opted-in)

Flow:
1. JS updates navigation state  
2. Fabric mounts/unmounts views inside native container  
3. Native navigation controller runs transitions  
4. JS receives events (focus/blur) via TurboModules (faster)

Native Stack benefits most from new architecture:
✔ transitions smoother  
✔ less JS thread overhead  
✔ faster screen swaps  
✔ improved gesture responsiveness  
*/

/* ===========================================================================
📌 6. GESTURES & ANIMATIONS — native execution under Fabric
===============================================================================
Gesture Handler + Reanimated v3 + JSI:
- Gestures evaluated on native/UI thread, not JS
- Reanimated worklets run on UI thread (via JSI host functions)
- Screen transition animations become 100% native-driven
- JS thread can even be blocked and gestures still work

This is a huge improvement for navigation UX.
*/

/* ===========================================================================
📌 7. SCREEN LIFECYCLE IN FABRIC
===============================================================================
Screen mounting/unmounting now handled by Fabric:

Lifecycle:
- onBeforeBlur (optional)
- onBlur
- unmount (Fabric tree update)
- mount (Fabric creates new native views)
- onFocus

Fabric automatically synchronizes UI updates with React concurrent rendering.

Key Difference:
Old RN = UIManager performs mount operations  
New RN = Fabric Mounting Layer performs mount operations (more efficient)
*/

/* ===========================================================================
📌 8. PARAMS & STATE in new architecture
===============================================================================
Navigation params are still purely JS objects.

But benefits:
✔ Passing params triggers fewer re-renders  
✔ Route objects diff faster in C++ shadow tree  
✔ Layout changes propagate with lower latency  
*/

/* ===========================================================================
📌 9. REACT NAVIGATION + FABRIC SUMMARY TABLE
===============================================================================

Feature                     | Old Arch (Bridge)       | New Arch (Fabric + JSI)
----------------------------|--------------------------|-------------------------------
Screen mounting             | UIManager (JS→bridge)    | Fabric (C++, direct)
Transitions                 | JS-driven or reanimated  | Native/UI-thread driven
Gesture handling            | JS thread heavy          | JSI/Native thread
Navigation performance      | Can drop frames          | Much smoother, less jank
Event dispatch              | Bridge serialization     | Direct JSI pipes
Concurrent rendering        | Limited support          | Fully supported
*/

/* ===========================================================================
📌 10. MINI DEMO (conceptual)
===============================================================================
This code works the same in new architecture, but under the hood Fabric improves rendering.
*/

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, Button, StyleSheet } from "react-native";

const Stack = createNativeStackNavigator();

export function FabricNavDemo() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ animation: "slide_from_right" }}>
        <Stack.Screen name="Home" component={ScreenA} />
        <Stack.Screen name="Profile" component={ScreenB} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function ScreenA({ navigation }) {
  return (
    <View style={ui.container}>
      <Text style={ui.title}>FABRIC — Home</Text>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate("Profile")}
      />
    </View>
  );
}

function ScreenB({ navigation }) {
  return (
    <View style={ui.container}>
      <Text style={ui.title}>FABRIC — Profile</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const ui = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
});

/* ===========================================================================
📌 11. INTERVIEW Q&A (high value)
===============================================================================
Q1: What changes in navigation because of Fabric?
A: Rendering—screen mounting/unmounting becomes faster due to Fabric’s C++ mounting layer.

Q2: Does navigation state logic change in new architecture?
A: No. Navigation still uses JS state. Only UI mounting path changes.

Q3: Why are transitions smoother on new architecture?
A: Because native stack transitions run on UI thread + JSI reduces JS→native overhead.

Q4: How does JSI improve navigation?
A: Allows gesture handling, animations, and screen updates to occur without bridge serialization.

Q5: What’s the role of Fabric in navigation?
A: Fabric controls creating/updating/destroying native view hierarchies more efficiently.

Q6: Do tabs/drawers behave differently in Fabric?
A: Behavior same; performance improved as mounting/diffing is faster.

*/

/* ===========================================================================
📌 12. CHEAT-SHEET (MEMORIZE THIS)
===============================================================================
⭐ Navigation state still JS (React Navigation unchanged)
⭐ Fabric improves RENDERING, not navigation logic
⭐ Screen mount/unmount = Fabric, not UIManager
⭐ JSI = faster native calls, no bridge
⭐ Native Stack = biggest winner (real native transitions)
⭐ Gestures & animations → run on UI thread (Reanimated via JSI)
⭐ Result = smoother, faster, more fluid navigation
*/

/* ===========================================================================
📌 13. WANT NEXT?
===============================================================================
I can generate:
  ✅ "How Shared Element Transitions work under Fabric"
  ✅ "How deep linking works in Fabric-aware navigation"
  ✅ "How gesture handler works internally in Fabric architecture"
  ✅ "React Navigation + Concurrent Rendering deep dive"

Tell me what format you want — I’ll return in this same JS Notes style.
*/
