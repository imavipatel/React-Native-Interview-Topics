/*******************************************************
 * 📘 React Native Notes
 * Topic: New Architecture & React 18 Concurrent Features
 *******************************************************/

/********************************************
 * 🟢 What is the New Architecture in React Native?
 ********************************************/
/**
 * - The **old React Native architecture** used the **Bridge**.
 *   - JS thread ↔ Bridge ↔ Native threads.
 *   - Every message = serialized JSON → costly & slow.
 *   - Caused perf issues (lag, frame drops, large app startup time).
 *
 * - The **New Architecture** improves this by:
 *   ✅ **JSI (JavaScript Interface):** Direct JS ↔ C++ ↔ Native calls (no Bridge).
 *   ✅ **TurboModules:** Faster native modules with lazy loading.
 *   ✅ **Fabric Renderer:** Modern rendering system with Shadow Tree & async commits.
 *   ✅ **Codegen:** Auto-generates C++ bindings from TypeScript specs.
 *   ✅ **Bridgeless Mode:** Fully removes the old bridge.
 */

/********************************************
 * ⚡ Key Components of New Architecture
 ********************************************/
/**
 * 1. JSI
 *    - JS can call C++ directly (no serialization).
 *    - Enables synchronous + asynchronous native methods.
 *
 * 2. TurboModules
 *    - Replacement for NativeModules.
 *    - Loads modules only when required (lazy loading).
 *    - Direct JSI calls → less overhead.
 *
 * 3. Fabric Renderer
 *    - New rendering pipeline for UI.
 *    - Manages Shadow Tree & async UI rendering.
 *    - Faster layout, diffing, and mounting.
 *
 * 4. Codegen
 *    - Automatically generates TypeScript ↔ Native interfaces.
 *    - Ensures type-safety between JS ↔ Native.
 *
 * 5. Bridgeless
 *    - Removes the old Bridge completely.
 *    - Pure JSI + TurboModules + Fabric.
 */

/********************************************
 * 🟢 React 18 Concurrent Features
 ********************************************/
/**
 * - React 18 introduced **Concurrent Rendering**:
 *   ✅ Multiple UI tasks can be worked on simultaneously.
 *   ✅ Avoids blocking the main thread.
 *   ✅ Helps keep apps responsive even under heavy load.
 *
 * - Key Features:
 *   1. **Automatic Batching**
 *      - Groups multiple state updates into one render → faster.
 *   2. **Transitions**
 *      - Mark non-urgent updates (like navigation) separately.
 *      - UI stays responsive while heavy work happens in background.
 *   3. **Suspense**
 *      - Used with `React.lazy` for async UI loading.
 *   4. **useId**
 *      - Stable unique IDs for accessibility / hydration.
 *   5. **useTransition**
 *      - Allows marking updates as "low priority".
 *   6. **useDeferredValue**
 *      - Delays expensive UI updates without blocking urgent updates.
 */

/********************************************
 * ⚡ How New Architecture + React 18 Work Together
 ********************************************/
/**
 * - RN New Architecture (JSI + Fabric + TurboModules) removes bottlenecks.
 * - React 18 Concurrent Mode ensures rendering is non-blocking.
 *
 * Together:
 *   ✅ Smoother animations (JSI avoids bridge lag).
 *   ✅ Faster list rendering (Fabric async commit).
 *   ✅ Non-blocking state updates (Concurrent features).
 *   ✅ Lazy load screens/components without freezing UI.
 */

/********************************************
 * 🟢 Example: useTransition with Navigation
 ********************************************/
import React, { useState, useTransition } from "react";
import { Button, Text, View } from "react-native";

export default function App() {
  const [page, setPage] = useState("Home");
  const [isPending, startTransition] = useTransition();

  const navigate = (newPage) => {
    startTransition(() => {
      setPage(newPage);
    });
  };

  return (
    <View>
      <Button title="Go to Profile" onPress={() => navigate("Profile")} />
      {isPending && <Text>⏳ Loading...</Text>}
      <Text>Current Page: {page}</Text>
    </View>
  );
}

/********************************************
 * 🟢 Example: TurboModule Spec (New Arch)
 ********************************************/
// Example: Battery Module Spec (TypeScript) → Codegen
/*
import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  getBatteryLevel(): Promise<number>;
}

export default TurboModuleRegistry.getEnforcing<Spec>("BatteryModule");
*/

/********************************************
 * 🔑 Interview Q&A Recap
 ********************************************/
/**
 * Q: What is the main problem with the old Bridge?
 * A: Serialization & async message passing caused delays.
 *
 * Q: How do TurboModules improve performance?
 * A: Direct JSI calls, lazy loading, no Bridge.
 *
 * Q: What is Fabric Renderer?
 * A: New rendering pipeline using Shadow Tree & async commit.
 *
 * Q: How do React 18 concurrent features help RN apps?
 * A: They keep UI responsive by splitting urgent vs non-urgent updates.
 *
 * Q: How does New Architecture + React 18 improve RN overall?
 * A: Native communication is faster (New Arch) + rendering is non-blocking (Concurrent Mode).
 */
