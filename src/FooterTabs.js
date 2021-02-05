import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import Icon from './components/Icon';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { redirectToNewParams } from './utils/helpers';
const iconSize = 2.9;

import {colors} from './../app.json';
export default function FooterTabs(props) {
    const route = props.route;
    return (
      <SafeAreaView edges={['bottom']} style={styles.footerBackground}>
        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => {
                redirectToNewParams(props.navigation, props.route, 'LotteriesList',{type: 'me', status: 'closed'});
              }}>
              <Icon name="drawicon" size={responsiveHeight(iconSize)} color={colors.footerIcons} />
              <Text style={styles.footerText}>Previous draws</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footerItem}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => {
                redirectToNewParams(props.navigation, props.route, 'LotteriesList',{f: 1, type: 'me', status: 'live'});
              }}>
              <Icon name="drawicon" size={responsiveHeight(iconSize)} color={colors.footerIcons} />
              <Text style={styles.footerText}>My draws</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footerItem}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => {
                redirectToNewParams(props.navigation, props.route, 'LotteriesList',{type: 'all', status: 'live'});
              }}>
              <Icon name="homeicon" size={responsiveHeight(iconSize)} color={colors.footerIcons} />
              <Text style={styles.footerText}>Home</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footerItem}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => {
                props.navigation.push('Account');
              }}>
              <Icon name="cart" size={responsiveHeight(iconSize)} color={colors.footerIcons} />
              <Text style={styles.footerText}>Add funds</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footerItem}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => {
                props.toggleDrawer('menu');
              }}>
              <Icon name="moreicon" size={responsiveHeight(iconSize / 3)} color={colors.footerIcons} style={{top: -6}}/>
              <Text style={styles.footerText}>Menu</Text>
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
    height: responsiveHeight(6),

    paddingTop: responsiveHeight(0.5),
    marginBottom: responsiveWidth(2),
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
