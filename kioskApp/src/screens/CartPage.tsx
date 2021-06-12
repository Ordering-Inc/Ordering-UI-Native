import * as React from 'react';
import styled from 'styled-components/native';
import { useOrder, useLanguage } from 'ordering-components/native';
import { Platform } from 'react-native';
import { colors } from '../theme.json'
import { CartContent } from '../components/CartContent';
import { Container } from '../layouts/Container'
import NavBar from '../components/NavBar';
import { OButton } from '../components/shared';

interface Props {
  navigation: any;
  route: any;
}

const CartPage = (props: Props) => {
  const [{ carts }] = useOrder();
  const cartsList = (carts && Object.values(carts).filter((cart: any) => cart.products.length > 0)) || []

  const cartProps = {
    ...props,
    carts: cartsList,
    isOrderStateCarts: !!carts,
    onNavigationRedirect: (route: string, params: any) => props.navigation.navigate(route, params),
  }

  return (
    <CartContent {...cartProps} />
  );
};

export default CartPage;
