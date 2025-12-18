/**
 * react-native-architecture-notes.js
 *
 * Single-file JavaScript Notes: "How React Native works" — Old Architecture vs New Architecture
 * - Plain-language explanations (component-by-component)
 * - Comparisons, diagrams (ASCII), interview Q&A, cheat-sheet
 * - Small runnable Example component that summarizes architectures on screen
 *
 * Use this format for study, interview prep, or adding to your notes repo.
 */

/* ===========================================================================
📌 0. BIG PICTURE — plain language
===============================================================================
React Native lets you build native mobile UIs using JavaScript/TypeScript + React.
At runtime it runs JS code (React components, business logic) and maps UI + native features
to platform widgets (UIView on iOS, View on Android). Two major architecture eras:

  • Old architecture (classic / Bridge architecture)
  • New architecture (JSI + TurboModules + Fabric, sometimes called "Modern RN")

Goal of the new architecture: reduce overhead of crossing JS↔native boundary,
make UI updates faster and synchronous where needed, enable direct access to
native objects from JS, and better concurrency for rendering and layout.
*/

/* ===========================================================================
📌 1. HIGH-LEVEL ARCHITECTURE SUMMARY (one-liner)
===============================================================================
Old Architecture: JS ↔ Bridge (serialized messages) ↔ Native — async bridge, UI managed via UIManager.

New Architecture: JS (Hermes/JSI) ⇄ Native host objects (JSI) + TurboModules + Fabric renderer — fewer serialized round-trips, direct object access, synchronous bindings when safe.
*/

/* ===========================================================================
📌 2. OLD ARCHITECTURE — components & how they fit (classic Bridge)
===============================================================================
Diagram (simplified):
  JS THREAD (React JS)
      |
      |  (1) translate JSX -> ShadowTree (JS objects)
      |  (2) send commands over Bridge (serialized JSON/blobs)
      v
  BRIDGE (async, batched)
      |
      v
  NATIVE (UIManager, View hierarchy, Native Modules)
      - UIManager applies commands to native Views (createView, updateProps, measure)
      - Native Modules (e.g., CameraModule) exposed via bridge (async calls)
      - Layout measured by Yoga (runs on native thread or separate thread depending)
Notes:
  - Communication is via Bridge: async, message-serialized (JSON or binary).
  - Sending many small messages (e.g., many setNativeProps) is expensive.
  - Event handling: native → bridge → JS as serialized events.
  - Shadow Tree: a JS-side representation of UI (layout calculations often done via Yoga).
  - UI updates are batched; no direct pointer/reference sharing between JS and native.
*/

/* ===========================================================================
📌 3. WHAT EACH OLD ARCH COMPONENT DOES (short)
===============================================================================
• JS Thread
  - Runs React reconciler, executes render(), hooks, event handlers.
  - Produces a tree of React elements -> creates "shadow nodes" representation.

• Bridge
  - Serializes method calls and data (JSON-like) between JS and native.
  - Batched and asynchronous. Good for bulk work but has latency per round-trip.

• UIManager (Native)
  - Receives create/update commands from bridge and manipulates native views.
  - Keeps mapping: reactTag (id) ↔ native view instance.

• Native Modules
  - Platform-specific features (Push, Camera, Filesystem).
  - Exposed over the bridge as module methods (mostly async).

• Yoga (Layout engine)
  - Flexbox implementation, computes layout (size/position).
  - Can run on JS thread or native side depending on implementation.

• Event flow
  - Native events captured -> serialized -> sent to JS (via bridge) -> JS handlers run.
  - Event round-trip cost can be high for many events (scroll/gesture).
*/

/* ===========================================================================
📌 4. LIMITATIONS OF THE OLD ARCHITECTURE (why change)
===============================================================================
- Bridge serialization adds latency and overhead for frequent small interactions.
- No direct object references; JS can't hold a native object reference directly.
- UI updates were asynchronous (perceived slowness / jank on complex UIs).
- Hard to make synchronous/native-driven animations without hacky workarounds.
- Harder to integrate multiple threads safely (JS single-threaded model).
*/

/* ===========================================================================
📌 5. NEW ARCHITECTURE — core concepts (JSI, TurboModules, Fabric)
===============================================================================
Diagram (simplified):
  JS (Hermes or other) — JSI (JavaScript Interface) —> Native host objects (C++ / Java / Obj-C)
                                     ↕
                              TurboModules (fast native modules)
                                     ↕
                              Fabric (new renderer / mounting layer)
                                     ↕
                              Native UI (views)

Main pieces:
  • JSI (JavaScript Interface) — allows JS to hold direct references to native/C++ objects
    (no serialization via bridge). JSI is a C++ API layer that exposes host objects into JS.
  • Hermes (preferred JS engine) — lightweight, embeddable JS engine that supports JSI well.
  • TurboModules — replacement for Native Modules; modules are exposed via JSI and can be
    synchronous or asynchronous as required and avoid bridge serialization.
  • Fabric — new rendering system and mounting layer. Replaces UIManager path for views.
    Fabric integrates with the renderer and makes layout + mounting more concurrent-friendly.
  • EventPipe / EventEmitter (modern) — more efficient event propagation (direct).
  • C++ core host objects — stable, typed interfaces between JS and native.
Notes:
  - JSI eliminates the intermediate serialized bridge for many interactions.
  - Fabric enables synchronous-like interactions for layout and mounting in safe ways.
  - TurboModules let JS call native methods with less overhead.
*/

