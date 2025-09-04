/**
 * ==============================================================
 * 📘 React – useImperativeHandle with forwardRef
 * ==============================================================
 *
 * 🟢 What is forwardRef?
 * --------------------------------------------------------------
 * - By default, refs only work on DOM elements (e.g., <input />).
 * - If you create a custom component, ref won't directly access its inner DOM.
 * - `forwardRef` lets you pass a ref through a component → so parent can access child’s DOM or methods.
 *
 * 🟢 What is useImperativeHandle?
 * --------------------------------------------------------------
 * - A React hook used with `forwardRef`.
 * - Lets you control WHAT methods/values are exposed to the parent when it uses a ref.
 * - Instead of exposing the whole child, you expose only specific methods/fields.
 *
 * 🔹 Why use it?
 * --------------------------------------------------------------
 * - Encapsulation: Parent gets controlled access (only what you allow).
 * - Better API design: Don’t leak entire component internals.
 * - Useful when child needs to expose “actions” (e.g., `focus`, `reset`, `scrollToTop`).
 *
 * ==============================================================
 * 🔹 Example 1: Basic Input focus
 */
import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { TextInput, Button, View } from "react-native";

// Child component with forwardRef
const CustomInput = forwardRef((props, ref) => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focusInput: () => {
      inputRef.current.focus(); // expose method to parent
    },
  }));

  return <TextInput ref={inputRef} style={{ borderWidth: 1, padding: 10 }} />;
});

// Parent component
export default function ParentExample() {
  const inputRef = useRef();

  return (
    <View style={{ padding: 20 }}>
      <CustomInput ref={inputRef} />
      <Button title="Focus Input" onPress={() => inputRef.current.focusInput()} />
    </View>
  );
}

/**
 * 📝 Explanation:
 * - `CustomInput` has an internal ref (inputRef).
 * - With `useImperativeHandle`, we expose only `focusInput` method to parent.
 * - Parent cannot directly modify child, only use `focusInput`.
 *
 * ==============================================================
 * 🔹 Example 2: Resettable Counter
 */
import React, { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { View, Text, Button } from "react-native";

const Counter = forwardRef((props, ref) => {
  const [count, setCount] = useState(0);

  useImperativeHandle(ref, () => ({
    reset: () => setCount(0),
    increment: () => setCount((c) => c + 1),
  }));

  return (
    <View>
      <Text style={{ fontSize: 20 }}>Count: {count}</Text>
      <Button title="Add" onPress={() => setCount(count + 1)} />
    </View>
  );
});

export default function CounterParent() {
  const counterRef = useRef();

  return (
    <View style={{ padding: 20 }}>
      <Counter ref={counterRef} />
      <Button title="Reset Counter" onPress={() => counterRef.current.reset()} />
      <Button title="Increment from Parent" onPress={() => counterRef.current.increment()} />
    </View>
  );
}

/**
 * ==============================================================
 * 🔹 Example 3: ScrollView Control
 */
import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { ScrollView, Button, Text } from "react-native";

const CustomScroll = forwardRef((props, ref) => {
  const scrollRef = useRef();

  useImperativeHandle(ref, () => ({
    scrollToTop: () => scrollRef.current.scrollTo({ y: 0, animated: true }),
  }));

  return (
    <ScrollView ref={scrollRef} style={{ height: 200 }}>
      {Array.from({ length: 30 }, (_, i) => (
        <Text key={i} style={{ padding: 10 }}>Item {i + 1}</Text>
      ))}
    </ScrollView>
  );
});

export default function ScrollExample() {
  const scrollRef = useRef();

  return (
    <>
      <CustomScroll ref={scrollRef} />
      <Button title="Scroll to Top" onPress={() => scrollRef.current.scrollToTop()} />
    </>
  );
}

/**
 * ==============================================================
 * 📊 When to Use?
 * --------------------------------------------------------------
 * ✅ Use when child must expose controlled methods to parent.
 * ✅ Useful for actions: focus, reset, scroll, play/pause, etc.
 * ❌ Don’t use for normal data flow → prefer props/state.
 *
 * ==============================================================
 * ❓ Q&A (Interview Style)
 * --------------------------------------------------------------
 * Q1: Why not just pass props to control child instead of refs?
 *   → Props are good for declarative updates (e.g., pass value).  
 *     But for imperative actions like `.focus()`, refs are better.
 *
 * Q2: What happens if you don’t use useImperativeHandle?
 *   → Parent would get entire child instance (less controlled, breaks encapsulation).
 *
 * Q3: Can we use useImperativeHandle without forwardRef?
 *   → No. `useImperativeHandle` only works inside a component wrapped with `forwardRef`.
 *
 * ==============================================================
 * ✅ Final Takeaways
 * --------------------------------------------------------------
 * - `forwardRef` → lets parent pass a ref into a child component.
 * - `useImperativeHandle` → controls what parent can access from child.
 * - Helps build reusable, safe, and controlled components.
 * ==============================================================
 */
