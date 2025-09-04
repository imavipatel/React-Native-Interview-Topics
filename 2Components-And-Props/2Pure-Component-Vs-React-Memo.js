/**
 * ==============================================================
 * 📘 React Notes – PureComponent vs React.memo
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 Why do we need them?
 * - In React, when a parent re-renders, all its children re-render by default.
 * - This can be wasteful if props/state haven’t actually changed.
 * - To fix this, React provides **PureComponent (class)** and **React.memo (function)**.
 * - Both help in **performance optimization** by skipping unnecessary renders.
 *
 * --------------------------------------------------------------
 * 🔹 PureComponent (for Class Components)
 * - Special version of `React.Component`.
 * - Automatically implements `shouldComponentUpdate()`.
 * - Does a **shallow comparison** of props and state:
 *    ✅ If nothing changed → skips re-render.
 *    ❌ If object/array reference changed → re-renders (even if values same).
 * - Great for simple, class-based components.
 *
 * --------------------------------------------------------------
 * 🔹 React.memo (for Functional Components)
 * - Higher Order Component (HOC) → wraps a functional component.
 * - Works just like PureComponent:
 *    ✅ Re-renders only when props change (shallow comparison).
 * - Syntax: `export default React.memo(MyComponent)`
 * - Can also accept a custom comparison function for more control.
 * - Used with function components + hooks.
 *
 * --------------------------------------------------------------
 * 🔹 Key Difference
 * - PureComponent → Only for **class components**.
 * - React.memo → Only for **functional components**.
 *
 * - PureComponent → checks **props + state**.
 * - React.memo → checks **only props** (since function components use hooks for state).
 *
 * ✅ Use them when:
 * - Components re-render often without real prop/state changes.
 * - Components are heavy (big lists, expensive rendering).
 *
 * ⚠️ Avoid them when:
 * - Props are complex nested objects (shallow compare fails).
 * - Component is simple/light → optimization not needed.
 *
 * ==============================================================
 */

//
// 🔹 Example 1: PureComponent
//
import React, { PureComponent } from "react";

class Greeting extends PureComponent {
  render() {
    console.log("Greeting rendered");
    return <h1>Hello, {this.props.name}</h1>;
  }
}

// Parent re-renders → Greeting will ONLY re-render if `name` prop changes.

//
// 🔹 Example 2: React.memo
//
import React from "react";

const GreetingFn = ({ name }) => {
  console.log("GreetingFn rendered");
  return <h1>Hello, {name}</h1>;
};

export default React.memo(GreetingFn);

// Parent re-renders → GreetingFn will ONLY re-render if `name` prop changes.

//
// 🔹 Example 3: React.memo with custom compare
//
const User = ({ user }) => {
  console.log("User rendered");
  return <div>{user.name}</div>;
};

// Custom comparison → only re-render if user.id changes
function areEqual(prevProps, nextProps) {
  return prevProps.user.id === nextProps.user.id;
}

// export default React.memo(User, areEqual);

/**
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: What is the difference between React.Component and React.PureComponent?
 *    → Component → always re-renders when parent renders.
 *      PureComponent → re-renders only if props/state actually change
 *      (shallow compare).
 *
 * Q2: What is React.memo?
 *    → A wrapper for functional components that prevents unnecessary
 *      re-renders using shallow prop comparison.
 *
 * Q3: Can PureComponent prevent re-renders for nested objects/arrays?
 *    → No. Shallow compare only checks references, not deep equality.
 *      → If array/object reference changes, it will re-render.
 *
 * Q4: How to optimize React.memo with complex props?
 *    → Pass a custom comparison function as second argument.
 *
 * Q5: When should we avoid PureComponent/React.memo?
 *    → For small, simple components (extra comparison cost can outweigh benefit).
 *
 * Q6: Which checks both state + props: PureComponent or React.memo?
 *    → PureComponent checks both.
 *      React.memo checks only props (state is inside hooks).
 *
 * ==============================================================
 */
