/**
 * react-native-atomic-architecture-and-storybook-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES (Beginner Friendly)
 *
 * "Atomic Architecture (Atomic Design) + Storybook — what they are,
 *  how to implement them in a React Native project, folder structure,
 *  component examples, Storybook setup, testing, CI integration, best practices"
 *
 * - Very simple language for beginners
 * - Full coverage: theory, folder structure, atomic component examples, Storybook usage,
 *   story conventions, accessibility, visual testing, CI wiring, checklist, interview Q&A
 * - EVERYTHING in one file (single-file JS notes). Copy-paste into your notes repo.
 */

/* ===========================================================================
📌 0. SHORT GOAL (one-line)
===============================================================================
Organize UI as small reusable pieces (Atomic Design) and use Storybook to build,
document, and test components in isolation so your app UI is consistent and faster to build.
*/

/* ===========================================================================
📌 1. WHAT IS ATOMIC (ATOMIC DESIGN) ARCHITECTURE? (very simple)
===============================================================================
Atomic Design = a way to break UI into small reusable parts:
  - **Atoms**   → smallest building blocks (Button, Text, Icon)
  - **Molecules** → combinations of atoms (Input + Label + Icon)
  - **Organisms** → groups of molecules (Header, Card, Form)
  - **Templates** → page-level layout composed of organisms
  - **Pages**    → real screens with data (Templates + real content)

Why it helps:
  ✔ Reuse components easily  
  ✔ Consistent UI across app  
  ✔ Faster development & easier testing  
  ✔ Storybook-friendly (build components in isolation)
*/

/* ===========================================================================
📌 2. BENEFITS (beginner-friendly)
===============================================================================
- Design system friendly (tokens, themes, tokens -> atoms)  
- Easier visual QA with Storybook  
- Smaller PRs: review components, not whole screens  
- Better reusability and fewer duplicated styles
*/

/* ===========================================================================
📌 3. PRINCIPLES & RULES (simple)
===============================================================================
- Keep atoms tiny and purely presentational (no heavy logic)  
- Molecules assemble atoms but remain reasonably generic  
- Organisms orchestrate interactions and fetch data if needed (but prefer to pass data in)  
- Templates show possible layouts (use mock data)  
- Pages are app screens and connect to business logic (Redux, queries)  
- Components should be driven by props, not internal state, when possible (easier to test)
*/

/* ===========================================================================
📌 4. FOLDER STRUCTURE (recommended single-source layout)
===============================================================================
/src
  /components        ← atomic components (atoms → molecules → organisms)
    /atoms
      /Button
        Button.tsx
        Button.stories.tsx
        Button.test.tsx
        index.ts
      /Icon
    /molecules
      /InputWithLabel
    /organisms
      /AuthForm
  /screens           ← pages (connect components + data)
  /theme             ← design tokens, fonts, colors
  /utils
  /storybook         ← storybook config (optional)
  /hooks
  /services
  /assets
Note: Keep each component folder self-contained (component, story, tests, styles).
*/

