import React, { useState } from 'react';
import { Cart as CartController, useOrder, useLanguage, useUtils, useValidationFields } from 'ordering-components/native';
import { CContainer, CheckoutAction } from './styles';
import { OSBill, OSTable, OSCoupon, OSTotal } from '../OrderSummary/styles';
import { ProductItemAccordion } from '../ProductItemAccordion';
import { BusinessItemAccordion } from '../BusinessItemAccordion';
import { CouponControl } from '../CouponControl'; // import { ProductForm } from '../ProductForm';

import { OButton, OModal, OText } from '../shared';
import { colors } from '../../theme';
import { ProductForm } from '../ProductForm';
import { UpsellingProducts } from '../UpsellingProducts';

const CartUI = props => {
  var _validationFields$fie, _validationFields$fie2, _validationFields$fie3, _orderState$option, _orderState$option2, _cart$products, _cart$business, _orderState$options, _cart$business2, _cart$business3;

  const {
    cart,
    clearCart,
    changeQuantity,
    getProductMax,
    offsetDisabled,
    removeProduct,
    handleCartOpen
  } = props;
  const [, t] = useLanguage();
  const [orderState] = useOrder(); // const [events] = useEvent()

  const [{
    parsePrice,
    parseNumber,
    parseDate
  }] = useUtils();
  const [validationFields] = useValidationFields();
  const [confirm, setConfirm] = useState({
    open: false,
    content: null,
    handleOnAccept: null
  });
  const [openProduct, setModalIsOpen] = useState(false);
  const [curProduct, setCurProduct] = useState(null);
  const [openUpselling, setOpenUpselling] = useState(false);
  const [canOpenUpselling, setCanOpenUpselling] = useState(false);
  const [isCartsLoading, setIsCartsLoading] = useState(false);
  const isCartPending = (cart === null || cart === void 0 ? void 0 : cart.status) === 2;
  const isCouponEnabled = validationFields === null || validationFields === void 0 ? void 0 : (_validationFields$fie = validationFields.fields) === null || _validationFields$fie === void 0 ? void 0 : (_validationFields$fie2 = _validationFields$fie.checkout) === null || _validationFields$fie2 === void 0 ? void 0 : (_validationFields$fie3 = _validationFields$fie2.coupon) === null || _validationFields$fie3 === void 0 ? void 0 : _validationFields$fie3.enabled;
  const momentFormatted = !(orderState !== null && orderState !== void 0 && (_orderState$option = orderState.option) !== null && _orderState$option !== void 0 && _orderState$option.moment) ? t('RIGHT_NOW', 'Right Now') : parseDate(orderState === null || orderState === void 0 ? void 0 : (_orderState$option2 = orderState.option) === null || _orderState$option2 === void 0 ? void 0 : _orderState$option2.moment, {
    outputFormat: 'YYYY-MM-DD HH:mm'
  });

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

  const handleClearProducts = async () => {
    try {
      setIsCartsLoading(true);
      const result = await clearCart(cart === null || cart === void 0 ? void 0 : cart.uuid);
      setIsCartsLoading(false);
    } catch (error) {
      setIsCartsLoading(false);
    }
  };

  const handleUpsellingPage = () => {
    setOpenUpselling(false);
    setCanOpenUpselling(false);
    props.onNavigationRedirect('CheckoutNavigator', {
      cartUuid: cart === null || cart === void 0 ? void 0 : cart.uuid
    });
  };

  return /*#__PURE__*/React.createElement(CContainer, null, /*#__PURE__*/React.createElement(BusinessItemAccordion, {
    cart: cart,
    moment: momentFormatted,
    isCartsLoading: isCartsLoading,
    handleClearProducts: handleClearProducts,
    handleCartOpen: handleCartOpen,
    onNavigationRedirect: props.onNavigationRedirect
  }, (cart === null || cart === void 0 ? void 0 : (_cart$products = cart.products) === null || _cart$products === void 0 ? void 0 : _cart$products.length) > 0 && (cart === null || cart === void 0 ? void 0 : cart.products.map(product => /*#__PURE__*/React.createElement(ProductItemAccordion, {
    key: product.code,
    isCartPending: isCartPending,
    isCartProduct: true,
    product: product,
    changeQuantity: changeQuantity,
    getProductMax: getProductMax,
    offsetDisabled: offsetDisabled,
    onDeleteProduct: handleDeleteClick,
    onEditProduct: handleEditProduct
  }))), (cart === null || cart === void 0 ? void 0 : cart.valid_products) && /*#__PURE__*/React.createElement(OSBill, null, /*#__PURE__*/React.createElement(OSTable, null, /*#__PURE__*/React.createElement(OText, null, t('SUBTOTAL', 'Subtotal')), /*#__PURE__*/React.createElement(OText, null, parsePrice((cart === null || cart === void 0 ? void 0 : cart.subtotal) || 0))), /*#__PURE__*/React.createElement(OSTable, null, /*#__PURE__*/React.createElement(OText, null, cart.business.tax_type === 1 ? t('TAX_INCLUDED', 'Tax (included)') : t('TAX', 'Tax'), `(${parseNumber(cart === null || cart === void 0 ? void 0 : (_cart$business = cart.business) === null || _cart$business === void 0 ? void 0 : _cart$business.tax)}%)`), /*#__PURE__*/React.createElement(OText, null, parsePrice((cart === null || cart === void 0 ? void 0 : cart.tax) || 0))), (orderState === null || orderState === void 0 ? void 0 : (_orderState$options = orderState.options) === null || _orderState$options === void 0 ? void 0 : _orderState$options.type) === 1 && (cart === null || cart === void 0 ? void 0 : cart.delivery_price) > 0 && /*#__PURE__*/React.createElement(OSTable, null, /*#__PURE__*/React.createElement(OText, null, t('DELIVERY_FEE', 'Delivery Fee')), /*#__PURE__*/React.createElement(OText, null, parsePrice(cart === null || cart === void 0 ? void 0 : cart.delivery_price))), (cart === null || cart === void 0 ? void 0 : cart.driver_tip) > 0 && /*#__PURE__*/React.createElement(OSTable, null, /*#__PURE__*/React.createElement(OText, null, t('DRIVER_TIP', 'Driver tip'), (cart === null || cart === void 0 ? void 0 : cart.driver_tip_rate) > 0 && `(${parseNumber(cart === null || cart === void 0 ? void 0 : cart.driver_tip_rate)}%)`), /*#__PURE__*/React.createElement(OText, null, parsePrice(cart === null || cart === void 0 ? void 0 : cart.driver_tip))), (cart === null || cart === void 0 ? void 0 : cart.service_fee) > 0 && /*#__PURE__*/React.createElement(OSTable, null, /*#__PURE__*/React.createElement(OText, null, t('SERVICE_FEE', 'Service Fee'), `(${parseNumber(cart === null || cart === void 0 ? void 0 : (_cart$business2 = cart.business) === null || _cart$business2 === void 0 ? void 0 : _cart$business2.service_fee)}%)`), /*#__PURE__*/React.createElement(OText, null, parsePrice(cart === null || cart === void 0 ? void 0 : cart.service_fee))), (cart === null || cart === void 0 ? void 0 : cart.discount) > 0 && (cart === null || cart === void 0 ? void 0 : cart.total) >= 0 && /*#__PURE__*/React.createElement(OSTable, null, (cart === null || cart === void 0 ? void 0 : cart.discount_type) === 1 ? /*#__PURE__*/React.createElement(OText, null, t('DISCOUNT', 'Discount'), /*#__PURE__*/React.createElement(OText, null, `(${parseNumber(cart === null || cart === void 0 ? void 0 : cart.discount_rate)}%)`)) : /*#__PURE__*/React.createElement(OText, null, t('DISCOUNT', 'Discount')), /*#__PURE__*/React.createElement(OText, null, "- ", parsePrice((cart === null || cart === void 0 ? void 0 : cart.discount) || 0))), isCouponEnabled && !isCartPending && /*#__PURE__*/React.createElement(OSTable, null, /*#__PURE__*/React.createElement(OSCoupon, null, /*#__PURE__*/React.createElement(CouponControl, {
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
  }, (cart === null || cart === void 0 ? void 0 : cart.total) >= 1 && parsePrice(cart === null || cart === void 0 ? void 0 : cart.total))))), /*#__PURE__*/React.createElement(CheckoutAction, null, /*#__PURE__*/React.createElement(OButton, {
    text: ((cart === null || cart === void 0 ? void 0 : cart.subtotal) >= (cart === null || cart === void 0 ? void 0 : cart.minimum) || !(cart !== null && cart !== void 0 && cart.minimum)) && cart !== null && cart !== void 0 && cart.valid_address ? !openUpselling !== canOpenUpselling ? t('CHECKOUT', 'Checkout') : t('LOADING', 'Loading') : !(cart !== null && cart !== void 0 && cart.valid_address) ? `${t('OUT_OF_COVERAGE', 'Out of Coverage')}` : `${t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} ${parsePrice(cart === null || cart === void 0 ? void 0 : cart.minimum)}`,
    bgColor: (cart === null || cart === void 0 ? void 0 : cart.subtotal) < (cart === null || cart === void 0 ? void 0 : cart.minimum) || !(cart !== null && cart !== void 0 && cart.valid_address) ? colors.secundary : colors.primary,
    isDisabled: openUpselling && !canOpenUpselling || (cart === null || cart === void 0 ? void 0 : cart.subtotal) < (cart === null || cart === void 0 ? void 0 : cart.minimum) || !(cart !== null && cart !== void 0 && cart.valid_address),
    borderColor: colors.primary,
    imgRightSrc: null,
    textStyle: {
      color: 'white',
      textAlign: 'center',
      flex: 1
    },
    onClick: () => setOpenUpselling(true),
    style: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center'
    }
  }))), /*#__PURE__*/React.createElement(OModal, {
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
  })), openUpselling && /*#__PURE__*/React.createElement(UpsellingProducts, {
    handleUpsellingPage: handleUpsellingPage,
    openUpselling: openUpselling,
    businessId: cart === null || cart === void 0 ? void 0 : cart.business_id,
    business: cart === null || cart === void 0 ? void 0 : cart.business,
    cartProducts: cart === null || cart === void 0 ? void 0 : cart.products,
    canOpenUpselling: canOpenUpselling,
    setCanOpenUpselling: setCanOpenUpselling
  }));
};

export const Cart = props => {
  const cartProps = { ...props,
    UIComponent: CartUI
  };
  return /*#__PURE__*/React.createElement(CartController, cartProps);
};
//# sourceMappingURL=index.js.map