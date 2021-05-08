import React, {useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  NavigationContainer,
  DefaultTheme,
  getStateFromPath,
} from '@react-navigation/native';

import AppBootstrap from './AppBootstrap';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
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
  }, [navigationRef, initialProps]);
  const [themeSettings, setThemeSettings] = useState({
    hiddenBack: true,
    hiddenHeader: false,
    hiddenFooter: false,
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
  const updateAuthData = (newData) => {
    setAuthData({
      ...newData,
      avatarUrl: authData.avatarUrl,
      userToken: authData.userToken,
    })
  }
  const updateMe = async () => {
    const userToken = authData.userToken;
    if (userToken) {
      APIService('users/me/', null, 5)
        .then((result) => {
          updateAuthData(result);
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
  if (!authData) {
    AsyncStorage.multiGet(['userId', 'avatarUrl', 'userToken']).then(
      (items) => {
        const k = {};
        items.map((i) => (k[i[0]] = i[1]));
        if (k.userId && !rootLoaded) {
          rootLoaded = true;
          setAuthData({
            id: k.userId,
            avatarUrl: k.avatarUrl ? k.avatarUrl.slice(1, -1) : null,
            userToken: k.userToken,
          });
        }
      },
    );
  }
  const appUserContextValue = {authData, setAuthData: updateAuthData, updateMe};
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
