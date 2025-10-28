// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ExploreScreen from "./screens/ExploreScreen";
import CityDetailsScreen from "./screens/CityDetailsScreen";
import MyTripsScreen from "./screens/MyTripsScreen";
import MyTipsScreen from "./screens/MyTipsScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Explorar" component={ExploreScreen} />
      <Tab.Screen name="Minhas Viagens" component={MyTripsScreen} />
      <Tab.Screen name="Minhas Dicas" component={MyTipsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={MainTabs} options={{ headerShown:false }} />
        <Stack.Screen name="CityDetails" component={CityDetailsScreen} options={{ title:'Detalhes' }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
