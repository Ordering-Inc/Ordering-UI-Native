import React, { useState } from 'react';
import { useLanguage, useUtils } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { StyleSheet, TouchableOpacity, ScrollView, View } from 'react-native';
import { OButton, OIcon, OText } from '../shared';
import {
	Card,
	Logo,
	Information,
	MyOrderOptions,
	Status,
	WrappButton,
} from './styles';
import { PreviousOrdersParams } from '../../types';
import moment from 'moment';

export const PreviousOrders = (props: PreviousOrdersParams) => {
	const {
		orders,
		pagination,
		onNavigationRedirect,
		loadMoreOrders,
		getOrderStatus,
		handleReorder,
		reorderLoading,
		orderID,
	} = props;

	const theme = useTheme();


	const styles = StyleSheet.create({
		logo: {
			borderRadius: 10,
			width: 64,
			height: 64,
		},
		reorderbutton: {
			height: 23,
			paddingLeft: 10,
			paddingRight: 10,
			borderRadius: 23,
			shadowOpacity: 0,
			backgroundColor: theme.colors.primaryContrast,
			borderWidth: 0,
		},
		reorderLoading: {
			width: 80,
			height: 40,
			borderRadius: 10,
		},
		reviewButton: {
			height: 23,
			maxHeight: 23,
			backgroundColor: theme.colors.white,
			alignItems: 'center',
			justifyContent: 'center',
			paddingHorizontal: 10,
			borderRadius: 23,
			borderWidth: 1,
			borderColor: theme.colors.primaryContrast,
		},
		buttonText: {
			color: theme.colors.primary,
			fontSize: 10,
			marginLeft: 2,
			marginRight: 2,
		},
	});


	const [, t] = useLanguage();
	const [reorderSelected, setReorderSelected] = useState<number | null>(null);
	const [{ parseDate, optimizeImage }] = useUtils();
	const allowedOrderStatus = [1, 2, 5, 6, 10, 11, 12];

	const handleClickViewOrder = (uuid: string) => {
		onNavigationRedirect &&
			onNavigationRedirect('OrderDetails', { orderId: uuid });
	};

	const handleClickOrderReview = (order: any) => {
		onNavigationRedirect &&
			onNavigationRedirect('ReviewOrder', {
				order: {
					id: order?.id,
					business_id: order?.business_id,
					logo: order?.business?.logo,
					driver: order?.driver,
					products: order?.products,
					review: order?.review,
					user_review: order?.user_review
				},
			});
	};

	const formatDate = (date: string, option?: any) => {
		return option?.utc ? moment.utc(date).format('DD/MM/YY \u2022 h:m a') : moment(date).format('DD/MM/YY \u2022 h:m a');
	};

	const handleReorderClick = (id: number) => {
		setReorderSelected(id);
		handleReorder && handleReorder(id);
	};

	return (
		<View style={{ marginBottom: 30 }}>
			{orders.map((order: any) => (
				<TouchableOpacity
					onPress={() => handleClickViewOrder(order?.uuid)}
					activeOpacity={0.7}
					style={{ flexDirection: 'row' }}
					key={order.id}>
					<Card>
						{!!order.business?.logo && (
							<Logo>
								<OIcon
									url={optimizeImage(order.business?.logo, 'h_300,c_limit')}
									style={styles.logo}
								/>
							</Logo>
						)}
						<Information>
							<OText size={12} lineHeight={18} weight={'600'} numberOfLines={1} ellipsizeMode={'tail'}>
								{order.business?.name}
							</OText>
							<OText
								size={10}
								lineHeight={15}
								color={theme.colors.textSecondary}
								style={{ marginVertical: 3 }}
								numberOfLines={1}>
								{order?.delivery_datetime_utc
									? formatDate(order?.delivery_datetime_utc)
									: formatDate(order?.delivery_datetime, { utc: false })}
							</OText>
							<OText
								color={theme.colors.primary}
								size={10}
								lineHeight={15}
								numberOfLines={1}>
								{getOrderStatus(order.status)?.value}
							</OText>
						</Information>
						<Status>
							{order.cart && (
								<OButton
									text={t('REORDER', 'Reorder')}
									imgRightSrc={''}
									textStyle={styles.buttonText}
									style={
										reorderLoading && order.id === reorderSelected
											? styles.reorderLoading
											: styles.reorderbutton
									}
									onClick={() => handleReorderClick(order.id)}
									isLoading={reorderLoading && order.id === reorderSelected}
								/>
							)}
							{allowedOrderStatus.includes(parseInt(order?.status)) &&
								!order.review && (
									<TouchableOpacity
										onPress={() => handleClickOrderReview(order)}
										style={styles.reviewButton}>
										<OText size={10} color={theme.colors.primary} numberOfLines={1}>
											{t('REVIEW', 'Review')}
										</OText>
									</TouchableOpacity>
								)}
						</Status>
					</Card>
				</TouchableOpacity>
			))}
			{pagination.totalPages && pagination.currentPage < pagination.totalPages && (
				<WrappButton>
					<OButton
						onClick={loadMoreOrders}
						text={t('LOAD_MORE_ORDERS', 'Load more orders')}
						imgRightSrc={null}
						textStyle={{ color: theme.colors.white }}
						style={{ borderRadius: 7.6, shadowOpacity: 0, marginTop: 20 }}
					/>
				</WrappButton>
			)}
		</View>
	);
};
