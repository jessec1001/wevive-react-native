import {colors, client_name} from './../../app.json';
import {ClientContext} from '../context/ClientContext';
import { useContext } from 'react';

export default function Config(props) {
    const {client} = useContext(ClientContext);
    const ret =  {
        colors:{
            ...colors,
            main: client.main_color,
            secondary: client.secondary_color,
            auxiliary_color: client.auxiliary_color,
        },
        client_name,
    };
    return ret;
}