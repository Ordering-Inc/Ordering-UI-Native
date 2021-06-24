import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LoginPage from '../screens/LoginPage';
import IntroPage from '../screens/IntroPage';
import BusinessPage from '../screens/BusinessPage';
import DeliveryTypePage from '../screens/DeliveryTypePage';
import CategoryPage from '../screens/CategoryPage';
import ProductDetailsPage from '../screens/ProductDetailsPage';
import CartPage from '../screens/CartPage';
import CustomerNamePage from "../screens/CustomerNamePage";
import ConfirmationPage from '../screens/ConfirmationPage';
import PaymentMethodsPage from '../screens/PaymentMethodsPage';
import OrderDetailsPage from '../screens/OrderDetailsPage';

const Stack = createStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Intro">
      <Stack.Screen
        name="Login"
        component={LoginPage}
        options={{ headerShown: false }}
      />
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
        name="Confirmation"
        component={ConfirmationPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentMethods"
        component={PaymentMethodsPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
