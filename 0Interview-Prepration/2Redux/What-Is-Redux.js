/*********************************************************
 * 📘 What is Redux? (Beginner Friendly Notes)
 *********************************************************/

/********************************************
 * 🟢 Simple Definition
 ********************************************/
/**
 * Redux is a **state management library**.
 *
 * 👉 It helps you **store and manage application data**
 * 👉 So that **any component can access it easily**
 *
 * Mostly used with:
 * - React
 * - React Native
 */

/********************************************
 * 🟢 What is "State"?
 ********************************************/
/**
 * State = Data of your app
 *
 * Examples:
 * - User login info
 * - Cart items
 * - Theme (dark / light)
 * - API response data
 *
 * Without Redux:
 * ❌ Data is passed from parent → child → grandchild (props drilling)
 *
 * With Redux:
 * ✅ Data is stored in ONE CENTRAL PLACE
 */

/********************************************
 * 🟢 Why Redux is Needed?
 ********************************************/
/**
 * Problems without Redux:
 * - Props drilling (passing data again & again)
 * - Hard to manage large apps
 * - Difficult debugging
 *
 * Redux solves:
 * ✅ Centralized state
 * ✅ Predictable updates
 * ✅ Easy debugging (Redux DevTools)
 */

/********************************************
 * 🟢 Core Redux Concepts (VERY IMPORTANT)
 ********************************************/

/**
 * 1️⃣ Store
 * - Single source of truth
 * - Holds the entire app state
 */

/**
 * 2️⃣ Action
 * - Plain JavaScript object
 * - Describes WHAT happened
 *
 * Example:
 * { type: "INCREMENT" }
 */

/**
 * 3️⃣ Reducer
 * - A pure function
 * - Decides HOW state changes
 * - Takes old state + action → returns new state
 */

/**
 * 4️⃣ Dispatch
 * - Sends an action to the reducer
 */

/********************************************
 * 🟢 Redux Flow (How it Works)
 ********************************************/
/**
 * UI → dispatch(action)
 * action → reducer
 * reducer → updates store
 * store → updates UI
 *
 * 🔁 One-way data flow (very important)
 */

/********************************************
 * 🟢 Simple Redux Example
 ********************************************/

// Initial State
const initialState = {
  count: 0,
};

// Reducer
function counterReducer(state = initialState, action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };

    case "DECREMENT":
      return { count: state.count - 1 };

    default:
      return state;
  }
}

/********************************************
 * 🟢 Action Example
 ********************************************/

const incrementAction = {
  type: "INCREMENT",
};

/********************************************
 * 🟢 Store Example
 ********************************************/

import { createStore } from "redux";

const store = createStore(counterReducer);

/********************************************
 * 🟢 Dispatch Example
 ********************************************/

store.dispatch({ type: "INCREMENT" });
store.dispatch({ type: "DECREMENT" });

/********************************************
 * 🟢 Redux in React / React Native
 ********************************************/
/**
 * Libraries used:
 * - react-redux
 *
 * Hooks:
 * - useSelector → read data from store
 * - useDispatch → send actions
 */

/********************************************
 * 🟢 React Native Example
 ********************************************/

import { useSelector, useDispatch } from "react-redux";

function CounterScreen() {
  const count = useSelector((state) => state.count);
  const dispatch = useDispatch();

  return (
    <>
      <Text>{count}</Text>
      <Button title="+" onPress={() => dispatch({ type: "INCREMENT" })} />
      <Button title="-" onPress={() => dispatch({ type: "DECREMENT" })} />
    </>
  );
}

/********************************************
 * 🟢 Redux Toolkit (Modern Redux)
 ********************************************/
/**
 * Redux Toolkit (RTK) is the **recommended way**
 *
 * Why RTK?
 * ✅ Less boilerplate
 * ✅ Easier to write
 * ✅ Built-in best practices
 *
 * Tools:
 * - createSlice
 * - configureStore
 */

/********************************************
 * 🟢 Redux Toolkit Example
 ********************************************/

import { createSlice, configureStore } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: { count: 0 },
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
  },
});

export const { increment, decrement } = counterSlice.actions;

const stores = configureStore({
  reducer: counterSlice.reducer,
});

/********************************************
 * 🟢 When to Use Redux?
 ********************************************/
/**
 * ✅ Large applications
 * ✅ Shared state across many screens
 * ✅ Complex state logic
 *
 * ❌ Small apps (use useState / Context)
 */

/********************************************
 * 🟢 Interview One-Liner
 ********************************************/
/**
 * "Redux is a predictable state management library
 * that stores application state in a single global store
 * and updates it using actions and reducers."
 */

/********************************************
 * 🟢 Summary (Easy Words)
 ********************************************/
/**
 * - Redux stores app data in one place
 * - Components read data from store
 * - Actions describe changes
 * - Reducers update the data
 * - Redux Toolkit makes Redux simple
 */
