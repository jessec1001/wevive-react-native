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

const RootStack = () => {
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
    if (navState.url) {
      if (themeSettings.hiddenBack) {
        changedTheme.hiddenBack = false;
      }
      if (navState.url.startsWith('https://thewildlifetrusts.teemill.co.uk/')) {
        if (!themeSettings.hiddenHeader) {
          changedTheme.hiddenHeader = true;
        }
      } else {
        if (themeSettings.hiddenHeader) {
          changedTheme.hiddenHeader = true;
        }
      }
    } else {
      const routeName = navState.name;
      if (routeName == 'VideoCalls') {
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
      if (routeName === 'Chat') {
        changedTheme.hiddenBack = true;
      } else {
        changedTheme.hiddenBack = false;
      }
    }
    /* if (backFunction) {
            changedTheme.goBack = backFunction;
        } else {
            changedTheme.goBack = null;
        }*/
    setThemeSettings(changedTheme);
    return true;
  };

  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();
  global.navigation = navigationRef.current;
  const [authData, setAuthData] = useState(null);
  const updateMe = () => {
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
  };
  const [avatarUrl, setAvatarUrl] = React.useState(false);
  AsyncStorage.getItem('avatarUrl').then((avatarUrl) => {
    setAvatarUrl(avatarUrl.slice(1, -1));
  });
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

export default RootStack;
