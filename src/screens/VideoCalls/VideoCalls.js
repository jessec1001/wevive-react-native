import React, {Component} from 'react';
import {App} from '../../../react/features/app/components';
import {UserContext} from '../../context/UserContext';
import {useRoute} from '@react-navigation/native';
import {ChatContext} from 'react-native-chat-plugin/ChatContext';
import CacheStore from 'react-native-cache-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VideoCalls() {
  const {authData} = React.useContext(UserContext);
  const r = useRoute();
  const ctx = React.useContext(ChatContext);
  const displayName = ctx.getCallname(r.params.callId);
  const conversation = ctx.getConversationById(r.params.callId);
  const userId = ctx.getUserId();
  const others = conversation
    ? conversation.participants
        .map((p) => p.id)
        .filter((p) => String(p) !== String(userId))
    : [];
  const isGroupChat = () => {
    return others.length > 1 || (conversation && conversation.name);
  };
  React.useEffect(() => {
    AsyncStorage.setItem('activeCallUUID', r.params.callId);
    setTimeout(() => {
      AsyncStorage.removeItem('incomingUUID');
      CacheStore.remove('incomingUUID');
      CacheStore.remove('callUUID');
    }, 1000);
  }, [r]);
  return (
    <>
      <App
        flags={{
          room: r.params.callId,
          'ios.recording.enabled': 0,
          'pip.enabled': 0,
          resolution: 480,
          'welcomepage.enabled': 1,
          playDialingTone: !isGroupChat(),
          subject: displayName,
          callHandle: displayName,
          callUUID: r.params.callId,
          author: authData.id,
          conferenceId: r.params.callId,
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
          avatarURL: authData.avatarHosted,
        }}
      />
    </>
  );
}
