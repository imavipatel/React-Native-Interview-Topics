/**
 * ==============================================================
 * 📘 Performance Optimization for Global State Re-render Problems
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 The Problem
 * - In React, when **global state** (Context, Redux, Zustand, etc.) updates,
 *   every component **subscribed to that state** may re-render.
 * - This causes **unnecessary renders** → slow UI, poor performance.
 *
 * Example:
 *   - A global `user` object is updated (like `user.name`).
 *   - Even components that only need `user.theme` re-render unnecessarily.
 *
 * --------------------------------------------------------------
 * 🔹 Why does it happen?
 * 1) React re-renders whenever **props or context values change**.
 * 2) In global state, changes propagate to **all consumers**.
 * 3) Without optimization, every child re-checks + re-renders.
 *
 * --------------------------------------------------------------
 * 🔹 Optimization Strategies
 *
 * ✅ 1. Slice Global State (Reduce Scope)
 * - Instead of one giant context/store, create **multiple smaller stores**.
 * - Example: `AuthContext`, `ThemeContext`, `CartContext` separately.
 *
 * ✅ 2. Selector Functions
 * - Use **selectors** (like in Redux’s `useSelector`) to subscribe
 *   only to the specific part of the state needed.
 *
 * ✅ 3. Memoization
 * - Use `React.memo` for components so they only re-render when
 *   relevant props change.
 * - Use `useMemo` and `useCallback` inside components.
 *
 * ✅ 4. Avoid Passing Anonymous Functions
 * - Functions declared inside JSX (`onPress={() => ...}`) create
 *   new references every render → causes re-renders.
 * - Fix: Use `useCallback`.
 *
 * ✅ 5. Windowing & Virtualization
 * - For big lists, use **FlatList, SectionList, RecyclerListView, FlashList**.
 *
 * ✅ 6. Store State Locally (When Possible)
 * - Don’t put everything in global state.
 * - Example: A modal’s open/close state should stay in local state,
 *   not in Redux.
 *
 * ✅ 7. Optimized Libraries
 * - Zustand, Jotai, Recoil → allow fine-grained subscriptions,
 *   so only components using changed state re-render.
 *
 * ✅ 8. Immutable Updates
 * - Ensure reducers return new objects instead of mutating old state,
 *   so React can properly detect changes.
 *
 * ==============================================================
 * 🔹 Code Examples
 * --------------------------------------------------------------
 *
 * Example 1: Using Redux `useSelector` with shallow equality
 */
import { useSelector } from "react-redux";

function UserName() {
  // ✅ Only re-renders if user.name changes
  const name = useSelector(
    (state) => state.user.name,
    (a, b) => a === b
  );
  return <Text>{name}</Text>;
}

/**
 * --------------------------------------------------------------
 * Example 2: Using React.memo to prevent unnecessary renders
 */
const Child = React.memo(({ value }) => {
  console.log("Rendered Child");
  return <Text>{value}</Text>;
});

/**
 * --------------------------------------------------------------
 * Example 3: Avoid anonymous functions with useCallback
 */
function ButtonExample() {
  const [count, setCount] = useState(0);

  // ✅ Stable function reference
  const increment = useCallback(() => setCount((c) => c + 1), []);

  return <Button title="Add" onPress={increment} />;
}

/**
 * --------------------------------------------------------------
 * Example 4: Zustand (fine-grained subscription)
 */
import create from "zustand";

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

function CounterValue() {
  const count = useStore((state) => state.count); // ✅ Subscribes only to "count"
  return <Text>{count}</Text>;
}

function IncrementButton() {
  const increment = useStore((state) => state.increment);
  return <Button title="Add" onPress={increment} />;
}

/**
 * ==============================================================
 * 📊 Best Practices Table
 * ==============================================================
 *
 * | Problem                        | Solution                                  |
 * |--------------------------------|-------------------------------------------|
 * | All consumers re-render on update | Split contexts / multiple stores        |
 * | Component re-renders on unrelated props | Use React.memo, selectors        |
 * | New function created every render | Use useCallback                         |
 * | Heavy recomputation             | Use useMemo                              |
 * | Large list rendering            | Use virtualization (FlatList/FlashList) |
 * | Too much global state           | Keep transient state local               |
 *
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: Why does global state cause unnecessary re-renders?
 *    → Because any update in the store/context triggers re-renders
 *      for all consumers, even if they don’t use the changed value.
 *
 * Q2: How to optimize Redux selectors?
 *    → Use `useSelector` with shallow equality, or Reselect library
 *      to memoize derived data.
 *
 * Q3: When should state be local instead of global?
 *    → If it only affects a single component (modal open, input text),
 *      keep it local. Use global only for shared/critical state.
 *
 * Q4: Which libraries solve re-render problems better than Context?
 *    → Zustand, Recoil, Jotai → allow fine-grained subscriptions.
 *
 * Q5: Real-world Example?
 *    → Chat App: Don’t store input field text in Redux. Keep it local,
 *      store only the messages list globally.
 *
 * ==============================================================
 */
