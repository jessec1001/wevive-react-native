import React, {Component} from 'react';
import {ScrollView} from 'react-native';
import {MenuItem, MenuDivider, MenuDescription} from '../../components/Menu';

export default class PrivacySettings extends Component {
  render() {
    return (
      <ScrollView>
        <MenuDivider />
        <MenuItem
          onPress={() => {
            this.props.navigation.navigate('LastSeenPrivacySettings');
          }}>
          Last Seen
        </MenuItem>
        <MenuItem
          onPress={() => {
            this.props.navigation.navigate('TypingPrivacySettings');
          }}>Typing</MenuItem>
        <MenuItem
          onPress={() => {
            this.props.navigation.navigate('ProfilePhotoPrivacySettings');
          }}>Profile Photo</MenuItem>
        <MenuItem
          onPress={() => {
            this.props.navigation.navigate('AboutPrivacySettings');
          }}>About</MenuItem>
        <MenuItem
          onPress={() => {
            this.props.navigation.navigate('GroupsPrivacySettings');
          }}>Groups (who can add me)</MenuItem>
        <MenuItem
          onPress={() => {
            this.props.navigation.navigate('ChatPrivacySettings');
          }}>Chats (who can add me)</MenuItem>
        <MenuItem
          onPress={() => {
            this.props.navigation.navigate('BlockedPrivacySettings');
          }}>Blocked</MenuItem>
        <MenuDivider />
        <MenuItem onPress={() => {}} type={'toggle'}>
          Read Receipts
        </MenuItem>
        <MenuDescription>
          If you turn off read receipts, you won’t be able to see read receipts
          from other people. Read receipts are always sent for group chats.
        </MenuDescription>
      </ScrollView>
    );
  }
}
