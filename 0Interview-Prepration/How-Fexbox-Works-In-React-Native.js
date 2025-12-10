/**
 * react-native-flexbox-explained.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES:
 * "How Flexbox works in React Native (full internal explanation)"
 *
 * Covers:
 * - How RN implements Flexbox (Yoga engine)
 * - Main axis vs cross axis (VERY important for interviews)
 * - How flex, flexGrow, flexShrink, flexBasis behave
 * - Alignments, spacing, percentage sizes, intrinsic size
 * - Differences from CSS Flexbox
 * - Debugging flex layout
 *
 * Includes: runnable RN example, cheat-sheet, interview Q&A.
 */

/* ===========================================================================
📌 0. WHAT IS FLEXBOX IN REACT NATIVE? (simple English)
===============================================================================
React Native uses its own Flexbox system powered by Facebook’s Yoga layout engine.
Flexbox decides:
  • How children are arranged inside a parent
  • How much space each child gets
  • How elements wrap, grow, shrink
  • Alignment (vertical & horizontal)
  • Final width, height, x, y of every component

Unlike web CSS:
✔ No CSS cascade  
✔ No external CSS  
✔ Layout is computed by Yoga (C++ engine) not the browser  
✔ Default flexDirection = 'column' (VERY IMPORTANT)  
*/

/* ===========================================================================
📌 1. MAIN AXIS vs CROSS AXIS — the most important concept
===============================================================================
flexDirection decides the main axis:

Case A: flexDirection: 'column'  (DEFAULT)
------------------------------------------
Main axis = vertical  
Cross axis = horizontal  

justifyContent → controls VERTICAL alignment  
alignItems → controls HORIZONTAL alignment  

Case B: flexDirection: 'row'
------------------------------------------
Main axis = horizontal  
Cross axis = vertical  

justifyContent → controls HORIZONTAL alignment  
alignItems → controls VERTICAL alignment  

Remember this rule:
💡 “justifyContent = main axis”  
💡 “alignItems = cross axis”
*/

/* ===========================================================================
📌 2. CORE FLEX PROPERTIES (how they work)
===============================================================================

1️⃣ flexDirection  
  'column' (default) | 'row'

2️⃣ flexGrow  
  Child grows to take available space.

3️⃣ flexShrink  
  Child shrinks when space is tight.

4️⃣ flexBasis  
  Initial size before growing/shrinking.

5️⃣ flex (shorthand)  
flex: 1 == flexGrow: 1, flexShrink: 1, flexBasis: 0

Meaning → "take up all remaining space equally with siblings"

6️⃣ justifyContent (main axis)
  - 'flex-start'
  - 'center'
  - 'flex-end'
  - 'space-between'
  - 'space-around'
  - 'space-evenly'

7️⃣ alignItems (cross axis)
  - 'flex-start'
  - 'center'
  - 'flex-end'
  - 'stretch' (default)

8️⃣ alignSelf (override alignItems per child)

9️⃣ gap (new RN versions)
  Adds spacing between children.

*/

/* ===========================================================================
📌 3. HOW YOGA CALCULATES LAYOUT (internal behavior)
===============================================================================
Yoga does:
  1) Collects styles from each View
  2) Builds a Shadow Tree of layout-only nodes
  3) Computes layout using Flexbox algorithm
      - Determine main axis size
      - Distribute remaining space
      - Apply flexGrow/flexShrink rules
      - Align children using justifyContent & alignItems
  4) Produces exact:
        width, height, x, y
     for each node
  5) React Native applies those values to native views (UIView / ViewGroup)

Important:
✔ The layout is computed entirely OFF the JS thread  
✔ Re-layout happens only when: size changes, props change, style changes  
*/

/* ===========================================================================
📌 4. RN FLEXBOX DIFFERENCES FROM WEB CSS
===============================================================================
React Native does NOT support:
⛔ flex-wrap (only experimental, mostly unsupported)  
⛔ percentage margins/padding (supported only for width/height)

React Native defaults:
✔ flexDirection = 'column' (web = row)  
✔ alignItems = 'stretch' (stretches width/height along cross axis)  
✔ Supports numbers (dp), not px/em/rem  

Also:
✔ text nodes have intrinsic content size  
✔ images measure intrinsic width/height unless given  
*/

/* ===========================================================================
📌 5. RUNNABLE EXAMPLE (copy to an RN project)
===============================================================================
*/

import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function FlexDemo() {
  return (
    <View style={styles.container}>
      <View style={styles.box1}>
        <Text>Box 1</Text>
      </View>

      <View style={styles.box2}>
        <Text>Box 2 (flex: 1)</Text>
      </View>

      <View style={styles.box3}>
        <Text>Box 3</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // Main axis = horizontal
    height: 120,
    borderWidth: 2,
    padding: 10,
  },
  box1: {
    width: 80,
    backgroundColor: "#ffd7d1",
    justifyContent: "center",
    alignItems: "center",
  },
  box2: {
    flex: 1, // fills remaining space
    backgroundColor: "#d1ffd7",
    justifyContent: "center",
    alignItems: "center",
  },
  box3: {
    width: 60,
    backgroundColor: "#d1d9ff",
    justifyContent: "center",
    alignItems: "center",
  },
});

