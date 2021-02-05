import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';
import ContentWrapper from '../../components/ContentWrapper';

import Button from '../../components/Button';
import form_styles from '../../styles/forms';
import Content from '../../components/Content';

import FormInput from '../../components/FormInput';
import trans from '../../utils/trans';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { AuthContext } from '../../context/AuthContext';
import H1  from '../../components/H1';
import P  from '../../components/P';
import AsyncStorage from '@react-native-community/async-storage';
import APIService from '../../service/APIService';
import { UserContext } from '../../context/UserContext';

const validationSchema = {
};
const paymentMethods = require('../../images/PNG/paymentmethods.png');
export default class AddFunds extends Component {
    state = {
        styles: {...form_styles(),...StyleSheet.create({
            paymentMethodsStyle: {
                width:responsiveWidth(50),
                height: responsiveWidth(50) / 9.25,
                justifyContent: "center",
                alignSelf: "center",
                marginTop: responsiveWidth(3),
            }
        })},
    }
    render() {
        return (
            <ContentWrapper title="Add Funds">
                <Content>
                    <H1>
                        {trans('funds.top_up_here')}
                    </H1>
                    <P>
                        {trans('funds.top_up_text1')}
                    </P>
                    <P>
                        {trans('funds.top_up_text2')} 
                    </P>
                    <P>
                        {trans('funds.top_up_text3')}
                    </P>
                    <Formik
                        initialValues={{ }}
                        onSubmit={(values, actions) => {
                            global.toggleDonationModal(values.amount);
                        }}
                        validationSchema={yup.object().shape(validationSchema)}
                    >
                    {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, setFieldValue }) => (
                        <AuthContext.Provider value={{ styles:this.state.styles, values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, setFieldValue }}>
                            <FormInput type="select" values={{2:"£2 GBP",4:"£4 GBP",8:"£8 GBP",10:"£10 GBP",15:"£15 GBP",20:"£20 GBP",25:"£25 GBP",50:"£50 GBP",75:"£75 GBP",100:"£100 GBP"}} name="amount" label={trans('account.amount')} />
                            <View style={this.state.styles.buttonContainerStyle}>
                                <Button onPress={handleSubmit} title={trans('account.buy_now')} width={responsiveWidth(80)} />
                            </View>
                        </AuthContext.Provider>
                    )}
                    </Formik>
                    <Image source={paymentMethods} style={this.state.styles.paymentMethodsStyle} />
                </Content>
            </ContentWrapper>
        );
    }
}
