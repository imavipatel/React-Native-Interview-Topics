/**
 * react-native-ui-rendering-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES: "How UI renders in React Native"
 * - Plain-language explanations
 * - React → Shadow Tree → Layout → Mounting → Native Views
 * - Old architecture vs New architecture rendering paths
 * - Complete runnable demo component at bottom
 * - Interview Q&A + cheat-sheet
 */

/* ===========================================================================
📌 1. WHAT DOES “UI Rendering” MEAN IN REACT NATIVE? (Simple English)
===============================================================================
React Native UI rendering = HOW your JSX becomes real native iOS/Android views.

Steps:
1) You write JSX → <View><Text>Hello</Text></View>
2) React converts this into a virtual element tree
3) React reconciler decides what needs updating
4) React Native uses a layout engine (Yoga) to compute position & size
5) Native views (UIView on iOS, android.view.View on Android) get created/updated
6) User sees the final UI on screen

React Native does NOT render HTML.  
It renders true **native UI components**.
*/

/* ===========================================================================
📌 2. UI RENDERING FLOW — HIGH LEVEL
===============================================================================
JSX → React Reconciler → Shadow Tree → Yoga Layout → Mounting Layer → Native Views

ASCII Diagram:

     React (JS Thread)
         |
         v
   Virtual DOM (React Elements)
         |
         v
   Shadow Tree (layout-only nodes)
         |
         v
   YOGA Layout Engine (sizes, positions)
         |
         v
   Mounting Layer
         |
         v
   Native Views (iOS UIView / Android ViewGroup)

Each step transforms abstract description → layout → on-screen views.
*/

/* ===========================================================================
📌 3. STEP-BY-STEP: HOW UI RENDERS IN OLD ARCHITECTURE
===============================================================================
OLD ARCH = JS ↔ BRIDGE ↔ UIManager ↔ Native Views

● Step 1: React runs (JS Thread)
   JSX → React Elements → Shadow Nodes (JS representation)
   Example: <View> becomes a shadow node with styles flexDirection, width, etc.

● Step 2: Layout
   Yoga reads styles → calculates exact width/height/x/y for each node.

● Step 3: Bridge Communication
   Changes sent as serialized commands:
     "createView"
     "updateView"
     "manageChildren"
     "setLayout"
   These are batched and async.

● Step 4: UIManager (Native side)
   - UIManager receives commands
   - Creates native views
   - Sets props, styles, event handlers
   - Places views in native hierarchy

● Step 5: Native Rendering
   iOS: Core Animation + UIKit  
   Android: ViewGroup measure/layout/draw pipeline

⚠ Because it used a JSON-like async bridge, small frequent updates caused lag.
*/

/* ===========================================================================
📌 4. NEW ARCHITECTURE RENDERING (Fabric Renderer)
===============================================================================
NEW ARCH = JS (Hermes + JSI) → Fabric Renderer → Native Views

How it changes rendering:

● No more Bridge serialization for rendering
● Shadow Tree lives closer to native (C++ representation)
● Direct JS ↔ native objects using JSI
● More efficient mounting layer
● Supports React Concurrent Rendering

Steps:

1️⃣ React creates a Fiber tree (React reconciliation)  
2️⃣ Fabric creates a Shadow Tree (C++ layout nodes)  
3️⃣ Yoga layout calculates positions  
4️⃣ Fabric Mounting Layer applies minimal diffs to real native views  
5️⃣ UI updates appear instantly with fewer async hops  

Benefits:
✔ Lower latency  
✔ Better gesture & animation performance  
✔ Smoother updates  
✔ Less overhead for high-frequency view changes  
*/

/* ===========================================================================
📌 5. WHAT IS THE SHADOW TREE?
===============================================================================
The Shadow Tree = a parallel tree of layout-only nodes (NOT real views).

Each <View> → creates:
{
  tag: number,
  props: {...},
  style: {...},
  layoutMetrics: {...},
  children: [...]
}

Shadow Tree is responsible for:
- layout
- diffing changes
- preparing updates for native view hierarchy

It does *not* render anything visible.  
It's like React's blueprint for the UI.
*/

/* ===========================================================================
📌 6. YOGA LAYOUT ENGINE — how layout is decided
===============================================================================
Yoga calculates:
- width / height
- x / y positions
- flex layout behavior

Yoga reads the Shadow Tree and applies Flexbox rules:
flexDirection, alignItems, justifyContent, flex, margin, padding…

Output example:
{
  x: 0,
  y: 120,
  width: 200,
  height: 50
}

Native UI only receives fully computed layout, not raw Flexbox instructions.
*/

/* ===========================================================================
📌 7. MOUNTING LAYER — how views appear on screen
===============================================================================
MOUNTING LAYER = takes layout + props and updates actual native views.

OLD: UIManager  
NEW: Fabric Mounting Layer

Fabric Mounting Layer performs:
- createView → create native view instance
- updateView → update properties (color, text, style)
- deleteView → remove view
- reorderChildren → reorder in UI tree

Optimizations in Fabric:
✔ granular diffs  
✔ batching  
✔ thread-safe operations  
✔ tighter integration with React concurrent mode  
*/

