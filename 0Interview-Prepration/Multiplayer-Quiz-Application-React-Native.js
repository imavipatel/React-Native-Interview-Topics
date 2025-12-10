/**
 * react-native-realtime-quiz-platform-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES (Beginner Friendly)
 *
 * "Real-time Multiplayer Quiz Platform — live question streaming & scoring logic
 *  for mobile (React Native) with server architecture, client patterns, scaling,
 *  security, anti-cheat, persistence, and testing"
 *
 * - Very simple language for beginners
 * - Full coverage: high-level architecture, protocols, server (Node + socket.io) example,
 *   client (React Native) example hook, scoring logic, syncing, latency handling, matchmaking,
 *   leaderboards, persistence model, anti-cheat tips, CI & monitoring, checklist, interview Q&A
 * - Everything in one file (single-file JS notes). Copy-paste into your notes repo.
 */

/* ===========================================================================
📌 0. SHORT GOAL (one-line)
===============================================================================
Build a low-latency, fair real-time quiz system where many players join rooms,
receive the same timed questions, submit answers, and get real-time scores & leaderboards.
*/

/* ===========================================================================
📌 1. HIGH-LEVEL ARCHITECTURE (very simple)
===============================================================================
Client (React Native)  <---- WebSocket (wss) ---->  Real-Time Server (socket.io)
                                                       |
                                                       v
                                               Matchmaking service
                                                       |
           --------------------------------------------------------------
           |                         |                              |
        Game Service            Scoring Service               Persistence DB
        (rooms, timers)         (rules, anti-cheat)           (Postgres/Redis)
           |                         |                              |
         Redis pub/sub / Kafka <-- shared bus for scale & cross-node sync
           |
        Analytics, Monitoring (Prometheus, Sentry, Firebase)
*/

/* ===========================================================================
📌 2. KEY REQUIREMENTS (simple)
===============================================================================
- Real-time delivery: all players in a match see same question at same time.  
- Tight timing: answer windows (e.g., 10s) enforced server-side.  
- Fairness: server decides correct answer & scoring — clients only submit.  
- Low latency & scalability: support many concurrent matches.  
- Anti-cheat: detect replay, speed-hacks, multiple connections per user.  
- Persistence: store match records, scores, leaderboard, and audit logs.
*/

/* ===========================================================================
📌 3. PROTOCOL & MESSAGE DESIGN (small & deterministic)
===============================================================================
Use small JSON messages with `type` & `payload`. Keep messages idempotent & include `matchId` & `seq`.

Examples:
- Server → Client:
  { type: 'MATCH_START', payload: { matchId, players: [...], startAtUtc } }
  { type: 'QUESTION', payload: { seq: 3, questionId, text, choices, durationMs, startAtUtc } }
  { type: 'QUESTION_END', payload: { seq, questionId } }
  { type: 'SCORE_UPDATE', payload: { playerScores: [{userId, score}], leaderboardTop: [...] } }
  { type: 'MATCH_END', payload: { matchId, finalScores } }

- Client → Server:
  { type: 'JOIN_MATCH', payload: { matchId, authToken } }
  { type: 'ANSWER', payload: { matchId, seq, questionId, choiceId, clientTs } }
  { type: 'PONG' } // heartbeat optional

Include sequence `seq` (incrementing) to avoid out-of-order processing on reconnect.
*/

/* ===========================================================================
📌 4. TIMING & AUTHORITATIVE SOURCE (important)
===============================================================================
- Server is authoritative for timing and correctness.
- Each question includes `startAtUtc` & `durationMs`. Clients compute local display but server uses its clock to accept/reject answers.
- To mitigate clock skew, client may send `clientTs`, but server MUST use arrival timestamp (or sequence window) for fairness.
*/

