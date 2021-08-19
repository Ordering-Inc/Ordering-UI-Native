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
import { OrderingProvider } from 'ordering-components/native';
import RNBootSplash from "react-native-bootsplash";

import { Toast } from './components/shared/OToast';
import Alert from './providers/AlertProvider';
import { ThemeProvider } from './context/Theme';


import settings from './config.json';
import theme from './theme.json';
import AppContainer from './AppContainer';

Sentry.init({
  environment: Platform.OS === 'ios' ? 'ios' : 'android',
  dsn: 'https://90197fffe6a1431b8c3eb79e1e36f0ee@o460529.ingest.sentry.io/5722123',
  release: process.env.npm_package_version ? 'ordering-ui-native@' + process.env.npm_package_version : 'ordering-ui-native@' + '0.0.2',
  ignoreErrors: [
    'is not defined',
    'is not a function',
    'can\'t find variable',
    'objects are not valid',
    'element type is invalid'
  ],
});

LogBox.ignoreLogs([
  'Sending \`onAnimatedValueUpdate` with no listeners registered.',
  'Non-serializable values were found in the navigation state.',
  'Setting a timer',
  'The `value` prop is required for the `<Context.Provider>`',
  'Can\'t perform a React state update',
  'Remote debugger',
  'Task orphaned for request',
  'JSON value \'<null>\''
])

theme.images = {
  logos: {
    logotype: require('./assets/images/logotype.png'),
    logotypeInvert: require('./assets/images/logotype-invert.png'),
    // isotype,
    // isotypeInvert
  },
  tutorials: {
    slide1: require('./assets/images/slide1.png'),
    slide2: require('./assets/images/slide2.png'),
    slide3: require('./assets/images/slide3.png'),
    slide4: require('./assets/images/slide4.png'),
    slide5: require('./assets/images/slide5.png'),
    slide6: require('./assets/images/slide6.png')
  },
  general: {
    homeHero: require('./assets/images/home-hero.png'),
    notFound: require('./assets/images/not-found.png'),
    //   notFound404,
    //   notFoundLighting,
    //   searchIcon,
    //   notNetwork,
    //   orderDetailsHeader,
    emptyActiveOrders: require('./assets/images/empty-active-orders.png'),
    emptyPastOrders: require('./assets/images/empty-past-orders.png'),
    menu: require('./assets/icons/menu.png'),
    lunch: require('./assets/icons/lunch.png'),
    arrow_up: require('./assets/icons/arrow_up.png'),
    arrow_left: require('./assets/icons/arrow_left.png'),
    map: require('./assets/icons/map.png'),
    marker: require('./assets/images/marker.png'),
    email: require('./assets/icons/ic_email.png'),
    lock: require('./assets/icons/ic_lock.png'),
    camera: require('./assets/icons/camera.png'),
    support: require('./assets/icons/help.png'),
    trash: require('./assets/icons/trash.png'),
    phone: require('./assets/icons/phone.png'),
    mail: require('./assets/icons/mail.png'),
    chat: require('./assets/icons/chat.png'),
    user: require('./assets/icons/menu-user.png'),
    menulogout: require('./assets/icons/menu-logout.png'),
    cash: require('./assets/icons/cash.png'),
    carddelivery: require('./assets/icons/card-delivery.png'),
    paypal: require('./assets/icons/paypal.png'),
    stripe: require('./assets/icons/stripe.png'),
    stripecc: require('./assets/icons/cc-stripe.png'),
    stripes: require('./assets/icons/stripe-s.png'),
    stripesb: require('./assets/icons/stripe-sb.png'),
    creditCard: require('./assets/icons/credit-card.png')
  },
  order: {
    status0: require('./assets/images/status-0.png'),
    status1: require('./assets/images/status-1.png'),
    status2: require('./assets/images/status-2.png'),
    status3: require('./assets/images/status-3.png'),
    status4: require('./assets/images/status-4.png'),
    status5: require('./assets/images/status-5.png'),
    status6: require('./assets/images/status-6.png'),
    status7: require('./assets/images/status-7.png'),
    status8: require('./assets/images/status-8.png'),
    status9: require('./assets/images/status-9.png'),
    status10: require('./assets/images/status-10.png'),
    status11: require('./assets/images/status-11.png'),
    status12: require('./assets/images/status-12.png'),
    status13: require('./assets/images/status-13.png'),
    status14: require('./assets/images/status-14.png'),
    status15: require('./assets/images/status-15.png'),
    status16: require('./assets/images/status-16.png'),
    status17: require('./assets/images/status-17.png'),
    status18: require('./assets/images/status-18.png'),
    status19: require('./assets/images/status-19.png'),
    status20: require('./assets/images/status-20.png'),
    status21: require('./assets/images/status-21.png'),
  },
  categories: {
    all: require('./assets/images/categories/category-all.png')
  },
  dummies: {
    product: require('./assets/images/dummies/product.png'),
    businessLogo: require('./assets/images/dummies/store.png'),
    driverPhoto: 'https://res.cloudinary.com/demo/image/fetch/c_thumb,g_face,r_max/https://www.freeiconspng.com/thumbs/driver-icon/driver-icon-14.png',
    customerPhoto: 'https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,r_max/d_avatar.png/non_existing_id.png'
  }
}

const DeliveryApp = () => {
  React.useEffect(() => {
    setTimeout(() => {
      RNBootSplash.hide();
    }, 1000);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <OrderingProvider settings={settings} Alert={Alert}>
        <AppContainer />
        <Toast />
      </OrderingProvider>
    </ThemeProvider>
  );
};

export default DeliveryApp;
