/**
 * ==============================================================
 * 📘 React 18 – Concurrent Features
 * ==============================================================
 *
 * 🟢 What is Concurrency in React?
 * --------------------------------------------------------------
 * - "Concurrent Rendering" means React can prepare multiple versions
 *   of the UI at the same time without blocking the main thread.
 * - Instead of rendering everything synchronously (blocking),
 *   React 18 introduces smarter scheduling → responsive apps.
 *
 * 🟢 Why Introduced?
 * --------------------------------------------------------------
 * - Old React (before 18) rendered updates synchronously:
 *    → Big updates blocked UI (laggy typing, frozen UI).
 * - Modern apps need smoother interactions, streaming UIs, and
 *   better user experience even under heavy load.
 * - Concurrency allows React to pause, interrupt, or abandon a render
 *   if higher priority work (like user input) comes in.
 *
 * ==============================================================
 * 🔹 Core Concurrent Features in React 18
 * ==============================================================
 *
 * 1. ✅ Automatic Batching
 * --------------------------------------------------------------
 * - React batches state updates automatically (not only inside events).
 * - Prevents unnecessary re-renders.
 *
 * Example:
 */
import React, { useState } from "react";

export default function AutoBatchingExample() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  function handleClick() {
    setCount((c) => c + 1);
    setText("Updated!");
    // Both updates happen in one render (batched automatically)
  }

  return (
    <>
      <button onClick={handleClick}>Update</button>
      <p>{count} – {text}</p>
    </>
  );
}

/**
 * --------------------------------------------------------------
 * 2. ✅ Transitions (useTransition Hook)
 * --------------------------------------------------------------
 * - Distinguish between urgent updates (typing, clicks) vs non-urgent (UI heavy updates).
 * - Prevents UI lag when rendering expensive components.
 *
 * Example:
 */
import React, { useState, useTransition } from "react";

export default function TransitionExample() {
  const [query, setQuery] = useState("");
  const [list, setList] = useState([]);
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value); // urgent update (typing)
    startTransition(() => {
      const items = Array.from({ length: 5000 }, (_, i) => value + " " + i);
      setList(items); // non-urgent update
    });
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <p>Loading...</p>}
      {list.map((item, i) => <div key={i}>{item}</div>)}
    </>
  );
}

/**
 * --------------------------------------------------------------
 * 3. ✅ Suspense for Data Fetching
 * --------------------------------------------------------------
 * - Allows UI to “wait” for async resources before showing content.
 * - Used with libraries like React Query, Relay, or future fetch APIs.
 *
 * Example:
 */
import React, { Suspense } from "react";

function ProfileDetails() {
  const data = fetchUserData(); // async resource (example)
  return <p>{data.name}</p>;
}

export default function SuspenseExample() {
  return (
    <Suspense fallback={<p>Loading profile...</p>}>
      <ProfileDetails />
    </Suspense>
  );
}

/**
 * --------------------------------------------------------------
 * 4. ✅ Streaming Server-Side Rendering (SSR with Suspense)
 * --------------------------------------------------------------
 * - Server can stream parts of HTML to client as they are ready.
 * - Faster first paint → great for SEO & performance.
 *
 * --------------------------------------------------------------
 * 5. ✅ New Hooks for Concurrency
 * --------------------------------------------------------------
 * - useTransition → mark updates as non-urgent.
 * - useDeferredValue → show stale UI until new value is ready.
 * - useId → generate unique IDs (important in concurrent rendering).
 *
 * Example (useDeferredValue):
 */
import React, { useState, useDeferredValue } from "react";

export default function DeferredValueExample() {
  const [input, setInput] = useState("");
  const deferredInput = useDeferredValue(input); // keeps showing old value until new is ready

  const items = Array.from({ length: 3000 }, (_, i) => deferredInput + i);

  return (
    <>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      {items.map((item, i) => <div key={i}>{item}</div>)}
    </>
  );
}

/**
 * Example (useId):
 */
import React, { useId } from "react";

export default function UseIdExample() {
  const id = useId(); // unique + stable ID

  return (
    <form>
      <label htmlFor={id + "-email"}>Email</label>
      <input id={id + "-email"} type="email" />
    </form>
  );
}

/**
 * ==============================================================
 * 📊 Comparison: Old React vs React 18
 * --------------------------------------------------------------
 * | Feature                | React <18 (Old)         | React 18 (Concurrent)         |
 * |-------------------------|-------------------------|--------------------------------|
 * | Rendering               | Blocking (sync)         | Interruptible (async/concurrent)|
 * | State Batching          | Only in events          | Automatic everywhere          |
 * | UI Responsiveness       | UI can freeze           | Smooth, responsive            |
 * | Data Fetch Integration  | Manual loading states   | Suspense built-in             |
 * | SSR                     | All at once             | Streaming with Suspense       |
 *
 * ==============================================================
 * ❓ Q&A (Interview Style)
 * --------------------------------------------------------------
 * Q1: What problem does React 18 concurrency solve?
 *   → Prevents blocking UI, makes updates interruptible,
 *     improves responsiveness.
 *
 * Q2: Difference between useTransition & useDeferredValue?
 *   → useTransition: defer a state update (non-urgent work).
 *     useDeferredValue: delay usage of a value until less busy.
 *
 * Q3: Does concurrency change React’s mental model?
 *   → No. It’s still declarative. Concurrency is an implementation
 *     detail → React decides scheduling, devs just mark priorities.
 *
 * Q4: What is useId useful for?
 *   → Generating stable unique IDs for accessibility & forms,
 *     especially important for concurrent rendering to avoid ID mismatches.
 *
 * ==============================================================
 * ✅ Final Takeaways
 * --------------------------------------------------------------
 * - React 18 = concurrent rendering by default.
 * - Features: Automatic batching, Suspense, Transitions, useDeferredValue, useId.
 * - Improves performance without changing how we write most code.
 * ==============================================================
 */
