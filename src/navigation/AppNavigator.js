import React from 'react';
import {createStackNavigator, TransitionSpecs} from '@react-navigation/stack';

import WebUI from '../screens/WebUI/WebUI';
import About from '../screens/About/About';

import Chat from '../screens/Chat/Chat';
import VideoCalls from '../screens/VideoCalls/VideoCalls';
const TransitionScreen = {
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: TransitionSpecs.TransitionIOSSpec,
    close: TransitionSpecs.TransitionIOSSpec,
  },
  cardStyleInterpolator: ({current, next, layouts}) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
          {
            translateX: next
              ? next.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -layouts.screen.width],
                })
              : 1,
          },
        ],
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.5],
        }),
      },
    };
  },
};

const defaultConfig = {
  headerShown: false,
  cardStyleInterpolator: forFade,
  headerTransparent: true,
  cardStyle: {backgroundColor: 'transparent'},
  ...TransitionScreen,
};

const Stack = createStackNavigator();
const forFade = ({current}) => ({
  cardStyle: {opacity: current.progress},
});
import ChatNavigator from '../../node_modules/react-native-chat-plugin/ChatNavigator';
const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="About"
      mode="modal"
      screenOptions={{gestureEnabled: false}}>
      <Stack.Screen
        name="VideoCalls"
        component={VideoCalls}
        options={defaultConfig}
        initialParams={{type: 'all', status: 'live'}}
      />
      <Stack.Screen name="About" component={About} options={defaultConfig} />
      <Stack.Screen name="WebUI" component={WebUI} options={defaultConfig} />
      <Stack.Screen name="Chat" options={defaultConfig} component={ChatNavigator} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
