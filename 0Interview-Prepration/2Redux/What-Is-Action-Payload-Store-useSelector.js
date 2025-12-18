/*********************************************************
 * 📘 Redux Basics: Action, Payload, Store, useSelector
 * (Beginner-Friendly JS Notes)
 *********************************************************/

/********************************************
 * 🟢 Action
 ********************************************/
/**
 * 👉 Action = Plain JavaScript object
 * 👉 It describes WHAT happened in the app
 *
 * Rule:
 * - Every action MUST have a "type"
 */

/********************************************
 * 🟢 Action Example
 ********************************************/

const incrementAction = {
  type: "counter/increment",
};

/********************************************
 * 🟢 Action with Payload
 ********************************************/

const addAction = {
  type: "counter/add",
  payload: 5,
};

/********************************************
 * 🟢 Interview Line (Action)
 ********************************************/
/**
 * "An action is a plain object that describes
 * an event that occurred in the application."
 */

/********************************************
 * 🟢 Payload
 ********************************************/
/**
 * 👉 Payload = Data sent along with an action
 *
 * Purpose:
 * - To pass information to reducer
 *
 * Example:
 * - User data
 * - API response
 * - ID, amount, message
 */

/********************************************
 * 🟢 Payload Example
 ********************************************/

const loginAction = {
  type: "auth/login",
  payload: {
    userId: 101,
    name: "Avi",
  },
};

/********************************************
 * 🟢 Store
 ********************************************/
/**
 * 👉 Store = Central place that holds app state
 *
 * Features:
 * - Holds the entire state tree
 * - Allows state access via getState()
 * - Updates state via dispatch()
 */

/********************************************
 * 🟢 Store Example
 ********************************************/

import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";

const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

/********************************************
 * 🟢 Providing Store to App
 ********************************************/

import { Provider } from "react-redux";

function App() {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
}

/********************************************
 * 🟢 Interview Line (Store)
 ********************************************/
/**
 * "The store is the single source of truth
 * that holds the entire application state."
 */

/********************************************
 * 🟢 useSelector
 ********************************************/
/**
 * 👉 useSelector = React-Redux Hook
 *
 * Purpose:
 * - Read data from Redux store
 * - Subscribe component to store updates
 */

/********************************************
 * 🟢 useSelector Example
 ********************************************/

import { useSelector } from "react-redux";

function Counter() {
  const count = useSelector((state) => state.counter.count);

  return <Text>{count}</Text>;
}

/********************************************
 * 🟢 How useSelector Works Internally
 ********************************************/
/**
 * - It subscribes to Redux store
 * - When selected state changes → component re-renders
 * - Uses reference equality (===) check
 */

/********************************************
 * 🟢 useSelector vs mapStateToProps
 ********************************************/
/**
 * useSelector:
 * ✅ Hooks-based
 * ✅ Simple & clean
 *
 * mapStateToProps:
 * ❌ Older approach
 * ❌ More boilerplate
 */

/********************************************
 * 🟢 Full Flow Example
 ********************************************/
/**
 * 1️⃣ User clicks button
 * 2️⃣ dispatch({ type, payload })
 * 3️⃣ Reducer updates state
 * 4️⃣ Store saves new state
 * 5️⃣ useSelector reads updated state
 * 6️⃣ UI re-renders
 */

/********************************************
 * 🟢 Common Interview Confusions
 ********************************************/
/**
 * ❓ Is payload mandatory?
 * 👉 No, only "type" is mandatory
 *
 * ❓ Can useSelector modify state?
 * 👉 No, it only reads state
 */

/********************************************
 * 🟢 One-Line Summary (Interview Ready)
 ********************************************/
/**
 * Action    → What happened
 * Payload   → Data with action
 * Store     → Holds app state
 * useSelector → Reads state from store
 */

/********************************************
 * 🟢 Final Simple Example
 ********************************************/

dispatch({
  type: "cart/addItem",
  payload: { id: 1, name: "Shoes" },
});

const cartItems = useSelector((state) => state.cart.items);
