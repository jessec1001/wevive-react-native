import React, {Component} from 'react';
import {Share, ScrollView, Platform, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {MenuItem, MenuDivider} from '../../components/Menu';

export default class StorageSettings extends Component {
  render() {
    return (
      <ScrollView>
        <Text>Storage settings</Text>
      </ScrollView>
    );
  }
}
