/**
 * react-native-websocket-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES (Beginner Friendly)
 *
 * "What is WebSocket, how WebSocket works under the hood, and how to implement it
 *  (client & server patterns, scaling, security, reconnection, examples)"
 *
 * - Very simple language for beginners
 * - Full coverage: protocol basics, TCP handshake, frames, masking, ping/pong,
 *   secure wss, server examples (Node.js), React Native client examples (raw WebSocket + socket.io),
 *   scaling, authentication, best practices, checklist, tests, Q&A
 * - Everything in one file (single-file JS notes). Copy-paste into your notes repo.
 */

/* ===========================================================================
📌 0. SHORT GOAL (one-line)
===============================================================================
Use WebSocket for fast, low-latency bi-directional communication between client and server.
*/

/* ===========================================================================
📌 1. WHAT IS WEBSOCKET? (very simple)
===============================================================================
- WebSocket is a protocol that lets a client (browser or mobile app) and a server
  keep an open connection so both can send messages to each other at any time.
- Unlike HTTP (request → response), WebSocket supports real-time push from server.
- URL schemes: `ws://` (plain) and `wss://` (secure/TLS).
*/

/* ===========================================================================
📌 2. WHY USE WEBSOCKETS?
===============================================================================
Use WebSocket when you need:
  ✔ Real-time updates (chat, live scores, trading, presence)  
  ✔ Low-latency two-way comms (games, collaboration tools)  
  ✔ Fewer HTTP requests and less overhead for frequent messages
*/

/* ===========================================================================
📌 3. UNDER THE HOOD — HOW IT WORKS (step-by-step, simple)
===============================================================================
1) **Initial handshake (HTTP → Upgrade)**  
   - Client sends an HTTP GET with `Connection: Upgrade` and `Upgrade: websocket` header.  
   - Server responds with `101 Switching Protocols` and accepts the WebSocket upgrade.  
   - After that, connection becomes a WebSocket on top of the same TCP socket.

2) **Underlying transport: TCP (or TLS over TCP)**  
   - WebSocket runs over a TCP socket (wss = TLS + WebSocket).  
   - All messages travel in that single long-lived TCP connection.

3) **Frames & messages**  
   - WebSocket sends **frames** (small chunks) with a tiny header + payload.  
   - Frames can be text (UTF-8) or binary (ArrayBuffer).  
   - Messages may be split into multiple frames (fragmentation).

4) **Masking (client → server)**  
   - Browser and clients mask payloads when sending to servers (simple XOR) to
     prevent some proxy cache issues; servers unmask. Servers do not mask replies.

5) **Control frames**  
   - `PING` / `PONG` → keepalive & latency checks  
   - `CLOSE` → orderly close with a code & reason

6) **Message ordering & reliability**  
   - WebSocket guarantees message order (over single TCP connection).  
   - It does not guarantee delivery if the connection drops; the app must handle reconnection.

7) **Subprotocols**  
   - Client and server can agree on a "subprotocol" (e.g., `graphql-ws`, `wamp`) via `Sec-WebSocket-Protocol`.

8) **Security**  
   - Use `wss://` (TLS) in production.  
   - Validate origin, authenticate after connect, use short-lived tokens, and consider attestation.
*/

/* ===========================================================================
📌 4. SIMPLE LIFECYCLE (client perspective)
===============================================================================
- create socket → onopen → send/receive → ping/pong / heartbeats → onclose → reconnect logic
*/

