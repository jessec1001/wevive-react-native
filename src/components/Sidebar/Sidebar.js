import React, {useState, useContext} from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

import SidebarContent from './SidebarContent';
const socialIconSize = 5.5;
import Icon from '../Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {getAppVersion} from './../CodePushVersion';
import {colors} from './../../../app.json';
import {UserContext} from '../../context/UserContext';
import ClientName from '../ClientName';

export default function Sidebar(props) {
  const [version, setVersion] = useState('unk');
  const {authData} = useContext(UserContext);
  getAppVersion().then((version) => {
    setVersion(version);
  });
  return (
    <ScrollView
      style={styles.sidebar}
      padder={false}
      contentContainerStyle={styles.sidebarContainer}>
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: responsiveWidth(3.5),
          borderBottomWidth: 1,
          borderBottomColor: colors.contentBorder,
        }}>
        <View style={{}}>
          <Icon
            name="close"
            style={styles.closeButton}
            onPress={() => props.closeDrawer()}
          />
        </View>
        {props.drawerType == 'profile' ? (
          <View
            style={{
              justifyContent: 'center',
              marginLeft: responsiveWidth(6.5),
            }}>
            <Text style={styles.personText}>{authData?.name}</Text>
          </View>
        ) : null}
      </View>
      <SidebarContent
        closeDrawer={props.closeDrawer}
        navigation={props.navigation}
        route={props.route}
        sidebarLinks={props.sidebarLinks}
        drawerType={props.drawerType}
      />
      <Text style={styles.versionText}>{version}</Text>
      {props.drawerType == 'profile' ? (
        <TouchableOpacity
          style={styles.logout}
          onPress={() => {
            //FIXME: logout
            AsyncStorage.removeItem('userToken');
            //AsyncStorage.removeItem('email');
            AsyncStorage.removeItem('password_sha512');
            props.closeDrawer();
            props.navigation.navigate('Auth', {
              screen: 'SignIn',
              params: {
                BioID: false,
              },
            });
          }}>
          <Text style={styles.logoutText}>LOGOUT</Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
}

module.exports = Sidebar;

const styles = StyleSheet.create({
  sidebar: {
    backgroundColor: colors.sidebarBackground,
    position: 'relative',
    //borderTopLeftRadius: 40,
    marginTop: 0,
    marginBottom: responsiveHeight(15),
    borderBottomLeftRadius: 40,
    alignSelf: 'flex-end',
  },
  sidebarContainer: {
    flexGrow: 1,
  },
  closeButton: {
    color: "white",
    fontSize: responsiveFontSize(3),
    marginVertical: responsiveWidth(4),
  },
  sidebarLogo: {
    position: 'absolute',
    bottom: responsiveWidth(10) + 10,
    right: responsiveWidth(10) - 15,
    opacity: 0.15,
  },
  socialIcons: {
    flexDirection: 'row',
    //height:100,
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    right: responsiveWidth(4.5),
  },
  socialIconWrapper: {
    backgroundColor: colors.secondary,
    borderRadius: responsiveFontSize(5),
    height: responsiveFontSize(socialIconSize),
    width: responsiveFontSize(socialIconSize),
    marginRight: 10,
  },
  touchedSocialIconWrapper: {
    backgroundColor: colors.textSecondary,
    borderRadius: responsiveFontSize(5),
    height: responsiveFontSize(socialIconSize),
    width: responsiveFontSize(socialIconSize),
    marginRight: 10,
  },
  socialIcon: {
    fontSize: responsiveFontSize(socialIconSize),
    color: colors.textSecondary,
    //borderRadius:responsiveFontSize(3),
    height: responsiveFontSize(socialIconSize),
  },
  logout: {
    position: 'absolute',
    bottom: 30,
    left: 30,
  },
  personText: {
    color: colors.sidebarText,
    fontSize: responsiveFontSize(1.9),
    fontWeight: '200',
  },
  logoutText: {
    color: colors.sidebarText,
    fontSize: responsiveFontSize(2),
  },
  versionText: {
    position: 'absolute',
    bottom: 4,
    right: responsiveWidth(20),
    opacity: 1,
    color: colors.versionText,
  },
});
