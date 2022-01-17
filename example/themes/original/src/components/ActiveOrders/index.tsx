import React from 'react';
import { useLanguage, useUtils, useConfig } from 'ordering-components/native';
import { OButton, OIcon, OText } from '../shared';
import {
	ActiveOrdersContainer,
	Card,
	Map,
	Information,
	Logo,
	OrderInformation,
	BusinessInformation,
	Price,
	LoadMore
} from './styles';
import { View, StyleSheet } from 'react-native';
import { getGoogleMapImage } from '../../utils';

import { ActiveOrdersParams } from '../../types';
import moment from 'moment';
import { useTheme } from 'styled-components/native';

export const ActiveOrders = (props: ActiveOrdersParams) => {
	const {
		onNavigationRedirect,
		orders,
		pagination,
		loadMoreOrders,
		getOrderStatus,
	} = props;

	const theme = useTheme();
	const [{ configs }] = useConfig();
	const [, t] = useLanguage();
	const [{ parseDate, parsePrice, optimizeImage }] = useUtils();

	const formatDate = (date: string, option?: any) => {
		return option?.utc ? moment.utc(date).format('DD/MM/YY \u2022 h:m a') : moment(date).format('DD/MM/YY \u2022 h:m a');
	};

	const handleClickCard = (uuid: string) => {
		onNavigationRedirect &&
			onNavigationRedirect('OrderDetails', { orderId: uuid });
	};

	const Order = ({ order, index }: { order: any; index: number }) => (
		<React.Fragment>
			<Card
				isMiniCard={configs?.google_maps_api_key?.value}
				onPress={() => handleClickCard(order?.uuid)}
				activeOpacity={0.7}>
				{/* {!!(configs?.google_maps_api_key?.value) && (
          <Map>
            <OIcon
              url={getGoogleMapImage(order?.business?.location, configs?.google_maps_api_key?.value)}
              height={100}
              width={320}
              style={{resizeMode: 'cover', borderTopRightRadius: 24, borderTopLeftRadius: 24}}
            />
          </Map>
        )} */}
				<Information>
					{!!order.business?.logo && (
						<Logo>
							<OIcon
								url={optimizeImage(order.business?.logo, 'h_300,c_limit')}
								style={styles.logo}
							/>
						</Logo>
					)}
					<OrderInformation>
						<BusinessInformation>
							<OText size={12} lineHeight={18} weight={600} numberOfLines={1} ellipsizeMode={'tail'}>
								{order.business?.name}
							</OText>
							<View style={styles.orderNumber}>
								<OText size={10} space color={theme.colors.textSecondary}>
									{t('ORDER_NO', 'Order No') + '.'}
								</OText>
								<OText size={10} color={theme.colors.textSecondary}>
									{order.id + ` \u2022 `}
								</OText>
								<OText size={10} color={theme.colors.textSecondary}>
									{order?.delivery_datetime_utc
										? formatDate(order?.delivery_datetime_utc)
										: formatDate(order?.delivery_datetime, { utc: false })}
								</OText>
							</View>
							{/* {order?.status !== 0 && ( */}
							<OText
								color={theme.colors.primary}
								size={10}
								lineHeight={15}
								weight={400}
								numberOfLines={2}>
								{getOrderStatus(order.status)?.value}
							</OText>
							{/* )} */}
						</BusinessInformation>
						<Price>
							<OText size={12} lineHeight={18}>
								{parsePrice(order?.summary?.total || order?.total)}
							</OText>
						</Price>
					</OrderInformation>
				</Information>
			</Card>
		</React.Fragment>
	);

	return (
		<>
			<ActiveOrdersContainer isMiniCards={configs?.google_maps_api_key?.value}>
				{orders.length > 0 &&
					orders.map((order: any, index: any) => (
						<Order key={order?.id || order?.uuid} order={order} index={index} />
					))}
				{pagination?.totalPages && pagination?.currentPage < pagination?.totalPages && (
					<LoadMore>
						<OButton
							textStyle={{ color: '#fff' }}
							text={t('LOAD_MORE_ORDERS', 'Load more orders')}
							onClick={loadMoreOrders}
							style={styles.loadMoreButton}
						/>
					</LoadMore>
				)}
			</ActiveOrdersContainer>
			<View
				style={{
					height: 8,
					backgroundColor: theme.colors.backgroundGray100,
					marginHorizontal: -40,
				}}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	logo: {
		borderRadius: 7.6,
		width: 64,
		height: 64,
	},
	orderNumber: {
		flexDirection: 'row',
		marginVertical: 3,
	},
	loadOrders: {
		justifyContent: 'center',
		alignItems: 'center',
		minWidth: 230,
	},
	loadMoreButton: {
		width: '100%',
		marginLeft: 'auto',
		marginRight: 'auto',
		borderRadius: 7.6
	},
});
