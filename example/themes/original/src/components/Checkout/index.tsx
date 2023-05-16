import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, I18nManager, ScrollView } from 'react-native';
import { initStripe, useConfirmPayment } from '@stripe/stripe-react-native';
import Picker from 'react-native-country-picker-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import {
	Checkout as CheckoutController,
	useOrder,
	useSession,
	useApi,
	useLanguage,
	useUtils,
	useValidationFields,
	useConfig,
	useToast,
	ToastType,
	useEvent
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { OText, OIcon, OModal, OButton } from '../shared';

import { AddressDetails } from '../AddressDetails';
import { PaymentOptions } from '../PaymentOptions';
import { DriverTips } from '../DriverTips';
import { NotFoundSource } from '../NotFoundSource';
import { UserDetails } from '../UserDetails';
import { PaymentOptionWallet } from '../PaymentOptionWallet';
import { PlaceSpot } from '../PlaceSpot'
import { SignupForm } from '../SignupForm'
import { LoginForm } from '../LoginForm'

import {
	ChContainer,
	ChSection,
	ChHeader,
	ChAddress,
	CHMomentWrapper,
	ChPaymethods,
	ChDriverTips,
	ChErrors,
	ChBusinessDetails,
	ChUserDetails,
	ChCart,
	DeliveryOptionsContainer,
	DeliveryOptionItem,
	WalletPaymentOptionContainer,
	CartHeader
} from './styles';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';

import { FloatingButton } from '../FloatingButton';
import { Container } from '../../layouts/Container';
import NavBar from '../NavBar';
import { OrderSummary } from '../OrderSummary';
import { getTypesText } from '../../utils';
import { CartStoresListing } from '../CartStoresListing';
import { PaymentOptionsWebView } from '../../../../../src/components/PaymentOptionsWebView';
import { DeviceOrientationMethods } from '../../../../../src/hooks/DeviceOrientation'
const { useDeviceOrientation } = DeviceOrientationMethods

const mapConfigs = {
	mapZoom: 16,
	mapSize: {
		width: 640,
		height: 190
	}
};

const manageErrorsToShow = (array = []) => {
	let stringError = ''
	const list = Array.isArray(array) ? array : Object.values(array)
	list.map((item: any, i: number) => {
		stringError += (i + 1) === array.length ? `- ${item?.message || item}` : `- ${item?.message || item}\n`
	})
	return stringError;
}

