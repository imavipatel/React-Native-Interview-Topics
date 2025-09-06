/**************************************************************
 * 📘 WebView Security in React Native
 **************************************************************/

/********************************************
 * 🟢 Why WebView Security Matters?
 ********************************************/
/**
 * - WebView lets you render web content inside your mobile app.
 * - But it can expose your app to **serious vulnerabilities** if not secured:
 *   🔹 JavaScript injection (XSS-like attacks)
 *   🔹 Man-in-the-Middle (MITM) data leaks
 *   🔹 Malicious local file access
 *   🔹 Exposed bridges between native ↔ JS
 *
 * ✅ Securing WebView is CRITICAL if you load remote content.
 */

/********************************************
 * 🔥 Common WebView Security Risks
 ********************************************/
/**
 * 1. JavaScript Injection
 *    - Attackers inject malicious JS into WebView pages.
 *    - Example: Stealing cookies, tokens, or sensitive data.
 *
 * 2. Cross-Site Scripting (XSS)
 *    - If your app loads untrusted or user-generated HTML,
 *      attackers can run arbitrary code inside WebView.
 *
 * 3. File Access Exploits
 *    - By default, WebView may allow file:// access.
 *    - Hackers can load local files, bypass CSP, or steal data.
 *
 * 4. Insecure JS Bridge
 *    - `injectedJavaScript` or `window.ReactNativeWebView.postMessage`
 *      can be exploited if not sanitized properly.
 */

/********************************************
 * 🔒 Key Security Configurations
 ********************************************/

/**
 * 1. Disable JavaScript (if not required)
 */
/*
<WebView
  source={{ uri: "https://secure-app.com" }}
  javaScriptEnabled={false}  // ❌ No JS execution if unnecessary
/>

/**
 * 2. Enable JavaScript ONLY if required
 * - Always sanitize & escape untrusted input.
 */
/*
<WebView
  source={{ uri: "https://trusted-domain.com" }}
  javaScriptEnabled={true}
/>

/**
 * 3. Restrict Navigation (Prevent URL Hijacking)
 */
/*
<WebView
  source={{ uri: "https://secure-app.com" }}
  onShouldStartLoadWithRequest={(request) => {
    // Allow only trusted domains
    return request.url.startsWith("https://secure-app.com");
  }}
/>

/**
 * 4. Disable File Access (Important!)
 */
/*
<WebView
  source={{ uri: "https://secure-app.com" }}
  allowFileAccess={false}                // Prevent local file:// access
  allowingReadAccessToURL={false}        // iOS-specific
/>

/**
 * 5. Disable Mixed Content (HTTPS only)
 */
<WebView
  source={{ uri: "https://secure-app.com" }}
  mixedContentMode="never" // Blocks HTTP content inside HTTPS page
/>;

/**
 * 6. Content Security Policy (CSP)
 * - CSP is set on the server-side (inside HTML headers).
 * - Helps block malicious scripts from being injected.
 *
 * Example (inside HTML):
 * <meta http-equiv="Content-Security-Policy"
 *   content="default-src 'self'; script-src 'self'; style-src 'self';" />
 *
 * ✅ Only load scripts/styles from your domain.
 */

/********************************************
 * 🛠️ Example: Secure WebView
 ********************************************/
import { WebView } from "react-native-webview";

export default function SecureWebView() {
  return (
    <WebView
      source={{ uri: "https://secure-app.com" }}
      javaScriptEnabled={true} // Enable only if needed
      domStorageEnabled={false} // Disable local storage if not needed
      allowFileAccess={false} // Prevent local file access
      originWhitelist={["https://secure-app.com"]}
      mixedContentMode="never" // Block HTTP content inside HTTPS
      onShouldStartLoadWithRequest={(req) => {
        return req.url.startsWith("https://secure-app.com");
      }}
    />
  );
}

/********************************************
 * 🚨 Best Practices
 ********************************************/
/**
 * ✅ Always use HTTPS (with SSL pinning if possible).
 * ✅ Disable file:// access with `allowFileAccess={false}`.
 * ✅ Restrict navigation to trusted domains (whitelist).
 * ✅ Use Content Security Policy (CSP) in served HTML.
 * ✅ Avoid loading inline scripts in HTML.
 * ✅ Validate all messages coming from WebView (`postMessage`).
 * ✅ Keep WebView updated (security patches).
 * ✅ Use sandboxed environments for untrusted content.
 */

/********************************************
 * 📊 Summary
 ********************************************/
/**
 * 🔹 JavaScript Injection → Sanitize inputs + disable JS if not needed.
 * 🔹 CSP → Protect against inline/malicious scripts.
 * 🔹 allowFileAccess → Set to FALSE to block local file exploits.
 * 🔹 Navigation control → Whitelist domains to prevent hijacking.
 * 🔹 Always combine WebView security with SSL/TLS + network hardening.
 */
