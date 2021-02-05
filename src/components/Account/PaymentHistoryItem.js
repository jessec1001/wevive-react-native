import { format, parseISO } from 'date-fns';
import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
} from 'react-native';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";

//import Icon from './Icon';
import {colors} from '../../../app.json';
export default class extends Component {
  state = {
    styles: StyleSheet.create({
      date: {
        color: colors.textMain,
        textAlign: "left",
        fontSize: responsiveFontSize(1.4),
        fontWeight: "300",
      },
      reason: {
        color: colors.textMain,
        textAlign: "left",
        fontSize: responsiveFontSize(1.6),
        fontWeight: "500",
      },
      amount: {
        color: colors.textMain,
        textAlign: "left",
        fontSize: responsiveFontSize(1.6),
        fontWeight: "700",
        position: "absolute",
        right: 0,
      },
      ItemBox: {
        marginHorizontal: responsiveWidth(2),
        paddingBottom: 10,
        marginTop:responsiveHeight(1),
        marginBottom:responsiveHeight(1),
        borderBottomColor:  colors.textMain,
        borderBottomWidth: 1,
      }
    })
  };
  render() {
    const date = format(parseISO(this.props.date),"MMMM dd yyyy HH:mm");
    return (
      <View style={this.state.styles.ItemBox}>
        <Text style={this.state.styles.date}>{date}</Text>
        <Text style={this.state.styles.reason}>{this.props.reason}</Text>
        <Text style={this.state.styles.amount}>{this.props.amount}</Text>
      </View>
    );
  }
}