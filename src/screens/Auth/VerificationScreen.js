import React, {Fragment, Component, useContext} from 'react';
import {Text, TextInput, View} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';
import Button from '../../components/Button';
import authStyles from '../../styles/auth';

import APIService from '../../service/APIService';
import AuthView from '../../views/AuthView';

import {CommonActions} from '@react-navigation/native';

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
                this.navigateSuccess();
              } else {
                actions.setFieldError('password', 'Wrong password.');
              }
            });
          }}
          validationSchema={yup.object().shape({
            pin: yup.string().min(4).required(),
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
              <Text style={styles.pageTextStyle}>Please enter the code below:</Text>
              <View style={styles.inputContainerStyle}>
                <View>
                  <TextInput
                    value={values?.pin}
                    onChangeText={(pin) =>
                      setFieldValue('pin', pin.trim())
                    }
                    onBlur={() => setFieldTouched('pin')}
                    placeholder="PIN"
                    style={styles.inputStyle}
                    name="pin"
                    placeholderTextColor={styles.inputStyle.color}
                    autoCapitalize="none"
                    testID="pin"
                    accessibilityLabel="pin"
                    accessible
                    textContentType="oneTimeCode"
                  />
                </View>
              </View>
              {touched.pin && errors.pin && (
                <Text style={styles.errorStyle}>{errors.pin}</Text>
              )}
              <View style={styles.buttonContainerStyle}>
                <Button onPress={handleSubmit} title="NEXT" />
              </View>
            </View>
          )}
        </Formik>
      </AuthView>
    );
  }
}

const styles = authStyles();
