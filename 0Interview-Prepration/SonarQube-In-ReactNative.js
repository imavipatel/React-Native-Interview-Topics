/**
 * react-native-sonarqube-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES (Beginner Friendly)
 *
 * "SonarQube Implementation — How It Works, Why We Use It, Rules, Setup"
 *
 * - Very simple English for beginners
 * - Covers: what SonarQube is, how it analyses code, rules, CI setup, quality gates,
 *   example config, React Native usage, interview Q&A, checklist.
 * - Copy-paste into your notes repo.
 */

/* ===========================================================================
📌 0. SHORT GOAL (one-line)
===============================================================================
Use SonarQube to catch bugs, security problems, and bad coding patterns automatically.
*/

/* ===========================================================================
📌 1. WHAT IS SONARQUBE? (beginner-friendly)
===============================================================================
SonarQube is a **code quality and security scanning tool**.

It:
  ✔ Analyses your code  
  ✔ Finds bugs, vulnerabilities, code smells, duplicate code  
  ✔ Enforces coding standards  
  ✔ Gives clean reports with where the issues are  
  ✔ Blocks bad code from entering main branch (via Quality Gate)

Think of it like an intelligent reviewer that never gets tired.
*/

/* ===========================================================================
📌 2. WHY WE USE SONARQUBE? (simple reasons)
===============================================================================
- To keep code clean and readable  
- To prevent bugs before they reach production  
- To reduce security risks  
- To enforce team rules (naming, complexity, lint rules, duplication)  
- To maintain long-term health of the project  
- To improve developer productivity by automatic checks  
*/

/* ===========================================================================
📌 3. HOW SONARQUBE WORKS (simple explanation)
===============================================================================
SonarQube follows 4 steps:

1️⃣ **You write code**  
   → JS/TS/Java/Kotlin/Swift… whatever your project uses.

2️⃣ **Scanner runs** (CLI or CI pipeline)  
   → It reads your code, parses AST (Abstract Syntax Tree), checks all rules.

3️⃣ **SonarQube server processes results**  
   → Shows issues, code smells, security warnings, code coverage, duplication.

4️⃣ **Quality Gate decides pass/fail**  
   → If too many issues → pipeline fails → code cannot be merged.

It works like ESLint + Security Scanner + Code Metrics tool all combined.
*/

/* ===========================================================================
📌 4. TYPES OF ISSUES SONARQUBE DETECTS
===============================================================================
🟥 **Bugs** — code that might break the app  
🟧 **Vulnerabilities** — security flaws (e.g., unsafe crypto, weak SSL, secrets in code)  
🟨 **Code Smells** — bad practices (long functions, bad naming, unused vars)  
🟩 **Duplications** — repeated code blocks  
🟦 **Coverage** — how many lines tested by unit tests  
*/

/* ===========================================================================
📌 5. IMPORTANT SONARQUBE CONCEPTS (beginner-friendly)
===============================================================================
✔ **Quality Gate**  
   A set of rules that decides if code is "good enough".  
   Example:  
   - Bugs = 0  
   - Coverage on new code >= 80%  
   - Duplications < 3%  

✔ **Rules**  
   These define what to detect. SonarQube comes with default rules depending on language.

✔ **SonarQube Scanner**  
   Tool that runs locally or in CI to analyse your project.

✔ **Leak Period / New Code**  
   SonarQube focuses on **new code** to keep codebase improving gradually.

✔ **Quality Profiles**  
   Collection of rules for each language (JS, TS, Java…)
*/

/* ===========================================================================
📌 6. SONARQUBE RULES (how they work)
===============================================================================
Rules are grouped into categories:

### 1) **Bug Rules**
- Null pointer risks  
- Incorrect conditions  
- Wrong return types  

### 2) **Security Rules**
- Hardcoded secrets (API keys)  
- Dangerous functions  
- Insecure RNG  
- Weak hashing algorithms  
- Missing SSL validation  

### 3) **Code Smell Rules**
- Too many nested loops  
- Magic numbers  
- Long functions  
- Unused code  
- Bad naming conventions  

### 4) **Style / Formatting**
(Not strict like Prettier, but some style rules exist)

Rules can be:
- Enabled / Disabled  
- Customized (severity: blocker → info)  
- Extended by plugins  
*/

/* ===========================================================================
📌 7. REACT NATIVE + JAVASCRIPT + TYPESCRIPT SUPPORT
===============================================================================
SonarQube supports:
✔ JavaScript  
✔ TypeScript  
✔ JSX & TSX  
✔ Android native code (Java/Kotlin)  
✔ iOS native code (Swift/Objective-C)

For React Native, most issues come from:
- unused variables  
- unsafe async code  
- complex components  
- duplicated logic  
- missing null checks  
- unsafe regex  
- missing test coverage  
*/

/* ===========================================================================
📌 8. PROJECT SETUP (Local + CI)
===============================================================================
There are two parts:

1️⃣ **SonarQube Server**  
- Can be hosted locally or deployed on server  
- UI dashboard with metrics

2️⃣ **Sonar Scanner (client)**  
- Installed on CI (GitHub Actions, Jenkins, Bitrise, GitLab, etc.)  
- Reads config → analyses code → sends report to server

Basic command:
sonar-scanner


SonarScanner reads **sonar-project.properties** file.
*/

