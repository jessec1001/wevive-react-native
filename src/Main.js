import React, {Component} from 'react';
import {StatusBar, Platform} from 'react-native';

import {AppThemeContext, UserContext} from './context/UserContext';
import Header from './Header';
import FooterTabs from './FooterTabs';

import AppNavigator from './navigation/AppNavigator';

import changeNavigationBarColor from 'react-native-navigation-bar-color';

import ChatModule from 'react-native-chat-plugin';

import {ChatContext} from 'react-native-chat-plugin/ChatContext';
import RNCallKeep from 'react-native-callkeep';
import registerPushNotifications from './utils/registerPushNotifications';

const chat_url = 'https://chat.wevive.com/';
//const chat_url = 'http://192.168.0.180:3001/';

export default function Main({navigation, route}) {
  global.mainNavigation = navigation;
  const {themeSettings, goBack, insets} = React.useContext(AppThemeContext);
  const {contacts} = React.useContext(ChatContext);
  const {authData} = React.useContext(UserContext);
  React.useEffect(() => {
    RNCallKeep.addEventListener('answerCall', ({callUUID}) => {
      this.props.navigation.navigate('VideoCalls', {
        callId: callUUID,
        video: false,
      });
    });
    registerPushNotifications(
      () => {}, //onNotification
      () => {}, //onOpenNotification
    );
    if (Platform.OS === 'android') {
      changeNavigationBarColor('#ffffff', true, false);
    }
  }, []);
  if (!authData || !authData.userToken) {
    return null;
  }
  return (
    <ChatModule options={{token: authData.userToken}} socketIoUrl={chat_url}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      {!themeSettings.hiddenHeader && (
        <Header themeSettings={themeSettings} goBack={goBack} route={route} />
      )}
      <AppNavigator />
      {!themeSettings.hiddenFooter && <FooterTabs />}
    </ChatModule>
  );
}
