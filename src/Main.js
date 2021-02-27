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
import Drawer from 'react-native-drawer';
import Header from './Header';
import FooterTabs from './FooterTabs';
import Sidebar from './components/Sidebar/Sidebar';
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
      changeNavigationBarColor('#082136', false, true);
    }
    PushNotificationsService.register(
      this.onRegister,
      this.onNotification,
      this.onOpenNotification,
    );

    if (global.isInternetReachable) {
      /*APIService('content/sidebar', {}, false, 60 * 4).then(result => {
        if (result.sidebarLinks) {
          this.setState({sidebarLinks: result.sidebarLinks});
        }
      });*/
    }
    global.toggleDonationModal = this.toggleDonationModal;
  }

  state = {
    drawerType: 'profile',
    isDonationModalVisible: false,
    sidebarLinks: defaultSidebarLinks,
    styles: StyleSheet.create({
      contentBg: {
        width: responsiveWidth(100),
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
  closeDrawer = () => {
    this.drawer && this.drawer.close();
  };
  toggleDrawer = (drawerType = 'profile') => {
    if (this.state.drawerType != drawerType) {
      if (this.drawer._open) {
        setTimeout(() => {
          this.setState({drawerType});
          this.toggleDrawer(drawerType);
        }, 400);
      } else {
        this.setState({drawerType});
      }
    } else {
      this.setState({drawerType});
    }
    this.drawer && this.drawer.toggle();
  };
  openDrawer = () => {
    this.drawer && this.drawer.open();
  };
  navigate = (route, routeParams) => {
    this.closeDrawer();
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
    const {navigate} = this.props.navigation;
    return (
      <ImageBackground
        resizeMode="cover"
        imageStyle={this.state.styles.contentBgImage}
        style={this.state.styles.contentBg}>
        <AppThemeContext.Consumer>
          {({themeSettings, goBack, insets}) => (
            <>
              {!themeSettings.hiddenHeader ? (
                <Header
                  themeSettings={themeSettings}
                  navigation={this.props.navigation}
                  toggleDrawer={this.toggleDrawer.bind(this)}
                  hiddenBack={themeSettings.hiddenBack}
                  goBack={goBack}
                />
              ) : null}
              <AppNavigator />
              {!themeSettings.hiddenFooter ? (
                <>
                  <FooterTabs
                    toggleDrawer={this.toggleDrawer.bind(this)}
                    navigate={this.navigate}
                    navigation={this.props.navigation}
                    route={this.props.route}
                  />
                  <Image
                    source={contentFooter}
                    style={{
                      position: 'absolute',
                      marginBottom: 0,
                      bottom: responsiveHeight(9),
                      height: 15,
                      width: '100%',
                    }}
                  />
                </>
              ) : null}
            </>
          )}
        </AppThemeContext.Consumer>
      </ImageBackground>
    );
  }
}
