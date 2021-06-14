import messaging from '@react-native-firebase/messaging';
import IncomingCall from 'react-native-incoming-call';
import {DeviceEventEmitter} from 'react-native';
import CacheStore from 'react-native-cache-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIService from './src/service/APIService';
export const backgroundJobs = () =>
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    const data = remoteMessage?.data;
    if (data && data.callUUID && data.type === 'call') {
      if (data.video) {
        CacheStore.set(data.callUUID, '1', 0.5);
      }
      AsyncStorage.setItem('incomingCaller', data.caller);
      AsyncStorage.setItem('incomingUUID', data.callUUID);
      //TODO: Store participants
      //CacheStore.set('callParticipants', payload.participants, 0.5);
      IncomingCall.display(
        data.callUUID, // Call UUID v4
        data.username, // Username
        data.avatarURL,
        'Wevive Call', // Info text
        60000, // Timeout for end call after 60s
      );
      APIService('users/pushmessage/', {
        users: [data.caller],
        extra: {
          type: 'call_received',
          callUUID: data.callUUID,
        },
      });
    } else if (data && data.type === 'hangup') {
      const uuid = await AsyncStorage.getItem('incomingUUID');
      if (uuid === data.callUUID) {
        IncomingCall.dismiss();
        AsyncStorage.removeItem('incomingUUID');
      }
    }

    // Listen to headless action events
    DeviceEventEmitter.addListener('endCall', async (payload) => {
      const uuid = await AsyncStorage.getItem('incomingUUID');
      const caller = await AsyncStorage.getItem('incomingCaller');
      APIService('users/pushmessage/', {
        users: [caller],
        extra: {
          type: 'hangup',
          callUUID: uuid,
        },
      });
    });
    DeviceEventEmitter.addListener('answerCall', (payload) => {
      CacheStore.set('callUUID', payload.uuid, 1);
      if (payload.isHeadless) {
        // Called from killed state
        IncomingCall.openAppFromHeadlessMode(payload.uuid);
        IncomingCall.backToForeground(payload.uuid);
      } else {
        // Called from background state
        IncomingCall.backToForeground(payload.uuid);
      }
    });
  });
