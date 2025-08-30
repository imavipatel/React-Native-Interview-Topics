/**
 * ==============================================================
 * 📘 useCallback vs useMemo in React
 * ==============================================================
 *
 * 🟢 THEORY (Why do we need them?)
 * --------------------------------------------------------------
 * - In React, **every re-render** creates new function references
 *   and re-computes values.
 * - This causes **unnecessary re-renders** or **expensive calculations**.
 * - To optimize:
 *   - `useCallback` → Memoizes functions
 *   - `useMemo` → Memoizes computed values
 *
 * ==============================================================
 * 🔹 useCallback (Memoizing Functions)
 * --------------------------------------------------------------
 * ✅ Purpose:
 * - Returns the **same function reference** between renders unless
 *   dependencies change.
 * - Prevents re-renders of child components that rely on function props.
 *
 * ✅ Example:
 */
import React, { useState, useCallback } from "react";
import { Button, Text, View } from "react-native";

const Child = React.memo(({ onIncrement }) => {
  console.log("Child re-rendered");
  return <Button title="Increment" onPress={onIncrement} />;
});

export default function Counter() {
  const [count, setCount] = useState(0);

  // Without useCallback → new function each render
  // With useCallback → stable function reference
  const increment = useCallback(() => setCount((c) => c + 1), []);

  return (
    <View>
      <Text>Count: {count}</Text>
      <Child onIncrement={increment} />
    </View>
  );
}

/**
 * ==============================================================
 * 🔹 useMemo (Memoizing Values)
 * --------------------------------------------------------------
 * ✅ Purpose:
 * - Avoids **recomputing expensive calculations** unless dependencies change.
 * - Returns a **memoized value**.
 *
 * ✅ Example:
 */
import React, { useState, useMemo } from "react";
import { Text, TextInput, View } from "react-native";

function ExpensiveComponent() {
  const [number, setNumber] = useState(0);
  const [dark, setDark] = useState(false);

  // Expensive calculation simulation
  const double = useMemo(() => {
    console.log("Calculating...");
    let i = 0;
    while (i < 2000000000) i++; // heavy loop
    return number * 2;
  }, [number]); // only recalculates when `number` changes

  const themeStyle = {
    backgroundColor: dark ? "black" : "white",
    color: dark ? "white" : "black",
  };

  return (
    <View>
      <TextInput
        keyboardType="numeric"
        onChangeText={(val) => setNumber(Number(val))}
        placeholder="Enter a number"
      />
      <Text style={themeStyle}>Double: {double}</Text>
      <Text onPress={() => setDark((prev) => !prev)}>Toggle Theme</Text>
    </View>
  );
}

/**
 * ==============================================================
 * 📊 Comparison Table
 * --------------------------------------------------------------
 * | Feature          | useCallback                            | useMemo                          |
 * |------------------|-----------------------------------------|----------------------------------|
 * | What it stores   | Function reference                     | Computed value                   |
 * | Return type      | Memoized function                      | Memoized value                   |
 * | Use case         | Prevents re-renders of memoized child  | Caches expensive calculations    |
 * | Example usage    | onClick handlers, callbacks in props   | Derived state, heavy calculations|
 * | Recomputes when  | Dependencies change                    | Dependencies change              |
 * | Common mistake   | Overuse → unnecessary complexity       | Overuse → stale or wasted memory |
 *
 * ==============================================================
 * ❓ Q&A (Interview Style)
 * --------------------------------------------------------------
 * Q1: Difference between useCallback and useMemo?
 *   → useCallback memoizes a function; useMemo memoizes a value.
 *
 * Q2: Do they improve performance automatically?
 *   → Not always. They add overhead. Use only for expensive renders.
 *
 * Q3: When to use useCallback?
 *   → When passing stable function references to child components.
 *
 * Q4: When to use useMemo?
 *   → When performing expensive calculations or memoizing derived state.
 *
 * Q5: What happens if you forget dependencies?
 *   → The cached function/value may use **stale variables**.
 *
 * ==============================================================
 * 🔹 Real-world React Native Example: Optimizing FlatList
 * --------------------------------------------------------------
 * - Problem:
 *   FlatList re-renders all items if functions/values passed as props
 *   are re-created on every render.
 * - Solution:
 *   Use `useCallback` for item renderers and `useMemo` for data transformations.
 *
 * ✅ Example:
 */
import React, { useState, useCallback, useMemo } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const Item = React.memo(({ item, onSelect }) => {
  console.log("Rendering item:", item.id);
  return (
    <TouchableOpacity onPress={() => onSelect(item.id)}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );
});

export default function OptimizedFlatList() {
  const [selectedId, setSelectedId] = useState(null);

  const data = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i.toString(),
        name: `Item ${i + 1}`,
      })),
    []
  );

  const handleSelect = useCallback((id) => {
    setSelectedId(id);
  }, []);

  return (
    <View>
      <Text>Selected ID: {selectedId}</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => <Item item={item} onSelect={handleSelect} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

/**
 * ==============================================================
 * ✅ Takeaways
 * --------------------------------------------------------------
 * - `useCallback` → For memoizing functions passed to children.
 * - `useMemo` → For memoizing computed values/derived data.
 * - In React Native, extremely useful in:
 *   1. FlatList/SectionList renderers
 *   2. Expensive computations (e.g., filtering, sorting)
 *   3. Avoiding unnecessary re-renders in deep component trees.
 *
 * ==============================================================
 */
