/**
 * react-native-large-data-transfer-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES:
 * "How to handle large amounts of data between Native <-> React Native"
 *
 * - Why large transfers are tricky (bridge serialization, memory, GC, JS thread)
 * - Patterns: chunking, streaming, file-hand off, shared buffers/JSI, pagination
 * - Practical implementations (Android + iOS): chunked native module, file path handoff,
 *   progress events, backpressure, consumer APIs
 * - Example copy-paste hooks & small modules (JS side) you can plug with native stubs
 * - Perf & safety checklist, testing tips, interview Q&A, quick cheat-sheet
 *
 * Use this as a reference when you design large-data flows (media, DB sync, logs).
 */

/* ===========================================================================
📌 0. WHY LARGE DATA TRANSFERS ARE HARD (plain language)
===============================================================================
• Bridge (old) serializes data (JSON/binary) — copying big buffers causes:
  - high CPU for (de)serialization
  - large memory allocations + GC pressure on JS/native sides
  - blocking or jank if done on JS thread
• Frequent small messages also expensive (round-trip overhead).
• Goal: move large data with minimal copies, avoid blocking JS, provide progress & backpressure.
*/

/* ===========================================================================
📌 1. HIGH-LEVEL STRATEGIES (pick based on use-case)
===============================================================================
1) File-based handoff (recommended for very large payloads)
   - Native writes data to file (cache/temp), returns file path to JS.
   - JS reads file (stream) or hands to native-friendly readers (RNFS, react-native-blob-util).
   - Minimal JS memory usage.

2) Chunked transfer (streaming)
   - Native yields chunks (binary) via event emitter or pull API.
   - JS consumes chunks, writes to file or processes incrementally.
   - Provide progress and resume.

3) Streaming via JSI/TurboModule (zero/low-copy)
   - Expose native buffers / host objects directly into JS via JSI.
   - JS can access ArrayBuffer / typed arrays with fewer copies.
   - Best for very high-throughput (media processing, large buffers).

4) Shared DB / Native-cache + index
   - Store large blobs in native DB (SQLite/Realm/MMKV) and share ids with JS.
   - JS requests items by id (small metadata over bridge).

5) Offload heavy work to native and only pass references (IDs, paths)
   - Prefer passing references (IDs / URIs) across bridge, not raw bytes.
*/

/* ===========================================================================
📌 2. PATTERN: FILE-HANDOFF (detailed, cross-platform)
===============================================================================
Use when: images, video exports, large JSON exports, DB dumps.

Flow:
  1. Native produces file (temp path) — e.g., /data/user/... or NSTemporaryDirectory()/Caches.
  2. Native returns file path string to JS (single small bridge message).
  3. JS either:
     - Reads the file incrementally using RN file libs (react-native-fs / react-native-blob-util / rn-fetch-blob),
     - Or tells native to stream file into JS consumer (chunked) if needed,
     - Or passes path to a JS library that can consume file URI (upload to server).
  4. After use, JS calls native to delete file or native cleans up on schedule.

Benefits:
  - Minimal memory: JS doesn't hold whole payload in memory
  - Simple: small messages over bridge
  - Cross-platform: stable and easy to implement

Security:
  - Use app-specific cache directories
  - Set file permissions properly
  - Clean up after use to avoid disk growth
*/

/* ===========================================================================
📌 3. PATTERN: CHUNKED / STREAMING (event-based, producer pushes)
===============================================================================
Use when: generating/exporting large data progressively, streaming audio/frames.

Flow:
  - Native implements producer that emits chunk events (binary payloads or base64)
  - JS subscribes to events and writes to file or processes each chunk
  - Use a small fixed chunk size (e.g., 64KB-512KB)
  - Include sequence numbers and final/EOF event
  - Provide pause/resume and backpressure (consumer signals READY/PAUSE)

Important: never send giant base64 strings (bloat); prefer raw binary (ArrayBuffer) if possible.

JS-side consumer pattern (event emitter + file write) — example below.
*/

/* ===========================================================================
📌 4. PATTERN: PULL-BASED CHUNK API (consumer pulls next chunk)
===============================================================================
Use when: easier to control backpressure and retry.

Flow:
  - JS calls NativeModule.openStream(params) => returns streamId
  - JS calls NativeModule.readChunk(streamId, chunkSize) => Promise< { data: base64/ArrayBuffer, eof: bool } >
  - JS processes data and calls readChunk again until eof
  - JS calls NativeModule.closeStream(streamId) to free native resources

Benefits:
  - Consumer-driven — easier backpressure and flow-control
  - Simpler error handling & retryability
*/

/* ===========================================================================
📌 5. PATTERN: JSI / TURBOMODULE (zero-copy / low-copy)
===============================================================================
Use when: extremely high throughput or you need sync reads of native buffers.

Conceptual flow:
  - Implement a JSI host object that exposes methods returning ArrayBuffer views into native memory
  - JS can create a typed array that is a view on native memory; no big JSON serialization
  - Implement lifetime management: when JS drops reference, native can free buffer
  - Common use-cases: video frame buffers, audio samples, shared caches

Caveat:
  - Requires new architecture setup and native/C++ skills
  - Must carefully manage memory lifecycle and thread-safety
*/

