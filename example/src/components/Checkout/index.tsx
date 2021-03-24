import React, { useState, useEffect } from 'react';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, StyleSheet } from 'react-native';
import {
  Checkout as CheckoutController,
  useOrder,
  useSession,
  useApi,
  useLanguage,
  useUtils,
  useValidationFields,
  useConfig
} from 'ordering-components/native';

import { OText, OButton, OIcon } from '../shared';
import { IMAGES } from '../../config/constants';
import { colors } from '../../theme';

import { AddressDetails } from '../AddressDetails';
import { PaymentOptions } from '../PaymentOptions';
import { DriverTips } from '../DriverTips';
// import { Cart } from '../Cart';
import { OrderSummary } from '../OrderSummary';
import { NotFoundSource } from '../NotFoundSource';
import { UserDetails } from '../UserDetails';
import { OrderTypeSelector } from '../OrderTypeSelector'

import {
  ChContainer,
  ChSection,
  ChHeader,
  ChTotal,
  ChTotalWrap,
  ChAddress,
  ChMoment,
  CHMomentWrapper,
  ChPaymethods,
  ChDriverTips,
  ChCart,
  ChPlaceOrderBtn,
  ChErrors,
  ChBusinessDetails,
  ChUserDetails
} from './styles';

const DriverTipsOptions = [0, 10, 15, 20, 25];
const mapConfigs = {
  mapZoom: 16,
  mapSize: {
    width: 640,
    height: 190
  }
};

