/**
 * ==============================================================
 * 📘 React Native Notes – Core Components
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 What are Core Components?
 * - Pre-built UI building blocks provided by React Native.
 * - They are the **basic primitives** to build mobile UIs (like HTML tags in web).
 * - Written in JavaScript, but internally map to **native UI views**.
 * - Examples: View, Text, ScrollView, Image, TextInput, FlatList.
 *
 * --------------------------------------------------------------
 * 🔹 Why Core Components?
 * - Provide cross-platform UI elements (iOS + Android).
 * - Save time (don’t need to build native views from scratch).
 * - Consistent APIs across platforms.
 * - Combine them with custom components to make full apps.
 *
 * ==============================================================
 * 🔹 1. View
 * - Container for UI elements, similar to <div> in web.
 * - Used for layout, styling, flexbox, backgrounds, borders.
 *
 * Example:
 */
import { View, Text } from "react-native";

function MyBox() {
  return (
    <View style={{ padding: 20, backgroundColor: "lightblue" }}>
      <Text>Hello from a View!</Text>
    </View>
  );
}

/**
 * --------------------------------------------------------------
 * 🔹 2. Text
 * - Used to display text strings.
 * - Supports nesting, styling, and touch handling.
 *
 * Example:
 */
function MyText() {
  return (
    <Text style={{ fontSize: 18, color: "purple" }}>
      Welcome to React Native!
    </Text>
  );
}

/**
 * --------------------------------------------------------------
 * 🔹 3. ScrollView
 * - A container that makes its content scrollable.
 * - Good for smaller lists with fewer items.
 * - Not memory efficient for very large lists (renders everything).
 *
 * Example:
 */
import { ScrollView } from "react-native";

function MyScroll() {
  return (
    <ScrollView style={{ margin: 20 }}>
      <Text>Item 1</Text>
      <Text>Item 2</Text>
      <Text>Item 3</Text>
      {/* Keep adding, content becomes scrollable */}
    </ScrollView>
  );
}

/**
 * --------------------------------------------------------------
 * 🔹 4. Image
 * - Used to display images (local or remote URLs).
 * - Supports resize modes (cover, contain, stretch).
 *
 * Example:
 */
import { Image } from "react-native";

function MyImage() {
  return (
    <Image
      source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
      style={{ width: 50, height: 50 }}
    />
  );
}

/**
 * --------------------------------------------------------------
 * 🔹 5. TextInput
 * - Input field for user text entry.
 * - Controlled via state (value, onChangeText).
 *
 * Example:
 */
import { useState } from "react";
import { TextInput } from "react-native";

function MyInput() {
  const [text, setText] = useState("");
  return (
    <TextInput
      style={{ borderWidth: 1, padding: 10, margin: 10 }}
      placeholder="Type here"
      value={text}
      onChangeText={setText}
    />
  );
}

/**
 * --------------------------------------------------------------
 * 🔹 6. FlatList
 * - Efficient list view for large data sets.
 * - Renders items lazily (only visible items are mounted).
 * - Highly customizable (header, footer, separators, infinite scroll).
 *
 * Example:
 */
import { FlatList } from "react-native";

function MyList() {
  const data = [
    { id: "1", title: "Apple" },
    { id: "2", title: "Banana" },
  ];

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Text style={{ fontSize: 18 }}>{item.title}</Text>
      )}
    />
  );
}

/**
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: What are React Native core components?
 *    → Pre-built building blocks like View, Text, ScrollView, Image,
 *      TextInput, FlatList that map to native UI elements.
 *
 * Q2: Difference between ScrollView and FlatList?
 *    → ScrollView → renders all items at once (good for small lists).
 *      FlatList   → renders items lazily, better for large data.
 *
 * Q3: How does View differ from <div> in HTML?
 *    → Similar purpose (layout container) but maps to native views
 *      (UIView in iOS, ViewGroup in Android).
 *
 * Q4: Can Text contain nested components?
 *    → Yes. <Text> can contain strings or other <Text> components.
 *
 * Q5: Why prefer FlatList over ScrollView for large lists?
 *    → Performance. FlatList only renders visible items, saving memory.
 *
 * Q6: How is Image optimized in React Native?
 *    → Uses native image rendering (UIImageView in iOS, ImageView in Android),
 *      supports caching & resizing.
 *
 * ==============================================================
 */
