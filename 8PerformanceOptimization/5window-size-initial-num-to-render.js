/**
 * =============================================================================
 * 📘 WindowSize & initialNumToRender Tuning in React Native Lists
 * =============================================================================
 *
 * 🟢 Introduction
 * -----------------------------------------------------------------------------
 * - React Native list components (`FlatList`, `SectionList`, `VirtualizedList`,
 *   `FlashList`) use **virtualization** → only render visible items instead of
 *   the entire dataset.
 * - Performance depends heavily on tuning props like:
 *   - `windowSize`
 *   - `initialNumToRender`
 *
 * Proper tuning can balance between:
 * ✅ Smooth scrolling
 * ✅ Faster initial rendering
 * ✅ Lower memory usage
 *
 * =============================================================================
 * 🔹 1. initialNumToRender
 * -----------------------------------------------------------------------------
 * - Defines how many items are rendered **initially** when the list mounts.
 * - Default: **10 items**.
 * - If too low → blank space until scrolling.
 * - If too high → slow startup (longer render time).
 *
 * ✅ Best Practice:
 * - For short lists (chat, todos) → set a small value (5–10).
 * - For long lists (feeds, product catalogs) → balance (10–20).
 * - For complex UIs → render fewer initially for faster mount.
 *
 * ✅ Example:
 */
import { FlatList, Text } from "react-native";

function ExampleList({ data }) {
  return (
    <FlatList
      data={data}
      initialNumToRender={8} // 👈 render 8 items initially
      renderItem={({ item }) => <Text>{item.name}</Text>}
      keyExtractor={(item) => item.id}
    />
  );
}

/**
 * =============================================================================
 * 🔹 2. windowSize
 * -----------------------------------------------------------------------------
 * - Controls how many screens' worth of content should be rendered around the
 *   visible area (both before & after).
 * - Default: **21 units** (10 before + 1 visible + 10 after).
 *   (1 unit = 1 viewport height worth of items)
 *
 * ✅ Formula:
 * - Items rendered = (windowSize * visible viewport size) / average item height
 *
 * ✅ Best Practice:
 * - Small `windowSize` (5–10) → better memory usage, but items may "flash"
 *   when scrolling fast.
 * - Large `windowSize` (15–21+) → smoother scrolling, but higher memory usage.
 * - Tune based on **device RAM & list type**.
 *
 * ✅ Example:
 */
function TunedList({ data }) {
  return (
    <FlatList
      data={data}
      initialNumToRender={6}
      windowSize={10} // 👈 keeps 5 screens above + 5 screens below in memory
      renderItem={({ item }) => <Text>{item.name}</Text>}
      keyExtractor={(item) => item.id}
    />
  );
}

/**
 * =============================================================================
 * 🔹 Combined Example (with FlashList)
 * -----------------------------------------------------------------------------
 */
import { FlashList } from "@shopify/flash-list";

function FlashListExample({ data }) {
  return (
    <FlashList
      data={data}
      estimatedItemSize={60}
      initialNumToRender={8}
      windowSize={12}
      renderItem={({ item }) => <Text>{item.name}</Text>}
      keyExtractor={(item) => item.id}
    />
  );
}

/**
 * =============================================================================
 * 🔹 Tuning Strategy
 * -----------------------------------------------------------------------------
 * ✅ For Chat/Messaging Apps:
 *   - `initialNumToRender = 5–8`
 *   - `windowSize = 5–10`
 *   → Faster load, keeps memory low.
 *
 * ✅ For Infinite Feeds (social media, news):
 *   - `initialNumToRender = 10–15`
 *   - `windowSize = 15–21`
 *   → Smoother scroll, avoids flickering.
 *
 * ✅ For Heavy Item UIs (complex cards, images):
 *   - `initialNumToRender = 5–8`
 *   - `windowSize = 10–12`
 *   → Avoids freezing on startup.
 *
 * =============================================================================
 * 🔹 Q&A (Interview Style)
 * -----------------------------------------------------------------------------
 * Q1: What happens if you set `initialNumToRender` too high?
 *   → Longer startup time & higher memory usage (bad for low-end devices).
 *
 * Q2: What happens if `windowSize` is too low?
 *   → Items may "flash" or render late while scrolling fast.
 *
 * Q3: Which one improves first screen performance?
 *   → `initialNumToRender` (controls initial items on mount).
 *
 * Q4: Which one improves scrolling smoothness?
 *   → `windowSize` (controls how much is pre-rendered around visible area).
 *
 * =============================================================================
 * ✅ Final Takeaway
 * -----------------------------------------------------------------------------
 * - Use `initialNumToRender` to optimize **startup performance**.
 * - Use `windowSize` to balance **scroll smoothness vs memory usage**.
 * - Always profile on target devices (low-end vs high-end phones).
 * =============================================================================
 */
