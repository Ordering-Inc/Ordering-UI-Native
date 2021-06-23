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
import AddressForm from '../pages/AddressForm';
import MomentOption from '../pages/MomentOption';
import Splash from '../pages/Splash';
import BusinessList from '../pages/BusinessesListing';
import BusinessProductsList from '../pages/BusinessProductsList';
import OrderDetails from '../pages/OrderDetails';
import HomeNavigator from './HomeNavigator';
import settings from '../config.json';
import { _setStoreData } from '../providers/StoreUtil';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const [{ auth, loading }] = useSession();
  const [orderStatus, { changeMoment }] = useOrder();
  const [{ configs }] = useConfig();
  const [loaded, setLoaded] = useState(false);
  const [oneSignalState, setOneSignalState] = useState<any>({});
  const [notificationData, setNotificationData] = useState<any>({});

  const validDate = (date : any) => {
    if (!date) return
    const _date = dayjs(date, 'YYYY-MM-DD HH:mm').isSameOrAfter(dayjs(), 'day')
      ? dayjs(date).format('YYYY-MM-DD HH:mm')
      : dayjs().format('YYYY-MM-DD HH:mm')
    return _date
  };

  const oneSignalSetup = async () => {
    OneSignal.setLogLevel(6, 0);

    if (configs?.onesignal_orderingapp_id) {
      OneSignal.setAppId(configs?.onesignal_orderingapp_id);
    }

    //OneSignal.setAppId('f4d9d806-882e-4b96-b7d1-4f3e478e8726'); // delete this
    //OneSignal.setAppId('3ed1ab98-1ada-4414-ad95-ef8180af5ecd'); // delete this

    if (Platform.OS === 'ios') {
      OneSignal.promptForPushNotificationsWithUserResponse(response => {
        console.log('Prompt response:', response);
      });
    }

    OneSignal.setNotificationOpenedHandler(({ notification }: any) => {
      if (notification?.additionalData?.order_uuid) {
        setNotificationData({
          ...notificationData,
          order_uuid: notification?.additionalData?.order_uuid
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
    _setStoreData('notification_state', data);
  };

  useEffect(() => {
    if (!loaded && !orderStatus.loading) {
      setLoaded(true)
    }
  }, [orderStatus]);

  useEffect(() => {
    if (!loading) {
      setLoaded(!auth)
    }
  }, [loading]);

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
  }, [orderStatus.options?.moment]);

  useEffect(() => {
    oneSignalSetup();
  }, []);

  return (
    <Stack.Navigator>
      {
        !loaded && (
          <Stack.Screen
            name='Splash'
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
                <Stack.Screen
                  name='Home'
                  component={Home}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name='Login'
                  component={Login}
                  options={{ headerShown: false }}
                  initialParams={{ notification_state: oneSignalState }}
                />
                <Stack.Screen
                  name='Signup'
                  component={Signup}
                  options={{ headerShown: false }}
                  initialParams={{ notification_state: oneSignalState }}
                />
                <Stack.Screen
                  name='Forgot'
                  component={Forgot}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name='AddressForm'
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
                />
                <Stack.Screen
                  name='MomentOption'
                  component={MomentOption}
                  options={{ headerShown: false }}
                />
              </>
            ) : (
              <>
                {notificationData?.order_uuid && (
                  <Stack.Screen
                    name="OrderDetails"
                    component={OrderDetails}
                    options={{ headerShown: false }}
                    initialParams={{ orderId: notificationData?.order_uuid, isFromRoot: true }}
                  />
                )}
                <Stack.Screen
                  name='MyAccount'
                  component={HomeNavigator}
                  options={{ headerShown: false }}
                />
              </>
            )}
          </>
        )
      }
    </Stack.Navigator>
  );
};

export default RootNavigator;
