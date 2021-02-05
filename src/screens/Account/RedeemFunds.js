import React, { Component, useContext } from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import ContentWrapper from '../../components/ContentWrapper';
import Content from '../../components/Content';
import FormInput from '../../components/FormInput';
import trans from '../../utils/trans';
import { Formik } from 'formik';
import * as yup from 'yup';
import Button from '../../components/Button';
import DetailsNavigator from '../../components/DetailsNavigator';

import { AuthContext } from '../../context/AuthContext';
import form_styles from '../../styles/forms';
const validationSchema = {
};
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { UserContext } from '../../context/UserContext';

export default function RedeemFunds(props) {
    const {authData} = useContext(UserContext);
    return (
        <ContentWrapper title="Redeem Funds">
            <Content>
            <Formik
                    initialValues={{ }}
                    onSubmit={(values, actions) => {
                        global.appIsLoading();
                        APIService('TODO',
                            this.getContactData(values)
                        ).then(result => {
                            global.appIsNotLoading();
                            if (result) {
                                if (result.success) {
                                    navigate('App');
                                } else {
                                    actions.setFieldError('comments', trans('contact.failed'));
                                }
                            } else {
                                actions.setFieldError('comments', trans('contact.failed'));
                            }
                        });
                    }}
                    validationSchema={yup.object().shape(validationSchema)}
                >
                {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, setFieldValue }) => (
                    <AuthContext.Provider value={{ styles, values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, setFieldValue }}>
                        <Text style={styles.text}>Request Transfer of funds to your bank account.</Text>
                        <Text style={styles.text}>Redeemable Amount: £{authData.balance}</Text>
                        <FormInput type="text" name="amount" label={trans('account.claim_amount')} />
                        <FormInput type="select" values={{phone:"Phone"}} name="method" label={trans('account.claim_method')} />
                        <Text style={styles.text}>Confirm address</Text>
                        <FormInput type="text" name="address1" label={trans('auth.address1')} />
                        <FormInput type="text" name="address2" label={trans('auth.address2')} />
                        <FormInput type="text" name="city" label={trans('auth.town')} />
                        <FormInput type="text" name="county" label={trans('auth.county')} />
                        <FormInput type="text" name="postcode" label={trans('auth.postcode')} />
                        <FormInput type="text" name="phone_number" label={trans('auth.phone')} />
                        <View style={styles.buttonContainerStyle}>
                            <Button onPress={handleSubmit} title={trans('account.submit')} />
                        </View>
                    </AuthContext.Provider>
                )}
                </Formik>
                </Content>
        </ContentWrapper>
    );
}

const styles = form_styles();
