/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './pages/Login';
import RecieveOrder from './pages/RecieveOrder';
import OrderDetail from './pages/OrderDetail';
import Forgot from './pages/Forgot';

import { light } from './theme'
import { ThemeProvider } from 'styled-components/native'

const Stack = createStackNavigator();

const NavStack = () => {
  return (
    <Stack.Navigator
      initialRouteName='Login'
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#621FF7',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ title: 'Login', headerShown: false, gestureDirection: 'horizontal-inverted' }}
      />
      <Stack.Screen
        name="RecieveOrder"
        component={RecieveOrder}
        options={{ title: 'Recieve Order', headerShown: false }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetail}
        options={{ title: 'Order Detail', headerShown: false }}
      />
      <Stack.Screen
        name="Forgot"
        component={Forgot}
        options={{ title: 'Forgot Password', headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const App = () => {
  return (
    <>
      <ThemeProvider theme={ light }>
        <NavigationContainer>
          <NavStack />
        </NavigationContainer>
      </ThemeProvider>
    </>
  );
};

export default App;
