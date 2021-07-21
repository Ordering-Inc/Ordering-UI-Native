import React, { useState, useEffect } from 'react'
import { View, StyleSheet, BackHandler, TouchableOpacity, I18nManager, TextStyle } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import LinearGradient from 'react-native-linear-gradient'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Messages } from '../Messages'
import {
	useLanguage,
	OrderDetails as OrderDetailsConTableoller,
	useUtils,
	useConfig,
	useSession,
	useOrder
} from 'ordering-components/native'
import {
	OrderDetailsContainer,
	Header,
	OrderContent,
	OrderBusiness,
	Logo,
	OrderData,
	OrderInfo,
	OrderStatus,
	StatusBar,
	StatusImage,
	OrderCustomer,
	CustomerPhoto,
	InfoBlock,
	HeaderInfo,
	Customer,
	OrderProducts,
	Table,
	OrderBill,
	Total,
	NavBack,
	Icons,
	OrderDriver,
	Map
} from './styles'
import { OButton, OIcon, OModal, OText } from '../../../../components/shared'
import { colors, images, labels } from '../../theme.json'
import { ProductItemAccordion } from '../ProductItemAccordion'
import { OrderDetailsParams } from '../../../../types'
import { USER_TYPE } from '../../../../config/constants'
import { GoogleMap } from '../GoogleMap'
import { verifyDecimals } from '../../../../utils'
import moment from 'moment'

