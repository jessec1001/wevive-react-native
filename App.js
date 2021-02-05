//import CodePush from 'react-native-code-push';
import React, {Component} from 'react';
import {ActivityIndicator, BackHandler, UIManager, View, Platform, Dimensions, StyleSheet} from 'react-native';

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

import NetInfo from '@react-native-community/netinfo';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

import Orientation from 'react-native-orientation-locker';

import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import * as RNLocalize from 'react-native-localize';
//import Geolocation from '@react-native-community/geolocation';
import bootstrap from './src/utils/bootstrap';
import i18n from './i18n';


NetInfo.fetch().then(state => {
  global.isInternetReachable = state.isInternetReachable;
});

const netinfo_unsubscribe = NetInfo.addEventListener(state => {
  global.isInternetReachable = state.isInternetReachable;
});

import RootStack from './src/navigation/RootStack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {BioID} from './src/utils/BioAuth';
import { ClientContext } from './src/context/ClientContext';
import APIService from './src/service/APIService';
class AppContainer extends Component {
  setDimensionsIos = (dim) => {
    const { screen: { height: screenHeight, width: screenWidth },
      window: { height: windowHeight, width: windowWidth },
    } = dim;

    if (screenHeight === windowWidth && screenWidth === windowHeight) {
      setTimeout(() => Dimensions.set({ 'window': dim.screen }), 0);
    }
  }

  dimensionListener = (args) => {
    if (Platform.OS === 'ios') {this.setDimensionsIos(args);}
  };
  updateClient() {
    APIService('clients/current/',null,60).then((client)=>{
      this.setState({client});
    });
  }
  componentDidMount() {
    bootstrap();
    this.updateClient();
    setInterval(()=>{
      this.updateClient();
    }, 30000);
    if (Platform.OS === 'android') {
      changeNavigationBarColor('#000000', false, false);
    }
    if (Platform.OS === 'android') {
      //BackHandler.addEventListener('hardwareBackPress', this.goBack.bind(this));
    }

    Dimensions.removeEventListener('change', this.dimensionListener);
    global.appIsLoading = () => {this.setState({isLoading:true});};
    global.appIsNotLoading = () => {this.setState({isLoading:false});};
    //Geolocation.setRNConfiguration( { authorizationLevel: 'whenInUse' } );
    RNLocalize.addEventListener( 'change', this.handleLocalizationChange );
  }

  componentWillUnmount() {
    netinfo_unsubscribe();
    Dimensions.removeEventListener('change', this.dimensionListener);
    RNLocalize.removeEventListener('change', this.handleLocalizationChange);
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress');
    }
  }

  handleLocalizationChange = () => {
    const fallback = { languageTag: 'en' };
    const { languageTag } = RNLocalize.getLocales()[0] || fallback;
    i18n.locale = languageTag;
  };

  state = {
    isLoading: false,
    client: null,
  };

  render() {
    return <>
      <SafeAreaProvider>
        <ClientContext.Provider value={{client:this.state.client}}>
          <BioID>
            <RootStack />
          </BioID>
        </ClientContext.Provider>
      </SafeAreaProvider>
    {this.state.isLoading ?
      <>
        <View style={styles.loadingBackground} >
        </View>
        <View style={styles.loadingIndicator}>
          <ActivityIndicator
            color={'white'}
            size={'large'}
          />
        </View>
      </>
     : null}
    </>;
  }
}

const styles = StyleSheet.create({
  loadingBackground: {
    width: '100%',
    position: 'absolute',
    height: '100%',
    flex: 1,
    opacity: 0.8,
    backgroundColor: 'black',
  },
  loadingIndicator: {
    position: 'absolute',
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    height: '100%',
    width: responsiveWidth(100),
  },
}
);
//let codePushOptions = {checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME};
Orientation.lockToPortrait();
export default AppContainer; //CodePush(codePushOptions)(AppContainer);
