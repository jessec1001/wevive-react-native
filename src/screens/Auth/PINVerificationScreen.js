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
import { UserContext } from '../../context/UserContext';

export default function PINVerificationScreen({navigation, route}) {
  const {authData} = React.useContext(UserContext);
  const navigateSuccess = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: !authData?.avatar ? 'AvatarScreen' : 'App'}],
      }),
    );
  };
  const {navigate} = navigation;
  return (
    <AuthView headline={'Security'} route={route} navigation={navigation}>
      <Formik
        initialValues={{
          pin: '',
        }}
        onSubmit={(values, actions) => {
          navigateSuccess();
        }}
        validationSchema={yup.object().shape({
          //email: yup.string().email().required(),
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
          <>
            <Text style={styles.pageHeadlineStyle}>Enter your PIN</Text>
            <Text style={styles.pageTextStyle}>
              Please enter the PIN number that you saved after registration or
              confirm the sign in using another device.
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
            {!!errors.pin && (
              <View style={styles.buttonContainerStyle}>
                <Button onPress={navigation.goBack} title="BACK" />
              </View>
            )}
          </>
        )}
      </Formik>
    </AuthView>
  );
}

const styles = authStyles();