export const OrderDetailsUI = (props: OrderDetailsParams) => {

	const {
		navigation,
		messages,
		setMessages,
		readMessages,
		messagesReadList,
		isFromCheckout,
		isFromRoot,
		driverLocation,
		goToBusinessList
	} = props

	const [, t] = useLanguage()
	const [{ parsePrice, parseNumber, parseDate }] = useUtils()
	const [{ user }] = useSession()
	const [{ configs }] = useConfig()
	const [, { refreshOrderOptions }] = useOrder()
	const [openModalForBusiness, setOpenModalForBusiness] = useState(false)
	const [openModalForDriver, setOpenModalForDriver] = useState(false)
	const [unreadAlert, setUnreadAlert] = useState({ business: false, driver: false })
	const { order, businessData } = props.order


	const getOrderStatus = (s: string) => {
		const status = parseInt(s)
		const orderStatus = [
			{ key: 0, value: t('PENDING', 'Pending'), slug: 'PENDING', percentage: 0.25, image: images.order.status0 },
			{ key: 1, value: t('COMPLETED', 'Completed'), slug: 'COMPLETED', percentage: 1, image: images.order.status1 },
			{ key: 2, value: t('REJECTED', 'Rejected'), slug: 'REJECTED', percentage: 0, image: images.order.status2 },
			{ key: 3, value: t('DRIVER_IN_BUSINESS', 'Driver in business'), slug: 'DRIVER_IN_BUSINESS', percentage: 0.60, image: images.order.status3 },
			{ key: 4, value: t('PREPARATION_COMPLETED', 'Preparation Completed'), slug: 'PREPARATION_COMPLETED', percentage: 0.70, image: images.order.status4 },
			{ key: 5, value: t('REJECTED_BY_BUSINESS', 'Rejected by business'), slug: 'REJECTED_BY_BUSINESS', percentage: 0, image: images.order.status5 },
			{ key: 6, value: t('REJECTED_BY_DRIVER', 'Rejected by Driver'), slug: 'REJECTED_BY_DRIVER', percentage: 0, image: images.order.status6 },
			{ key: 7, value: t('ACCEPTED_BY_BUSINESS', 'Accepted by business'), slug: 'ACCEPTED_BY_BUSINESS', percentage: 0.35, image: images.order.status7 },
			{ key: 8, value: t('ACCEPTED_BY_DRIVER', 'Accepted by driver'), slug: 'ACCEPTED_BY_DRIVER', percentage: 0.45, image: images.order.status8 },
			{ key: 9, value: t('PICK_UP_COMPLETED_BY_DRIVER', 'Pick up completed by driver'), slug: 'PICK_UP_COMPLETED_BY_DRIVER', percentage: 0.80, image: images.order.status9 },
			{ key: 10, value: t('PICK_UP_FAILED_BY_DRIVER', 'Pick up Failed by driver'), slug: 'PICK_UP_FAILED_BY_DRIVER', percentage: 0, image: images.order.status10 },
			{ key: 11, value: t('DELIVERY_COMPLETED_BY_DRIVER', 'Delivery completed by driver'), slug: 'DELIVERY_COMPLETED_BY_DRIVER', percentage: 1, image: images.order.status11 },
			{ key: 12, value: t('DELIVERY_FAILED_BY_DRIVER', 'Delivery Failed by driver'), slug: 'DELIVERY_FAILED_BY_DRIVER', percentage: 0, image: images.order.status12 },
			{ key: 13, value: t('PREORDER', 'PreOrder'), slug: 'PREORDER', percentage: 0, image: images.order.status13 },
			{ key: 14, value: t('ORDER_NOT_READY', 'Order not ready'), slug: 'ORDER_NOT_READY', percentage: 0, image: images.order.status14 },
			{ key: 15, value: t('ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER', 'Order picked up completed by customer'), slug: 'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER', percentage: 100, image: images.order.status15 },
			{ key: 16, value: t('CANCELLED_BY_CUSTOMER', 'Cancelled by customer'), slug: 'CANCELLED_BY_CUSTOMER', percentage: 0, image: images.order.status16 },
			{ key: 17, value: t('ORDER_NOT_PICKEDUP_BY_CUSTOMER', 'Order not picked up by customer'), slug: 'ORDER_NOT_PICKEDUP_BY_CUSTOMER', percentage: 0, image: images.order.status17 },
			{ key: 18, value: t('DRIVER_ALMOST_ARRIVED_TO_BUSINESS', 'Driver almost arrived to business'), slug: 'DRIVER_ALMOST_ARRIVED_TO_BUSINESS', percentage: 0.15, image: images.order.status18 },
			{ key: 19, value: t('DRIVER_ALMOST_ARRIVED_TO_CUSTOMER', 'Driver almost arrived to customer'), slug: 'DRIVER_ALMOST_ARRIVED_TO_CUSTOMER', percentage: 0.90, image: images.order.status19 },
			{ key: 20, value: t('ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS', 'Customer almost arrived to business'), slug: 'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS', percentage: 90, image: images.order.status20 },
			{ key: 21, value: t('ORDER_CUSTOMER_ARRIVED_BUSINESS', 'Customer arrived to business'), slug: 'ORDER_CUSTOMER_ARRIVED_BUSINESS', percentage: 95, image: images.order.status21 }
		]


		const objectStatus = orderStatus.find((o) => o.key === status)

		return objectStatus && objectStatus
	}

	const handleOpenMessagesForBusiness = () => {
		setOpenModalForBusiness(true)
		readMessages && readMessages()
		setUnreadAlert({ ...unreadAlert, business: false })
	}

	const handleOpenMessagesForDriver = () => {
		setOpenModalForDriver(true)
		readMessages && readMessages()
		setUnreadAlert({ ...unreadAlert, driver: false })
	}

	const unreadMessages = () => {
		const length = messages?.messages.length
		const unreadLength = order?.unread_count
		const unreadedMessages = messages.messages.slice(length - unreadLength, length)
		const business = unreadedMessages.some((message: any) => message?.can_see?.includes(2))
		const driver = unreadedMessages.some((message: any) => message?.can_see?.includes(4))
		setUnreadAlert({ business, driver })
	}

	const handleCloseModal = () => {
		setOpenModalForBusiness(false)
		setOpenModalForDriver(false)
	}

	const handleArrowBack: any = () => {
		if ((!isFromCheckout && !goToBusinessList) || isFromRoot) {
			navigation?.canGoBack() && navigation.goBack();
			return
		}
		if (goToBusinessList) {
			refreshOrderOptions()
		}
		navigation.navigate('BottomTab');
	}

	const handleCallToDriver = () => {

	}

	const handleShareDelivery = () => {

	}

	useEffect(() => {
		BackHandler.addEventListener('hardwareBackPress', handleArrowBack);
		return () => {
			BackHandler.removeEventListener('hardwareBackPress', handleArrowBack);
		}
	}, [])

	useEffect(() => {
		if (messagesReadList?.length) {
			openModalForBusiness ? setUnreadAlert({ ...unreadAlert, business: false }) : setUnreadAlert({ ...unreadAlert, driver: false })
		}
	}, [messagesReadList])

	const locations = [
		{ ...order?.driver?.location, title: t('DRIVER', 'Driver'), icon: order?.driver?.photo || 'https://res.cloudinary.com/demo/image/fetch/c_thumb,g_face,r_max/https://www.freeiconspng.com/thumbs/driver-icon/driver-icon-14.png' },
		{ ...order?.business?.location, title: order?.business?.name, icon: order?.business?.logo || images.dummies.businessLogo },
		{ ...order?.customer?.location, title: t('YOUR_LOCATION', 'Your Location'), icon: order?.customer?.photo || 'https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,r_max/d_avatar.png/non_existing_id.png' }
	]

	useEffect(() => {
		if (driverLocation) {
			locations[0] = driverLocation
		}
	}, [driverLocation])

	return (
		<OrderDetailsContainer keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 40 }}>
			<Spinner visible={!order || Object.keys(order).length === 0} />
			{order && Object.keys(order).length > 0 && (
				<>
					<Header>
						<OButton
							imgLeftSrc={images.general.close}
							imgRightSrc={null}
							style={styles.btnBackArrow}
							onClick={() => handleArrowBack()}
							imgLeftStyle={{ tintColor: colors.textPrimary, width: 16 }}
						/>
						{/* <HeaderInfo>
							<OIcon src={images.logos.logotypeInvert} height={50} width={180} />
							<OText size={28} color={colors.white} style={{ fontWeight: '600', alignItems: 'flex-start' }}>
								{order?.customer?.name} {t('THANKS_ORDER', 'thanks for your order!')}
							</OText>
							<OText color={colors.white}>{t('ORDER_MESSAGE_HEADER_TEXT', 'Once business accepts your order, we will send you an email, thank you!')}</OText>
							<View style={{ ...styles.rowDirection, justifyContent: 'space-between' }}>
								<OText size={20} color={colors.white} space>
									{t('TOTAL', 'Total')}
								</OText>
								<OText size={20} color={colors.white}>{parsePrice(order?.summary?.total || order?.total)}</OText>
							</View> 
						</HeaderInfo>*/}
						<OrderInfo>
							<OrderData>
								<View style={{ alignItems: 'flex-start', marginBottom: 19 }}>
									<OText size={20} weight={'600'} style={{ lineHeight: 30, marginBottom: 16 }}>{t('ORDER', 'Order')} {order?.id}</OText>
									<OText color={colors.textPrimary} style={labels.middle as TextStyle}>{getOrderStatus(order?.status)?.value}</OText>
									<OText style={labels.small as TextStyle} color={colors.textSecondary}>
										{`${order?.business?.name} \u2022 ${order?.delivery_datetime_utc
											? moment(order?.delivery_datetime_utc).format('D/MMM/yyyy \u2022 h:m')
											: moment(order?.delivery_datetime).utc().format('D/MMM/yyyy \u2022 h:m')}`
										}
									</OText>
								</View>
								<StatusBar>
									<LinearGradient
										start={{ x: 0.0, y: 0.0 }}
										end={{ x: getOrderStatus(order?.status)?.percentage || 0, y: 0 }}
										locations={[.9999, .9999]}
										colors={[colors.primary, colors.backgroundGray300]}
										style={styles.statusBar}
									/>
								</StatusBar>
							</OrderData>
						</OrderInfo>
					</Header>
					<OrderContent>
						<OrderBusiness>
							<View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
								<OText style={{ ...labels.middle, marginBottom: 2 } as TextStyle} numberOfLines={1} ellipsizeMode='tail'>
									{order?.business?.name}
								</OText>
								<Icons>
									<TouchableOpacity onPress={() => props.navigation.navigate('Business', { store: businessData?.slug })}>
										<OText color={colors.green} style={labels.normal as TextStyle}>{t('GO_TO_STORE', 'Go to Store')}</OText>
									</TouchableOpacity>
									<OText style={labels.normal as TextStyle} color={colors.textSecondary}>{' \u2022 '}</OText>
									<TouchableOpacity onPress={() => handleOpenMessagesForBusiness()}>
										<OText style={labels.normal as TextStyle}>{t('CHAT', 'Chat')}</OText>
									</TouchableOpacity>
								</Icons>
							</View>
							<OText style={{ ...labels.normal, marginBottom: 2 } as TextStyle}>{order?.business?.address}</OText>
							<OText style={{ ...labels.normal, marginBottom: 2 } as TextStyle}>{order?.business?.email}</OText>
							<OText style={{ ...labels.normal, marginBottom: 2 } as TextStyle}>{order?.business?.cellphone}</OText>
						</OrderBusiness>

						<OrderCustomer>
							<Customer>
								<OText style={{ ...labels.middle, marginBottom: 2 } as TextStyle}>{order?.customer?.name} {order?.customer?.lastname}</OText>
								<OText style={{ ...labels.normal, marginBottom: 2 } as TextStyle}>{order?.customer?.address}</OText>
								<OText style={{ ...labels.normal, marginBottom: 2 } as TextStyle}>{order?.customer?.cellphone}</OText>
								<OText style={{ ...labels.normal, marginBottom: 2 } as TextStyle}>{order?.customer?.email}</OText>
							</Customer>
						</OrderCustomer>
						
						<OrderCustomer>
							<View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
								<View>
									<OText style={{ ...labels.middle, marginBottom: 2 } as TextStyle}>{t('SHARE_THIS_DELIVERY', 'Share this delivery')}</OText>
									<OText style={{ ...labels.normal, marginBottom: 2 } as TextStyle}>{t('LET_SOMEONE_FOLLOW_ALONG', 'Let someone follow along')}</OText>
								</View>
								<TouchableOpacity onPress={() => handleShareDelivery()}>
									<OIcon color={colors.primary} src={images.general.share_fill} width={16} />
								</TouchableOpacity>
							</View>
						</OrderCustomer>

						{order?.driver && (
							<OrderDriver>
								<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
									<OText style={{ ...labels.middle } as TextStyle}>{order?.driver?.name} {order?.driver?.lastname}</OText>
									<Icons>
										<TouchableOpacity onPress={() => handleCallToDriver()}>
											<OText style={labels.normal as TextStyle}>{t('CALL', 'Call')}</OText>
										</TouchableOpacity>
										<OText style={labels.normal as TextStyle} color={colors.textSecondary}>{' \u2022 '}</OText>
										<TouchableOpacity onPress={() => handleOpenMessagesForDriver()}>
											<OText style={labels.normal as TextStyle}>{t('CHAT', 'Chat')}</OText>
										</TouchableOpacity>
									</Icons>
								</View>
								<Customer>
									{order?.driver && (
										<>
											<OText style={labels.normal as TextStyle}>{t('DRIVER', 'Driver')}</OText>
											{order?.driver?.location && parseInt(order?.status) === 9 && (
												<Map>
													<GoogleMap
														location={order?.driver?.location}
														locations={locations}
														readOnly
													/>
												</Map>
											)}
										</>
									)}
								</Customer>
							</OrderDriver>
						)}

						<OrderProducts>
							<OText style={labels.middle as TextStyle}>{t('ORDER_DETAILS', 'Order Details')}</OText>
							{order?.products?.length && order?.products.map((product: any, i: number) => (
								<ProductItemAccordion
									key={product?.id || i}
									product={product}
									isMini
								/>
							))}
						</OrderProducts>
						<OrderBill>
							<Table>
								<OText>{t('SUBTOTAL', 'Subtotal')}</OText>
								<OText>{parsePrice(order?.summary?.subtotal || order?.subtotal)}</OText>
							</Table>
							{(order?.summary?.discount > 0 || order?.discount > 0) && (
								<Table>
									{order?.offer_type === 1 ? (
										<OText>
											{t('DISCOUNT', 'Discount')}
											<OText>{`(${verifyDecimals(order?.offer_rate, parsePrice)}%)`}</OText>
										</OText>
									) : (
										<OText>{t('DISCOUNT', 'Discount')}</OText>
									)}
									<OText>- {parsePrice(order?.summary?.discount || order?.discount)}</OText>
								</Table>
							)}
							{order?.tax_type !== 1 && (
								<Table>
									<OText>
										{t('TAX', 'Tax')}
										{`(${verifyDecimals(order?.tax, parseNumber)}%)`}
									</OText>
									<OText>{parsePrice(order?.summary?.tax || order?.totalTax)}</OText>
								</Table>
							)}
							{(order?.summary?.delivery_price > 0 || order?.deliveryFee > 0) && (
								<Table>
									<OText>{t('DELIVERY_FEE', 'Delivery Fee')}</OText>
									<OText>{parsePrice(order?.summary?.delivery_price || order?.deliveryFee)}</OText>
								</Table>
							)}
							<Table>
								<OText>
									{t('DRIVER_TIP', 'Driver tip')}
									{(order?.summary?.driver_tip > 0 || order?.driver_tip > 0) &&
										parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
										!parseInt(configs?.driver_tip_use_custom?.value, 10) &&
										(
											`(${verifyDecimals(order?.driver_tip, parseNumber)}%)`
										)}
								</OText>
								<OText>{parsePrice(order?.summary?.driver_tip || order?.totalDriverTip)}</OText>
							</Table>
							<Table>
								<OText>
									{t('SERVICE_FEE', 'Service Fee')}
									{`(${verifyDecimals(order?.service_fee, parseNumber)}%)`}
								</OText>
								<OText>{parsePrice(order?.summary?.service_fee || order?.serviceFee || 0)}</OText>
							</Table>
							<Total>
								<Table>
									<OText size={12} weight={'600'}>{t('TOTAL', 'Total')}</OText>
									<OText size={12} weight={'600'}>{parsePrice(order?.summary?.total || order?.total)}</OText>
								</Table>
							</Total>
						</OrderBill>
					</OrderContent>
				</>
			)}
			<OModal open={openModalForBusiness || openModalForDriver} entireModal onClose={() => handleCloseModal()}>
				<Messages
					type={openModalForBusiness ? USER_TYPE.BUSINESS : USER_TYPE.DRIVER}
					orderId={order?.id}
					messages={messages}
					order={order}
					setMessages={setMessages}
				/>
			</OModal>

		</OrderDetailsContainer>
	)
}

const styles = StyleSheet.create({
	rowDirection: {
		flexDirection: 'row'
	},
	statusBar: {
		transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
		height: 6,
		borderRadius: 6
	},
	logo: {
		width: 75,
		height: 75,
		borderRadius: 10
	},
	textBold: {
		fontWeight: 'bold'
	},
	btnBackArrow: {
		borderWidth: 0,
		backgroundColor: colors.clear,
		borderColor: colors.clear,
		shadowColor: colors.clear,
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		paddingLeft: 10,
		marginStart: -10,
		height: 30,
		width: 50
	},
})


export const OrderDetails = (props: OrderDetailsParams) => {
	const orderDetailsProps = {
		...props,
		UIComponent: OrderDetailsUI
	}

	return (
		<OrderDetailsConTableoller {...orderDetailsProps} />
	)
}
