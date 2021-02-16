
import React, { Component } from 'react';
import ReactNativeBiometrics from 'react-native-biometrics';
import { createContext, useContext, useState, useEffect } from 'react';
import APIService from '../service/APIService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BioIDContext = createContext();

export function BioID(props) {
    const [available, setAvailable] = useState(false);
    const [keysExist, setKeysExist] = useState(false);
    const [ready, setReady] = useState(false);
    function toggleAvailable(available) {
        setAvailable(available);
    }
    function isAvailable() {
        return ReactNativeBiometrics.isSensorAvailable()
         .then((resultObject) => {
           const { available:sensorAvailable, biometryType } = resultObject;
           if (sensorAvailable && biometryType === ReactNativeBiometrics.TouchID) {
             return true;
           } else if (sensorAvailable && biometryType === ReactNativeBiometrics.FaceID) {
             return true;
           } else if (sensorAvailable && biometryType === ReactNativeBiometrics.Biometrics) {
             return true;
           } else {
             return false;
           }
         }).catch(() => {
           return false;
         });
    }
    useEffect(() => {
        isAvailable().then((sensorAvailable)=> {
            setAvailable(sensorAvailable);
            if (sensorAvailable) {
                _keysExist().then((isExists)=> {
                    setReady(true);
                    setKeysExist(isExists);
                });
            } else {
                setReady(true);
            }
        });
    },[]);
    function _keysExist() {
        return ReactNativeBiometrics.biometricKeysExist()
        .then((resultObject) => {
            const { keysExist } = resultObject;
            setKeysExist(keysExist);
            if (keysExist) {
                return true;
            } else {
                return false;
            }
        }).catch(() => {
        return false;
        });
    }

    function createKeys() {
        return new Promise((resolve,reject)=> {
            ReactNativeBiometrics.createKeys('Confirm fingerprint')
                .then((resultObject) => {
                    const { publicKey } = resultObject;
                    AsyncStorage.getItem('userToken').then((userToken)=>{
                        AsyncStorage.setItem('bioAccessToken', userToken);
                    });
                    AsyncStorage.getItem('refreshToken').then((refreshToken)=>{
                        AsyncStorage.setItem('bioRefreshToken',refreshToken);
                    });
                    /*APIService('users/biometrics/',{publicKey}).then((result)=>{
                        resolve(result);
                    }).catch((error)=>{
                        reject(error);
                    });*/
                }).catch(() => {
                    return false;
                });
        });
    }


    function deleteKeys() {
        AsyncStorage.removeItem('bioAccessToken');
        AsyncStorage.removeItem('bioRefreshToken');
        ReactNativeBiometrics.deleteKeys()
        .then((resultObject) => {
        const { keysDeleted } = resultObject;
        if (keysDeleted) {
            return true;
        } else {
            return false;
        }
        }).catch(() => {
        return false;
        });
    }

    function signMessage(message, promptMessage = 'Sign in') {
        let epochTimeSeconds = Math.round((new Date()).getTime() / 1000).toString();
        let payload = epochTimeSeconds + message;
        return ReactNativeBiometrics.createSignature({
            promptMessage,
            payload: payload,
        })
        .then((resultObject) => {
            const { success, signature } = resultObject;
            if (success) {
                return {signature, payload};
            } else {
                return false;
            }
        }).catch((e) => {
            if (!e.toString().indexOf('-128')) {
                setKeysExist(false);
            }
            return false;
        });
    }

    function prompt(promptMessage = 'Confirm fingerprint') {
        return ReactNativeBiometrics.simplePrompt({promptMessage})
        .then((resultObject) => {
            const { success } = resultObject;
            return success;
        })
        .catch(() => {
            return false;
        });
    }

    function toggleBioID() {
        isAvailable().then((isAvailable)=> {
            if (!isAvailable) {
                toggleAvailable(false);
                return false;
            } else {
                toggleAvailable(true);
            }
            _keysExist().then((keysExist) => {
                if (keysExist) {
                    prompt('Please confirm to disable automatic sign in').then((success) => {
                        if (success) {
                            setKeysExist(false);
                            return deleteKeys();
                        }
                    });

                } else {
                    prompt('Please confirm to enable automatic sign in').then((success) => {
                        if (success) {
                        setKeysExist(true);
                        return createKeys();
                        }
                    });
                }
            });
        });
    }

    return (
      <BioIDContext.Provider
        value={{ ready, available, toggleAvailable, keysExist,_keysExist, toggleBioID, prompt, signMessage }}
      >{props.children}</BioIDContext.Provider>
    );
}