/* ===========================================================================
📌 9. EXAMPLE CONFIG — sonar-project.properties (React Native)
===================================================================
sonar.projectKey=my-react-native-app
sonar.projectName=MyRNApp
sonar.sourceEncoding=UTF-8

Source code folders

sonar.sources=src

Exclude generated files

sonar.exclusions=node_modules/, android/, ios/, coverage/

Include tests

sonar.tests=src
sonar.test.inclusions=*/ /* .test.js, /.spec.ts, */ //test.tsx
/*
Coverage

sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.typescript.lcov.reportPaths=coverage/lcov.info
*/

/* ===========================================================================
📌 10. CI/CD INTEGRATION (example GitHub Actions)
===============================================================================
name: SonarQube Scan
uses: sonarsource/sonarqube-scan-action@v1
with:
projectBaseDir: .
env:
SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
SONAR_HOST_URL: https://sonarqube.mycompany.com

*/

/* ===========================================================================
📌 11. QUALITY GATES — WHY IT’S IMPORTANT
===============================================================================
Quality Gate FAIL = ❌ You cannot merge code  
Quality Gate PASS = ✅ Safe to merge

Why this is useful:
- Forces developers to fix issues early  
- Keeps codebase clean over time  
- Prevents security vulnerabilities from going to production  
- Ensures test coverage stays acceptable  
*/

/* ===========================================================================
📌 12. HOW SONAR MEASURES CODE QUALITY
===============================================================================
Important metrics:
- **Coverage** → % of tested lines  
- **Duplicated Lines** → repeated blocks  
- **Cognitive Complexity** → how hard code is to understand  
- **Maintainability** → based on code smells  
- **Security Hotspots** → areas where human review is needed  
- **Reliability** → based on bug rules  
*/

/* ===========================================================================
📌 13. SECURITY FEATURES (useful for enterprise apps)
===============================================================================
SonarQube catches:
✔ Hardcoded passwords  
✔ Secrets in JS/TS files  
✔ Unsafe network calls  
✔ Insecure crypto functions  
✔ Weak SSL/TLS configurations  
✔ External libraries with known vulnerabilities (SCA)  
*/

/* ===========================================================================
📌 14. BENEFITS FOR TEAMS (why companies use it)
===============================================================================
- Improves developer discipline  
- Catches bugs before QA stage  
- Creates consistent coding style  
- Helps juniors write better code  
- Reduces review effort  
- Ensures long-term maintainability  
- Avoids technical debt  
*/

/* ===========================================================================
📌 15. LIMITATIONS (beginner-friendly)
===============================================================================
- SonarQube does NOT fix issues automatically  
- False positives may occur  
- Needs proper setup for coverage reports  
- Does not replace code reviews, only assists them  
*/

/* ===========================================================================
📌 16. CHECKLIST — QUICK (for using SonarQube correctly)
===============================================================================
✔ Configure sonar-project.properties  
✔ Set strict Quality Gate (bugs=0, coverage=80%+)  
✔ Add Sonar scan in CI pipeline  
✔ Ensure unit test coverage is generated  
✔ Customize rules only when necessary  
✔ Monitor daily dashboard  
✔ Fix issues immediately when Quality Gate fails  
*/

/* ===========================================================================
📌 17. INTERVIEW Q&A (BEGINNER FRIENDLY)
===============================================================================
Q1: What is SonarQube?  
A: A tool that analyses code for bugs, security issues, and code smells.

Q2: Why do we use SonarQube?  
A: To keep code clean, reduce bugs, enforce rules, and improve long-term code health.

Q3: What is a Quality Gate?  
A: A decision (pass/fail) based on rules like bugs=0, coverage>=80%. If it fails, CI blocks the merge.

Q4: What kind of issues does SonarQube detect?  
A: Bugs, security vulnerabilities, code smells, duplications, and low test coverage.

Q5: How does SonarQube work internally?  
A: Scanner parses code → generates report → sends to server → SonarQube UI shows issues → Quality Gate decides pass/fail.

Q6: Does SonarQube replace ESLint?  
A: No. ESLint is for style/linting; SonarQube is for deeper code quality + security + coverage analysis.

Q7: How does SonarQube help big teams?  
A: Keeps code consistent, avoids regressions, and enforces a measurable quality standard.
*/

/* ===========================================================================
📌 18. FINAL CHEAT-SHEET (ONE PAGE)
===============================================================================
1) Write code → Sonar Scanner analyses → SonarQube displays results  
2) Detects bugs, security issues, smells, duplication, low coverage  
3) Uses RULES + QUALITY GATES to approve/block code  
4) Works with JS/TS/Java/Kotlin/Swift → perfect for React Native  
5) CI integration ensures every PR is scanned  
6) Keeps codebase clean, safe, and maintainable long-term  
*/

/* ===========================================================================
📌 19. WANT NEXT?
===============================================================================
I can provide in the same notes format:
  ✅ ESLint + SonarQube + Prettier unified workflow notes  
  ✅ Secure coding rules for React Native apps (SonarQube + OWASP)  
  ✅ Sample GitHub Actions pipeline with Sonar + Jest coverage  
Which one you want next?
*/
