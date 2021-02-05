import React from 'react';
import {
  createStackNavigator
} from '@react-navigation/stack';
import SignIn from '../screens/Auth/SignIn';
import SignUp from '../screens/Auth/SignUp';
import ConfirmAccount from '../screens/Auth/ConfirmAccount';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import ResetPassword from '../screens/Auth/ResetPassword';
const Stack = createStackNavigator();
const defaultConfig = {
  headerShown: false,
  cardStyleInterpolator: forFade,
};

const forFade = ({ current }) => ({
  cardStyle: { opacity: current.progress },
});

const AuthStack = () => (
  <Stack.Navigator
    initialRouteName="SignIn"
    screenOptions={{ gestureEnabled: false }}>
    <Stack.Screen
      name="SignIn"
      component={SignIn}
      options={defaultConfig}
    />
    <Stack.Screen
      name="ForgotPassword"
      component={ForgotPassword}
      options={defaultConfig}
    />
    <Stack.Screen
      name="ResetPassword"
      component={ResetPassword}
      options={defaultConfig}
    />
    <Stack.Screen
      name="SignUp"
      component={SignUp}
      options={defaultConfig}
    />
    <Stack.Screen
      name="ConfirmAccount"
      component={ConfirmAccount}
      options={defaultConfig}
    />
  </Stack.Navigator>
);

export default AuthStack;
