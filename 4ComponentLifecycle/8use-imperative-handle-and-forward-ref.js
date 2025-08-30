/**
 * ==============================================================
 * 📘 React Notes – useImperativeHandle & forwardRef
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 forwardRef
 * - A React function that allows you to pass refs through a component
 *   to its child (useful for reusable components).
 * - Normally, refs only work on DOM/native elements, not custom components.
 * - With `forwardRef`, you can forward the ref to a child DOM element.
 *
 * 🔹 useImperativeHandle
 * - A React hook used with `forwardRef`.
 * - It customizes the value exposed to the parent when using `ref`.
 * - Instead of exposing the raw DOM element, you can expose
 *   only specific functions or properties.
 *
 * --------------------------------------------------------------
 * 🟢 Why use them?
 * - To create **custom reusable components** (like inputs, modals)
 *   where parent needs to control child behavior directly.
 * - Example: Parent calls `focus()` on a custom `Input` component.
 *
 * ==============================================================
 * 🔹 Examples
 * --------------------------------------------------------------
 */

//
// ✅ Example 1: forwardRef (simple)
//
import React, { forwardRef, useRef } from "react";
import { TextInput, Button, View } from "react-native";

const MyInput = forwardRef((props, ref) => {
  return <TextInput ref={ref} placeholder="Type here..." style={{ borderWidth: 1, margin: 10 }} />;
});

export default function App() {
  const inputRef = useRef(null);

  return (
    <View>
      <MyInput ref={inputRef} />
      <Button title="Focus Input" onPress={() => inputRef.current.focus()} />
    </View>
  );
}

//
// ✅ Example 2: useImperativeHandle (custom API)
//
import React, { forwardRef, useRef, useImperativeHandle } from "react";
import { TextInput, Button, View } from "react-native";

const CustomInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);

  // Expose custom methods to parent
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    clear: () => {
      inputRef.current.clear();
    }
  }));

  return <TextInput ref={inputRef} placeholder="Custom Input..." style={{ borderWidth: 1, margin: 10 }} />;
});

export default function App() {
  const customInputRef = useRef(null);

  return (
    <View>
      <CustomInput ref={customInputRef} />
      <Button title="Focus Input" onPress={() => customInputRef.current.focus()} />
      <Button title="Clear Input" onPress={() => customInputRef.current.clear()} />
    </View>
  );
}

/**
 * ==============================================================
 * 🔍 Comparison
 * --------------------------------------------------------------
 * | Feature              | forwardRef                  | useImperativeHandle                  |
 * |----------------------|-----------------------------|---------------------------------------|
 * | Purpose              | Pass ref to child           | Customize what ref exposes            |
 * | Default Behavior     | Exposes DOM/native element  | Exposes custom functions/properties   |
 * | Use Case             | Access child input directly | Provide API (focus, clear, reset)     |
 * | Works Alone?         | Yes                         | No, needs forwardRef                  |
 *
 * ==============================================================
 * ❓ Q&A for Interviews
 * --------------------------------------------------------------
 * Q1: Why do we need forwardRef?
 *    → Because refs don’t naturally pass to custom components.
 *      forwardRef lets you forward them down to a DOM/native element.
 *
 * Q2: What is the difference between forwardRef and useImperativeHandle?
 *    → forwardRef = pass down the ref.
 *      useImperativeHandle = define what ref should expose.
 *
 * Q3: Real-world usage?
 *    - Reusable Input components (focus, clear, reset).
 *    - Custom Modal/BottomSheet that parent can open/close.
 *    - Exposing scrollTo() for custom ScrollViews.
 *
 * Q4: Is it a good practice to use them everywhere?
 *    → No. Only use when **parent must control child’s internal behavior**.
 *      Otherwise, prefer props & state (React’s normal data flow).
 *
 * ==============================================================
 */
