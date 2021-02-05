import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
} from 'react-native';

import { format, parseISO } from "date-fns";

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
import { getRemaining } from '../../utils/helpers';

//import Icon from './Icon';
import {colors} from "../../../app.json";
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
      key: {
        //fontFamily:"Adelle",
        color: colors.textMain,
        textAlign: "left",
        fontSize: responsiveFontSize(1.8),
        marginRight: responsiveWidth(1),
        alignSelf: "flex-end",
      },
      value: {
        color: colors.textMain,
        fontSize: responsiveFontSize(1.9),
        fontWeight: "600",
        alignSelf: "flex-end",
      },
      smallKey: {
        //fontFamily:"Adelle",
        color: colors.textMain,
        textAlign: "left",
        fontSize: responsiveFontSize(1.4),
        marginRight: responsiveWidth(1),
        alignSelf: "flex-end",
      },
      smallValue: {
        color: colors.textMain,
        fontSize: responsiveFontSize(1.5),
        fontWeight: "600",
        alignSelf: "flex-end",
      },
      promoterName: {
        color: colors.textMain,
        textAlign: "left",
        fontSize: responsiveFontSize(1.8),
        fontWeight: "600",
      },
      H1Box: {
        paddingLeft: responsiveWidth(0),
      },
      box: {
        flexDirection: "row",
        marginVertical: responsiveWidth(1),
      },
      smallBox: {
        flexDirection: "row",
        marginVertical: responsiveWidth(0.5),
      },
      remaining: {
        color: colors.textMain,
        textAlign: "center",
        fontSize: responsiveFontSize(1.8),
        fontWeight: "600",
        marginVertical: responsiveWidth(3),
      },
      datesBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        //marginHorizontal: responsiveWidth(1),
        marginVertical: responsiveWidth(3),
      },
      dateBox: {
        backgroundColor: colors.main,
        borderRadius: 8,
        padding: responsiveWidth(2),
        width: responsiveWidth(37),
        justifyContent: "center",
        
      },
      dateTitle: {
        color: colors.textSecondary,
        fontSize: responsiveFontSize(1.4),
        textAlign: "center",
      },
      date: {
        color: colors.textSecondary,
        fontSize: responsiveFontSize(1.35),
        fontWeight: "900",
        marginVertical: responsiveWidth(0.25),
        textAlign: "center",
      },
      time: {
        color: colors.textSecondary,
        fontSize: responsiveFontSize(1.9),
        textAlign: "center",
        fontWeight: "800",
      },
      cta: {
        color: colors.textMain,
        fontSize: responsiveFontSize(2.3),
        marginVertical: responsiveWidth(2.3),
        fontWeight: "900",
      }
    })
  };
  render() {
    const openingDate = parseISO(this.props.openingDate);
    const closingDate = parseISO(this.props.closingDate);
    const remaining = getRemaining(this.props.closingDate);
    //const remaining =  this.props.closingDate;
    return (
      <View style={this.state.styles.H1Box}>
          <View style={this.state.styles.box}>
            <Text style={this.state.styles.key}>Price:</Text>
            <Text style={this.state.styles.value}>{this.props.price}</Text>
          </View>
          <View style={this.state.styles.smallBox}>
            <Text style={this.state.styles.smallKey}>Draw number:</Text>
            <Text style={this.state.styles.smallValue}>{this.props.draw}</Text>
          </View>
          <Text style={this.state.styles.cta}>{this.props.cta}</Text>
          <View style={this.state.styles.smallBox}>
            <Text style={this.state.styles.smallKey}>Status:</Text>
            <Text style={this.state.styles.smallValue}>{this.props.status}</Text>
          </View>
          <View style={this.state.styles.smallBox}>
            <Text style={this.state.styles.smallKey}>Ticket Maximum:</Text>
            <Text style={this.state.styles.smallValue}>{this.props.maxTickets}</Text>
          </View>
          <View style={this.state.styles.datesBox}>
            <View style={this.state.styles.dateBox}>
              <Text style={this.state.styles.dateTitle}>Opening Date:</Text>
              <Text style={this.state.styles.date}>{format(openingDate,"MMMM d, yyyy")}</Text>
              <Text style={this.state.styles.time}>{format(openingDate,"HH:mm")}</Text>
            </View>
            <View style={this.state.styles.dateBox}>
              <Text style={this.state.styles.dateTitle}>Closing Date:</Text>
              <Text style={this.state.styles.date}>{format(closingDate,"MMMM d, yyyy")}</Text>
              <Text style={this.state.styles.time}>{format(closingDate,"HH:mm")}</Text>
            </View>
          </View>
    <Text style={this.state.styles.remaining}>{remaining}</Text>
          
      </View>
    );
  }
}