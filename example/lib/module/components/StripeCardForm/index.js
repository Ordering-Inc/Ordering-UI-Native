import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLanguage } from 'ordering-components/native';
import { CreditCardInput } from 'react-native-credit-card-input';
import { StripeCardForm as CardForm } from './naked';
import { FormStripe, FormRow, ErrorMessage, FormActions } from './styles';
import { OButton, OText } from '../shared';
import { colors } from '../../theme';

const StripeCardFormUI = props => {
  const {
    stateCardForm,
    handleCancel
  } = props;
  const {
    error,
    loading
  } = stateCardForm;
  const [, t] = useLanguage();
  const [cardState, setCardState] = useState(null);

  const handleChange = values => setCardState(values);

  const handleSubmit = () => props.handleSubmit && props.handleSubmit(cardState);

  return /*#__PURE__*/React.createElement(FormStripe, null, /*#__PURE__*/React.createElement(FormRow, {
    style: {
      marginTop: 30
    }
  }, /*#__PURE__*/React.createElement(CreditCardInput, {
    autoFocus: true,
    requiresCVC: true,
    labelStyle: styles.label,
    inputStyle: styles.input,
    validColor: '#000000',
    invalidColor: colors.cancelColor,
    placeholderColor: colors.backgroundGray,
    onChange: handleChange
  }), /*#__PURE__*/React.createElement(ErrorMessage, null, /*#__PURE__*/React.createElement(OText, {
    color: colors.error,
    style: {
      textAlign: 'center'
    }
  }, error))), /*#__PURE__*/React.createElement(FormActions, null, /*#__PURE__*/React.createElement(View, {
    style: {
      width: '49%'
    }
  }, /*#__PURE__*/React.createElement(OButton, {
    text: t('CANCEL', 'Cancel'),
    bgColor: colors.backgroundGray,
    borderColor: colors.backgroundGray,
    textStyle: {
      color: 'white'
    },
    imgRightSrc: null,
    onClick: () => handleCancel()
  })), /*#__PURE__*/React.createElement(View, {
    style: {
      width: '49%'
    }
  }, /*#__PURE__*/React.createElement(OButton, {
    text: loading ? t('LOADING', 'Loading...') : t('ADD', 'Add'),
    isDisabled: !(cardState !== null && cardState !== void 0 && cardState.valid) || loading,
    bgColor: colors.primary,
    borderColor: colors.primary,
    textStyle: {
      color: 'white'
    },
    imgRightSrc: null,
    onClick: handleSubmit
  }))));
};

const styles = StyleSheet.create({
  label: {
    color: '#000',
    fontSize: 14
  },
  input: {
    fontSize: 18,
    color: '#000'
  }
});
export const StripeCardForm = props => {
  const cardFormProps = { ...props,
    UIComponent: StripeCardFormUI
  };
  return /*#__PURE__*/React.createElement(CardForm, cardFormProps);
};
//# sourceMappingURL=index.js.map