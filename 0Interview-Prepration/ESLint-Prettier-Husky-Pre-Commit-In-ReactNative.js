/**
 * react-native-code-quality-ecosystem-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES (Beginner Friendly)
 *
 * "ESLint (Airbnb + TypeScript), Prettier, and Husky pre-commit hooks —
 *  How they work together to maintain consistent coding standards across teams"
 *
 * - Very simple language
 * - Why we use them, how they work, how to set up, what problems they solve,
 *   team workflows, example configs, checklist, and interview Q&A
 * - Copy-paste into your notes repo.
 */

/* ===========================================================================
📌 0. SHORT GOAL (one-line)
===============================================================================
Keep every developer writing clean, consistent, error-free code — automatically.
*/

/* ===========================================================================
📌 1. WHAT PROBLEM DO THESE TOOLS SOLVE? (simple explanation)
===============================================================================
When many developers work on the same project, problems happen:

❌ Different coding styles  
❌ Missing semicolons  
❌ Spacing inconsistencies  
❌ Code that breaks on runtime because of small mistakes  
❌ PR reviews filled with style comments instead of logic review  

These tools FIX all that by enforcing **one coding standard for everyone**.
*/

/* ===========================================================================
📌 2. THE 3 MAIN TOOLS (very beginner-friendly)
===============================================================================

1️⃣ **ESLint** → Finds errors & bad coding patterns  
   - Example: unused variables, wrong imports, incorrect async usage  
   - Supports rules for JavaScript + TypeScript  
   - Airbnb rules enforce industry-level best practices

2️⃣ **Prettier** → Auto-formats code  
   - Example: spacing, quotes, semicolons, line breaks  
   - No arguments — one style for everyone

3️⃣ **Husky + lint-staged** → Run checks BEFORE committing  
   - Prevents bad code from entering the repository  
   - Blocks commit if linting or formatting fails  
*/

/* ===========================================================================
📌 3. ESLint (Airbnb + TypeScript) — HOW IT WORKS
===============================================================================
ESLint analyzes your JS/TS code using a big set of rules.

✔ Catches logical mistakes  
✔ Prevents bad practices  
✔ Encourages clean patterns  
✔ Works with TypeScript (tsconfig)  
✔ Airbnb preset = industry-standard best practices

Airbnb rule examples:
- Use const where possible  
- Avoid unused variables  
- Require consistent import order  
- Use === instead of ==  
- Avoid deeply nested code  
*/

/* ===========================================================================
📌 4. PRETTIER — HOW IT WORKS
===============================================================================
Prettier formats code automatically.

✔ Fixes indentation  
✔ Fixes spacing  
✔ Fixes line width  
✔ Fixes semicolons, commas, quotes  
✔ Works 100% the same for every developer  

Important:  
**Prettier does NOT check errors** — it only fixes formatting.  
That’s why we still need ESLint.
*/

/* ===========================================================================
📌 5. HUSKY + LINT-STAGED — HOW THEY WORK
===============================================================================
Husky lets you run scripts when you commit or push.

lint-staged = run ESLint & Prettier ONLY on changed files → fast.

Flow:
1️⃣ Developer runs `git commit`  
2️⃣ Husky runs ESLint + Prettier  
3️⃣ If errors found → commit is blocked ❌  
4️⃣ If all good → commit succeeds ✔️  

This stops bad code BEFORE it enters the project.
*/

/* ===========================================================================
📌 6. HOW ALL THREE WORK TOGETHER (simple workflow)
===============================================================================
🔥 BEST PRACTICE TEAM SETUP:

During development:
- Prettier auto-formats on save (VSCode)
- ESLint warns about incorrect code immediately

On commit:
- Husky + lint-staged run ESLint + Prettier
- If code is not formatted → Prettier fixes automatically
- If errors → commit blocked → dev must fix

On CI:
- Full ESLint run
- Tests run
- SonarQube/Quality Gate also checks deeper issues

This creates an automatic safety net for clean code.
*/

/* ===========================================================================
📌 7. INSTALLATION (React Native + TypeScript)
===============================================================================
yarn add -D eslint eslint-config-airbnb eslint-plugin-import
eslint-plugin-react eslint-plugin-react-hooks
@typescript-eslint/parser @typescript-eslint/eslint-plugin
eslint-config-prettier eslint-plugin-prettier prettier
husky lint-staged

*/

