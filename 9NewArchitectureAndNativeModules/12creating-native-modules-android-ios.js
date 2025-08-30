/*******************************************************
 * 📘 React Native Notes
 * Topic: Creating Native Modules (Android / iOS)
 *******************************************************/

/********************************************
 * 🟢 What are Native Modules?
 ********************************************/
/**
 * - React Native lets you write most logic in JS/TS.
 * - But sometimes you need **native code** (Java/Kotlin for Android, Obj-C/Swift for iOS).
 * - **Native Modules** let you:
 *   ✅ Access native APIs (Camera, Sensors, Bluetooth, etc.)
 *   ✅ Run CPU-intensive tasks faster (outside JS thread).
 *   ✅ Expose new platform-specific features to JS.
 *
 * - With New Architecture → Native Modules use **TurboModules (JSI)**.
 */

/********************************************
 * ⚡ Steps to Create a Native Module (Android)
 ********************************************/
/**
 * Example: Create a Native Module to get Battery Level
 *
 * 1. Create a new Java/Kotlin class
 *    - Extend `ReactContextBaseJavaModule`.
 *    - Annotate methods with `@ReactMethod`.
 *
 * 2. Register the Module
 *    - Add it to a `ReactPackage` and register with RN.
 *
 * 3. Access from JavaScript
 *    - Import using `NativeModules.YourModuleName`.
 */

/* 
// 👉 Example: Android (Java)
package com.myapp;

import android.os.BatteryManager;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.Context;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class BatteryModule extends ReactContextBaseJavaModule {
    BatteryModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "BatteryModule"; // Used in JS
    }

    @ReactMethod
    public void getBatteryLevel(Promise promise) {
        try {
            IntentFilter ifilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
            Intent batteryStatus = getReactApplicationContext().registerReceiver(null, ifilter);
            int level = batteryStatus.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
            promise.resolve(level);
        } catch (Exception e) {
            promise.reject("ERROR", e);
        }
    }
}

// 👉 Register the Module (Android)
package com.myapp;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.uimanager.ViewManager;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class BatteryPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new BatteryModule(reactContext));
        return modules;
    }
    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
*/

/********************************************
 * ⚡ Steps to Create a Native Module (iOS)
 ********************************************/
/**
 * Example: Same Battery Level Module
 *
 * 1. Create Objective-C / Swift file
 *    - Extend `RCTBridgeModule`.
 *    - Use `RCT_EXPORT_METHOD` to expose methods.
 *
 * 2. Link with React Native.
 *
 * 3. Access from JavaScript (same as Android).
 */

// 👉 Example: iOS (Objective-C)
/*
#import <React/RCTBridgeModule.h>
#import <UIKit/UIKit.h>

@interface RCT_EXTERN_MODULE(BatteryModule, NSObject)
RCT_EXTERN_METHOD(getBatteryLevel:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
@end

// BatteryModule.m
#import "React/RCTBridgeModule.h"

@interface BatteryModule : NSObject <RCTBridgeModule>
@end

@implementation BatteryModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getBatteryLevel:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  UIDevice *device = [UIDevice currentDevice];
  device.batteryMonitoringEnabled = YES;
  float batteryLevel = device.batteryLevel * 100;
  if (batteryLevel < 0) {
    reject(@"ERROR", @"Could not fetch battery level", nil);
  } else {
    resolve(@(batteryLevel));
  }
}
@end

*/

/********************************************
 * ⚡ JavaScript Usage (Cross-Platform)
 ********************************************/
import { NativeModules } from "react-native";
const { BatteryModule } = NativeModules;

BatteryModule.getBatteryLevel()
  .then((level) => console.log("🔋 Battery Level:", level))
  .catch((err) => console.error(err));

/********************************************
 * 🔥 TurboModules (New Arch Way)
 ********************************************/
/**
 * With New Architecture:
 * - We use **Codegen + TurboModules**.
 * - Write a TypeScript interface → Codegen generates native bindings.
 * - Performance: no Bridge, direct JSI calls.
 *
 * Example Spec (TypeScript):
 *
 * // BatterySpec.ts
 * export interface Spec extends TurboModule {
 *   getBatteryLevel(): Promise<number>;
 * }
 *
 * This generates native bindings automatically.
 */

/********************************************
 * 🔑 Interview Q&A Recap
 ********************************************/
/**
 * Q: Why do we need Native Modules?
 * A: To use native APIs and run heavy tasks outside JS thread.
 *
 * Q: Difference between NativeModules and TurboModules?
 * A: NativeModules use Bridge; TurboModules use JSI (faster, no serialization).
 *
 * Q: How do you register a Native Module?
 * A: In Android → add to ReactPackage; in iOS → RCTBridgeModule.
 *
 * Q: How do TurboModules improve performance?
 * A: They remove the Bridge and allow direct JS ↔ Native calls.
 */
