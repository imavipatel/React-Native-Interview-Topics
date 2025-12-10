/**
 * react-native-memory-leaks-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES: "How React Native handles memory leaks & prevention"
 * - Plain-language explanation of why leaks happen in RN (JS + native)
 * - Common leak patterns (timers, listeners, closures, native modules, images)
 * - Detection tools & techniques (Flipper, Instruments, Android Profiler, Heap snapshots)
 * - Practical prevention patterns + utility hooks (runnable examples)
 * - Native-module considerations & migration notes
 *
 * Paste into your notes repo — use as interview cheat-sheet and practical reference.
 */

/* ===========================================================================
📌 0. BIG PICTURE — simple answer
===============================================================================
A memory leak happens when your app keeps references to objects that are no longer
needed, preventing the JS or native garbage collector from freeing memory. In React
Native leaks can occur on both sides:
  • JS-side leaks (closures, timers, listeners, unremoved callbacks, large retained arrays)
  • Native-side leaks (native modules, views not released, unmanaged native caches)
Prevent leaks by removing references and cleaning up resources when components unmount
or when work completes.
*/

/* ===========================================================================
📌 1. WHY LEAKS HAPPEN — root causes (plain language)
===============================================================================
• Timers & intervals left running (setInterval, setTimeout, requestAnimationFrame)
• Event listeners / subscriptions not removed (DeviceEventEmitter, BackHandler, NetInfo)
• Async operations finishing after unmount and calling setState
• Large closures keeping references to big objects (arrays, images)
• Global caches or singletons that keep growing
• Native resources not released (camera, sensors, observers, context)
• Improper use of refs that hold large DOM-like trees or image buffers
• Third-party libs that allocate native resources but don't clean up
*/

/* ===========================================================================
📌 2. COMMON PATTERNS (what to watch for)
===============================================================================
• setInterval / setTimeout without clearInterval / clearTimeout
• EventEmitter.addListener without removeListener / off
• fetch/Promises that update state after unmount
• Animated.timing / Animated.loop not stopped on unmount
• Navigation listeners (addListener) not removed
• Persisting huge arrays in component scope or in closures
• Native callbacks (callbacks passed to native modules) not unregistered
*/

/* ===========================================================================
📌 3. HOW TO DETECT LEAKS — tools & workflow
===============================================================================
JS SIDE:
  - Flipper (React DevTools, plugin memory): inspect component tree & snapshots.
  - Chrome DevTools (Remote JS Debugging) — Heap snapshot (only when JS runs in Chrome).
  - Hermes heap snapshots (if using Hermes — snapshot tooling available).
  - console.count / logging to spot growing counts.

NATIVE SIDE:
  - iOS: Xcode Instruments (Allocations, Leaks, Time Profiler, VM Tracker).
  - Android: Android Studio Profiler (Memory, Allocation tracker); LeakCanary (Android).
  - Capture heap dumps and compare over time (before/after navigation).

WORKFLOW:
  1. Reproduce suspected leak scenario (open/close screen multiple times).
  2. Run memory profiler, take snapshots across iterations.
  3. Compare retained object counts & types.
  4. Inspect stack traces / dominators to find who holds reference.
*/

/* ===========================================================================
📌 4. JS-SIDE PREVENTION — rules of thumb
===============================================================================
• Remove subscriptions/listeners in cleanup (useEffect return, componentWillUnmount).
• Cancel or ignore async results after unmount (AbortController or isMounted flag).
• Clear timers, animation loops, RAF on unmount.
• Avoid storing large data in component scope; use pagination / virtualization.
• Use WeakMap/WeakRef for caches where appropriate (experimental).
• Prefer purely functional stateless spec where possible; free references quickly.
• Use FlatList with getItemLayout and proper keyExtractor to avoid item retention.
• Avoid creating new functions/objects inside render that keep references alive — memoize.
*/

/* ===========================================================================
📌 5. PRACTICAL PATTERNS & HOOKS (copyable code)
===============================================================================
1) Safe useEffect cleanup for listeners and timers (functional component)
*/
import React, { useEffect, useRef, useState } from "react";
import { BackHandler, DeviceEventEmitter } from "react-native";

