import React, {Component} from 'react';
import {Share, ScrollView, Text} from 'react-native';

import {MenuItem, MenuDivider} from '../../components/Menu';

export default class SocialStatusSettings extends Component {
  render() {
    return (
      <>
        <MenuDivider />
        <MenuItem type={"selection"}>Active</MenuItem>
        <MenuItem type={"selection"} selected>At home</MenuItem>
        <MenuItem type={"selection"}>Do not disturb</MenuItem>
        <MenuItem type={"selection"}>None</MenuItem>
      </>
    );
  }
}
