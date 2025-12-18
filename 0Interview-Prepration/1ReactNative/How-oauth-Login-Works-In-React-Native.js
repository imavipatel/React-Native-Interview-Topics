/**
 * react-native-oauth-social-login-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES (Beginner Friendly)
 *
 * "How OAuth social login works behind the scenes (Google, Apple, Facebook),
 *  how tokens are exchanged, what happens on server,
 *  and how we handle Google API keys safely in frontend"
 *
 * - Very simple language
 * - Clear diagrams (in words), code examples, security model
 * - What to store in frontend & what NOT to store
 * - Everything in one single-file JS notes format
 */

/* ===========================================================================
📌 0. SHORT GOAL (one-line)
===============================================================================
Let users log in using Google/Apple/Facebook safely by using OAuth, without exposing
your backend secrets, and by exchanging tokens securely with your server.
*/

/* ===========================================================================
📌 1. WHAT IS OAUTH (simple explanation)
===============================================================================
OAuth = a secure way to let users access your app using accounts from Google/Apple/Facebook
without sharing passwords.

User → Provider (Google) → Your App → Your Backend

OAuth gives:
  ✔ user identity (ID token)  
  ✔ limited permissions (scopes)  
  ✔ secure login without password storage
*/

/* ===========================================================================
📌 2. WHAT ARE THE MAIN TOKENS IN OAUTH?
===============================================================================
1) **ID Token**  
   - A JWT issued by Google/Apple containing the user's identity.  
   - Used to authenticate the user to your backend.

2) **Access Token**  
   - Lets you call Google's APIs on behalf of the user.  
   - Short-lived.

3) **Refresh Token** (optional)  
   - Only returned if your scopes & settings allow it.  
   - Allows long-term access to Google APIs.

⚠️ Your app does NOT need Google refresh tokens for basic login.
*/

/* ===========================================================================
📌 3. HOW SOCIAL LOGIN WORKS BEHIND THE SCENES (Step-by-step)
===============================================================================
Let’s use Google OAuth as example.

STEP 1 — App opens Google Login (native SDK / WebView secure flow)  
STEP 2 — User signs in to Google  
STEP 3 — Google returns → `idToken` + `accessToken` to your MOBILE APP  
STEP 4 — Your mobile app sends **only the `idToken`** to your backend  
STEP 5 — Backend verifies the ID Token with Google  
STEP 6 — Backend checks user in database → creates or updates record  
STEP 7 — Backend creates your app’s **own** accessToken/refreshToken  
STEP 8 — App stores your tokens securely and logs user in

🚫 The mobile app should NOT use Google accessToken to authenticate to YOUR backend.  
✔ Always let backend generate its own session tokens.
*/

/* ===========================================================================
📌 4. VERY IMPORTANT RULE
===============================================================================
❌ Do NOT store Google API secret keys in frontend.

✔ The frontend should only hold:
   - Google Client ID (public)
   - Redirect URI
   - Scopes

These values are NOT secrets.  
Google Client ID is meant to be public.

🔥 What is secret?  
- Google Client SECRET (for web backend only) → NEVER put in mobile app  
- Your backend private keys → NEVER in mobile app  
*/

/* ===========================================================================
📌 5. WHY CLIENT ID CAN BE PUBLIC?
===============================================================================
Google OAuth client_id is **not** a secret.  
It only tells Google which app is requesting the login.

Even Google’s official docs say mobile client IDs are public.

Only the *client secret* is confidential — this is never used in mobile OAuth.
*/

/* ===========================================================================
📌 6. WHAT DOES THE MOBILE SDK DO? (React Native Google Login)
===============================================================================
When using:
 - `@react-native-google-signin/google-signin`
 - or Firebase `auth().signInWithCredential()`

The SDK does:
 1) Opens Google's secure login UI  
 2) Verifies user identity  
 3) Returns an **idToken** (JWT)  
 4) Your backend verifies that token → logs user in

Your app never touches Google client secret, so it's safe.
*/

/* ===========================================================================
📌 7. SERVER-SIDE VERIFICATION (behind the scenes)
===============================================================================
Backend receives:

    { idToken: "eyJhbGciOiJSUzI1NiIs..." }

Server should:

1) Decode token header  
2) Get Google's public keys (JWKS endpoint)  
3) Verify signature  
4) Check:
   - aud (audience = your client ID)  
   - iss (issuer = google)  
   - exp (token not expired)  
   - email_verified  

5) If valid → user authenticated!

Simplified code:
*/
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const client = jwksClient({
  jwksUri: "https://www.googleapis.com/oauth2/v3/certs",
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (_, key) => {
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

export function verifyGoogleIdToken(idToken) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      idToken,
      getKey,
      {
        audience: "YOUR_GOOGLE_CLIENT_ID",
        issuer: "https://accounts.google.com",
      },
      (err, decoded) => (err ? reject(err) : resolve(decoded))
    );
  });
}

/* ===========================================================================
📌 8. IMPLEMENTATION IN REACT NATIVE (full flow)
===============================================================================
Example: Using @react-native-google-signin/google-signin
*/
import { GoogleSignin } from "@react-native-google-signin/google-signin";

// 1) Configure
GoogleSignin.configure({
  webClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com", // public
});

// 2) Begin login
export async function loginWithGoogle() {
  await GoogleSignin.hasPlayServices();
  const { idToken } = await GoogleSignin.signIn();

  // 3) Send ONLY idToken to your backend
  const resp = await fetch("https://api.example.com/auth/google", {
    method: "POST",
    body: JSON.stringify({ idToken }),
    headers: { "Content-Type": "application/json" },
  });

  // 4) Backend returns accessToken & refreshToken for your app
  const data = await resp.json();
  return data; // { accessToken, refreshToken }
}

