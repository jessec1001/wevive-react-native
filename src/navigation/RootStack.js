import React, {useState} from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {
  NavigationContainer,
  DefaultTheme,
  getStateFromPath,
} from '@react-navigation/native';

import AppBootstrap from './AppBootstrap';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import {CommonActions} from '@react-navigation/native';
import {domainReversed, deepLinkURL} from '../../app.json';
import {
  UserContext as AppUserContext,
  AppThemeContext,
} from '../context/UserContext';
let rootLoaded = false;
const forFade = ({current}) => ({
  cardStyle: {opacity: current.progress},
});

const defaultConfig = {
  headerShown: false,
  cardStyleInterpolator: forFade,
};

const verticalConfig = {
  headerShown: false,
  cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
};

const MainStack = createStackNavigator();
const config = {
  screens: {
    AppBootstrap: 'loading',
    Auth: {
      screens: {
        SignIn: 'signin',
        ConfirmAccount: 'confirm',
      },
    },
    App: {
      screens: {
        Main: {
          screens: {
            Account: 'account',
          },
        },
      },
    },
    //Account: 'account',
  },
};
const linking = {
  prefixes: [domainReversed + '://app/', deepLinkURL],
  config,
  getStateFromPath: (path, options) => {
    return getStateFromPath(path, options);
  },
};

import {StackActions} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import APIService from '../service/APIService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import deepEqual from 'deep-equal';
let i = 0;
const RootStack = ({initialProps}) => {
  let goBackFunction = () => {
    if (themeSettings.backFunction) {
      themeSettings.backFunction();
    } else {
      if (navigationRef.current.goBack) {
        navigationRef.current?.dispatch(StackActions.pop(1));
      } else {
        const tryToPop = navigationRef.pop();
        if (!tryToPop) {
          //AsyncStorage.removeItem('userToken');
          navigationRef.navigate('SignIn');
        }
      }
    }
  };
  React.useEffect(() => {
    if (navigationRef.current && initialProps?.url?.room) {
      navigationRef.current.navigate('VideoCalls', {
        callId: initialProps.url.room,
        video: true,
      });
    }
  },[navigationRef, initialProps]);
  const [themeSettings, setThemeSettings] = useState({
    hiddenBack: true,
    hiddenHeader: false,
    canGoBack: false,
  });
  const [goBack, setGoBack] = useState(() => () => {
    goBackFunction();
  });
  const onStateChange = (navState, backFunction) => {
    const changedTheme = {...themeSettings};
    const routeName = navState.name;
    if (routeName === 'VideoCalls') {
      if (!themeSettings.hiddenHeader) {
        changedTheme.hiddenHeader = true;
        changedTheme.hiddenFooter = true;
      }
    } else {
      if (themeSettings.hiddenHeader) {
        changedTheme.hiddenHeader = false;
        changedTheme.hiddenFooter = false;
      }
    }
    if (routeName === 'ContactsScreen' || routeName === 'Main') {
      changedTheme.hiddenBack = true;
    } else {
      changedTheme.hiddenBack = false;
    }
    const sameTheme = deepEqual(changedTheme, themeSettings);
    if (!sameTheme) {
      setThemeSettings(changedTheme);
    }
    return true;
  };

  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();
  global.navigation = navigationRef.current;
  const [authData, setAuthData] = useState(null);
  const updateMe = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken) {
      APIService('users/me/', null, 5)
        .then((result) => {
          setAuthData(result);
        })
        .catch(() => {
          AsyncStorage.removeItem('userToken');
          navigationRef.current.navigate('Auth', {
            screen: 'SignIn',
            params: {
              BioID: false,
            },
          });
        });
    }
  };
  React.useEffect(() => {
    //updateMe();
  }, []);

  //resendFailed {"avatar": "https://fra1.digitaloceanspaces.com/wevive-staging/user/a705599c-1798-46cc-85f7-27b844d4793d.png", "color": null, "id": "7", "lastOnline": "2021-05-06T22:23:18.793Z", "name": "Michail", "public_key": null, "salt": "SALT", "status": null, "username": "+79211474434"} 
  const [avatarUrl, setAvatarUrl] = React.useState(false);
  //AsyncStorage.getItem('avatarUrl').then((URL) => {
  //  if (URL) {
  //    setAvatarUrl(URL.slice(1, -1));
  //  }
  //});
  if (!authData) {
    AsyncStorage.getItem('userId').then((userId) => {
      if (userId && !rootLoaded) {
        rootLoaded = true;
        setAuthData({id: userId});
      }
    });
  }
  const appUserContextValue = {authData, setAuthData, updateMe, avatarUrl};
  const insets = useSafeAreaInsets();
  return (
    <AppUserContext.Provider value={appUserContextValue}>
      <AppThemeContext.Provider value={{themeSettings, goBack, insets}}>
        <NavigationContainer
          theme={DefaultTheme}
          linking={linking}
          ref={navigationRef}
          onReady={() => {
            routeNameRef.current = navigationRef.current.getCurrentRoute().name;
          }}
          onStateChange={() => {
            const currentRoute = navigationRef.current.getCurrentRoute();

            // Save the current route name for later comparision
            routeNameRef.current = currentRoute.name;
            onStateChange(
              currentRoute,
              navigationRef.current.canGoBack()
                ? () => {
                    navigationRef.current.goBack();
                  }
                : null,
            );
          }}>
          <MainStack.Navigator
            initialRouteName="AppBootstrap"
            screenOptions={{gestureEnabled: false}}>
            <MainStack.Screen
              name="AppBootstrap"
              component={AppBootstrap}
              options={defaultConfig}
            />
            <MainStack.Screen
              name="Auth"
              component={AuthStack}
              options={defaultConfig}
            />
            <MainStack.Screen
              name="App"
              component={AppStack}
              options={defaultConfig}
            />
          </MainStack.Navigator>
        </NavigationContainer>
      </AppThemeContext.Provider>
    </AppUserContext.Provider>
  );
};

//RootStack.whyDidYouRender = true;
export default RootStack;
