import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLanguage, useSession } from 'ordering-components/native';
import {
  StripeProvider,
  CardField,
  useConfirmSetupIntent,
  createPaymentMethod
} from '@stripe/stripe-react-native';

import { ErrorMessage } from './styles';

import { StripeElementsForm as StripeFormController } from './naked';
import { StripeMethodForm } from '../StripeMethodForm';
import { OButton, OText } from '../shared';
import { useTheme } from 'styled-components/native';

const StripeElementsFormUI = (props: any) => {
  const {
    publicKey,
    handleSource,
    values,
    businessId,
    requirements,
    stripeTokenHandler,
    methodsPay,
    paymethod,
    onCancel,
    cart
  } = props;

  const theme = useTheme();
  const [, t] = useLanguage();
  const [{ user }] = useSession();
  const [card, setCard] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errors, setErrors] = useState('')
  const { confirmSetupIntent, loading: confirmSetupLoading } = useConfirmSetupIntent();
  const [createPmLoading, setCreatePmLoading] = useState(false);

  let billingDetails: any = {}

  if (user?.name || user?.lastname) {
    if (user?.name) {
      billingDetails.name = user?.name
    }
    if (user?.lastname) {
      billingDetails.name = `${billingDetails?.name} ${user?.lastname}`
    }
  }

  if (user?.email) {
    billingDetails.email = user?.email
  }

  if (user?.address) {
    billingDetails.addressLine1 = user?.address
  }

  const createPayMethod = async () => {
    const params: any = { type: 'Card' }
    if (Object.keys(billingDetails).length > 0) {
      params.billingDetails = billingDetails
    }
    try {
      setCreatePmLoading(true)
      const { paymentMethod } = await createPaymentMethod(params);

      setCreatePmLoading(false)
      handleSource && handleSource({
        id: paymentMethod.id,
        type: 'card',
        card: {
          brand: paymentMethod.Card.brand,
          last4: paymentMethod.Card.last4
        }
      })
    } catch (error: any) {
      setErrors(error?.message || error?.toString());
    }
  }

  const handleSaveCard = async () => {
    if (!isCompleted) return
    setErrors('');
    if (!requirements) {
      createPayMethod();
      return
    }
    const params: any = { type: 'Card' }
    if (Object.keys(billingDetails).length > 0) {
      params.billingDetails = billingDetails
    }
    try {
      const { setupIntent, error } = await confirmSetupIntent(requirements, params);

      if (setupIntent?.status === 'Succeeded') {
        stripeTokenHandler(setupIntent?.paymentMethodId, user, businessId);
      }

      if (error) {
        setErrors(
          error?.code === 'Unknown'
            ? t('ERROR_ADD_CARD', 'An error occurred while trying to add a card')
            : error.message
        );
      }
    } catch (error: any) {
      setErrors(error?.message || error?.toString());
    }
  };

  useEffect(() => {
    if (card) {
      setIsCompleted(
        !!card?.last4 &&
        !!card?.expiryMonth &&
        !!card?.expiryYear &&
        !!card?.brand &&
        !!card?.postalCode
      )
    }
  }, [card])

  return (
    <View style={styles.container}>
      {publicKey ? (
        <View style={{ flex: 1 }}>
          <StripeProvider 
            publishableKey={publicKey}
            merchantIdentifier='merchant.com.ordering.app1'
          >
            {methodsPay.includes(paymethod) ? (
              <StripeMethodForm 
                handleSource={handleSource}
                onCancel={onCancel}
                cart={cart}
                setErrors={setErrors}
                paymethod={paymethod}
              />
            ) : (
              <CardField
                postalCodeEnabled={true}
                cardStyle={{
                  backgroundColor: '#FFFFFF',
                  textColor: '#000000',
                }}
                style={{
                  width: '100%',
                  height: 50,
                  marginVertical: 30,
                  zIndex: 9999,
                }}
                onCardChange={(cardDetails: any) => setCard(cardDetails)}
              />
            )}
          </StripeProvider>
          {!methodsPay?.includes(paymethod) && (
            <OButton
              text={t('SAVE_CARD', 'Save card')}
              bgColor={isCompleted ? theme.colors.primary : theme.colors.backgroundGray}
              borderColor={isCompleted ? theme.colors.primary :theme.colors.backgroundGray}
              style={styles.btnAddStyle}
              textStyle={{color: 'white'}}
              imgRightSrc={null}
              onClick={() => handleSaveCard()}
              isDisabled={!isCompleted}
              isLoading={confirmSetupLoading || values.loadingAdd || createPmLoading}
            />
          )}
          {!!errors && (
            <ErrorMessage>
              <OText
                size={20}
                color={theme.colors.error}
                style={{ marginTop: 20, textAlign: 'center' }}
                >
                {errors}
              </OText>
            </ErrorMessage>
          )}
        </View>
      ) : (
        <ErrorMessage>
          <OText
            size={20}
            color={theme.colors.error}
            style={{ marginTop: 20 }}
          >
            {t('SOMETHING_WRONG', 'Something is wrong!')}
          </OText>
        </ErrorMessage>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20
  },
  btnAddStyle: {
    marginTop: 20
  },
})

export const StripeElementsForm = (props: any) => {
  const stripeProps = {
    ...props,
    UIComponent: StripeElementsFormUI,
    onSelectCard: (card: any) => {
      props.onSelectCard(card);
      if (card) {
        props.onCancel && props.onCancel();
      }
    }
  }
  return <StripeFormController {...stripeProps} />
}
