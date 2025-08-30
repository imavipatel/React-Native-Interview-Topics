/* =============================================================================
📘 Offloading to JSI / Worker Threads in React Native
============================================================================= */

/*
🟢 Introduction
-----------------------------------------------------------------------------
- React Native runs JS on a **single thread** (the JS thread).
- Heavy computations (loops, JSON parsing, encryption, image processing, etc.)
  can block this thread → UI freezes.
- Solution: Offload work to **JSI (JavaScript Interface)** or **Worker Threads**.
- Goal: Free up JS thread for UI while running heavy logic elsewhere.
*/

/* =============================================================================
🔹 1. What is JSI?
-----------------------------------------------------------------------------
- JSI = JavaScript Interface (introduced in RN 0.63+).
- A lightweight layer that allows JS and C++/Native to talk directly.
- Replaces the old **Bridge** (which was async and slow).
- Enables **synchronous** calls between JS and Native.
- Allows building **high-performance libraries** (e.g., Reanimated 2, MMKV).

✅ Benefits of JSI:
- Much faster than Bridge-based communication.
- Can access native code directly (C++/Java/Obj-C/Swift).
- Enables multithreading & background execution.
- Needed for modern libs like Reanimated 2, VisionCamera, MMKV.
*/

/* =============================================================================
🔹 2. Worker Threads in React Native
-----------------------------------------------------------------------------
- Worker threads = separate JS execution environments.
- Similar to Web Workers in browser, but for React Native.
- Allow running heavy JS tasks **off the main JS thread**.

✅ Libraries:
- react-native-threads
- react-native-multithreading
- react-native-workers (older)

✅ Use cases:
- Parsing large JSON files
- Doing math-heavy computations (crypto, ML)
- File compression / decompression
- Handling offline queueing logic
*/

/* =============================================================================
🔹 3. Example – Worker Thread
-----------------------------------------------------------------------------
📌 Using `react-native-threads`

import { Thread } from 'react-native-threads';

// Create a worker thread
const worker = new Thread('./worker.js');

// Listen for messages from worker
worker.onmessage = (message) => {
  console.log('Message from worker:', message);
};

// Send message to worker
worker.postMessage('Start heavy task');

// Terminate when done
worker.terminate();

📌 worker.js
---------------------------------
import { self } from 'react-native-threads';

self.onmessage = (message) => {
  if (message === 'Start heavy task') {
    let sum = 0;
    for (let i = 0; i < 1e8; i++) {
      sum += i;
    }
    self.postMessage(`Result: ${sum}`);
  }
};
*/

/* =============================================================================
🔹 4. Example – Offloading with JSI
-----------------------------------------------------------------------------
- With JSI, you can write C++/Native functions and expose them to JS.

📌 Example (simplified C++ JSI binding):

// mymodule.cpp
#include "jsi/jsi.h"
using namespace facebook::jsi;

void install(Runtime& rt) {
  auto add = Function::createFromHostFunction(
    rt,
    PropNameID::forAscii(rt, "addNumbers"),
    2,
    [](Runtime& rt, const Value& thisVal, const Value* args, size_t count) -> Value {
      double a = args[0].asNumber();
      double b = args[1].asNumber();
      return Value(a + b);
    }
  );

  rt.global().setProperty(rt, "addNumbers", move(add));
}

Now in JS (React Native):
console.log(global.addNumbers(5, 10)); // 15
*/

/* =============================================================================
🔹 5. JSI vs Worker Threads
-----------------------------------------------------------------------------
| Feature                | JSI                                   | Worker Threads            |
|------------------------|---------------------------------------|---------------------------|
| Where it runs          | Native (C++/Java/Swift/Obj-C)         | Separate JS thread        |
| Performance            | Super fast (native speed)             | Slower than JSI but still better than main JS thread |
| Use cases              | Native storage (MMKV), animations     | Heavy JS computations     |
| Communication          | Direct sync JS ↔ Native               | Async message passing     |
| Setup complexity       | High (requires native code knowledge) | Medium (JS only)          |
*/

/* =============================================================================
🔹 6. Best Practices
-----------------------------------------------------------------------------
✅ Use JSI when:
   - You need **maximum performance**.
   - Logic is suitable for native implementation (e.g., storage, crypto, ML).
   - You want to avoid the RN Bridge completely.

✅ Use Worker Threads when:
   - Heavy computation can still be done in JS.
   - You don’t want to write native code.
   - Tasks like JSON parsing, math loops, or queueing offline requests.

✅ Combine both:
   - Workers for JS-heavy logic.
   - JSI for native-level optimizations.
*/

/* =============================================================================
🔹 7. Q&A (Interview Style)
-----------------------------------------------------------------------------
Q1: Why can’t we just run everything in JS thread?
   → Because JS thread also handles UI; blocking it freezes the app.

Q2: When would you prefer JSI over Workers?
   → When performance is critical and task maps well to native (e.g., MMKV storage).

Q3: Is JSI synchronous or asynchronous?
   → JSI enables **synchronous calls** between JS and native.

Q4: Can Worker Threads access React Native APIs directly?
   → No, they run in isolated JS context → communicate via messages.
*/

/* =============================================================================
✅ Final Takeaway
-----------------------------------------------------------------------------
- Use **Worker Threads** for offloading JS tasks.
- Use **JSI** for super-fast native performance and direct JS-native calls.
- Together, they help keep JS thread free → smoother UI & better performance.
============================================================================= */
