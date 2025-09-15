// 📂 media-playback-notes.js
// Notes on Media Playback & Streaming SDKs in React Native (New Architecture Ready)

///////////////////////////////////////////
// 1. Why Media Playback in RN?
///////////////////////////////////////////
/**
 * - Support for audio & video playback in apps (music, video, podcasts, OTT).
 * - Streaming support (HLS, DASH, RTMP).
 * - DRM (Digital Rights Management) for premium/secure content.
 * - Real-time communication (RTC) via WebRTC.
 * - Platform differences:
 *   - Android → ExoPlayer (Google)
 *   - iOS → AVFoundation (Apple)
 */

///////////////////////////////////////////
// 2. ExoPlayer (Android)
///////////////////////////////////////////
/**
 * - Google's official media player for Android.
 * - Supports adaptive streaming (HLS, DASH, SmoothStreaming).
 * - Handles DRM (Widevine).
 * - Used in apps like YouTube, Netflix, Spotify.
 * - Integrates with React Native via:
 *   - react-native-video (under the hood uses ExoPlayer on Android).
 *   - Custom TurboModules if advanced controls needed.
 */

/// Example: Playing Video with react-native-video (ExoPlayer backend)
import Video from "react-native-video";

<Video
  source={{ uri: "https://example.com/video.m3u8" }}
  style={{ width: "100%", height: 200 }}
  controls={true}
  resizeMode="contain"
/>;

///////////////////////////////////////////
// 3. AVFoundation (iOS)
///////////////////////////////////////////
/**
 * - Apple’s native media playback framework.
 * - Supports HLS natively.
 * - DRM → FairPlay.
 * - Can be bridged with react-native-video or custom AVPlayer TurboModules.
 * - Low-level control: AVPlayer, AVQueuePlayer, AVAsset.
 */

/// Example: Simple AVPlayer TurboModule (ObjC++)
/*
// AVPlayerModule.mm
RCT_EXPORT_METHOD(play:(NSString *)url) {
  AVPlayer *player = [AVPlayer playerWithURL:[NSURL URLWithString:url]];
  [player play];
}
  */

/// JS usage
import { NativeModules } from "react-native";
NativeModules.AVPlayerModule.play("https://example.com/video.m3u8");

///////////////////////////////////////////
// 4. DRM (Digital Rights Management)
///////////////////////////////////////////
/**
 * - Protects premium content (Netflix, Prime Video).
 * - Platform-specific:
 *   - Android → Widevine
 *   - iOS → FairPlay
 * - Typically requires license server integration.
 * - ExoPlayer + AVFoundation both have DRM APIs.
 * - React Native integration often done via native bridges.
 */

/// Pseudo-code for DRM config (ExoPlayer)
const drmConfig = {
  type: "widevine",
  licenseServer: "https://license-server.com",
};

<Video
  source={{ uri: "https://secure-stream.mpd" }}
  drm={drmConfig}
  controls
/>;

///////////////////////////////////////////
// 5. WebRTC (Real-time streaming & calls)
///////////////////////////////////////////
/**
 * - Enables real-time audio, video, and data channels.
 * - Used for video conferencing, live streaming, peer-to-peer apps.
 * - React Native implementation → react-native-webrtc
 * - Works on both Android (ExoPlayer codecs under the hood) and iOS (AVFoundation codecs).
 */

/// Example: WebRTC usage
import { RTCPeerConnection, mediaDevices } from "react-native-webrtc";

const pc = new RTCPeerConnection();
const stream = await mediaDevices.getUserMedia({ video: true, audio: true });
pc.addStream(stream);

///////////////////////////////////////////
// 6. Best Practices (New Architecture)
///////////////////////////////////////////
/**
 * ✅ Use TurboModules for custom native SDK integrations (ExoPlayer, AVFoundation).
 * ✅ Always handle lifecycle (pause on background, resume on foreground).
 * ✅ Manage memory:
 *    - Release player on unmount
 *    - Avoid multiple players running
 * ✅ DRM:
 *    - Store tokens/keys securely (Keychain/Keystore).
 * ✅ Optimize streaming:
 *    - Use adaptive bitrate (HLS/DASH).
 *    - Preload video segments when possible.
 * ✅ Testing:
 *    - Use real devices (emulators have limited codec support).
 */

///////////////////////////////////////////
// 7. Comparison Table
///////////////////////////////////////////
/**
 * | Feature             | ExoPlayer (Android)          | AVFoundation (iOS)        | WebRTC (Cross-platform)     |
 * |---------------------|------------------------------|---------------------------|-----------------------------|
 * | Streaming Protocols | HLS, DASH, SmoothStreaming   | HLS (native), MP4         | RTP, SRTP (real-time)       |
 * | DRM Support         | Widevine                    | FairPlay                  | ❌ (handled separately)      |
 * | Use Case            | Video/audio playback, OTT   | Video/audio playback, OTT | Real-time calls, live video |
 * | RN Integration      | react-native-video / TurboM | react-native-video / TurboM | react-native-webrtc         |
 * | Performance         | High, optimized for Android | High, optimized for iOS   | Depends on network, codecs  |
 */

