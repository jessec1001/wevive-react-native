import React, {Component} from 'react';
import {Share, ScrollView, Text} from 'react-native';

import {MenuItem, MenuDivider} from '../../components/Menu';

export default class ProfilePhotoPrivacySettings extends Component {
  render() {
    return (
      <>
        <MenuDivider />
        <MenuItem>Everyone</MenuItem>
        <MenuItem>My contacts</MenuItem>
        <MenuItem>None</MenuItem>
      </>
    );
  }
}
