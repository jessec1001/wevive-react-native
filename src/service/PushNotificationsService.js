import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import {requestNotifications} from 'react-native-permissions';
import PushNotification from "react-native-push-notification";
class FCM_Service {
  register = (onRegister, onNotification, onOpenNotification) => {
    this.registerAppWithFCM(onRegister);
    this.checkPermission(onRegister);
    this.createNotificationListeners(
      onRegister,
      onNotification,
      onOpenNotification,
    );
  };

  registerAppWithFCM = async (onRegister) => {
    if (Platform.OS === 'ios') {
      //await messaging().registerDeviceForRemoteMessages();
      await messaging().setAutoInitEnabled(true);
    }
  };

  checkPermission = (onRegister) => {
    messaging()
      .hasPermission()
      .then((enabled) => {
        if (enabled) {
          requestNotifications([
            'alert',
            'badge',
            'sound',
          ]).then(({status, settings}) => {});
          this.getToken(onRegister);
        } else {
          // User doesn’t have permission
          this.requestPermission(onRegister);
        }
      })
      .catch((error) => {
        console.log('[FCMService] Permission rejected ', error);
      });
  };

  getToken = (onRegister) => {
    messaging()
      .getToken()
      .then(async (fcmToken) => {
        let apnsToken = await messaging().getAPNSToken();
        if (fcmToken) {
          onRegister(fcmToken, apnsToken);
        } else {
          console.log('[FCMService] User does not have a device token');
        }
      })
      .catch((error) => {
        console.log('[FCMService] getToken rejected ', error);
      });
  };

  requestPermission = (onRegister) => {
    messaging()
      .requestPermission()
      .then(() => {
        requestNotifications(['alert', 'badge', 'sound']).then(
          ({status, settings}) => {
            this.getToken(onRegister);
          },
        );
      })
      .catch((error) => {
        console.log('[FCMService] Request Permission rejected ', error);
      });
  };

  deleteToken = () => {
    console.log('[FCMService] deleteToken ');
    messaging()
      .deleteToken()
      .catch((error) => {
        console.log('[FCMService] Delete token error ', error);
      });
  };

  createNotificationListeners = (
    onRegister,
    onNotification,
    onOpenNotification,
  ) => {
    // When the application is running, but in the background
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        '[FCMService] onNotificationOpenedApp Notification caused app to open from background state:',
        remoteMessage,
      );
      if (remoteMessage) {
        onOpenNotification(remoteMessage);
      }
    });

    // When the application is opened from a quit state.
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        console.log(
          '[FCMService] getInitialNotification Notification caused app to open from quit state:',
          remoteMessage,
        );
        if (remoteMessage) {
          onOpenNotification(remoteMessage);
          PushNotification.setApplicationIconBadgeNumber(0);
        }
      });
    // Foreground state messages
    this.messageListener = messaging().onMessage(async (remoteMessage) => {
      console.log('[FCMService] A new FCM message arrived!', remoteMessage);
      if (remoteMessage) {
        let notification = null;
        notification = remoteMessage.notification;
        onNotification(notification);
      }
    });
    // Triggered when have new token
    messaging().onTokenRefresh(async (fcmToken) => {
      console.log('[FCMService] New token refresh: ', fcmToken);
      let apnsToken = await messaging().getAPNSToken();
      onRegister(fcmToken, apnsToken);
    });
  };
  unRegister = () => {
    this.messageListener();
  };
}

export const PushNotificationsService = new FCM_Service();