/* ===========================================================================
📌 9. WHAT ABOUT GOOGLE API KEY FOR FIREBASE?
===============================================================================
Firebase API Key in mobile apps is **NOT secret**.

Google says:

✔ Firebase API keys are NOT confidential  
✔ They identify your Firebase project  
✔ They do NOT give access to your backend data  
✔ Firebase security rules protect access  

Do NOT treat Firebase API key as a secret.

You still secure:
  - Firestore rules  
  - RTDB rules  
  - Storage rules  
  - Authentication rules  
*/

/* ===========================================================================
📌 10. HOW TO SECURE GOOGLE LOGIN END-TO-END
===============================================================================
✔ Validate idToken on your backend  
✔ Use HTTPS and certificate pinning  
✔ Bind refresh tokens to device (per-device session)  
✔ Implement token rotation + reuse detection  
✔ Do NOT allow Google accessToken to authenticate to your backend  
✔ Log-out must revoke your refresh token  
✔ Never store client secret in frontend
*/

/* ===========================================================================
📌 11. COMMON MISTAKES
===============================================================================
✘ Storing Google client secret in JS bundle → extremely insecure  
✘ Using Google accessToken directly to authenticate with backend  
✘ Not validating ID token signature on server  
✘ Trusting idToken without checking audience/issuer  
✘ Storing refresh token in AsyncStorage instead of Keychain  
✘ Assuming Firebase API key is secret (it’s not)
*/

/* ===========================================================================
📌 12. WHAT ABOUT APPLE LOGIN?
===============================================================================
Apple flow:
  - Returns `id_token` (JWT) + user info  
  - App sends id_token to backend  
  - Backend verifies signature using Apple’s JWKS  
  - Backend logs user in

Same model: ID Token → Backend Verifies → Issue own tokens.

Apple also provides a "user" field only once on first login. Save it.
*/

/* ===========================================================================
📌 13. FACEBOOK OAUTH (similar flow)
===============================================================================
- Facebook returns accessToken  
- App should exchange accessToken on backend for user profile  
- Backend validates via FB debug token endpoint  
- Backend issues its own tokens  
- Never trust FB token alone to log user in
*/

/* ===========================================================================
📌 14. STORAGE ON FRONTEND (React Native)
===============================================================================
Store these:
✔ Google ID token → only temporary until backend verifies  
✔ Your accessToken → store in memory  
✔ Your refreshToken → store in Keychain / Keystore  

DO NOT STORE:
✘ Google client secret  
✘ Long-lived API keys  
✘ Sensitive tokens in AsyncStorage
*/

/* ===========================================================================
📌 15. SECURITY ADD-ONS FOR SOCIAL LOGIN
===============================================================================
- Play Integrity / App Attest → check device is genuine  
- IP + Geo checks → detect unusual access  
- Rate limiting → avoid abuse  
- Refresh token rotation → detect stolen tokens  
- TLS pinning → prevent MITM during token exchange  
*/

/* ===========================================================================
📌 16. CHECKLIST — QUICK (for implementation)
===============================================================================
✔ Use GoogleSignin to get idToken  
✔ Send idToken to your backend for verification  
✔ Backend verifies JWT signature + audience + issuer  
✔ Backend creates & returns your tokens (access + refresh)  
✔ Store refresh token in Keychain / Keystore  
✔ Rotate refresh tokens  
✔ Never include Google client secret in mobile app  
✔ Firebase API key is not secret (safe to expose)
*/

/* ===========================================================================
📌 17. INTERVIEW Q&A (BEGINNER-FRIENDLY)
===============================================================================
Q1: Does the mobile app need Google client secret?  
A: No. Only the backend uses client secret (if needed). The mobile app uses only client ID.

Q2: Is Google client ID secret?  
A: No — it is public and safe to put in frontend.

Q3: What does backend do with Google idToken?  
A: Verifies signature using Google’s public keys, checks validity, logs user in.

Q4: Why not authenticate user using Google accessToken directly?  
A: Because backend cannot fully trust accessToken alone. ID token proves identity safely.

Q5: How do you store your own app’s refresh token?  
A: In secure storage (Keychain/Keystore) — not in AsyncStorage.

Q6: Can Firebase API key be used to steal data?  
A: No — Firebase security rules protect actual data; API key alone is harmless.

Q7: What if attacker steals ID token?  
A: ID token expires quickly and backend verifies signature; attacker cannot refresh tokens without refreshToken.
*/

/* ===========================================================================
📌 18. FINAL CHEAT-SHEET (ONE-PAGE)
===============================================================================
1) Mobile obtains Google `idToken` (public-safe).  
2) App sends idToken → Backend verifies using Google JWKS.  
3) Backend logs user in and returns secure app tokens.  
4) App stores refresh token in Keychain and uses access token for API calls.  
5) Google client ID is public; client secret must stay on server only.  
6) Firebase API key is public — rely on Firebase rules for data protection.  
7) Add TLS pinning + app attestation for stronger protection.  
*/

/* ===========================================================================
📌 19. WANT NEXT?
===============================================================================
I can produce in the same single-file JS notes format:
  ✅ Full Google OAuth + backend verification + refresh token rotation implementation  
  ✅ Apple login deep dive with server-side validation  
  ✅ Secure social login architecture diagram + codebase folder structure  
Just tell me which you want.
*/
