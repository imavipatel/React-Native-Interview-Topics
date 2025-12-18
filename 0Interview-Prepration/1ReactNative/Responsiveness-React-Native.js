/**
 * react-native-responsive-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES (Beginner Friendly)
 *
 * "How I would handle responsiveness in React Native"
 *
 * - Very simple language for beginners
 * - Full coverage: principles, APIs, patterns, examples, libraries, testing, checklist, Q&A
 * - Copy-paste into your notes repo and adapt to your project.
 */

/* ===========================================================================
📌 0. SHORT GOAL (one-line)
===============================================================================
Make the UI look good and work well on many screen sizes, orientations, and device types.
*/

/* ===========================================================================
📌 1. PRINCIPLES (very simple)
===============================================================================
- Design for multiple sizes: phones, phablets, tablets, foldables.  
- Prefer flexible layout (Flexbox) over hard-coded positions.  
- Use relative sizing (percent / flex / aspectRatio) where possible.  
- Treat typography, spacing, and touch targets as responsive too.  
- Test on real devices and simulators (portrait + landscape).
*/

/* ===========================================================================
📌 2. CORE TOOLS / APIS IN RN (beginner-friendly)
===============================================================================
- Flexbox (default RN layout) → primary tool for responsive layouts.  
- Dimensions API → get window/screen width & height.  
- useWindowDimensions() → hook that updates on rotation/resizes.  
- onLayout callback → measure individual component size at runtime.  
- PixelRatio → handle pixel density (scaling images, fonts).  
- SafeAreaView → respect notches / insets.  
- Platform / Platform.select → platform-specific tweaks (iOS vs Android).
*/

/* ===========================================================================
📌 3. FLEXBOX (the foundation)
===============================================================================
- Use flex, flexDirection, justifyContent, alignItems to adapt automatically.
- Example: horizontal list that wraps space with flex values instead of fixed widths.
- Flex makes components expand/shrink with available space — ideal for most responsiveness.
*/

/* ===========================================================================
📌 4. DIMENSIONS & useWindowDimensions (practical)
===============================================================================
- Dimensions.get('window') is static unless you listen to change events.
- useWindowDimensions() is React-friendly and updates on orientation changes.

Example:
*/
import React from "react";
import { View, Text, useWindowDimensions } from "react-native";

export function WindowSizeExample() {
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>width: {Math.round(width)} px</Text>
      <Text>height: {Math.round(height)} px</Text>
      <Text>orientation: {isPortrait ? "portrait" : "landscape"}</Text>
    </View>
  );
}

/* ===========================================================================
📌 5. onLayout (measure single component)
===============================================================================
- Use when you need the exact size of a view after layout.
- Useful for adaptive children based on parent size.

Example:
*/
import React, { useState } from "react";
import { View } from "react-native";

export function MeasuredBox() {
  const [boxWidth, setBoxWidth] = useState(0);

  return (
    <View
      style={{ flex: 1, padding: 16 }}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setBoxWidth(width);
      }}
    >
      <View
        style={{
          width: boxWidth * 0.5,
          height: 100,
          backgroundColor: "skyblue",
        }}
      />
    </View>
  );
}

/* ===========================================================================
📌 6. RELATIVE SIZING STRATEGIES
===============================================================================
- flex: for layout distribution (preferred for many cases).
- percentages (width: '80%'): good for width relative to parent.
- aspectRatio: ensures consistent proportions for images/cards.
- rem-like patterns: base scale for fonts/spacing derived from screen width/height.
*/

/* ===========================================================================
📌 7. PIXEL RATIO & FONT SCALING
===============================================================================
- PixelRatio.get() gives device pixel density (1, 2, 3...).
- Respect user font-size accessibility settings (allowTextScaling).
- Use scaled font helpers to keep typography readable across densities.

Simple font scaling helper:
*/
import { PixelRatio } from "react-native";

const guidelineBaseWidth = 360; // design width (example)
export const scaleSize = (size) =>
  size *
  (PixelRatio.get() * 0.5 + 0.5) *
  Math.min(1, (PixelRatio.get() * 360) / guidelineBaseWidth);
export const scaleFont = (size) =>
  Math.round(PixelRatio.roundToNearestPixel(size * useWindowWidthFactor()));

function useWindowWidthFactor() {
  // Simple example: shrink/expand fonts by screen width relative to guideline
  // In real app use useWindowDimensions inside a hook. Kept simple here.
  return 1; // placeholder — use adaptive logic in real project
}

/* ===========================================================================
📌 8. SAFEAREAVIEW & INSETS
===============================================================================
- Use SafeAreaView to avoid notches and status bars.
- For more control, use react-native-safe-area-context to get insets and adapt padding.
*/

/* ===========================================================================
📌 9. ADAPTIVE COMPONENT PATTERNS (practical examples)
===============================================================================
A) Two-column layout on tablets, single column on phones
*/
import { Dimensions, StyleSheet } from "react-native";

const windowWidth = Dimensions.get("window").width;
const isTablet = windowWidth >= 768; // simple breakpoint

