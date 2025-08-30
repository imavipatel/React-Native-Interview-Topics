/**
 * ==============================================================
 * 📘 React State Management – MobX, Zustand, Recoil
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 Why alternatives to Redux?
 * - Redux is powerful but can be verbose and boilerplate-heavy.
 * - Alternatives like **MobX, Zustand, and Recoil** provide simpler,
 *   more developer-friendly state management for different use cases.
 *
 * --------------------------------------------------------------
 * 🔹 MobX
 * - Reactive state management library (uses **observables**).
 * - Automatically tracks state changes and re-renders only what is needed.
 * - Embraces OOP style → State is stored in **classes** with observable fields.
 * - Uses decorators like `@observable`, `@computed`, and `@action` (or functions).
 * - Great for apps that prefer **mutable state** (opposite of Redux's immutability).
 * - Downsides:
 *    ❌ Can be harder to debug (less explicit than Redux).
 *    ❌ Tight coupling with classes.
 *
 * --------------------------------------------------------------
 * 🔹 Zustand
 * - Lightweight state management library.
 * - Minimal API → `create()` function creates a store.
 * - Uses plain JavaScript (no boilerplate, no reducers, no context).
 * - Works well with hooks (`useStore`) for reading/updating state.
 * - Scales from small to medium apps.
 * - Advantages:
 *    ✅ No providers or context required.
 *    ✅ Very simple API.
 * - Downsides:
 *    ❌ Less tooling compared to Redux.
 *    ❌ Not ideal for very complex apps.
 *
 * --------------------------------------------------------------
 * 🔹 Recoil
 * - State management library developed by Facebook for React.
 * - Works with the idea of **atoms** (pieces of state) and **selectors** (derived state).
 * - Atoms → Shared state across components.
 * - Selectors → Derived/computed state (similar to MobX’s computed).
 * - Deep integration with React → Uses hooks like `useRecoilState`, `useRecoilValue`.
 * - Good for apps with **complex component trees**.
 * - Downsides:
 *    ❌ Still experimental (not as stable as Redux/MobX).
 *    ❌ Smaller ecosystem.
 *
 * ==============================================================
 * 🔹 Comparison Table
 * --------------------------------------------------------------
 *
 * | Feature              | MobX 🔵                        | Zustand 🟢                  | Recoil 🟣                       |
 * |----------------------|--------------------------------|-----------------------------|---------------------------------|
 * | Style                | OOP (classes, observables)     | Functional (hooks, stores)  | React-first (atoms & selectors) |
 * | Boilerplate          | Low                            | Very low                    | Moderate                        |
 * | Mutability           | Mutable state                  | Mutable (via set function)  | Immutable (like Redux)          |
 * | Best For             | Large apps, reactive UIs       | Small-medium apps           | Apps with deep component trees  |
 * | Learning Curve       | Medium (decorators, observables)| Easy (just hooks)           | Medium (new concepts: atoms)    |
 * | Debugging            | Harder (less explicit)         | Easy (simple functions)     | Okay (but less tooling)         |
 * | Ecosystem            | Mature                         | Small, growing              | New, FB-backed                  |
 *
 * ==============================================================
 * 🔹 Code Examples
 * --------------------------------------------------------------
 *
 * Example 1: MobX (Class-based store)
 */
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";

class CounterStore {
  count = 0;
  constructor() {
    makeAutoObservable(this);
  }
  increment() {
    this.count++;
  }
}

const store = new CounterStore();

const Counter = observer(() => (
  <div>
    <p>{store.count}</p>
    <button onClick={() => store.increment()}>+</button>
  </div>
));

/**
 * --------------------------------------------------------------
 * Example 2: Zustand (Hook-based store)
 */
import create from "zustand";

const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

function Counter() {
  const { count, increment } = useCounterStore();
  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>+</button>
    </div>
  );
}

/**
 * --------------------------------------------------------------
 * Example 3: Recoil (Atoms & Selectors)
 */
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

const countAtom = atom({
  key: "countAtom",
  default: 0,
});

const doubleCount = selector({
  key: "doubleCount",
  get: ({ get }) => get(countAtom) * 2,
});

function Counter() {
  const [count, setCount] = useRecoilState(countAtom);
  const doubled = useRecoilValue(doubleCount);
  return (
    <div>
      <p>Count: {count}</p>
      <p>Double: {doubled}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}

/**
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: When would you use MobX instead of Redux?
 *    → When you want reactive, OOP-style state management with less boilerplate.
 *
 * Q2: Why is Zustand popular for small apps?
 *    → Because it has a super simple API (just hooks) and requires no setup.
 *
 * Q3: How does Recoil differ from Redux?
 *    → Recoil integrates directly with React via atoms & selectors, while Redux
 *      uses a global store with reducers and actions.
 *
 * Q4: Which one is better for performance?
 *    - MobX → Very fast, fine-grained reactivity.
 *    - Zustand → Efficient because components only re-render on selected state.
 *    - Recoil → Efficient for deeply nested trees due to atom-based state.
 *
 * Q5: Real-world examples?
 *    - MobX: Complex dashboards with live reactive data.
 *    - Zustand: Small React Native apps or prototypes.
 *    - Recoil: Social apps where many components share global state.
 *
 * ==============================================================
 */
