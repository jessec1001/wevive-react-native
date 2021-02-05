import { format, parseISO } from 'date-fns';
import React, { Component } from 'react';
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
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { AuthContext } from '../../context/AuthContext';
import form_styles from '../../styles/forms';
import APIService from '../../service/APIService';
import AsyncStorage from '@react-native-community/async-storage';
import HTML from 'react-native-render-html';

export default class SupportTickets extends Component {
    state = {
        styles: {
            ...form_styles(),
            errorStyle: {
                color: 'black',
                paddingHorizontal: responsiveWidth(7),
            },
            subject: {
                fontWeight: '900',
            },
            description: {
                fontWeight: '300',
                fontSize: responsiveFontSize(1.7),
                marginVertical: responsiveWidth(3),
                marginHorizontal: responsiveWidth(1.5),
            },
            response: {
                fontSize: responsiveFontSize(1.5),
                textDecorationStyle: 'solid',
                marginLeft: responsiveWidth(2.5),
            },
            tagsStyles: {
                p: {
                    margin: 0,
                    padding: 0,
                    textDecorationStyle: 'solid',
                },
                span: {
                    textDecorationStyle: 'solid',
                },
            },
            headline: {
                flexDirection: 'row',
                justifyContent: "space-between"
            },
            createdAt: {
                fontSize: responsiveFontSize(1.0),
                top: 5
            },
            respondedAt: {
                fontSize: responsiveFontSize(1.2),
                textAlign: "right",
            }
        },
        supportTickets: [],
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
        APIService('support-tickets/me/').then((supportTickets)=>{
            this.setState({supportTickets});
        });
    }
    clearHTML(ticket) {
        return ticket.replace(/text[^;]*?initial;/g, '')
                .replace(/&quot;/g,"'")
                .replace(/font-family:[^;]*;/g, '');
    }
    renderSupportTicketResponse(ticket) {
        const createdAt = format(parseISO(ticket.created_at),'MMMM dd yyyy HH:mm');
        return <>
            <View style={this.state.styles.response}>
                <HTML html={this.clearHTML(ticket.message)} contentWidth={responsiveWidth(80)} tagsStyles={this.state.styles.tagsStyles} />
            </View>
            <Text style={this.state.styles.respondedAt}>Responded at: {createdAt}</Text>
        </>;
    }
    renderSupportTicket(ticket) {
        const createdAt = format(parseISO(ticket.created_at),'MMMM dd yyyy HH:mm');
        return <Content>
            <View style={this.state.styles.headline}>
                <Text style={this.state.styles.subject}>{ticket.category}: {ticket.subject}</Text>
                <Text style={this.state.styles.createdAt}>{createdAt}</Text>
            </View>
            <Text style={this.state.styles.description}>{ticket.description}</Text>
            {ticket.supportticketresponses.map(t=>this.renderSupportTicketResponse(t))}
        </Content>;
    }
    render() {
        return (
            <ContentWrapper title="Support Tickets" center={true}>
                {this.state.supportTickets.map(t=>this.renderSupportTicket(t))}
            </ContentWrapper>
        );
    }
}