/* ===========================================================================
📌 5. MATCHMAKING (simple flow)
===============================================================================
1) Player requests 'quick match' -> send to Matchmaking service (queue).  
2) MM groups players by criteria (skill, region, number).  
3) When group is ready -> allocate `matchId` from Game Service and return to players.  
4) Players connect to Game Server (socket.io) and join room: `room:${matchId}`.  
5) Server sends MATCH_START with `startAtUtc`.  
*/

/* ===========================================================================
📌 6. SCORING LOGIC (example rules)
===============================================================================
Simple, fair rule set (customize as needed):

- Correct answer base points: 100
- Time bonus: faster answers get extra points
  points = base + floor( (durationMs - answerLatencyMs) / durationMs * timeBonusMax )
  example: timeBonusMax = 50
- Penalty for wrong answers: 0 points (or small negative if desired)
- Streak bonus: consecutive correct answers multiply or add bonus
- Tie-breaker: earliest correct submission wins higher rank

Important: scoring MUST be done server-side and immutable once stored.
*/

/* ===========================================================================
📌 7. ANTI-CHEAT STRATEGIES (practical)
===============================================================================
Server-side authoritative checks:
  ✔ Accept answer only within [startAtUtc, startAtUtc + durationMs + graceMs] window.
  ✔ Use server arrival timestamp, not client-sent time, for latency calculation.
  ✔ Rate-limit submissions per player (one answer per question).
  ✔ Require authentication & per-device binding (one device per account).
  ✔ Detect impossible latencies (e.g., < 5ms globally) — flag suspicious.
  ✔ Detect multiple sessions for same user (force single active connection).
  ✔ Randomize question order for different groups only if acceptable; consistency is needed for fairness.
  ✔ Rotate question IDs / obfuscate correct answer mapping on client (do not include correct answer in payload).
  ✔ Monitor behavior: many fast correct answers from new user -> flag for review.

Optional stronger measures:
  • App attestation (Play Integrity / App Attest) before allowing sensitive matches  
  • Require CAPTCHAs in suspicious scenarios  
  • Use server-side telemetry & ML heuristics for cheat detection
*/

/* ===========================================================================
📌 8. PERSISTENCE MODEL (simple DB schema)
===============================================================================
Tables (Postgres) & ephemeral cache (Redis):

-- matches
match (id, match_type, started_at, ended_at, status)

-- players in match
match_player (match_id, user_id, join_ts, leave_ts, final_score, rank)

-- questions used
match_question (match_id, seq, question_id, start_at, duration_ms, correct_choice_id)

-- answers (audit log)
answer (match_id, seq, user_id, choice_id, server_received_ts, latency_ms, is_correct, points_awarded)

-- leaderboard (cached)
leaderboard (user_id, total_score, last_updated)

Use Redis:
- Room state (fast): current question seq, playerScores, temp answers
- Pub/Sub for cross-node notifications & broadcasting
- Use persistent DB for final match records, replay, and audits
*/

/* ===========================================================================
📌 9. SERVER: SIMPLE NODE + SOCKET.IO EXAMPLE (single-file conceptual)
===============================================================================
- Responsibilities: room lifecycle, question delivery, accept answers, compute scores, broadcast updates.
- For scale use multiple nodes + Redis adapter (socket.io-redis).
*/
/// server/game-server.js (conceptual)
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const redisAdapter = require("socket.io-redis"); // use ioredis adapter in production
const uuid = require("uuid").v4;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  /* cors etc */
});
// attach redis adapter for multi-instance
// io.adapter(redisAdapter({ host: '127.0.0.1', port: 6379 }));

// in-memory minimal room store (use Redis in prod)
const rooms = new Map();

/** createMatch: allocate match state and queue of questions (from DB) */
function createMatch(players, questions) {
  const matchId = uuid();
  const state = {
    matchId,
    players: players.map((p) => ({
      userId: p.userId,
      score: 0,
      answeredSeq: -1,
    })),
    questions, // array of { questionId, choices, correctChoiceId, durationMs }
    seq: 0,
    status: "waiting",
  };
  rooms.set(matchId, state);
  return state;
}

