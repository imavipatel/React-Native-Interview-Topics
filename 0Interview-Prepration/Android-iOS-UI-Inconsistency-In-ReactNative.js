/**
 * react-native-cross-platform-ui-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES (Beginner Friendly)
 *
 * "How I would handle UI inconsistency between Android and iOS"
 *
 * - Very simple language for beginners
 * - Full coverage: principles, platform differences, code patterns,
 *   components, styling tips, testing, checklist, and interview Q&A
 * - Uses your scale helpers (s, vs, ms, mvs) for consistent sizing
 * - Copy-paste into your notes repo and adapt to your project.
 */

/* ===========================================================================
📌 0. SHORT GOAL (one-line)
===============================================================================
Make the app look and feel right on both platforms while keeping shared UI code.
*/

/* ===========================================================================
📌 1. PRINCIPLES (very simple)
===============================================================================
- Prefer **shared UI** (same code) for most things, but **respect platform conventions**.  
- Keep a small set of platform-specific rules, not many scattered if/else.  
- Use design tokens (colors, spacing, fonts) so one change fixes many places.  
- Test on real Android & iOS devices/emulators frequently.
*/

/* ===========================================================================
📌 2. COMMON PLATFORM DIFFERENCES (quick list)
===============================================================================
- Fonts: iOS uses San Francisco (SF), Android commonly uses Roboto.  
- Shadows: iOS uses shadow props; Android uses elevation.  
- Touch feedback: Android ripple vs iOS opacity highlight.  
- Scroll physics: iOS bouncy scroll, Android less bounce.  
- Modals & navigation gestures: iOS has swipe-back; Android uses hardware back.  
- Status bar / safe area insets: notch handling differs.  
- Buttons, alerts and pickers look different by default.
*/

/* ===========================================================================
📌 3. SETUP: CENTRALIZE PLATFORM RULES (recommended)
===============================================================================
- Create a small "platform design tokens" file:
  - fonts, sizes, lineHeights, radii, elevation/shadow maps, button styles
- Use these tokens everywhere.
- Example: `design-tokens.js` (conceptual)
*/
export const Tokens = {
  colors: {
    primary: "#0A84FF",
    text: "#111",
    bg: "#fff",
  },
  fonts: {
    // prefer platform font families, fallback to system default
    heading: Platform.select({ ios: "System", android: "Roboto" }),
    body: Platform.select({ ios: "System", android: "Roboto" }),
  },
  // elevation / shadow mapping
  elevation: {
    low: Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: { elevation: 2 },
    }),
    card: Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: { elevation: 6 },
    }),
  },
};

/* ===========================================================================
📌 4. SIZING: USE YOUR SCALE HELPERS (consistent)
===============================================================================
- Always use provided scaling helpers to avoid inconsistent sizes:
  - s(), vs(), ms(), mvs()
- Example usage:
  - padding: s(12)
  - fontSize: ms(16)
  - borderRadius: ms(8)
*/

/* ===========================================================================
📌 5. TOUCH FEEDBACK ABSTRACTION (component)
===============================================================================
- Wrap platform differences (ripple vs opacity) in one component.
- Use TouchableNativeFeedback on Android (API >= 21) for ripple, TouchableOpacity on iOS.
*/
import React from "react";
import {
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { s, vs, ms } from "./responsive-scale"; // your scale helpers

export function PlatformButton({
  children,
  onPress,
  style,
  androidRippleColor,
}) {
  if (Platform.OS === "android") {
    return (
      <TouchableNativeFeedback
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple(
          androidRippleColor || "rgba(0,0,0,0.12)",
          false
        )}
      >
        <View style={[styles.button, style]}>{children}</View>
      </TouchableNativeFeedback>
    );
  }
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.button, style]}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: vs(10),
    paddingHorizontal: s(14),
    borderRadius: ms(8),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Tokens.colors.primary,
  },
});

