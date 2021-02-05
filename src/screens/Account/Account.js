//Show balance
//go to AddFunds
//go to RedeemFunds
//Show payment history
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
} from 'react-native';
import ContentWrapper from '../../components/ContentWrapper';

import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Content from '../../components/Content';
import form_styles from '../../styles/forms';
import Button from '../../components/Button';
import trans from '../../utils/trans';
import H1 from '../../components/H1';
import P from '../../components/P';
import PaymentHistory from '../../components/Account/PaymentHistory';
import UserBalance from '../../components/Account/UserBalance';
import AsyncStorage from '@react-native-community/async-storage';
import APIService from '../../service/APIService';
import {colors, ecom_website} from "../../../app.json";
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { Linking } from 'react-native';
export default class Account extends Component {
    state = {
        me: null,
        styles: {
            ...form_styles(),
            userBalance: {
                position: "absolute",
                right: 15,
                top: 15,
            }
        },
    }
    focusListener = this.props.navigation.addListener('focus', () => {
        this.updateMe();
    });
    componentDidMount() {
        this.updateMe();
        global.appIsLoading();
    }
    componentWillUnmount() {
        this.focusListener();
    }
    updateMe() {
        APIService('users/me/',
        null,
        5).then((me) => {
            global.appIsNotLoading();
            this.setState({me});
        });
    }
    openURL = async (url) => {
        Linking.openURL(url).then(() => {
            this.updateMe();
        });
    }
    openURLInApp = async (url) => {
        try {
            if (await InAppBrowser.isAvailable()) {
              const result = await InAppBrowser.open(url, {
                // iOS Properties
                /*dismissButtonStyle: 'cancel',
                preferredBarTintColor: '#453AA4',
                preferredControlTintColor: 'white',
                readerMode: false,
                animated: true,
                modalPresentationStyle: 'fullScreen',
                modalTransitionStyle: 'coverVertical',
                modalEnabled: true,
                enableBarCollapsing: false,
                // Android Properties
                showTitle: true,
                toolbarColor: '#6200EE',
                secondaryToolbarColor: 'black',
                enableUrlBarHiding: true,
                enableDefaultShare: true,
                forceCloseOnRedirection: false,
                // Specify full animation resource identifier(package:anim/name)
                // or only resource name(in case of animation bundled with app).
                animations: {
                  startEnter: 'slide_in_right',
                  startExit: 'slide_out_left',
                  endEnter: 'slide_in_left',
                  endExit: 'slide_out_right'
                },*/
              }).then(() => {
                  this.updateMe();
              });
              //Alert.alert(JSON.stringify(result));
            }
            else {
              //Linking.openURL(url);
            }
          } catch (error) {
            //Alert.alert(error.message);
          }
    }
    addFunds = async () => {
        //this.props.navigation.navigate("AddFunds");
        const token = await AsyncStorage.getItem('userToken');
        this.openURL(ecom_website+'addfunds/#token=' + token);
    }
    redeemFunds = () => {
        this.props.navigation.navigate("RedeemFunds");
    }
    render() {
        return (
            <ContentWrapper title="My account">
                <Content>
                    <H1>Your Balance</H1>
                        <UserBalance size={responsiveWidth(24)} style={this.state.styles.userBalance} color={colors.alert3} />  
                        <View style={{paddingRight: responsiveWidth(30)}}>
                            <P>
                                Keep funds in your
                                account to ensure easy
                                access to purchasing
                                Raffle tickets.
                            </P>
                        </View>
                        <P>Tap the
                            ‘Add Funds’ button below
                            and follow the simple instructions to top
                            up by PayPal or Card.
                        </P>
                    
                    <View style={this.state.styles.buttonContainerStyle}>
                        <Button onPress={this.addFunds} title={trans('account.add_funds')} />
                        <Button onPress={this.redeemFunds} title={trans('account.redeem_funds')} backgroundColor={"rgba(0,0,0,0)"} />
                    </View>
                </Content>
                <Content>
                    <H1>Payment History</H1>
                    <PaymentHistory navigation={this.props.navigation}/>
                </Content>
            </ContentWrapper>
        );
    }
}
