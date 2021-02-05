import React, { Component } from 'react';

import { AppRegistry, StyleSheet, Text, View, TouchableOpacity ,Alert} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
import {colors} from '../../app.json';
export default class Button extends Component {
  state = {
    styles:StyleSheet.create({
      ButtonStyle: {
        paddingTop:responsiveHeight(1.75),
        paddingBottom:responsiveHeight(1.75),
        backgroundColor:this.props.backgroundColor || colors.secondary,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: colors.textSecondary,
        width: !this.props.width ? responsiveWidth(80) : this.props.width,
        height: undefined, //30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      },
      ButtonStyle2: {
        paddingTop:responsiveHeight(1.75),
        paddingBottom:responsiveHeight(1.75),
        backgroundColor:colors.main,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: colors.textSecondary,
        width: !this.props.width ? responsiveWidth(80) : this.props.width,
        height: undefined, //30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      },
      TextStyle:{
        color: colors.textMain,
        textAlign:'center',
        fontSize: responsiveFontSize(2.25),
        fontWeight: "600",
        //fontFamily: "Adelle",
      },
      TextStyle2: {
        color: colors.textSecondary,
        textAlign:'center',
        fontSize: responsiveFontSize(2.25),
        fontWeight: "600",
      }
    })
  }
  render() {
    return (
       <TouchableOpacity
          style={!this.props.secondary ? this.state.styles.ButtonStyle : this.state.styles.ButtonStyle2}
          activeOpacity = { .5 }
          onPress={this.props.onPress}
       >
            <Text style={!this.props.secondary ? this.state.styles.TextStyle : this.state.styles.TextStyle2}>{ this.props.title }</Text>    
      </TouchableOpacity>
    );
  }
}