const CheckoutUI = (props: any) => {
	const {
		navigation,
		cart,
		errors,
		placing,
		cartState,
		cartUuid,
		loyaltyPlansState,
		businessDetails,
		paymethodSelected,
		handlePaymethodChange,
		handlerClickPlaceOrder,
		onNavigationRedirect,
		deliveryOptionSelected,
		instructionsOptions,
		handleChangeDeliveryOption,
		currency,
		merchantId,
		setPlaceSpotNumber,
		maxDate
	} = props

	const theme = useTheme();

	const styles = StyleSheet.create({
		btnBackArrow: {
			borderWidth: 0,
			backgroundColor: theme.colors.white,
			borderColor: theme.colors.white,
			shadowColor: theme.colors.white,
			display: 'flex',
			justifyContent: 'flex-start',
			paddingLeft: 0,
		},
		paddSection: {
			padding: 20
		},
		pagePadding: {
			paddingHorizontal: 40
		},
		icon: {
			top: 15,
			right: Platform.OS === 'ios' ? 5 : (I18nManager.isRTL ? 30 : 0),
			position: 'absolute',
			fontSize: 20
		},
		detailWrapper: {
			paddingHorizontal: 40,
			width: '100%'
		},
		wrapperNavbar: {
			paddingVertical: 0,
			paddingHorizontal: 40,
			marginVertical: 2
		}
	})

	const [, { showToast }] = useToast();
	const [, t] = useLanguage();
	const [{ user, token }, { login }] = useSession();
	const [ordering] = useApi()
	const [{ configs }] = useConfig();
	const [{ parsePrice, parseDate }] = useUtils();
	const [{ options, carts, loading }, { confirmCart }] = useOrder();
	const [validationFields] = useValidationFields();
	const [events] = useEvent()
	const [orientationState] = useDeviceOrientation();
	const [isReadMore, setIsReadMore] = useState(false)
	const [lengthMore, setLengthMore] = useState(false)
	const WIDTH_SCREEN = orientationState?.dimensions?.width

	const [errorCash, setErrorCash] = useState(false);
	const [userErrors, setUserErrors] = useState<any>([]);
	const [isUserDetailsEdit, setIsUserDetailsEdit] = useState(false);
	const [phoneUpdate, setPhoneUpdate] = useState(false);
	const [openChangeStore, setOpenChangeStore] = useState(false)
	const [isDeliveryOptionModalVisible, setIsDeliveryOptionModalVisible] = useState(false)
	const [showGateway, setShowGateway] = useState<any>({ closedByUsed: false, open: false });
	const [webviewPaymethod, setWebviewPaymethod] = useState<any>(null)
	const [isOpen, setIsOpen] = useState(false)
	const [requiredFields, setRequiredFields] = useState<any>([])
	const [openModal, setOpenModal] = useState({ login: false, signup: false, isGuest: false })
	const [allowedGuest, setAllowedGuest] = useState(false)
	const [placeByMethodPay, setPlaceByMethodPay] = useState(false)
	const [methodPaySupported, setMethodPaySupported] = useState({ enabled: false, message: null, loading: true })
	const [paymethodClicked, setPaymethodClicked] = useState<any>(null)
	const [cardList, setCardList] = useState<any>({ cards: [], loading: false, error: null })
	const cardsMethods = ['credomatic']
  	const stripePaymethods: any = ['stripe', 'stripe_direct', 'stripe_connect', 'stripe_redirect']
	const placeSpotTypes = [3, 4, 5]
	const placeSpotsEnabled = placeSpotTypes.includes(options?.type)
	const isGiftCardCart = !cart?.business_id
	const businessConfigs = businessDetails?.business?.configs ?? []
	const isWalletCashEnabled = businessConfigs.find((config: any) => config.key === 'wallet_cash_enabled')?.value === '1'
	const isWalletCreditPointsEnabled = businessConfigs.find((config: any) => config.key === 'wallet_credit_point_enabled')?.value === '1'
	const isWalletEnabled = configs?.cash_wallet?.value && configs?.wallet_enabled?.value === '1' && (isWalletCashEnabled || isWalletCreditPointsEnabled)
	const isBusinessChangeEnabled = configs?.cart_change_business_validation?.value === '1'
	const isChewLayout = theme?.header?.components?.layout?.type?.toLowerCase() === 'chew'
	const hideBusinessAddress = theme?.checkout?.components?.business?.components?.address?.hidden
	const hideBusinessDetails = theme?.checkout?.components?.business?.hidden
	const hideBusinessMap = theme?.checkout?.components?.business?.components?.map?.hidden
	const hideCustomerDetails = theme?.checkout?.components?.customer?.hidden

	const creditPointPlan = loyaltyPlansState?.result?.find((loyal: any) => loyal.type === 'credit_point')
	const creditPointPlanOnBusiness = creditPointPlan?.businesses?.find((b: any) => b.business_id === cart?.business_id && b.accumulates)
	const methodsPay = ['google_pay', 'apple_pay']

	const isPreOrder = configs?.preorder_status_enabled?.value === '1'
	const subtotalWithTaxes = cart?.taxes?.reduce((acc: any, item: any) => {
		if (item?.type === 1)
			return acc = acc + item?.summary?.tax
		return acc = acc
	}, cart?.subtotal)

	const validateCommentsCartField = validationFields?.fields?.checkout?.comments?.enabled && validationFields?.fields?.checkout?.comments?.required && (cart?.comment === null || cart?.comment?.trim().length === 0)

	const isDisabledButtonPlace = loading || !cart?.valid || (!paymethodSelected && cart?.balance > 0) ||
		placing || errorCash || subtotalWithTaxes < cart?.minimum ||
		(cardsMethods.includes(paymethodSelected?.gateway) && cardList?.cards?.length === 0) ||
		(options.type === 1 &&
			validationFields?.fields?.checkout?.driver_tip?.enabled &&
			validationFields?.fields?.checkout?.driver_tip?.required &&
			(Number(cart?.driver_tip) <= 0)) ||
		(validateCommentsCartField)
		|| (methodsPay.includes(paymethodSelected?.gateway) && (!methodPaySupported.enabled || methodPaySupported.loading))

	const driverTipsOptions = typeof configs?.driver_tip_options?.value === 'string'
		? JSON.parse(configs?.driver_tip_options?.value) || []
		: configs?.driver_tip_options?.value || []

	const configTypes = configs?.order_types_allowed?.value.split('|').map((value: any) => Number(value)) || []

	const cartsWithProducts = carts && Object.values(carts).filter((cart: any) => cart.products.length) || null

	const isSandboxCredomatic = configs?.credomatic_integration_sandbox?.value === '1'
	const credomaticKeyId = isSandboxCredomatic ? configs?.credomatic_integration_public_sandbox_key?.value : configs?.credomatic_integration_public_production_key?.value
	const credomaticUrl = `https://integrations.ordering.co/credomatic/front/auth_mobile.html?title=${t('CREDOMATIC_PAYMENT', 'Credomatic payment')}&body=${t('CREDOMATIC_PROCESSING', 'Processing transaction')}`
	const deliveryOptions = instructionsOptions?.result && instructionsOptions?.result?.filter((option: any) => option?.enabled)?.map((option: any) => {
		return {
			value: option?.id, key: option?.id, label: t(option?.name.toUpperCase().replace(/\s/g, '_'), option?.name)
		}
	})

	const handleMomentClick = () => {
		if (isPreOrder) {
			navigation.navigate('MomentOption')
		}
	}

	const vibrateApp = (impact?: string) => {
		const options = {
			enableVibrateFallback: true,
			ignoreAndroidSystemSettings: false
		};
		ReactNativeHapticFeedback.trigger(impact || "impactLight", options);
	}

	const handleSuccessSignup = (user: any) => {
		login({
			user,
			token: user?.session?.access_token
		})
		openModal?.isGuest && handlePlaceOrderAsGuest()
    	setOpenModal({ ...openModal, signup: false, isGuest: false })
	}

	const handleSuccessLogin = (user: any) => {
		if (user) setOpenModal({ ...openModal, login: false })
	}

	const handlePlaceOrder = (confirmPayment: any, forcePlace: boolean = false) => {
		if (stripePaymethods.includes(paymethodSelected?.gateway) && user?.guest_id) {
			setOpenModal({ ...openModal, signup: true, isGuest: true })
			return
		}

		if (!userErrors.length && (!requiredFields?.length || allowedGuest) || forcePlace) {
			vibrateApp()
			handlerClickPlaceOrder && handlerClickPlaceOrder(null, { isNative: true }, confirmPayment)
			return
		}
		if (requiredFields?.length) {
			setIsOpen(true)
			return
		}
		let stringError = ''
		Object.values(userErrors).map((item: any, i: number) => {
			stringError += (i + 1) === userErrors.length ? `- ${item?.message || item}` : `- ${item?.message || item}\n`
		})
		showToast(ToastType.Error, stringError)
		setIsUserDetailsEdit(true)
	}

	const handlePlaceOrderAsGuest = () => {
		setIsOpen(false)
		handlerClickPlaceOrder && handlerClickPlaceOrder()
	}

	const handlePaymentMethodClick = (paymethod: any) => {
		setShowGateway({ closedByUser: false, open: true })
		setWebviewPaymethod(paymethod)
	}

	const onFailPaypal = async () => {
		if (showGateway.closedByUser === true) {
			await confirmCart(cart.uuid)
		}
	}
	const changeDeliveryOption = (option: any) => {
		handleChangeDeliveryOption(option)
		setIsDeliveryOptionModalVisible(false)
	}

	const checkValidationFields = () => {
		setUserErrors([])
		const errors = []
		const notFields = ['coupon', 'driver_tip', 'mobile_phone', 'address', 'zipcode', 'address_notes', 'comments']
		const _requiredFields: any = []

		Object.values(validationFields?.fields?.checkout).map((field: any) => {
			if (field?.required && !notFields.includes(field.code) && field?.enabled) {
				if (!user[field?.code]) {
					_requiredFields.push(field?.code)
				}
			}
		})

		if (
			!user?.cellphone &&
			((validationFields?.fields?.checkout?.cellphone?.enabled &&
				validationFields?.fields?.checkout?.cellphone?.required) ||
				configs?.verification_phone_required?.value === '1')
		) {
			_requiredFields.push('cellphone')
		}
		setRequiredFields(_requiredFields)

		if (phoneUpdate) {
			errors.push(t('NECESSARY_UPDATE_COUNTRY_PHONE_CODE', 'It is necessary to update your phone number'))
		}

		setUserErrors(errors)
	}

	const togglePhoneUpdate = (val: boolean) => {
		setPhoneUpdate(val)
	}

	useEffect(() => {
		if (validationFields && validationFields?.fields?.checkout) {
			checkValidationFields()
		}
	}, [validationFields, user])

	useEffect(() => {
		if (errors) {
			const errorText = manageErrorsToShow(errors)
			showToast(ToastType.Error, errorText)
		}
	}, [errors])

	useEffect(() => {
		if (cart?.products?.length === 0) {
			if (cart?.business?.slug) {
				onNavigationRedirect('Business', { store: cart?.business?.slug, header: null, logo: null, fromMulti: props.fromMulti })
			} else {
				onNavigationRedirect('Wallets')
			}
		}
	}, [cart?.products])

	useEffect(() => {
		onFailPaypal()
	}, [showGateway.closedByUser])

	const HeaderTitle = (props: any) => {
		const { text } = props
		return (
			<OText
				size={16}
				lineHeight={24}
				weight={'500'}
				mBottom={props.mb ?? 10}
				color={theme.colors.textNormal}
			>
				{text}
			</OText>
		)
	}

	useEffect(() => {
		cart && events.emit('checkout_started', cart)
	}, [])

	useEffect(() => {
		if (cart?.paymethod_data?.gateway === 'credomatic') {
			if (cart?.paymethod_data?.status === 2) {
				setShowGateway({ ...showGateway, open: true })
			} else if (cart?.paymethod_data?.gateway === 'credomatic' && cart?.paymethod_data?.status === 4) {
				setShowGateway({ ...showGateway, open: false })
			}
		}
	}, [cart?.paymethod_data])

	const onTextLayout = useCallback((e: any) => {
		setLengthMore((e.nativeEvent.lines.length == 3 && e.nativeEvent.lines[2].width > WIDTH_SCREEN * .76) || e.nativeEvent.lines.length > 3)
	}, [])

	return (
		<>
			<Container noPadding>
				<View style={styles.wrapperNavbar}>
					<NavBar
						title={t('CHECKOUT', 'Checkout')}
						titleAlign={'center'}
						onActionLeft={() => onNavigationRedirect('BottomTab', { screen: 'Cart' }, !props.fromMulti)}
						showCall={false}
						btnStyle={{ paddingLeft: 0, paddingTop: Platform.OS == 'ios' ? 0 : 2 }}
						titleWrapStyle={{ paddingHorizontal: 0 }}
						titleStyle={{ marginRight: 0, marginLeft: 0 }}
						style={{ marginTop: 20 }}
					/>
				</View>
				<ChContainer style={styles.pagePadding}>
					<ChSection style={{ paddingTop: 0 }}>
						<ChHeader>
							<CHMomentWrapper isCustomColor={isChewLayout} onPress={() => navigation.navigate('OrderTypes', { configTypes: configTypes })}>
								<OText
									size={12}
									numberOfLines={1}
									ellipsizeMode={'tail'}
									color={theme.colors?.[isChewLayout ? 'white' : 'textSecondary']}
								>
									{t(getTypesText(options?.type || 1), 'Delivery')}
								</OText>
								<OIcon
									src={theme.images.general.arrow_down}
									width={10}
									style={{ marginStart: 8 }}
									{...(isChewLayout && { color: 'white' })}
								/>
							</CHMomentWrapper>
							<CHMomentWrapper
								onPress={() => handleMomentClick()}
								disabled={loading}
							>
								<OText size={12} numberOfLines={1} ellipsizeMode='tail' color={theme.colors.textSecondary}>
									{options?.moment
										? parseDate(options?.moment, { outputFormat: configs?.dates_moment_format?.value })
										: t('ASAP_ABBREVIATION', 'ASAP')}
								</OText>
								{isPreOrder && (
									<OIcon
										src={theme.images.general.arrow_down}
										width={10}
										style={{ marginStart: 8 }}
									/>
								)}
							</CHMomentWrapper>
						</ChHeader>
						<View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginTop: 18, marginHorizontal: -40 }} />
					</ChSection>

					{!isGiftCardCart && !hideBusinessDetails && (
						<ChSection>
							<ChBusinessDetails>
								{
									(businessDetails?.loading || cartState.loading || !businessDetails?.business || Object.values(businessDetails?.business).length === 0) &&
									!businessDetails?.error &&
									(
										<Placeholder Animation={Fade}>
											<PlaceholderLine height={20} />
											<PlaceholderLine height={12} />
											<PlaceholderLine height={12} />
											<PlaceholderLine height={12} style={{ marginBottom: 20 }} />
										</Placeholder>
									)}
								{
									!cartState.loading &&
									businessDetails?.business &&
									Object.values(businessDetails?.business).length > 0 &&
									(
										<>
											<HeaderTitle text={t('BUSINESS_DETAILS', 'Business Details')} />
											<View>
												<OText size={12} lineHeight={18} weight={'400'}>
													{businessDetails?.business?.name}
												</OText>
												<OText size={12} lineHeight={18} weight={'400'}>
													{businessDetails?.business?.email}
												</OText>
												<OText size={12} lineHeight={18} weight={'400'}>
													{businessDetails?.business?.cellphone}
												</OText>
												{!hideBusinessAddress && (
													<OText size={12} lineHeight={18} weight={'400'}>
														{businessDetails?.business?.address}
													</OText>
												)}
												{businessDetails?.business?.address_notes && (
													<>
														<OText
															size={12}
															lineHeight={18}
															numberOfLines={isReadMore ? 20 : 3}
															onTextLayout={onTextLayout}
														>
															{businessDetails?.business?.address_notes}
														</OText>
														{lengthMore && (
															<TouchableOpacity
																onPress={() => setIsReadMore(!isReadMore)}
															>
																<OText size={12} color={theme.colors.primary}>{isReadMore ? t('SHOW_LESS', 'Show less') : t('READ_MORE', 'Read more')}</OText>
															</TouchableOpacity>
														)}
													</>
												)}
											</View>
										</>
									)}
								{businessDetails?.error && businessDetails?.error?.length > 0 && (
									<View>
										<HeaderTitle text={t('BUSINESS_DETAILS', 'Business Details')} />
										<NotFoundSource
											content={businessDetails?.error[0]?.message || businessDetails?.error[0]}
										/>
									</View>
								)}
							</ChBusinessDetails>
							<View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginHorizontal: -40 }} />
						</ChSection>
					)}
					{!hideCustomerDetails && (

						<ChSection>
							<ChUserDetails>
								{cartState.loading ? (
									<Placeholder Animation={Fade}>
										<PlaceholderLine height={20} />
										<PlaceholderLine height={12} />
										<PlaceholderLine height={12} />
										<PlaceholderLine height={12} style={{ marginBottom: 20 }} />
									</Placeholder>
								) : (
									(user?.guest_id && !allowedGuest) ? (
										<View>
											<HeaderTitle text={t('CUSTOMER_DETAILS', 'Customer details')} />
											<OButton
												text={t('SIGN_UP', 'Sign up')}
												textStyle={{ color: theme.colors.white }}
												style={{ borderRadius: 7.6, marginTop: 20 }}
												onClick={() => setOpenModal({ ...openModal, signup: true })}
											/>
											<OButton
												text={t('LOGIN', 'Login')}
												textStyle={{ color: theme.colors.primary }}
												bgColor={theme.colors.white}
												borderColor={theme.colors.primary}
												style={{ borderRadius: 7.6, marginTop: 20 }}
												onClick={() => setOpenModal({ ...openModal, login: true })}
											/>
											<OButton
												text={t('CONTINUE_AS_GUEST', 'Continue as guest')}
												textStyle={{ color: theme.colors.black }}
												bgColor={theme.colors.white}
												borderColor={theme.colors.black}
												style={{ borderRadius: 7.6, marginTop: 20 }}
												onClick={() => setAllowedGuest(true)}
											/>
										</View>
									) : (
										<UserDetails
											isUserDetailsEdit={isUserDetailsEdit}
											HeaderTitle={<HeaderTitle text={t('CUSTOMER_DETAILS', 'Customer Details')} mb={0} />}
											cartStatus={cart?.status}
											businessId={cart?.business_id}
											useValidationFields
											useDefualtSessionManager
											useSessionUser
											isCheckout
											phoneUpdate={phoneUpdate}
											togglePhoneUpdate={togglePhoneUpdate}
										/>
									)
								)}
							</ChUserDetails>
							<View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginHorizontal: -40 }} />
						</ChSection>
					)}

					{options?.type === 1 && !isGiftCardCart && (
						<DeliveryOptionsContainer>
							{cartState.loading || deliveryOptionSelected === undefined ? (
								<View style={{ height: 110 }}>
									<Placeholder Animation={Fade}>
										<PlaceholderLine height={20} />
										<PlaceholderLine height={40} />
									</Placeholder>
								</View>
							) : (
								<ChSection>
									<HeaderTitle text={t('DELIVERY_OPTIONS', 'Delivery options')} />
									<View
										style={{
											backgroundColor: theme.colors.inputDisabled,
											borderRadius: 7.5,
											marginBottom: 20,
											flex: 1
										}}>
										<Picker
											countryCode={undefined}
											visible={isDeliveryOptionModalVisible}
											onClose={() => setIsDeliveryOptionModalVisible(false)}
											withCountryNameButton
											renderFlagButton={() => (
												<TouchableOpacity onPress={() => setIsDeliveryOptionModalVisible(true)}>
													<DeliveryOptionItem backgroundColor={theme?.colors?.inputDisabled}>
														<OText
															size={14}
														>
															{deliveryOptions.find((option: any) => option.value === deliveryOptionSelected)?.label}
														</OText>
														<MaterialIcons name='keyboard-arrow-down' style={styles.icon} />
													</DeliveryOptionItem>
												</TouchableOpacity>
											)}
											flatListProps={{
												keyExtractor: (item: any) => item.value,
												data: deliveryOptions || [],
												renderItem: ({ item }: any) => (
													<TouchableOpacity
														onPress={() => !!cart?.uuid && changeDeliveryOption(item.value)}
														disabled={
															deliveryOptionSelected === item.value
														}
													>
														<DeliveryOptionItem backgroundColor={deliveryOptionSelected === item.value ? theme.colors.inputDisabled : 'white'}>
															<OText>
																{item.label}
															</OText>
														</DeliveryOptionItem>
													</TouchableOpacity>
												)
											}}
										/>
									</View>
									<View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginHorizontal: -40 }} />
								</ChSection>
							)}

						</DeliveryOptionsContainer>
					)}

					{!cartState.loading && (cart?.status === 2 || cart?.status === 4) && (
						<ChSection style={{ paddingBottom: 20 }}>
							<ChErrors>
								{!cartState.loading && cart?.status === 2 && (
									<OText
										style={{ textAlign: 'center' }}
										color={theme.colors.error}
										size={17}
									>
										{t('CART_STATUS_PENDING_MESSAGE_APP', 'Your order is being processed, please wait a little more. if you\'ve been waiting too long, please reload the app')}
									</OText>
								)}
							</ChErrors>
						</ChSection>
					)}

					{!isGiftCardCart && !hideBusinessMap && (
						<ChSection>
							<ChAddress>
								{(businessDetails?.loading || cartState.loading) ? (
									<Placeholder Animation={Fade}>
										<PlaceholderLine height={20} style={{ marginBottom: 50 }} />
										<PlaceholderLine height={100} />
									</Placeholder>
								) : (
									<AddressDetails
										navigation={navigation}
										location={options?.address?.location}
										businessLogo={businessDetails?.business?.logo}
										isCartPending={cart?.status === 2}
										uuid={cartUuid}
										apiKey={configs?.google_maps_api_key?.value}
										mapConfigs={mapConfigs}
										HeaderTitle={<HeaderTitle text={t('DELIVERY_ADDRESS', 'Delivery address')} mb={0} />}
									/>
								)}
							</ChAddress>
							<View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginTop: 13, marginHorizontal: -40 }} />
						</ChSection>
					)}

					{!cartState.loading &&
						cart &&
						cart?.valid &&
						options.type === 1 &&
						cart?.status !== 2 &&
						validationFields?.fields?.checkout?.driver_tip?.enabled &&
						driverTipsOptions && driverTipsOptions?.length > 0 &&
						!isGiftCardCart &&
						(
							<ChSection>
								<ChDriverTips>
									<HeaderTitle text={t('DRIVER_TIPS', 'Driver Tips')} mb={0} />
									<DriverTips
										uuid={cartUuid}
										businessId={cart?.business_id}
										driverTipsOptions={!driverTipsOptions.includes(0) ? [0, ...driverTipsOptions] : driverTipsOptions}
										isFixedPrice={parseInt(configs?.driver_tip_type?.value, 10) === 1}
										isDriverTipUseCustom={!!parseInt(configs?.driver_tip_use_custom?.value, 10)}
										driverTip={parseInt(configs?.driver_tip_type?.value, 10) === 1
											? cart?.driver_tip
											: cart?.driver_tip_rate}
										useOrderContext
										cart={cart}
									/>
								</ChDriverTips>
							</ChSection>
						)}

					{!cartState.loading && cart && cart?.status !== 2 && cart?.valid && (
						<ChSection>
							<ChPaymethods>
								<HeaderTitle text={t('PAYMENT_METHOD', 'Payment Method')} mb={0} />
								{!cartState.loading && cart?.status === 4 && (
									<OText
										style={{ textAlign: 'center', marginTop: 20 }}
										color={theme.colors.error}
										size={17}
									>
										{t('CART_STATUS_CANCEL_MESSAGE', 'The payment has not been successful, please try again')}
									</OText>
								)}
								<PaymentOptions
									cart={cart}
									isDisabled={cart?.status === 2}
									businessId={!isGiftCardCart ? businessDetails?.business?.id : -1}
									isLoading={!isGiftCardCart ? businessDetails.loading : false}
									paymethods={businessDetails?.business?.paymethods}
									onPaymentChange={handlePaymethodChange}
									errorCash={errorCash}
									setErrorCash={setErrorCash}
									onNavigationRedirect={onNavigationRedirect}
									paySelected={paymethodSelected}
									handlePaymentMethodClickCustom={handlePaymentMethodClick}
									handlePlaceOrder={handlePlaceOrder}
									merchantId={merchantId}
									setMethodPaySupported={setMethodPaySupported}
									methodPaySupported={methodPaySupported}
									placeByMethodPay={placeByMethodPay}
									setPlaceByMethodPay={setPlaceByMethodPay}
									cardList={cardList}
									setCardList={setCardList}
									requiredFields={requiredFields}
									openUserModal={setIsOpen}
									paymethodClicked={paymethodClicked}
									setPaymethodClicked={setPaymethodClicked}
								/>
							</ChPaymethods>
						</ChSection>
					)}

					{!cartState.loading && cart && isWalletEnabled && businessDetails?.business?.configs && (
						<WalletPaymentOptionContainer>
							<PaymentOptionWallet
								cart={cart}
								loyaltyPlansState={loyaltyPlansState}
								businessId={cart?.business_id}
								businessConfigs={businessDetails?.business?.configs}
							/>
						</WalletPaymentOptionContainer>
					)}


					{!cartState.loading && placeSpotsEnabled && !isGiftCardCart && (
						<>
							<View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginTop: 30, marginHorizontal: -40 }} />
							<PlaceSpot
								isCheckout
								isInputMode
								cart={cart}
								spotNumberDefault={cartState?.cart?.spot_number ?? cart?.spot_number}
								setPlaceSpotNumber={setPlaceSpotNumber}
								vehicleDefault={cart?.vehicle}
							/>
							<View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginHorizontal: -40 }} />
						</>
					)}

					{!cartState.loading && cart && (
						<ChSection>
							<ChCart>
								{cartsWithProducts && cart?.products?.length === 0 ? (
									<NotFoundSource
										content={t('NOT_FOUND_CARTS', 'Sorry, You don\'t seem to have any carts.')}
										btnTitle={t('SEARCH_REDIRECT', 'Go to Businesses')}
									/>
								) : (
									<>
										<CartHeader>
											<HeaderTitle text={t('MOBILE_FRONT_YOUR_ORDER', 'Your order')} mb={0} />
											{!isGiftCardCart && (
												<TouchableOpacity
													onPress={() => onNavigationRedirect('Business', { store: cart?.business?.slug })}
												>
													<OText
														size={12}
														lineHeight={15}
														color={theme.colors.primary}
														style={{ textDecorationLine: 'underline' }}
													>
														{t('ADD_PRODUCTS', 'Add products')}
													</OText>
												</TouchableOpacity>
											)}
										</CartHeader>
										{isBusinessChangeEnabled && (
											<TouchableOpacity
												onPress={() => setOpenChangeStore(true)}
												style={{ alignSelf: 'flex-start' }}
											>
												<OText
													size={12}
													lineHeight={18}
													color={theme.colors.primary}
													style={{ textDecorationLine: 'underline' }}
												>
													{t('CHANGE_STORE', 'Change store')}
												</OText>
											</TouchableOpacity>
										)}
										<OrderSummary
											cart={cart}
											isCartPending={cart?.status === 2}
											onNavigationRedirect={onNavigationRedirect}
											placeSpotTypes={placeSpotTypes}
											businessConfigs={businessConfigs}
											maxDate={maxDate}
											loyaltyRewardRate={
												creditPointPlanOnBusiness?.accumulation_rate ??
												(!!creditPointPlanOnBusiness && creditPointPlan?.accumulation_rate) ?? 0
											}
										/>
									</>
								)}
							</ChCart>
						</ChSection>
					)}

					{!cartState.loading && cart && (
						<View>
							<ChErrors style={{ marginBottom: Platform.OS === 'ios' ? 35 : 10 }}>
								{!cart?.valid_address && cart?.status !== 2 && (
									<OText
										color={theme.colors.error}
										size={12}
									>
										{t('INVALID_CART_ADDRESS', 'Selected address is invalid, please select a closer address.')}
									</OText>
								)}

								{(!paymethodSelected && cart?.balance > 0) && cart?.status !== 2 && cart?.valid && (
									<OText
										color={theme.colors.error}
										size={12}
									>
										{t('WARNING_NOT_PAYMENT_SELECTED', 'Please, select a payment method to place order.')}
									</OText>
								)}

								{!cart?.valid_products && cart?.status !== 2 && (
									<OText
										color={theme.colors.error}
										size={12}
									>
										{t('WARNING_INVALID_PRODUCTS_CHECKOUT', 'To continue with your checkout, please remove from your cart the products that are not available.')}
									</OText>
								)}
								{cart?.valid_preorder !== undefined && !cart?.valid_preorder && (
									<OText
										color={theme.colors.error}
										size={12}
									>
										{t('INVALID_CART_MOMENT', 'Selected schedule time is invalid, please select a schedule into the business schedule interval.')}
									</OText>
								)}
								{options.type === 1 &&
									validationFields?.fields?.checkout?.driver_tip?.enabled &&
									validationFields?.fields?.checkout?.driver_tip?.required &&
									(Number(cart?.driver_tip) <= 0) && (
										<OText
											color={theme.colors.error}
											size={12}
										>
											{t('WARNING_INVALID_DRIVER_TIP', 'Driver Tip is required.')}
										</OText>
									)}

								{validateCommentsCartField && (
									<OText
										color={theme.colors.error}
										size={12}
									>
										{t('WARNING_INVALID_CART_COMMENTS', 'Cart comments is required.')}
									</OText>
								)}
							</ChErrors>
						</View>
					)}
					<OModal
						open={openChangeStore}
						entireModal
						customClose
						onClose={() => setOpenChangeStore(false)}
					>
						<CartStoresListing
							cartuuid={cart?.uuid}
							onClose={() => setOpenChangeStore(false)}
						/>
					</OModal>
					<OModal
						open={isOpen}
						onClose={() => setIsOpen(false)}
					>
						<View style={styles.detailWrapper}>
							<UserDetails
								isUserDetailsEdit
								cartStatus={cart?.status}
								businessId={cart?.business_id}
								useValidationFields
								useDefualtSessionManager
								useSessionUser
								isCheckout
								isEdit
								phoneUpdate={phoneUpdate}
								togglePhoneUpdate={togglePhoneUpdate}
								requiredFields={requiredFields}
								hideUpdateButton
								handlePlaceOrderAsGuest={handlePlaceOrderAsGuest}
								onClose={() => {
									setIsOpen(false)
									if (paymethodClicked) {
										setPaymethodClicked({
											...paymethodClicked,
											confirmed: true
										})
									} else {
										handlePlaceOrder(null, true)
									}
								}}
								setIsOpen={setIsOpen}
							/>
						</View>
					</OModal>
					<OModal
						open={openModal.signup}
						onClose={() => setOpenModal({ ...openModal, signup: false, isGuest: false })}
					>
						<ScrollView style={{ paddingHorizontal: 20, width: '100%' }}>
							<SignupForm
								handleSuccessSignup={handleSuccessSignup}
								isGuest
								signupButtonText={t('SIGNUP', 'Signup')}
								useSignupByEmail
								useChekoutFileds
							/>
						</ScrollView>
					</OModal>
					<OModal
						open={openModal.login}
						onClose={() => setOpenModal({ ...openModal, login: false })}
					>
						<ScrollView style={{ paddingHorizontal: 20, width: '100%' }}>
							<LoginForm
								handleSuccessLogin={handleSuccessLogin}
								isGuest
								loginButtonText={t('LOGIN', 'Login')}
								loginButtonBackground={theme.colors.primary}
							/>
						</ScrollView>
					</OModal>
				</ChContainer>
			</Container>
			{!cartState.loading && cart && cart?.status !== 2 && (
				<FloatingButton
					handleClick={
						isDisabledButtonPlace
							? () => vibrateApp()
							: methodsPay.includes(paymethodSelected?.gateway)
								? () => setPlaceByMethodPay(true)
								: () => handlePlaceOrder(null)}
					isSecondaryBtn={isDisabledButtonPlace}
					disabled={isDisabledButtonPlace}
					btnText={subtotalWithTaxes >= cart?.minimum
						? (
							placing
								? t('PLACING', 'Placing')
								: loading
									? t('LOADING', 'Loading')
									: t('PLACE_ORDER', 'Place Order')
						)
						: (`${t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} ${parsePrice(cart?.minimum)}`)
					}
					btnRightValueShow
					btnRightValue={parsePrice(cart?.balance)}
					iosBottom={30}
				/>
			)}
			{webviewPaymethod?.gateway === 'paypal' && showGateway.open && (
				<PaymentOptionsWebView
					onNavigationRedirect={onNavigationRedirect}
					uri={`${ordering.root}/html/paypal_react_native`}
					user={user}
					token={token}
					cart={cart}
					currency={currency}
					webviewPaymethod={webviewPaymethod}
					setShowGateway={setShowGateway}
				/>
			)}
			{webviewPaymethod?.gateway === 'square' && showGateway.open && (
				<PaymentOptionsWebView
					onNavigationRedirect={onNavigationRedirect}
					uri={`https://test-square-f50f7.web.app`}
					user={user}
					token={token}
					cart={cart}
					currency={currency}
					webviewPaymethod={webviewPaymethod}
					setShowGateway={setShowGateway}
					locationId={'L1NGAY5M6KJRX'}
				/>
			)}
			{cart?.paymethod_data?.gateway === 'credomatic' && cart?.paymethod_data?.status === 2 && showGateway.open && (
				<PaymentOptionsWebView
					title={t('CREDOMATIC_PAYMENT', 'Credomatic payment')}
					onNavigationRedirect={onNavigationRedirect}
					uri={credomaticUrl}
					user={user}
					cart={cart}
					additionalParams={{
						type: 'auth',
						key_id: credomaticKeyId,
						hash: cart?.paymethod_data?.result?.hash,
						time: cart?.paymethod_data?.result?.time,
						amount: cart?.total,
						orderid: cart?.uuid,
						ccnumber: cardList?.cards?.[0]?.number,
						ccexp: cardList?.cards?.[0]?.expiryString,
						cvv: cardList?.cards?.[0]?.cvc,
						redirect: credomaticUrl
					}}
					webviewPaymethod={webviewPaymethod}
					setShowGateway={setShowGateway}
				/>
			)}
		</>
	)
}