const styles = StyleSheet.create({
  container: {
    flexDirection: isTablet ? "row" : "column",
  },
  left: {
    flex: isTablet ? 1 : 0,
    width: isTablet ? undefined : "100%",
  },
  right: {
    flex: isTablet ? 2 : 0,
    width: isTablet ? undefined : "100%",
  },
});

/*
B) Responsive image using aspectRatio
*/
export function ResponsiveImage() {
  return (
    <View
      style={{ width: "100%", aspectRatio: 16 / 9, backgroundColor: "#ddd" }}
    />
  );
}

/* ===========================================================================
📌 10. BREAKPOINTS & LAYOUT RULES
===============================================================================
- Use simple breakpoints: phone < 600, tablet 600–900, large-tablet > 900 (example).
- Keep rules: at breakpoint X switch layout, font scale, and padding.
- Centralize breakpoints in one file for consistency.
*/

/* ===========================================================================
📌 11. LIBRARIES THAT HELP (optional)
===============================================================================
- react-native-responsive-screen (widthPercentageToDP / heightPercentageToDP)
- react-native-size-matters (scale, verticalScale)
- react-native-responsive-fontsize
- react-native-safe-area-context (insets)
- styled-system / responsive props (for RN Web or cross-platform design systems)
- react-native-device-info (detect tablet, device type)
NOTE: Libraries help but understand basics first.
*/

/* ===========================================================================
📌 12. IMAGES & ASSETS (tips)
===============================================================================
- Provide multiple image resolutions (@1x, @2x, @3x) to fit densities.
- Use aspectRatio to avoid layout shift while image loads.
- For large background images, prefer resized assets from server to save memory.
- Vector icons (svg) scale nicely; use react-native-svg or vector-icons.
*/

/* ===========================================================================
📌 13. TOUCH TARGETS & SPACING (UX)
===============================================================================
- Keep tappable targets >= 44–48dp for comfortable touch across devices.
- Increase spacing and font sizes on larger devices.
- Ensure hitSlop for small controls if necessary.
*/

/* ===========================================================================
📌 14. ORIENTATION & LAYOUT CHANGES
===============================================================================
- Handle orientation changes using useWindowDimensions or Dimensions.addEventListener('change').
- Reflow content; do not rely on fixed heights in landscape.
- Remember keyboard can affect layout — use KeyboardAvoidingView for inputs.
*/

/* ===========================================================================
📌 15. TABLET & LARGE SCREEN CONSIDERATIONS
===============================================================================
- Use more columns, sidebars, or master-detail UIs.
- Show extra information instead of hiding it behind screens.
- Increase paddings & font sizes to avoid huge empty spaces.
- Consider modal sizes and split views for landscape tablets.
*/

/* ===========================================================================
📌 16. PERFORMANCE (keep it smooth)
===============================================================================
- Avoid expensive re-renders on resize events — debounce heavy computations.
- useWindowDimensions updates on every size change — memoize style calculations.
- Prefer static StyleSheet.create for static styles; compute dynamic styles in hooks.
- Avoid nested onLayout calls for many children — batched measurement is heavy.
*/

/* ===========================================================================
📌 17. ACCESSIBILITY (a11y)
===============================================================================
- Respect accessibility font size — do not disable allowFontScaling unless necessary.
- Test with large font sizes and screen magnification.
- Ensure color contrast and readable typography at all sizes.
*/

/* ===========================================================================
📌 18. TESTING RESPONSIVENESS (manual & automated)
===============================================================================
Manual:
  - Test multiple simulators/devices (small phone, big phone, tablet).
  - Test portrait & landscape.
  - Test with different font sizes (Accessibility settings).
Automated:
  - Snapshot tests with different dimensions (set window size).
  - E2E tests: simulate orientation change and assert layout.
*/

/* ===========================================================================
📌 19. COMMON PATTERNS & SNIPPETS
===============================================================================
A) Hook: useResponsiveValue (choose value based on width)
*/
import { useWindowDimensions as _useWindowDimensions } from "react-native";

export function useResponsiveValue({ small, medium, large }) {
  const { width } = _useWindowDimensions();
  if (width >= 900) return large;
  if (width >= 600) return medium;
  return small;
}

/* Usage:
const padding = useResponsiveValue({ small: 8, medium: 12, large: 20 });
*/

/* ===========================================================================
📌 20. BEST PRACTICES (beginner-friendly)
===============================================================================
✔ Start with flexible layouts (flex, percentages, aspectRatio).  
✔ Centralize breakpoints and responsive helpers.  
✔ Avoid fixed pixel sizes unless necessary.  
✔ Use vector assets for icons; sized assets for photos.  
✔ Respect accessibility (font scaling & touch targets).  
✔ Test on multiple devices & orientations.  
✔ Memoize calculations and debounce expensive layout logic.
*/

/* ===========================================================================
📌 21. CHECKLIST — QUICK (for each responsive feature)
===============================================================================
✔ UI adapts from small→large (single-column → multi-column)  
✔ Fonts scale and remain readable with accessibility settings  
✔ Images preserve aspect ratio and don't overflow  
✔ Touch targets meet minimum size (44–48dp)  
✔ Safe area respected on notched devices  
✔ No layout thrash on rotation (debounced heavy work)  
✔ Performance tested on low-end devices
*/

