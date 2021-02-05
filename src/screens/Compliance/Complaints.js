import React, { useContext } from 'react';
import ContentWrapper from '../../components/ContentWrapper';
import Content from '../../components/Content';
import contentStyles from '../../styles/content';
import { ClientContext } from '../../context/ClientContext';
import HTML from 'react-native-render-html';
import { responsiveWidth } from 'react-native-responsive-dimensions';

export default function  Complaints() {
    var styles = contentStyles();
    const {client} = useContext(ClientContext);
    return (
        <ContentWrapper title="Complaints">
            <Content>
                <HTML style={styles.contentText} html={client.complaints} contentWidth={responsiveWidth(80)} />
            </Content>
        </ContentWrapper>
    );
}
