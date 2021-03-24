import React, {useContext} from 'react';
import {TouchableHighlight, Text, StyleSheet, View, Image} from 'react-native';
import PropTypes from 'prop-types';
import ProfilePreview from '../../node_modules/react-native-chat-plugin/Components/ProfilePreview';
import Colors from '../../node_modules/react-native-chat-plugin/constants/Colors';
import Fonts from '../../node_modules/react-native-chat-plugin/constants/Fonts';
import {ConversationPropType} from '../../node_modules/react-native-chat-plugin/PropTypes';
import {ChatContext} from '../../node_modules/react-native-chat-plugin/ChatContext';
import LinearGradient from 'react-native-linear-gradient';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import TypingIndicator from 'react-native-chat-plugin/ChatScreen/TypingIndicator';
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    flexDirection: 'row',
    padding: 20,
  },
  previewContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontFamily: Fonts.Light,
    marginTop: 0,
  },
  date: {
    fontSize: 10,
    position: 'absolute',
    fontFamily: Fonts.Light,
    right: 10,
    top: 2,
  },
  preview: {
    fontSize: 14,
    marginTop: 7,
    color: '#333',
    marginRight: 80,
    fontFamily: Fonts.Light,
  },
  unreadCount: {
    marginLeft: 'auto',
    alignSelf: 'center',
    width: 30,
    height: 30,
    borderRadius: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignItems: 'center',
    color: Colors.TEXT,
    backgroundColor: '#E2E2E2',
    flexDirection: 'row',
    top: 5,
    right: 5,
  },
  unreadCountText: {
    width: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: Colors.TEXT,
  },
  encryptedIcon: {},
  mutedIcon: {
    width: 20,
  },
  conversationName: {
    flexDirection: 'row',
  },
  conversationIcon: {
    top: 7,
    marginLeft: 5,
    fontSize: responsiveFontSize(1.3),
    color: 'rgb(150,150,150)',
  },
});
function getPreviewDate(conversation) {
  let event = conversation.lastEvent;
  const time = typeof event?.time === 'string' ? event.time : conversation.time;
  return (
    <Text style={styles.date}>
      {new Date(time).toLocaleDateString()}{' '}
      {new Date(time).toLocaleTimeString()}
    </Text>
  );
}
function getPreview(conversation) {
  let event = conversation.lastEvent;
  const prefix = ''; // event?.owner?.username ? event.owner.username + ": " : "";
  const preview =
    typeof event?.text === 'string'
      ? event.text.length > 128
        ? event.text.substring(0, 128) + '..'
        : event.text
      : 'No Messages yet.';

  return `${prefix}${preview}`;
}
const lockIcon = require('../../node_modules/react-native-chat-plugin/images/lock_icon.png');
export default function ContactComponent({conversation, onPress}) {
  const unreadCount = conversation.unreadCount
    ? parseInt(conversation.unreadCount)
    : 0;
  const ctx = useContext(ChatContext);
  const user = ctx.getUser();
  let participants = conversation.participants;
  if (user && Array.isArray(participants) && participants.length > 1) {
    participants = participants.filter((p) => p.id !== user.id);
  }
  const Icon = ctx.icon;
  return (
    <TouchableHighlight
      onPress={() => onPress && onPress(conversation)}
      underlayColor="#F8E2DD">
      <LinearGradient style={styles.container} colors={['#ffffff', '#f3f3f3']}>
        <ProfilePreview text={conversation.name} contacts={participants} />

        <View>
          <View style={styles.conversationName}>
            <Text style={styles.name}>{conversation.name}</Text>
            {conversation.encrypted ? (
              <Image source={lockIcon} style={styles.conversationIcon} />
            ) : null}
            {conversation.muted && (
              <Icon name="mute-icon" style={styles.conversationIcon} />
            )}
            {conversation.pinned && (
              <Icon name="office-push-pin" style={styles.conversationIcon} />
            )}
            {conversation.archived && (
              <Icon name="archive" style={styles.conversationIcon} />
            )}
            <TypingIndicator conversation={conversation} short />
          </View>
          <Text style={styles.preview}>{getPreview(conversation)}</Text>
        </View>
        {getPreviewDate(conversation)}
        {unreadCount ? (
          <View style={styles.unreadCount}>
            <Text style={styles.unreadCountText}>{unreadCount}</Text>
          </View>
        ) : null}
      </LinearGradient>
    </TouchableHighlight>
  );
}

ContactComponent.propTypes = {
  conversation: ConversationPropType,
  onPress: PropTypes.func.isRequired,
};