/* ===========================================================================
📌 8. EXAMPLE ESLint CONFIG (Airbnb + TypeScript)
===============================================================================
Create `.eslintrc.js`:
*/
module.exports = {
  root: true,
  env: { browser: true, es6: true, node: true },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  extends: [
    "airbnb",
    "airbnb/hooks",
    "airbnb-typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended", // integrates Prettier
  ],
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    "react/react-in-jsx-scope": "off", // RN does not require React import
    "prettier/prettier": 2, // error on formatting issues
  },
};

/* ===========================================================================
📌 9. EXAMPLE PRETTIER CONFIG
===============================================================================
Create `.prettierrc`:
*/
/*
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "semi": true,
  "tabWidth": 2
}

/* ===========================================================================
📌 10. HUSKY SETUP
===============================================================================
npx husky install


Add to package.json:


"scripts": {
"prepare": "husky install"
}


Add a pre-commit hook:


npx husky add .husky/pre-commit "npx lint-staged"

*/

/* ===========================================================================
📌 11. lint-staged CONFIG
===============================================================================
Add to package.json:
*/
/*
{
  "lint-staged": {
    "src/***.{ts,tsx,js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}

/* ===========================================================================
📌 12. HOW THIS IMPROVES TEAM CONSISTENCY
===============================================================================
✔ Everyone uses the same style  
✔ Code looks identical no matter who writes it  
✔ Errors caught before merge  
✔ PR reviews become clean — focus on logic, not formatting  
✔ Junior developers learn clean coding habits automatically  
✔ Prevents messy codebase growth over time  
*/

/* ===========================================================================
📌 13. CI/CD INTEGRATION (simple view)
===============================================================================
On CI pipeline:
1) Run ESLint  
2) Run TypeScript type-check  
3) Run Jest tests  
4) Run SonarQube scan  
5) Block PR if any step fails

This ensures high-quality code across entire team.
*/

/* ===========================================================================
📌 14. CHECKLIST — GOOD TEAM PRACTICES
===============================================================================
✔ Use Airbnb + TypeScript rules  
✔ Enable Prettier on save in VSCode  
✔ Use Husky pre-commit hook to block bad code  
✔ Keep ESLint rules strict (don’t disable many rules)  
✔ Add CI pipeline for full lint check  
✔ Combine with SonarQube for deeper security & maintainability checks  
✔ Teach team to fix lint warnings immediately  
*/

/* ===========================================================================
📌 15. INTERVIEW Q&A (beginner-friendly)
===============================================================================
Q1: What is ESLint?
A: A tool that checks your code for errors, bad patterns, and coding standard rules.

Q2: Why use Airbnb rules?
A: Airbnb provides one of the most trusted, strict, and industry-standard JS/TS rule sets.

Q3: What does Prettier do?
A: It automatically formats your code so everyone has the same style.

Q4: Why do we use Husky?
A: To block commits if code has linting errors or formatting issues.

Q5: How do these tools help teams?
A: They enforce the same coding standards, reduce bugs, and make code reviews cleaner.

Q6: Do ESLint and Prettier conflict?
A: No — we use `eslint-config-prettier` + `plugin:prettier/recommended` to avoid conflicts.
*/

/* ===========================================================================
📌 16. FINAL CHEAT-SHEET (ONE PAGE)
===============================================================================
1) ESLint (Airbnb + TypeScript) → catches errors + enforces clean coding  
2) Prettier → formats code automatically  
3) Husky + lint-staged → blocks bad commits  
4) Together they create a strong coding standard system  
5) Saves time in PR reviews  
6) Ensures every developer writes consistent, clean, reliable code  
7) Works perfectly with CI + SonarQube + tests  
*/

/* ===========================================================================
📌 17. WANT NEXT?
===============================================================================
I can make:
  ✅ Full CI pipeline example: ESLint + Prettier + Husky + Jest + SonarQube  
  ✅ VSCode setup guide for auto-formatting + auto-fixing  
  ✅ Airbnb + TypeScript advanced rules explanation (with examples)
Just tell me which one you want in the same single-file notes format.
*/
