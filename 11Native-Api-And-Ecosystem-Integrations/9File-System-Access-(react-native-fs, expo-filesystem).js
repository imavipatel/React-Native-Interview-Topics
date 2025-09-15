/********************************************************************
 * 📂 File System Access in React Native
 * -----------------------------------------------------------------
 * Unlike the web, mobile apps have direct access to the **device file
 * system** (with restrictions for security & sandboxing).
 *
 * Two popular solutions:
 *   🔹 react-native-fs → Full-featured native file system library
 *   🔹 expo-file-system → Expo’s lightweight file access API
 *
 * Used for: 📥 downloads, 📤 uploads, 📝 caching, 🎵 media storage
 ********************************************************************/

/********************************************
 * 🔹 1. Why File System Access?
 ********************************************/
/**
 * - Store user-generated data (images, PDFs, logs).
 * - Cache network responses (offline mode).
 * - Download media files for playback.
 * - Upload files to a server.
 * - Read/write JSON for configs.
 * - Handle large files (video, audio) outside of async-storage.
 *
 * 🛑 Remember: AsyncStorage ≠ File storage.
 * AsyncStorage is for small key-value data (settings, tokens).
 */

/********************************************
 * 🔹 2. react-native-fs (RNFS)
 ********************************************/
/**
 * Installation:
 *   npm install react-native-fs
 *
 * Common APIs:
 *   → RNFS.DocumentDirectoryPath (app-only files, backed up to iCloud/Google Drive)
 *   → RNFS.ExternalDirectoryPath (Android external storage)
 *   → RNFS.DownloadDirectoryPath (Android downloads folder)
 *
 * Example 1: Write & Read a File
 *
 * import RNFS from "react-native-fs";
 *
 * const path = RNFS.DocumentDirectoryPath + "/notes.txt";
 *
 * // Write
 * RNFS.writeFile(path, "Hello React Native FS!", "utf8")
 *   .then(() => console.log("File written!"))
 *   .catch(console.error);
 *
 * // Read
 * RNFS.readFile(path, "utf8")
 *   .then(content => console.log("File content:", content))
 *   .catch(console.error);
 *
 *
 * Example 2: Download a File
 *
 * const dest = RNFS.DownloadDirectoryPath + "/image.jpg";
 * RNFS.downloadFile({
 *   fromUrl: "https://picsum.photos/200",
 *   toFile: dest,
 * }).promise.then(res => console.log("Downloaded!", res));
 *
 *
 * Example 3: Upload a File (Multipart)
 *
 * RNFS.uploadFiles({
 *   toUrl: "https://example.com/upload",
 *   files: [{ name: "photo", filename: "test.jpg", filepath: dest }],
 *   method: "POST",
 * }).promise.then(res => console.log("Uploaded:", res));
 *
 *
 * ✅ Pros:
 *   - Powerful: supports read/write, download, upload, move, copy, unlink.
 *   - Works outside Expo (bare RN projects).
 * ❌ Cons:
 *   - Needs native linking/config.
 *   - Permissions required for external storage on Android.
 */

/********************************************
 * 🔹 3. expo-file-system
 ********************************************/
/**
 * Installation:
 *   expo install expo-file-system
 *
 * - Sandbox-only (app directories, not global FS).
 * - Simpler API than RNFS.
 *
 * Example 1: Write & Read a File
 *
 * import * as FileSystem from "expo-file-system";
 *
 * const path = FileSystem.documentDirectory + "notes.txt";
 *
 * async function saveAndRead() {
 *   await FileSystem.writeAsStringAsync(path, "Hello Expo FS!");
 *   const data = await FileSystem.readAsStringAsync(path);
 *   console.log("File content:", data);
 * }
 *
 *
 * Example 2: Download a File
 *
 * const uri = FileSystem.documentDirectory + "photo.jpg";
 * FileSystem.downloadAsync("https://picsum.photos/200", uri)
 *   .then(({ uri }) => console.log("Downloaded to:", uri));
 *
 *
 * Example 3: Get File Info
 *
 * FileSystem.getInfoAsync(uri).then(info => {
 *   console.log("Exists?", info.exists, "Size:", info.size);
 * });
 *
 *
 * ✅ Pros:
 *   - Works seamlessly with Expo projects.
 *   - Simple API, good for caching & basic file ops.
 * ❌ Cons:
 *   - Limited vs react-native-fs (no direct upload, limited external access).
 */

/********************************************
 * 🔹 4. Permissions
 ********************************************/
/**
 * iOS:
 *   - Files are sandboxed per app.
 *   - Can access only DocumentDirectory & CachesDirectory.
 *   - External file sharing requires UIDocumentPicker.
 *
 * Android:
 *   - Scoped storage (Android 10+).
 *   - Add permissions in AndroidManifest.xml:
 *
 * <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
 * <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
 *                  android:maxSdkVersion="28"/>
 *
 *   - From Android 11+, prefer Storage Access Framework (SAF).
 */

/********************************************
 * 🔹 5. Comparison Table
 ********************************************/
/**
 * Feature            | react-native-fs              | expo-file-system
 * -------------------|------------------------------|--------------------------
 * Write/Read files   | ✅ Full support              | ✅ Full support
 * Download           | ✅ Yes                       | ✅ Yes
 * Upload             | ✅ Yes (multipart)           | ❌ No
 * External storage   | ✅ Yes (Android only)        | ❌ No (sandbox only)
 * Expo compatibility | ❌ Needs bare workflow       | ✅ Works with Expo
 * Complexity         | High (advanced use cases)    | Low (simple use cases)
 */

/********************************************
 * 🔹 6. Best Practices
 ********************************************/
/**
 * - Use DocumentDirectory for persistent storage.
 * - Use CachesDirectory for temp files (images, API cache).
 * - Clean up old files (unlink) to save space.
 * - Always handle errors (disk full, no permissions).
 * - For large downloads, show progress to the user.
 */

/********************************************
 * ❓ Q&A (Interview Prep)
 ********************************************/
/**
 * Q1: Why prefer DocumentDirectory over ExternalDirectory?
 *   → Safer, sandboxed, backed up. External dirs may require runtime permissions.
 *
 * Q2: Can you access other apps’ files?
 *   → No, each app is sandboxed (iOS stricter than Android).
 *
 * Q3: When to use expo-file-system vs react-native-fs?
 *   → expo-file-system for simple apps (Expo managed).
 *   → react-native-fs for advanced features (upload, external dirs).
 *
 * Q4: How to handle large file downloads?
 *   → Stream/download in chunks, store in cache, clean up after use.
 */
