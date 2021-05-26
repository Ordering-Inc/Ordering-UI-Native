import React from 'react';
import { Platform } from 'react-native';
import { Checkout } from '../components/Checkout';
import { Container } from '../layouts/Container';

import { initStripe, useConfirmPayment  } from '@stripe/stripe-react-native';
import styled from 'styled-components/native';

import { ToastType, useToast } from '../providers/ToastProvider';

import { useOrder, useLanguage } from 'ordering-components/native';

const stripePaymentOptions = ['stripe', 'stripe_direct', 'stripe_connect'];

const KeyboardView = styled.KeyboardAvoidingView`
  flex: 1;
`;

export const CheckoutPage = (props: any) => {
  const { showToast } = useToast();
  const [, t] = useLanguage();
  const [, { confirmCart }] = useOrder();
  const { confirmPayment, loading: confirmPaymentLoading } = useConfirmPayment();

  const checkoutProps = {
    ...props,
    cartUuid: props?.cartUuid || props.route?.params?.cartUuid,
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

        initStripe({ publishableKey: publicKey });

        try {
          const { paymentIntent, error } = await confirmPayment(clientSecret, {
            type: 'Card',
            paymentMethodId
          });

          props.handleIsRedirect && props.handleIsRedirect(true);
          try {
            const confirmCartRes = await confirmCart(cart?.uuid)
            if (confirmCartRes.error) {
              showToast(ToastType.Error, confirmCartRes.error.message)
            }
            if (confirmCartRes.result.order?.uuid) {
              props.navigation.navigate('OrderDetails', { orderId: confirmCartRes.result.order.uuid, isFromCheckout: true })
              return
            }
          } catch (error) {
            showToast(ToastType.Error, error?.toString() || error.message)
          }
          return
        } catch (error) {
          const e = error?.message?.toLowerCase() === 'failed'
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
    <KeyboardView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Container nopadding>
        <Checkout {...checkoutProps} />
      </Container>
    </KeyboardView>
  )
}

export default CheckoutPage;
