
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from './JPLoginPage';
import SignUpScreen from './JPSignUP_page';
import ForgotPasswordScreen from './JPForgotPassPage';

const Stack = createNativeStackNavigator();

const JPAuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false}}>
      <Stack.Screen  name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

export default JPAuthStack;
