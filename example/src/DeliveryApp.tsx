/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ToastProvider } from './providers/ToastProvider';
import { Toast } from './components/shared/OToast';
import RootNavigator from './navigators/RootNavigator';
// import {OrderingProvider} from 'ordering-components/Native'

// const configFile = {
//   app_id: 'ordering-react-native',
//   project: 'luisv4',
//   api: {
//     url: 'https://apiv4-dev.ordering.co',
//     language: 'en',
//     version: 'v400'
//   },
//   socket: {
//     url: 'https://socket-dev.ordering.co'
//   }
// }

const DeliveryApp = () => {
  return (
    // <OrderingProvider settings={configFile}>
    <ToastProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
      <Toast />
    </ToastProvider>
    // </OrderingProvider>
  );
};

export default DeliveryApp;
