import React, { Component } from 'react';
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

import { AppThemeContext } from './context/UserContext';
import Drawer  from 'react-native-drawer';
import Header from './Header';
import FooterTabs from './FooterTabs';
import Sidebar from './components/Sidebar/Sidebar';
import defaultSidebarLinks from './components/Sidebar/SidebarLinks';

import AppNavigator from './navigation/AppNavigator';

//import DonationModal from './modals/DonationModal';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

const background = require('./images/PNG/background.png');
import {colors,domainReversed} from '../app.json';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {
  getUniqueId,
} from 'react-native-device-info';

import {PushNotificationsService} from './service/PushNotificationsService';

import AsyncStorage from '@react-native-community/async-storage';
import APIService from './service/APIService';

const contentFooter = null;

export default class Main extends Component {
  constructor(props) {
    super(props);
    global.mainNavigation = this.props.navigation;
  }
  onRegister(token) {
    APIService('push-notifications/fcm/',
    {
      'registration_id':token,
      'name':getUniqueId(),
      'application_id':domainReversed,
      //'device_id':getUniqueId().replace(/[-_]/g,''),
      'cloud_message_type':'FCM',
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
    PushNotificationsService.register(this.onRegister,this.onNotification,this.onOpenNotification);
    /*
    const title = 'Test Event';
    const eventConfig = {
      title,
      // and other options
    };
    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then((eventInfo) => {
        // handle success - receives an object with `calendarItemIdentifier` and `eventIdentifier` keys, both of type string.
        // These are two different identifiers on iOS.
        // On Android, where they are both equal and represent the event id, also strings.
        // when { action: 'CANCELED' } is returned, the dialog was dismissed
        console.error(JSON.stringify(eventInfo));
      })
      .catch((error) => {
        // handle error such as when user rejected permissions
        console.error(error);
      });
    */

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
        backgroundColor: colors.main,
      },
      contentBgImage: {
        resizeMode:'cover',
        flex: 1,
        width:undefined,
        height:undefined,
        opacity: 1,
      },
    }),
  };
  toggleDonationModal = (amount) => {
    this.setState({ isDonationModalVisible: !this.state.isDonationModalVisible, amount });
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
        },400);
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
    if (route == 'ViroAR' || route == 'Panorama') {
      var hiddenHeader = true;
      var hiddenFooter = true;
    } else {
      var hiddenHeader = false;
      var hiddenFooter = false;
    }
    if (route == 'Donate') {
      this.toggleDonationModal();
      return true;
    }
    if (this.state.hiddenHeader && !hiddenHeader) {
      this.setState({ hiddenHeader: false });
    } else if (!this.state.hiddenHeader && hiddenHeader) {
      this.setState({ hiddenHeader: true });
    }
    if (this.state.hiddenFooter && !hiddenFooter) {
      this.setState({ hiddenFooter: false });
    } else if (!this.state.hiddenFooter && hiddenFooter) {
      this.setState({ hiddenFooter: true });
    }
    this.props.navigation.navigate(route, routeParams);
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <ImageBackground resizeMode="cover" imageStyle={this.state.styles.contentBgImage} style={this.state.styles.contentBg} source={background}>

      <AppThemeContext.Consumer>
        {({ themeSettings, goBack, insets }) => (
          <>
            <Drawer
              ref={ref => {
                this.drawer = ref;
              }}
              type={'overlay'}
              content={
                <Sidebar
                  sidebarLinks={this.state.sidebarLinks}
                  closeDrawer={this.closeDrawer}
                  navigation={this.props.navigation}
                  route={this.props.route}
                  drawerType={this.state.drawerType}
                />
              }
              onClose={() => this.closeDrawer()}
              side="right"
              styles={{
                drawer: {
                  shadowColor: '#000000',
                  marginTop: responsiveHeight(8.5) + insets.top,
                  backgroundColor: 'rgba(0,0,0,0)',
                },
                mainOverlay: {
                  backgroundColor: 'rgba(0,0,0,0)',
                  opacity: 0,
                  marginTop: responsiveHeight(8.5) + insets.top,
                  position: 'absolute',
                },
              }}
              tweenDuration={300}
              tweenHandler={ratio => ({
                mainOverlay: { opacity: ratio  },
              })}>
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
            </Drawer>
            {!themeSettings.hiddenFooter ?
              <>
                <FooterTabs
                  toggleDrawer={this.toggleDrawer.bind(this)}
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
              : null}
          </>)}
      </AppThemeContext.Consumer>
      </ImageBackground>
    );
  }
}
