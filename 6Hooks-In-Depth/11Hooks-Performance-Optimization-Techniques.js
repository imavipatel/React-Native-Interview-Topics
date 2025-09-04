/**
 * ==============================================================
 * 📘 Hook Performance Optimization Techniques in React/React Native
 * ==============================================================
 *
 * 🟢 Why Optimize Hooks?
 * --------------------------------------------------------------
 * - React Hooks make state management easier, but careless usage
 *   can cause unnecessary re-renders and performance issues.
 * - Optimization ensures:
 *    1. Fewer wasted renders
 *    2. Stable references (functions/objects don’t recreate every render)
 *    3. Better memory usage in large apps
 *
 * ==============================================================
 * 🔹 Key Optimization Techniques
 * ==============================================================
 *
 * 1️⃣ useMemo → Memoize expensive calculations
 * --------------------------------------------------------------
 * - Problem: Expensive calculations run on every render.
 * - Solution: Wrap them in `useMemo` so result is cached until dependencies change.
 *
 * Example:
 */
import React, { useMemo, useState } from "react";

function ExpensiveCalculationComponent({ num }) {
  const [count, setCount] = useState(0);

  const expensiveValue = useMemo(() => {
    console.log("Running expensive calculation...");
    let total = 0;
    for (let i = 0; i < 100000000; i++) {
      total += i;
    }
    return total + num;
  }, [num]); // recalculates only if num changes

  return (
    <>
      <p>Expensive Result: {expensiveValue}</p>
      <button onClick={() => setCount(count + 1)}>Increment {count}</button>
    </>
  );
}

/**
 * --------------------------------------------------------------
 * 2️⃣ useCallback → Avoid recreating functions
 * --------------------------------------------------------------
 * - Problem: Functions are re-created on every render, causing child
 *   components to re-render unnecessarily.
 * - Solution: Wrap functions in `useCallback` to memoize them.
 *
 * Example:
 */
import React, { useState, useCallback } from "react";

function Child({ onClick }) {
  console.log("Child re-rendered");
  return <button onClick={onClick}>Click Me</button>;
}

export default function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log("Clicked!");
  }, []); // ✅ same reference across renders

  return (
    <>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <Child onClick={handleClick} />
    </>
  );
}

/**
 * --------------------------------------------------------------
 * 3️⃣ React.memo → Prevent re-render of child components
 * --------------------------------------------------------------
 * - Problem: Child components re-render even if props don’t change.
 * - Solution: Wrap child in `React.memo` to skip re-render when props are same.
 *
 * Example:
 */
import React from "react";

const ChildComponent = React.memo(({ value }) => {
  console.log("Child rendered");
  return <p>Value: {value}</p>;
});

/**
 * --------------------------------------------------------------
 * 4️⃣ useRef → Keep stable values across renders
 * --------------------------------------------------------------
 * - Problem: Values/functions recreated on each render.
 * - Solution: Store mutable values in `useRef` (doesn’t cause re-render).
 *
 * Example:
 */
import { useRef } from "react";

function TimerExample() {
  const timerRef = useRef(null);

  const startTimer = () => {
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        console.log("Running timer...");
      }, 1000);
    }
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  return (
    <>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
    </>
  );
}

/**
 * --------------------------------------------------------------
 * 5️⃣ Avoid Anonymous Functions in JSX
 * --------------------------------------------------------------
 * - Problem: Inline arrow functions create new references every render.
 * - Solution: Use `useCallback` or define functions outside JSX.
 *
 * ❌ Bad:
 * <Button onPress={() => doSomething()} />
 *
 * ✅ Good:
 * const handlePress = useCallback(() => doSomething(), []);
 * <Button onPress={handlePress} />
 *
 * --------------------------------------------------------------
 * 6️⃣ Split State Correctly
 * --------------------------------------------------------------
 * - Large state objects cause unnecessary re-renders.
 * - Split into smaller state pieces to optimize.
 *
 * --------------------------------------------------------------
 * 7️⃣ Lazy Initialization of State
 * --------------------------------------------------------------
 * - Initialize state lazily to avoid unnecessary expensive setup on every render.
 *
 * Example:
 */
const [items] = useState(() => {
  // ✅ runs only once
  return new Array(1000).fill(0).map((_, i) => i);
});

/**
 * --------------------------------------------------------------
 * 8️⃣ Debounce/Throttle Expensive Updates
 * --------------------------------------------------------------
 * - Avoid frequent re-renders by debouncing state updates (e.g. search input).
 * - Use libraries like lodash.debounce or implement custom debounce hooks.
 *
 * --------------------------------------------------------------
 * 9️⃣ Virtualized Lists
 * --------------------------------------------------------------
 * - For large lists, always use `FlatList`, `SectionList`, or libraries like FlashList.
 * - They render only visible items → prevents performance issues.
 *
 * ==============================================================
 * 🔹 Best Practices Checklist
 * ==============================================================
 * ✅ Use useMemo for expensive calculations
 * ✅ Use useCallback to memoize functions
 * ✅ Wrap child components in React.memo if props rarely change
 * ✅ Use useRef for stable values across renders
 * ✅ Avoid inline functions in JSX
 * ✅ Split state logically
 * ✅ Lazy initialize heavy state
 * ✅ Use debouncing/throttling for frequent updates
 * ✅ Always use virtualized lists for large data
 *
 * ==============================================================
 * 🔹 Q&A (Interview Style)
 * ==============================================================
 * Q1: What’s the difference between useMemo and useCallback?
 *   → useMemo memoizes the RESULT of a calculation, useCallback memoizes the FUNCTION itself.
 *
 * Q2: Why should you avoid inline functions in JSX?
 *   → Because they create new references every render → child components re-render unnecessarily.
 *
 * Q3: When should you use React.memo?
 *   → When child components are pure and depend only on props, to skip re-renders.
 *
 * Q4: How does useRef help with performance?
 *   → Keeps a stable reference across renders without triggering re-renders.
 *
 * ==============================================================
 * ✅ Final Takeaways
 * --------------------------------------------------------------
 * - Optimize with `useMemo`, `useCallback`, `React.memo`, and `useRef`.
 * - Avoid unnecessary re-renders by stabilizing function/object references.
 * - For heavy operations → lazy initialization, debouncing, virtualized lists.
 * - Optimization is about balance → don’t overuse hooks unnecessarily.
 * ==============================================================
 */