/** start match: send first question */
async function startMatch(matchId) {
  const state = rooms.get(matchId);
  if (!state) return;
  state.status = "running";
  const now = Date.now();
  // schedule question loop
  sendQuestion(state, state.seq);
}

function sendQuestion(state, seq) {
  const q = state.questions[seq];
  const startAtUtc = Date.now() + 1000; // 1s lead time to clients
  // broadcast QUESTION message
  io.to(`room:${state.matchId}`).emit("message", {
    type: "QUESTION",
    payload: {
      seq,
      questionId: q.questionId,
      text: q.text,
      choices: q.choices.map((c) => ({ id: c.id, text: c.text })), // do NOT include correctChoiceId
      durationMs: q.durationMs,
      startAtUtc,
    },
  });
  // set acceptance window & collect answers in state for this seq
  state.current = {
    seq,
    questionId: q.questionId,
    startAtUtc,
    durationMs: q.durationMs,
    answers: [],
  };

  // schedule question end
  setTimeout(() => endQuestion(state), q.durationMs + 1000); // +grace
}

function endQuestion(state) {
  const current = state.current;
  if (!current) return;
  // compute results based on answers
  for (const ans of current.answers) {
    const player = state.players.find((p) => p.userId === ans.userId);
    if (!player) continue;
    const isCorrect = ans.choiceId === getCorrectChoiceFor(state, current.seq);
    let points = 0;
    if (isCorrect) {
      const base = 100;
      const timeBonusMax = 50;
      const answerLatencyMs = ans.serverReceivedTs - current.startAtUtc;
      const timeBonus = Math.max(
        0,
        Math.floor(
          ((current.durationMs - answerLatencyMs) / current.durationMs) *
            timeBonusMax
        )
      );
      points = base + timeBonus;
      player.score += points;
    }
    // persist answer to DB (audit)
    // db.insert('answer', {...})
  }

  // broadcast SCORE_UPDATE
  io.to(`room:${state.matchId}`).emit("message", {
    type: "SCORE_UPDATE",
    payload: {
      playerScores: state.players.map((p) => ({
        userId: p.userId,
        score: p.score,
      })),
    },
  });

  // next question or end match
  state.seq += 1;
  if (state.seq < state.questions.length) {
    sendQuestion(state, state.seq);
  } else {
    endMatch(state);
  }
}

function getCorrectChoiceFor(state, seq) {
  return state.questions[seq].correctChoiceId;
}

function endMatch(state) {
  state.status = "finished";
  io.to(`room:${state.matchId}`).emit("message", {
    type: "MATCH_END",
    payload: {
      matchId: state.matchId,
      finalScores: state.players.map((p) => ({
        userId: p.userId,
        score: p.score,
      })),
    },
  });
  // persist final match record to DB for leaderboard
  rooms.delete(state.matchId);
}

// Socket handlers
io.on("connection", (socket) => {
  // authenticate token in handshake (recommended) and attach user id
  const user = authenticateSocket(socket); // implement token validation
  if (!user) return socket.disconnect(true);

  socket.on("JOIN_MATCH", ({ matchId }) => {
    socket.join(`room:${matchId}`);
    // optionally mark player as connected
  });

  socket.on("ANSWER", (msg) => {
    // msg: { matchId, seq, questionId, choiceId }
    const state = rooms.get(msg.matchId);
    if (!state || state.status !== "running" || state.current.seq !== msg.seq)
      return;

    // single-submission rule:
    const already = state.current.answers.find((a) => a.userId === user.userId);
    if (already) return; // ignore duplicate answers

    // serverReceivedTs is authoritative
    const serverReceivedTs = Date.now();

    // accept only within window
    const { startAtUtc, durationMs } = state.current;
    if (
      serverReceivedTs < startAtUtc ||
      serverReceivedTs > startAtUtc + durationMs + 1000
    ) {
      // late -> ignore or mark late
      return;
    }

    // record answer in memory store; persist later
    state.current.answers.push({
      userId: user.userId,
      choiceId: msg.choiceId,
      serverReceivedTs,
    });
  });
});

