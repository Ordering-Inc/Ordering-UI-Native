import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import AddressList from '../pages/AddressList';
import AddressForm from '../pages/AddressForm';
import CartList from '../pages/CartList';
import CheckoutPage from '../pages/Checkout';
import BusinessProductsList from '../pages/BusinessProductsList';
const Stack = createStackNavigator();

const CheckoutNavigator = props => {
  var _route$params, _route$params2;

  const {
    navigation,
    route
  } = props;
  const cartUuid = route === null || route === void 0 ? void 0 : (_route$params = route.params) === null || _route$params === void 0 ? void 0 : _route$params.cartUuid;
  const checkoutProps = {
    navigation,
    cartUuid: route === null || route === void 0 ? void 0 : (_route$params2 = route.params) === null || _route$params2 === void 0 ? void 0 : _route$params2.cartUuid
  };
  return /*#__PURE__*/React.createElement(Stack.Navigator, null, !cartUuid && /*#__PURE__*/React.createElement(Stack.Screen, {
    name: "Cart",
    component: CartList,
    options: {
      headerShown: false
    }
  }), /*#__PURE__*/React.createElement(Stack.Screen, {
    name: "CheckoutPage",
    children: () => /*#__PURE__*/React.createElement(CheckoutPage, checkoutProps),
    options: {
      headerShown: false
    }
  }), /*#__PURE__*/React.createElement(Stack.Screen, {
    name: "Business",
    component: BusinessProductsList,
    options: {
      headerShown: false
    }
  }), /*#__PURE__*/React.createElement(Stack.Screen, {
    name: "AddressList",
    component: AddressList,
    options: {
      headerShown: false
    }
  }), /*#__PURE__*/React.createElement(Stack.Screen, {
    name: "AddressForm",
    component: AddressForm,
    options: {
      headerShown: false
    }
  }));
};

export default CheckoutNavigator;
//# sourceMappingURL=CheckoutNavigator.js.map