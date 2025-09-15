// =============================
// MANUAL NATIVE LINKING – NEW ARCHITECTURE
// =============================

// 1. Why Manual Linking?
// -----------------------------
// - Autolinking handles most libraries (RN 0.60+)
// - Manual linking needed when:
//   * Adding custom native SDKs (analytics, ads, payments, etc.)
//   * Editing Gradle / Podspec
//   * Adding permissions (AndroidManifest.xml / Info.plist)
//   * Adding entitlements (iOS – Push, Apple Pay, etc.)
//   * Native UI components via Fabric
//   * TurboModules with Codegen

// =============================
// 2. ANDROID MANUAL LINKING
// =============================
/*
// Gradle (android/app/build.gradle)
dependencies {
  implementation 'com.example:mylibrary:1.0.0'
}

// TurboModule Spec (MyModuleSpec.js)
import { TurboModuleRegistry } from 'react-native';
export interface Spec extends TurboModule {
  getDeviceInfo: () => string;
}
export default TurboModuleRegistry.getEnforcing<Spec>('MyModule');

// Native Module (MyModule.java)
public class MyModule extends NativeMyModuleSpec {
  @Override
  public String getDeviceInfo() {
    return Build.MODEL;
  }
}

// AndroidManifest.xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<application>
  <activity android:name="com.example.MyActivity"/>
</application>

// =============================
// 3. iOS MANUAL LINKING
// =============================

// Podfile (ios/Podfile)
pod 'MyNativeSDK', '~> 2.0.0'

// TurboModule Header (MyModule.h)
#import <React-Codegen/MyModuleSpec.h>
@interface MyModule : NSObject <NativeMyModuleSpec>
@end

// Implementation (MyModule.mm / ObjC++)
@implementation MyModule
- (NSString *)getDeviceInfo {
  return [[UIDevice currentDevice] model];
}
@end

// Info.plist
<key>NSCameraUsageDescription</key>
<string>Camera access needed for scanning</string>

// Entitlements (e.g., Apple Pay)
<key>com.apple.developer.in-app-payments</key>
<array>
  <string>merchant.com.example</string>
</array>
*/

// =============================
// 4. BEST PRACTICES
// =============================
// ✅ Use Codegen for TurboModules & Fabric components
// ✅ Enable Hermes for JSI performance
// ✅ Keep all platform permissions documented
// ✅ Test custom modules in a bare RN app before publishing
// ✅ Keep legacy Bridge fallback for non-migrated packages
