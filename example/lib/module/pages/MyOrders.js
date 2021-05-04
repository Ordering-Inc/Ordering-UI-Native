function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import { useLanguage } from 'ordering-components/native';
import { OrdersOption } from '../components/OrdersOption';
import { OText } from '../components/shared';
import { Container } from '../layouts/Container';

const MyOrders = ({
  navigation
}) => {
  const [, t] = useLanguage();
  const MyOrderProps = {
    navigation,
    onNavigationRedirect: (page, params) => {
      if (!page) return;
      navigation.navigate(page, params);
    }
  };
  return /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(OText, {
    size: 24,
    mBottom: 20
  }, t('MY_ORDERS', 'My Orders')), /*#__PURE__*/React.createElement(OrdersOption, _extends({}, MyOrderProps, {
    activeOrders: true
  })), /*#__PURE__*/React.createElement(OrdersOption, MyOrderProps));
};

export default MyOrders;
//# sourceMappingURL=MyOrders.js.map