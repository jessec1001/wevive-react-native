import React, { Component } from 'react';
import {
    StyleSheet,
} from 'react-native';
import ContentWrapper from '../../components/ContentWrapper';

import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize,
} from 'react-native-responsive-dimensions';
import LotteryDetailsNavigator from '../../components/LotteryDetailsNavigator';

import Content from '../../components/Content';
import Description from '../../components/Lottery/Description';
import UserBalance from '../../components/Account/UserBalance';
import trans from '../../utils/trans';

import Button from '../../components/Button';
import TicketsList from '../../components/Lottery/TicketsList';
import AsyncStorage from '@react-native-community/async-storage';
import APIService from '../../service/APIService';
export default class LotteryDetails extends Component {
    state = {
        lottery:null,
        tickets: null,
    }
    updateMe() {
        global.appIsLoading();
          APIService('draws/'+this.props.route.params.lottery.id+"/tickets/",
          null,
          1).then((tickets) => {
            global.appIsNotLoading();
            this.setState({tickets});
          });
    }
    focusListener = this.props.navigation.addListener('focus', () => {
        this.updateMe();
    });
    componentDidMount() {
        this.updateMe();
    }
    componentWillUnmount() {
        this.focusListener();
    }
    render() {
        const lottery = this.props.route.params.lottery;
        return (
            <>
            <ContentWrapper title={this.props.route.params.lottery.name} details={<LotteryDetailsNavigator
                    navigation={this.props.navigation}
                    route={this.props.route}
                />}>
                <Content>
                    {this.state.tickets ? 
                        <UserBalance text={trans("lottery.number_of_tickets",{count: this.state.tickets.length})} size={responsiveWidth(20)} style={styles.userBalance}  color="rgb(184, 68, 180)" />
                    : null }
                    <Description description={this.props.route.params.lottery.description}/>
                    <TicketsList tickets={this.state.tickets}/>
                    {lottery.status == 'live' && (!lottery.user_ticket_maximum || lottery.user_ticket_count < lottery.user_ticket_maximum) &&
                    <Button title={"Play"} onPress={() =>{
                        this.props.navigation.navigate("Purchase",{lottery:lottery});
                    }}/>}
                </Content>
            </ContentWrapper>
            </>
        );
    }
}

const styles = StyleSheet.create({
    userBalance: {
        position: "absolute",
        right: -20,
        top: -10,
        zIndex: 3,
    }
});