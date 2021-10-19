import React, {useState} from 'react'
import { useLanguage } from 'ordering-components/native'
import { OrdersOption } from '../../themes/business/src/components/OrdersOption'
// import { OrdersOption } from '../components/OrdersOption'
import { OText } from '../components/shared'
import { Container } from '../layouts/Container'

const MyOrders = ({ navigation }: any) => {

  const [, t] = useLanguage()
  const [ordersLength,setOrdersLength] = useState({activeOrdersLength: 0, previousOrdersLength: 0})
  const MyOrderProps = {
    navigation,
    onNavigationRedirect: (page: string, params: any) => {
      if (!page) return;
      navigation.navigate(page, params);
    },
    paginationSettings: {
      initialPage: 1,
      pageSize: 50,
      controlType: 'infinity'
    },
  };


  return (
    <Container>
      {/* <OText size={24} mBottom={20}>
        {t('MY_ORDERS', 'My Orders')}
      </OText> */}
      <OrdersOption
        {...MyOrderProps}
        // activeOrders
        // ordersLength={ordersLength}
        // setOrdersLength={setOrdersLength}
      />
      {/* <OrdersOption
        {...myOrderProps}
        // ordersLength={ordersLength}
        setOrdersLength={setOrdersLength}
      /> */}
    </Container>
  )
}

export default MyOrders;
