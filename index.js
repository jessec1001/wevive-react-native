if(__DEV__) {
//  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
}
//import messaging from '@react-native-firebase/messaging';
//messaging().setBackgroundMessageHandler(async remoteMessage => {
//  console.log('Message handled in the background!', remoteMessage);
//});
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import { name as appName } from './app.json';

function HeadlessCheck({ isHeadless }) {
    if (isHeadless) {
      return null;
    }
    return <App />;
}

AppRegistry.registerComponent('App', () => HeadlessCheck);

