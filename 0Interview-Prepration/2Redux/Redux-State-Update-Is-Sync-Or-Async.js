/*********************************************************
 * 📘 Is Redux State Update Synchronous or Asynchronous?
 * (Very Important Interview Question)
 *********************************************************/

/********************************************
 * 🟢 Short Answer (Interview Ready)
 ********************************************/
/**
 * ✅ Redux state updates are SYNCHRONOUS
 * ❌ Async behavior comes from middleware (Thunk, Saga)
 */

/********************************************
 * 🟢 What "Synchronous" Means Here
 ********************************************/
/**
 * Synchronous =
 * - Action is dispatched
 * - Reducer runs immediately
 * - Store updates state immediately
 */

/********************************************
 * 🟢 Example – Synchronous Redux Update
 ********************************************/

dispatch({ type: "INCREMENT" });

/**
 * Flow:
 * 1️⃣ dispatch called
 * 2️⃣ reducer executes immediately
 * 3️⃣ state updated immediately
 */

/********************************************
 * 🟢 Proof: getState() After Dispatch
 ********************************************/

dispatch({ type: "INCREMENT" });

const state = store.getState();
console.log(state.counter.count); // ✅ Updated value

/**
 * If Redux were async,
 * this would log old value (but it doesn't)
 */

/********************************************
 * 🟢 Why People Think Redux is Async
 ********************************************/
/**
 * Because:
 * - API calls
 * - setTimeout
 * - async/await
 *
 * But these are NOT Redux,
 * these are middleware responsibilities
 */

/*********************************************************
 * 🟢 Async Logic in Redux (Where it REALLY Happens)
 *********************************************************/

/********************************************
 * 🟢 Thunk Example
 ********************************************/

dispatch(fetchUsers());

/**
 * fetchUsers is async,
 * but reducer updates are still synchronous
 */

/********************************************
 * 🟢 What Happens Internally
 ********************************************/
/**
 * UI → dispatch(thunk)
 * thunk → async work
 * thunk → dispatch(action)
 * reducer → sync state update
 */

/*********************************************************
 * 🟢 Redux vs React setState (Common Confusion)
 *********************************************************/

/**
 * React setState:
 * ❌ Asynchronous (batched)
 *
 * Redux reducer:
 * ✅ Synchronous
 */

/********************************************
 * 🟢 Comparison Table
 ********************************************/

const comparison = `
Redux State Update:
- Synchronous
- Predictable
- Immediate in store

React setState:
- Asynchronous
- Batched
- UI update delayed
`;

/*********************************************************
 * 🟢 Interview Trick Question
 *********************************************************/

/**
 * Q: Is Redux async?
 * A: ❌ No
 *
 * Q: Can Redux handle async?
 * A: ✅ Yes, using middleware
 */

/*********************************************************
 * 🟢 Final Interview Answer
 *********************************************************/

/**
 * "Redux state updates are synchronous.
 * Asynchronous behavior is handled by middleware
 * like Thunk or Saga, but reducers always update
 * the state synchronously."
 */