/* ===========================================================================
📌 6. SHADOWS & ELEVATION STRATEGY
===============================================================================
- Use platform-select shadows from tokens (see Tokens.elevation).
- Apply the whole token as style spread: `{...Tokens.elevation.card}`
- Keep elevation values minimal and consistent. Avoid mixing shadow props with elevation in many places.
*/

/* ===========================================================================
📌 7. FONTS & TYPOGRAPHY STRATEGY
===============================================================================
- Use system fonts where possible; avoid bundling many custom fonts.
- Provide font-family tokens with Platform.select.
- Use scaled font sizes (ms) and consistent lineHeight (ms-based).
- Example:
*/
const typography = {
  h1: {
    fontSize: ms(28),
    lineHeight: ms(34),
    fontFamily: Tokens.fonts.heading,
  },
  body: { fontSize: ms(16), lineHeight: ms(22), fontFamily: Tokens.fonts.body },
};

/* ===========================================================================
📌 8. SAFE AREA & STATUS BAR (notch handling)
===============================================================================
- Use react-native-safe-area-context for robust insets (or SafeAreaView for simple use).
- Adjust top padding with insets.top so statusbar + notch are respected.
- Status bar style differs: use StatusBar.setBarStyle('dark-content') on iOS vs android barStyle 'light-content' etc.
*/
export function ScreenContainer({ children }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Tokens.colors.bg }}>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
      />
      {children}
    </SafeAreaView>
  );
}

/* ===========================================================================
📌 9. NAVIGATION & GESTURE CONSIDERATIONS
===============================================================================
- Use react-navigation which handles platform gestures well.
- Configure header heights and safe area for Android differently when needed:
  - headerStyle: { height: Platform.OS === 'android' ? ms(56) : ms(44) }
- Respect iOS swipe-back gesture; do not disable unless necessary.
- Handle Android hardware back with BackHandler for custom flows.
*/

/* ===========================================================================
📌 10. PICKERS, DATE PICKERS & NATIVE UIs
===============================================================================
- Use platform-specific pickers if you want native look (iOS wheel vs Android spinner).
- Wrap them in a small adapter component to keep app code consistent.
*/

/* ===========================================================================
📌 11. SCROLL BEHAVIOR & BOUNCE
===============================================================================
- iOS: ScrollView bounces by default; Android: disable bounce or add overscroll effect.
- Example: `<ScrollView bounces={Platform.OS === 'ios'} overScrollMode={Platform.OS === 'android' ? 'never' : undefined}>` 
*/

/* ===========================================================================
📌 12. FORMS & KEYBOARD (platform differences)
===============================================================================
- KeyboardAvoidingView behaves differently:
  - Use `behavior={Platform.OS === 'ios' ? 'padding' : undefined}`.
  - Test on both platforms with different keyboards and orientations.
- TextInput default styles may differ — normalize lineHeight and padding.
*/

/* ===========================================================================
📌 13. PLATFORM DETECTION (when needed)
===============================================================================
- Use `Platform.OS` for simple forks.
- Use `Platform.Version` or device detection libraries for fine control (example: Android API level).
- Keep platform checks centralized in small utils, not scattered.
*/

/* ===========================================================================
📌 14. SMALL ADAPTERS (recommended pattern)
===============================================================================
- Create small components that hide platform details:
  - <PlatformButton />, <PlatformPicker />, <PlatformModal />, <PlatformSwitch />
- This keeps business logic free from platform if/else.
*/

/* ===========================================================================
📌 15. VISUAL CONSISTENCY: DESIGN TOKENS + THEME
===============================================================================
- Centralize colors, spacing, radii, typography in a Theme.
- Use a ThemeProvider (styled-components or context) so components read from one source.
- This helps quick tweaks to match both platforms.
*/

