import React, { useState, useEffect } from 'react';
import { _retrieveStoreData } from '../../../../../src/providers/StoreUtil';
import {
  Checkout as CheckoutController,
  useOrder,
  useSession,
  useApi,
  ToastType,
  useToast
} from 'ordering-components/native';

import { PaymentOptions } from '../PaymentOptions';

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
    onNavigationRedirect,
    isKiosk
  } = props

  const [errorCash, setErrorCash] = useState(false);
  const [customerName, setCustomerName] = useState(null);

  const getCustomerName = async () => {
    const data = await _retrieveStoreData('customer_name');
    setCustomerName(data?.customerName)
  }

  useEffect(() => {
    if (!cartState.loading && cart && !cart?.valid && cart?.status === 2) {
      navigation?.canGoBack() && navigation.goBack()
    } else {
      getCustomerName()
    }
  }, [cart])

  return (
    <>
      <PaymentOptions
        navigation={navigation}
        cart={cart}
        errors={errors}
        customerName={customerName}
        onPaymentChange={handlePaymethodChange}
        onNavigationRedirect={onNavigationRedirect}
        paySelected={paymethodSelected}
        handlerClickPlaceOrder={handlerClickPlaceOrder}
        placing={placing}
        errorCash={errorCash}
        isDisabled={cart?.status === 2}
        businessId={businessDetails?.business?.id}
        isLoading={cartState.loading || businessDetails.loading}
        paymethods={businessDetails?.business?.paymethods}
        setErrorCash={setErrorCash}
        isKiosk={isKiosk}
      />
    </>
  )
}

export const Checkout = (props: any) => {
  const {
    errors,
    clearErrors,
    cartUuid,
    onNavigationRedirect,
  } = props

  const [, { showToast }] = useToast();
  const [{ token }] = useSession();
  const [ordering] = useApi();
  const [, { confirmCart }] = useOrder();

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
          } getOrder
          getOrder
          if (confirmCartRes.result.order?.uuid) {
            onNavigationRedirect('OrderDetails', { orderId: confirmCartRes.result.order.uuid, isFromCheckout: true })
          }
          setCartState({
            ...cartState,
            loading: false,
            cart: result
          })
        } catch (error: any) {
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
    } catch (e: any) {
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
