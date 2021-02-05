import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  View,
  Text,
} from 'react-native';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
import PaymentHistoryItem from './PaymentHistoryItem';
//const size = responsiveWidth(24);
const borderWidth = 5;
const borderPadding = 7;
//const backgroundColor = this.props.color;
const borderColor = "rgb(255,255,255)";
//import Icon from './Icon';
import {colors} from "../../../app.json";
import { UserContext } from '../../context/UserContext';
export default class extends Component {
  backgroundColor = this.props.color;
  state = {
    spinValue: new Animated.Value(0),
    styles: StyleSheet.create({
      balanceBox: {
        backgroundColor: this.props.color,
        width: this.props.size,
        height: this.props.size,
        borderRadius: this.props.size/2,
        alignItems: "center",
        textAlign: "center",
        justifyContent: "center",
        transform: [{
            rotate: "10deg"
        }],
      },
      balanceTextBox: {
        width: this.props.size, 
        height: this.props.size,
        padding: this.props.size/12 + borderPadding,
        position: "absolute",
        alignItems: "center",
        textAlign: "center",
        justifyContent: "center",
      },
      innerBox: {
        backgroundColor: "transparent",
        width: this.props.size - this.props.size/20 - borderPadding,
        height: this.props.size - this.props.size/20 - borderPadding,
        borderRadius: this.props.size / 2,
        borderColor: borderColor,
        borderWidth: this.props.size/20,
        position: "absolute",
        zIndex: 3,
      },
      innerCircle1: {
        backgroundColor: "rgba(255,255,255,0.52)",
        width: this.props.size/6,
        height: this.props.size/6,
        borderRadius: this.props.size/6,
        right: this.props.size/20+borderPadding,
        top: this.props.size/20+borderPadding,
        position: "absolute",
      },
      innerCircle2: {
        backgroundColor: "rgba(255,255,255,0.52)",
        width: this.props.size/6,
        height: this.props.size/6,
        borderRadius: responsiveWidth(3),
        left: this.props.size/20+borderPadding,
        bottom: this.props.size/20+borderPadding,
        position: "absolute",
      },
      balance: {
        fontSize: this.props.text != undefined ? this.props.size/9 : this.props.size/6.5,
        fontWeight: "800",
        color: colors.textSecondary,
        textAlign: "center",
        alignSelf: "center",
        zIndex: 4,
      }
    })
  };
  spin () {
    this.state.spinValue.setValue(0)
    Animated.timing(
      this.state.spinValue,
      {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      }
    ).start(() => this.spin())
  }
  componentDidMount() {
    this.spin();
  }
  render() {
    const spin = this.state.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });
    return (
      <UserContext.Consumer>
        {({ authData }) => 
        <View style={this.props.style}>
          <Animated.View style={{...this.state.styles.balanceBox,transform:[{rotate:spin}]}}>
            <View style={this.state.styles.innerBox}></View>
            <View style={this.state.styles.innerCircle1}></View>
            <View style={this.state.styles.innerCircle2}></View>
          </Animated.View>
          <View style={this.state.styles.balanceTextBox}>
            <Text style={this.state.styles.balance}>{this.props.text != undefined ? this.props.text : "£"+authData?.balance}</Text>
          </View>
        </View>
        }
      </UserContext.Consumer>
    );
  }
}