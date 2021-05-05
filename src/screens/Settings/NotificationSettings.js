import React from 'react';
import {ScrollView} from 'react-native';
import {MenuItem, MenuDivider, MenuDescription} from '../../components/Menu';
import { ChatContext } from 'react-native-chat-plugin/ChatContext';

export default function NotificationSettings({navigation}) {
  const ctx = React.useContext(ChatContext);
  const MessageSound = ctx.getSetting('MessageSound') || "Chord 1";
  const GroupSound = ctx.getSetting('GroupSound') || "Chord 1";
  return (
    <ScrollView style={{backgroundColor: "white"}}>
      <MenuDivider text="Message Notifications" />
      <MenuItem type={'toggle'}>Show Notifications</MenuItem>
      <MenuItem
        type="info"
        info={MessageSound}
        onPress={() => {
          navigation.navigate('MessageSoundSettings');
        }}>
        Sound
      </MenuItem>
      <MenuDivider text="Group Notifications" />
      <MenuItem type={'toggle'}>Show Notifications</MenuItem>
      <MenuItem
      type="info"
      info={GroupSound}
        onPress={() => {
          navigation.navigate('GroupSoundSettings');
        }}>
        Sound
      </MenuItem>
      <MenuDivider />
      <MenuItem  type={'toggle'}>In-App Notifications</MenuItem>
      <MenuDivider />
      <MenuItem type={'toggle'}>Preview Notifications</MenuItem>
      <MenuDescription>
        Preview message text inside new message notifications.
      </MenuDescription>
      <MenuDivider />
      <MenuItem important>Reset Notification Settings</MenuItem>
      <MenuDescription>
        Reset all notifiaction settings, including custom notification
        settings for your chats.
      </MenuDescription>
    </ScrollView>
  );
}
