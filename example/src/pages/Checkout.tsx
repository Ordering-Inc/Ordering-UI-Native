import React from 'react';
import { Checkout } from '../components/Checkout';
import { Container } from '../layouts/Container';

export const CheckoutPage = (props: any) => {
  const checkoutProps = {
    ...props,
    cartUuid: '16787f7c-74ef-4328-8c70-b67e6b66f829'
  }
  return (
    <Container nopadding>
      <Checkout {...checkoutProps} />
    </Container>
  )
}

export default CheckoutPage;
