import React from 'react';
import {
  createStackNavigator
} from '@react-navigation/stack';
import SignIn from '../screens/Auth/SignIn';
import SignUp from '../screens/Auth/SignUp';
import ConfirmAccount from '../screens/Auth/ConfirmAccount';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import ResetPassword from '../screens/Auth/ResetPassword';
import AvatarScreen from '../screens/Auth/AvatarScreen';
import NotificationsScreen from '../screens/Auth/NotificationsScreen';
import PINScreen from '../screens/Auth/PINScreen';
import VerificationScreen from '../screens/Auth/VerificationScreen';
import VerificationSuccess from '../screens/Auth/VerificationSuccess';
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
    <Stack.Screen
      name="AvatarScreen"
      component={AvatarScreen}
      options={defaultConfig}
    />
    <Stack.Screen
      name="NotificationsScreen"
      component={NotificationsScreen}
      options={defaultConfig}
    />
    <Stack.Screen
      name="PINScreen"
      component={PINScreen}
      options={defaultConfig}
    />
    <Stack.Screen
      name="VerificationScreen"
      component={VerificationScreen}
      options={defaultConfig}
    />
    <Stack.Screen
      name="VerificationSuccess"
      component={VerificationSuccess}
      options={defaultConfig}
    />
  </Stack.Navigator>
);

export default AuthStack;
