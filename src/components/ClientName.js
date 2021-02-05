import React, {useContext } from 'react';
import {
  Text,
} from 'react-native';

import {ClientContext} from '../context/ClientContext';

export default function ClientName(props) {
  const {client} = useContext(ClientContext);
  return (
    <Text style={props.style}>{client.name}</Text>
  );
}