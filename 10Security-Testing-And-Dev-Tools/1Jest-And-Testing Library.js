/*********************************************************
 * 📘 Jest & Testing Library – Unit & Integration Testing
 *********************************************************/

/********************************************
 * 🟢 Why Testing in React Native?
 ********************************************/
/**
 * - Testing ensures code works correctly and avoids regressions.
 * - Types of testing:
 *   1) Unit Testing → tests small pieces (functions, components).
 *   2) Integration Testing → tests how components work together.
 *   3) E2E (end-to-end) → tests the app as a whole (e.g. Detox).
 *
 * Tools:
 *   - Jest → Test runner & assertion library.
 *   - React Native Testing Library (RNTL) → Helps test React components behavior.
 */

/********************************************
 * 🟢 Jest Basics
 ********************************************/
/**
 * - Jest is the default test runner in React Native projects.
 * - Features:
 *   ✅ Snapshot testing.
 *   ✅ Mocking functions, timers, modules.
 *   ✅ Parallel test execution.
 *
 * Example – Unit Test with Jest
 */
function add(a, b) {
  return a + b;
}
test("adds numbers", () => {
  expect(add(2, 3)).toBe(5);
});

/**
 * Example – Mocking a function
 */
const fetchUser = jest.fn(() => Promise.resolve({ name: "Avi" }));
test("fetchUser returns data", async () => {
  const data = await fetchUser();
  expect(data.name).toBe("Avi");
});

/********************************************
 * 🟢 Snapshot Testing with Jest
 ********************************************/
/**
 * - Takes a "snapshot" (saved JSON) of component output.
 * - Ensures UI does not change unexpectedly.
 *
 * Example:
 */
import React from "react";
import renderer from "react-test-renderer";
import { Text } from "react-native";

test("renders text correctly", () => {
  const tree = renderer.create(<Text>Hello</Text>).toJSON();
  expect(tree).toMatchSnapshot();
});

/********************************************
 * 🟢 React Native Testing Library (RNTL)
 ********************************************/
/**
 * - Focuses on testing **user behavior**, not implementation details.
 * - Based on React Testing Library.
 * - Provides utilities like:
 *   - render() → render a component for testing.
 *   - getByText(), getByTestId() → find elements.
 *   - fireEvent() → simulate user interaction.
 *
 * Example – Testing a Button Click
 */
import { render, fireEvent } from "@testing-library/react-native";
import { Button, Text } from "react-native";
import React, { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <>
      <Text testID="count">{count}</Text>
      <Button title="Increment" onPress={() => setCount(count + 1)} />
    </>
  );
}

test("increments counter on button press", () => {
  const { getByText, getByTestId } = render(<Counter />);
  fireEvent.press(getByText("Increment"));
  expect(getByTestId("count").props.children).toBe(1);
});

/********************************************
 * 🟢 Integration Testing
 ********************************************/
/**
 * - Test how multiple components work together.
 * - Example: Form input + submit button → API call.
 */
function LoginForm({ onSubmit }) {
  const [email, setEmail] = useState("");
  return (
    <>
      <TextInput testID="email-input" value={email} onChangeText={setEmail} />
      <Button title="Submit" onPress={() => onSubmit(email)} />
    </>
  );
}

test("submits email correctly", () => {
  const mockSubmit = jest.fn();
  const { getByTestId, getByText } = render(
    <LoginForm onSubmit={mockSubmit} />
  );
  fireEvent.changeText(getByTestId("email-input"), "test@mail.com");
  fireEvent.press(getByText("Submit"));
  expect(mockSubmit).toHaveBeenCalledWith("test@mail.com");
});

/********************************************
 * 🟢 Mocking Native Modules
 ********************************************/
/**
 * - Many RN modules (e.g., AsyncStorage, Camera) need mocks in tests.
 * - Jest allows manual or auto mocks.
 *
 * Example – Mock AsyncStorage
 */
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(() => Promise.resolve("mockValue")),
}));

test("reads from mocked AsyncStorage", async () => {
  const AsyncStorage = require("@react-native-async-storage/async-storage");
  const value = await AsyncStorage.getItem("key");
  expect(value).toBe("mockValue");
});

/********************************************
 * 🟢 Benefits of Jest + RNTL
 ********************************************/
/**
 * ✅ Tests logic (unit) + user behavior (integration).
 * ✅ Fast feedback loop.
 * ✅ Catch regressions with snapshot testing.
 * ✅ Encourages writing accessible, testable components.
 */

/********************************************
 * 🟢 Interview Q&A
 ********************************************/
/**
 * Q1: Difference between Jest & RNTL?
 *  → Jest = test runner (unit tests, snapshots, mocks).
 *    RNTL = helps test UI behavior (integration).
 *
 * Q2: What is Snapshot testing?
 *  → Saving rendered output and comparing with future runs.
 *
 * Q3: Why avoid testing implementation details?
 *  → Tests should simulate real user interaction → makes tests more stable.
 *
 * Q4: How to test async code in Jest?
 *  → Use async/await OR `waitFor` from RNTL.
 *
 * Q5: When to use mocks?
 *  → When external/native dependencies (network, storage) should not run in tests.
 */
