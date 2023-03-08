import React, { useState, useEffect } from 'react'
import { useLanguage, useConfig } from 'ordering-components/native'
import { useGooglePay, ApplePayButton, useApplePay } from '@stripe/stripe-react-native'
import { OButton, OText } from '../shared';
import { Platform, View } from 'react-native';
import { StripeMethodFormParams } from '../../types';
import Spinner from 'react-native-loading-spinner-overlay';
import { android_app_id } from '../../config.json'

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
  const [loadingGooglePayment, setLoadingGooglePayment] = useState(false)
  const [, t] = useLanguage()
  const [configs] = useConfig()

  useEffect(() => {
    if (paymethod !== 'google_pay' || !initGooglePay) return
    if (Platform.OS === 'ios') {
      setErrors(t('GOOGLE_PAY_NOT_SUPPORTED', 'Google pay not supported'))
      return
    }
    const initialize = async () => {
      try {
        const { error } = await initGooglePay({
          testEnv: devMode,
          merchantName: android_app_id,
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
    setLoadingGooglePayment(true)
    const { error, paymentMethod } = await createGooglePayPaymentMethod({
      amount: cart?.balance ?? cart?.total,
      currencyCode: configs?.stripe_currency?.value ?? 'USD',
    });
    if (error) {
      setErrors(error.code + ' - ' + error.message);
      setLoadingGooglePayment(false)
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
      setLoadingGooglePayment(false)
    }
  };

  const pay = async () => {
    if (!isApplePaySupported) {
      setErrors(t('APPLE_PAY_NOT_SUPPORTED', 'Apple pay not supported'))
      return
    }

    const { error, paymentMethod } = await presentApplePay({
      cartItems: [{
        label: t('CART', 'Cart'),
        amount: cart?.balance?.toString() ?? cart?.total?.toString?.()
      }],
      country: 'US',
      currency: configs?.stripe_currency?.value ?? 'USD',
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
    }
  }

  return (
    <>
      {paymethod === 'google_pay' ? (
        <View>
          <OButton
            textStyle={{
              color: '#fff'
            }}
            imgRightSrc={null}
            onClick={createPaymentMethod}
            isDisabled={loading || !initialized}
            text={t('PAY_WITH_GOOGLE_PAY', 'Pay with Google Pay')}
            isLoading={loading || !initialized}
            style={{ marginTop: 20 }}
          />
        </View>
      ) : (
        <View>
          {isApplePaySupported ? (
            <>
              <OText>{t('APPLE_PAY_PAYMENT', 'Apple pay payment')}</OText>
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
            </>
          ) : (
            <OText>{t('APPLE_PAY_NOT_SUPPORTED', 'Apple pay not supported')}</OText>
          )}
        </View>
      )}
      <Spinner
        visible={loadingGooglePayment}
      />
    </>
  )
}
