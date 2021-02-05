import React from 'react';
import {
  createStackNavigator,
  TransitionSpecs
} from '@react-navigation/stack';

import WebUI from '../screens/WebUI/WebUI';
import LotteriesList from '../screens/Lotteries/LotteriesList';

import LotteryDetails from '../screens/Lotteries/LotteryDetails';
import LotteryTickets from '../screens/Lotteries/LotteryTickets';
import LotteryPrizes from '../screens/Lotteries/LotteryPrizes';


import Purchase from '../screens/Lotteries/Purchase';
import Cart from '../screens/Lotteries/Cart';

import About from '../screens/About/About';
import Contact from '../screens/Contact/Contact';
import SupportTickets from '../screens/Contact/SupportTickets';

import Accessibility from '../screens/Compliance/Accessibility';
import Complaints from '../screens/Compliance/Complaints';
import GDPR from '../screens/Compliance/GDPR';
import Privacy from '../screens/Compliance/Privacy';
import Terms from '../screens/Compliance/Terms';

import Account from '../screens/Account/Account';
import AddFunds from '../screens/Account/AddFunds';
import Details from '../screens/Account/Details';
import ChangePassword from '../screens/Account/ChangePassword';
import ChangePhone from '../screens/Account/ChangePhone';
import RedeemFunds from '../screens/Account/RedeemFunds';

const TransitionScreen = {
  gestureDirection: 'horizontal',
  transitionSpec: {
      open: TransitionSpecs.TransitionIOSSpec,
      close: TransitionSpecs.TransitionIOSSpec
  },
  cardStyleInterpolator: ({ current, next, layouts }) => {
      return {
          cardStyle: {
              transform: [
                  {
                      translateX: current.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [layouts.screen.width, 0]
                      })
                  },
                  {
                      translateX: next
                          ? next.progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, -layouts.screen.width]
                            })
                          : 1
                  }
              ]
          },
          overlayStyle: {
              opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5]
              })
          }
      };
  }
};

const defaultConfig = {
  headerShown: false,
  cardStyleInterpolator: forFade,
  headerTransparent: true,
  cardStyle: { backgroundColor: 'transparent' },
  ...TransitionScreen
};

const Stack = createStackNavigator();
const forFade = ({ current }) => ({
  cardStyle: { opacity: current.progress },
});


const AppNavigator = () => (
  <Stack.Navigator
    initialRouteName="LotteriesList"
    mode="card"
    screenOptions={{ gestureEnabled: false }}>
    <Stack.Screen
      name="LotteriesList"
      component={LotteriesList}
      options={defaultConfig}
      initialParams={{type:"all", status:"live"}}
    />
    <Stack.Screen
      name="LotteryDetails"
      component={LotteryDetails}
      options={defaultConfig}
    />
    <Stack.Screen
      name="LotteryPrizes"
      component={LotteryPrizes}
      options={defaultConfig}
    />
    <Stack.Screen
      name="LotteryTickets"
      component={LotteryTickets}
      options={defaultConfig}
    />
    <Stack.Screen
      name="Purchase"
      component={Purchase}
      options={defaultConfig}
    />
    <Stack.Screen
      name="Cart"
      component={Cart}
      options={defaultConfig}
    />
    <Stack.Screen
      name="About"
      component={About}
      options={defaultConfig}
    />
    <Stack.Screen
      name="Contact"
      component={Contact}
      options={defaultConfig}
    />
    <Stack.Screen
      name="SupportTickets"
      component={SupportTickets}
      options={defaultConfig}
    />
    <Stack.Screen
      name="Accessibility"
      component={Accessibility}
      options={defaultConfig}
    />
    <Stack.Screen
      name="Complaints"
      component={Complaints}
      options={defaultConfig}
    />
    <Stack.Screen
      name="GDPR"
      component={GDPR}
      options={defaultConfig}
    />
    <Stack.Screen
      name="Privacy"
      component={Privacy}
      options={defaultConfig}
    />
    <Stack.Screen
      name="Terms"
      component={Terms}
      options={defaultConfig}
    />
    <Stack.Screen
      name="Account"
      component={Account}
      options={defaultConfig}
    />
    <Stack.Screen
      name="AddFunds"
      component={AddFunds}
      options={defaultConfig}
    />
    <Stack.Screen
      name="Details"
      component={Details}
      options={defaultConfig}
    />
    <Stack.Screen
      name="ChangePhone"
      component={ChangePhone}
      options={defaultConfig}
    />
    <Stack.Screen
      name="ChangePassword"
      component={ChangePassword}
      options={defaultConfig}
    />
    <Stack.Screen
      name="RedeemFunds"
      component={RedeemFunds}
      options={defaultConfig}
    />
    <Stack.Screen
      name="WebUI"
      component={WebUI}
      options={defaultConfig}
    />
  </Stack.Navigator>
);

export default AppNavigator;
