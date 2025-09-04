/**
 * ==============================================================
 * 📘 React – useRef & DOM/Native Refs
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * - `useRef` is a React hook that lets you create a "ref" object.
 * - A **ref** is like a box that holds a mutable value across renders
 *   without causing re-renders when it changes.
 *
 * - In React, refs are mainly used for:
 *   ✅ Accessing DOM or native elements directly.
 *   ✅ Storing mutable values (like instance variables).
 *   ✅ Persisting values across renders without triggering re-render.
 *
 * - In React Native, refs let you interact with **native components**
 *   (e.g., focus a TextInput, scroll a ScrollView, measure a View).
 *
 * --------------------------------------------------------------
 * 🔹 Key Characteristics
 * - `useRef(initialValue)` → returns `{ current: initialValue }`.
 * - The `.current` property is mutable and **does not reset** between renders.
 * - Updating `ref.current` does NOT cause re-render (unlike state).
 * - Refs can point to DOM elements (web) or native views (React Native).
 *
 * ==============================================================
 * 📊 Ref vs State
 * ==============================================================
 *
 * Feature                  | State                          | Ref
 * -------------------------|--------------------------------|-------------------------
 * Triggers re-render?      | ✅ Yes                         | ❌ No
 * Value persistence        | ✅ Yes (between renders)       | ✅ Yes (between renders)
 * Async updates            | ✅ Yes (batched)               | ❌ Instant (direct)
 * Use cases                | UI updates, data               | DOM access, mutable vars
 *
 * ==============================================================
 * 🔹 Examples (Web: DOM Refs)
 * --------------------------------------------------------------
 */

// Example 1: Accessing an input DOM element (Web)
import React, { useRef } from "react";

function InputFocusWeb() {
  const inputRef = useRef(null);

  function focusInput() {
    inputRef.current.focus(); // directly access DOM
  }

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Type here..." />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}

//
// Example 2: Storing mutable values without re-render
//
function TimerCounter() {
  const countRef = useRef(0);

  function increase() {
    countRef.current += 1;
    console.log("Counter:", countRef.current); // updates without re-render
  }

  return <button onClick={increase}>Increase Count</button>;
}
/*
 * ==============================================================
 * 🔹 Examples (React Native: Native Refs)
 * --------------------------------------------------------------
 */

import React, { useRef } from "react";
import { TextInput, Button, ScrollView, View, Text } from "react-native";

// Example 1: Focus a TextInput using ref
function InputFocusNative() {
  const inputRef = useRef(null);

  return (
    <View>
      <TextInput
        ref={inputRef}
        style={{ borderWidth: 1, padding: 8, margin: 10 }}
        placeholder="Enter text"
      />
      <Button title="Focus Input" onPress={() => inputRef.current.focus()} />
    </View>
  );
}

// --------------------------------------------------------------

// Example 2: Scroll to bottom using ScrollView ref
function ScrollExample() {
  const scrollRef = useRef(null);

  const scrollToEnd = () => {
    scrollRef.current.scrollToEnd({ animated: true });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView ref={scrollRef} style={{ margin: 10 }}>
        {[...Array(20)].map((_, i) => (
          <Text key={i}>Item {i + 1}</Text>
        ))}
      </ScrollView>
      <Button title="Scroll to Bottom" onPress={scrollToEnd} />
    </View>
  );
}

// --------------------------------------------------------------

// Example 3: Measuring a View size using ref
function MeasureViewExample() {
  const viewRef = useRef(null);

  const measureView = () => {
    viewRef.current.measure((x, y, width, height, pageX, pageY) => {
      console.log("View dimensions:", { width, height });
      console.log("Position on screen:", { pageX, pageY });
    });
  };

  return (
    <View>
      <View
        ref={viewRef}
        style={{ width: 150, height: 100, backgroundColor: "lightblue" }}
      />
      <Button title="Measure View" onPress={measureView} />
    </View>
  );
}

/**
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: What is the difference between state and ref?
 *    → State triggers re-render when updated, ref does not.
 *      Ref is useful for storing mutable values and accessing DOM/native nodes.
 *
 * Q2: Can updating `ref.current` cause re-render?
 *    → ❌ No, changing `ref.current` won’t trigger re-render.
 *
 * Q3: Why use refs in React Native?
 *    → To control native elements (TextInput focus, ScrollView scroll, measure layout).
 *
 * Q4: When should you NOT use refs?
 *    → Avoid using refs for data that affects rendering.
 *      Use state instead for UI-driven data.
 *
 * Q5: Can refs store any value, not just DOM/native nodes?
 *    → ✅ Yes, refs can store numbers, objects, booleans — any mutable value.
 *
 * ==============================================================
 */

/**
 * ==============================================================
 * 📘 Real-World Case Study – useRef in Performance Optimization
 * ==============================================================
 *
 * 🟢 Scenario
 * --------------------------------------------------------------
 * - Imagine you’re building a **chat app** in React Native.
 * - Messages come in frequently, and you have a **FlatList** rendering them.
 * - If we store some values (like the "last seen message ID") in state,
 *   it would cause re-renders → expensive for large lists.
 *
 * ✅ Solution: useRef
 * - Store mutable values like scroll position, last seen ID, or timers
 *   in a ref → avoids re-render and keeps performance smooth.
 *
 * ==============================================================
 * 🔹 Example: Chat App with FlatList + useRef
 * --------------------------------------------------------------
 */

import React, { useRef, useState } from "react";
import { FlatList, View, Text, Button } from "react-native";

function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: "1", text: "Hello 👋" },
    { id: "2", text: "How are you?" },
  ]);

  const lastSeenMessageId = useRef(null); // stores value without re-render
  const flatListRef = useRef(null); // reference to FlatList

  const addMessage = () => {
    const newId = (messages.length + 1).toString();
    setMessages([...messages, { id: newId, text: `New message ${newId}` }]);
  };

  const markLastSeen = (id) => {
    lastSeenMessageId.current = id; // no re-render
    console.log("Last seen message:", lastSeenMessageId.current);
  };

  const scrollToBottom = () => {
    flatListRef.current.scrollToEnd({ animated: true });
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text
            style={{
              padding: 8,
              backgroundColor: "#eee",
              marginVertical: 4,
              borderRadius: 5,
            }}
            onPress={() => markLastSeen(item.id)}
          >
            {item.text}
          </Text>
        )}
      />
      <Button title="Add Message" onPress={addMessage} />
      <Button title="Scroll to Bottom" onPress={scrollToBottom} />
    </View>
  );
}

/**
 * ==============================================================
 * 🔍 Key Learnings from Case Study
 * --------------------------------------------------------------
 * 1) `lastSeenMessageId`:
 *    - Stored in a ref to avoid re-render when value changes.
 *    - If stored in state, it would re-render entire ChatScreen → costly!
 *
 * 2) `flatListRef`:
 *    - Used to programmatically control FlatList (scrollToEnd).
 *
 * 3) Why this improves performance:
 *    - Chat apps often deal with hundreds of messages.
 *    - Minimizing unnecessary re-renders is critical.
 *    - Refs let us handle "mutable, non-UI values" efficiently.
 *
 * ==============================================================
 * ❓ Q&A Extension
 * --------------------------------------------------------------
 * Q: When should I choose `useRef` over `useState` in lists?
 *    → Use `useRef` for values that:
 *       - Don’t affect UI directly
 *       - Change frequently (like scroll position, timers, IDs)
 *
 * Q: Can we combine refs with memoization?
 *    → ✅ Yes, often used with `React.memo` or `useCallback`
 *       to prevent child re-renders in lists.
 *
 * ==============================================================
 */
