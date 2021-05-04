import React, { useState, useEffect } from 'react';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, StyleSheet } from 'react-native';
import stripe from 'tipsi-stripe';
import { Checkout as CheckoutController, useOrder, useSession, useApi, useLanguage, useUtils, useValidationFields, useConfig } from 'ordering-components/native';
import { OText, OButton, OIcon } from '../shared';
import { IMAGES } from '../../config/constants';
import { colors } from '../../theme';
import { AddressDetails } from '../AddressDetails';
import { PaymentOptions } from '../PaymentOptions';
import { DriverTips } from '../DriverTips';
import { OrderSummary } from '../OrderSummary';
import { NotFoundSource } from '../NotFoundSource';
import { UserDetails } from '../UserDetails';
import { OrderTypeSelector } from '../OrderTypeSelector';
import { ChContainer, ChSection, ChHeader, ChTotal, ChAddress, ChMoment, CHMomentWrapper, ChPaymethods, ChDriverTips, ChCart, ChPlaceOrderBtn, ChErrors, ChBusinessDetails, ChUserDetails } from './styles';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { ToastType, useToast } from '../../providers/ToastProvider';
import Spinner from 'react-native-loading-spinner-overlay';
const mapConfigs = {
  mapZoom: 16,
  mapSize: {
    width: 640,
    height: 190
  }
};

const manageErrorsToShow = (array = []) => {
  let stringError = '';
  const list = Array.isArray(array) ? array : Object.values(array);
  list.map((item, i) => {
    stringError += i + 1 === array.length ? `- ${(item === null || item === void 0 ? void 0 : item.message) || item}` : `- ${(item === null || item === void 0 ? void 0 : item.message) || item}\n`;
  });
  return stringError;
};

