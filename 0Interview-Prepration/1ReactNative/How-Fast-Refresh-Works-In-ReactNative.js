/**
 * react-native-fast-refresh-complete-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES (Beginner Friendly)
 *
 * "How Fast Refresh Works in React Native + Which Algorithm It Uses +
 *  Does it use Reconciliation? (YES, but indirectly)"
 *
 * This file combines:
 *   ✔ Fast Refresh simple explanation
 *   ✔ The real algorithm behind Fast Refresh (React Refresh Runtime Algorithm)
 *   ✔ How Metro + React + RN work together
 *   ✔ Whether Fast Refresh uses Reconciliation (YES, for UI update)
 *   ✔ Hook signature checks
 *   ✔ When Fast Refresh succeeds/fails
 *   ✔ Interview Q&A + final cheat sheet
 *
 * All content is merged into one easy-to-read note.
 */

/* ===========================================================================
📌 0. WHAT IS FAST REFRESH? (Super Simple)
===============================================================================
Fast Refresh is React Native’s system that updates only the changed parts of your
code instantly — without restarting the whole app and without losing component state.

You save → Metro sends updated file → React swaps only that component → UI updates.

🔥 No app restart  
🔥 No JS engine restart  
🔥 No full reload  
🔥 State preserved (if update is “safe”)  
*/

/* ===========================================================================
📌 1. THE MAIN IDEA (IMPORTANT)
===============================================================================
Fast Refresh = TWO systems working together:

✔ **React Refresh Algorithm**  
   - Decides if your component can be safely updated  
   - Uses hook signatures to check safety  

✔ **React Reconciliation**  
   - Actually updates the UI  
   - Diffs old vs new UI and applies minimal changes  

Think of it as:

Fast Refresh → “Can we hot-swap this component?”  
Reconciliation → “Now update the UI smoothly.”  
*/

/* ===========================================================================
📌 2. DOES FAST REFRESH USE RECONCILIATION? (COMMON QUESTION)
===============================================================================
YES — Fast Refresh ALWAYS triggers React Reconciliation.

But…

❗ Reconciliation is NOT responsible for deciding if the component can be updated.

The flow is:
1) You save a file  
2) Metro sends updated code  
3) React Refresh Algorithm checks hook signatures  
4) If safe → swap component function  
5) React triggers a normal render  
6) React Reconciliation updates ONLY the changed UI

So:

Fast Refresh = Safety check  
Reconciliation = UI diff + update  
*/

/* ===========================================================================
📌 3. FAST REFRESH ALGORITHM (BEGINNER-FRIENDLY EXPLANATION)
===============================================================================
Fast Refresh uses the **React Refresh Runtime Algorithm**, which has 3 parts:

### ⭐ Step 1 — Register
Every component and hook is assigned a “signature” (a fingerprint).

### ⭐ Step 2 — Compare Signatures
When you save:
- Metro sends updated JS function
- React compares NEW signature vs OLD signature

### ⭐ Step 3 — Decide
if (signatures match) {
    SAFE UPDATE → Keep state → Replace function → Re-render
} else {
    UNSAFE UPDATE → Reset component → State lost (but rest of app stays alive)
}

This is the entire core algorithm.
*/

/* ===========================================================================
📌 4. WHAT IS A “HOOK SIGNATURE”? (simple language)
===============================================================================
A hook signature is like a blueprint of your component’s hook usage.

For example:
function Example() {
  useState();    // hook #1
  useEffect();   // hook #2
  useRef();      // hook #3
}

Signature might look like:
[ useState, useEffect, useRef ]

If this order or count changes → unsafe to refresh.

❗ Fast Refresh ONLY works reliably when hook order stays the same.  
*/

/* ===========================================================================
📌 5. WHEN FAST REFRESH CAN KEEP STATE (SAFE UPDATE)
===============================================================================
Fast Refresh preserves state ONLY if:

✔ Component name stays same  
✔ Hook order stays same  
✔ Same number of hooks  
✔ No conditional hook usage  
✔ No top-level return changes  
✔ No relocation of hook logic  

Example safe change:
*/
function MyComp() {
  const [count] = useState(0);
  return <Text style={{ color: "red" }}>{count}</Text>; // Style change → SAFE
}
/*
State is preserved.
*/

/* ===========================================================================
📌 6. WHEN FAST REFRESH MUST RESET STATE (UNSAFE UPDATE)
===============================================================================
❌ Changing hook order  
❌ Adding/removing hooks  
❌ Putting hooks inside conditionals  
❌ Converting function component → class component  
❌ Breaking module exports  
❌ Syntax errors  
❌ Changing module boundaries  

If anything unsafe happens → Fast Refresh falls back:
  “Reload this component only, but keep the rest of the app.”
*/

