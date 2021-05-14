import React from 'react';
import { View } from 'react-native';
import { useLanguage } from 'ordering-components/native';
import { StripeProvider } from '@stripe/stripe-react-native';

import { ErrorMessage } from './styles';

import { StripeElementsForm as StripeFormController } from './naked';
import { StripeCardForm } from '../StripeCardForm';

const StripeElementsFormUI = (props: any) => {
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

  return (
    <View>
      {publicKey ? (
        <StripeProvider publishableKey='pk_test_SP5YYDD4PdEVfH8U2QJhsVxR'>
          <StripeCardForm
            toSave={toSave}
            publicKey={publicKey}
            onNewCard={onNewCard}
            businessId={businessId}
            handleCancel={onCancel}
            handleSource={handleSource}
            requirements={requirements}
          />
        </StripeProvider>
      ) : (
        <ErrorMessage>{t('SOMETHING_WRONG', 'Something is wrong!')}</ErrorMessage>
      )}
    </View>
  )
}

export const StripeElementsForm = (props: any) => {
  const stripeProps = {
    ...props,
    UIComponent: StripeElementsFormUI
  }
  return <StripeFormController {...stripeProps} />
}
