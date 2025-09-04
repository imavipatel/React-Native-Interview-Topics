/**
 * ==============================================================
 * 📘 React Notes – useEffect Pitfalls & Performance Costs
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 What is useEffect?
 * - Hook to run side effects (data fetching, subscriptions, timers, logging).
 * - Runs AFTER render (not blocking paint).
 *
 * 🔹 Why Pitfalls?
 * - Incorrect usage leads to:
 *    ❌ Performance issues (too many re-renders)
 *    ❌ Memory leaks
 *    ❌ Stale closures (using old state/props)
 *    ❌ Infinite loops
 *
 * 🔹 Performance Cost
 * - Every time useEffect runs:
 *    ✅ It re-executes the callback.
 *    ✅ If dependencies are unstable (like objects/functions created inline),
 *       effect re-runs unnecessarily.
 *    ✅ Heavy logic inside useEffect slows app.
 *
 * ==============================================================
 * 🔹 Common Pitfalls with Examples
 * --------------------------------------------------------------
 */

//
// ❌ Pitfall 1: Missing Dependency → Stale Data
//
import React, { useEffect, useState } from "react";

function Example1({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then((res) => res.json())
      .then(setUser);
  }, []); // ❌ forgot 'userId' in dependencies

  return <Text>{user?.name}</Text>;
}

// ✅ Fix:
useEffect(() => {
  fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
    .then((res) => res.json())
    .then(setUser);
}, [userId]);

//
// ❌ Pitfall 2: Infinite Loop (wrong dependency)
//
function Example2() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(count + 1); // ❌ updating state inside effect without care
  }, [count]); // keeps updating → infinite loop

  return <Text>{count}</Text>;
}

// ✅ Fix: Use functional update or condition
useEffect(() => {
  const timer = setInterval(() => {
    setCount((c) => c + 1); // ✅ no infinite loop
  }, 1000);

  return () => clearInterval(timer);
}, []);

//
// ❌ Pitfall 3: Expensive Work Inside useEffect
//
useEffect(() => {
  // ❌ Doing heavy computation directly
  for (let i = 0; i < 1000000000; i++) {}
  console.log("Done heavy work");
}, []);

// ✅ Fix: Move heavy logic outside, or use Web Worker / memoization
useEffect(() => {
  expensiveOperation();
}, []);

//
// ❌ Pitfall 4: Creating Functions/Objects Inline
//
useEffect(() => {
  const fetchData = async () => {
    // ❌ This re-creates fetchData every render → unstable dep
    const res = await fetch("/api");
    console.log(await res.json());
  };

  fetchData();
}, []); // works, but risky if fetchData used as dep elsewhere

// ✅ Fix: useCallback for stable functions
const fetchData = useCallback(async () => {
  const res = await fetch("/api");
  console.log(await res.json());
}, []);

useEffect(() => {
  fetchData();
}, [fetchData]);

//
// ❌ Pitfall 5: Not Cleaning Up (Memory Leaks)
//
useEffect(() => {
  const id = setInterval(() => {
    console.log("Running...");
  }, 1000);

  // ❌ forgot cleanup
}, []);

// ✅ Fix:
useEffect(() => {
  const id = setInterval(() => console.log("Running..."), 1000);
  return () => clearInterval(id); // ✅ cleanup
}, []);

//
// ✅ Example 6: Using useEffect for something that belongs in useMemo
//
useEffect(() => {
  const result = expensiveCalculation(); // ❌ recalculated every render
  console.log(result);
}, [input]);

// ✅ Fix: useMemo for pure calculations
const result = useMemo(() => expensiveCalculation(), [input]);

/**
 * ==============================================================
 * 🔍 Best Practices to Avoid Pitfalls
 * --------------------------------------------------------------
 * 1️⃣ Always specify correct dependencies (or use functional updates).
 * 2️⃣ Use cleanup functions to avoid memory leaks (timers, listeners).
 * 3️⃣ Avoid putting heavy computations inside useEffect → useMemo/useCallback.
 * 4️⃣ Be careful with async calls → cancel them on unmount.
 * 5️⃣ Don’t overuse useEffect:
 *     - If logic is pure (derives from props/state), useMemo/useState is better.
 *     - Reserve useEffect for true side effects (fetch, subscriptions).
 * 6️⃣ Watch out for inline functions/objects → useCallback/useMemo for stability.
 *
 * ==============================================================
 * ❓ Q&A for Interviews
 * --------------------------------------------------------------
 * Q1: What’s the most common cause of infinite loops in useEffect?
 *    → Updating state inside useEffect with that same state in dependencies.
 *
 * Q2: How do you optimize expensive logic inside useEffect?
 *    → Move to useMemo/useCallback or background worker.
 *
 * Q3: How does dependency array affect performance?
 *    → Wrong dependencies → stale data OR unnecessary re-runs.
 *
 * Q4: When should you avoid useEffect?
 *    → When you can compute value directly from props/state (derived state).
 *
 * Q5: Why cleanup in useEffect is important?
 *    → Prevents memory leaks (timers, async, subscriptions).
 *
 * ==============================================================
 */
