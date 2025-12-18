/*********************************************************
 * 📘 Redux Flow – Deep Walkthrough (Beginner Friendly)
 * From UI → Store → UI (Step by Step)
 *********************************************************/

/********************************************
 * 🟢 First, Big Picture
 ********************************************/
/**
 * Redux follows a ONE-WAY data flow.
 *
 * UI
 *  ↓ dispatch(action)
 * Action
 *  ↓
 * Reducer
 *  ↓
 * Store (state updated)
 *  ↓
 * UI re-renders via useSelector
 *
 * 👉 Data NEVER flows backward
 */

/********************************************
 * 🟢 Redux Core Pieces (Quick Recap)
 ********************************************/
/**
 * Store     → Holds app state
 * Action    → What happened
 * Payload   → Data with action
 * Reducer   → How state changes
 * Dispatch  → Sends action
 * Selector  → Reads state
 */

/********************************************
 * 🟢 Example Scenario (Real Life)
 ********************************************/
/**
 * User clicks "Login" button
 * → API call happens
 * → User data stored
 * → UI updates
 *
 * We will trace EACH STEP deeply
 */

/********************************************
 * 🟢 Step 0: Redux Store Setup
 ********************************************/

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

/**
 * Store:
 * - Created ONCE
 * - Holds entire app state
 */

/********************************************
 * 🟢 Step 1: UI Dispatches an Action
 ********************************************/

import { useDispatch } from "react-redux";
import { login } from "./authSlice";

function LoginButton() {
  const dispatch = useDispatch();

  const onLogin = () => {
    dispatch(login({ id: 1, name: "Avi" }));
  };

  return <Button title="Login" onPress={onLogin} />;
}

/**
 * What happens here?
 * - UI does NOT change state directly
 * - UI only DISPATCHES an action
 */

/********************************************
 * 🟢 Step 2: Action is Created
 ********************************************/
/**
 * login({ id: 1, name: "Avi" }) creates:
 */
// {
//   type: "auth/login",
//   payload: { id: 1, name: "Avi" };
// }

/**
 * Action tells Redux:
 * 👉 WHAT happened
 */

/********************************************
 * 🟢 Step 3: Dispatch Sends Action to Store
 ********************************************/
/**
 * dispatch(action):
 * - Sends action to Redux store
 * - Store forwards action to reducer
 */

/********************************************
 * 🟢 Step 4: Reducer Receives Action
 ********************************************/

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoggedIn: false,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

/**
 * Reducer rules:
 * ✅ Pure function
 * ❌ No API calls
 * ❌ No side effects
 */

/********************************************
 * 🟢 Step 5: Reducer Calculates New State
 ********************************************/
/**
 * Old state:
 * {
 *   user: null,
 *   isLoggedIn: false
 * }
 *
 * Action:
 * {
 *   type: "auth/login",
 *   payload: { id: 1, name: "Avi" }
 * }
 *
 * New state:
 * {
 *   user: { id: 1, name: "Avi" },
 *   isLoggedIn: true
 * }
 */

/**
 * Redux Toolkit uses Immer:
 * - You write "mutating" code
 * - Internally it creates IMMUTABLE state
 */

/********************************************
 * 🟢 Step 6: Store Saves New State
 ********************************************/
/**
 * Store:
 * - Replaces old state with new state
 * - Keeps history (DevTools)
 */

/********************************************
 * 🟢 Step 7: useSelector Subscribes to Store
 ********************************************/

import { useSelector } from "react-redux";

function Profile() {
  const user = useSelector((state) => state.auth.user);
  const loggedIn = useSelector((state) => state.auth.isLoggedIn);

  return loggedIn ? <Text>{user.name}</Text> : <Text>Guest</Text>;
}

/**
 * useSelector:
 * - Subscribes to store
 * - Watches selected data only
 */

/********************************************
 * 🟢 Step 8: React Re-renders UI
 ********************************************/
/**
 * Redux compares:
 * - Previous selected value
 * - New selected value
 *
 * If changed → component re-renders
 * If same     → no re-render
 */

/********************************************
 * 🟢 COMPLETE SYNC FLOW (Short)
 ********************************************/
/**
 * UI → dispatch(action)
 * → reducer
 * → store updates state
 * → useSelector gets new data
 * → UI updates
 */

/*********************************************************
 * 🔁 ASYNC REDUX FLOW (Thunk – Deep Walkthrough)
 *********************************************************/

/********************************************
 * 🟢 Why Async Needs Extra Step
 ********************************************/
/**
 * Reducers must be synchronous
 * API calls are asynchronous
 *
 * 👉 Thunk handles async work
 */

/********************************************
 * 🟢 Async Step 1: UI Dispatches Thunk
 ********************************************/

dispatch(fetchUser());

/********************************************
 * 🟢 Async Step 2: Thunk Middleware Intercepts
 ********************************************/
/**
 * Thunk sees:
 * - Dispatched value is a FUNCTION
 * - Not a plain object
 *
 * So reducer is NOT called yet
 */

/********************************************
 * 🟢 Async Step 3: Thunk Executes Function
 ********************************************/

export const fetchUser = () => {
  return async (dispatch, getState) => {
    dispatch({ type: "user/loading" });

    const res = await fetch("/api/user");
    const data = await res.json();

    dispatch({ type: "user/success", payload: data });
  };
};

/**
 * Thunk can:
 * - Call APIs
 * - Read current state (getState)
 * - Dispatch multiple actions
 */

/********************************************
 * 🟢 Async Step 4: Reducer Handles Result
 ********************************************/
/**
 * loading → success / error
 * Reducer updates store
 */

/********************************************
 * 🟢 Async Flow Summary
 ********************************************/
/**
 * UI → dispatch(thunk)
 * thunk → async work
 * thunk → dispatch(action)
 * reducer → store
 * UI updates
 */

/*********************************************************
 * 🧠 IMPORTANT INTERNAL DETAILS (Interview Gold)
 *********************************************************/

/********************************************
 * 🟢 Why Redux is Predictable
 ********************************************/
/**
 * - Single store
 * - One-way data flow
 * - Explicit actions
 */

/********************************************
 * 🟢 Why Redux Performs Well
 ********************************************/
/**
 * - useSelector does reference check (===)
 * - Only affected components re-render
 */

/********************************************
 * 🟢 Common Interview Questions
 ********************************************/
/**
 * Q: Can UI change state directly?
 * A: ❌ No, only via dispatch
 *
 * Q: Can reducer call API?
 * A: ❌ Never
 *
 * Q: Where does async logic live?
 * A: Thunk / middleware
 */

/********************************************
 * 🟢 Redux Flow in ONE Line (Interview)
 ********************************************/
/**
 * "Redux flow starts with dispatching an action
 * from the UI, reducers compute the new state,
 * the store updates it, and subscribed components
 * re-render using selectors."
 */

/********************************************
 * 🟢 Final Mental Model
 ********************************************/
/**
 * UI = Event trigger
 * Action = Description
 * Reducer = Decision maker
 * Store = State holder
 * Selector = Reader
 */
