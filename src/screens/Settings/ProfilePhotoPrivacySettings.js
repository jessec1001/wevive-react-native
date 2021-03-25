import React, {Component} from 'react';
import {Share, ScrollView, Text} from 'react-native';

import {MenuItem, MenuDivider} from '../../components/Menu';

export default class ProfilePhotoPrivacySettings extends Component {
  render() {
    return (
      <>
        <MenuDivider />
        <MenuItem type={"selection"} selected>Everyone</MenuItem>
        <MenuItem type={"selection"}>My contacts</MenuItem>
        <MenuItem type={"selection"}>None</MenuItem>
      </>
    );
  }
}
