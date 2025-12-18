/*********************************************************
 * 📘 CSS position: relative | absolute | fixed | sticky
 * Beginner-Friendly + Interview Ready Notes
 *********************************************************/

/********************************************
 * 🟢 Default Position
 ********************************************/
/**
 * position: static (default)
 *
 * - Normal document flow
 * - top / left / right / bottom do NOT work
 */

/********************************************
 * 🟢 position: relative
 ********************************************/
/**
 * 👉 Element stays in NORMAL flow
 * 👉 Can move relative to ITS ORIGINAL position
 * 👉 Space is STILL reserved
 */

// .box {
//   position: relative;
//   top: 10px;
//   left: 20px;
// }

/**
 * What happens:
 * - Element moves visually
 * - Other elements are NOT affected
 */

/********************************************
 * 🟢 Key Points (relative)
 ********************************************/
/**
 * ✅ Moves relative to itself
 * ✅ Keeps original space
 * ✅ Often used as reference for absolute children
 */

/********************************************
 * 🟢 position: absolute
 ********************************************/
/**
 * 👉 Element is REMOVED from normal flow
 * 👉 Positioned relative to:
 *    - nearest positioned ancestor (relative/absolute/fixed)
 *    - OR viewport (if no positioned ancestor)
 * 👉 No space is reserved
 */

// .parent {
//   position: relative;
// }

// .child {
//   position: absolute;
//   top: 0;
//   right: 0;
// }

/********************************************
 * 🟢 Key Points (absolute)
 ********************************************/
/**
 * ❌ Does NOT keep space
 * ✅ Moves freely
 * ✅ Relative to nearest positioned parent
 */

/********************************************
 * 🟢 Common Interview Trick
 ********************************************/
/**
 * Q: Absolute is relative to whom?
 * A: Nearest ancestor with position != static
 */

/********************************************
 * 🟢 position: fixed
 ********************************************/
/**
 * 👉 Element is REMOVED from normal flow
 * 👉 Positioned relative to VIEWPORT
 * 👉 Does NOT move on scroll
 */

// .header {
//   position: fixed;
//   top: 0;
//   width: 100%;
// }

/********************************************
 * 🟢 Key Points (fixed)
 ********************************************/
/**
 * ❌ No space reserved
 * ✅ Always stays at same place
 * ✅ Used for headers, chat buttons
 */

/********************************************
 * 🟢 position: sticky
 ********************************************/
/**
 * 👉 Hybrid of relative + fixed
 * 👉 Acts like relative initially
 * 👉 Becomes fixed when scroll threshold is crossed
 */

// .nav {
//   position: sticky;
//   top: 0;
// }

/********************************************
 * 🟢 How sticky Works Internally
 ********************************************/
/**
 * - Scrolls normally
 * - When top reaches 0 → sticks
 * - Stops sticking when parent ends
 */

/********************************************
 * 🟢 Key Points (sticky)
 ********************************************/
/**
 * ✅ Keeps space
 * ✅ Depends on scroll
 * ❗ Parent must have height
 * ❗ overflow: hidden can break sticky
 */

/********************************************
 * 🟢 Side-by-Side Comparison
 ********************************************/

const positionComparison = `
Position    | In Flow | Relative To       | Scrolls?
------------------------------------------------------
relative    | Yes     | Itself            | Yes
absolute    | No      | Positioned Parent | Yes
fixed       | No      | Viewport          | No
sticky      | Yes     | Viewport (on scroll) | Partially
`;

/********************************************
 * 🟢 Visual Mental Model (Interview)
 ********************************************/
/**
 * relative → "Move me from where I was"
 * absolute → "Place me anywhere"
 * fixed    → "Pin me to screen"
 * sticky   → "Stick when needed"
 */

/********************************************
 * 🟢 Common Real-World Uses
 ********************************************/
/**
 * relative → Wrapper / anchor
 * absolute → Tooltip, badge, modal
 * fixed    → Navbar, floating button
 * sticky   → Table headers, section titles
 */

/********************************************
 * 🟢 Most Asked Interview Questions
 ********************************************/
/**
 * Q: Does relative remove element from flow?
 * A: ❌ No
 *
 * Q: Does absolute keep space?
 * A: ❌ No
 *
 * Q: Sticky vs Fixed?
 * A: Sticky scrolls first, fixed doesn’t
 */

/********************************************
 * 🟢 One-Line Interview Answers
 ********************************************/
/**
 * relative → positioned relative to itself
 * absolute → positioned relative to parent
 * fixed    → positioned relative to viewport
 * sticky   → relative until scroll, then fixed
 */

/********************************************
 * 🟢 Final Summary
 ********************************************/
/**
 * Use relative → positioning context
 * Use absolute → precise placement
 * Use fixed → always visible
 * Use sticky → smart scrolling behavior
 */
