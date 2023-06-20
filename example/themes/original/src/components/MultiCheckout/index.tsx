import React, { useState, useEffect } from 'react'
import {
  useLanguage,
  useConfig,
  useUtils,
  useOrder,
  useValidationFields,
  useSession,
  useToast,
  ToastType,
  MultiCheckout as MultiCheckoutController
} from 'ordering-components/native'
import { View, StyleSheet, Platform, ScrollView } from 'react-native'
import { useTheme } from 'styled-components/native';
import { Container } from '../../layouts/Container';
import NavBar from '../NavBar';
import { OText, OIcon, OModal, OButton } from '../shared';
import { getTypesText } from '../../utils';
import { UserDetails } from '../UserDetails'
import { AddressDetails } from '../AddressDetails'
import { MultiCart as MultiCartController } from '../MultiCart'
import { MultiCartsPaymethodsAndWallets } from '../MultiCartsPaymethodsAndWallets'
import { Cart } from '../Cart'
import { FloatingButton } from '../FloatingButton'
import { DriverTips } from '../DriverTips'
import { CouponControl } from '../CouponControl';
import { DriverTipsContainer } from '../Cart/styles'
import { OSTable, OSCoupon } from '../OrderSummary/styles';
import { SignupForm } from '../SignupForm'
import { LoginForm } from '../LoginForm'

import {
  ChContainer,
  ChSection,
  ChHeader,
  CHMomentWrapper,
  ChUserDetails,
  ChAddress,
  ChCarts,
  CartsHeader,
  CCNotCarts,
  ChCartsTotal
} from './styles'

const mapConfigs = {
  mapZoom: 16,
  mapSize: {
    width: 640,
    height: 190
  }
}

