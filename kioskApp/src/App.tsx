import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { OrderingProvider } from 'ordering-components/native';

import RootNavigator from './navigators/RootNavigator';
import Alert from './providers/AlertProvider';

import settings from './config.json';
import theme from './theme.json';

const App = () => {
  return (
    <OrderingProvider settings={settings} alert={Alert}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </OrderingProvider>
  );
};

export default App;
