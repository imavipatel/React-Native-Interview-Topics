/**
 * react-native-graphql-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES:
 * "What is GraphQL & How to use GraphQL in React Native"
 *
 * - Plain-language definition of GraphQL
 * - Comparison vs REST
 * - Clients: Apollo, Relay, urql (recommendations)
 * - Setup for React Native (Apollo example with cache persistence)
 * - Queries, Mutations, Subscriptions, Optimistic UI, Pagination
 * - File uploads, authentication, batching, persisted queries
 * - Offline strategies, caching policies, error handling, testing
 * - Codegen and TypeScript tips
 * - Interview Q&A + cheat-sheet
 *
 * Paste into your notes repo. Use it for interviews and implementation.
 */

/* ===========================================================================
📌 0. WHAT IS GRAPHQL? — plain language
===============================================================================
• GraphQL is a query language and runtime for APIs (originally by Facebook).
• Instead of many REST endpoints, the client sends queries that specify exactly
  which fields it needs. Server returns exactly that shape.
• Single endpoint (usually /graphql) handles queries (read), mutations (write),
  and subscriptions (real-time).
• Strongly typed schema (server provides types & operations) enabling tools,
  codegen and better DX.

Key benefits:
  - Fetch only what you need
  - Single query to get related nested data
  - Strong schema + introspection → codegen & editor autocomplete
  - Easier to evolve APIs without versioned endpoints

Tradeoffs:
  - More complex server and caching model
  - Overfetching can still occur if queries are large
  - Requires thinking about caching & normalization on client
*/

/* ===========================================================================
📌 1. GRAPHQL vs REST (quick)
===============================================================================
REST:
  - Multiple endpoints (GET /users, GET /users/:id/posts)
  - Over/under-fetching common
  - Caching via HTTP semantics

GraphQL:
  - Single endpoint; queries declare needed fields
  - Fine-grained data fetching; needs client-side cache normalization
  - Server resolves types and relationships
*/

/* ===========================================================================
📌 2. WHICH CLIENT TO USE (recommendation)
===============================================================================
• Apollo Client (most popular, rich feature set, caching, local state) — recommended for most RN apps.
• Relay (Facebook) — very performant, steep learning curve, excellent for large-scale apps with strict conventions.
• urql — lightweight & flexible, good if you want simpler footprint.
Choice depends on team familiarity, app complexity, and need for features like optimistic updates, offline, codegen.
*/

/* ===========================================================================
📌 3. APOLLO + REACT NATIVE — SETUP (practical example)
===============================================================================
This example shows:
  - ApolloClient with HTTP + WebSocket links
  - InMemoryCache with typePolicies for pagination
  - Persistent cache using apollo3-cache-persist (AsyncStorage or MMKV)
  - Auth header via async token getter (secure storage)
*/

/* ============================
   Install (notes)
   npm i @apollo/client graphql apollo3-cache-persist @react-native-async-storage/async-storage subscriptions-transport-ws ws
   // or use react-native-ws compatible libs for WebSocketLink (see your stack)
   ============================ */

import React, { useEffect } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistCache, AsyncStorageWrapper } from "apollo3-cache-persist";
// import * as Keychain from 'react-native-keychain'; // for secure token storage

// 1) HTTP link
const httpLink = createHttpLink({
  uri: "https://api.example.com/graphql",
});

// 2) WebSocket link for subscriptions (replace url with wss)
const wsLink = new WebSocketLink({
  uri: "wss://api.example.com/graphql",
  options: {
    reconnect: true,
    connectionParams: async () => {
      // Provide current auth token if needed
      const token = await getStoredAccessToken();
      return { headers: { Authorization: token ? `Bearer ${token}` : "" } };
    },
  },
});

// 3) Split link: send subscriptions to wsLink, others to httpLink
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

// 4) Auth middleware
const authLink = setContext(async (_, { headers }) => {
  const token = await getStoredAccessToken(); // implement secure retrieval
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
      "X-Client-Version": "1.0.0",
    },
  };
});

// 5) Cache config (with typePolicies for pagination)
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        feed: {
          keyArgs: false,
          merge(existing = { items: [] }, incoming, { args }) {
            // cursor-based pagination merge
            const items = existing.items ? existing.items.slice(0) : [];
            items.push(...incoming.items);
            return { ...incoming, items };
          },
        },
      },
    },
  },
});

// 6) Persist cache to AsyncStorage (cold start speed & offline)
async function createApolloClient() {
  await persistCache({
    cache,
    storage: new AsyncStorageWrapper(AsyncStorage),
    maxSize: false, // or set limit
  });

  const client = new ApolloClient({
    link: authLink.concat(splitLink),
    cache,
    connectToDevTools: true,
    defaultOptions: {
      watchQuery: { fetchPolicy: "cache-and-network", errorPolicy: "all" },
      query: { fetchPolicy: "network-only" },
    },
  });

  return client;
}