/* ===========================================================================
📌 7. HOW METRO + FAST REFRESH WORK (FULL FLOW)
===============================================================================
Step-by-step:

1) You save the file  
2) Metro detects the file change  
3) Metro rebuilds ONLY that file (fast incremental compile)  
4) Metro sends updated code to RN app over WebSocket  
5) React Refresh Runtime receives it  
6) It compares component hook signatures  
7) If safe → hot swap component function  
8) React automatically triggers re-render  
9) React Reconciliation updates UI minimally  

⚡ Fast, safe, and state often preserved.  
*/

/* ===========================================================================
📌 8. ROLE OF RECONCILIATION (VERY SIMPLE)
===============================================================================
Reconciliation is React’s normal diffing system.

Its job:
✔ Compare old virtual tree vs new virtual tree  
✔ Update only changed nodes  
✔ Keep DOM/native views stable  
✔ Preserve refs and state when allowed  

Fast Refresh does NOT update UI directly — it only replaces component functions.

Reconciliation does the actual modern rendering work.
*/

/* ===========================================================================
📌 9. VISUAL DIAGRAM (EASY)
===============================================================================

          ┌──────────────┐
          │   You Save   │
          └──────┬───────┘
                 │
        ┌────────▼────────┐
        │ Metro Bundler   │
        │ Rebuilds File   │
        └────────┬────────┘
                 │ sends patch
        ┌────────▼────────┐
        │ React Refresh    │
        │ Compare Signatures│
        └────────┬────────┘
        SAFE?    │         NO?
         YES     │         │
        ┌────────▼───┐     ▼
        │ Replace Fn │   Reset Component
        └────────┬───┘
                 │
        ┌────────▼────────┐
        │ Reconciliation   │
        │ Update UI diff   │
        └──────────────────┘
*/

/* ===========================================================================
📌 10. WHY FAST REFRESH FEELS INSTANT
===============================================================================
Because:
✔ Only one file is recompiled (not whole app)  
✔ JS engine is NOT restarted  
✔ UI tree is NOT recreated  
✔ React only re-renders one small subtree  
✔ Reconciliation updates only changed nodes  

This is extremely efficient.  
*/

/* ===========================================================================
📌 11. COMMON REASONS FAST REFRESH FAILS
===============================================================================
❌ Hook order changed  
❌ Module exports changed  
❌ Error in updated file  
❌ Component defined inside conditional  
❌ Stateless → stateful component swap  
❌ Using unstable babel plugins  
*/

/* ===========================================================================
📌 12. INTERVIEW Q&A (PERFECT ANSWERS)
===============================================================================
Q1: What algorithm does Fast Refresh use?
A: The **React Refresh Runtime Algorithm**, which compares hook signatures to decide if a component can be safely hot swapped.

Q2: Does Fast Refresh use Reconciliation?
A: Yes. After Fast Refresh updates a component function, React Reconciliation updates the UI by diffing old and new virtual trees.

Q3: How does Fast Refresh keep component state?
A: If hook signature matches (same order & count), React replaces component function in memory without remounting it.

Q4: What breaks Fast Refresh?
A: Changing hook order, adding conditional hooks, or modifying component identity.

Q5: What’s the difference between Fast Refresh and Hot Reload?
A: Fast Refresh is reliable, hook-aware, and part of React. Hot Reload was buggy and lost state often.

Q6: Is Fast Refresh used in production?
A: No. It is only for development mode.
*/

/* ===========================================================================
📌 13. FINAL CHEAT-SHEET (1-MINUTE REVISION)
===============================================================================
⭐ Fast Refresh updates only changed components  
⭐ Uses React Refresh Algorithm (hook signature check)  
⭐ Reconciliation updates UI after patch  
⭐ Safe update = same hook order → state preserved  
⭐ Unsafe update = reset component state  
⭐ Metro sends only changed files, making it fast  
⭐ Never put hooks in conditions if you want reliable refresh  
*/

/* ===========================================================================
📌 14. WANT THE NEXT TOPIC?
===============================================================================
I can make beginner-friendly notes on:
  ✅ React Reconciliation Algorithm (very simple)  
  ✅ How Fabric rendering pipeline works  
  ✅ How JavaScript runs inside RN (Hermes vs JSC)  
  ✅ How OTAs (CodePush / Expo Updates) manage JS bundles

Just tell me which one!
*/