/* ===========================================================================
📌 16. QA & TESTING (practical)
===============================================================================
- Test key screens on:
  - iPhone (small & large), iPad / Android phone (small & large), Android tablet.
- Test:
  - portrait & landscape
  - different font scales (accessibility)
  - dark & light mode
  - different Android manufacturers (some have custom nav bars)
- Use snapshot tests for visual regression, but manual checks remain important.
*/

/* ===========================================================================
📌 17. PERFORMANCE & LAYOUT STABILITY
===============================================================================
- Prefer Flexbox and avoid many nested Views for minor platform tweaks.
- Use `StyleSheet.create()` for static styles and compute dynamic styles in hooks.
- Avoid conditional render branches that cause layout jank on one platform.
*/

/* ===========================================================================
📌 18. STORYBOOK & Visual Review
===============================================================================
- Use Storybook to preview components side-by-side in both platforms (or in web preview).
- Create stories for platform variants (`Platform.select` variants) so designers and QA can review.
*/

/* ===========================================================================
📌 19. EXAMPLE: Cross-platform Card Component
===============================================================================
*/
export function CrossPlatformCard({ title, subtitle }) {
  return (
    <View style={[cardStyles.container, Tokens.elevation.card]}>
      <Text style={[typography.h1, { marginBottom: vs(4) }]}>{title}</Text>
      <Text style={typography.body}>{subtitle}</Text>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: Tokens.colors.bg,
    borderRadius: ms(12),
    padding: s(16),
    margin: s(12),
  },
});

/* ===========================================================================
📌 20. CHECKLIST — QUICK (fix UI inconsistency)
===============================================================================
✔ Centralize tokens (colors, spacing, fonts)  
✔ Use scale helpers (s, ms, vs) for sizes  
✔ Wrap platform differences in small adapter components  
✔ Use safe area insets and StatusBar handling  
✔ Map shadows/elevation via tokens (avoid ad-hoc values)  
✔ Normalize text inputs and fonts (lineHeight, letterSpacing)  
✔ Test on many devices and font sizes  
✔ Use Storybook for visual regression & platform stories  
✔ Keep platform checks in one place (utils) not sprinkled everywhere
*/

/* ===========================================================================
📌 21. INTERVIEW Q&A (BEGINNER-FRIENDLY)
===============================================================================
Q1: How do you handle Android vs iOS differences without code duplication?  
A: Centralize differences in tokens and small adapter components (e.g., PlatformButton). Use shared components everywhere.

Q2: How do you make shadows look similar on Android and iOS?  
A: Create a shadow/elevation token map using Platform.select and reuse it (don't mix inline shadow values everywhere).

Q3: Should I make both platforms look identical?  
A: Not always. Follow platform conventions: iOS users expect certain gestures/behaviors; Android users expect Material patterns. Aim for brand consistency while respecting OS norms.

Q4: How to ensure fonts look consistent?  
A: Use platform font-family tokens, scaled sizes (ms) and normalize lineHeight and letterSpacing. Test with accessibility font sizes.

Q5: How to debug layout differences fast?  
A: Use layout inspector, Storybook, and compare screenshots. Keep platform differences minimal and centralized.
*/

/* ===========================================================================
📌 22. FINAL CHEAT-SHEET (ONE-PAGE)
===============================================================================
1) Centralize tokens & theme. 2) Use s/ms/vs scale helpers for sizing. 3) Wrap platform UI differences in small components. 4) Respect platform conventions (gestures, pickers, touch feedback). 5) Normalize shadows, fonts, and inputs via tokens. 6) Test often on both platforms and different font scales. 7) Use Storybook and snapshot tests for visual consistency.
*/

/* ===========================================================================
📌 23. WANT NEXT?
===============================================================================
I can produce in the same notes format:
  ✅ Example: PlatformButton, PlatformModal, PlatformPicker implementations (full code)  
  ✅ Design -   tokens file + example theme provider used app-wide  
  ✅ Storybook setup with platform stories & visual regression checks
Pick one and I’ll produce it in this same beginner-friendly single-file JS Notes style.
*/
