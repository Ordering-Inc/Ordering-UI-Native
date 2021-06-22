import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';

import {
  Checkout as CheckoutController,
  useOrder,
  useSession,
  useApi,
  useLanguage,
} from 'ordering-components/native';

import { OText } from '../shared';
import { colors } from '../../theme.json';

import { PaymentOptions } from '../PaymentOptions';

import {
  ChContainer,
  ChSection,
  ChPaymethods,
  ChErrors,
} from './styles';

import { ToastType, useToast } from '../../providers/ToastProvider';
import { Container } from '../../layouts/Container';
import NavBar from '../NavBar';


const manageErrorsToShow = (array = []) => {
  let stringError = ''
  const list = Array.isArray(array) ? array : Object.values(array)
  list.map((item: any, i: number) => {
    stringError += (i + 1) === array.length ? `- ${item?.message || item}` : `- ${item?.message || item}\n`
  })
  return stringError;
}

const CheckoutUI = (props: any) => {
  const {
    navigation,
    cart,
    errors,
    placing,
    cartState,
    businessDetails,
    paymethodSelected,
    handlePaymethodChange,
    handlerClickPlaceOrder,
    onNavigationRedirect
  } = props

  const [, t] = useLanguage();

  const [errorCash, setErrorCash] = useState(false);

  return (
    <>
      <Container>
          {!cartState.loading && cart && cart?.status !== 2 && cart?.valid && (
            <>
              <NavBar
                title="Payment methods"
              />

              <PaymentOptions
                cart={cart}
                isDisabled={cart?.status === 2}
                businessId={businessDetails?.business?.id}
                isLoading={businessDetails.loading}
                paymethods={businessDetails?.business?.paymethods}
                onPaymentChange={handlePaymethodChange}
                errorCash={errorCash}
                setErrorCash={setErrorCash}
                onNavigationRedirect={onNavigationRedirect}
                paySelected={paymethodSelected}
              />
            </>
          )}

          {!cartState.loading && cart && (
            <ChSection style={{ paddingTop: 0, paddingBottom: 20, paddingHorizontal: 20 }}>
              <ChErrors>
                {!cart?.valid_address && cart?.status !== 2 && (
                  <OText
                    style={{ textAlign: 'center' }}
                    color={colors.error}
                    size={14}
                  >
                    {t('INVALID_CART_ADDRESS', 'Selected address is invalid, please select a closer address.')}
                  </OText>
                )}

                {!paymethodSelected && cart?.status !== 2 && cart?.valid && (
                  <OText
                    style={{ textAlign: 'center' }}
                    color={colors.error}
                    size={14}
                  >
                    {t('WARNING_NOT_PAYMENT_SELECTED', 'Please, select a payment method to place order.')}
                  </OText>
                )}
              </ChErrors>
            </ChSection>
          )}
      </Container>
    </>
  )
}

const style = StyleSheet.create({
  btnBackArrow: {
    borderWidth: 0,
    backgroundColor: colors.white,
    borderColor: colors.white,
    shadowColor: colors.white,
    display: 'flex',
    justifyContent: 'flex-start',
    paddingLeft: 0,
  },
  paddSection: {
    padding: 20
  },
  paddSectionH: {
    paddingHorizontal: 20
  }
})

export const Checkout = (props: any) => {
  const {
    errors,
    clearErrors,
    cartUuid,
    onNavigationRedirect,
  } = props

  const { showToast } = useToast();
  const [, t] = useLanguage();
  const [{ token }] = useSession();
  const [ordering] = useApi();
  const [,{ confirmCart }] = useOrder();

  const [cartState, setCartState] = useState<any>({ loading: true, error: [], cart: null });

  const getOrder = async (cartId: any) => {
    try {
      setCartState({ ...cartState, loading: true })
      const url = `${ordering.root}/carts/${cartId}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      const { result } = await response.json();

      if (result.status === 1 && result.order?.uuid) {
        onNavigationRedirect('OrderDetails', { orderId: result.order.uuid })
        setCartState({ ...cartState, loading: false })
      } else if (result.status === 2 && result.paymethod_data?.gateway === 'stripe_redirect') {
        try {
          const confirmCartRes = await confirmCart(cartUuid)
          if (confirmCartRes.error) {
            showToast(ToastType.Error, confirmCartRes.error.message)
          }getOrder
          getOrder
          if (confirmCartRes.result.order?.uuid) {
            onNavigationRedirect('OrderDetails', { orderId: confirmCartRes.result.order.uuid, isFromCheckout: true })
          }
          setCartState({
            ...cartState,
            loading: false,
            cart: result
          })
        } catch (error) {
          showToast(ToastType.Error, error?.toString() || error.message)
        }
      } else {
        const cart = Array.isArray(result) ? null : result
        setCartState({
          ...cartState,
          loading: false,
          cart,
          error: cart ? null : result
        })
      }
    } catch (e) {
      setCartState({
        ...cartState,
        loading: false,
        error: [e.toString()]
      })
    }
  }

  useEffect(() => {
    if (errors) {
      const errorText = manageErrorsToShow(errors)
      showToast(ToastType.Error, errorText)
      clearErrors && clearErrors()
    }
  }, [errors])

  useEffect(() => {
    if (token && cartUuid) {
      getOrder(cartUuid)
    }
  }, [token, cartUuid])

  const checkoutProps = {
    ...props,
    UIComponent: CheckoutUI,
    cartState,
    businessId: cartState.cart?.business_id
  }

  return (
    <>
      <CheckoutController {...checkoutProps} />
    </>
  )
}