// Example: cleanup listeners & timer
export function LeakSafeScreen() {
  const [count, setCount] = useState(0);
  const intervalRef = (useRef < number) | (null > null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    // mark mounted
    isMountedRef.current = true;

    // add native event listener
    const sub = DeviceEventEmitter.addListener("myEvent", () => {
      if (isMountedRef.current) {
        // safe update
        setCount((c) => c + 1);
      }
    });

    // back handler example
    const backSub = BackHandler.addEventListener("hardwareBackPress", () => {
      // handle
      return true;
    });

    // timer example
    intervalRef.current = global.setInterval(() => {
      if (isMountedRef.current) setCount((c) => c + 1);
    }, 1000);

    return () => {
      // cleanup: remove listeners & timer
      sub.remove?.(); // DeviceEventEmitter or EventEmitter APIs vary
      backSub.remove();
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current);
      }
      // mark unmounted
      isMountedRef.current = false;
    };
  }, []);

  return null; // UI omitted for brevity
}

/* ===========================================================================
2) Abortable fetch to avoid updating after unmount
*/
export function useAbortableFetch(url) {
  const abortRef = (useRef < AbortController) | (null > null);

  useEffect(() => {
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    (async () => {
      try {
        const res = await fetch(url, { signal });
        const json = await res.json();
        // update state only if not aborted (caller checks)
      } catch (err) {
        if (err.name === "AbortError") {
          // request canceled
        } else {
          // other error
        }
      }
    })();

    return () => {
      abortRef.current?.abort();
    };
  }, [url]);
}

/* ===========================================================================
3) Prevent setState after unmount (useIsMounted hook)
*/
export function useIsMounted() {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return isMounted;
}

/* ===========================================================================
4) Safe interval hook (auto cleanup)
*/
export function useInterval(callback, delay) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay == null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

/* ===========================================================================
5) Example: stop animation on unmount
*/
import { Animated } from "react-native";
export function useAnimatedValue() {
  const value = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(value, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
    return () => {
      // stop animation to avoid retain
      value.stopAnimation?.();
      anim?.stop?.();
    };
  }, [value]);
  return value;
}

/* ===========================================================================
📌 6. CLASS COMPONENTS — cleanup in componentWillUnmount
===============================================================================
class OldScreen extends React.Component {
  interval = null;
  subscription = null;

  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener('ev', this.onEv);
    this.interval = setInterval(() => {... }, 1000);
  }

  componentWillUnmount() {
    this.subscription?.remove?.();
    clearInterval(this.interval);
  }
}

/* ===========================================================================
📌 7. NAVIGATION LISTENERS — remove on cleanup / use hooks from nav
===============================================================================
• react-navigation: useFocusEffect or navigation.addListener returns unsubscribe

import { useFocusEffect } from '@react-navigation/native';
useFocusEffect(
  React.useCallback(() => {
    const sub = someEmitter.addListener(...);
    return () => sub.remove?.();
  }, [])
);
*/

/* ===========================================================================
📌 8. NATIVE-MODULES & NATIVE-LEAKS (what to check)
===============================================================================
• Native modules may allocate resources (camera sessions, C++ objects, observers)
• Ensure native modules expose a "remove"/"destroy"/"invalidate" you call on unmount
• If you register native callbacks, unregister them on cleanup
• For iOS: check strong reference cycles (retain cycles) in Obj-C / Swift => use weak refs in delegates
• For Android: unregister BroadcastReceivers, listeners, and avoid static references to Context
• If using custom native view managers, release bitmaps and listeners in onDropViewInstance
*/

/* ===========================================================================
📌 9. IMAGES & LARGE ASSETS — avoid retaining big buffers
===============================================================================
• Use progressive / optimized image libraries (react-native-fast-image)
• Release or replace large bitmaps; on Android free bitmaps if explicitly allocated
• Avoid keeping large base64 strings in state or props — stream / use caching
• Use smaller thumbnails and lazy-load full images on demand
*/

