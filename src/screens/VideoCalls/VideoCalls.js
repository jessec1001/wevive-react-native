import React, {Component} from 'react';
import {App} from '../../../react/features/app/components';
import {AppThemeContext, UserContext} from '../../context/UserContext';
import {useRoute} from '@react-navigation/native';
import {ChatContext} from 'react-native-chat-plugin/ChatContext';
import CacheStore from 'react-native-cache-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from '../../components/Icon';
export default function VideoCalls(r) {
  const themeSettings = React.useContext(AppThemeContext);
  const {authData, setThemeSettings} = React.useContext(UserContext);
  //const r = useRoute();
  const [fullscreen, setFullscreen] = React.useState(true);
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
      <View style={fullscreen ? styles.fullscreenView : styles.pipModeView}>
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
            startAudioOnly: false,
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
      </View>
      {fullscreen && (
        <TouchableOpacity
          onPress={() => {
            setThemeSettings({
              ...themeSettings,
              hiddenHeader: false,
              hiddenFooter: false,
            });
            setFullscreen(false);
          }}
          style={styles.backBtn}>
          <Icon name="arrow" style={styles.backBtnText} />
        </TouchableOpacity>
      )}
      {!fullscreen && (
        <TouchableOpacity
          onPress={() => {
            setThemeSettings({
              ...themeSettings,
              hiddenHeader: true,
              hiddenFooter: true,
            });
            setFullscreen(true);
          }}
          style={styles.backToCallBtn}>
          <Icon name="add-media" style={styles.backToCallBtnText} />
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    position: 'absolute',
    zIndex: 15,
    padding: 15,
    transform: [{rotate: '90deg'}],
  },
  backBtnText: {
    fontSize: 20,
    color: 'white',
  },
  backToCallBtnText: {
    fontSize: 30,
    color: 'black',
  },
  backToCallBtn: {
    width: responsiveWidth(30),
    height: responsiveWidth(30),
    borderRadius: responsiveWidth(30),
    overflow: 'hidden',
    backgroundColor: 'transparent',
    right: responsiveWidth(1),
    top: responsiveWidth(1),
    flex: 1,
    position: 'absolute',
  },
  pipModeView: {
    width: responsiveWidth(30),
    height: responsiveWidth(30),
    borderRadius: responsiveWidth(5),
    overflow: 'hidden',
    backgroundColor: 'transparent',
    right: responsiveWidth(1),
    top: responsiveWidth(1),
    flex: 1,
    position: 'absolute',
  },
  fullscreenView: {
    width: responsiveWidth(100),
    height: '100%',
    backgroundColor: 'transparent',
    position: "absolute",
    flex: 1,
  },
});
