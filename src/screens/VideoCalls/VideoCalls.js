import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ContentWrapper from '../../components/ContentWrapper';
import Content from '../../components/Content';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

import {App} from '../../../react/features/app/components';
import { UserContext } from '../../context/UserContext';

export default function VideoCalls() {
  const {authData} = React.useContext(UserContext);
  return (
    <>
      <App
        flags={{
          room: 'WeviveRoomDev',
          'ios.recording.enabled': 0,
          'pip.enabled': 0,
          resolution: 720,
          'welcomepage.enabled': 1,
        }}
        serverURL={'https://webrtc.wevive.com'}
        config={{}}
        url={{serverURL: 'https://webrtc.wevive.com', config: {}}}
        userInfo={{
          displayName: String(1),
          avatarURL: "https://cataas.com/cat"
        }}
      />
    </>
  );
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
