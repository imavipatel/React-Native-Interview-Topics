/**
 * ==============================================================
 * 📘 React Notes – Lifting State Up & Composition
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 What is "Lifting State Up"?
 * - When two or more components need to share the same state/data,
 *   instead of duplicating state in each component, we "lift" the
 *   state up to their **common parent**.
 * - This makes the parent the "single source of truth".
 * - The child components receive data as props and send changes back
 *   via callback functions.
 *
 * ✅ Why do this?
 * - Avoids inconsistent data (keeps state in one place).
 * - Makes components more predictable and easier to debug.
 * - Encourages reusable and stateless child components.
 *
 * --------------------------------------------------------------
 * 🔹 What is "Composition"?
 * - Composition is a way to build components by combining smaller ones.
 * - Instead of inheritance (OOP-style), React encourages **composition**.
 * - Example: A `<Card>` component that wraps children:
 *     <Card><Text>Hello</Text></Card>
 *
 * ✅ Why Composition?
 * - More flexible than inheritance.
 * - Promotes reusability by reusing simple components.
 * - Follows React’s philosophy: “UI is a tree of components.”
 *
 * ==============================================================
 * 🔹 Example – Lifting State Up
 * --------------------------------------------------------------
 * ✅ Scenario: Two text inputs should show the same text.
 */
import React, { useState } from "react";
import { View, TextInput, Text } from "react-native";

function InputBox({ value, onChange }) {
  return (
    <TextInput
      style={{ borderWidth: 1, margin: 5, padding: 5 }}
      value={value}
      onChangeText={onChange}
    />
  );
}

export default function ParentComponent() {
  const [text, setText] = useState("");

  return (
    <View>
      {/* Both inputs share the same state from parent */}
      <InputBox value={text} onChange={setText} />
      <InputBox value={text} onChange={setText} />
      <Text>You typed: {text}</Text>
    </View>
  );
}

/**
 * ✅ Here:
 * - State `text` is lifted up to ParentComponent.
 * - Both InputBox children receive value & update callback.
 * - Keeps UI consistent across inputs.
 *
 * ==============================================================
 * 🔹 Example – Composition
 * --------------------------------------------------------------
 */
import React from "react";
import { View, Text } from "react-native";

function Card({ children }) {
  return (
    <View style={{ padding: 15, margin: 10, borderWidth: 1, borderRadius: 8 }}>
      {children}
    </View>
  );
}

export default function CompositionExample() {
  return (
    <View>
      <Card>
        <Text>📘 This is inside a Card</Text>
      </Card>
      <Card>
        <Text>⭐ Composition lets us wrap anything!</Text>
      </Card>
    </View>
  );
}

/**
 * ✅ Here:
 * - Card is a reusable wrapper component.
 * - It uses `props.children` to render whatever is inside.
 * - Demonstrates flexible UI building via composition.
 *
 * ==============================================================
 * 🔹 Lifting State Up vs Composition
 * --------------------------------------------------------------
 * - Lifting State Up → About **data sharing** (move state to parent).
 * - Composition → About **UI building** (combine small components).
 *
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: What is lifting state up?
 *    → Moving state to the nearest common parent so multiple children
 *      can share and stay in sync.
 *
 * Q2: Why not keep state inside each child?
 *    → Leads to duplication & inconsistencies (children won't sync).
 *
 * Q3: What problem does composition solve?
 *    → Allows flexible UI design without inheritance.
 *
 * Q4: How is composition related to children prop?
 *    → Composition uses `props.children` to pass nested elements.
 *
 * Q5: Real-world example of lifting state up?
 *    → Form inputs where parent needs to validate/submit data.
 *
 * Q6: Real-world example of composition?
 *    → Layout wrappers like Card, Modal, or ThemedContainer.
 *
 * ==============================================================
 */
