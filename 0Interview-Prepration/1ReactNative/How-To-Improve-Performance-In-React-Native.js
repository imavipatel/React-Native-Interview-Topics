/**
 * react-native-performance-improvement-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES (Beginner Friendly)
 *
 * "How to Improve Performance in React Native"
 *
 * This file contains:
 *  ✔ Simple explanation of why performance problems happen
 *  ✔ Easy + practical ways to improve RN performance
 *  ✔ State management strategies
 *  ✔ Rendering optimization
 *  ✔ List performance (FlatList optimization)
 *  ✔ Navigation optimization
 *  ✔ Networking and memory improvements
 *  ✔ Production-level performance tips
 *  ✔ Interview Q&A + cheat-sheet
 *
 * Everything is explained in very easy, beginner-friendly language.
 */

/* ===========================================================================
📌 0. WHY PERFORMANCE CAN BE SLOW IN REACT NATIVE
===============================================================================
React Native performance problems usually happen because:

✔ JS thread is busy (too many calculations, loops, heavy work)  
✔ Too many re-renders (state updates everywhere)  
✔ Large lists without optimization  
✔ Images too big or not cached  
✔ Navigation transitions heavy  
✔ Layout has too many nested Views  
✔ Unoptimized animations  
✔ Naive API calls or slow network logic  
✔ Memory leaks or event listeners not removed  

Good news → RN gives many tools to fix this.
*/

/* ===========================================================================
📌 1. BIGGEST PERFORMANCE RULE:
===============================================================================
⭐⭐⭐⭐⭐  
👉 **“Avoid unnecessary re-renders.”**  
⭐⭐⭐⭐⭐

Most performance issues come from components re-rendering when they don’t need to.

We handle this with tools like:
✔ React.memo  
✔ useMemo  
✔ useCallback  
✔ Zustand / Jotai / Redux Toolkit selectors  

Start with this mindset:  
**“Only re-render what is required.”**
*/

/* ===========================================================================
📌 2. USE React.memo (simple)
===============================================================================
React.memo prevents a component from re-rendering unless its props change.

Example:
*/
const UserCard = React.memo(function UserCard({ name }) {
  return <Text>{name}</Text>;
});

/*
Use memo for:
✔ Reusable list items  
✔ Heavy components  
But don’t overuse it.  
*/

/* ===========================================================================
📌 3. USE useCallback & useMemo (easy explanation)
===============================================================================
useCallback → memoizes functions  
useMemo → memoizes calculated values  

Use them when:
✔ You pass functions to React.memo components  
✔ You do heavy calculations  

Example:
*/
const filtered = useMemo(() => items.filter((x) => x.active), [items]);

/* ===========================================================================
📌 4. FLATLIST PERFORMANCE (VERY IMPORTANT)
===============================================================================
Large lists are the #1 source of performance issues.

Use these props:
*/
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  initialNumToRender={10}
  windowSize={5}
  maxToRenderPerBatch={10}
  removeClippedSubviews={true}
  getItemLayout={(data, index) => ({
    length: 60,
    offset: 60 * index,
    index,
  })}
/>;

/*
EXPLANATION (simple):
✔ getItemLayout → improves scroll speed  
✔ initialNumToRender → reduces initial work  
✔ windowSize → controls how many screens of rows stay mounted  
✔ removeClippedSubviews → unmounts rows not visible  
✔ Always memoize your RenderItem  
*/

/* Memoized renderItem */
const renderItem = useCallback(({ item }) => {
  return <ListItem item={item} />;
}, []);

/* ===========================================================================
📌 5. AVOID HEAVY WORK ON JS THREAD
===============================================================================
The JS thread is responsible for:
✔ Running your JS code  
✔ Calling native modules  
✔ Handling gestures  
✔ Updating UI (via Fabric/Bridge)  

If JS thread is busy → UI freezes.

Avoid:
❌ Large loops  
❌ Heavy JSON parsing  
❌ Complex calculations  
❌ Blocking code  
❌ Using await inside UI render  

To fix:
✔ Move heavy work to background (use react-native-blob-util, TurboModules, JSI)
✔ Use InteractionManager.runAfterInteractions for post-render work  
✔ Use debounce/throttle on onChangeText  
*/

/* ===========================================================================
📌 6. USE BETTER STATE MANAGEMENT (simple logic)
===============================================================================
Too much global state → too many components re-render.

Best choices for performance:
✔ Zustand → very fast, minimal re-renders  
✔ Jotai → atoms update only what is needed  
✔ Redux Toolkit + selectors → better than context for heavy UI  
✔ Recoil → good granularity  

Avoid:
❌ Putting large objects in Context API  
❌ Updating global state too much  
*/

/* ===========================================================================
📌 7. USE PROPER IMAGE OPTIMIZATION
===============================================================================
Images can slow down app if too large.

Tips:
✔ Use correct resolution images  
✔ Prefer WebP (Android)  
✔ Use react-native-fast-image (supports caching & decoding optimization)  
✔ Lazy-load heavy images  
✔ Avoid PNG when JPG works  
✔ Resize server-side if possible  
*/

/* ===========================================================================
📌 8. REDUCE COMPONENT NESTING
===============================================================================
Too many nested <View> wrappers create heavy layout calculations.

Tips:
✔ Keep layout simple  
✔ Reduce nested flexboxes  
✔ Avoid unnecessary wrappers  
✔ Use StyleSheet.create for static styles  
*/

