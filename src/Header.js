import React, {Component} from 'react';
import {Image, StatusBar, TouchableOpacity, StyleSheet, View, ImageBackground} from 'react-native';
import Icon from './components/Icon';
import ClientLogo from './components/ClientLogo';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from 'react-native-responsive-dimensions';
import { SafeAreaView } from 'react-native-safe-area-context';
import {colors} from '../app.json';

export default function Header(props) {
    return (
      <SafeAreaView edges={['top']}>
        <StatusBar backgroundColor="rgba(0,56,104,0)" translucent={true} barStyle="light-content" />
        <View style={styles.header}>
          <View style={styles.left}>
            {!props.hiddenBack ? (
              <TouchableOpacity
                transparent
                onPress={() => {
                  props.goBack();
                }}>
                  <View
                    style={{padding: 15}}
                  >
                    <Icon
                      name="arrowleft"
                      size={responsiveFontSize(3.5)}
                      color={colors.headerText}
                    />
                  </View>
              </TouchableOpacity>
            ) : null}
          </View>
          <View style={styles.mainLogoContainerStyle}>
            <ClientLogo style={styles.mainLogoStyle}
              imageStyle={styles.mainLogoImageStyle}
            />
          </View>
          <View style={styles.right}>
            <TouchableOpacity onPress={() => props.toggleDrawer("profile")}>
              <Icon
                name="profileicon"
                size={responsiveFontSize(4)}
                color={colors.headerText}
              />
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
    flexDirection: "row",
    justifyContent: "space-between",
  },
  left: {
    flex:1,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: responsiveWidth(5),
  },
  right: {
    flex: 1,
    justifyContent: "center",
    alignItems:"flex-end",
    paddingHorizontal: responsiveWidth(5),
  },
  mainLogoStyle: {
    borderRadius: 7,
    width: responsiveWidth(40),
    height: responsiveHeight(7.5),
  },
  mainLogoContainerStyle: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.secondaryBackground,
    borderRadius: 7,
    marginBottom: responsiveWidth(1),
    padding: responsiveWidth(3),
  },
  mainLogoImageStyle: {
    resizeMode: "contain",
  },
})
