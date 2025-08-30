/**
 * ==============================================================
 * 📘 React Notes – Redux Middleware
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 What is Middleware?
 * - Middleware is a **function that sits between `dispatch(action)` and the reducer**.
 * - It can **intercept, modify, delay, or log actions** before they reach reducers.
 *
 * 🔹 Why Middleware?
 * - Redux reducers must be **pure functions** → No side effects allowed.
 * - Middleware handles **side effects** like:
 *    ✅ Async API calls (fetching data)
 *    ✅ Logging actions
 *    ✅ Error handling
 *    ✅ Analytics, authentication, caching
 *
 * --------------------------------------------------------------
 * 🔹 Middleware Flow
 * Action → Dispatch → [Middleware Layer] → Reducer → Store → UI
 *
 * - Example analogy:
 *   Imagine Redux as a **post office**:
 *   - You (component) send a letter (action).
 *   - Middleware is the **sorting center** → It can open, delay, or add notes.
 *   - Finally, the letter reaches the receiver (reducer).
 *
 * ==============================================================
 * 🔹 Common Middlewares
 * --------------------------------------------------------------
 * 1) redux-thunk → For async actions with functions.
 * 2) redux-saga  → For complex async flows using generators.
 * 3) redux-logger → For debugging by logging actions & state.
 *
 * ==============================================================
 * 🔹 Example 1: Custom Middleware
 */
const loggerMiddleware = (store) => (next) => (action) => {
  console.log("Dispatching:", action);
  let result = next(action); // Pass action to reducer
  console.log("Next State:", store.getState());
  return result;
};

/**
 * - Middleware has access to:
 *   * store.getState() → Current state
 *   * next(action) → Pass action to next middleware/reducer
 *   * action → The dispatched action
 *
 * ==============================================================
 * 🔹 Example 2: redux-thunk (Async actions)
 * --------------------------------------------------------------
 */
import { createStore, applyMiddleware } from "redux";
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

// Async Action Creator
function fetchData() {
  return async (dispatch) => {
    dispatch({ type: "FETCH_START" });
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    dispatch({ type: "FETCH_SUCCESS", payload: data });
  };
}

// Store
const store = createStore(dataReducer, applyMiddleware(thunk));
store.dispatch(fetchData());

/**
 * ✅ Thunk allows us to return functions from action creators instead of plain objects.
 * ✅ Great for simple async logic (API calls, timers, conditional dispatch).
 *
 * ==============================================================
 * 🔹 Example 3: redux-saga (Complex async workflows)
 * --------------------------------------------------------------
 */
import createSagaMiddleware from "redux-saga";
import { call, put, takeEvery } from "redux-saga/effects";

// Reducer
function postsReducer(state = { posts: [], loading: false }, action) {
  switch (action.type) {
    case "FETCH_POSTS_START":
      return { ...state, loading: true };
    case "FETCH_POSTS_SUCCESS":
      return { posts: action.payload, loading: false };
    default:
      return state;
  }
}

// Worker Saga
function* fetchPosts() {
  try {
    const response = yield call(() =>
      fetch("https://jsonplaceholder.typicode.com/posts").then((res) =>
        res.json()
      )
    );
    yield put({ type: "FETCH_POSTS_SUCCESS", payload: response });
  } catch (e) {
    console.error("Error fetching posts", e);
  }
}

// Watcher Saga
function* rootSaga() {
  yield takeEvery("FETCH_POSTS_START", fetchPosts);
}

// Setup Store with Saga
const sagaMiddleware = createSagaMiddleware();
const store2 = createStore(postsReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);

// Dispatch action
store2.dispatch({ type: "FETCH_POSTS_START" });

/**
 * ✅ redux-saga is powerful for handling:
 *    - Long-running processes
 *    - Race conditions (e.g., cancel API request if new one starts)
 *    - Retry logic and complex async flows
 * ✅ Uses ES6 generator functions (`function*`) to manage side effects.
 *
 * ==============================================================
 * 🔹 Example 4: redux-logger (Debugging)
 * --------------------------------------------------------------
 */
import { createLogger } from "redux-logger";

const logger = createLogger({
  collapsed: true, // Collapse logs for readability
  diff: true, // Show state difference
});

const store3 = createStore(dataReducer, applyMiddleware(logger));
store3.dispatch({ type: "FETCH_START" });

/**
 * ✅ redux-logger automatically logs:
 * - Previous state
 * - Action dispatched
 * - Next state
 * Great for debugging during development.
 *
 * ==============================================================
 * 🔹 When to use which Middleware?
 * --------------------------------------------------------------
 * - redux-thunk → Simple async tasks (API fetch, timers).
 * - redux-saga → Complex async flows, cancellations, retries.
 * - redux-logger → Debugging during development.
 * - Custom middleware → Analytics, caching, auth tokens, etc.
 *
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: What is Middleware in Redux?
 *    → A function that intercepts actions before they reach reducers,
 *      used to handle async logic, logging, or side effects.
 *
 * Q2: Why do we need Middleware in Redux?
 *    → Because reducers must be pure (no side effects).
 *      Middleware handles side effects (API calls, logs, errors).
 *
 * Q3: Difference between redux-thunk and redux-saga?
 *    → Thunk: Simple, function-based, best for small async tasks.
 *      Saga: More powerful, generator-based, handles complex async flows.
 *
 * Q4: Can we write custom middleware?
 *    → Yes. Example: Auth middleware to attach tokens to API requests.
 *
 * Q5: Real-world use case?
 *    → redux-thunk for API calls, redux-saga for canceling pending requests,
 *      redux-logger for debugging state changes.
 *
 * ==============================================================
 */
