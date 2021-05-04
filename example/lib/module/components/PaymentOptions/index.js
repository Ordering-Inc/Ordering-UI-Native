import React, { useEffect } from 'react';
import { FlatList, TouchableOpacity, View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Placeholder, PlaceholderLine, Fade } from "rn-placeholder";
import { PaymentOptions as PaymentOptionsController, useLanguage } from 'ordering-components/native';
import { PaymentOptionCash } from '../PaymentOptionCash';
import { PaymentOptionStripe } from '../PaymentOptionStripe';
import { StripeElementsForm } from '../StripeElementsForm';
// import { PaymentOptionPaypal } from '../PaymentOptionPaypal'
// import { NotFoundSource } from '../NotFoundSource'
import { PAYMENT_IMAGES } from '../../config/constants';
import { OText, OIcon, OModal } from '../shared';
import { PMContainer, PMItem, PMCardSelected, PMCardItemContent } from './styles';
import { colors } from '../../theme';
import { getIconCard } from '../../utils';
const stripeOptions = ['stripe_direct', 'stripe', 'stripe_connect'];
const stripeRedirectOptions = [{
  name: 'Bancontact',
  value: 'bancontact'
}, {
  name: 'Alipay',
  value: 'alipay'
}, {
  name: 'Giropay',
  value: 'giropay'
}, {
  name: 'iDEAL',
  value: 'ideal'
}];

const getPayIcon = method => {
  switch (method) {
    case 'cash':
      return PAYMENT_IMAGES.cash;

    case 'card_delivery':
      return PAYMENT_IMAGES.carddelivery;

    case 'paypal':
      return PAYMENT_IMAGES.paypal;

    case 'stripe':
      return PAYMENT_IMAGES.stripe;

    case 'stripe_direct':
      return PAYMENT_IMAGES.stripecc;

    case 'stripe_connect':
      return PAYMENT_IMAGES.stripes;

    case 'stripe_redirect':
      return PAYMENT_IMAGES.stripesb;

    default:
      return PAYMENT_IMAGES.creditCard;
  }
};

const paypalBtnStyle = {
  color: 'gold',
  shape: 'pill',
  label: 'paypal',
  size: 'responsive'
};

