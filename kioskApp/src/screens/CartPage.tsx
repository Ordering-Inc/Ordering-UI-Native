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

  const cartProps = {
    ...props,
    carts: cartsList,
    isOrderStateCarts: !!carts,
    onNavigationRedirect: (route: string, params: any) => props.navigation.navigate(route, params),
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }} >
      <CartContent {...cartProps} />
    </View>
  );
};

export default CartPage;
