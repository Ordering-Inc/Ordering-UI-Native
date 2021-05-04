import React from 'react';
import { useLanguage } from 'ordering-components/native';
import { CCContainer, CCNotCarts, CCList } from './styles';
import { Cart } from '../Cart';
import { OText } from '../shared';
export const CartContent = props => {
  const {
    carts,
    isOrderStateCarts
  } = props;
  const [, t] = useLanguage();
  return /*#__PURE__*/React.createElement(CCContainer, null, isOrderStateCarts && (carts === null || carts === void 0 ? void 0 : carts.length) > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(OText, {
    style: {
      fontSize: 28
    }
  }, carts.length > 1 ? t('CARTS', 'Carts') : t('CART', 'Cart')), carts.map(cart => /*#__PURE__*/React.createElement(CCList, {
    key: cart.uuid
  }, cart.products.length > 0 && /*#__PURE__*/React.createElement(Cart, {
    cart: cart,
    onNavigationRedirect: props.onNavigationRedirect
  })))), (!carts || (carts === null || carts === void 0 ? void 0 : carts.length) === 0) && /*#__PURE__*/React.createElement(CCNotCarts, null, /*#__PURE__*/React.createElement(OText, {
    size: 24,
    style: {
      textAlign: 'center'
    }
  }, t('CARTS_NOT_FOUND', 'You don\'t have carts available'))));
};
//# sourceMappingURL=index.js.map