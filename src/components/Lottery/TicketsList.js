import { parseISO } from 'date-fns';
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
import TicketsListItem from './TicketsListItem';

//import Icon from './Icon';
import {colors} from '../../../app.json';
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
    })
  };
  renderTickets(tickets) {
    return tickets ? tickets.map((ticket, i)=>{
      return <TicketsListItem
            key={ticket.id}
            position={i + 1}
            ticket={ticket.number}
            date={parseISO(ticket.purchased_at)}
          />
    }) : null;
  }
  render() {
    return (
      <View style={this.state.styles.H1Box}>
          {this.renderTickets(this.props.tickets)}
      </View>
    );
  }
}