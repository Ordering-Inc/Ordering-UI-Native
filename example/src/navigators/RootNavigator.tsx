import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import { useOrder, useSession, useConfig } from 'ordering-components/native';
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import OneSignal from 'react-native-onesignal';

dayjs.extend(isSameOrAfter)
dayjs.extend(utc)

import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Forgot from '../pages/ForgotPassword';
import Home from '../pages/Home';
import IntroductoryTutorial from '../pages/IntroductoryTutorial';
import AddressForm from '../pages/AddressForm';
import MomentOption from '../pages/MomentOption';
import Splash from '../pages/Splash';
import BusinessList from '../pages/BusinessesListing';
import BusinessProductsList from '../pages/BusinessProductsList';
import NotFound from '../pages/NotFound'
import HomeNavigator from './HomeNavigator';
import settings from '../config.json';
import * as RootNavigation from '../navigators/NavigationRef';
import { _retrieveStoreData, _setStoreData } from '../providers/StoreUtil';

const Stack = createStackNavigator();
const RootNavigator = () => {
  const [{ auth, loading: sessionLoading }] = useSession();
  const [orderStatus, { changeMoment }] = useOrder();
  const [{ configs, loading: configsLoading }] = useConfig();
  const [loaded, setLoaded] = useState(false);
  const [productLogin, setProductLogin] = useState({})
  const [oneSignalState, setOneSignalState] = useState<any>({
    notification_app: settings.notification_app
  });
  const [ isTutorial, setTutorial] = useState(true)
  const [isPushLoading, setIsPushLoading] = useState({ loading: true })

  const validDate = (date : any) => {
    if (!date) return
    const _date = dayjs(date, 'YYYY-MM-DD HH:mm').isSameOrAfter(dayjs(), 'day')
      ? dayjs(date).format('YYYY-MM-DD HH:mm')
      : dayjs().format('YYYY-MM-DD HH:mm')
    return _date
  };

  const oneSignalSetup = async () => {
    setIsPushLoading({ loading: true });
    OneSignal.setLogLevel(6, 0);

    OneSignal.setAppId(configs?.onesignal_orderingapp_id?.value);

    if (Platform.OS === 'ios') {
      OneSignal.promptForPushNotificationsWithUserResponse(response => {
        console.log('Prompt response:', response);
      });
    }

    OneSignal.setNotificationOpenedHandler(({ notification }: any) => {
      if (notification?.additionalData?.order_uuid) {
        RootNavigation.navigate('OrderDetails', {
          orderId: notification?.additionalData?.order_uuid,
          isFromRoot: true
        });
      }
    });

    OneSignal.addSubscriptionObserver((event: any) => {
      setOneSignalState({ ...oneSignalState, notification_token: event?.to?.userId });
    });

    const deviceState: any = await OneSignal.getDeviceState();

    if (!deviceState?.isSubscribed) {
      OneSignal.addTrigger("prompt_ios", "true");
    }

    OneSignal.disablePush(false);

    const data = {
      ...oneSignalState,
      notification_token: deviceState?.userId,
      notification_app: settings.notification_app
    }
    setOneSignalState(data);
    setIsPushLoading({ loading: false });
  };
  useEffect(() => {
    if (!loaded && !orderStatus.loading && !isPushLoading.loading) {
      setLoaded(true)
    }
  }, [orderStatus, isPushLoading])

  useEffect(() => {
    const setTutorialLocal = async () => {
      const data = await _retrieveStoreData('isTutorial');
      if(data === false){
        setTutorial(false)
      }
    }
    setTutorialLocal();
  }, [isTutorial])
  
  useEffect(() => {
    if (!sessionLoading && !isPushLoading.loading && !auth) {
      setLoaded(!auth)
    }
  }, [sessionLoading, isPushLoading])

  useEffect(() => {
    const _currentDate = dayjs.utc(validDate(orderStatus.options?.moment)).local()
    if (!_currentDate) {
      return
    }
    const selected = dayjs(_currentDate, 'YYYY-MM-DD HH:mm')
    const now = dayjs()
    const secondsDiff = selected.diff(now, 'seconds')
    const checkTime = setTimeout(() => {
      changeMoment(null)
    }, secondsDiff * 1000)

    return () => {
      clearTimeout(checkTime)
    }
  }, [orderStatus.options?.moment])

  useEffect(() => {
    if (configsLoading) return
    if (configs?.onesignal_orderingapp_id?.value) {
      oneSignalSetup();
    }
    if (!!!configs?.onesignal_orderingapp_id?.value) {
      setIsPushLoading({ loading: false });
    }
  }, [configsLoading]);

  return (
    <Stack.Navigator>
      {
        !loaded && (
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{ headerShown: false }}
          />
        )
      }
      {
        loaded && (
          <>
            {!auth ? (
              <>
              { isTutorial ? (
                <Stack.Screen
                  name="IntroductoryTutorial"
                  component={IntroductoryTutorial}
                  options={{ headerShown: false }}
                  initialParams={{ setTutorial }}
                />):(
                <Stack.Screen
                  name="Home"
                  component={Home}
                  options={{ headerShown: false }}
                />)}
                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{ headerShown: false }}
                  listeners={{
                    state: (e: any) => {
                      setProductLogin(e.data.state.routes.find((object: any) => object?.params?.product)?.params?.product)
                    }
                  }}
                  initialParams={{ notification_state: oneSignalState }}
                />
                <Stack.Screen
                  name="Signup"
                  component={Signup}
                  options={{ headerShown: false }}
                  initialParams={{ notification_state: oneSignalState }}
                />
                <Stack.Screen
                  name="Forgot"
                  component={Forgot}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="AddressForm"
                  component={AddressForm}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name='BusinessList'
                  component={BusinessList}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name='Business'
                  component={BusinessProductsList}
                  options={{ headerShown: false }}
                  initialParams={{ setProductLogin }}
                />
                <Stack.Screen
                  name='MomentOption'
                  component={MomentOption}
                  options={{ headerShown: false }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name='MyAccount'
                  component={HomeNavigator}
                  options={{ headerShown: false }}
                  initialParams={{ productLogin }}
                />
              </>
            )}
          </>
        )
      }
      <Stack.Screen
        name='NotFound'
        component={NotFound}
      />
    </Stack.Navigator>
  );
};
export default RootNavigator;
