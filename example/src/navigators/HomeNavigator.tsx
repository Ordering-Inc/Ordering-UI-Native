import * as React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { useSession, useOrder } from 'ordering-components/native';

import BottomNavigator from '../navigators/BottomNavigator';
import RootNavigator from '../navigators/RootNavigator';

// import MapOrders from '../pages/MapOrders';
// import Reject from '../pages/Reject';
// import Accept from '../pages/Accept';
// import MapBusiness from '../pages/MapBusiness';
// import Chat from '../pages/Chat';
// import Supports from '../pages/Supports';
import AddressList from '../pages/AddressList';
import AddressForm from '../pages/AddressForm';
import SpinnerLoader from '../pages/SpinnerLoader';
import OrderDetails from '../pages/OrderDetails';
import BusinessProductsList from '../pages/BusinessProductsList';
import MomentOption from '../pages/MomentOption'

const Stack = createStackNavigator();

const HomeNavigator = (is_online: boolean) => {

  const [orderState] = useOrder();
  const [{ auth }] = useSession();

  return (
    <Stack.Navigator>
      {(!orderState.loading || orderState.options?.address?.location) ? (
        <>
          {auth ? (
            orderState.options?.address?.location ? (
              <>
                <Stack.Screen
                  name='BottomTab'
                  component={BottomNavigator}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="AddressList"
                  component={AddressList}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="AddressForm"
                  component={AddressForm}
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
                  name='MomentOption'
                  component={MomentOption}
                  options={{ headerShown: false }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="AddressList"
                  component={AddressList}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="AddressForm"
                  component={AddressForm}
                  options={{ headerShown: false }}
                />
              </>
            )
          ) : (
            <Stack.Screen
              name='root'
              component={RootNavigator}
              options={{ headerShown: false }}
            />
          )}
        </>
      ) : (
        <Stack.Screen
          name="SpinnerLoader"
          component={SpinnerLoader}
          options={{ headerShown: false }}
        />
      )}
      {/* <Stack.Screen
        name="MapOrders"
        component={MapOrders}
        options={{ title: 'Recieve Order', headerShown: false }}
        initialParams={{ is_online: is_online }}
      /> */}
      {/* <Stack.Screen
        name="OrderDetail"
        component={OrderDetail}
        options={{ title: 'Order Detail', headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="Reject"
        component={Reject}
        options={{ title: 'Reject Order', headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="Accept"
        component={Accept}
        options={{ title: 'Accept Order', headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="MapBusiness"
        component={MapBusiness}
        options={{ title: 'Map Business', headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="Chat"
        component={Chat}
        options={{ title: 'Chat Screen', headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="Supports"
        component={Supports}
        options={{ title: 'FAQ and Supports', headerShown: false }}
      /> */}
    </Stack.Navigator>
  );
}

export default HomeNavigator;
