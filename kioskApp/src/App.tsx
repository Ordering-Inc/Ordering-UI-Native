import 'react-native-gesture-handler';
import React from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { OrderingProvider } from 'ordering-components/native';

import { ToastProvider } from './providers/ToastProvider';
import RootNavigator from './navigators/RootNavigator';
import { Toast } from './components/shared/OToast';
import Alert from './providers/AlertProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import settings from './config.json';
import { CartBottomSheetProvider } from './providers/CartBottomSheetProvider';

LogBox.ignoreLogs([
  'Warning: The `value` prop is required for the `<Context.Provider>`',
  'Non-serializable values were found in the navigation state.',
  'The action \'RESET\' with payload',
  'Can\'t perform a React state update',
  'Warning: Failed prop type: Invalid prop `businessId` of type `string` supplied to `ProductForm`, expected `number`.',
  'Warning: Failed prop type: Invalid prop `businessId` of type `string` supplied to `UpsellingPage`, expected `number`.'
]);

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
