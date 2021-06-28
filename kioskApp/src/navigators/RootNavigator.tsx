import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useOrder, useSession } from 'ordering-components/native';

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

dayjs.extend(isSameOrAfter)
dayjs.extend(utc)

import LoginPage from '../screens/LoginPage';
import IntroPage from '../screens/IntroPage';
import BusinessPage from '../screens/BusinessPage';
import DeliveryTypePage from '../screens/DeliveryTypePage';
import CategoryPage from '../screens/CategoryPage';
import ProductDetailsPage from '../screens/ProductDetailsPage';
import CartPage from '../screens/CartPage';
import CustomerNamePage from "../screens/CustomerNamePage";
import PaymentMethodsPage from '../screens/PaymentMethodsPage';
import OrderDetailsPage from '../screens/OrderDetailsPage';
import Splash from '../screens/Splash';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const [{ auth, loading }] = useSession();
  const [orderStatus, { changeMoment }] = useOrder();
  const [loaded, setLoaded] = useState(false);

  const validDate = (date : any) => {
    if (!date) return
    const _date = dayjs(date, 'YYYY-MM-DD HH:mm').isSameOrAfter(dayjs(), 'day')
      ? dayjs(date).format('YYYY-MM-DD HH:mm')
      : dayjs().format('YYYY-MM-DD HH:mm')
    return _date
  }
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
                  name="Login"
                  component={LoginPage}
                  options={{ headerShown: false }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="Intro"
                  component={IntroPage}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Business"
                  component={BusinessPage}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="DeliveryType"
                  component={DeliveryTypePage}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Category"
                  component={CategoryPage}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="ProductDetails"
                  component={ProductDetailsPage}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Cart"
                  component={CartPage}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="CustomerName"
                  component={CustomerNamePage}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="OrderDetails"
                  component={OrderDetailsPage}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="PaymentMethods"
                  component={PaymentMethodsPage}
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
