import React, { useState } from 'react'
import { OrderList, useLanguage, useOrder, ToastType, useToast } from 'ordering-components/native'
import { useTheme } from 'styled-components/native';
import { OText } from '../shared'
import { NotFoundSource } from '../NotFoundSource'

import { ItemWrap } from './styles'
import { OrdersOptionParams } from '../../types'
import { getOrderStatus } from '../../utils'

import {
	Placeholder,
	PlaceholderLine,
	Fade
} from "rn-placeholder";
import { View } from 'react-native'
import moment from 'moment'

const OrdersOptionUI = (props: OrdersOptionParams) => {
	const {
		navigation,
		activeOrders,
		preOrders,
		orderList,
		pagination,
		titleContent,
		customArray,
		onNavigationRedirect,
		orderStatus,
		loadMoreOrders,
		loadOrders
	} = props

	const [, t] = useLanguage()
	const [, { reorder }] = useOrder()
	const { showToast } = useToast()
	const { loading, error, orders: values } = orderList

	const theme = useTheme();

	const imageFails = activeOrders
		? theme.images.general.emptyActiveOrders
		: theme.images.general.emptyPastOrders

	const orders = customArray || values || []

	const [reorderLoading, setReorderLoading] = useState(false)


	const handleReorder = async (orderId: number) => {
		setReorderLoading(true)
		try {
			const { error, result } = await reorder(orderId)
			if (!error) {
				onNavigationRedirect && onNavigationRedirect('CheckoutNavigator', { cartUuid: result.uuid })
				setReorderLoading(false)
				return
			}
			setReorderLoading(false)

		} catch (err) {
			showToast(ToastType.Error, t('ERROR', err.message))
			setReorderLoading(false)
		}
	}

	const formatDate = (dateStr: string) => {
		return moment(dateStr).format('MMMM DD,YYYY - hh:mm a');
	}

	return (
		<>
			{/* {(orders.length > 0) && (
        <>
          <OptionTitle>
            <OText size={16} lineHeight={24} weight={'500'} color={theme.colors.textNormal} mBottom={10} >
              {titleContent || (activeOrders
                ? t('ACTIVE', 'Active')
					 : preOrders
					 ? t('PREORDERS', 'Preorders')
                : t('PAST', 'Past'))}
            </OText>
          </OptionTitle>
        </>
      )} */}
			{!loading && orders.length === 0 && (
				<NotFoundSource
					content={t('NO_RESULTS_FOUND', 'Sorry, no results found')}
					image={imageFails}
					conditioned
				/>
			)}
			{loading && (
				<>
					<View style={{ marginTop: 30 }}>
						{[...Array(3)].map((item, i) => (
							<Placeholder key={i} Animation={Fade}>
								<View style={{ width: '100%', flexDirection: 'row' }}>
									<PlaceholderLine width={20} height={70} style={{ marginRight: 20, marginBottom: 20 }} />
									<Placeholder>
										<PlaceholderLine width={30} style={{ marginTop: 5 }} />
										<PlaceholderLine width={50} />
										<PlaceholderLine width={20} />
									</Placeholder>
								</View>
							</Placeholder>
						))}
					</View>
				</>
			)}
			{!loading && !error && orders.length > 0 && (
				orders.map((order: any) =>
					<ItemWrap imageStyle={{ opacity: 0.7 }} source={order.business?.header ? { uri: order.business?.header } : theme.images.dummies.product} key={order.id}>
						<OText color={theme.colors.white} size={12} lineHeight={18} weight={'600'}>{order?.business?.name}</OText>
						<OText color={theme.colors.white} size={10} lineHeight={15}>{`${getOrderStatus(order.status, t)?.value} on ${formatDate(order?.created_at)}`}</OText>
					</ItemWrap>)
			)}
		</>
	)
}

export const LastOrder = (props: OrdersOptionParams) => {
	const MyOrdersProps = {
		...props,
		UIComponent: OrdersOptionUI,
		orderStatus: [1, 2, 5, 6, 10, 11, 12, 16, 17],
		useDefualtSessionManager: true,
		paginationSettings: {
			initialPage: 1,
			pageSize: 3,
			controlType: 'infinity'
		},
		noGiftCardOrders: true
	}

	return <OrderList {...MyOrdersProps} />

}
