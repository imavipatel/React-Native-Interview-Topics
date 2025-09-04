/**
 * ==============================================================
 * 📘 React Native Notes – Keyboard, DeepLink, Dimensions Listeners & Cleanup
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 Why Listeners Matter?
 * - In React Native, we often add event listeners (Keyboard, App Linking, Screen resize).
 * - If we forget to remove them → memory leaks, duplicate handlers, performance issues.
 *
 * 🔹 Where Listeners Are Commonly Used?
 * 1️⃣ Keyboard events → Show/hide keyboard detection.
 * 2️⃣ Deep Linking → Navigate when app opens from a link.
 * 3️⃣ Dimensions → Detect orientation change or screen resize.
 *
 * 🔹 Rule of Thumb
 * ✅ Always unsubscribe/remove listener in `useEffect` cleanup (Hooks)
 * ✅ Or `componentWillUnmount` (Class components).
 *
 * ==============================================================
 * 🔹 Keyboard Listeners
 * --------------------------------------------------------------
 */
import React, { useEffect, useState } from "react";
import { Keyboard, Text, View } from "react-native";

function KeyboardExample() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    // ✅ Cleanup: remove listeners
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return <Text>{keyboardVisible ? "Keyboard Open" : "Keyboard Closed"}</Text>;
}

/**
 * ==============================================================
 * 🔹 Deep Link Listeners
 * --------------------------------------------------------------
 */
import { Linking } from "react-native";

function DeepLinkExample() {
  useEffect(() => {
    const handleUrl = (event) => {
      console.log("Opened with URL:", event.url);
      // Navigate based on URL
    };

    Linking.addEventListener("url", handleUrl);

    // ✅ Cleanup
    return () => {
      Linking.removeEventListener("url", handleUrl);
    };
  }, []);

  return (
    <View>
      <Text>DeepLink Listener Active</Text>
    </View>
  );
}

/**
 * ==============================================================
 * 🔹 Dimensions Listeners
 * --------------------------------------------------------------
 */
import { Dimensions } from "react-native";

function DimensionsExample() {
  const [screen, setScreen] = useState(Dimensions.get("window"));

  useEffect(() => {
    const onChange = ({ window, screen }) => {
      console.log("Window size changed:", window);
      setScreen(window);
    };

    const subscription = Dimensions.addEventListener("change", onChange);

    // ✅ Cleanup
    return () => {
      subscription.remove(); // RN 0.65+ syntax
    };
  }, []);

  return (
    <Text>
      Width: {screen.width}, Height: {screen.height}
    </Text>
  );
}

/**
 * ==============================================================
 * 🔍 Best Practices for Listeners
 * --------------------------------------------------------------
 * 1️⃣ Always cleanup listeners in `useEffect` return or `componentWillUnmount`.
 * 2️⃣ Avoid attaching multiple listeners for same event inside re-renders.
 * 3️⃣ For global listeners (e.g., Linking), keep handler logic lightweight.
 * 4️⃣ Dimensions changes can be frequent → debounce if needed.
 * 5️⃣ Test cleanup → navigate away & back, ensure no duplicate logs.
 *
 * ==============================================================
 * ❓ Q&A for Interviews
 * --------------------------------------------------------------
 * Q1: Why is cleanup needed for listeners?
 *    → Prevents memory leaks and duplicate events when component unmounts.
 *
 * Q2: Difference between `KeyboardDidShow` vs `KeyboardWillShow`?
 *    → `DidShow` fires after keyboard is visible, `WillShow` before it appears.
 *
 * Q3: How do you handle DeepLink events on app start?
 *    → Use `Linking.getInitialURL()` in addition to event listener.
 *
 * Q4: What happens if you forget to remove Dimensions listener?
 *    → Multiple callbacks fire for one resize → performance degradation.
 *
 * Q5: Since RN 0.65+, how do you remove Dimensions listener?
 *    → Use `subscription.remove()`. Earlier RN used `Dimensions.removeEventListener`.
 *
 * ==============================================================
 */
