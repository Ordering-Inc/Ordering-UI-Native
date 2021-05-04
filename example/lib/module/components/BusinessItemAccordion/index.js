import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useOrder, useLanguage, useUtils } from 'ordering-components/native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { convertHoursToMinutes } from '../../utils';
import { BIContainer, BIHeader, BIContent, BIInfo, BIContentInfo, BITotal, BIActions } from './styles';
import { OAlert, OIcon, OText } from '../shared';
export const BusinessItemAccordion = props => {
  var _cart$products, _cart$business, _cart$business2, _cart$business3, _orderState$options, _cart$business4, _cart$business5;

  const {
    cart,
    moment,
    isCartsLoading,
    handleClearProducts
  } = props;
  const [orderState] = useOrder();
  const [, t] = useLanguage();
  const [{
    parsePrice
  }] = useUtils();
  const isCartPending = (cart === null || cart === void 0 ? void 0 : cart.status) === 2;
  const isClosed = !(cart !== null && cart !== void 0 && cart.valid_schedule);
  const isProducts = cart === null || cart === void 0 ? void 0 : (_cart$products = cart.products) === null || _cart$products === void 0 ? void 0 : _cart$products.length;
  const [isActive, setActiveState] = useState(false);
  useEffect(() => {
    var _cartsArray$filter$le;

    const cartsArray = Object.values(orderState === null || orderState === void 0 ? void 0 : orderState.carts);
    const cartsLength = (_cartsArray$filter$le = cartsArray.filter(cart => cart.products.length > 0).length) !== null && _cartsArray$filter$le !== void 0 ? _cartsArray$filter$le : 0;

    if (cartsLength === 1 && !isClosed) {
      setActiveState(true);
    }
  }, [orderState === null || orderState === void 0 ? void 0 : orderState.carts]);
  return /*#__PURE__*/React.createElement(BIContainer, {
    isClosed: isClosed
  }, /*#__PURE__*/React.createElement(BIHeader, {
    isClosed: isClosed,
    onPress: () => !isClosed ? setActiveState(!isActive) : isClosed
  }, /*#__PURE__*/React.createElement(BIInfo, null, (cart === null || cart === void 0 ? void 0 : (_cart$business = cart.business) === null || _cart$business === void 0 ? void 0 : _cart$business.logo) && /*#__PURE__*/React.createElement(OIcon, {
    url: cart === null || cart === void 0 ? void 0 : (_cart$business2 = cart.business) === null || _cart$business2 === void 0 ? void 0 : _cart$business2.logo,
    width: 70,
    height: 70,
    style: {
      borderRadius: 16
    }
  }), /*#__PURE__*/React.createElement(BIContentInfo, null, /*#__PURE__*/React.createElement(OText, null, cart === null || cart === void 0 ? void 0 : (_cart$business3 = cart.business) === null || _cart$business3 === void 0 ? void 0 : _cart$business3.name), (orderState === null || orderState === void 0 ? void 0 : (_orderState$options = orderState.options) === null || _orderState$options === void 0 ? void 0 : _orderState$options.type) === 1 ? /*#__PURE__*/React.createElement(View, {
    style: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
    name: "clock-outline",
    size: 24
  }), /*#__PURE__*/React.createElement(OText, null, convertHoursToMinutes(cart === null || cart === void 0 ? void 0 : (_cart$business4 = cart.business) === null || _cart$business4 === void 0 ? void 0 : _cart$business4.delivery_time))) : /*#__PURE__*/React.createElement(View, {
    style: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
    name: "clock-outline",
    size: 24
  }), /*#__PURE__*/React.createElement(OText, null, convertHoursToMinutes(cart === null || cart === void 0 ? void 0 : (_cart$business5 = cart.business) === null || _cart$business5 === void 0 ? void 0 : _cart$business5.pickup_time))))), !isClosed && !!isProducts && /*#__PURE__*/React.createElement(BITotal, null, (cart === null || cart === void 0 ? void 0 : cart.valid_products) && (cart === null || cart === void 0 ? void 0 : cart.total) > 0 && /*#__PURE__*/React.createElement(OText, {
    color: "#000"
  }, parsePrice(cart === null || cart === void 0 ? void 0 : cart.total)), /*#__PURE__*/React.createElement(OText, null, t('CART_TOTAL', 'Total'))), isClosed && /*#__PURE__*/React.createElement(BITotal, null, /*#__PURE__*/React.createElement(OText, null, t('CLOSED', 'Closed'), " ", moment)), !isClosed && !isProducts && /*#__PURE__*/React.createElement(BITotal, null, /*#__PURE__*/React.createElement(OText, null, t('NO_PRODUCTS', 'No products'))), /*#__PURE__*/React.createElement(BIActions, null, props.onNavigationRedirect && /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
    name: "store",
    size: 26,
    color: "#CCC",
    onPress: () => {
      var _cart$business6;

      return props.onNavigationRedirect('Business', {
        store: cart === null || cart === void 0 ? void 0 : (_cart$business6 = cart.business) === null || _cart$business6 === void 0 ? void 0 : _cart$business6.slug
      });
    }
  }), !isClosed && !!isProducts && /*#__PURE__*/React.createElement(React.Fragment, null, !isCartPending && /*#__PURE__*/React.createElement(OAlert, {
    title: t('DELETE_CART', 'Delete Cart'),
    message: t('QUESTION_DELETE_CART', 'Are you sure to you wants delete the selected cart'),
    onAccept: () => handleClearProducts()
  }, /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
    name: "trash-can-outline",
    size: 26,
    color: "#D81212"
  })), /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
    name: "chevron-down",
    size: 20
  })))), /*#__PURE__*/React.createElement(BIContent, {
    style: {
      display: isActive ? 'flex' : 'none'
    }
  }, props.children), /*#__PURE__*/React.createElement(Spinner, {
    visible: isCartsLoading
  }));
};
//# sourceMappingURL=index.js.map