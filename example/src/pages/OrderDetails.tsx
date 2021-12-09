import React from 'react'
import { OrderDetails as OrderDetailsController } from '../components/OrderDetails'
import { SafeAreaContainer } from '../layouts/SafeAreaContainer'

const OrderDetails = ({ navigation, route } : any) => {
  const orderDetailsProps = {
    navigation,
    orderId: route.params?.orderId,
    isFromCheckout: route.params?.isFromCheckout,
    isFromRoot: route.params?.isFromRoot,
    goToBusinessList: route?.params?.goToBusinessList,
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) return
      navigation.navigate(page, params);
    }
  }

  return (
    <SafeAreaContainer>
      <OrderDetailsController {...orderDetailsProps} />
    </SafeAreaContainer>
  )
}

export default OrderDetails;
