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
import { View, StyleSheet, Platform } from 'react-native'
import { useTheme } from 'styled-components/native';
import { Container } from '../../layouts/Container';
import NavBar from '../NavBar';
import { OText, OIcon, OModal } from '../shared';
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
    totalCartsPrice,
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
    onNavigationRedirectReplace
  } = props

  const theme = useTheme();
  const styles = StyleSheet.create({
    pagePadding: {
      paddingLeft: 40,
      paddingRight: 40
    },
    wrapperNavbar: { paddingHorizontal: 40 }
  })

  const [, { showToast }] = useToast();
  const [, t] = useLanguage()
  const [{ configs }] = useConfig();
  const [{ parsePrice, parseDate }] = useUtils();
  const [{ options, carts, loading }, { confirmCart }] = useOrder();
  const [validationFields] = useValidationFields();
  const [{ user }] = useSession()

  const configTypes = configs?.order_types_allowed?.value.split('|').map((value: any) => Number(value)) || []
  const isPreOrder = configs?.preorder_status_enabled?.value === '1'
  const isMultiDriverTips = configs?.checkout_multi_business_enabled?.value === '1'
  const walletCarts = (Object.values(carts)?.filter((cart: any) => cart?.products && cart?.products?.length && cart?.status !== 2 && cart?.valid_schedule && cart?.valid_products && cart?.valid_address && cart?.valid_maximum && cart?.valid_minimum && cart?.wallets) || null) || []
  const isDisablePlaceOrderButton = cartGroup?.loading || (!(paymethodSelected?.paymethod_id || paymethodSelected?.wallet_id) && cartGroup?.result?.balance > 0) ||
    (paymethodSelected?.paymethod?.gateway === 'stripe' && !paymethodSelected?.paymethod_data) ||
    walletCarts.length > 0

  const driverTipsOptions = typeof configs?.driver_tip_options?.value === 'string'
    ? JSON.parse(configs?.driver_tip_options?.value) || []
    : configs?.driver_tip_options?.value || []

  const creditPointPlan = loyaltyPlansState?.result?.find((loyal: any) => loyal.type === 'credit_point')
  const businessIds = openCarts.map((cart: any) => cart.business_id)
  const loyalBusinessIds = creditPointPlan?.businesses?.filter((b: any) => b.accumulates).map((item: any) => item.business_id)
  const creditPointPlanOnBusiness = businessIds.every((bid: any) => loyalBusinessIds.includes(bid)) && creditPointPlan

  const loyaltyRewardValue = creditPointPlanOnBusiness?.accumulation_rate
    ? Math.round(openCarts.reduce((sum: any, cart: any) => sum + cart?.subtotal, 0) / creditPointPlanOnBusiness?.accumulation_rate) : 0

  const [isUserDetailsEdit, setIsUserDetailsEdit] = useState(false);
  const [phoneUpdate, setPhoneUpdate] = useState(false);
  const [userErrors, setUserErrors] = useState<any>([]);
  const handleMomentClick = () => {
    if (isPreOrder) {
      navigation.navigate('MomentOption')
    }
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
      ((validationFields?.fields?.checkout?.cellphone?.enabled &&
        validationFields?.fields?.checkout?.cellphone?.required) ||
        configs?.verification_phone_required?.value === '1')
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

  const handlePlaceOrder = () => {
    if (!userErrors.length) {
      handleGroupPlaceOrder && handleGroupPlaceOrder()
      return
    }
    let stringError = ''
    Object.values(userErrors).map((item: any, i: number) => {
      stringError += (i + 1) === userErrors.length ? `- ${item?.message || item}` : `- ${item?.message || item}\n`
    })
    showToast(ToastType.Error, stringError)
    setIsUserDetailsEdit(true)
  }

  useEffect(() => {
    if (validationFields && validationFields?.fields?.checkout) {
      checkValidationFields()
    }
  }, [validationFields, user])

  useEffect(() => {
    if (openCarts.length === 1) {
      onNavigationRedirectReplace('CheckoutPage', {
        cartUuid: openCarts[0]?.uuid,
        fromMulti: true
      })
      return
    }
  }, [openCarts])

  useEffect(() => {
    if (walletState.error) {
      showToast(ToastType.Error, t(walletState.error, walletState.error?.[0]?.replace(/_/g, ' ')))
    }
  }, [walletState.error])

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
            <ChUserDetails>
              <UserDetails
                isUserDetailsEdit={isUserDetailsEdit}
                useValidationFields
                useDefualtSessionManager
                useSessionUser
                isCheckout
                phoneUpdate={phoneUpdate}
                togglePhoneUpdate={togglePhoneUpdate}
              />
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

          <ChSection>
            <MultiCartsPaymethodsAndWallets
              openCarts={openCarts}
              paymethodSelected={paymethodSelected}
              walletsPaymethod={cartGroup?.result?.wallets}
              handleSelectPaymethod={handleSelectPaymethod}
              handleSelectWallet={handleSelectWallet}
              handlePaymethodDataChange={handlePaymethodDataChange}
              cartUuid={cartUuid}
            />
            <View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginTop: 13, marginHorizontal: -40 }} />
          </ChSection>

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
                  carts={openCarts}
                  businessIds={openCarts.map((cart: any) => cart.business_id)}
                  driverTipsOptions={driverTipsOptions}
                  isFixedPrice={parseInt(configs?.driver_tip_type?.value, 10) === 1}
                  isDriverTipUseCustom={!!parseInt(configs?.driver_tip_use_custom?.value, 10)}
                  driverTip={parseInt(configs?.driver_tip_type?.value, 10) === 1
                    ? openCarts[0]?.driver_tip
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
              {openCarts.map((cart: any) => (
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
              {!cartGroup?.loading && openCarts.length === 0 && (
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
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <OText size={16} lineHeight={24} color={theme.colors.textNormal} weight={'500'}>
                      {t('TOTAL_FOR_ALL_CARTS', 'Total for all Carts')}
                    </OText>
                    <OText size={16} lineHeight={24} color={theme.colors.textNormal} weight={'500'}>{parsePrice(totalCartsPrice)}</OText>
                  </View>
                  {!!loyaltyRewardValue && isFinite(loyaltyRewardValue) && (
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
        </ChContainer>
      </Container>

      <FloatingButton
        handleClick={() => handlePlaceOrder()}
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
        cartUuid: cartUuid
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
