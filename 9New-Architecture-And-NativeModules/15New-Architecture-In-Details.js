/*********************************************************
 * 📘 React Native – New Architecture (Detailed Notes)
 *********************************************************/

/********************************************
 * 🟢 Why a New Architecture?
 ********************************************/
/**
 * - The old React Native used the **Bridge** model.
 * - In this model:
 *    JS Thread ↔ Bridge (JSON messages) ↔ Native Threads
 * - Problems:
 *   ❌ Every call had to be serialized → slow.
 *   ❌ High overhead for frequent UI updates (animations, gestures).
 *   ❌ Hard to do synchronous calls between JS & Native.
 *   ❌ Large apps suffered from memory & startup performance issues.
 *
 * ✅ The New Architecture was introduced to fix these issues.
 */

/********************************************
 * 🟢 Main Components of the New Architecture
 ********************************************/

/**
 * 1. **JSI (JavaScript Interface)**
 *    - A new layer between JS ↔ Native.
 *    - Written in C++.
 *    - Allows direct function calls between JS ↔ Native (no JSON serialization).
 *    - Enables **sync + async** calls.
 *
 *    Example:
 *    - Old Bridge: JS asks Native → waits for response via serialized message.
 *    - JSI: JS can directly call a C++ function and get an immediate result.
 *
 *    Benefits:
 *      ✅ Faster communication.
 *      ✅ Shared memory access possible.
 *      ✅ Paves way for advanced libraries (e.g. Reanimated 2).
 *
 * --------------------------------------------------
 *
 * 2. **TurboModules**
 *    - New way of writing Native Modules.
 *    - Lazy loading → loads only when needed (not all at startup).
 *    - Uses JSI for direct calls.
 *    - Auto-generated bindings via **Codegen**.
 *
 *    Example:
 *    - Instead of eagerly loading `CameraModule`, it loads only when JS calls it.
 *
 *    Benefits:
 *      ✅ Smaller startup time.
 *      ✅ Faster module access.
 *      ✅ Strong type safety.
 *
 * --------------------------------------------------
 *
 * 3. **Fabric Renderer**
 *    - A new rendering engine for React Native UI.
 *    - Works with JSI & TurboModules.
 *    - Uses a **Shadow Tree** to calculate layout before applying it to native UI.
 *
 *    Steps:
 *      - React reconciler builds a Virtual DOM.
 *      - Fabric creates a Shadow Tree (layout & diff).
 *      - Commits changes asynchronously to Native Views.
 *
 *    Benefits:
 *      ✅ Async UI rendering (no frame drops).
 *      ✅ Better layout diffing → efficient updates.
 *      ✅ Easier to integrate React Concurrent features.
 *
 * --------------------------------------------------
 *
 * 4. **Codegen**
 *    - A tool that auto-generates Native ↔ JS bindings.
 *    - You define a TypeScript/Flow spec → Codegen creates C++/Java/Obj-C code.
 *    - Guarantees **type safety**.
 *
 *    Benefits:
 *      ✅ No manual boilerplate.
 *      ✅ Fewer runtime errors.
 *      ✅ Consistency across platforms.
 *
 * --------------------------------------------------
 *
 * 5. **Bridgeless Mode**
 *    - Removes the old "Bridge" completely.
 *    - Purely depends on JSI + TurboModules + Fabric.
 *    - Avoids serialization bottlenecks.
 */

/********************************************
 * 🟢 How It All Connects (Flow)
 ********************************************/
/**
 * Old Architecture:
 *   JS → Bridge (JSON) → Native (UI/Modules)
 *
 * New Architecture:
 *   JS → JSI → (TurboModules, Fabric) → Native
 *
 * Key Difference:
 *   - No JSON serialization.
 *   - Direct function calls.
 *   - Modules loaded only when needed.
 */

/********************************************
 * 🟢 Example – TurboModule Spec with Codegen
 ********************************************/
// BatteryModule.ts (TypeScript spec for Codegen)
/*
import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  getBatteryLevel(): Promise<number>;
}

export default TurboModuleRegistry.getEnforcing < Spec > "BatteryModule";
*/
/**
 * - Codegen generates native bindings.
 * - JS can now call `BatteryModule.getBatteryLevel()`.
 * - No bridge → direct native access.
 */

/********************************************
 * 🟢 Example – Fabric UI Update Flow
 ********************************************/
/**
 * Example: Updating a <Text> in React Native
 *
 * Old Bridge:
 *   JS → Bridge (serialize JSON) → Native → UI updated (slow)
 *
 * New Fabric:
 *   JS → JSI → Shadow Tree diff → Commit to Native → UI updated (fast)
 *
 * Result: Faster UI updates, less dropped frames.
 */

/********************************************
 * 🟢 Benefits of New Architecture
 ********************************************/
/**
 * ✅ Performance boost:
 *    - Direct calls (JSI).
 *    - Faster rendering (Fabric).
 *    - Smaller startup (TurboModules lazy loading).
 *
 * ✅ Modern React support:
 *    - Works with React 18 Concurrent Mode.
 *    - Async rendering supported.
 *
 * ✅ Type Safety:
 *    - Codegen ensures correctness between JS & Native.
 *
 * ✅ Future Ready:
 *    - Easier to build advanced libraries like Reanimated 2, GestureHandler.
 */

/********************************************
 * 🟢 Challenges / Migration
 ********************************************/
/**
 * - Migrating old NativeModules → TurboModules.
 * - UI components → Fabric components.
 * - Third-party packages must be updated.
 * - Requires app rebuild + config changes.
 */

/********************************************
 * 🟢 Interview Q&A
 ********************************************/
/**
 * Q: What problem does JSI solve?
 * A: Removes serialization overhead & allows sync calls.
 *
 * Q: How are TurboModules better than NativeModules?
 * A: Lazy loading + JSI direct calls → faster & lighter.
 *
 * Q: What is Fabric Renderer?
 * A: New async UI renderer using Shadow Tree for layout + commit phases.
 *
 * Q: Why is Codegen important?
 * A: Ensures type safety + auto-generates native bindings.
 *
 * Q: What is Bridgeless mode?
 * A: Mode where RN runs fully on JSI + TurboModules + Fabric (no old bridge).
 */
