/**
 * react-native-yoga-layout-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES (Beginner Friendly)
 *
 * "How Yoga Layout Engine Works in React Native (Very Simple Explanation)"
 *
 * - Very simple language for beginners
 * - Explains Flexbox, layout tree, measure, dirtiness, passes, caching,
 *   why Yoga is fast, how React Native uses it, examples, Q&A
 * - Copy–paste into your notes repo.
 */

/* ===========================================================================
📌 0. SHORT GOAL (one-line)
===============================================================================
Understand how React Native calculates layout using Yoga (Facebook’s cross-platform Flexbox engine).
*/

/* ===========================================================================
📌 1. WHAT IS YOGA? (beginner-friendly)
===============================================================================
Yoga = a tiny, very fast **layout engine** written in C/C++.

Its job:
  ✔ Read your `style` props (flexbox rules)  
  ✔ Build a **layout tree**  
  ✔ Calculate the position (x, y) and size (width, height) of every view  
  ✔ Send final layout to native UI layer (iOS/Android)

Yoga is NOT rendering. It only **calculates positions and sizes**.
*/

/* ===========================================================================
📌 2. WHY REACT NATIVE USES YOGA?
===============================================================================
Because:
  ✔ Same layout code for iOS + Android (no duplication)  
  ✔ Very fast (written in C)  
  ✔ Deterministic and predictable  
  ✔ Fully supports Flexbox  

React Native calls Yoga every time views need new layout:
  - new render  
  - state/props change  
  - orientation changes  
  - parent size change  
*/

/* ===========================================================================
📌 3. MAIN IDEA: THE LAYOUT TREE
===============================================================================
React Native builds a "shadow tree" (a lightweight copy of your React components).
This tree:
  ✔ Contains layout styles (flexbox)  
  ✔ Is NOT the actual UI — it's like a blueprint  
  ✔ Is passed to Yoga  

Yoga walks this tree and generates:
  - layout.x
  - layout.y
  - layout.width
  - layout.height

Then native UI uses these final numbers to place real views.
*/

/* ===========================================================================
📌 4. HOW YOGA DECIDES SIZE (very simple)
===============================================================================
Yoga checks these rules in order:

1) **Exact Size**  
   - If you give width/height directly → it uses those values.

2) **Parent Constraints**  
   - If parent has fixed size → child must fit inside.

3) **Flexbox Rules**  
   - flexDirection  
   - flexGrow  
   - flexShrink  
   - flexBasis  

4) **Content Measurement**  
   - If component has text or image, Yoga asks:
       “How big do you want to be?”  
     (using a measure function)

5) **Minimum / Maximum Size**  
   - minWidth, maxHeight, etc.

Yoga always tries:
  - Take as much space as allowed  
  - Follow constraints  
  - Balance children inside the parent  
*/

/* ===========================================================================
📌 5. FLEXBOX BASICS THAT YOGA UNDERSTANDS
===============================================================================
Yoga implements most of CSS Flexbox:

✔ flexDirection: 'row' | 'column'  
✔ justifyContent: flex-start, center, space-between  
✔ alignItems: flex-start, center, stretch  
✔ flexGrow / flexShrink  
✔ flexBasis  
✔ margin / padding / border  
✔ aspectRatio  

IMPORTANT:
Yoga uses **no CSS** — only style objects in React Native.
*/

/* ===========================================================================
📌 6. TWO LAYOUT PASSES (concept)
===============================================================================
Yoga does layout in two phases:

1) **Measure pass**  
   - It checks how much space each child wants.
   - Asks custom components “What size do you want?” (measure function).

2) **Layout pass**  
   - It positions elements based on flexbox rules.
   - Calculates final x/y/width/height.

Why two passes?
 → Because parents depend on children and children depend on parents.
*/

/* ===========================================================================
📌 7. DIRTY NODES (very important)
===============================================================================
Yoga does NOT recalc everything on every render.  
It marks only changed nodes as **dirty**.

A node becomes dirty when:
  - style changes (width, flex, margin, etc.)
  - text changes inside a Text component
  - measure function changes

Yoga will only recalculate dirty nodes → this makes it super fast.
*/

/* ===========================================================================
📌 8. LAYOUT CACHING
===============================================================================
Yoga caches layout results.

If:
  - style didn't change  
  - parent constraints didn't change  

Yoga uses **old layout results** → no re-calculation.

This is why React Native layouts are cheap and smooth.
*/

