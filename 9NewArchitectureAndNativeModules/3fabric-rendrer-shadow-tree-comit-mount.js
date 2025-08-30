/********************************************
 * 📘 Fabric Renderer – Shadow Tree, Commit/Mount Phases
 ********************************************/

/**
 * 🟢 THEORY:
 * - Fabric is the **new rendering system** in React Native (part of New Architecture).
 * - Replaces the old renderer (Paper).
 * - Uses **JSI (JavaScript Interface)** for faster communication.
 * - Main idea: Represent UI with a **Shadow Tree** and commit changes efficiently.
 *
 * 🔹 Key Concepts:
 * 1. **Shadow Tree**
 *    - Virtual representation of UI components (like Virtual DOM in React).
 *    - Each React component maps to a "Shadow Node" in the tree.
 *    - Contains layout information (position, size, style).
 *    - Managed by Yoga layout engine.
 *
 * 2. **Commit Phase**
 *    - After React reconciles updates, Fabric builds a **new Shadow Tree**.
 *    - Diffing happens between old and new Shadow Tree.
 *    - Changes are calculated (what needs to update).
 *    - Results in a "commit" – a finalized Shadow Tree ready for mounting.
 *
 * 3. **Mount Phase**
 *    - The committed Shadow Tree is applied to the **UI Manager**.
 *    - Native views are created/updated/deleted accordingly.
 *    - Happens on the UI thread → reflects updates visually.
 *
 * 🔹 Flow:
 * React State/Props change → Reconciliation → Shadow Tree diff → Commit → Mount → Native UI updated
 */

/**
 * 🔹 Example Flow (Fabric Renderer):
 *
 * function App() {
 *   const [count, setCount] = React.useState(0);
 *   return <Text>{count}</Text>;
 * }
 *
 * 1. Initial Render → Shadow Tree created with <Text count=0>
 * 2. setCount(1) → Reconciliation builds new Shadow Tree (<Text count=1>)
 * 3. Diffing detects change in text value
 * 4. Commit Phase → Finalize new Shadow Tree
 * 5. Mount Phase → UI Manager updates native Text view
 */

/**
 * 🔹 Comparison – Fabric vs Paper Renderer
 *
 * | Feature            | Paper (Old)                   | Fabric (New)                       |
 * |--------------------|--------------------------------|-------------------------------------|
 * | Communication      | Bridge (async JSON)           | JSI (direct, sync/async supported) |
 * | Data Structure     | UIManager manages views       | Shadow Tree manages UI state       |
 * | Diffing            | UIManager calculates diffs    | Shadow Tree + Commit phase         |
 * | Performance        | Slower (bridge bottleneck)    | Faster, less overhead              |
 * | Type Safety        | Weak                         | Strong (codegen + JSI)             |
 * | Layout Engine      | Yoga                          | Yoga (still used)                  |
 * | Mounting           | Managed via bridge            | Managed via UIManager directly     |
 * | Priority Updates   | ❌ Not supported               | ✅ Supported (Concurrent React)     |
 */

/**
 * 🔹 Detailed Steps (Fabric Lifecycle)
 *
 * 1. **Render Phase (JS thread)**:
 *    - React reconciles components
 *    - Creates new Shadow Tree
 *
 * 2. **Commit Phase (Fabric)**:
 *    - Diff old vs new Shadow Tree
 *    - Decide changes (add/remove/update nodes)
 *    - Produce a committed Shadow Tree
 *
 * 3. **Mount Phase (UI thread)**:
 *    - Apply committed changes to native UI
 *    - Views are created/updated/deleted
 *
 * 4. **Final UI Updated**
 *
 * This system ensures **batched + efficient updates**.
 */

/**
 * 🔹 Example with commit/mount explained
 */
import React, { useState } from "react";
import { Text, Button, View } from "react-native";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <View>
      <Text>Count: {count}</Text>
      <Button title="Increase" onPress={() => setCount(count + 1)} />
    </View>
  );
}

/**
 * Flow:
 * - Initial Render → Shadow Tree has <Text "Count: 0">
 * - User presses button:
 *    Render Phase: React builds new Shadow Tree with <Text "Count: 1">
 *    Commit Phase: Diff finds text change
 *    Mount Phase: Native UIManager updates Text view
 */

/**
 * ❓ Q&A for Interviews:
 *
 * Q: What is the Shadow Tree in Fabric?
 * A: A virtual tree that represents React components in native space,
 *    used for layout and diffing before UI updates.
 *
 * Q: What happens in the Commit phase?
 * A: Old vs new Shadow Trees are compared, changes are finalized, and
 *    a committed tree is produced.
 *
 * Q: What happens in the Mount phase?
 * A: The committed Shadow Tree changes are applied to native views
 *    by the UIManager (on UI thread).
 *
 * Q: How does Fabric improve performance over Paper?
 * A: Removes the bridge bottleneck, uses JSI, supports concurrent React,
 *    and applies UI updates more efficiently via Shadow Tree commits.
 *
 * Q: Does Fabric still use Yoga for layout?
 * A: Yes, Yoga is still used to calculate layouts inside the Shadow Tree.
 */
