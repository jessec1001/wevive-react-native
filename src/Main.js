import React, {Component} from 'react';
import {
  StatusBar,
  Platform,
  Text,
  Alert,
  DeviceEventEmitter,
} from 'react-native';

import {AppThemeContext, UserContext} from './context/UserContext';
import Header from './Header';
import FooterTabs from './FooterTabs';

import AppNavigator from './navigation/AppNavigator';

import changeNavigationBarColor from 'react-native-navigation-bar-color';

import ChatModule from 'react-native-chat-plugin';
import RNCallKeep from 'react-native-callkeep';
import registerPushNotifications from './utils/registerPushNotifications';

import IncomingCall from 'react-native-incoming-call';
const chat_url = 'https://chat.wevive.com/';
//const chat_url = 'http://192.168.0.180:3001/';

export default function Main({navigation, route}) {
  global.mainNavigation = navigation;
  const themeSettings = React.useContext(AppThemeContext);
  const {authData, updateMe} = React.useContext(UserContext);

  // Listen to cancel and answer call events
  React.useEffect(() => {
    async function launchCall() {
      if (Platform.OS === 'android') {
        const payload = await IncomingCall.getExtrasFromHeadlessMode();
        console.log('launchParameters', payload);
        if (payload) {
          navigation.navigate('VideoCalls', {
            callId: payload.uuid,
            video: false,
          });
          // Start call action here. You probably want to navigate to some CallRoom screen with the payload.uuid.
        }

        /**
         * App in foreground / background: listen to call events and determine what to do next
         */
        DeviceEventEmitter.addListener('endCall', (payload) => {
          // End call action here
        });
        DeviceEventEmitter.addListener('answerCall', (payload) => {
          // Start call action here. You probably want to navigate to some CallRoom screen with the payload.uuid.
        });
      }
    }
    launchCall()
  }, []);
  RNCallKeep.addEventListener('answerCall', ({callUUID}) => {
    navigation.navigate('VideoCalls', {
      callId: callUUID,
      video: false,
    });
  });
  React.useEffect(() => {
    registerPushNotifications(
      (a) => {
        //Alert.alert('onNotification:'+JSON.stringify(b));
      }, //onNotification
      (b) => {
        //Alert.alert('onOpen:'+JSON.stringify(b));
        if (b.data.conversationId) {
          navigation.navigate('ChatScreen', {
            conversation: b.data.conversationId,
          });
        }
      }, //onOpenNotification
    );
    if (Platform.OS === 'android') {
      changeNavigationBarColor('#ffffff', true, false);
    }
  }, []);
  React.useEffect(() => {
    if (!authData || !authData.userToken) {
      updateMe();
    }
  }, [authData]);
  return (
    <ChatModule options={authData} socketIoUrl={chat_url}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      {!themeSettings.hiddenHeader && (
        <Header themeSettings={themeSettings} route={route} />
      )}
      <AppNavigator />
      {!themeSettings.hiddenFooter && <FooterTabs />}
    </ChatModule>
  );
}
