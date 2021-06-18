import {Platform} from 'react-native';
import CacheStore from 'react-native-cache-store';
import RNCallKeep from 'react-native-callkeep';
import APIService from './src/service/APIService';
import VoipPushNotification from 'react-native-voip-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const processCallKitNotification = (payload) => {
      console.warn('CallKit payload', payload);
      if (payload.uuid && payload.caller && payload.type === 'call') {
        AsyncStorage.setItem('incomingCaller', String(payload.caller));
        AsyncStorage.setItem('incomingUUID', String(payload.uuid));
        CacheStore.set('activeCall', String(payload.uuid));
        CacheStore.set('activeCallOthers', JSON.stringify([payload.caller]));
      } else if (payload.type === 'hangup') {
        global.hangup && global.hangup();
      }
    };
    VoipPushNotification.addEventListener('notification', async (payload) => {
      processCallKitNotification(payload);
    });
    VoipPushNotification.addEventListener('didLoadWithEvents', (events) => {
      if (!events || !Array.isArray(events) || events.length < 1) {
        return;
      }
      for (let voipPushEvent of events) {
        let {name, data} = voipPushEvent;
        if (
          name ===
          VoipPushNotification.RNVoipPushRemoteNotificationReceivedEvent
        ) {
          processCallKitNotification(data);
        }
      }
    });
    RNCallKeep.addEventListener('didDisplayIncomingCall', async (data) => {
      console.log('didDisplayIncomingCall', data);
    });

    RNCallKeep.addEventListener('endCall', async (opts) => {
      const uuid = await AsyncStorage.getItem('incomingUUID');
      const caller = await AsyncStorage.getItem('incomingCaller');

      const callId = await CacheStore.get('activeCall');
      const othersJSON = await CacheStore.get('activeCallOthers');
      const others = JSON.parse(othersJSON);
      console.log('RNCallKeep endCall', opts, uuid, caller, callId, others);
      APIService('users/pushmessage/', {
        users: others,
        message: 'Hangup',
        extra: {
          type: 'hangup',
          callUUID: opts.callUUID,
        },
      });
      RNCallKeep.endCall(opts.callUUID);
      /*APIService('users/voipcall/', {
        users: others,
        callUUID: callId,
        message: 'hangup',
      });*/
    });
    RNCallKeep.setup(options).then((accepted) => {});
  }
};
