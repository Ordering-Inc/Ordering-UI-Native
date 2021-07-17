import 'react-native-gesture-handler';
import * as React from 'react';
import { LogBox, Platform } from 'react-native';
// import * as Sentry from "@sentry/react-native";
import { NavigationContainer } from '@react-navigation/native';
import { OrderingProvider } from 'ordering-components/native';

import RootNavigator from './navigators/RootNavigator';
import { Toast } from './components/shared/OToast';
import Alert from './providers/AlertProvider';
import { ThemeProvider } from './context/Theme';

// import { navigationRef } from './navigators/NavigationRef';

import settings from './config.json';
import theme from './theme.json';
import { CartBottomSheetProvider } from './providers/CartBottomSheetProvider';
import { ToastProvider } from './providers/ToastProvider';

/* Sentry.init({
  environment: Platform.OS === 'ios' ? 'ios' : 'android',
  dsn: 'https://90197fffe6a1431b8c3eb79e1e36f0ee@o460529.ingest.sentry.io/5722123',
  release: "ordering-ui-native@" + process.env.npm_package_version
}); */

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
    arrow_left_white: require('./assets/icons/arrow_left_white.png'),
    arrow_right_circular_outlined: require('./assets/icons/arrow_right_circular_outlined.png'),
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
    pushPin: require('./assets/icons/push_pin.png'),
    shoppingCart: require('./assets/icons/shopping_cart.png'),
    edit: require('./assets/icons/edit.png'),
    check_decagram: require('./assets/icons/check_decagram.png'),
    cash: require('./assets/icons/cash.png'),
    carddelivery: require('./assets/icons/card-delivery.png'),
    paypal: require('./assets/icons/paypal.png'),
    stripe: require('./assets/icons/stripe.png'),
    stripecc: require('./assets/icons/cc-stripe.png'),
    stripes: require('./assets/icons/stripe-s.png'),
    stripesb: require('./assets/icons/stripe-sb.png'),
    creditCard: require('./assets/icons/credit-card.png')
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
    <ThemeProvider theme={theme}>
      <OrderingProvider settings={settings} Alert={Alert}>
        <ToastProvider>
          <CartBottomSheetProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </CartBottomSheetProvider>
          <Toast />
        </ToastProvider>
      </OrderingProvider>
    </ThemeProvider>
  );
};

export default App;
