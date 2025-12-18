/*********************************************************
 * 📘 Redux Middleware & Thunk (Deep but Beginner Friendly)
 *********************************************************/

/********************************************
 * 🟢 What is Middleware? (Simple First)
 ********************************************/
/**
 * Middleware = Code that runs BETWEEN:
 *
 * dispatch(action)  →  reducer
 *
 * 👉 It can:
 * - Intercept actions
 * - Modify actions
 * - Stop actions
 * - Run extra logic
 */

/********************************************
 * 🟢 Redux Flow Without Middleware
 ********************************************/
/**
 * UI → dispatch(action) → reducer → store → UI
 */

/********************************************
 * 🟢 Redux Flow With Middleware
 ********************************************/
/**
 * UI → dispatch(action)
 *        ↓
 *     middleware
 *        ↓
 *     reducer
 *        ↓
 *     store → UI
 */

/********************************************
 * 🟢 Why Middleware is Needed
 ********************************************/
/**
 * Reducers MUST be:
 * - Pure
 * - Synchronous
 *
 * ❌ No API calls
 * ❌ No timers
 * ❌ No side effects
 *
 * Middleware allows:
 * ✅ Async code
 * ✅ Logging
 * ✅ Analytics
 * ✅ Error handling
 */

/*********************************************************
 * 🟢 What is Thunk Middleware?
 *********************************************************/

/**
 * Thunk is a Redux middleware that lets you
 * dispatch FUNCTIONS instead of OBJECTS.
 */

/********************************************
 * 🟢 Without Thunk (Normal Redux)
 ********************************************/

dispatch({
  type: "INCREMENT",
});

/********************************************
 * 🟢 With Thunk
 ********************************************/

dispatch((dispatch, getState) => {
  // async / logic code here
});

/********************************************
 * 🟢 Why Thunk is Needed
 ********************************************/
/**
 * Problem:
 * - Redux accepts only plain objects
 *
 * Solution:
 * - Thunk intercepts functions
 * - Executes them
 */

/*********************************************************
 * 🧠 How Thunk Middleware Works (Internals)
 *********************************************************/

/********************************************
 * 🟢 Thunk Pseudo Code (Important)
 ********************************************/

const thunkMiddleware =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    if (typeof action === "function") {
      return action(dispatch, getState);
    }

    return next(action);
  };

/**
 * Meaning:
 * - If action is a function → execute it
 * - Else → pass it to reducer
 */

/********************************************
 * 🟢 Step-by-Step Execution
 ********************************************/
/**
 * 1️⃣ UI calls dispatch(fetchUsers())
 * 2️⃣ fetchUsers() returns a function
 * 3️⃣ Thunk middleware intercepts it
 * 4️⃣ Thunk executes the function
 * 5️⃣ Thunk provides:
 *    - dispatch
 *    - getState
 * 6️⃣ Thunk performs async work
 * 7️⃣ Thunk dispatches REAL actions
 */

/*********************************************************
 * 🟢 Real Example – API Call
 *********************************************************/

const fetchUsers = () => {
  return async (dispatch, getState) => {
    dispatch({ type: "users/loading" });

    try {
      const response = await fetch("/users");
      const data = await response.json();

      dispatch({
        type: "users/success",
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: "users/error",
        payload: error.message,
      });
    }
  };
};

/********************************************
 * 🟢 What Reducer Sees
 ********************************************/
/**
 * Reducer NEVER sees the thunk function
 *
 * Reducer sees only:
 * - users/loading
 * - users/success
 * - users/error
 */

/*********************************************************
 * 🟢 Thunk in Redux Toolkit
 *********************************************************/

/**
 * Redux Toolkit:
 * ✅ Thunk is INCLUDED by default
 * ❌ No manual setup needed
 */

/********************************************
 * 🟢 createAsyncThunk (Recommended)
 ********************************************/

import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUserss = createAsyncThunk(
  "users/fetch",
  async (_, thunkAPI) => {
    const res = await fetch("/users");
    return res.json();
  }
);

/**
 * Automatically dispatches:
 * - pending
 * - fulfilled
 * - rejected
 */

/*********************************************************
 * 🟢 Thunk vs Normal Function
 *********************************************************/

/**
 * Normal function:
 * function getData() { return data }
 *
 * Thunk:
 * function getData() {
 *   return function(dispatch, getState) {
 *     dispatch({ type: "START" })
 *   }
 * }
 */

/*********************************************************
 * 🟢 Why Thunk is Popular (Interview)
 *********************************************************/

/**
 * ✅ Simple mental model
 * ✅ Easy async handling
 * ✅ Built-in in RTK
 * ✅ Good for API calls
 */

/*********************************************************
 * 🟢 Limitations of Thunk
 *********************************************************/

/**
 * ❌ Hard to manage very complex flows
 * ❌ No built-in cancellation
 * ❌ Callback-like logic if overused
 *
 * Alternatives:
 * - Redux Saga
 * - Redux Observable
 */

/*********************************************************
 * 🟢 Interview One-Liner
 *********************************************************/

/**
 * "Thunk is a Redux middleware that allows
 * dispatching functions instead of objects
 * to handle asynchronous logic like API calls."
 */

/*********************************************************
 * 🟢 Final Summary
 *********************************************************/

/**
 * Middleware runs between dispatch & reducer
 * Thunk allows async logic in Redux
 * Thunk intercepts functions
 * Reducers remain pure
 */
