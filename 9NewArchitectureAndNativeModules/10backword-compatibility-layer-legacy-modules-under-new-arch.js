/********************************************
 * 📘 Backward Compatibility Layer (Legacy Modules under New Architecture)
 ********************************************/

/**
 * 🟢 THEORY:
 * - React Native introduced the **New Architecture** (TurboModules + Fabric + JSI).
 * - Many apps still rely on **Legacy NativeModules & UIManager**.
 * - To ensure a smooth migration, React Native provides a **Backward Compatibility Layer**.
 *
 * 🔹 Purpose:
 *   - Allow **existing legacy modules** (Java/Obj-C NativeModules & ViewManagers)
 *     to continue working inside New Architecture apps.
 *   - Developers can migrate **gradually**, instead of rewriting all modules at once.
 *
 * 🔹 How it Works:
 *   - Legacy modules are wrapped so that:
 *     - **TurboModule Registry** can register them.
 *     - **Fabric Renderer** can interoperate with legacy UIManager.
 *   - Essentially, New Arch acts as a “bridge” for old modules until fully migrated.
 *
 * 🔹 Benefits:
 *   1. Apps don’t break when enabling New Architecture.
 *   2. Third-party libraries (not migrated yet) still function.
 *   3. Teams can migrate incrementally:
 *      - Module by Module.
 *      - Screen by Screen.
 */

/**
 * 🔹 Example – Legacy Native Module in New Architecture
 *
 * // Legacy Java Native Module (Android)
 * public class MyLegacyModule extends ReactContextBaseJavaModule {
 *   @NonNull
 *   @Override
 *   public String getName() {
 *     return "MyLegacyModule";
 *   }
 *
 *   @ReactMethod
 *   public void showToast(String message) {
 *     Toast.makeText(getReactApplicationContext(), message, Toast.LENGTH_SHORT).show();
 *   }
 * }
 *
 * // In New Architecture:
 * - This still works, because RN provides a compatibility adapter.
 * - Even though it’s not a TurboModule, it’s accessible via NativeModules.
 */

/**
 * 🔹 Example – Legacy ViewManager in New Architecture
 *
 * public class MyLegacyViewManager extends SimpleViewManager<View> {
 *   @NonNull
 *   @Override
 *   public String getName() {
 *     return "MyLegacyView";
 *   }
 *
 *   @NonNull
 *   @Override
 *   protected View createViewInstance(@NonNull ThemedReactContext reactContext) {
 *     return new View(reactContext);
 *   }
 * }
 *
 * // Fabric Renderer provides a "backward-compatible adapter"
 * // so this ViewManager works inside the New Architecture,
 * // even though it has not been rewritten as a Fabric Component.
 */

/**
 * 🔹 Migration Path
 * 1. Start with backward compatibility layer → keep your app working.
 * 2. Gradually migrate:
 *    - Legacy NativeModules → TurboModules (with Codegen).
 *    - Legacy ViewManagers → Fabric Components.
 * 3. Eventually, remove legacy compatibility for full performance benefits.
 */

/**
 * 🔹 Performance Trade-offs
 * - Running in Backward Compatibility Layer means:
 *   - Still relies partly on the **old Bridge**.
 *   - Not as fast as pure JSI/TurboModules/Fabric.
 * - But: Prevents breaking apps while migrating.
 */

/**
 * 🔹 Interview Q&A
 *
 * Q: Why is a backward compatibility layer needed in React Native’s New Architecture?
 * A: To allow existing legacy modules (NativeModules, UIManager) to continue working
 *    while teams gradually migrate to TurboModules and Fabric.
 *
 * Q: Do legacy modules run as fast as TurboModules in New Architecture?
 * A: No, they still go through the old Bridge → slower. True performance comes after
 *    full migration.
 *
 * Q: Can I mix legacy and new modules in one app?
 * A: Yes. The compatibility layer allows both to coexist.
 *
 * Q: What’s the migration strategy?
 * A: Start with legacy modules under the compatibility layer → migrate incrementally
 *    to TurboModules/Fabric → remove legacy once stable.
 */
