import React, { useEffect } from 'react';
import { useLanguage, useUtils, useConfig } from 'ordering-components/native';
import { OIcon, OIconButton, OText } from '../shared';
import {
	ActiveOrdersContainer,
	Card,
	Information,
	Logo,
	OrderInformation,
	BusinessInformation,
	Price,
} from './styles';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

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
		isPreorders
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

	const handleLike = () => {

	}

	const Order = ({ order, index }: { order: any; index: number }) => (
		<React.Fragment>
			<Card
				isMiniCard={configs?.google_maps_api_key?.value}
				onPress={() => handleClickCard(order?.uuid)}
				activeOpacity={0.7}>
				<Information>
					{/* {!!order.business?.logo && (
						<Logo>
							<OIcon
								url={optimizeImage(order.business?.logo, 'h_300,c_limit')}
								style={styles.logo}
							/>
						</Logo>
					)} */}
					<OrderInformation>
						<BusinessInformation>
							<OText size={12} lineHeight={18} weight={600} numberOfLines={1} ellipsizeMode={'tail'}>
								{`${t('ORDER_NO', 'Order No')}.${order.id}`}
							</OText>
							<OText size={10} lineHeight={21} color={theme.colors.textSecondary}>
								{order?.delivery_datetime_utc
									? formatDate(order?.delivery_datetime_utc)
									: formatDate(order?.delivery_datetime, { utc: false })}
							</OText>
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
							{/* {!isPreorders &&
								<TouchableOpacity onPress={handleLike}>
									<OIcon src={theme.images.general.heart} color={theme.colors.red} width={16} />
								</TouchableOpacity>
							} */}
						</Price>
					</OrderInformation>
				</Information>
			</Card>
		</React.Fragment>
	);

	return (
    orders.length === 0 ? null : (
      <>
        <ActiveOrdersContainer isMiniCards={configs?.google_maps_api_key?.value}>
          {orders.length > 0 &&
            orders.map((order: any, index: any) => (
              <Order key={order?.id || order?.uuid} order={order} index={index} />
            ))}
        </ActiveOrdersContainer>
        <View
          style={{
            height: 8,
            backgroundColor: theme.colors.backgroundGray100,
            marginHorizontal: -40,
          }}
        />
      </>
    )
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
});
