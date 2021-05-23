import React, {Component} from 'react';
import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {colors} from '../../app.json';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
const logo = require('../images/PNG/logo-line.png');
const background = require('../images/PNG/wevive_bg.png');

export default class AppBootstrap extends Component {
  state = {
    isReady: false,
  };
  async componentDidMount() {
    var $this = this;
    if (Platform.OS === 'android') {
      changeNavigationBarColor('#082136', false, false);
    }
    setTimeout(function () {
      $this._bootstrapAsync($this);
    }, 300);
  }

  _bootstrapAsync = async ($this) => {
    const userToken = await AsyncStorage.getItem('userToken');
    AsyncStorage.multiGet(['userToken', 'bioAccessToken']).then((items) => {
      const k = {};
      items.map((i) => (k[i[0]] = i[1]));
      $this.setState({isReady: true});
      $this.props.navigation.navigate(k.userToken && !k.bioAccessToken ? 'App' : 'Auth');
    });
  };

  render() {
    return (
      <ImageBackground
        resizeMode="cover"
        imageStyle={styles.bgStyle}
        source={background}
        style={styles.bg}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image style={styles.logo} source={logo} />
            <ActivityIndicator color={styles.spinnerStyle.color} />
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const orientedResponsiveWidth = (val) => {
  if (responsiveHeight(100) > responsiveWidth(100)) {
    return responsiveWidth(val);
  } else {
    return responsiveHeight(val);
  }
};
const orientedResponsiveHeight = (val) => {
  if (responsiveHeight(100) > responsiveWidth(100)) {
    return responsiveHeight(val);
  } else {
    return responsiveWidth(val);
  }
};

const styles = StyleSheet.create({
  spinnerStyle: {
    color: 'rgb(130,176,120)',
    overlayColor: 'rgba(0, 0, 0, 0.00)',
  },
  spinnerTextStyle: {
    color: 'black',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100%',
  },
  bg: {
    width: orientedResponsiveWidth(100),
    height: '100%',
  },
  bgStyle: {
    opacity: 0.4,
  },
  logo: {
    width: (417 / 83) * responsiveWidth(15),
    height: responsiveWidth(15),
    top: -80,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    top: -orientedResponsiveHeight(15),
  },
  backgroundPart1: {
    backgroundColor: 'rgb(0,0,0)',
    position: 'absolute',
    width: '100%',
    height: orientedResponsiveHeight(100),
    top: 0,
  },
  headerText: {
    color: 'black',
    //fontFamily:'Adelle',
    fontSize: responsiveFontSize(3.5),
    textAlign: 'center',
    marginTop: orientedResponsiveHeight(3.5),
  },
});
