/*

✅ 🟢 EASY – Start with basic concepts

Monolith vs Microservices
→ When to use which architecture — ARCHITECTURE CHOICE

SQL vs NoSQL
→ Which database is better for e-commerce scenario & why — DATABASE SELECTION

Cache layers (Redis, Memcached, CDN)
→ How to reduce DB load & speed up response — CACHING BASICS

Pagination / Filtering / Sorting
→ Should this logic be handled in frontend or backend? — DATA ACCESS PATTERN

REST vs GraphQL
→ Designing APIs for flexibility & performance — API DESIGN

Kafka & Event-driven Architecture
→ Producers & consumers handle real-time async — PUB/SUB MODEL

Consistency models
→ Strong consistency vs eventual consistency — DATA CONSISTENCY

Notification basics
→ Payment alert vs offer notification → which to prioritize — PRIORITY QUEUE

Middle-layer API aggregation
→ Handle if 1 out of 3 APIs is slow → fallback gracefully — API ORCHESTRATION

Requirement gathering
→ Ask questions before design (ex: 3 APIs → what info needed?) — REQUIREMENT CLARIFICATION

🔹 Frontend fundamentals

SPA vs MPA → Which is better & when — RENDER STRATEGY

Responsive + Accessible UI → Works on all devices & with screen readers — UX DESIGN

Lazy loading, Code splitting → Reduce bundle size — PERFORMANCE

Redux, Zustand → How to manage complex state — STATE MANAGEMENT

XSS, CSRF, CORS → Basic web security terms — SECURITY BASICS

✅ 🟠 MEDIUM – Scalable & smart designs
🔹 Booking.com-style concurrency

• Same room booked by two users → use locks — LOCKING
• Same hotel booked from two sites → use distributed locks — DISTRIBUTED LOCK
• Multi-room inventory (10 rooms left) → handle race — RACE CONDITION

🔹 Google Docs / Figma-style real-time editor

• Two people type at same time → maintain order — OT vs CRDT
• Show previous versions & edit history → VERSIONING
• User edits offline → sync once back online — OFFLINE SYNC
• Realtime drag of rectangles/text by multiple users → EVENT-DRIVEN SHARING

🔹 Chat / WhatsApp-style system

• Ensure message appears in correct order → MESSAGE ORDERING
• Show ✓, ✓✓ for delivery → DELIVERY STATUS
• Message received after 5 sec → how to still show correctly — LATE MESSAGE HANDLING

🔹 Infinite Scroll UI (e.g., Books list)

• Load page-by-page until 100K items → VIRTUALIZED LIST
• User jumps from page 1 to page 30000 → RANDOM PAGE FETCHING
• Cache already visited pages → CACHE WINDOW MANAGEMENT

🔹 Product screen with 3 APIs

• If one API fails → still show others → PARTIAL RENDER
• Use fallback UI → skeleton loaders → RESILIENT UI
• Retry/fallback logic from middle-layer → RETRY PATTERN

🔹 Newspaper Website

• Lazy load articles & images → FAST LOAD
• Hot news appears instantly → use WebSocket → REALTIME PUSH
• Suggest related news → based on tags → CONTENT RANKING
• Define clear interface between FE ↔ BE → API CONTRACT

🔹 Amazon/Flipkart Notifications

• Payment & order update = high priority — PRIORITY KAFKA TOPIC
• Offers & promos = low priority — BACKGROUND QUEUE
• Push vs pull based on device → NOTIFICATION STRATEGY

Frontend architecture at this level:

CSR vs SSR vs SSG → how pages are rendered — RENDER STRATEGIES

WebSocket vs Long Polling vs SSE → REALTIME CHANNELS

Service Worker to cache pages offline — PWA BASICS

Authorization with tokens → JWT / OAUTH SECURITY

✅ 🔴 HARD – Deep performance, global scale, senior-level
🔥 Figma-like realtime design tool

• Two people change color of same shape → resolve conflict — CRDT CONFLICT
• Person edits offline → batch sync when online → OPERATION TRANSFORM
• Ability to revert back to any older design → FULL HISTORY LOG

🔥 Global booking across regions

• Hotel available in US + India DC → keep count synced — MULTI-DC CONSISTENCY
• If one booking step fails → undo entire process — SAGA PATTERN
• Retry booking → should not double charge — IDEMPOTENT APIs
• Split customers or rooms by region → SHARDING

🔥 Micro-frontend Architecture

• Multiple teams deploy parts of the website independently — MFE ARCH
• Share common libraries & talk between apps — MFE INTEGRATION

🔥 Frontend monitoring & observability

• Track load times (LCP, FID, TTFB) from real users — RUM METRICS
• Log clicks & crashes on browser — TELEMETRY / ERROR TRACKING

🔥 Web performance optimization

• CDN + ETag for caching — HTTP CACHING
• Load fonts & CSS without blocking — CRITICAL RENDER PATH
• External scripts loaded with async/defer — 3RD PARTY OPTIMIZATION
• Send lighter bundle to low-end phones — ADAPTIVE LOADING

🔥 Security & Offline-First Web

• Protect against malicious scripts — CSP + SANITIZATION
• Prevent CSRF using tokens/cookies — CSRF DEFENSE
• Use Service Worker to cache & sync — OFFLINE FIRST (PWA)
• Background sync user actions when offline — SYNC QUEUE

*/
