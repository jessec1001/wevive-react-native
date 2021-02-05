import React, { useContext } from 'react';
import {
    Alert,
    StyleSheet,
    View,
    Text,
} from 'react-native';
import ContentWrapper from '../../components/ContentWrapper';

import {
    responsiveWidth,
} from 'react-native-responsive-dimensions';

import Content from '../../components/Content';
import Button from '../../components/Button';
import UserBalance from '../../components/Account/UserBalance';
import Details from '../../components/Lottery/Details';
import Description from '../../components/Lottery/Description';
import trans from '../../utils/trans';

import FormInput from '../../components/FormInput';
import { Formik } from 'formik';
import * as yup from 'yup';
import {ecom_website} from "../../../app.json";
import { AuthContext } from '../../context/AuthContext';
import form_styles from '../../styles/forms';
import APIService from '../../service/APIService';
const validationSchema = {
    count: yup
      .string()
      .min(1)
      .required(),
};
import {colors} from '../../../app.json';
import { UserContext } from '../../context/UserContext';
import AsyncStorage from '@react-native-community/async-storage';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { Linking } from 'react-native';
export default function Purchase(props) {
    const {updateMe} = useContext(UserContext);
    const lottery = props.route.params?.lottery;
    if (!lottery) {return null;}
    const available_tickets = lottery.user_ticket_maximum ? lottery.user_ticket_maximum - lottery.user_ticket_count : 5;
    const available_tickets_select = {};
    for (var i = 0; i < available_tickets; i++) {
        available_tickets_select[i + 1] = `${i + 1}: £` + (lottery.ticket_price * (i + 1)).toFixed(2);
    }
    const openURL = async (url) => {
        Linking.openURL(url).then(() => {
            this.updateMe();
        });
    }
    const openURLInApp = async (url) => {
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
              }).then(() => {
                  this.updateMe();
              });
              //Alert.alert(JSON.stringify(result));
            }
            else {
              //Linking.openURL(url);
            }
          } catch (error) {
            //Alert.alert(error.message);
          }
    }
    const purchaseTicket = async (draw, count) => {
        //this.props.navigation.navigate("AddFunds");
        const token = await AsyncStorage.getItem('userToken');
        openURL(ecom_website + 'addfunds/#token=' + token + "&draw="+ draw + "&count=" + count);
    }
    return (
        <ContentWrapper title="Purchase">
            <Content>
                <UserBalance text={trans('lottery.number_of_tickets',{count: lottery.user_ticket_count})} size={responsiveWidth(22)} style={styles.userBalance}  color="rgb(184, 68, 180)" />
                <Description description={lottery.description}/>
                <Details
                    price={'£' + lottery.ticket_price}
                    draw={lottery.id}
                    cta={lottery.draw_cta || trans('lottery.default_cta')}
                    status={lottery.status}
                    maxTickets={lottery.user_ticket_maximum}
                    openingDate={lottery.start_date}
                    closingDate={lottery.end_date}
                />
                <Formik
                    initialValues={{ }}
                    onSubmit={(values, actions) => {
                        purchaseTicket(lottery.id, values.count);
                        /*
                        global.appIsLoading();
                            APIService('draws/' + lottery.id + '/buy_tickets/',
                                {
                                    count: values.count,
                                }
                            ).then((result) => {
                                global.appIsNotLoading();
                                updateMe();
                                if (result === 'OK') {
                                    props.navigation.navigate('LotteryTickets',{lottery:props.route.params.lottery});
                                } else {
                                    Alert.alert('Error', 'Please try again later');
                                }
                            });
                        */
                    }}
                    validationSchema={yup.object().shape(validationSchema)}
                >
                {({ values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, setFieldValue }) => (

                    <AuthContext.Provider value={{ styles:styles, values, handleChange, errors, setFieldTouched, touched, isValid, handleSubmit, setFieldValue }}>
                        {available_tickets > 0 ?
                        <>
                        <FormInput type="select" values={available_tickets_select} name="count" label={trans('lottery.tickets')} />

                        <View style={styles.buttonContainerStyle}>
                            <Button onPress={handleSubmit} title={trans('lottery.checkout')} />
                        </View>
                        </>
                        :
                        lottery.user_ticket_count > 0 ?
                        <>
                            <Text style={styles.errorText}>
                                {trans('lottery.number_of_tickets',{count:lottery.user_ticket_count})}.
                            </Text>
                            <Text style={styles.errorDescription}>{trans('lottery.max_amount_of_tickets',{count:lottery.user_ticket_count})}.</Text>
                        </>
                        : null

                        }
                    </AuthContext.Provider>

                )}
                </Formik>
            </Content>
        </ContentWrapper>
    );
}


const styles =  {
    ...form_styles(),
    ...StyleSheet.create({
        userBalance: {
            position: 'absolute',
            right: -20,
            top: -10,
        },
        errorText: {
            textAlign: 'center',
            color: colors.textMain,

        },
        errorDescription: {
            textAlign: 'center',
            color: colors.textMain,
        },
    }),
};