/* placeholder secure token getter — use Keychain / SecureStore */
async function getStoredAccessToken() {
  // const creds = await Keychain.getGenericPassword({ service: 'myapp-refresh' });
  // return creds?.password ?? null;
  return inMemoryAccessToken; // implement properly
}

/* ===========================================================================
📌 4. BASIC USAGE — queries & mutations (hooks)
===============================================================================
Use @apollo/client hooks inside components.

Example Query:
*/
import { gql, useQuery, useMutation, useSubscription } from "@apollo/client";

const FEED_QUERY = gql`
  query Feed($cursor: String) {
    feed(cursor: $cursor) {
      items {
        id
        title
        author {
          id
          name
        }
      }
      nextCursor
    }
  }
`;

export function FeedScreen() {
  const { data, loading, fetchMore, refetch } = useQuery(FEED_QUERY, {
    variables: { cursor: null },
    notifyOnNetworkStatusChange: true,
  });

  const loadMore = () => {
    if (!data?.feed?.nextCursor) return;
    fetchMore({ variables: { cursor: data.feed.nextCursor } });
  };

  // render list from data.feed.items
  return null;
}

/* Mutation with optimistic UI */
const LIKE_MUTATION = gql`
  mutation LikePost($id: ID!) {
    likePost(id: $id) {
      id
      likesCount
    }
  }
`;

export function PostActions({ post }) {
  const [likePost] = useMutation(LIKE_MUTATION, {
    optimisticResponse: {
      __typename: "Mutation",
      likePost: {
        __typename: "Post",
        id: post.id,
        likesCount: post.likesCount + 1,
      },
    },
    update(cache, { data: { likePost } }) {
      // update cache to reflect optimistic update / server result
      cache.modify({
        id: cache.identify({ __typename: "Post", id: post.id }),
        fields: {
          likesCount() {
            return likePost.likesCount;
          },
        },
      });
    },
  });

  return null;
}

/* Subscriptions */
const NEW_COMMENT_SUB = gql`
  subscription OnNewComment($postId: ID!) {
    commentAdded(postId: $postId) {
      id
      text
      author {
        id
        name
      }
    }
  }
`;

export function Comments({ postId }) {
  const { data } = useSubscription(NEW_COMMENT_SUB, { variables: { postId } });
  // append data.commentAdded to UI
  return null;
}

/* ===========================================================================
📌 5. PAGINATION PATTERNS
===============================================================================
• Cursor-based (preferred) — server returns nextCursor or cursor token
• Offset-based (less ideal for real-time)
• Use InMemoryCache typePolicies to merge pages
• Example: fetchMore + merge function (see cache.typePolicies above)
*/

/* ===========================================================================
📌 6. OPTIMISTIC UI & CACHE UPDATES
===============================================================================
• For snappy UX, apply optimisticResponse on mutations
• Update cache using cache.modify / cache.writeFragment / cache.writeQuery
• After server response, Apollo reconciles optimistic result with actual result
• Ensure consistent IDs / __typename so cache normalization works
*/

/* ===========================================================================
📌 7. FILE UPLOADS
===============================================================================
• Use apollo-upload-client or multipart form approach
• For React Native, use FormData + fetch or use upload link compatible with RN
• Example (fetch):
  const form = new FormData();
  form.append('operations', JSON.stringify({ query, variables }));
  form.append('map', JSON.stringify({ '0': ['variables.file'] }));
  form.append('0', { uri: fileUri, name: 'file.jpg', type: 'image/jpeg' });
  fetch('https://api.example.com/graphql', { method: 'POST', body: form, headers: { Authorization } });
*/

/* ===========================================================================
📌 8. AUTHENTICATION & TOKEN REFRESH (GraphQL context)
===============================================================================
• Send Authorization header in HTTP link (setContext)
• On 401, use refresh token mechanism (mutex) and retry requests
• For subscriptions, include token in connectionParams; on token refresh reopen WebSocket if required
• Prefer storing refresh token in secure store (Keychain/Keystore) and access token in-memory
*/

/* ===========================================================================
📌 9. OFFLINE & SYNC STRATEGIES
===============================================================================
Options:
• Cache persistence (apollo3-cache-persist) for reads when offline
• Persist queued mutations: store optimistic mutation actions in a queue and replay on reconnect
• Use background sync to flush mutation queue (WorkManager / BGTask)
• Use server-side conflict resolution strategies (versioning, last-write-wins, CRDT)
• Libraries like Apollo do not provide full offline mutation queue out-of-the-box; implement queue or use specialized libs (Realm Sync, Hasura with client integration)
Pattern:
  - Apply optimistic change locally (cache + local DB)
  - Enqueue mutation to persistent queue (SQLite)
  - On reconnect: replay mutations, reconcile server response with cache
*/

/* ===========================================================================
📌 10. ERROR HANDLING & RETRIES
===============================================================================
• Use Apollo link error (onError) to centralize error handling
• For transient network errors, implement retry link with exponential backoff
• For GraphQL errors (validation, auth), handle at UI level with user messages
• Log errors to Sentry/Telemetry but do not leak sensitive data
*/

