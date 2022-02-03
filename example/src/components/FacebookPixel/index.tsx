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
      ["currency"]: "email"
    })
  }
  
  const handleProductAdded = (product : any) => {
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.AddedToCart, product?.total ?? product?.price , {
      [AppEventsLogger.AppEventParams.Description]: product?.name,
      [AppEventsLogger.AppEventParams.Currency]: configs?.stripe_currency?.value ?? 'USD',
      [AppEventsLogger.AppEventParams.ContentID]: product?.id,
      [AppEventsLogger.AppEventParams.ContentType]: "product",
      ["fb_quantity"]: product?.quantity,
    })
  }

  const handleProductEdited = (product : any) => {
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.CustomizeProduct, product?.total ?? product?.price , {
      [AppEventsLogger.AppEventParams.Description]: product?.name,
      [AppEventsLogger.AppEventParams.Currency]: configs?.stripe_currency?.value ?? 'USD',
      [AppEventsLogger.AppEventParams.ContentID]: product?.id,
      [AppEventsLogger.AppEventParams.ContentType]: "product",
      ["fb_quantity"]: product?.quantity,
    })
  }

  const handleSignupUser = () => {
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.CompletedRegistration, {
      [AppEventsLogger.AppEventParams.RegistrationMethod]: "signup",
      ["currency"]: "email"
    })
  }

  const handlePaymentInfo = (payment : any) => {
    AppEventsLogger.logEvent(AppEventsLogger.AppEvents.AddedPaymentInfo, {
      [AppEventsLogger.AppEventParams.ContentType]: payment?.gateway,
      [AppEventsLogger.AppEventParams.ContentID]: payment?.id
    })
  }

  const handleOrderPlaced = (order : any) => {
    AppEventsLogger.logPurchase(order.total, configs?.stripe_currency?.value ?? 'USD', { param: "value", id: order.id });
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
