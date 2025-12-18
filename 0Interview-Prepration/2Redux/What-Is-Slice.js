/*********************************************************
 * 📘 What is a Slice? (Redux Toolkit – Beginner Friendly)
 *********************************************************/

/********************************************
 * 🟢 Simple Definition
 ********************************************/
/**
 * Slice = A small piece of Redux state + logic
 *
 * A slice contains:
 * ✅ State
 * ✅ Reducers (logic to update state)
 * ✅ Actions (auto-generated)
 *
 * 👉 Introduced by Redux Toolkit
 */

/********************************************
 * 🟢 Why is it called "Slice"?
 ********************************************/
/**
 * Imagine the Redux store as a BIG object 🍕
 *
 * Each feature takes a "slice" of that object:
 * - authSlice
 * - userSlice
 * - cartSlice
 */

/********************************************
 * 🟢 What Problems Slice Solves?
 ********************************************/
/**
 * Old Redux:
 * ❌ Separate files for actions, reducers, constants
 *
 * Slice:
 * ✅ Everything in ONE place
 * ✅ Less boilerplate
 * ✅ Easier to read & maintain
 */

/********************************************
 * 🟢 Slice Structure
 ********************************************/
/**
 * createSlice({
 *   name        → slice name
 *   initialState→ default state
 *   reducers    → functions to update state
 * })
 */

/********************************************
 * 🟢 Simple Slice Example
 ********************************************/

import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: {
    count: 0,
  },
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
    reset: (state) => {
      state.count = 0;
    },
  },
});

/********************************************
 * 🟢 What createSlice Automatically Gives You
 ********************************************/
/**
 * ✅ Action creators
 * ✅ Action types
 * ✅ Reducer function
 */

/********************************************
 * 🟢 Exporting from Slice
 ********************************************/

export const { increment, decrement, reset } = counterSlice.actions;
export default counterSlice.reducer;

/********************************************
 * 🟢 Using Slice in Store
 ********************************************/

import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";

const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

/********************************************
 * 🟢 Using Slice in Component
 ********************************************/

import { useDispatch, useSelector } from "react-redux";
import { increment, decrement } from "./counterSlice";

function Counter() {
  const count = useSelector((state) => state.counter.count);
  const dispatch = useDispatch();

  return (
    <>
      <Text>{count}</Text>
      <Button title="+" onPress={() => dispatch(increment())} />
      <Button title="-" onPress={() => dispatch(decrement())} />
    </>
  );
}

/********************************************
 * 🟢 Slice + Async Logic (Thunk)
 ********************************************/
/**
 * Async actions are handled using:
 * - createAsyncThunk
 * - extraReducers inside slice
 */

/********************************************
 * 🟢 Async Slice Example
 ********************************************/

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUsers = createAsyncThunk("users/fetch", async () => {
  const res = await fetch("https://api.example.com/users");
  return res.json();
});

const userSlice = createSlice({
  name: "users",
  initialState: {
    loading: false,
    users: [],
    error: null,
  },
  reducers: {},
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
 * 🟢 Slice vs Reducer (Important Interview)
 ********************************************/
/**
 * Reducer:
 * - Only state update logic
 *
 * Slice:
 * - State + reducers + actions (all together)
 */

/********************************************
 * 🟢 When to Create a Slice?
 ********************************************/
/**
 * Create one slice per feature:
 * - authSlice
 * - profileSlice
 * - cartSlice
 * - settingsSlice
 */

/********************************************
 * 🟢 Interview One-Liner
 ********************************************/
/**
 * "A slice is a feature-based collection of Redux state,
 * reducers, and auto-generated actions created using
 * Redux Toolkit."
 */

/********************************************
 * 🟢 Final Summary
 ********************************************/
/**
 * - Slice = feature-specific Redux logic
 * - Reduces boilerplate
 * - Improves readability
 * - Recommended approach in Redux Toolkit
 */
