import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Forgot from '../pages/ForgotPassword';
import Home from '../pages/Home'
import MyAccountNavigator from './MyAccountNavigator';
import AddressList from '../pages/AddressList'
import AddressForm from '../pages/AddressForm'
import GuestNavigator from './GuestNavigator'

const Stack = createStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator>
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
        name="AddressList"
        component={AddressList}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name="AddressForm"
        component={AddressForm}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='MyAccount'
        component={MyAccountNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name='Guest'
        component={GuestNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