/* ===========================================================================
📌 9. OPTIMIZE NAVIGATION
===============================================================================
React Navigation can re-render screens often.

Improve performance:
✔ Use native-stack (react-native-screens & native transitions)  
✔ Use React.memo on screen components  
✔ Avoid passing large params through navigation  
✔ Use screenOptions only when needed  
✔ Keep screens lightweight  
*/

/* ===========================================================================
📌 10. OPTIMIZE ANIMATIONS
===============================================================================
Unoptimized animations = lag & frame drops.

Use:
✔ react-native-reanimated (works on UI thread)  
✔ Gesture Handler for smooth gestures  
✔ Layout animations on Fabric (new architecture)  

Avoid:
❌ Animations running on JS thread  
❌ setInterval-based animations  
*/

/* ===========================================================================
📌 11. PREVENT MEMORY LEAKS
===============================================================================
Memory leak = app keeps objects in memory even after screen unmounts.

Avoid:
❌ Not removing event listeners  
❌ Unfinished timers (setInterval, setTimeout)  
❌ Abandoned API calls  

Fix:
*/
useEffect(() => {
  const sub = DeviceEventEmitter.addListener("EVENT", () => {});
  return () => sub.remove(); // cleanup
});

/*
Always clear:
✔ Listeners  
✔ Subscriptions  
✔ Timers  
✔ Intervals  
✔ Background tasks  
*/

/* ===========================================================================
📌 12. USE HERMES ENGINE (OPTIONAL BUT GOOD)
===============================================================================
Hermes improves:
✔ Smaller JS bundle  
✔ Faster startup  
✔ Better memory usage  
✔ Better GC  

Enable Hermes in RN 0.70+ using default settings.
*/

/* ===========================================================================
📌 13. SPLIT CODE & LAZY LOAD HEAVY FEATURES
===============================================================================
Don’t load everything at startup.

Example:
*/
const ProfileScreen = React.lazy(() => import("./ProfileScreen"));

/*
✔ Faster app startup  
✔ Load only screens user opens  
*/

/* ===========================================================================
📌 14. CLEAN UP UNUSED LIBRARIES
===============================================================================
Every extra npm package:
✔ Adds weight to JS bundle  
✔ Increases startup  
✔ Might add native code  

Remove:
❌ Unused UI libraries  
❌ Large date libraries (use dayjs instead of moment)  
❌ Large Lodash imports (use lodash/debounce instead of full lodash)  

Keep your app “lightweight”.
*/

/* ===========================================================================
📌 15. NETWORK PERFORMANCE
===============================================================================
✔ Debounce API calls  
✔ Cache responses (SWR, React Query)  
✔ Use pagination for large lists  
✔ Preload data in background  
✔ Avoid making API calls inside render  
✔ Combine multiple small API calls into one  
*/

/* ===========================================================================
📌 16. TURN ON INLINE REQUIRES
===============================================================================
This improves startup by loading modules only when needed.

metro.config.js:

transformer: {
  getTransformOptions: async () => ({
    transform: { inlineRequires: true },
  }),
},

/* ===========================================================================
📌 17. PRODUCTION OPTIMIZATION
===============================================================================
✔ Minify and shrink bundle  
✔ Enable Hermes  
✔ Enable ProGuard/R8 (Android)  
✔ Optimize assets  
✔ Remove Flipper and dev-only tools in release  
✔ Use bundle analyzer to find heavy modules  
*/

/* ===========================================================================
📌 18. INTERVIEW Q&A (BEGINNER-FRIENDLY)
===============================================================================
Q1: What is the best way to improve performance in RN?
A: Avoid unnecessary re-renders using React.memo, useCallback, useMemo.

Q2: How do you optimize large lists?
A: Use FlatList with windowSize, getItemLayout, memoized renderItem.

Q3: Why are animations slow sometimes?
A: Because they run on JS thread. Use Reanimated to run animations on UI thread.

Q4: How to improve startup time?
A: Inline requires, Hermes, lazy-load heavy screens, reduce bundle size.

Q5: What causes memory leaks?
A: Forgetting to remove listeners, timers, or cancel API calls.

Q6: How do you optimize images?
A: Compress them, use proper formats, and use react-native-fast-image.

Q7: How do you reduce JS thread work?
A: Move heavy calculations to background threads using JSI/TurboModules.
*/

/* ===========================================================================
📌 19. FINAL CHEAT-SHEET (1 MINUTE)
===============================================================================
⭐ Use React.memo, useCallback, useMemo  
⭐ Optimize FlatList (VERY important)  
⭐ Minimize JS thread blocking  
⭐ Use Reanimated for animations  
⭐ Optimize images + assets  
⭐ Reduce component nesting  
⭐ Use native-stack navigation  
⭐ Clean memory leaks (timers, listeners)  
⭐ Enable Hermes + inlineRequires  
⭐ Lazy load big screens  
⭐ Remove unused libraries  
*/

/* ===========================================================================
📌 20. WANT NEXT?
===============================================================================
I can create beginner-friendly notes for:
  ✅ How to debug performance with Flipper & Hermes profiler  
  ✅ How React Native handles threading (JS thread, UI thread)  
  ✅ How Fabric improves performance  
  ✅ How to measure FPS, memory, and bundle size

Just tell me!
*/
