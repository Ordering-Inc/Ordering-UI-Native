import * as React from 'react';
import styled from 'styled-components/native';
import { useOrder } from 'ordering-components/native';
import { Platform } from 'react-native';
import { CartContent } from '../components/CartContent';
import { Container } from '../layouts/Container';
const KeyboardView = styled.KeyboardAvoidingView`
  flex-grow: 1;
`;

const CartList = props => {
  const [{
    carts
  }] = useOrder();
  const cartsList = carts && Object.values(carts).filter(cart => cart.products.length > 0) || [];
  const cartProps = { ...props,
    carts: cartsList,
    isOrderStateCarts: !!carts,
    onNavigationRedirect: (route, params) => props.navigation.navigate(route, params)
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(KeyboardView, {
    enabled: true,
    behavior: Platform.OS === 'ios' ? 'padding' : 'height'
  }, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(CartContent, cartProps))));
};

export default CartList;
//# sourceMappingURL=CartList.js.map