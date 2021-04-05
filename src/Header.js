import React, {Component} from 'react';
import {
  Image,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  ImageBackground,
} from 'react-native';
import Icon from './components/Icon';
import ClientLogo from './components/ClientLogo';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../app.json';
import {UserContext} from './context/UserContext';
import { ChatContext } from 'react-native-chat-plugin/ChatContext';
const getTitlePrefix = (name, params) => {
  if (name == 'ContactsScreen' && params?.type == 'archived') {
    return 'Archived ';
  }
  if (name == 'ContactsScreen' && params?.type == 'starred') {
    return 'Starred ';
  } else {
    return '';
  }
};
const getTitle = (name, params) => {
  if (name.indexOf('PrivacySettings') !== -1) {return "Privacy Settings";}
  switch (name) {
    case 'PhoneUsernameSettings':
      return 'Photo & Username';
    case 'PhoneContactsScreen':
      return 'Contacts';
    case 'CallHistory':
      return 'Calls';
    case 'SearchContactsScreen':
      return params?.type == 'private' || params?.type == 'public'
        ? 'Create group'
        : 'Search Contacts';
    case 'SocialStatusSettings':
      return 'Status';
    case 'HelpCentre':
      return 'Help Centre';
    case 'StorageSettings':
      return 'Storage Settings';
    case 'NetworkUsage':
      return 'Network Usage';
    case 'ContactsScreen':

      return getTitlePrefix(name, params) + (params?.filter == 'groups' ? 'Group Chats' : 'Chats');
    case 'ChatScreen':
      return false;
    case 'AccountSettings':
      return 'Account';
    case 'ChangeUsername':
      return 'Username';
    case 'ChangeNumber':
      return 'Change Number';
    case 'SecuritySettings':
      return 'Settings';
    case 'DeleteAccount':
      return 'Delete Account';
    case 'DeleteChats':
      return 'Delete Chats';
    case 'PrivacySettings':
      return 'Privacy Settings';
    case 'ContactUs':
      return 'Contact Us';
    case 'ChangeNumberVerification':
      return 'Change Phone Number';
    case 'ChangeNumberConfirmation':
      return 'Verify new number';
    case 'ChangeNumberSuccess':
      return 'Phone number changed';
    default:
      break;
  }
  return name;
};

