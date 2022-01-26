import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { useLanguage, useApi, useOrder, useConfig, useSession, useToast, ToastType } from 'ordering-components/native'

/**
 * Component to manage Checkout page behavior without UI component
 */
export const Checkout = (props) => {
  const {
    businessId,
    cartState,
    propsToFetch,
    actionsBeforePlace,
    handleCustomClick,
    onPlaceOrderClick,
    UIComponent
  } = props

  const [ordering] = useApi()
  const [, { refreshConfigs }] = useConfig()

  const [placing, setPlacing] = useState(false)
  const [errors, setErrors] = useState(null)

  const [, t] = useLanguage()
  /**
   * Order context
   */
  const [orderState, { placeCart }] = useOrder()
  /**
   * Session content
   */
  const [{ token }] = useSession()
  /**
   * Toast state
   */
  const [, { showToast }] = useToast()
  /**
   * Instructions options
   */
  const [instructionsOptions, setInstructionsOptions] = useState({ loading: false, result: [{ id: null, enabled: true, name: t('EITHER_WAY', 'Either way') }], error: null })

  const [deliveryOptionSelected, setDeliveryOptionSelected] = useState(undefined)
  /**
   * Instructions state
   */
  const [instructionsState, setInstructionsState] = useState({ loading: false, result: null, error: null })
  /**
   * Comment state
   */
  const [commentState, setCommentState] = useState({ loading: false, result: null, error: null })
  /**
   * Object to save an object with business information
   */
  const [businessDetails, setBusinessDetails] = useState({ business: null, loading: true, error: null })
  /**
   * This must be contains an object with info about paymente selected
   */
  const [paymethodSelected, setPaymethodSelected] = useState(null)
  /**
   * Current cart
   */
  const cart = orderState.carts?.[`businessId:${businessId}`]
  /**
   * Timeout for update cart comment
   */
  let timeout = null
  /**
   * Cart comment stagged
   */
  let previousComment
  /**
   * Delivery instructions stagged
   */
  let previousInstructions
  /**
   * Method to get business from API
   */
  const getBusiness = async () => {
    refreshConfigs()
    try {
      const parameters = {
        type: orderState.options?.type
      }

      const { content: { result, error } } = await ordering.businesses(businessId).select(propsToFetch).parameters(parameters).get()
      if (!error && cartState.cart?.paymethod_id) {
        const paymethodSelected = result?.paymethods?.find(paymethod => paymethod?.paymethod_id === cartState.cart?.paymethod_id)
        if (paymethodSelected?.paymethod?.id) {
          handlePaymethodChange({
            paymethodId: paymethodSelected?.paymethod?.id,
            gateway: paymethodSelected?.paymethod?.gateway,
            paymethod: {
              ...paymethodSelected?.paymethod,
              credentials: {
                ...paymethodSelected?.data
              }
            },
            data: cart?.paymethod_data,
            id: paymethodSelected?.paymethod?.id
          })
        }
      }
      setBusinessDetails({
        ...businessDetails,
        loading: false,
        business: result,
        error
      })
    } catch (error) {
      setBusinessDetails({
        ...businessDetails,
        loading: false,
        error
      })
    }
  }

  /**
   * Method to handle click on Place order
   */
  const handlerClickPlaceOrder = async (paymentOptions) => {
    let paymethodData = paymethodSelected?.data
    if (['stripe', 'stripe_connect', 'stripe_direct'].includes(paymethodSelected.paymethod.gateway)) {
      paymethodData = {
        source_id: paymethodSelected?.data?.id
      }
    }
    let payload = {
      paymethod_id: paymethodSelected.paymethodId,
      paymethod_data: paymethodSelected?.data,
      offer_id: cart.offer_id,
      amount: cart.total
    }

    if (orderState.options.type === 1) {
      payload = {
        ...payload,
        delivery_zone_id: cart.delivery_zone_id
      }
    }

    if (handleCustomClick) {
      handleCustomClick(payload, paymethodSelected, cart)
      return
    }

    payload = {
      ...payload,
      paymethod_data: {
        ...paymethodData,
        ...paymentOptions
      }
    }

    setPlacing(true)
    const result = await placeCart(cart.uuid, payload)

    if (result?.error) {
      setErrors(result?.result)
      return
    }

    const cartResult = result?.result

    if (cartResult?.paymethod_data?.status === 2 && actionsBeforePlace) {
      await actionsBeforePlace(paymethodSelected, result.result)
    }
    setPlacing(false)
    onPlaceOrderClick && onPlaceOrderClick(payload, paymethodSelected, cartResult)
  }

  const handlePaymethodChange = (paymethod) => {
    setPaymethodSelected(paymethod)
  }

  /**
   * change comment for cart
   */
  const handleChangeComment = (value) => {
    try {
      if (previousComment !== value) {
        clearTimeout(timeout)
        timeout = setTimeout(async function () {
          setCommentState({ ...commentState, loading: true })
          const uuid = cart?.uuid
          const response = await fetch(`${ordering.root}/carts/${uuid}`, {
            'Content-Type': 'application/json',
            method: 'PUT',
            body: JSON.stringify({
              comment: value
            }),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          })
          const { result, error } = await response.json()
          if (error) {
            setCommentState({ ...commentState, loading: false, error: true, result })
            showToast(ToastType.Error, result)
            return
          }
          setCommentState({ ...commentState, loading: false, error: null, result })
        }, 750)
      }
      previousComment = value
    } catch (err) {
      setCommentState({ ...commentState, loading: false, error: true, result: err.message })
      showToast(ToastType.Error, err.message)
    }
  }

  const getDeliveryOptions = async () => {
    try {
      const response = await fetch(`${ordering.root}/delivery_options`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`
        }
      })
      const { result, error } = await response.json()
      if (!error) {
        setInstructionsOptions({ loading: false, result: [...instructionsOptions.result, ...result] })
        return
      }
      setInstructionsOptions({ loading: false, error: true, result })
      showToast(ToastType.Error, result)
    } catch (err) {
      setInstructionsOptions({ loading: false, error: true, result: err.message })
      showToast(ToastType.Error, err.message)
    }
  }

  const handleChangeInstructions = (value) => {
    try {
      if (previousInstructions !== value) {
        clearTimeout(timeout)
        timeout = setTimeout(async function () {
          setInstructionsState({ ...instructionsState, loading: true })
          setInstructionsState({ ...instructionsState, loading: false, error: null })
        }, 750)
      }
    } catch (err) {
      setInstructionsState({ ...instructionsState, loading: false, error: true, result: err.message })
      showToast(ToastType.Error, err.message)
    }
  }

  const handleChangeDeliveryOption = async (value) => {
    try {
      const response = await fetch(`${ordering.root}/carts/${cart?.uuid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`
        },
        body: JSON.stringify({
          delivery_option_id: value
        })
      })
      const { result, error } = await response.json()
      setDeliveryOptionSelected(result?.delivery_option_id)
      if (error) {
        showToast(ToastType.Error, result)
      }
    } catch (err) {
      showToast(ToastType.Error, err.message)
    }
  }

  useEffect(() => {
    getBusiness()
  }, [businessId])

  /**
   * Update carts from sockets
   */
  useEffect(() => {
    if (cart && cart.status === 1) {
      const data = {
        paymethod_id: paymethodSelected.paymethodId,
        paymethod_data: paymethodSelected?.data,
        delivery_zone_id: cart.delivery_zone_id,
        offer_id: cart.offer_id,
        amount: cart.total
      }
      onPlaceOrderClick && onPlaceOrderClick(data, paymethodSelected, cart)
    }
  }, [cart])

  useEffect(() => {
    if (deliveryOptionSelected === undefined) {
      setDeliveryOptionSelected(cart?.delivery_option_id)
    }
  }, [cart?.delivery_option_id])

  useEffect(() => {
    getDeliveryOptions()
  }, [])

  return (
    <>
      {UIComponent && (
        <UIComponent
          {...props}
          cart={cart}
          placing={placing}
          errors={errors}
          orderOptions={orderState.options}
          paymethodSelected={paymethodSelected}
          businessDetails={businessDetails}
          commentState={commentState}
          instructionsOptions={instructionsOptions}
          deliveryOptionSelected={deliveryOptionSelected}
          handlePaymethodChange={handlePaymethodChange}
          handlerClickPlaceOrder={handlerClickPlaceOrder}
          handleChangeComment={handleChangeComment}
          handleChangeDeliveryOption={handleChangeDeliveryOption}
        />
      )}
    </>
  )
}

Checkout.propTypes = {
  /**
   * UI Component, this must be containt all graphic elements and use parent props
   */
  UIComponent: PropTypes.elementType,
  /**
   * Custom method to receive props from checkout page
   */
  handleCustomClick: PropTypes.func,
  /**
   * onPlaceOrderClick, function to get click event and return business object after default behavior
   */
  onPlaceOrderClick: PropTypes.func,
  // /**
  //  * handler values from other components
  //  */
  // handlerValues: PropTypes.func,
  /**
   * Components types before Checkout
   * Array of type components, the parent props will pass to these components
   */
  beforeComponents: PropTypes.arrayOf(PropTypes.elementType),
  /**
   * Components types after Checkout
   * Array of type components, the parent props will pass to these components
   */
  afterComponents: PropTypes.arrayOf(PropTypes.elementType),
  /**
   * Elements before Checkout
   * Array of HTML/Components elements, these components will not get the parent props
   */
  beforeElements: PropTypes.arrayOf(PropTypes.element),
  /**
   * Elements after Checkout
   * Array of HTML/Components elements, these components will not get the parent props
   */
  afterElements: PropTypes.arrayOf(PropTypes.element)
}

Checkout.defaultProps = {
  beforeComponents: [],
  afterComponents: [],
  beforeElements: [],
  afterElements: [],
  propsToFetch: ['id', 'name', 'email', 'cellphone', 'address', 'paymethods', 'logo', 'location']
}
