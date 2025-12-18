/**
 * react-native-pagination-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES (Beginner Friendly)
 * "How I would implement pagination in React Native"
 *
 * - Simple language, beginner friendly
 * - Covers strategies: offset, cursor, keyset
 * - Practical examples: FlatList infinite scroll (REST), GraphQL (Apollo), React Query
 * - UX: pull-to-refresh, loading footer, error handling
 * - Performance tips (getItemLayout, windowSize, batching)
 * - Interview Q&A + quick cheat-sheet
 *
 * Copy into your notes repo and adapt to your codebase.
 */

/* ===========================================================================
📌 0. WHY PAGINATION?
===============================================================================
When a list can be large (hundreds or thousands of items), do NOT load all at once.
Pagination helps by:
  ✔ Reducing network data (load chunk by chunk)
  ✔ Reducing memory and CPU work on device
  ✔ Making UI faster and snappier
  ✔ Enabling smooth scrolling and better UX
*/

/* ===========================================================================
📌 1. COMMON PAGINATION STRATEGIES (simple)
===============================================================================
1) Offset-based (page + limit)
   - Client asks "give me page=3, pageSize=20"
   - Server replies items and maybe total count
   - Easy but can be slow for large datasets or changing data

2) Cursor-based (recommended for APIs)
   - Server returns items + nextCursor (a token representing position)
   - Client asks "give me items after cursor=X"
   - Better for real-time data and stable paging

3) Keyset pagination (SQL style)
   - Use a value (e.g., createdAt or id) as a marker
   - Client asks "give items with createdAt < lastCreatedAt"
   - Very fast and stable for big tables

4) GraphQL cursors (Relay-style)
   - Similar to cursor-based. Common keys: edges, pageInfo { hasNextPage, endCursor }

CHOOSE:
  - Use cursor for most production APIs.
  - Use offset for simple internal or small-data lists.
*/

/* ===========================================================================
📌 2. USER EXPERIENCE PATTERNS
===============================================================================
• Infinite scroll (load more when user nears end)
• Pull-to-refresh (refresh list from top)
• Load more button (explicit user action)
• Pagination controls (pages numbers) — rare on mobile, better on web

Common UX pieces:
  - Loading initial state (spinner)
  - Loading more state (footer spinner)
  - Empty state (no items)
  - Error state (retry button)
  - Refresh state (pull-to-refresh)
*/

/* ===========================================================================
📌 3. FLATLIST INFINITE SCROLL (REST offset example)
===============================================================================
Key pieces:
  - data: array of items
  - onEndReached: called when list nears end
  - onEndReachedThreshold: fraction of list length (0.5 = halfway)
  - ListFooterComponent: show spinner while loading more
  - refreshControl / onRefresh: pull-to-refresh
  - keyExtractor: stable key
  - avoid multiple parallel requests (use flags)

Example (simple offset API):
*/

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Button,
} from "react-native";

// Fake API function (replace with real fetch/axios)
async function fetchItemsOffset({ page, pageSize = 20 }) {
  // Example response shape:
  // { items: [...], total: 500 }
  // Simulate network:
  await new Promise((r) => setTimeout(r, 600));
  const items = Array.from({ length: pageSize }, (_, i) => ({
    id: `item-${page * pageSize + i}`,
    title: `Item ${page * pageSize + i}`,
  }));
  return { items, total: 1000 }; // example total
}

