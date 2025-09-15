/********************************************************************
 * 📡 Bluetooth, NFC & Device Sensors APIs in React Native
 * -----------------------------------------------------------------
 * Mobile devices come with hardware capabilities that apps can use:
 *   🔹 Bluetooth → connect to nearby devices (headphones, IoT, BLE sensors)
 *   🔹 NFC → tap-based data exchange (payments, tags, IDs)
 *   🔹 Device Sensors → accelerometer, gyroscope, magnetometer, pedometer
 *
 * React Native provides these via **native modules** or community libraries.
 ********************************************************************/

/********************************************
 * 🔹 1. Bluetooth
 ********************************************/
/**
 * - Bluetooth enables wireless communication between devices.
 * - Two modes:
 *   ✅ Classic Bluetooth → audio devices, file transfer
 *   ✅ Bluetooth Low Energy (BLE) → health devices, wearables, IoT sensors
 *
 * - Popular libraries:
 *   → react-native-ble-plx (BLE scanning, connect, read/write, notifications)
 *   → react-native-bluetooth-classic (for older Bluetooth devices)
 *
 * Example: Scan & connect using BLE
 *
 * import { BleManager } from "react-native-ble-plx";
 * const manager = new BleManager();
 *
 * manager.startDeviceScan(null, null, (error, device) => {
 *   if (error) return;
 *   console.log("Found device:", device.name);
 *   if (device.name === "HeartRateMonitor") {
 *     manager.stopDeviceScan();
 *     device.connect().then((d) => console.log("Connected:", d.id));
 *   }
 * });
 *
 * ✅ Use Cases: Health trackers, smartwatches, IoT devices
 * ❌ Limitations: Requires permissions (Location/BT), background usage restricted
 */

/********************************************
 * 🔹 2. NFC (Near Field Communication)
 ********************************************/
/**
 * - NFC allows **short-range communication** (~4 cm).
 * - Common use cases:
 *   ✅ Contactless payments (Google Pay, Apple Pay)
 *   ✅ Reading NFC tags (access cards, posters, product info)
 *   ✅ Peer-to-peer data sharing
 *
 * - Popular libraries:
 *   → react-native-nfc-manager
 *
 * Example: Read NFC Tag
 *
 * import NfcManager, { NfcTech } from "react-native-nfc-manager";
 *
 * async function readTag() {
 *   await NfcManager.start();
 *   try {
 *     await NfcManager.requestTechnology(NfcTech.Ndef);
 *     const tag = await NfcManager.getTag();
 *     console.log("NFC Tag:", tag);
 *     await NfcManager.cancelTechnologyRequest();
 *   } catch (e) {
 *     console.warn("NFC Error:", e);
 *   }
 * }
 *
 * ✅ Use Cases: Payment, ticket scanning, authentication, logistics
 * ❌ Limitations: Limited hardware support (iOS restricted to NDEF), close-range only
 */

/********************************************
 * 🔹 3. Device Sensors
 ********************************************/
/**
 * - Smartphones have multiple sensors exposed via APIs.
 *
 * Common ones:
 *   ✅ Accelerometer → detect motion, shake, step counting
 *   ✅ Gyroscope → device rotation (gaming, AR/VR)
 *   ✅ Magnetometer → compass direction
 *   ✅ Pedometer → step counting
 *   ✅ Barometer → altitude (weather apps)
 *
 * - Popular libraries:
 *   → react-native-sensors
 *   → expo-sensors (if using Expo)
 *
 * Example: Accelerometer (Expo)
 *
 * import { Accelerometer } from "expo-sensors";
 * import { useEffect } from "react";
 *
 * useEffect(() => {
 *   const sub = Accelerometer.addListener(({ x, y, z }) => {
 *     console.log(`Accel: x=${x}, y=${y}, z=${z}`);
 *   });
 *   return () => sub && sub.remove();
 * }, []);
 *
 * ✅ Use Cases: Fitness apps, AR/VR, gesture detection, navigation
 * ❌ Limitations: High-frequency polling drains battery
 */

/********************************************
 * 🔹 4. Permissions
 ********************************************/
/**
 * - Always request runtime permissions before using Bluetooth, NFC, or sensors:
 *   ✅ Android: AndroidManifest.xml + runtime checks
 *   ✅ iOS: Info.plist + NSBluetoothAlwaysUsageDescription, NSMotionUsageDescription
 *
 * Example (Android Manifest):
 * <uses-permission android:name="android.permission.BLUETOOTH_SCAN"/>
 * <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
 *
 * Example (iOS Info.plist):
 * <key>NSBluetoothAlwaysUsageDescription</key>
 * <string>App needs Bluetooth to connect to devices.</string>
 */

/********************************************
 * 🔹 5. Comparison Table
 ********************************************/
/**
 * API        | Range     | Use Cases                    | Limitations
 * -----------|-----------|------------------------------|--------------------------
 * Bluetooth  | ~10 m     | IoT devices, wearables, audio| Needs permissions, pairing
 * NFC        | ~4 cm     | Payments, tags, tickets      | Short range, iOS limited
 * Sensors    | Device-only | Fitness, gaming, AR/VR      | Battery drain, noisy data
 */

/********************************************
 * ❓ Q&A (Interview Prep)
 ********************************************/
/**
 * Q1: Why does BLE often require location permission on Android?
 *   → Because BLE scanning can reveal location-based beacons.
 *
 * Q2: Can iOS apps write to NFC tags?
 *   → Limited: iOS allows reading tags, but writing is restricted to certain formats.
 *
 * Q3: How do you avoid battery drain when using sensors?
 *   → Use throttling (set update interval), unsubscribe when not in use.
 *
 * Q4: Why choose BLE over Classic Bluetooth?
 *   → BLE is optimized for low-power, small data transfers (IoT).
 */
