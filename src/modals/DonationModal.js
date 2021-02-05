import React, {Component, Fragment} from 'react';
import {
  Text,
  Keyboard,
  View,
  Image,
  Alert,
  StyleSheet,
  Platform,
  Linking,
  TouchableWithoutFeedback,
} from 'react-native';
import Modal from 'react-native-modal';
import * as yup from 'yup';
import {Formik} from 'formik';
import {WebView} from 'react-native-webview';
import {
  CreditCardInput,
} from 'react-native-credit-card-input';

const topHeadline = 'Add funds';
const headline = '';

const errorText = `There was an error
processing your transaction.
Please try again.`;
const errorHeadline = 'Error!';
const thankYouHeadline = 'Thank you';
const thankYouText = 'You can now spend your funds for buying tickets';

import APIService from '../service/APIService';
//import PaypalService from "../service/PaypalService";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Button from '../components/ContentButton';
//import Icon from '../components/Icon';
import {CardIOModule, CardIOUtilities} from 'react-native-awesome-card-io';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {TouchableHighlight} from 'react-native-gesture-handler';
import ECOMService from '../service/ECOMService';
import ECOMHostedService from '../service/ECOMHostedService';
import ApplePayService from '../service/ApplePayService';
import Icon from '../components/Icon';
import { UserContext } from '../context/UserContext';
export default class DonationModal extends Component {
  componentDidMount() {
    if (Platform.OS === 'ios') {
      CardIOUtilities.preload();
      //NativePayments.canMakePayments().then((can) => {
        this.setState({applePay: true});
      //});
    }

    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow.bind(this),
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide.bind(this),
    );
  }
  state = {
    applePay: false,
    loading: false,
    loadingText: 'Loading..',
    paymentMethod: null,
    amount: this.props?.amount,
    creditCardValid: false,
    creditCardData: null,
    donationCompleted: false,
    url: null,
    isVisible: false,
    keyboardShown: false,
    scanCard: false,
    errorMessage: "",
  };
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow() {
    this.setState({keyboardShown: true});
  }

  _keyboardDidHide() {
    this.setState({keyboardShown: false});
  }

  openDonationWebView(url) {
    this.setState({url});
  }
  handleWebViewMessage(message) {
    if (message.nativeEvent.data === 'SUCCESS') {
      this.setState({donationCompleted: 1});
      this.context.updateMe();
    } else if (message.nativeEvent.data === 'ERROR') {
      this.setState({donationCompleted: 2});
      this.context.updateMe();
    }
  }
  async openURL(url) {
    try {
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.open(url, {
          // iOS Properties
          /*dismissButtonStyle: 'cancel',
          preferredBarTintColor: '#453AA4',
          preferredControlTintColor: 'white',
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'fullScreen',
          modalTransitionStyle: 'coverVertical',
          modalEnabled: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          toolbarColor: '#6200EE',
          secondaryToolbarColor: 'black',
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
          // Specify full animation resource identifier(package:anim/name)
          // or only resource name(in case of animation bundled with app).
          animations: {
            startEnter: 'slide_in_right',
            startExit: 'slide_out_left',
            endEnter: 'slide_in_left',
            endExit: 'slide_out_right'
          },*/
        });
        Alert.alert(JSON.stringify(result));
      }
      else {
        Linking.openURL(url);
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  }
  scanCard() {
    CardIOModule.scanCard({
      hideCardIOLogo: true,
      suppressManualEntry: true,
      requireCVV: false,
      requireExpiry: true,
      suppressConfirmation: true,
    })
      .then((card) => {
        var expiry = '';
        if (card.expiryMonth > 0) {
          if (card.expiryMonth < 10) {
            card.expiryMonth = '0' + card.expiryMonth.toString();
          }
          expiry =
            card.expiryMonth.toString() +
            '/' +
            card.expiryYear.toString().substring(2, 4);
        }
        this.CCINPUT.setValues({number: card.cardNumber, expiry: expiry});
      })
      .catch(() => {
        // the user cancelled
      });
  }
  async sendCardToEcom(data) {
    return ECOMService(data)
      .then((result) => {
        if (result.url) {
          this.openDonationWebView(result.url);
        } else if (result.responseCode > 0) {
          APIService('log', {type: 'payment_error', data: result});
          this.setState({donationCompleted: 2, errorMessage: 'Error:' + result.responseCode + '|' + result.responseMessage });
          this.context.updateMe();
        } else {
          this.setState({donationCompleted: true});
          this.context.updateMe();
        }
      })
      .catch((error) => {
        global.appIsNotLoading();
      });
  }
  handlePaymentMethodSelection(values) {
    global.appIsLoading();
    if (this.paymentMethod !== 'Paypal') {
      this.sendCardToEcom({...values, ...this.state.creditCardData}).then(
        (ecom_response) => {
          global.appIsNotLoading();
          APIService(
            'donations',
            {data: {...values}},
            false,
          ).then((result) => {});
        },
      );
    } else {
      //PaypalService(values);
    }
  }
  async ApplePay(data) {
    if (data.amount < 0.50) {
      Alert.alert('Minimum amount for Apple Pay donations is £0.50');
      return;
    }
    //const uniqueID = await createDonation(data);
    ApplePayService(data).show()
      .then((paymentResponse) => {
          ECOMService({...data, token: JSON.stringify(paymentResponse._details.paymentData)})
          .then((result) => {
            if (result.responseCode > 0) {
              APIService('log', {type: 'payment_error', data: result});
              this.setState({donationCompleted: 2, errorMessage: 'Error:' + result.responseCode + '|' + result.responseMessage });
              this.context.updateMe();
            } else {
              this.setState({donationCompleted: true});
              this.context.updateMe();
            }
            paymentResponse.complete('success');
          });
      })
      .catch((error) => {
        //this.failedDonation('stripe_error',{error,data});
        this.setState({donationCompleted: 2});
    });
  }
  CreditCardInputChange = (data) => {
    this.setState({creditCardValid: data.valid});
    if (data.valid) {
      this.setState({creditCardData: data.values});
    } else {
      this.setState({creditCardData: null});
    }
  };
  selectPaymentMethod = (method) => {
    this.setState({paymentMethod: method});
  };
  closeButton = () => {
    global.toggleDonationModal();
    this.setState({
      // paymentMethod: null,
      donationCompleted: false,
      url: null,
    });
  };
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.isVisible === true && prevState.isVisible === false) {
      return {...prevState, isVisible: nextProps.isVisible, scanCard: true};
    }
    return {...prevState, isVisible: nextProps.isVisible, scanCard: false};
  }
  startPayment = () => {
    this.scanCard();
    /*
    ECOMHostedService({amount: this.props.amount}).then((url)=> {
      console.error(url);
      this.openURL(url);
    });
    */
  }
  render() {
    if (this.state.scanCard) {
      //this.startPayment();
    }
    return (!this.state.donationCompleted ? (
        <Modal
          isVisible={this.state.isVisible}
          style={
            this.state.keyboardShown
              ? styles.modalStyleWithKeyboard
              : styles.modalStyle
          }
          coverScreen={false}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContentStyle}>
              <Icon
                name="closeicon"
                size={20}
                style={styles.closeButton}
                onPress={() => {
                  this.closeButton();
                }}
              />
              <Formik
                initialValues={{amount: this.props.amount, email: ''}}
                onSubmit={this.handlePaymentMethodSelection}
                validationSchema={yup.object().shape({
                })}>
                {({
                  setFieldValue,
                  values,
                  handleChange,
                  errors,
                  setFieldTouched,
                  touched,
                  isValid,
                  handleSubmit,
                }) =>
                  this.state.paymentMethod == null ? (
                    <Fragment>
                      <Text style={styles.topHeadline}>
                        {topHeadline}
                      </Text>
                      <Text style={styles.headline}>{headline}</Text>
                      {this.state.applePay &&
                        <View>
                          <ApplePayButton
                            type="plain"
                            onPress={() => {
                              this.ApplePay(values);
                            }}
                          />
                        </View>
                        }
                      <View style={styles.buttonWrapper}>
                        <View style={styles.cardButtonStyle}>
                          <Button
                            title="Card"
                            onPress={() => this.selectPaymentMethod('CARD')}
                            size="big"
                            borderRadius={50}
                          />
                        </View>
                      </View>
                    </Fragment>
                  ) : !this.state.url ? (
                      <View>
                        <Text style={styles.topHeadline}>
                          {topHeadline}
                        </Text>
                        <Text style={styles.headline}>{headline}</Text>
                      <CreditCardInput
                        onChange={this.CreditCardInputChange}
                        placeholderColor={'#9a9a9a'}
                        labelStyle={styles.cardLabelStyle}
                        inputStyle={styles.cardInputStyle}
                        cardScale={0.9}
                        inputContainerStyle={
                          styles.cardInputContainerStyle
                        }
                          placeholders={{
                            number: 'Card Number',
                          }}
                          labels={{
                            name: "CARDHOLDER'S NAME",
                            number: ' ',
                            expiry: 'EXPIRY',
                            cvc: 'CVC/CCV',
                            postalCode: 'POSTAL CODE',
                          }}
                        ref={(ref) => {
                          this.CCINPUT = ref;
                        }}
                      />
                      <Button
                        size="big"
                        title="Add Funds"
                        borderRadius={150}
                        disabled={!this.state.creditCardValid}
                        onPress={() => this.handlePaymentMethodSelection(values)}
                      />
                    </View>
                  ) : (
                    <>
                      <View style={{height: responsiveHeight(40)}}>
                        <WebView
                          automaticallyAdjustContentInsets={false}
                          source={{url: this.state.url}}
                          originWhitelist={['*']}
                          style={{width: responsiveWidth(80), height: 200}}
                          injectedJavaScript={
                            "const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=0.75, maximum-scale=0.75, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); window.ReactNativeWebView.postMessage(document.title); "
                          }
                          scalesPageToFit={false}
                          scrollEnabled={true}
                          onMessage={this.handleWebViewMessage.bind(this)}
                        />
                      </View>
                    </>
                  )
                }
              </Formik>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      ) : (
        <Modal
          isVisible={this.props.isVisible}
          style={styles.completedModalStyle}
          coverScreen={false}>
          <Icon
            name="closeicon"
            size={32}
            style={styles.closeButton}
            onPress={() => {
              this.closeButton();
            }}
          />
          <View style={{flex: 1}}>
            <Text style={styles.thankYouHeadline}>
              {this.state.donationCompleted === 2
                ? errorHeadline
                : thankYouHeadline}
            </Text>
            <Text style={styles.thankYouText}>
              {this.state.donationCompleted === 2 ? errorText : thankYouText}
            </Text>
            <Text style={styles.errorDetails}>
              {this.state.errorMessage}
            </Text>
            <Button
              title="Done"
                size="big"
                borderRadius={50}
              onPress={() => {
                this.closeButton();
              }}
              style={styles.buttonStyle}
            />
          </View>
        </Modal>
      ));}
}

