/**
 * react-native-rbac-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES (Beginner Friendly)
 *
 * "Role-Based Access Control (RBAC) — what it is, how it works, and how to implement it"
 *
 * - Very simple language for beginners
 * - Full coverage: concepts, models, server implementation, client checks (React Native),
 *   JWT claims, middleware, admin UI ideas, testing, security notes, checklist, Q&A
 * - Everything in one file (single-file JS notes). Copy-paste into your notes repo.
 */

/* ===========================================================================
📌 0. SHORT GOAL (one-line)
===============================================================================
Manage who can do what in your app by assigning roles and enforcing permissions
on both server and client so only allowed users perform sensitive actions.
*/

/* ===========================================================================
📌 1. WHAT IS RBAC? (very simple)
===============================================================================
RBAC = Role-Based Access Control.

Basic idea:
  - Create *roles* (example: admin, manager, user, guest).
  - Give each role a list of *permissions* (example: "read:users", "create:order").
  - Assign roles to users.
  - Check the user's role (or permissions) when they try to do something.

Why use it:
  ✔ Easier to manage permissions for many users  
  ✔ Clear separation of privileges (least privilege)  
  ✔ Simple to reason about in code & admin UI
*/

/* ===========================================================================
📌 2. CORE CONCEPTS (beginner-friendly)
===============================================================================
- Role: a named group of permissions (e.g., "admin").  
- Permission: a specific capability (e.g., "orders:create").  
- Principal: the user or service performing an action.  
- Policy: rules that map roles -> permissions (or allow checks).  
- Enforcement point: where you check permissions (server must enforce).
*/

/* ===========================================================================
📌 3. SIMPLE MODELS (example)
===============================================================================
Store these in your DB in simple tables/collections:

roles:
  - id: 'admin'
  - id: 'manager'
  - id: 'user'

permissions:
  - id: 'users:read'
  - id: 'users:update'
  - id: 'orders:create'
  - id: 'orders:refund'

role_permissions:
  - role: 'admin', permission: 'users:read'
  - role: 'admin', permission: 'orders:refund'
  - role: 'manager', permission: 'orders:create'

user_roles:
  - userId: 123, role: 'manager'
  - userId: 456, role: 'user'
*/

/* ===========================================================================
📌 4. PRINCIPLES & BEST PRACTICES (simple)
===============================================================================
✔ Enforce authorization on the server — client checks are only UX helpers.  
✔ Principle of least privilege — give minimal permissions needed.  
✔ Keep roles small and well-documented.  
✔ Prefer permission names (verbs+resources) over vague role checks inside logic.  
✔ Audit role assignments and changes (who changed roles and when).  
✔ Make roles editable by admins in a simple admin UI (but keep server in control).
*/

/* ===========================================================================
📌 5. JWT & CLAIMS WAY (how to include roles in tokens)
===============================================================================
Common approach:
  - When user logs in, backend issues a JWT that contains the user's roles or permissions:
    {
      sub: "user-id",
      roles: ["user","manager"],
      perms: ["orders:create"],
      exp: 1712345678
    }

Important:
  - JWT is a *snapshot* — if you change role later in DB, either:
      • short JWT TTL and force refresh, or
      • use reference tokens (session id) stored server-side
  - Never trust client-side role values without server validation (server reads DB or validates token).
*/

/* ===========================================================================
📌 6. SERVER-SIDE: SIMPLE RBAC MIDDLEWARE (Node + Express example)
===============================================================================
- Enforce permissions with middleware.
- Always check user identity & token first.
*/
//
// Install: npm i express jsonwebtoken
//
const express = require("express");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "dev-secret"; // use strong secret in prod

function authenticateJWT(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).send("missing auth");
  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, SECRET);
    req.user = payload; // { sub, roles, perms, ... }
    next();
  } catch (e) {
    return res.status(401).send("invalid token");
  }
}

/* Permission check middleware factory:
   usage: app.post('/orders', authenticateJWT, requirePermission('orders:create'), handler)
*/
function requirePermission(permission) {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).send("not authenticated");

    // Option A: token contains explicit perms
    const perms = user.perms || [];

    // Option B: token contains roles -> resolve roles to permissions server-side (recommended)
    // For clarity, simple example merges both:
    if (perms.includes(permission)) return next();

    // Example: resolve roles to permissions (in-memory map for demo)
    const roleToPerms = {
      admin: ["users:read", "users:update", "orders:create", "orders:refund"],
      manager: ["orders:create"],
      user: ["orders:create"],
    };
    const roles = user.roles || [];
    for (const r of roles) {
      if ((roleToPerms[r] || []).includes(permission)) return next();
    }

    return res.status(403).send("forbidden");
  };
}