/* ===========================================================================
📌 5. DESIGN TOKENS (central source of truth)
===============================================================================
Put tokens in /src/theme/tokens.ts so atoms use them. This keeps UI consistent.

Example tokens:
*/
export const tokens = {
  colors: {
    primary: "#0A84FF",
    background: "#FFFFFF",
    text: "#0B1A2B",
    muted: "#6B7280",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
  radii: {
    sm: 6,
    md: 12,
  },
  fonts: {
    heading: "System",
    body: "System",
  },
};

/* ===========================================================================
📌 6. SCALING HELPERS (include your scale utils here — single-file)
===============================================================================
(Use these helpers in components for consistent sizing across devices)
*/
import { Dimensions, Platform, PixelRatio } from "react-native";

const round = (value) => {
  let rounded = Math.round(value);
  if (rounded % 2) rounded++;
  return rounded;
};

const { width: screenW, height: screenH } = Dimensions.get("screen");
const [shortDimension, longDimension] =
  screenW < screenH ? [screenW, screenH] : [screenH, screenW];
const guidelineBaseWidth = 360;
const guidelineBaseHeight = 800;

export const scale = (size) => {
  if (screenW > 500 && Platform.OS === "android") return size;
  return round((shortDimension / guidelineBaseWidth) * size);
};
export const verticalScale = (size) => {
  if (screenH > 950 && Platform.OS === "android") return size;
  return round((longDimension / guidelineBaseHeight) * size);
};
export const moderateScale = (size, factor = 0.5) =>
  round(size + (scale(size) - size) * factor);
export const moderateVerticalScale = (size, factor = 0.5) =>
  round(size + (verticalScale(size) - size) * factor);

export const s = scale;
export const vs = verticalScale;
export const ms = moderateScale;
export const mvs = moderateVerticalScale;

/* ===========================================================================
📌 7. ATOMIC COMPONENT EXAMPLES (complete single-file components)
===============================================================================
- Provide easy-to-copy examples for Atom, Molecule, Organism.
- Each component includes a Storybook story (below).
*/

/* -------------------- ATOM: Button -------------------- */
import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

export function Button({
  children,
  onPress,
  variant = "primary",
  style,
  accessibilityLabel,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.button,
        variant === "secondary" && styles.secondary,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={
        accessibilityLabel || typeof children === "string" ? children : "button"
      }
    >
      <Text
        style={[styles.label, variant === "secondary" && styles.secondaryLabel]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: vs(10),
    paddingHorizontal: s(14),
    borderRadius: ms(8),
    backgroundColor: tokens.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  secondary: {
    backgroundColor: "#E5E7EB",
  },
  label: {
    color: "white",
    fontSize: ms(16),
    fontFamily: tokens.fonts.body,
  },
  secondaryLabel: {
    color: tokens.colors.text,
  },
});

/* -------------------- MOLECULE: InputWithLabel -------------------- */
import { TextInput } from "react-native";
export function InputWithLabel({ label, value, onChangeText, placeholder }) {
  return (
    <View style={{ marginBottom: tokens.spacing.md }}>
      <Text
        style={{ marginBottom: tokens.spacing.xs, color: tokens.colors.muted }}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={{
          borderWidth: 1,
          borderColor: "#E5E7EB",
          padding: s(12),
          borderRadius: ms(8),
          fontSize: ms(16),
        }}
      />
    </View>
  );
}

/* -------------------- ORGANISM: AuthForm -------------------- */
import { useState } from "react";
export function AuthForm({ onSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={{ padding: tokens.spacing.md }}>
      <InputWithLabel
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
      />
      <InputWithLabel
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="password"
      />
      <Button onPress={() => onSubmit({ email, password })}>Sign in</Button>
    </View>
  );
}

/* ===========================================================================
📌 8. STORYBOOK — WHAT IS IT? (very simple)
===============================================================================
Storybook = a development tool to build UI components in isolation.
Benefits:
  ✔ Visual dev: render components with many states  
  ✔ Documentation: live examples for designers & developers  
  ✔ Test bed: visual tests & accessibility checks  
  ✔ Faster dev feedback loop
*/

/* ===========================================================================
📌 9. WHY USE STORYBOOK IN RN PROJECT?
===============================================================================
- Build and QA components before integrating into app screens  
- Snapshots & visual regression tests on components  
- Share component catalog with designers & engineers
*/

/* ===========================================================================
📌 10. STORYBOOK SETUP (single-file instructions)
===============================================================================
1) Install (example):
   yarn add -D @storybook/react-native @storybook/addon-actions @storybook/addon-links

2) Initialize storybook (CLI or manual):
   npx -p @storybook/cli sb init --type react_native

3) Add `storybook/index.js` entry and register stories.

4) Run Storybook:
   - For iOS/Android normally with: yarn storybook or via a separate entrypoint in app.

Note: Storybook setup in RN requires a separate app entrypoint (storybook mode) or using `@storybook/react-native` docs. Keep storybook config under /storybook or /storybook/index.js
*/

/* ===========================================================================
📌 11. STORY FORMAT (component story example)
===============================================================================
Below are story examples for the Button component. Place this as Button.stories.tsx
*/
import React from "react";
import { View } from "react-native";
import { storiesOf } from "@storybook/react-native";
import { action } from "@storybook/addon-actions";

storiesOf("Atoms/Button", module)
  .add("Primary", () => (
    <View style={{ padding: 20 }}>
      <Button onPress={action("pressed")}>Primary Button</Button>
    </View>
  ))
  .add("Secondary", () => (
    <View style={{ padding: 20 }}>
      <Button variant="secondary" onPress={action("pressed")}>
        Secondary
      </Button>
    </View>
  ));

/* ===========================================================================
📌 12. STORY CONVENTIONS (best practices)
===============================================================================
- Stories grouped by folder: Atoms → Molecules → Organisms  
- Use knobs/controls to change props interactively (addon-controls)  
- Keep stories small & focused (one visual state per story)  
- Include accessibility stories (large font, RTL, disabled states)  
- Use mock data for molecules/organisms (no network calls inside stories)
*/

/* ===========================================================================
📌 13. VISUAL & ACCESSIBILITY TESTING (with Storybook)
===============================================================================
- Use Storybook snapshot testing (jest + @storybook/addon-storyshots)  
- Use Chromatic (visual diff service) or Percy for visual regression (optional)  
- Run accessibility checks on stories (axe-core or react-native-accessibility tools)
*/

/* ===========================================================================
📌 14. INTEGRATING STORYBOOK INTO APP (entrypoint)
===============================================================================
Approach A: Separate app entry for storybook
  - App entrypoint: App.tsx
  - Storybook entrypoint: storybook/index.js (loads stories)
  - Use dev-only switch or separate app target to run storybook

Approach B: Toggle inside app (dev-only)
  - Show Storybook when a dev flag is set (not shipped to production)
  - Ensure storybook is not bundled in production builds
*/

/* ===========================================================================
📌 15. STORYBOOK + TS + RN TIPS
===============================================================================
- Use `.stories.tsx` for TypeScript stories  
- Mock native modules used by components (ImagePicker, FastImage) with simple placeholders in stories  
- Avoid heavy dependencies in story components (use lightweight mocks)
*/

/* ===========================================================================
📌 16. CONNECTING ATOMIC DESIGN + STORYBOOK WORKFLOW
===============================================================================
1) Create tokens & atoms first (Button, Text, Icon). Add stories for each atom.  
2) Build molecules from atoms and create stories showing prop variations.  
3) Build organisms and templates; create stories with mock data.  
4) Designer/dev review via Storybook → iterate on tokens & components.  
5) Use stories in visual tests & as living documentation.
*/

/* ===========================================================================
📌 17. CODE-SPLITTING & LAZY COMPONENTS (developer ergonomics)
===============================================================================
- Keep atoms tiny; lazy-load heavy organisms/screens in navigator.  
- Storybook helps ensure lazy components are still testable (render in stories with mocks).
*/

/* ===========================================================================
📌 18. TESTING STRATEGY (component level)
===============================================================================
- Unit tests: jest + react-native-testing-library for logic + snapshot small components  
- Storybook stories: visual snapshot tests (storyshots)  
- Accessibility tests: check contrast, focus order, accessible labels  
- Integration/E2E: use story-like states to exercise components in flow (Detox)
*/

/* ===========================================================================
📌 19. CI / PR WORKFLOW (how Storybook fits)
===============================================================================
- In PR: run unit tests + lint + typecheck  
- Optional: run storybook build & visual regression test (Chromatic)  
- If visual diffs fail, reviewer inspects component changes, not the full app
*/

/* ===========================================================================
📌 20. EXAMPLE: ADDING A STORYBOOK CI CHECK (conceptual)
===============================================================================
- Build storybook static bundle: `build-storybook` (web) or use Chromatic for RN screenshots  
- Run visual diffs and fail PR if unexpected changes  
- Provide link to Storybook preview in PR for reviewers
*/

/* ===========================================================================
📌 21. ACCESSIBILITY & INTERNATIONALIZATION (I18N)
===============================================================================
- Include stories for RTL languages and large font sizes  
- Use stories to verify translations and text wrapping  
- Make components support `allowFontScaling` and proper numberOfLines handling
*/

/* ===========================================================================
📌 22. MIGRATION & MAINTENANCE (keep design system healthy)
===============================================================================
- Version your tokens (breaking changes require token migration)  
- Keep stories up-to-date when UI changes  
- Encourage team to add a story for each new component  
- Periodically run story cleanup (remove unused stories/components)
*/

/* ===========================================================================
📌 23. EXAMPLE: Full small component folder (Button)
===============================================================================
/src/components/atoms/Button/
  Button.tsx           // component (see Button above)
  Button.stories.tsx   // stories (see above)
  Button.test.tsx      // unit tests (snapshot + interaction)
  index.ts             // export { Button } from './Button';
*/

/* ===========================================================================
📌 24. CHECKLIST — QUICK (atomic + storybook)
===============================================================================
✔ Create tokens & theme first  
✔ Implement atoms + stories before using in screens  
✔ Keep components prop-driven & small  
✔ Mock network/native deps in stories  
✔ Add visual & accessibility stories (RTL, large fonts)  
✔ Integrate storybook with CI (visual checks optional)  
✔ Publish storybook link for designers & reviewers (dev-only)  
✔ Avoid bundling Storybook in production builds
*/

/* ===========================================================================
📌 25. COMMON PITFALLS & HOW TO AVOID
===============================================================================
✘ Putting business logic in atoms → keep UI pure  
✘ No stories for components → harder to review visually  
✘ Storybook in production bundle → keep dev-only  
✘ Huge components without stories → harder to test & reuse  
✘ Not keeping tokens consistent → visual drift across screens
*/

/* ===========================================================================
📌 26. INTERVIEW Q&A (BEGINNER-FRIENDLY)
===============================================================================
Q1: What is Atomic Design?  
A: A method to build UIs from small to large: Atoms → Molecules → Organisms → Templates → Pages.

Q2: Why use Storybook?  
A: To build, test, and document components in isolation so UI is consistent and reviewable.

Q3: Should Storybook be shipped with the app?  
A: No. Storybook is for development; do not ship it in production builds.

Q4: Where do tokens live?  
A: In a central `/src/theme/tokens.ts` file so all components use the same values.

Q5: How to test visual regressions?  
A: Use Storybook + visual testing services (Chromatic/Percy) or snapshot testing via storyshots.

Q6: How to structure component folders?  
A: One folder per component: component file, stories, tests, index export, and styles if any.

Q7: How to handle native modules in stories?  
A: Mock them with simple stubs so stories remain fast and deterministic.
*/

/* ===========================================================================
📌 27. FINAL CHEAT-SHEET (ONE-PAGE)
===============================================================================
1) Use Atomic Design to structure UI: Atoms → Molecules → Organisms → Templates → Pages  
2) Centralize tokens & scale helpers for consistent spacing/typography  
3) Write stories for every component; mock native/network deps in stories  
4) Use Storybook for visual QA, docs, and tests (not in production builds)  
5) Add visual tests in CI to catch regressions early  
6) Keep components prop-driven and small; move business logic to screens/services  
7) Maintain stories and tokens as living documentation
*/

/* ===========================================================================
📌 28. WANT NEXT?
===============================================================================
I can produce in the same single-file JS notes format:
  ✅ Full Storybook RN setup file + Metro tweaks (exact commands & config)  
  ✅ Large example: design tokens → atom → molecule → organism → template → page (real code)  
  ✅ Storybook + Chromatic visual testing CI example (GitHub Actions)
Pick one and I’ll produce it in this same beginner-friendly single-file JS Notes style.
*/
