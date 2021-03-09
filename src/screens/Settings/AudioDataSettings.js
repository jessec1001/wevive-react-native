import React, {Component} from 'react';
import {Share, ScrollView, Text} from 'react-native';

import {MenuItem, MenuDivider} from '../../components/Menu';

export default class AudioDataSettings extends Component {
  render() {
    return (
      <>
        <MenuDivider text="Audio" />
        <MenuItem>Never</MenuItem>
        <MenuItem>Wi-Fi</MenuItem>
        <MenuItem>Wi-Fi & Cellular</MenuItem>
      </>
    );
  }
}
