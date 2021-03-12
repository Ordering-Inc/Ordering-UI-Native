import React from 'react'
import { OrderDetails as OrderDetailsController } from '../components/OrderDetails'

const OrderDetails = ({ navigation, route } : any) => {
  const { orderId } = route.params
  const orderDetailsProps = {
    navigation,
    orderId,
  }

  return (
    <OrderDetailsController {...orderDetailsProps} />
  )
}

export default OrderDetails
