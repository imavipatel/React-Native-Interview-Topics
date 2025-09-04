/* =============================================================================
📘 useNativeDriver Animations in React Native
============================================================================= */

/*
🟢 Introduction
-----------------------------------------------------------------------------
- Animations in React Native can run on:
  1. JS thread → handled by JavaScript (can get blocked if heavy JS work runs).
  2. Native thread → offloaded to native driver (smoother, avoids frame drops).

- 🔑 useNativeDriver: true allows animations to run on the native UI thread, 
  improving performance and smoothness.

✅ Benefits:
- Smoother 60 FPS animations.
- No frame drops during heavy JS tasks.
- Great for transitions, gestures, opacity, scale, translation.
*/

/* =============================================================================
🔹 How useNativeDriver Works
-----------------------------------------------------------------------------
- React Native animations are usually created with the `Animated` API.
- By default, animations run on the JS thread (can lag if JS is busy).
- With useNativeDriver: true, animations run directly on the native driver 
  (offloaded to native thread).
- Native driver supports only certain style props:
  → transform (translateX, translateY, scale, rotate)
  → opacity
*/

/* =============================================================================
🔹 Example 1 – Simple Opacity Animation
============================================================================= */

import React, { useRef, useEffect } from "react";
import { Animated, View, Button } from "react-native";

export default function FadeInExample() {
  const fadeAnim = useRef(new Animated.Value(0)).current; // start opacity at 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, // animate to opacity: 1
      duration: 2000, // 2 seconds
      useNativeDriver: true, // ✅ runs on native thread
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        width: 200,
        height: 200,
        backgroundColor: "skyblue",
      }}
    />
  );
}

/*
✅ Explanation:
- Opacity animation is delegated to the native driver.
- Runs independently of JS thread → smooth transitions.
*/

/* =============================================================================
🔹 Example 2 – Translate & Scale Animation
============================================================================= */

function MoveBox() {
  const moveAnim = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    Animated.spring(moveAnim, {
      toValue: 150, // move 150px
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Move Box" onPress={startAnimation} />
      <Animated.View
        style={{
          width: 100,
          height: 100,
          backgroundColor: "tomato",
          transform: [
            { translateY: moveAnim },
            {
              scale: moveAnim.interpolate({
                inputRange: [0, 150],
                outputRange: [1, 2],
              }),
            },
          ],
        }}
      />
    </View>
  );
}

/*
✅ Explanation:
- translateY and scale are supported by native driver.
- Smooth motion without blocking UI, even if JS thread is busy.
*/

/* =============================================================================
🔹 What is NOT Supported by useNativeDriver
-----------------------------------------------------------------------------
⚠️ Native driver supports only non-layout properties.
Not supported:
- backgroundColor
- height / width
- borderRadius
- margin / padding
- shadow properties

👉 For these, animation falls back to JS thread (useNativeDriver: false).
*/

/* =============================================================================
🔹 Example 3 – Unsupported Property
============================================================================= */

Animated.timing(animatedValue, {
  toValue: 100,
  duration: 500,
  useNativeDriver: true, // ❌ Will throw warning if animating width
});

/*
⚠️ "useNativeDriver was not specified. This is a required option." 
⚠️ Warning: If you try unsupported props (like width), it fails.
*/

/* =============================================================================
🔹 Best Practices
-----------------------------------------------------------------------------
✅ Always use `useNativeDriver: true` when possible (opacity, transform).
✅ Helps prevent UI jank during heavy JS work.
✅ Use Reanimated 2 for more advanced animations (runs fully on UI thread).
⚠️ If you need to animate layout properties (width, height, color), you may need:
   - react-native-reanimated
   - LayoutAnimation (for simple layout transitions).
*/

/* =============================================================================
🔹 Q&A (Interview Style)
-----------------------------------------------------------------------------
Q1: Why use useNativeDriver in React Native?
   → To move animations off the JS thread to the native UI thread, 
     making them smooth and independent of JS performance.

Q2: Which properties are supported?
   → opacity, transform (translate, scale, rotate).

Q3: What happens if you try to animate unsupported props with native driver?
   → It throws a warning/error, and you must fallback to JS driver.

Q4: What’s the alternative for unsupported layout animations?
   → LayoutAnimation or React Native Reanimated.
*/

/* =============================================================================
✅ Final Takeaway
-----------------------------------------------------------------------------
- useNativeDriver improves animation performance by offloading to native UI thread.
- Use it for transforms & opacity whenever possible.
- For complex layout animations → use Reanimated or LayoutAnimation.
============================================================================= */
