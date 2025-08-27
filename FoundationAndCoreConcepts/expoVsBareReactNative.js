/*
========================================
Expo vs Bare React Native
========================================
Goal: Understand the difference between using Expo-managed workflow and Bare React Native.
*/

/*
Mental Model
------------
Think of React Native like a car engine:
- **Bare React Native** = You get the raw engine, and you must build the car around it (manual setup, full control).
- **Expo** = A pre-built car with tools and services already included (batteries included).
*/

/*
1) What is Expo?
----------------
- A framework and set of tools built on top of React Native.
- Provides pre-configured setup, ready-to-use libraries, and build services.
- You write RN code → Expo handles bundling, building, and running.

Why use it?
- Fast setup (no Xcode/Android Studio needed initially).
- Comes with lots of prebuilt APIs (camera, push notifications, sensors, etc.).
- Managed workflow = Expo updates dependencies and configs for you.

Analogy: Expo is like using a Lego set where blocks are pre-shaped, so you can quickly build without worrying about raw materials.
*/

/*
2) What is Bare React Native?
-----------------------------
- Using RN directly without Expo’s managed services.
- You set up Android/iOS projects yourself.
- You have full access to native code (Java/Kotlin for Android, Swift/ObjC for iOS).

Why use it?
- Needed when you require custom native modules that Expo doesn’t support.
- Greater flexibility, but more setup and maintenance.

Analogy: Bare RN is like building a car from scratch – you control everything, but it takes longer and requires expertise.
*/

/*
3) Expo Workflow Types
----------------------
- **Managed Workflow**:
  - Easiest path.
  - Expo manages native code.
  - You mostly write JS/TS.
  - Great for simple to medium apps.

- **Bare Workflow**:
  - Starts with Expo project but you “eject” → get full native Android/iOS folders.
  - You still use Expo SDK but can also add your own native code.
*/

/*
4) Example Code (Expo vs Bare)
------------------------------

// Expo Managed Workflow
import { Camera } from 'expo-camera';

async function takePicture() {
  const { status } = await Camera.requestCameraPermissionsAsync();
  if (status === 'granted') {
    // Use camera directly
  }
}

// Bare React Native
// You’d install a third-party library like react-native-camera
import { RNCamera } from 'react-native-camera';

function CameraView() {
  return <RNCamera style={{ flex: 1 }} />;
}
*/

/*
5) Advantages & Disadvantages
-----------------------------
Expo (Managed Workflow):
+ Super fast setup.
+ No need for Android Studio/Xcode for development.
+ OTA (Over The Air) updates built-in.
+ Large set of APIs ready-to-use.
- Not all native APIs supported.
- App size larger (includes unused native modules).
- Ejecting later can be painful.

Bare React Native:
+ Full control over native code.
+ Add any custom native library.
+ Lighter build size if optimized.
- Setup is more complex.
- Must manage native dependencies yourself.
- Requires Android Studio/Xcode.
*/

/*
6) When to Choose Expo vs Bare
------------------------------
Choose **Expo Managed Workflow** when:
- You want to prototype quickly.
- You don’t need custom native modules.
- You want easy builds and OTA updates.

Choose **Bare React Native** when:
- You need custom native functionality.
- Your app is large and complex.
- You need fine control over dependencies.
*/

/*
7) Build & Deployment Differences
---------------------------------
Expo:
- Build with `expo build` or `eas build` (Expo Application Services).
- Can publish updates instantly with `expo publish`.

Bare RN:
- Build with Android Studio / Xcode.
- No built-in OTA updates (must use services like CodePush).
*/

/*
Cheat Sheet
-----------
- **Expo = batteries included**. Great for speed, limited for flexibility.
- **Bare RN = raw control**. Great for flexibility, slower to set up.
- Managed Workflow = Expo handles native.
- Bare Workflow = You handle native (can still use Expo APIs).
- Expo → good for MVPs, prototypes, small-medium apps.
- Bare → good for production-grade, custom, complex apps.
*/
