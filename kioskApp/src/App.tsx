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
import { CartBottomSheetProvider } from './providers/CartBottomSheetProvider';

const App = () => {
  return (
    <SafeAreaProvider>
      <OrderingProvider settings={settings} alert={Alert}>
        <CartBottomSheetProvider>
          <ToastProvider>
            <NavigationContainer>
              <RootNavigator/>
            </NavigationContainer>
            <Toast/>
          </ToastProvider>
        </CartBottomSheetProvider>
      </OrderingProvider>
    </SafeAreaProvider>
  );
};

export default App;
