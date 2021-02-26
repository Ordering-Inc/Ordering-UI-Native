
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import AddressList from '../pages/AddressList'
import AddressForm from '../pages/AddressForm'
import DrawNavigator from './DrawNavigator'


const Stack = createStackNavigator();

const MyAccountNavigator = () => {
  return (
    <Stack.Navigator>
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
        name="OrderView"
        component={DrawNavigator}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  )
}

export default MyAccountNavigator;