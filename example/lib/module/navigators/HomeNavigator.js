import * as React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { useSession, useOrder } from 'ordering-components/native';
import BottomNavigator from '../navigators/BottomNavigator';
import RootNavigator from '../navigators/RootNavigator';
import CheckoutNavigator from '../navigators/CheckoutNavigator';
import AddressList from '../pages/AddressList';
import AddressForm from '../pages/AddressForm';
import SpinnerLoader from '../pages/SpinnerLoader';
import OrderDetails from '../pages/OrderDetails';
import BusinessProductsList from '../pages/BusinessProductsList';
import ReviewOrder from '../pages/ReviewOrder';
import MomentOption from '../pages/MomentOption';
const Stack = createStackNavigator();

const HomeNavigator = is_online => {
  var _orderState$options, _orderState$options2, _orderState$options2$;

  const [orderState] = useOrder();
  const [{
    auth
  }] = useSession();
  return /*#__PURE__*/React.createElement(Stack.Navigator, null, !orderState.loading || orderState !== null && orderState !== void 0 && (_orderState$options = orderState.options) !== null && _orderState$options !== void 0 && _orderState$options.user_id ? /*#__PURE__*/React.createElement(React.Fragment, null, auth ? (_orderState$options2 = orderState.options) !== null && _orderState$options2 !== void 0 && (_orderState$options2$ = _orderState$options2.address) !== null && _orderState$options2$ !== void 0 && _orderState$options2$.location ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Stack.Screen, {
    name: "BottomTab",
    component: BottomNavigator,
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
  }), /*#__PURE__*/React.createElement(Stack.Screen, {
    name: "CheckoutNavigator",
    component: CheckoutNavigator,
    options: {
      headerShown: false
    }
  }), /*#__PURE__*/React.createElement(Stack.Screen, {
    name: "OrderDetails",
    component: OrderDetails,
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
    name: "ReviewOrder",
    component: ReviewOrder,
    options: {
      headerShown: false
    }
  }), /*#__PURE__*/React.createElement(Stack.Screen, {
    name: "MomentOption",
    component: MomentOption,
    options: {
      headerShown: false
    }
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Stack.Screen, {
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
  })) : /*#__PURE__*/React.createElement(Stack.Screen, {
    name: "root",
    component: RootNavigator,
    options: {
      headerShown: false
    }
  })) : /*#__PURE__*/React.createElement(Stack.Screen, {
    name: "SpinnerLoader",
    component: SpinnerLoader,
    options: {
      headerShown: false
    }
  }));
};

export default HomeNavigator;
//# sourceMappingURL=HomeNavigator.js.map