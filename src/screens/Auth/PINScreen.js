import React, {Fragment, Component, useContext} from 'react';
import {Text, TextInput, View} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';
import Button from '../../components/Button';
import authStyles from '../../styles/auth';

import APIService from '../../service/APIService';
import AuthView from '../../views/AuthView';

import {CommonActions} from '@react-navigation/native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import trans from '../../utils/trans';

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
  makeid = (length) => {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  render() {
    const rand = this.makeid(6);
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
            APIService('users/set_pin/', {
              pin: values.pin,
            }).then((result) => {
              global.appIsNotLoading();
              if (result) {
                this.navigateSuccess();
              } else {
                actions.setFieldError('pin', 'Failed to save PIN.');
              }
            });
          }}
          validationSchema={yup.object().shape({
            //email: yup.string().email().required(),
            pin: yup.string().min(6).required().oneOf([rand, null], trans('auth.password_must_match')),
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
            <>
              <Text style={styles.pageHeadlineStyle}>Save this PIN!</Text>
              <Text style={styles.pageTextStyleBold}>{rand}</Text>
              <Text style={styles.pageTextStyle}>
                Your PIN keeps your information safe and accessible to you in
                case you need to reinstall WeTalk.
              </Text>
              <Text style={styles.pageTextStyle}>
                Please write it down and then enter it below to continue.
              </Text>
              <SmoothPinCodeInput
                codeLength={6}
                containerStyle={styles.cellInputStyle}
                cellStyle={styles.cellStyle}
                cellStyleFocused={styles.cellStyleFocused}
                value={values.pin}
                onTextChange={handleChange('pin')}
              />
              {values.pin.length > 0 && !errors.pin && (
                <View style={styles.buttonContainerStyle}>
                  <Button onPress={handleSubmit} title="NEXT" />
                </View>
              )}
            </>
          )}
        </Formik>
      </AuthView>
    );
  }
}

const styles = authStyles();