/* ===========================================================================
📌 9. MEASURE FUNCTION (when content size is unknown)
===============================================================================
Some components (e.g., Text) cannot know their size until content is measured.

Yoga asks:

measure(widthConstraint, heightConstraint)


The component returns:


{ width: X, height: Y }

This allows:
  - dynamic text  
  - images  
  - custom views with content  

React Native Text uses this heavily.
*/

/* ===========================================================================
📌 10. HOW REACT NATIVE USES YOGA (HIGH LEVEL PIPELINE)
===============================================================================
1) Your JSX → Converted into Fiber nodes (React)  
2) Fiber nodes → Shadow nodes (React Native)  
3) Shadow nodes → Sent to Yoga  
4) Yoga computes layout  
5) Layout output → Sent to native UIView (iOS) / ViewGroup (Android)  
6) Native UI renders based on final layout numbers  

Yoga never does rendering.  
It just returns numbers.
*/

/* ===========================================================================
📌 11. SIMPLE EXAMPLE: FLEX LAYOUT
===============================================================================
*/
import React from "react";
import { View, Text } from "react-native";

export function FlexExample() {
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <View style={{ flex: 1, backgroundColor: "red" }} />
      <View style={{ flex: 2, backgroundColor: "green" }} />
      <View style={{ flex: 1, backgroundColor: "blue" }} />
    </View>
  );
}

/*
Yoga will calculate:
 total flex = 1 + 2 + 1 = 4 parts
 red   → 1/4 of width
 green → 2/4 of width
 blue  → 1/4 of width
*/

/* ===========================================================================
📌 12. WHY YOGA IS FAST (summary)
===============================================================================
✔ Written in C → low-level, fast memory operations  
✔ Dirty-tree algorithm → recompute only changed nodes  
✔ Caching → skip repeated computations  
✔ Simple layout model (Flexbox core only)  
✔ Cross-platform: same computation for iOS + Android  
*/

/* ===========================================================================
📌 13. LIMITATIONS (beginner-friendly)
===============================================================================
Yoga does NOT support:
✘ CSS Grid  
✘ percentage-based margins in some cases  
✘ complex text layout features  
✘ CSS cascading  
✘ absolute pixel-perfect HTML behavior  

React Native layout ≠ Web layout  
But 90% of Flexbox is the same.
*/

/* ===========================================================================
📌 14. DEBUGGING YOGA LAYOUT
===============================================================================
Ways to debug:
  ✔ React DevTools (inspector)  
  ✔ Layout animation for debugging  
  ✔ Print shadow tree (dev builds)  
  ✔ Enable "layout debugging" in RN dev menu  

Common issues:
  - flexBasis overrides width  
  - minWidth / maxWidth unexpected behavior  
  - parent not giving constraints → child collapses  
*/

/* ===========================================================================
📌 15. INTERVIEW Q&A (BEGINNER FRIENDLY)
===============================================================================
Q1: What is Yoga in React Native?  
A: A very fast C/C++ layout engine that calculates flexbox-based layout.

Q2: Does Yoga render UI?  
A: No, Yoga only calculates layout. Native platform renders the UI.

Q3: How does Yoga improve performance?  
A: Dirty nodes, caching, and C-optimized layout make recalculations fast.

Q4: Does Yoga support CSS Grid?  
A: No. Only Flexbox and some extra properties like aspectRatio.

Q5: What is the "shadow tree"?  
A: A layout-only tree (no real UI) used by Yoga to calculate final positions.
*/

/* ===========================================================================
📌 16. CHEAT-SHEET (ONE PAGE)
===============================================================================
1️⃣ Yoga = fast flexbox engine → calculates size & position  
2️⃣ React Native creates a shadow tree → Yoga layouts it  
3️⃣ Two passes: measure + layout  
4️⃣ Dirty nodes → recalc only changed parts  
5️⃣ Caching → even faster  
6️⃣ Supports Flexbox (direction, grow, align, shrink)  
7️⃣ Does NOT render UI, only computes numbers  
*/

/* ===========================================================================
📌 17. WANT NEXT?
===============================================================================
I can generate in the same JS notes format:
  ✅ Deep dive: Yoga dirty-tree algorithm  
  ✅ How text measurement works inside Yoga (with diagrams)  
  ✅ Flexbox master notes: all properties + examples  
Just tell me which one you want.
*/
