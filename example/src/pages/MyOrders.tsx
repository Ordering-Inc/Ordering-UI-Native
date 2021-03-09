import React from 'react'
import styled, { css } from 'styled-components/native'
import { useLanguage } from 'ordering-components/native'
import { OrdersOption } from '../components/OrdersOption'
import { OText } from '../components/shared'
import { MyOrdersParams } from '../types'

import { colors } from '../theme'

const Container = styled.View`
  flex: 1;
  height: 100%;
  ${(props: any) => !props.nopadding && css`
    padding: 20px;
  `}
  background-color: ${colors.backgroundPage};
`

const MyOrders = (props: MyOrdersParams) => {

  const [, t] = useLanguage()

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

export default MyOrders;