import React, {Component} from 'react';
import {Share, ScrollView, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {MenuItem, MenuDivider} from '../../components/Menu';

export default class PhoneUsernameSettings extends Component {
  render() {
    return (
      <ScrollView>
        <MenuDivider text="Profile Photo" />
        <MenuItem>User Name</MenuItem>
        <MenuDivider blank />
        <MenuDivider text="Phone Number" />
        <MenuItem>Phone Number</MenuItem>
        <MenuDivider blank />
        <MenuDivider text="About" />
        <MenuItem>At Work</MenuItem>
      </ScrollView>
    );
  }
}
