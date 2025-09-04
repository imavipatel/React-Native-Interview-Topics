/**
 * ==============================================================
 * 📘 React Native Notes – Passing Params Between Screens
 * ==============================================================
 *
 * 🟢 THEORY
 * --------------------------------------------------------------
 * 🔹 Why do we need params?
 * - To send data from one screen to another.
 * - Example: Clicking a product → navigate to Product Details with productId.
 *
 * 🔹 How params are handled?
 * - React Navigation allows passing params via `navigation.navigate()`.
 * - The receiving screen can access params using `route.params`.
 * - Params persist in navigation state until screen is unmounted/reset.
 *
 * --------------------------------------------------------------
 * 🔹 Ways to Pass Params
 * 1️⃣ Using `navigation.navigate("ScreenName", { paramName: value })`
 * 2️⃣ Accessing params with `route.params`
 * 3️⃣ Updating params using `navigation.setParams()`
 * 4️⃣ Passing functions as params (less recommended, use context/state instead)
 *
 * ==============================================================
 * 🔹 Example 1: Basic Passing of Params
 * --------------------------------------------------------------
 */
import React from "react";
import { Button, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details with ID = 101"
        onPress={() => navigation.navigate("Details", { id: 101 })}
      />
    </View>
  );
}

function DetailsScreen({ route }) {
  // Access params from route
  const { id } = route.params;
  return <Text>Details Screen - ID: {id}</Text>;
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/**
 * ==============================================================
 * 🔹 Example 2: Updating Params
 * --------------------------------------------------------------
 */
function DetailsScreenWithUpdate({ route, navigation }) {
  const { id } = route.params;

  return (
    <View>
      <Text>Details Screen - ID: {id}</Text>
      <Button
        title="Update Param"
        onPress={() => navigation.setParams({ id: 202 })}
      />
    </View>
  );
}

/**
 * ==============================================================
 * 🔹 Example 3: Passing Params Back (Go Back with Data)
 * --------------------------------------------------------------
 */
function HomeScreenBack({ navigation }) {
  const [result, setResult] = React.useState(null);

  React.useEffect(() => {
    if (navigation.getState().routes[1]?.params?.result) {
      setResult(navigation.getState().routes[1].params.result);
    }
  }, [navigation]);

  return (
    <View>
      <Text>Home Screen</Text>
      {result && <Text>Result from Details: {result}</Text>}
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate("DetailsBack", { item: "Apple" })}
      />
    </View>
  );
}

function DetailsScreenBack({ route, navigation }) {
  const { item } = route.params;
  return (
    <View>
      <Text>Details Screen - Item: {item}</Text>
      <Button
        title="Go Back with Result"
        onPress={() => navigation.navigate("Home", { result: "Success ✅" })}
      />
    </View>
  );
}

/**
 * ==============================================================
 * 🔹 Example 4: Passing Params in Tab or Drawer
 * --------------------------------------------------------------
 * - You can pass params in any navigator (Stack, Tab, Drawer).
 * - But for persistent data across screens, Context or Redux is better.
 */

/**
 * ==============================================================
 * ❓ Q&A for Interviews
 * --------------------------------------------------------------
 * Q1: How do you pass params between screens?
 *    → navigation.navigate("ScreenName", { paramName: value })
 *
 * Q2: How do you access params?
 *    → Inside target screen: route.params.paramName
 *
 * Q3: Can you update params after navigation?
 *    → Yes, using navigation.setParams({ key: value })
 *
 * Q4: How to pass params back when navigating back?
 *    → Use navigation.navigate("PrevScreen", { result: "data" })
 *
 * Q5: What if you need global data across many screens?
 *    → Use Context API, Redux, or Zustand instead of navigation params.
 *
 * Q6: Are params preserved if app is reloaded?
 *    → No, unless you persist navigation state.
 *
 * ==============================================================
 */