export default function OffsetPaginationList() {
  const PAGE_SIZE = 20;

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0); // offset style: current page index
  const [total, setTotal] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const loadingMoreRef = useRef(false); // avoid double calls

  // Load first page
  const loadInitial = useCallback(async () => {
    setLoadingInitial(true);
    try {
      const res = await fetchItemsOffset({ page: 0, pageSize: PAGE_SIZE });
      setItems(res.items);
      setTotal(res.total);
      setPage(1); // next page to load
    } catch (e) {
      console.warn("loadInitial error", e);
    } finally {
      setLoadingInitial(false);
    }
  }, []);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  // Load more
  const loadMore = useCallback(async () => {
    if (loadingMoreRef.current) return;
    if (total !== null && items.length >= total) return; // no more
    loadingMoreRef.current = true;
    setLoadingMore(true);
    try {
      const res = await fetchItemsOffset({ page, pageSize: PAGE_SIZE });
      setItems((prev) => [...prev, ...res.items]);
      setPage((p) => p + 1);
    } catch (e) {
      console.warn("loadMore error", e);
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [items.length, page, total]);

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetchItemsOffset({ page: 0, pageSize: PAGE_SIZE });
      setItems(res.items);
      setTotal(res.total);
      setPage(1);
    } catch (e) {
      console.warn("refresh error", e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const renderItem = ({ item }) => (
    <View style={{ padding: 12, borderBottomWidth: 1, borderColor: "#eee" }}>
      <Text>{item.title}</Text>
    </View>
  );

  const keyExtractor = (item) => item.id;

  return (
    <View style={{ flex: 1 }}>
      {loadingInitial ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            loadingMore ? (
              <View style={{ padding: 12 }}>
                <ActivityIndicator />
              </View>
            ) : null
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

/* ===========================================================================
📌 4. CURSOR PAGINATION (recommended) — REST style
===============================================================================
API returns:
  { items: [...], nextCursor: 'abc123', hasMore: true }

Client stores nextCursor and asks for more with ?cursor=abc123.

Advantages:
  - Works well when data changes
  - More efficient for large sets

Example (conceptual):
*/

// Fake cursor API
async function fetchItemsCursor({ cursor = null, limit = 20 }) {
  await new Promise((r) => setTimeout(r, 500));
  const start = cursor ? Number(cursor) : 0;
  const items = Array.from({ length: limit }, (_, i) => ({
    id: `c-${start + i}`,
    title: `Cursor Item ${start + i}`,
  }));
  const nextCursor = String(start + limit);
  const hasMore = start + limit < 500;
  return { items, nextCursor: hasMore ? nextCursor : null, hasMore };
}

/* The UI code is similar to offset example, but track `nextCursor` instead of `page`. */

/* ===========================================================================
📌 5. GRAPHQL (Apollo) PAGINATION (cursor style)
===============================================================================
If you use Apollo and GraphQL, use cursor pagination and `fetchMore`.

Example query:
  query Feed($after: String, $first: Int) {
    feed(after: $after, first: $first) {
      edges { node { id title } cursor }
      pageInfo { hasNextPage endCursor }
    }
  }

Usage with hooks:
*/

import { gql, useQuery } from "@apollo/client";

const FEED_QUERY = gql`
  query Feed($after: String, $first: Int!) {
    feed(after: $after, first: $first) {
      edges {
        node {
          id
          title
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export function GraphQLFeed({ pageSize = 20 }) {
  const { data, loading, fetchMore, refetch } = useQuery(FEED_QUERY, {
    variables: { after: null, first: pageSize },
    notifyOnNetworkStatusChange: true,
  });

  const items = (data?.feed?.edges || []).map((e) => e.node);
  const pageInfo = data?.feed?.pageInfo || {};

  const loadMore = () => {
    if (pageInfo.hasNextPage) {
      fetchMore({
        variables: { after: pageInfo.endCursor, first: pageSize },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            feed: {
              ...fetchMoreResult.feed,
              edges: [...prev.feed.edges, ...fetchMoreResult.feed.edges],
            },
          };
        },
      });
    }
  };

  // Render similar to FlatList, using `items`
  return null; // UI omitted for brevity
}

/* ===========================================================================
📌 6. REACT QUERY / TANSTACK QUERY EXAMPLE
===============================================================================
React Query makes caching + fetching easier. Use `useInfiniteQuery` for pagination.
Basic idea:
  - call `fetchPage({ pageParam })`
  - it returns pages; you combine them into list
*/

import { useInfiniteQuery } from "@tanstack/react-query";

// Example fetch function for cursor:
async function fetchPage({ pageParam = null }) {
  return fetchItemsCursor({ cursor: pageParam, limit: 20 });
}

export function ReactQueryFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
  } = useInfiniteQuery(["feed"], fetchPage, {
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  });

  const items = data ? data.pages.flatMap((p) => p.items) : [];

  // UI: FlatList with onEndReached -> fetchNextPage()
  return null; // UI omitted for brevity
}

/* ===========================================================================
📌 7. IMPORTANT IMPLEMENTATION DETAILS & TIPS
===============================================================================
1) Prevent duplicate requests:
   - Use a flag (`loadingMoreRef`) to avoid parallel loads
2) Use `onEndReachedThreshold` carefully:
   - 0.5 means start loading earlier; tune it
3) Use `getItemLayout` if item heights are fixed:
   - improves scroll performance and jump-to-index
   Example:
     getItemLayout = (data, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })
4) Use stable `keyExtractor` (id string)
5) Use `initialNumToRender`, `windowSize`, `maxToRenderPerBatch` for FlatList tuning
6) Show ListFooterComponent spinner while loading more
7) For pull-to-refresh use RefreshControl
8) For small lists, offset is OK. For production lists prefer cursor/keyset.
9) For GraphQL use `fetchMore` or `relay` helpers; use `merge` cache policies for Apollo (typePolicies)
10) Combine pagination with caching: keep pages in cache to avoid refetch
11) Support offline/resume:
    - Save last cursor/page if you want to restore list position after app restart
12) Debounce user actions that re-trigger loads (search input, filters)
13) Use optimistic UI carefully (usually for create/delete, not for pagination fetch)
14) Avoid rendering huge number of items at once — use pagination + virtualization
*/

/* ===========================================================================
📌 8. PERFORMANCE SETTINGS FOR FlatList (recommended)
===============================================================================
<FlatList
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={7} // how many screens worth to keep rendered
  removeClippedSubviews={true} // on android can improve perf
  getItemLayout={getItemLayout} // if item size known
  updateCellsBatchingPeriod={50}
  keyExtractor={keyExtractor}
/>

/* ===========================================================================
📌 9. ERROR HANDLING & RETRIES
===============================================================================
• Show an inline error and a Retry button when load fails
• For transient network errors use retryWithBackoff (exponential + jitter)
• For 401 / auth errors, run token refresh flow and retry original request once
• Log failures and counts to telemetry (Sentry, analytics)
*/

/* ===========================================================================
📌 10. TESTING PAGINATION (what to test)
===============================================================================
• Unit: test fetch function maps response to model
• Integration: test list renders initial page and then loads more on end reached
• E2E: test end-to-end flow: initial load, scroll to bottom, load more, refresh
• Simulate slow network and errors (Network Link Conditioner, Charles)
*/

/* ===========================================================================
📌 11. SAMPLE CHECKLIST BEFORE SHIPPING
===============================================================================
✔ Use cursor paging for large production lists
✔ Prevent duplicate loads (loading flags)
✔ Show loading footer and empty state
✔ Implement pull-to-refresh
✔ Tune FlatList props for performance
✔ Add error handling & retry UI
✔ Add telemetry for page load times & failure rates
✔ Add tests for paging logic
*/

/* ===========================================================================
📌 12. INTERVIEW Q&A (short, simple)
===============================================================================
Q1: What is the best pagination type for mobile?
A: Cursor-based (or keyset) is the best for stability and large data.

Q2: How to trigger loading more in RN?
A: Use FlatList's onEndReached with a safe loading flag to avoid duplicate calls.

Q3: What is getItemLayout for?
A: It tells FlatList exact positions when items have fixed height. This makes scrolling and jumps faster.

Q4: How do you handle refresh?
A: Use RefreshControl on FlatList and re-fetch the first page.

Q5: How to avoid showing duplicate items?
A: Use stable ids, and on fetch merge new pages carefully (no duplicates). For GraphQL/Apollo, configure cache merging policies.
*/

/* ===========================================================================
📌 13. QUICK CHEAT-SHEET (one-minute)
===============================================================================
- Prefer cursor/keyset for production
- FlatList: onEndReached + ListFooterComponent spinner
- Use loading flags to avoid double requests
- Add pull-to-refresh with RefreshControl
- Use getItemLayout if item heights fixed
- Use React Query or Apollo to simplify caching & fetchMore
- Tune FlatList (windowSize, initialNumToRender)
- Test with slow network & add retries
*/

/* ===========================================================================
📌 14. WANT EXTRAS?
===============================================================================
I can generate (beginner friendly, single-file JS Notes):
  ✅ Full copy-paste template: Feature folder with repository + use-case + FlatList example
  ✅ Apollo InMemoryCache typePolicy example for cursor pagination (merge)
  ✅ React Query useInfiniteQuery complete example with FlatList
  ✅ End-to-end test example (Detox) for scrolling & load more

Tell me which one and I'll provide it in the same simple style.
*/
