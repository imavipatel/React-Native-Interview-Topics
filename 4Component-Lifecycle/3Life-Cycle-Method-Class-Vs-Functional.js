/**
 * ==============================================================
 * 📘 React – Lifecycle Methods (Class vs Hooks with useEffect)
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * - Class components use **lifecycle methods** to handle side effects.
 * - Functional components use **useEffect** hook for the same purpose.
 * - useEffect can replicate all lifecycle phases:
 *    ✅ Mount (initial render)
 *    ✅ Update (when dependencies change)
 *    ✅ Unmount (cleanup)
 *
 * ==============================================================
 * 🔹 CLASS COMPONENT LIFECYCLE
 * --------------------------------------------------------------
 * 1) Mounting (component created)
 *    - constructor()
 *    - componentDidMount()
 *
 * 2) Updating (state/props change)
 *    - shouldComponentUpdate()
 *    - componentDidUpdate()
 *
 * 3) Unmounting (component removed)
 *    - componentWillUnmount()
 *
 * --------------------------------------------------------------
 * 🔹 FUNCTIONAL COMPONENT (with useEffect)
 * --------------------------------------------------------------
 * - useEffect(callback, deps)
 *    * callback → effect logic
 *    * deps → dependency array (controls when effect runs)
 *
 * - Cleanup function → replaces componentWillUnmount
 *
 * ==============================================================
 * 📊 Side-by-Side Comparison
 * ==============================================================
 *
 * 🔹 Mounting
 * --------------------------------------------------------------
 * Class:       componentDidMount()
 * Function:    useEffect(() => { ... }, [])
 *
 * 🔹 Updating
 * --------------------------------------------------------------
 * Class:       componentDidUpdate(prevProps, prevState)
 * Function:    useEffect(() => { ... }, [dependencies])
 *
 * 🔹 Unmounting
 * --------------------------------------------------------------
 * Class:       componentWillUnmount()
 * Function:    useEffect(() => {
 *                 return () => { ...cleanup... };
 *              }, [])
 *
 * 🔹 Every Render
 * --------------------------------------------------------------
 * Class:       Not directly available (combine DidMount + DidUpdate)
 * Function:    useEffect(() => { ... }); // No deps → runs every render
 *
 * ==============================================================
 * 🔹 Examples
 * --------------------------------------------------------------
 */

// CLASS COMPONENT EXAMPLE
import React from "react";
import { Text, View } from "react-native";

class ClassTimer extends React.Component {
  state = { count: 0 };

  componentDidMount() {
    console.log("Mounted");
    this.timer = setInterval(() => {
      this.setState({ count: this.state.count + 1 });
    }, 1000);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.count !== this.state.count) {
      console.log("Updated count:", this.state.count);
    }
  }

  componentWillUnmount() {
    console.log("Unmounting...");
    clearInterval(this.timer);
  }

  render() {
    return (
      <View>
        <Text>Count: {this.state.count}</Text>
      </View>
    );
  }
}

// --------------------------------------------------------------

// FUNCTIONAL COMPONENT EXAMPLE (same logic with useEffect)
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

function HookTimer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Mounted");
    const timer = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    return () => {
      console.log("Unmounting...");
      clearInterval(timer);
    };
  }, []); // Empty deps → run once (mount) + cleanup (unmount)

  useEffect(() => {
    console.log("Updated count:", count);
  }, [count]); // Runs when `count` changes

  return (
    <View>
      <Text>Count: {count}</Text>
    </View>
  );
}

/**
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: Can useEffect replace all lifecycle methods?
 *    → Yes. With correct dependency arrays and cleanup, it can handle
 *      mount, update, and unmount phases.
 *
 * Q2: What happens if you return nothing from useEffect?
 *    → Then there’s no cleanup. Good for effects that don’t need cleanup.
 *
 * Q3: How to run effect only on state/prop change?
 *    → Add them to dependency array: [state, prop]
 *
 * Q4: Why is useEffect preferred over class lifecycle?
 *    → Cleaner, less boilerplate, separates concerns, and avoids bugs
 *      from multiple lifecycle methods.
 *
 * ==============================================================
 */