server.listen(3000);
console.log("Game server running on 3000");

/* ===========================================================================
📌 10. SCALE & MULTI-INSTANCE NOTES (production)
===============================================================================
- Run many game server instances behind LB. Use Redis adapter for socket.io so rooms can be referenced across nodes.
- Keep minimal authoritative state in Redis (current question, answers buffer) so other nodes can read/restore.
- Persist final match results to Postgres and use Redis to store ephemeral scores & leaderboards.
- Use message broker (Kafka/Redis Streams) to record events for analytics & replay.
- Shard matches by region or hash(matchId) to reduce cross-instance traffic.
*/

/* ===========================================================================
📌 11. REACT NATIVE CLIENT: SIMPLE HOOK (socket.io-client)
===============================================================================
- Responsibilities: connect, join room, show questions at correct times, submit answer, show scores.
*/
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

export function useMatchClient({
  serverUrl,
  matchId,
  authToken,
  onQuestion,
  onScoreUpdate,
  onMatchEnd,
}) {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io(serverUrl, {
      transports: ["websocket"],
      auth: { token: authToken },
      reconnectionAttempts: 5,
      transportsOptions: { polling: false },
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("JOIN_MATCH", { matchId });
    });

    socket.on("message", (msg) => {
      // handle server messages
      if (msg.type === "QUESTION") {
        onQuestion && onQuestion(msg.payload);
      } else if (msg.type === "SCORE_UPDATE") {
        onScoreUpdate && onScoreUpdate(msg.payload);
      } else if (msg.type === "MATCH_END") {
        onMatchEnd && onMatchEnd(msg.payload);
      }
    });

    socket.on("disconnect", () => setConnected(false));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [serverUrl, matchId, authToken]);

  function submitAnswer(seq, questionId, choiceId) {
    if (!socketRef.current || !connected) return false;
    socketRef.current.emit("ANSWER", { matchId, seq, questionId, choiceId });
    return true;
  }

  return { connected, submitAnswer };
}

/* ===========================================================================
📌 12. CLIENT TIMING UI (how to display question fairly)
===============================================================================
- Use server `startAtUtc` to compute remaining time: remaining = startAtUtc + durationMs - Date.now()
- Show countdown and disable UI if time <= 0
- Use optimistic local timers for smooth UI but still rely on server validation & score updates
- On reconnect, request current room state (seq and startAtUtc) from server endpoint to resync
*/

/* ===========================================================================
📌 13. LEADERBOARD & RANKING (real-time + persistent)
===============================================================================
- Real-time leaderboards: compute from Redis scores and broadcast top-N every question end.
- Persistent global leaderboards: aggregate from DB periodically (daily/weekly).
- Use TTL caches for leaderboard queries to reduce DB load.
- For fairness, final ranking uses persisted scores; client-side displays are provisional until match end.
*/

/* ===========================================================================
📌 14. ANALYTICS & MONITORING
===============================================================================
- Log events: join, question_sent, answer_received, scoring_event, match_end.
- Export to analytics pipeline (Kafka / BigQuery) for later analysis: cheat detection, retention.
- Monitor: connection errors, high latency, answer rates, suspicious patterns.
- Use Sentry / Crashlytics to track client crashes during matches.
*/

/* ===========================================================================
📌 15. TESTING STRATEGY
===============================================================================
Unit:
  - scoring logic tests with edge cases (late, tie, streaks)
Integration:
  - socket flows: simulate clients connecting, send answers, verify scores
E2E:
  - Run 10–50 simulated clients in a staging environment to stress match flow
Load:
  - Use k6/gatling or custom scripts to simulate thousands of socket connections (with headless clients)
Security:
  - Pen-test authorization, replay attacks, multi-login exploits
Usability:
  - Test on low-end devices & poor networks (3G) to ensure graceful behavior
*/

