/**
 * ==============================================================
 * 📘 React Advanced Hooks (Beginner Friendly)
 * 👉 useId, useTransition, useDeferredValue
 * ==============================================================
 *
 * 🟢 Why do we need these hooks?
 * --------------------------------------------------------------
 * - React introduced these hooks to solve common UI problems:
 *   1. Generating unique IDs safely → `useId`
 *   2. Keeping apps smooth while doing heavy work → `useTransition`
 *   3. Avoiding UI lag when typing → `useDeferredValue`
 *
 * Let's learn them step by step 👇
 *
 * ==============================================================
 * 🔹 useId → (Stable Unique IDs)
 * --------------------------------------------------------------
 * ✅ What is it?
 * - A hook that gives you a unique and stable ID.
 * - IDs stay the same even after re-rendering.
 * - Very useful when linking a <label> and <input> or for accessibility.
 *
 * ✅ Example (React Web or RN Web):
 */
import React, { useId } from "react";

export default function FormExample() {
  const id = useId(); // same id across renders

  return (
    <div>
      <label htmlFor={id}>Username:</label>
      <input id={id} type="text" />
    </div>
  );
}

/**
 * 📝 In React Native apps:
 * - We don’t usually need IDs because RN doesn’t have <label>/<input>.
 * - But if you're building RN for Web or SSR, it's very useful.
 *
 * ==============================================================
 * 🔹 useTransition → (Mark state updates as "not urgent")
 * --------------------------------------------------------------
 * ✅ What is it?
 * - Lets you mark some state updates as "low priority".
 * - This way, React updates urgent things (like typing) first,
 *   and handles heavy updates later.
 *
 * ✅ Why?
 * - Without it: typing in a search box may lag if filtering a big list.
 * - With it: typing stays smooth, list updates happen in the background.
 *
 * ✅ Example in React Native:
 */
import React, { useState, useTransition } from "react";
import { Text, TextInput, View, FlatList } from "react-native";

export default function SearchExample() {
  const [query, setQuery] = useState("");
  const [list, setList] = useState([]);
  const [isPending, startTransition] = useTransition();

  const bigList = Array.from({ length: 5000 }, (_, i) => `Item ${i}`);

  const handleChange = (text) => {
    setQuery(text);
    startTransition(() => {
      // This update is marked as "not urgent"
      setList(bigList.filter((item) => item.includes(text)));
    });
  };

  return (
    <View>
      <TextInput
        value={query}
        onChangeText={handleChange}
        placeholder="Search..."
      />
      {isPending && <Text>Loading...</Text>}
      <FlatList data={list} renderItem={({ item }) => <Text>{item}</Text>} />
    </View>
  );
}

/**
 * 📝 Key point:
 * - `isPending` tells you if React is still working on the slow update.
 * - Helps you show a "Loading..." text while heavy work is happening.
 *
 * ==============================================================
 * 🔹 useDeferredValue → (Delay using a fast-changing value)
 * --------------------------------------------------------------
 * ✅ What is it?
 * - Sometimes a value (like search text) changes quickly.
 * - If you filter a huge list on every keystroke, it lags.
 * - `useDeferredValue` lets you **use an older version of the value**
 *   until React has time to update it.
 *
 * ✅ Example:
 */
import React, { useState, useDeferredValue } from "react";
import { Text, TextInput, View, FlatList } from "react-native";

export default function DeferredSearch() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query); // may "lag behind" a bit

  const bigList = Array.from({ length: 5000 }, (_, i) => `Item ${i}`);
  const filteredList = bigList.filter((item) =>
    item.includes(deferredQuery)
  );

  return (
    <View>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Type to search..."
      />
      <FlatList data={filteredList} renderItem={({ item }) => <Text>{item}</Text>} />
    </View>
  );
}

/**
 * 📝 Key point:
 * - The UI (typing) feels smooth because React doesn’t filter on every keystroke immediately.
 * - Instead, it waits until the system is free and then updates the filtered list.
 *
 * ==============================================================
 * 📊 Comparison Table
 * --------------------------------------------------------------
 * | Hook              | What it does                          | Example Use Case                  |
 * |-------------------|---------------------------------------|-----------------------------------|
 * | useId             | Gives unique, stable IDs              | Linking <label> to <input>        |
 * | useTransition     | Marks updates as low priority         | Search bar filtering big list     |
 * | useDeferredValue  | Delays fast-changing value updates    | Smooth typing while filtering     |
 *
 * ==============================================================
 * ❓ Q&A (Interview Style)
 * --------------------------------------------------------------
 * Q1: What’s the difference between useTransition and useDeferredValue?
 *   → `useTransition` defers a **state update**,
 *      `useDeferredValue` defers a **value**.
 *
 * Q2: Why do we need useId?
 *   → To generate safe IDs for accessibility and avoid mismatches in SSR.
 *
 * Q3: What does `isPending` mean in useTransition?
 *   → It shows if React is still processing the slow update.
 *
 * Q4: Can we use useDeferredValue for FlatList search?
 *   → Yes, it keeps typing smooth while filtering large lists.
 *
 * ==============================================================
 * ✅ Final Takeaways
 * --------------------------------------------------------------
 * - `useId` → Safe unique IDs for accessibility and SSR.
 * - `useTransition` → Makes heavy updates "non-blocking" → smooth UI.
 * - `useDeferredValue` → Delays value updates → smooth typing + search.
 * - All three hooks are part of React’s **Concurrent Rendering** features.
 *
 * ==============================================================
 */
