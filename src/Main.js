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
const chat_url = 'https://chat.wevive.com/';
//const chat_url = 'http://192.168.0.180:3001/';
const contentFooter = null;

export default class Main extends Component {
  constructor(props) {
    super(props);
    global.mainNavigation = this.props.navigation;
  }
  onRegister(token) {
    APIService('push-notifications/fcm/', {
      registration_id: token,
      name: getUniqueId(),
      application_id: domainReversed,
      //'device_id':getUniqueId().replace(/[-_]/g,''),
      cloud_message_type: 'FCM',
    });
  }
  onNotification(notification) {
    //Alert.alert(notification.title,notification.body);
  }
  onOpenNotification(notification) {
    //Alert.alert('onOpenNotification=' + JSON.stringify(notification));
  }
  componentDidMount() {
    if (Platform.OS === 'android') {
      changeNavigationBarColor('#ffffff', true, false);
    }
    PushNotificationsService.register(
      this.onRegister,
      this.onNotification,
      this.onOpenNotification,
    );
    AsyncStorage.getItem('userToken').then((userToken) => {
      this.setState({userToken});
    });
    global.toggleDonationModal = this.toggleDonationModal;
  }

  state = {
    userToken: '',
    drawerType: 'profile',
    isDonationModalVisible: false,
    sidebarLinks: defaultSidebarLinks,
    styles: StyleSheet.create({
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
    }),
  };
  toggleDonationModal = (amount) => {
    this.setState({
      isDonationModalVisible: !this.state.isDonationModalVisible,
      amount,
    });
  };
  navigate = (route, routeParams) => {
    if (route == 'VideoCalls') {
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
          <ImageBackground
            resizeMode="cover"
            imageStyle={this.state.styles.contentBgImage}
            style={this.state.styles.contentBg}>
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
                        <>
                          <FooterTabs
                            navigate={this.navigate}
                            navigation={this.props.navigation}
                            route={this.props.route}
                          />
                        </>
                      ) : null}
                    </>
                  )}
                </ChatContext.Consumer>
              )}
            </AppThemeContext.Consumer>
          </ImageBackground>
        </ChatModule>
      )
    );
  }
}
