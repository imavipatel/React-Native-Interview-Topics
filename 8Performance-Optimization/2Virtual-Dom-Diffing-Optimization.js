/**
 * ===================================================================
 * 📘 Virtual DOM Diffing – Optimizing Reconciliation
 * ===================================================================
 *
 * 🟢 Introduction
 * -------------------------------------------------------------------
 * - React uses a **Virtual DOM (VDOM)** to efficiently update the UI.
 * - Instead of directly updating the **Real DOM** (which is slow),
 *   React creates a lightweight copy of the DOM in memory (VDOM).
 * - When state/props change:
 *   1. React creates a new VDOM tree.
 *   2. It compares (diffs) the new tree with the old one.
 *   3. Only the **changed nodes** are updated in the real DOM.
 * - This process is called **Reconciliation**.
 *
 * ===================================================================
 * 🔹 Why Virtual DOM?
 * -------------------------------------------------------------------
 * - Direct DOM manipulation is expensive → re-calculating styles, layout,
 *   and repainting can be very slow.
 * - VDOM allows React to batch updates and minimize DOM operations.
 * - Optimizes UI rendering → fast & smooth user experience.
 *
 * ===================================================================
 * 🔹 Diffing Algorithm (Key Points)
 * -------------------------------------------------------------------
 * React’s diffing algorithm has **three main rules**:
 *
 * 1️⃣ Element Type Check
 *    - If two elements are of different types → React destroys old tree
 *      and builds a new one.
 *    Example: <div> → <span> will re-render fully.
 *
 * 2️⃣ Same Type, Compare Attributes
 *    - If same type → React compares props and updates only changed attributes.
 *    Example:
 *      Old: <button class="red" />
 *      New: <button class="blue" />
 *      ✅ React only updates class → "blue".
 *
 * 3️⃣ Children with Keys
 *    - For lists, React uses **keys** to track items.
 *    - If keys are missing or incorrect, React re-renders all items,
 *      causing performance issues.
 *    Example:
 *      ✅ Good: items.map(item => <li key={item.id}>{item.name}</li>)
 *      ❌ Bad: items.map((item, i) => <li key={i}>{item.name}</li>)
 *
 * ===================================================================
 * 🔹 Example (React Web)
 */
function Example({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li> // Using key = id
      ))}
    </ul>
  );
}

/**
 * - If an item is added/removed:
 *   ✅ With correct keys → Only changed items re-render.
 *   ❌ Without keys → Entire list re-renders.
 *
 * ===================================================================
 * 🔹 Example (React Native – FlatList)
 */
import { FlatList, Text } from "react-native";

function ItemList({ data }) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()} // ✅ Stable key
      renderItem={({ item }) => <Text>{item.name}</Text>}
    />
  );
}

/**
 * ✅ FlatList internally uses Virtual DOM diffing + keys to optimize rendering.
 * ❌ If you don’t provide keys properly → list performance suffers.
 *
 * ===================================================================
 * 🔹 Optimizing Reconciliation
 * -------------------------------------------------------------------
 * ✅ Best Practices:
 * 1. Always use **stable keys** for list items (not index).
 * 2. Avoid unnecessary re-renders with **React.memo** or **PureComponent**.
 * 3. Split large components into smaller ones → reduces diffing work.
 * 4. Use **lazy loading/code-splitting** for large trees.
 * 5. Minimize inline functions & object creations in JSX (use useCallback/useMemo).
 *
 * ===================================================================
 * 🔹 Performance Visualization
 * -------------------------------------------------------------------
 * State update →
 *  🔹 Old VDOM (snapshot of UI before change)
 *  🔹 New VDOM (UI after change)
 *  🔹 React compares both (diffing algorithm)
 *  🔹 Only differences are applied to the Real DOM
 *
 * Example:
 * Old: <h1 class="red">Hello</h1>
 * New: <h1 class="blue">Hello</h1>
 * React: Only changes class="red" → "blue", text stays same.
 *
 * ===================================================================
 * 🔹 Q&A (Interview Style)
 * -------------------------------------------------------------------
 * Q1: What is Virtual DOM?
 *   → A lightweight copy of the real DOM used by React to optimize UI updates.
 *
 * Q2: How does React decide what to update?
 *   → By comparing the new Virtual DOM with the old one (diffing).
 *
 * Q3: Why are keys important in React lists?
 *   → Keys help React uniquely identify elements and minimize re-renders.
 *
 * Q4: What happens if two components are of different types?
 *   → React destroys the old one and mounts a new one.
 *
 * ===================================================================
 * ✅ Final Takeaways
 * -------------------------------------------------------------------
 * - Virtual DOM makes UI updates faster by minimizing direct DOM operations.
 * - Diffing algorithm ensures only changed parts of the UI re-render.
 * - Using **keys in lists** and avoiding unnecessary re-renders are crucial
 *   for performance optimization.
 * ===================================================================
 */
