import {Platform} from 'react-native';
import {getUniqueId} from 'react-native-device-info';
import VoipPushNotification from 'react-native-voip-push-notification';

import {domainReversed} from '../../app.json';
import {PushNotificationsService} from '../service/PushNotificationsService';
import APIService from '../service/APIService';
const onRegister = (token, apns_token) => {
  const name = getUniqueId();
  APIService('push-notifications/fcm/', {
    registration_id: token,
    name,
    application_id: domainReversed,
    //'device_id':getUniqueId().replace(/[-_]/g,''),
    cloud_message_type: 'FCM',
  });
  if (apns_token && apns_token.length > 0) {
    APIService('push-notifications/apns/', {
      registration_id: apns_token,
      name,
      application_id: domainReversed,
      //'device_id':getUniqueId().replace(/[-_]/g,''),
      cloud_message_type: 'APNS',
    });
  }
};
export default function registerPushNotifications(
  onNotification,
  onOpenNotification,
) {
  if (Platform.OS !== 'android') {
    VoipPushNotification.addEventListener('register', (voipToken) => {
      const name = getUniqueId();
      PushNotificationsService.register(
        onRegister,
        onNotification,
        onOpenNotification,
      );
      APIService('push-notifications/apns/', {
        registration_id: voipToken,
        name,
        application_id: domainReversed + '.voip',
        cloud_message_type: 'APNS',
      });
    });
    VoipPushNotification.registerVoipToken();
  }
}
