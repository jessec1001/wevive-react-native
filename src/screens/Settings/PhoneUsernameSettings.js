import React, {Component, useContext} from 'react';
import {
  Share,
  ScrollView,
  Platform,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {MenuItem, MenuDivider} from '../../components/Menu';
import {UserContext} from '../../context/UserContext';
import ImagePicker from 'react-native-image-crop-picker';
import {responsiveWidth} from 'react-native-responsive-dimensions';

export default function PhoneUsernameSettings(props) {
  const {authData, avatarUrl} = useContext(UserContext);
  const [image, setImage] = React.useState({});
  const pickImage = () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      cropperCircleOverlay: true,
      avoidEmptySpaceAroundImage: true,
    }).then((image) => {
      let imageFilename =
        Platform.OS == 'android'
          ? image.path.replace(/^.*\//, '')
          : image.filename.toLowerCase();
      imageFilename = imageFilename.replace(/\.heic$/, '.jpg');
      setImage({
        avatarImage: image.path,
        avatarFile: imageFilename,
        avatarMime: image.mime,
      });
    });
  };
  return (
    <ScrollView>
      <TouchableOpacity onPress={pickImage}>
        <Image
          resizeMode="cover"
          source={{uri: image.avatarFile}}
          style={styles.profileImage}
        />
      </TouchableOpacity>
      <MenuDivider text="Profile Photo" />
      <MenuItem
        onPress={() => {
          props.navigation.navigate('ChangeUsername');
        }}>
        User Name
      </MenuItem>
      <MenuDivider blank />
      <MenuDivider text="Phone Number" />
      <MenuItem
        onPress={() => {
          props.navigation.navigate('ChangeNumber');
        }}>
        {authData.phone_number}
      </MenuItem>
      <MenuDivider blank />
      <MenuDivider text="About" />
      <MenuItem>At Work</MenuItem>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileImage: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    borderRadius: responsiveWidth(12),
    backgroundColor: 'rgba(30,30,30,0.1)',
  },
});
