/**
 * react-native-testing-notes.js
 *
 * SINGLE-FILE JAVASCRIPT NOTES (Beginner Friendly)
 *
 * "How to write test code in React Native"
 *
 * Includes:
 *  ✔ What testing means in RN
 *  ✔ Types of tests (Unit, Component, Integration, E2E)
 *  ✔ Tools used (Jest, React Native Testing Library, Detox)
 *  ✔ How to test components, API calls, navigation, Redux/Zustand stores
 *  ✔ Mocking native modules
 *  ✔ Simple examples you can copy-paste
 *  ✔ Best practices + Interview Q&A
 *
 * Everything is explained in super easy language.
 */

/* ===========================================================================
📌 0. WHY TEST YOUR REACT NATIVE CODE?
===============================================================================
Testing helps you:
✔ Catch bugs early  
✔ Check app behavior without running UI manually  
✔ Make code more stable  
✔ Refactor safely (tests will catch breakage)  
✔ Save time during development  

Good developers ALWAYS write at least basic tests.
*/

/* ===========================================================================
📌 1. TYPES OF TESTS YOU WRITE IN REACT NATIVE
===============================================================================
There are 4 levels of testing:

1) UNIT TESTS  
   - Test small functions (logic only)
   - No UI
   - Example: add(2, 3) → 5

2) COMPONENT TESTS (most important)
   - Test UI components
   - Check text, button clicks, conditional rendering

3) INTEGRATION TESTS
   - Test whole screens combining UI + logic
   - Example: Login screen → type email → call API → show home screen

4) E2E TESTS (End-To-End)
   - Test real app on device/emulator
   - Example: open app → click Login → dashboard opens
*/

/* ===========================================================================
📌 2. JEST — THE MAIN TESTING TOOL IN REACT NATIVE
===============================================================================
Jest is the default test runner for React Native.

✔ Runs tests fast  
✔ Supports mocking  
✔ Works well with RN Testing Library  
✔ Good for unit + component tests  

Install (new project already has it):
  npm install --save-dev jest @types/jest babel-jest
 
Run tests:
  npm test
*/

/* ===========================================================================
📌 3. REACT NATIVE TESTING LIBRARY (RNTL)
===============================================================================
RNTL helps test components in a “user-like” way.

You test WHAT USERS SEE, not internal code.

Example:
✔ getByText → find text  
✔ getByTestId → find by testID  
✔ fireEvent.press → simulate button click  

Install:
*
npm install --save-dev @testing-library/react-native

/*
VERY IMPORTANT:
RNTL does NOT test styling — it tests behavior & UI output.
*/

/* ===========================================================================
📌 4. SIMPLE UNIT TEST EXAMPLE (beginner-friendly)
===============================================================================
*/

// sum.js
export const sum = (a, b) => a + b;

// sum.test.js
import { sum } from "./sum";

test("adds numbers", () => {
  expect(sum(2, 3)).toBe(5);
});

/*
This is the simplest Jest test.
*/

/* ===========================================================================
📌 5. COMPONENT TEST — VERY SIMPLE EXAMPLE
===============================================================================
*/

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Button, Text } from "react-native";

function Counter() {
  const [count, setCount] = React.useState(0);
  return (
    <>
      <Text testID="count">{count}</Text>
      <Button title="+" onPress={() => setCount(count + 1)} />
    </>
  );
}

test("increments counter", () => {
  const { getByText, getByTestId } = render(<Counter />);

  fireEvent.press(getByText("+"));

  expect(getByTestId("count").props.children).toBe(1);
});

/*
✔ render() shows component UI in test environment  
✔ fireEvent.press simulates button press  
✔ expect() checks if UI changes  
*/

/* ===========================================================================
📌 6. TESTING API CALLS (MOCKING FETCH / AXIOS)
===============================================================================
We NEVER call real backend in tests.

We MOCK the network request.

Example API function:
*/
export async function getUser() {
  const res = await fetch("https://api.example.com/user");
  return res.json();
}

/// test
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ name: "Avi" }),
  })
);

test("fetch user", async () => {
  const user = await getUser();
  expect(user.name).toBe("Avi");
});

/*
✔ No real network  
✔ Fully controlled response  
*/

/* ===========================================================================
📌 7. TESTING A SCREEN THAT CALLS API
===============================================================================
*/

function UserScreen() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    getUser().then(setUser);
  }, []);

  if (!user) return <Text>Loading...</Text>;

  return <Text>Welcome {user.name}</Text>;
}

test("loads and shows user name", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ name: "Avi" }),
    })
  );

  const { getByText, findByText } = render(<UserScreen />);

  expect(getByText("Loading...")).toBeTruthy();

  // findByText waits for async rendering
  expect(await findByText("Welcome Avi")).toBeTruthy();
});

/*
RNTL provides:

✔ getByText → instant  
✔ findByText → waits for async  
*/

