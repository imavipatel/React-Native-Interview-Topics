/**
 * ==============================================================
 * 📘 React Notes – Functional vs Class Components
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 Class Components
 * - Written using ES6 `class` and extend `React.Component`.
 * - Use lifecycle methods like `componentDidMount`, `componentDidUpdate`.
 * - Manage state with `this.state` and `this.setState()`.
 * - More boilerplate (extra code) and harder to reuse logic.
 * - Mostly used in older React projects.
 *
 * 🔹 Functional Components
 * - Just normal JS functions that return JSX.
 * - Use **Hooks** (e.g., `useState`, `useEffect`) for state and lifecycle.
 * - Much simpler, shorter, and easier to test.
 * - Recommended by React team → the new standard.
 *
 * 🔹 Main Differences
 * - Class → needs `render()` method.
 *   Function → directly return JSX.
 *
 * - Class → state handled with `this.state` + `this.setState()`.
 *   Function → state handled with `useState()`.
 *
 * - Class → lifecycle methods (mount, update, unmount).
 *   Function → `useEffect` hook (one hook can do all).
 *
 * - Code Reuse → Class uses HOC / Render Props.
 *   Function uses Custom Hooks (cleaner).
 *
 * ✅ Why use Functional Components?
 * - Easier to read and write.
 * - Hooks make them very powerful.
 * - Better for reusing logic.
 * - Now preferred in React world.
 *
 * ==============================================================
 */

//
// 🔹 Example 1: Class Component
//
import React from "react";

class CounterClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    console.log("Constructor → runs first");
  }

  componentDidMount() {
    console.log("Mounted → runs once after first render");
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("Updated → runs after state/props change");
  }

  componentWillUnmount() {
    console.log("Unmounted → runs before component is removed");
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    console.log("Render → returns UI");
    return (
      <div>
        <p>Count (Class): {this.state.count}</p>
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}

//
// 🔹 Example 2: Functional Component with Hooks
//
import React, { useState, useEffect } from "react";

function CounterFunction() {
  const [count, setCount] = useState(0);

  // Runs on every render
  useEffect(() => {
    console.log("Runs after every render");
  });

  // Runs only once (on mount)
  useEffect(() => {
    console.log("Mounted");

    return () => {
      console.log("Unmounted → cleanup here");
    };
  }, []);

  // Runs when count changes
  useEffect(() => {
    console.log("Count changed");
  }, [count]);

  return (
    <div>
      <p>Count (Function): {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

/**
 * ==============================================================
 * 🔹 Lifecycle Mapping (Class vs Function)
 * ==============================================================
 *
 * 🟢 Mounting (when component loads)
 * --------------------------------------------------------------
 * Class → constructor → render → componentDidMount
 * Function → useState() + useEffect(() => {}, [])
 *
 * 🟢 Updating (when props or state change)
 * --------------------------------------------------------------
 * Class → render → componentDidUpdate
 * Function → useEffect(() => {}, [dep])
 *
 * 🟢 Unmounting (when component removed)
 * --------------------------------------------------------------
 * Class → componentWillUnmount
 * Function → cleanup inside useEffect
 *
 * 🟢 Extra:
 * - Class → getSnapshotBeforeUpdate (before DOM update)
 * - Function → useLayoutEffect
 *
 * - Class → componentDidCatch (error boundary)
 * - Function → no direct hook (still need class)
 *
 * ==============================================================
 */

//
// 🔹 Example 3: Lifecycle in Functional Component
//
/**
 * useEffect(() => {
 *   console.log("Mounted");
 *
 *   return () => {
 *     console.log("Unmounted");
 *   };
 * }, []);
 *
 * useEffect(() => {
 *   console.log("Runs when dependency changes");
 * }, [value, count]);
 *
 * useLayoutEffect(() => {
 *   console.log("Runs before paint (like snapshot)");
 * });
 */

/**
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: Which lifecycle methods do hooks replace?
 *    → componentDidMount, componentDidUpdate, componentWillUnmount
 *      → all replaced by useEffect.
 *
 * Q2: Difference between useEffect and useLayoutEffect?
 *    → useEffect → runs after render (non-blocking).
 *      useLayoutEffect → runs before paint (blocking).
 *
 * Q3: Why are functional components preferred?
 *    → Less code, hooks are powerful, easier to reuse logic,
 *      and official React team recommends them.
 *
 * Q4: Can functional components handle errors?
 *    → No direct hook yet. Need Error Boundaries (class components).
 *
 * Q5: Which runs first: render() or useEffect?
 *    → render runs first, then useEffect runs after paint.
 *
 * ==============================================================
 */
