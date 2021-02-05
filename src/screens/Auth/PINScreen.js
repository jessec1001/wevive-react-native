import React, {Fragment, Component, useContext} from 'react';
import {Text, TextInput, View} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';
import Button from '../../components/Button';
import authStyles from '../../styles/auth';

import APIService from '../../service/APIService';
import AuthView from '../../views/AuthView';

import {CommonActions} from '@react-navigation/native';

export default class PINScreen extends Component {
  state = {
    email: null,
    bioAccessToken: null,
    avatarImage: null,
  };
  navigateSuccess = () => {
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'AvatarScreen'}],
      }),
    );
  };
  render() {
    const {navigate} = this.props.navigation;
    return (
      <AuthView
        headline={'Security'}
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
              <Text style={styles.pageHeadlineStyle}>Save this PIN!</Text>
              <Text style={styles.pageTextStyleBold}>12345</Text>
              <Text style={styles.pageTextStyle}>Your PIN keeps your information safe and accessible to you in case you need to reinstall WeTalk.</Text>
              <Text style={styles.pageTextStyle}>Please write it down and then enter it below to continue.</Text>
              <View style={styles.inputContainerStyle}>
                  <TextInput
                    value={values.pin}
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
