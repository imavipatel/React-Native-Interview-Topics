/**
 * ==============================================================
 * 📘 React Hooks: useRef, DOM/Native Refs, useMemo & useCallback
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 useRef
 * - Stores a **mutable value** that survives re-renders.
 * - Updating `ref.current` does NOT cause a re-render.
 * - Uses:
 *    ✅ Accessing DOM/Native elements (TextInput, FlatList, etc.)
 *    ✅ Storing values like scroll position, timers, IDs
 *    ✅ Keeping values between renders without state
 *
 * 🔹 DOM/Native Refs
 * - React gives refs for directly accessing:
 *    ✅ Web: DOM nodes (div, input, canvas, etc.)
 *    ✅ React Native: Native components (TextInput, ScrollView, FlatList)
 * - Good for: focusing inputs, controlling scroll, measuring layout.
 *
 * 🔹 useMemo
 * - Remembers (caches) the **result of a calculation**.
 * - Runs only if dependencies change.
 * - Used for expensive operations (filtering, sorting, heavy loops).
 *
 * 🔹 useCallback
 * - Remembers (caches) the **function itself**.
 * - Prevents child components from re-rendering when passed as props.
 * - Best for stable function references in lists or memoized children.
 *
 * --------------------------------------------------------------
 * 🔹 Easy Way to Remember
 * - useRef → "Store a box (value) that doesn’t re-render."
 * - useMemo → "Remember the result of a calculation."
 * - useCallback → "Remember the function identity."
 *
 * ==============================================================
 * 🔹 Examples
 * --------------------------------------------------------------
 */

//
// ✅ Example 1: useRef with DOM (Web)
//
import React, { useRef } from "react";

function InputFocusExample() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus(); // Directly focus input
  };

  return (
    <div>
      <input ref={inputRef} placeholder="Type something..." />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}

//
// ✅ Example 2: useRef with React Native (TextInput + FlatList)
//
import React, { useRef, useState } from "react";
import { TextInput, Button, FlatList, Text, View } from "react-native";

function ChatScreen() {
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const [messages, setMessages] = useState([
    { id: "1", text: "Hello 👋" },
    { id: "2", text: "How are you?" },
  ]);

  const addMessage = () => {
    const newId = (messages.length + 1).toString();
    setMessages([...messages, { id: newId, text: `Message ${newId}` }]);
    listRef.current.scrollToEnd({ animated: true }); // Scroll automatically
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <TextInput
        ref={inputRef}
        placeholder="Type message..."
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />
      <Button title="Focus Input" onPress={() => inputRef.current.focus()} />
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text>{item.text}</Text>}
      />
      <Button title="Add Message" onPress={addMessage} />
    </View>
  );
}

//
// ✅ Example 3: useMemo – Expensive Calculation
//
import React, { useMemo, useState } from "react";

function ExpensiveCalculationExample() {
  const [count, setCount] = useState(0);

  const expensiveResult = useMemo(() => {
    console.log("🔄 Expensive calculation running...");
    return count * 1000; // Simulated heavy computation
  }, [count]);

  return (
    <div>
      <p>Result: {expensiveResult}</p>
      <button onClick={() => setCount(count + 1)}>Increase</button>
    </div>
  );
}

//
// ✅ Example 4: useCallback – Stable Function Reference
//
import React, { useCallback, useState } from "react";

const ListItem = React.memo(({ item, onClick }) => {
  console.log("Rendering:", item);
  return <p onClick={() => onClick(item)}>{item}</p>;
});

function CallbackExample() {
  const [items] = useState(["Apple", "Banana", "Orange"]);

  const handleClick = useCallback((item) => {
    alert("You clicked " + item);
  }, []);

  return (
    <div>
      {items.map((item) => (
        <ListItem key={item} item={item} onClick={handleClick} />
      ))}
    </div>
  );
}

/**
 * ==============================================================
 * 🔍 Comparison Table
 * --------------------------------------------------------------
 * | Hook        | Purpose                           | Triggers Re-render? | Example Use Case              |
 * |-------------|-----------------------------------|----------------------|-------------------------------|
 * | useRef      | Store mutable values or DOM refs  | ❌ No                | TextInput, FlatList scroll, timers |
 * | useMemo     | Cache calculation results         | ❌ No (only if deps change) | Expensive filters, sorting    |
 * | useCallback | Cache function reference          | ❌ No (only if deps change) | Stable function for props     |
 *
 * --------------------------------------------------------------
 * 🔹 In short:
 * - useRef → Remember a value (not re-rendered).
 * - useMemo → Remember a result.
 * - useCallback → Remember a function.
 *
 * ==============================================================
 * ❓ Q&A for Interviews
 * --------------------------------------------------------------
 * Q1: Why doesn’t updating a ref cause re-render?
 *    → Because React does not track `ref.current` for rendering.
 *
 * Q2: When to use useMemo vs useCallback?
 *    → useMemo = heavy calculations.
 *      useCallback = stable function props.
 *
 * Q3: Can useRef replace useState?
 *    → Yes, if value does not affect UI. Example: scroll position.
 *
 * Q4: How do these hooks improve performance?
 *    → They prevent unnecessary re-renders and optimize lists, functions, and calculations.
 *
 * ==============================================================
 */
