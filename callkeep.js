import {Platform} from 'react-native';
import CacheStore from 'react-native-cache-store';
import RNCallKeep from 'react-native-callkeep';
import APIService from './src/service/APIService';
import VoipPushNotification from 'react-native-voip-push-notification';

export const setupCallKeep = () => {
  if (Platform.OS === 'ios') {
    const options = {
      ios: {
        appName: 'Wevive',
      },
      android: {
        alertTitle: 'Permissions required',
        alertDescription:
          'This application needs to access your phone accounts',
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
      },
    };
    VoipPushNotification.addEventListener('notification', async (payload) => {
      if (payload.caller && payload.message !== 'hangup') {
        CacheStore.set('activeCall', payload.uuid);
        CacheStore.set('activeCallOthers', JSON.stringify([payload.caller]));
      }
    });
    RNCallKeep.addEventListener('endCall', async ({callUUID}) => {
      const callId = await CacheStore.get('activeCall');
      const othersJSON = await CacheStore.get('activeCallOthers');
      const others = JSON.parse(othersJSON);
      APIService('users/pushmessage/', {
        users: others,
        message: 'Hangup',
        extra: {
          hangupUUID: callId,
        },
      });
      APIService('users/voipcall/', {
        users: others,
        callUUID: callId,
        message: 'hangup',
      });
    });
    RNCallKeep.setup(options).then((accepted) => {});
  }
};