/* ===========================================================================
📌 6. WHAT EACH NEW ARCH COMPONENT DOES (detailed)
===============================================================================
• JSI (JavaScript Interface)
  - C++ API inserted between JS engine and native code.
  - Lets JS code access host objects (C++ objects) directly — no JSON serialization.
  - Host objects appear as normal JS objects/functions but are backed by native code.
  - Enables lower-latency calls and shared data structures (e.g., shared memory).

• Hermes (JS Engine)
  - Fast, embeddable engine with low memory usage.
  - Supports bytecode ahead-of-time compilation and integrates with JSI.
  - Enables better startup perf and smaller memory footprint.

• TurboModules
  - New module system using JSI/host objects.
  - Modules are lazily initialized and can expose synchronous/native-backed functions safely.
  - Less overhead than classic bridge-native modules.

• Fabric (Renderer / Mounting Layer)
  - New rendering pipeline that replaces UIManager for view creation and updates.
  - Uses Shadow Tree (now more C++/native-backed) and a Mounting layer that writes directly to native views.
  - Enables concurrent layout & mounting and better integration with async rendering.
  - Supports synchronized updates for animations and gestures.

• Shadow Tree (modern)
  - Represents UI layout nodes; in new arch this is closer to native/C++ for performance.
  - Yoga layout can run where appropriate; Fabric integrates layout and mounting.

• Event Handling (modern)
  - Event propagation optimized: native events are dispatched with less serialization,
    and can be coalesced or handled closer to JS without full round-trips.

• Mounting Layer / Surface Presenter
  - Responsible for applying computed layout and view properties to actual native views.
  - Fabric’s Mounting Layer is more direct and performant than UIManager in old arch.
*/

/* ===========================================================================
📌 7. PER-COMPONENT ROLE (concise table-style)
===============================================================================
JS Engine (Hermes / JSC)        | Runs JS, executes React reconciler
JS Thread / React Reconciler    | Runs component render() and diffing
JSI (C++ API)                   | Exposes native host objects to JS directly
TurboModules                    | Fast native modules via JSI (no bridge serialization)
Fabric Renderer & Mounting      | New UI pipeline: layout -> mounting -> update native views
UIManager (legacy)              | Old path that applied updates from Bridge
Bridge (legacy)                 | Async serialized messaging (old communication channel)
Yoga                            | Flexbox layout engine (can be integrated with Fabric)
Native Modules (legacy)         | Old bridge-based native APIs
Event Pipe / Gesture handler    | Efficient event dispatching (modernized in new arch)
C++ Host Objects                | Native-side objects accessible through JSI
*/

/* ===========================================================================
📌 8. KEY DIFFERENCES — Old vs New (practical)
===============================================================================
1) Communication:
   - Old: JS ↔ Bridge (serialized messages) => async, higher latency.
   - New: JS ↔ JSI host objects => direct calls/no serialization when using JSI/TurboModules.

2) Native Modules:
   - Old: Bridge-exposed, mostly async.
   - New: TurboModules via JSI, can be sync or async, lower overhead.

3) Rendering & mounting:
   - Old: UIManager applies batched commands from JS.
   - New: Fabric handles mounting with a closer-to-native Shadow Tree and better concurrency.

4) Events:
   - Old: native events serialized to JS.
   - New: events can be dispatched with less overhead and more coalescing.

5) Performance:
   - New architecture reduces round-trips, improves animation smoothness, and lowers GC/serialization costs.
*/

/* ===========================================================================
📌 9. WHY THIS MATTERS — practical benefits
===============================================================================
- Smoother animations: fewer bridge hops, ability to do more on native side.
- Lower latency for native calls (e.g., sensors, synchronous reads).
- Better startup & memory when using Hermes.
- Easier to build concurrency-friendly renderers and safe multi-threaded patterns.
- Gradual migration possible — app can run mixed old + new components during transition.
*/

/* ===========================================================================
📌 10. COMMON RN UI COMPONENTS & HOW ARCH AFFECTS THEM
===============================================================================
(These are the typical exported components and their responsibilities)

• <View>
  - Container, maps to platform native container (UIView/Android View).
  - In new arch Fabric, creation & updates are handled via Fabric mounting layer.

• <Text>
  - Native text widget; text measurement affects layout. Fabric improves text rendering flow.

• <Image>
  - Native image handling; still uses native subsystems for decoding/caching.

• <ScrollView> / <FlatList> / <SectionList>
  - Heavier components where avoiding bridge overhead matters most.
  - New arch reduces overhead for events (scroll) and improves virtualization interactions.

• Gesture / Reanimated
  - Gesture handlers can be implemented to run on native side for fluidity.
  - Reanimated v2 + Fabric + JSI allows animations on UI thread with less JS blocking.

• Native UI Modules (Picker, Camera)
  - TurboModules speed up access to these with lower-call overhead.

Note: From a developer POV, component APIs remain similar; architecture changes mainly improve performance under the hood.
*/

