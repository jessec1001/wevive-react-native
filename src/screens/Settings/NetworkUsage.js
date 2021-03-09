import React, {Component} from 'react';
import {Share, ScrollView, Text} from 'react-native';

import {MenuItem, MenuDivider} from '../../components/Menu';

export default class NetworkUsage extends Component {
  render() {
    return (
      <ScrollView>
        <MenuDivider text="Messages" />
        <MenuItem>Sent</MenuItem>
        <MenuItem>Received</MenuItem>
        <MenuItem>Bytes Sent</MenuItem>
        <MenuItem>Bytes Received</MenuItem>
        <MenuDivider text="Chat Media" />
        <MenuItem>Bytes Sent</MenuItem>
        <MenuItem>Bytes Received</MenuItem>
        <MenuDivider text="Status Media" />
        <MenuItem>Bytes Sent</MenuItem>
        <MenuItem>Bytes Received</MenuItem>
        <MenuDivider text="Wevive Calls" />
        <MenuItem>Outgoing</MenuItem>
        <MenuItem>Incoming</MenuItem>
        <MenuItem>Bytes Sent</MenuItem>
        <MenuItem>Bytes Received</MenuItem>
        <MenuItem>Total Time</MenuItem>
        <MenuDivider text="Total Bytes" />
        <MenuItem>Sent</MenuItem>
        <MenuItem>Received</MenuItem>
        <MenuDivider />
        <MenuItem important>Reset Statistics</MenuItem>
      </ScrollView>
    );
  }
}
