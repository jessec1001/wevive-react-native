import AsyncStorage from '@react-native-community/async-storage';
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
import APIService from '../../service/APIService';
import PaymentHistoryItem from './PaymentHistoryItem';

//import Icon from './Icon';
import {colors} from "../../../app.json";
export default class extends Component {
  state = {
    styles: StyleSheet.create({
      H1: {
        //fontFamily:"Adelle",
        color: colors.textMain,
        textAlign: "left",
        fontSize: responsiveFontSize(2.5),
        fontWeight: "600",
      },
      H1Box: {
        paddingLeft: responsiveWidth(0),
        marginTop:responsiveHeight(1),
        marginBottom:responsiveHeight(1),
      }
    }),
    transactions: [],
  };
  focusListener = this.props.navigation.addListener('focus', () => {
    this.updateMe();
  });
  componentDidMount() {
    this.updateMe();
  }
  updateMe() {
      APIService('transactions/me/',
      null,
      5).then((transactions) => {
        this.setState({transactions: transactions.results});
      });
  }
  componentWillUnmount() {
    this.focusListener();
  }
  renderTransactions() {
    return this.state.transactions && this.state.transactions.map(transaction =>
      <PaymentHistoryItem 
          key={transaction.id}
          date={transaction.created_at} 
          reason={transaction.narrative}
          amount={transaction.amount > 0 ? `£${transaction.amount}` : `£${transaction.amount}`}
        />
    );
  }
  render() {
    return (
      <View style={this.state.styles.H1Box}>
          {this.renderTransactions()}
      </View>
    );
  }
}