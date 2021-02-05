import React, {Fragment, Component, useContext} from 'react';
import {
  Image,
  ImageBackground,
  Alert,
  Text,
  TextInput,
  Platform,
  View,
  TouchableOpacity,
} from 'react-native';
import OAuth from '../../utils/OAuth';
import * as yup from 'yup';
import {Formik} from 'formik';
import Button from '../../components/Button';
import authStyles from '../../styles/auth';

import APIService from '../../service/APIService';
import AuthView from '../../views/AuthView';
import AsyncStorage from '@react-native-community/async-storage';
import CryptoJS from 'crypto-js';

import appleAuth, {
  AppleButton,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleAuthCredentialState,
} from '@invertase/react-native-apple-authentication';
import {Buffer} from 'buffer';
import {
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';

import {BioIDContext} from '../../utils/BioAuth';

import {CommonActions} from '@react-navigation/native';

import FormInput from '../../components/FormInput';
import trans from '../../utils/trans';
import getFlag from '../../../countryflags';
import allCountries from '../../../countries.json';
import phoneCodes from '../../../phones.json';
const sortedCountries = {};
Object.keys(allCountries)
  .sort((a, b) => {
    return allCountries[a].localeCompare(allCountries[b]);
  })
  .map((s) => {
    sortedCountries[s] = allCountries[s];
  });
//console.error(countries);
const googleLogin = false;
const appleLogin = false;
import {AuthContext} from '../../context/AuthContext';
const countryPhoneCode = (country) => {
  if (!country || !phoneCodes[country]) {
    return;
  }
  if (Array.isArray(phoneCodes[country])) {
    return <Text style={styles.countryCode}>+{phoneCodes[country][0]}</Text>;
  } else {
    return <Text style={styles.countryCode}>+{phoneCodes[country]}</Text>;
  }
};
export default class SignIn extends Component {
  state = {
    email: null,
    bioAccessToken: null,
    avatarImage: null,
  };
  navigateSuccess = () => {
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'VerificationScreen'}],
      }),
    );
  };
  componentDidMount() {
    AsyncStorage.getItem('email').then((email) => {
      this.setState({email});
    });
    AsyncStorage.getItem('bioAccessToken').then((bioAccessToken) => {
      this.setState({bioAccessToken});
    });
  }
  bioLoginFunction = async (result) => {
    if (result.success) {
      const email = await AsyncStorage.getItem('email');
      const timestamp = result.success.payload.split(':')[0];

      const access_token = await AsyncStorage.getItem('bioAccessToken');
      const refresh_token = await AsyncStorage.getItem('bioRefreshToken');

      await AsyncStorage.setItem('userToken', access_token);
      await AsyncStorage.setItem('refreshToken', refresh_token);
      this.navigateSuccess();
      /*
        APIService('users/biometricLogin',{email, timestamp}).then(result => {
          if (!result.access_token) {
            Alert.alert('Error','Biometric login failed');
          } else {
            AsyncStorage.setItem('userToken', result.access_token);
            AsyncStorage.setItem('refreshToken', result.refresh_token);
            this.navigateSuccess();
          }
        });
        */
    } else if (!result.hideError) {
      Alert.alert('Error', 'No biometric data found');
    }
  };
  onAppleButtonPress = async function () {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGIN,
      requestedScopes: [
        AppleAuthRequestScope.EMAIL,
        AppleAuthRequestScope.FULL_NAME,
      ],
    });
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );
    if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
      const jwtBody = appleAuthRequestResponse.identityToken.split('.')[1];
      const base64 = jwtBody.replace('-', '+').replace('_', '/');
      const decodedJwt = Buffer.from(base64, 'base64');
      const decodedJSON = JSON.parse(decodedJwt);
      const emailSHA512 = await CryptoJS.SHA512(decodedJSON.email).toString(
        CryptoJS.enc.Hex,
      );
      AsyncStorage.setItem('userToken', '1');
      AsyncStorage.setItem('email', decodedJSON.email);
      AsyncStorage.setItem('password_sha512', emailSHA512);
      this.navigateSuccess();
    }
  };
  render() {
    const {navigate} = this.props.navigation;
    return (
      <BioIDContext.Consumer>
        {({available, keysExist, signMessage, toggleBioID}) => (
          <AuthView
            headline={"Register"}
            route={this.props.route}
            bioLoginFunction={this.bioLoginFunction.bind(this)}
            signMessage={available ? signMessage : false}
            navigation={this.props.navigation}>
            {this.props.route.params?.message ? (
              <Text style={styles.headlineStyle}>
                {this.props.route.params.message}
              </Text>
            ) : null}
            <Formik
              initialValues={{
                email: this.props.route.params?.email,
                password: '',
              }}
              onSubmit={(values, actions) => {
                global.appIsLoading();
                APIService('users/sign_in/', {
                  email: values.email,
                  password: values.password,
                  remember_me: 1,
                  is_staff: false,
                }).then((result) => {
                  global.appIsNotLoading();
                  this.navigateSuccess();
                  if (result) {
                    if (result.access_token) {
                      AsyncStorage.setItem('userToken', result.access_token);
                      AsyncStorage.setItem(
                        'refreshToken',
                        result.refresh_token,
                      );
                      const passwordSHA512 = CryptoJS.SHA512(
                        values.password,
                      ).toString(CryptoJS.enc.Hex);
                      AsyncStorage.setItem('email', values.email);
                      AsyncStorage.setItem('password_sha512', passwordSHA512);
                      available && !keysExist && toggleBioID();
                      this.navigateSuccess();
                    } else {
                      Object.keys(result).forEach((key) => {
                        if (key === 'detail') {
                          actions.setFieldError('email', result[key]);
                        } else {
                          actions.setFieldError(key, result[key]);
                        }
                      });
                      //TODO: Scroll to error;
                    }
                  } else {
                    actions.setFieldError('password', 'Wrong password.');
                  }
                });
              }}
              validationSchema={yup.object().shape({
                //email: yup.string().email().required(),
                //password: yup.string().min(3).required(),
              })}>
              {({
                values,
                handleChange,
                errors,
                setFieldTouched,
                touched,
                isValid,
                handleSubmit,
                setFieldValue,
              }) => (
                <View>
                  <Text style={styles.pageHeadlineStyle}>
                    Enter your phone number
                  </Text>
                  <AuthContext.Provider
                    value={{
                      styles: styles,
                      values,
                      handleChange,
                      errors,
                      setFieldTouched,
                      touched,
                      isValid,
                      handleSubmit,
                      setFieldValue,
                    }}>
                    <View>
                      <FormInput
                        type="select"
                        values={sortedCountries}
                        name="country"
                        label={trans('auth.country')}
                      />
                      {values.country && (
                        <ImageBackground
                          source={getFlag(values.country)}
                          style={styles.countryFlag}
                          resizeMode={'contain'}
                        />
                      )}
                    </View>
                  </AuthContext.Provider>
                  <View style={styles.inputContainerStyle}>
                    <View>
                      {countryPhoneCode(values.country)}
                      <TextInput
                        value={values.phone}
                        onChangeText={(phone) =>
                          setFieldValue('phone', phone.trim())
                        }
                        onBlur={() => setFieldTouched('phone')}
                        placeholder="Phone"
                        style={styles.inputStyle}
                        name="phone"
                        placeholderTextColor={styles.inputStyle.color}
                        autoCapitalize="none"
                        testID="phone"
                        accessibilityLabel="phone"
                        accessible
                        textContentType="telephoneNumber"
                      />
                    </View>
                  </View>
                  {touched.phone && errors.phone && (
                    <Text style={styles.errorStyle}>{errors.phone}</Text>
                  )}
                  <Text style={styles.ageHeadlineStyle}>
                    Are you under the age of 16?
                  </Text>
                  <View style={styles.buttonContainerStyle}>
                    <Button onPress={handleSubmit} title="NEXT" />
                  </View>
                  {this.state.email && keysExist && (
                    <View style={styles.buttonContainerStyle}>
                      <TouchableOpacity
                        onPress={() => {
                          signMessage(':biometric_login', 'Sign in?').then(
                            (success) => {
                              this.bioLoginFunction({success});
                            },
                          );
                        }}
                        title="Login automatically">
                        <Image
                          source={require('../../images/PNG/finger.png')}
                          style={{
                            width: 40,
                            height: 40,
                            tintColor: 'rgba(230,60,60,0.9)',
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </Formik>

            {googleLogin ? (
              <Text
                onPress={() =>
                  OAuth('google').then((res) => {
                    if (res) {
                      AsyncStorage.setItem('userToken', '1');
                      this.navigateSuccess();
                    }
                  })
                }
                style={styles.linkStyle}>
                Sign up with Google
              </Text>
            ) : null}
            {appleLogin && Platform.OS === 'ios' ? (
              <>
                <AppleButton
                  buttonStyle={AppleButton.Style.BLACK}
                  buttonType={AppleButton.Type.SIGN_IN}
                  style={{
                    width: responsiveWidth(45),
                    height: responsiveHeight(5),
                    marginTop: responsiveHeight(1),
                    marginBottom: responsiveHeight(1),
                  }}
                  onPress={() => this.onAppleButtonPress()}
                />
              </>
            ) : null}
          </AuthView>
        )}
      </BioIDContext.Consumer>
    );
  }
}

const styles = authStyles();
