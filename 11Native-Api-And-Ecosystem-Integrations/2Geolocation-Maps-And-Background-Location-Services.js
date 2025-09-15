/********************************************************************
 * 📍 Geolocation, Maps & Background Location in React Native
 * ---------------------------------------------------------------
 * Location-based features are very common in mobile apps (ride-sharing,
 * delivery tracking, fitness, maps). React Native offers multiple libraries
 * and native APIs to handle location tracking, maps rendering, and background
 * services.
 ********************************************************************/

/********************************************
 * 🔹 Geolocation in React Native
 ********************************************/
/**
 * - Geolocation allows apps to fetch user's current location (lat, long, accuracy).
 * - Libraries:
 *   ✅ react-native-geolocation-service (recommended, reliable & updated)
 *   ✅ @react-native-community/geolocation (deprecated in favor of above)
 *   ✅ Expo-location (if using Expo ecosystem)
 *
 * 🛠 Installation (bare RN):
 *   npm install react-native-geolocation-service
 *
 * 🛠 Example:
 * import Geolocation from "react-native-geolocation-service";
 *
 * Geolocation.getCurrentPosition(
 *   (position) => {
 *     console.log(position.coords.latitude, position.coords.longitude);
 *   },
 *   (error) => {
 *     console.error(error);
 *   },
 *   { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
 * );
 *
 * ✅ Permissions required:
 *   - iOS: NSLocationWhenInUseUsageDescription / NSLocationAlwaysUsageDescription
 *   - Android: ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION
 */

/********************************************
 * 🔹 Maps in React Native
 ********************************************/
/**
 * - Popular Library: react-native-maps
 * - Features:
 *   ✅ Google Maps / Apple Maps rendering
 *   ✅ Markers, Polygons, Polylines
 *   ✅ Custom map styling
 *   ✅ Map events (onRegionChange, onPress)
 *
 * 📦 Installation:
 *   npm install react-native-maps
 *
 * 🛠 Example:
 * import MapView, { Marker } from "react-native-maps";
 *
 * <MapView
 *   style={{ flex: 1 }}
 *   initialRegion={{
 *     latitude: 37.78825,
 *     longitude: -122.4324,
 *     latitudeDelta: 0.0922,
 *     longitudeDelta: 0.0421,
 *   }}
 * >
 *   <Marker coordinate={{ latitude: 37.78825, longitude: -122.4324 }} />
 * </MapView>
 *
 * ✅ Use cases:
 *   - Showing user’s live location
 *   - Route tracking
 *   - Displaying nearby places (restaurants, ATMs, etc.)
 */

/********************************************
 * 🔹 Background Location Services
 ********************************************/
/**
 * - Needed for tracking location when app is in background/terminated.
 * - Use Cases:
 *   ✅ Delivery apps (track driver live location)
 *   ✅ Fitness apps (step tracking, running path)
 *   ✅ Geo-fencing (send notification when entering an area)
 *
 * 📦 Libraries:
 *   - react-native-background-geolocation (paid but robust, battery-optimized)
 *   - react-native-background-fetch (for periodic tasks, less accurate)
 *   - Expo-location (background updates in managed workflow)
 *
 * 🛠 Example (react-native-background-geolocation):
 * import BackgroundGeolocation from "react-native-background-geolocation";
 *
 * BackgroundGeolocation.onLocation(location => {
 *   console.log(location.coords.latitude, location.coords.longitude);
 * });
 *
 * BackgroundGeolocation.start();
 *
 * ✅ Permissions:
 *   - iOS: NSLocationAlwaysAndWhenInUseUsageDescription
 *   - Android: ACCESS_BACKGROUND_LOCATION (Android 10+), foreground + background services
 *
 * ⚠️ Challenges:
 *   - Battery drain if not optimized
 *   - OS restrictions (iOS stricter than Android)
 *   - Must explain usage to App Store / Play Store reviewers
 */

/********************************************
 * 🔹 Permission Handling
 ********************************************/
/**
 * Always request location permissions properly:
 *
 * 📦 Library: react-native-permissions
 *   npm install react-native-permissions
 *
 * Example:
 * import { request, PERMISSIONS } from "react-native-permissions";
 *
 * request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
 *   console.log(result); // granted / denied / blocked
 * });
 *
 * iOS requires plist entries (usage descriptions).
 */

/********************************************
 * 🔹 Optimizations & Best Practices
 ********************************************/
/**
 * ✅ Use high-accuracy mode only when needed (GPS drains battery).
 * ✅ Use background services sparingly (delivery, fitness apps).
 * ✅ Batch location updates (reduce server calls).
 * ✅ Always show a notification when tracking in background (Android requirement).
 * ✅ Explain clearly in app why location is needed (App Store policy).
 */

/********************************************
 * ❓ Q&A (Interview Prep)
 ********************************************/
/**
 * Q1: How to show user's current location on map?
 *   → Use react-native-maps with react-native-geolocation-service to fetch current location.
 *
 * Q2: How to handle background location updates?
 *   → Use react-native-background-geolocation with proper permissions (Android/iOS).
 *
 * Q3: Why do background services drain battery?
 *   → Continuous GPS polling, sensor usage, and network updates consume resources.
 *
 * Q4: Can Expo apps track location in background?
 *   → Yes, with expo-location, but with limitations (not as flexible as bare RN).
 *
 * Q5: How do you handle permissions differently in Android vs iOS?
 *   → Android requires runtime + manifest permissions.
 *   → iOS requires plist entries + user confirmation.
 */