/* ===========================================================================
📌 5. RAW WEBSOCKET: REACT NATIVE CLIENT EXAMPLE
===============================================================================
- React Native exposes the standard WebSocket API.
- Simple example with reconnection & heartbeats.
*/
import React, { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

export function useWebSocket(
  url,
  { onMessage, onOpen, onClose, protocols, authToken } = {}
) {
  // A simple reusable hook — keep it minimal & beginner-friendly
  const wsRef = useRef(null);
  const [readyState, setReadyState] = useState("CLOSED"); // 'OPEN', 'CONNECTING', 'CLOSED'
  const pingIntervalRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // Backoff params
  const initialDelay = 1000;
  const maxDelay = 30000;
  let backoff = initialDelay;

  const connect = () => {
    try {
      setReadyState("CONNECTING");
      // attach token as header is not supported in all clients; use query param or subprotocol or send auth after open
      const connectUrl = authToken
        ? `${url}?token=${encodeURIComponent(authToken)}`
        : url;
      wsRef.current = new WebSocket(connectUrl, protocols);

      wsRef.current.onopen = (evt) => {
        backoff = initialDelay; // reset backoff on success
        setReadyState("OPEN");
        onOpen && onOpen(evt);

        // start ping (application-level heartbeat)
        pingIntervalRef.current = setInterval(() => {
          if (wsRef.current && wsRef.current.readyState === 1) {
            wsRef.current.send(
              JSON.stringify({ type: "PING", ts: Date.now() })
            );
          }
        }, 30000); // 30s heartbeat
      };

      wsRef.current.onmessage = (evt) => {
        // parse text messages (or handle binary separately)
        try {
          const data = JSON.parse(evt.data);
          onMessage && onMessage(data);
        } catch (e) {
          // non-json payload
          onMessage && onMessage(evt.data);
        }
      };

      wsRef.current.onclose = (evt) => {
        setReadyState("CLOSED");
        onClose && onClose(evt);
        cleanup();
        scheduleReconnect();
      };

      wsRef.current.onerror = (err) => {
        // optionally log errors to telemetry (avoid secrets)
      };
    } catch (e) {
      scheduleReconnect();
    }
  };

  const scheduleReconnect = () => {
    // exponential backoff
    reconnectTimeoutRef.current = setTimeout(() => {
      connect();
    }, backoff);
    backoff = Math.min(backoff * 2, maxDelay);
  };

  const cleanup = () => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    connect();

    const appStateHandler = (state) => {
      // optionally close/reopen socket on background/foreground to save battery
      if (
        state === "active" &&
        (!wsRef.current || wsRef.current.readyState === 3)
      ) {
        connect();
      } else if (state !== "active" && wsRef.current) {
        wsRef.current.close();
      }
    };
    AppState.addEventListener("change", appStateHandler);

    return () => {
      cleanup();
      try {
        wsRef.current && wsRef.current.close();
      } catch (e) {}
      AppState.removeEventListener("change", appStateHandler);
    };
  }, [url, authToken]);

  const send = (message) => {
    try {
      if (wsRef.current && wsRef.current.readyState === 1) {
        wsRef.current.send(
          typeof message === "string" ? message : JSON.stringify(message)
        );
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  return { send, readyState };
}

/* ===========================================================================
📌 6. USING SOCKET.IO (higher-level) — RN CLIENT EXAMPLE
===============================================================================
Socket.IO is a popular library that provides reconnection, rooms, and event semantics.
Install: yarn add socket.io-client
*/
import io from "socket.io-client";

/** Example helper */
export function createSocketIoClient(baseUrl, token) {
  const socket = io(baseUrl, {
    transports: ["websocket"],
    auth: { token }, // socket.io v3+ supports auth in connection
    autoConnect: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    // connected
  });

  socket.on("disconnect", (reason) => {
    // handle disconnect
  });

  socket.on("connect_error", (err) => {
    // handle error
  });

  return socket;
}

/* ===========================================================================
📌 7. SERVER: SIMPLE NODE.JS (ws library) EXAMPLE
===============================================================================
- `ws` is a minimal WebSocket server. Install: `yarn add ws`
- Very beginner-friendly example below.
*/
/// server.js (Node.js minimal)
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

// simple in-memory presence map (not for production)
const clients = new Map();

wss.on("connection", (ws, req) => {
  // Optionally inspect query params for token: req.url
  // Real app: authenticate the user first (token verification)
  const clientId = Date.now() + Math.random();
  clients.set(clientId, ws);

  ws.on("message", (message) => {
    // handle message (JSON expected)
    try {
      const data = JSON.parse(message);
      if (data.type === "PING") {
        ws.send(JSON.stringify({ type: "PONG", ts: Date.now() }));
      } else {
        // broadcast to others (example)
        clients.forEach((c, id) => {
          if (id !== clientId && c.readyState === WebSocket.OPEN) {
            c.send(JSON.stringify({ from: clientId, data }));
          }
        });
      }
    } catch (e) {
      // ignore parse errors
    }
  });

  ws.on("close", () => {
    clients.delete(clientId);
  });
});

/* ===========================================================================
📌 8. SERVER: Socket.IO (Node) EXAMPLE (rooms & auth)
===============================================================================
- Socket.IO gives rooms, namespaces, and reconnection helpers.
- Install: `yarn add socket.io`
*/
/// socket-server.js (conceptual)
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer();
const ioServer = new Server(httpServer, {
  /* options */
});

ioServer.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  // verify token, then next() or next(new Error('unauthorized'))
  next();
});

