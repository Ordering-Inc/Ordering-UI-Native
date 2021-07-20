import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";

import AddressList from '../pages/AddressList'
import AddressForm from '../pages/AddressForm'
import CartList from '../pages/CartList'
import CheckoutPage from '../pages/Checkout';
import BusinessProductsList from '../pages/BusinessProductsList';

const Stack = createStackNavigator();

const CheckoutNavigator = (props: any) => {
  const {
    navigation,
    route
  } = props;

  const cartUuid = route?.params?.cartUuid

  const checkoutProps = {
    navigation,
    route,
    cartUuid: route?.params?.cartUuid
  }

  return (
    <Stack.Navigator>
      {!cartUuid && (
        <Stack.Screen
          name="Cart"
          component={CartList}
          options={{ headerShown: false }}
        />
      )}
      <Stack.Screen
        name="CheckoutPage"
        children={() => <CheckoutPage {...checkoutProps} />}
        options={{ headerShown: false }}
        />
      <Stack.Screen
        name="Business"
        component={BusinessProductsList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddressList"
        component={AddressList}
        options={{ headerShown: false }}
        initialParams={{isFromCheckout: true}}
      />
      <Stack.Screen
        name="AddressForm"
        component={AddressForm}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductListing"
        component={BusinessProductsList}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default CheckoutNavigator;
