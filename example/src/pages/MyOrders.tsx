import React, { useState } from 'react'
import { useLanguage } from 'ordering-components/native'
import { OrdersOption } from '../themes/doordash'
import { OText } from '../components/shared'

import { Container } from '../layouts/Container'

const MyOrders = ({ navigation }: any) => {

	const [, t] = useLanguage()
	const [ordersLength, setOrdersLength] = useState({ activeOrdersLength: 0, previousOrdersLength: 0 })
	const MyOrderProps = {
		navigation,
		onNavigationRedirect: (page: string, params: any) => {
			if (!page) return
			navigation.navigate(page, params);
		}
	}


	return (
		<Container>
			<OText size={14} mBottom={20} weight={'600'} style={{textAlign: 'center'}}>
				{t('MY_ORDERS', 'My Orders')}
			</OText>
			<OrdersOption paddingHorizontal={40} {...MyOrderProps} activeOrders ordersLength={ordersLength} setOrdersLength={setOrdersLength} />
			<OrdersOption {...MyOrderProps} ordersLength={ordersLength} setOrdersLength={setOrdersLength} />
		</Container>
	)
}

export default MyOrders;