/* ===========================================================================
📌 8. EVENT FLOW (UI → JS)
===============================================================================
OLD ARCH:
native event → bridge → JS → handler

NEW ARCH:
native event → Fabric event pipe → JS (faster, coalesced)

Less serialization = better performance for scroll, gestures, animations.
*/

/* ===========================================================================
📌 9. RENDERING PIPELINE — OLD VS NEW (simple summary)
===============================================================================

OLD:  
JS → Shadow Tree → Bridge → UIManager → Native Views  
❌ bridge serialization  
❌ async only  
❌ slower UI updates  

NEW (Fabric):  
JS → Shadow Tree (C++) → Fabric → Native Views  
✔ direct JS ↔ native (JSI)  
✔ less overhead  
✔ synchronous when safe  
✔ faster and smoother UI  

*/

/* ===========================================================================
📌 10. INTERVIEW Q&A (SUPER IMPORTANT)
===============================================================================

Q1: How does RN convert JSX into native UI?
A: React builds a virtual tree → RN creates Shadow Tree → Yoga calculates layout → native views created/updated.

Q2: What is the Shadow Tree?
A: A layout-only tree that represents UI before being mounted.

Q3: Why is Yoga used?
A: To compute layout using Flexbox rules consistently across platforms.

Q4: What is UIManager?
A: Old architecture native component responsible for creating/updating native views.

Q5: What replaced UIManager?
A: Fabric Mounting Layer (new architecture).

Q6: What makes Fabric faster?
A: JSI (no bridge), direct host objects, batching, C++ Shadow Tree, better layout pipeline.

Q7: Does React Native draw pixels?
A: No. Native platform (UIKit / Android Views) handle drawing. RN only orchestrates layout + updates.

*/

/* ===========================================================================
📌 11. CHEAT-SHEET (REMEMBER THESE)
===============================================================================
⭐ JSX → React Reconciler → Shadow Tree → Yoga → Native Views  
⭐ Old architecture used async Bridge → slower  
⭐ New architecture uses JSI + Fabric → faster  
⭐ Shadow Tree = layout blueprint (not visible)  
⭐ Yoga = Flexbox layout engine  
⭐ Fabric = new renderer + mounting system  
⭐ Native UI = true platform widgets, NOT HTML  
*/

/* ===========================================================================
📌 12. RUNNABLE DEMO COMPONENT (explains rendering visually)
===============================================================================
Paste into any screen to show a simple representation of how RN renders UI.
*/

export function RenderingFlowScreen() {
  return (
    <View style={demo.container}>
      <Text style={demo.title}>React Native Rendering Flow</Text>

      <View style={demo.box}>
        <Text style={demo.label}>1. JSX (Your Code)</Text>
      </View>

      <View style={demo.arrow}>
        <Text>↓</Text>
      </View>

      <View style={demo.box}>
        <Text style={demo.label}>2. React Reconciler</Text>
      </View>

      <View style={demo.arrow}>
        <Text>↓</Text>
      </View>

      <View style={demo.box}>
        <Text style={demo.label}>3. Shadow Tree (layout only)</Text>
      </View>

      <View style={demo.arrow}>
        <Text>↓</Text>
      </View>

      <View style={demo.box}>
        <Text style={demo.label}>4. Yoga Layout</Text>
      </View>

      <View style={demo.arrow}>
        <Text>↓</Text>
      </View>

      <View style={demo.box}>
        <Text style={demo.label}>5. Fabric / UIManager Mounting</Text>
      </View>

      <View style={demo.arrow}>
        <Text>↓</Text>
      </View>

      <View style={demo.boxFinal}>
        <Text style={demo.label}>6. Native UI on Screen</Text>
      </View>
    </View>
  );
}

const demo = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  box: {
    padding: 12,
    backgroundColor: "#eef3ff",
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
  },
  boxFinal: {
    padding: 12,
    backgroundColor: "#d7ffe9",
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  arrow: {
    marginVertical: 6,
  },
});

/* ===========================================================================
📌 13. FINAL TL;DR
===============================================================================
React Native renders UI by:
✔ Running React on JS thread  
✔ Building a Shadow Tree  
✔ Running Yoga for layout  
✔ Mounting native views via UIManager (old) or Fabric (new)  
✔ Showing REAL native UI components  

Fabric + JSI make everything smoother, faster, and more predictable.
*/

/* ===========================================================================
📌 Want next?
===============================================================================
I can generate:
  ✅ "How gestures & animations work in React Native"  
  ✅ "How Reanimated works behind the scenes (UI thread worklets)"  
  ✅ "How navigation works internally (stack, push/pop, layout)"  
  ✅ "How FlatList renders items efficiently"  

Just ask — and I’ll return in the same JS Notes format.
*/