const getStyleSuffix = (name) => {
  switch (name) {
    case 'PhoneUsernameSettings':
      return 'Big';
    case 'ContactsScreen':
      return '';
    case 'ChatScreen':
      return '';
    case 'AccountSettings':
      return 'Big';
    case 'ChangeNumber':
      return 'Big';
    case 'SecuritySettings':
      return 'Big';
    case 'DeleteAccount':
      return 'Big';
    case 'DeleteChats':
      return 'Big';
    case 'PrivacySettings':
      return 'Big';
    case 'ChangeNumberVerification':
      return 'Big';
    case 'ChangeNumberConfirmation':
      return 'Big';
    case 'ContactUs':
      return 'Big';
    default:
      break;
  }
  return '';
};
const getLogo = (name) => {
  const styleSuffix = getStyleSuffix(name);
  const logoStyle = name
    ? styles[`mainLogoStyle${styleSuffix}`]
    : styles.mainLogoStyle;
  return styleSuffix !== 'Big' ? (
    <ClientLogo style={logoStyle} imageStyle={styles.mainLogoImageStyle} />
  ) : (
    <Icon style={logoStyle} name="w-watermark" />
  );
};
const getNextRoute = (name, params) => {
  switch (name) {
    case 'ChangeNumber':
      return 'ChangeNumberVerification';
    case 'ChangeNumberVerification':
      return 'ChangeNumberConfirmation';
    case 'DeleteChats':
      return 'DeleteChatsConfirmation';
    case 'ChangeUsername':
      return '';
    default:
      return '';
  }
};
const getNextParams = (name, params) => {};
const getNextOrProfile = (props, name, params, avatarUrl) => {
  const styleSuffix = getStyleSuffix(name);
  const next = [
    'ChangeNumber',
    'ChangeNumberVerification',
    'SearchContactsScreen',
  ];
  const logoStyle = name
    ? styles[`mainLogoStyle${styleSuffix}`]
    : styles.mainLogoStyle;
  return next.indexOf(name) === -1 ? (
    <TouchableOpacity onPress={() => props.navigate('Settings')}>
      <Image
        resizeMode="cover"
        source={{uri: avatarUrl}}
        style={styles.headerProfileImage}
      />
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      onPress={() => {
        const nextRoute = getNextRoute(name, params);
        if (nextRoute !== '') {
          props.navigate(nextRoute, getNextParams(name, params));
        } else {
          if (typeof nextButton == 'function') {
            // eslint-disable-next-line no-undef
            nextButton();
          }
        }
      }}>
      <Text style={styles.goNextText}>Next</Text>
    </TouchableOpacity>
  );
};
export default function Header(props) {
  const ctx = React.useContext(UserContext);
  const chatCtx = React.useContext(ChatContext);
  const users = chatCtx.getUsers();
  const name = props.route.state?.routes[props.route.state.index].name;
  const params = props.route.state?.routes[props.route.state.index].params;
  const title = name ? getTitle(name, params) : false;
  const styleSuffix = getStyleSuffix(name);
  const style = name ? styles[`headerTitle${styleSuffix}`] : styles.headerTitle;
  const logo = getLogo(name);
  const userIdx = users.findIndex(u => u.userId == ctx.authData.id);
  let avatarUrl = ctx.avatarUrl || ctx.authData.avatar;
  if (userIdx !== -1) {
    avatarUrl = users[userIdx].avatar;
  }
  const nextOrProfile = getNextOrProfile(props, name, params, avatarUrl);
  return (
    <SafeAreaView edges={['top']}>
      <StatusBar
        backgroundColor="white"
        translucent={true}
        barStyle="dark-content"
      />
      <View style={styles.header}>
        <View style={styles.left}>
          {!props.hiddenBack ? (
            <TouchableOpacity
              transparent
              onPress={() => {
                props.goBack();
              }}>
              <View style={{padding: 15}}>
                <Icon
                  name="back-arrow"
                  size={responsiveFontSize(3.5)}
                  color={colors.headerText}
                />
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.mainLogoContainerStyle}>
          {logo}
          {title && <Text style={style}>{title}</Text>}
        </View>
        <View style={styles.right}>{nextOrProfile}</View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  header: {
    height: responsiveHeight(8.5),
    marginTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: responsiveWidth(5),
  },
  right: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: responsiveWidth(5),
  },
  mainLogoStyle: {
    borderRadius: 7,
    width: responsiveWidth(40),
    height: responsiveHeight(9),
    marginTop: responsiveWidth(2),
  },
  mainLogoStyleBig: {
    borderRadius: 7,
    marginTop: responsiveWidth(1),
    alignSelf: 'center',
    fontSize: responsiveFontSize(4),
    color: 'rgb(227,140,57)',
  },
  headerTitle: {
    top: -responsiveWidth(3.3),
    fontFamily: 'SFProDisplay-Regular',
    fontSize: responsiveFontSize(1.3),
    fontWeight: '100',
  },
  mainLogoContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: colors.secondaryBackground,
    borderRadius: 7,
    marginBottom: responsiveWidth(1),
    padding: responsiveWidth(2),
  },
  mainLogoImageStyle: {
    resizeMode: 'contain',
  },
  headerProfileImage: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    borderRadius: responsiveWidth(12),
    backgroundColor: 'rgba(30,30,30,0.1)',
  },
  goNextText: {
    fontFamily: 'SFProDisplay-Regular',
    color: 'rgba(30,30,30,1)',
    fontSize: responsiveFontSize(2.3),
    marginRight: responsiveWidth(1),
    fontWeight: '100',
  },
});
