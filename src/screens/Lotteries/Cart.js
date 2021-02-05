import React, { Component } from 'react';
import {
    StyleSheet,
} from 'react-native';
import ContentWrapper from '../../components/ContentWrapper';

import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize,
} from 'react-native-responsive-dimensions';

export default class Cart extends Component {
    state = {
        styles: StyleSheet.create({
        }),
    }
    render() {
        return (
            <ContentWrapper title="Cart">
            </ContentWrapper>
        );
    }
}
