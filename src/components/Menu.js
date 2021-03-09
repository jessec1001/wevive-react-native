import React, {Component} from 'react';
import Icon from './Icon';
import {StyleSheet, Text, View, TouchableOpacity, Switch} from 'react-native';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

export const MenuDescription = (props) => {
  return (
    <View style={styles.menuTextContainer}>
      <Text style={styles.menuText}>{props.children}</Text>
    </View>
  );
};

export const MenuDivider = (props) => {
  return <View style={styles.menuDivider} />;
};

export const MenuItem = (props) => {
    const [toggle, setToggle] = React.useState(false);
  return (
    <TouchableOpacity
      style={styles.menuRow}
      onPress={props.onPress ? props.onPress : () => {}}>
      <Icon size={25} name={'w-watermark'} style={styles.menuIcon} />
      <Text style={styles.menuItem}>{props.children}</Text>
      {props.type == 'toggle' && (
        <Switch
          trackColor={{true: '#2bbb50', false: '#bababa'}}
          thumbColor="#ffffff"
          value={toggle}
          accessibilityRole="button"
          style={styles.toggleStyle}
          onValueChange={(value) => setToggle(value)}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggleStyle: {
    alignSelf: "flex-end",
    position: "absolute",
    top: responsiveWidth(3),
    right: responsiveWidth(5),
  },
  menuTextContainer: {
    paddingHorizontal: responsiveWidth(10),
    paddingVertical: responsiveWidth(2),
  },
  menuText: {
    textAlign: 'left',
    fontSize: responsiveFontSize(1.5),
  },
  menuDivider: {
    backgroundColor: 'rgb(215,215,215)',
    height: responsiveWidth(8),
  },
  menuRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(200,200,200)',
    paddingVertical: responsiveWidth(4),
    paddingHorizontal: responsiveWidth(7.5),
    backgroundColor: 'white',
  },
  menuIcon: {
    color: 'rgb(230, 142, 67)',
    marginRight: responsiveWidth(3),
  },
  menuItem: {
    alignSelf: 'center',
    fontSize: responsiveWidth(4),
  },
});