///////////////////////////////////////////
// 8. When to use what?
///////////////////////////////////////////
/**
 * - ExoPlayer → Android OTT apps, DRM, adaptive streaming.
 * - AVFoundation → iOS video/music apps, DRM.
 * - WebRTC → Real-time calls, conferencing, peer-to-peer.
 * - For cross-platform video playback → use react-native-video.
 */

/* 

// 📱 React Native & Mobile Development Notes (New Architecture)

/* -------------------------------------------------------------------------- */
/*                            📌 React Fundamentals                            */
/* -------------------------------------------------------------------------- */
// (Already documented earlier... keeping as baseline, not repeating here)

/* -------------------------------------------------------------------------- */
/*        📂 Manual Native Linking – Gradle, Podspec, AndroidManifest/Info.plist */
/* -------------------------------------------------------------------------- */
// ✅ New Architecture (Fabric + TurboModules):
// - Prefer autolinking for most libraries (RN 0.60+).
// - Manual linking still required for SDKs without autolink support.
// - Android: Add dependency in `build.gradle`, update `AndroidManifest.xml`, create TurboModule binding if custom native code.
// - iOS: Add `.podspec` or edit `Podfile`, update `Info.plist`, and register module in bridging header if required.

/* -------------------------------------------------------------------------- */
/*      ⚙️ Handling Platform API Level Differences (Android API 21 vs 33+)       */
/* -------------------------------------------------------------------------- */
// - Always check `Platform.Version` in React Native JS.
// - Use `Build.VERSION.SDK_INT` in native Android code.
// - Example: Android 13+ (API 33) requires `POST_NOTIFICATIONS` permission.
// - Scoped Storage (Android 11+, API 30) → replace direct file paths with `Content URIs`.
// - For iOS, check `Platform.constants.osVersion` or native APIs for version gating.

/* -------------------------------------------------------------------------- */
/*    🔄 Foreground & Background Services (Music, Notification, Tracking)       */
/* -------------------------------------------------------------------------- */
// - Foreground services → persistent tasks (music player, step counter, location).
// - Android: Use `ForegroundService` with notification (mandatory for API 26+).
// - iOS: Use `BackgroundModes` in Xcode (audio, location, VOIP, fetch).
// - RN integration: Headless JS (Android), AppRegistry tasks, Native modules for iOS.
// - New architecture: wrap native services in TurboModules for async APIs.

/* -------------------------------------------------------------------------- */
/*        📂 Scoped Storage / Content-URIs / Storage Access Framework (SAF)     */
/* -------------------------------------------------------------------------- */
// - Android 11+ (API 30) → Scoped storage enforced.
// - Direct access to `/storage/emulated/0/` is blocked.
// - Use `MediaStore` APIs or `Storage Access Framework` (SAF).
// - SAF → Intent-based file picker, returns `Content URI`.
// - React Native libs: `react-native-document-picker`, `expo-document-picker`.
// - Always request correct `READ_EXTERNAL_STORAGE` / `WRITE_EXTERNAL_STORAGE` or `MANAGE_EXTERNAL_STORAGE` (only if critical).

/* -------------------------------------------------------------------------- */
/*          💾 Local Databases – SQLite, WatermelonDB, Realm, MMKV             */
/* -------------------------------------------------------------------------- */
// - SQLite → Lightweight, SQL queries, `react-native-sqlite-storage`.
// - WatermelonDB → Offline-first, sync engine, works with SQLite backend.
// - Realm → NoSQL, fast, live objects, sync features.
// - MMKV → Key-value storage, super fast (by WeChat), based on mmap.
// - New architecture: Use JSI bindings for performance (Realm, MMKV already support JSI).

/* -------------------------------------------------------------------------- */
/*     🎵 Media Playback & Streaming SDKs (ExoPlayer, AVFoundation, DRM)       */
/* -------------------------------------------------------------------------- */
// - ExoPlayer (Android): Advanced video/audio playback, DRM, DASH/HLS streaming.
// - AVFoundation (iOS): Apple’s framework for audio/video handling.
// - DRM → Widevine (Android), FairPlay (iOS).
// - WebRTC → Real-time communication (video calls, live streams).
// - RN Libraries: `react-native-video` (basic), custom native modules for DRM.
// - New architecture: Wrap ExoPlayer/AVFoundation in TurboModules for async control + JSI for performance-critical paths.
