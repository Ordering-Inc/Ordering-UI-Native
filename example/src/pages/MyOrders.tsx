import React, {useState} from 'react'
import { useLanguage } from 'ordering-components/native'
import { OrdersOption, Container } from '../themes/instacart'
import { OText } from '../components/shared'

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
    <Container>
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
