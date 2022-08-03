
import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./src/screens/LoginScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";

import Main from "./src/Components/Main";
import CheckIn from "./src/screens/CheckIn";
import * as Notifications from "expo-notifications";


// https://expo.io/@staticguru/signal-clone
const Stack = createStackNavigator();
const globelScreenOptions = {
  headerStyle: { backgroundColor: "#2C6BED" },
  headerTitleStyle: { color: "white" },
  headerTintColor: "white",
  headerShown:false,

};
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
export default function App({ navigation }) {
  return (
    <React.Fragment>
      <StatusBar style="light" backgroundColor="#668aff" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={globelScreenOptions}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="CheckIn" component={CheckIn}/>
        </Stack.Navigator>
      </NavigationContainer>
    </React.Fragment>
  );
}
