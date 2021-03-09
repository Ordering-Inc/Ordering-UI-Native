import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useOrder, useSession } from 'ordering-components/native';

import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Forgot from '../pages/ForgotPassword';
import Home from '../pages/Home'
import AddressForm from '../pages/AddressForm'
import DrawNavigator from './DrawNavigator';
import Splash from '../pages/Splash';
import BusinessList from '../pages/BusinessesListing';
import HomeNavigator from './HomeNavigator';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const [{ auth, user, loading }, { login }] = useSession();
  const [orderStatus] = useOrder();
  const [loaded, setLoaded] = useState(false);

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
