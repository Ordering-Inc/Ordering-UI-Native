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
import {OrderingProvider} from 'ordering-components/native';

const configFile = {
  project: 'luisv4',
  api: {
    url: 'https://apiv4-staging.ordering.co/',
    language: 'en',
    version: 'v400'
  },
  socket: {
    url: 'https://socket-staging-v2.ordering.co/'
  }
}

const DeliveryApp = () => {
  return (
    <OrderingProvider settings={configFile}>
      <ToastProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        <Toast />
      </ToastProvider>
    </OrderingProvider>
  );
};

export default DeliveryApp;