/*
OUTPUT EXPLANATION:
Box1 = fixed 80 width
Box3 = fixed 60 width
Box2 = flex: 1 → takes ALL other horizontal space
*/

/* ===========================================================================
📌 6. HOW flexGrow / flexShrink REALLY WORK
===============================================================================
Imagine total available main-axis size = 300px.

Case A: Grow ↓
------------------------------------
Child A: flexGrow: 1  
Child B: flexGrow: 2  

Remaining space = distributed in ratio 1:2  
→ B gets twice as much extra space as A  

Case B: Shrink ↓
------------------------------------
If layout overflow happens:
Child shrink weight = flexShrink  
Higher shrink → shrinks more  
*/

/* ===========================================================================
📌 7. ALIGNMENT RULES (super important)
===============================================================================
Main Axis = justifyContent
Cross Axis = alignItems

Examples:

flexDirection: 'column'
-------------------------
Main (vertical):
justifyContent: 'center'

Cross (horizontal):
alignItems: 'flex-end'

flexDirection: 'row'
-------------------------
Main (horizontal):
justifyContent: 'space-between'

Cross (vertical):
alignItems: 'center'
*/

/* ===========================================================================
📌 8. PERCENTAGES & AUTO SIZING
===============================================================================
✔ width: '50%' → works  
✔ height: '50%' → works  
✔ margin/padding: '10%' → NOT supported  

Intrinsic size:
- Text: sizes to content
- Image: needs width/height or uses natural size  

stretch:
If alignItems: 'stretch' AND child has no size on cross axis:
→ child expands automatically in cross axis  
*/

/* ===========================================================================
📌 9. PERFORMANCE NOTES (REAL PROJECT TIPS)
===============================================================================
✔ Reduce deep nested flex views → fewer Yoga calculations  
✔ Avoid layout thrashing by not changing width/height too often  
✔ Use flex: 1 instead of calculating device width manually  
✔ Heavy lists → use FlatList + getItemLayout  
✔ Debug layout with:
    - borderWidth for debugging
    - RN Inspector "Layout" tab
*/

/* ===========================================================================
📌 10. DEBUGGING FLEXBOX (tools & tricks)
===============================================================================
1) Turn on “Inspector” → check boxes & bounds  
2) Add borders:
    container: { borderWidth: 1, borderColor: 'red' }
3) Use onLayout:
    <View onLayout={(e)=>console.log(e.nativeEvent.layout)} />
4) Use percentage widths for consistent scaling  
5) Check parent container flexDirection BEFORE debugging children  
*/

/* ===========================================================================
📌 11. INTERVIEW Q&A (you WILL get these)
===============================================================================
Q1: Default flexDirection in RN?
A: 'column'  

Q2: justifyContent vs alignItems?
A:
- justifyContent → main axis  
- alignItems → cross axis  

Q3: What does flex: 1 do?
A: flexGrow: 1 + flexShrink: 1 + flexBasis: 0 → fill remaining space  

Q4: Does React Native support flex-wrap?
A: Mostly "no" (not reliable yet).  

Q5: How does Yoga compute layout?
A:
- Builds shadow tree  
- Applies Flexbox algorithm  
- Outputs x,y,width,height  
- RN mounts native views  

Q6: How to make one child expand?
A: Use flex: 1 (or flexGrow > 0).  

Q7: How to center content?
A: flexDirection: 'row' or 'column', then:
   justifyContent: 'center'
   alignItems: 'center'
*/

/* ===========================================================================
📌 12. FLEXBOX CHEAT-SHEET (memorize quickly)
===============================================================================
⭐ flexDirection default = column  
⭐ justifyContent = main axis alignment  
⭐ alignItems = cross axis alignment  
⭐ flex: 1 → fill remaining space  
⭐ alignSelf → override cross-axis alignment  
⭐ NO CSS cascade, NO flex-wrap (mostly)  
⭐ Yoga engine computes layout off the JS thread  
⭐ Use percentage for width/height, not margin/padding  
*/

/* ===========================================================================
📌 13. WANT NEXT?
===============================================================================
I can generate:
  ✅ "How Yoga works internally (step-by-step layout algorithm)"
  ✅ "Flexbox deep dive with animations & measurement"
  ✅ "Common Flex mistakes and how to fix them (RN-specific)"
  ✅ "Interview problem set: Flexbox challenges with solutions"

Just tell me — I will produce it in this same single-file JS Notes style.
*/
