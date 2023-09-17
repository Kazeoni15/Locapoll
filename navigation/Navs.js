import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
// import HomeScreen from "../components/pages/HomeScreen";
import Settings from "../screens/Settings";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import Home from "../screens/Home";
import { getAuth } from "firebase/auth";
import { View } from "react-native";
import CreatePoll from "../screens/CreatePoll";
import Drafts from "../screens/Drafts";
import EditPoll from "../screens/EditPoll";
import Poll from "../screens/Poll";
import YourVotes from "../screens/YourVotes";
// import Test from "../screens/Test";



const Stack = createStackNavigator();

const screenOptions = {
    headerShown: false,
  };

  export const SignedInStack = () => {

   
    

    return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="home"
        screenOptions={screenOptions}
      >

        {/* {{auth ? <Home user={auth.uid}/> : <Text>Loading</Text>}}  */}
        <Stack.Screen name="home" component={Home}/>
        <Stack.Screen name="settings" component={Settings} />
        <Stack.Screen name="create-poll" component={CreatePoll}/>
        <Stack.Screen name="drafts" component={Drafts}/>
        <Stack.Screen name="myvotes" component={YourVotes}/>
        <Stack.Screen name='edit' options={({ route }) => ({ title: `Edit Poll #${route.params.pollId}` })} component={EditPoll}/>
        <Stack.Screen name='poll' options={({ route }) => ({ title: `Edit Poll #${route.params.pollId}` })} component={Poll}/>
      </Stack.Navigator>
    </NavigationContainer>
  )};
  
  export const SignedOutStack = () =>{ 

    
    
    return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={screenOptions}
      >
        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )};