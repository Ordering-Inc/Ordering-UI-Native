import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Animated } from 'react-native';
import { initStripe, useConfirmPayment } from '@stripe/stripe-react-native';

import {
  Checkout as CheckoutController,
  useOrder,
  useSession,
  useApi,
  useLanguage,
  useUtils,
  useValidationFields,
  useConfig,
  ToastType,
  useToast
} from 'ordering-components/native';

import { OText, OButton, OIcon, OModal } from '../shared';
import { MomentOption } from '../MomentOption'

import { AddressDetails } from '../AddressDetails';
import { PaymentOptions } from '../PaymentOptions';
import { DriverTips } from '../DriverTips';
import { OrderSummary } from '../OrderSummary';
import { NotFoundSource } from '../NotFoundSource';
import { UserDetails } from '../UserDetails';
import { OrderTypeSelector } from '../OrderTypeSelector'
import { SafeAreaContainer } from '../../layouts/SafeAreaContainer'
import NavBar from '../NavBar'

import {
  ChContainer,
  ChSection,
  ChTotal,
  ChAddress,
  ChMoment,
  CHMomentWrapper,
  ChPaymethods,
  ChDriverTips,
  ChCart,
  ChErrors,
  ChBusinessDetails,
  ChUserDetails,
  PayActionCont
} from './styles';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';

