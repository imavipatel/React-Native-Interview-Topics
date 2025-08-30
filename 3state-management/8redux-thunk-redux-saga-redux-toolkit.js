/**
 * ==============================================================
 * 📘 React Notes – Redux Thunk vs Redux Saga vs Redux Toolkit
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 Redux Thunk
 * - Middleware that lets action creators return **functions** instead of plain objects.
 * - Used for handling **simple async logic** (e.g., API calls, timers).
 * - Action creators can:
 *    ✅ Dispatch multiple actions (before & after async call)
 *    ✅ Access store state with getState()
 * - Downsides: Can get messy with complex async flows (nested promises).
 *
 * --------------------------------------------------------------
 * 🔹 Redux Saga
 * - Middleware that uses **ES6 generator functions** to handle async/side effects.
 * - Best for **complex async flows** (parallel tasks, cancellation, retries, sequencing).
 * - Sagas run in the background, listening for actions and performing side effects.
 * - Advantages:
 *    ✅ Clearer async flow management
 *    ✅ Handles race conditions, cancellation
 *    ✅ Better scalability for large apps
 * - Downsides: More setup + learning curve.
 *
 * --------------------------------------------------------------
 * 🔹 Redux Toolkit (RTK)
 * - Official, recommended way to write Redux apps (from Redux team).
 * - Provides **opinionated utilities**:
 *    ✅ `configureStore` → Easy store setup with middleware
 *    ✅ `createSlice` → Auto-generates actions + reducers
 *    ✅ `createAsyncThunk` → Simplified async logic (built-in thunk)
 * - Reduces boilerplate, makes Redux **easy + modern**.
 * - Includes immer.js internally → Allows "mutable" code style while keeping immutability.
 * - Downsides: For very advanced async patterns, you may still need sagas.
 *
 * ==============================================================
 * 🔹 Comparison Table
 * --------------------------------------------------------------
 *
 * | Feature               | Redux Thunk 🟢                | Redux Saga 🔵                      | Redux Toolkit ⚡ |
 * |-----------------------|--------------------------------|------------------------------------|-----------------|
 * | Learning Curve        | Easy (just functions)         | Medium/Hard (generators, effects)  | Easy (official & simple) |
 * | Async Handling        | Basic (API calls, promises)   | Advanced (parallel, cancel, retry) | Built-in via `createAsyncThunk` |
 * | Best For              | Small/medium apps             | Large apps with complex async flows| Modern apps (official standard) |
 * | Code Style            | Functions (async/await)       | Generator functions (`yield`)      | Slices + async thunks |
 * | Boilerplate           | Moderate (manual actions)     | High (extra sagas setup)           | Low (auto reducers/actions) |
 * | Cancellation Support  | ❌ No                         | ✅ Yes                             | ❌ No (needs saga) |
 * | Official Support      | Legacy, still used            | Community-driven                   | ✅ Official Redux way |
 *
 * ==============================================================
 * 🔹 Code Examples
 * --------------------------------------------------------------
 *
 * Example 1: Redux Thunk (Simple API call)
 */
function fetchUsers() {
  return async (dispatch) => {
    dispatch({ type: "FETCH_USERS_START" });
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      const data = await res.json();
      dispatch({ type: "FETCH_USERS_SUCCESS", payload: data });
    } catch (err) {
      dispatch({ type: "FETCH_USERS_ERROR", error: err });
    }
  };
}

/**
 * --------------------------------------------------------------
 * Example 2: Redux Saga (Complex async with cancellation)
 */
import { call, put, takeLatest, delay, cancelled } from "redux-saga/effects";

function* fetchUsersSaga() {
  try {
    yield delay(500); // Simulate debounce
    const response = yield call(() =>
      fetch("https://jsonplaceholder.typicode.com/users").then((res) =>
        res.json()
      )
    );
    yield put({ type: "FETCH_USERS_SUCCESS", payload: response });
  } catch (err) {
    yield put({ type: "FETCH_USERS_ERROR", error: err });
  } finally {
    if (yield cancelled()) {
      console.log("Fetch cancelled");
    }
  }
}

function* rootSaga() {
  yield takeLatest("FETCH_USERS_START", fetchUsersSaga); // Cancels previous if new action comes
}

/**
 * --------------------------------------------------------------
 * Example 3: Redux Toolkit (Modern approach)
 */
import {
  createSlice,
  configureStore,
  createAsyncThunk,
} from "@reduxjs/toolkit";

// Async thunk
export const fetchUsersRTK = createAsyncThunk("users/fetch", async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  return res.json();
});

const usersSlice = createSlice({
  name: "users",
  initialState: { list: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersRTK.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsersRTK.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsersRTK.rejected, (state) => {
        state.loading = false;
      });
  },
});

const store = configureStore({
  reducer: { users: usersSlice.reducer },
});

store.dispatch(fetchUsersRTK());

/**
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: Why use Redux Thunk?
 *    → To handle async logic like API calls inside action creators.
 *
 * Q2: When would you prefer Redux Saga over Thunk?
 *    → For complex workflows like canceling requests, retries, sequencing async tasks.
 *
 * Q3: What does Redux Toolkit solve?
 *    → Reduces boilerplate, provides built-in helpers (createSlice, createAsyncThunk),
 *      and is the official recommended way to use Redux.
 *
 * Q4: Can Redux Toolkit replace Redux Thunk or Saga?
 *    → RTK includes Thunk by default. For complex needs, you can still add Saga.
 *
 * Q5: Real-world Example?
 *    - Redux Thunk: Fetch user profile after login.
 *    - Redux Saga: Cancel previous search API request when typing new query.
 *    - Redux Toolkit: Build scalable store with slices, async calls, minimal code.
 *
 * ==============================================================
 */