/* ===========================================================================
📌 16. DATA RETENTION & AUDIT (important)
===============================================================================
- Keep answers audit logs for fraud investigations (store minimal PII).  
- Retention policy: keep match/answers for required time (e.g., 90 days) then archive.  
- Provide admin tools to review suspicious matches (replay timeline).
*/

/* ===========================================================================
📌 17. COMMON PITFALLS & HOW TO AVOID
===============================================================================
✘ Trusting client time → use server timestamps.  
✘ Allowing duplicate answers → enforce one answer per seq server-side.  
✘ Not handling reconnects → resync state when user reconnects.  
✘ Broadcasting heavy payloads every second → send diffs or top-N only.  
✘ Persisting ephemeral state only in memory → use Redis for multi-instance reliability.
*/

/* ===========================================================================
📌 18. CHECKLIST — QUICK (implement & release)
===============================================================================
✔ Server authoritative timing & scoring  
✔ Socket authentication & single active session per user  
✔ One-answer-per-player-per-question enforced server-side  
✔ Use Redis adapter for socket scaling; persist match state in Redis during match  
✔ Persist final results & answers to Postgres for audit & leaderboard  
✔ Use TTL caches for live leaderboards and cleanup after match end  
✔ Implement rate limiting & anti-cheat heuristics (replay detection)  
✔ Automated CI tests: unit (scoring), integration (socket flow) & load tests  
✔ Monitor metrics, set alerts for abnormal patterns (spikes, reconnects)  
✔ Backup & retention policy for match logs
*/

/* ===========================================================================
📌 19. INTERVIEW Q&A (BEGINNER-FRIENDLY)
===============================================================================
Q1: Should scoring be done on client or server?  
A: Always server. Client only submits answers — server computes points to prevent cheating.

Q2: How do you handle clock differences between client and server?  
A: Server sends `startAtUtc`. Client uses it for UI, but server uses arrival timestamps for acceptance and latency-based scoring.

Q3: How to scale socket servers?  
A: Run many instances + Redis (or Kafka) pub/sub for broadcasting and shared state (socket.io-redis adapter).

Q4: What's a good way to prevent users from submitting many answers quickly?  
A: Enforce one submission per player per question on server, and rate-limit per-user.

Q5: How do you handle reconnect mid-question?  
A: On reconnect, resync: request current seq & startAtUtc and remaining time from server; do not accept late answers if outside window.

Q6: How do we ensure fairness if users have different network latencies?  
A: Use same `startAtUtc`, apply time bonus based on arrival timestamp (server-based). Acknowledge some users will have natural disadvantage — consider region-based matchmaking.
*/

/* ===========================================================================
📌 20. FINAL CHEAT-SHEET (ONE-PAGE)
===============================================================================
1) Server authoritative: timing, correctness, scoring. 2) Use WebSocket (wss) for real-time push. 3) Use small deterministic messages with seq & matchId. 4) Enforce single answer per question & accept answers by server time. 5) Use Redis for ephemeral state & socket scaling. 6) Persist all answers & final scores for audit. 7) Add anti-cheat heuristics and monitoring. 8) Test at unit, integration, and load levels before production.
*/

/* ===========================================================================
📌 21. WANT NEXT?
===============================================================================
I can produce in the same single-file JS notes format:
  ✅ Full production-ready Node + socket.io + Redis + Postgres example with deployment notes  
  ✅ Load-testing scripts & step-by-step guide to simulate 10k concurrent players  
  ✅ Anti-cheat deep-dive: heuristics, ML features, and admin investigation playbook
Pick one and I’ll produce it in this same beginner-friendly single-file JS Notes style.
*/
