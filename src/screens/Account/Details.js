//Show balance
//go to AddFunds
//go to RedeemFunds
//Show payment history
import React, { Component, useContext } from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import ContentWrapper from '../../components/ContentWrapper';
import Content from '../../components/Content';
import FormInput from '../../components/FormInput';
import DetailsNavigator from '../../components/DetailsNavigator';
import trans from '../../utils/trans';
import { Formik } from 'formik';
import * as yup from 'yup';
import Button from '../../components/Button';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize,
} from 'react-native-responsive-dimensions';

import { AuthContext } from '../../context/AuthContext';
import form_styles from '../../styles/forms';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIService from '../../service/APIService';
import { parse, format, parseISO } from 'date-fns';
import { UserContext } from '../../context/UserContext';

const validationSchema = {
    name: yup
    .string()
    .min(2)
    .required(),
    address1: yup
    .string()
    .min(3)
    .required(),
    address2: yup
    .string()
    .nullable(),
    city: yup
    .string()
    .min(2)
    .required(),
    county: yup
    .string()
    .min(3)
    .required(),
    postcode: yup
    .string()
    .min(3)
    .required(),
    date_of_birth: yup
    .string()
    .min(3)
    .required(),
};

export default function Details (props) {
    const styles = form_styles();
    const {authData, setAuthData} = useContext(UserContext);
    function getRegistrationData(values) {
        return {
          name: values.name,
          client: 0,
          phone_number: values.phone_number,
          address1: values.address1,
          address2: values.address2,
          city: values.city,
          county: values.county,
          postcode: values.postcode,
          date_of_birth: parse(values.date_of_birth, 'MMMM d, yyyy', new Date()).toISOString(),
        };
    }

    return (
        <ContentWrapper title="My details" details={<DetailsNavigator navigation={props.navigation} route={props.route}/>}>
                {authData ?
                <Formik
                    initialValues={{
                        name: authData.name,
                        address1: authData.address1,
                        address2: authData.address2,
                        city: authData.city,
                        county: authData.county,
                        postcode: authData.postcode,
                        phone_number: authData.phone_number,
                        date_of_birth: 
                        format(parseISO(authData.date_of_birth),"MMMM d, yyyy"),
                    }}
                    onSubmit={(values, actions) => {
                        global.appIsLoading();
                        APIService('users/me/',
                            getRegistrationData(values)
                        ).then(result => {
                            global.appIsNotLoading();
                            if (result) {
                                if (result.id) {
                                    setAuthData(result);
                                } else {
                                    Object.keys(result).forEach(key => {
                                        actions.setFieldError(key, result[key]);
                                    });
                                }
                            } else {
                                actions.setFieldError('email', trans('account.update_failed'));
                            }
                        });
                    }}
                    validationSchema={yup.object().shape(validationSchema)}
                >
                {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, setFieldValue }) => (
                            <AuthContext.Provider value={{ styles, values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, setFieldValue }}>
                                <FormInput readonly type="text" name="name" label={trans('auth.name')} />
                                <FormInput type="text" name="address1" label={trans('auth.address1')} />
                                <FormInput type="text" name="address2" label={trans('auth.address2')} />
                                <FormInput type="text" name="city" label={trans('auth.town')} />
                                <FormInput type="text" name="county" label={trans('auth.county')} />
                                <FormInput type="text" name="postcode" label={trans('auth.postcode')} />
                                <FormInput type="text" name="phone_number" label={trans('auth.phone')} />
                                <FormInput type="date" name="date_of_birth" label={trans('auth.dob')} dateformat="MMMM d, yyyy" />
                                <View style={styles.buttonContainerStyle}>
                                    <Button onPress={handleSubmit} title={trans('account.update')} />
                                </View>
                            </AuthContext.Provider>
                            
                )}
                </Formik>
                : null}
        </ContentWrapper>
            
    );
}
