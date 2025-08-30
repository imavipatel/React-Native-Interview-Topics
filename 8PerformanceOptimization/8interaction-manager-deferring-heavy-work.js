/* =============================================================================
📘 InteractionManager – Deferring Heavy Work in React Native
============================================================================= */

/*
🟢 Introduction
-----------------------------------------------------------------------------
- In React Native, UI rendering (animations, gestures, screen transitions) 
  runs on the main thread.
- If we run heavy tasks (e.g., JSON parsing, complex calculations, large API 
  responses) immediately after rendering, the UI can feel "janky" or laggy.
- 🔑 Solution: InteractionManager – it lets us schedule heavy/non-urgent work 
  to run *after* animations and interactions finish.

✅ Use cases:
- Deferring expensive computations.
- Post-processing data after screen navigation.
- Running non-urgent API requests or logs after UI is stable.
*/

/* =============================================================================
🔹 How InteractionManager Works
-----------------------------------------------------------------------------
- It queues tasks to execute *after* current interactions/animations are complete.
- Helps keep UI smooth by not blocking the main thread during transitions.

Methods:
1. InteractionManager.runAfterInteractions(callback)
   → Runs the callback once interactions are done.

2. InteractionManager.createInteractionHandle()
   → Marks the start of an interaction (rarely used manually).

3. InteractionManager.clearInteractionHandle(handle)
   → Marks the end of that interaction.
*/

/* =============================================================================
🔹 Example 1 – Deferring Heavy Work (React Native)
============================================================================= */

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  InteractionManager,
} from "react-native";

export default function HeavyScreen() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      // Simulate heavy task (e.g., parsing JSON, preparing data)
      setTimeout(() => {
        setReady(true);
      }, 2000);
    });

    return () => task.cancel(); // cleanup if component unmounts
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {ready ? (
        <Text>✅ Heavy Work Done!</Text>
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  );
}

/*
✅ Explanation:
- When the screen opens, the heavy work is delayed until interactions finish.
- The ActivityIndicator keeps UI smooth while task runs in background.
*/

/* =============================================================================
🔹 Example 2 – Navigation + InteractionManager
-----------------------------------------------------------------------------
- Useful when you navigate between screens and want to defer heavy data work 
  until transition is complete.
*/

import { useFocusEffect } from "@react-navigation/native";

function ProfileScreen() {
  const [data, setData] = useState(null);

  useFocusEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      // Simulate heavy computation
      const processed = Array(100000).fill("🔥").join("");
      setData(processed);
    });

    return () => task.cancel();
  });

  return <Text>{data ? "✅ Data Processed" : "⏳ Processing..."}</Text>;
}

/* =============================================================================
🔹 Example 3 – with Promise
-----------------------------------------------------------------------------
InteractionManager.runAfterInteractions also returns a Promise.
*/

useEffect(() => {
  InteractionManager.runAfterInteractions(() => {
    console.log("✅ Heavy work completed after animations");
  }).then(() => {
    console.log("🎉 Task finished (Promise resolved)");
  });
}, []);

/* =============================================================================
🔹 Best Practices
-----------------------------------------------------------------------------
✅ Use InteractionManager for:
- Heavy calculations.
- Large API post-processing.
- Logging/debug tasks.

⚠️ Avoid:
- Using it for urgent tasks (like validation, immediate API calls).
- Long blocking tasks (offload those to native modules or worker threads).

💡 Tip:
- For CPU-heavy tasks, consider libraries like `react-native-worker-threads` 
  or move logic to backend.
*/

/* =============================================================================
🔹 Q&A (Interview Style)
-----------------------------------------------------------------------------
Q1: Why use InteractionManager in React Native?
   → To defer heavy tasks until after animations/interactions, preventing UI lag.

Q2: How is it different from setTimeout?
   → setTimeout waits for a fixed delay, while InteractionManager ensures 
     task runs *after UI interactions complete*.

Q3: Can InteractionManager cancel tasks?
   → Yes, `.cancel()` prevents a scheduled task from running if component unmounts.
*/

/* =============================================================================
🔹 Comparison with useEffect & setTimeout
-----------------------------------------------------------------------------
- useEffect:
   → Runs after render, but before animations complete.
   → If heavy work is inside useEffect, it can block animations and cause lag.

- setTimeout:
   → Runs after a fixed delay (not tied to UI interactions).
   → May still block animations if delay expires during a transition.

- InteractionManager:
   → Specifically designed to wait until *all ongoing interactions/animations* 
     are finished, then executes tasks.
   → Ensures smooth UX.

✅ Best choice for deferring heavy non-urgent work in RN.
*/

/* =============================================================================
✅ Final Takeaway
-----------------------------------------------------------------------------
- InteractionManager → schedules heavy/non-urgent tasks after animations finish.
- Improves perceived performance by keeping UI smooth.
- Ideal for expensive computations, large data processing, or background logging.
============================================================================= */
