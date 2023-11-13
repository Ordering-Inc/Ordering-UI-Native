import React, { useState, useEffect } from 'react'
import { useLanguage, useOrder, ToastType, useToast, OrderList, OrderDetails as OrderDetailsConTableoller, useBusiness } from 'ordering-components/native'
import { useTheme } from 'styled-components/native';
import { useFocusEffect } from '@react-navigation/native'
import { OText, OModal } from '../shared'
import { NotFoundSource } from '../NotFoundSource'
import { ActiveOrders } from '../ActiveOrders'
import { Messages } from '../Messages';
import NavBar from '../NavBar'
import {
	MessageListingParams,
	OrdersOptionParams
} from '../../types'
import {
	Placeholder,
	PlaceholderLine,
	Fade
} from "rn-placeholder";
import { View, BackHandler, Platform } from 'react-native'
import {
	MessageListingWrapper,
	MessageContainer
} from './styles';
import { getOrderStatus } from '../../utils'

const OrdersOptionUI = (props: OrdersOptionParams) => {
	const {
		navigation,
		activeOrders,
		orderList,
		pagination,
		titleContent,
		customArray,
		onNavigationRedirect,
		orderStatus,
		loadMoreOrders,
		loadOrders,
		setSelectedOrderId,
		setOrderList,
		setOpenMessges,
		setRefreshOrders,
		refreshOrders
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

	const handleClickOrder = (uuid: string) => {
		setSelectedOrderId(uuid)
		setOpenMessges(true)
	}

	useFocusEffect(
		React.useCallback(() => {
			loadOrders()
		}, [navigation])
	)

	useEffect(() => {
		if (loading) return
		setOrderList(orderList)
	}, [orderList, loading])

	useEffect(() => {
		if (refreshOrders) {
			loadOrders(false, false, false, true)
			setRefreshOrders && setRefreshOrders(false)
		}
	}, [refreshOrders])

	return (
		<>
			{!loading && orders.length === 0 && (
				<NotFoundSource
					content={t('NO_RESULTS_FOUND', 'Sorry, no results found')}
					image={imageFails}
					conditioned
				/>
			)}
			{loading && (
				<View style={{ marginTop: 30 }}>
					{[...Array(6)].map((item, i) => (
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
			{!loading && !error && orders.length > 0 && (
				<ActiveOrders
					orders={orders.filter((order: any) => orderStatus.includes(order.status))}
					pagination={pagination}
					loadMoreOrders={loadMoreOrders}
					customArray={customArray}
					getOrderStatus={getOrderStatus}
					onNavigationRedirect={onNavigationRedirect}
					isMessageView
					handleClickOrder={handleClickOrder}
				/>
			)}
		</>
	)
}

const OrderMessageUI = (props: any) => {
	const {
		navigation,
		messages,
		setMessages,
		readMessages,
		messagesReadList,
		setOpenMessges,
		setSeletedOrder,
		setSelectedOrderId
	} = props;
	const [openModalForBusiness, setOpenModalForBusiness] = useState(false);
	const [openModalForDriver, setOpenModalForDriver] = useState(false);
	const [openMessages, setOpenMessages] = useState({ business: false, driver: false });
	const [unreadAlert, setUnreadAlert] = useState({
		business: false,
		driver: false,
	});
	const [, t] = useLanguage()
	const { order } = props.order;
	const handleArrowBack: any = () => {
		navigation.navigate('BottomTab');
	};

	const handleClose = () => {
		setOpenMessges(false)
		setSeletedOrder(null)
		setSelectedOrderId(null)
	}

	const handleOpenMessages = (data: any) => {
		setOpenMessages(data)
		readMessages && readMessages();
	}

	useEffect(() => {
		if (messagesReadList?.length) {
			openModalForBusiness
				? setUnreadAlert({ ...unreadAlert, business: false })
				: setUnreadAlert({ ...unreadAlert, driver: false });
		}
	}, [messagesReadList]);

	useEffect(() => {
		setOpenModalForBusiness(true);
		setOpenModalForDriver(true);
		readMessages && readMessages();
	}, [order])

	useEffect(() => {
		BackHandler.addEventListener('hardwareBackPress', handleArrowBack);
		return () => {
			BackHandler.removeEventListener('hardwareBackPress', handleArrowBack);
		};
	}, []);

	useEffect(() => {
		handleOpenMessages({ driver: false, business: true })
	}, [])

	return (
		<>
			<Messages
				orderId={order?.id}
				messages={messages}
				order={order}
				setMessages={setMessages}
				readMessages={readMessages}
				business={openMessages.business}
				driver={openMessages.driver}
				onMessages={setOpenMessages}
				isMeesageListing
				onClose={() => handleClose()}
			/>
		</>

	)
}

export const OrderListing = (props: OrdersOptionParams) => {
	const [businessState] = useBusiness();
	const OrderListingProps = {
		...props,
		UIComponent: OrdersOptionUI,
		orderStatus: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
		useDefualtSessionManager: true,
		paginationSettings: {
			initialPage: 1,
			pageSize: 10,
			controlType: 'infinity'
		},
		businessId: businessState?.business?.id,
		profileMessages: true,
		orderBy: 'last_direct_message_at',
		orderDirection: 'asc'
	}
	return <OrderList {...OrderListingProps} />
}

export const MessagesView = (props: any) => {
	const orderDetailsProps = {
		...props,
		UIComponent: OrderMessageUI,
	};
	return <OrderDetailsConTableoller {...orderDetailsProps} />;
};


export const MessageListing = (props: MessageListingParams) => {
	const {
		navigation
	} = props
	const [orderListStatus, setOrderListStatus] = useState({
		error: null,
		loading: false,
		orders: []
	})
	const [selectedOrderId, setSelectedOrderId] = useState(null)
	const [seletedOrder, setSeletedOrder] = useState<any>()
	const [openMessages, setOpenMessges] = useState(false)
	const [, t] = useLanguage()
	const theme = useTheme()

	const goToBack = () => {
		navigation?.canGoBack() && navigation.goBack()
		setSelectedOrderId(null)
		setSeletedOrder([])
	}

	const handleCloseModal = () => {
		setOpenMessges(false)
	}

	useEffect(() => {
		if (!orderListStatus?.loading && selectedOrderId) {
			const _orders = orderListStatus?.orders
			const _seletedOrder = _orders.find((order: any) => order?.uuid === selectedOrderId)
			setSeletedOrder(_seletedOrder)
		}
	}, [orderListStatus, selectedOrderId])

	return (
		<MessageListingWrapper>
			<NavBar
				title={t('MESSAGES', 'Messages')}
				titleAlign={'center'}
				onActionLeft={goToBack}
				showCall={false}
				paddingTop={Platform.OS === 'ios' ? 20 : 10}
				btnStyle={{ paddingLeft: 0 }}
			/>
			<OrderListing
				ordersLength={{ activeOrdersLength: 0, previousOrdersLength: 0 }}
				setSelectedOrderId={setSelectedOrderId}
				setOrderList={setOrderListStatus}
				setOpenMessges={setOpenMessges}
				franchiseId={props.franchiseId}
			/>
			{openMessages && !!seletedOrder?.id && (
				<OModal
					open={openMessages}
					entireModal
					customClose
					onClose={() => handleCloseModal()}
				>
					<MessagesView
						order={seletedOrder}
						orderId={seletedOrder?.id}
						setOpenMessges={setOpenMessges}
						setSeletedOrder={setSeletedOrder}
						setSelectedOrderId={setSelectedOrderId}
					/>
				</OModal>
			)}
		</MessageListingWrapper>
	)
}
