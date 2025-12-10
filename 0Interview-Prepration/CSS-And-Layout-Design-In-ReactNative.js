/*
Q1. How css works in react native how layout get decides

/**
 * react-native-layout-notes.js
 *
 * Single-file, easy-to-read React Native layout + "CSS" notes.
 * - Comments explain concepts in simple language
 * - Includes a runnable Example component and styles
 * - Compact cheat-sheet at the bottom for interviews
 *
 * Paste into your project (or open in VSCode / Notion / Obsidian).
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";

/* ===========================================================================
   1. HOW "CSS" WORKS IN REACT NATIVE — plain language
   ===========================================================================
   - React Native does NOT use browser CSS files. Instead you use JavaScript
     objects to define styles, usually with StyleSheet.create().
   - There is no CSS cascade or selectors; styles are combined explicitly:
     style={[base, override]}.
   - Layout is done by the Yoga engine (a Flexbox-based layout system).
   - Values are numbers representing density-independent pixels (dp). Use
     strings like '50%' for percentages.
   - Style props map directly to native view properties (UIView / Android View).
*/

/* ===========================================================================
    2. HOW LAYOUT IS DECIDED (YOGA flow) — simple steps
    ===========================================================================
    1) React builds a tree of components (View, Text, Image).
    2) Each node has a style object (width, flex, padding, etc).
    3) Yoga measures and runs a Flexbox pass to decide sizes and positions.
    4) Yoga outputs exact frames (x, y, width, height) for each native view.
    5) Native UI is updated with those frames.
    Re-layout happens on prop/state changes, dimension/orientation change,
    or when parent/child styles change.
*/

/* ===========================================================================
   3. FLEXBOX RULES (the ones you'll use most)
   ===========================================================================
   - Default flexDirection in RN is 'column' (vertical layout).
   - Main axis: controlled by flexDirection.
   - justifyContent: space distribution along main axis (start/center/...).
   - alignItems: alignment on cross axis (stretch/center/...).
   - flex: shorthand for grow/shrink/basis. `flex: 1` fills remaining space.
   - alignSelf: override per-child alignment.
   - position: 'absolute' removes the view from normal flow and uses
     top/right/bottom/left for placement.
*/

/* ===========================================================================
   4. WORKING EXAMPLE — copy into a screen file and run
   ===========================================================================
   - Demonstrates column container, a header, a two-column row, and footer.
*/
export default function Example() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>Header</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.text}>Left</Text>
        </View>

        <View style={styles.right}>
          <Text style={styles.text}>Right (flex)</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.text}>Footer</Text>
      </View>
    </View>
  );
}

/* ===========================================================================
   Styles for the example — use StyleSheet.create for small perf benefit
   ===========================================================================
*/
const styles = StyleSheet.create({
  container: {
    flex: 1, // take full screen space
    padding: 16,
    backgroundColor: "#ffffff",
  },

  header: {
    height: 60, // fixed header height
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f4f7",
    borderRadius: 8,
  },

  row: {
    flex: 1, // take remaining vertical space between header & footer
    flexDirection: "row", // children laid out horizontally
    marginVertical: 12,
    gap: 8, // Android/iOS support for gap may vary; keep for clarity
  },

  left: {
    width: 100, // fixed column width
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e6f7ff",
    borderRadius: 8,
  },

  right: {
    flex: 1, // fills rest of the horizontal space
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff7e6",
    borderRadius: 8,
  },

  footer: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f0ff",
    borderRadius: 8,
  },

  text: {
    fontSize: 16,
  },
});

/* ===========================================================================
   5. PERCENTAGES, INTRINSIC SIZE & STRETCH — short notes
   ===========================================================================
   - Percentages: use strings like width: '50%'; values are relative to the
     parent size which must be known (not undefined).
   - Intrinsic content: Text and Image have natural sizes. If you don't give a
     size, Yoga may measure the content to decide layout.
   - alignItems: 'stretch' will stretch children on cross-axis if they don't
     specify a cross-axis size.
*/

/* ===========================================================================
   6. STYLE MERGING — how to override safely
   ===========================================================================
   - There is no cascade. Merge styles explicitly with arrays:
       <View style={[baseStyle, isError && errorStyle]} />
   - Later entries in the array override earlier ones.
*/

/* ===========================================================================
   7. PERFORMANCE TIPS (keep layouts fast)
   ===========================================================================
   - Use StyleSheet.create for static styles to get small optimization.
   - Avoid creating style objects inline in render when possible:
       // bad: style={{ margin: someValue }}
       // better: memoize or use StyleSheet
   - Reduce deep nesting of Views; each extra node costs layout work.
   - For list-heavy UIs, use FlatList with getItemLayout when possible.
   - For animations, prefer native drivers (reanimated or Animated with
     useNativeDriver) so layout/animation work is off the JS thread.
*/

/* ===========================================================================
   8. ABSOLUTE POSITIONING VS FLEXBOX — when to use which
   ===========================================================================
   - Use absolute positioning for overlays, floating buttons, badges, etc.
   - For responsive, flow-based layouts prefer Flexbox.
   - Absolute removes the element from normal layout flow — use carefully.
*/

/* ===========================================================================
   9. PLATFORM DIFFERENCES — watch outs
   ===========================================================================
   - Shadows:
       iOS: shadowColor, shadowOffset, shadowOpacity, shadowRadius
       Android: elevation
   - Text / font metrics may vary across platforms; test on both iOS & Android.
   - Some style props behave slightly differently on each platform.
*/

/* ===========================================================================
   10. COMMON INTERVIEW QUESTIONS & SHORT ANSWERS
   ===========================================================================
   Q: How does RN calculate layout?
   A: Yoga (Flexbox) measures the tree and returns frames (x,y,width,height).

   Q: Default flexDirection?
   A: 'column' (vertical stacking)

   Q: flex:1 vs width: '100%'?
   A: flex:1 fills remaining space along the main axis; width:'100%' sets only width.

   Q: Units for sizes?
   A: Numbers → density-independent pixels (dp). Percentages use strings.

   Q: What triggers re-layout?
   A: Style changes, size changes, prop/state changes, orientation changes.

   Q: How to debug?
   A: Use the RN Inspector (Dev Menu), add borders, and use onLayout to log sizes.
*/

/* ===========================================================================
   11. QUICK CHEAT-SHEET (one-line reminders)
   ===========================================================================
   - flexDirection default = 'column'
   - flex: 1  => fill remaining space
   - justifyContent => main axis alignment (start / center / space-between)
   - alignItems     => cross axis alignment (stretch / center)
   - StyleSheet.create() for static styles
   - No CSS cascade — merge via style arrays
   - Use absolute positioning sparingly
   - Percentages need a parent with known size
*/

/* ===========================================================================
   Extra: Small debugging snippet (uncomment to use in a component)
   ---------------------------------------------------------------------------
   // Example: use onLayout to read final size of a view
   // <View onLayout={(e) => console.log('size', e.nativeEvent.layout)}>
   //   ...
   // </View>
   ===========================================================================
*/
