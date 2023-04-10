import React, { useState, useEffect } from 'react'
import { OrderList, useLanguage, useOrder, ToastType, useToast } from 'ordering-components/native'
import { useTheme } from 'styled-components/native';
import { useFocusEffect } from '@react-navigation/native'
import { OText, OButton } from '../shared'
import { ActiveOrders } from '../ActiveOrders'
import { PreviousOrders } from '../PreviousOrders'
import { PreviousBusinessOrdered } from './PreviousBusinessOrdered'
import { PreviousProductsOrdered } from './PreviousProductsOrdered'
import { OptionTitle, NoOrdersWrapper } from './styles'
import { OrdersOptionParams } from '../../types'
import { _setStoreData } from '../../providers/StoreUtil';
import { NotFoundSource } from '../NotFoundSource';
import {
	Placeholder,
	PlaceholderLine,
	Fade
} from "rn-placeholder";

import { View, ScrollView } from 'react-native'
import { getOrderStatus, flatArray } from '../../utils'

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
		ordersLength,
		refreshOrders,
		setRefreshOrders,
		reorderState,
		handleReorder,
		handleUpdateOrderList,
		isBusiness,
		isProducts,
		businessOrderIds,
		products,
		businessesSearchList,
		hideOrders,
		BusinessControllerSkeletons,
		businesses,
		businessPaginationProps,
		handleUpdateProducts,
		handleUpdateBusinesses
	} = props

	const theme = useTheme();

	const [, t] = useLanguage()
	const [{ carts }] = useOrder()
	const [, { showToast }] = useToast()
	const { loading, error, orders: values } = orderList
	const [businessLoading, setBusinessLoading] = useState(true)
	const [orders, setOrders] = useState([])

	const imageFails = activeOrders
		? theme.images.general.emptyActiveOrders
		: theme.images.general.emptyPastOrders

	const _orders = customArray || values || []
	const uniqueOrders: any = []

	useEffect(() => {
		if (loading || error) return
		const ordersReduced = _orders.map((order: any) => order?.cart_group_id
			? _orders
				.filter((_order: any) => _order?.cart_group_id === order?.cart_group_id)
				.map((_o: any, _: any, _ordersList: any) => {
					const obj = {
						..._o,
						id: _ordersList.map(o => o.id),
						review: _o.review,
						user_review: _o.user_review,
						total: _ordersList.reduce((acc: any, o: any) => acc + o.summary.total, 0),
						business: _ordersList.map((o: any) => o.business),
						business_id: _ordersList.map((o: any) => o.business_id),
						products: _ordersList.map((o: any) => o.products)
					}
					return obj
				}).find((o: any) => o)
			: order)
		const orders = ordersReduced?.filter((order: any) => {
			if (!order?.cart_group_id) return true
			const isDuplicate = uniqueOrders.includes(order?.cart_group_id)
			if (!isDuplicate) {
				uniqueOrders.push(order?.cart_group_id)
				return true
			}
			return false
		})
		setOrders(orders)
	}, [_orders?.length])

	const onProductClick = (product: any) => {
		if (product?.product_id && product?.category_id && product?.businessId &&
			product?.business.slug && product?.business.header && product?.business.logo) {
			onNavigationRedirect('ProductDetails', {
				isRedirect: 'business',
				businessId: product?.businessId,
				categoryId: product?.category_id,
				productId: product?.product_id,
				business: {
					store: product?.business.slug,
					header: product?.business.header,
					logo: product?.business.logo,
				}
			})
		} else {
			showToast(ToastType.Error, t('ERROR_FAILED_REDIRECT_IDS', 'Failed to redirect product for ids'))
		}
	}

	useEffect(() => {
		if (reorderState?.loading) return
		const _businessId = 'businessId:' + reorderState?.result?.business_id
		if (reorderState?.error) {
			if (reorderState?.result?.business_id) {
				_setStoreData('adjust-cart-products', JSON.stringify(_businessId))
				navigation.navigate('Business', { store: reorderState?.result?.business?.slug })
			}
		}
		if (!reorderState?.error && !reorderState.loading && reorderState?.result?.business_id) {
			const cartProducts = carts?.[_businessId]?.products

			const available = cartProducts.every((product: any) => product.valid)
			const orderProducts = orders.find(
				(order: any) => Array.isArray(order?.id)
					? order?.id?.includes(reorderState?.result?.orderId)
					: order?.id === reorderState?.result?.orderId
			)?.products

			const productsFlatten = orderProducts?.length && flatArray(orderProducts)?.filter(product => product?.order_id === reorderState?.result?.orderId)

			if (available && reorderState?.result?.uuid && (cartProducts?.length === productsFlatten?.length)) {
				const multiOrders = flatArray(orderProducts)?.map(product => product.order_id)
				const params = multiOrders?.length > 1
					? { screen: 'MultiCheckout', checkCarts: true }
					: { cartUuid: reorderState?.result.uuid }

				onNavigationRedirect && onNavigationRedirect('CheckoutNavigator', params)
			} else {
				_setStoreData('adjust-cart-products', JSON.stringify(_businessId))
				cartProducts?.length !== productsFlatten?.length && _setStoreData('already-removed', JSON.stringify('removed'))
				navigation.navigate('Business', { store: reorderState?.result?.business?.slug })
			}
		}
	}, [reorderState])

	useEffect(() => {
		if (reorderState?.error) {
			showToast(ToastType.Error, reorderState?.result)
		}
	}, [reorderState])

	useFocusEffect(
		React.useCallback(() => {
			if (!businessesSearchList) {
				loadOrders(false, false, false, true)
			}
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

		const updateOrders = _orders.filter((order: any) => orderStatus.includes(order.status))

		if (activeOrders) {
			setOrdersLength && setOrdersLength({ ...ordersLength, activeOrdersLength: updateOrders?.length })
		} else if (!preOrders) {
			setOrdersLength && setOrdersLength({ ...ordersLength, previousOrdersLength: updateOrders?.length })
		}
	}, [_orders, activeOrders, preOrders])

	useEffect(() => {
		if (refreshOrders) {
			loadOrders(false, false, false, true)
			setRefreshOrders && setRefreshOrders(false)
		}
	}, [refreshOrders])

	return (
		<>
			{!loading && ordersLength.activeOrdersLength === 0 && ordersLength.previousOrdersLength === 0 && ordersLength?.preordersLength === 0 && !activeOrders && !preOrders && (
				<NoOrdersWrapper>
					<NotFoundSource
						hideImage
						btnStyle={{ borderRadius: 8 }}
						content={t('YOU_DONT_HAVE_ORDERS', 'You don\'t have any orders')}
						btnTitle={t('ORDER_NOW', 'Order now')}
						onClickButton={() => onNavigationRedirect && onNavigationRedirect('BusinessList')}
					/>
				</NoOrdersWrapper>
			)}
			{((ordersLength?.activeOrdersLength > 0 && activeOrders) ||
				(ordersLength?.previousOrdersLength > 0 && !activeOrders && !preOrders) ||
				(ordersLength?.preordersLength > 0 && preOrders)
			) && (
				<>
					{((titleContent && ((isBusiness && businessOrderIds?.length > 0) || isProducts)) || !titleContent) && (
						<OptionTitle titleContent={!!titleContent} isBusinessesSearchList={!!businessesSearchList}>
							<OText size={16} lineHeight={24} weight={'500'} color={theme.colors.textNormal} mBottom={10} >
								{titleContent || (activeOrders
									? t('ACTIVE', 'Active')
									: preOrders
										? t('PREORDERS', 'Preorders')
										: t('PAST', 'Past'))}
							</OText>
						</OptionTitle>
					)}
				</>
			)}
			{isBusiness && !!businessesSearchList && businesses?.loading && (
				<ScrollView horizontal>
					<BusinessControllerSkeletons paginationProps={businessPaginationProps} />
				</ScrollView>
			)}
			{isBusiness && (
				<PreviousBusinessOrdered
					onNavigationRedirect={onNavigationRedirect}
					isBusinessesSearchList={!!businessesSearchList}
					businesses={businesses}
					handleUpdateBusinesses={handleUpdateBusinesses}
				/>
			)}

			{isProducts && !loading && (
				<PreviousProductsOrdered
					products={products}
					onProductClick={onProductClick}
					handleUpdateProducts={handleUpdateProducts}
					isBusinessesSearchList={!!businessesSearchList}
				/>
			)}
			{(loading && isProducts) && (
				<>
					{[...Array(!!businessesSearchList ? 1 : 4).keys()].map(
						(item, i) => (
							<Placeholder key={i} style={{ padding: 5, paddingLeft: !!businessesSearchList ? 0 : 40, marginBottom: !!businessesSearchList ? 38 : 0 }} Animation={Fade}>
								<View style={{ flexDirection: 'row' }}>
									<PlaceholderLine
										width={24}
										height={70}
										style={{ marginRight: 10, marginBottom: 10 }}
									/>
									<Placeholder style={{ paddingVertical: 10 }}>
										<PlaceholderLine width={60} style={{ marginBottom: 25 }} />
										<PlaceholderLine width={20} />
									</Placeholder>
								</View>
							</Placeholder>
						),
					)}
				</>
			)}
			{!error && orders.length > 0 && !hideOrders && (
				preOrders ? (
					<ActiveOrders
						orders={orders.filter((order: any) => orderStatus.includes(order.status))}
						pagination={pagination}
						loadMoreOrders={loadMoreOrders}
						reorderLoading={reorderState?.loading}
						customArray={customArray}
						getOrderStatus={getOrderStatus}
						onNavigationRedirect={onNavigationRedirect}
						handleUpdateOrderList={handleUpdateOrderList}
					/>
				) : activeOrders ? (
					<ActiveOrders
						orders={orders.filter((order: any) => orderStatus.includes(order.status))}
						pagination={pagination}
						reorderLoading={reorderState?.loading}
						customArray={customArray}
						getOrderStatus={getOrderStatus}
						onNavigationRedirect={onNavigationRedirect}
						handleUpdateOrderList={handleUpdateOrderList}
					/>
				) : (
					<PreviousOrders
						reorderLoading={reorderState?.loading}
						orders={orders.filter((order: any) => orderStatus.includes(order.status)).sort((a: any, b: any) => a?.id < b?.id)}
						pagination={pagination}
						loadMoreOrders={loadMoreOrders}
						getOrderStatus={getOrderStatus}
						onNavigationRedirect={onNavigationRedirect}
						handleReorder={handleReorder}
						handleUpdateOrderList={handleUpdateOrderList}
						loading={loading}
					/>
				)
			)}
			{loading && !hideOrders && (
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
		</>
	)
}

export const OrdersOption = (props: OrdersOptionParams) => {
	const getAllOrders = props.activeOrders && props.pastOrders && props.preOrders

	const MyOrdersProps = {
		...props,
		UIComponent: OrdersOptionUI,
		orderStatus: getAllOrders
			? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
			: props.preOrders ? [13] : props.activeOrders
				? [0, 3, 4, 7, 8, 9, 14, 18, 19, 20, 21, 22, 23]
				: [1, 2, 5, 6, 10, 11, 12, 15, 16, 17],
		useDefualtSessionManager: true,
		paginationSettings: {
			initialPage: 1,
			pageSize: getAllOrders ? 30 : 10,
			controlType: 'infinity'
		}
	}

	return <OrderList {...MyOrdersProps} />

}
