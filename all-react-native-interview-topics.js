/*

🧱 1. Foundations & Core Concepts
* React Native architecture overview – Bridge, Native Threads, JavaScript Thread
* Rendering pipeline – native UI components vs DOM
* Expo vs Bare React Native
* Metro bundler
* Old Bridge internals – JSON serialization, batched queues
* Motivation for New Architecture – type safety, sync calls, performance

🔢 2. Components & Props
* Functional vs Class Components
* PureComponent vs React.memo
* Props drilling vs composition
* Core components – View, Text, ScrollView, Image, TextInput, FlatList
* StyleSheet, Flexbox, Dimensions, PixelRatio
* PropTypes, defaultProps, children
* Custom reusable components
* SectionList & VirtualizedList
* Writing high-performance list components – RecyclerListView, FlashList
* Component-level memoization patterns
* Avoiding anonymous functions within JSX

📦 3. State Management
* useState, setState (Class vs Hooks)
* Lifting state up & composition
* useReducer
* Context API & useContext
* Redux – store, reducers, middleware, useSelector, useDispatch
* Context API vs Redux
* Redux Middleware
* Redux Thunk vs Redux Saga vs Redux Toolkit
* MobX, Zustand, Recoil
* Global vs local state – best practices
* Persisted state – redux-persist, AsyncStorage, MMKV
* Performance optimization for global state re-render problems

🔁 4. Component Lifecycle
* Lifecycle methods in Class Components (mount, update, unmount)
* useEffect – dependency array, cleanup
* class components vs functional components lifecycle
* useLayoutEffect vs useEffect
* useRef & DOM/native refs
* useRef and useCallback, useMemo for performance
* App lifecycle – AppState, useFocusEffect, useIsFocused
* useImperativeHandle, forwardRef
* Avoiding memory leaks (stale closures, running timers)
* useEffect pitfalls & performance cost
* Keyboard, DeepLink, Dimensions listeners cleanup

🧭 5. Routing & Navigation
* React Navigation – Stack / Tab / Drawer Navigator
* Passing params between screens
* Deep Linking, Linking API
* Navigation lifecycle events (focus, blur)
* Native navigation vs JS navigation – performance comparisons
* Code-splitting & lazy loading of screens
* Handling large navigation trees efficiently

⚙️ 6. Hooks In-Depth
* Custom Hooks – creating reusable logic
* Rules of Hooks
* useCallback, useMemo
* useId, useTransition, useDeferredValue
* useWindowDimensions, useColorScheme
* useAnimatedScrollHandler, useSharedValue (Reanimated 2)
* useSafeAreaInsets
* useImperativeHandle with forwardRef
* React 18 concurrent features
* Memory leaks & stale hook values
* Hook performance optimization techniques

🔄 7. Asynchronous Operations
* fetch / axios for API calls
* useEffect with async/await
* SWR, React Query – stale-while-revalidate, caching techniques
* AbortController, cancellation of API calls
* Offline-first & caching strategies
* Axios vs fetch networking layer on native
* AsyncStorage, SecureStorage, MMKV
* Queueing & retrying failed requests
* Handling race-conditions & deduplication
* Optimistic updates strategies

🔥 8. Performance Optimization
* Avoiding unnecessary renders – memo, useMemo, useCallback
* Virtual DOM diffing – optimizing reconciliation
* Optimizing FlatList – keyExtractor, getItemLayout, removeClippedSubviews
* RecyclerListView vs FlashList vs FlatList
* WindowSize, initialNumToRender tuning
* Hermes engine – bytecode vs JSC
* bundle splitting, lazy loading (React.lazy, Suspense)
* InteractionManager – deferring heavy work
* useNativeDriver animations
* Prefetching assets/screens – improving warm-start
* Startup time optimization – RAM bundles, inline require
* GPU overdraw & FPS debugging – Flipper Perf Monitor
* Image optimization – caching, FastImage, resizing strategies
* Avoiding JS thread blocking (large loops, heavy JSON, etc.)
* Offloading to JSI/Worker threads
* ProGuard / R8 shrinking + Hermes bytecode size
* Native navigation performance benefits

📚 9. New Architecture & Native Modules
* JSI – JavaScript Interface internals
* TurboModules – differences from NativeModules
* Fabric Renderer – Shadow Tree, commit/mount phases
* Codegen – generating C++ based module interfaces
* Bridgeless architecture – removing the old Bridge
* ViewManager migration – Legacy UIManager → Fabric Component
* Direct JSI calls – C++ HostObjects
* TurboModule registry & lazy loading
* Memory management for JSI modules (HostObject lifetime)
* Backward compatibility layer (legacy modules under New Arch)
* Threading – JS / Native UI thread / JSI thread pool
* Creating Native Modules (Android/iOS)
* Migrating third-party packages – GestureHandler, Reanimated, etc.
* New Architecture & concurrent React 18 features

🔒 10. Security, Testing & Dev Tools
* Jest, Testing Library – unit & integration testing
* Detox, Appium – E2E testing
* Flipper plugins – network, react-devtools, layout inspector
* Debugging with React DevTools, Chrome, Hermes Inspector
* Secure storage – Keychain/Keystore, SecureStore, Encrypted-Storage
* Certificate pinning – network security
* Root/Jailbreak detection – mobile hardening
* Handling auth tokens securely (HTTP-only, secure cookies vs AsyncStorage)
* WebView security – injection, CSP, allowFileAccess
* Obfuscation – ProGuard rules, JS minification
* Permission handling best practices
* Crash/RUM monitoring – Crashlytics, Sentry
* OWASP mobile top-10 considerations

📦 11. Native APIs & Ecosystem Integrations
* Camera integrations (vision-camera, expo-camera, frame processors)
* Geolocation, Maps, and Background Location Services
* Push Notifications (FCM/APNS), Local & Scheduled Notifications
* Background Tasks – Headless JS, WorkManager, BackgroundFetch
* Dynamic Links & Deep Linking
* Gesture Handler & Reanimated (V1 / V2/ V3/ V4)
* Animations – Animated API, LayoutAnimation, Reanimated 2
* Bluetooth, NFC & Device Sensors APIs
* File System Access (react-native-fs, expo-filesystem)
* Native SDK integrations (analytics, ads, in-app-purchase, payments)
* Permissions handling & platform-specific flows (Android 13+, iOS)
* Manual native linking – Gradle, Podspec, AndroidManifest/Info.plist edits
* Handling platform API level differences (e.g. Android API 21 vs 33)
* Foreground & background services (music, notification, tracking)
* Scoped storage / Content-URIs / SAF (Android 11+)
* Local DBs – SQLite, WatermelonDB, Realm, MMKV
* Media playback & streaming SDKs (ExoPlayer, AVFoundation, DRM/WebRTC)
* WearOS / watchOS / tvOS and foldable device adaptations
* React-Native-Web support for multi-platform codebases

📈 12. Deployment, CI/CD & App Store
* Android build types – debug, release, signing, ABI/App Bundle splits
* iOS provisioning – certificates, profiles, App Store Connect workflows
* Fastlane, EAS Build, automatic versioning
* CI/CD pipelines – GitHub Actions, Bitrise, CircleCI
* CodePush / OTA updates – staged rollout, rollback, hotfix pipelines
* Reducing app size – Hermes, ProGuard/R8, resource configs, asset compression
* App Store best practices – phased rollout, listing optimization
* Resolving build failures & native dependency issues
* Start-time optimizations – inline require, RAM / split bundles
* Gradle performance tuning & build caching
* Monorepo / modularized codebases (Nx/Turborepo) for large RN apps
* Security-signed artifacts – Play Integrity API / SafetyNet
* Automating metadata & screenshot uploads (Fastlane deliver)
* Git pre-push hooks for blocking faulty builds
* Play Console policy compliance (privacy/data safety/ad-ID)
* Handling iOS App Store review rejections & guidelines
* Hotfix strategies – expedited releases & OTA bypassing stores


*/
