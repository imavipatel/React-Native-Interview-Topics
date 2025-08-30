/**
 * ==============================================================
 * 📘 React Notes – Avoiding Anonymous Functions within JSX
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 What are Anonymous Functions in JSX?
 * - An anonymous function = function without a name, created inline.
 * - Example:
 *     <Button onPress={() => console.log("Clicked")} />
 * - Common in React/React Native JSX, especially in event handlers.
 *
 * --------------------------------------------------------------
 * 🔹 Why are Anonymous Functions a Problem?
 * 1) **New function every render**
 *    - Every time a component re-renders, a brand new function is created.
 *    - This makes React think the prop has changed → child re-renders.
 *
 * 2) **Performance issues**
 *    - In small apps → fine.
 *    - In large apps with lists (FlatList, SectionList, FlashList) → causes
 *      MANY unnecessary re-renders.
 *
 * 3) **Breaks memoization**
 *    - Even with React.memo, if you pass an inline function, it changes on
 *      every render, so memoization fails.
 *
 * --------------------------------------------------------------
 * 🔹 Example of Problem (Anonymous Function in JSX)
 */
import React from "react";
import { Text, Button, View } from "react-native";

const Child = React.memo(({ onClick }) => {
  console.log("Child re-rendered");
  return <Button title="Click Me" onPress={onClick} />;
});

export default function App() {
  const [count, setCount] = React.useState(0);

  return (
    <View>
      {/* ❌ Creates a new function on every render */}
      <Child onClick={() => setCount(count + 1)} />
      <Text>Count: {count}</Text>
    </View>
  );
}

/**
 * ⚠️ Even though Child is wrapped with React.memo,
 * it still re-renders because a new function is created
 * on every parent re-render.
 *
 * ==============================================================
 * 🔹 Solutions – How to Avoid Anonymous Functions
 * --------------------------------------------------------------
 *
 * ✅ 1) Define Handler Outside JSX
 */
function AppSolution1() {
  const [count, setCount] = React.useState(0);

  function handleClick() {
    setCount((c) => c + 1);
  }

  return (
    <View>
      <Child onClick={handleClick} />
      <Text>Count: {count}</Text>
    </View>
  );
}

/**
 * ✅ Function is stable, Child won’t re-render unnecessarily.
 *
 * --------------------------------------------------------------
 * ✅ 2) Use useCallback (Memoize functions)
 */
function AppSolution2() {
  const [count, setCount] = React.useState(0);

  const handleClick = React.useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  return (
    <View>
      <Child onClick={handleClick} />
      <Text>Count: {count}</Text>
    </View>
  );
}

/**
 * ✅ useCallback ensures `handleClick` has the same reference
 * across renders → avoids re-render of memoized children.
 *
 * --------------------------------------------------------------
 * ✅ 3) For Lists – Avoid Inline RenderItem
 */
import { FlatList } from "react-native";

function ListExample({ data }) {
  const renderItem = React.useCallback(({ item }) => {
    return <Text>{item.name}</Text>;
  }, []);

  return (
    <FlatList data={data} renderItem={renderItem} keyExtractor={(i) => i.id} />
  );
}

/**
 * ✅ `renderItem` is stable → avoids re-rendering each row.
 *
 * ==============================================================
 * 🔹 Best Practices
 * --------------------------------------------------------------
 * 1) Avoid inline anonymous functions inside JSX.
 * 2) Use **named handlers** defined outside render.
 * 3) Use **useCallback** to memoize functions when passing to children.
 * 4) In lists (FlatList, SectionList, FlashList) → ALWAYS memoize `renderItem`.
 * 5) Don’t over-optimize: In simple UI, anonymous functions are fine.
 *
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: Why should you avoid anonymous functions in JSX?
 *    → Because they create a new function on each render,
 *      causing unnecessary re-renders and breaking memoization.
 *
 * Q2: What is the difference between defining function outside JSX vs useCallback?
 *    → Outside JSX = function still recreated on render (but stable if no closure).
 *      useCallback = keeps reference stable across renders.
 *
 * Q3: When is it okay to use anonymous functions in JSX?
 *    → For very small apps/components where performance impact is negligible.
 *
 * Q4: How do anonymous functions affect React.memo?
 *    → Even if props didn’t change, React.memo sees new function reference
 *      → re-renders the child.
 *
 * Q5: How to optimize renderItem in FlatList?
 *    → Use `useCallback` for renderItem and wrap row components with React.memo.
 *
 * ==============================================================
 */
