import React, {Fragment, Component, useContext} from 'react';
import {Text, TextInput, View} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';
import Button from '../../components/Button';
import authStyles from '../../styles/auth';

import APIService from '../../service/APIService';
import AuthView from '../../views/AuthView';
import AsyncStorage from '@react-native-community/async-storage';
import {CommonActions} from '@react-navigation/native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
export default class VerificationScreen extends Component {
  state = {
    email: null,
    bioAccessToken: null,
    avatarImage: null,
  };
  navigateSuccess = () => {
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'VerificationSuccess'}],
      }),
    );
  };
  render() {
    const {navigate} = this.props.navigation;
    return (
      <AuthView
        headline={'Verify your phone number'}
        route={this.props.route}
        navigation={this.props.navigation}>
        <Formik
          initialValues={{
            pin: '',
          }}
          onSubmit={async (values, actions) => {
            global.appIsLoading();
            const phone_number = await AsyncStorage.getItem('phoneNumber');
            const session_token = await AsyncStorage.getItem('sessionToken');
            APIService('users/phone_sign_in/', {
              phone_number: phone_number,
              security_code: values.pin,
              remember_me: 1,
              session_token: session_token,
            }).then((result) => {
              global.appIsNotLoading();
              this.navigateSuccess();
              if (result) {
                if (result.access_token) {
                  AsyncStorage.setItem('userToken', result.access_token);
                  AsyncStorage.setItem('refreshToken', result.refresh_token);
                } else {
                  actions.setFieldError('pin', JSON.stringify(result));
                }
                this.navigateSuccess();
              } else {
                actions.setFieldError(
                  'pin',
                  'Server error. Please try again later.',
                );
              }
            });
          }}
          validationSchema={yup.object().shape({
            pin: yup.string().min(6).required(),
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
                Security Verification
              </Text>
              <Text style={styles.pageTextStyle}>An SMS has been sent to:</Text>
              <Text style={styles.pageTextStyleBold}>+44 7760235520</Text>
              <Text style={styles.pageTextStyle}>
                Please enter the code below:
              </Text>
              <SmoothPinCodeInput
                codeLength={6}
                containerStyle={styles.cellInputStyle}
                cellStyle={styles.cellStyle}
                cellStyleFocused={styles.cellStyleFocused}
                value={values.pin}
                onTextChange={handleChange('pin')}
              />
              {touched.pin && errors.pin && (
                <Text style={styles.errorStyle}>{errors.pin}</Text>
              )}
              {!errors.pin && values.pin.length > 0 && (
                <View style={styles.buttonContainerStyle}>
                  <Button onPress={handleSubmit} title="NEXT" />
                </View>
              )}
            </View>
          )}
        </Formik>
      </AuthView>
    );
  }
}

const styles = authStyles();
