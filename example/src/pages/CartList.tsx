import * as React from 'react';
import styled from 'styled-components/native';
import { useOrder } from 'ordering-components/native';
import { Platform } from 'react-native';
import { CartContent } from '../components/CartContent';
import { Container } from '../layouts/Container'

const KeyboardView = styled.KeyboardAvoidingView`
  flex-grow: 1;
`;

interface Props {
  navigation: any;
  route: any;
}

const CartList = (props: Props) => {
  const [{ carts }] = useOrder();
  const cartsList = (carts && Object.values(carts).filter((cart: any) => cart.products.length > 0)) || []

  const cartProps = {
    ...props,
    carts: cartsList,
    isOrderStateCarts: !!carts,
    onNavigationRedirect: (route: string, params: any) => props.navigation.navigate(route, params)
  }

  return (
    <>
      <KeyboardView
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Container>
          <CartContent {...cartProps} />
        </Container>
      </KeyboardView>
    </>
  );
};

export default CartList;
