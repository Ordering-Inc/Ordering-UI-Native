import * as React from 'react';
import { useOrder } from 'ordering-components/native';
import { CartContent } from '../components/CartContent';
import { SafeAreaContainer } from '../layouts/SafeAreaContainer';

interface Props {
  navigation: any;
  route: any;
}

const CartPage = (props: Props) => {

  const {
    navigation,
    route
  } = props;

  const [{ carts }] = useOrder();
  const cartsList = (carts && Object.values(carts).filter((cart: any) => cart.products.length > 0)) || []

  let cart;
  
  if (cartsList?.length > 0) {
    cart = cartsList?.find((item: any) => item.business_id == route?.params?.businessId);
  }

  const cartProps = {
    ...props,
    cart,
    isOrderStateCarts: !!carts,
    onNavigationRedirect: (route: string, params: any) => navigation.navigate(route, params)
  }

  return (
    <SafeAreaContainer>
      <CartContent {...cartProps} />
    </SafeAreaContainer>
  );
};

export default CartPage;
