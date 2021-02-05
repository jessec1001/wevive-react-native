import React, { Fragment, Component } from 'react';
import {
  Text,
  View,
} from 'react-native';

import * as yup from 'yup';
import { Formik } from 'formik';
import Button from '../../components/Button';
import authStyles from '../../styles/auth';
import APIService from '../../service/APIService';
import AuthView from '../../views/AuthView';
import trans from '../../utils/trans';
import { AuthContext } from '../../context/AuthContext';
import FormInput from '../../components/FormInput';
import { getISODate } from '../../utils/helpers';
import ClientLogo from '../../components/ClientLogo';
import Swiper from 'react-native-swiper';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import moment from 'moment';
import { parse } from 'date-fns';
const toc_Text = trans('auth.toc');
const mainHeadline = 'REGISTER';
const initialValues = {
  name: '',
  email: '',
  address1: '',
  address2: '',
  city: '',
  county: '',
  postcode: '',
  phone_number: '',
  password: '',
  confirm_password: '',
  date_of_birth: '',
};
const validationSchema = {
  name: yup
    .string()
    .min(2)
    .required('Enter your name'),
  email: yup
    .string()
    .email()
    .required('Enter your email'),
  address1: yup
    .string()
    .min(3)
    .required('Enter your address'),
  //address2: yup
  //  .string(),
  city: yup
    .string()
    .min(2)
    .required('Enter your city'),
  county: yup
    .string()
    .min(3)
    .required('Enter your county'),
  postcode: yup
    .string()
    .min(3)
    .required('Enter your postcode'),
  phone_number: yup
    .string()
    .min(3)
    .required('Enter your phone number'),
  date_of_birth: yup
    .string()
    .min(3)
    .required('Enter your date of birth')
    .test(
      'date_of_birth',
      'You must be over 16 to register',
      value => {
        const selval = getISODate(value);
        return moment().diff(selval,'years') >= 16;
      }
    ),
  /*age: yup
    .bool()
    .required()
    .oneOf([true], 'Field must be checked'),*/
  password: yup
    .string()
    .min(3)
    .required(),
  confirm_password: yup.string().required().oneOf([yup.ref('password'), null], trans('auth.password_must_match')),
};
export default class SignUp extends Component {
  state = {
    swiperHeight: 'auto',
    slideHeights: [],
  }
  getRegistrationData(values) {
    return {
      name: values.name,
      email: values.email,
      password: values.password,
      confirm_password: values.confirm_password,
      phone_number: values.phone_number,
      address1: values.address1,
      address2: values.address2,
      city: values.city,
      county: values.county,
      postcode: values.postcode,
      date_of_birth: getISODate(values.date_of_birth),
    };
  }
  renderPagination(index, total, context) {
    const pagination = [];
    for (var i = 0; i < total; i++) {
      pagination.push(<View style={index === i ? {...styles.dot, ...styles.activeDot} : styles.dot}>
        <Text style={index === i ? {...styles.dotText, ...styles.activeDotText} : styles.dotText}>{i + 1}</Text>
      </View>);
    }
    return <View style={total > 2 ? styles.buttonWrapperStyle : styles.buttonWrapperStyleShort}>
      {pagination}
      <View style={total >  2 ? styles.paginationLine : styles.paginationLineShort} />
    </View>;
  }
  getErrorCount(slide, errors) {
    let erCount = 0;
    if (slide === 'slide1') {
      if (errors.name) {erCount++;}
      if (errors.email) {erCount++;}
      if (errors.phone_number) {erCount++;}
      if (errors.dob) {erCount++;}
    }
    if (slide === 'slide2') {
      if (errors.address1) {erCount++;}
      if (errors.address2) {erCount++;}
      if (errors.city) {erCount++;}
      if (errors.county) {erCount++;}
      if (errors.postcode) {erCount++;}
    }
    if (slide === 'slide3') {
      if (errors.password) {erCount++;}
      if (errors.password_confirmation) {erCount++;}
    }
    return erCount;
  }
  handleSlideHeight(slide, event, errors) {
    const slideHeights = {
      ...this.state.slideHeights,
    };
    if (!slideHeights[slide] || slideHeights[slide] === 'auto') {
      slideHeights[slide] = event.nativeEvent.layout.height + responsiveWidth(10) + responsiveWidth(5) * (1 + this.getErrorCount(slide,errors));
      this.setState({slideHeights});
      if (slide === 'slide1') {
        this.setState({swiperHeight: slideHeights[slide]});
      }
    }
  }
  goNext() {
    this.setState({swiperHeight: this.state.slideHeights['slide' + (this.swiperEl.state.index + 2)]});
    this.swiperEl.scrollBy(1);
  }
  goBack() {
    this.setState({swiperHeight: this.state.slideHeights['slide' + (this.swiperEl.state.index)]});
    this.swiperEl.scrollBy(-1);
  }
  goToSlide(x) {
    this.swiperEl.scrollTo(x);
  }
  render() {
    const {navigate} = this.props.navigation;
    return (
      <AuthView navigation={this.props.navigation}>
        <View style={styles.mainLogoContainerStyle}>
          <ClientLogo style={styles.mainLogoStyle}
            imageStyle={styles.mainLogoImageStyle}
          />
        </View>
        <Text style={styles.mainHeadlineStyle}>
          {mainHeadline}
        </Text>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, actions) => {
            global.appIsLoading();
            APIService('users/register/',
              this.getRegistrationData(values)
            ).then(result => {
              global.appIsNotLoading();
              if (result) {
                if (result == 'OK') {
                  this.props.navigation.navigate('ConfirmAccount',{message:'Thank you for registration, please confirm your email address.'});
                  //this.goToSlide(3);
                } else {
                  const slideHeights = {
                    'slide1': 'auto',
                    'slide2': 'auto',
                    'slide3': 'auto',
                    'slide4': 'auto',
                  };
                  this.setState({slideHeights},function() {
                    Object.keys(result).forEach(key => {
                      actions.setFieldError(key, result[key]);
                    });
                    const firstError = Object.keys(result)[0];
                    if (['phone_number','name','email','date_of_birth'].includes(firstError)) {
                      this.goToSlide(0);
                    }
                    if (['address1','address2','city','county','postcode'].includes(firstError)) {
                      this.goToSlide(1);
                    }
                    if (['password','confirm_password'].includes(firstError)) {
                      this.goToSlide(2);
                    }
                  });
                }
              } else {
                actions.setFieldError('email', trans('auth.failed_signup'));
              }
            });
          }}
          validationSchema={yup.object().shape(validationSchema)}
        >
          {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, setFieldValue }) => (
              <AuthContext.Provider value={{ styles:styles, values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, setFieldValue }}>
              <Swiper
                style={styles.swiperWrapper}
                containerStyle={styles.swiperContainer}
                showsButtons={false}
                loop={false}
                removeClippedSubviews={false}
                renderPagination={this.renderPagination}
                scrollEnabled={false}
                ref={el => this.swiperEl = el}
                height={this.state.swiperHeight}
              >
                <View style={styles.slide} key="slide1" onLayout={(event) =>this.handleSlideHeight('slide1', event, errors)}>
                  <View style={styles.slideContainer}>
                    <FormInput type="text" name="name" label={trans('auth.name')} textContentType="name" autoCapitalize="words" />
                    <FormInput type="text" name="email" label={trans('auth.email')} textContentType="emailAddress" keyboardType="email-address" />
                    <FormInput type="text" name="phone_number" label={trans('auth.phone')} textContentType="telephoneNumber" keyboardType="phone-pad" />
                    <FormInput type="date" name="date_of_birth" label={trans('auth.dob')} dateformat="MMMM d, yyyy" />
                    <View style={styles.buttonContainerStyle}>
                      <Button onPress={() => {
                        const slideHeights = {
                          ...this.state.slideHeights,
                          'slide1': 'auto',
                        };
                        if (values.name && values.email && values.phone_number && values.date_of_birth
                          && !errors.name && !errors.email && !errors.phone_number && !errors.date_of_birth) {
                            this.setState({slideHeights},function() {
                              setFieldTouched('address1',false);
                              setFieldTouched('address2',false);
                              setFieldTouched('city',false);
                              setFieldTouched('county',false);
                              setFieldTouched('postcode',false);
                              this.goNext();
                            });
                        } else {
                          this.setState({slideHeights},function() {
                            handleSubmit();
                            setFieldTouched('date_of_birth',true);
                          });
                        }
                      }} title={trans('auth.next')} />
                    </View>
                  </View>
                </View>
                <View style={styles.slide} key="slide2" onLayout={(event) =>this.handleSlideHeight('slide2', event, errors)}>
                  <View style={styles.slideContainer}>
                    <FormInput type="text" name="address1" label={trans('auth.address1')} autoCapitalize="words" textContentType="streetAddressLine1" />
                    <FormInput type="text" name="address2" label={trans('auth.address2')} autoCapitalize="words" textContentType="streetAddressLine2" />
                    <FormInput type="text" name="city" label={trans('auth.town')} autoCapitalize="words" textContentType="addressCity" />
                    <FormInput type="text" name="county" label={trans('auth.county')} autoCapitalize="words"  />
                    <FormInput type="text" name="postcode" label={trans('auth.postcode')} autoCapitalize="characters" textContentType="postalCode" />
                  </View>
                  <View style={styles.buttonContainerStyle}>
                      <Button onPress={() => {
                        if (values.address1 && values.city && values.county && values.postcode
                          && !errors.address1 && !errors.address2 && !errors.city && !errors.county && !errors.postcode) {
                            setFieldTouched('password',false);
                            setFieldTouched('confirm_password',false);
                            this.goNext();
                        } else {
                          const slideHeights = {
                            ...this.state.slideHeights,
                            'slide2': 'auto',
                          };
                          this.setState({slideHeights});
                          handleSubmit();
                        }
                      }} title={trans('auth.next')} />
                  </View>
                </View>
                <View style={styles.slide} key="slide3" onLayout={(event) =>this.handleSlideHeight('slide3', event, errors)}>
                  <View style={styles.slideContainer}>
                    <FormInput password={true} type="text" name="password" label={trans('auth.password')} textContentType="newPassword" />
                    <FormInput password={true} type="text" name="confirm_password" label={trans('auth.password_confirmation')} textContentType="password" />
                    <View style={styles.buttonContainerStyle}>
                      <Button onPress={() => {
                        if (values.password && values.confirm_password
                          && !errors.password && !errors.confirm_password) {
                            handleSubmit();
                        } else {
                          const slideHeights = {
                            ...this.state.slideHeights,
                            'slide3': 'auto',
                          };
                          setFieldTouched('password');
                          setFieldTouched('confirm_password');
                          this.setState({slideHeights});
                        }
                      }} title={trans('auth.next')} />
                    </View>
                  </View>
                </View>
                <View style={styles.slide} key="slide4" onLayout={(event) =>this.handleSlideHeight('slide4', event, errors)}>
                  <View style={styles.slideContainer}>
                    <Text style={styles.codeHeadlineStyle}>
                      {trans('auth.enter_code')}
                    </Text>
                    <FormInput password={true} type="text" name="code" label={trans('auth.code')} />
                    <View style={styles.buttonContainerStyle}>
                      <Button onPress={() => {
                        this.props.navigation.navigate('ConfirmAccount',{message:'Thank you for registration, please confirm your email address.'});
                      }} title={trans('auth.confirm')} />
                    </View>
                  </View>
                </View>
              </Swiper>
              </AuthContext.Provider>
        )}
      </Formik>
        <Text style={{ ...styles.footerStyle, ...styles.linkStyle }} onPress={() => navigate('SignIn')}>{trans('auth.back_to_login')}</Text>
      <Text style={{...styles.footerStyle,...styles.tocStyle}}>{toc_Text}</Text>
    </AuthView>
    );
  }
}

const styles = authStyles();
