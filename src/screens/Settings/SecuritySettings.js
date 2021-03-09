import React, {Component} from 'react';
import {ScrollView} from 'react-native';
import {MenuItem, MenuDivider} from '../../components/Menu';

export default class SecuritySettings extends Component {
  render() {
    return (
      <ScrollView>
        <MenuDivider />
        <MenuItem
          onPress={() => {
            this.props.navigation.navigate('E');
          }}>
          Enable Face ID
        </MenuItem>
        <MenuItem
          onPress={() => {
            this.props.navigation.navigate('Security');
          }}>
          Enable Two-step Verification
        </MenuItem>
      </ScrollView>
    );
  }
}
