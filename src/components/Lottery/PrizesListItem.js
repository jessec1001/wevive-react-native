import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

//import Icon from './Icon';
import {colors} from '../../../app.json';

export default class extends Component {
  state = {
    styles: StyleSheet.create({
      date: {
        color: colors.textMain,
        textAlign: 'left',
        fontSize: responsiveFontSize(1.4),
        fontWeight: '300',
      },
      description: {
        color: colors.textMain,
        textAlign: 'left',
        fontSize: responsiveFontSize(1.5),
        fontWeight: '500',
      },
      amount: {
        color: colors.textMain,
        textAlign: 'left',
        fontSize: responsiveFontSize(1.9),
        fontWeight: '700',
        right: 0,
      },
      position: {
        fontSize: responsiveFontSize(2.5),
        fontWeight: '300',
        marginRight: responsiveWidth(4),
        color: colors.textMain,
        top: -2,
      },
      ItemBox: {
        marginHorizontal: responsiveWidth(2),
        paddingBottom: 10,
        marginTop:responsiveHeight(1),
        marginBottom:responsiveHeight(1),
        borderBottomColor:  colors.textMain,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      ticket: {
        color:colors.secondary,
        fontWeight: '700',
        fontSize: responsiveFontSize(1.8),
      },
      descriptionBox: {
        flex: 1,
      },
    }),
  };
  render() {
    const winner = this.props.winners ? this.props.winners[0] : null;
    return (
      <View style={this.state.styles.ItemBox}>
        <View>
          <Text style={this.state.styles.position}>{this.props.position}</Text>
        </View>
        <View style={this.state.styles.descriptionBox}>
          <Text style={this.state.styles.description}>{this.props.description}</Text>
          <Text style={this.state.styles.amount}>{this.props.amount}</Text>
        </View>
        <View>
          <Text style={this.state.styles.description}>{winner?.user.name} {winner?.user.city}</Text>
          <Text style={this.state.styles.ticket}>{winner?.number}</Text>
        </View>

      </View>
    );
  }
}
