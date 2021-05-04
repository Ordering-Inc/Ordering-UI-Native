import React from 'react';
import { useLanguage, useConfig, useOrder, useUtils } from 'ordering-components/native';
import { CardContainer, CardInfo, SoldOut } from './styles';
import { StyleSheet } from 'react-native';
import { colors } from '../../theme';
import { OText, OIcon } from '../shared';
export const SingleProductCard = props => {
  var _cart$products, _cart$products2;

  const {
    businessId,
    product,
    isSoldOut,
    onProductClick
  } = props;
  const [, t] = useLanguage();
  const [stateConfig] = useConfig();
  const [{
    parsePrice,
    optimizeImage
  }] = useUtils();
  const [orderState] = useOrder();
  const editMode = typeof (product === null || product === void 0 ? void 0 : product.code) !== 'undefined';
  const removeToBalance = editMode ? product === null || product === void 0 ? void 0 : product.quantity : 0;
  const cart = orderState.carts[`businessId:${businessId}`];
  const productCart = cart === null || cart === void 0 ? void 0 : (_cart$products = cart.products) === null || _cart$products === void 0 ? void 0 : _cart$products.find(prod => prod.id === (product === null || product === void 0 ? void 0 : product.id));
  const totalBalance = ((productCart === null || productCart === void 0 ? void 0 : productCart.quantity) || 0) - removeToBalance;
  const maxCartProductConfig = (stateConfig.configs.max_product_amount ? parseInt(stateConfig.configs.max_product_amount) : 100) - totalBalance;
  const productBalance = ((cart === null || cart === void 0 ? void 0 : (_cart$products2 = cart.products) === null || _cart$products2 === void 0 ? void 0 : _cart$products2.reduce((sum, _product) => sum + (product && _product.id === (product === null || product === void 0 ? void 0 : product.id) ? _product.quantity : 0), 0)) || 0) - removeToBalance;
  let maxCartProductInventory = (product !== null && product !== void 0 && product.inventoried ? product === null || product === void 0 ? void 0 : product.quantity : undefined) - productBalance;
  maxCartProductInventory = !isNaN(maxCartProductInventory) ? maxCartProductInventory : maxCartProductConfig;
  const maxProductQuantity = Math.min(maxCartProductConfig, maxCartProductInventory);
  return /*#__PURE__*/React.createElement(CardContainer, {
    style: [styles.container, (isSoldOut || maxProductQuantity <= 0) && styles.soldOutBackgroundStyle],
    onPress: () => onProductClick(product)
  }, /*#__PURE__*/React.createElement(OIcon, {
    url: optimizeImage(product === null || product === void 0 ? void 0 : product.images, 'h_200,c_limit'),
    style: styles.productStyle
  }), /*#__PURE__*/React.createElement(CardInfo, null, /*#__PURE__*/React.createElement(OText, {
    numberOfLines: 1,
    ellipsizeMode: "tail",
    style: styles.textStyle
  }, product === null || product === void 0 ? void 0 : product.name), /*#__PURE__*/React.createElement(OText, {
    size: 12,
    numberOfLines: 2,
    ellipsizeMode: "tail",
    style: styles.textStyle
  }, product === null || product === void 0 ? void 0 : product.description), /*#__PURE__*/React.createElement(OText, {
    color: colors.primary
  }, parsePrice(product === null || product === void 0 ? void 0 : product.price))), (isSoldOut || maxProductQuantity <= 0) && /*#__PURE__*/React.createElement(SoldOut, null, /*#__PURE__*/React.createElement(OText, {
    weight: "bold",
    style: styles.soldOutTextStyle
  }, t('SOLD_OUT', 'SOLD OUT'))));
};
const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.lightGray,
    marginBottom: 15
  },
  textStyle: {
    flex: 1
  },
  soldOutBackgroundStyle: {
    backgroundColor: '#B8B8B8'
  },
  soldOutTextStyle: {
    textTransform: 'uppercase'
  },
  productStyle: {
    width: 75,
    height: 75,
    borderRadius: 10
  }
});
//# sourceMappingURL=index.js.map