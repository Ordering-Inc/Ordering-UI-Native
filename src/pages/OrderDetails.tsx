import React from 'react'
import { OrderDetails as OrderDetailsController } from '../components/OrderDetails'
import { SafeAreaContainer } from '../layouts/SafeAreaContainer'

const OrderDetails = ({ navigation, route } : any) => {
  const { orderId, isFromCheckout } = route.params
  const orderDetailsProps = {
    navigation,
    orderId,
    isFromCheckout
  }

  return (
    <SafeAreaContainer>
      <OrderDetailsController {...orderDetailsProps} />
    </SafeAreaContainer>
  )
}

export default OrderDetails;
