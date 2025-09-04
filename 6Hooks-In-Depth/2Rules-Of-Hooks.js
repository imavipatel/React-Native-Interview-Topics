/**
 * ==============================================================
 * 📘 Rules of Hooks
 * ==============================================================
 *
 * 🟢 THEORY (What are Hooks Rules?)
 * --------------------------------------------------------------
 * - React introduced **Hooks** (useState, useEffect, etc.) to let
 *   us use state and lifecycle features in functional components.
 * - But hooks have some strict **rules** to make sure they work
 *   correctly and predictably.
 * - If rules are broken → React will throw errors or behavior will
 *   become unpredictable.
 *
 * 🔑 Why Rules?
 * - Hooks rely on a **call order** for mapping state and effects
 *   inside components.
 * - If the order changes → React won’t know which state belongs to
 *   which hook.
 * - Rules ensure hooks run consistently.
 *
 * ==============================================================
 * 🔹 RULE 1: Only Call Hooks at the Top Level
 * --------------------------------------------------------------
 * ✅ Always call hooks at the **top level** of a component or hook.
 * ❌ Never call hooks inside:
 *    - Loops
 *    - Conditions (if statements)
 *    - Nested functions
 *
 * ✅ Correct Example:
 */
function Example() {
  const [count, setCount] = useState(0); // top level ✅
  useEffect(() => {
    console.log("Mounted");
  }, []);

  return <Text>{count}</Text>;
}

/**
 * ❌ Wrong Example:
 */
function WrongExample({ show }) {
  if (show) {
    // ❌ useState inside condition → breaks hook order
    const [count, setCount] = useState(0);
  }
  return <Text>Hello</Text>;
}

/**
 * --------------------------------------------------------------
 * Why?
 * - Because React tracks hooks in the order they are called.
 * - If conditions change, hook order breaks → state mismatch.
 *
 * ==============================================================
 * 🔹 RULE 2: Only Call Hooks from React Functions
 * --------------------------------------------------------------
 * ✅ Hooks can only be called inside:
 *    - Functional Components
 *    - Custom Hooks
 * ❌ Not allowed in:
 *    - Regular JavaScript functions
 *    - Class Components
 *
 * ✅ Correct Example:
 */
function Timer() {
  const [seconds, setSeconds] = useState(0); // ✅ inside component
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return <Text>{seconds}</Text>;
}

/**
 * ✅ Inside a custom hook:
 */
function useTimer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return seconds;
}

/**
 * ❌ Wrong Example (not a component or hook):
 */
function normalFunction() {
  const [value, setValue] = useState(0); // ❌ Invalid
}

/**
 * --------------------------------------------------------------
 * Why?
 * - Hooks depend on the React component lifecycle.
 * - If called outside, React won’t know how to manage their state.
 *
 * ==============================================================
 * 🔹 RULE 3: Hooks Must Start with "use"
 * --------------------------------------------------------------
 * - Naming convention is important (useState, useEffect, useFetch).
 * - React uses this naming to verify hook rules with the linter.
 *
 * ✅ Good: function useAuth() { ... }
 * ❌ Bad:  function authHook() { ... }
 *
 * ==============================================================
 * 🔹 RULE 4: Follow Dependency Array Rules
 * --------------------------------------------------------------
 * - When using `useEffect`, `useCallback`, or `useMemo`:
 *   - Always add every variable/state used inside effect/callback.
 *   - If not, it can cause **stale data** or **unexpected bugs**.
 *
 * ✅ Example:
 */
function Profile({ userId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/user/${userId}`)
      .then((res) => res.json())
      .then(setData);
  }, [userId]); // ✅ include dependency

  return <Text>{data?.name}</Text>;
}

/**
 * ❌ Wrong Example:
 * Missing dependency "userId", may fetch old data.
 */
function WrongProfile({ userId }) {
  useEffect(() => {
    fetch(`/api/user/${userId}`).then((res) => res.json());
  }, []); // ❌ userId not included
}

/**
 * ==============================================================
 * 🔹 Best Practices for Hooks Rules
 * --------------------------------------------------------------
 * ✅ Use ESLint plugin `eslint-plugin-react-hooks` to enforce rules.
 * ✅ Always call hooks at the top of your components.
 * ✅ Use custom hooks for reusable logic.
 * ✅ Never put hooks inside conditions/loops.
 * ✅ Always respect dependency arrays in effects.
 *
 * ==============================================================
 * ❓ Q&A (Interview Style)
 * --------------------------------------------------------------
 * Q1: Why can’t we use hooks inside loops or conditions?
 *   → Because hook order must remain consistent across renders.
 *
 * Q2: Can we use hooks in class components?
 *   → No. Hooks are designed only for functional components.
 *
 * Q3: What happens if you forget dependencies in useEffect?
 *   → You may end up with stale state or unexpected behavior.
 *
 * Q4: Why do custom hooks start with "use"?
 *   → Convention + helps React’s linter detect invalid hook usage.
 *
 * Q5: How do you ensure you follow hooks rules?
 *   → By using React’s eslint plugin for hooks.
 *
 * ==============================================================
 */
