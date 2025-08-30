/**
 * ==============================================================
 * 📘 React Notes – Context API vs Redux (with Middleware)
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 Why do we need state management?
 * - In React apps, state often needs to be shared between components.
 * - Passing props down many levels (prop drilling) becomes painful.
 * - Context API and Redux are two ways to solve this problem.
 *
 * 🔹 Context API (Built-in React feature)
 * - Provides a way to share data globally without prop drilling.
 * - Great for **small/medium apps** and simple use-cases.
 * - Works well for themes, user authentication, language settings, etc.
 * - Uses `React.createContext()`, `Provider`, and `useContext()`.
 * - Limitations:
 *    * No middleware system (logging, async handling).
 *    * Re-renders can be inefficient for very large apps.
 *
 * 🔹 Redux (External Library)
 * - Predictable state container with strict rules.
 * - Provides centralized store + middleware support.
 * - Great for **large/complex apps** with frequent updates.
 * - Includes tools for debugging (Redux DevTools).
 * - Limitations:
 *    * Requires boilerplate (actions, reducers, store).
 *    * Learning curve is higher than Context.
 *
 * ==============================================================
 * 🔹 Redux Middleware – What & Why?
 * --------------------------------------------------------------
 * Middleware = A **function between dispatching an action and the reducer**.
 *
 * - Think of it as a pipeline:
 *   `Action → Middleware → Reducer → Store`
 *
 * - Middleware lets you:
 *    ✅ Intercept actions before they reach reducers
 *    ✅ Add async logic (API calls, timers, etc.)
 *    ✅ Add logging, analytics, or debugging
 *    ✅ Handle side effects outside reducers
 *
 * --------------------------------------------------------------
 * 🔹 Common Middlewares:
 * - redux-thunk → Allows async functions inside actions
 * - redux-saga → Handles complex async workflows (like generators)
 * - redux-logger → Logs actions + state changes (for debugging)
 *
 * --------------------------------------------------------------
 * 🔹 Example – Without Middleware
 */
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    default:
      return state;
  }
}

// Dispatching an async action (❌ Not possible directly)
store.dispatch(fetchData()); // This won't work without middleware

/**
 * --------------------------------------------------------------
 * 🔹 Example – With redux-thunk Middleware
 * --------------------------------------------------------------
 */
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";

// Reducer
function dataReducer(state = { data: [], loading: false }, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { data: action.payload, loading: false };
    default:
      return state;
  }
}

// Async Action Creator (Thunk)
function fetchData() {
  return async (dispatch) => {
    dispatch({ type: "FETCH_START" });
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    dispatch({ type: "FETCH_SUCCESS", payload: data });
  };
}

// Store with middleware
const store = createStore(dataReducer, applyMiddleware(thunk));

// Dispatch async action
store.dispatch(fetchData());

/**
 * ✅ What happened:
 * - Normally, Redux only accepts plain object actions (e.g., `{type: "ADD"}`).
 * - Thunk allows dispatching functions that can:
 *    * Delay dispatching actions
 *    * Make async API calls
 *    * Dispatch multiple actions (start, success, failure)
 *
 * ==============================================================
 * 🔹 Context API vs Redux – Comparison
 * --------------------------------------------------------------
 * Feature                | Context API                     | Redux
 * ----------------------- | ------------------------------- | --------------------------
 * State Location          | Inside Context Provider         | Centralized Store
 * Boilerplate             | Low (easy to set up)            | High (actions, reducers, store)
 * Async Support           | Manual (useEffect/fetch)        | Middleware (redux-thunk, saga)
 * Debugging Tools         | None                            | Excellent (Redux DevTools)
 * Performance             | Fine for small apps             | Optimized for large apps
 * Learning Curve          | Easy                            | Moderate/High
 * Middleware Support      | ❌ No                           | ✅ Yes (thunk, saga, logger)
 * Best For                | Small/medium apps, themes, auth | Large/complex apps, shared state
 *
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: What is Middleware in Redux?
 *    → Middleware is a function that sits between `dispatch` and `reducer`.
 *      It intercepts actions, allowing async logic, logging, or side effects.
 *
 * Q2: Why do we need Middleware in Redux?
 *    → Because Redux reducers must stay pure (no side effects).
 *      Middleware helps handle async tasks (API calls, delays) outside reducers.
 *
 * Q3: Can Context API have Middleware?
 *    → No. Context API is simple and doesn’t have a middleware system.
 *      You must handle async logic manually (e.g., inside `useEffect`).
 *
 * Q4: Which middleware is most common in Redux?
 *    → `redux-thunk` (for async functions) and `redux-logger` (for debugging).
 *
 * Q5: Real-world analogy for Middleware?
 *    → Think of Redux like a **post office**:
 *       - You (component) send a letter (action).
 *       - Middleware is like the **sorting center**:
 *           * It can check, delay, or modify the letter.
 *       - Then, the letter finally reaches the receiver (reducer).
 *
 * ==============================================================
 */
