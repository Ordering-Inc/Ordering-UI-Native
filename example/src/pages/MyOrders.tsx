import React, {useState} from 'react'
import { useLanguage } from 'ordering-components/native'
import { OrdersOption } from '../components/OrdersOption'
import { OText } from '../components/shared'

import { Container } from '../layouts/Container'

const MyOrders = ({ navigation }: any) => {

  const [, t] = useLanguage()
  const [activeOrdersLength,setActiveOrdersLength] = useState(null)
  const [previousOrdersLength,setPreviousOrdersLength] = useState(null)
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
      <OrdersOption {...MyOrderProps} activeOrders activeOrdersLength={activeOrdersLength} setActiveOrdersLength={setActiveOrdersLength} />
      <OrdersOption {...MyOrderProps} previousOrdersLength={previousOrdersLength} setPreviousOrdersLength={setPreviousOrdersLength}/>
    </Container>
  )
}

export default MyOrders;
