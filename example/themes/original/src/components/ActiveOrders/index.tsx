import React from 'react';
import { useConfig } from 'ordering-components/native';
import {
	ActiveOrdersContainer
} from './styles';
import { View } from 'react-native';

import { ActiveOrdersParams } from '../../types';
import { useTheme } from 'styled-components/native';
import { SingleOrderCard } from '../SingleOrderCard';

export const ActiveOrders = (props: ActiveOrdersParams) => {
	const {
		onNavigationRedirect,
		orders,
		pagination,
		loadMoreOrders,
		getOrderStatus,
		isMessageView,
		handleClickOrder,
		handleUpdateOrderList
	} = props;

	const theme = useTheme();
	const [{ configs }] = useConfig();

	return (
		<>
			<ActiveOrdersContainer isMiniCards={configs?.google_maps_api_key?.value}>
				{orders.length > 0 &&
					orders.map((order: any, index: any) => (
						<SingleOrderCard
							key={index}
							order={order}
							handleClickOrder={handleClickOrder}
							isMessageView={isMessageView}
							getOrderStatus={getOrderStatus}
							onNavigationRedirect={onNavigationRedirect}
							handleUpdateOrderList={handleUpdateOrderList}
						/>
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
	);
};