/* ===========================================================================
📌 6. ANDROID IMPLEMENTATION NOTES
===============================================================================
Options:
  • File-hand off: write file into context.cacheDir or getCacheDir() and return path (content:// via FileProvider if needed for external apps).
  • Chunked: produce byte[] chunks; send via WritableMap with byte[]? Bridge doesn't handle raw binary well — use base64 or use react-native-blob-util which supports binary streams.
  • JSI: use Java/C++ with JNI to expose direct ByteBuffer or native memory that can be wrapped as ArrayBuffer in JS (requires Hermes/JSC/JSI integration).
Important:
  - Avoid sending large Java byte[] across bridge — copying cost high.
  - Prefer returning file path or use mmap/ByteBuffer + JSI for low-copy.
  - Execute heavy work on background thread (Executors) and not on UI thread.
*/

/* ===========================================================================
📌 7. iOS IMPLEMENTATION NOTES
===============================================================================
Options:
  • File-hand off: write to NSTemporaryDirectory() or Caches; return file:// path or local URI.
  • Chunked: stream NSData chunks via event emitter (but prefer binary buffers: send as ArrayBuffer if using JSI).
  • JSI: implement host object in C++/Objective-C++ to expose NSData-backed ArrayBuffer to JS.
Important:
  - Avoid copying large NSData into bridge messages.
  - Use NSFileHandle / InputStream for efficient streaming.
  - Run heavy tasks off main thread (DispatchQueue.global()).
*/

/* ===========================================================================
📌 8. PRACTICAL: JS CHUNK CONSUMER (pull API pattern)
===============================================================================
Assumes native module methods:
  - LargeData.openStream(params) => Promise<streamId>
  - LargeData.readChunk(streamId, requestedSize) => Promise<{ base64: string, eof: boolean }>
  - LargeData.closeStream(streamId) => Promise<void>

Example JS wrapper that writes to file using react-native-fs (pseudo code).
*/

import { NativeModules, NativeEventEmitter } from "react-native";
import RNFS from "react-native-fs"; // install if using file-hand off

const { LargeData } = NativeModules; // native module stub

export async function streamToFile(params, destPath) {
  const streamId = await LargeData.openStream(params);
  const writerPath =
    destPath || `${RNFS.CachesDirectoryPath}/large_${Date.now()}.bin`;
  const fd = await RNFS.open(writerPath, "w"); // pseudo API; react-native-fs has writeFile/appendFile methods

  try {
    while (true) {
      const { base64, eof } = await LargeData.readChunk(streamId, 256 * 1024); // 256KB
      if (base64 && base64.length) {
        // append chunk to file (binary)
        await RNFS.appendFile(writerPath, base64, "base64");
      }
      if (eof) break;
    }
  } finally {
    await LargeData.closeStream(streamId);
    // close fd if needed
  }

  return writerPath; // return file path for further use (upload, processing)
}

/* ===========================================================================
📌 9. PRACTICAL: JS PUSH CONSUMER (event emitter push API)
===============================================================================
Assumes native emits events: 'LargeDataChunk' with { streamId, seq, base64, eof }
and 'LargeDataProgress' events.

Below is a consumer that subscribes and writes chunks until EOF.
*/

export function consumeStreamWithEvents(streamId, onProgress) {
  const emitter = new NativeEventEmitter(LargeData);
  const writePath = `${RNFS.CachesDirectoryPath}/event_${streamId}.bin`;
  let seqExpected = 0;

  const chunkSub = emitter.addListener("LargeDataChunk", async (payload) => {
    if (payload.streamId !== streamId) return;
    // simple sequence check
    if (payload.seq !== seqExpected) {
      // handle out-of-order (buffer or request resend) — depends on native contract
    }
    seqExpected += 1;
    await RNFS.appendFile(writePath, payload.base64, "base64");
    onProgress?.(payload.bytesReceived, payload.totalBytes);
    if (payload.eof) {
      chunkSub.remove();
      // finalize
    }
  });

  return {
    stop: () => chunkSub.remove(),
    path: writePath,
  };
}

/* ===========================================================================
📌 10. EXAMPLE: FILE-PUSH FROM JS TO NATIVE (JS uploads big file to native for processing)
===============================================================================
When JS needs to send a big file to native (e.g., for native-only encryption):
  - Use RNFS to get local file path
  - Call NativeModule.processFile(filePath) — single bridge call with small string
Advantages:
  - Very efficient; native handles file read natively
  - No big copies over bridge
*/

