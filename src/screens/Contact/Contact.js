import React, { Component } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import ContentWrapper from '../../components/ContentWrapper';
import Content from '../../components/Content';
import FormInput from '../../components/FormInput';
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
import APIService from '../../service/APIService';
import AsyncStorage from '@react-native-community/async-storage';
const validationSchema = {
    subject: yup
      .string()
      .min(2)
      .required(),
    category: yup
      .string()
      .min(2)
      .required(),
    description: yup
      .string()
      .min(2)
      .required(),
};

export default class Contact extends Component {
    state = {
        styles: {
            ...form_styles(),
            errorStyle: {
                color: 'black',
                paddingHorizontal: responsiveWidth(7)
            },
        },
        draws: null,
    }
    getContactData(values) {
        return {
            category: values.category,
            subject: values.subject,
            description: values.description,
            draw: values.raffle,
        };
    }
    componentDidMount() {
        APIService('draws/public/').then((publicDraws)=>{
            const drawsSelector = {};
            APIService('draws/me/').then((userDraws)=>{
                if (userDraws) {
                    userDraws.results.forEach((draw)=>{
                        drawsSelector[draw.id] = draw.name;
                    });
                }
                if (publicDraws) {
                    publicDraws.results.forEach((draw)=>{
                        drawsSelector[draw.id] = draw.name;
                    });
                }
                this.setState({draws:drawsSelector});
            });
        });
    }
    render() {
        return (
            <ContentWrapper title="Contact us" center={true}>
                <Content>
                <Formik
                    initialValues={{ }}
                    onSubmit={(values, actions) => {
                        global.appIsLoading();
                            APIService('support-tickets/new/',
                                this.getContactData(values)
                            ).then(result => {
                                global.appIsNotLoading();
                                if (result) {
                                    if (result.created_at) {
                                        //actions.setFieldValue('description','');
                                        //actions.setFieldValue('subject','');
                                        actions.setFieldError('description', trans('contact.success'));
                                        //navigate('SupportTickets');
                                    } else {
                                        actions.setFieldError('description', trans('contact.failed'));
                                    }
                                } else {
                                    actions.setFieldError('description', trans('contact.failed'));
                                }
                                // actions.setFieldTouched('description',true);
                            });
                    }}
                    validationSchema={yup.object().shape(validationSchema)}
                    >
          {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, setFieldValue }) => (
            <AuthContext.Provider value={{ styles:this.state.styles, values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, setFieldValue }}>
                <FormInput type="select" values={{
                    'General': trans('contact.general'),
                    'Lotteries': trans('contact.lotteries'),
                    'Payments': trans('contact.payments'),
                }} name="category" label={trans('contact.category')} />
                <FormInput type="text" name="subject" label={trans('contact.subject')} />
                <FormInput type="select" name="raffle" label={trans('contact.raffle')} values={this.state.draws} />
                <FormInput type="text" multiline={true} name="description" label={trans('contact.comments')} />
                <View style={this.state.styles.buttonContainerStyle}>
                    <Button onPress={handleSubmit} title={trans('contact.contact')} />
                </View>
            </AuthContext.Provider>

          )}</Formik>
                </Content>
            </ContentWrapper>
        );
    }
}
