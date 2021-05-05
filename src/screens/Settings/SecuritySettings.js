import React, {Component} from 'react';
import {ScrollView} from 'react-native';
import {MenuItem, MenuDivider, MenuDescription} from '../../components/Menu';
import {BioIDContext} from '../../utils/BioAuth';

export default class SecuritySettings extends Component {
  render() {
    return (
      <BioIDContext.Consumer>
        {({available, keysExist, signMessage, toggleBioID}) => (
          <ScrollView style={{backgroundColor: "white"}}>
            <MenuDivider />
            <MenuItem
              type={'toggle'}
              onChange={toggleBioID}>
              Enable Face ID
            </MenuItem>
            <MenuDescription>
              Require Touch ID or Face ID to unlock Wevive
            </MenuDescription>
            <MenuDivider />
            <MenuItem
              type={'toggle'}
              onPress={() => {
                this.props.navigation.navigate('Security');
              }}>
              Enable Two-step Verification
            </MenuItem>
            <MenuDescription>Require PIN to unlock Wevive</MenuDescription>
            <MenuDivider />
          </ScrollView>
        )}
      </BioIDContext.Consumer>
    );
  }
}
