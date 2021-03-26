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
import { useRoute } from '@react-navigation/native';
import { ChatContext } from 'react-native-chat-plugin/ChatContext';
import uuid from 'react-native-uuid'
export default function VideoCalls() {
  const {authData} = React.useContext(UserContext);
  const r = useRoute();
  const ctx = React.useContext(ChatContext);
  const displayName = ctx.getCallname(r.params.callId);
  const callUUID = uuid.v4();
  //return <></>;
  return (
    <>
      <App
        flags={{
          room: r.params.callId,
          'ios.recording.enabled': 0,
          'pip.enabled': 0,
          resolution: 360,
          'welcomepage.enabled': 1,
          subject: displayName,
          callHandle: displayName, 
          callUUID: callUUID,
        }}
        serverURL={'https://webrtc.wevive.com'}
        settings={{
          startAudioOnly: !r.params.video,
          startWithVideoMuted: !r.params.video,
          serverURL: 'https://webrtc.wevive.com',
          disableCallIntegration: false,
        }}
        url={{serverURL: 'https://webrtc.wevive.com', config: {}}}
        userInfo={{
          displayName: String(authData.id),
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
