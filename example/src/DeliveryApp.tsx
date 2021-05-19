/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from 'react';
import { LogBox, Platform } from 'react-native';
import * as Sentry from "@sentry/react-native";
import { NavigationContainer } from '@react-navigation/native';
import { OrderingProvider } from 'ordering-components/native';

import { ToastProvider } from './providers/ToastProvider';
import RootNavigator from './navigators/RootNavigator';
import { Toast } from './components/shared/OToast';
import Alert from './providers/AlertProvider'
import {
  ORDER_STATUS_IMAGES,
  CATEGORIES_IMAGES,
  DUMMIES_IMAGES,
  GENERAL_IMAGES,
  LOGO_IMAGES,
} from './config/constants';

import settings from './config.json';
import theme from './theme.json';

Sentry.init({
  environment: Platform.OS === 'ios' ? 'ios' : 'android',
  dsn: 'https://90197fffe6a1431b8c3eb79e1e36f0ee@o460529.ingest.sentry.io/5722123',
  release: "ordering-ui-native@" + process.env.npm_package_version
});

LogBox.ignoreLogs([
  'Sending \`onAnimatedValueUpdate` with no listeners registered.',
  'Non-serializable values were found in the navigation state.'
])

theme.images = {
  logos: {
    logotype: LOGO_IMAGES.logotype,
    logotypeInvert: LOGO_IMAGES.logotypeInvert,
    // isotype,
    // isotypeInvert
  },
  general: {
    homeHero: GENERAL_IMAGES.homeHero,
    notFound: GENERAL_IMAGES.notFound,
    //   notFound404,
    //   notFoundLighting,
    //   searchIcon,
    //   notNetwork,
    //   orderDetailsHeader,
    emptyActiveOrders: GENERAL_IMAGES.emptyActiveOrders,
    emptyPastOrders: GENERAL_IMAGES.emptyPastOrders
  },
  order: {
    status0: ORDER_STATUS_IMAGES.orderStatus0,
    status1: ORDER_STATUS_IMAGES.orderStatus1,
    status2: ORDER_STATUS_IMAGES.orderStatus2,
    status3: ORDER_STATUS_IMAGES.orderStatus3,
    status4: ORDER_STATUS_IMAGES.orderStatus4,
    status5: ORDER_STATUS_IMAGES.orderStatus5,
    status6: ORDER_STATUS_IMAGES.orderStatus6,
    status7: ORDER_STATUS_IMAGES.orderStatus7,
    status8: ORDER_STATUS_IMAGES.orderStatus8,
    status9: ORDER_STATUS_IMAGES.orderStatus9,
    status10: ORDER_STATUS_IMAGES.orderStatus10,
    status11: ORDER_STATUS_IMAGES.orderStatus11,
    status12: ORDER_STATUS_IMAGES.orderStatus12,
    status13: ORDER_STATUS_IMAGES.orderStatus13
  },
  categories: {
    all: CATEGORIES_IMAGES.all
  },
  dummies: {
    product: DUMMIES_IMAGES.product,
    businessLogo: DUMMIES_IMAGES.store
  }
}

const DeliveryApp = () => {
  return (
    <OrderingProvider settings={settings} Alert={Alert}>
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