ioServer.on("connection", (socket) => {
  // join rooms
  socket.on("join", (room) => socket.join(room));
  socket.on("msg", ({ room, text }) =>
    socket.to(room).emit("msg", { text, from: socket.id })
  );
});

/* ===========================================================================
📌 9. AUTHENTICATION PATTERNS (secure)
===============================================================================
Do NOT rely on query string alone for auth in production (can be logged). Recommended:
  1) Use short-lived JWT token issued by backend and send via:
     - Authorization header during initial HTTP upgrade is not universally supported,
       so common patterns are:
       a) Send token as query param (acceptable but log carefully) OR
       b) Authenticate after `onopen` by sending an "AUTH" message with token
  2) Verify token server-side, attach user ID to socket session
  3) Use token rotation & session binding to detect replay
  4) Use TLS (wss://) to protect the token in transit
  5) Optionally combine with App Attest / Play Integrity proof for higher trust
*/

/* ===========================================================================
📌 10. HEARTBEAT & KEEPALIVE (practical)
===============================================================================
- Use ping/pong to detect dead connections quickly.
- Servers often send PING, clients reply PONG automatically (some clients do). You can implement app-level heartbeat too.
- Choose intervals carefully (e.g., 25–45s) to balance latency & battery.
*/

/* ===========================================================================
📌 11. RECONNECTION STRATEGY (robust design)
===============================================================================
- Use exponential backoff with jitter to reconnect.  
- Limit max attempts or escalate to user.  
- Pause reconnection on background to save battery.  
- Avoid reconnection storms (use central backoff per device).  
*/

/* ===========================================================================
📌 12. MESSAGE PROTOCOL DESIGN (recommendations)
===============================================================================
- Use small JSON messages or binary for efficiency.  
- Add `type` field and `id` for request/response mapping.  
- Support ack/nack for important messages.  
- Keep messages idempotent where possible.  
- Include timestamps for ordering or deduplication when resuming after reconnect.
*/

/* ===========================================================================
📌 13. SCALING & INFRA (how to scale WebSocket servers)
===============================================================================
Single server is fine for small apps. For scale:

1) **Sticky Sessions (if using load balancer)**  
   - WebSocket requires TCP connection affinity; use sticky sessions at LB (or route by cookie/source IP).

2) **Stateless servers + pub/sub (recommended)**  
   - Use Redis (pub/sub), Kafka, or NATS to broadcast messages across instances.  
   - Each server subscribes to channels and forwards to connected clients.

3) **Message broker pattern**  
   - App servers handle sockets and publish events to broker; other servers subscribe and deliver to relevant clients.

4) **Managed solutions**  
   - Use AWS API Gateway WebSocket, Pusher, Ably, Firebase Realtime / Firestore, Supabase Realtime for easier scaling.

5) **Connection limits & autoscaling**  
   - Monitor file descriptors, memory, and CPU. Auto-scale socket servers when needed.
*/

/* ===========================================================================
📌 14. PERFORMANCE TIPS
===============================================================================
- Keep messages small (avoid verbose JSON).  
- Batch frequent updates if possible.  
- Use binary formats (protobuf) for heavy workloads.  
- Avoid frequent reconnects — heartbeat & retry backoff.  
- Avoid per-message heavy compute on main thread (offload or debounce).
*/

/* ===========================================================================
📌 15. MONITORING & OBSERVABILITY
===============================================================================
Track:
  ✔ connection counts  
  ✔ connect/disconnect rates  
  ✔ average messages/sec  
  ✔ message latency (server -> client)  
  ✔ errors & reconnect reasons

Use metrics exporters (Prometheus), logs, and tracing if possible.
*/

/* ===========================================================================
📌 16. SECURITY BEST PRACTICES
===============================================================================
✔ Always use `wss://` in production (TLS)  
✔ Validate Origin and subprotocol where relevant  
✔ Authenticate the socket session server-side after connect  
✔ Use short-lived tokens + token rotation for auth  
✔ Limit message sizes and rate (prevent abuse)  
✔ Sanitize/validate incoming messages (avoid injection)  
✔ Use per-user rate limits & quotas  
✔ Monitor for suspicious patterns (many reconnects, invalid auth attempts)
*/

