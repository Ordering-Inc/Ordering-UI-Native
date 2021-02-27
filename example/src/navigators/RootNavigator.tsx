import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useOrder, useSession } from 'ordering-components/native';

import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Forgot from '../pages/ForgotPassword';
import Home from '../pages/Home';
import Splash from '../pages/Splash';
import MyAccountNavigator from './MyAccountNavigator';

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
    <NavigationContainer>
      <Stack.Navigator>
        {
          !loaded && (
            <Stack.Screen
              name="Splash"
              component={Splash}
              options={{headerShown: false}}
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
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Signup"
                    component={Signup}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen
                    name="Forgot"
                    component={Forgot}
                    options={{headerShown: false}}
                  />
                </>
              ) : (
                <Stack.Screen
                  name='MyAccount'
                  component={MyAccountNavigator}
                  options={{headerShown: false}}
                />
              )}
            </>
          )
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
