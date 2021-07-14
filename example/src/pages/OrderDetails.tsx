import React from 'react'
import { OrderDetails as OrderDetailsController } from '../components/OrderDetails'
import { SafeAreaContainer } from '../layouts/SafeAreaContainer'
import theme from '../theme.json';

const OrderDetails = ({ navigation, route } : any) => {
  const orderDetailsProps = {
    navigation,
    theme,
    orderId: route.params?.orderId,
    isFromCheckout: route.params?.isFromCheckout,
    isFromRoot: route.params?.isFromRoot,
    goToBusinessList: route?.params?.goToBusinessList
  }

  return (
    <SafeAreaContainer>
      <OrderDetailsController {...orderDetailsProps} />
    </SafeAreaContainer>
  )
}

export default OrderDetails;
