/**
 * ==============================================================
 * 📘 React Notes – PropTypes, defaultProps, and children
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 Why these features matter?
 * - In React, components are reusable and configurable via "props".
 * - To make components safe, predictable, and flexible, we use:
 *    ✅ PropTypes → type-check props at runtime
 *    ✅ defaultProps → set default values for props
 *    ✅ children → pass nested components or content
 *
 * ==============================================================
 * 🔹 1. PropTypes
 * - A library for type-checking props (helps catch bugs early).
 * - Ensures the component receives props of the expected type.
 * - Not required in production but very useful during development.
 *
 * Example:
 */
import PropTypes from "prop-types";

function Greeting({ name, age }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old.</p>
    </div>
  );
}

// ✅ Define PropTypes
Greeting.propTypes = {
  name: PropTypes.string.isRequired, // must be string, required
  age: PropTypes.number, // optional number
};

/**
 * - If wrong type is passed, React logs a warning in console.
 * - Helps avoid runtime crashes due to wrong data.
 *
 * --------------------------------------------------------------
 * 🔹 2. defaultProps
 * - Lets you define default values for props if they are not passed.
 * - Prevents `undefined` errors and ensures component works smoothly.
 *
 * Example:
 */
Greeting.defaultProps = {
  age: 18, // default age if not provided
};

/**
 * Usage:
 * <Greeting name="Avi" /> → shows "Avi, 18 years old"
 * <Greeting name="Avi" age={25} /> → shows "Avi, 25 years old"
 *
 * --------------------------------------------------------------
 * 🔹 3. children
 * - Special prop in React that represents content between component tags.
 * - Allows nesting components or JSX inside another component.
 * - Makes components flexible and reusable (e.g., wrappers, layouts).
 *
 * Example:
 */
function Card({ children }) {
  return (
    <div style={{ border: "1px solid black", padding: "10px" }}>{children}</div>
  );
}

// Usage:
<Card>
  <h2>Title</h2>
  <p>This is inside the Card!</p>
</Card>;

/**
 * Output:
 * A box with:
 *   Title
 *   This is inside the Card!
 *
 * --------------------------------------------------------------
 * 🔹 Combine PropTypes + defaultProps + children
 */
function Button({ label, onPress, children }) {
  return (
    <button onClick={onPress}>
      {label} {children}
    </button>
  );
}

// Type checking
Button.propTypes = {
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  children: PropTypes.node, // any renderable content
};

// Default values
Button.defaultProps = {
  onPress: () => console.log("Default Button Pressed"),
};

/**
 * Usage:
 * <Button label="Click Me" />  → Shows: "Click Me"
 * <Button label="Send">🚀</Button> → Shows: "Send 🚀"
 *
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: What is PropTypes used for?
 *    → Runtime type-checking for props. Helps catch bugs early
 *      if wrong type of data is passed.
 *
 * Q2: Difference between PropTypes and TypeScript?
 *    → PropTypes → runtime validation (during app execution).
 *      TypeScript → compile-time type safety (before running code).
 *
 * Q3: What is defaultProps and why is it useful?
 *    → Default values for props to avoid undefined.
 *      Makes component safer and reduces boilerplate.
 *
 * Q4: Can functional components use defaultProps?
 *    → Yes, but since React 17+, better to use ES6 default values in function args:
 *       function Greeting({ age = 18 }) { ... }
 *
 * Q5: What is children in React?
 *    → A special prop that allows passing nested content into a component.
 *      Useful for wrappers, layouts, and reusable UI containers.
 *
 * Q6: Example where all three are used together?
 *    → A `Modal` component that:
 *       - Requires `isOpen` (PropTypes.bool.isRequired)
 *       - Defaults `title = "Default Title"` (defaultProps)
 *       - Wraps custom content passed via children
 *
 * ==============================================================
 */
