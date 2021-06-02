import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { OrderingProvider } from 'ordering-components/native';

import { ToastProvider } from './providers/ToastProvider';
import RootNavigator from './navigators/RootNavigator';
import { Toast } from './components/shared/OToast';
import Alert from './providers/AlertProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import settings from './config.json';

const App = () => {
  return (
    <SafeAreaProvider>
      <OrderingProvider settings={settings} alert={Alert}>
        <ToastProvider>
          <NavigationContainer>
            <RootNavigator/>
          </NavigationContainer>
          <Toast/>
        </ToastProvider>
      </OrderingProvider>
    </SafeAreaProvider>
  );
};

export default App;
