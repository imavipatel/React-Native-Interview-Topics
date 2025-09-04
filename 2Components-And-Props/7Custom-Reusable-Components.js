/**
 * ==============================================================
 * 📘 React / React Native Notes – Custom Reusable Components
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 Why Custom Reusable Components?
 * - In real apps, you repeat the same UI elements (buttons, inputs, cards).
 * - Instead of writing them again, create reusable components.
 * - Benefits:
 *    ✅ Consistency → same look & feel everywhere
 *    ✅ Maintainability → update in one place, fixes everywhere
 *    ✅ Productivity → saves time, less code duplication
 *
 * --------------------------------------------------------------
 * 🔹 What makes a component reusable?
 * - Accepts **props** to customize behavior & style.
 * - Supports **children** to render dynamic content.
 * - Follows **composition** (combine small building blocks).
 * - Generic logic (not tied to one screen).
 *
 * ==============================================================
 * 🔹 Example 1: Reusable Button Component (React Web)
 */
import PropTypes from "prop-types";

function CustomButton({ label, onPress, style }) {
  return (
    <button
      onClick={onPress}
      style={{
        padding: "10px 20px",
        backgroundColor: "blue",
        color: "white",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        ...style,
      }}
    >
      {label}
    </button>
  );
}

CustomButton.propTypes = {
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  style: PropTypes.object,
};

CustomButton.defaultProps = {
  onPress: () => console.log("Button pressed"),
  style: {},
};

/**
 * Usage:
 * <CustomButton label="Submit" />
 * <CustomButton label="Cancel" style={{ backgroundColor: "red" }} />
 *
 * ==============================================================
 * 🔹 Example 2: Reusable Card with children (React Web)
 */
function Card({ children, style }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Usage:
<Card>
  <h2>Product Title</h2>
  <p>$19.99</p>
</Card>;

/**
 * ==============================================================
 * 🔹 Example 3: Reusable Button Component (React Native)
 */
import { TouchableOpacity, Text, StyleSheet } from "react-native";

function RNButton({ label, onPress, style }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "blue",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 5,
  },
  label: {
    color: "white",
    fontWeight: "bold",
  },
});

// Usage:
// <RNButton label="Login" onPress={() => console.log("Login pressed")} />

/**
 * ==============================================================
 * 🔹 Example 4: Reusable Input Component (React Native)
 */
import { TextInput } from "react-native";

function RNInput({ value, onChangeText, placeholder }) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      style={{
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
      }}
    />
  );
}

// Usage:
// <RNInput placeholder="Enter your name" onChangeText={setName} />

/**
 * ==============================================================
 * 🔹 Example 5: Combining Reusable Components (React Native)
 */
function LoginForm() {
  return (
    <View style={{ padding: 20 }}>
      <RNInput placeholder="Username" />
      <RNInput placeholder="Password" />
      <RNButton label="Login" onPress={() => alert("Logged In")} />
    </View>
  );
}

/**
 * - Here we composed small reusable components (Button, Input)
 *   into a bigger reusable block (LoginForm).
 *
 * ==============================================================
 * ❓ Q&A for Interviews
 * ==============================================================
 *
 * Q1: Why create reusable components?
 *    → To reduce repetition, ensure UI consistency, and speed up dev.
 *
 * Q2: How do you make a component reusable?
 *    → Accept props, support children, and avoid hardcoding.
 *
 * Q3: Example of children in reusable components?
 *    → A Card or Modal that can wrap any content inside it.
 *
 * Q4: How does composition help in reusability?
 *    → Small reusable units (Button, Input) can be combined
 *      into bigger reusable modules (Forms, Layouts).
 *
 * Q5: What’s the difference between reusable UI components
 *     and higher-order components (HOCs)?
 *    → UI components = visual reuse;
 *      HOCs = logic reuse (wrapping components).
 *
 * Q6: Real-world reusable components?
 *    → Button, Input, Card, Header, Modal, Loader, Dropdown, etc.
 *
 * ==============================================================
 */