/* ===========================================================================
📌 11. ASCII DIAGRAM — simplified flow
===============================================================================
 OLD:
  [JS Engine] --(serialized bridge)--> [UIManager / Native Modules]
     ^                                       |
     | <--- events (serialized) --------------|

 NEW:
  [JS Engine (Hermes)]
       ↕  (JSI: host objects)
  [C++ Host Objects / TurboModules / Fabric]
       ↕
  [Native Views / Platform APIs]
     (events more direct; mounting more concurrent)

*/

/* ===========================================================================
📌 12. MIGRATION NOTES & PRACTICAL CONSIDERATIONS
===============================================================================
- RN supports gradual adoption: you can enable Fabric/TurboModules per module or surface.
- Hermes is recommended for best integration with JSI.
- Some native libraries may need updates to support TurboModules or Fabric.
- Test thoroughly: layout/measurement and text rendering differences can surface.
- Profiling tools: use Flipper, systrace, and RN performance monitors to find bottlenecks.
*/

/* ===========================================================================
📌 13. INTERVIEW Q&A (short answers)
===============================================================================
Q1: What is the Bridge in React Native?
A: The Bridge is the legacy async channel that serialized messages between JS and native.

Q2: What is JSI?
A: JSI is a C++ interface that exposes native host objects to the JS engine, enabling direct calls.

Q3: What are TurboModules?
A: Modern native module system using JSI for faster, lazy, and lower-overhead access to native APIs.

Q4: What is Fabric?
A: Fabric is the new renderer/mounting layer that applies UI updates to native views more directly and concurrently.

Q5: Why prefer Hermes?
A: Hermes integrates well with JSI, improves startup time, and reduces memory/GC overhead in RN apps.

Q6: Does the new architecture change component APIs?
A: Public JS APIs mostly remain the same; under-the-hood implementation changes for performance.

*/

/* ===========================================================================
📌 14. QUICK CHEAT SHEET FOR IMPLEMENTATION / Debugging
===============================================================================
- If you see bridge-related lag: consider migrating heavy interactions to TurboModules or native.
- For janky animations: offload to native-driven animations (reanimated/native driver), use Fabric if available.
- Enable Hermes for better integration with JSI.
- Use profiling (Flipper, systrace) to find whether JS thread, native UI thread, or bridge is the bottleneck.
- Check library compatibility for Fabric/TurboModules before upgrading RN.
*/

/* ===========================================================================
📌 15. PRACTICAL EXAMPLE (runnable) — minimal screen showing comparison
===============================================================================
Note: This is a simple UI summarizing both architectures. It does not toggle runtime
architectures — it just serves as a study aid you can paste into your app.
*/

import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

export function ArchitectureSummaryScreen() {
  return (
    <ScrollView contentContainerStyle={ui.container}>
      <Text style={ui.h1}>React Native — Architecture Summary</Text>

      <View style={ui.card}>
        <Text style={ui.cardTitle}>Old Architecture (Bridge)</Text>
        <Text style={ui.cardText}>
          JS ↔ Bridge (serialized) ↔ Native. Async messages, UIManager applies
          updates. Higher latency for many small calls.
        </Text>
      </View>

      <View style={ui.card}>
        <Text style={ui.cardTitle}>New Architecture (JSI + Fabric)</Text>
        <Text style={ui.cardText}>
          JS (Hermes) ⇄ JSI host objects → TurboModules + Fabric → Native. Fewer
          round-trips, direct object access, better animation & concurrency.
        </Text>
      </View>

      <View style={ui.card}>
        <Text style={ui.cardTitle}>Why It Matters</Text>
        <Text style={ui.cardText}>
          Faster native calls, smoother animations, lower serialization
          overhead, and better startup/perf when using Hermes + Fabric +
          TurboModules.
        </Text>
      </View>
    </ScrollView>
  );
}

/* ===========================================================================
   UI Styles for ArchitectureSummaryScreen
   (separate from top Example to keep file organized)
   ===========================================================================
*/
const ui = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  h1: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#f7f9fc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

/* ===========================================================================
📌 16. FINAL NOTES — TL;DR
===============================================================================
- Old RN used an async serialized Bridge — simple but costly for many calls.
- New RN uses JSI, TurboModules, Fabric to give JS direct, low-overhead access to native capabilities.
- For developers: APIs stay similar but performance and behavior improve — adopt Hermes, check lib compatibility, and profile during migration.
*/

/* ===========================================================================
📌 17. Want next?
===============================================================================
If you want, I can:
  ✅ create "migration checklist" for upgrading an app to new architecture
  ✅ write a simple TurboModule example (JS + native stub) — conceptual only
  ✅ add Reanimated + Gesture integration notes for Fabric
  ✅ convert this to printable Markdown or PDF

Tell me which one and I’ll give it in your single-file JS Notes format.
*/
