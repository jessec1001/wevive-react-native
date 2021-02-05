import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
import  Content  from './Content';
import form_styles from '../styles/forms';
import Button from './Button';
import UserBalance from './Account/UserBalance';
import trans from '../utils/trans';
import { getRemaining } from '../utils/helpers';
import {colors} from "../../app.json";
import ClientLogo from './ClientLogo';
export default class extends Component {
  state = {
    keyword: "",
    styles: {...form_styles(), ...StyleSheet.create({
      container: {
        backgroundColor: 'transparent',
        flexDirection: "row",
        width: "100%",
        flex: 1,
      },
      buttonContainerStyle: {
        flexDirection: "row",
        justifyContent: "space-around"
      },
      headline: {
        color: colors.textMain,
        fontSize: responsiveFontSize(4),
        fontWeight: "800",
        alignSelf: "center",
        textTransform: "uppercase",
        paddingRight: responsiveWidth(2),
        marginTop: responsiveWidth(8.4),
        marginBottom: responsiveWidth(3),
        width: responsiveWidth(50),
        marginLeft: responsiveWidth(4),
        textAlign: "center", 
        lineHeight: responsiveFontSize(4),
      },
      title: {
        fontSize: responsiveFontSize(2),
        fontWeight: "500",
        textAlign: "center",
        marginBottom: responsiveWidth(2),
        color: colors.secondary,
      },
      cta: {
        color: colors.textMain,
        fontSize: responsiveFontSize(3.5),
        fontWeight: "800",
        textTransform: "uppercase",

        textAlign: "center",
        marginBottom: responsiveWidth(2),
      },
      remaining: {
        color: colors.textMain,
        fontSize: responsiveFontSize(1.5),
        fontWeight: "500",
        textAlign: "center",
        marginBottom: responsiveWidth(2.5),
      },
      logoStyle: {
        backgroundColor: colors.secondaryBackground,
        borderRadius: 7,
        width: responsiveWidth(20),
        height: responsiveWidth(20),
      },
      logoContainerStyle: {
        backgroundColor: colors.secondaryBackground,
        borderRadius: 7,
        padding: responsiveWidth(2),
        marginBottom: responsiveWidth(1),
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
        justifyContent: "center",
      },
      logoImageStyle: {
        resizeMode: "contain",
        
      },
      titleContainer: {
        flexDirection: "row",
        marginBottom: responsiveWidth(1),
      },
      userBalance: {
        position: "absolute",
        right: -1,
        top: -1,
      }
    })}
  };
  componentDidMount() {
    global.toggleContentScroll = () => {
      this.setState({scrollEnabled: !this.state.scrollEnabled});
    };
  }
  handleChange(value) {
    this.setState({keyword:value});
  }
  setFieldBlur() {
  }
  setFieldFocus() {
  }
  render() {
    const remaining = getRemaining(this.props.closingDate);
    return (
      <View style={this.state.styles.container}>
        <Content noMargin={true}>
          <View style={this.state.styles.titleContainer}>
            <View style={this.state.styles.logoContainerStyle}>
              <ClientLogo style={this.state.styles.logoStyle}
                imageStyle={this.state.styles.logoImageStyle}
                source={{uri: this.props.logo}}
              />
            </View>
            <Text style={this.state.styles.headline}>{this.props.headline}</Text>
          </View>
          <Text style={this.state.styles.title}>{this.props.title}</Text>
          <Text style={this.state.styles.cta}>{this.props.cta}</Text>
          <Text style={this.state.styles.remaining}>{remaining}</Text>
          <View style={this.state.styles.buttonContainerStyle}>
            {this.props.lottery.status === 'live' && 
              <Button title={this.props.playButton} width={responsiveWidth(40)} onPress={() =>{
                this.props.navigation.navigate("LotteryTickets",{lottery:this.props.lottery});
              }} />
            }
            <Button title={this.props.detailsButton} width={responsiveWidth(40)} secondary={true} onPress={() =>{
              this.props.navigation.navigate("LotteryDetails",{lottery:this.props.lottery});
            }}  />
          </View>
        </Content>
        {this.props.tickets ? 
          <UserBalance size={responsiveWidth(17)} style={this.state.styles.userBalance}  text={trans("lottery.number_of_tickets",{count: this.props.tickets})} color={this.props.ticketsColor ? this.props.ticketsColor: colors.alert} />
        : null }
      </View>
    );
  }
}