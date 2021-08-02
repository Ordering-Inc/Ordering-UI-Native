import * as React from 'react';
import { useFocusEffect } from '@react-navigation/native'
import styled from 'styled-components/native';
import { useOrder } from 'ordering-components/native';
import { Platform } from 'react-native';
import { CartContent } from '../themes/doordash/components';
import { Container } from '../layouts/Container'

const KeyboardView = styled.KeyboardAvoidingView`
  flex-grow: 1;
`;

interface Props {
  navigation: any;
  route: any;
}

const CartList = (props: Props) => {
  const [{ carts }, { refreshOrderOptions }] = useOrder();
  const cartsList = (carts && Object.values(carts).filter((cart: any) => cart.products.length > 0)) || []

  useFocusEffect(
    React.useCallback(() => {
      refreshOrderOptions()
    }, [props.navigation])
  )

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