// Example server usage
const app = express();
app.use(express.json());

app.get(
  "/users",
  authenticateJWT,
  requirePermission("users:read"),
  (req, res) => {
    res.json([{ id: 1, name: "Alice" }]);
  }
);

/* Notes:
 - In production, look up role -> permission mapping from DB or cache (Redis) rather than hardcoding.
 - Keep middleware fast and cache role-permission map to reduce DB calls.
*/

/* ===========================================================================
📌 7. SERVER-SIDE: PERMISSION RESOLUTION PATTERNS
===============================================================================
Options:
  A) Token contains permissions (fast, but stale if roles change)  
  B) Token contains roles; server resolves roles → permissions (fresh but needs DB/cache)  
  C) Use session id in token and read latest session/roles from server DB (most flexible)  

Tradeoffs:
  - A: low server lookups, but must rotate tokens fast after role changes.
  - B: balanced; update role-permission mapping in cache on change.
  - C: safest but more DB calls (use cache).
*/

/* ===========================================================================
📌 8. CLIENT SIDE: HIDE UI ELEMENTS (React Native)
===============================================================================
Client should show/hide buttons or screens for good UX, but server enforces final check.

Example React Native hook + component guard:
*/
import React from "react";
import { View, Button, Text } from "react-native";

// App keeps user info in auth store (after login)
const mockAuthStore = {
  getUser: () => ({ id: 1, roles: ["user"], perms: ["orders:create"] }), // replace with real store
};

export function useAuth() {
  // simple helper: in real app use context or redux
  const user = mockAuthStore.getUser();
  return { user };
}

export function Can({ permission, children, fallback = null }) {
  const { user } = useAuth();
  if (!user) return fallback;
  // check perms or roles -> in client we mirror logic (for UX only)
  if (user.perms && user.perms.includes(permission)) return children;
  // role-based check simple mapping (same as server mapping ideally)
  const roleToPerms = {
    admin: ["users:read"],
    manager: ["orders:create"],
    user: ["orders:create"],
  };
  const allowed = (user.roles || []).some((r) =>
    (roleToPerms[r] || []).includes(permission)
  );
  return allowed ? children : fallback;
}

/* Usage in UI:
<Can permission="orders:refund">
  <Button title="Refund" onPress={...} />
</Can>
*/

/* ===========================================================================
📌 9. ROUTE GUARDS (React Navigation example)
===============================================================================
- Prevent navigation to screens if user lacks permission.
*/
import { useNavigation } from "@react-navigation/native";

export function useRequirePermission(permission) {
  const navigation = useNavigation();
  const { user } = useAuth();
  React.useEffect(() => {
    // very simple example - redirect to "NoAccess" if not allowed
    const allowed =
      (user.perms || []).includes(permission) ||
      (user.roles || []).some((r) => r === "admin");
    if (!allowed) navigation.navigate("NoAccess");
  }, [permission, user]);
}

/* ===========================================================================
📌 10. DYNAMIC / ATTRIBUTE-BASED ACCESS (ABAC) — when RBAC isn't enough
===============================================================================
RBAC is simple but rigid. ABAC (Attribute-Based) uses attributes:
  - user attributes (department, level)
  - resource attributes (ownerId, sensitivity)
  - environment (time, IP)

Example rule: allow "edit:document" if user.role == 'editor' OR user.id == document.ownerId

Hybrid approach: Role + Ownership checks:
  - Check role permission first; if not present, allow if user is owner.
  - Always enforce on server.
*/

/* ===========================================================================
📌 11. ADMIN UI IDEAS (manage roles & permissions)
===============================================================================
- Simple admin screens:
  - List roles
  - Edit role -> add/remove permissions
  - Assign roles to users (search user & assign)
  - Audit log: who changed which role and when

Backend endpoints:
  - GET /admin/roles
  - PATCH /admin/roles/:id
  - POST /admin/users/:id/roles
  - GET /admin/audit
*/

/* ===========================================================================
📌 12. CACHING & PERFORMANCE (server)
===============================================================================
- Cache role→permission map in Redis (TTL and invalidate when admin changes roles).  
- Cache user session (roles) if you use session tokens.  
- Avoid DB query on every request by caching and short TTL tokens.  
- When role mapping changes, invalidate caches and optionally notify servers to reload.
*/

/* ===========================================================================
📌 13. SECURITY NOTES (must follow)
===============================================================================
- Never rely only on client checks. Server is the source of truth.  
- Log authorization failures for security monitoring.  
- Use least privilege: default deny, explicitly allow.  
- Prevent privilege escalation: protect admin endpoints strongly (MFA, IP restrictions).  
- Rotate and audit admin access keys.  
- Prevent horizontal privilege escalation: verify resource ownership on server (user cannot edit another user's data unless authorized).
*/

