import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ContentWrapper from '../../components/ContentWrapper';
import Content from '../../components/Content';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import ChatModule, {ChatPlugin} from 'react-native-chat-plugin';
import contentStyles from '../../styles/content';
import Icon from '../../components/Icon';
const chat_url = 'https://chat.wevive.co.uk/';
const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjEzMDEyNjYzLCJqdGkiOiJlYzM1MjljOWM5NmQ0MjMzYTE0ODAwOWQ4ZWNjN2MwMiIsInVzZXJfaWQiOiJwaGlsbGlwK2NoYXRAb3VyZW5naW5lcm9vbS5jb20ifQ.QGR-UgImYZ8Cv9zFiWqlqFRW_lB6aYiyT1BZ1qVdZ3Q";
export default class About extends Component {
  state = {
    contentStyles: contentStyles(),
    licenseKey: null,
  };
  render() {
    return (
      <ChatModule socketIoUrl={chat_url} options={{token}} icon={Icon} />
    );
  }
}

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    fontSize: responsiveFontSize(3),
    fontWeight: '900',
    marginBottom: responsiveWidth(3),
  },
  description1: {
    textAlign: 'center',
    fontSize: responsiveFontSize(2),
    fontWeight: '900',
    marginBottom: responsiveWidth(5),
  },
  description2: {
    fontSize: responsiveFontSize(1.5),
    fontWeight: '400',
    marginBottom: responsiveWidth(1),
  },
  licenseBox: {
    paddingTop: responsiveWidth(3),
    paddingHorizontal: responsiveWidth(3),
  },
  licenseElement: {
    marginBottom: responsiveWidth(5),
  },
  licenseLink: {
    fontWeight: '400',
    textDecorationLine: 'underline',
    fontSize: responsiveFontSize(1.4),
  },
  licenseName: {
    fontWeight: '900',
    fontSize: responsiveFontSize(1.7),
  },
  licenseCopyright: {
    fontWeight: '500',
    fontSize: responsiveFontSize(1.3),
  },
  licenseText: {},
});
