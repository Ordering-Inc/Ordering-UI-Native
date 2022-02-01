import React, { useEffect } from 'react';
import { useEvent, useConfig } from 'ordering-components/native'
import { AppEventsLogger } from "react-native-fbsdk-next"

export const FacebookPixel = (props : any) => {
  const {
    children
  } = props

  const [configs] = useConfig()
  const [events] = useEvent()

  const handleLoginUser = () => {
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.CompletedRegistration, {
      [AppEventsLogger.AppEventParams.RegistrationMethod]: "login",
    })
  }
  
  const handleProductAdded = (product : any) => {
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.AddedToCart, {
      [AppEventsLogger.AppEventParams.Description]: product?.name,
      [AppEventsLogger.AppEventParams.Currency]: configs?.stripe_currency?.value ?? 'USD',
      [AppEventsLogger.AppEventParams.ContentID]: product?.id,
      [AppEventsLogger.AppEventsParams.Content]: JSON.stringify(product?.options || {}),
      [AppEventsLogger.AppEventParams.ContentType]: product?.category?.name,
      ["fb_value"]: product?.total
    })
  }

  const handleProductEdited = () => {
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.CustomizeProduct)
  }

  const handleSignupUser = () => {
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.CompletedRegistration, {
      [AppEventsLogger.AppEventParams.RegistrationMethod]: "signup",
    })
  }

  const handlePaymentInfo = (payment : any) => {
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.AddedPaymentInfo, {
      [AppEventsLogger.AppEventParams.ContentType]: payment?.gateway,
      [AppEventsLogger.AppEventParams.ContentID]: payment?.id
    })
  }

  const handleOrderPlaced = (order : any) => {
    AppEventsLogger.logPurchase(order.total, configs?.stripe_currency?.value ?? 'USD', { content_ids: [order.id], value: order.total });
  }

  useEffect(() => {
    events.on('userLogin', handleLoginUser)
    events.on('product_added', handleProductAdded)
    events.on('product_edited', handleProductEdited)
    events.on('order_placed', handleOrderPlaced)
    events.on('singup_user', handleSignupUser)
    events.on('add_payment_option', handlePaymentInfo)

    return () => {
      events.off('userLogin', handleLoginUser)
      events.off('product_added', handleProductAdded)
      events.off('product_edited', handleProductEdited)
      events.off('order_placed', handleOrderPlaced)
      events.off('singup_user', handleSignupUser)
      events.off('add_payment_option', handlePaymentInfo)
    }
  }, [])

  return (
    <>
      {children}
    </>
  )
};
