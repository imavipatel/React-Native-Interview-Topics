/**
 * ==============================================================
 * 📘 React – useEffect vs useLayoutEffect
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * - Both `useEffect` and `useLayoutEffect` are React hooks used
 *   for running side effects in functional components.
 *
 * - The difference lies in **when** they run in the rendering pipeline:
 *
 *   ✅ useEffect → Runs AFTER the browser paints (async, non-blocking).
 *   ✅ useLayoutEffect → Runs BEFORE the browser paints
 *      (synchronously, blocks paint until effect is finished).
 *
 * --------------------------------------------------------------
 * 🔹 useEffect
 * - Non-blocking: React paints the UI first, then runs the effect.
 * - Good for: network requests, subscriptions, logging, timers.
 * - Prevents blocking user experience.
 *
 * 🔹 useLayoutEffect
 * - Blocking: Runs synchronously after DOM (or native layout) changes
 *   but before the browser paints to the screen.
 * - Good for: DOM measurements, animations, synchronizing layout.
 * - Can cause performance issues if used heavily.
 *
 * ==============================================================
 * 🕒 RENDER TIMELINE ILLUSTRATION
 * ==============================================================
 *
 * 1️⃣ React renders the component (reconciliation).
 * 2️⃣ Browser prepares to paint (commit phase).
 * 3️⃣ 🔹 useLayoutEffect runs (synchronously, before paint).
 * 4️⃣ Browser paints UI to the screen.
 * 5️⃣ 🔹 useEffect runs (asynchronously, after paint).
 *
 * Visualization:
 *
 *   [ Render ] ---> [ useLayoutEffect ] ---> [ Paint ] ---> [ useEffect ]
 *
 * - useLayoutEffect can block Paint until it finishes.
 * - useEffect never blocks Paint (always runs after).
 *
 * ==============================================================
 * 📊 Side-by-Side Comparison
 * ==============================================================
 *
 * Feature                  | useEffect                       | useLayoutEffect
 * -------------------------|---------------------------------|-----------------------------------
 * Timing                   | After paint (async)             | Before paint (sync)
 * Blocks UI?               | ❌ No                           | ✅ Yes
 * Use cases                | API calls, timers, logging      | DOM measurements, sync animations
 * Performance              | Better (non-blocking)           | Can cause jank if misused
 * Runs on                  | After commit phase              | Before browser paint
 *
 * ==============================================================
 * 🔹 Examples (React Native)
 * --------------------------------------------------------------
 */

// ✅ useEffect Example (non-blocking, safe for async work)
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

function ExampleUseEffect() {
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log("Fetching data...");
    setTimeout(() => {
      setData("✅ Data loaded!");
    }, 2000);
  }, []);

  return (
    <View>
      <Text>{data || "Loading..."}</Text>
    </View>
  );
}

// --------------------------------------------------------------

// ✅ useLayoutEffect Example (measure layout before paint)
import React, { useLayoutEffect, useRef, useState } from "react";
import { Text, View } from "react-native";

function ExampleUseLayoutEffect() {
  const textRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (textRef.current) {
      // measure layout before screen is painted
      textRef.current.measure((x, y, width, height) => {
        setSize({ width, height });
      });
    }
  }, []);

  return (
    <View>
      <Text ref={textRef}>Hello Layout!</Text>
      <Text>
        Measured size: {size.width} x {size.height}
      </Text>
    </View>
  );
}

/**
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: Why not always use useLayoutEffect?
 *    → Because it blocks painting. Overusing it can cause performance
 *      issues and slow down UI rendering.
 *
 * Q2: When should you use useLayoutEffect?
 *    → When you need to measure DOM/UI elements or do synchronous
 *      mutations before the screen updates (e.g., animations).
 *
 * Q3: What happens if you measure layout inside useEffect?
 *    → You may get flickering because the paint happens before
 *      measurement/adjustment.
 *
 * Q4: Is there any difference in React Native?
 *    → Conceptually same. In RN, useLayoutEffect is used to measure
 *      native components (using refs) before the UI frame is committed.
 *
 * Q5: Which hook is more performant by default?
 *    → useEffect. Prefer it unless you specifically need layout sync.
 *
 * ==============================================================
 */
