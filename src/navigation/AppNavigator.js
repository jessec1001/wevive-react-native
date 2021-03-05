import React from 'react';
import {createStackNavigator, TransitionSpecs} from '@react-navigation/stack';

import WebUI from '../screens/WebUI/WebUI';
import About from '../screens/About/About';
import Settings from '../screens/Settings/Settings';
import VideoCalls from '../screens/VideoCalls/VideoCalls';

import PhoneContactsScreen from "../../node_modules/react-native-chat-plugin/PhoneContactsScreen/PhoneContactsScreen";
import ContactsScreen from "../../node_modules/react-native-chat-plugin/ContactsScreen/ContactsScreen";
import ChatScreen from "../../node_modules/react-native-chat-plugin/ChatScreen/ChatScreen";
import SearchContactsScreen from "../../node_modules/react-native-chat-plugin/SearchContactsScreen/SearchContactsScreen";
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
      <Stack.Screen name="Settings" component={Settings} options={defaultConfig} />
      <Stack.Screen name="WebUI" component={WebUI} options={defaultConfig} />
      <Stack.Screen component={ContactsScreen} name={"ContactsScreen"} options={defaultConfig} />
      <Stack.Screen component={PhoneContactsScreen} name={"PhoneContactsScreen"} options={defaultConfig} />
      <Stack.Screen component={ChatScreen} name={"ChatScreen"} options={defaultConfig} />
      <Stack.Screen component={SearchContactsScreen} name={"SearchContactsScreen"} options={defaultConfig} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
