/*
========================================
React Native Rendering Pipeline – Native UI Components vs DOM
========================================
Goal: Understand how rendering in React Native differs from rendering on the Web (DOM).
Think of it as: React’s logic is the same, but the target (what gets rendered) is different.
*/

/*
Mental Model
------------
- In React (Web): React elements → Virtual DOM → Browser DOM → Browser paints pixels.
- In React Native: React elements → React Native Virtual Tree → Native UI components (UIView on iOS, View on Android) → OS draws pixels.

Key Idea: There is **no HTML DOM** in React Native. Instead, React Native maps components to **native UI widgets**.
*/

/*
1) Web Rendering Pipeline (with DOM)
-----------------------------------
When you use React on the Web:
1. You write JSX: <div>, <span>, <button>.
2. React builds a Virtual DOM tree in memory.
3. React compares Virtual DOM to previous version (diffing).
4. React updates the actual **Browser DOM** accordingly.
5. Browser takes the DOM → runs CSS layout & style calculations → paints pixels to screen.

Extra Theory:
- DOM = Document Object Model = tree of nodes representing HTML elements.
- Browsers are optimized for DOM changes, but too many reflows/repaints → slow.
- React helps reduce direct DOM manipulations with batching + diffing.
*/

/*
2) React Native Rendering Pipeline (with Native UI Components)
-------------------------------------------------------------
When you use React Native:
1. You write JSX: <View>, <Text>, <Image>.
2. React builds a Virtual Tree (similar to Virtual DOM but not HTML-specific).
3. React reconciles changes and sends UI update instructions to the Native side (via Bridge or JSI).
4. Native creates/updates **real native views**:
   - iOS: UIView, UILabel, UIImageView, etc.
   - Android: android.view.View, TextView, ImageView, etc.
5. OS rendering system (CoreGraphics for iOS, Skia for Android) draws pixels.

Extra Theory:
- There is no DOM, no CSSOM. Styles are passed as props and mapped to native APIs.
- Layout is computed using Yoga (a cross-platform flexbox engine written in C++).
- The “Virtual DOM” in RN is just an internal structure; actual output is native widgets.
*/

/*
3) Key Difference: DOM vs Native UI Components
---------------------------------------------
DOM (Web):
- Universal standard in browsers.
- Elements are HTML tags (<div>, <button>, etc.).
- Styled with CSS.
- Rendering controlled by browser engine (Blink, WebKit).

Native (React Native):
- Uses platform-native widgets (UIView, TextView).
- Styled using RN’s style system (subset of CSS-like properties).
- Rendering controlled by the OS’s UI system.

Simple Analogy:
- Web React = writes to the browser’s HTML page.
- React Native = asks Android/iOS to create real native buttons, text, etc.
*/

/*
4) Example Comparison
---------------------
// React Web
<div style={{backgroundColor: 'red', width: 100, height: 50}}>Hello</div>

// React Native
<View style={{backgroundColor: 'red', width: 100, height: 50}}>
  <Text>Hello</Text>
</View>

What happens:
- Web: <div> exists in DOM, browser draws a red box.
- Native: RN asks iOS/Android to create a UIView with red background and a UILabel inside.
*/

/*
5) Rendering Flow Step by Step (React Native)
--------------------------------------------
1. React code (JS) → describe UI with <View>, <Text>.
2. React reconciler builds virtual tree.
3. Diffing finds what changed since last render.
4. Instructions sent to Native (via Bridge or JSI).
5. Native UIManager creates/updates native views.
6. Yoga calculates layout.
7. UI thread commits changes.
8. OS renders views to screen.
*/

/*
6) Why this Matters
-------------------
- Performance: Native views are faster than simulating DOM inside a WebView.
- Look & Feel: Native components behave exactly like other iOS/Android components.
- Limitations: RN doesn’t support everything from CSS/HTML, since it only exposes what makes sense for mobile apps.

Real-World Example:
- A <TextInput> in RN is not a simulated input box – it’s actually an iOS UITextField or Android EditText.
- That’s why it feels native (keyboard behavior, cursor, autocorrect are handled by OS).
*/

/*
7) Common Pitfalls & Fixes
--------------------------
- ❌ Misunderstanding: Thinking RN renders HTML → Wrong, it renders native views.
- ❌ Using too many nested <View> → Deep trees cause slow layout → Use FlatList/SectionList for lists.
- ❌ Expecting CSS features like :hover, :nth-child → Not supported in RN.

Fixes:
- Use RN styling (Flexbox-based) properly.
- Optimize component trees.
- For web-like features, use libraries (e.g., react-native-web for DOM compatibility).
*/

/*
8) New Architecture (Fabric Renderer)
------------------------------------
- Old RN used UIManager + Bridge for UI updates.
- New RN uses **Fabric** renderer:
  - Works directly with React Fiber (no bridge overhead).
  - Synchronizes with React concurrent rendering.
  - Uses JSI for faster communication.
- End result: Faster, smoother UI updates.
*/

/*
Cheat Sheet
-----------
- **Web React**: JSX → Virtual DOM → Browser DOM → Browser paints.
- **React Native**: JSX → Virtual Tree → Native Views → OS paints.
- **DOM vs Native**: DOM = HTML nodes styled with CSS, Native = platform widgets styled with RN styles.
- **Yoga**: Cross-platform layout engine for RN.
- **Fabric**: New renderer for faster UI in RN.
*/
