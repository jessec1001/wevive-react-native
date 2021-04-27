import React, {createRef} from 'react';
import {Text, StyleSheet, View, Pressable, Platform} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import Icon from './components/Icon';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getFocusedRouteNameFromRoute, useRoute} from '@react-navigation/native';

import {ActionSheetCustom as ActionSheet} from '@alessiocancian/react-native-actionsheet';

import {colors} from './../app.json';
import {addUnreadCountListener} from 'react-native-chat-plugin';
const actionSheetRef = createRef();
const showActionSheet = () => {
  actionSheetRef.current.show();
};

const ActionSheetElement = (props) => {
  return (
    <View style={styles.menuItem}>
      <Text style={styles.menuText}>{props.text}</Text>
      <Icon name={props.icon} style={styles.menuIcon} />
    </View>
  );
};
const iconSize = responsiveHeight(3);

export default function FooterTabs({navigate}) {
  const [unread, setUnread] = React.useState(0);
  const route = useRoute();
  React.useEffect(() => {
    setUnread(0);
    if (Platform.OS === 'ios') {
      PushNotificationIOS.setApplicationIconBadgeNumber(0);
    }
    addUnreadCountListener((value) => {
      setUnread(value);
      if (Platform.OS === 'ios') {
        PushNotificationIOS.setApplicationIconBadgeNumber(value);
      }
    });
  }, []);
  const params = route.state?.routes[route.state.index].params;
  const routeName = getFocusedRouteNameFromRoute(route);
  const createConversation = (index) => {
    switch (index) {
      case 0:
        navigate('SearchContactsScreen', {type: 'nearby'});
        break;
      case 1:
        navigate('SearchContactsScreen', {type: 'private'});
        break;
      case 2:
        navigate('SearchContactsScreen', {type: 'public'});
        break;
      case 3:
        navigate('SearchContactsScreen', {type: 'oneToOne'});
        break;
      default:
        break;
    }
  };
  let groupActions = [
    <ActionSheetElement text="Private group" icon="lock" />,
    <ActionSheetElement text="Public group" icon="lock" />,
  ];
  //groupActions = [];
  let groupsButton = (
    <View style={styles.footerItem}>
      <Pressable
        style={styles.footerButton}
        onPress={() => {
          //props.navigate('About');
          navigate('ContactsScreen', {filter: 'groups', type: null});
        }}>
        <Icon
          name="groups"
          size={iconSize}
          color={
            routeName !== 'ContactsScreen' || params?.filter !== 'groups'
              ? colors.footerIcons
              : colors.activeFooterIcon
          }
        />
        <Text
          style={
            routeName !== 'ContactsScreen' || params?.filter !== 'groups'
              ? styles.footerText
              : styles.activeFooterText
          }>
          Groups
        </Text>
      </Pressable>
    </View>
  );
  //groupsButton = null;
  return (
    <SafeAreaView edges={['bottom']} style={styles.footerBackground}>
      <ActionSheet
        ref={actionSheetRef}
        title={'Create conversation'}
        options={[
          <ActionSheetElement text="Nearby contact" icon="mapmarker" />,
          ...groupActions,
          <ActionSheetElement text="1-to-1 Chat" icon="lock" />,
          'Cancel',
        ]}
        onPress={createConversation}
      />
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Pressable
            style={styles.footerButton}
            onPress={() => {
              navigate('PhoneContactsScreen');
            }}>
            <Icon
              name="wetalk"
              size={iconSize}
              color={
                routeName !== 'PhoneContactsScreen'
                  ? colors.footerIcons
                  : colors.activeFooterIcon
              }
            />
            <Text
              style={
                routeName !== 'PhoneContactsScreen'
                  ? styles.footerText
                  : styles.activeFooterText
              }>
              Invite
            </Text>
          </Pressable>
        </View>
        <View style={styles.footerItem}>
          <Pressable
            style={styles.footerButton}
            onPress={() => {
              navigate('CallHistory');
            }}>
            <Icon
              name="calls"
              size={iconSize}
              color={
                routeName !== 'CallHistory'
                  ? colors.footerIcons
                  : colors.activeFooterIcon
              }
            />
            <Text
              style={
                routeName !== 'CallHistory'
                  ? styles.footerText
                  : styles.activeFooterText
              }>
              Calls
            </Text>
          </Pressable>
        </View>
        <View style={styles.footerItem}>
          <Pressable style={styles.footerButton} onPress={showActionSheet}>
            <Icon
              name="add-new"
              size={iconSize}
              color={
                routeName !== 'SearchContactsScreen'
                  ? colors.footerIcons
                  : colors.activeFooterIcon
              }
            />
            <Text
              style={
                routeName !== 'SearchContactsScreen'
                  ? styles.footerText
                  : styles.activeFooterText
              }>
              Add new
            </Text>
          </Pressable>
        </View>
        <View style={styles.footerItem}>
          <Pressable
            style={styles.footerButton}
            onPress={() => {
              navigate('ContactsScreen', {filter: 'chats', type: null});
            }}>
            <Icon
              name="chats"
              size={iconSize}
              color={
                routeName !== 'ContactsScreen' || params?.filter !== 'chats'
                  ? colors.footerIcons
                  : colors.activeFooterIcon
              }
            />
            <Text
              style={
                routeName !== 'ContactsScreen' || params?.filter !== 'chats'
                  ? styles.footerText
                  : styles.activeFooterText
              }>
              Chats
            </Text>
            {unread > 0 && (
              <View style={styles.unreadBox}>
                <Text style={styles.unreadText}>{unread}</Text>
              </View>
            )}
          </Pressable>
        </View>
        {groupsButton}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
  },
  unreadText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '400',
    alignSelf: 'center',
    textAlign: 'center',
  },
  unreadBox: {
    backgroundColor: 'rgb(200,30,30)',
    justifyContent: 'center',
    position: 'absolute',
    borderRadius: 30,
    width: 14,
    height: 14,
    right: 0,
    bottom: 15,
  },
  menuText: {
    marginRight: responsiveWidth(3),
    width: responsiveWidth(30),
    textAlign: 'center',
    fontWeight: '100',
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'SFProDisplay-Regular',
  },
  menuIcon: {
    fontSize: responsiveWidth(4),
    color: 'rgb(100,100,100)',
    alignSelf: 'center',
  },
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
    fontSize: responsiveFontSize(1.5),
    fontFamily: 'SFProDisplay-Regular',
    fontWeight: '400',
    marginTop: 5,
  },
  footerText: {
    color: colors.footerText,
    fontSize: responsiveFontSize(1.5),
    marginTop: 5,
    fontFamily: 'SFProDisplay-Regular',
    fontWeight: '400',
  },
  contentFooter: {
    width: '100%',
  },
});
