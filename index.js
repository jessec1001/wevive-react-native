import 'react-native-get-random-values';
import './react/features/mobile/polyfills';
import './react/features/app/middlewares';
import './react/features/app/reducers';

if (__DEV__) {
  //  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
}
import React from 'react';
/*const whyDidYouRender = require('@welldone-software/why-did-you-render');
whyDidYouRender(React, {
  trackAllPureComponents: false,
});*/

import {AppRegistry} from 'react-native';
import App from './App';
//import {App} from './react/features/app/components';

//import {enableScreens} from 'react-native-screens';
//enableScreens(true);
//import { _initLogging } from './react/features/base/logging/functions';
import {IncomingCallApp} from './react/features/mobile/incoming-call';
import RNCallKeep from 'react-native-callkeep';

function HeadlessCheck(initialProps) {
  return <App initialProps={initialProps} />;
}
//_initLogging();

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
RNCallKeep.setup(options).then(accepted => {});
AppRegistry.registerComponent('App', () => App);
// Register the main/root Component of IncomingCallView.
AppRegistry.registerComponent('IncomingCallApp', () => IncomingCallApp);
