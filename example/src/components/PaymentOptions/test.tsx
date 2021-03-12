import React, { useEffect, useState } from 'react'

import { useOrder, useApi } from 'ordering-components/native';

/**
 * Component to manage payment options behavior without UI component
 */
export const PaymentOptions = (props: any) => {
  const {
    isLoading,
    paymethods,
    businessId,
    onPaymentChange,
    UIComponent
  } = props

  const [ordering] = useApi()
  const [orderState] = useOrder()
  const orderTotal = orderState.carts[`businessId:${businessId}`]?.total || 0

  const [paymethodsList, setPaymethodsList] = useState({ paymethods: [], loading: true, error: null })
  const [paymethodSelected, setPaymethodsSelected] = useState(null)
  const [paymethodData, setPaymethodData] = useState({})

  const parsePaymethods = (paymethods) => {
    const _paymethods = paymethods && paymethods
      .filter(credentials => !['paypal_express', 'authorize'].includes(credentials?.paymethod?.gateway))
      .map(credentials => {
        return {
          ...credentials?.paymethod,
          sandbox: credentials?.sandbox,
          credentials: credentials?.data
        }
      })
    return _paymethods
  }

  /**
   * Method to get payment options from API
   */
  const getPaymentOptions = async () => {
    try {
      const { content: { error, result } } = await ordering.businesses(businessId).get()
      if (!error) {
        paymethodsList.paymethods = parsePaymethods(result.paymethods)
      }
      setPaymethodsList({
        ...paymethodsList,
        error: error ? result : null,
        loading: false,
        paymethods: error ? [] : parsePaymethods(result.paymethods)
      })
    } catch (error) {
      setPaymethodsList({
        ...paymethodsList,
        loading: false,
        error: [error.message]
      })
    }
  }

  /**
   * Method to set payment option selected by user
   * @param {Object} val object with information of payment method selected
   */
  const handlePaymethodClick = (paymethod) => {
    setPaymethodsSelected(paymethod)
    handlePaymethodDataChange({})
  }

  const handlePaymethodDataChange = (data) => {
    setPaymethodData(data)
    if (paymethodSelected) {
      onPaymentChange && onPaymentChange({
        paymethodId: paymethodSelected.id,
        gateway: paymethodSelected.gateway,
        paymethod: paymethodSelected,
        data
      })
    } else {
      onPaymentChange && onPaymentChange(null)
    }
  }

  useEffect(() => {
    if (['card_delivery', 'cash', 'stripe_redirect'].includes(paymethodSelected?.gateway)) {
      onPaymentChange && onPaymentChange({
        paymethodId: paymethodSelected.id,
        gateway: paymethodSelected.gateway,
        paymethod: paymethodSelected,
        data: {}
      })
    } else if (paymethodSelected === null && onPaymentChange) {
      onPaymentChange(null)
    }
  }, [paymethodSelected])

  useEffect(() => {
    console.log(isLoading, paymethods, businessId);
    if (isLoading) return
    if (paymethods) {
      setPaymethodsList({
        ...paymethodsList,
        loading: false,
        paymethods: parsePaymethods(paymethods)
      })
    } else {
      if (businessId) {
        getPaymentOptions()
      } else {
        setPaymethodsList({
          ...paymethodsList,
          loading: false
        })
      }
    }
  }, [isLoading])

  return (
    <>
      {UIComponent && (
        <UIComponent
          {...props}
          orderTotal={orderTotal}
          paymethodsList={paymethodsList}
          paymethodSelected={paymethodSelected}
          paymethodData={paymethodData}
          handlePaymethodClick={handlePaymethodClick}
          handlePaymethodDataChange={handlePaymethodDataChange}
        />
      )}
    </>
  )
}