const CheckoutUI = props => {
  var _configs$order_types_, _businessDetails$busi, _businessDetails$busi2, _businessDetails$busi3, _businessDetails$busi4, _configs$google_maps_, _configs$format_time, _businessDetails$busi5, _businessDetails$busi6, _businessDetails$busi7, _businessDetails$busi8, _businessDetails$erro, _businessDetails$erro2, _businessDetails$busi9, _businessDetails$busi10, _validationFields$fie9, _validationFields$fie10, _validationFields$fie11, _cart$products;

  const {
    navigation,
    cart,
    errors,
    placing,
    cartState,
    businessDetails,
    paymethodSelected,
    handlePaymethodChange,
    handlerClickPlaceOrder,
    onNavigationRedirect,
    driverTipsOptions
  } = props;
  const {
    showToast
  } = useToast();
  const [, t] = useLanguage();
  const [{
    user
  }] = useSession();
  const [{
    configs
  }] = useConfig();
  const [{
    parsePrice,
    parseDate
  }] = useUtils();
  const [{
    options,
    carts
  }] = useOrder();
  const [validationFields] = useValidationFields();
  const [errorCash, setErrorCash] = useState(false);
  const [userErrors, setUserErrors] = useState([]);
  const [isUserDetailsEdit, setIsUserDetailsEdit] = useState(false);
  const [phoneUpdate, setPhoneUpdate] = useState(false);
  const configTypes = (configs === null || configs === void 0 ? void 0 : (_configs$order_types_ = configs.order_types_allowed) === null || _configs$order_types_ === void 0 ? void 0 : _configs$order_types_.value.split('|').map(value => Number(value))) || [];
  const cartsWithProducts = carts && Object.values(carts).filter(cart => cart.products.length) || null;

  const handlePlaceOrder = () => {
    if (!userErrors.length) {
      handlerClickPlaceOrder && handlerClickPlaceOrder();
      return;
    }

    let stringError = '';
    Object.values(userErrors).map((item, i) => {
      stringError += i + 1 === userErrors.length ? `- ${(item === null || item === void 0 ? void 0 : item.message) || item}` : `- ${(item === null || item === void 0 ? void 0 : item.message) || item}\n`;
    });
    showToast(ToastType.Error, stringError);
    setIsUserDetailsEdit(true);
  };

  const checkValidationFields = () => {
    var _validationFields$fie, _validationFields$fie2, _validationFields$fie3, _validationFields$fie4, _validationFields$fie5, _validationFields$fie6, _validationFields$fie7;

    setUserErrors([]);
    const errors = [];
    const notFields = ['coupon', 'driver_tip', 'mobile_phone', 'address', 'zipcode', 'address_notes'];
    Object.values(validationFields === null || validationFields === void 0 ? void 0 : (_validationFields$fie = validationFields.fields) === null || _validationFields$fie === void 0 ? void 0 : _validationFields$fie.checkout).map(field => {
      if (field !== null && field !== void 0 && field.required && !notFields.includes(field.code)) {
        if (!user[field === null || field === void 0 ? void 0 : field.code]) {
          errors.push(t(`VALIDATION_ERROR_${field.code.toUpperCase()}_REQUIRED`, `The field ${field === null || field === void 0 ? void 0 : field.name} is required`));
        }
      }
    });

    if (!(user !== null && user !== void 0 && user.cellphone) && validationFields !== null && validationFields !== void 0 && (_validationFields$fie2 = validationFields.fields) !== null && _validationFields$fie2 !== void 0 && (_validationFields$fie3 = _validationFields$fie2.checkout) !== null && _validationFields$fie3 !== void 0 && (_validationFields$fie4 = _validationFields$fie3.cellphone) !== null && _validationFields$fie4 !== void 0 && _validationFields$fie4.enabled && validationFields !== null && validationFields !== void 0 && (_validationFields$fie5 = validationFields.fields) !== null && _validationFields$fie5 !== void 0 && (_validationFields$fie6 = _validationFields$fie5.checkout) !== null && _validationFields$fie6 !== void 0 && (_validationFields$fie7 = _validationFields$fie6.cellphone) !== null && _validationFields$fie7 !== void 0 && _validationFields$fie7.required) {
      errors.push(t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Phone number is required'));
    }

    if (phoneUpdate) {
      errors.push(t('NECESSARY_UPDATE_COUNTRY_PHONE_CODE', 'It is necessary to update your phone number'));
    }

    setUserErrors(errors);
  };

  const togglePhoneUpdate = val => {
    setPhoneUpdate(val);
  };

  useEffect(() => {
    var _validationFields$fie8;

    if (validationFields && validationFields !== null && validationFields !== void 0 && (_validationFields$fie8 = validationFields.fields) !== null && _validationFields$fie8 !== void 0 && _validationFields$fie8.checkout) {
      checkValidationFields();
    }
  }, [validationFields, user]);
  useEffect(() => {
    if (errors) {
      const errorText = manageErrorsToShow(errors);
      showToast(ToastType.Error, errorText);
    }
  }, [errors]);
  useEffect(() => {
    handlePaymethodChange(null);
  }, [cart === null || cart === void 0 ? void 0 : cart.total]);
  return /*#__PURE__*/React.createElement(ChContainer, null, /*#__PURE__*/React.createElement(ChSection, {
    style: {
      paddingBottom: 20
    }
  }, /*#__PURE__*/React.createElement(OButton, {
    imgLeftSrc: IMAGES.arrow_left,
    imgRightSrc: null,
    style: style.btnBackArrow,
    onClick: () => navigation.goBack()
  }), /*#__PURE__*/React.createElement(ChHeader, null, /*#__PURE__*/React.createElement(OText, {
    size: 24
  }, t('CHECKOUT', 'Checkout')), /*#__PURE__*/React.createElement(OrderTypeSelector, {
    configTypes: configTypes
  }))), !cartState.loading && ((cart === null || cart === void 0 ? void 0 : cart.status) === 2 || (cart === null || cart === void 0 ? void 0 : cart.status) === 4) && /*#__PURE__*/React.createElement(ChSection, {
    style: {
      paddingBottom: 20
    }
  }, /*#__PURE__*/React.createElement(ChErrors, null, !cartState.loading && (cart === null || cart === void 0 ? void 0 : cart.status) === 2 && /*#__PURE__*/React.createElement(OText, {
    style: {
      textAlign: 'center'
    },
    color: colors.error,
    size: 17
  }, t('CART_STATUS_PENDING_MESSAGE_APP', 'Your order is being processed, please wait a little more. if you\'ve been waiting too long, please reload the app')), !cartState.loading && (cart === null || cart === void 0 ? void 0 : cart.status) === 4 && /*#__PURE__*/React.createElement(OText, {
    style: {
      textAlign: 'center'
    },
    color: colors.error,
    size: 17
  }, t('CART_STATUS_CANCEL_MESSAGE', 'The payment has not been successful, please try again')))), /*#__PURE__*/React.createElement(ChSection, null, /*#__PURE__*/React.createElement(ChTotal, null, ((businessDetails === null || businessDetails === void 0 ? void 0 : businessDetails.loading) || cartState.loading) && !(businessDetails !== null && businessDetails !== void 0 && businessDetails.error) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Placeholder, {
    Animation: Fade
  }, /*#__PURE__*/React.createElement(View, {
    style: {
      flexDirection: 'row'
    }
  }, /*#__PURE__*/React.createElement(PlaceholderLine, {
    width: 25,
    height: 70,
    style: {
      marginBottom: 10,
      marginRight: 10
    }
  }), /*#__PURE__*/React.createElement(PlaceholderLine, {
    width: 75,
    height: 20,
    style: {
      marginTop: 25
    }
  })))), !cartState.loading && !(businessDetails !== null && businessDetails !== void 0 && businessDetails.loading) && (businessDetails === null || businessDetails === void 0 ? void 0 : businessDetails.business) && Object.values(businessDetails === null || businessDetails === void 0 ? void 0 : businessDetails.business).length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(OIcon, {
    url: businessDetails === null || businessDetails === void 0 ? void 0 : (_businessDetails$busi = businessDetails.business) === null || _businessDetails$busi === void 0 ? void 0 : _businessDetails$busi.logo,
    width: 80,
    height: 80,
    borderRadius: 80
  }), /*#__PURE__*/React.createElement(View, {
    style: {
      marginLeft: 15,
      width: '85%'
    }
  }, /*#__PURE__*/React.createElement(OText, {
    size: 22,
    numberOfLines: 2,
    ellipsizeMode: "tail",
    style: {
      width: '85%'
    }
  }, businessDetails === null || businessDetails === void 0 ? void 0 : (_businessDetails$busi2 = businessDetails.business) === null || _businessDetails$busi2 === void 0 ? void 0 : _businessDetails$busi2.name), /*#__PURE__*/React.createElement(OText, {
    size: 22
  }, (cart === null || cart === void 0 ? void 0 : cart.total) >= 1 && parsePrice(cart === null || cart === void 0 ? void 0 : cart.total)))))), /*#__PURE__*/React.createElement(ChSection, {
    style: style.paddSection
  }, /*#__PURE__*/React.createElement(ChAddress, null, businessDetails !== null && businessDetails !== void 0 && businessDetails.loading || cartState.loading ? /*#__PURE__*/React.createElement(Placeholder, {
    Animation: Fade
  }, /*#__PURE__*/React.createElement(PlaceholderLine, {
    height: 20,
    style: {
      marginBottom: 50
    }
  }), /*#__PURE__*/React.createElement(PlaceholderLine, {
    height: 100
  })) : /*#__PURE__*/React.createElement(AddressDetails, {
    navigation: navigation,
    location: businessDetails === null || businessDetails === void 0 ? void 0 : (_businessDetails$busi3 = businessDetails.business) === null || _businessDetails$busi3 === void 0 ? void 0 : _businessDetails$busi3.location,
    businessLogo: businessDetails === null || businessDetails === void 0 ? void 0 : (_businessDetails$busi4 = businessDetails.business) === null || _businessDetails$busi4 === void 0 ? void 0 : _businessDetails$busi4.logo,
    isCartPending: (cart === null || cart === void 0 ? void 0 : cart.status) === 2,
    businessId: cart === null || cart === void 0 ? void 0 : cart.business_id,
    apiKey: configs === null || configs === void 0 ? void 0 : (_configs$google_maps_ = configs.google_maps_api_key) === null || _configs$google_maps_ === void 0 ? void 0 : _configs$google_maps_.value,
    mapConfigs: mapConfigs
  }))), /*#__PURE__*/React.createElement(ChSection, {
    style: style.paddSectionH
  }, /*#__PURE__*/React.createElement(ChMoment, null, /*#__PURE__*/React.createElement(CHMomentWrapper, {
    onPress: () => navigation.navigate('MomentOption')
  }, /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
    name: "clock-outline",
    size: 24,
    style: {
      marginRight: 5
    }
  }), /*#__PURE__*/React.createElement(OText, {
    size: 18,
    numberOfLines: 1,
    ellipsizeMode: "tail"
  }, options !== null && options !== void 0 && options.moment ? parseDate(options === null || options === void 0 ? void 0 : options.moment, {
    outputFormat: (configs === null || configs === void 0 ? void 0 : (_configs$format_time = configs.format_time) === null || _configs$format_time === void 0 ? void 0 : _configs$format_time.value) === '12' ? 'MM/DD hh:mma' : 'MM/DD HH:mm'
  }) : t('ASAP_ABBREVIATION', 'ASAP'))))), /*#__PURE__*/React.createElement(ChSection, {
    style: style.paddSection
  }, /*#__PURE__*/React.createElement(ChUserDetails, null, cartState.loading ? /*#__PURE__*/React.createElement(Placeholder, {
    Animation: Fade
  }, /*#__PURE__*/React.createElement(PlaceholderLine, {
    height: 20,
    width: 70
  }), /*#__PURE__*/React.createElement(PlaceholderLine, {
    height: 15,
    width: 60
  }), /*#__PURE__*/React.createElement(PlaceholderLine, {
    height: 15,
    width: 60
  }), /*#__PURE__*/React.createElement(PlaceholderLine, {
    height: 15,
    width: 80,
    style: {
      marginBottom: 20
    }
  })) : /*#__PURE__*/React.createElement(UserDetails, {
    isUserDetailsEdit: isUserDetailsEdit,
    cartStatus: cart === null || cart === void 0 ? void 0 : cart.status,
    businessId: cart === null || cart === void 0 ? void 0 : cart.business_id,
    useValidationFields: true,
    useDefualtSessionManager: true,
    useSessionUser: true,
    isCheckout: true,
    phoneUpdate: phoneUpdate,
    togglePhoneUpdate: togglePhoneUpdate
  }))), /*#__PURE__*/React.createElement(ChSection, {
    style: style.paddSectionH
  }, /*#__PURE__*/React.createElement(ChBusinessDetails, null, ((businessDetails === null || businessDetails === void 0 ? void 0 : businessDetails.loading) || cartState.loading) && !(businessDetails !== null && businessDetails !== void 0 && businessDetails.error) && /*#__PURE__*/React.createElement(Placeholder, {
    Animation: Fade
  }, /*#__PURE__*/React.createElement(PlaceholderLine, {
    height: 20,
    width: 70
  }), /*#__PURE__*/React.createElement(PlaceholderLine, {
    height: 15,
    width: 60
  }), /*#__PURE__*/React.createElement(PlaceholderLine, {
    height: 15,
    width: 60
  }), /*#__PURE__*/React.createElement(PlaceholderLine, {
    height: 15,
    width: 80,
    style: {
      marginBottom: 20
    }
  })), !cartState.loading && (businessDetails === null || businessDetails === void 0 ? void 0 : businessDetails.business) && Object.values(businessDetails === null || businessDetails === void 0 ? void 0 : businessDetails.business).length > 0 && /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(OText, {
    size: 20
  }, t('BUSINESS_DETAILS', 'Business Details')), /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(OText, {
    size: 16
  }, /*#__PURE__*/React.createElement(OText, {
    size: 18,
    weight: "bold"
  }, t('NAME', 'Name'), ":", ' '), businessDetails === null || businessDetails === void 0 ? void 0 : (_businessDetails$busi5 = businessDetails.business) === null || _businessDetails$busi5 === void 0 ? void 0 : _businessDetails$busi5.name), /*#__PURE__*/React.createElement(OText, {
    size: 16
  }, /*#__PURE__*/React.createElement(OText, {
    size: 18,
    weight: "bold"
  }, t('EMAIL', 'Email'), ":", ' '), businessDetails === null || businessDetails === void 0 ? void 0 : (_businessDetails$busi6 = businessDetails.business) === null || _businessDetails$busi6 === void 0 ? void 0 : _businessDetails$busi6.email), /*#__PURE__*/React.createElement(OText, {
    size: 16
  }, /*#__PURE__*/React.createElement(OText, {
    size: 18,
    weight: "bold"
  }, t('CELLPHONE', 'Cellphone'), ":", ' '), businessDetails === null || businessDetails === void 0 ? void 0 : (_businessDetails$busi7 = businessDetails.business) === null || _businessDetails$busi7 === void 0 ? void 0 : _businessDetails$busi7.cellphone), /*#__PURE__*/React.createElement(OText, {
    size: 16
  }, /*#__PURE__*/React.createElement(OText, {
    size: 18,
    weight: "bold"
  }, t('ADDRESS', 'Address'), ":", ' '), businessDetails === null || businessDetails === void 0 ? void 0 : (_businessDetails$busi8 = businessDetails.business) === null || _businessDetails$busi8 === void 0 ? void 0 : _businessDetails$busi8.address))), (businessDetails === null || businessDetails === void 0 ? void 0 : businessDetails.error) && (businessDetails === null || businessDetails === void 0 ? void 0 : (_businessDetails$erro = businessDetails.error) === null || _businessDetails$erro === void 0 ? void 0 : _businessDetails$erro.length) > 0 && /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(OText, {
    size: 20
  }, t('BUSINESS_DETAILS', 'Business Details')), /*#__PURE__*/React.createElement(NotFoundSource, {
    content: (businessDetails === null || businessDetails === void 0 ? void 0 : (_businessDetails$erro2 = businessDetails.error[0]) === null || _businessDetails$erro2 === void 0 ? void 0 : _businessDetails$erro2.message) || (businessDetails === null || businessDetails === void 0 ? void 0 : businessDetails.error[0])
  })))), !cartState.loading && cart && (cart === null || cart === void 0 ? void 0 : cart.status) !== 2 && /*#__PURE__*/React.createElement(ChSection, {
    style: style.paddSection
  }, /*#__PURE__*/React.createElement(ChPaymethods, null, /*#__PURE__*/React.createElement(OText, {
    size: 20
  }, t('PAYMENT_METHOD', 'Payment Method')), /*#__PURE__*/React.createElement(PaymentOptions, {
    cart: cart,
    isDisabled: (cart === null || cart === void 0 ? void 0 : cart.status) === 2,
    businessId: businessDetails === null || businessDetails === void 0 ? void 0 : (_businessDetails$busi9 = businessDetails.business) === null || _businessDetails$busi9 === void 0 ? void 0 : _businessDetails$busi9.id,
    isLoading: businessDetails.loading,
    paymethods: businessDetails === null || businessDetails === void 0 ? void 0 : (_businessDetails$busi10 = businessDetails.business) === null || _businessDetails$busi10 === void 0 ? void 0 : _businessDetails$busi10.paymethods,
    onPaymentChange: handlePaymethodChange,
    errorCash: errorCash,
    setErrorCash: setErrorCash,
    onNavigationRedirect: onNavigationRedirect,
    isPaymethodNull: paymethodSelected
  }))), !cartState.loading && cart && options.type === 1 && (cart === null || cart === void 0 ? void 0 : cart.status) !== 2 && (validationFields === null || validationFields === void 0 ? void 0 : (_validationFields$fie9 = validationFields.fields) === null || _validationFields$fie9 === void 0 ? void 0 : (_validationFields$fie10 = _validationFields$fie9.checkout) === null || _validationFields$fie10 === void 0 ? void 0 : (_validationFields$fie11 = _validationFields$fie10.driver_tip) === null || _validationFields$fie11 === void 0 ? void 0 : _validationFields$fie11.enabled) && /*#__PURE__*/React.createElement(ChSection, {
    style: style.paddSectionH
  }, /*#__PURE__*/React.createElement(ChDriverTips, null, /*#__PURE__*/React.createElement(OText, {
    size: 20
  }, t('DRIVER_TIPS', 'Driver Tips')), /*#__PURE__*/React.createElement(DriverTips, {
    businessId: cart === null || cart === void 0 ? void 0 : cart.business_id,
    driverTipsOptions: driverTipsOptions,
    useOrderContext: true
  }))), !cartState.loading && cart && /*#__PURE__*/React.createElement(ChSection, {
    style: style.paddSection
  }, /*#__PURE__*/React.createElement(ChCart, null, cartsWithProducts && (cart === null || cart === void 0 ? void 0 : (_cart$products = cart.products) === null || _cart$products === void 0 ? void 0 : _cart$products.length) === 0 ? /*#__PURE__*/React.createElement(NotFoundSource, {
    content: t('NOT_FOUND_CARTS', 'Sorry, You don\'t seem to have any carts.'),
    btnTitle: t('SEARCH_REDIRECT', 'Go to Businesses')
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(OText, {
    size: 20
  }, t('ORDER_SUMMARY', 'Order Summary')), /*#__PURE__*/React.createElement(OrderSummary, {
    cart: cart,
    isCartPending: (cart === null || cart === void 0 ? void 0 : cart.status) === 2
  })))), !cartState.loading && cart && (cart === null || cart === void 0 ? void 0 : cart.status) !== 2 && /*#__PURE__*/React.createElement(ChSection, {
    style: style.paddSectionH
  }, /*#__PURE__*/React.createElement(ChPlaceOrderBtn, null, /*#__PURE__*/React.createElement(OButton, {
    onClick: () => handlePlaceOrder(),
    bgColor: (cart === null || cart === void 0 ? void 0 : cart.subtotal) < (cart === null || cart === void 0 ? void 0 : cart.minimum) ? colors.secundary : colors.primary,
    borderColor: colors.primary,
    textStyle: {
      color: 'white',
      fontSize: 20
    },
    imgRightSrc: null // isLoading={formState.loading}
    ,
    isDisabled: !(cart !== null && cart !== void 0 && cart.valid) || !paymethodSelected || placing || errorCash || (cart === null || cart === void 0 ? void 0 : cart.subtotal) < (cart === null || cart === void 0 ? void 0 : cart.minimum),
    text: (cart === null || cart === void 0 ? void 0 : cart.subtotal) >= (cart === null || cart === void 0 ? void 0 : cart.minimum) ? placing ? t('PLACING', 'Placing') : t('PLACE_ORDER', 'Place Order') : `${t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} ${parsePrice(cart === null || cart === void 0 ? void 0 : cart.minimum)}`
  }))), !cartState.loading && cart && /*#__PURE__*/React.createElement(ChSection, {
    style: style.paddSection
  }, /*#__PURE__*/React.createElement(ChErrors, null, !(cart !== null && cart !== void 0 && cart.valid_address) && (cart === null || cart === void 0 ? void 0 : cart.status) !== 2 && /*#__PURE__*/React.createElement(OText, {
    style: {
      textAlign: 'center'
    },
    color: colors.error,
    size: 14
  }, t('INVALID_CART_ADDRESS', 'Selected address is invalid, please select a closer address.')), !paymethodSelected && (cart === null || cart === void 0 ? void 0 : cart.status) !== 2 && /*#__PURE__*/React.createElement(OText, {
    style: {
      textAlign: 'center'
    },
    color: colors.error,
    size: 14
  }, t('WARNING_NOT_PAYMENT_SELECTED', 'Please, select a payment method to place order.')), !(cart !== null && cart !== void 0 && cart.valid_products) && (cart === null || cart === void 0 ? void 0 : cart.status) !== 2 && /*#__PURE__*/React.createElement(OText, {
    style: {
      textAlign: 'center'
    },
    color: colors.error,
    size: 14
  }, t('WARNING_INVALID_PRODUCTS', 'Some products are invalid, please check them.')))));
};

