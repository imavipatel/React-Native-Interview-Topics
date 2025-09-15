// ===============================================
// React Native Web – Multi-Platform Codebases
// ===============================================

// Why?
// - Single codebase → run on iOS, Android, Web
// - Leverages RN components mapped to HTML/CSS
// - Ideal for design-system consistency + shared business logic
// - New Arch (Fabric Renderer) → improves parity with web rendering

// ---------------- Setup ----------------
// 1. Install
//   npm install react-native-web react-dom react-native-safe-area-context
// 2. Configure bundler (Webpack / Metro / Next.js)
// 3. Aliasing: map "react-native" → "react-native-web"

/*
// Example (webpack alias)
resolve: {
  alias: {
    'react-native$': 'react-native-web'
  }
}
*/

// ---------------- Component Mapping ----------------
// - RN primitives map to web equivalents:
//   <View> → <div>
//   <Text> → <span>
//   <Image> → <img>

// Example (Shared Button)
import { TouchableOpacity, Text, View } from "react-native";

export function MyButton({ title, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ padding: 10, backgroundColor: "blue" }}>
        <Text style={{ color: "white" }}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}
// Works seamlessly on iOS, Android, Web

// ---------------- Platform-Specific Code ----------------
// - Sometimes APIs differ (e.g., FileSystem, Camera)
// - Use Platform.select / file extensions (.ios.js, .android.js, .web.js)

// Example
import { Platform } from "react-native";
const API_URL = Platform.select({
  ios: "https://api.ios.example",
  android: "https://api.android.example",
  web: "https://api.web.example",
});

// ---------------- Navigation ----------------
// - Use react-navigation + react-native-web adapter
// - Or Next.js for SSR support
// - Deep linking works via Linking API

// ---------------- Styling ----------------
// - RN StyleSheet → maps to inline styles
// - No direct CSS selectors
// - For advanced layouts → use react-native-web + styled-components

// Example
import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  text: { fontSize: 16, color: "black" },
});

// ---------------- Limitations ----------------
// ⚠️ Not all RN APIs work on web (Camera, Bluetooth, Push Notifications)
// ⚠️ Native-only modules need polyfills/web alternatives
// ⚠️ Performance heavy on animations → prefer Reanimated/Web Animations API

// ---------------- New Architecture Notes ----------------
// - Fabric renderer aligns closer with DOM diffing (better parity)
// - TurboModules enable efficient platform API bridging
// - Enables same module spec across platforms (iOS/Android/Web)
// - Easier code-sharing for design systems + business logic

// ---------------- Best Practices ----------------
// ✅ Keep business logic in shared hooks (JS-only)
// ✅ Isolate platform APIs (filesystem, push, sensors)
// ✅ Use universal libraries: react-native-vector-icons, react-navigation
// ✅ Use responsive units (% / rem) for web layouts
// ✅ Test in all platforms during development

// ===============================================
// 📌 Summary
// - RN-Web allows iOS/Android/Web with single codebase
// - Platform.select + file extensions for differences
// - Works best for UI consistency & business logic sharing
// - New Arch (Fabric + TurboModules) improves performance + parity
// - Native-only features → polyfills required
// ===============================================
