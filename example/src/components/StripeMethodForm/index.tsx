import React, { useState, useEffect } from 'react'
import { useLanguage } from 'ordering-components/native'
import { useGooglePay } from '@stripe/stripe-react-native'
import { OButton } from '../shared';

export const StripeMethodForm = (props) => {
  const {
    cart,
    handleSource,
    onCancel,
    setErrors
  } = props

  const { initGooglePay, createGooglePayPaymentMethod } = useGooglePay();
  const [initialized, setInitialized] = useState(false);
  const [, t] = useLanguage()

  useEffect(() => {
    const initialize = async () => {
      try {
        const { error } = await initGooglePay({
          testEnv: true,
          merchantName: 'Widget Store',
          countryCode: 'US',
          billingAddressConfig: {
            format: 'FULL',
            isPhoneNumberRequired: true,
            isRequired: false,
          },
          existingPaymentMethodRequired: false,
          isEmailRequired: true,
        });

        if (error) {
          setErrors(error.code + ' - ' + error.message);
          return;
        }
        setInitialized(true);
      } catch (err : any) {
        setErrors('catch ' + err?.message)
      }
    }
    initialize();
  }, [initGooglePay]);

  const createPaymentMethod = async () => {

    const { error, paymentMethod } = await createGooglePayPaymentMethod({
      amount: cart?.balance || cart?.total,
      currencyCode: 'USD',
    });

    if (error) {
      setErrors(error.code + ' - ' + error.message);
      return;
    } else if (paymentMethod) {
      console.log(
        'Success',
        `The payment method was created successfully. paymentMethodId: ${paymentMethod.id}`
      );
      onCancel()
      handleSource({
        ...paymentMethod?.Card,
        id: paymentMethod.id,
        type: paymentMethod.type,
        source_id: paymentMethod?.id,
        card: {
          brand: paymentMethod.Card.brand,
          last4: paymentMethod.Card.last4
        }
      })
    }
    setInitialized(false);
  };

  return (
    <OButton
      textStyle={{
        color: '#fff'
      }}
      imgRightSrc={null}
      onClick={createPaymentMethod}
      isDisabled={!initialized}
      text={t('PAY_WITH_GOOGLE_PAY', 'Pay with Google Pay')}
    />
  )
}