/* ===========================================================================
📌 11. BACKPRESSURE & FLOW CONTROL (rules)
===============================================================================
• Prefer pull-style APIs when consumer speed varies.
• For push/event style, support native pause/resume signals:
    - JS sends READY signal when it can accept more
    - Native pauses emission if consumer not READY
• Ensure queueing limits on native side to avoid OOM.
• Implement chunk size negotiation (consumer requests chunkSize).
• Use sequence numbers and checksums for integrity.
*/

/* ===========================================================================
📌 12. MEMORY & GC CONSIDERATIONS (best practices)
===============================================================================
• Avoid holding entire payload in JS memory — stream to file or process incremental chunks.
• Reuse buffers where possible on native side.
• Use typed arrays/ArrayBuffer with JSI to reduce copy churn (advanced).
• Avoid base64 if binary transfer APIs exist (base64 increases size ~33%).
• Clean up temp files promptly to keep disk usage bounded.
*/

/* ===========================================================================
📌 13. ERROR HANDLING & RESUMPTION
===============================================================================
• Support resuming from offset (native maintains cursor or accepts offset param)
• On transient errors, retry with exponential backoff
• On permanent errors, fail fast and surface meaningful error codes
• Emit "progress", "error", "complete" events for robust UX
*/

/* ===========================================================================
📌 14. TESTING STRATEGY
===============================================================================
• Unit test JS wrappers with mocked NativeModules
• Integration test with instrumentation builds that create predictable large payloads
• Use CI to run stress tests: multiple concurrent streams, high chunk rates
• Profile memory & CPU on devices (Android Profiler, iOS Instruments)
• Validate cleanup (temp files removed) after success & failure
*/

/* ===========================================================================
📌 15. SECURITY & PRIVACY
===============================================================================
• Store temp files in app-private directories (not world-readable)
• Encrypt files at rest if data is sensitive (use platform crypto APIs)
• Limit lifetime of temp files and delete on completion
• Validate input params from JS to native to avoid path traversal or injection
*/

/* ===========================================================================
📌 16. WHEN TO CHOOSE EACH APPROACH (cheat quick)
===============================================================================
• Simple big payloads to be uploaded/downloaded → file-hand off (fastest to implement)
• Progressive generation (e.g., export CSV) → chunked/push with events OR pull
• High-throughput media frames → JSI/TurboModule + shared buffers
• Many small objects → pagination + DB-based sync (send small metadata only)
• Two-way streaming (bi-directional) → design stream protocol (IDs, seq, ack)
*/

/* ===========================================================================
📌 17. INTERVIEW Q&A
===============================================================================
Q1: Why not send a massive object over the React Native bridge?
A: Bridge serialization copies and serializes data, causing CPU, memory, and GC pressure — leads to jank.

Q2: How to transfer a 200MB file from native to RN efficiently?
A: Native writes file to cache and returns file path to JS; JS consumes via streaming library or uploads directly from file path.

Q3: What's the benefit of JSI/TurboModule for big data?
A: It allows exposing native buffers or host objects directly to JS (typed arrays) with minimal copying — best for high-throughput/low-latency needs.

Q4: How do you implement backpressure?
A: Prefer pull APIs or implement READY/PAUSE signalling where consumer notifies producer when ready for next chunk.

Q5: How to ensure you don't leak storage?
A: Native or JS must delete temp files after processing; include cleanup hooks and periodic GC if needed.
*/

/* ===========================================================================
📌 18. QUICK SAMPLE ARCHITECTURE (summary)
===============================================================================
Native Producer (writes file or provides stream)
    ↓ (single small message: file path OR streamId)
JS Consumer (streamToFile/consumeStreamWithEvents) -> process/upload
Control plane: progress events, pause/resume, error handling
Optional optimizations: JSI host object + typed arrays for zero-copy access
*/

/* ===========================================================================
📌 19. REFERENCE JS UTILITIES (copy/paste)
===============================================================================
// small helper: base64 to ArrayBuffer (if needed)
export function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

/* ===========================================================================
📌 20. FINAL CHECKLIST BEFORE BUILDING
===============================================================================
✔ Choose reference-passing (path/id) over payload-passing for very large data
✔ Provide consumer-driven (pull) APIs for backpressure
✔ Use file-hand off for easiest cross-platform path
✔ Use chunk sizes between 64KB–512KB for streaming
✔ Avoid base64 when binary streaming is available; base64 only if necessary
✔ Run stress tests to find OOM or GC issues early
✔ Secure & cleanup temp files; handle resume & retries
✔ Consider JSI/TurboModule only when required (higher complexity)
*/

/* ===========================================================================
📌 21. WANT NEXT?
===============================================================================
I can produce (single-file JS Notes):
  ✅ Android Kotlin sample native module implementing pull-based stream (full code)
  ✅ iOS Swift sample using NSInputStream + event emitter chunk examples
  ✅ Conceptual JSI example (C++ outline + JS usage) showing exposing ArrayBuffer
  ✅ End-to-end demo: native generator → JS streaming upload to server + resume support

Pick one and I will return it in this same JS Notes format.
*/
