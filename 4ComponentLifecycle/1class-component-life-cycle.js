/**
 * ==============================================================
 * 📘 React – Lifecycle Methods in Class Components
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 What are Lifecycle Methods?
 * - In **Class Components**, lifecycle methods are special functions
 *   that run automatically during a component’s life.
 * - React divides the component lifecycle into 3 phases:
 *    1️⃣ Mounting   → Component is created & inserted into the DOM.
 *    2️⃣ Updating   → Component re-renders when state/props change.
 *    3️⃣ Unmounting → Component is removed from the DOM.
 *
 * --------------------------------------------------------------
 * 🔹 Why Lifecycle Methods?
 * - They let us:
 *    ✅ Run code at specific times (fetch data, set timers, clean up).
 *    ✅ Control performance by updating only when necessary.
 *    ✅ Handle side effects (API calls, event listeners).
 *
 * ==============================================================
 * 🔹 Lifecycle Phases & Methods
 * --------------------------------------------------------------
 *
 * 1️⃣ Mounting (When the component is first created)
 * - constructor()
 *   → Initialize state, bind methods.
 *   → ⚠️ Avoid side effects (like API calls) here.
 *
 * - static getDerivedStateFromProps(props, state)
 *   → Sync state with props before rendering.
 *   → Rarely used, static method, no `this`.
 *
 * - render()
 *   → Returns JSX (UI).
 *   → Pure function: should not update state or interact with DOM directly.
 *
 * - componentDidMount()
 *   → Runs **once after first render**.
 *   → ✅ Best place for API calls, subscriptions, timers.
 *
 * --------------------------------------------------------------
 * 2️⃣ Updating (When props or state change)
 * - static getDerivedStateFromProps(props, state)
 *   → Runs before re-render.
 *   → Sync state with updated props if needed.
 *
 * - shouldComponentUpdate(nextProps, nextState)
 *   → Returns `true/false` → controls re-render.
 *   → Useful for performance optimization.
 *
 * - render()
 *   → Re-renders UI with updated props/state.
 *
 * - getSnapshotBeforeUpdate(prevProps, prevState)
 *   → Captures info from DOM before it updates (e.g., scroll position).
 *
 * - componentDidUpdate(prevProps, prevState, snapshot)
 *   → Runs after update is flushed to DOM.
 *   → ✅ Good for reacting to prop/state changes (e.g., fetch new data).
 *
 * --------------------------------------------------------------
 * 3️⃣ Unmounting (When component is removed)
 * - componentWillUnmount()
 *   → Cleanup code here.
 *   → ✅ Remove event listeners, cancel API calls, clear timers.
 *
 * ==============================================================
 * 🔹 Example: Lifecycle Methods in a Class Component
 */
import React from "react";
import { Text, View } from "react-native";

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    console.log("Constructor: Initialize state");
  }

  static getDerivedStateFromProps(props, state) {
    console.log("getDerivedStateFromProps: Sync props to state if needed");
    return null; // return new state object or null
  }

  componentDidMount() {
    console.log("componentDidMount: Run API call / subscribe events");
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("shouldComponentUpdate: Control re-render");
    return true; // return false to block update
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log("getSnapshotBeforeUpdate: Capture DOM info (e.g., scroll)");
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("componentDidUpdate: React to updates");
  }

  componentWillUnmount() {
    console.log("componentWillUnmount: Cleanup before removal");
  }

  render() {
    console.log("Render: Returning UI");
    return (
      <View>
        <Text>Count: {this.state.count}</Text>
      </View>
    );
  }
}

/**
 * ==============================================================
 * 📊 Lifecycle Flow (Class Component)
 * ==============================================================
 *
 * 🔹 Mounting
 * constructor() → getDerivedStateFromProps() → render() → componentDidMount()
 *
 * 🔹 Updating
 * getDerivedStateFromProps() → shouldComponentUpdate() → render()
 * → getSnapshotBeforeUpdate() → componentDidUpdate()
 *
 * 🔹 Unmounting
 * componentWillUnmount()
 *
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: Which lifecycle method is best for API calls?
 *    → componentDidMount (runs once after initial render).
 *
 * Q2: How do you prevent unnecessary re-renders?
 *    → Use shouldComponentUpdate (or React.PureComponent).
 *
 * Q3: Difference between componentDidMount and componentDidUpdate?
 *    → componentDidMount → runs once after first render.
 *      componentDidUpdate → runs after every update.
 *
 * Q4: What is getSnapshotBeforeUpdate used for?
 *    → To capture DOM info (like scroll position) before DOM updates.
 *
 * Q5: Which method is used for cleanup?
 *    → componentWillUnmount.
 *
 * ==============================================================
 */
