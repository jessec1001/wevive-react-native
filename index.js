if (__DEV__) {
  //  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
  /*const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: false,
  });*/
}
import React from 'react';

/*Jitsi*/
import 'react-native-get-random-values';
import './react/features/mobile/polyfills';
import './react/features/app/middlewares';
import './react/features/app/reducers';
//import { _initLogging } from './react/features/base/logging/functions';

import KeyboardManager from 'react-native-keyboard-manager';

import {AppRegistry, Platform} from 'react-native';
import App from './App';


import {IncomingCallApp} from './react/features/mobile/incoming-call';
import RNCallKeep from 'react-native-callkeep';
//import {enableScreens} from 'react-native-screens';

//enableScreens(true);
//_initLogging();
if (Platform.OS == 'ios') {
  const options = {
    ios: {
      appName: 'Wevive',
    },
    android: {
      alertTitle: 'Permissions required',
      alertDescription: 'This application needs to access your phone accounts',
      cancelButton: 'Cancel',
      okButton: 'ok',
      imageName: 'phone_account_icon',

      //additionalPermissions: [PermissionsAndroid.PERMISSIONS.example],
      // Required to get audio in background when using Android 11
      foregroundService: {
        channelId: 'com.wevive.weviveapp',
        channelName: 'Foreground service for my app',
        notificationTitle: 'Wevive',
        //notificationIcon: 'Path to the resource icon of the notification',
      },
    }
  };
  //TODO: disable incoming calls if not accepted on Android
  RNCallKeep.setup(options).then(accepted => {});


  KeyboardManager.setEnable(true);
}
AppRegistry.registerComponent('App', () => App);
// Register the main/root Component of IncomingCallView.
AppRegistry.registerComponent('IncomingCallApp', () => IncomingCallApp);
