import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  View,
  Text,
  StatusBar,
  Platform,
  ImageBackground,
  Alert,
  PermissionsAndroid,
  NativeModules,
} from 'react-native';

import {AppThemeContext} from './context/UserContext';
import Header from './Header';
import FooterTabs from './FooterTabs';
import defaultSidebarLinks from './components/Sidebar/SidebarLinks';

import AppNavigator from './navigation/AppNavigator';

//import DonationModal from './modals/DonationModal';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

const background = require('./images/PNG/background.png');
import {colors, domainReversed} from '../app.json';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {getUniqueId} from 'react-native-device-info';

import {PushNotificationsService} from './service/PushNotificationsService';

import AsyncStorage from '@react-native-async-storage/async-storage';
import APIService from './service/APIService';
import ChatModule from 'react-native-chat-plugin';

import Icon from './components/Icon';
import {ChatContext} from 'react-native-chat-plugin/ChatContext';
import VoipPushNotification from 'react-native-voip-push-notification';
//import RNCallKeep from 'react-native-callkeep';
import CallKit from '../react/features/mobile/call-integration/CallKit';

const chat_url = 'https://chat.wevive.com/';
//const chat_url = 'http://192.168.0.180:3001/';
const contentFooter = null;

export default class Main extends Component {
  constructor(props) {
    super(props);
    global.mainNavigation = this.props.navigation;
  }
  onRegister(token, apns_token) {
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
  }
  onNotification(notification) {
    //Alert.alert(notification.title,notification.body);
  }
  onOpenNotification(notification) {
    //Alert.alert('onOpenNotification=' + JSON.stringify(notification));
  }
  componentDidMount() {
    CallKit.addListener('performAnswerCallAction', (aa) => {
      console.error('performAnswerCallAction', aa);
    });
    if (Platform.OS !== 'android') {
      VoipPushNotification.addEventListener('register', (voipToken) => {
        const name = getUniqueId();
        PushNotificationsService.register(
          this.onRegister,
          this.onNotification,
          this.onOpenNotification,
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
    if (Platform.OS === 'android') {
      changeNavigationBarColor('#ffffff', true, false);
    }

    AsyncStorage.getItem('userToken').then((userToken) => {
      this.setState({userToken});
    });
  }

  state = {
    userToken: '',
  };
  navigate = (route, routeParams) => {
    if (route === 'VideoCalls') {
      var hiddenHeader = true;
      var hiddenFooter = true;
    } else {
      var hiddenHeader = false;
      var hiddenFooter = false;
    }
    if (this.state.hiddenHeader && !hiddenHeader) {
      this.setState({hiddenHeader: false});
    } else if (!this.state.hiddenHeader && hiddenHeader) {
      this.setState({hiddenHeader: true});
    }
    if (this.state.hiddenFooter && !hiddenFooter) {
      this.setState({hiddenFooter: false});
    } else if (!this.state.hiddenFooter && hiddenFooter) {
      this.setState({hiddenFooter: true});
    }
    this.props.navigation.navigate(route, routeParams);
  };
  render() {
    return (
      this.state.userToken.length > 0 && (
        <ChatModule
          options={{token: this.state.userToken}}
          socketIoUrl={chat_url}
          icon={Icon}>
          <StatusBar translucent barStyle="dark-content" />
          <AppThemeContext.Consumer>
            {({themeSettings, goBack, insets}) => (
              <ChatContext.Consumer>
                {({contacts}) => (
                  <>
                    {!themeSettings.hiddenHeader ? (
                      <Header
                        themeSettings={themeSettings}
                        navigation={this.props.navigation}
                        hiddenBack={themeSettings.hiddenBack}
                        goBack={goBack}
                        navigate={this.navigate}
                        route={this.props.route}
                      />
                    ) : null}
                    <AppNavigator contacts={contacts} />
                    {!themeSettings.hiddenFooter ? (
                      <FooterTabs
                        navigate={this.navigate}
                        route={this.props.route}
                      />
                    ) : null}
                  </>
                )}
              </ChatContext.Consumer>
            )}
          </AppThemeContext.Consumer>
        </ChatModule>
      )
    );
  }
}

const styles = StyleSheet.create({
  contentBg: {
    width: responsiveWidth(100),
    backgroundColor: 'rgb(255,255,255)',
    flex: 1,
  },
  contentBgImage: {
    resizeMode: 'cover',
    flex: 1,
    width: undefined,
    height: undefined,
    opacity: 1,
  },
});
