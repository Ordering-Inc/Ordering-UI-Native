import React, {useState} from 'react'
import { useLanguage } from 'ordering-components/native'
import { OrdersOption } from '../../themes/original'
import { OText } from '../components/shared'
import { Container } from '../layouts/Container'

const MyOrders = ({ navigation }: any) => {

  const [, t] = useLanguage()
  const [ordersLength,setOrdersLength] = useState({activeOrdersLength: 0, previousOrdersLength: 0})
  const myOrderProps = {
    navigation,
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) return
      navigation.navigate(page, params);
    }
  }


  return (
    <Container style={{paddingLeft: 40, paddingRight: 40}}>
      <OText size={24} mBottom={20}>
        {t('MY_ORDERS', 'My Orders')}
      </OText>
      <OrdersOption
        {...myOrderProps}
        activeOrders
        ordersLength={ordersLength}
        setOrdersLength={setOrdersLength}
      />
      <OrdersOption
        {...myOrderProps}
        ordersLength={ordersLength}
        setOrdersLength={setOrdersLength}
      />
    </Container>
  )
}

export default MyOrders;
