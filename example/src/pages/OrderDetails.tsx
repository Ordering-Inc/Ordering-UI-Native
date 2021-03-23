import React from 'react'
import { OrderDetails as OrderDetailsController } from '../components/OrderDetails'
import { SafeAreaContainer } from '../layouts/SafeAreaContainer'

const OrderDetails = ({ navigation, route } : any) => {
  const { orderId } = route.params
  const orderDetailsProps = {
    navigation,
    orderId,
  }

  return (
    <SafeAreaContainer>
      <OrderDetailsController {...orderDetailsProps} />
    </SafeAreaContainer>
  )
}

export default OrderDetails
