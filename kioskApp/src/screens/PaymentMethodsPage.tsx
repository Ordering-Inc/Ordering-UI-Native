import React from 'react';
import { Platform, Text } from 'react-native';
import { useOrder, useLanguage } from 'ordering-components/native';

import { Checkout } from '../components/Checkout';
import { ToastType, useToast } from '../providers/ToastProvider';

const PaymentMethodsPage = (props:any): React.ReactElement => {
  

	/* const {
		navigation,
		route,
	} = props; */

  const checkoutProps = {
    ...props,
    cartUuid: props?.cartUuid || props.route?.params?.cartUuid,
    onPlaceOrderClick: async (data: any, paymethod: any, cart: any) => {
      if (cart?.order?.uuid) {
        props.navigation.navigate('OrderDetails', { orderId: cart.order?.uuid, isFromCheckout: true });
        return
      }
    },
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) return
      props.navigation.navigate(page, params);
    }
  }

  return (

		<Checkout {...checkoutProps} />
		
	);
};

export default PaymentMethodsPage;
