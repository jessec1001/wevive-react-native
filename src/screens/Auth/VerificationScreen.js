import React, {Fragment, Component, useContext} from 'react';
import {Text, TextInput, View} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';
import Button from '../../components/Button';
import authStyles from '../../styles/auth';

import APIService from '../../service/APIService';
import AuthView from '../../views/AuthView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';

import {UserContext} from '../../context/UserContext';
export default class VerificationScreen extends Component {
  navigateSuccess = (user) => {
    let screen = 'VerificationSuccess';
    if (user.new || user.phone_number == '+11234567890') {
      screen = 'VerificationSuccess';
    } else if (user.pinSet) {
      screen = 'PINScreen';
    } else {
      screen = 'PINVerificationScreen';
    }
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: screen}],
      }),
    );
  };
  handleBack = () => {
    this.props.navigation.goBack();
  };
  render() {
    const {navigate} = this.props.navigation;
    return (
      <UserContext.Consumer>
        {({setAuthData}) => (
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
                APIService('users/phone_sign_in/', {
                  phone_number:
                    this.props.route.params.countryCode +
                    this.props.route.params.phoneNumber,
                  security_code: values.pin,
                  remember_me: 1,
                  session_token: this.props.route.params.sessionToken,
                }).then((result) => {
                  global.appIsNotLoading();
                  if (result) {
                    if (result.access_token) {
                      setAuthData({...result, userToken: result.access_token});
                      AsyncStorage.removeItem('sessionToken');
                      AsyncStorage.setItem('userId', String(result.id));
                      AsyncStorage.setItem('userName', result.name);
                      AsyncStorage.setItem('userToken', result.access_token);
                      AsyncStorage.setItem(
                        'refreshToken',
                        result.refresh_token,
                      );
                      this.navigateSuccess(result);
                    } else {
                      actions.setFieldError('pin', result.non_field_errors[0]);
                    }
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
                  <Text style={styles.pageTextStyle}>
                    An SMS has been sent to:
                  </Text>
                  <Text style={styles.pageTextStyleBold}>
                    {this.props.route.params.countryCode}{' '}
                    {this.props.route.params.phoneNumber}
                  </Text>
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
                  {(!!errors.pin || !values.pin) && (
                    <View style={styles.buttonContainerStyle}>
                      <Button
                        onPress={this.props.navigation.goBack}
                        title="BACK"
                      />
                    </View>
                  )}
                </View>
              )}
            </Formik>
          </AuthView>
        )}
      </UserContext.Consumer>
    );
  }
}

const styles = authStyles();
