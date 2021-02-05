import React, { Component } from 'react';
import ContentWrapper from '../../components/ContentWrapper';
import LotteryDetailsNavigator from '../../components/LotteryDetailsNavigator';
import Content from '../../components/Content';
import PrizesList from '../../components/Lottery/PrizesList';
import APIService from '../../service/APIService';

export default class LotteryDetails extends Component {
    state = {
        prizes: null,
    }
    componentDidMount() {
        global.appIsLoading();
        const lottery = this.props.route.params.lottery;
        APIService('draws/' + lottery.id + '/prizes/',
        null,
        10).then((prizes) => {
            global.appIsNotLoading();
            this.setState({prizes});
        });
    }
    render() {
        return (
            <>
            <ContentWrapper title={this.props.route.params.lottery.name} details={<LotteryDetailsNavigator
                    navigation={this.props.navigation}
                    route={this.props.route}
                />}>
                {this.state.prizes && this.state.prizes.length > 0 ? 
                <Content>
                    <PrizesList prizes={this.state.prizes} />
                </Content>
                : null}
            </ContentWrapper>
            </>
        );
    }
}