const style = StyleSheet.create({
  btnBackArrow: {
    borderWidth: 0,
    backgroundColor: '#FFF',
    borderColor: '#FFF',
    display: 'flex',
    justifyContent: 'flex-start',
    paddingLeft: 0,
    width: 20
  },
  paddSection: {
    padding: 20
  },
  paddSectionH: {
    paddingHorizontal: 20
  }
});
export const Checkout = props => {
  var _cartState$cart;

  const {
    errors,
    clearErrors,
    cartUuid,
    stripePaymentOptions,
    onNavigationRedirect
  } = props;
  const {
    showToast
  } = useToast();
  const [, t] = useLanguage();
  const [{
    token
  }] = useSession();
  const [ordering] = useApi();
  const [orderState, {
    confirmCart
  }] = useOrder();
  const [cartState, setCartState] = useState({
    loading: true,
    error: [],
    cart: null
  });
  const [currentCart, setCurrentCart] = useState({
    business_id: null,
    products: null
  });

  const getOrder = async cartId => {
    try {
      var _result$order, _result$paymethod_dat, _result$paymethod_dat2;

      setCartState({ ...cartState,
        loading: true
      });
      const url = `${ordering.root}/carts/${cartId}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const {
        result
      } = await response.json();
      let publicKey = null;

      try {
        const {
          content
        } = await ordering.setAccessToken(token).paymentCards().getCredentials();

        if (!content.error) {
          publicKey = content.result.publishable;
        }
      } catch (error) {
        publicKey = null;
      }

      if (result.status === 1 && (_result$order = result.order) !== null && _result$order !== void 0 && _result$order.uuid) {
        onNavigationRedirect('OrderDetails', {
          orderId: result.order.uuid
        });
        setCartState({ ...cartState,
          loading: false
        });
      } else if (result.status === 2 && ((_result$paymethod_dat = result.paymethod_data) === null || _result$paymethod_dat === void 0 ? void 0 : _result$paymethod_dat.gateway) === 'stripe_redirect') {
        try {
          var _confirmCartRes$resul;

          const confirmCartRes = await confirmCart(cartUuid);

          if (confirmCartRes.error) {
            showToast(ToastType.Error, confirmCartRes.error.message);
          }

          if ((_confirmCartRes$resul = confirmCartRes.result.order) !== null && _confirmCartRes$resul !== void 0 && _confirmCartRes$resul.uuid) {
            onNavigationRedirect('OrderDetails', {
              orderId: confirmCartRes.result.order.uuid,
              isFromCheckout: true
            });
          }

          setCartState({ ...cartState,
            loading: false,
            cart: result
          });
        } catch (error) {
          showToast(ToastType.Error, (error === null || error === void 0 ? void 0 : error.toString()) || error.message);
        }
      } else if (result.status === 2 && stripePaymentOptions.includes((_result$paymethod_dat2 = result.paymethod_data) === null || _result$paymethod_dat2 === void 0 ? void 0 : _result$paymethod_dat2.gateway)) {
        var _result$paymethod_dat3, _result$paymethod_dat4, _result$paymethod_dat5, _result$paymethod_dat6;

        const clientSecret = (_result$paymethod_dat3 = result.paymethod_data) === null || _result$paymethod_dat3 === void 0 ? void 0 : (_result$paymethod_dat4 = _result$paymethod_dat3.result) === null || _result$paymethod_dat4 === void 0 ? void 0 : _result$paymethod_dat4.client_secret;
        const paymentMethodId = (_result$paymethod_dat5 = result.paymethod_data) === null || _result$paymethod_dat5 === void 0 ? void 0 : (_result$paymethod_dat6 = _result$paymethod_dat5.data) === null || _result$paymethod_dat6 === void 0 ? void 0 : _result$paymethod_dat6.source_id;
        stripe.setOptions({
          publishableKey: publicKey // androidPayMode: 'test', // Android only

        });

        try {
          const confirmPaymentIntent = await stripe.confirmPaymentIntent({
            clientSecret,
            paymentMethodId
          });

          if ((confirmPaymentIntent === null || confirmPaymentIntent === void 0 ? void 0 : confirmPaymentIntent.status) === 'succeeded') {
            try {
              var _confirmCartRes$resul2;

              const confirmCartRes = await confirmCart(cartUuid);

              if (confirmCartRes.error) {
                showToast(ToastType.Error, confirmCartRes.error.message);
              }

              if ((_confirmCartRes$resul2 = confirmCartRes.result.order) !== null && _confirmCartRes$resul2 !== void 0 && _confirmCartRes$resul2.uuid) {
                onNavigationRedirect('OrderDetails', {
                  orderId: confirmCartRes.result.order.uuid,
                  isFromCheckout: true
                });
              }
            } catch (error) {
              showToast(ToastType.Error, (error === null || error === void 0 ? void 0 : error.toString()) || error.message);
            }

            setCartState({ ...cartState,
              loading: false,
              cart: result
            });
            return;
          }
        } catch (error) {
          const e = error.message === 'failed' ? t('FAILED_PAYMENT', 'Failed payment') : (error === null || error === void 0 ? void 0 : error.toString()) || error.message;

          if (e.includes('The provided PaymentMethod was previously used with a PaymentIntent')) {
            showToast(ToastType.Error, t('CART_STATUS_CANCEL_MESSAGE', 'The payment has not been successful, please try again'));

            try {
              const confirmCartRes = await confirmCart(cartUuid);

              if (confirmCartRes.error) {
                showToast(ToastType.Error, confirmCartRes.error.message);
              }

              setCartState({ ...cartState,
                loading: false,
                cart: result
              });
            } catch (error) {
              showToast(ToastType.Error, (error === null || error === void 0 ? void 0 : error.toString()) || error.message);
            }

            return;
          }

          showToast(ToastType.Error, e);
          const cart = Array.isArray(result) ? null : result;
          setCartState({ ...cartState,
            loading: false,
            cart,
            error: cart ? null : result
          });
        }
      } else {
        const cart = Array.isArray(result) ? null : result;
        setCartState({ ...cartState,
          loading: false,
          cart,
          error: cart ? null : result
        });
      }
    } catch (e) {
      setCartState({ ...cartState,
        loading: false,
        error: [e.toString()]
      });
    }
  };

  useEffect(() => {
    if (!orderState.loading && currentCart !== null && currentCart !== void 0 && currentCart.business_id) {
      const cartMatched = Object.values(orderState.carts).find(cart => cart.business_id === (currentCart === null || currentCart === void 0 ? void 0 : currentCart.business_id)) || {};
      setCurrentCart(cartMatched);
    }
  }, [orderState.loading]);
  useEffect(() => {
    if (errors) {
      const errorText = manageErrorsToShow(errors);
      showToast(ToastType.Error, errorText);
      clearErrors && clearErrors();
    }
  }, [errors]);
  useEffect(() => {
    if (token && cartUuid) {
      getOrder(cartUuid);
    }
  }, [token, cartUuid]);
  const checkoutProps = { ...props,
    UIComponent: CheckoutUI,
    cartState,
    businessId: (_cartState$cart = cartState.cart) === null || _cartState$cart === void 0 ? void 0 : _cartState$cart.business_id
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, cartState.loading ? /*#__PURE__*/React.createElement(Spinner, {
    visible: cartState.loading
  }) : /*#__PURE__*/React.createElement(CheckoutController, checkoutProps));
};
//# sourceMappingURL=index.js.map