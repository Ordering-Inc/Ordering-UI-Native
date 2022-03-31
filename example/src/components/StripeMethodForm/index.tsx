import React, { useState, useEffect } from 'react'
import { useLanguage } from 'ordering-components/native'
import { GooglePayButton, useGooglePay, ApplePayButton, useApplePay } from '@stripe/stripe-react-native'
import { OButton } from '../shared';
import { Platform, View } from 'react-native';
import { StripeMethodFormParams } from '../../types';

export const StripeMethodForm = (props: StripeMethodFormParams) => {
  const {
    cart,
    handleSource,
    onCancel,
    setErrors,
    paymethod,
    devMode
  } = props
  const { initGooglePay, createGooglePayPaymentMethod, loading } = useGooglePay();
  const { presentApplePay, isApplePaySupported } = useApplePay();
  const [initialized, setInitialized] = useState(false);
  const [, t] = useLanguage()
 
  useEffect(() => {
    if (paymethod !== 'google_pay') return
    if (Platform.OS === 'ios') {
      setErrors(t('GOOGLE_PAY_NOT_SUPPORTED', 'Google pay not supported'))
      return
    }
    const initialize = async () => {
      try {
        const { error } = await initGooglePay({
          testEnv: devMode,
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
      } catch (err: any) {
        setErrors('Catch ' + err?.message)
      }
    }
    initialize();
  }, [initGooglePay]);

  useEffect(() => {
    if (paymethod !== 'apple_pay') return
    if (Platform.OS === 'android') {
      setErrors(t('APPLE_PAY_NOT_SUPPORTED', 'Apple pay not supported'))
      return
    }
  }, [])

  const createPaymentMethod = async () => {

    const { error, paymentMethod } = await createGooglePayPaymentMethod({
      amount: cart?.balance ?? cart?.total,
      currencyCode: 'USD',
    });

    if (error) {
      setErrors(error.code + ' - ' + error.message);
      return;
    } else if (paymentMethod) {
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
      onCancel()
    }
    setInitialized(false);
  };

  const pay = async () => {
    if (!isApplePaySupported) {
      setErrors(t('APPLE_PAY_NOT_SUPPORTED', 'Apple pay not supported'))
      return
    }

    const { error, paymentMethod } = await presentApplePay({
      cartItems: cart?.products?.map((product: any) => ({ label: product?.name, amount: product?.price?.toString?.() })),
      country: 'US',
      currency: 'USD',
      shippingMethods: [
        {
          amount: cart?.balance?.toString() ?? cart?.total?.toString?.(),
          identifier: 'DPS',
          label: 'Courier',
          detail: 'Delivery',
          type: 'final',
        },
      ],

      requiredShippingAddressFields: ['emailAddress', 'phoneNumber'],
      requiredBillingContactFields: ['phoneNumber', 'name'],
    });
    if (error) {
      setErrors(error.code + ' - ' + error.message);
    } else if (paymentMethod) {
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
      onCancel()
    }
  }

  return (
    <>
      {paymethod === 'google_pay' ? (
        <View>
          {!loading && initialized && (
            <OButton
              textStyle={{
                color: '#fff'
              }}
              imgRightSrc={null}
              onClick={createPaymentMethod}
              isDisabled={!initialized}
              text={t('PAY_WITH_GOOGLE_PAY', 'Pay with Google Pay')}
            />
          )}
        </View>
      ) : (
        <View>
          {isApplePaySupported && (
            <ApplePayButton
              onPress={pay}
              type="plain"
              buttonStyle="black"
              borderRadius={4}
              style={{
                width: '100%',
                height: 50,
              }}
            />
          )}
        </View>
      )}
    </>
  )
}
