import React from 'react';
import { Checkout } from '../components/Checkout';
import { Container } from '../layouts/Container';
import stripe from 'tipsi-stripe';
import { ToastType, useToast } from '../providers/ToastProvider';

import { useOrder } from 'ordering-components/native';

export const CheckoutPage = (props: any) => {
  const { showToast } = useToast();
  const [, { confirmCart }] = useOrder();

  const checkoutProps = {
    ...props,
    cartUuid: props?.cartUuid || props.route?.params?.cartUuid,
    driverTipsOptions: [0, 10, 15, 20, 25],
    onPlaceOrderClick: async (data: any, paymethod: any, cart: any) => {
      if (cart?.order?.uuid) {
        props.navigation.navigate('OrderDetails', { orderId: cart.order?.uuid, isFromCheckout: true });
        return
      }

      if (cart?.status === 2 && paymethod?.gateway === 'stripe_direct') {
        const clientSecret = cart?.paymethod_data?.result?.client_secret
        const paymentMethodId = cart.paymethod_data?.data?.source_id;

        stripe.setOptions({
          publishableKey: paymethod?.paymethod?.credentials?.publishable
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
                props.navigation.navigate('OrderDetails', { orderId: confirmCartRes.result.order.uuid, isFromCheckout: true })
              }
            } catch (error) {
              showToast(ToastType.Error, error?.toString() || error.message)
            }
            return
          }
        } catch (error) {
          showToast(ToastType.Error, error?.toString() || error.message)
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
