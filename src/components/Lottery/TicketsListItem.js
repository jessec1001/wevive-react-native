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
import { format } from "date-fns";

//import Icon from './Icon';
import {colors} from "../../../app.json";
export default class extends Component {
  state = {
    styles: StyleSheet.create({
      date: {
        color: colors.textMain,
        textAlign: "left",
        fontSize: responsiveFontSize(1.4),
        fontWeight: "300",
      },
      description: {
        color: colors.textMain,
        textAlign: "left",
        fontSize: responsiveFontSize(1.5),
        fontWeight: "500",
      },
      amount: {
        color: colors.textMain,
        textAlign: "left",
        fontSize: responsiveFontSize(1.9),
        fontWeight: "700",
        right: 0,
      },
      position: {
        fontSize: responsiveFontSize(2.5),
        fontWeight: "300",
        marginRight: responsiveWidth(4),
        color: colors.textMain,
        top: -2,
      }, 
      ItemBox: {
        marginHorizontal: responsiveWidth(2),
        paddingBottom: 10,
        marginTop:responsiveHeight(1),
        marginBottom:responsiveHeight(1),
        borderBottomColor: colors.textMain,
        borderBottomWidth: 1,
        flexDirection: "row",
        justifyContent: "space-between",
      },
      ticket: {
        color:colors.secondary,
        fontWeight: "700",
        fontSize: responsiveFontSize(1.8),
      },
      descriptionBox: {
        flex: 1,
      },
      dateBox: {
        alignSelf: "flex-end",
        flexDirection: "column",
        justifyContent: "space-between",
      },
      date: {
        fontSize: responsiveFontSize(1.3),
        color: colors.textMain,
        marginBottom: responsiveWidth(0.5),
      },
      time: {
        fontSize: responsiveFontSize(1.3),
        color: colors.textMain,
        alignSelf: "flex-end",
      }
    })
  };
  render() {
    return (
      <View style={this.state.styles.ItemBox}>
        <View>
          <Text style={this.state.styles.position}>{this.props.position}</Text>
        </View>
        <View style={this.state.styles.descriptionBox}>
          <Text style={this.state.styles.description}>Ticket</Text>
          <Text style={this.state.styles.amount}>{this.props.ticket}</Text>
        </View>
        <View style={this.state.styles.dateBox}>
          <Text style={this.state.styles.date}>{format(this.props.date,"MMMM d, yyyy")}</Text>
          <Text style={this.state.styles.time}>{format(this.props.date,"HH:mm:SS")}</Text>
        </View>
        
      </View>
    );
  }
}