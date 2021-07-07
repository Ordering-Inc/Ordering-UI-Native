import React, { useState, useEffect } from 'react';
import {Alert} from 'react-native' 
import { createStackNavigator } from '@react-navigation/stack';
import { useOrder, useSession } from 'ordering-components/native';
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

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
import HomeNavigator from './HomeNavigator';

import messaging from '@react-native-firebase/messaging';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const [{ auth, loading }] = useSession();
  const [orderStatus, { changeMoment }] = useOrder();
  const [loaded, setLoaded] = useState(false);
  const [token, settoken] = useState<any>(null);
  
  const validDate = (date : any) => {
    if (!date) return
    const _date = dayjs(date, 'YYYY-MM-DD HH:mm').isSameOrAfter(dayjs(), 'day')
      ? dayjs(date).format('YYYY-MM-DD HH:mm')
      : dayjs().format('YYYY-MM-DD HH:mm')
    return _date
  }

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    console.log(authStatus);
    
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      Alert.alert(
        "Alert Title",
        `Authorization status: ${authStatus}
          AUTHORIZED: ${messaging.AuthorizationStatus.AUTHORIZED}
          DENIED: ${messaging.AuthorizationStatus.DENIED}
          NOT_DETERMINED: ${messaging.AuthorizationStatus.NOT_DETERMINED}
          PROVISIONAL: ${messaging.AuthorizationStatus.PROVISIONAL}
        `,
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
      const tokenA = await messaging().getToken();
      Alert.alert(
        "Alert Title",
        `TOKEN: ${tokenA}
        `,
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
      console.log('token: ', tokenA);
      settoken(tokenA)
      
      await messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage.notification,
        );
      });
      

      const remoteMessage = await messaging().getInitialNotification()
      console.log(remoteMessage);
      
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    }
  }

  useEffect(() => {
    requestUserPermission();
  }, []);

  useEffect(() => {
    if (!loaded && !orderStatus.loading) {
      setLoaded(true)
    }
  }, [orderStatus])

  useEffect(() => {
    if (!loading) {
      setLoaded(!auth)
    }
  }, [loading])

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
                <Stack.Screen
                  name="Home"
                  component={Home}
                  options={{ headerShown: false }}
                  initialParams={{ token }}
                />
                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Signup"
                  component={Signup}
                  options={{ headerShown: false }}
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
                />
                <Stack.Screen
                  name='MomentOption'
                  component={MomentOption}
                  options={{ headerShown: false }}
                />
              </>
            ) : (
              <Stack.Screen
                name='MyAccount'
                component={HomeNavigator}
                options={{ headerShown: false }}
              />
            )}
          </>
        )
      }
    </Stack.Navigator>
  );
};

export default RootNavigator;
