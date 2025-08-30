/**
 * ==============================================================
 * 📘 Offline-First & Caching Strategies in React/React Native
 * ==============================================================
 * (With Comparison Table)
 *
 * 🟢 What is Offline-First?
 * --------------------------------------------------------------
 * - Offline-first means building apps that **work even without internet**.
 * - Data is served from cache/storage first → then synced with server.
 * - Improves:
 *    ✅ User experience (no blank screens on poor network).
 *    ✅ Performance (faster load times).
 *    ✅ Reliability (app remains usable offline).
 *
 * ==============================================================
 * 🔹 Why is it Important?
 * --------------------------------------------------------------
 * - Mobile users often face unstable networks.
 * - Offline-first ensures:
 *    - App loads instantly with cached data.
 *    - Changes made offline sync automatically once internet is back.
 *
 * ==============================================================
 * 🔹 Caching Strategies – Comparison Table
 * --------------------------------------------------------------
 *
 * | Strategy                | How it Works                                       | Best For                  | Drawbacks                         |
 * |-------------------------|---------------------------------------------------|---------------------------|-----------------------------------|
 * | Cache-First             | Load from cache → fallback to network              | Static data (articles)    | Might show stale data              |
 * | Network-First           | Fetch network → fallback to cache                  | Dynamic data (chat)       | Slower if network is poor          |
 * | Stale-While-Revalidate  | Show cache instantly, update in background         | Feeds, product lists      | May briefly show old data          |
 * | Cache-Only              | Always serve from cache                           | Offline-only apps         | Never updates unless manual sync   |
 * | Network-Only            | Always fetch fresh data                           | Rare cases (real-time apps)| Doesn’t work offline               |
 *
 * ==============================================================
 * 🔹 Common Tools & Storage Options
 * --------------------------------------------------------------
 * - **AsyncStorage**: Basic key-value store (React Native).
 * - **redux-persist**: Persists Redux state to storage.
 * - **MMKV**: Super-fast storage (React Native).
 * - **React Query / SWR**: Handle caching, revalidation, retries.
 * - **Service Workers** (Web): For offline caching (PWA).
 *
 * ==============================================================
 * 🔹 Example 1: Cache-First with AsyncStorage
 * --------------------------------------------------------------
 */
import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OfflineUser() {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      // Try cache first
      const cached = await AsyncStorage.getItem("user");
      if (cached) {
        setUser(JSON.parse(cached));
        console.log("✅ Loaded from cache");
      }

      // Fetch from API
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users/1"
      );
      const data = await response.json();

      setUser(data);
      await AsyncStorage.setItem("user", JSON.stringify(data));
      console.log("🌐 Updated from API");
    } catch (error) {
      console.log("⚠️ Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) return <Text>Loading...</Text>;
  return <Text>User: {user.name}</Text>;
}

/**
 * ==============================================================
 * 🔹 Example 2: React Query (Stale-While-Revalidate)
 * --------------------------------------------------------------
 */
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { View } from "react-native";

const queryClient = new QueryClient();

function Posts() {
  const { data, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      fetch("https://jsonplaceholder.typicode.com/posts").then((res) =>
        res.json()
      ),
    staleTime: 5000, // keep data fresh for 5s
    cacheTime: 1000 * 60 * 10, // cache for 10 minutes
  });

  if (isLoading) return <Text>Loading...</Text>;
  return (
    <View>
      {data.slice(0, 5).map((post) => (
        <Text key={post.id}>{post.title}</Text>
      ))}
    </View>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Posts />
    </QueryClientProvider>
  );
}

/**
 * ==============================================================
 * 🔹 Real-World Use Cases
 * --------------------------------------------------------------
 * ✅ Messaging apps → Show old messages instantly, sync new ones.
 * ✅ E-commerce → Product catalog loads instantly from cache.
 * ✅ News apps → Articles available offline.
 *
 * ==============================================================
 * 🔹 Best Practices
 * --------------------------------------------------------------
 * - Use **AsyncStorage/MMKV** for offline persistence.
 * - Use **React Query or SWR** for caching & background sync.
 * - Clear old cache periodically (avoid bloated storage).
 * - Design **sync strategies**:
 *   - Queue offline actions (e.g., send message later).
 *   - Mark unsynced changes until server confirms.
 *
 * ==============================================================
 * 🔹 Q&A (Interview Style)
 * --------------------------------------------------------------
 * Q1: What is offline-first?
 *   → Designing apps to work even without internet using cached data.
 *
 * Q2: Which strategy is best for news feeds?
 *   → Cache-first or SWR (show cached instantly, update later).
 *
 * Q3: How do you store offline data in React Native?
 *   → AsyncStorage, MMKV, or redux-persist.
 *
 * Q4: What happens when user updates data offline?
 *   → Save locally, mark as pending → sync with server when online.
 *
 * ==============================================================
 * ✅ Final Takeaways
 * --------------------------------------------------------------
 * - Offline-first makes apps **faster, reliable, and user-friendly**.
 * - Choose strategy: cache-first, network-first, or SWR depending on use case.
 * - Use tools: **AsyncStorage, React Query, SWR, MMKV**.
 * - Always handle sync & conflict resolution when user comes back online.
 * ==============================================================
 */
