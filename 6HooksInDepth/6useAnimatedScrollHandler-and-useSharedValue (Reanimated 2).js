/**
 * ==============================================================
 * 📘 React Native Reanimated 2
 * 👉 useSharedValue & useAnimatedScrollHandler
 * ==============================================================
 *
 * 🟢 Why do we need Reanimated 2?
 * --------------------------------------------------------------
 * - Default React Native animations (Animated API) run on the JS thread.
 *   → This can cause frame drops if JS thread is busy.
 * - Reanimated 2 runs animations on the UI thread (worklets).
 *   → Smooth 60fps animations even under heavy JS load.
 *
 * Two main concepts we’ll focus on:
 *   1. useSharedValue → reactive variables that sync with UI thread.
 *   2. useAnimatedScrollHandler → listens to scroll events on UI thread.
 *
 * ==============================================================
 * 🔹 useSharedValue
 * --------------------------------------------------------------
 * ✅ What is it?
 * - A special hook in Reanimated 2.
 * - Returns an object with a `.value` property.
 * - The `.value` can be read & updated both from JS and UI thread.
 * - Any animation or style bound to this shared value updates automatically.
 *
 * ✅ Why use it?
 * - Stores animation state on UI thread (not in React state).
 * - Super fast updates (no React re-render).
 *
 * ✅ Example: Simple box moving with shared value
 */
import React from "react";
import { Button } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

export default function SharedValueExample() {
  const offset = useSharedValue(0); // like useState but for UI thread

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  return (
    <>
      <Button title="Move Right" onPress={() => (offset.value += 50)} />
      <Animated.View
        style={[
          { width: 80, height: 80, backgroundColor: "blue" },
          animatedStyle,
        ]}
      />
    </>
  );
}

/**
 * 📝 Key points:
 * - `useSharedValue(0)` creates a reactive value.
 * - `.value` must be used to update/read it.
 * - Any UI bound to it updates instantly on the UI thread.
 *
 * ==============================================================
 * 🔹 useAnimatedScrollHandler
 * --------------------------------------------------------------
 * ✅ What is it?
 * - A hook that listens to scroll events inside Reanimated 2.
 * - Runs directly on UI thread (worklet).
 *
 * ✅ Why use it?
 * - No lag when handling scroll animations (parallax, headers).
 * - Avoids bottlenecks of JS thread event listeners.
 *
 * ✅ Example: Parallax effect with scroll
 */
import React from "react";
import { ScrollView, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
} from "react-native-reanimated";

export default function ScrollHandlerExample() {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: scrollY.value * 0.5 }], // Parallax effect
    };
  });

  return (
    <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
      <Animated.View
        style={[
          { height: 200, backgroundColor: "orange" },
          animatedStyle,
        ]}
      />
      {Array.from({ length: 30 }).map((_, i) => (
        <Text key={i} style={{ margin: 20 }}>
          Item {i + 1}
        </Text>
      ))}
    </Animated.ScrollView>
  );
}

/**
 * ==============================================================
 * 🔹 Advanced Example: Collapsing Header (Instagram-style)
 * --------------------------------------------------------------
 * ✅ Goal:
 * - Create a header that shrinks when you scroll down.
 * - Popular in apps like Instagram, Twitter.
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";

export default function CollapsingHeaderExample() {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(scrollY.value, [0, 150], [200, 70], Extrapolate.CLAMP),
    };
  });

  const titleStyle = useAnimatedStyle(() => {
    return {
      fontSize: interpolate(scrollY.value, [0, 150], [32, 20], Extrapolate.CLAMP),
    };
  });

  return (
    <View style={{ flex: 1 }}>
      <Animated.View style={[styles.header, headerStyle]}>
        <Animated.Text style={[styles.headerText, titleStyle]}>
          My Profile
        </Animated.Text>
      </Animated.View>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: 200 }}
      >
        {Array.from({ length: 40 }).map((_, i) => (
          <Text key={i} style={styles.item}>
            Post {i + 1}
          </Text>
        ))}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "purple",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  headerText: {
    color: "white",
    fontWeight: "bold",
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

/**
 * 📝 Key points:
 * - `interpolate` maps scroll value to height & font size.
 * - `Extrapolate.CLAMP` ensures values don’t go beyond limits.
 * - Header shrinks smoothly without lag (UI thread).
 *
 * ==============================================================
 * 📊 Comparison Table
 * --------------------------------------------------------------
 * | Hook                     | What it does                                | Runs on   | Example Use Case             |
 * |--------------------------|----------------------------------------------|-----------|------------------------------|
 * | useSharedValue           | Reactive variable (.value) for animations   | UI Thread | Animating positions, opacity |
 * | useAnimatedScrollHandler | Handle scroll events with worklets          | UI Thread | Parallax, collapsing headers |
 *
 * ==============================================================
 * ❓ Q&A (Interview Style)
 * --------------------------------------------------------------
 * Q1: Difference between useState and useSharedValue?
 *   → useState causes React re-render, slower.  
 *     useSharedValue updates instantly on UI thread, no re-render.
 *
 * Q2: Why is useAnimatedScrollHandler better than onScroll in React Native?
 *   → Normal onScroll runs on JS thread → may lag.  
 *     useAnimatedScrollHandler runs on UI thread → smooth animations.
 *
 * Q3: What is a worklet in Reanimated?
 *   → A JS function marked with "worklet" that runs on UI thread for performance.
 *
 * Q4: Can shared values be animated?
 *   → Yes, with helpers like `withSpring`, `withTiming`, etc.
 *
 * ==============================================================
 * ✅ Final Takeaways
 * --------------------------------------------------------------
 * - `useSharedValue` → store reactive animation state on UI thread.
 * - `useAnimatedScrollHandler` → smooth scroll-based animations.
 * - Advanced patterns like collapsing headers are easy with `interpolate`.
 * - Both combined → essential for high-performance animations in RN.
 * ==============================================================
 */