/* ===========================================================================
📌 14. TESTING (what to test)
===============================================================================
Unit tests:
  - Middleware properly allows/denies based on token payload permutations.
  - Role→permission resolver returns correct sets.

Integration tests:
  - Authorized user can call endpoint; unauthorized cannot.
  - Role change invalidates or updates access according to token strategy.

E2E:
  - Admin assigns role to user; user sees new UI and server allows new API call.
  - Ownership checks: user cannot edit others' resources.
*/

/* ===========================================================================
📌 15. MIGRATION / VERSIONING (if you change permissions)
===============================================================================
- When you add/remove permissions, update DB roles mapping and run migration scripts.  
- Communicate breaking changes to teams.  
- Use feature flags for large permission model changes to roll out safely.
*/

/* ===========================================================================
📌 16. SAMPLE: PERMISSION MATRIX (simple table)
===============================================================================
| Role    | users:read | users:update | orders:create | orders:refund |
|---------|------------|--------------|---------------|----------------|
| admin   |    ✅      |      ✅      |      ✅       |      ✅        |
| manager |    ✅      |      ❌      |      ✅       |      ❌        |
| user    |    ❌      |      ❌      |      ✅       |      ❌        |
*/

/* ===========================================================================
📌 17. PITFALLS & HOW TO AVOID
===============================================================================
✘ Putting authorization only in UI → BIG RISK.  
  → Fix: Always check on server.

✘ Tokens with long TTL containing permissions that can change often.  
  → Fix: use short JWT TTL or session tokens & server-side checks.

✘ Hardcoding role checks all over the codebase.  
  → Fix: centralize checks in middleware & small helper functions.

✘ Giving too many permissions to a role "because it's easier".  
  → Fix: audit and reduce permissions; follow least privilege.

✘ Not auditing role changes → trouble investigating incidents.  
  → Fix: store audit logs for role assignment changes.
*/

/* ===========================================================================
📌 18. CHECKLIST — QUICK (for implementation)
===============================================================================
✔ Design permissions (verb:resource) clearly  
✔ Store roles, permissions, and user-role assignments in DB  
✔ Implement server middleware to enforce permissions  
✔ Add client-side helpers for UI show/hide (but don't trust)  
✔ Use JWT claims + short TTL or server session lookup for freshness  
✔ Add admin UI to manage roles & permissions (with audit logs)  
✔ Cache role→perm mapping and invalidate on change  
✔ Test middleware, edge cases, and ownership scenarios  
✔ Log and monitor authorization failures and suspicious role changes
*/

/* ===========================================================================
📌 19. INTERVIEW Q&A (BEGINNER-FRIENDLY)
===============================================================================
Q1: What is RBAC?  
A: Role-Based Access Control; map roles to permissions and assign roles to users.

Q2: Where should authorization be enforced?  
A: Always on the server. Client checks are only for UX.

Q3: Should roles be in JWT tokens?  
A: They can be, but tokens must be short-lived or you must support token invalidation when roles change.

Q4: What is the difference between RBAC and ABAC?  
A: RBAC uses roles; ABAC uses attributes (user, resource, environment) for fine-grained rules.

Q5: How do you prevent privilege escalation?  
A: Principle of least privilege, server-only enforcement, audit logs, and secure admin controls (MFA).

Q6: How to handle per-resource ownership rules?  
A: Combine RBAC with ownership checks on server (e.g., allow edit if role permits OR user is resource.owner).
*/

/* ===========================================================================
📌 20. FINAL CHEAT-SHEET (ONE-PAGE)
===============================================================================
1) Model roles & permissions clearly (verb:resource).  
2) Enforce permission checks on server via middleware.  
3) Use JWT or sessions — keep tokens short-lived if they contain roles.  
4) Client: hide UI using same logic for UX but never rely on it.  
5) Provide admin UI + audit logs for role management.  
6) Cache for performance, invalidate on changes. 7) Test, monitor, and follow least privilege.
*/

/* ===========================================================================
📌 21. WANT NEXT?
===============================================================================
I can produce in the same single-file JS notes format:
  ✅ Full server implementation: DB schema (Postgres), role-permission SQL migrations, middleware, and caching with Redis  
  ✅ Client: React Navigation route protection & admin UI example for role assignment + sample screens  
  ✅ Advanced: attribute-based access control (ABAC) design and rules engine example (casbin or custom)
Pick one and I’ll produce it in this same beginner-friendly single-file JS Notes style.
*/
