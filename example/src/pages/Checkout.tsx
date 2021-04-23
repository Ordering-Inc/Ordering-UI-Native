import React from 'react';
import { Checkout } from '../components/Checkout';
import { Container } from '../layouts/Container';
import stripe from 'tipsi-stripe';
import { ToastType, useToast } from '../providers/ToastProvider';

import { useOrder, useLanguage } from 'ordering-components/native';

const stripePaymentOptions = ['stripe', 'stripe_direct', 'stripe_connect']

export const CheckoutPage = (props: any) => {
  const { showToast } = useToast();
  const [, t] = useLanguage();
  const [, { confirmCart }] = useOrder();

  const checkoutProps = {
    ...props,
    cartUuid: props?.cartUuid || props.route?.params?.cartUuid,
    driverTipsOptions: [0, 10, 15, 20, 25],
    stripePaymentOptions,
    onPlaceOrderClick: async (data: any, paymethod: any, cart: any) => {
      if (cart?.order?.uuid) {
        props.navigation.navigate('OrderDetails', { orderId: cart.order?.uuid, isFromCheckout: true });
        return
      }

      if (cart?.status === 2 && stripePaymentOptions.includes(paymethod?.gateway)) {
        const clientSecret = cart?.paymethod_data?.result?.client_secret;
        const paymentMethodId = cart.paymethod_data?.data?.source_id;
        const publicKey = paymethod?.gateway === 'stripe_connect'
          ? paymethod?.paymethod?.credentials?.stripe.publishable
          : paymethod?.paymethod?.credentials?.publishable;

        stripe.setOptions({
          publishableKey: publicKey
        })

        try {
          const confirmPaymentIntent = await stripe.confirmPaymentIntent({
            clientSecret,
            paymentMethodId
          });

          if (confirmPaymentIntent?.status === 'succeeded') {
            props.handleIsRedirect && props.handleIsRedirect(true);
            try {
              const confirmCartRes = await confirmCart(cart?.uuid)
              if (confirmCartRes.error) {
                showToast(ToastType.Error, confirmCartRes.error.message)
              }
              if (confirmCartRes.result.order?.uuid) {
                props.navigation.navigate('HomeNavigator', { screen: 'OrderDetails', params: { orderId: confirmCartRes.result.order.uuid, isFromCheckout: true }})
              }
            } catch (error) {
              showToast(ToastType.Error, error?.toString() || error.message)
            }
            return
          }
        } catch (error) {
          const e = error.message === 'failed'
            ? t('FAILED_PAYMENT', 'The payment has failed')
            : error?.toString() || error.message
          showToast(ToastType.Error, e)
        }
      }
    },
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) return
      props.navigation.navigate(page, params);
    }
  }
  return (
    <Container nopadding>
      <Checkout {...checkoutProps} />
    </Container>
  )
}

export default CheckoutPage;
