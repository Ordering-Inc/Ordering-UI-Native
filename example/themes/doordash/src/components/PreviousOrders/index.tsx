import React, { useState } from 'react'
import { useLanguage, useUtils } from 'ordering-components/native'
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { OButton, OIcon, OText } from '../shared'
import { Card, Logo, Information, MyOrderOptions, Status, WrappButton } from './styles'
import { useTheme } from 'styled-components/native';
import { PreviousOrdersParams } from '../../types'

export const PreviousOrders = (props: PreviousOrdersParams) => {
	const {
		orders,
		pagination,
		onNavigationRedirect,
		loadMoreOrders,
		getOrderStatus,
		handleReorder,
		reorderLoading,
		orderID
	} = props
	const theme = useTheme();

	const styles = StyleSheet.create({
		logo: {
			borderRadius: 10,
			width: 75,
			height: 75
		},
		reorderbutton: {
			width: 76,
			height: 26,
			minHeight: 26,
			paddingLeft: 0,
			paddingRight: 0,
			borderRadius: 20,
			shadowOpacity: 0
		},
		reorderLoading: {
			width: 76,
			height: 26,
			minHeight: 26,
			borderRadius: 20,
			shadowOpacity: 0
		},
		buttonText: {
			color: theme.colors.white,
			fontSize: 11,
			fontWeight: '600',
			marginLeft: 2,
			marginRight: 2
		}
	})

	const [, t] = useLanguage()
	const [reorderSelected, setReorderSelected] = useState<number | null>(null)
	const [{ parseDate, optimizeImage }] = useUtils()
	const allowedOrderStatus = [1, 2, 5, 6, 10, 11, 12]

	const handleClickViewOrder = (uuid: string) => {
		onNavigationRedirect && onNavigationRedirect('OrderDetails', { orderId: uuid })
	}

	const handleClickOrderReview = (order: any) => {
		onNavigationRedirect && onNavigationRedirect('ReviewOrder', { order: { id: order?.id, business_id: order?.business_id, logo: order.business?.logo } })
	}

	const handleReorderClick = (id: number) => {
		setReorderSelected(id)
		handleReorder(id)
	}

	return (
		<ScrollView
			style={{ marginBottom: 30 }}
		>
			{orders.map((order: any) => (
				<Card key={order.id}>
					<Information>
						<OText size={14} numberOfLines={1} weight={'600'}>
							{order.business?.name}
						</OText>
						<OText size={12} color={theme.colors.textSecondary} numberOfLines={1}>
							{order?.delivery_datetime_utc ? parseDate(order?.delivery_datetime_utc) : parseDate(order?.delivery_datetime, { utc: false })}
						</OText>
						<MyOrderOptions>
							<TouchableOpacity onPress={() => handleClickViewOrder(order?.uuid)}>
								<OText size={12} weight={'600'} color={theme.colors.textPrimary} numberOfLines={1}>{t('MOBILE_FRONT_BUTTON_VIEW_ORDER', 'View order')}</OText>
							</TouchableOpacity>
							{
								allowedOrderStatus.includes(parseInt(order?.status)) && !order.review && (
									<>
										<OText size={12} weight={'600'} color={theme.colors.textSecondary}>{' \u2022 '}</OText>
										<TouchableOpacity onPress={() => handleClickOrderReview(order)}>
											<OText size={12} weight={'600'} color={theme.colors.primary} numberOfLines={1}>{t('REVIEW', 'Review')}</OText>
										</TouchableOpacity>
									</>
								)}
						</MyOrderOptions>
					</Information>
					<Status>
						<OText
							color={theme.colors.primary}
							size={12}
							mBottom={11}
							lineHeight={14}
							style={{ textAlign: 'center' }}
						>
							{getOrderStatus(order.status)?.value}
						</OText>
						<OButton
							text={t('REORDER', 'Reorder')}
							imgRightSrc={''}
							textStyle={styles.buttonText}
							style={reorderLoading && order.id === reorderSelected ? styles.reorderLoading : styles.reorderbutton}
							onClick={() => handleReorderClick(order.id)}
							isLoading={reorderLoading && order.id === reorderSelected}
						/>
					</Status>

				</Card>
			))}
			{pagination.totalPages && pagination.currentPage < pagination.totalPages && (
				<WrappButton>
					<OButton
						onClick={loadMoreOrders}
						text={t('LOAD_MORE_ORDERS', 'Load more orders')}
						imgRightSrc={null}
						textStyle={{ color: theme.colors.white, fontSize: 14, fontWeight: '600' }}
						style={{ height: 40 }}
					/>
				</WrappButton>
			)}
		</ScrollView>

	)
}
