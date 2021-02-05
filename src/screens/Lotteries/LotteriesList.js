import React, {Component} from 'react';
import ContentWrapper from '../../components/ContentWrapper';

import SearchBox from '../../components/SearchBox';

import LotteryBox from '../../components/LotteryBox';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

import APIService from '../../service/APIService';
import {serializeForURL} from '../../utils/helpers';
import trans from '../../utils/trans';
import {colors} from '../../../app.json';

import InfiniteScroll from 'react-native-infinite-scrolling';


export default class LotteriesList extends Component {
  state = {
    searchValue: '',
    searchFilter: 'new',
    lotteryList: [],
    filterOrder: 'desc',
    page: 0,
    type: this.props.type
  }
  focusListener = this.props.navigation.addListener('focus', () => {
    this.setState({page:0,lotteryList:[]},()=>{
      this.updateMe();
    });
  });
  updateSearchText(searchValue) {
    this.setState({page:0, lotteryList: [], searchValue},()=>this.updateMe());
  }
  updateSearchFilter(searchFilter,filterOrder) {
    this.setState({page:0, lotteryList: [], searchFilter, filterOrder},()=>this.updateMe());
  }
  updateMe() {
    const params = serializeForURL({
      status: this.props.route.params.status,
      search: this.state.searchValue ? this.state.searchValue : '',
      sort: this.state.searchFilter ? this.state.searchFilter : '',
      order: this.state.filterOrder ? 'desc' : 'asc',
      page: this.state.page + 1,
    });
    const type = this.props.route.params?.type;
    const endpoint = (type === 'me' ? 'draws/me/' : 'draws/public/');
    APIService(endpoint + '?' + params,
    null,
    30).then((result) => {
      global.appIsNotLoading();
      const lotteryList = this.state.lotteryList;
      if (result.results) {
        result.results.forEach((lottery)=> {
          lotteryList.push(lottery);
        });
        this.setState({lotteryList, page: this.state.page + 1});
      }
    });
  }
  componentDidMount() {
    global.appIsLoading();
    //this.updateMe();
  }
  componentWillUnmount() {
    this.focusListener();
  }
  renderLottery = ({item}) => {
    return <LotteryBox
      key={item.id}
      lottery={item}
      headline={item.price_cta || trans('lottery.price_cta',{price:item.ticket_price}) }
      title={item.name}
      cta={item.description}
      closingDate={item.end_date}
      playButton={'Play'}
      detailsButton={'Details'}
      navigation={this.props.navigation}
      tickets={item.user_ticket_count}
      ticketsColor={colors.alert2}
      logo={item.logo_url}
    />;
  }

  render() {
    const title = (this.props.route.params?.status === 'live' && this.props.route.params?.type !== 'me' ? 'all' : this.props.route.params?.status);
    return (
      <ContentWrapper title={trans('lotteries.' + this.props.route.params?.type + '.' + title)} paddingHorizontal={responsiveWidth(5)}>
        <SearchBox onValueChanged={this.updateSearchText.bind(this)} onFilterChanged={this.updateSearchFilter.bind(this)} />
        <InfiniteScroll
          renderData = {this.renderLottery.bind(this) }
          data = { this.state.lotteryList }
          loadMore = { this.updateMe.bind(this) }
        />
      </ContentWrapper>
    );
  }
}
