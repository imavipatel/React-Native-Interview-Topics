/**
 * ==============================================================
 * 📘 React Native Notes – High Performance Lists (RecyclerListView, FlashList)
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 Why do we need high-performance list libraries?
 * - React Native gives us FlatList, SectionList (built on VirtualizedList).
 * - Good for many cases, but for **huge datasets (1000s of rows)**:
 *    ❌ Frame drops
 *    ❌ High memory usage
 *    ❌ Janky scrolling
 * - Solution → Libraries like **RecyclerListView** & **FlashList**
 *   → Both are optimized for smooth 60 FPS scrolling even with massive lists.
 *
 * --------------------------------------------------------------
 * 🔹 RecyclerListView (by Flipkart)
 * - Inspired by Android's RecyclerView.
 * - Core Idea: **Recycle items** instead of creating new ones.
 *    ✅ Only a small number of components are created.
 *    ✅ Reused when scrolled out of view.
 * - Requires you to define **layout dimensions** up front.
 * - Best for **complex UI + large lists**.
 *
 * Features:
 * - Highly performant for thousands of rows.
 * - Recycles views for memory efficiency.
 * - Needs a `LayoutProvider` to describe how each row looks.
 * - Supports horizontal + grid + staggered layouts.
 *
 * --------------------------------------------------------------
 * 🔹 FlashList (by Shopify)
 * - A **drop-in replacement for FlatList**.
 * - Core Idea: Optimize FlatList’s internals.
 * - Features:
 *    ✅ Handles 1000s of rows without lag
 *    ✅ Predicts item size dynamically
 *    ✅ Minimal config (no layout provider needed)
 *    ✅ 100% FlatList API compatible (just replace `FlatList` with `FlashList`)
 *
 * Best For:
 * - Teams who want **FlatList simplicity** with **RecyclerListView speed**.
 *
 * ==============================================================
 * 🔹 Example 1: RecyclerListView
 */
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import { Dimensions, Text } from "react-native";

const { width } = Dimensions.get("window");

const dataProvider = new DataProvider((r1, r2) => r1 !== r2).cloneWithRows([
  { type: "NORMAL", name: "Item 1" },
  { type: "NORMAL", name: "Item 2" },
  { type: "NORMAL", name: "Item 3" },
  // ... add 1000s of items
]);

const layoutProvider = new LayoutProvider(
  (index) => dataProvider.getDataForIndex(index).type, // Row type
  (type, dim) => {
    switch (type) {
      case "NORMAL":
        dim.width = width;
        dim.height = 50;
        break;
    }
  }
);

function rowRenderer(type, data) {
  return <Text style={{ padding: 10 }}>{data.name}</Text>;
}

export default function App() {
  return (
    <RecyclerListView
      layoutProvider={layoutProvider}
      dataProvider={dataProvider}
      rowRenderer={rowRenderer}
    />
  );
}

/**
 * - ✅ Needs DataProvider (manages data)
 * - ✅ Needs LayoutProvider (defines row dimensions)
 * - ✅ Very efficient for huge lists
 *
 * ==============================================================
 * 🔹 Example 2: FlashList
 */
import { FlashList } from "@shopify/flash-list";
import { Text } from "react-native";

const DATA = Array.from({ length: 1000 }).map((_, i) => `Item ${i + 1}`);

export default function App() {
  return (
    <FlashList
      data={DATA}
      estimatedItemSize={50} // estimate row height
      renderItem={({ item }) => (
        <Text style={{ padding: 10, fontSize: 16 }}>{item}</Text>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}

/**
 * - ✅ Drop-in replacement for FlatList
 * - ✅ No LayoutProvider needed
 * - ✅ Just give estimated item size for better perf
 * - ✅ Scrolls smoothly with 1000s of rows
 *
 * ==============================================================
 * 🔹 Quick Comparison
 *
 * FlatList:
 * - Easy to use
 * - Good for small/medium lists
 * - Struggles with 1000+ items
 *
 * RecyclerListView:
 * - Best performance for huge datasets
 * - Requires more setup (LayoutProvider)
 * - Useful for grids & complex layouts
 *
 * FlashList:
 * - FlatList API + RecyclerListView-level performance
 * - Minimal setup (just add `estimatedItemSize`)
 * - Best for teams who already use FlatList
 *
 * ==============================================================
 * 🔹 Performance Tips for Lists
 *
 * 1) Use `keyExtractor` properly  
 *    - Always use stable unique keys (like `id`) instead of array index.
 *
 * 2) Avoid inline functions in `renderItem`  
 *    - ❌ Bad: renderItem={({item}) => <Item data={item} />}  
 *    - ✅ Good: define a separate function `renderItem` outside component.
 *
 * 3) Use `React.memo` or `PureComponent` for row items  
 *    - Prevents unnecessary re-renders when props don’t change.
 *
 * 4) Use `getItemLayout` (for FlatList)  
 *    - Pre-computes item positions → avoids measuring items on scroll.
 *
 * 5) Batch updates & pagination  
 *    - Load data in chunks (infinite scroll) instead of rendering all at once.
 *
 * 6) Remove unnecessary re-renders  
 *    - Keep `extraData` minimal in FlatList.
 *    - Avoid passing new objects/arrays inline.
 *
 * 7) Prefer FlashList/RecyclerListView for large lists  
 *    - FlatList is fine up to a few hundred items.
 *    - Switch for thousands of items.
 *
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: Why not always use FlatList?
 *    → FlatList re-renders too many items with huge datasets → laggy.
 *
 * Q2: How does RecyclerListView improve performance?
 *    → By reusing (recycling) row components instead of creating new ones.
 *
 * Q3: What is the advantage of FlashList over RecyclerListView?
 *    → FlashList = simpler API (FlatList-compatible) with similar performance.
 *
 * Q4: What is `estimatedItemSize` in FlashList?
 *    → A hint for row height so FlashList can predict layouts and scroll smoothly.
 *
 * Q5: When should I pick RecyclerListView vs FlashList?
 *    - RecyclerListView → Complex layouts, grids, maximum control.
 *    - FlashList → Simple replacement for FlatList, fast results with less setup.
 *
 * Q6: How do you optimize a FlatList?
 *    → Use `getItemLayout`, stable keys, memoized row components, batch loading.
 *
 * ==============================================================
 */
