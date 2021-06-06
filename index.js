import 'react-native-get-random-values';
import './react/features/mobile/polyfills';
global.incomingCallID = false;
import {backgroundJobs} from './backgroundjobs';
backgroundJobs();

import {setupCallKeep} from './callkeep';
setupCallKeep();

import React from 'react';
import KeyboardManager from 'react-native-keyboard-manager';

import {AppRegistry, Platform} from 'react-native';
import App from './App';

//import {IncomingCallApp} from './react/features/mobile/incoming-call';

//import {enableScreens} from 'react-native-screens';
//enableScreens(true);

if (__DEV__) {
  //  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
  /*const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: false,
  });*/
}


if (Platform.OS === 'ios') {
  KeyboardManager.setEnable(true);
}

// Register the main/root Component of IncomingCallView.
//AppRegistry.registerComponent('IncomingCallApp', () => IncomingCallApp);

AppRegistry.registerComponent('App', () => App);