/* ===========================================================================
📌 17. TESTING IDEAS
===============================================================================
- Unit test message parsing & handler logic  
- Integration test server: simulate clients connecting, sending messages, disconnecting  
- Fault injection: drop packets, kill sockets, simulate slow network  
- Load test: simulate many connections (k6, gatling, custom scripts)  
- E2E: test critical flows (chat, presence, trading) with real device/emulator
*/

/* ===========================================================================
📌 18. TROUBLESHOOTING (common issues)
===============================================================================
- Connection fails behind corporate proxies → ensure ws/wss passes proxy or use wss on TLS port 443.  
- Load balancer closes idle connections → use keepalive/ping or configure LB idle timeout.  
- Unexpected disconnects on mobile background → OS may throttle sockets; close and reopen on foreground.  
- Message duplication on reconnection → use server-side sequence numbers or idempotency keys.
*/

/* ===========================================================================
📌 19. QUICK CLIENT + SERVER EXAMPLE SUMMARY
===============================================================================
- Client (React Native): use WebSocket API or socket.io-client, implement heartbeat + backoff, auth on connect.  
- Server (Node.js): use `ws` for raw WebSocket or `socket.io` for richer features; authenticate & bind user; use Redis pub/sub for multi-instance scaling.
*/

/* ===========================================================================
📌 20. CHECKLIST — IMPLEMENTATION (quick)
===============================================================================
✔ Use wss:// in prod (TLS).  
✔ Authenticate socket session server-side.  
✔ Implement heartbeat (PING/PONG).  
✔ Exponential backoff + jitter for reconnect.  
✔ Use Redis/pub-sub or managed service for scaling.  
✔ Limit message size & rate.  
✔ Monitor connections & latency.  
✔ Test in poor network & background app states.  
✔ Sanitize incoming messages & validate schema.
*/

/* ===========================================================================
📌 21. INTERVIEW Q&A (BEGINNER FRIENDLY)
===============================================================================
Q1: How does WebSocket differ from HTTP?  
A: WebSocket is a long-lived TCP connection allowing bi-directional push. HTTP is request-response and stateless per request.

Q2: What is the WebSocket handshake?  
A: Client sends an HTTP GET with `Upgrade: websocket`. Server responds with `101 Switching Protocols`. They then speak WebSocket frames over the same TCP socket.

Q3: Why use wss:// instead of ws://?  
A: wss uses TLS (encryption) and prevents eavesdropping and token theft in transit.

Q4: How do you authenticate a WebSocket connection?  
A: Use a short-lived token sent either in query (careful) or send auth message after connection; verify token server-side and attach user id to the socket.

Q5: How do you scale WebSocket servers?  
A: Use sticky sessions or (preferable) stateless servers + pub/sub (Redis/Kafka) to broadcast messages across instances; or use managed realtime services.

Q6: What is ping/pong for WebSocket?  
A: A keepalive/latency check mechanism: server or client sends PING; the peer replies with PONG.

Q7: How to avoid message duplication after reconnect?  
A: Use message ids or sequence numbers and make handlers idempotent.
*/

/* ===========================================================================
📌 22. FINAL CHEAT-SHEET (ONE-PAGE)
===============================================================================
1) WebSocket = long-lived TCP connection (ws/wss) for real-time 2-way messages.  
2) Handshake: HTTP Upgrade → 101 Switching Protocols → TCP becomes WebSocket.  
3) Use heartbeat, auth, TLS, and reconnection with backoff.  
4) For scale: use Redis/pub-sub or managed realtime providers.  
5) Secure messages, validate schema, limit size & rate, monitor metrics.  
6) Implement client ping/pong, server auth, and server-side message routing (rooms/topics).
*/

/* ===========================================================================
📌 23. WANT NEXT?
===============================================================================
I can produce in the same single-file JS notes format:
  ✅ Full production-ready example: Node.js + Redis pub/sub + socket.io server + RN client with reconnection & auth  
  ✅ WebSocket protocol deep dive: frame format, masking, fragmentation, opcodes with diagrams  
  ✅ Example: GraphQL subscriptions over WebSocket (graphql-ws) full flow (client + server)
Pick one and I’ll produce it in this same beginner-friendly single-file JS Notes style.
*/
