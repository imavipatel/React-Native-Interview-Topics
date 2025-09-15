/********************************************************************
 * ✋ Gesture Handler & 🎞️ Reanimated (V1 / V2 / V3 / V4) in React Native
 * -----------------------------------------------------------------
 * React Native apps require smooth gestures & animations.
 * Default React Native touch system (`onPress`, `PanResponder`) runs on JS thread:
 *   ❌ Laggy if JS thread is busy
 *   ❌ Limited complex gestures
 *
 * Gesture Handler + Reanimated → Native-driven gestures & animations
 * ✅ Runs on UI thread (no lag)
 * ✅ 60 FPS, smooth transitions
 ********************************************************************/

/********************************************
 * 🔹 1. React Native Gesture Handler
 ********************************************/
/**
 * - Native gesture system → doesn’t block when JS thread is busy
 * - Supported gestures:
 *   ✅ TapGestureHandler
 *   ✅ PanGestureHandler
 *   ✅ PinchGestureHandler
 *   ✅ RotationGestureHandler
 *   ✅ LongPressGestureHandler
 *
 * Example: Drag a box
 *
 * import { PanGestureHandler } from "react-native-gesture-handler";
 * import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
 *
 * const DraggableBox = () => {
 *   const x = useSharedValue(0);
 *   const y = useSharedValue(0);
 *
 *   const style = useAnimatedStyle(() => ({
 *     transform: [{ translateX: x.value }, { translateY: y.value }],
 *   }));
 *
 *   return (
 *     <PanGestureHandler
 *       onGestureEvent={(e) => {
 *         x.value = e.translationX;
 *         y.value = e.translationY;
 *       }}
 *       onEnded={() => {
 *         x.value = withSpring(0);
 *         y.value = withSpring(0);
 *       }}
 *     >
 *       <Animated.View style={[{ width: 100, height: 100, backgroundColor: "tomato" }, style]} />
 *     </PanGestureHandler>
 *   );
 * };
 */

/********************************************
 * 🔹 2. Reanimated Versions (V1 → V4)
 ********************************************/

/**
 * ---------------------------------------------------------
 * 🟠 Reanimated V1
 * - Declarative API with Animated.Code & blocks
 * - Harder to learn, verbose syntax
 * - Based on “nodes” (similar to Animated API but extended)
 *
 * Example:
 * <Animated.Code>
 *   {() =>
 *     block([
 *       set(translateX, event.translationX),
 *       set(translateY, event.translationY),
 *     ])
 *   }
 * </Animated.Code>
 *
 * ❌ Verbose, harder debugging, limited flexibility
 *
 * ---------------------------------------------------------
 * 🟢 Reanimated V2
 * - Big shift → “worklets” (JS functions run on UI thread)
 * - Introduced hooks:
 *   → useSharedValue()
 *   → useAnimatedStyle()
 *   → withSpring(), withTiming(), withDecay()
 * - Simple & intuitive syntax
 *
 * Example:
 * const x = useSharedValue(0);
 * const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
 *
 * <PanGestureHandler onGestureEvent={(e) => (x.value = e.translationX)}>
 *   <Animated.View style={[styles.box, style]} />
 * </PanGestureHandler>
 *
 * ✅ Declarative + imperative hybrid, smooth animations
 *
 * ---------------------------------------------------------
 * 🔵 Reanimated V3
 * - Improved compatibility with **New Architecture** (Fabric + TurboModules)
 * - JSI-based (no bridge dependency) → faster execution
 * - Better memory management for shared values & worklets
 * - Supports **Layout Animations** (entering/exiting transitions)
 *
 * Example:
 * <Animated.View
 *   entering={FadeIn}
 *   exiting={FadeOut}
 *   style={style}
 * />
 *
 * ✅ Native integration with Fabric, better performance
 *
 * ---------------------------------------------------------
 * 🟣 Reanimated V4 (Latest)
 * - Continuous improvements from V3
 * - Better dev experience:
 *   → Worklet syntax improvements
 *   → TypeScript support upgrades
 * - Advanced animation features:
 *   → Keyframe animations
 *   → Improved Gesture Handler integration
 * - Enhanced debugging & Flipper support
 * - Optimization for React 18 Concurrent Features
 *
 * Example (Keyframe Animation):
 * const entering = Keyframe
 *   .duration(1000)
 *   .values({ 0: { opacity: 0 }, 100: { opacity: 1 } });
 *
 * <Animated.View entering={entering} style={style} />
 *
 * ✅ Production-ready, stable, Fabric-friendly
 */

/********************************************
 * 🔹 3. Gesture Handler + Reanimated Together
 ********************************************/
/**
 * Best practice: use Gesture Handler to capture gestures
 * and Reanimated to animate responses.
 *
 * Use cases:
 *   ✅ Swipe to dismiss
 *   ✅ Tinder-like card swipes
 *   ✅ Bottom sheets (drag up/down)
 *   ✅ Pinch-to-zoom, rotate gestures
 *
 * Example: Swipe to Dismiss
 * const x = useSharedValue(0);
 * const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
 *
 * <PanGestureHandler
 *   onGestureEvent={(e) => (x.value = e.translationX)}
 *   onEnded={(e) => {
 *     if (e.translationX > 100) x.value = withSpring(500); // dismiss
 *     else x.value = withSpring(0);
 *   }}
 * >
 *   <Animated.View style={[styles.card, style]} />
 * </PanGestureHandler>
 */

/********************************************
 * 🔹 4. Performance Benefits
 ********************************************/
/**
 * ✅ Runs on UI thread (no lag if JS is blocked)
 * ✅ 60 FPS animations
 * ✅ Native-driven, not dependent on bridge
 * ✅ Fabric & New Architecture ready (V3+)
 * ✅ Smooth gesture → animation integration
 */

/********************************************
 * 🔹 5. Comparison Table
 ********************************************/
/**
 * Version   | Key Features                                   | Limitations
 * ----------|-----------------------------------------------|-----------------------------
 * V1        | Declarative, block(), Animated.Code           | Verbose, hard to debug
 * V2        | Hooks (useSharedValue, useAnimatedStyle)      | Needs JSI support
 * V3        | Fabric-ready, Layout Animations, JSI-based    | Still evolving
 * V4        | Keyframes, better TS support, Flipper tools   | Cutting edge, but newest
 */

/********************************************
 * ❓ Q&A (Interview Prep)
 ********************************************/
/**
 * Q1: Why use Gesture Handler over PanResponder?
 *   → Gesture Handler runs on UI thread (native), PanResponder runs on JS thread (laggy).
 *
 * Q2: Difference between Reanimated V1 & V2?
 *   → V1: declarative, node-based, verbose.
 *     V2: hooks + worklets, UI-thread execution, simple API.
 *
 * Q3: Why did Reanimated need V3/V4?
 *   → To integrate with New Architecture (Fabric + TurboModules),
 *     improve memory & performance, add keyframe + layout animations.
 *
 * Q4: Can Gesture Handler work without Reanimated?
 *   → Yes, but pairing with Reanimated gives smooth native animations.
 *
 * Q5: What’s the benefit of worklets?
 *   → Worklets run directly on UI thread, avoiding JS thread bottlenecks.
 */
