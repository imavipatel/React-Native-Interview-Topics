/**
 * react-native-performance-caching-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES (Beginner Friendly)
 *
 * "How I would implement caching, API optimization, and lazy loading
 *  in a React Native project to improve app loading time and performance"
 *
 * - Very simple language for beginners
 * - Full coverage: caching layers, HTTP optimizations, data fetching patterns,
 *   code-splitting & lazy loading, assets & images, list virtualization,
 *   startup optimizations, examples, checklist, tests, and interview Q&A
 * - Everything in one file (single-file JS notes)
 */

/* ===========================================================================
📌 0. SHORT GOAL (one-line)
===============================================================================
Make the app load faster and run smoother by reducing work at startup, avoiding
unnecessary network calls, and loading only what’s needed when it’s needed.
*/

/* ===========================================================================
📌 1. HIGH-LEVEL STRATEGY (very simple)
===============================================================================
1) Cache data close to where it’s used (memory first, then on-disk).  
2) Make network calls smaller and fewer (pagination, conditional requests).  
3) Load code & assets lazily (split work across time).  
4) Optimize lists, images, and heavy components.  
5) Measure often and iterate (profiling matters).
*/

/* ===========================================================================
📌 2. CACHING LAYERS (concept)
===============================================================================
- **In-memory cache**: fastest — short-lived (app life). Good for access token, UI state.
- **Persistent local cache**: MMKV / AsyncStorage / SQLite / Realm — survives restarts.
- **HTTP cache**: server-driven via Cache-Control, ETag, Last-Modified, and conditional requests.
- **CDN & edge cache**: cache static assets near users (images, bundles).
- **Query cache libraries**: react-query / SWR — combine memory + persistence + stale-while-revalidate.
*/

/* ===========================================================================
📌 3. WHEN TO CACHE (simple rules)
===============================================================================
✔ Cache data that changes rarely (user profile, app config).  
✔ Cache list pages / paginated results for offline UX.  
✔ Cache images and assets.  
✔ Don’t cache highly sensitive secrets unencrypted.  
✔ Use short TTLs for volatile data and longer TTLs for stable data.
*/

/* ===========================================================================
📌 4. LIBRARIES / TOOLS I RECOMMEND
===============================================================================
- react-query (TanStack Query) — great for caching, background refresh, retries  
- redux-persist (MMKV) — persist Redux state (small, safe slices)  
- react-native-mmkv — fast on-disk key-value storage  
- react-native-fast-image — image caching & priority loading  
- axios + cache adapter (axios-cache-adapter) — basic HTTP caching client-side  
- SQLite / Realm — stable persistent cache for larger datasets
*/

/* ===========================================================================
📌 5. EXAMPLE: react-query SETUP (cache-first + stale-while-revalidate)
===============================================================================
- react-query gives in-memory cache, background refetch, retries, offline support.
- Add persistence adapter (react-query + MMKV) for restart persistence.
*/

// install: yarn add @tanstack/react-query @tanstack/react-query-persist-client react-native-mmkv

import React from "react";
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from "@tanstack/react-query";
import { persister } from "@tanstack/react-query-persist-client"; // conceptual
import { MMKV } from "react-native-mmkv";

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30s stale
      cacheTime: 1000 * 60 * 60, // 1 hour in-memory
      retry: 1,
      refetchOnWindowFocus: false, // mobile doesn't need frequent refetch by default
    },
  },
});

// Simple MMKV-backed persister (conceptual — implement using official adapter)
const storage = new MMKV({ id: "rn-query-cache" });
// persister setup example (use library adapters in real app)
async function setupQueryPersistence() {
  // await persistQueryClient({ queryClient, persister: createMMKVPersister(storage) });
}