/* ===========================================================================
📌 8. TESTING NAVIGATION (React Navigation)
===============================================================================
We mock navigation.

*/
const mockNavigate = jest.fn();

const navigation = {
  navigate: mockNavigate,
};

function Home({ navigation }) {
  return <Button title="Go" onPress={() => navigation.navigate("Profile")} />;
}

test("navigates to Profile", () => {
  const { getByText } = render(<Home navigation={navigation} />);

  fireEvent.press(getByText("Go"));

  expect(mockNavigate).toHaveBeenCalledWith("Profile");
});

/*
✔ No real navigation required  
✔ Just mock navigate  
*/

/* ===========================================================================
📌 9. TESTING REDUX / ZUSTAND STORES
===============================================================================
### Redux example:
*/
import { Provider } from "react-redux";
import { store } from "./store";

test("component reads from Redux store", () => {
  render(
    <Provider store={store}>
      <MyComponent />
    </Provider>
  );
});

/*
### Zustand example:
*/
import create from "zustand";

const useStore = create((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
}));

test("zustand store test", () => {
  const store = useStore.getState();
  store.inc();
  expect(useStore.getState().count).toBe(1);
});

/*
Zustand is MUCH easier to test than Redux.
*/

/* ===========================================================================
📌 10. MOCKING NATIVE MODULES
===============================================================================
If your component uses:
✔ Camera  
✔ Location  
✔ NativeModule  

You MUST mock them.

Example:
*/
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");
jest.mock("react-native-device-info", () => ({
  getUniqueId: () => "123",
}));

/*
Keep mocks inside __mocks__ folder for cleaner code.
*/

/* ===========================================================================
📌 11. SNAPSHOT TESTING (OPTIONAL)
===============================================================================
*/

import renderer from "react-test-renderer";

test("matches snapshot", () => {
  const tree = renderer.create(<Counter />).toJSON();
  expect(tree).toMatchSnapshot();
});

/*
Snapshot test:
✔ Takes UI output
✔ Saves it to file
✔ Compares next time for changes
*/

/* ===========================================================================
📌 12. E2E TESTING WITH DETOX (real-device tests)
===============================================================================
Detox lets you test REAL app behavior.

Example:
  detox test
  detox build

You can:
✔ Launch app  
✔ Tap buttons  
✔ Fill inputs  
✔ Navigate screens  
✔ Assert UI text  

Great for CI automation.
*/

/* ===========================================================================
📌 13. TEST FOLDER STRUCTURE (recommended)
===============================================================================
project/
 ├── src/
 │    ├── components/
 │    │      └── Button.js
 │    ├── screens/
 │    │      └── Login.js
 │    ├── utils/
 │    │      └── formatDate.js
 ├── __tests__/ (unit + component tests)
 ├── e2e/ (Detox tests)
 └── jest.setup.js (global mocks)
*/

/* ===========================================================================
📌 14. BEST PRACTICES (BEGINNER FRIENDLY)
===============================================================================
✔ Test behavior, not implementation  
✔ Use findByText for async UI  
✔ Mock network calls always  
✔ Each test should be independent  
✔ Avoid testing styles  
✔ Clear mocks before each test  
✔ Use jest.setup.js for global mocks  
✔ Use testID="something" for stable selection  
*/

/* ===========================================================================
📌 15. INTERVIEW Q&A (VERY SIMPLE)
===============================================================================
Q1: What tools do you use to test React Native apps?
A: Jest (unit tests) + React Native Testing Library (UI tests) + Detox (E2E tests).

Q2: What do you test in RN components?
A: Text rendering, button clicks, input typing, API calls, navigation.

Q3: Why mock network calls?
A: Tests should run without internet and respond instantly.

Q4: What is the difference between getByText and findByText?
A: getByText → immediate lookup  
   findByText → waits for async UI updates  

Q5: Can you test navigation?
A: Yes, by mocking navigation.navigate.

Q6: Should you test styles?
A: No. Tests should check behavior, not appearance.

Q7: Should you test everything?
A: No. Test important logic, screens, and reusable components.
*/

/* ===========================================================================
📌 16. FINAL CHEAT-SHEET
===============================================================================
⭐ Use Jest for logic tests  
⭐ Use React Native Testing Library for component tests  
⭐ Mock API calls  
⭐ Use fireEvent.press for button actions  
⭐ Use findByText for async rendering  
⭐ Mock navigation for screen tests  
⭐ Use Detox for full app automation  
⭐ Focus on behavior, not styles  
*/

/* ===========================================================================
📌 17. WANT NEXT?
===============================================================================
I can create:
  ✅ “How to test navigation deeply (stack, tab, drawer)”  
  ✅ “How to test Redux, Zustand, and API layers professionally”  
  ✅ “How Jest mocks work (beginner-friendly)”  
  ✅ “How to test animations and gestures in RN”
Just tell me which topic you want!
*/
