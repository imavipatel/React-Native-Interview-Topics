/**
 * ==============================================================
 * 📘 React Notes – useState vs setState (Class vs Hooks)
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 State in React
 * - "State" = data that changes over time and affects UI.
 * - React re-renders a component when its state changes.
 *
 * --------------------------------------------------------------
 * 🔹 State in Class Components → setState()
 * - Class components use `this.state` to store state.
 * - Updating is done using `this.setState()`.
 * - setState() is **asynchronous** → React batches updates for performance.
 * - Always provides a way to **merge** new state with old state.
 *
 * Example:
 *   this.state = { count: 0, name: "John" };
 *   this.setState({ count: this.state.count + 1 });
 *   // Only `count` changes, `name` stays same.
 *
 * --------------------------------------------------------------
 * 🔹 State in Functional Components → useState()
 * - Functional components use the **useState hook**.
 * - `useState(initialValue)` returns:
 *     1) Current state value
 *     2) Function to update state
 * - Unlike `setState` in classes, updating with useState:
 *    * Replaces the state (does not merge automatically).
 *    * You need to manually preserve other values when updating objects.
 *
 * Example:
 *   const [count, setCount] = useState(0);
 *   setCount(count + 1);
 *
 * --------------------------------------------------------------
 * 🔹 Key Differences Between setState & useState
 *
 * 1) **Declaration**
 *    - Class: `this.state = { count: 0 }`
 *    - Hooks: `const [count, setCount] = useState(0)`
 *
 * 2) **Update**
 *    - Class: `this.setState({ count: this.state.count + 1 })`
 *    - Hooks: `setCount(count + 1)`
 *
 * 3) **Merging**
 *    - Class: setState merges updates → only changed fields updated.
 *    - Hooks: useState replaces → must spread old state if object.
 *
 * 4) **Async Behavior**
 *    - Both are async internally, but:
 *      * Class setState has optional callback: `this.setState(..., callback)`
 *      * Hooks: useEffect is used instead of callback after update.
 *
 * 5) **Multiple States**
 *    - Class: One state object, must manage everything inside it.
 *    - Hooks: Multiple independent states (useState can be called many times).
 *
 * ==============================================================
 * 🔹 Examples
 * --------------------------------------------------------------
 *
 * ✅ Class Component with setState
 */
import React, { Component } from "react";
import { View, Text, Button } from "react-native";

class CounterClass extends Component {
  state = { count: 0, name: "John" };

  increment = () => {
    // ✅ Merges count, keeps name
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <View>
        <Text>{this.state.name}</Text>
        <Text>Count: {this.state.count}</Text>
        <Button title="Increment" onPress={this.increment} />
      </View>
    );
  }
}

/**
 * ✅ Functional Component with useState
 */
import React, { useState } from "react";
import { View, Text, Button } from "react-native";

function CounterFunction() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("John");

  return (
    <View>
      <Text>{name}</Text>
      <Text>Count: {count}</Text>
      {/* Replaces count only, name stays separate */}
      <Button title="Increment" onPress={() => setCount(count + 1)} />
    </View>
  );
}

/**
 * --------------------------------------------------------------
 * 🔹 Object State Handling in Hooks
 */
function UserProfile() {
  const [user, setUser] = useState({ name: "John", age: 25 });

  const updateAge = () => {
    // ❌ setUser({ age: 26 }) → would remove name
    // ✅ Need to spread old state
    setUser((prev) => ({ ...prev, age: prev.age + 1 }));
  };

  return (
    <View>
      <Text>
        {user.name} - {user.age}
      </Text>
      <Button title="Increase Age" onPress={updateAge} />
    </View>
  );
}

/**
 * ==============================================================
 * 🔹 Best Practices
 * --------------------------------------------------------------
 * ✅ For classes:
 * - Use functional setState when new state depends on old state:
 *     this.setState((prev) => ({ count: prev.count + 1 }));
 *
 * ✅ For hooks:
 * - Use multiple useState for independent values (simpler).
 * - Use functional updates for derived state:
 *     setCount((prev) => prev + 1);
 * - When managing complex objects, consider `useReducer`.
 *
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: What is the difference between setState and useState?
 *    → setState (class) merges state, useState (hooks) replaces state.
 *
 * Q2: Why is setState asynchronous?
 *    → React batches multiple updates for performance. Immediate update
 *      would cause multiple re-renders.
 *
 * Q3: How to run code after state update in class vs hooks?
 *    → Class: `this.setState(newState, callback)`.
 *      Hooks: useEffect with dependency on the state.
 *
 * Q4: Can you merge states in useState?
 *    → Not automatic. Must manually spread previous state:
 *      setState(prev => ({ ...prev, age: prev.age + 1 }))
 *
 * Q5: When should you use useReducer instead of useState?
 *    → When state is complex with multiple related values or logic.
 *
 * Q6: Can you have multiple useState in one component?
 *    → Yes! Each call manages independent piece of state.
 *
 * ==============================================================
 */
