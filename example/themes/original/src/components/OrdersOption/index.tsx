import React, { useState, useEffect } from 'react'
import { OrderList, useLanguage, useOrder, ToastType, useToast } from 'ordering-components/native'
import { useTheme } from 'styled-components/native';
import { useFocusEffect } from '@react-navigation/native'
import { OText, OButton } from '../shared'
import { NotFoundSource } from '../NotFoundSource'
import { ActiveOrders } from '../ActiveOrders'
import { PreviousOrders } from '../PreviousOrders'

import { OptionTitle, NoOrdersWrapper } from './styles'
import { OrdersOptionParams } from '../../types'

import {
	Placeholder,
	PlaceholderLine,
	Fade
} from "rn-placeholder";

import { View, ScrollView } from 'react-native'

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
		loadMoreStatus,
		loadMoreOrders,
		loadOrders,
		setOrdersLength,
		ordersLength
	} = props

	const theme = useTheme();

	const [, t] = useLanguage()
	const [, { reorder }] = useOrder()
	const { showToast } = useToast()
	const { loading, error, orders: values } = orderList

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

		} catch (err: any) {
			showToast(ToastType.Error, t('ERROR', err.message))
			setReorderLoading(false)
		}
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

	useFocusEffect(
		React.useCallback(() => {
			loadOrders()
		}, [navigation])
	)

	useEffect(() => {
		const hasMore = pagination?.totalPages && pagination?.currentPage !== pagination?.totalPages
		if (loadMoreStatus && hasMore && !loading) {
			loadMoreOrders()
		}
	}, [loadMoreStatus, loading, pagination])

	useEffect(() => {
		if (loading) return

		const updateOrders = orders.filter((order: any) => orderStatus.includes(order.status))

		if (activeOrders) {
			setOrdersLength && setOrdersLength({ ...ordersLength, activeOrdersLength: updateOrders?.length })
		} else if (!preOrders) {
			setOrdersLength && setOrdersLength({ ...ordersLength, previousOrdersLength: updateOrders?.length })
		}
	}, [orders, activeOrders])

	return (
		<>
			{!loading && ordersLength.activeOrdersLength === 0 && ordersLength.previousOrdersLength === 0 && !activeOrders && (
				<NoOrdersWrapper>
					<OText size={14} numberOfLines={1}>
						{t('YOU_DONT_HAVE_ORDERS', 'You don\'t have any orders')}
					</OText>
					<OButton
						text={t('ORDER_NOW', 'Order now')}
						onClick={() => onNavigationRedirect && onNavigationRedirect('BusinessList')}
						textStyle={{ color: 'white', fontSize: 14 }}
						style={{ borderRadius: 7.6, marginBottom: 10, marginTop: 10, height: 44, paddingLeft: 10, paddingRight: 10 }}
					/>

				</NoOrdersWrapper>
			)}
			{(ordersLength.activeOrdersLength > 0 || ordersLength.previousOrdersLength > 0) && (
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
					{!(ordersLength.activeOrdersLength === 0 && ordersLength.previousOrdersLength === 0) &&
						!loading &&
						orders.filter((order: any) => orderStatus.includes(order.status)).length === 0 &&
						(
							<NotFoundSource
								content={t('NO_RESULTS_FOUND', 'Sorry, no results found')}
								image={imageFails}
								conditioned
							/>
						)}
				</>
			)}
			{loading && (
				<>
					{!activeOrders ? (
						<Placeholder style={{ marginTop: 30 }} Animation={Fade}>
							<View style={{ width: '100%', flexDirection: 'row' }}>
								<PlaceholderLine width={20} height={70} style={{ marginRight: 20, marginBottom: 35 }} />
								<Placeholder>
									<PlaceholderLine width={30} style={{ marginTop: 5 }} />
									<PlaceholderLine width={50} />
									<PlaceholderLine width={70} />
								</Placeholder>
							</View>
						</Placeholder>
					) : (
						<View style={{ marginTop: 30 }}>
							{[...Array(5)].map((item, i) => (
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
					)}
				</>
			)}
			{!loading && !error && orders.length > 0 && (
				preOrders ? (
					<ActiveOrders
						orders={orders.filter((order: any) => orderStatus.includes(order.status))}
						pagination={pagination}
						loadMoreOrders={loadMoreOrders}
						reorderLoading={reorderLoading}
						customArray={customArray}
						getOrderStatus={getOrderStatus}
						onNavigationRedirect={onNavigationRedirect}
					/>
				) : activeOrders ? (
					<ActiveOrders
						orders={orders.filter((order: any) => orderStatus.includes(order.status))}
						pagination={pagination}
						reorderLoading={reorderLoading}
						customArray={customArray}
						getOrderStatus={getOrderStatus}
						onNavigationRedirect={onNavigationRedirect}
					/>
				) : (
					<PreviousOrders
						reorderLoading={reorderLoading}
						orders={orders.filter((order: any) => orderStatus.includes(order.status)).sort((a: any, b: any) => a?.id < b?.id)}
						pagination={pagination}
						loadMoreOrders={loadMoreOrders}
						getOrderStatus={getOrderStatus}
						onNavigationRedirect={onNavigationRedirect}
						handleReorder={handleReorder}
					/>
				)
			)}
		</>
	)
}

export const OrdersOption = (props: OrdersOptionParams) => {
	const MyOrdersProps = {
		...props,
		UIComponent: OrdersOptionUI,
		orderStatus: props.preOrders ? [13] : props.activeOrders
			? [0, 3, 4, 7, 8, 9, 14, 15, 18, 19, 20, 21, 22, 23]
			: [1, 2, 5, 6, 10, 11, 12, 16, 17],
		useDefualtSessionManager: true,
	}

	return <OrderList {...MyOrdersProps} />

}
