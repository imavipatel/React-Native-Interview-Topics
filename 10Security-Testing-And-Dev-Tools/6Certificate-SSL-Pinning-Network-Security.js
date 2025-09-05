/******************************************************
 * 📘 Certificate Pinning – Network Security in React Native
 ******************************************************/

/********************************************
 * 🟢 What is Certificate Pinning?
 ********************************************/
/**
 * - Normally, when your app makes HTTPS requests:
 *   → It trusts any certificate signed by a trusted CA (Certificate Authority).
 *
 * - Problem:
 *   🔹 Hackers can perform **MITM (Man-In-The-Middle)** attacks
 *   🔹 They can install fake root certificates on a device
 *   🔹 Your app may trust malicious servers
 *
 * - Solution → **Certificate Pinning**:
 *   ✅ Hard-code (or "pin") the server’s certificate/public key inside the app.
 *   ✅ App rejects connections to servers not matching the pinned cert/key.
 *
 * - Think of it as: "I trust only THIS certificate, not every CA."
 */

/********************************************
 * 🔐 How it works
 ********************************************/
/**
 * - Client (app) stores server’s certificate fingerprint (SHA256 hash).
 * - When making HTTPS request:
 *   1. Server sends its certificate.
 *   2. App compares with pinned certificate/public key.
 *   3. If match → connection allowed ✅
 *      If not → reject ❌ (even if certificate is valid CA-signed).
 *
 * ✅ Protects against:
 *   - Fake certificates
 *   - MITM attacks
 *   - Compromised CAs
 */

/********************************************
 * 📦 Libraries for Certificate Pinning
 ********************************************/
/**
 * 1) react-native-ssl-pinning (with axios/fetch)
 *    - Provides `fetch` with SSL pinning support.
 *    - Works for Android & iOS.
 *
 * Example:
 */
import { fetch } from "react-native-ssl-pinning";

fetch("https://myapi.com/secure-data", {
  method: "GET",
  sslPinning: {
    certs: ["mycert"], // put `mycert.cer` in android/app/src/main/assets & iOS bundle
  },
  headers: {
    Accept: "application/json",
  },
})
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => console.error("SSL Error", err));

/**
 * 2) axios + react-native-ssl-pinning
 * Example:
 */
import axios from "axios";
import { getCertificates } from "react-native-ssl-pinning";

axios({
  url: "https://myapi.com/secure-data",
  method: "GET",
  sslPinning: {
    certs: ["mycert"],
  },
}).then((response) => console.log(response.data));

/********************************************
 * 📂 Setup Certificates
 ********************************************/
/**
 * 1. Export server’s SSL certificate in `.cer` format
 *    → from browser or using `openssl`:
 *       openssl s_client -connect myapi.com:443 -showcerts
 *
 * 2. Place `.cer` file in:
 *    - Android → `android/app/src/main/assets/`
 *    - iOS → Xcode project (Bundle Resources)
 *
 * 3. Reference it in code (`certs: ["mycert"]`)
 */

/********************************************
 * ⚖️ Pros & Cons
 ********************************************/
/**
 * ✅ Advantages:
 * - Strong security (prevents MITM).
 * - App trusts only your backend server.
 *
 * ❌ Disadvantages:
 * - Cert rotation → app update required if cert changes.
 * - More maintenance (must re-pin certs before expiry).
 *
 * ⚡ Pro tip:
 * - Instead of pinning full cert → pin **public key hash**
 *   → stays same even if certificate is renewed.
 */

/********************************************
 * ✅ Best Practices
 ********************************************/
/**
 * - Always use **public key pinning** instead of cert pinning when possible.
 * - Keep multiple pins (old + new) to handle cert rotation gracefully.
 * - Monitor cert expiry and update app in time.
 * - Combine with:
 *   🔹 HTTPS/TLS everywhere
 *   🔹 Secure storage for tokens
 *   🔹 Obfuscation (to prevent reverse engineering of pinned certs)
 */

/********************************************
 * 📊 Certificate Pinning vs Normal SSL (Comparison)
 ********************************************/
/**
 * 🔹 Normal SSL (HTTPS):
 *   - App trusts any certificate signed by trusted CAs.
 *   - Device/system CA store decides what to trust.
 *   - Vulnerable if CA is compromised or user installs malicious root cert.
 *
 * 🔹 Certificate Pinning:
 *   - App trusts only predefined cert/public key.
 *   - Completely bypasses system CA trust chain.
 *   - Strong protection against MITM.
 *   - But requires app updates on cert rotation.
 *
 * ✅ Conclusion:
 *   - SSL = baseline encryption + CA validation
 *   - Pinning = stronger, app-controlled validation layer
 */
