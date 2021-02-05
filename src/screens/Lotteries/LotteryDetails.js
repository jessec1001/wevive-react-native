import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
} from 'react-native';
import ContentWrapper from '../../components/ContentWrapper';

import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize,
} from 'react-native-responsive-dimensions';
import LotteryDetailsNavigator from '../../components/LotteryDetailsNavigator';
import Content from '../../components/Content';
import Button from '../../components/Button';
import UserBalance from '../../components/Account/UserBalance';
import Details from '../../components/Lottery/Details';
import Description from '../../components/Lottery/Description';
import trans from '../../utils/trans';
import AsyncStorage from '@react-native-community/async-storage';
import APIService from '../../service/APIService';
import {parseISO} from 'date-fns';
import {colors} from "../../../app.json";
export default class LotteryDetails extends Component {
    state = {
        lottery: this.props.route.params.lottery,
        styles: StyleSheet.create({
            userBalance: {
                position: "absolute",
                right: -20,
                top: -10,
            }
        }),
    }
    componentDidMount() {
        //this.setState({lottery:this.props.route.params.lottery});
        /*
          global.appIsLoading();
          APIService('draws/'+this.props.route.params.lottery.id+"/",
          null,
          10).then((lottery) => {
            global.appIsNotLoading();
            if (!lottery.detail) {
                this.setState({lottery});
            } else {
                console.error(this.props.route.params.lottery.id);
            }
          });
        */
    }
    render() {
        const lottery = this.state.lottery;
        return (
            <>
            {lottery ?
            <ContentWrapper title={this.state.lottery.name} details={
                <LotteryDetailsNavigator
                    navigation={this.props.navigation}
                    route={this.props.route}
                />}>
                    <Content>
                        <UserBalance text={trans("lottery.number_of_tickets",{count: lottery.user_ticket_count})} size={responsiveWidth(22)} style={this.state.styles.userBalance}  color={colors.alert} />
                        <Description description={lottery.description}/>
                        <Details 
                            price={"£"+lottery.ticket_price}
                            draw={lottery.id}
                            cta={lottery.draw_cta || trans("lottery.default_cta")}
                            status={lottery.status}
                            maxTickets={lottery.user_ticket_maximum}
                            openingDate={lottery.start_date}
                            closingDate={lottery.end_date}
                        />
                        {lottery.status == 'live' && (!lottery.user_ticket_maximum || lottery.user_ticket_count < lottery.user_ticket_maximum) &&
                        <Button title={"Play"} onPress={() =>{
                            this.props.navigation.navigate("Purchase",{lottery:lottery});
                        }}/>}
                    </Content>
            </ContentWrapper>
            : null}
            </>       
        );
    }
}