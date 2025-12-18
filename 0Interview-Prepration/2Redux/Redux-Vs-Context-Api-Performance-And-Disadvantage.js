/*********************************************************
 * 📘 Redux vs Context API
 * Focus: Disadvantages of Context API + Performance
 * (Beginner-Friendly, Interview-Oriented)
 *********************************************************/

/********************************************
 * 🟢 Very Short Answer (Interview Ready)
 ********************************************/
/**
 * Context API is good for SMALL & STATIC data.
 * Redux performs better for LARGE apps with FREQUENT updates.
 *
 * 👉 Context API can cause unnecessary re-renders.
 * 👉 Redux updates only the components that need the data.
 */

/********************************************
 * 🟢 Why Context API Has Performance Issues
 ********************************************/
/**
 * Important rule:
 * ❗ Whenever Context value changes,
 *    ALL components using that context RE-RENDER.
 */

/********************************************
 * 🟢 Context API – Example Problem
 ********************************************/

const AppContext = createContext();

function AppProvider({ children }) {
  const [count, setCount] = useState(0);

  return (
    <AppContext.Provider value={{ count, setCount }}>
      {children}
    </AppContext.Provider>
  );
}

function ScreenA() {
  const { count } = useContext(AppContext);
  return <Text>{count}</Text>;
}

function ScreenB() {
  const { setCount } = useContext(AppContext);
  return <Button title="+" onPress={() => setCount((c) => c + 1)} />;
}

/**
 * ⚠️ Problem:
 * - count changes
 * - ScreenA re-renders (correct)
 * - ScreenB ALSO re-renders (not needed)
 */

/********************************************
 * 🟢 Why This Happens in Context API
 ********************************************/
/**
 * Context works with VALUE reference comparison
 *
 * New object = new reference
 * → All consumers re-render
 */

/********************************************
 * 🟢 Disadvantages of Context API (Important)
 ********************************************/
/**
 * ❌ Re-renders all consumers
 * ❌ Not optimized for frequent updates
 * ❌ No middleware support
 * ❌ No built-in debugging tools
 * ❌ Hard to scale for large apps
 * ❌ Complex logic becomes messy
 */

/********************************************
 * 🟢 Redux Performance – Why It’s Better
 ********************************************/
/**
 * Redux uses:
 * - Subscription-based updates
 * - Selective rendering
 *
 * Only components that SELECT changed data re-render
 */

/********************************************
 * 🟢 Redux Example (Efficient Updates)
 ********************************************/

const count = useSelector((state) => state.counter.count);

/**
 * ✔ Component re-renders ONLY when:
 *    state.counter.count changes
 */

/********************************************
 * 🟢 How Redux Avoids Unnecessary Re-renders
 ********************************************/
/**
 * 1️⃣ useSelector compares previous & next value (===)
 * 2️⃣ If value did NOT change → no re-render
 * 3️⃣ State updates are immutable & predictable
 */

/********************************************
 * 🟢 Middleware Advantage (Performance Indirect)
 ********************************************/
/**
 * Redux Middleware:
 * - Thunk / Saga
 * - Debouncing
 * - Caching
 * - Request cancellation
 *
 * 👉 Leads to fewer API calls
 * 👉 Better runtime performance
 */

/********************************************
 * 🟢 Performance Comparison Table
 ********************************************/

const performanceComparison = `
Context API:
- Re-renders all consumers
- Poor for frequent updates
- No optimization control
- Good only for static data

Redux:
- Re-renders only required components
- Handles frequent updates well
- Memoized selectors possible
- Excellent performance at scale
`;

/********************************************
 * 🟢 Real-Life Analogy
 ********************************************/
/**
 * Context API:
 * - Like shouting in an office
 * - Everyone hears & reacts
 *
 * Redux:
 * - Like sending a direct message
 * - Only the required person reacts
 */

/********************************************
 * 🟢 When Context API Is OK
 ********************************************/
/**
 * ✅ Theme
 * ✅ Language
 * ✅ App config
 *
 * Reason:
 * - Updates are rare
 */

/********************************************
 * 🟢 When Redux Is Better
 ********************************************/
/**
 * ✅ Authentication
 * ✅ Cart & Orders
 * ✅ API Data
 * ✅ Real-time updates
 * ✅ Large React Native apps
 */

/********************************************
 * 🟢 Interview Answer (Strong)
 ********************************************/
/**
 * "Context API causes all consuming components
 * to re-render whenever its value changes,
 * making it inefficient for frequent updates.
 *
 * Redux is more performant because it updates
 * only the components that select the changed state."
 */

/********************************************
 * 🟢 Final Conclusion
 ********************************************/
/**
 * Small app → Context API
 * Large app → Redux
 *
 * Performance winner → Redux 🏆
 */
