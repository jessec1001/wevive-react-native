import React, {useContext } from 'react';
import {
  ImageBackground,
} from 'react-native';

import {ClientContext} from '../context/ClientContext';
import {logo as defaultLogo} from "../../globals";

export default function ClientLogo(props) {
  const {client} = useContext(ClientContext);
  const getSource = () => {
    if (props.source && props.source.uri) {
      return {uri: props.source.uri};
    }
    if (client?.logo_url) {
      return {uri: client.logo_url};
    }
    return defaultLogo;
  }
  return (
    <ImageBackground style={props.style}
      imageStyle={props.imageStyle}
      source={getSource()}
    />
  );
}