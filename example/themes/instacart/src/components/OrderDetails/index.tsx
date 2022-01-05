import React, { useState, useEffect } from 'react'
import { View, StyleSheet, BackHandler, TouchableOpacity, I18nManager, Image } from 'react-native'
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
	Icons,
	OrderDriver,
	Map,
	DivideView,
	ShareDelivery
} from './styles'
import { OButton, OIcon, OModal, OText } from '../shared'
import { ProductItemAccordion } from '../ProductItemAccordion'
import { OrderDetailsParams } from '../../types'
import { USER_TYPE } from '../../config/constants'
import { GoogleMap } from '../GoogleMap'
import { verifyDecimals } from '../../utils'
import { useTheme } from 'styled-components/native'
import { FloatingButton } from '../FloatingButton'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import moment from 'moment'
import SocialShareFav from '../SocialShare'

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

	const theme = useTheme()

	const styles = StyleSheet.create({
		rowDirection: {
			flexDirection: 'row'
		},
		statusBar: {
			transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
			height: 10,
			borderRadius: 10,
		},
		logo: {
			width: 59,
			height: 59,
		},
		textBold: {
			fontWeight: 'bold'
		},
		btnBackArrow: {
			borderWidth: 0,
			backgroundColor: theme.colors.primary,
			borderColor: theme.colors.primary,
			shadowColor: theme.colors.primary,
			alignItems: 'flex-start',
			justifyContent: 'flex-start',
			paddingLeft: 0,
			height: 30
		},
	})

	const [, t] = useLanguage()
	const [{ parsePrice, parseNumber, parseDate }] = useUtils()
	const [{ user }] = useSession()
	const [{ configs }] = useConfig()
	const [, { refreshOrderOptions }] = useOrder()
	const [openModalForBusiness, setOpenModalForBusiness] = useState(false)
	const [openModalForDriver, setOpenModalForDriver] = useState(false)
	const [unreadAlert, setUnreadAlert] = useState({ business: false, driver: false })
	const { order, businessData } = props.order
	const { bottom } = useSafeAreaInsets();


	const getOrderStatus = (s: string) => {
		const status = parseInt(s)
		const orderStatus = [
			{ key: 0, value: t('PENDING', 'Pending'), slug: 'PENDING', percentage: 0.25, image: theme.images.order.status0 },
			{ key: 1, value: t('COMPLETED', 'Completed'), slug: 'COMPLETED', percentage: 1, image: theme.images.order.status1 },
			{ key: 2, value: t('REJECTED', 'Rejected'), slug: 'REJECTED', percentage: 0, image: theme.images.order.status2 },
			{ key: 3, value: t('DRIVER_IN_BUSINESS', 'Driver in business'), slug: 'DRIVER_IN_BUSINESS', percentage: 0.60, image: theme.images.order.status3 },
			{ key: 4, value: t('PREPARATION_COMPLETED', 'Preparation Completed'), slug: 'PREPARATION_COMPLETED', percentage: 0.70, image: theme.images.order.status4 },
			{ key: 5, value: t('REJECTED_BY_BUSINESS', 'Rejected by business'), slug: 'REJECTED_BY_BUSINESS', percentage: 0, image: theme.images.order.status5 },
			{ key: 6, value: t('REJECTED_BY_DRIVER', 'Rejected by Driver'), slug: 'REJECTED_BY_DRIVER', percentage: 0, image: theme.images.order.status6 },
			{ key: 7, value: t('ACCEPTED_BY_BUSINESS', 'Accepted by business'), slug: 'ACCEPTED_BY_BUSINESS', percentage: 0.35, image: theme.images.order.status7 },
			{ key: 8, value: t('ACCEPTED_BY_DRIVER', 'Accepted by driver'), slug: 'ACCEPTED_BY_DRIVER', percentage: 0.45, image: theme.images.order.status8 },
			{ key: 9, value: t('PICK_UP_COMPLETED_BY_DRIVER', 'Pick up completed by driver'), slug: 'PICK_UP_COMPLETED_BY_DRIVER', percentage: 0.80, image: theme.images.order.status9 },
			{ key: 10, value: t('PICK_UP_FAILED_BY_DRIVER', 'Pick up Failed by driver'), slug: 'PICK_UP_FAILED_BY_DRIVER', percentage: 0, image: theme.images.order.status10 },
			{ key: 11, value: t('DELIVERY_COMPLETED_BY_DRIVER', 'Delivery completed by driver'), slug: 'DELIVERY_COMPLETED_BY_DRIVER', percentage: 1, image: theme.images.order.status11 },
			{ key: 12, value: t('DELIVERY_FAILED_BY_DRIVER', 'Delivery Failed by driver'), slug: 'DELIVERY_FAILED_BY_DRIVER', percentage: 0, image: theme.images.order.status12 },
			{ key: 13, value: t('PREORDER', 'PreOrder'), slug: 'PREORDER', percentage: 0, image: theme.images.order.status13 },
			{ key: 14, value: t('ORDER_NOT_READY', 'Order not ready'), slug: 'ORDER_NOT_READY', percentage: 0, image: theme.images.order.status14 },
			{ key: 15, value: t('ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER', 'Order picked up completed by customer'), slug: 'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER', percentage: 100, image: theme.images.order.status15 },
			{ key: 16, value: t('CANCELLED_BY_CUSTOMER', 'Cancelled by customer'), slug: 'CANCELLED_BY_CUSTOMER', percentage: 0, image: theme.images.order.status16 },
			{ key: 17, value: t('ORDER_NOT_PICKEDUP_BY_CUSTOMER', 'Order not picked up by customer'), slug: 'ORDER_NOT_PICKEDUP_BY_CUSTOMER', percentage: 0, image: theme.images.order.status17 },
			{ key: 18, value: t('DRIVER_ALMOST_ARRIVED_TO_BUSINESS', 'Driver almost arrived to business'), slug: 'DRIVER_ALMOST_ARRIVED_TO_BUSINESS', percentage: 0.15, image: theme.images.order.status18 },
			{ key: 19, value: t('DRIVER_ALMOST_ARRIVED_TO_CUSTOMER', 'Driver almost arrived to customer'), slug: 'DRIVER_ALMOST_ARRIVED_TO_CUSTOMER', percentage: 0.90, image: theme.images.order.status19 },
			{ key: 20, value: t('ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS', 'Customer almost arrived to business'), slug: 'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS', percentage: 90, image: theme.images.order.status20 },
			{ key: 21, value: t('ORDER_CUSTOMER_ARRIVED_BUSINESS', 'Customer arrived to business'), slug: 'ORDER_CUSTOMER_ARRIVED_BUSINESS', percentage: 95, image: theme.images.order.status21 }
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
		{ ...order?.business?.location, title: order?.business?.name, icon: order?.business?.logo || theme.images.dummies.businessLogo },
		{ ...order?.customer?.location, title: t('YOUR_LOCATION', 'Your Location'), icon: order?.customer?.photo || 'https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,r_max/d_avatar.png/non_existing_id.png' }
	]

	useEffect(() => {
		if (driverLocation) {
			locations[0] = driverLocation
		}
	}, [driverLocation])

	return (
		<>
			<OrderDetailsContainer keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false} style={{ marginBottom: 70 }}>
				<Spinner visible={!order || Object.keys(order).length === 0} />
				{order && Object.keys(order).length > 0 && (
					<>
						<Header>
							<OButton
								imgLeftSrc={theme.images.general.arrow_left}
								imgRightSrc={null}
								bgColor={theme.colors.white}
								style={styles.btnBackArrow}
								onClick={() => handleArrowBack()}
								imgLeftStyle={{ tintColor: theme.colors.primary }}
							/>
							<OText style={{ ...theme.labels.button, flex: 1, textAlign: 'center' }}>{`${t('ORDER_NO', 'Order No')}.${order?.id}`}</OText>
						</Header>
						<HeaderInfo>
							<Logo>
								<OIcon
									url={order?.business?.logo}
									style={styles.logo}
								/>
							</Logo>
							<StatusBar>
								<LinearGradient
									start={{ x: 0.0, y: 0.0 }}
									end={{ x: getOrderStatus(order?.status)?.percentage || 0, y: 0 }}
									locations={[.9999, .9999]}
									colors={[theme.colors.success, theme.colors.white]}
									style={styles.statusBar}
								/>
							</StatusBar>

							<OText style={theme.labels.button} color={theme.colors.white}>{getOrderStatus(order?.status)?.value}</OText>

							<OText color={theme.colors.white} style={{ ...theme.labels.small, textAlign: 'center' }}>
								{order?.customer?.name} {t('THANKS_ORDER', 'thanks for your order!')}
							</OText>

							<Icons>
								<TouchableOpacity onPress={() => props.navigation.navigate('Business', { store: businessData?.slug })} style={{ marginEnd: 10 }}>
									<OIcon
										src={theme.images.general.call}
										width={16}
										color={theme.colors.white}
									/>
								</TouchableOpacity>
								<TouchableOpacity onPress={() => handleOpenMessagesForBusiness()}>
									<OIcon
										src={theme.images.general.chat}
										width={16}
										color={theme.colors.white}
									/>
								</TouchableOpacity>
							</Icons>
							{/* <OText color={theme.colors.white}>{t('ORDER_MESSAGE_HEADER_TEXT', 'Once business accepts your order, we will send you an email, thank you!')}</OText>
							<View style={{ ...styles.rowDirection, justifyContent: 'space-between' }}>
								<OText size={20} color={theme.colors.white} space>
									{t('TOTAL', 'Total')}
								</OText>
								<OText size={20} color={theme.colors.white}>{parsePrice(order?.summary?.total || order?.total)}</OText>
							</View> */}
						</HeaderInfo>

						<DivideView />

						<OrderCustomer style={{overflow: 'visible', zIndex: 9999}}>
							<View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
								<OIcon
									src={theme.images.general.clock}
									width={16}
									height={16}
									color={theme.colors.textSecondary}
									style={{marginEnd: 15}}
								/>
								<OText size={14} weight={'400'}>
									{
										order?.delivery_datetime_utc
											? moment(order?.delivery_datetime_utc).format('dddd, MMMM D, yyyy h:m A')
											: moment(order?.delivery_datetime).utc().format('dddd, MMMM D, yyyy h:m A')
									}
								</OText>
							</View>
							<Customer>
								<OIcon
									src={theme.images.general.user}
									width={16}
									height={16}
									color={theme.colors.textSecondary}
									style={{marginTop: 2}}
								/>
								<InfoBlock>
									<OText size={14}>{order?.customer?.name} {order?.customer?.lastname}</OText>
									<OText style={{ ...theme.labels.normal, marginVertical: 4 }} color={theme.colors.textSecondary}>{order?.customer?.address}</OText>
									<OText style={theme.labels.normal} color={theme.colors.textSecondary}>{order?.customer?.cellphone}</OText>
								</InfoBlock>
							</Customer>
							{order?.driver && (
								<OrderDriver>
									<Customer>
										<OIcon
											url={order?.driver?.photo || theme.images.dummies.driverPhoto}
											style={{width: 36, height: 36, borderRadius: 7.6, marginTop: 2}}
										/>
										<InfoBlock style={{ marginStart: 7, flex: 1 }}>
											<OText size={14}>{order?.driver?.name} {order?.driver?.lastname}</OText>
											<OText style={{ ...theme.labels.normal, marginTop: 4 }} color={theme.colors.textSecondary}>{t('DRIVER', 'Driver')}</OText>
										</InfoBlock>
										<View style={{flexDirection: 'row', alignItems: 'center'}}>
											<TouchableOpacity onPress={() => { }} style={{ marginEnd: 10 }}>
												<OIcon
													src={theme.images.general.call}
													width={16}
													color={theme.colors.primary}
												/>
											</TouchableOpacity>
											<TouchableOpacity onPress={() => handleOpenMessagesForDriver()}>
												<OIcon
													src={theme.images.general.chat}
													width={16}
													color={theme.colors.primary}
												/>
											</TouchableOpacity>
										</View>
									</Customer>
									{order?.driver?.location && parseInt(order?.status) === 9 && (
										<Map>
											<GoogleMap
												location={order?.driver?.location}
												locations={locations}
												readOnly
											/>
										</Map>
									)}
								</OrderDriver>
							)}
							<ShareDelivery style={{overflow: 'visible'}}>
								<View style={{ flex: 1 }}>
									<OText size={14}>{t('SHARE_THIS_DELIVERY', 'Share this delivery')}</OText>
									<OText style={{ ...theme.labels.normal, marginTop: 4 }} color={theme.colors.textSecondary}>{t('LET_SOMEONE_FOLLOW_ALONG', 'Let someone follow along')}</OText>
								</View>
								<View style={{alignItems: 'center', overflow: 'visible'}}>
									<SocialShareFav icon={theme.images.general.share} style={{width: 16}} />
								</View>
							</ShareDelivery>
						</OrderCustomer>

						<DivideView />

						<OrderContent>

							<OrderProducts>
								<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
									<OIcon src={theme.images.general.shop_bag} style={{ marginEnd: 15 }} width={16} color={theme.colors.textSecondary} />
									<OText size={14}>{`${order?.products?.length || 0} ${t('ITEMS', 'Items')}`}</OText>
								</View>
								{order?.products?.length && order?.products.map((product: any, i: number) => (
									<ProductItemAccordion
										key={product?.id || i}
										product={product}
										isExpanded
									/>
								))}
							</OrderProducts>
							<OrderBill>
								<Table style={{ borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: 20 }}>
									<OText size={12} color={theme.colors.textPrimary}>{t('SUBTOTAL', 'Subtotal')}</OText>
									<OText size={12} color={theme.colors.textPrimary}>{parsePrice(order?.summary?.subtotal || order?.subtotal)}</OText>
								</Table>
								{(order?.summary?.discount > 0 || order?.discount > 0) && (
									<Table>
										{order?.offer_type === 1 ? (
											<OText size={12} color={theme.colors.textPrimary}>
												{t('DISCOUNT', 'Discount')}
												<OText size={12} color={theme.colors.textPrimary}>{`(${verifyDecimals(order?.offer_rate, parsePrice)}%)`}</OText>
											</OText>
										) : (
											<OText size={12} color={theme.colors.textPrimary}>{t('DISCOUNT', 'Discount')}</OText>
										)}
										<OText size={12} color={theme.colors.textPrimary}>- {parsePrice(order?.summary?.discount || order?.discount)}</OText>
									</Table>
								)}
								{order?.summary?.subtotal_with_discount > 0 && order?.summary?.discount > 0 && order?.summary?.total >= 0 && (
									<Table>
										<OText size={12} color={theme.colors.textPrimary}>{t('SUBTOTAL_WITH_DISCOUNT', 'Subtotal with discount')}</OText>
										<OText size={12} color={theme.colors.textPrimary}>{parsePrice(order?.summary?.subtotal_with_discount || 0)}</OText>
									</Table>
								)}
								{order?.tax_type !== 1 && (
									<Table>
										<OText size={12} color={theme.colors.textPrimary}>
											{t('TAX', 'Tax')}
											{`(${verifyDecimals(order?.tax, parseNumber)}%)`}
										</OText>
										<OText size={12} color={theme.colors.textPrimary}>{parsePrice(order?.summary?.tax || order?.totalTax)}</OText>
									</Table>
								)}
								{(order?.summary?.delivery_price > 0 || order?.deliveryFee > 0) && (
									<Table>
										<OText size={12} color={theme.colors.textPrimary}>{t('DELIVERY_FEE', 'Delivery Fee')}</OText>
										<OText size={12} color={theme.colors.textPrimary}>{parsePrice(order?.summary?.delivery_price || order?.deliveryFee)}</OText>
									</Table>
								)}
								<Table>
									<OText size={12} color={theme.colors.textPrimary}>
										{t('DRIVER_TIP', 'Driver tip')}
										{(order?.summary?.driver_tip > 0 || order?.driver_tip > 0) &&
											parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
											!parseInt(configs?.driver_tip_use_custom?.value, 10) &&
											(
												`(${verifyDecimals(order?.driver_tip, parseNumber)}%)`
											)}
									</OText>
									<OText size={12} color={theme.colors.textPrimary}>{parsePrice(order?.summary?.driver_tip || order?.totalDriverTip)}</OText>
								</Table>
								<Table>
									<OText size={12} color={theme.colors.textPrimary}>
										{t('SERVICE_FEE', 'Service Fee')}
										{`(${verifyDecimals(order?.service_fee, parseNumber)}%)`}
									</OText>
									<OText size={12} color={theme.colors.textPrimary}>{parsePrice(order?.summary?.service_fee || order?.serviceFee || 0)}</OText>
								</Table>
								<Table>
									<OText style={{ ...theme.labels.normal, fontWeight: '600', color: theme.colors.textPrimary }}>{t('TOTAL', 'Total')}</OText>
									<OText style={{ ...theme.labels.normal, fontWeight: '600', color: theme.colors.textPrimary }}>{parsePrice(order?.summary?.total || order?.total)}</OText>
								</Table>
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
			<FloatingButton
				btnText={t('GO_TO_MY_ORDERS', 'Go to my orders')}
				btnRightValue={''}
				handleClick={() => handleArrowBack()}
			/>
		</>
	)
}

export const OrderDetails = (props: OrderDetailsParams) => {
	const orderDetailsProps = {
		...props,
		UIComponent: OrderDetailsUI
	}

	return (
		<OrderDetailsConTableoller {...orderDetailsProps} />
	)
}
