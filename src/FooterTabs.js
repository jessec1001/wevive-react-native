import React from 'react';
import {Text, StyleSheet, View, Share, Platform} from 'react-native';
import Icon from './components/Icon';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRoute, CommonActions} from '@react-navigation/native';
import {redirectToNewParams} from './utils/helpers';
const iconSize = 3;

import {colors} from './../app.json';

export default function FooterTabs(props) {
  const navigateToChat = (routeName, params = {}) => {
    props.navigation.navigate('Chat', {
      screen: routeName,
    });
  };
  const route = props.route;
  return (
    <SafeAreaView edges={['bottom']} style={styles.footerBackground}>
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => {
              navigateToChat('PhoneContactsScreen');
            }}>
            <Icon
              name="wetalk"
              size={responsiveHeight(iconSize)}
              color={colors.footerIcons}
            />
            <Text style={styles.footerText}>Contacts</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerItem}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => {
              navigateToChat('ContactsScreen',{filter:"calls"});
            }}>
            <Icon
              name="calls"
              size={responsiveHeight(iconSize)}
              color={colors.footerIcons}
            />
            <Text style={styles.footerText}>Calls</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerItem}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => {
              navigateToChat("SearchContactsScreen")
            }}>
            <Icon
              name="add-new"
              size={responsiveHeight(iconSize)}
              color={colors.footerIcons}
            />
            <Text style={styles.footerText}>Add new</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerItem}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => {
              navigateToChat('ContactsScreen',{filter:"chats"});
            }}>
            <Icon
              name="chats"
              size={responsiveHeight(iconSize)}
              color={colors.footerIcons}
            />
            <Text style={styles.footerText}>Chats</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerItem}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => {
              props.navigate('About');
              //navigateToChat('ContactsScreen',{filter:"groups"});
            }}>
            <Icon
              name="groups"
              size={responsiveHeight(iconSize)}
              color={colors.footerIcons}
            />
            <Text style={styles.footerText}>Groups</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  footerBackground: {
    backgroundColor: colors.footer,
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
  footerText: {
    color: colors.footerText,
    fontSize: responsiveFontSize(1.15),
    marginTop: 5,
  },
  contentFooter: {
    width: '100%',
  },
});
