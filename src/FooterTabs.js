import React from 'react';
import {Text, StyleSheet, View, Pressable} from 'react-native';
import Icon from './components/Icon';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {SafeAreaView} from 'react-native-safe-area-context';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';


import {colors} from './../app.json';

export default function FooterTabs(props) {
  const route = props.route;
  const iconSize = responsiveHeight(3);
  const routeName = getFocusedRouteNameFromRoute(props.route);
  return (
    <SafeAreaView edges={['bottom']} style={styles.footerBackground}>
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Pressable
            style={styles.footerButton}
            onPress={() => {
              props.navigate('PhoneContactsScreen');
            }}>
            <Icon
              name="wetalk"
              size={iconSize}
              color={routeName !== 'PhoneContactsScreen' ? colors.footerIcons : colors.activeFooterIcon}
            />
            <Text style={routeName !== 'PhoneContactsScreen' ? styles.footerText : styles.activeFooterText}>Contacts</Text>
          </Pressable>
        </View>
        <View style={styles.footerItem}>
          <Pressable
            style={styles.footerButton}
            onPress={() => {
              props.navigate('ContactsScreen',{filter:"calls"});
            }}>
            <Icon
              name="calls"
              size={iconSize}
              color={routeName !== 'ContactsScreen' ? colors.footerIcons : colors.activeFooterIcon}
            />
            <Text style={routeName !== 'ContactsScreen' ? styles.footerText : styles.activeFooterText}>Calls</Text>
          </Pressable>
        </View>
        <View style={styles.footerItem}>
          <Pressable
            style={styles.footerButton}
            onPress={() => {
              props.navigate("SearchContactsScreen")
            }}>
            <Icon
              name="add-new"
              size={iconSize}
              color={routeName !== 'SearchContactsScreen' ? colors.footerIcons : colors.activeFooterIcon}
            />
            <Text style={routeName !== 'SearchContactsScreen' ? styles.footerText : styles.activeFooterText}>Add new</Text>
          </Pressable>
        </View>
        <View style={styles.footerItem}>
          <Pressable
            style={styles.footerButton}
            onPress={() => {
              props.navigate('ContactsScreen',{filter:"chats"});
            }}>
            <Icon
              name="chats"
              size={iconSize}
              color={routeName !== 'ContactsScreen' ? colors.footerIcons : colors.activeFooterIcon}
            />
            <Text style={routeName !== 'ContactsScreen' ? styles.footerText : styles.activeFooterText}>Chats</Text>
          </Pressable>
        </View>
        <View style={styles.footerItem}>
          <Pressable
            style={styles.footerButton}
            onPress={() => {
              props.navigate('About');
              //props.navigate('ContactsScreen',{filter:"groups"});
            }}>
            <Icon
              name="groups"
              size={iconSize}
              color={routeName !== 'About' ? colors.footerIcons : colors.activeFooterIcon}
            />
            <Text style={routeName !== 'About' ? styles.footerText : styles.activeFooterText}>About</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  footerBackground: {
    backgroundColor: colors.footer,
    zIndex: 999,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(3),
    alignItems: 'flex-start',
    marginVertical: 0,
    height: responsiveHeight(8),
    paddingTop: responsiveHeight(0.5),
    marginBottom: responsiveWidth(3),
  },
  footerItem: {
    alignItems: 'center',
    flexGrow: 1,
    flex: 1,
    justifyContent: 'flex-start',
  },
  footerButton: {
    alignItems: 'center',
    flexGrow: 1,
    flex: 1,

    justifyContent: 'flex-end',
  },
  activeFooterText: {
    color: colors.activeFooterIcon,
    fontSize: responsiveFontSize(1.15),
    marginTop: 5,
  },
  footerText: {
    color: colors.footerText,
    fontSize: responsiveFontSize(1.15),
    marginTop: 5,
  },
  contentFooter: {
    width: '100%',
  },
});
