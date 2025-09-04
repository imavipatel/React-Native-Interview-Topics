/**
 * ==============================================================
 * 📘 React Native Notes – FlatList vs SectionList vs VirtualizedList
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 Why Lists in React Native?
 * - Mobile apps often render **long lists** (messages, contacts, feeds).
 * - Rendering all items at once = ❌ slow & memory heavy.
 * - React Native solves this with **Virtualized Rendering** → only visible items are drawn.
 *
 * --------------------------------------------------------------
 * 🔹 FlatList
 * - Best for **simple, flat lists** (like chats, todos, product list).
 * - Features:
 *    ✅ Virtualization for performance
 *    ✅ Easy to use
 *    ✅ Supports pull-to-refresh, infinite scroll
 * - Limitations:
 *    ❌ No grouping (use SectionList if needed).
 *
 * --------------------------------------------------------------
 * 🔹 SectionList
 * - Best for **grouped data** (like contacts by alphabet, FAQs).
 * - Features:
 *    ✅ Grouped items by section
 *    ✅ Section headers (sticky supported)
 *    ✅ Uses virtualization internally
 *
 * --------------------------------------------------------------
 * 🔹 VirtualizedList
 * - The **core engine** of FlatList & SectionList.
 * - Best when you need **full control** over:
 *    * Data extraction
 *    * Large, dynamic, infinite datasets
 * - Requires custom `getItem()` and `getItemCount()`.
 *
 * ==============================================================
 * 🔹 Example 1: FlatList (React Native)
 */
import { FlatList, Text } from "react-native";

const DATA = [
  { id: "1", title: "First Item" },
  { id: "2", title: "Second Item" },
  { id: "3", title: "Third Item" },
];

export default function App() {
  return (
    <FlatList
      data={DATA}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Text style={{ padding: 10, fontSize: 16 }}>{item.title}</Text>
      )}
    />
  );
}

/**
 * - ✅ Simple flat list
 * - `data` → array of objects
 * - `renderItem` → function to render each row
 * - `keyExtractor` → must return unique keys
 *
 * ==============================================================
 * 🔹 Example 2: SectionList (React Native)
 */
import { SectionList, Text } from "react-native";

const SECTIONS = [
  {
    title: "Fruits",
    data: ["Apple", "Banana", "Mango"],
  },
  {
    title: "Vegetables",
    data: ["Carrot", "Potato", "Tomato"],
  },
];

export default function App() {
  return (
    <SectionList
      sections={SECTIONS}
      keyExtractor={(item, index) => item + index}
      renderItem={({ item }) => <Text style={{ padding: 10 }}>{item}</Text>}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={{ fontWeight: "bold", fontSize: 18, padding: 5 }}>
          {title}
        </Text>
      )}
    />
  );
}

/**
 * - ✅ Grouped list with headers
 * - Headers: "Fruits", "Vegetables"
 * - Items: Apple, Banana, etc.
 *
 * ==============================================================
 * 🔹 Example 3: VirtualizedList (React Native)
 */
import { VirtualizedList, Text } from "react-native";

const DATA1 = Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`);

function getItem(data, index) {
  return data[index];
}

function getItemCount(data) {
  return data.length;
}

export default function App() {
  return (
    <VirtualizedList
      data={DATA1}
      initialNumToRender={10}
      renderItem={({ item }) => (
        <Text style={{ padding: 10, fontSize: 16 }}>{item}</Text>
      )}
      keyExtractor={(item, index) => index.toString()}
      getItemCount={getItemCount}
      getItem={getItem}
    />
  );
}

/**
 * - ✅ Best for huge datasets
 * - You control how items are fetched & counted
 * - More boilerplate than FlatList
 *
 * ==============================================================
 * 🔹 Quick Comparison Table
 *
 * FlatList:
 * - Simple lists
 * - Built-in virtualization
 * - Easiest to use
 *
 * SectionList:
 * - Grouped lists with headers
 * - Built on top of VirtualizedList
 *
 * VirtualizedList:
 * - Low-level list
 * - Full control, best for infinite or dynamic datasets
 *
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: What is the difference between FlatList, SectionList, and VirtualizedList?
 *    → FlatList = simple lists
 *      SectionList = grouped lists
 *      VirtualizedList = low-level engine behind both.
 *
 * Q2: Why use FlatList instead of ScrollView?
 *    → ScrollView renders all items at once → ❌ slow for large lists.
 *      FlatList renders only visible items → ✅ efficient.
 *
 * Q3: When to use SectionList?
 *    → When you need grouped data with headers (like contacts grouped by letter).
 *
 * Q4: When to use VirtualizedList directly?
 *    → When you need infinite scrolling, custom fetching, or very large dynamic data.
 *
 * Q5: Performance tips for lists?
 *    - Use `keyExtractor` (unique keys).
 *    - Use `getItemLayout` if item heights are fixed.
 *    - Avoid inline functions in render.
 *    - Use `initialNumToRender` carefully for fast first paint.
 *
 * ==============================================================
 */
