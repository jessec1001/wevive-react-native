import React, {Fragment, Component, useContext} from 'react';
import {
  Image,
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
import { Buffer } from 'buffer';
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';

import {BioIDContext} from '../../utils/BioAuth';

import { CommonActions } from '@react-navigation/native';
import ClientLogo from '../../components/ClientLogo';

const mainHeadline = 'LOTTERIES / RAFFLES';
const googleLogin = false;
const appleLogin = false;


export default class SignIn extends Component {
  state = {
    email: null,
    bioAccessToken: null,
  }
  navigateSuccess = () => {
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'App' },
        ],
      })
    );
  }
  componentDidMount() {
    AsyncStorage.getItem('email').then((email)=>{
      this.setState({email})
    });
    AsyncStorage.getItem('bioAccessToken').then((bioAccessToken)=>{
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
        Alert.alert('Error','No biometric data found');
      }
  }
  onAppleButtonPress = async function() {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGIN,
      requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
    });
    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
    if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
      const jwtBody = appleAuthRequestResponse.identityToken.split('.')[1];
      const base64 = jwtBody.replace('-', '+').replace('_', '/');
      const decodedJwt = Buffer.from(base64, 'base64');
      const decodedJSON = JSON.parse(decodedJwt);
      const emailSHA512 = await CryptoJS.SHA512(decodedJSON.email).toString(
        CryptoJS.enc.Hex
      );
      AsyncStorage.setItem('userToken', '1');
      AsyncStorage.setItem('email', decodedJSON.email);
      AsyncStorage.setItem('password_sha512', emailSHA512);
      this.navigateSuccess();
    }
  }
  render() {
    const {navigate} = this.props.navigation;
    return (
      <BioIDContext.Consumer>
      {({ available, keysExist, signMessage, toggleBioID}) => (
        <AuthView route={this.props.route} bioLoginFunction={this.bioLoginFunction.bind(this)} signMessage={available ? signMessage : false} navigation={this.props.navigation}>
          <View style={styles.mainLogoContainerStyle}>
            <ClientLogo style={styles.mainLogoStyle}
              imageStyle={styles.mainLogoImageStyle}
            />
          </View>
          <Text style={styles.mainHeadlineStyle}>
            {mainHeadline}
          </Text>
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
              APIService('users/sign_in/',
              {
                email: values.email,
                password: values.password,
                remember_me: 1,
                is_staff: false,
              }).then((result) => {
                global.appIsNotLoading();
                if (result) {
                  if (result.access_token) {
                    AsyncStorage.setItem('userToken', result.access_token);
                    AsyncStorage.setItem('refreshToken', result.refresh_token);
                    const passwordSHA512 = CryptoJS.SHA512(
                      values.password
                    ).toString(CryptoJS.enc.Hex);
                    AsyncStorage.setItem('email', values.email);
                    AsyncStorage.setItem('password_sha512', passwordSHA512);
                    available && !keysExist && toggleBioID();
                    this.navigateSuccess();
                  } else {
                    Object.keys(result).forEach(key => {
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
              email: yup.string().email().required(),
              password: yup.string().min(3).required(),
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
                <View style={styles.inputContainerStyle}>
                  <TextInput
                    value={values.email}
                    onChangeText={email => setFieldValue('email', email.trim())}
                    onBlur={() => setFieldTouched('email')}
                    placeholder="Email"
                    style={styles.inputStyle}
                    name="email"
                    placeholderTextColor={styles.inputStyle.color}
                    autoCapitalize="none"
                    testID="email"
                    accessibilityLabel="email"
                    accessible
                    textContentType="emailAddress"
                  />
                </View>
                {touched.email && errors.email && (
                  <Text style={styles.errorStyle}>{errors.email}</Text>
                )}
                <View style={styles.inputContainerStyle}>
                  <TextInput
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={() => setFieldTouched('password')}
                    placeholder="Password"
                    password={true}
                    secureTextEntry={true}
                    style={styles.inputStyle}
                    name="password"
                    placeholderTextColor={styles.inputStyle.color}
                    autoCapitalize="none"
                    testID="password"
                    accessibilityLabel="password"
                    accessible
                    textContentType="password"
                  />
                </View>
                {touched.password && errors.password && (
                  <Text style={styles.errorStyle}>
                    {errors.password}
                  </Text>
                )}
                <View style={styles.buttonContainerStyle}>
                  <Button onPress={handleSubmit} title="Login" />
                </View>
                {this.state.email && keysExist &&
                  <View style={styles.buttonContainerStyle}>
                    <TouchableOpacity onPress={() => {
                      signMessage(':biometric_login','Sign in?').then((success)=>{
                        this.bioLoginFunction({success});
                      });
                    }} title="Login automatically" >
                    <Image source={require('../../images/PNG/finger.png')} style={{width:40,height:40,tintColor: 'rgba(230,60,60,0.9)' }} />
                    </TouchableOpacity>
                  </View>
                }
              </View>
            )}
          </Formik>


          {googleLogin ?
            <Text
              onPress={() =>
                OAuth('google')
                  .then((res) => {
                    if (res) {
                      AsyncStorage.setItem('userToken', '1');
                      this.navigateSuccess();
                    }
                  })
              }
              style={styles.linkStyle}>
              Sign up with Google
          </Text> : null}
          {appleLogin && Platform.OS === 'ios' ?
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
            : null}
          <Text style={styles.footerStyle}>
            If you don’t have an account
          </Text>
          <Text
            onPress={() => navigate('SignUp')}
            style={styles.linkStyle}>
            Register Here
          </Text>
          <Text
            style={{
              ...styles.linkStyle,
              ...styles.forgotPasswordLink,
            }}
            onPress={() => navigate('ForgotPassword')}>
            Reset password
            </Text>
        </AuthView>
        )}
        </BioIDContext.Consumer>
    );
  }
}


const styles = authStyles();