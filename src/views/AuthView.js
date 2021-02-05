import React, {Fragment, Component} from 'react';
import {
  Image,
  Keyboard,
  ImageBackground,
  SafeAreaView,
  KeyboardAvoidingView,
  Text,
  TextInput,
  StyleSheet,
  View,
  StatusBar,
  ScrollView,
} from 'react-native';
import styles from '../styles/auth';

import KeyboardManager from 'react-native-keyboard-manager';


import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {UIManager, LayoutAnimation, Linking, Platform} from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { ScrollContext } from '../context/ScrollContext';
import AsyncStorage from '@react-native-community/async-storage';
const logo = require('../images/PNG/wetalk_logo.png');
const background = require('../images/PNG/wevive_bg.png');
export default class AuthView extends Component {
  state = {
    styles: styles(false),
    scrollView: null,
  };
  componentDidMount() {
    if (Platform.OS === 'ios') {
      KeyboardManager.setEnable(false);
      KeyboardManager.setKeyboardDistanceFromTextField(10);
      KeyboardManager.setPreventShowingBottomBlankSpace(true);
      KeyboardManager.setEnableAutoToolbar(false);
      KeyboardManager.setToolbarDoneBarButtonItemText('Done');
      KeyboardManager.setToolbarManageBehaviour(0);
      KeyboardManager.setToolbarPreviousNextButtonEnable(true);
      KeyboardManager.setShouldToolbarUsesTextFieldTintColor(true);// deprecated, use setShouldShowToolbarPlaceholder
      KeyboardManager.setShouldShowToolbarPlaceholder(true);
      KeyboardManager.setOverrideKeyboardAppearance(false);
      KeyboardManager.setShouldResignOnTouchOutside(true);
      KeyboardManager.resignFirstResponder();
    }
    this.focusListener = this.props.navigation.addListener('focus', () => {
      if (this.props.route) {
        if (!this.props.route.params || !this.props.route.params.BioID) {
          this.props.navigation.setParams({BioID: true});
        }
      }
      if (this.props.signMessage && (!this.props.route.params || this.props.route.params.BioID)) {
        AsyncStorage.getItem('email').then((email)=>{
          if (email) {
            this.props.signMessage(':biometric_login', 'Sign in using ' + email + '?').then((success)=>{
              this.props.bioLoginFunction({success,hideError:true});
            });
          }
        });

      }
    });

    if (Platform.OS === 'android') {
      changeNavigationBarColor('#082136', false, false);
    }
    Linking.addEventListener('url', (event) => {
      this.handleOpenURL(event.url);
    });
    // Launched from an external URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        this.handleOpenURL(url);
      }
      global.Auth_Last_URL = '';
    });
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () =>
      this.setState({styles: styles(true)})
    );
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
      this.setState({styles: styles(false)})
    );
  }
  handleOpenURL = async (url) => {
    const lastURL = global.Auth_Last_URL;
    if (lastURL === url) {
      return true;
    }
    global.Auth_Last_URL = url;
    if (url.indexOf('/reset') > 0) {
      const token = url.slice(url.indexOf('/reset') + 7);
      this.props.navigation.navigate('ResetPassword', {token: token});
    }
  };
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <StatusBar backgroundColor="rgba(0,56,104,0)" translucent={true} barStyle="light-content" />
        <ImageBackground
          resizeMode="cover"
          imageStyle={this.state.styles.bgStyle}
          style={this.state.styles.contentBg}
          source={background}>
          <KeyboardAwareScrollView ref={ref => (this.state.scrollView = ref)}>
            <ScrollContext.Provider value={{scroll:this.state.scrollView}}>
              <View style={this.state.styles.container}>
                {this.props.children}
              </View>
            </ScrollContext.Provider>
          </KeyboardAwareScrollView>
        </ImageBackground>
      </>
    );
  }
}
