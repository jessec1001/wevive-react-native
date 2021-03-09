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
  if (!props.text) {
    return (
      <View
        style={!props.blank ? styles.menuDivider : styles.blankMenuDivider}
      />
    );
  } else {
    return (
      <View style={styles.menuDivider}>
        <Text style={styles.menuDividerText}>{props.text}</Text>
      </View>
    );
  }
};

export const MenuItem = (props) => {
  const [toggle, setToggle] = React.useState(false);

  return (
    <TouchableOpacity
      style={styles.menuRow}
      onPress={props.onPress ? props.onPress : () => {}}>
      <Icon size={25} name={'w-watermark'} style={styles.menuIcon} />
      <Text
        style={
          !props.important
            ? !props.notice
              ? styles.menuItem
              : styles.noticeMenuItem
            : styles.importantMenuItem
        }>
        {props.children}
      </Text>
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
  menuDividerText: {
    paddingHorizontal: responsiveWidth(7.5),
    fontWeight: '700',
    color: 'rgb(100,100,100)',
  },
  toggleStyle: {
    alignSelf: 'flex-end',
    position: 'absolute',
    top: responsiveWidth(3),
    right: responsiveWidth(5),
  },
  menuTextContainer: {
    paddingHorizontal: responsiveWidth(8),
    paddingVertical: responsiveWidth(2),
    backgroundColor: 'white',
  },
  menuText: {
    textAlign: 'left',
    fontSize: responsiveFontSize(1.5),
    color: 'rgb(100,100,100)',
  },
  menuDivider: {
    backgroundColor: 'rgb(215,215,215)',
    height: responsiveWidth(8),
    justifyContent: 'center',
  },
  blankMenuDivider: {
    backgroundColor: 'white',
    height: responsiveWidth(12.5),
    justifyContent: 'center',
  },
  menuRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(230,230,230)',
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
  importantMenuItem: {
    color: 'rgb(230, 142, 67)',
    alignSelf: 'center',
    fontSize: responsiveWidth(4),
  },
  noticeMenuItem: {
    color: 'rgb(75,189,163)',
    alignSelf: 'center',
    fontSize: responsiveWidth(4),
  }
});
