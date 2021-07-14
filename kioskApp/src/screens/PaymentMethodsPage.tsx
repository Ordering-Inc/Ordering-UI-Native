import React from 'react';

import { Checkout } from '../components/Checkout';
import { SafeAreaContainer } from '../layouts/SafeAreaContainer';
import { useCartBottomSheet } from '../providers/CartBottomSheetProvider';

const PaymentMethodsPage = (props:any): React.ReactElement => {
  
	const {
    navigation,
    cartUuid,
    route,
  } = props;
  
  const { hideCartBottomSheet } = useCartBottomSheet();

  const checkoutProps = {
    ...props,
    cartUuid: cartUuid || route?.params?.cartUuid,
    onPlaceOrderClick: async (data: any, paymethod: any, cart: any) => {
      if (cart?.order?.uuid) {
        navigation.reset({
          routes: [{ name: 'OrderDetails', params: { orderId: cart.order?.uuid, isFromCheckout: true } }],
        });

        hideCartBottomSheet();

        return
      }
    },
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) return
      navigation.navigate(page, params);
    }
  }

  return (
    <SafeAreaContainer>
      <Checkout {...checkoutProps} />
    </SafeAreaContainer>
	);
};

export default PaymentMethodsPage;
