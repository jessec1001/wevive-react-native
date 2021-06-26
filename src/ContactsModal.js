import React, {Component} from 'react';
import {
  View,
} from 'react-native';
import PhoneContactsScreen from 'react-native-chat-plugin/PhoneContactsScreen/PhoneContactsScreen';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
export default function ContactsModal({navigation}) {
  const [show, setShow] = React.useState(false);
  global.showContacts = (onPress) => {
    setShow({
      onPress,
    });
  };
  global.hideContacts = () => {
    setShow(false);
  }
  return (
    show && (
      <View
        style={{
          position: 'absolute',
          background: 'white',
          width: responsiveWidth(100),
          height: responsiveHeight(100),
          top: 0,
          zIndex: 100,
        }}>
        <PhoneContactsScreen
          navigation={navigation}
          onPress={show ? show.onPress : () => {}}
          name="Share contacts"
        />
      </View>
    )
  );
}
