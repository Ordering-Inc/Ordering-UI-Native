import * as React from 'react';
import { useOrder } from 'ordering-components/native';
import { View } from 'react-native';
import { CartContent } from '../components/CartContent';

interface Props {
  navigation: any;
  route: any;
}

const CartPage = (props: Props) => {
  const [{ carts }] = useOrder();
  const cartsList = (carts && Object.values(carts).filter((cart: any) => cart.products.length > 0)) || []

  let cart;
  
  if (cartsList?.length > 0) {
    cart = cartsList?.find((item: any) => item.business_id == '41');
  }

  const cartProps = {
    ...props,
    cart,
    isOrderStateCarts: !!carts,
    onNavigationRedirect: (route: string, params: any) => props.navigation.navigate(route, params),
    style: { padding: 20, backgroundColor: '#fff' },
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }} >
      <CartContent {...cartProps} />
    </View>
  );
};

export default CartPage;
