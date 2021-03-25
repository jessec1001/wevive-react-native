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
  responsiveWidth(val) {
    if (responsiveHeight(100) > responsiveWidth(100)) {
      return responsiveWidth(val);
    } else {
      return responsiveHeight(val);
    }
  }
  responsiveHeight(val) {
    if (responsiveHeight(100) > responsiveWidth(100)) {
      return responsiveHeight(val);
    } else {
      return responsiveWidth(val);
    }
  }
  state = {
    isReady: false,
    styles: StyleSheet.create({
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
        width: this.responsiveWidth(100),
        height: '100%',
      },
      bgStyle: {
        opacity: 0.4,
      },
      logo: {
        width: 417/83 * responsiveWidth(15),
        height: responsiveWidth(15),
        top: -80,
      },
      logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        top: -this.responsiveHeight(15),
      },
      backgroundPart1: {
        backgroundColor: 'rgb(0,0,0)',
        position: 'absolute',
        width: '100%',
        height: this.responsiveHeight(100),
        top: 0,
      },
      headerText: {
        color: 'black',
        //fontFamily:'Adelle',
        fontSize: responsiveFontSize(3.5),
        textAlign: 'center',
        marginTop: this.responsiveHeight(3.5),
      },
    }),
  };
  async componentDidMount() {
    var $this = this;
    if (Platform.OS === 'android') {
      changeNavigationBarColor('#082136', false, false);
    }
    setTimeout(function () {
      $this._bootstrapAsync($this);
    }, 1500);
  }

  _bootstrapAsync = async ($this) => {
    //AsyncStorage.removeItem('userToken');
    const userToken = await AsyncStorage.getItem('userToken');
    $this.setState({isReady: true});
    $this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  render() {
    return (
      <ImageBackground
        resizeMode="cover"
        imageStyle={this.state.styles.bgStyle}
        source={background}
        style={this.state.styles.bg}>
        <View style={this.state.styles.container}>
          <View style={this.state.styles.logoContainer}>
            <Image style={this.state.styles.logo} source={logo} />
            <ActivityIndicator color={this.state.styles.spinnerStyle.color} />
          </View>
        </View>
      </ImageBackground>
    );
  }
}