// Wrap app once (AppRoot)
export function AppRoot({ App }) {
  React.useEffect(() => {
    setupQueryPersistence();
    // hook focusManager for app foreground background
    const onAppStateChange = (state) => {
      focusManager.setFocused(state === "active");
    };
    // add listener...
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

/* ===========================================================================
📌 6. DATA-FETCH PATTERNS (simple)
===============================================================================
- Use **stale-while-revalidate**: show cached data immediately, update in background.
- Use **pagination / infinite scroll** for lists (fetch only pages needed).
- Use **conditional queries** for heavy endpoints (only run when screen visible).
- Use **optimistic updates** for quick UI on mutations (then rollback on failure).
*/

/* ===========================================================================
📌 7. HTTP OPTIMIZATIONS (server + client)
===============================================================================
Server-side (ask backend team):
  ✔ Provide Cache-Control headers (max-age, s-maxage for CDN).  
  ✔ Support ETag / Last-Modified for conditional GET (If-None-Match).  
  ✔ Provide lightweight endpoints for list metadata (IDs) and fetch details only when needed.  
  ✔ Enable compression (gzip / brotli).  
  ✔ Use pagination & partial responses (fields selection).  

Client-side:
  ✔ Use conditional requests (send If-None-Match).  
  ✔ Respect 304 Not Modified (don’t re-download body).  
  ✔ Use cache adapter or react-query to reuse responses.  
*/

/* ===========================================================================
📌 8. EXAMPLE: axios + cache adapter (simple)
===============================================================================
/* yarn add axios axios-cache-adapter */
import axios from "axios";
import { setupCache } from "axios-cache-adapter";

// setup cache (memory + optionally persistent store)
const apiCache = setupCache({
  maxAge: 15 * 60 * 1000, // 15 minutes
  // store: some persistent adapter if you want cross-session caching
});

export const cachedApi = axios.create({
  baseURL: "https://api.example.com",
  adapter: apiCache.adapter,
});

// Usage: cachedApi.get('/config') will be cached for 15 minutes

/* ===========================================================================
📌 9. PAGINATION & INFINITE SCROLL (best practices)
===============================================================================
- Load small page sizes (e.g., 20 items).  
- Use cursor-based pagination for large datasets.  
- Render using FlatList with virtualization (see section 12).  
- Cache previous pages so user can scroll back offline.  
- Preload next page when user is near bottom (threshold).
*/

/* ===========================================================================
📌 10. LAZY LOADING & CODE SPLITTING (React Native specifics)
===============================================================================
- Use React.lazy() and dynamic import() for big screens/components.
- Use inline-requires and RAM bundles / Hermes to reduce main-thread startup cost.
- Use conditional imports for heavy libs (e.g., charts, maps).
- Defer non-critical initialization until after first render / splash screen.

Example: lazy load heavy screen
*/
import React, { Suspense } from "react";
const HeavyScreen = React.lazy(() => import("./HeavyScreen"));

export function AppNavigator() {
  return (
    // show lightweight loader while screen code loads
    <Suspense fallback={<Loading />}>
      {/* navigation code that renders HeavyScreen when needed */}
    </Suspense>
  );
}

/*
React Native note:
- React.lazy works, but bundler behavior differs from web. Use inline-requires in Metro config:
  // metro.config.js (concept)
  // transformer: { getTransformOptions: async () => ({ transform: { inlineRequires: true } }) }
- Inline requires move module initialization to first use, helping startup.
*/

/* ===========================================================================
📌 11. ASSET & IMAGE OPTIMIZATIONS
===============================================================================
- Use react-native-fast-image for caching and priority loading.
- Use prefetch() for images you know the user will need soon.
- Serve scaled images from server (don't ship huge images and scale at device).
- Use vector icons for UI icons instead of many bitmap images.

Example: prefetch & priority
*/
import FastImage from "react-native-fast-image";

FastImage.preload([{ uri: "https://cdn.example.com/hero@2x.jpg" }]);

export function Avatar({ uri, size = 40 }) {
  return (
    <FastImage
      source={{ uri, priority: FastImage.priority.normal }}
      style={{ width: size, height: size, borderRadius: size / 2 }}
    />
  );
}

/* ===========================================================================
📌 12. LIST VIRTUALIZATION (FlatList / SectionList)
===============================================================================
- Use FlatList for long lists — it renders only visible rows.
- Provide keyExtractor, getItemLayout, initialNumToRender, windowSize, removeClippedSubviews.
- Use pure components or React.memo for row items.
- Avoid heavy inline styles in renderItem.

Example FlatList optimizations:
*/
import React, { memo } from "react";
import { FlatList, View, Text } from "react-native";

const Row = memo(({ item }) => (
  <View style={{ height: 72, padding: 12 }}>
    <Text numberOfLines={1}>{item.title}</Text>
  </View>
));

export function MyList({ data }) {
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <Row item={item} />}
      keyExtractor={(i) => i.id}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={7}
      getItemLayout={(_, index) => ({ length: 72, offset: 72 * index, index })}
      removeClippedSubviews
    />
  );
}

/* ===========================================================================
📌 13. STARTUP OPTIMIZATIONS (cold start)
===============================================================================
- Enable Hermes (faster JS startup & lower memory).  
- Use Inline Requires in Metro to delay module execution until used.  
- Minimize work in root component (avoid heavy synchronous code in App.tsx).  
- Defer analytics, feature flag fetches, DB migrations to background tasks after first render.  
- Reduce JS bundle size: remove unused libs, enable ProGuard/R8 for native code.  
*/

/* ===========================================================================
📌 14. BACKGROUND PREFETCH & SCHEDULING
===============================================================================
- Prefetch likely data after app becomes idle or on splash screen (low priority).  
- Use InteractionManager.runAfterInteractions to schedule non-urgent work.  
- Use background sync (WorkManager / BGTasks) to refresh caches when app is backgrounded/connected.
*/

/* ===========================================================================
📌 15. OFFLINE STRATEGIES
===============================================================================
- Cache last-successful results and show to user when offline.  
- Implement queue for offline mutations (retry when online).  
- Show clear "stale" indicators when showing cached data older than TTL.
*/

/* ===========================================================================
📌 16. METRICS & MEASUREMENT (what to measure)
===============================================================================
Measure and track:
  ✔ Cold start time (ms)  
  ✔ Time to first meaningful paint / Time to interactive  
  ✔ API latency & cache hit ratios  
  ✔ Bundle size (JS bytes) and native binary size  
  ✔ Memory usage and frame drops (FPS)  
  ✔ Number of HTTP requests on startup  
Use tools: Flipper, Android Profiler, Xcode Instruments, Sentry performance.
*/

/* ===========================================================================
📌 17. SAMPLE PATTERNS (quick recipes)
===============================================================================
A) Fast app shell + lazy home data:
  - Show minimal skeleton UI from local assets immediately
  - Kick async fetch for home data, show cached data if available, then refresh

B) Paginated feed + cache:
  - Use react-query to cache pages; store pages in MMKV for restart

C) Large screen / charts:
  - Dynamically import chart library when user opens analytics screen

D) Large images:
  - Serve resized images from CDN, prefetch thumbnails, replace with full image on demand
*/

/* ===========================================================================
📌 18. CODE EXAMPLE: lightweight bootstrap + background prefetch
===============================================================================
import { InteractionManager } from 'react-native';

export function AppBootstrap() {
  React.useEffect(() => {
    // Minimal startup: render UI quickly
    // After first frame, schedule background jobs
    InteractionManager.runAfterInteractions(() => {
      // prefetch config, user data, images
      queryClient.prefetchQuery(['config'], fetchConfig);
      FastImage.preload([{ uri: 'https://cdn.example.com/hero-thumb.jpg' }]);
      // run DB migrations or heavy setup here
    });
  }, []);

  return <AppRootComponent />;
}

/* ===========================================================================
📌 19. COMMON MISTAKES TO AVOID
===============================================================================
✘ Running many network calls at app start  
✘ Blocking UI with synchronous DB work or heavy loops  
✘ Caching everything forever (no TTL)  
✘ Using AsyncStorage for high-frequency small reads — prefer MMKV  
✘ Recomputing large arrays on every render (memoize heavy calculations)
*/

/* ===========================================================================
📌 20. SECURITY NOTES (caching + privacy)
===============================================================================
- Do not cache sensitive tokens in plain disk (use Keychain/Keystore).  
- Encrypt on-disk caches if they hold PII (SQLCipher, encrypted MMKV).  
- Respect user privacy: allow opt-outs for caching/analytics if required.
*/

/* ===========================================================================
📌 21. TESTING (basic ideas)
===============================================================================
Unit tests:
  - mock caches and ensure TTL logic works
  - test optimistic update rollback

Integration:
  - simulate offline + cached data flow

E2E:
  - measure time to first meaningful paint before & after optimizations
  - ensure lazy-loaded screens load correctly on tap

Performance tests:
  - run on low-end device/emulator and compare frame-rates and startup times
*/

/* ===========================================================================
📌 22. CHECKLIST — QUICK (apply before release)
===============================================================================
✔ Enable Hermes and inline requires for faster startup  
✔ Use react-query / caching with sensible staleTime & cacheTime  
✔ Use MMKV for persistent cache (fast reads)  
✔ Implement server-side Cache-Control & ETag support  
✔ Optimize images on CDN and use FastImage with preload  
✔ Virtualize lists with FlatList & getItemLayout  
✔ Lazy-load heavy screens & libraries with dynamic import / inline requires  
✔ Defer non-critical work with InteractionManager.runAfterInteractions  
✔ Measure cold start and TTFMP, iterate on biggest wins
*/

/* ===========================================================================
📌 23. INTERVIEW Q&A (BEGINNER-FRIENDLY)
===============================================================================
Q1: What is stale-while-revalidate?  
A: Serve cached data immediately (stale) and refresh it in background; UI is fast and data is updated soon after.

Q2: When should you persist cache to disk?  
A: When you want data to survive app restarts (e.g., profile, last feed pages) or to provide offline UX.

Q3: Why use MMKV over AsyncStorage?  
A: MMKV is much faster for frequent reads/writes and better suited for caching.

Q4: What is Inline Requires in Metro?  
A: A transformer option that delays module initialization until the module is first required — helps reduce startup work.

Q5: How do you optimize FlatList performance?  
A: Provide stable keys, getItemLayout, set initialNumToRender, use windowSize, memoize row components, and avoid heavy inline styles.
*/

/* ===========================================================================
📌 24. FINAL CHEAT-SHEET (ONE-PAGE)
===============================================================================
1) Cache near the client: memory → MMKV → disk.  
2) Use react-query for smart cache + background refresh.  
3) Server: ETag, Cache-Control, pagination, small responses.  
4) Lazy-load heavy screens & libraries with dynamic imports + inlineRequires.  
5) Optimize images & prefetch. Use FastImage.  
6) Virtualize lists, memoize rows, provide getItemLayout.  
7) Defer non-critical work (InteractionManager).  
8) Measure & profile — fix biggest bottlenecks first.
*/

/* ===========================================================================
📌 25. WANT NEXT?
===============================================================================
I can produce in the same single-file JS notes format:
  ✅ Full react-query + MMKV persistence exact implementation (code + metro config)  
  ✅ Example: axios + ETag conditional request server-client flow with backend pseudo-code  
  ✅ Deep dive: startup optimization checklist (Hermes, inlineRequires, bundle splitting)
Pick one and I’ll produce it in this same beginner-friendly single-file JS Notes style.
*/