/* ===========================================================================
📌 10. CACHING STRATEGIES (safe caching)
===============================================================================
• Use LRU cache with max size (avoid infinite growth)
• Use libraries that expose cleanup APIs
• Persist only necessary data; clear caches when user logs out or memory pressure occurs
• Consider WeakMap for ephemeral caches when supported
*/

/* ===========================================================================
📌 11. DETECTION EXAMPLES — what to look for in profiler
===============================================================================
• Increasing retained JS heap size after repeated navigation loops
• Growing number of mounted components or listeners in Flipper/React DevTools
• Native memory (RAM) increasing after repeated open/close of screens
• Dominator trees showing unexpected roots holding objects (e.g., closures referencing screens)
*/

/* ===========================================================================
📌 12. DEBUGGING CHECKLIST (step-by-step)
===============================================================================
1) Reproduce: open/close screen multiple times
2) Use flipper/xcode/android profiler; take heap snapshots iteratively
3) Look for objects that grow (listeners, timers, caches)
4) Inspect who retains them (dominator path)
5) Add missing cleanup in useEffect/componentWillUnmount
6) Re-test until heap stabilizes
*/

/* ===========================================================================
📌 13. NEW ARCHITECTURE (Fabric/JSI) — anything changed for leaks?
===============================================================================
• JSI allows native objects to be referenced from JS directly — be careful:
    - Holding long-lived references to native host objects will keep native memory alive
• TurboModules may expose synchronous native handles — ensure modules provide teardown APIs
• Same rules apply: unregister, release, and avoid global long-lived references
*/

/* ===========================================================================
📌 14. SAMPLE "LEAK CHECK" UTILITY (quick dev helper)
===============================================================================
export function countListeners(emitter, eventName) {
  // many emitter APIs don't expose count; this is illustrative only
  // for EventEmitter from 'events' you can inspect emitter.listenerCount(event)
  // For DeviceEventEmitter you may need to track adds/removes manually in dev builds.
  return emitter.listenerCount?.(eventName) ?? -1;
}

/* ===========================================================================
📌 15. INTERVIEW Q&A (short answers)
===============================================================================
Q1: What commonly causes RN memory leaks?
A: Timers, listeners, un-cancelled async ops, retained closures, native modules not released.

Q2: How to avoid setState after unmount?
A: Use AbortController for fetch, or isMounted ref (useIsMounted), or cancel promises.

Q3: Tools to detect leaks?
A: Flipper, Xcode Instruments (Allocations/Leaks), Android Profiler, Hermes heap snapshots.

Q4: How to handle native callbacks?
A: Native modules should provide unregister/destroy methods and on native side avoid strong retain cycles.

Q5: Are leaks more harmful on JS or native side?
A: Both matter. Native leaks impact overall app memory (OOM). JS leaks increase JS heap and may cause GC pauses or native memory retained via host objects.
*/

/* ===========================================================================
📌 16. QUICK CHEAT-SHEET (actionable)
===============================================================================
• Always cleanup listeners/timers in effect cleanup or componentWillUnmount.
• Abort fetches on unmount (AbortController).
• Stop animations & remove RAF on unmount.
• Unregister native callbacks & destroy native resources.
• Use profiling tools to find retained objects and dominators.
• Limit global caches and prefer size-bounded caches (LRU).
• On new architecture: avoid keeping long-lived JSI host object refs unless needed.
*/

/* ===========================================================================
📌 17. NEXT STEPS / OPTIONAL EXTRAS I CAN PREP FOR YOU
===============================================================================
  ✅ Utility hooks bundle: useIsMounted, useAbortableFetch, useEventListener, useInterval
  ✅ Sample native-module teardown example (Android + iOS pseudocode)
  ✅ Step-by-step Instruments & Android Profiler guide for RN app (with screenshots)
  ✅ Checklist for auditing third-party libs for leaks

Tell me which one and I'll return it in this same single-file JS Notes format.
*/
