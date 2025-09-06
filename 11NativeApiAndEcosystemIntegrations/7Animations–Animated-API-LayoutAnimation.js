/********************************************************************
 * 🎞️ Animations in React Native – Animated API, LayoutAnimation, Reanimated 4
 * -----------------------------------------------------------------
 * Animations make UI smooth, interactive, and engaging.
 * In React Native, we have multiple approaches:
 *   1. Animated API (JS-driven, declarative & imperative styles)
 *   2. LayoutAnimation (native-driven layout transitions)
 *   3. Reanimated 4 (native-driven, worklets, Fabric-ready)
 ********************************************************************/

/********************************************
 * 🔹 1. Animated API (Built-in React Native)
 ********************************************/
/**
 * - Classic animation API bundled with React Native.
 * - Runs on JS thread by default, can use `useNativeDriver: true` for offloading.
 * - Provides animated values that can interpolate & drive styles.
 * - Two types of animations:
 *    ✅ Animated.timing() → linear/spring animations
 *    ✅ Animated.spring() → physics-based animation
 *    ✅ Animated.sequence(), Animated.parallel(), Animated.stagger() → composition
 *
 * Example: Fade In a box
 *
 * import { Animated } from "react-native";
 * import { useRef, useEffect } from "react";
 *
 * const FadeInBox = () => {
 *   const opacity = useRef(new Animated.Value(0)).current;
 *
 *   useEffect(() => {
 *     Animated.timing(opacity, {
 *       toValue: 1,
 *       duration: 1000,
 *       useNativeDriver: true,
 *     }).start();
 *   }, []);
 *
 *   return <Animated.View style={{ opacity, width: 100, height: 100, backgroundColor: "tomato" }} />;
 * };
 *
 * ✅ Pros: Easy to learn, built-in, supports composition
 * ❌ Cons: Can lag if JS thread is busy (unless native driver is used)
 */

/********************************************
 * 🔹 2. LayoutAnimation
 ********************************************/
/**
 * - Native module for animating **layout changes** (position, size) automatically.
 * - Runs fully on the native side (UI thread), doesn’t block JS thread.
 * - Best for **simple transitions** like expanding/collapsing views, list reordering.
 * - Automatically animates when `setState` causes layout changes.
 *
 * Example: Toggle Box Height
 *
 * import { LayoutAnimation, TouchableOpacity, View } from "react-native";
 * import { useState } from "react";
 *
 * const ExpandingBox = () => {
 *   const [expanded, setExpanded] = useState(false);
 *
 *   const toggle = () => {
 *     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
 *     setExpanded(!expanded);
 *   };
 *
 *   return (
 *     <TouchableOpacity onPress={toggle}>
 *       <View
 *         style={{
 *           height: expanded ? 200 : 100,
 *           width: 200,
 *           backgroundColor: "skyblue",
 *           margin: 10,
 *         }}
 *       />
 *     </TouchableOpacity>
 *   );
 * };
 *
 * ✅ Pros: Native-driven, no manual animation code, very simple
 * ❌ Cons: Limited customization (no physics-based animation), iOS has fewer presets
 */

/********************************************
 * 🔹 3. Reanimated 4 (Modern Solution)
 ********************************************/
/**
 * - Advanced animation library built with JSI (no bridge, fully native-driven).
 * - Worklets: small JS functions run directly on the UI thread.
 * - Core features:
 *   ✅ useSharedValue → stores animated state
 *   ✅ useAnimatedStyle → connect shared value to styles
 *   ✅ Animation helpers → withSpring(), withTiming(), withDecay()
 *   ✅ Layout Animations → entering/exiting transitions
 *   ✅ Keyframe animations (Reanimated 4+)
 * - Runs at 60 FPS, Fabric-ready, concurrent mode-friendly
 *
 * Example: Swipe to Dismiss
 *
 * import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
 * import { PanGestureHandler } from "react-native-gesture-handler";
 *
 * const SwipeCard = () => {
 *   const translateX = useSharedValue(0);
 *
 *   const style = useAnimatedStyle(() => ({
 *     transform: [{ translateX: translateX.value }],
 *   }));
 *
 *   return (
 *     <PanGestureHandler
 *       onGestureEvent={(e) => (translateX.value = e.translationX)}
 *       onEnded={(e) => {
 *         if (e.translationX > 100) translateX.value = withSpring(500); // dismiss
 *         else translateX.value = withSpring(0);
 *       }}
 *     >
 *       <Animated.View style={[{ width: 200, height: 100, backgroundColor: "lightgreen" }, style]} />
 *     </PanGestureHandler>
 *   );
 * };
 *
 * ✅ Pros: Native-driven, highly customizable, smooth gestures, works with Fabric
 * ❌ Cons: Extra setup, larger learning curve compared to Animated API
 */

/********************************************
 * 🔹 4. Comparison Table
 ********************************************/
/**
 * API              | Runs On       | Best For                        | Limitations
 * -----------------|---------------|---------------------------------|--------------------------
 * Animated API     | JS (UI if nativeDriver) | Basic animations, opacity, scale | Lag if JS blocked
 * LayoutAnimation  | Native UI     | Simple layout transitions       | Limited customization
 * Reanimated 4     | UI (JSI)      | Complex, fluid, interactive gestures | Extra setup, steeper learning
 */

/********************************************
 * ❓ Q&A (Interview Prep)
 ********************************************/
/**
 * Q1: When would you use LayoutAnimation?
 *   → When you want automatic layout transitions (expand/collapse, list updates).
 *
 * Q2: Difference between Animated API & Reanimated?
 *   → Animated runs on JS by default, Reanimated runs on UI thread with worklets.
 *
 * Q3: Why Reanimated 4 over V1/V2?
 *   → V4 is Fabric-ready, supports keyframes, layout animations, optimized for RN New Arch.
 *
 * Q4: Can LayoutAnimation be combined with Reanimated?
 *   → Yes, LayoutAnimation for simple layout changes + Reanimated for gestures & advanced animations.
 */
