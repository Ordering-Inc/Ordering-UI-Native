import React, { useState } from 'react'
import { OrderList, useLanguage, useOrder, ToastType, useToast } from 'ordering-components/native'
import { useTheme } from 'styled-components/native';
import { OText } from '../shared'
import { NotFoundSource } from '../NotFoundSource'

import { ItemWrap } from './styles'
import { OrdersOptionParams } from '../../types'

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
	const [, { showToast }] = useToast()
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

	const getOrderStatus = (s: string) => {
		const status = parseInt(s)
		const orderStatus = [
			{ key: 0, value: t('PENDING', 'Pending') },
			{ key: 1, value: t('COMPLETED', 'Completed') },
			{ key: 2, value: t('REJECTED', 'Rejected') },
			{ key: 3, value: t('DRIVER_IN_BUSINESS', 'Driver in business') },
			{ key: 4, value: t('PREPARATION_COMPLETED', 'Preparation Completed') },
			{ key: 5, value: t('REJECTED_BY_BUSINESS', 'Rejected by business') },
			{ key: 6, value: t('REJECTED_BY_DRIVER', 'Rejected by Driver') },
			{ key: 7, value: t('ACCEPTED_BY_BUSINESS', 'Accepted by business') },
			{ key: 8, value: t('ACCEPTED_BY_DRIVER', 'Accepted by driver') },
			{ key: 9, value: t('PICK_UP_COMPLETED_BY_DRIVER', 'Pick up completed by driver') },
			{ key: 10, value: t('PICK_UP_FAILED_BY_DRIVER', 'Pick up Failed by driver') },
			{ key: 11, value: t('DELIVERY_COMPLETED_BY_DRIVER', 'Delivery completed by driver') },
			{ key: 12, value: t('DELIVERY_FAILED_BY_DRIVER', 'Delivery Failed by driver') },
			{ key: 13, value: t('PREORDER', 'PreOrder') },
			{ key: 14, value: t('ORDER_NOT_READY', 'Order not ready') },
			{ key: 15, value: t('ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER', 'Order picked up completed by customer') },
			{ key: 16, value: t('CANCELLED_BY_CUSTOMER', 'Cancelled by customer') },
			{ key: 17, value: t('ORDER_NOT_PICKEDUP_BY_CUSTOMER', 'Order not picked up by customer') },
			{ key: 18, value: t('DRIVER_ALMOST_ARRIVED_TO_BUSINESS', 'Driver almost arrived to business') },
			{ key: 19, value: t('DRIVER_ALMOST_ARRIVED_TO_CUSTOMER', 'Driver almost arrived to customer') },
			{ key: 20, value: t('ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS', 'Customer almost arrived to business') },
			{ key: 21, value: t('ORDER_CUSTOMER_ARRIVED_BUSINESS', 'Customer arrived to business') },
			{ key: 22, value: t('ORDER_LOOKING_FOR_DRIVER', 'Looking for driver') },
      		{ key: 23, value: t('ORDER_DRIVER_ON_WAY', 'Driver on way') }
		]

		const objectStatus = orderStatus.find((o) => o.key === status)

		return objectStatus && objectStatus
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
						<OText color={theme.colors.white} size={10} lineHeight={15}>{`${getOrderStatus(order.status)?.value} on ${formatDate(order?.created_at)}`}</OText>
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
		}
	}

	return <OrderList {...MyOrdersProps} />

}