const PaymentOptionsUI = props => {
  var _paymethodsList$error, _paymethodData$card, _paymethodData$card2;

  const {
    cart,
    errorCash,
    isLoading,
    isDisabled,
    paymethodSelected,
    paymethodData,
    paymethodsList,
    isPaymethodNull,
    onNavigationRedirect,
    handlePaymethodClick,
    handlePaymethodDataChange
  } = props;
  const [, t] = useLanguage(); // const [{ token }] = useSession()

  const stripeRedirectValues = [{
    name: t('SELECT_A_PAYMENT_METHOD', 'Select a payment method'),
    value: '-1'
  }];
  useEffect(() => {
    if (paymethodsList.paymethods.length === 1) {
      handlePaymethodClick && handlePaymethodClick(paymethodsList.paymethods[0]);
    }
  }, [paymethodsList.paymethods]);
  useEffect(() => {
    if ((paymethodSelected === null || paymethodSelected === void 0 ? void 0 : paymethodSelected.gateway) !== 'cash' && errorCash) {
      props.setErrorCash(false);
    }
  }, [paymethodSelected]);
  useEffect(() => {
    !isPaymethodNull && handlePaymethodClick && handlePaymethodClick(isPaymethodNull);
  }, [isPaymethodNull]);

  const renderPaymethods = ({
    item
  }) => {
    return /*#__PURE__*/React.createElement(TouchableOpacity, {
      onPress: () => handlePaymethodClick(item)
    }, /*#__PURE__*/React.createElement(PMItem, {
      key: item.id,
      isDisabled: isDisabled,
      isActive: (paymethodSelected === null || paymethodSelected === void 0 ? void 0 : paymethodSelected.id) === item.id
    }, /*#__PURE__*/React.createElement(OIcon, {
      src: getPayIcon(item.gateway),
      width: 40,
      height: 40,
      color: (paymethodSelected === null || paymethodSelected === void 0 ? void 0 : paymethodSelected.id) === item.id ? colors.white : colors.backgroundDark
    }), /*#__PURE__*/React.createElement(OText, {
      size: 12,
      style: {
        margin: 0
      },
      color: (paymethodSelected === null || paymethodSelected === void 0 ? void 0 : paymethodSelected.id) === item.id ? colors.white : '#000'
    }, item.name)));
  };

  const excludeIds = [3, 31, 32]; //exclude paypal & connect & redirect

  return /*#__PURE__*/React.createElement(PMContainer, null, paymethodsList.paymethods.length > 0 && /*#__PURE__*/React.createElement(FlatList, {
    horizontal: true,
    showsHorizontalScrollIndicator: false // data={paymethodsList.paymethods.sort((a: any, b: any) => a.id - b.id)}
    ,
    data: paymethodsList.paymethods.sort((a, b) => a.id - b.id).filter(p => !excludeIds.includes(p.id)),
    renderItem: renderPaymethods,
    keyExtractor: paymethod => paymethod.id.toString()
  }), (paymethodsList.loading || isLoading) && /*#__PURE__*/React.createElement(Placeholder, {
    style: {
      marginTop: 10
    },
    Animation: Fade
  }, /*#__PURE__*/React.createElement(View, {
    style: {
      display: 'flex',
      flexDirection: 'row'
    }
  }, [...Array(3)].map((_, i) => /*#__PURE__*/React.createElement(PlaceholderLine, {
    key: i,
    width: 37,
    height: 80,
    noMargin: true,
    style: {
      borderRadius: 10,
      marginRight: 10
    }
  })))), paymethodsList.error && paymethodsList.error.length > 0 && /*#__PURE__*/React.createElement(OText, {
    size: 12,
    style: {
      margin: 0
    }
  }, (paymethodsList === null || paymethodsList === void 0 ? void 0 : (_paymethodsList$error = paymethodsList.error[0]) === null || _paymethodsList$error === void 0 ? void 0 : _paymethodsList$error.message) || (paymethodsList === null || paymethodsList === void 0 ? void 0 : paymethodsList.error[0])), !(paymethodsList.loading || isLoading) && !paymethodsList.error && (!(paymethodsList !== null && paymethodsList !== void 0 && paymethodsList.paymethods) || paymethodsList.paymethods.length === 0) && /*#__PURE__*/React.createElement(OText, {
    size: 12,
    style: {
      margin: 0
    }
  }, t('NO_PAYMENT_METHODS', 'No payment methods!')), (paymethodSelected === null || paymethodSelected === void 0 ? void 0 : paymethodSelected.gateway) === 'cash' && /*#__PURE__*/React.createElement(PaymentOptionCash, {
    orderTotal: cart.total,
    onChangeData: handlePaymethodDataChange,
    setErrorCash: props.setErrorCash
  }), stripeOptions.includes(paymethodSelected === null || paymethodSelected === void 0 ? void 0 : paymethodSelected.gateway) && (paymethodData === null || paymethodData === void 0 ? void 0 : paymethodData.card) && /*#__PURE__*/React.createElement(PMCardSelected, null, /*#__PURE__*/React.createElement(PMCardItemContent, null, /*#__PURE__*/React.createElement(View, {
    style: styles.viewStyle
  }, /*#__PURE__*/React.createElement(MaterialCommunityIcons, {
    name: "radiobox-marked",
    size: 24,
    color: colors.primary
  })), /*#__PURE__*/React.createElement(View, {
    style: styles.viewStyle
  }, /*#__PURE__*/React.createElement(OText, null, getIconCard(paymethodData === null || paymethodData === void 0 ? void 0 : (_paymethodData$card = paymethodData.card) === null || _paymethodData$card === void 0 ? void 0 : _paymethodData$card.brand, 26))), /*#__PURE__*/React.createElement(View, {
    style: styles.viewStyle
  }, /*#__PURE__*/React.createElement(OText, null, "XXXX-XXXX-XXXX-", paymethodData === null || paymethodData === void 0 ? void 0 : (_paymethodData$card2 = paymethodData.card) === null || _paymethodData$card2 === void 0 ? void 0 : _paymethodData$card2.last4)))), /*#__PURE__*/React.createElement(OModal, {
    isNotDecoration: true,
    open: (paymethodSelected === null || paymethodSelected === void 0 ? void 0 : paymethodSelected.gateway) === 'stripe' && !paymethodData.id,
    title: t('SELECT_A_CARD', 'Select a card'),
    onClose: () => handlePaymethodClick(null)
  }, (paymethodSelected === null || paymethodSelected === void 0 ? void 0 : paymethodSelected.gateway) === 'stripe' && /*#__PURE__*/React.createElement(PaymentOptionStripe, {
    paymethod: paymethodSelected,
    businessId: props.businessId,
    publicKey: paymethodSelected.credentials.publishable,
    payType: paymethodsList === null || paymethodsList === void 0 ? void 0 : paymethodsList.name,
    onSelectCard: handlePaymethodDataChange,
    onNavigationRedirect: onNavigationRedirect,
    onCancel: () => handlePaymethodClick(null)
  })), /*#__PURE__*/React.createElement(OModal, {
    isNotDecoration: true,
    title: t('ADD_CREDIT_OR_DEBIT_CARD', 'Add credit or debit card'),
    open: (paymethodSelected === null || paymethodSelected === void 0 ? void 0 : paymethodSelected.gateway) === 'stripe_direct' && !paymethodData.id,
    onClose: () => handlePaymethodClick(null)
  }, (paymethodSelected === null || paymethodSelected === void 0 ? void 0 : paymethodSelected.gateway) === 'stripe_direct' && /*#__PURE__*/React.createElement(KeyboardAvoidingView, {
    behavior: Platform.OS == 'ios' ? 'padding' : 'height',
    keyboardVerticalOffset: Platform.OS == 'ios' ? 0 : 0,
    enabled: Platform.OS === 'ios' ? true : false
  }, /*#__PURE__*/React.createElement(StripeElementsForm, {
    businessId: props.businessId,
    publicKey: paymethodSelected.credentials.publishable,
    handleSource: handlePaymethodDataChange,
    onCancel: () => handlePaymethodClick(null)
  }))));
};

const styles = StyleSheet.create({
  viewStyle: {
    marginRight: 10
  }
});
export const PaymentOptions = props => {
  const paymentOptions = { ...props,
    UIComponent: PaymentOptionsUI
  };
  return /*#__PURE__*/React.createElement(PaymentOptionsController, paymentOptions);
};
//# sourceMappingURL=index.js.map