// ==================================================
// FOREGROUND & BACKGROUND SERVICES (NEW ARCH)
// ==================================================

// Why?
// ------------------------------------
// - Many apps need to keep tasks running when the app is minimized
// - Examples:
//   * Music players → keep audio running in background
//   * Fitness/tracking apps → background location updates
//   * Messaging/notification apps → keep FCM/APNS alive
// - Foreground services ensure Android does not kill the app
// - Background tasks need careful handling (battery, permissions, platform rules)

// =============================
// 1. ANDROID FOREGROUND SERVICE
// =============================

// ⚡ Required for long-running tasks (music, GPS tracking, file upload)
// - Introduced stricter rules in Android 8+ (Oreo) → must show a notification
// - Android 12+ requires explicit FOREGROUND_SERVICE_* permissions

/*
// Example: service declaration (AndroidManifest.xml)
<service
  android:name=".MyForegroundService"
  android:foregroundServiceType="location|mediaPlayback"
  android:exported="false" />

<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION" />

// ForegroundService (Java)
public class MyForegroundService extends Service {
  @Override
  public int onStartCommand(Intent intent, int flags, int startId) {
    Notification notification = new NotificationCompat.Builder(this, "CHANNEL_ID")
      .setContentTitle("Tracking Active")
      .setContentText("Your run is being tracked")
      .setSmallIcon(R.drawable.ic_tracker)
      .build();

    startForeground(1, notification); // Service won't be killed
    return START_STICKY;
  }
}

// TurboModule example (MyServiceModule.java)
public class MyServiceModule extends NativeMyServiceModuleSpec {
  @Override
  public void startTracking() {
    Context context = getReactApplicationContext();
    Intent intent = new Intent(context, MyForegroundService.class);
    context.startForegroundService(intent);
  }
}

// =============================
// 2. iOS BACKGROUND MODES
// =============================

// ⚡ iOS has strict limitations (cannot run arbitrary tasks)
// Allowed modes: audio, location, VOIP, Bluetooth, fetch

// Enable in Xcode:
// - Project > Signing & Capabilities > Background Modes
//   * Audio, AirPlay, Picture in Picture
//   * Location updates
//   * Background fetch
//   * Remote notifications

// Info.plist Example:
<key>UIBackgroundModes</key>
<array>
  <string>audio</string>
  <string>location</string>
  <string>fetch</string>
</array>

// Example: background location (Swift)
class LocationManager: NSObject, CLLocationManagerDelegate {
  let manager = CLLocationManager()
  override init() {
    super.init()
    manager.delegate = self
    manager.allowsBackgroundLocationUpdates = true
    manager.startUpdatingLocation()
  }
}

// TurboModule Example (MyModule.mm)
@implementation MyModule
- (void)startBackgroundAudio {
  if (@available(iOS 10, *)) {
    AVAudioSession *session = [AVAudioSession sharedInstance];
    [session setCategory:AVAudioSessionCategoryPlayback error:nil];
    [session setActive:YES error:nil];
  }
}
@end

*/

// =============================
// 3. JS LAYER (Cross-Platform)
// =============================
import { AppState } from "react-native";

AppState.addEventListener("change", (state) => {
  if (state === "background") {
    console.log("App in background → save state / schedule tasks");
  } else if (state === "active") {
    console.log("App foreground → resume updates");
  }
});

// Example: BackgroundFetch (React Native community lib)
import BackgroundFetch from "react-native-background-fetch";

BackgroundFetch.configure(
  { minimumFetchInterval: 15 }, // every 15 minutes
  async (taskId) => {
    console.log("Background fetch:", taskId);
    BackgroundFetch.finish(taskId);
  },
  (error) => {
    console.log("Background fetch failed:", error);
  }
);

// =============================
// 4. NEW ARCHITECTURE CONSIDERATIONS
// =============================
// - Foreground/background services should be exposed via TurboModules
// - Codegen ensures type-safety for native service APIs
// - JSI (no bridge overhead) improves real-time tasks like audio streaming
// - Fabric allows optimized UI updates when service triggers data changes

// =============================
// 5. BEST PRACTICES
// =============================
// ✅ Android → Always show foreground notification for background tasks
// ✅ iOS → Only use allowed background modes (music, location, VOIP, fetch)
// ✅ Avoid abusing background tasks → OS will throttle or kill app
// ✅ Respect battery → throttle updates when in background
// ✅ Test on API 21 → 34 (Android) and iOS 13 → 17
// ✅ Use libraries (react-native-background-fetch, react-native-track-player) when possible
