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
import {
  StatusBar
} from 'react-native';
import Login from './pages/Login';
import RecieveOrder from './pages/RecieveOrder';

import { Theme, light, dark } from './theme'
import { ThemeProvider } from 'styled-components/native'
import Forgot from './pages/Forgot';

const Stack = createStackNavigator();

const NavStack = () => {
  return (
    <Stack.Navigator
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
        options={{ title: 'RecieveOrder', headerShown: false }}
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
      <ThemeProvider theme={light}>
        <NavigationContainer>
          <NavStack />
        </NavigationContainer>
      </ThemeProvider>
    </>
  );
};

export default App;
