import React, { useEffect } from 'react'
import { useLanguage, useConfig } from 'ordering-components/native'
import { useGooglePay, useApplePay } from '@stripe/stripe-react-native'
import { Platform } from 'react-native';
import { StripeMethodFormParams } from '../../types';
import { android_app_id } from '../../config.json'

export const StripeMethodForm = (props: StripeMethodFormParams) => {
  const {
    cart,
    handleSource,
    onCancel,
    setErrors,
    paymethod,
    devMode,
    setMethodPaySupported,
    placeByMethodPay,
    methodPaySupported,
    setPlaceByMethodPay,
    cartTotal
  } = props
  const { initGooglePay, createGooglePayPaymentMethod, loading } = useGooglePay();
  const { presentApplePay, isApplePaySupported } = useApplePay();
  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const applePay = ['global_apple_pay', 'apple_pay']
  const googlePay = ['global_google_pay', 'google_pay']

  useEffect(() => {
    if (Platform.OS === 'ios') {
      return
    }
    const initialize = async () => {
      try {
        setMethodPaySupported({
          ...methodPaySupported,
          loading: true
        })
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
          setMethodPaySupported({
            enabled: false,
            loading: false
          })
          setPlaceByMethodPay(false)
          return;
        }
        setMethodPaySupported({
          enabled: true,
          loading: false
        })
        setPlaceByMethodPay(false)
        setErrors('')
      } catch (err: any) {
        setErrors('Catch ' + err?.message)
        setMethodPaySupported({
          enabled: false,
          loading: false
        })
        setPlaceByMethodPay(false)
      }
    }
    if (googlePay.includes(paymethod) && !methodPaySupported?.enabled) {
      initialize();
    }
  }, [initGooglePay, paymethod]);

  useEffect(() => {
    if (applePay.includes(paymethod) && !paymethod) return
    if (Platform.OS === 'android') {
      setPlaceByMethodPay(false)
      setMethodPaySupported({
        ...methodPaySupported,
        loading: false
      })
      return
    }
  }, [paymethod])

  const createPaymentMethod = async () => {
    setMethodPaySupported({
      ...methodPaySupported,
      loading: true
    })
    const { error, paymentMethod } = await createGooglePayPaymentMethod({
      amount: cartTotal ?? cart?.balance ?? cart?.total,
      currencyCode: configs?.stripe_currency?.value ?? 'USD',
    });
    if (error) {
      setErrors(error.code + ' - ' + error.message);
      setMethodPaySupported({
        enabled: true,
        loading: false
      })
    } else if (paymentMethod) {
      setMethodPaySupported({
        enabled: true,
        loading: false
      })
      const source = {
        ...paymentMethod?.Card,
        id: paymentMethod.id,
        type: paymentMethod.type,
        source_id: paymentMethod?.id,
        card: {
          brand: paymentMethod.Card.brand,
          last4: paymentMethod.Card.last4
        }
      }
      handleSource(cartTotal ? JSON.stringify(source) : source)
      onCancel()
    }
    setPlaceByMethodPay(false)
  };

  const pay = async () => {
    setMethodPaySupported({
      ...methodPaySupported,
      loading: true
    })
    if (!isApplePaySupported) {
      setErrors(t('APPLE_PAY_NOT_SUPPORTED', 'Apple pay not supported'))
      setMethodPaySupported({
        enabled: false,
        loading: false
      })
      setPlaceByMethodPay(false)
      return
    }

    const { error, paymentMethod } = await presentApplePay({
      cartItems: [{
        label: t('CART', 'Cart'),
        amount: cartTotal?.toString?.() ?? cart?.balance?.toString() ?? cart?.total?.toString?.()
      }],
      country: 'US',
      currency: configs?.stripe_currency?.value ?? 'USD',
    });
    if (error) {
      setErrors(error.code + ' - ' + error.message);
      setMethodPaySupported({
        enabled: true,
        loading: false
      })
    } else if (paymentMethod) {
      setMethodPaySupported({
        enabled: true,
        loading: false
      })
      const source = {
        ...paymentMethod?.Card,
        id: paymentMethod.id,
        type: paymentMethod.type,
        source_id: paymentMethod?.id,
        card: {
          brand: paymentMethod.Card.brand,
          last4: paymentMethod.Card.last4
        }
      }
      handleSource(cartTotal ? JSON.stringify(source) : source)
    }
    setPlaceByMethodPay(false)
  }

  useEffect(() => {
    if (isApplePaySupported && applePay.includes(paymethod)) {
      setMethodPaySupported({
        enabled: true,
        loading: false
      })
      setErrors('')
    }
  }, [isApplePaySupported, paymethod])

  useEffect(() => {
    if (placeByMethodPay) {
      applePay.includes(paymethod) ? pay() : createPaymentMethod()
    }
  }, [placeByMethodPay])

  return (
    <></>
  )
}
