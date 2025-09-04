/*
========================================
React Native Architecture – Bridge, Native Threads, JavaScript Thread
========================================
Goal: Understand in simple terms how React Native runs your code and updates the app.
Think of it like a play:
- JS Thread = Director (decides what happens).
- Bridge = Translator (passes instructions).
- Native Threads = Actors & Stage Crew (do the work on stage).
*/

/*
Mental Model (Classic Architecture)
---------------------------------
- **JavaScript Thread**: Runs your React code (setState, hooks, business logic). It’s single-threaded, so only one task can run at a time.
- **Bridge**: Acts like a mailbox system. Messages from JS are packaged, batched, and delivered to Native, and vice versa.
- **Native Threads**: Responsible for actual UI drawing, layout calculations, and background operations (like network, file handling).

Key point: If any piece takes too long (>16ms), the frame rate drops → janky animations.
*/

/*
1) JavaScript Thread (The Brain / Director)
-----------------------------------------
- Runs on its own thread inside the JS engine (Hermes or JSC).
- Executes React logic: components, setState, event handlers.
- It is **single-threaded**, meaning only one piece of work at a time.

Why important?
- All React updates and app logic live here.
- If blocked, the app feels frozen (gestures, taps won’t respond).

How it works:
1. You call setState or update props.
2. React reconciler calculates differences.
3. Update instructions are created.
4. Instructions are sent through the Bridge to Native.

Things that block JS thread:
- Long loops, heavy JSON parsing, big array processing, console.log spam.

Example: blocking vs non-blocking work
*/

// ❌ Bad: blocks JS thread for 500ms, UI freezes
function badLoop() {
  const start = Date.now();
  while (Date.now() - start < 500) {}
}

// ✅ Good: split work so UI can still update
async function chunkedWork(items, chunk = 200) {
  for (let i = 0; i < items.length; i += chunk) {
    items.slice(i, i + chunk).forEach(doSomething);
    await new Promise(requestAnimationFrame); // yield back to UI
  }
}

/* Extra Theory:
- The JS thread has its own queue of tasks.
- Each task runs fully before the next one starts (event loop model).
- React batches multiple state updates together to reduce work.
- If a task takes too long, user input like scrolling will feel delayed.
*/

/*
2) Native Threads (The Muscles / Actors)
--------------------------------------
The Native side is multi-threaded. Different tasks are split across threads so heavy work doesn’t block the UI.

Main Threads:
- **UI Thread**: Handles drawing, rendering, and touch input.
- **Shadow Thread**: Calculates layout (sizes & positions) using Yoga layout engine.
- **Background Threads**: Handle networking, file access, image decoding, etc.

Why important?
- Separation ensures UI can remain smooth even if JS is busy.
- Heavy tasks (like image decoding) won’t freeze animations.

How it works step-by-step:
1. JS sends instructions (e.g., create a <Button>).
2. Native builds a shadow tree (virtual layout structure).
3. Yoga (on Shadow thread) computes exact layout.
4. UI thread applies layout and updates the screen.

Extra Theory:
- Yoga is a C++ layout engine used by RN to calculate flexbox layouts.
- Splitting layout from drawing ensures UI thread doesn’t do heavy math.
- Native threads can also run parallel tasks (like image decoding in background).
*/

/*
3) The Bridge (The Translator / Mailbox)
---------------------------------------
- The Bridge connects JS world and Native world.
- Works by sending messages back and forth.
- Messages are batched (grouped together) and serialized (converted into JSON-like format).

Why important?
- JS and Native live in different worlds (different runtimes). They can’t call each other directly, so the Bridge helps them talk.
- Prevents crashes by keeping them separate.

How it works:
- JS → Native: Send commands like “create view”, “change style”, “call native function”.
- Native → JS: Send back events like “scroll happened” or “download progress”.

Problem:
- If too many messages cross the bridge (like 60 per second for animation), performance drops.
- Passing large data (e.g., huge arrays, images) is expensive due to serialization.

Example – Using a NativeModule
*/

import { NativeModules, NativeEventEmitter } from "react-native";
const { CryptoModule } = NativeModules;

// Call a native function from JS
async function hashFile(path) {
  const digest = await CryptoModule.sha256(path);
  return digest;
}

// Listen to events from Native
const emitter = new NativeEventEmitter(CryptoModule);
emitter.addListener("cryptoProgress", (pct) => {
  console.log("Progress", pct);
});

/* Extra Theory:
- Calls across the Bridge are always asynchronous (classic RN).
- That means JS cannot block waiting for native; it must use callbacks or promises.
- Events from Native arrive back in JS through event emitters.
*/

/*
Render Pipeline (Step by Step Recap)
-----------------------------------
1. User taps → event captured by UI thread.
2. Event is sent to JS thread.
3. JS thread runs handler (setState).
4. React calculates what changed.
5. Update instructions sent via Bridge.
6. Shadow thread calculates new layout.
7. UI thread applies layout and updates view hierarchy.
8. GPU draws frame on screen.
*/

/*
Performance Tips (Classic RN)
----------------------------
- Don’t call native functions every frame.
- Avoid big loops on JS thread.
- Use FlatList with windowing for long lists.
- Offload heavy tasks to native or background.
- Profile performance with Flipper.
*/

/*
New Architecture (Modern RN)
---------------------------
React Native now has a faster system that removes the old Bridge.
- **JSI (JavaScript Interface)**: Direct communication between JS and Native (C++ layer). Faster, can be synchronous.
- **TurboModules**: Next-gen NativeModules, typed and faster.
- **Fabric**: New renderer that synchronizes better with React concurrent rendering.

Why better?
- No need to serialize data to JSON.
- Can call native functions directly from JS.
- Much lower overhead, smoother animations.

Example – TurboModule usage
*/

import { TurboModuleRegistry } from "react-native";

// type CryptoSpec = {
//   sha256(path: string): Promise<string>,
// };
console.log(Crypto);

const Crypto = TurboModuleRegistry.get < CryptoSpec > "Crypto";
const digest = await Crypto?.sha256("/path/to/file");

/* Extra Theory:
- JSI allows creating HostObjects in C++ that JS can use directly.
- TurboModules are defined with TypeScript interfaces → codegen creates native bindings.
- Fabric replaces old UIManager with a more efficient rendering system.
*/

/*
Quick Comparisons
----------------
- Bridge vs JSI → Bridge = slow (JSON messages), JSI = direct and fast.
- JS Thread vs UI Thread → JS = logic, UI = drawing & input.
- Shadow Thread → calculates layout with Yoga.
- Jank → happens when work takes longer than 16ms.
*/

/*
Cheat Sheet
-----------
- **JS Thread** = brain. Runs logic, must stay free.
- **Bridge** = translator. Async + batched messages.
- **Native Threads** = muscles. Do layout & drawing.
- **Performance Rule** = finish tasks <16ms.
- **New Arch** = JSI + TurboModules + Fabric = faster, smoother.
*/
