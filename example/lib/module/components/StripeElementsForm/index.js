import React from 'react';
import { View } from 'react-native';
import { useLanguage } from 'ordering-components/native';
import { ErrorMessage } from './styles';
import { StripeElementsForm as StripeFormController } from './naked';
import { StripeCardForm } from '../StripeCardForm';

const StripeElementsFormUI = props => {
  const {
    publicKey,
    handleSource,
    businessId,
    requirements,
    onNewCard,
    toSave,
    onCancel
  } = props;
  const [, t] = useLanguage();
  return /*#__PURE__*/React.createElement(View, null, publicKey ? /*#__PURE__*/React.createElement(StripeCardForm, {
    toSave: toSave,
    publicKey: publicKey,
    onNewCard: onNewCard,
    businessId: businessId,
    handleCancel: onCancel,
    handleSource: handleSource,
    requirements: requirements
  }) : /*#__PURE__*/React.createElement(ErrorMessage, null, t('SOMETHING_WRONG', 'Something is wrong!')));
};

export const StripeElementsForm = props => {
  const stripeProps = { ...props,
    UIComponent: StripeElementsFormUI
  };
  return /*#__PURE__*/React.createElement(StripeFormController, stripeProps);
};
//# sourceMappingURL=index.js.map