import React, {Component} from 'react';
import {Share, ScrollView, Text} from 'react-native';

import {MenuItem, MenuDivider} from '../../components/Menu';

export default class PhotosDataSettings extends Component {
  render() {
    return (
      <>
        <MenuDivider text="Photos" />
        <MenuItem>Never</MenuItem>
        <MenuItem>Wi-Fi</MenuItem>
        <MenuItem>Wi-Fi & Cellular</MenuItem>
      </>
    );
  }
}
