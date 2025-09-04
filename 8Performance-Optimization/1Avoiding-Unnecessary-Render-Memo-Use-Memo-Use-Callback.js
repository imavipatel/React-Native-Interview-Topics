/**
 * ===================================================================
 * 📘 Avoiding Unnecessary Renders – memo, useMemo, useCallback
 * ===================================================================
 *
 * 🟢 Introduction
 * -------------------------------------------------------------------
 * - In React, when a parent component re-renders, all its child components
 *   re-render by default, even if props/state did not change.
 * - This can hurt performance in **large apps** (lists, complex UI).
 * - React provides tools like **React.memo, useMemo, useCallback** to
 *   optimize and avoid wasted renders.
 *
 * ===================================================================
 * 🔹 React.memo (for components)
 * -------------------------------------------------------------------
 * - Wraps a component and makes it render only when **props change**.
 * - Think of it as **PureComponent** for functional components.
 *
 * Example:
 */
import React from "react";

const Child = React.memo(({ value }) => {
  console.log("🔄 Child re-rendered");
  return <div>Value: {value}</div>;
});

function Parent() {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      {/* Child will not re-render unless "value" changes */}
      <Child value="fixed" />
    </div>
  );
}

/**
 * Without React.memo → Child would re-render every time Parent re-renders.
 * With React.memo → Child skips re-render if props are same.
 *
 * ===================================================================
 * 🔹 useCallback (for functions)
 * -------------------------------------------------------------------
 * - Functions are recreated on every render in React.
 * - If we pass functions as props, children may re-render unnecessarily.
 * - useCallback memoizes the function → keeps the same reference across renders.
 *
 * Example:
 */
const Button = React.memo(({ onClick }) => {
  console.log("🔄 Button re-rendered");
  return <button onClick={onClick}>Click</button>;
});

function App() {
  const [count, setCount] = React.useState(0);

  // Memoize function
  const handleClick = React.useCallback(() => {
    console.log("Clicked");
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      {/* Without useCallback → handleClick would change every render */}
      <Button onClick={handleClick} />
    </div>
  );
}

/**
 * ✅ useCallback is useful when:
 * - Passing functions to memoized components (React.memo).
 * - Passing functions to dependencies of useEffect/useMemo.
 *
 * ===================================================================
 * 🔹 useMemo (for values)
 * -------------------------------------------------------------------
 * - Memoizes **expensive calculations** so they are not re-computed
 *   on every render.
 * - Returns a cached value unless dependencies change.
 *
 * Example:
 */
function ExpensiveComponent({ num }) {
  const expensiveValue = React.useMemo(() => {
    console.log("⚡ Expensive calculation...");
    let total = 0;
    for (let i = 0; i < 1e7; i++) total += i;
    return total + num;
  }, [num]); // recompute only if num changes

  return <p>Value: {expensiveValue}</p>;
}

/**
 * ✅ useMemo is useful when:
 * - Doing heavy computations (sorting, filtering, math).
 * - Avoiding recalculation of derived data.
 *
 * ===================================================================
 * 🔹 Comparison Table
 * -------------------------------------------------------------------
 *
 * | Hook/Method   | Purpose                           | Usage Example                           |
 * |---------------|-----------------------------------|------------------------------------------|
 * | React.memo    | Prevents re-render of components | <Child /> renders only if props change   |
 * | useCallback   | Memoizes functions               | Pass stable callback to child components |
 * | useMemo       | Memoizes values/calculations     | Cache expensive computation results      |
 *
 * ===================================================================
 * 🔹 Best Practices
 * -------------------------------------------------------------------
 * 1. Use **React.memo** for components that:
 *    - Receive same props often.
 *    - Are re-rendered unnecessarily.
 *
 * 2. Use **useCallback** for functions passed to children
 *    (to avoid re-renders due to new function references).
 *
 * 3. Use **useMemo** for expensive calculations or derived data.
 *
 * 4. ❌ Don’t overuse → Sometimes memoization overhead is worse
 *    than re-render cost (for small components).
 *
 * ===================================================================
 * 🔹 Real-world Example (React Native – FlatList Optimization)
 * -------------------------------------------------------------------
 */
import { FlatList, Text, Button } from "react-native";

const Row = React.memo(({ item, onPress }) => {
  console.log("🔄 Rendering row:", item.id);
  return <Button title={item.name} onPress={() => onPress(item)} />;
});

function ListScreen() {
  const [data] = React.useState([
    { id: 1, name: "Apple" },
    { id: 2, name: "Banana" },
  ]);

  const handlePress = React.useCallback((item) => {
    console.log("Pressed:", item);
  }, []);

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <Row item={item} onPress={handlePress} />}
      keyExtractor={(item) => item.id.toString()}
    />
  );
}

/**
 * ✅ Optimizations used:
 * - React.memo on Row → Row re-renders only when item prop changes.
 * - useCallback on handlePress → Stable function reference avoids re-renders.
 *
 * ===================================================================
 * 🔹 Q&A (Interview Style)
 * -------------------------------------------------------------------
 * Q1: Difference between React.memo and useMemo?
 *   → React.memo optimizes components, useMemo optimizes values.
 *
 * Q2: When to use useCallback?
 *   → When passing functions to memoized children or dependency arrays.
 *
 * Q3: Does React.memo do a deep comparison of props?
 *   → No, it does shallow comparison. For complex objects, use custom
 *     comparison function.
 *
 * Q4: Can overusing memoization hurt performance?
 *   → Yes, memoization itself has a cost. Use only for heavy components
 *     or expensive computations.
 *
 * ===================================================================
 * ✅ Final Takeaways
 * -------------------------------------------------------------------
 * - React.memo → Prevents unnecessary re-render of components.
 * - useCallback → Prevents unnecessary function recreation.
 * - useMemo → Prevents unnecessary recalculations of values.
 * - Use them wisely; don’t over-optimize prematurely.
 * ===================================================================
 */
