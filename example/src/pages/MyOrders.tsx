import React from 'react'
import { useLanguage } from 'ordering-components/native'
import { OrdersOption } from '../components/OrdersOption'
import { OText } from '../components/shared'

import { Container } from '../layouts/Container'

const MyOrders = ({ navigation }: any) => {

  const [, t] = useLanguage()

  const MyOrderProps = {
    navigation,
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) return
      navigation.navigate(page, params);
    }
  }


  return (
    <Container>
      <OText size={24} mBottom={20}>
        {t('MY_ORDERS', 'My Orders')}
      </OText>
      <OrdersOption {...MyOrderProps} activeOrders />
      <OrdersOption {...MyOrderProps} />
    </Container>
  )
}

export default MyOrders;
