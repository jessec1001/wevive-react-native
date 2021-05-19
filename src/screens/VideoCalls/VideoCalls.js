import React, {Component} from 'react';
import {App} from '../../../react/features/app/components';
import { UserContext } from '../../context/UserContext';
import { useRoute } from '@react-navigation/native';
import { ChatContext } from 'react-native-chat-plugin/ChatContext';
export default function VideoCalls() {
  const {authData, avatarUrl} = React.useContext(UserContext);
  const r = useRoute();
  const ctx = React.useContext(ChatContext);
  const displayName = ctx.getCallname(r.params.callId);
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
