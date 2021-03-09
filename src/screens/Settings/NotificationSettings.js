import React, {Component} from 'react';
import {Share, ScrollView, Platform, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MenuItem, MenuDivider, MenuDescription} from '../../components/Menu';

export default class NotificationSettings extends Component {
  render() {
    return (
      <ScrollView>
        <MenuDivider text="Message Notifications" />
        <MenuItem toggle>Show Notifications</MenuItem>
        <MenuItem>Sound</MenuItem>
        <MenuDivider text="Group Notifications" />
        <MenuItem toggle>Show Notifications</MenuItem>
        <MenuItem>Sound</MenuItem>
        <MenuDivider />
        <MenuItem>In-App Notifications</MenuItem>
        <MenuDivider />
        <MenuItem toggle>Preview Notifications</MenuItem>
        <MenuDescription>Preview message text inside new message notifications.</MenuDescription>
        <MenuDivider />
        <MenuItem important>Reset Notification Settings</MenuItem>
        <MenuDescription>Reset all notifiaction settings, including custom notification settings for your chats.</MenuDescription>
      </ScrollView>
    );
  }
}
