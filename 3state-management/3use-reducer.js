/**
 * ==============================================================
 * 📘 React Notes – useReducer Hook
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 What is useReducer?
 * - A React Hook for managing **complex state logic**.
 * - Alternative to useState when:
 *    ✅ State transitions depend on previous state.
 *    ✅ There are multiple related values in state.
 *    ✅ You want predictable state management (like Redux).
 *
 * 🔹 Why use it?
 * - Keeps state logic in one place → reducer function.
 * - Easier to test, debug, and scale than scattered useState calls.
 * - Useful when state updates follow specific "actions".
 *
 * --------------------------------------------------------------
 * 🔹 Syntax
 * const [state, dispatch] = useReducer(reducer, initialState);
 *
 * - reducer → A pure function `(state, action) => newState`
 * - initialState → Starting value for state
 * - dispatch → Function to send an "action" to reducer
 * - action → Object with `type` (and optionally payload)
 *
 * --------------------------------------------------------------
 * 🔹 Difference: useState vs useReducer
 * - useState → Good for simple local states.
 * - useReducer → Good for complex or structured state transitions.
 *
 * ==============================================================
 * 🔹 Example – Counter with useReducer
 * --------------------------------------------------------------
 */
import React, { useReducer } from "react";
import { View, Button, Text } from "react-native";

// 1️⃣ Reducer function
function counterReducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "reset":
      return { count: 0 };
    default:
      return state; // must return current state by default
  }
}

export default function CounterApp() {
  // 2️⃣ Initialize useReducer
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Count: {state.count}</Text>
      <Button title="➕ Increment" onPress={() => dispatch({ type: "increment" })} />
      <Button title="➖ Decrement" onPress={() => dispatch({ type: "decrement" })} />
      <Button title="🔄 Reset" onPress={() => dispatch({ type: "reset" })} />
    </View>
  );
}

/**
 * ✅ How it works:
 * - State is `{ count: 0 }` initially.
 * - dispatch({ type: "increment" }) → reducer updates count.
 * - Centralized reducer keeps logic clean & predictable.
 *
 * ==============================================================
 * 🔹 Example – Form with useReducer
 * --------------------------------------------------------------
 */
import React, { useReducer } from "react";
import { View, TextInput, Button, Text } from "react-native";

// Reducer for form
function formReducer(state, action) {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "RESET":
      return { name: "", email: "" };
    default:
      return state;
  }
}

export default function FormApp() {
  const [state, dispatch] = useReducer(formReducer, { name: "", email: "" });

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Enter Name"
        value={state.name}
        onChangeText={(text) => dispatch({ type: "SET_NAME", payload: text })}
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <TextInput
        placeholder="Enter Email"
        value={state.email}
        onChangeText={(text) => dispatch({ type: "SET_EMAIL", payload: text })}
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Button title="Reset" onPress={() => dispatch({ type: "RESET" })} />
      <Text>Name: {state.name}</Text>
      <Text>Email: {state.email}</Text>
    </View>
  );
}

/**
 * ✅ Benefits in forms:
 * - Single reducer manages multiple related states (name + email).
 * - Easier than having multiple useState hooks.
 *
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: When should you use useReducer instead of useState?
 *    → When state logic is complex, involves multiple sub-values,
 *      or when next state depends on previous state.
 *
 * Q2: What arguments does useReducer take?
 *    → (reducerFunction, initialState [, initFunction])
 *
 * Q3: Why must reducer be a pure function?
 *    → To ensure predictable state updates (no side effects).
 *
 * Q4: Can useReducer replace Redux?
 *    → For local component state, yes. But Redux is better for
 *      global state across multiple components.
 *
 * Q5: How does dispatch work in useReducer?
 *    → dispatch sends an action object to reducer → reducer returns new state.
 *
 * Q6: Real-world use case?
 *    → Form handling, managing toggles/filters, counters, complex UI states.
 *
 * ==============================================================
 */
