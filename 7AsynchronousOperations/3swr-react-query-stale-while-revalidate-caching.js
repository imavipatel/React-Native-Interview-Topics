/**
 * ==============================================================
 * 📘 SWR & React Query – Stale-While-Revalidate, Caching Techniques
 * ==============================================================
 *
 * 🟢 Why Do We Need Libraries Like SWR / React Query?
 * --------------------------------------------------------------
 * - Data fetching is one of the most common tasks in React / React Native apps.
 * - If we just use `fetch` or `axios` in `useEffect`:
 *      - We need to manage loading, error, and caching manually.
 *      - No auto-refresh when data changes.
 *      - No deduplication (same request may fire multiple times).
 *      - Hard to handle "background refreshing".
 * - SWR and React Query solve these problems with **caching, stale data handling,
 *   background revalidation, and performance optimizations**.
 *
 * ==============================================================
 * 🔹 SWR (by Vercel)
 * ==============================================================
 * - SWR = "Stale-While-Revalidate".
 * - Idea: Show **cached (stale)** data immediately, then **revalidate** (fetch new)
 *   data in the background, and update UI when fresh data arrives.
 * - Benefits:
 *    ✅ Faster UI – instant data from cache
 *    ✅ Always fresh – background fetch keeps data updated
 *    ✅ Automatic caching & deduplication
 *    ✅ Supports polling, focus revalidation, etc.
 *
 * Example (React Native with SWR):
 */
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

function UserProfile() {
  const { data, error, isLoading } = useSWR(
    "https://jsonplaceholder.typicode.com/users/1",
    fetcher
  );

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading</Text>;

  return <Text>User: {data.name}</Text>;
}

/**
 * How SWR works:
 * - When component mounts:
 *   1. Shows cached data immediately (if available).
 *   2. Starts fetching fresh data in background.
 *   3. Updates UI automatically when new data arrives.
 *
 * - It also revalidates when:
 *   - Window regains focus
 *   - Interval polling is set
 *   - You manually trigger `mutate()` to refresh
 *
 * ==============================================================
 * 🔹 React Query (TanStack Query)
 * ==============================================================
 * - Full-featured data-fetching library.
 * - Provides hooks (`useQuery`, `useMutation`) to fetch, cache, and sync data.
 * - More powerful than SWR for complex apps.
 * - Features:
 *    ✅ Query caching & deduplication
 *    ✅ Stale-While-Revalidate pattern
 *    ✅ Background updates & retries
 *    ✅ Pagination, infinite scroll
 *    ✅ Mutations (POST/PUT/DELETE with auto-cache update)
 *    ✅ DevTools for debugging
 *
 * Example (React Native with React Query):
 */
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { Text } from "react-native";

const queryClient = new QueryClient();

function Posts() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      fetch("https://jsonplaceholder.typicode.com/posts").then((res) =>
        res.json()
      ),
  });

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error!</Text>;

  return <Text>Posts count: {data.length}</Text>;
}

// Wrap App with QueryClientProvider
/*
<QueryClientProvider client={queryClient}>
   <Posts />
</QueryClientProvider>
*/

/**
 * ==============================================================
 * 🔹 SWR vs React Query – Comparison
 * ==============================================================
 *
 * | Feature                    | SWR                           | React Query (TanStack)      |
 * |----------------------------|-------------------------------|-----------------------------|
 * | Library size               | Small, lightweight            | Bigger, full-featured       |
 * | Main idea                  | Stale-While-Revalidate        | Queries + Mutations manager |
 * | Caching                    | Automatic, simple             | Automatic, advanced         |
 * | Mutations (POST/PUT/DEL)   | Basic (manual)                | Full-featured, built-in     |
 * | DevTools                   | No                            | Yes (React Query DevTools)  |
 * | Best for                   | Simple API fetching           | Large apps, complex state   |
 * | Learning curve             | Easier                        | Medium                      |
 *
 * ==============================================================
 * 🔹 Caching Techniques (How They Work)
 * ==============================================================
 * 1️⃣ Stale-While-Revalidate
 *    - Serve cached data instantly.
 *    - Fetch fresh data in background.
 *    - Update cache + UI automatically.
 *
 * 2️⃣ Time-based Stale Timeout
 *    - Data is considered "fresh" for X seconds.
 *    - After that, it's marked "stale" and revalidated.
 *
 * 3️⃣ Deduplication
 *    - If multiple components request the same data at the same time,
 *      only one network request is fired. Others share the result.
 *
 * 4️⃣ Background Refresh
 *    - Auto-refresh data when app gains focus or after a set interval.
 *
 * ==============================================================
 * 🔹 Q&A (Interview Style)
 * ==============================================================
 * Q1: What is "stale-while-revalidate"?
 *   → Show cached (possibly stale) data immediately and re-fetch in the background.
 *
 * Q2: When to use SWR vs React Query?
 *   → SWR for simple apps, React Query for complex apps with mutations/pagination.
 *
 * Q3: How do these libraries improve performance?
 *   → By caching results, deduplicating requests, and refreshing in background,
 *     reducing unnecessary network calls.
 *
 * ==============================================================
 * ✅ Final Takeaways
 * --------------------------------------------------------------
 * - SWR = lightweight, simple caching & revalidation.
 * - React Query = powerful, enterprise-ready data fetching & caching.
 * - Both follow **stale-while-revalidate** for fast + fresh UI.
 * - Greatly simplify async state management compared to manual `useEffect`.
 * ==============================================================
 */
