import React, {Component} from 'react';
import {StatusBar, Platform} from 'react-native';

import {AppThemeContext} from './context/UserContext';
import Header from './Header';
import FooterTabs from './FooterTabs';

import AppNavigator from './navigation/AppNavigator';

//import DonationModal from './modals/DonationModal';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatModule from 'react-native-chat-plugin';

import {ChatContext} from 'react-native-chat-plugin/ChatContext';
import RNCallKeep from 'react-native-callkeep';
import registerPushNotifications from './utils/registerPushNotifications';

const chat_url = 'https://chat.wevive.com/';
//const chat_url = 'http://192.168.0.180:3001/';
const contentFooter = null;

export default class Main extends Component {
  constructor(props) {
    super(props);
    global.mainNavigation = this.props.navigation;
  }

  componentDidMount() {
    RNCallKeep.addEventListener('answerCall', ({callUUID}) => {
      this.props.navigation.navigate('VideoCalls', {callId: callUUID, video: false});
    });
    registerPushNotifications(
      () => {}, //onNotification
      () => {}, //onOpenNotification
    );
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
    this.props.navigation.navigate(route, routeParams);
  };
  render() {
    return (
      this.state.userToken.length > 0 && (
        <ChatModule
          options={{token: this.state.userToken}}
          socketIoUrl={chat_url}>
          <StatusBar backgroundColor="white" barStyle="dark-content" />
          <AppThemeContext.Consumer>
            {({themeSettings, goBack, insets}) => (
              <ChatContext.Consumer>
                {({contacts}) => (
                  <>
                    {!themeSettings.hiddenHeader && (
                      <Header
                        themeSettings={themeSettings}
                        goBack={goBack}
                        route={this.props.route}
                      />
                    )}
                    <AppNavigator contacts={contacts} />
                    {!themeSettings.hiddenFooter && <FooterTabs />}
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
