import * as React from 'react';
import {AppState} from 'react-native'
import { createStackNavigator } from "@react-navigation/stack";
import { useSession, useOrder, useWebsocket } from 'ordering-components/native';

import BottomNavigator from '../navigators/BottomNavigator';
import RootNavigator from '../navigators/RootNavigator';
import CheckoutNavigator from '../navigators/CheckoutNavigator';

import AddressList from '../pages/AddressList';
import AddressForm from '../pages/AddressForm';
import OrderDetails from '../pages/OrderDetails';
import BusinessProductsList from '../pages/BusinessProductsList';
import ReviewOrder from '../pages/ReviewOrder'
import MomentOption from '../pages/MomentOption'
import Splash from '../pages/Splash';
import { View,PanResponder } from 'react-native';

const Stack = createStackNavigator();

const HomeNavigator = (is_online: boolean) => {

  const [orderState] = useOrder();
  const [{ auth }] = useSession();
  const socket = useWebsocket()

  const appState = React.useRef<any>(AppState.currentState);

  const _handleAppStateChange = (nextAppState : string) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      socket.connect()
    }
    appState.current = nextAppState;
    if(appState.current === 'background' || appState.current === 'inactive'){
      socket.close()
    }
  };

  React.useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (e, gestureState) => {
        const {dx, dy} = gestureState;
        resetInactivityTimeout()
        return (Math.abs(dx) > 20) || (Math.abs(dy) > 20);
      },
    })
  ).current

  const resetInactivityTimeout = () => {
    if(!socket.socket.connected){
      socket.connect()
    }
  }

  return (
    <View style={{flex: 1}} {...panResponder.panHandlers}>
      <Stack.Navigator>
        {!orderState.loading || (orderState?.options?.user_id && orderState.loading) || orderState?.options?.address?.location ? (
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
    </View>
  );
}

export default HomeNavigator;
