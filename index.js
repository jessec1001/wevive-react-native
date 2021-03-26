import 'react-native-get-random-values';
import './react/features/mobile/polyfills';
import './react/features/app/middlewares';
import './react/features/app/reducers';

if (__DEV__) {
  //  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
}
//import messaging from '@react-native-firebase/messaging';
//messaging().setBackgroundMessageHandler(async remoteMessage => {
//  console.log('Message handled in the background!', remoteMessage);
//});
import React from 'react';
/*const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
*/
import {AppRegistry} from 'react-native';
import App from './App';
//import {enableScreens} from 'react-native-screens';
//enableScreens();
//import { _initLogging } from './react/features/base/logging/functions';
import {IncomingCallApp} from './react/features/mobile/incoming-call';

function HeadlessCheck({isHeadless, url}) {
  //console.error(isHeadless, url);
  if (isHeadless) {
    return null;
  }
  return <App url={url} isHeadless={isHeadless} />;
}
//_initLogging();
nextButton = () => {
  console.log('nextButton');
};
AppRegistry.registerComponent('App', () => HeadlessCheck);
// Register the main/root Component of IncomingCallView.
AppRegistry.registerComponent('IncomingCallApp', () => IncomingCallApp);