const CheckoutUI = (props: any) => {
  const {
    navigation,
    cart,
    // errors,
    placing,
    cartState,
    businessDetails,
    paymethodSelected,
    handlePaymethodChange,
    handleOrderRedirect,
    handlerClickPlaceOrder,
  } = props

  const [, t] = useLanguage();
  const [{ user }] = useSession();
  const [{ configs }] = useConfig();
  const [{ parsePrice, parseDate }] = useUtils();
  const [{ options, carts }] = useOrder();
  const [validationFields] = useValidationFields();

  const [errorCash, setErrorCash] = useState(false);
  const [userErrors, setUserErrors] = useState([]);
  const [isUserDetailsEdit, setIsUserDetailsEdit] = useState(false);

  const configTypes = configs?.order_types_allowed?.value.split('|').map((value: any) => Number(value)) || []

  const handlePlaceOrder = () => {
    if (!userErrors.length) {
      handlerClickPlaceOrder && handlerClickPlaceOrder()
      return
    }
    console.log('error', userErrors);
    setIsUserDetailsEdit(true)
  }

  return (
    <ChContainer>
      <ChSection style={style.paddSection}>
        <OButton
          imgLeftSrc={IMAGES.arrow_left}
          imgRightSrc={null}
          style={style.btnBackArrow}
          onClick={() => navigation.goBack()}
        />
        <ChHeader>
          <OText size={24}>{t('CHECKOUT', 'Checkout')}</OText>
          <OrderTypeSelector configTypes={configTypes} />
        </ChHeader>
      </ChSection>

      <ChSection>
        <ChTotal>
          {
            (businessDetails?.loading || cartState.loading) &&
            !businessDetails?.error &&
          (
            <View>
              <View>
                <OText>
                  Loading...
                </OText>
              </View>
            </View>
          )}
          {
            !cartState.loading &&
            businessDetails?.business &&
            Object.values(businessDetails?.business).length > 0 &&
          (
            <>
              <ChTotalWrap>
                <OIcon
                  url={businessDetails?.business?.logo}
                  width={80}
                  height={80}
                  borderRadius={80}
                />
                <OText size={24} mLeft={10}>
                  {businessDetails?.business?.name}
                </OText>
              </ChTotalWrap>
              <OText size={24}>
                {cart?.total >= 1 && parsePrice(cart?.total)}
              </OText>
            </>
          )}
        </ChTotal>
      </ChSection>
      <ChSection style={style.paddSection}>
        <ChAddress>
          {(businessDetails?.loading || cartState.loading) ? (
            <OText size={18}>
              Loading...
            </OText>
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
      <ChSection style={style.paddSectionH}>
        <ChMoment>
          <CHMomentWrapper
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
                  outputFormat: configs?.format_time?.value === '12' ? 'MM/DD hh:mma' : 'MM/DD HH:mm'
                })
              : t('ASAP_ABBREVIATION', 'ASAP')}
            </OText>
          </CHMomentWrapper>
        </ChMoment>
      </ChSection>

      <ChSection style={style.paddSection}>
        <ChUserDetails>
          {cartState.loading ? (
            <View>
              <View>
                <OText>
                  Loading...
                </OText>
              </View>
            </View>
          ) : (
            <UserDetails
              isUserDetailsEdit={isUserDetailsEdit}
              cartStatus={cart?.status}
              businessId={cart?.business_id}
              useValidationFields
              useDefualtSessionManager
              useSessionUser
              isCheckout
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
            <View>
              <View>
                <OText>
                  Loading...
                </OText>
              </View>
            </View>
          )}
          {
            !cartState.loading &&
            businessDetails?.business &&
            Object.values(businessDetails?.business).length > 0 &&
          (
            <View>
              <OText size={20}>
                {t('BUSINESS_DETAILS', 'Business Details')}
              </OText>
              <View>
                <OText size={16}>
                  <OText size={18} weight='bold'>
                    {t('NAME', 'Name')}:{' '}
                  </OText>
                  {businessDetails?.business?.name}
                </OText>
                <OText size={16}>
                  <OText size={18} weight='bold'>
                    {t('EMAIL', 'Email')}:{' '}
                  </OText>
                  {businessDetails?.business?.email}
                </OText>
                <OText size={16}>
                  <OText size={18} weight='bold'>
                    {t('CELLPHONE', 'Cellphone')}:{' '}
                  </OText>
                  {businessDetails?.business?.cellphone}
                </OText>
                <OText size={16}>
                  <OText size={18} weight='bold'>
                    {t('ADDRESS', 'Address')}:{' '}
                  </OText>
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

      {!cartState.loading && cart && (
        <ChSection style={style.paddSection}>
          <ChPaymethods>
            <OText size={20}>
              {t('PAYMENT_METHOD', 'Payment Method')}
            </OText>
            <PaymentOptions
              cart={cart}
              isDisabled={cart?.status === 2}
              businessId={businessDetails?.business?.id}
              isLoading={businessDetails.loading}
              paymethods={businessDetails?.business?.paymethods}
              onPaymentChange={handlePaymethodChange}
              errorCash={errorCash}
              setErrorCash={setErrorCash}
              handleOrderRedirect={handleOrderRedirect}
              isPaymethodNull={paymethodSelected}
            />
          </ChPaymethods>
        </ChSection>
      )}

      {!cartState.loading &&
        cart &&
        options.type === 1 &&
        cart?.status !== 2 &&
        validationFields?.fields?.checkout?.driver_tip?.enabled &&
      (
        <ChSection style={style.paddSectionH}>
          <ChDriverTips>
            <OText size={20}>
              {t('DRIVER_TIPS', 'Driver Tips')}
            </OText>
            <DriverTips
              businessId={cart?.business_id}
              driverTipsOptions={DriverTipsOptions}
              useOrderContext
            />
          </ChDriverTips>
        </ChSection>
      )}

      {!cartState.loading && cart && (
        <ChSection style={style.paddSection}>
          <ChCart>
            <OText size={20}>
              {t('ORDER_SUMMARY', 'Order Summary')}
            </OText>
            <OrderSummary
              cart={cart}
              isCartPending={cart?.status === 2}
              />
          </ChCart>
        </ChSection>
      )}

      {!cartState.loading && cart && cart?.status !== 2 && (
        <ChSection style={style.paddSectionH}>
          <ChPlaceOrderBtn>
            <OButton
              onClick={() => handlePlaceOrder()}
              bgColor={cart?.subtotal < cart?.minimum ? colors.secundary : colors.primary}
              borderColor={colors.primary}
              textStyle={{color: 'white', fontSize: 20}}
              imgRightSrc={null}
              // isLoading={formState.loading}
              isDisabled={!cart?.valid || !paymethodSelected || placing || errorCash || cart?.subtotal < cart?.minimum}
              text={cart?.subtotal >= cart?.minimum ? (
                placing ? t('PLACING', 'Placing') : t('PLACE_ORDER', 'Place Order')
              ) : (
                `${t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} ${parsePrice(cart?.minimum)}`
              )}
            />
          </ChPlaceOrderBtn>
        </ChSection>
      )}

      {!cartState.loading && cart && (
        <ChSection style={style.paddSection}>
          <ChErrors>
            {!cart?.valid_address && cart?.status !== 2 && (
              <OText
                style={{ textAlign: 'center' }}
                color={colors.error}
                size={14}
              >
                {t('INVALID_CART_ADDRESS', 'Selected address is invalid, please select a closer address.')}
              </OText>
            )}

            {!paymethodSelected && cart?.status !== 2 && (
              <OText
                style={{ textAlign: 'center' }}
                color={colors.error}
                size={14}
              >
                {t('WARNING_NOT_PAYMENT_SELECTED', 'Please, select a payment method to place order.')}
              </OText>
            )}

            {!cart?.valid_products && cart?.status !== 2 && (
              <OText
                style={{ textAlign: 'center' }}
                color={colors.error}
                size={14}
              >
                {t('WARNING_INVALID_PRODUCTS', 'Some products are invalid, please check them.')}
              </OText>
            )}
          </ChErrors>
        </ChSection>
      )}
    </ChContainer>
  )
}

const style = StyleSheet.create({
  btnBackArrow: {
    borderWidth: 0,
    backgroundColor: '#FFF',
    borderColor: '#FFF',
    display: 'flex',
    justifyContent: 'flex-start',
    paddingLeft: 0,
    width: 20
  },
  paddSection: {
    padding: 20
  },
  paddSectionH: {
    paddingHorizontal: 20
  }
})

export const Checkout = (props: any) => {
  const {
    errors,
    clearErrors,
    query,
    cartUuid,
    handleOrderRedirect,
    handleCheckoutRedirect,
    // handleSearchRedirect,
    // handleCheckoutListRedirect
  } = props

  const [orderState, { confirmCart }] = useOrder()
  const [{ token }] = useSession()
  const [ordering] = useApi()
  const [, t] = useLanguage()

  const [cartState, setCartState] = useState<any>({ loading: true, error: [], cart: null })

  // const [openUpselling, setOpenUpselling] = useState(false)
  // const [canOpenUpselling, setCanOpenUpselling] = useState(false)
  const [currentCart, setCurrentCart] = useState({ business_id: null, products: null })
  // const [alertState, setAlertState] = useState({ open: false, content: [] })

  // const cartsWithProducts = orderState?.carts && Object.values(orderState?.carts).filter(cart => cart.products.length) || null

  // const closeAlert = () => {
  //   setAlertState({
  //     open: false,
  //     content: []
  //   })
  //   clearErrors && clearErrors()
  // }

  // const handleUpsellingPage = () => {
  //   setOpenUpselling(false)
  //   setCurrentCart(null)
  //   setCanOpenUpselling(false)
  //   handleCheckoutRedirect(currentCart.uuid)
  // }

  useEffect(() => {
    if (!orderState.loading && currentCart?.business_id) {
      const cartMatched: any = Object.values(orderState.carts).find(
        (cart: any) => cart.business_id === currentCart?.business_id
      ) || {}
      setCurrentCart(cartMatched)
    }
  }, [orderState.loading])

  // useEffect(() => {
  //   if (currentCart?.products) {
  //     setOpenUpselling(true)
  //   }
  // }, [currentCart])

  // useEffect(() => {
  //   if (errors?.length) {
  //     setAlertState({
  //       open: true,
  //       content: errors
  //     })
  //   }
  // }, [errors])

  const getOrder = async (cartId: any) => {
    try {
      setCartState({ ...cartState, loading: true })
      const url = `${ordering.root}/carts/${cartId}`
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` }
      })
      const { result } = await response.json()

      if (result.status === 1 && result.order?.uuid) {
        handleOrderRedirect(result.order.uuid)
        setCartState({ ...cartState, loading: false })
      } else if (result.status === 2 && result.paymethod_data?.gateway === 'stripe_redirect' && query.get('payment_intent')) {
        try {
          const confirmCartRes = await confirmCart(cartUuid)
          if (confirmCartRes.error) {
            // setAlertState({
            //   open: true,
            //   content: [confirmCartRes.error.message]
            // })
            console.log('error');
          }
          if (confirmCartRes.result.order?.uuid) {
            handleOrderRedirect(confirmCartRes.result.order.uuid)
          }
          setCartState({
            ...cartState,
            loading: false,
            cart: result
          })
        } catch (error) {
          // setAlertState({
          //   open: true,
          //   content: [error.message]
          // })
          console.log('error');
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
    } catch (e) {
      setCartState({
        ...cartState,
        loading: false,
        error: [e.toString()]
      })
    }
  }

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
    <CheckoutController {...checkoutProps} />
  )
}
