import React, {Component} from 'react';
import {Share, ScrollView, Platform, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class NotificationSettings extends Component {
  render() {
    return (
      <ScrollView>
        <Text>Notifications settings</Text>
      </ScrollView>
    );
  }
}
