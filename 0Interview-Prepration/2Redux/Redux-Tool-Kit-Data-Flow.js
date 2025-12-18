/*********************************************************
 * 📘 Redux Toolkit (RTK) Data Flow – Deep Explanation
 * Beginner Friendly + Interview Ready
 *********************************************************/

/********************************************
 * 🟢 Big Picture (RTK Data Flow)
 ********************************************/
/**
 * UI (Component)
 *   ↓ dispatch()
 * Action (auto-generated)
 *   ↓
 * Middleware (Thunk by default)
 *   ↓
 * Slice Reducer
 *   ↓
 * Store (state updated)
 *   ↓
 * useSelector()
 *   ↓
 * UI re-renders
 *
 * 👉 One-way data flow
 */

/********************************************
 * 🟢 Step 0: Store Setup (configureStore)
 ********************************************/

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

/**
 * configureStore does:
 * ✅ Combines reducers
 * ✅ Adds thunk middleware
 * ✅ Enables DevTools
 */

/********************************************
 * 🟢 Step 1: Slice Creation (createSlice)
 ********************************************/

import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { loginStart, loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;

/**
 * Slice provides:
 * - Reducer
 * - Action creators
 */

/********************************************
 * 🟢 Step 2: UI Dispatches Action
 ********************************************/

import { useDispatch } from "react-redux";
import { loginStart } from "./authSlice";

function LoginButton() {
  const dispatch = useDispatch();

  return <Button title="Login" onPress={() => dispatch(loginStart())} />;
}

/**
 * UI never updates state directly
 */

/********************************************
 * 🟢 Step 3: Action Object (Auto-Generated)
 ********************************************/
/**
 * loginStart() creates:
 */

// {
//   type: "auth/loginStart",
//   payload: undefined,
// }

/********************************************
 * 🟢 Step 4: Middleware Layer (Thunk)
 ********************************************/
/**
 * - Thunk is included by default
 * - If action is a function → thunk executes it
 * - If action is object → passed to reducer
 */

/********************************************
 * 🟢 Step 5: Reducer Updates State (Sync)
 ********************************************/
/**
 * Reducer:
 * - Receives old state + action
 * - Calculates new state
 *
 * RTK uses Immer:
 * - You write "mutable" code
 * - State remains immutable
 */

/********************************************
 * 🟢 Step 6: Store Saves Updated State
 ********************************************/
/**
 * Store replaces old state with new state
 */

/********************************************
 * 🟢 Step 7: useSelector Reads Updated State
 ********************************************/

import { useSelector } from "react-redux";

function Profile() {
  const user = useSelector((state) => state.auth.user);

  return user ? <Text>{user.name}</Text> : <Text>Guest</Text>;
}

/********************************************
 * 🟢 Step 8: React Re-renders UI
 ********************************************/
/**
 * - useSelector compares previous & next values
 * - If changed → re-render
 */

/*********************************************************
 * 🔁 ASYNC RTK FLOW (createAsyncThunk)
 *********************************************************/

/********************************************
 * 🟢 Step 1: UI Dispatches Async Thunk
 ********************************************/

dispatch(loginUser({ email, password }));

/********************************************
 * 🟢 Step 2: createAsyncThunk Runs
 ********************************************/

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    const res = await fetch("/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    return res.json();
  }
);

/********************************************
 * 🟢 Step 3: RTK Dispatches Lifecycle Actions
 ********************************************/
/**
 * Automatically dispatched:
 * - auth/loginUser/pending
 * - auth/loginUser/fulfilled
 * - auth/loginUser/rejected
 */

/********************************************
 * 🟢 Step 4: extraReducers Handle Async Result
 ********************************************/

extraReducers: (builder) => {
  builder
    .addCase(loginUser.pending, (state) => {
      state.loading = true;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    })
    .addCase(loginUser.rejected, (state) => {
      state.loading = false;
    });
};

/********************************************
 * 🟢 Step 5: Store Updates State
 ********************************************/

/********************************************
 * 🟢 Step 6: useSelector Triggers UI Update
 ********************************************/

/*********************************************************
 * 🧠 INTERNAL RTK ADVANTAGES (Why RTK is Better)
 *********************************************************/

/********************************************
 * 🟢 Built-in Middleware
 ********************************************/
/**
 * - Thunk
 * - DevTools
 * - Immutability checks
 */

/********************************************
 * 🟢 Reduced Boilerplate
 ********************************************/
/**
 * - No action constants
 * - No switch-case reducers
 */

/********************************************
 * 🟢 Predictability
 ********************************************/
/**
 * - All updates are synchronous
 * - Async logic separated cleanly
 */

/*********************************************************
 * 🟢 Interview Answer (Strong)
 *********************************************************/

/**
 * "Redux Toolkit data flow starts when the UI dispatches
 * an action or async thunk. Middleware processes it,
 * slice reducers synchronously update the state,
 * the store saves it, and components re-render
 * using useSelector."
 */

/*********************************************************
 * 🟢 One-Line Summary
 *********************************************************/

/**
 * RTK = Redux + Best Practices + Less Code
 */
