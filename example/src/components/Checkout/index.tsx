import React, { useState, useEffect, useRef } from 'react';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, StyleSheet, Platform, I18nManager, ScrollView, TouchableOpacity } from 'react-native';
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
  ToastType,
  useToast
} from 'ordering-components/native';

import { OText, OButton, OIcon } from '../shared';

import { AddressDetails } from '../AddressDetails';
import { PaymentOptions } from '../PaymentOptions';
import { DriverTips } from '../DriverTips';
import { OrderSummary } from '../OrderSummary';
import { NotFoundSource } from '../NotFoundSource';
import { UserDetails } from '../UserDetails';
import { OrderTypeSelector } from '../OrderTypeSelector'

import {
  ChContainer,
  ChSection,
  ChHeader,
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
  TextDetails,
  DeliveryOptionsContainer,
  DeliveryOptionItem
} from './styles';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';

import { FloatingButton } from '../FloatingButton';
import { Container } from '../../layouts/Container';
import { useTheme } from 'styled-components/native';
import { ActivityIndicator } from 'react-native-paper';
import WebView from 'react-native-webview';
import Icon from 'react-native-vector-icons/Feather';
import { OrderCreating } from '../OrderCreating';
import { PaymentOptionsWebView } from '../PaymentOptionsWebView';

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
    cartTotal,
    currency,
    deliveryOptionSelected,
    instructionsOptions,
    handleChangeDeliveryOption,
    merchantId
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
  const [{ configs }] = useConfig();
  const [{ parsePrice, parseDate }] = useUtils();
  const [{ options, carts, loading }, { confirmCart }] = useOrder();
  const [validationFields] = useValidationFields();
  const [ordering] = useApi()
  const [errorCash, setErrorCash] = useState(false);
  const [userErrors, setUserErrors] = useState<any>([]);
  const [isUserDetailsEdit, setIsUserDetailsEdit] = useState(false);
  const [phoneUpdate, setPhoneUpdate] = useState(false);
  const [showGateway, setShowGateway] = useState<any>({ closedByUsed: false, open: false });
  const [webviewPaymethod, setWebviewPaymethod] = useState<any>(null)
  const [openOrderCreating, setOpenOrderCreating] = useState(false)
  const [cardData, setCardData] = useState(null)
  const [isDeliveryOptionModalVisible, setIsDeliveryOptionModalVisible] = useState(false)
  const driverTipsOptions = typeof configs?.driver_tip_options?.value === 'string'
    ? JSON.parse(configs?.driver_tip_options?.value) || []
    : configs?.driver_tip_options?.value || []

  const configTypes = configs?.order_types_allowed?.value.split('|').map((value: any) => Number(value)) || []
  const isPreOrderSetting = configs?.preorder_status_enabled?.value === '1'
  const cartsWithProducts = carts && Object.values(carts).filter((cart: any) => cart.products.length) || null

  const deliveryOptions = instructionsOptions?.result && instructionsOptions?.result?.filter((option: any) => option?.enabled)?.map((option: any) => {
    return {
      value: option?.id, key: option?.id, label: t(option?.name.toUpperCase().replace(/\s/g, '_'), option?.name)
    }
  })

  const handlePlaceOrder = () => {
    if (!userErrors.length) {
      setOpenOrderCreating(true)
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

  const togglePhoneUpdate = (val: boolean) => {
    setPhoneUpdate(val)
  }

  const onFailPaypal = async () => {
    if (showGateway.closedByUser === true) {
      await confirmCart(cart.uuid)
    }
  }

  const handlePaymentMethodClick = (paymethod: any) => {
    setShowGateway({ closedByUser: false, open: true })
    setWebviewPaymethod(paymethod)
  }

  const changeDeliveryOption = (option: any) => {
    handleChangeDeliveryOption(option)
    setIsDeliveryOptionModalVisible(false)
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
      setOpenOrderCreating(false)
    }
  }, [errors])

  useEffect(() => {
    onFailPaypal()
  }, [showGateway.closedByUser])

  return (
    <>
      <Container>
        <ChContainer>
          <ChSection style={{ paddingBottom: 20, zIndex: 100 }}>
            <OButton
              imgLeftSrc={theme.images.general.arrow_left}
              imgRightSrc={null}
              style={style.btnBackArrow}
              onClick={() => navigation?.canGoBack() && navigation.goBack()}
            />
            <ChHeader>
              <OText size={24}>{t('CHECKOUT', 'Checkout')}</OText>
              <OrderTypeSelector configTypes={configTypes} />
            </ChHeader>
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

          <ChSection>
            <ChTotal>
              <OIcon
                url={businessLogo || businessDetails?.business?.logo}
                width={80}
                height={80}
                borderRadius={80}
              />
              <View style={{ marginHorizontal: 15, flex: 1, alignItems: 'flex-start' }}>
                <OText size={22} numberOfLines={2} ellipsizeMode='tail' >
                  {businessName || businessDetails?.business?.name}
                </OText>
                {!cartState.loading && (
                  <OText size={22}>
                    {parsePrice(cart?.total >= 0 ? cart?.total : 0) || parsePrice(cartTotal >= 0 ? cartTotal : 0)}
                  </OText>
                )}
              </View>
            </ChTotal>
          </ChSection>
          <ChSection style={style.paddSection}>
            <ChAddress>
              {(businessDetails?.loading || cartState.loading) ? (
                <Placeholder Animation={Fade}>
                  <PlaceholderLine height={40} style={{ marginBottom: 20 }} />
                  <PlaceholderLine height={100} style={{ marginBottom: 20 }} />
                </Placeholder>
              ) : (
                <AddressDetails
                  cart={cart}
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
          <ChSection style={style.paddSectionH}>
            {(isPreOrderSetting || configs?.preorder_status_enabled?.value === undefined) && (
              <ChMoment>
                {cartState.loading ? (
                  <Placeholder Animation={Fade}>
                    <PlaceholderLine height={50} style={{ marginBottom: 0 }} />
                  </Placeholder>
                ) : (
                  <CHMomentWrapper
                    disabled={loading}
                    onPress={() => navigation.navigate('MomentOption')}
                  >
                    <MaterialCommunityIcon
                      name='clock-outline'
                      size={24}
                      style={{ marginRight: 5 }}
                    />
                    <OText size={18} numberOfLines={1} ellipsizeMode='tail'>
                      {options?.moment
                        ? parseDate(options?.moment, {
                          outputFormat: configs?.dates_moment_format?.value
                        })
                        : t('ASAP_ABBREVIATION', 'ASAP')}
                    </OText>
                  </CHMomentWrapper>
                )}
              </ChMoment>
            )}
          </ChSection>

          <ChSection style={style.paddSection}>
            <ChUserDetails>
              {cartState.loading ? (
                <Placeholder Animation={Fade}>
                  <PlaceholderLine height={25} width={70} />
                  <PlaceholderLine height={20} width={60} />
                  <PlaceholderLine height={20} width={60} />
                  <PlaceholderLine height={20} width={80} style={{ marginBottom: 20 }} />
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

          <ChSection style={style.paddSectionH}>
            <ChBusinessDetails>
              {
                (businessDetails?.loading || cartState.loading) &&
                !businessDetails?.error &&
                (
                  <Placeholder Animation={Fade}>
                    <PlaceholderLine height={25} width={70} />
                    <PlaceholderLine height={20} width={60} />
                    <PlaceholderLine height={20} width={60} />
                    <PlaceholderLine height={20} width={80} style={{ marginBottom: 20 }} />
                  </Placeholder>
                )}
              {
                !cartState.loading &&
                businessDetails?.business &&
                Object.values(businessDetails?.business).length > 0 &&
                (
                  <View style={{ alignItems: 'flex-start' }}>
                    <OText size={20}>
                      {t('BUSINESS_DETAILS', 'Business Details')}
                    </OText>
                    <View>
                      <OText size={16}>
                        <TextDetails>
                          {t('NAME', 'Name')}:{' '}
                        </TextDetails>
                        {businessDetails?.business?.name}
                      </OText>
                      <OText size={16}>
                        <TextDetails size={18} weight='bold'>
                          {t('EMAIL', 'Email')}:{' '}
                        </TextDetails>
                        {businessDetails?.business?.email}
                      </OText>
                      <OText size={16}>
                        <TextDetails size={18} weight='bold'>
                          {t('CELLPHONE', 'Cellphone')}:{' '}
                        </TextDetails>
                        {businessDetails?.business?.cellphone}
                      </OText>
                      <OText size={16}>
                        <TextDetails size={18} weight='bold'>
                          {t('ADDRESS', 'Address')}:{' '}
                        </TextDetails>
                        {businessDetails?.business?.address}
                      </OText>
                    </View>
                  </View>
                )}
              {businessDetails?.error && businessDetails?.error?.length > 0 && (
                <View>
                  <OText size={20}>
                    {t('BUSINESS_DETAILS', 'Business Details')}
                  </OText>
                  <NotFoundSource
                    content={businessDetails?.error[0]?.message || businessDetails?.error[0]}
                  />
                </View>
              )}
            </ChBusinessDetails>
          </ChSection>

          {!cartState.loading && deliveryOptionSelected !== undefined && options?.type === 1 && (
            <DeliveryOptionsContainer style={style.paddSection}>
              <OText size={20}>{t('DELIVERY_OPTIONS', 'Delivery options')}</OText>
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
                          size={16}
                        >
                          {deliveryOptions.find((option: any) => option.value === deliveryOptionSelected).label}
                        </OText>
                        <MaterialIcons name='keyboard-arrow-down' style={style.icon} />
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
            </DeliveryOptionsContainer>
          )}

          {!cartState.loading &&
            cart &&
            cart?.valid &&
            options.type === 1 &&
            cart?.status !== 2 &&
            validationFields?.fields?.checkout?.driver_tip?.enabled &&
            driverTipsOptions && driverTipsOptions?.length > 0 &&
            (
              <ChSection style={style.paddSection}>
                <ChDriverTips>
                  <OText size={20}>
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
            <ChSection style={style.paddSectionH}>
              <ChPaymethods>
                <OText size={20} style={{ alignItems: 'flex-start', textAlign: 'left' }}>
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
                  setCardData={setCardData}
                  handlePlaceOrder={handlePlaceOrder}
                  merchantId={merchantId}
                />
              </ChPaymethods>
            </ChSection>
          )}

          {!cartState.loading && cart && (
            <ChSection style={style.paddSection}>
              <ChCart>
                {cartsWithProducts && cart?.products?.length === 0 ? (
                  <NotFoundSource
                    content={t('NOT_FOUND_CARTS', 'Sorry, You don\'t seem to have any carts.')}
                    btnTitle={t('SEARCH_REDIRECT', 'Go to Businesses')}
                  />
                ) : (
                  <>
                    <OText size={20} style={{ alignItems: 'flex-start', textAlign: 'left' }}>
                      {t('ORDER_SUMMARY', 'Order Summary')}
                    </OText>
                    <OrderSummary
                      cart={cart}
                      isCartPending={cart?.status === 2}
                      isFromCheckout
                      onNavigationRedirect={onNavigationRedirect}
                    />
                  </>
                )}
              </ChCart>
            </ChSection>
          )}

          {!cartState.loading && cart && (
            <ChSection style={{ paddingTop: 0, paddingBottom: 20, paddingHorizontal: 20 }}>
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

                {options.type === 1 &&
                  validationFields?.fields?.checkout?.driver_tip?.enabled &&
                  validationFields?.fields?.checkout?.driver_tip?.required &&
                  (Number(cart?.driver_tip) <= 0) && (
                    <OText
                      style={{ textAlign: 'center' }}
                      color={theme.colors.error}
                      size={14}
                    >
                      {t('WARNING_INVALID_DRIVER_TIP', 'Driver Tip is required.')}
                    </OText>
                  )}
              </ChErrors>
            </ChSection>
          )}
        </ChContainer>
      </Container>
      {!cartState.loading && cart && cart?.status !== 2 && (
        <>
          <>
            <FloatingButton
              handleClick={() => handlePlaceOrder()}
              isSecondaryBtn={loading || !cart?.valid || !paymethodSelected || placing || errorCash || cart?.subtotal_to_calculate < cart?.minimum || paymethodSelected?.gateway === 'paypal' ||
                (options.type === 1 &&
                  validationFields?.fields?.checkout?.driver_tip?.enabled &&
                  validationFields?.fields?.checkout?.driver_tip?.required &&
                  (Number(cart?.driver_tip) <= 0))}
              disabled={loading || !cart?.valid || !paymethodSelected || placing || errorCash || cart?.subtotal_to_calculate < cart?.minimum || paymethodSelected?.gateway === 'paypal' ||
                (options.type === 1 &&
                  validationFields?.fields?.checkout?.driver_tip?.enabled &&
                  validationFields?.fields?.checkout?.driver_tip?.required &&
                  (Number(cart?.driver_tip) <= 0))}
              btnText={cart?.subtotal_to_calculate >= cart?.minimum
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
          setOpenOrderCreating={setOpenOrderCreating}
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
          setOpenOrderCreating={setOpenOrderCreating}
          locationId={'L1NGAY5M6KJRX'}
        />
      )}
      {openOrderCreating && (
        <View style={{ zIndex: 9999, height: '100%', width: '100%', position: 'absolute', backgroundColor: 'white' }}>
          <OrderCreating
            business={businessDetails?.business}
            businessLogo={businessLogo}
            cart={cartState.cart}
            cardData={cardData}
            isCheckOut
          />
        </View>
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
    navigation
  } = props

  const [, { showToast }] = useToast();
  const [, t] = useLanguage();
  const [{ token }] = useSession();
  const [ordering] = useApi();
  const [, { confirmCart }] = useOrder();
  const { confirmPayment, loading: confirmPaymentLoading } = useConfirmPayment();

  const [cartState, setCartState] = useState<any>({ loading: true, error: [], cart: null });

  const confirmMethods = ['stripe_redirect', 'paypal']

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
      } else if (result.status === 2 && confirmMethods.includes(result.paymethod_data?.gateway)) {
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
      {cartState?.error?.length > 0 ? (
        <NotFoundSource
          content={t(cartState.error)}
          btnTitle={t('GO_TO_BUSINESSLIST', 'Go to business list')}
          onClickButton={() => navigation.navigate('BusinessList')}
        />
      ) : (
        <CheckoutController {...checkoutProps} />
      )}
    </>
  )
}