/* ===========================================================================
📌 22. INTERVIEW Q&A (BEGINNER-FRIENDLY)
===============================================================================
Q1: How do you detect orientation changes?
A: Use useWindowDimensions() or listen to Dimensions change events.

Q2: When to use onLayout?
A: Use onLayout when you need the final measured size of a specific component to compute child sizes or animations.

Q3: Should I hard-code widths in RN?
A: Prefer not to. Use flex, percentages, and aspectRatio. Hard-coded widths can break on different screens.

Q4: How to support tablets?
A: Use breakpoints and switch to multi-column layouts, larger fonts, and increased paddings on tablet sizes.

Q5: How to handle different pixel densities?
A: Provide @1x/@2x/@3x assets, use PixelRatio helpers, and prefer vector icons for scaling.
*/

/* ===========================================================================
📌 23. EXAMPLE: Responsive Card Component (single-file)
===============================================================================
*/
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

export function ResponsiveCard({ title, subtitle, imageUri }) {
  const { width } = useWindowDimensions();
  const isWide = width >= 600;

  return (
    <View
      style={[
        cardStyles.container,
        isWide ? cardStyles.row : cardStyles.column,
      ]}
    >
      <Image
        source={{ uri: imageUri }}
        style={[
          cardStyles.image,
          isWide ? cardStyles.imageWide : cardStyles.imageNarrow,
        ]}
      />
      <View style={cardStyles.content}>
        <Text numberOfLines={2} style={cardStyles.title}>
          {title}
        </Text>
        <Text numberOfLines={3} style={cardStyles.subtitle}>
          {subtitle}
        </Text>
      </View>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "white",
    elevation: 2,
    margin: 8,
  },
  row: { flexDirection: "row" },
  column: { flexDirection: "column" },
  image: { width: "100%", height: undefined, aspectRatio: 16 / 9 },
  imageWide: { width: 160, height: 120, aspectRatio: undefined },
  imageNarrow: { width: "100%", height: undefined, aspectRatio: 16 / 9 },
  content: { padding: 12, flex: 1 },
  title: { fontSize: 16, fontWeight: "600" },
  subtitle: { fontSize: 14, color: "#444", marginTop: 4 },
});

/* ===========================================================================
📌 24. FINAL CHEAT-SHEET (ONE-PAGE)
===============================================================================
1) Use Flexbox first. 2) useWindowDimensions for responsive decisions. 3) Use percent / aspectRatio for images. 4) Respect SafeArea and accessibility. 5) Test on multiple screen sizes and orientations. 6) Centralize breakpoints and scaling helpers. 7) Avoid hard-coded pixel sizes; prefer small, tested persisted rules.
*/

/* ===========================================================================
📌 25. WANT NEXT?
===============================================================================
I can produce in the same simple notes format:
  ✅ Practical guide: building a responsive design system (tokens, breakpoints, components)  
  ✅ Exact code: responsive typography system with scaledFonts + accessibility support  
  ✅ Example: Responsive grid & masonry layout for React Native (phone → tablet)
Pick one and I’ll produce it in this same beginner-friendly single-file JS Notes style.
*/

/**
 * responsive-scale.js
 *
 * SCALE HELPERS USED IN ALL FUTURE NOTES
 *
 * - Uses screen width/height to scale UI sizes
 * - Works for Android + iOS
 * - Prevents over-scaling on tablets & large screens
 * - Exposes: s, vs, ms, mvs
 */

/*
import { Dimensions, Platform } from 'react-native';

const round = (value: number): number => {
  let rounded = Math.round(value);
  // ensure even number to avoid pixel rounding issues
  if (rounded % 2) rounded++;
  return rounded;
};

const { width, height } = Dimensions.get('screen');
const [shortDimension, longDimension] =
  width < height ? [width, height] : [height, width];

// Designed for a baseline 360 × 800 mobile screen
const guidelineBaseWidth = 360;
const guidelineBaseHeight = 800;

// Horizontal scale
export const scale = (size: number): number => {
  // Do not scale excessively on large devices (Android tablets)
  if (width > 500 && Platform.OS === 'android') return size;
  return round((shortDimension / guidelineBaseWidth) * size);
};

// Vertical scale
export const verticalScale = (size: number): number => {
  // Prevent extreme scaling on large Android screens
  if (height > 950 && Platform.OS === 'android') return size;
  return round((longDimension / guidelineBaseHeight) * size);
};

// Balanced scaling (good default)
export const moderateScale = (size: number, factor = 0.5): number =>
  round(size + (scale(size) - size) * factor);

// Balanced vertical scaling
export const moderateVerticalScale = (size: number, factor = 0.5): number =>
  round(size + (verticalScale(size) - size) * factor);

export const s = scale;
export const vs = verticalScale;
export const ms = moderateScale;
export const mvs = moderateVerticalScale;

*/