/* ===========================================================================
📌 11. BATCHING & PERSISTED QUERIES
===============================================================================
• Batching: combine multiple queries into single HTTP request to reduce round-trips (apollo-link-batch-http)
• Persisted queries: send only query ID; server has query text mapped — reduces payload and some attacks
• Use with caution and coordinate server & client setup
*/

/* ===========================================================================
📌 12. CACHE NORMALIZATION & FRAGMENTS
===============================================================================
• Apollo normalizes cache by __typename + id (default id field: id)
• Use fragments to share selections and ensure consistent normalization
• Example fragment: fragment PostFields on Post { id title author { id name } }
• Use cache.identify and cache.modify for manual updates
*/

/* ===========================================================================
📌 13. CODEGEN & TYPES (TypeScript)
===============================================================================
• Use GraphQL Code Generator to generate:
  - Typed query/mutation hooks for Apollo
  - TypeScript types for schema & operations
• Benefits: compile-time safety, fewer runtime mistakes, better DX in large codebases
• Config: codegen.yml, use plugins: typescript, typescript-operations, typescript-react-apollo
*/

/* ===========================================================================
📌 14. SUBSCRIPTIONS & REAL-TIME
===============================================================================
• Use WebSocketLink or graphql-ws for subscriptions
• Consider performance: coalescing events, debouncing updates
• For large apps, ensure subscription auth & reconnection logic is robust
*/

/* ===========================================================================
📌 15. SECURITY CONSIDERATIONS
===============================================================================
• Validate inputs server-side (GraphQL schema validations)
• Implement depth/complexity limiting to prevent expensive queries (query complexity)
• Rate-limit endpoints & use persisted queries to prevent abuse
• Avoid exposing admin-level fields to public clients
• Use server-side authorization checks per resolver
*/

/* ===========================================================================
📌 16. TESTING STRATEGIES
===============================================================================
Unit:
  - Mock Apollo client with MockedProvider for unit tests of components
Integration:
  - Spin up a test GraphQL server (or use MSW / graphql-tools mock server)
E2E:
  - Use real API or test sandbox; verify offline/resumption behaviour
Snapshot:
  - Prefer data-level snapshots rather than large UI snapshots for queries
*/

/* ===========================================================================
📌 17. EXAMPLE: CENTRALIZED APOLLO PROVIDER (runnable skeleton)
===============================================================================
export default function AppRoot() {
  const [client, setClient] = React.useState(null);

  useEffect(() => {
    (async () => {
      const c = await createApolloClient();
      setClient(c);
    })();
  }, []);

  if (!client) return null; // or loading

  return (
    <ApolloProvider client={client}>
      {/* rest of your app }
    </ApolloProvider>
  );
}
*/

/* ===========================================================================
📌 18. RELAY (brief mention)
===============================================================================
• Relay is an alternative client with very aggressive performance optimizations,
  requires schema with persisted queries tools & tight conventions.
• Great for massive apps with lots of relationships, but higher learning curve.
*/

/* ===========================================================================
📌 19. INTERVIEW Q&A (short)
===============================================================================
Q1: What is GraphQL?
A: A typed query language for APIs allowing clients to request exactly the data they need.

Q2: How do you handle caching?
A: Use normalized cache (InMemoryCache), configure typePolicies, use fragments, and persistent cache for offline reads.

Q3: How to implement optimistic UI?
A: Provide optimisticResponse in useMutation and update cache with update() function or cache.modify.

Q4: How to do file upload?
A: Use multipart/form-data (apollo-upload-client) or FormData + fetch for RN.

Q5: How to handle subscriptions?
A: Use WebSocketLink or graphql-ws and split link to route subscription operations to WS.

Q6: How to handle offline mutations?
A: Persist mutation queue + optimistic local updates; replay on reconnect and reconcile conflicts.

Q7: Why codegen?
A: Provides TypeScript types and typed hooks for safer and faster development.
*/

/* ===========================================================================
📌 20. CHEAT-SHEET (implementation checklist)
===============================================================================
✔ Choose client: Apollo for general apps, Relay for large-scale apps
✔ Setup Apollo with auth link and split for subscriptions
✔ Configure InMemoryCache with typePolicies for pagination
✔ Persist cache to AsyncStorage/MMKV for offline reads
✔ Implement secure token storage and refresh flow (mutex)
✔ Use optimisticResponse for snappy UX
✔ Implement persistent mutation queue if offline writes are required
✔ Use codegen for TypeScript types and hooks
✔ Protect server with complexity/depth limiting and authorization checks
✔ Monitor queries & performance; profile subscriptions and cache usage
*/

/* ===========================================================================
📌 21. WANT NEXT?
===============================================================================
I can produce (single-file JS Notes):
  ✅ Full Apollo offline-mutation queue sample (SQLite-backed) with replay logic
  ✅ GraphQL Codegen config + sample generated types/hooks for Apollo
  ✅ Example persisted queries setup (client + server steps)
  ✅ Relay introduction + comparison with example usage

Tell me which one and I will return it in this same JS Notes format.
*/