export const Checkout = (props: any) => {
	const {
		errors,
		clearErrors,
		cartUuid,
		stripePaymentOptions,
		onNavigationRedirect,
	} = props

	const [, { showToast }] = useToast();
	const [, t] = useLanguage();
	const [{ token }] = useSession();
	const [ordering] = useApi();
	const [, { confirmCart }] = useOrder();
	const { confirmPayment, loading: confirmPaymentLoading } = useConfirmPayment();

	const [cartState, setCartState] = useState<any>({ loading: true, error: [], cart: null });
	const [orderState] = useOrder()

	const getOrder = async (cartId: any) => {
		try {
			let result: any = {}
			const cartsWithProducts = orderState?.carts && (Object.values(orderState?.carts)?.filter(cart => cart?.products && cart?.products?.length) || null)
			const cart = cartsWithProducts?.find((cart: any) => cart.uuid === cartId)
			if (cart) {
				result = { ...cart }
			} else {
				setCartState({ ...cartState, loading: true })
				const url = `${ordering.root}/carts/${cartId}`
				const response = await fetch(url, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					}
				})
				const content = await response.json();
				result = content.result
			}

			let publicKey = null
			try {
				const { content } = await ordering.setAccessToken(token).paymentCards().getCredentials();
				if (!content.error) {
					publicKey = content.result.publishable;
				}
			} catch (error) {
				publicKey = null
			}

			if (result.status === 1 && result.order?.uuid) {
				onNavigationRedirect('OrderDetails', { orderId: result.order.uuid })
				setCartState({ ...cartState, loading: false })
			} else if (result.status === 2 && result.paymethod_data?.gateway === 'stripe_redirect') {
				try {
					const confirmCartRes = await confirmCart(cartUuid)
					if (confirmCartRes.error) {
						showToast(ToastType.Error, confirmCartRes.error.message)
					}
					if (confirmCartRes.result.order?.uuid) {
						onNavigationRedirect('OrderDetails', { orderId: confirmCartRes.result.order.uuid, isFromCheckout: true })
					}
					setCartState({
						...cartState,
						loading: false,
						cart: result
					})
				} catch (err: any) {
					showToast(ToastType.Error, err?.toString() || err.message)
				}
			} else if (result.status === 2 && stripePaymentOptions.includes(result.paymethod_data?.gateway)) {
				const clientSecret = result.paymethod_data?.result?.client_secret
				const paymentMethodId = result.paymethod_data?.data?.source_id;

				initStripe({ publishableKey: publicKey });

				try {
					const { paymentIntent, error } = await confirmPayment(clientSecret, {
						type: 'Card',
						paymentMethodId
					});

					try {
						const confirmCartRes = await confirmCart(cartUuid)
						if (confirmCartRes.error) {
							showToast(ToastType.Error, confirmCartRes.error.message)
							setCartState({
								...cartState,
								loading: false,
								cart: result
							})
							return
						}
						if (confirmCartRes.result.order?.uuid) {
							onNavigationRedirect('OrderDetails', { orderId: confirmCartRes.result.order.uuid, isFromCheckout: true })
							setCartState({ ...cartState, loading: false })
						} else {
							showToast(ToastType.Error, t('FAILED_PAYMENT', 'The payment has failed'));
							const cart = Array.isArray(result) ? null : result
							setCartState({
								...cartState,
								loading: false,
								cart,
								error: cart ? null : result
							})
							return
						}
					} catch (error: any) {
						showToast(ToastType.Error, error?.toString() || error.message)
					}
				} catch (error) {
					showToast(ToastType.Error, t('FAILED_PAYMENT', 'The payment has failed'));
					const cart = Array.isArray(result) ? null : result
					setCartState({
						...cartState,
						loading: false,
						cart,
						error: cart ? null : result
					})
				}
			} else {
				const cart = Array.isArray(result) ? null : result
				setCartState({
					...cartState,
					loading: false,
					cart,
					error: cart ? null : result
				})
			}
		} catch (e: any) {
			setCartState({
				...cartState,
				loading: false,
				error: [e.toString()]
			})
		}
	}

	useEffect(() => {
		if (errors) {
			const errorText = manageErrorsToShow(errors)
			showToast(ToastType.Error, errorText)
			clearErrors && clearErrors()
		}
	}, [errors])

	useEffect(() => {
		if (token && cartUuid) {
			getOrder(cartUuid)
		}
	}, [token, cartUuid])

	const checkoutProps = {
		...props,
		UIComponent: CheckoutUI,
		cartState,
		uuid: cartUuid
	}

	return (
		<>
			<CheckoutController {...checkoutProps} />
		</>
	)
}