const MultiCheckoutUI = (props: any) => {
  const {
    navigation,
    placing,
    openCarts,
    handleGroupPlaceOrder,
    paymethodSelected,
    handleSelectPaymethod,
    handleSelectWallet,
    handlePaymethodDataChange,
    cartUuid,
    loyaltyPlansState,
    totalCartsFee,
    cartGroup,
    walletState,
    onNavigationRedirectReplace,
    merchantId,
    cartsInvalid
  } = props

  const theme = useTheme();
  const styles = StyleSheet.create({
    pagePadding: {
      paddingLeft: 40,
      paddingRight: 40
    },
    wrapperNavbar: { paddingHorizontal: 40 },
    detailWrapper: {
			paddingHorizontal: 40,
			width: '100%'
		},
  })

  const [, { showToast }] = useToast();
  const [, t] = useLanguage()
  const [{ configs }] = useConfig();
  const [{ parsePrice, parseDate }] = useUtils();
  const [{ options, carts, loading }, { confirmCart }] = useOrder();
  const [validationFields] = useValidationFields();
  const [{ user }, { login }] = useSession()

  const configTypes = configs?.order_types_allowed?.value.split('|').map((value: any) => Number(value)) || []
  const isPreOrder = configs?.preorder_status_enabled?.value === '1'
  const isMultiDriverTips = configs?.checkout_multi_business_enabled?.value === '1'
  const walletCarts = (Object.values(carts)?.filter((cart: any) => cart?.products && cart?.products?.length && cart?.status !== 2 && cart?.valid_schedule && cart?.valid_products && cart?.valid_address && cart?.valid_maximum && cart?.valid_minimum && cart?.wallets) || null) || []
  const isChewLayout = theme?.header?.components?.layout?.type?.toLowerCase() === 'chew'
  const cartsToShow = openCarts?.length > 0 ? openCarts : cartsInvalid
  const walletName: any = {
    cash: {
      name: t('PAY_WITH_CASH_WALLET', 'Pay with Cash Wallet'),
    },
    credit_point: {
      name: t('PAY_WITH_CREDITS_POINTS_WALLET', 'Pay with Credit Points Wallet'),
    }
  }

  const totalCartsPrice = cartGroup?.result?.balance

  const driverTipsOptions = typeof configs?.driver_tip_options?.value === 'string'
    ? JSON.parse(configs?.driver_tip_options?.value) || []
    : configs?.driver_tip_options?.value || []

  const creditPointGeneralPlan = loyaltyPlansState?.result?.find((loyal: any) => loyal.type === 'credit_point')
  const loyalBusinessAvailable = creditPointGeneralPlan?.businesses?.filter((b: any) => b.accumulates) ?? []

  const accumulationRateBusiness = (businessId: number) => {
    const value = loyalBusinessAvailable?.find((loyal: any) => loyal.business_id === businessId)?.accumulation_rate ?? 0
    return value || (creditPointGeneralPlan?.accumulation_rate ?? 0)
  }

  const getIncludedTaxes = (cart: any) => {
    if (cart?.taxes === null || !cart?.taxes) {
      return cart.business.tax_type === 1 ? cart?.tax : 0
    } else {
      return cart?.taxes.reduce((taxIncluded: number, tax: any) => {
        return taxIncluded + (tax.type === 1 ? tax.summary?.tax : 0)
      }, 0)
    }
  }

  const clearAmount = (value: any) => parseFloat((Math.trunc(value * 100) / 100).toFixed(configs.format_number_decimal_length?.value ?? 2))

  const loyaltyRewardValue = openCarts
    ?.reduce((sum: any, cart: any) => sum + clearAmount((cart?.subtotal + getIncludedTaxes(cart)) * accumulationRateBusiness(cart?.business_id)), 0)
    ?.toFixed(configs.format_number_decimal_length?.value ?? 2)

  const [isUserDetailsEdit, setIsUserDetailsEdit] = useState(false);
  const [phoneUpdate, setPhoneUpdate] = useState(false);
  const [userErrors, setUserErrors] = useState<any>([]);
  const [placeByMethodPay, setPlaceByMethodPay] = useState(false)
	const [allowedGuest, setAllowedGuest] = useState(false)
	const [isOpen, setIsOpen] = useState(false)
	const [requiredFields, setRequiredFields] = useState<any>([])
	const stripePaymethods: any = ['stripe', 'stripe_direct', 'stripe_connect', 'stripe_redirect']
	const [openModal, setOpenModal] = useState({ login: false, signup: false, isGuest: false })
  const [methodPaySupported, setMethodPaySupported] = useState({ enabled: false, message: null, loading: true })
  const methodsPay = ['global_google_pay', 'global_apple_pay']
  const isDisablePlaceOrderButton = cartGroup?.loading || placing || (!(paymethodSelected?.paymethod_id || paymethodSelected?.wallet_id) && cartGroup?.result?.balance > 0) ||
    (paymethodSelected?.paymethod?.gateway === 'stripe' && !paymethodSelected?.paymethod_data) ||
    walletCarts.length > 0
    || (methodsPay.includes(paymethodSelected?.gateway) && (!methodPaySupported.enabled || methodPaySupported.loading)) || openCarts?.length === 0

  const handleMomentClick = () => {
    if (isPreOrder) {
      navigation.navigate('MomentOption')
    }
  }

  const checkValidationFields = () => {
    setUserErrors([])
    const errors = []
    const notFields = ['coupon', 'driver_tip', 'mobile_phone', 'address', 'zipcode', 'address_notes']
		const _requiredFields: any = []

    Object.values(validationFields?.fields?.checkout).map((field: any) => {
      if (field?.required && !notFields.includes(field.code)) {
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

  const handlePlaceOrder = (confirmPayment?: any) => {
    if (stripePaymethods.includes(paymethodSelected?.gateway) && user?.guest_id) {
			setOpenModal({ ...openModal, signup: true, isGuest: true })
			return
		}

    if (!userErrors.length && (!requiredFields?.length || allowedGuest)) {
      handleGroupPlaceOrder && handleGroupPlaceOrder(confirmPayment)
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
		handleGroupPlaceOrder && handleGroupPlaceOrder()
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

  useEffect(() => {
    if (validationFields && validationFields?.fields?.checkout) {
      checkValidationFields()
    }
  }, [validationFields, user])

  useEffect(() => {
    if (cartsToShow?.length === 1) {
      onNavigationRedirectReplace('CheckoutPage', {
        cartUuid: cartsToShow[0]?.uuid,
        fromMulti: true
      })
      return
    }
  }, [cartsToShow])

  useEffect(() => {
    if (walletState.error) {
      showToast(ToastType.Error, t(walletState.error, walletState.error?.[0]?.replace(/_/g, ' ')))
    }
  }, [walletState.error])

  useEffect(() => {
    if (!cartUuid) {
      onNavigationRedirectReplace('BottomTab', { screen: 'Cart' })
    }
  }, [cartUuid])

  useEffect(() => {
    if (paymethodSelected?.gateway === 'global_google_pay') {
      setMethodPaySupported({
        enabled: true,
        loading: false,
        message: null
      })
    }
  }, [paymethodSelected])

  return (
    <>
      <Container noPadding>
        <View style={styles.wrapperNavbar}>
          <NavBar
            title={t('CHECKOUT', 'Checkout')}
            titleAlign={'center'}
            onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
            showCall={false}
            paddingTop={Platform.OS === 'ios' ? 0 : 4}
            btnStyle={{ paddingLeft: 0 }}
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
            <ChUserDetails>
              {(user?.guest_id && !allowedGuest) ? (
                <View>
                  <OText size={14} numberOfLines={1} ellipsizeMode='tail' color={theme.colors.textNormal}>
                    {t('CUSTOMER_DETAILS', 'Customer details')}
                  </OText>
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

          <ChSection>
            <ChAddress>
              <AddressDetails
                navigation={navigation}
                isMultiCheckout
                openCarts={openCarts}
                apiKey={configs?.google_maps_api_key?.value}
                mapConfigs={mapConfigs}
              />
            </ChAddress>
            <View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginTop: 13, marginHorizontal: -40 }} />
          </ChSection>
          {openCarts?.length > 0 && (
            <ChSection>
              <MultiCartsPaymethodsAndWallets
                openCarts={openCarts}
                paymethodSelected={paymethodSelected}
                walletsPaymethod={cartGroup?.result?.wallets}
                handleSelectPaymethod={handleSelectPaymethod}
                handleSelectWallet={handleSelectWallet}
                handlePaymethodDataChange={handlePaymethodDataChange}
                cartUuid={cartUuid}
                merchantId={merchantId}
                setMethodPaySupported={setMethodPaySupported}
                methodPaySupported={methodPaySupported}
                placeByMethodPay={placeByMethodPay}
                setPlaceByMethodPay={setPlaceByMethodPay}
                cartTotal={totalCartsPrice}
                handlePlaceOrder={handlePlaceOrder}
              />
              <View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginTop: 13, marginHorizontal: -40 }} />
            </ChSection>
          )}
          {
            isMultiDriverTips &&
            options?.type === 1 &&
            validationFields?.fields?.checkout?.driver_tip?.enabled &&
            openCarts.every((cart: any) => cart.business_id && cart.status !== 2) &&
            driverTipsOptions && driverTipsOptions?.length > 0 &&
            (
              <ChSection>
                <DriverTipsContainer>
                  <OText size={14} lineHeight={20} color={theme.colors.textNormal}>
                    {t('DRIVER_TIPS', 'Driver Tips')}
                  </OText>
                  <DriverTips
                    isMulti
                    isLoading={loading}
                    carts={openCarts}
                    businessIds={openCarts.map((cart: any) => cart.business_id)}
                    driverTipsOptions={driverTipsOptions}
                    isFixedPrice={parseInt(configs?.driver_tip_type?.value, 10) === 1}
                    isDriverTipUseCustom={!!parseInt(configs?.driver_tip_use_custom?.value, 10)}
                    driverTip={parseInt(configs?.driver_tip_type?.value, 10) === 1
                      ? openCarts?.reduce((sum: any, cart: any) => sum + cart?.driver_tip, 0)
                      : openCarts[0]?.driver_tip_rate}
                    useOrderContext
                  />
                </DriverTipsContainer>
                <View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginTop: 13, marginHorizontal: -40 }} />
              </ChSection>
            )}

          {
            validationFields?.fields?.checkout?.coupon?.enabled &&
            openCarts.every((cart: any) => cart.business_id && cart.status !== 2) &&
            configs?.multi_business_checkout_coupon_input_style?.value === 'group' &&
            openCarts?.length > 0 &&
            (
              <ChSection>
                <OText size={14} lineHeight={20} color={theme.colors.textNormal}>
                  {t('DISCOUNT_COUPON', 'Discount coupon')}
                </OText>
                <OSTable>
                  <OSCoupon>
                    <CouponControl
                      isMulti
                      carts={openCarts}
                      businessIds={openCarts.map((cart: any) => cart.business_id)}
                      price={openCarts.reduce((total: any, cart: any) => total + cart.total, 0)}
                    />
                  </OSCoupon>
                </OSTable>
                <View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginTop: 13, marginHorizontal: -40 }} />
              </ChSection>
            )}

          <ChSection>
            <ChCarts>
              <CartsHeader>
                <OText size={16} lineHeight={24} color={theme.colors.textNormal} style={{ fontWeight: '500' }}>
                  {t('MOBILE_FRONT_YOUR_ORDER', 'Your order')}
                </OText>
              </CartsHeader>
              {cartsToShow.map((cart: any) => (
                <React.Fragment key={cart.uuid}>
                  <Cart
                    cart={cart}
                    cartuuid={cart.uuid}
                    isMultiCheckout
                    hideCouponInput={configs?.multi_business_checkout_coupon_input_style?.value === 'group'}
                    hideDeliveryFee={configs?.multi_business_checkout_show_combined_delivery_fee?.value === '1'}
                    hideDriverTip={configs?.multi_business_checkout_show_combined_driver_tip?.value === '1'}
                    onNavigationRedirect={(route: string, params: any) => props.navigation.navigate(route, params)}
                    businessConfigs={cart?.business?.configs}
                  />
                  {openCarts.length > 1 && (
                    <View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginTop: 13, marginHorizontal: -40 }} />
                  )}
                </React.Fragment>
              ))}
              {!cartGroup?.loading && openCarts.length === 0 && cartsInvalid?.length === 0 && (
                <CCNotCarts>
                  <OText size={24} style={{ textAlign: 'center' }}>
                    {t('CARTS_NOT_FOUND', 'You don\'t have carts available')}
                  </OText>
                </CCNotCarts>
              )}
              {walletCarts.length > 0 && (
                <OText size={14} color={theme.colors.danger5} style={{ marginVertical: 20 }}>
                  {t('WARNING_PARTIAL_WALLET_CARTS', 'Important: One or more carts can`t be completed due a partial payment with cash/points wallet and requires to be paid individually')}
                </OText>
              )}
              {openCarts.length > 1 && (
                <ChCartsTotal>
                  {!!totalCartsFee && configs?.multi_business_checkout_show_combined_delivery_fee?.value === '1' && (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <OText size={14} lineHeight={24} color={theme.colors.textNormal} weight={'400'}>
                        {t('TOTAL_DELIVERY_FEE', 'Total delivery fee')}
                      </OText>
                      <OText size={14} lineHeight={24} color={theme.colors.textNormal} weight={'400'}>
                        {parsePrice(totalCartsFee)}
                      </OText>
                    </View>
                  )}
                  {openCarts.reduce((sum: any, cart: any) => sum + cart?.driver_tip, 0) > 0 &&
                    configs?.multi_business_checkout_show_combined_driver_tip?.value === '1' && (
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <OText size={14} lineHeight={24} color={theme.colors.textNormal} weight={'400'}>
                          {t('DRIVER_TIP', 'Driver tip')}
                        </OText>
                        <OText size={14} lineHeight={24} color={theme.colors.textNormal} weight={'400'}>
                          {parsePrice(openCarts.reduce((sum: any, cart: any) => sum + cart?.driver_tip, 0))}
                        </OText>
                      </View>
                    )}
                  {!cartGroup?.loading && cartGroup?.result?.payment_events?.length > 0 && cartGroup?.result?.payment_events?.map((event: any) => (
                    <View key={event.id} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <OText size={14} lineHeight={24} color={theme.colors.textNormal} weight={'400'}>
                        {walletName[cartGroup?.result?.wallets?.find((wallet: any) => wallet.wallet_id === event.wallet_id)?.type]?.name}
                      </OText>
                      <OText size={14} lineHeight={24} color={theme.colors.textNormal} weight={'400'}>
                        -{parsePrice(event.amount, { isTruncable: true })}
                      </OText>
                    </View>
                  ))}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <OText size={16} lineHeight={24} color={theme.colors.textNormal} weight={'500'}>
                      {t('TOTAL_FOR_ALL_CARTS', 'Total for all Carts')}
                    </OText>
                    <OText size={16} lineHeight={24} color={theme.colors.textNormal} weight={'500'}>{parsePrice(totalCartsPrice)}</OText>
                  </View>
                  {!!loyaltyRewardValue && (
                    <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'flex-end' }}>
                      <OText size={12} color={theme.colors.textNormal}>
                        {t('REWARD_LOYALTY_POINT', 'Reward :amount: on loyalty points').replace(':amount:', loyaltyRewardValue)}
                      </OText>
                    </View>
                  )}

                  <OText size={12} color={theme.colors.mediumGray} mRight={70} style={{ marginTop: 10 }}>
                    {t('MULTI_CHECKOUT_DESCRIPTION', 'You will receive a receipt for each business. The payment is not combined between multiple stores. Each payment is processed by the store')}
                  </OText>
                </ChCartsTotal>
              )}
            </ChCarts>
          </ChSection>
          {cartsToShow?.some((cart: any) => !cart?.valid_products && cart?.status !== 2) && (
            <OText
              color={theme.colors.error}
              size={12}
            >
              {t('WARNING_INVALID_PRODUCTS_CHECKOUT', 'To continue with your checkout, please remove from your cart the products that are not available.')}
            </OText>
          )}
        </ChContainer>
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
        <OModal
						open={isOpen}
						onClose={() => setIsOpen(false)}
					>
						<View style={styles.detailWrapper}>
							<UserDetails
								isUserDetailsEdit
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
									handlePlaceOrder()
								}}
								setIsOpen={setIsOpen}
							/>
						</View>
					</OModal>
      </Container>

      <FloatingButton
        handleClick={methodsPay.includes(paymethodSelected?.gateway)
          ? () => setPlaceByMethodPay(true)
          : () => handlePlaceOrder()}
        isSecondaryBtn={isDisablePlaceOrderButton}
        disabled={isDisablePlaceOrderButton}
        btnText={placing ? t('PLACING', 'Placing') : t('PLACE_ORDER', 'Place Order')}
        btnRightValueShow
        btnRightValue={parsePrice(totalCartsPrice)}
        iosBottom={30}
      />
    </>
  )
}

export const MultiCheckout = (props: any) => {
  const [loadMultiCarts, setLoadMultiCarts] = useState(!!props.route?.params?.checkCarts)
  const [cartUuid, setCartUuid] = useState('')

  const multiCheckoutProps = {
    ...props,
    cartUuid: props.route?.params?.cartUuid ?? cartUuid,
    UIComponent: MultiCheckoutUI
  }

  const multiCartProps = {
    ...props,
    handleOnRedirectMultiCheckout: (cartUuid: string) => {
      setCartUuid(cartUuid)
      setLoadMultiCarts(false)
    },
    handleOnRedirectCheckout: (cartUuid: string) => {
      props.navigation.navigate('CheckoutNavigator', {
        screen: 'CheckoutPage',
        cartUuid
      })
    }
  }

  return (
    loadMultiCarts ? (
      <MultiCartController {...multiCartProps} />
    ) : (
      <MultiCheckoutController {...multiCheckoutProps} />
    )
  )
}
