/********************************************************************
 * 📘 Camera Integrations in React Native
 * ---------------------------------------------------------------
 * - React Native provides multiple libraries for camera access.
 * - Commonly used:
 *    🔹 react-native-vision-camera (modern, performant, customizable)
 *    🔹 expo-camera (Expo ecosystem, easier setup)
 *    🔹 Frame Processors (for real-time image/video analysis)
 ********************************************************************/

/********************************************
 * 🔹 Vision Camera (react-native-vision-camera)
 ********************************************/
/**
 * - Modern, high-performance camera library for React Native.
 * - Built on top of native APIs (AVFoundation on iOS, CameraX on Android).
 * - Supports:
 *   ✅ Photo & video capture
 *   ✅ Frame processors (real-time ML/image analysis)
 *   ✅ Permission handling
 *   ✅ Torch/flash, zoom, HDR, 60fps video
 *   ✅ Customizable UI (you build your own camera UI)
 *
 * 📦 Installation:
 *   npm install react-native-vision-camera
 *
 * 🛠 Example:
 * import { Camera, useCameraDevices } from "react-native-vision-camera";
 *
 * export default function App() {
 *   const devices = useCameraDevices();
 *   const device = devices.back;
 *
 *   if (device == null) return <Loading />;
 *   return (
 *     <Camera
 *       style={{ flex: 1 }}
 *       device={device}
 *       isActive={true}
 *       photo={true}
 *     />
 *   );
 * }
 *
 * ✅ Best for production apps needing performance + ML integrations.
 */

/********************************************
 * 🔹 Frame Processors (with Vision Camera)
 ********************************************/
/**
 * - Frame Processors = custom native code to analyze frames in real-time.
 * - Example use cases:
 *   ✅ Barcode/QR scanning
 *   ✅ Face recognition
 *   ✅ AR overlays
 *   ✅ Object detection (ML models)
 *
 * 🛠 Example with QR Scanner:
 * import { useFrameProcessor } from "react-native-vision-camera";
 * import { scanQRCodes } from "vision-camera-code-scanner";
 * import { runOnJS } from "react-native-reanimated";
 *
 * const frameProcessor = useFrameProcessor((frame) => {
 *   "worklet";
 *   const codes = scanQRCodes(frame);
 *   codes.forEach(code => runOnJS(alert)(code.displayValue));
 * }, []);
 *
 * <Camera
 *   style={{ flex: 1 }}
 *   device={device}
 *   isActive={true}
 *   frameProcessor={frameProcessor}
 *   frameProcessorFps={5}
 * />
 *
 * ✅ Runs on a background thread for performance.
 */

/********************************************
 * 🔹 Expo Camera (expo-camera)
 ********************************************/
/**
 * - Part of the Expo SDK.
 * - Easier to set up (no native linking required in managed workflow).
 * - Provides:
 *   ✅ Photo & video capture
 *   ✅ Barcode scanning (basic)
 *   ✅ Permissions handled via Expo Permissions API
 *
 * 📦 Installation:
 *   expo install expo-camera
 *
 * 🛠 Example:
 * import { Camera } from "expo-camera";
 *
 * export default function App() {
 *   const [permission, requestPermission] = Camera.useCameraPermissions();
 *
 *   if (!permission) return <View />;
 *   if (!permission.granted) {
 *     return <Button title="Grant Permission" onPress={requestPermission} />;
 *   }
 *
 *   return <Camera style={{ flex: 1 }} type="back" />;
 * }
 *
 * ✅ Best for quick prototypes, Expo-managed projects.
 * ❌ Limited customization compared to Vision Camera.
 */

/********************************************
 * 🔹 When to use what?
 ********************************************/
/**
 * ✅ Vision Camera
 * - For performance-critical apps (QR, ML, AR, video analysis).
 * - When you need frame processors (real-time detection).
 * - Best for bare React Native projects.
 *
 * ✅ Expo Camera
 * - For simple photo/video capture needs.
 * - If you’re in the Expo Managed Workflow.
 * - Faster setup, less boilerplate.
 *
 * ✅ Frame Processors
 * - When app requires **real-time analysis** of video frames.
 * - Use with Vision Camera for advanced use cases (ML models).
 */

/********************************************
 * ❓ Q&A (Interview Prep)
 ********************************************/
/**
 * Q1: Why use Vision Camera over Expo Camera?
 *   → Vision Camera = more customizable, supports frame processors, better for ML.
 *   → Expo Camera = easier setup, but limited.
 *
 * Q2: How do Frame Processors work?
 *   → Run on a separate native thread, process camera frames in real-time without blocking JS thread.
 *
 * Q3: Can we integrate ML models with React Native camera?
 *   → Yes, via Vision Camera + frame processors (TensorFlow Lite, MLKit).
 *
 * Q4: Which library is better for AR or real-time QR scanning?
 *   → Vision Camera (faster, supports native frame analysis).
 *
 * Q5: Do you need permission handling for both?
 *   → Yes, both require runtime permission handling (Camera, Microphone).
 */
