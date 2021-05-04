import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { PaymentOptionStripe as PaymentOptionStripeController, useSession, useLanguage } from 'ordering-components/native';
import { PlaceholderLine } from 'rn-placeholder';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getIconCard } from '../../utils';
import { OAlert, OButton, OModal, OText } from '../shared';
import { NotFoundSource } from '../NotFoundSource';
import { StripeElementsForm } from '../StripeElementsForm';
import { OSContainer, OSItem, OSItemContent, OSItemActions, OSWrapper, OSActions } from './styles';
import { colors } from '../../theme';

const PaymentOptionStripeUI = props => {
  var _cardsList$error$, _cardsList$cards;

  const {
    onSelectCard,
    onCancel,
    deleteCard,
    cardSelected,
    cardsList,
    handleCardClick,
    handleNewCard
  } = props;
  const [{
    token
  }] = useSession();
  const [, t] = useLanguage();
  const [addCartOpen, setAddCardOpen] = useState(false);

  const _handleNewCard = card => {
    setAddCardOpen(false);
    handleNewCard(card);
  };

  const handleDeleteCard = card => {
    deleteCard(card);
  };

  const renderCards = ({
    item
  }) => {
    return /*#__PURE__*/React.createElement(OSItem, {
      key: item.id
    }, /*#__PURE__*/React.createElement(OSItemContent, {
      onPress: () => handleCardClick(item)
    }, /*#__PURE__*/React.createElement(View, {
      style: styles.viewStyle
    }, item.id === (cardSelected === null || cardSelected === void 0 ? void 0 : cardSelected.id) ? /*#__PURE__*/React.createElement(MaterialCommunityIcons, {
      name: "radiobox-marked",
      size: 24,
      color: colors.primary
    }) : /*#__PURE__*/React.createElement(MaterialCommunityIcons, {
      name: "radiobox-blank",
      size: 24,
      color: colors.primary
    })), /*#__PURE__*/React.createElement(View, {
      style: styles.viewStyle
    }, getIconCard(item.brand, 26)), /*#__PURE__*/React.createElement(View, {
      style: styles.viewStyle
    }, /*#__PURE__*/React.createElement(OText, {
      size: 20
    }, "XXXX-XXXX-XXXX-", item.last4))), /*#__PURE__*/React.createElement(OSItemActions, null, /*#__PURE__*/React.createElement(OAlert, {
      title: t('CARD', 'Card'),
      message: t('QUESTION_DELETE_CARD', 'Are you sure that you want to delete the card?'),
      onAccept: () => handleDeleteCard(item)
    }, /*#__PURE__*/React.createElement(MaterialCommunityIcons, {
      name: "trash-can-outline",
      size: 28,
      color: colors.primary
    }))));
  };

  return /*#__PURE__*/React.createElement(OSContainer, {
    style: styles.container
  }, token && !cardsList.loading && cardsList.cards && cardsList.cards.length === 0 && /*#__PURE__*/React.createElement(OSItem, null, /*#__PURE__*/React.createElement(OText, {
    size: 22
  }, t('YOU_DONT_HAVE_CARDS', 'You don\'t have cards'))), token && cardsList.error && cardsList.error.length > 0 && /*#__PURE__*/React.createElement(NotFoundSource, {
    content: (cardsList === null || cardsList === void 0 ? void 0 : (_cardsList$error$ = cardsList.error[0]) === null || _cardsList$error$ === void 0 ? void 0 : _cardsList$error$.message) || (cardsList === null || cardsList === void 0 ? void 0 : cardsList.error[0])
  }), token && cardsList.cards && cardsList.cards.length > 0 && /*#__PURE__*/React.createElement(FlatList, {
    horizontal: false,
    showsHorizontalScrollIndicator: false,
    data: cardsList.cards,
    renderItem: renderCards,
    keyExtractor: card => {
      var _card$id;

      return (_card$id = card.id) === null || _card$id === void 0 ? void 0 : _card$id.toString();
    },
    style: {
      height: '65%',
      flexGrow: 0
    }
  }), token && !cardsList.loading && /*#__PURE__*/React.createElement(OSWrapper, {
    style: styles.bottom
  }, /*#__PURE__*/React.createElement(OButton, {
    text: t('ADD_PAYMENT_CARD', 'Add New Payment Card'),
    bgColor: colors.primary,
    borderColor: colors.primary,
    style: styles.btnAddStyle,
    textStyle: {
      color: 'white'
    },
    imgRightSrc: null,
    onClick: () => setAddCardOpen(true)
  }), /*#__PURE__*/React.createElement(OSActions, null, /*#__PURE__*/React.createElement(View, {
    style: {
      width: '48%'
    }
  }, /*#__PURE__*/React.createElement(OButton, {
    text: t('CANCEL', 'Cancel'),
    bgColor: colors.backgroundGray,
    borderColor: colors.backgroundGray,
    textStyle: {
      color: 'white'
    },
    style: styles.btnAction,
    imgRightSrc: null,
    onClick: () => onCancel()
  })), /*#__PURE__*/React.createElement(View, {
    style: {
      width: '48%'
    }
  }, /*#__PURE__*/React.createElement(OButton, {
    text: t('ACCEPT', 'Accept'),
    bgColor: colors.primary,
    borderColor: colors.primary,
    textStyle: {
      color: 'white'
    },
    style: styles.btnAction,
    imgRightSrc: null,
    isDisabled: !cardSelected || (cardsList === null || cardsList === void 0 ? void 0 : (_cardsList$cards = cardsList.cards) === null || _cardsList$cards === void 0 ? void 0 : _cardsList$cards.length) === 0,
    onClick: () => onSelectCard(cardSelected)
  })))), /*#__PURE__*/React.createElement(OModal, {
    isNotDecoration: true,
    title: t('ADD_CREDIT_OR_DEBIT_CARD', 'Add credit or debit card'),
    open: addCartOpen,
    onClose: () => setAddCardOpen(false)
  }, /*#__PURE__*/React.createElement(KeyboardAvoidingView, {
    behavior: Platform.OS == 'ios' ? 'padding' : 'height',
    keyboardVerticalOffset: Platform.OS == 'ios' ? 0 : 0,
    enabled: Platform.OS === 'ios' ? true : false
  }, /*#__PURE__*/React.createElement(StripeElementsForm, {
    toSave: true,
    businessId: props.businessId,
    publicKey: props.publicKey,
    requirements: props.clientSecret,
    onNewCard: _handleNewCard,
    onCancel: () => setAddCardOpen(false)
  }))), token && cardsList.loading && /*#__PURE__*/React.createElement(React.Fragment, null, [...Array(5)].map((_, i) => /*#__PURE__*/React.createElement(PlaceholderLine, {
    key: i,
    height: 50,
    width: 90,
    noMargin: true,
    style: {
      marginVertical: 20
    }
  }))));
};

const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    height: screenHeight - 90
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 20
  },
  viewStyle: {
    marginRight: 10
  },
  btnAddStyle: {
    marginTop: 20
  },
  btnAction: {
    paddingHorizontal: 20
  }
});
export const PaymentOptionStripe = props => {
  const paymentOptionStripeProps = { ...props,
    UIComponent: PaymentOptionStripeUI
  };
  return /*#__PURE__*/React.createElement(PaymentOptionStripeController, paymentOptionStripeProps);
};
//# sourceMappingURL=index.js.map