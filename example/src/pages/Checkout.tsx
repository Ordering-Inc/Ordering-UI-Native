import React from 'react';
import { Checkout } from '../components/Checkout';
import { Container } from '../layouts/Container';

export const CheckoutPage = (props: any) => {
  const checkoutProps = {
    ...props,
    cartUuid: props?.cartUuid || props.route?.params?.cartUuid,
    onPlaceOrderClick: (data: any, paymethod: any, cart: any) => {
      if (cart?.order?.uuid) {
        props.navigation.navigate('OrderDetails', { orderId: cart.order?.uuid });
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
