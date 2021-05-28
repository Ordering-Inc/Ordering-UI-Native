import * as React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { useSession, useOrder } from 'ordering-components/native';

import BottomNavigator from '../navigators/BottomNavigator';
import RootNavigator from '../navigators/RootNavigator';
import CheckoutNavigator from '../navigators/CheckoutNavigator';

import AddressList from '../pages/AddressList';
import AddressForm from '../pages/AddressForm';
import SpinnerLoader from '../pages/SpinnerLoader';
import OrderDetails from '../pages/OrderDetails';
import BusinessProductsList from '../pages/BusinessProductsList';
import ReviewOrder from '../pages/ReviewOrder'
import MomentOption from '../pages/MomentOption'
import Splash from '../pages/Splash';
import AfterSignupNavigator from './AfterSignupNavigator';


const Stack = createStackNavigator();

const HomeNavigator = (is_online: boolean) => {

  const [orderState] = useOrder();
  const [{ auth }] = useSession();

  return (
    <Stack.Navigator>
      {!orderState.loading || auth ? (
        <>
          {auth ? (
              <>
                {!orderState?.options?.address?.location && !orderState.loading ? (
                  <>
                    <Stack.Screen
                      name="AddressListInitial"
                      component={AddressList}
                      options={{ headerShown: false }}
                      initialParams={{afterSignup: true}}
                    />
                    <Stack.Screen
                      name="AddressFormInitial"
                      component={AddressForm}
                      options={{ headerShown: false }}
                      initialParams={{afterSignup: true}}
                    />
                  </>
                ) : (
                <>
                  <Stack.Screen
                  name='BottomTab'
                  component={BottomNavigator}
                  options={{ headerShown: false }}
                  />
                <Stack.Screen
                name="CheckoutNavigator"
                component={CheckoutNavigator}
                options={{ headerShown: false }}
                />
                <Stack.Screen
                name="OrderDetails"
                component={OrderDetails}
                options={{ headerShown: false }}
                />
                <Stack.Screen
                name="Business"
                component={BusinessProductsList}
                options={{ headerShown: false }}
                />
                <Stack.Screen
                name="ReviewOrder"
                component={ReviewOrder}
                options={{ headerShown: false }}
                />
                <Stack.Screen
                name='MomentOption'
                component={MomentOption}
                options={{ headerShown: false }}
                />
                <Stack.Screen
                name="AddressList"
                component={AddressList}
                options={{ headerShown: false }}
                initialParams={{afterSignup: false}}
                />
                <Stack.Screen
                name="AddressForm"
                component={AddressForm}
                options={{ headerShown: false }}
                initialParams={{afterSignup: false}}
                />
                </>
                )}
              </>
            )
           : (
            <Stack.Screen
              name='root'
              component={RootNavigator}
              options={{ headerShown: false }}
            />
          )}
        </>
      ) : (
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}

export default HomeNavigator;
