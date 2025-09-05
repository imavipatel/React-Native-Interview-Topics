/******************************************************
 * 📘 Detox & Appium – End-to-End (E2E) Testing
 ******************************************************/

/********************************************
 * 🟢 What is E2E Testing?
 ********************************************/
/**
 * - End-to-End (E2E) Testing checks the **entire app flow** as a user would use it.
 * - Instead of testing just functions (unit) or components (integration),
 *   it ensures:
 *     ✅ UI + Business Logic + Network + Storage work together.
 *     ✅ App behaves correctly on a device (emulator/simulator/real).
 * - Example: "Login → Navigate to Dashboard → Logout" tested as a whole flow.
 */

/********************************************
 * 🚀 Detox
 ********************************************/
/**
 * - Detox is a **gray-box E2E testing framework** made for React Native.
 * - Focus: **Speed + Reliability** on iOS & Android.
 *
 * 🔹 Features:
 *   - Runs inside the app runtime → knows when the app is idle (no async tasks).
 *   - Auto-waits: avoids flakiness (no need to add manual sleep).
 *   - Good for CI/CD pipelines.
 *   - Direct integration with Jest.
 *
 * 🔹 When to use?
 *   - Testing React Native apps quickly.
 *   - Ensuring navigation, forms, API responses, and UI flows work correctly.
 *
 * 🔹 Example Detox Test:
 */

// e2e/firstTest.e2e.js
describe("Login Flow", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it("should show login screen", async () => {
    await expect(element(by.id("loginButton"))).toBeVisible();
  });

  it("should login successfully", async () => {
    await element(by.id("username")).typeText("john");
    await element(by.id("password")).typeText("123456");
    await element(by.id("loginButton")).tap();
    await expect(element(by.id("dashboard"))).toBeVisible();
  });
});

/********************************************
 * 🚀 Appium
 ********************************************/
/**
 * - Appium is a **cross-platform automation tool** for testing mobile & web apps.
 * - Works for iOS, Android, and even desktop apps.
 * - Language support: JavaScript, Java, Python, Ruby, etc.
 * - Uses **WebDriver protocol** (similar to Selenium for browsers).
 *
 * 🔹 Features:
 *   - Black-box testing (doesn’t need app internals).
 *   - Test React Native, native, hybrid, or mobile web apps.
 *   - Large ecosystem + plugins.
 *   - Can test multiple apps/devices in parallel.
 *
 * 🔹 When to use?
 *   - Enterprise-level projects.
 *   - If you need **multi-platform (iOS + Android + Web)** testing with one tool.
 *   - When teams already use Selenium/WebDriver.
 *
 * 🔹 Example Appium Test (JavaScript):
 */

const wdio = require("webdriverio");
const opts = {
  path: "/wd/hub",
  port: 4723,
  capabilities: {
    platformName: "Android",
    platformVersion: "13",
    deviceName: "emulator-5554",
    app: "/path/to/app.apk",
    automationName: "UiAutomator2",
  },
};

async function main() {
  const client = await wdio.remote(opts);
  const loginButton = await client.$("~loginButton");
  await loginButton.click();
  const username = await client.$("~username");
  await username.setValue("john");
  await client.deleteSession();
}
main();

/********************************************
 * ⚖️ Detox vs Appium – Comparison
 ********************************************/
/**
 * | Feature               | Detox                           | Appium                          |
 * |-----------------------|---------------------------------|---------------------------------|
 * | Scope                 | React Native apps only          | Native, Hybrid, Web, RN apps    |
 * | Testing style         | Gray-box (knows app state)      | Black-box (outside in)          |
 * | Speed                 | Fast (auto-waits)               | Slower (WebDriver overhead)     |
 * | Setup complexity      | Easy (Jest integration)          | More complex (Appium server etc)|
 * | Best for              | RN apps & CI pipelines          | Cross-platform enterprise apps  |
 * | Language support      | JS (mostly)                     | Many (JS, Java, Python, etc.)   |
 * | CI/CD compatibility   | High                            | High                            |
 */

/********************************************
 * 📝 Best Practices
 ********************************************/
/**
 * - Use Detox if you want **faster tests just for React Native**.
 * - Use Appium if you want **cross-platform coverage** (iOS, Android, Web).
 * - Always clean test state → clear AsyncStorage/DB before tests.
 * - Run tests on CI (GitHub Actions, CircleCI, Jenkins).
 * - Use `by.id()` selectors (testID prop in RN) → reliable locators.
 */
