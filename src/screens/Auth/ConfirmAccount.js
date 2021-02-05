import React, { Fragment, Component } from 'react';
import {
  Text,
  View,
} from 'react-native';

import * as yup from 'yup';
import { Formik } from 'formik';
import Button from '../../components/Button';
import styles from '../../styles/auth';
import APIService from '../../service/APIService';
import AuthView from '../../views/AuthView';
import trans from '../../utils/trans';
import { AuthContext } from '../../context/AuthContext';
import FormInput from '../../components/FormInput';
import { parse, format } from 'date-fns';
import ClientLogo from '../../components/ClientLogo';
const toc_Text = trans('auth.toc');
const mainHeadline = "CONFIRM YOUR ACCOUNT";

const validationSchema = {
};

export default class ConfirmAccount extends Component {
  state = {
    styles: styles(),
  }
  getRegistrationData(values) {
    return {
      email: values.email,
      code: values.code,
    };
  }
  render() {
    const {navigate} = this.props.navigation;
    return (
      <AuthView navigation={this.props.navigation}>
        <View style={this.state.styles.mainLogoContainerStyle}>
          <ClientLogo style={this.state.styles.mainLogoStyle}
            imageStyle={this.state.styles.mainLogoImageStyle}
          />
        </View>
        <Text style={this.state.styles.mainHeadlineStyle}>
          {mainHeadline}
        </Text>
        {this.props.route.params?.message ? (
            <Text style={this.state.styles.headlineStyle}>
              {this.props.route.params.message}
            </Text>
          ) : null}
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={(values, actions) => {
            this.props.navigation.navigate('SignIn');
          }}
          validationSchema={yup.object().shape(validationSchema)}
        >
          {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, setFieldValue }) => (
            <View>
              <AuthContext.Provider value={{ styles:this.state.styles, values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, setFieldValue }}>
  
              </AuthContext.Provider>
              <View style={this.state.styles.buttonContainerStyle}>
                <Button onPress={handleSubmit} title={trans('auth.back_to_login')} />
              </View>
            </View>
        )}
      </Formik>
    </AuthView>
    );
  }
}
