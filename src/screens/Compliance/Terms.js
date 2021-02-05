import React, { useContext } from 'react';
import ContentWrapper from '../../components/ContentWrapper';
import Content from '../../components/Content';
import contentStyles from '../../styles/content';
import { ClientContext } from '../../context/ClientContext';
import HTML from 'react-native-render-html';
import { responsiveWidth } from 'react-native-responsive-dimensions';

export default function  Terms() {
    var styles = contentStyles();
    const {client} = useContext(ClientContext);
    return (
        <ContentWrapper title="Terms & Conditions">
            <Content>
                <HTML style={styles.contentText} html={client.tos} contentWidth={responsiveWidth(80)} />
            </Content>
        </ContentWrapper>
    );
}
