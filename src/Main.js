import React, {Component} from 'react';
import {
  StatusBar,
  Platform,
  Text,
  Alert,
  AppState,
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
import OverlayPermissionModule from 'rn-android-overlay-permission';
import CacheStore from 'react-native-cache-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound';
if (Platform.OS === 'android') {
  OverlayPermissionModule.requestOverlayPermission();
}
const chat_url = 'https://chat.wevive.com/';
//const chat_url = 'http://192.168.0.180:3001/';
let whoosh;
const playSound = () => {
  whoosh = new Sound('ringingtone.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
    whoosh.setNumberOfLoops(-1);
    if (!global.incomingCallID) {
      whoosh.play((success) => {});
    }
  });
  //whoosh.release();
};
const stopSound = () => {
  if (whoosh !== false) {
    whoosh.stop();
    whoosh.release();
    whoosh = false;
  }
};
export default function Main({navigation, route}) {
  global.mainNavigation = navigation;
  const themeSettings = React.useContext(AppThemeContext);
  const {authData, updateMe} = React.useContext(UserContext);

  const appState = React.useRef(AppState.currentState);

  const _handleAppStateChange = (nextAppState) => {
    CacheStore.get('callUUID').then(async (uuid) => {
      if (uuid) {
        video = await CacheStore.get(uuid) == "1";
        global.incomingCallID = uuid;
       // console.log('IncomingCall incomingUUID redirecting from main _handleAppStateChange to call');
        CacheStore.remove('callUUID');
        navigation.navigate('VideoCalls', {
          callId: uuid,
          video,
        });
      }
    });
  };
  React.useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);
  React.useEffect(() => {
    //Alert.alert('getting incoming call');
    if (Platform.OS === 'android') {

      /**
       * App in foreground / background: listen to call events and determine what to do next
       */
      const endCallListener = DeviceEventEmitter.addListener(
        'endCall',
        (payload) => {
          console.log('IncomingCall endCallListener', payload);
          // End call action here
        },
      );
      const answerCallListener = DeviceEventEmitter.addListener(
        'answerCall',
        (payload) => {
          console.log('IncomingCall answerCallListener', payload);
          if (payload && payload.uuid) {
            CacheStore.set('incomingUUID', payload.uuid, 1);
            CacheStore.set('callUUID', payload.uuid, 1);
            IncomingCall.backToForeground(payload.uuid);
            global.incomingCallID = payload.uuid;
            setTimeout(() => {
              //Alert.alert('Navigating');
              navigation.navigate('VideoCalls', {
                callId: payload.uuid,
                video: false,
              });
            }, 1000);
          }
        },
      );
      return () => {
        endCallListener.remove();
        answerCallListener.remove();
      };
    }
  }, [navigation, authData]);
  RNCallKeep.addEventListener('answerCall', ({callUUID}) => {
    global.incomingCallID = callUUID;
    navigation.navigate('VideoCalls', {
      callId: callUUID,
      video: false,
    });
  });
  React.useEffect(() => {
    registerPushNotifications(
      (a) => {
        console.log('[FCMService] onNotification', a);
        if (a.data.conversationId) {
          navigation.navigate('ChatScreen', {
            conversation: a.data.conversationId,
          });
        }
      }, //onNotification
      (b) => {
        console.log('[FCMService] onOpenNotification', b);
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