DonationModal.contextType = UserContext;

const styles = StyleSheet.create({
  spinnerStyle: {
    color: 'black',
    overlayColor: 'rgba(0, 0, 0, 0.05)',
  },
  spinnerTextStyle: {
    color: 'black',
  },
  switchStyle: {
    transform: [
      {scaleX: Platform.OS == 'android' ? 1.6 : 0.9},
      {scaleY: Platform.OS == 'android' ? 1.6 : 0.9},
    ],
    left: 3,
    top: 5,
    position: 'absolute',
    //top:1,
    //left:1,
  },
  modalStyle: {
    //padding:responsiveHeight(3),
    //paddingTop: responsiveHeight(1),
    flex: 1,
  },
  modalStyleWithKeyboard: {
    top: -100,
    flex: 1,
  },
  modalContentStyle: {
    opacity: Platform.OS == 'android' ? 1 : 0.9,
    backgroundColor: '#ffffff',
    borderRadius: responsiveWidth(3),
    padding: responsiveHeight(2),
  },
  completedModalStyle: {
    opacity: Platform.OS == 'android' ? 1 : 0.9,
    backgroundColor: '#ffffff',
    borderRadius: responsiveWidth(3),
    padding: responsiveHeight(3),
    marginTop: responsiveHeight(30),
    marginBottom: responsiveHeight(30),
    paddingTop: responsiveHeight(1),
  },
  buttonStyle: {
    backgroundColor: 'black',
    height: 100,
  },
  closeButton: {
    color: '#000000',
    fontSize: responsiveFontSize(4),
    position:'absolute',
    right: responsiveWidth(3),
    top: responsiveWidth(3),
    zIndex: 99,
  },
  inputStyle: {
    textAlign: 'left',
    fontSize: responsiveHeight(2.5),
    padding: 0,
    marginTop: responsiveHeight(0.5),
    //fontFamily: 'Adelle',
    color: 'black',
  },
  inputContainerStyle: {
    marginBottom: responsiveHeight(0.5),
    width: '100%',
  },
  errorStyle: {
    fontSize: responsiveFontSize(1.35),
    color: '#be0000',
    marginBottom: responsiveHeight(1),
  },
  cardLabelStyle: {
    color: 'gray',
    textTransform: 'capitalize',
    fontSize: responsiveFontSize(1),
    position: 'absolute',
    left: 3,
    top: 2,
    opacity: 1,
  },
  cardInputStyle: {
    color: 'black',
    fontSize: responsiveHeight(2.5),
  },
  cardInputContainerStyle: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 8,
    borderColor: '#9a9a9a',
    borderWidth: 1,
  },
  topHeadline: {
    color: '#000000',
    marginTop: responsiveHeight(2),
    fontSize: responsiveFontSize(3.5),
    marginBottom: responsiveHeight(1),
    //fontFamily: 'Adelle-Bold',
    fontWeight: '900',
  },
  headline: {
    color: '#000000',
    fontSize: responsiveFontSize(2),
    marginBottom: responsiveHeight(1.5),
  },
  label: {
    color: '#000000',
    fontSize: responsiveFontSize(2.3),
    marginTop: responsiveHeight(1),
  },
  paybylabel: {
    color: '#000000',
    fontSize: responsiveFontSize(2.3),
    marginTop: responsiveHeight(4),
    marginBottom: -responsiveHeight(2),
  },
  thankYouHeadline: {
    color: '#000000',
    fontSize: responsiveFontSize(5),
    marginTop: responsiveWidth(10),
    textAlign: 'center',
    //fontFamily: "Adelle-Bold",
  },
  thankYouText: {
    color: '#000000',
    fontSize: responsiveFontSize(2.3),
    textAlign: 'center',
    lineHeight: responsiveFontSize(2.5),
  },
  errorDetails: {
    color: '#000000',
    fontSize: responsiveFontSize(1),
    marginTop: responsiveWidth(2),
    textAlign: 'center',
  },
  switchLabel: {
    color: '#000000',
    //position: 'absolute',
    left: responsiveWidth(16.5),
    fontSize: responsiveFontSize(1.65),
    width: responsiveWidth(40),
    top: 8,
  },
  inputInputContainerStyle: {
    borderRadius: 8,
    borderColor: '#9a9a9a',
    borderWidth: 1,
  },
  cardButtonStyle: {
    width: '100%',
  },
  paypalButton: {
    width: responsiveWidth(20),
    height: responsiveWidth(20) / 3.76,
  },
  paypalButtonWrapper: {
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#bebebe',
    borderRadius: 50,
    top: 20,
    marginLeft: 20,
  },
  buttonWrapper: {
    flexDirection: 'row',
    height: responsiveHeight(10),
  },
});
