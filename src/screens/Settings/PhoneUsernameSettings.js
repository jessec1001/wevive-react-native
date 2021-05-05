import React, {Component, useContext} from 'react';
import {View} from 'react-native';
import {
  Share,
  ScrollView,
  Platform,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {MenuItem, MenuDivider} from '../../components/Menu';
import {UserContext} from '../../context/UserContext';
import ImagePicker from 'react-native-image-crop-picker';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import APIService from '../../service/APIService';
import { ChatContext } from 'react-native-chat-plugin/ChatContext';

export default function PhoneUsernameSettings(props) {
  const {authData, avatarUrl, updateMe} = useContext(UserContext);
  const chatCtx = useContext(ChatContext);
  const users = chatCtx.getUsers();
  const userIdx = users.findIndex(u => u.id == authData.id);
  let avatarUrlToUse = avatarUrl || authData.avatar;
  if (userIdx !== -1) {
    avatarUrlToUse = users[userIdx].avatar;
  }

  const [name, setName] = React.useState('');
  const [changedImage, setChangedImage] = React.useState(false);
  const [image, setImage] = React.useState({
    avatarImage: avatarUrlToUse,
    default: true,
  });
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
      setChangedImage(true);
      setImage({
        avatarImage: image.path,
        avatarFile: imageFilename,
        avatarMime: image.mime,
        default: false,
      });
    });
  };

  const saveImage = () => {
    APIService('users/me/', {
      name,
    }).then((aa) => {
      if (changedImage) {
        APIService('user-photo/update_photo/', {
          photo: image.avatarImage,
          filename: image.avatarFile,
          mime: image.avatarMime,
          name: '',
        }).then((result) => {
          global.appIsNotLoading();
          if (result) {
            AsyncStorage.setItem('avatarUrl', result);
            updateMe();
            setImage({
              ...image,
              default: true,
            });
            //AsyncStorage.setItem('userName', values.name);
          }
        });
      } else {
        global.appIsNotLoading();
        updateMe();
        setImage({
          ...image,
          default: true,
        });
      }
    });
  };

  const onUsernameChange = (name) => {
    setName(name);
    setImage({
      ...image,
      default: false,
    });
  };
  return (
    <ScrollView style={{backgroundColor: "white"}}>
      <View style={styles.avatarBox}>
        <TouchableOpacity
          onPress={image.default ? pickImage : saveImage}
          style={styles.avatarContainer}>
          <Image
            resizeMode="cover"
            source={{uri: image.avatarImage}}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={image.default ? pickImage : saveImage}
          style={styles.avatarContainer}>
          <Text style={styles.editText}>{image.default ? 'Edit' : 'Save'}</Text>
        </TouchableOpacity>
        <Text style={styles.editDescription}>
          {image.default
            ? 'Enter your name and add an optional profile Photo.'
            : ''}
        </Text>
      </View>
      <MenuDivider text="Profile Name" />
      <MenuItem
        type={'textinput'}
        onChange={onUsernameChange}
        onChangeText={onUsernameChange}
        placeholder={authData.name}>
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
      <MenuItem
        type={'info'}
        info={authData.status || 'None'}
        onPress={() => {
          props.navigation.navigate('SocialStatusSettings');
        }}>
        Status
      </MenuItem>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileImage: {
    width: responsiveWidth(25),
    height: responsiveWidth(25),
    borderRadius: responsiveWidth(12),
    marginLeft: responsiveWidth(5),
    marginVertical: responsiveWidth(1),
    backgroundColor: 'rgba(30,30,30,0.1)',
  },
  editDescription: {
    fontSize: responsiveFontSize(2.15),
    paddingHorizontal: responsiveWidth(5),
    flex: 1,
    alignSelf: 'center',
    color: 'rgb(100,100,100)',
    fontWeight: '300',
  },
  avatarBox: {
    flexDirection: 'row',
  },
  avatarContainer: {
    alignSelf: 'center',
  },
  editText: {
    fontSize: responsiveFontSize(3),
    fontWeight: '200',
    alignSelf: 'center',
    marginLeft: responsiveWidth(3),
  },
});
