import React, {Fragment, Component, useContext} from 'react';
import {Text, TextInput, View, ImageBackground} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';
import Button from '../../components/Button';
import authStyles from '../../styles/auth';

import APIService from '../../service/APIService';
import AuthView from '../../views/AuthView';

import {CommonActions} from '@react-navigation/native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import trans from '../../utils/trans';
import FormInput from '../../components/FormInput';

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
import {AuthContext} from '../../context/AuthContext';
import {ClientContext} from '../../context/ClientContext';
import { getCountryPhoneCode, removeTrunkPrefix } from '../../utils/phonehelpers';
const countryPhoneCode = (country) => {
    if (!country || !phoneCodes[country]) {
      return;
    }
    if (Array.isArray(phoneCodes[country])) {
      return (
        <View style={styles.countryCodeBox}>
          <Text style={styles.countryCode}>{getCountryPhoneCode(country)}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.countryCodeBox}>
          <Text style={styles.countryCode}>{getCountryPhoneCode(country)}</Text>
        </View>
      );
    }
  };
export default class ChangeNumberVerification extends Component {
  state = {
    email: null,
    bioAccessToken: null,
    avatarImage: null,
  };
  navigateSuccess = () => {
    this.props.navigation.navigate('PhoneUsernameSettings');
  };
  render() {
    const {navigate} = this.props.navigation;
    return (
      <AuthView
        noHeader
        headline={'Security'}
        route={this.props.route}
        navigation={this.props.navigation}>
        <Formik
          initialValues={{
            username: '',
          }}
          onSubmit={(values, actions) => {
            this.navigateSuccess();
          }}
          validationSchema={yup.object().shape({
            //email: yup.string().email().required(),
            username: yup
              .string()
              .min(6)
              .required(),
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
              <FormInput type="text" name="username" label={trans('auth.username')} />
              {values.username.length > 0 && !errors.username && (
                <View style={styles.buttonContainerStyle}>
                  <Button onPress={handleSubmit} title="SAVE" />
                </View>
              )}
            </AuthContext.Provider>
          )}
        </Formik>
      </AuthView>
    );
  }
}

const styles = authStyles();
