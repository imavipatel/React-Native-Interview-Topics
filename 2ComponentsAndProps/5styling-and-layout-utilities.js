/**
 * ==============================================================
 * 📘 React Native Notes – Styling & Layout Utilities
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 Why Styling in React Native?
 * - In React Native, styling is done with JavaScript objects (not CSS files).
 * - Uses a subset of CSS properties, optimized for mobile apps.
 * - Tools like StyleSheet, Flexbox, Dimensions, PixelRatio help in:
 *    ✅ Creating reusable styles
 *    ✅ Handling screen sizes
 *    ✅ Making responsive UIs
 *
 * ==============================================================
 * 🔹 1. StyleSheet
 * - Utility to define and organize styles.
 * - Improves performance (creates IDs for styles instead of passing objects).
 * - Makes code more readable and reusable.
 *
 * Example:
 */
import { StyleSheet, Text, View } from "react-native";

function MyComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello React Native!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "darkblue",
  },
});

/**
 * --------------------------------------------------------------
 * 🔹 2. Flexbox
 * - React Native uses Flexbox for layout (like CSS Flexbox).
 * - Works the same for iOS and Android.
 * - Key properties:
 *    * flex → defines how much space an element takes
 *    * flexDirection → row / column (default: column in RN)
 *    * justifyContent → align items vertically (start, center, space-between)
 *    * alignItems → align items horizontally (start, center, stretch)
 *
 * Example:
 */
function FlexExample() {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
      <View style={{ width: 50, height: 50, backgroundColor: "red" }} />
      <View style={{ width: 50, height: 50, backgroundColor: "green" }} />
      <View style={{ width: 50, height: 50, backgroundColor: "blue" }} />
    </View>
  );
}

/**
 * --------------------------------------------------------------
 * 🔹 3. Dimensions
 * - Provides screen width and height of the device.
 * - Useful for responsive design.
 *
 * Example:
 */
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
console.log("Screen width:", width, "Screen height:", height);

function DimensionExample() {
  return (
    <View style={{ width: width / 2, height: 100, backgroundColor: "orange" }}>
      <Text>Half Screen Width Box</Text>
    </View>
  );
}

/**
 * --------------------------------------------------------------
 * 🔹 4. PixelRatio
 * - Handles pixel density differences across devices.
 * - High-density devices (e.g., Retina, HD displays) may need scaling.
 * - PixelRatio helps scale sizes/images to look consistent.
 *
 * Example:
 */
import { PixelRatio } from "react-native";

const fontScale = PixelRatio.getFontScale(); // Get user’s font scaling
console.log("Font Scale:", fontScale);

const pixelRatio = PixelRatio.get(); // e.g., 2 for iPhone Retina
console.log("Device Pixel Ratio:", pixelRatio);

const adjustedSize = PixelRatio.getPixelSizeForLayoutSize(50); // Convert layout size → pixels
console.log("Adjusted Size:", adjustedSize);

/**
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: Why use StyleSheet instead of inline styles?
 *    → Better performance (styles are pre-processed into IDs),
 *      easier to reuse, keeps code clean.
 *
 * Q2: Difference between Flexbox in React Native vs Web?
 *    → Default flexDirection in RN = column,
 *      but in web = row.
 *
 * Q3: When should you use Dimensions?
 *    → For responsive layouts (e.g., making a box half screen width).
 *
 * Q4: What problem does PixelRatio solve?
 *    → Ensures UI elements look consistent across devices
 *      with different pixel densities.
 *
 * Q5: Example of using PixelRatio in real apps?
 *    → Scaling images or adjusting font sizes on high-density devices
 *      like Retina iPhones or Android HD screens.
 *
 * Q6: How to make truly responsive UI in React Native?
 *    → Combine:
 *       - Flexbox (fluid layouts)
 *       - Dimensions (screen size handling)
 *       - PixelRatio (density adjustments)
 *       - Percentage widths/heights
 *
 * ==============================================================
 */
