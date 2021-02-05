import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import PrizesListItem from './PrizesListItem';

import {colors} from '../../../app.json';
import trans from '../../utils/trans';
export default class extends Component {
  state = {
    styles: StyleSheet.create({
      H1: {
        //fontFamily:"Adelle",
        color: colors.textMain,
        textAlign: 'left',
        fontSize: responsiveFontSize(2.5),
        fontWeight: '600',
      },
      H1Box: {
        paddingLeft: responsiveWidth(0),
        marginTop:responsiveHeight(1),
        marginBottom:responsiveHeight(1),
      },
    }),
  };
  getPrizeText(prize) {
    if (prize.type !== 'physical') {
      return trans(`lottery.${prize.monetary_value_type}_${prize.net_or_gross}`,{value:prize.value});
    } else {
      return trans('lottery.physical_prize',{value:prize.description});
    }
  }
  render() {
    const prizes = this.props.prizes?.map(prize => {
      return <PrizesListItem
            position={prize.position}
            description={prize.description}
            amount={this.getPrizeText(prize)}
            winners={prize.winners}
      />;
    });
    return prizes ?
      <View style={this.state.styles.H1Box}>
          {prizes}
      </View>
      : null;
  }
}
