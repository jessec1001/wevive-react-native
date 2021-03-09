import React, {Component} from 'react';
import {Share, ScrollView, Platform, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {MenuItem, MenuDivider, MenuDescription} from '../../components/Menu';

export default class StorageSettings extends Component {
  render() {
    return (
      <ScrollView>
        <MenuDivider text={"Storage"} />
        <MenuItem>Manage Storage</MenuItem>
        <MenuDivider text={"Network"} />
        <MenuItem onPress={() => {
            this.props.navigation.navigate('NetworkUsage');
        }}>Network Usage</MenuItem>
        <MenuItem type={"toggle"}>Use Less Data for Calls</MenuItem>
        <MenuDivider text={"Media Auto-download"} />
        <MenuItem onPress={() => {
            this.props.navigation.navigate('PhotosDataSettings');
        }}>Photos</MenuItem>
        <MenuItem onPress={() => {
            this.props.navigation.navigate('AudioDataSettings');
        }}>Audio</MenuItem>
        <MenuItem onPress={() => {
            this.props.navigation.navigate('VideoDataSettings');
        }}>Video</MenuItem>
        <MenuItem onPress={() => {
            this.props.navigation.navigate('DocumentsDataSettings');
        }}>Documents</MenuItem>
        <MenuItem important>Reset Auto-download Settings</MenuItem>
        <MenuDescription>Voice messages are always automatically downloaded</MenuDescription>
      </ScrollView>
    );
  }
}