import { FloatingButton } from '../FloatingButton';
import { useTheme } from 'styled-components/native';

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
    businessDetails,
    paymethodSelected,
    handlePaymethodChange,
    handlerClickPlaceOrder,
    onNavigationRedirect,
    businessLogo,
    businessName,
    cartTotal
  } = props

  const theme = useTheme();

  const style = StyleSheet.create({
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
    paddSectionH: {
      paddingHorizontal: 20
    }
  })

  const [, { showToast }]= useToast();
  const [, t] = useLanguage();
  const [{ user }] = useSession();
  const [{ configs }] = useConfig();
  const [{ parsePrice, parseDate }] = useUtils();
  const [{ options, carts, loading }] = useOrder();
  const [validationFields] = useValidationFields();

  const [errorCash, setErrorCash] = useState(false);
  const [userErrors, setUserErrors] = useState<any>([]);
  const [isUserDetailsEdit, setIsUserDetailsEdit] = useState(false);
  const [phoneUpdate, setPhoneUpdate] = useState(false);
	const [isOpenPaymethods, setOpenPaymethods] = useState(false);

  const driverTipsOptions = typeof configs?.driver_tip_options?.value === 'string'
    ? JSON.parse(configs?.driver_tip_options?.value) || []
    : configs?.driver_tip_options?.value || []

  const configTypes = configs?.order_types_allowed?.value.split('|').map((value: any) => Number(value)) || []

  const cartsWithProducts = carts && Object.values(carts).filter((cart: any) => cart.products.length) || null

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

  const getPayIcon = (method: string) => {
		switch (method) {
			case 'cash':
				return theme.images.general.cash
			case 'card_delivery':
				return theme.images.general.carddelivery
			case 'paypal':
				return theme.images.general.paypal
			case 'stripe':
				return theme.images.general.stripe
			case 'stripe_direct':
				return theme.images.general.stripecc
			case 'stripe_connect':
				return theme.images.general.stripes
			case 'stripe_redirect':
				return theme.images.general.stripesb
			default:
				return theme.images.general.creditCard
		}
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

  return (
    <>
      <SafeAreaContainer>
        <ScrollView>
          <ChContainer>
            <ChSection>
              <OButton
                imgLeftSrc={theme.images.general.arrow_left}
                imgRightSrc={null}
                style={style.btnBackArrow}
                onClick={() => navigation?.canGoBack() && navigation.goBack()}
              />
              <ChTotal>
                <OText size={26} weight={500} numberOfLines={2} ellipsizeMode='tail' style={{ textAlign: 'left' }}>
                  {businessName || businessDetails?.business?.name}
                </OText>
                <OText size={16} color={theme.colors.gray} numberOfLines={1} ellipsizeMode='tail' style={{ marginVertical: 5, textAlign: 'left' }}>
                  {businessDetails?.business?.address}
                </OText>
                <OText size={16} color={theme.colors.gray} mBottom={15} style={{ textAlign: 'left' }}>
                  {businessDetails?.business?.cellphone}
                </OText>
              </ChTotal>
            </ChSection>
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
            <ChSection style={{ zIndex: 100 }}>            
              <OrderTypeSelector configTypes={configTypes} />
            </ChSection>

            <ChSection>
              <ChAddress>
                {(businessDetails?.loading || cartState.loading) ? (
                  <Placeholder Animation={Fade}>
                    <PlaceholderLine height={160} style={{ borderRadius: 0, marginBottom: 10 }} />
                    <PlaceholderLine height={20} width={40} style={{ marginBottom: 10 }} />
                    <PlaceholderLine height={20} width={20} />
                  </Placeholder>
                ) : (
                  <AddressDetails
                    navigation={navigation}
                    location={businessDetails?.business?.location}
                    businessLogo={businessDetails?.business?.logo}
                    isCartPending={cart?.status === 2}
                    businessId={cart?.business_id}
                    apiKey={configs?.google_maps_api_key?.value}
                    mapConfigs={mapConfigs}
                  />
                )}
              </ChAddress>
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
            </ChSection>

            <ChSection>
              <ChMoment>
                <OText size={16} style={{ textAlign: 'left' }} mBottom={15}>
                  {t('DELIVERY_TIME', 'Delivery time')}
                </OText>
                <MomentOption nopadding />
              </ChMoment>
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
                    <View>
                      <OText size={16} weight={500} mBottom={10} style={{ textAlign: 'left' }}>
                        {t('BUSINESS_DETAILS', 'Business Details')}
                      </OText>
                      <View>
                        <OText size={16} style={{ textAlign: 'left' }}>
                          <OText size={16} weight='500'>
                            {t('NAME', 'Name')}:{' '}
                          </OText>
                          {businessDetails?.business?.name}
                        </OText>
                        <OText size={16} style={{ textAlign: 'left' }}>
                          <OText size={16} weight='500'>
                            {t('EMAIL', 'Email')}:{' '}
                          </OText>
                          {businessDetails?.business?.email}
                        </OText>
                        <OText size={16} style={{ textAlign: 'left' }}>
                          <OText size={16} weight='500'>
                            {t('CELLPHONE', 'Cellphone')}:{' '}
                          </OText>
                          {businessDetails?.business?.cellphone}
                        </OText>
                        <OText size={16} style={{ textAlign: 'left' }}>
                          <OText size={16} weight='500'>
                            {t('ADDRESS', 'Address')}:{' '}
                          </OText>
                          {businessDetails?.business?.address}
                        </OText>
                      </View>
                    </View>
                  )}
                {businessDetails?.error && businessDetails?.error?.length > 0 && (
                  <View>
                    <OText size={20} style={{ textAlign: 'left' }}>
                      {t('BUSINESS_DETAILS', 'Business Details')}
                    </OText>
                    <NotFoundSource
                      content={businessDetails?.error[0]?.message || businessDetails?.error[0]}
                    />
                  </View>
                )}
              </ChBusinessDetails>
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
                    <OText size={16} weight={500} style={{ textAlign: 'left' }}>
                      {t('DRIVER_TIPS', 'Driver Tips')}
                    </OText>
                    <DriverTips
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
									<OText style={{ fontWeight: '500', marginBottom: 4 }}>
										{t('PAYMENT_METHOD', 'Payment Method')}
									</OText>
									{!cartState.loading && cart?.status === 4 && (
										<OText
											style={{ textAlign: 'center', marginTop: 20 }}
											color={theme.colors.error}
											size={12}
										>
											{t('CART_STATUS_CANCEL_MESSAGE', 'The payment has not been successful, please try again')}
										</OText>
									)}
									<PayActionCont onPress={() => setOpenPaymethods(true)} activeOpacity={0.7}>
										<OIcon src={getPayIcon(paymethodSelected?.gateway)} color={theme.colors.textSecondary} width={16} style={{ marginEnd: 15 }} />
										<Animated.View>
											{paymethodSelected ? (
												<>
													{paymethodSelected?.data?.last4 ? (
														<OText size={12} color={theme.colors.textSecondary}>{`${paymethodSelected?.paymethod?.name}  \u2022\u2022\u2022 ${paymethodSelected.data.last4}`}</OText>
													) : (
														<OText size={12} color={theme.colors.textSecondary}>{`${paymethodSelected?.paymethod?.name}`}</OText>
													)}
												</>
											) : (
												<OText size={12} color={theme.colors.textSecondary}>{t('SELECT_PAYMENT_METHOD', 'Please select a payment method')}</OText>
											)}
										</Animated.View>
									</PayActionCont>
								</ChPaymethods>
              </ChSection>
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
                      <OText size={16} weight={500} style={{ textAlign: 'left' }}>
                        {t('ORDER_SUMMARY', 'Order Summary')}
                      </OText>
                      <OrderSummary
                        cart={cart}
                        isCartPending={cart?.status === 2}
                        isFromCheckout
                      />
                    </>
                  )}
                </ChCart>
              </ChSection>
            )}

            {!cartState.loading && cart && (
              <ChSection style={{ paddingVertical: 20, paddingHorizontal: 20 }}>
                <ChErrors>
                  {!cart?.valid_address && cart?.status !== 2 && (
                    <OText
                      style={{ textAlign: 'center' }}
                      color={theme.colors.error}
                      size={14}
                    >
                      {t('INVALID_CART_ADDRESS', 'Selected address is invalid, please select a closer address.')}
                    </OText>
                  )}

                  {!paymethodSelected && cart?.status !== 2 && cart?.valid && (
                    <OText
                      style={{ textAlign: 'center' }}
                      color={theme.colors.error}
                      size={14}
                    >
                      {t('WARNING_NOT_PAYMENT_SELECTED', 'Please, select a payment method to place order.')}
                    </OText>
                  )}

                  {!cart?.valid_products && cart?.status !== 2 && (
                    <OText
                      style={{ textAlign: 'center' }}
                      color={theme.colors.error}
                      size={14}
                    >
                      {t('WARNING_INVALID_PRODUCTS', 'Some products are invalid, please check them.')}
                    </OText>
                  )}
                </ChErrors>
              </ChSection>
            )}
          </ChContainer>
        </ScrollView>
      </SafeAreaContainer>
      {!cartState.loading && cart && cart?.status !== 2 && (
        <>
          <>
            <FloatingButton
              handleClick={() => handlePlaceOrder()}
              isSecondaryBtn={loading || !cart?.valid || !paymethodSelected || placing || errorCash || cart?.subtotal < cart?.minimum || paymethodSelected?.gateway === 'paypal'}
              disabled={loading || !cart?.valid || !paymethodSelected || placing || errorCash || cart?.subtotal < cart?.minimum || paymethodSelected?.gateway === 'paypal'}
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
            />
          </>
        </>
      )}

      <OModal
				entireModal
				customClose
				open={isOpenPaymethods}
				onClose={() => setOpenPaymethods(false)}
			>
				<View style={{ paddingHorizontal: 40, paddingVertical: 12 }}>
					<NavBar
						title={t('PAYMENTS_METHODS', 'Payment methods')}
						onActionLeft={() => setOpenPaymethods(false)}
					/>
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
						renderFooter={
							<OButton
								text={t('CONFIRM', 'Confirm')}
								bgColor={theme.colors.white}
								borderColor={theme.colors.primary}
								style={{ height: 42, borderWidth: 1, borderRadius: 3, marginTop: 100 }}
								textStyle={{color: theme.colors.primary, fontSize: 14, fontWeight: '600'}}
								onClick={() => setOpenPaymethods(false)}
							/>
						}
					/>
				</View>
			</OModal>
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
        } catch (error: any) {
          showToast(ToastType.Error, error?.toString() || error.message)
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
    businessId: cartState.cart?.business_id
  }

  return (
    <>
      <CheckoutController {...checkoutProps} />
    </>
  )
}
