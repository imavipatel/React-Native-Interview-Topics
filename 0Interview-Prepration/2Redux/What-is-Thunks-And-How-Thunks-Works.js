/*********************************************************
 * 📘 What is Thunk & How Thunk Works (Beginner Friendly)
 *********************************************************/

/********************************************
 * 🟢 Simple Definition
 ********************************************/
/**
 * Thunk = A function that returns another function
 *
 * In Redux:
 * 👉 Thunk allows us to write **ASYNC logic**
 * 👉 Like API calls, timers, delayed actions
 */

/********************************************
 * 🟢 Why Do We Need Thunk?
 ********************************************/
/**
 * Redux rule:
 * ❌ Reducers must be synchronous & pure
 *
 * Problem:
 * - API calls are async
 * - setTimeout is async
 *
 * Solution:
 * ✅ Thunk handles async logic OUTSIDE reducers
 */

/********************************************
 * 🟢 What is redux-thunk?
 ********************************************/
/**
 * redux-thunk is a **middleware**
 *
 * Middleware:
 * - Runs between dispatch → reducer
 * - Can intercept actions
 *
 * Normally:
 * dispatch({ type: "ACTION" })
 *
 * With Thunk:
 * dispatch(function)
 */

/********************************************
 * 🟢 How Thunk Works (Step by Step)
 ********************************************/
/**
 * 1️⃣ Component dispatches a function (thunk)
 * 2️⃣ redux-thunk middleware catches it
 * 3️⃣ Middleware executes the function
 * 4️⃣ Thunk gets access to:
 *    - dispatch
 *    - getState
 * 5️⃣ Thunk performs async work
 * 6️⃣ Thunk dispatches real actions
 */

/********************************************
 * 🟢 Normal Redux Flow (No Thunk)
 ********************************************/
/**
 * UI → dispatch(action object) → reducer → store
 */

/********************************************
 * 🟢 Redux Flow With Thunk
 ********************************************/
/**
 * UI → dispatch(thunk function)
 * thunk → async work
 * thunk → dispatch(action)
 * reducer → store → UI
 */

/********************************************
 * 🟢 Simple Thunk Example
 ********************************************/

const fetchUsers = () => {
  return async (dispatch, getState) => {
    dispatch({ type: "FETCH_USERS_START" });

    try {
      const response = await fetch("https://api.example.com/users");
      const data = await response.json();

      dispatch({
        type: "FETCH_USERS_SUCCESS",
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: "FETCH_USERS_ERROR",
        payload: error.message,
      });
    }
  };
};

/********************************************
 * 🟢 Dispatching Thunk from Component
 ********************************************/

dispatch(fetchUsers());

/********************************************
 * 🟢 Reducer Example
 ********************************************/

const initialState = {
  loading: false,
  users: [],
  error: null,
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case "FETCH_USERS_START":
      return { ...state, loading: true };

    case "FETCH_USERS_SUCCESS":
      return { loading: false, users: action.payload, error: null };

    case "FETCH_USERS_ERROR":
      return { loading: false, users: [], error: action.payload };

    default:
      return state;
  }
}

/********************************************
 * 🟢 Redux Toolkit + Thunk (Modern Way)
 ********************************************/
/**
 * Redux Toolkit includes thunk by default 🎉
 *
 * No need to install redux-thunk manually
 */

/********************************************
 * 🟢 createAsyncThunk Example
 ********************************************/

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchUserss = createAsyncThunk(
  "users/fetchUsers",
  async (_, thunkAPI) => {
    const response = await fetch("https://api.example.com/users");
    return response.json();
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    loading: false,
    users: [],
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

/********************************************
 * 🟢 Thunk vs Normal Function
 ********************************************/
/**
 * Normal function:
 * function add() { return 5 }
 *
 * Thunk:
 * function add() {
 *   return function(dispatch) {
 *     dispatch({ type: "ADD" })
 *   }
 * }
 */

/********************************************
 * 🟢 Why Interviewers Like Thunk?
 ********************************************/
/**
 * - Easy async handling
 * - Simple to understand
 * - Built-in in Redux Toolkit
 * - Great for API calls
 */

/********************************************
 * 🟢 When NOT to Use Thunk?
 ********************************************/
/**
 * ❌ Very complex async flows
 * ❌ Heavy real-time logic
 *
 * Alternatives:
 * - Redux Saga
 * - Redux Observable
 */

/********************************************
 * 🟢 Interview One-Liner
 ********************************************/
/**
 * "Thunk is a Redux middleware that allows dispatching
 * functions instead of objects to handle asynchronous
 * logic like API calls."
 */

/********************************************
 * 🟢 Final Summary
 ********************************************/
/**
 * - Thunk enables async logic in Redux
 * - It runs between dispatch and reducer
 * - It receives dispatch & getState
 * - Redux Toolkit has thunk built-in
 */
