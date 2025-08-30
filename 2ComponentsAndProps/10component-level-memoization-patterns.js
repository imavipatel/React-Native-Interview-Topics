/**
 * ==============================================================
 * 📘 React Notes – Component-level Memoization Patterns
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 What is Memoization?
 * - Memoization = Storing the result of a computation so it doesn’t need
 *   to be recalculated if inputs (props/state) haven’t changed.
 * - In React, memoization helps to **prevent unnecessary re-renders**.
 * - Goal → Improve performance when components re-render too often.
 *
 * --------------------------------------------------------------
 * 🔹 Why do we need component-level memoization?
 * - React re-renders a component whenever:
 *    1) Its state changes
 *    2) Its parent re-renders (props may or may not change)
 * - Problem: Child components may re-render **even if props are same**.
 * - Solution: Use memoization to skip re-renders if inputs didn’t change.
 *
 * ==============================================================
 * 🔹 Pattern 1: React.memo (for functional components)
 * --------------------------------------------------------------
 * - Wraps a functional component → Prevents re-render if props are same.
 * - Shallow comparison of props by default.
 *
 */
import React from "react";
import { Text, View } from "react-native";

const Child = React.memo(({ value }) => {
  console.log("Child re-rendered");
  return <Text>{value}</Text>;
});

export default function App() {
  const [count, setCount] = React.useState(0);

  return (
    <View>
      <Child value="Hello" />
      <Text onPress={() => setCount(count + 1)}>Click: {count}</Text>
    </View>
  );
}

/**
 * ✅ Child does not re-render when parent state changes,
 *    because `value="Hello"` is constant.
 *
 * ==============================================================
 * 🔹 Pattern 2: Custom comparison function in React.memo
 * --------------------------------------------------------------
 * - Useful when props are complex objects/arrays.
 */
const ChildDeep = React.memo(
  ({ user }) => {
    console.log("ChildDeep re-rendered");
    return <Text>{user.name}</Text>;
  },
  (prevProps, nextProps) => prevProps.user.id === nextProps.user.id
);

/**
 * ✅ Custom comparator avoids unnecessary re-render even if parent passes
 *    a new `user` object with the same `id`.
 *
 * ==============================================================
 * 🔹 Pattern 3: useCallback (memoizing functions)
 * --------------------------------------------------------------
 * - Functions are re-created on every render → causes children to re-render.
 * - `useCallback` memoizes a function so reference stays same.
 */
function Parent() {
  const [count, setCount] = React.useState(0);

  const increment = React.useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  return <Button onPress={increment} title={`Count: ${count}`} />;
}

/**
 * ✅ Prevents `Button` from re-rendering unnecessarily because
 *    the `increment` function reference is stable.
 *
 * ==============================================================
 * 🔹 Pattern 4: useMemo (memoizing computed values)
 * --------------------------------------------------------------
 * - For expensive calculations that don’t need to run every render.
 */
function ExpensiveComponent({ num }) {
  const factorial = React.useMemo(() => {
    console.log("Calculating factorial...");
    function fact(n) {
      return n <= 1 ? 1 : n * fact(n - 1);
    }
    return fact(num);
  }, [num]);

  return <Text>Factorial: {factorial}</Text>;
}

/**
 * ✅ Factorial only recalculates when `num` changes.
 *
 * ==============================================================
 * 🔹 Pattern 5: PureComponent (for class components)
 * --------------------------------------------------------------
 * - Works like `React.memo`, but for class components.
 * - Does shallow comparison of props + state.
 */
import React, { PureComponent } from "react";

class ChildClass extends PureComponent {
  render() {
    console.log("Class Child re-rendered");
    return <Text>{this.props.value}</Text>;
  }
}

/**
 * ✅ ChildClass won’t re-render unless `props.value` changes.
 *
 * ==============================================================
 * 🔹 Pattern 6: Memoizing Lists (with keyExtractor + React.memo)
 * --------------------------------------------------------------
 * - For FlatList/FlashList row items, wrap row component in `React.memo`.
 */
import { FlatList } from "react-native";

const Row = React.memo(({ item }) => {
  console.log("Row rendered:", item.id);
  return <Text>{item.name}</Text>;
});

function ListExample({ data }) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <Row item={item} />}
    />
  );
}

/**
 * ✅ Each row only re-renders when its own data changes.
 *
 * ==============================================================
 * 🔹 Common Mistakes
 * --------------------------------------------------------------
 * ❌ Overusing memoization → adds complexity without real gain.
 * ❌ Forgetting custom comparator for deep objects.
 * ❌ Wrapping everything in `useCallback`/`useMemo` → unnecessary overhead.
 *
 * ==============================================================
 * 🔹 Best Practices
 * --------------------------------------------------------------
 * 1) Use `React.memo` for **pure functional components** with stable props.
 * 2) Use `useCallback` when passing functions as props to memoized children.
 * 3) Use `useMemo` for expensive calculations.
 * 4) For class components → prefer `PureComponent`.
 * 5) In lists → wrap row items in `React.memo` + use stable `keyExtractor`.
 * 6) Don’t blindly memoize → measure performance before optimizing.
 *
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: Difference between React.memo and useMemo?
 *    → `React.memo` → prevents component re-render
 *      `useMemo` → memoizes computed value
 *
 * Q2: When would you use useCallback?
 *    → When passing a function to a child component to avoid new reference
 *      on each render.
 *
 * Q3: Why is shallow comparison important in React.memo?
 *    → It checks primitive values but not deep objects. If new object reference
 *      is passed, React.memo will re-render unless custom comparator is used.
 *
 * Q4: Is memoization always good?
 *    → No. Memoization itself has cost (extra memory, comparison). Use it
 *      when components are expensive to render or re-render too often.
 *
 * Q5: How to prevent FlatList row re-renders?
 *    → Wrap row in React.memo + use stable keys + avoid inline props.
 *
 * ==============================================================
 */
