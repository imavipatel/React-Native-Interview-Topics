/**
 * ===================================================================
 * 📘 Optimizing FlatList – keyExtractor, getItemLayout, removeClippedSubviews
 * ===================================================================
 *
 * 🟢 Introduction
 * -------------------------------------------------------------------
 * - FlatList in React Native is a **highly optimized list component**.
 * - But with large data sets, performance can suffer (slow scrolls, lag).
 * - To make FlatList smooth & efficient, React Native provides props
 *   like `keyExtractor`, `getItemLayout`, and `removeClippedSubviews`.
 *
 * ===================================================================
 * 🔹 1. keyExtractor
 * -------------------------------------------------------------------
 * - FlatList uses **keys** to identify items in the list.
 * - By default, it tries to use the `key` property from your data.
 * - If not provided, you must define `keyExtractor` function.
 *
 * ✅ Why important?
 * - Helps React Native **efficiently re-render only changed items**.
 * - Without stable keys, FlatList may unnecessarily re-render entire list.
 *
 * ✅ Example:
 */
import { FlatList, Text } from "react-native";

function UserList({ users }) {
  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()} // ✅ Stable key
      renderItem={({ item }) => <Text>{item.name}</Text>}
    />
  );
}

/**
 * ❌ Bad: keyExtractor={(item, index) => index.toString()}
 * - Causes issues when items are added/removed (re-renders everything).
 *
 * ===================================================================
 * 🔹 2. getItemLayout
 * -------------------------------------------------------------------
 * - Provides **fixed height/width** of list items to FlatList.
 * - FlatList can then **skip measuring items** during scroll,
 *   making it much faster with large datasets.
 *
 * ✅ Why important?
 * - Improves performance for large lists (e.g., 10k+ items).
 * - Prevents lag when scrolling.
 *
 * ✅ Example:
 */
function MessagesList({ messages }) {
  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Text>{item.text}</Text>}
      getItemLayout={(data, index) => ({
        length: 50, // item height (fixed)
        offset: 50 * index, // position of item
        index,
      })}
    />
  );
}

/**
 * ✅ Best Use Case:
 * - When list items have **fixed height/width**.
 * ❌ Not useful for dynamic-sized items.
 *
 * ===================================================================
 * 🔹 3. removeClippedSubviews
 * -------------------------------------------------------------------
 * - Boolean prop (`true/false`).
 * - When `true`, FlatList will **unmount items that are out of view**.
 * - Helps reduce memory usage and improves performance.
 *
 * ✅ Why important?
 * - Keeps memory usage low → especially useful with **images, videos**,
 *   or when rendering thousands of items.
 * - Great for **infinite scroll** or **feeds**.
 *
 * ✅ Example:
 */
function ProductList({ products }) {
  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Text>{item.name}</Text>}
      removeClippedSubviews={true} // ✅ Improve memory performance
    />
  );
}

/**
 * ⚠️ Note:
 * - Sometimes can cause issues when list height is not well defined.
 * - Works best when FlatList has **fixed height** (inside a parent container).
 *
 * ===================================================================
 * 🔹 Other FlatList Optimizations (Bonus Tips)
 * -------------------------------------------------------------------
 * 1. `initialNumToRender` → Number of items to render initially (avoid too many).
 * 2. `maxToRenderPerBatch` → Controls how many items render per batch.
 * 3. `windowSize` → Number of screens worth of content to render (default 21).
 * 4. `renderItem` → Keep it memoized (use `React.memo`).
 * 5. Use `PureComponent` or `React.memo` for list items.
 * 6. Use `getItemLayout` for fixed-size rows.
 *
 * ===================================================================
 * 🔹 Q&A (Interview Style)
 * -------------------------------------------------------------------
 * Q1: Why do we need keyExtractor in FlatList?
 *   → To uniquely identify items and avoid unnecessary re-renders.
 *
 * Q2: When should we use getItemLayout?
 *   → When list items have a fixed height/width for faster scroll performance.
 *
 * Q3: What does removeClippedSubviews do?
 *   → Unmounts items that go out of view, saving memory & improving performance.
 *
 * Q4: What are some best practices for FlatList optimization?
 *   → Use keyExtractor, getItemLayout, removeClippedSubviews, memoized renderItem,
 *     and adjust batch/windowSize settings.
 *
 * ===================================================================
 * ✅ Final Takeaways
 * -------------------------------------------------------------------
 * - `keyExtractor`: Prevents unnecessary re-renders (use stable IDs, not index).
 * - `getItemLayout`: Skips item measurement for **fixed-size rows** → faster scroll.
 * - `removeClippedSubviews`: Saves memory by unmounting off-screen items.
 * - Together, these props make FlatList much more performant for large datasets.
 * ===================================================================
 */
