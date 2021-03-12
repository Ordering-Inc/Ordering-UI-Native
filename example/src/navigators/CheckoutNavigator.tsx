import * as React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
// import { useOrder, useSession } from 'ordering-components/native';

import BottomNavigator from '../navigators/BottomNavigator'
import RootNavigator from '../navigators/RootNavigator'

// import AddressList from '../pages/AddressList'
// import AddressForm from '../pages/AddressForm'
// import SpinnerLoader from '../pages/SpinnerLoader'
import CheckoutPage from '../pages/Checkout';

const Stack = createStackNavigator();

const CheckoutNavigator = () => {

  // const [orderState] = useOrder()
  // const [{ auth }] = useSession()

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CheckoutPage"
        component={CheckoutPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default CheckoutNavigator;
