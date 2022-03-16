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
  WalletPaymentOptionContainer
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
		currency
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
		}
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

  const isWalletEnabled = configs?.wallet_enabled?.value === '1' && (configs?.wallet_cash_enabled?.value === '1' || configs?.wallet_credit_point_enabled?.value === '1')

  const isWalletEnabled = configs?.wallet_enabled?.value === '1' && (configs?.wallet_cash_enabled?.value === '1' || configs?.wallet_credit_point_enabled?.value === '1')

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

	const handlePlaceOrder = () => {
		if (!userErrors.length) {
			handlerClickPlaceOrder && handlerClickPlaceOrder()
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

		Object.values(validationFields?.fields?.checkout).map((field: any) => {
			if (field?.required && !notFields.includes(field.code)) {
				if (!user[field?.code]) {
					errors.push(t(`VALIDATION_ERROR_${field.code.toUpperCase()}_REQUIRED`, `The field ${field?.name} is required`))
				}
			}
		})

		if (
			!user?.cellphone &&
			validationFields?.fields?.checkout?.cellphone?.enabled &&
			validationFields?.fields?.checkout?.cellphone?.required
		) {
			errors.push(t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Phone number is required'))
		}

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
			navigation?.canGoBack() && navigation.goBack();
		}
	}, [cart?.products])

	useEffect(() => {
		onFailPaypal()
	}, [showGateway.closedByUser])

	return (
		<>
			<Container noPadding>
				<NavBar
					isVertical
					onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
					title={t('CHECKOUT', 'Checkout')}
					style={styles.pagePadding}
					titleStyle={{ marginLeft: 0, marginRight: 0 }}
				/>
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
								onPress={() => navigation.navigate('MomentOption')}
								disabled={loading}
							>
								<OText size={12} numberOfLines={1} ellipsizeMode='tail' color={theme.colors.textSecondary}>
									{options?.moment
										? parseDate(options?.moment, {
											outputFormat: configs?.format_time?.value === '12' ? 'MM/DD hh:mma' : 'MM/DD HH:mm'
										})
										: t('ASAP_ABBREVIATION', 'ASAP')}
								</OText>
								<OIcon
									src={theme.images.general.arrow_down}
									width={10}
									style={{ marginStart: 8 }}
								/>
							</CHMomentWrapper>
						</ChHeader>
						<View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginTop: 18, marginHorizontal: -40 }} />
					</ChSection>

					<ChSection>
						<ChBusinessDetails>
							{
								(businessDetails?.loading || cartState.loading) &&
								!businessDetails?.error &&
								(
									<Placeholder Animation={Fade}>
										<PlaceholderLine height={20} width={70} />
										<PlaceholderLine height={15} width={60} />
										<PlaceholderLine height={15} width={60} />
										<PlaceholderLine height={15} width={80} style={{ marginBottom: 20 }} />
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
									<PlaceholderLine height={15} width={60} />
									<PlaceholderLine height={15} width={60} />
									<PlaceholderLine height={15} width={80} style={{ marginBottom: 20 }} />
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

					{!cartState.loading && deliveryOptionSelected !== undefined && options?.type === 1 && (
						<DeliveryOptionsContainer>
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
                <View style={{ marginLeft: 15, width: '85%' }}>
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
								/>
							</ChPaymethods>
						</ChSection>
					)}

          {!cartState.loading && cart && isWalletEnabled && (
            <WalletPaymentOptionContainer>
              <PaymentOptionWallet
                cart={cart}
                businessId={cart?.business_id}
              />
            </WalletPaymentOptionContainer>
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
										<OText size={16} lineHeight={24} color={theme.colors.textNormal}>
											{t('ORDER_SUMMARY', 'Order Summary')}
										</OText>
										{props.isFranchiseApp && (
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
										/>
									</>
								)}
							</ChCart>
						</ChSection>
					)}

					{!cartState.loading && cart && (
            <View>
							<ChErrors style={{ marginBottom: 0 }}>
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
										{t('WARNING_INVALID_PRODUCTS', 'Some products are invalid, please check them.')}
									</OText>
								)}
							</ChErrors>
						</View>
					)}
					<OModal
						open={openChangeStore && props.isFranchiseApp}
						entireModal
						customClose
						onClose={() => setOpenChangeStore(false)}
					>
						<CartStoresListing
							cartuuid={cart?.uuid}
							onClose={() => setOpenChangeStore(false)}
						/>
					</OModal>
				</ChContainer>
			</Container>
			{!cartState.loading && cart && cart?.status !== 2 && (
				<FloatingButton
					handleClick={() => handlePlaceOrder()}
					isSecondaryBtn={loading || !cart?.valid || (!paymethodSelected && cart?.balance > 0) || placing || errorCash || cart?.subtotal < cart?.minimum}
					disabled={loading || !cart?.valid || (!paymethodSelected && cart?.balance > 0) || placing || errorCash || cart?.subtotal < cart?.minimum}
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
					btnRightValue={parsePrice(cart?.total)}
					iosBottom={20}
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
		[props.isFranchiseApp ? 'uuid' : 'businessId']: props.isFranchiseApp ? cartUuid : cartState.cart?.business_id
	}

	return (
		<>
			<CheckoutController {...checkoutProps} />
		</>
	)
}
