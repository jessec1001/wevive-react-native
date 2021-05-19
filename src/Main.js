import React, {Component} from 'react';
import {StatusBar, Platform, Text} from 'react-native';

import {AppThemeContext, UserContext} from './context/UserContext';
import Header from './Header';
import FooterTabs from './FooterTabs';

import AppNavigator from './navigation/AppNavigator';

import changeNavigationBarColor from 'react-native-navigation-bar-color';

import ChatModule from 'react-native-chat-plugin';
import RNCallKeep from 'react-native-callkeep';
import registerPushNotifications from './utils/registerPushNotifications';

const chat_url = 'https://chat.wevive.com/';
//const chat_url = 'http://192.168.0.180:3001/';

export default function Main({navigation, route}) {
  global.mainNavigation = navigation;
  const themeSettings = React.useContext(AppThemeContext);
  const {authData, updateMe} = React.useContext(UserContext);

  RNCallKeep.addEventListener('answerCall', ({callUUID}) => {
    navigation.navigate('VideoCalls', {
      callId: callUUID,
      video: false,
    });
  });
  React.useEffect(() => {
    registerPushNotifications(
      () => {}, //onNotification
      () => {}, //onOpenNotification
    );
    if (Platform.OS === 'android') {
      changeNavigationBarColor('#ffffff', true, false);
    }
  }, []);
  React.useEffect(() => {
    if (!authData || !authData.userToken) {
      updateMe();
    }
  },[authData]);
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
