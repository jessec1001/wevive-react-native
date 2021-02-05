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
import {colors} from "../../../app.json"
import ClientName from '../ClientName';
export default class extends Component {
  state = {
    styles: StyleSheet.create({
      description: {
        //fontFamily:"Adelle",
        color: colors.textMain,
        textAlign: "left",
        fontSize: responsiveFontSize(2),
        fontWeight: "400",
        marginBottom: responsiveWidth(1),
      },
      promoterTitle: {
        //fontFamily:"Adelle",
        color: colors.textMain,
        textAlign: "left",
        fontSize: responsiveFontSize(1.8),
        fontWeight: "600",
        alignSelf: "flex-end",
      },
      promoterName: {
        color: colors.textMain,
        textAlign: "left",
        fontSize: responsiveFontSize(1.8),
        fontWeight: "600",
        alignSelf: "flex-end",
      },
      H1Box: {
        paddingLeft: responsiveWidth(0),
      },
      promoterStyle: {
          flexDirection: "row",
          marginBottom: responsiveWidth(1),
      }
    })
  };
  render() {
    return (
      <View style={this.state.styles.H1Box}>
        <Text style={this.state.styles.description}>{this.props.description}</Text>
        <View style={this.state.styles.promoterStyle}>
            <Text style={this.state.styles.promoterTitle}>Promoter: </Text>
            <ClientName style={this.state.styles.promoterName} />
        </View>
      </View>
    );
  }
}