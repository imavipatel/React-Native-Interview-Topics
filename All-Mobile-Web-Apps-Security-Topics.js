/*

📌 1. Easy Level — Fundamentals

### Network Security Basics
* HTTPS everywhere; no plain HTTP
* TLS versions: prefer TLS 1.2/1.3; disable weak ciphers
* SSL/TLS handshake — high-level flow only
* SSL Pinning: certificate vs public key pinning; fallback pins
* HSTS (HTTP Strict Transport Security)

### Authentication Basics
* Strong passwords — length > complexity; hash with bcrypt/argon2, salted
* MFA/2FA — SMS OTP, Email OTP, TOTP; risks of SMS
* Device binding (account linked to device identifiers)

### Data Security Basics
* Encryption at rest (AES-256) — DB, files, backups
* Encryption in transit (TLS 1.2/1.3)
* Mobile secure storage — iOS Keychain; Android Keystore/EncryptedSharedPrefs
* Handle sensitive data carefully — clear memory; avoid logs/clipboard

### Mobile App Fundamentals
* Root/Jailbreak detection (basic checks)
* Prevent screenshots — Android FLAG_SECURE; iOS secure display
* Secure logging — never log secrets/tokens
* Fail closed on certificate validation errors

--------------------------------------------------

📌 2. Medium Level — Applied Security

### Mobile App Hardening
* Code obfuscation — ProGuard/R8, DexGuard; iOS symbol stripping
* Detect reverse-engineering tools — Frida/Xposed/Emulators
* Integrity checks — checksum, signature verification, tamper detection
* In-app browser hardening — restrict navigation, disable unsafe JS bridges
* Clipboard & screenshot hygiene for sensitive views

### Web & API Security (OWASP)
* OWASP Top 10 — XSS, CSRF, SQLi, SSRF, RCE (know mitigations)
* Secure cookies — HttpOnly, Secure, SameSite
* CSP — default-src 'none'; allowlist origins; frame-ancestors for clickjacking
* API Security (OWASP API Top 10) — broken auth, BOLA/IDOR, rate limiting
* Replay protection — nonce + timestamp; HMAC/JWS message signing

### Session & Identity Management
* Session timeout & rotation after privilege elevation
* JWTs — short TTL; refresh token rotation; storage risks (XSS)
* OAuth2 + OIDC — Auth Code + PKCE for mobile/web
* Biometric authentication — FaceID, TouchID, BiometricPrompt
* Passwordless authentication — WebAuthn/FIDO2

### Fraud & Risk Mitigation
* Transaction monitoring — velocity rules, anomaly detection
* Device fingerprinting — model, OS, unique signals
* Geo-location checks & geo-fencing; impossible travel detection
* Bot prevention — rate limiting, CAPTCHA (adaptive)
* Anti-phishing UX — verified domains, warning for suspicious links

--------------------------------------------------

📌 3. Hard Level — Advanced & Architecture

### Advanced Mobile Security
* RASP — runtime hook detection, jailbreak/root detection
* Anti-debugging & anti-hooking — ptrace, anti-frida, debugger flags
* Overlay protection — prevent tapjacking; secure views
* Secure IPC — sanitize deep links, custom URL schemes, intents
* Device attestation — Play Integrity / DeviceCheck / App Attest

### Advanced Data & Key Management
* Tokenization vs Encryption vs Hashing — when to use each
* Key rotation policies; envelope encryption; key hierarchy
* HSM/KMS — secure key storage & usage policies
* Secrets management — Vault, AWS Secrets Manager
* End-to-End Encryption — session keys, forward secrecy

### Infrastructure & Deployment Security
* DevSecOps pipelines — SAST, DAST, SCA, IaC scanning
* Container/Kubernetes security — RBAC, Pod security, network policies
* Cloud hardening (AWS/GCP/Azure) — IAM least privilege, VPC isolation
* Zero Trust Architecture — identity-aware access, continuous verification
* DDoS protection — WAF, CDN, throttling, autoscale

### Compliance & Standards (Banking)
* OWASP MASVS (Mobile Application Security Verification Standard)
* OWASP ASVS (Web Application Security Verification Standard)
* PCI DSS — payment card security requirements
* ISO 27001 / SOC 2 — organizational security standards
* GDPR, CCPA — privacy laws; PSD2, RBI, FFIEC — banking-specific

### Threat Detection & Incident Response
* SIEM integration (Splunk, ELK, Sentinel) for alerts
* Audit trails — who, when, what; ensure non-repudiation
* Tamper-proof logs — signing, WORM storage
* Incident Response lifecycle — detect, contain, eradicate, recover, learn
* Threat modeling — MITRE ATT&CK, kill-chain, purple-team exercises

--------------------------------------------------

📌 4. Quick Security Checklist (Mobile & Web Banking)

### 🔒 Security
* Always use HTTPS/TLS; enforce HSTS
* Implement SSL Pinning (with backup keys)
* Enforce MFA/2FA for authentication
* Use secure storage — Keychain/Keystore
* Prevent screenshots and clipboard leaks
* Protect APIs with OAuth2 + scopes
* Secure cookies — HttpOnly, Secure, SameSite
* Sanitize/validate all inputs; prevent XSS & SQLi
* Apply CSP headers & anti-clickjacking measures
* Use biometric auth for convenience & security
* Rotate keys regularly; manage secrets in Vault/KMS
* Comply with PCI DSS, GDPR, PSD2

### 🚀 Performance & Stability (Banking Apps)
* Rate limit APIs; protect from brute-force
* Cache non-sensitive data safely
* Optimize TLS handshakes (session resumption)
* Implement CDN/WAF for scaling & DDoS protection
* Monitor app for anomalies & fraud patterns

### 🛠 DevOps & Deployment
* Automate scans in CI/CD (SAST, DAST, dependency checks)
* Use container security best practices (RBAC, image scanning)
* Implement zero-trust networking
* Ensure tamper-proof logging & monitoring
* Plan & test incident response playbooks

*/
