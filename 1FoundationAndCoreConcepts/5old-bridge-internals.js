/**
 * ==============================================================
 * 📘 React Native Notes – Old Bridge Internals (JSON Serialization & Batched Queues)
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 Why does React Native need a Bridge?
 * - React Native runs **JavaScript code** (on JS thread) and **Native code** (on iOS/Android).
 * - These two worlds cannot directly talk to each other.
 * - The **Bridge** acts as a translator:
 *    ✅ Converts JS objects → Native objects
 *    ✅ Converts Native responses → JS objects
 *    ✅ Ensures async + thread-safe communication
 *
 * --------------------------------------------------------------
 * 🔹 JSON Serialization
 * - All messages between JS ↔ Native are converted into **JSON strings**.
 * - Example:
 *    JS → { type: "log", message: "Hello" }
 *    Native receives → "{ type: 'log', message: 'Hello' }"
 * - This ensures:
 *    ✅ Language-neutral communication (works on iOS/Android)
 *    ✅ Safe transport across threads
 * - Downside:
 *    ❌ Serialization/Deserialization takes time
 *    ❌ Large objects = performance bottleneck
 *
 * --------------------------------------------------------------
 * 🔹 Batched Queues
 * - Messages are not sent **one by one** (too slow).
 * - Instead, JS batches multiple calls into a **queue**:
 *    * Queue = Array of messages → serialized → sent across Bridge.
 * - Native side processes the batch, executes operations, and replies in batches.
 * - Benefits:
 *    ✅ Fewer thread hops
 *    ✅ Better performance than single-message transport
 * - Example:
 *    Queue = [ {op: "createView"}, {op: "updateProps"}, {op: "measure"} ]
 *
 * --------------------------------------------------------------
 * 🔹 Flow of Events (Old Bridge)
 * 1) JS makes API calls (e.g., update a View).
 * 2) Calls are serialized → JSON string.
 * 3) Batched into a queue.
 * 4) Sent over the Bridge to Native thread.
 * 5) Native deserializes JSON → executes UI updates.
 * 6) If needed, Native sends responses back as JSON (again via batched queue).
 *
 * --------------------------------------------------------------
 * 🔹 Problems with Old Bridge
 * - Serialization overhead (JSON.stringify / parse).
 * - Too much context switching (JS ↔ Native threads).
 * - High latency for heavy UI interactions.
 * - Motivation for **New Architecture (JSI + TurboModules + Fabric)**.
 *
 * ==============================================================
 */

//
// 🔹 Example 1: JS → Native via Bridge
//
/**
 * JS code
 */
function logMessage(msg) {
  const call = { type: "log", message: msg };
  const serialized = JSON.stringify(call);
  // send serialized to Native
  sendToNative(serialized);
}
logMessage("Hello RN");

/**
 * Native receives JSON string:
 * "{ 'type': 'log', 'message': 'Hello RN' }"
 * → Parses and executes
 */

//
// 🔹 Example 2: Batched Queue Simulation
//
/**
 * Instead of sending one-by-one:
 * {op: "createView"}
 * {op: "updateProps"}
 *
 * We batch:
 */
const queue = [];
queue.push({ op: "createView", view: "Button" });
queue.push({ op: "updateProps", id: 1, props: { text: "Click" } });

// Serialize entire queue at once
const serializedQueue = JSON.stringify(queue);
sendToNative(serializedQueue);

//
// Native processes all in one go ✅
//

/**
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: Why did React Native use JSON serialization in the old Bridge?
 *    → JSON is universal, works across iOS/Android, and thread-safe.
 *
 * Q2: What are Batched Queues?
 *    → Instead of sending one message at a time, multiple messages
 *      are collected into a batch and sent together for efficiency.
 *
 * Q3: What is the main performance problem with JSON serialization?
 *    → Converting objects ↔ JSON repeatedly is slow, especially with
 *      large data structures or frequent UI updates.
 *
 * Q4: Why was the Old Bridge replaced?
 *    → Too much overhead (serialization + thread switching) leading
 *      to laggy UI. The New Architecture uses **JSI + direct calls**
 *      without JSON overhead.
 *
 * Q5: Real-world example of bottleneck?
 *    → Large FlatList scrolling → too many UI update calls →
 *      Bridge chokes on serialization/deserialization.
 *
 * ==============================================================
 */
