/**
 * =============================================================================
 * 📘 RecyclerListView vs FlashList vs FlatList (React Native Lists Comparison)
 * =============================================================================
 *
 * 🟢 Introduction
 * -----------------------------------------------------------------------------
 * - React Native apps often render **long lists** (feeds, chats, catalogs).
 * - The default `FlatList` works well but struggles with **very large datasets**
 *   (thousands of rows → performance drops).
 * - Community libraries like **RecyclerListView** and **FlashList** improve
 *   performance by handling rendering differently.
 *
 * =============================================================================
 * 🔹 1. FlatList (Built-in React Native List)
 * -----------------------------------------------------------------------------
 * ✅ Features:
 * - Virtualized list (only renders items in the visible window).
 * - Supports props like `keyExtractor`, `getItemLayout`, `removeClippedSubviews`.
 * - Simple and **easy to use** out-of-the-box.
 *
 * ❌ Limitations:
 * - Struggles with **very large lists** (10k+ items).
 * - Uses more memory because off-screen components are not fully recycled.
 * - Re-renders items more often if not memoized properly.
 *
 * ✅ Example:
 */
import { FlatList, Text } from "react-native";

function FlatListExample({ data }) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Text>{item.name}</Text>}
    />
  );
}

/**
 * =============================================================================
 * 🔹 2. RecyclerListView (by Flipkart)
 * -----------------------------------------------------------------------------
 * ✅ Features:
 * - Inspired by Android's **RecyclerView**.
 * - Recycles views instead of unmounting/remounting them.
 * - Much faster for **huge datasets** (10k–100k items).
 * - Requires you to define **layout dimensions** up front.
 *
 * ❌ Limitations:
 * - More complex API than FlatList.
 * - Not as flexible for dynamic item sizes (needs layout provider).
 *
 * ✅ Example:
 */
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from "recyclerlistview";
import { View, Text, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const dataProvider = new DataProvider((r1, r2) => r1 !== r2).cloneWithRows([
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
]);

const layoutProvider = new LayoutProvider(
  (index) => "ITEM",
  (type, dim) => {
    dim.width = width;
    dim.height = 50;
  }
);

function RecyclerListExample() {
  return (
    <RecyclerListView
      dataProvider={dataProvider}
      layoutProvider={layoutProvider}
      rowRenderer={(type, data) => (
        <View style={{ height: 50 }}>
          <Text>{data.name}</Text>
        </View>
      )}
    />
  );
}

/**
 * =============================================================================
 * 🔹 3. FlashList (by Shopify)
 * -----------------------------------------------------------------------------
 * ✅ Features:
 * - Drop-in replacement for FlatList (same API).
 * - Built with **recycling + measurement caching** for better performance.
 * - Automatically optimizes `getItemLayout` internally.
 * - Smooth performance with **large datasets**.
 * - Very little setup → easier than RecyclerListView.
 *
 * ❌ Limitations:
 * - Still relatively new (ecosystem growing).
 * - May have compatibility issues with some rare use-cases.
 *
 * ✅ Example:
 */
import { FlashList } from "@shopify/flash-list";

function FlashListExample({ data }) {
  return (
    <FlashList
      data={data}
      keyExtractor={(item) => item.id}
      estimatedItemSize={50} // ✅ Helps optimize
      renderItem={({ item }) => <Text>{item.name}</Text>}
    />
  );
}

/**
 * =============================================================================
 * 🔹 Performance Comparison
 * -----------------------------------------------------------------------------
 * | Feature                 | FlatList                     | RecyclerListView             | FlashList                     |
 * |-------------------------|------------------------------|------------------------------|-------------------------------|
 * | API Simplicity          | ✅ Easiest (built-in)        | ❌ Complex (requires layout) | ✅ Same as FlatList           |
 * | Performance (Large Data)| ⚠️ Slower with 10k+ items    | ✅ Very fast (recycling)     | ✅ Very fast (optimized cache)|
 * | Setup Complexity        | ✅ Minimal                   | ❌ High (layout provider)    | ✅ Minimal (just add package) |
 * | Dynamic Item Sizes      | ⚠️ Okay but not optimal      | ❌ Harder (needs layout info)| ✅ Supported with caching     |
 * | Ecosystem Support       | ✅ Official RN               | ⚠️ Community-driven (stable) | ✅ Maintained by Shopify      |
 *
 * =============================================================================
 * 🔹 When to Use?
 * -----------------------------------------------------------------------------
 * - **FlatList** → Best for **small-medium lists** (1k–2k items).
 * - **RecyclerListView** → Best for **very large lists** (10k+ items) where
 *   performance is critical and layouts are predictable.
 * - **FlashList** → Best modern choice → **easy + fast**.
 *   Recommended for most cases instead of FlatList.
 *
 * =============================================================================
 * 🔹 Q&A (Interview Style)
 * -----------------------------------------------------------------------------
 * Q1: Why would you replace FlatList with FlashList?
 *   → FlashList is a drop-in replacement with **better performance** for large
 *     datasets while keeping the same API.
 *
 * Q2: What is the main difference between RecyclerListView and FlatList?
 *   → RecyclerListView **recycles views** like Android RecyclerView,
 *     whereas FlatList unmounts/remounts them, using more memory.
 *
 * Q3: Which one should you use for a chat app with 50k messages?
 *   → RecyclerListView or FlashList (depending on ease of setup).
 *
 * =============================================================================
 * ✅ Final Takeaway
 * -----------------------------------------------------------------------------
 * - FlatList → Simple, built-in, fine for smaller lists.
 * - RecyclerListView → Best for **extremely large datasets**, but requires setup.
 * - FlashList → Modern, **best balance** of simplicity + performance.
 * =============================================================================
 */
