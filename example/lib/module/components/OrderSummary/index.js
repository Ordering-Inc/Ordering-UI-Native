import React, { useState } from 'react';
import { Cart, useOrder, useLanguage, useUtils, useValidationFields } from 'ordering-components/native';
import { OSContainer, OSProductList, OSBill, OSTable, OSTotal, OSCoupon } from './styles';
import { ProductItemAccordion } from '../ProductItemAccordion';
import { CouponControl } from '../CouponControl';
import { OModal, OText } from '../shared';
import { colors } from '../../theme';
import { ProductForm } from '../ProductForm';

const OrderSummaryUI = props => {
  var _validationFields$fie, _validationFields$fie2, _validationFields$fie3, _cart$products, _cart$business, _orderState$options, _cart$business2, _cart$business3;

  const {
    currentCartUuid,
    cart,
    clearCart,
    isProducts,
    changeQuantity,
    getProductMax,
    offsetDisabled,
    removeProduct,
    onClickCheckout,
    isCheckout,
    isCartPending,
    isCartPopover,
    isForceOpenCart,
    isCartOnProductsList,
    handleCartOpen
  } = props;
  const [, t] = useLanguage();
  const [orderState] = useOrder();
  const [{
    parsePrice,
    parseNumber,
    parseDate
  }] = useUtils();
  const [validationFields] = useValidationFields();
  const [openProduct, setModalIsOpen] = useState(false);
  const [curProduct, setCurProduct] = useState(null);
  const isCouponEnabled = validationFields === null || validationFields === void 0 ? void 0 : (_validationFields$fie = validationFields.fields) === null || _validationFields$fie === void 0 ? void 0 : (_validationFields$fie2 = _validationFields$fie.checkout) === null || _validationFields$fie2 === void 0 ? void 0 : (_validationFields$fie3 = _validationFields$fie2.coupon) === null || _validationFields$fie3 === void 0 ? void 0 : _validationFields$fie3.enabled;

  const handleDeleteClick = product => {
    removeProduct(product);
  };

  const handleEditProduct = product => {
    setCurProduct(product);
    setModalIsOpen(true);
  };

  const handlerProductAction = product => {
    if (Object.keys(product).length) {
      setModalIsOpen(false);
    }
  };

  return /*#__PURE__*/React.createElement(OSContainer, null, (cart === null || cart === void 0 ? void 0 : (_cart$products = cart.products) === null || _cart$products === void 0 ? void 0 : _cart$products.length) > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(OSProductList, null, cart === null || cart === void 0 ? void 0 : cart.products.map(product => /*#__PURE__*/React.createElement(ProductItemAccordion, {
    key: product.code,
    product: product,
    isCartPending: isCartPending,
    isCartProduct: true,
    changeQuantity: changeQuantity,
    getProductMax: getProductMax,
    offsetDisabled: offsetDisabled,
    onDeleteProduct: handleDeleteClick,
    onEditProduct: handleEditProduct
  }))), /*#__PURE__*/React.createElement(OSBill, null, /*#__PURE__*/React.createElement(OSTable, null, /*#__PURE__*/React.createElement(OText, null, t('SUBTOTAL', 'Subtotal')), /*#__PURE__*/React.createElement(OText, null, parsePrice((cart === null || cart === void 0 ? void 0 : cart.subtotal) || 0))), /*#__PURE__*/React.createElement(OSTable, null, /*#__PURE__*/React.createElement(OText, null, cart.business.tax_type === 1 ? t('TAX_INCLUDED', 'Tax (included)') : t('TAX', 'Tax'), `(${parseNumber(cart === null || cart === void 0 ? void 0 : (_cart$business = cart.business) === null || _cart$business === void 0 ? void 0 : _cart$business.tax)}%)`), /*#__PURE__*/React.createElement(OText, null, parsePrice((cart === null || cart === void 0 ? void 0 : cart.tax) || 0))), (orderState === null || orderState === void 0 ? void 0 : (_orderState$options = orderState.options) === null || _orderState$options === void 0 ? void 0 : _orderState$options.type) === 1 && (cart === null || cart === void 0 ? void 0 : cart.delivery_price) > 0 && /*#__PURE__*/React.createElement(OSTable, null, /*#__PURE__*/React.createElement(OText, null, t('DELIVERY_FEE', 'Delivery Fee')), /*#__PURE__*/React.createElement(OText, null, parsePrice(cart === null || cart === void 0 ? void 0 : cart.delivery_price))), (cart === null || cart === void 0 ? void 0 : cart.driver_tip) > 0 && /*#__PURE__*/React.createElement(OSTable, null, /*#__PURE__*/React.createElement(OText, null, t('DRIVER_TIP', 'Driver tip'), (cart === null || cart === void 0 ? void 0 : cart.driver_tip_rate) > 0 && `(${parseNumber(cart === null || cart === void 0 ? void 0 : cart.driver_tip_rate)}%)`), /*#__PURE__*/React.createElement(OText, null, parsePrice(cart === null || cart === void 0 ? void 0 : cart.driver_tip))), (cart === null || cart === void 0 ? void 0 : cart.service_fee) > 0 && /*#__PURE__*/React.createElement(OSTable, null, /*#__PURE__*/React.createElement(OText, null, t('SERVICE_FEE', 'Service Fee'), `(${parseNumber(cart === null || cart === void 0 ? void 0 : (_cart$business2 = cart.business) === null || _cart$business2 === void 0 ? void 0 : _cart$business2.service_fee)}%)`), /*#__PURE__*/React.createElement(OText, null, parsePrice(cart === null || cart === void 0 ? void 0 : cart.service_fee))), (cart === null || cart === void 0 ? void 0 : cart.discount) > 0 && (cart === null || cart === void 0 ? void 0 : cart.total) >= 0 && /*#__PURE__*/React.createElement(OSTable, null, (cart === null || cart === void 0 ? void 0 : cart.discount_type) === 1 ? /*#__PURE__*/React.createElement(OText, null, t('DISCOUNT', 'Discount'), /*#__PURE__*/React.createElement(OText, null, `(${parseNumber(cart === null || cart === void 0 ? void 0 : cart.discount_rate)}%)`)) : /*#__PURE__*/React.createElement(OText, null, t('DISCOUNT', 'Discount')), /*#__PURE__*/React.createElement(OText, null, "- ", parsePrice((cart === null || cart === void 0 ? void 0 : cart.discount) || 0))), isCouponEnabled && !isCartPending && /*#__PURE__*/React.createElement(OSTable, null, /*#__PURE__*/React.createElement(OSCoupon, null, /*#__PURE__*/React.createElement(CouponControl, {
    businessId: cart.business_id,
    price: cart.total
  }))), /*#__PURE__*/React.createElement(OSTotal, null, /*#__PURE__*/React.createElement(OSTable, {
    style: {
      marginTop: 15
    }
  }, /*#__PURE__*/React.createElement(OText, {
    style: {
      fontWeight: 'bold'
    }
  }, t('TOTAL', 'Total')), /*#__PURE__*/React.createElement(OText, {
    style: {
      fontWeight: 'bold'
    },
    color: colors.primary
  }, (cart === null || cart === void 0 ? void 0 : cart.total) >= 1 && parsePrice(cart === null || cart === void 0 ? void 0 : cart.total))))), /*#__PURE__*/React.createElement(OModal, {
    open: openProduct,
    entireModal: true,
    customClose: true,
    onClose: () => setModalIsOpen(false)
  }, /*#__PURE__*/React.createElement(ProductForm, {
    isCartProduct: true,
    productCart: curProduct,
    businessSlug: cart === null || cart === void 0 ? void 0 : (_cart$business3 = cart.business) === null || _cart$business3 === void 0 ? void 0 : _cart$business3.slug,
    businessId: curProduct === null || curProduct === void 0 ? void 0 : curProduct.business_id,
    categoryId: curProduct === null || curProduct === void 0 ? void 0 : curProduct.category_id,
    productId: curProduct === null || curProduct === void 0 ? void 0 : curProduct.id,
    onSave: handlerProductAction,
    onClose: () => setModalIsOpen(false)
  }))));
};

export const OrderSummary = props => {
  const orderSummaryProps = { ...props,
    UIComponent: OrderSummaryUI
  };
  return /*#__PURE__*/React.createElement(Cart, orderSummaryProps);
};
//# sourceMappingURL=index.js.map