/**
 * ==============================================================
 * 📘 React Notes – Redux (Store, Reducers, Middleware, useSelector, useDispatch)
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 What is Redux?
 * - Redux is a **state management library** for JavaScript apps.
 * - It gives a **single source of truth** (Store) for the entire app.
 * - Useful for **large applications** where state is shared across many components.
 *
 * 🔹 Core Principles of Redux
 * 1. **Single Source of Truth** → One central store holds all app state.
 * 2. **State is Read-Only** → The only way to change state is by dispatching actions.
 * 3. **Changes are Made with Pure Reducers** → Reducers are pure functions that take state + action → return new state.
 *
 * --------------------------------------------------------------
 * 🔹 Main Building Blocks
 * - **Store** → Central place that holds state.
 * - **Actions** → Plain JS objects that describe WHAT happened (type + payload).
 * - **Reducers** → Pure functions that describe HOW state changes.
 * - **Middleware** → Functions that sit between action dispatching and reducer execution (e.g., logging, async).
 * - **useSelector** → React hook to read data from the Redux store.
 * - **useDispatch** → React hook to send (dispatch) actions to the store.
 *
 * ==============================================================
 * 🔹 Example – Counter App with Redux
 * --------------------------------------------------------------
 */
import React from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { View, Text, Button } from "react-native";

// 1️⃣ Reducer
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: state.count - 1 };
    default:
      return state;
  }
}

// 2️⃣ Middleware Example (Logger)
const logger = (store) => (next) => (action) => {
  console.log("Dispatching:", action);
  let result = next(action);
  console.log("Next State:", store.getState());
  return result;
};

// 3️⃣ Store
const store = createStore(counterReducer, applyMiddleware(thunk, logger));

// 4️⃣ React Component
function Counter() {
  const count = useSelector((state) => state.count); // read from store
  const dispatch = useDispatch(); // send actions

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Count: {count}</Text>
      <Button
        title="Increment"
        onPress={() => dispatch({ type: "INCREMENT" })}
      />
      <Button
        title="Decrement"
        onPress={() => dispatch({ type: "DECREMENT" })}
      />
    </View>
  );
}

// 5️⃣ App with Provider
export default function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}

/**
 * ✅ How it works:
 * - Store holds the state (`{ count: 0 }`).
 * - `useSelector` gets count from store.
 * - `dispatch` sends actions (`INCREMENT`, `DECREMENT`).
 * - Reducer updates the state.
 * - Middleware logs every action and next state.
 *
 * ==============================================================
 * 🔹 Async Example with Thunk
 * --------------------------------------------------------------
 */
function fetchData() {
  return async (dispatch) => {
    dispatch({ type: "LOADING" });
    const data = await fetch(
      "https://jsonplaceholder.typicode.com/todos/1"
    ).then((res) => res.json());
    dispatch({ type: "SET_DATA", payload: data });
  };
}

function dataReducer(state = { loading: false, data: null }, action) {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true };
    case "SET_DATA":
      return { loading: false, data: action.payload };
    default:
      return state;
  }
}

/**
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: What is the role of the Redux store?
 *    → Holds the entire app state in a single object.
 *
 * Q2: What are reducers?
 *    → Pure functions that take `(state, action)` and return a new state.
 *
 * Q3: Why use middleware in Redux?
 *    → To handle side effects (logging, async API calls, analytics).
 *
 * Q4: Difference between useSelector and useDispatch?
 *    → useSelector → Reads data from store.
 *      useDispatch → Sends actions to store.
 *
 * Q5: How does Redux handle async operations?
 *    → Using middleware like `redux-thunk` or `redux-saga`.
 *
 * Q6: Real-world use cases of Redux?
 *    - Large apps with shared state (e.g., cart, authentication).
 *    - Apps requiring offline persistence.
 *    - Apps with complex state updates.
 *
 * Q7: When NOT to use Redux?
 *    → Small apps where Context API or local state is enough.
 *
 * ==============================================================
 */
