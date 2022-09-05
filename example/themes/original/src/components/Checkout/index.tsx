import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, I18nManager } from 'react-native';
import { initStripe, useConfirmPayment } from '@stripe/stripe-react-native';
import Picker from 'react-native-country-picker-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
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
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { OText, OIcon, OModal } from '../shared';

import { AddressDetails } from '../AddressDetails';
import { PaymentOptions } from '../PaymentOptions';
import { DriverTips } from '../DriverTips';
import { NotFoundSource } from '../NotFoundSource';
import { UserDetails } from '../UserDetails';
import { PaymentOptionWallet } from '../PaymentOptionWallet';
import { PlaceSpot } from '../PlaceSpot'

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
		businessDetails,
		paymethodSelected,
		handlePaymethodChange,
		handlerClickPlaceOrder,
		onNavigationRedirect,
		deliveryOptionSelected,
		instructionsOptions,
		handleChangeDeliveryOption,
		currency,
		merchantId
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
			paddingLeft: 40,
			paddingRight: 40
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
		wrapperNavbar: Platform.OS === 'ios'
			? { paddingVertical: 0, paddingHorizontal: 40 }
			: { paddingVertical: 20, paddingHorizontal: 40 }
	})

	const [, { showToast }] = useToast();
	const [, t] = useLanguage();
	const [{ user, token }] = useSession();
	const [ordering] = useApi()
	const [{ configs }] = useConfig();
	const [{ parsePrice, parseDate }] = useUtils();
	const [{ options, carts, loading }, { confirmCart }] = useOrder();
	const [validationFields] = useValidationFields();

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

	const placeSpotTypes = [3, 4, 5]
	const placeSpotsEnabled = placeSpotTypes.includes(options?.type)
	const businessConfigs = businessDetails?.business?.configs ?? []
	const isWalletCashEnabled = businessConfigs.find((config: any) => config.key === 'wallet_cash_enabled')?.value === '1'
	const isWalletCreditPointsEnabled = businessConfigs.find((config: any) => config.key === 'wallet_credit_point_enabled')?.value === '1'
	const isWalletEnabled = configs?.cash_wallet?.value && configs?.wallet_enabled?.value === '1' && (isWalletCashEnabled || isWalletCreditPointsEnabled)
	const isBusinessChangeEnabled = configs?.cart_change_business_validation?.value === '1'

	const isPreOrder = configs?.preorder_status_enabled?.value === '1'
	const isDisabledButtonPlace = loading || !cart?.valid || (!paymethodSelected && cart?.balance > 0) || placing || errorCash ||
		cart?.subtotal < cart?.minimum || (placeSpotTypes.includes(options?.type) && !cart?.place) ||
		(options.type === 1 &&
			validationFields?.fields?.checkout?.driver_tip?.enabled &&
			validationFields?.fields?.checkout?.driver_tip?.required &&
			(Number(cart?.driver_tip) <= 0))

	const driverTipsOptions = typeof configs?.driver_tip_options?.value === 'string'
		? JSON.parse(configs?.driver_tip_options?.value) || []
		: configs?.driver_tip_options?.value || []

	const configTypes = configs?.order_types_allowed?.value.split('|').map((value: any) => Number(value)) || []

	const cartsWithProducts = carts && Object.values(carts).filter((cart: any) => cart.products.length) || null

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

	const handlePlaceOrder = (confirmPayment: any) => {
		if (!userErrors.length && !requiredFields?.length) {
			handlerClickPlaceOrder && handlerClickPlaceOrder(null, null, confirmPayment)
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
		const notFields = ['coupon', 'driver_tip', 'mobile_phone', 'address', 'zipcode', 'address_notes']
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

	// useEffect(() => {
	//   handlePaymethodChange(null)
	// }, [cart?.total])

	useEffect(() => {
		if (cart?.products?.length === 0) {
			onNavigationRedirect('Business', { store: cart?.business?.slug, header: null, logo: null })
		}
	}, [cart?.products])

	useEffect(() => {
		onFailPaypal()
	}, [showGateway.closedByUser])

	return (
		<>
			<Container noPadding>
				<View style={styles.wrapperNavbar}>
					<NavBar
						title={t('CHECKOUT', 'Checkout')}
						titleAlign={'center'}
						onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
						showCall={false}
						btnStyle={{ paddingLeft: 0 }}
						style={{ marginTop: Platform.OS === 'ios' ? 0 : 30 }}
						titleWrapStyle={{ paddingHorizontal: 0 }}
						titleStyle={{ marginRight: 0, marginLeft: 0 }}
					/>
				</View>
				<ChContainer style={styles.pagePadding}>
					<ChSection style={{ paddingTop: 0 }}>
						<ChHeader>
							{/* <OrderTypeSelector configTypes={configTypes} /> */}
							<CHMomentWrapper onPress={() => navigation.navigate('OrderTypes', { configTypes: configTypes })}>
								<OText size={12} numberOfLines={1} ellipsizeMode={'tail'} color={theme.colors.textSecondary}>{t(getTypesText(options?.type || 1), 'Delivery')}</OText>
								<OIcon
									src={theme.images.general.arrow_down}
									width={10}
									style={{ marginStart: 8 }}
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

					<ChSection>
						<ChBusinessDetails>
							{
								(businessDetails?.loading || cartState.loading || !businessDetails?.business || Object.values(businessDetails?.business).length === 0) &&
								!businessDetails?.error &&
								(
									<Placeholder Animation={Fade}>
										<PlaceholderLine height={20} width={70} />
										<PlaceholderLine height={10} width={60} />
										<PlaceholderLine height={10} width={60} />
										<PlaceholderLine height={10} width={80} style={{ marginBottom: 20 }} />
									</Placeholder>
								)}
							{
								!cartState.loading &&
								businessDetails?.business &&
								Object.values(businessDetails?.business).length > 0 &&
								(
									<>
										<OText size={16} lineHeight={24} weight={'500'} mBottom={10}>
											{t('BUSINESS_DETAILS', 'Business Details')}
										</OText>
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
											<OText size={12} lineHeight={18} weight={'400'}>
												{businessDetails?.business?.address}
											</OText>
										</View>
									</>
								)}
							{businessDetails?.error && businessDetails?.error?.length > 0 && (
								<View>
									<OText size={16} lineHeight={24} weight={'500'}>
										{t('BUSINESS_DETAILS', 'Business Details')}
									</OText>
									<NotFoundSource
										content={businessDetails?.error[0]?.message || businessDetails?.error[0]}
									/>
								</View>
							)}
						</ChBusinessDetails>
						<View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginHorizontal: -40 }} />
					</ChSection>

					<ChSection>
						<ChUserDetails>
							{cartState.loading ? (
								<Placeholder Animation={Fade}>
									<PlaceholderLine height={20} width={70} />
									<PlaceholderLine height={10} width={60} />
									<PlaceholderLine height={10} width={60} />
									<PlaceholderLine height={10} width={80} style={{ marginBottom: 20 }} />
								</Placeholder>
							) : (
								<UserDetails
									isUserDetailsEdit={isUserDetailsEdit}
									cartStatus={cart?.status}
									businessId={cart?.business_id}
									useValidationFields
									useDefualtSessionManager
									useSessionUser
									isCheckout
									phoneUpdate={phoneUpdate}
									togglePhoneUpdate={togglePhoneUpdate}
								/>
							)}
						</ChUserDetails>
						<View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginHorizontal: -40 }} />
					</ChSection>

					{options?.type === 1 && (
						<DeliveryOptionsContainer>
							{cartState.loading || deliveryOptionSelected === undefined ? (
								<View style={{ height: 110 }}>
									<Placeholder Animation={Fade}>
										<PlaceholderLine height={20} width={70} />
										<PlaceholderLine height={40} width={100} />
									</Placeholder>
								</View>
							) : (
								<>
									<OText size={16}>{t('DELIVERY_OPTIONS', 'Delivery options')}</OText>
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
															{deliveryOptions.find((option: any) => option.value === deliveryOptionSelected).label}
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
														onPress={() => changeDeliveryOption(item.value)}
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
								</>
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

					{/* <ChSection>
        <ChTotal>
          {
            (
              <>
                <OIcon
                  url={businessLogo || businessDetails?.business?.logo}
                  width={80}
                  height={80}
                  borderRadius={80}
                />
                <View style={{ marginLeft: 10, width: '85%' }}>
                  <OText size={22} numberOfLines={2} ellipsizeMode='tail' style={{ width: '85%' }}>
                    {businessName || businessDetails?.business?.name}
                  </OText>
                  <OText size={22}>
                    {cart?.total >= 1 && parsePrice(cart?.total) || cartTotal >= 1 && parsePrice(cartTotal)}
                  </OText>
                </View>
              </>
            )}
        </ChTotal>
      </ChSection> */}
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
									location={businessDetails?.business?.location}
									businessLogo={businessDetails?.business?.logo}
									isCartPending={cart?.status === 2}
									uuid={cartUuid}
									apiKey={configs?.google_maps_api_key?.value}
									mapConfigs={mapConfigs}
								/>
							)}
						</ChAddress>
						<View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginTop: 13, marginHorizontal: -40 }} />
					</ChSection>

					{!cartState.loading &&
						cart &&
						cart?.valid &&
						options.type === 1 &&
						cart?.status !== 2 &&
						validationFields?.fields?.checkout?.driver_tip?.enabled &&
						driverTipsOptions && driverTipsOptions?.length > 0 &&
						(
							<ChSection>
								<ChDriverTips>
									<OText size={16} lineHeight={24} color={theme.colors.textNormal}>
										{t('DRIVER_TIPS', 'Driver Tips')}
									</OText>
									<DriverTips
										uuid={cartUuid}
										businessId={cart?.business_id}
										driverTipsOptions={driverTipsOptions}
										isFixedPrice={parseInt(configs?.driver_tip_type?.value, 10) === 1 || !!parseInt(configs?.driver_tip_use_custom?.value, 10)}
										isDriverTipUseCustom={!!parseInt(configs?.driver_tip_use_custom?.value, 10)}
										driverTip={parseInt(configs?.driver_tip_type?.value, 10) === 1 || !!parseInt(configs?.driver_tip_use_custom?.value, 10)
											? cart?.driver_tip
											: cart?.driver_tip_rate}
										useOrderContext
									/>
								</ChDriverTips>
							</ChSection>
						)}

					{!cartState.loading && cart && cart?.status !== 2 && cart?.valid && (
						<ChSection>
							<ChPaymethods>
								<OText size={16} lineHeight={24} color={theme.colors.textNormal}>
									{t('PAYMENT_METHOD', 'Payment Method')}
								</OText>
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
									businessId={businessDetails?.business?.id}
									isLoading={businessDetails.loading}
									paymethods={businessDetails?.business?.paymethods}
									onPaymentChange={handlePaymethodChange}
									errorCash={errorCash}
									setErrorCash={setErrorCash}
									onNavigationRedirect={onNavigationRedirect}
									paySelected={paymethodSelected}
									handlePaymentMethodClickCustom={handlePaymentMethodClick}
									handlePlaceOrder={handlePlaceOrder}
									merchantId={merchantId}
								/>
							</ChPaymethods>
						</ChSection>
					)}

					{!cartState.loading && cart && isWalletEnabled && businessDetails?.business?.configs && (
						<WalletPaymentOptionContainer>
							<PaymentOptionWallet
								cart={cart}
								businessId={cart?.business_id}
								businessConfigs={businessDetails?.business?.configs}
							/>
						</WalletPaymentOptionContainer>
					)}


					{!cartState.loading && placeSpotsEnabled && (
						<>
							<View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginTop: 30, marginHorizontal: -40 }} />
							<PlaceSpot
								isCheckout
								isInputMode
								cart={cart}
								spotNumberDefault={cartState?.cart?.spot_number ?? cart?.spot_number}
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
											<OText
												size={16}
												lineHeight={24}
												color={theme.colors.textNormal}
												style={{ fontWeight: '500' }}
											>
												{t('MOBILE_FRONT_YOUR_ORDER', 'Your order')}
											</OText>
											<TouchableOpacity
												onPress={() => onNavigationRedirect('Business', { store: cart?.business?.slug })}
											>
												<OText
													size={10}
													lineHeight={15}
													color={theme.colors.primary}
													style={{ textDecorationLine: 'underline' }}
												>
													{t('ADD_PRODUCTS', 'Add products')}
												</OText>
											</TouchableOpacity>
										</CartHeader>
										{isBusinessChangeEnabled && (
											<TouchableOpacity
												onPress={() => setOpenChangeStore(true)}
												style={{ alignSelf: 'flex-start' }}
											>
												<OText
													size={12}
													lineHeight={18}
													color={theme.colors.textSecondary}
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
										/>
									</>
								)}
							</ChCart>
						</ChSection>
					)}

					{!cartState.loading && cart && (
						<View>
							<ChErrors style={{ marginBottom: 10 }}>
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
								onClose={() => setIsOpen(false)}
							/>
						</View>
					</OModal>
				</ChContainer>
			</Container>
			{!cartState.loading && cart && cart?.status !== 2 && (
				<FloatingButton
					handleClick={() => handlePlaceOrder(null)}
					isSecondaryBtn={isDisabledButtonPlace}
					disabled={isDisabledButtonPlace}
					btnText={cart?.subtotal >= cart?.minimum
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
			setCartState({ ...cartState, loading: true })
			const url = `${ordering.root}/carts/${cartId}`
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			})
			const { result } = await response.json();

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
