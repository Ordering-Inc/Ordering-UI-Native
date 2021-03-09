import React from 'react'
import {useLanguage} from 'ordering-components/native'
import { Container } from './style'
import { OrdersOption } from '../OrdersOption'
import {OText} from '../shared'

export const MyOrders = (props) => {
  
  const [,t] = useLanguage()

  return (
    <Container>
      <OText size={24} mBottom={20}>
        {t('MY_ORDERS', 'My Orders')}
      </OText>
      <OrdersOption {...props} activeOrders />
      <OrdersOption {...props} />
    </Container>
  )
}
