import React, {Component} from 'react';
import {
  Image,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  View,
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
import { UserContext } from './context/UserContext';

export default function Header(props) {
  const ctx = React.useContext(UserContext);
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
          <ClientLogo
            style={styles.mainLogoStyle}
            imageStyle={styles.mainLogoImageStyle}
          />
        </View>
        <View style={styles.right}>
          <TouchableOpacity onPress={() => props.navigate('Settings')}>
            <Image resizeMode="cover" source={{uri: ctx.avatarUrl}} style={styles.headerProfileImage} />
          </TouchableOpacity>
        </View>
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
    backgroundColor: "white",
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
    width: responsiveWidth(55),
    height: responsiveHeight(10),
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
    backgroundColor: "rgba(30,30,30,0.1)"
  }
});
