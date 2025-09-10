// 📂 storage-notes.js
// Notes on Scoped Storage, SAF, and Content URIs in Android 11+
// (React Native – New Architecture Ready)

//////////////////////////////
// 1. Scoped Storage Basics //
//////////////////////////////

/**
 * - Introduced in Android 10, enforced in Android 11+.
 * - Apps get isolated storage, no direct access to `/sdcard/`.
 * - File paths like `/storage/emulated/0/...` are deprecated.
 * - Use:
 *   - App-specific storage (/data/data/<pkg>/files or /Android/data/<pkg>/files)
 *   - MediaStore APIs for shared media (photos, videos, audio)
 *   - Storage Access Framework (SAF) for user-selected files
 */

//////////////////////////////////////////////
// 2. Content URIs instead of File Paths    //
//////////////////////////////////////////////

/**
 * - Android now provides `content://` URIs instead of raw paths.
 * - Example: `content://media/external/images/media/1234`
 * - Direct FS libraries (`react-native-fs`) cannot read them directly.
 * - Must use:
 *   - SAF
 *   - MediaStore
 *   - Native bridging (TurboModule / JSI) to access InputStream
 */

////////////////////////////////////////
// 3. SAF (Storage Access Framework)  //
////////////////////////////////////////

// ✅ Example with Expo Document Picker
import * as DocumentPicker from "expo-document-picker";

async function pickFile() {
  const result = await DocumentPicker.getDocumentAsync({
    type: "*/*", // or "image/*"
    copyToCacheDirectory: true,
  });

  if (result.type === "success") {
    console.log("Picked File URI:", result.uri); // content://...
  }
}

////////////////////////////////////////////////
// 4. App-specific storage (no permission)    //
////////////////////////////////////////////////

// ✅ Example with expo-file-system
import * as FileSystem from "expo-file-system";

async function saveData() {
  const fileUri = FileSystem.documentDirectory + "data.json";
  await FileSystem.writeAsStringAsync(fileUri, JSON.stringify({ foo: "bar" }));
  console.log("Saved at", fileUri);
}

/////////////////////////////////////
// 5. MediaStore for Shared Media  //
/////////////////////////////////////

// ✅ Example with expo-media-library
import * as MediaLibrary from "expo-media-library";

async function savePhoto(uri) {
  await MediaLibrary.requestPermissionsAsync();
  const asset = await MediaLibrary.createAssetAsync(uri);
  console.log("Saved to gallery:", asset);
}

/////////////////////////////////////
// 6. Android 11+ Permissions      //
/////////////////////////////////////

/**
 * - For MediaStore:
 *    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
 *    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
 *    <uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
 *
 * - MANAGE_EXTERNAL_STORAGE (discouraged, full access).
 * - Scoped Storage forces minimal, type-specific permissions.
 */

//////////////////////////////////////////////////////////
// 7. Bridging Content URIs via TurboModule / JSI       //
//////////////////////////////////////////////////////////

/**
 * Some libraries break when trying to read `content://` URIs directly.
 * With New Architecture (TurboModules / JSI), we can bridge native code:
 *
 * ✅ Android (Kotlin example – TurboModule)
 *
 * fun readContentUri(uri: String): String {
 *   val resolver = reactContext.contentResolver
 *   val inputStream = resolver.openInputStream(Uri.parse(uri))
 *   val bytes = inputStream?.readBytes()
 *   return Base64.encodeToString(bytes, Base64.DEFAULT)
 * }
 *
 * - This returns file data as Base64 back to JS layer.
 *
 * ✅ JS usage:
 */

// Pseudo JS usage of TurboModule bridge
import { NativeModules } from "react-native";
const { ContentUriReader } = NativeModules;

async function readContentUri(uri) {
  const base64Data = await ContentUriReader.read(uri);
  console.log("File data in Base64:", base64Data.slice(0, 100));
}

/////////////////////////////////////////
// 8. Best Practices (New Architecture) //
/////////////////////////////////////////

/**
 * 1. Use app-specific storage for private files.
 * 2. SAF for user-selected files.
 * 3. MediaStore for shared media (images, video, audio).
 * 4. Always handle content:// URIs (not file paths).
 * 5. Use JSI/TurboModules for efficient ContentResolver access.
 * 6. Request minimum permissions (Android 13+: type-specific).
 * 7. On iOS, map to UIDocumentPicker & PHPhotoLibrary for parity.
 */

export { pickFile, saveData, savePhoto, readContentUri };
