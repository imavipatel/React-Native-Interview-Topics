/*********************************************************
 * 📘 Why Tailwind CSS is Better?
 * Tailwind CSS vs Bootstrap (Beginner + Interview Ready)
 *********************************************************/

/********************************************
 * 🟢 One-Line Answer (Interview)
 ********************************************/
/**
 * Tailwind CSS is better because it gives
 * full control over design without overriding styles,
 * while Bootstrap limits customization.
 */

/*********************************************************
 * 🟢 What is Tailwind CSS?
 *********************************************************/
/**
 * Tailwind CSS = Utility-first CSS framework
 *
 * You build UI using small utility classes:
 * - p-4, m-2, text-center, bg-blue-500
 */

/*********************************************************
 * 🟢 What is Bootstrap?
 *********************************************************/
/**
 * Bootstrap = Component-based CSS framework
 *
 * It gives ready-made components:
 * - btn, card, navbar
 */

/*********************************************************
 * 🟢 Core Philosophy Difference
 *********************************************************/

/**
 * Bootstrap:
 * - Pre-designed components
 * - Opinionated design
 *
 * Tailwind:
 * - No design opinion
 * - You design everything
 */

/*********************************************************
 * 🟢 Tailwind CSS vs Bootstrap (Comparison)
 *********************************************************/

const comparison = `
Feature            | Tailwind CSS            | Bootstrap
---------------------------------------------------------
Approach           | Utility-first           | Component-based
Customization      | Very easy               | Hard (override CSS)
Design freedom     | Full control            | Limited
CSS size           | Smaller (tree-shaking)  | Larger
Responsiveness     | Built-in utilities      | Built-in classes
Learning curve     | Medium                  | Easy
Speed of dev       | Very fast after basics  | Fast initially
`;

/*********************************************************
 * 🟢 Why Tailwind CSS is BETTER (Detailed)
 *********************************************************/

/********************************************
 * 1️⃣ No CSS Override Hell
 ********************************************/
/**
 * Bootstrap:
 * - You fight with .btn, .card styles
 *
 * Tailwind:
 * - No default styles to override
 */

/********************************************
 * 2️⃣ Highly Customizable Design
 ********************************************/
/**
 * Tailwind uses config file (tailwind.config.js)
 * - Colors
 * - Spacing
 * - Fonts
 *
 * One source of truth
 */

/********************************************
 * 3️⃣ Smaller CSS Bundle (Performance)
 ********************************************/
/**
 * Tailwind:
 * - Uses PurgeCSS
 * - Removes unused classes
 *
 * Bootstrap:
 * - Ships full CSS
 */

/********************************************
 * 4️⃣ Faster UI Development
 ********************************************/
/**
 * - No context switching (HTML + CSS)
 * - No naming classes
 *
 * Everything in JSX/HTML
 */

/********************************************
 * 5️⃣ Consistent UI Across App
 ********************************************/
/**
 * Same spacing, colors, font sizes
 * because utilities are standardized
 */

/********************************************
 * 6️⃣ Responsive Design is Simpler
 ********************************************/

<div class="p-4 md:p-8 lg:p-12"></div>;

/**
 * No media queries needed
 */

/*********************************************************
 * 🟢 Bootstrap Advantages (Fair Points)
 *********************************************************/

/**
 * ✅ Ready-made components
 * ✅ Very beginner friendly
 * ✅ Faster for simple dashboards
 */

/*********************************************************
 * 🟢 When Bootstrap is Better
 *********************************************************/

/**
 * - Admin dashboards
 * - Internal tools
 * - Quick prototypes
 */

/*********************************************************
 * 🟢 When Tailwind is Better
 *********************************************************/

/**
 * - Custom UI designs
 * - Scalable apps
 * - Modern React / Next.js projects
 */

/*********************************************************
 * 🟢 Interview Questions & Answers
 *********************************************************/

/**
 * Q: Why Tailwind over Bootstrap?
 * A: Because Tailwind avoids overriding styles,
 * gives full design control, and produces smaller CSS.
 */

/**
 * Q: Is Tailwind inline CSS?
 * A: ❌ No, it's utility classes generated at build time.
 */

/*********************************************************
 * 🟢 Real-World Analogy
 *********************************************************/

/**
 * Bootstrap → Ready-made suit (limited changes)
 * Tailwind  → Tailor-made suit (perfect fit)
 */

/*********************************************************
 * 🟢 Final Verdict
 *********************************************************/

/**
 * Bootstrap → Quick & simple
 * Tailwind  → Scalable & customizable (winner 🏆)
 */
