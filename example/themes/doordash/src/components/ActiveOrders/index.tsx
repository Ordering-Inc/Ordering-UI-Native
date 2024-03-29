import React from 'react'
import { useLanguage, useUtils, useConfig } from 'ordering-components/native'
import { OButton, OText } from '../shared'
import { ActiveOrdersContainer, Card, Information, OrderInformation, BusinessInformation, Price } from './styles'
import { Platform, StyleSheet } from 'react-native'

import { ActiveOrdersParams } from '../../types'
import { useWindowDimensions } from 'react-native'
import { useTheme } from 'styled-components/native'

export const ActiveOrders = (props: ActiveOrdersParams) => {
	const {
		onNavigationRedirect,
		orders,
		pagination,
		loadMoreOrders,
		getOrderStatus,
		padding
	} = props

	const theme = useTheme();

	const { width } = useWindowDimensions();
	const [{ configs }] = useConfig()
	const [, t] = useLanguage()
	const [{ parseDate, parsePrice, optimizeImage }] = useUtils()

	const handleClickCard = (uuid: string) => {
		onNavigationRedirect && onNavigationRedirect('OrderDetails', { orderId: uuid })
	}

	const Order = ({ order, index }: { order: any, index: number }) => (
		<React.Fragment>
			<Card
				isMiniCard={configs?.google_maps_api_key?.value}
				onPress={() => handleClickCard(order?.uuid)}
				style={{ width: width * 0.9 - (padding || 0) * 2 }}
			>
				<Information>
					<OrderInformation>
						<BusinessInformation style={{ width: '67%' }}>
							<OText
								size={14}
								numberOfLines={1}
								ellipsizeMode='tail'
								weight={Platform.OS == 'ios' ? '600' : 'bold'}
								lineHeight={21}
							>
								{order.business?.name}
							</OText>
							<OText size={12} color={theme.colors.textSecondary} lineHeight={18}>{order?.delivery_datetime_utc
								? parseDate(order?.delivery_datetime_utc)
								: parseDate(order?.delivery_datetime, { utc: false })}</OText>
							<OText size={12} space color={theme.colors.textSecondary} lineHeight={18}>{`${t('ORDER_NUMBER', 'Order No.')} ${order.id}`}</OText>
						</BusinessInformation>
						<Price>
							<OText size={14} weight={Platform.OS == 'ios' ? '600' : 'bold'}>{parsePrice(order?.summary?.total || order?.total)}</OText>
						</Price>
					</OrderInformation>
					{order?.status !== 0 && (
						<OText color={theme.colors.primary} size={12} numberOfLines={2}>{getOrderStatus(order.status)?.value}</OText>
					)}
				</Information>
			</Card>
			{pagination?.totalPages && pagination?.currentPage < pagination?.totalPages && index === (10 * pagination?.currentPage) - 1 && (
				<Card
					style={{ ...styles.loadOrders, height: 97 }}
					onPress={loadMoreOrders}
				>
					<OButton
						bgColor={theme.colors.white}
						textStyle={{ color: theme.colors.primary, fontSize: 14 }}
						text={t('LOAD_MORE_ORDERS', 'Load more orders')}
						borderColor={theme.colors.white}
						style={{ paddingLeft: 30, paddingRight: 30 }}
						onClick={loadMoreOrders}
					/>
				</Card>
			)}
		</React.Fragment>
	)

	return (
		<ActiveOrdersContainer
			showsVerticalScrollIndicator={false}
			showsHorizontalScrollIndicator={false}
			horizontal
			isMiniCards={configs?.google_maps_api_key?.value}
			style={{ marginLeft: -(padding || 0), marginRight: -(padding || 0)}}
			contentContainerStyle={{ paddingLeft: padding, paddingRight: padding }}
		>
			{orders.length > 0 && (
				orders.map((order: any, index: any) => (
					<Order
						key={order?.id || order?.uuid}
						order={order}
						index={index}
					/>
				))
			)}
		</ActiveOrdersContainer>
	)
}

const styles = StyleSheet.create({
	logo: {
		borderRadius: 10,
		width: 75,
		height: '100%'
	},
	orderNumber: {
		flexDirection: 'row'
	},
	loadOrders: {
		justifyContent: 'center',
		alignItems: 'center',
		minWidth: 169,
		borderWidth: 0,
	}
})
